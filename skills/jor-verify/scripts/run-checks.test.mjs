import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const runner = join(dirname(fileURLToPath(import.meta.url)), 'run-checks.mjs');
const environment = {
  ...process.env,
  GIT_CONFIG_COUNT: '1',
  GIT_CONFIG_KEY_0: 'core.excludesFile',
  GIT_CONFIG_VALUE_0: '/dev/null',
};

function repository(t, ignored = true) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'jor-checks-test-')));
  t.after(() => {
    cleanupProcessGroup(root);
    rmSync(root, { recursive: true, force: true });
  });
  const initialized = spawnSync('git', ['init', '--quiet', root], { env: environment });
  assert.equal(initialized.status, 0, initialized.stderr?.toString());
  writeFileSync(join(root, '.git/info/exclude'), ignored ? '.scratch/\n' : '');
  return root;
}

function check(name, code, extra = {}) {
  return { name, command: [process.execPath, '-e', code], ...extra };
}

function invoke(root, plan, cwd = root) {
  const planPath = join(root, 'checks.json');
  writeFileSync(planPath, typeof plan === 'string' ? plan : JSON.stringify(plan));
  const result = spawnSync(process.execPath, [runner, planPath], {
    cwd,
    env: environment,
    encoding: 'utf8',
    timeout: 8000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null, result.stderr);
  return result;
}

function runs(root) {
  return readdirSync(join(root, '.scratch/verify')).map((entry) => join(root, '.scratch/verify', entry));
}

function log(root, name, run = 0) {
  return readFileSync(join(runs(root)[run], `${name}.log`), 'utf8');
}

const descendantCode = "const fs = require('node:fs'); fs.writeFileSync('descendant.pid', String(process.pid)); fs.writeFileSync('heartbeat', 'x'); setInterval(() => fs.appendFileSync('heartbeat', 'x'), 10)";
const hangingCode = `require('node:fs').writeFileSync('check.pid', String(process.pid)); require('node:child_process').spawn(process.execPath, ['-e', ${JSON.stringify(descendantCode)}], {stdio: 'inherit'}); console.log('started-long-check'); setInterval(() => {}, 1000)`;

function cleanupProcessGroup(root) {
  if (!existsSync(join(root, 'check.pid'))) return;
  try {
    process.kill(-Number(readFileSync(join(root, 'check.pid'), 'utf8')), 'SIGKILL');
  } catch (error) {
    if (error.code !== 'ESRCH') throw error;
  }
}

test('runs from the repository root and preserves both output streams', (t) => {
  const root = repository(t);
  const nested = join(root, 'nested');
  mkdirSync(nested);
  const result = invoke(root, [check('location', "process.stdout.write(process.cwd()); process.stderr.write('stderr-observed')")], nested);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(log(root, 'location').includes(root));
  assert.ok(log(root, 'location').includes('stderr-observed'));
  assert.match(result.stdout, /PASS/);
});

test('a failed assertion stays nonzero while later checks still execute', (t) => {
  const root = repository(t);
  const result = invoke(root, [
    check('broken', "console.error('original-fault'); process.exit(7)"),
    check('later', "require('node:fs').writeFileSync('later-ran', 'yes')"),
  ]);
  assert.equal(result.status, 1, result.stderr);
  assert.equal(readFileSync(join(root, 'later-ran'), 'utf8'), 'yes');
  assert.ok(log(root, 'broken').includes('original-fault'));
  assert.ok(existsSync(join(runs(root)[0], 'later.log')));
  assert.match(result.stdout, /FAIL/);
});

test('validates the entire plan before running any command', (t) => {
  const root = repository(t);
  const first = check('first', "require('node:fs').writeFileSync('must-not-run', 'bad')");
  const invalidChecks = [
    check('../escape', 'process.exit(0)'),
    check('space label', 'process.exit(0)'),
    check('x'.repeat(65), 'process.exit(0)'),
    { name: 'empty', command: [] },
    { name: 'string', command: 'node --version' },
    { name: 'invalid-arg', command: [process.execPath, 42] },
    check('timeout', 'process.exit(0)', { timeoutMs: 0 }),
    check('timeout', 'process.exit(0)', { timeoutMs: 1.5 }),
    check('unknown-field', 'process.exit(0)', { allowFailure: true }),
    check('first', 'process.exit(0)'),
  ];
  for (const invalid of invalidChecks) {
    const result = invoke(root, [first, invalid]);
    assert.equal(result.status, 2, JSON.stringify(invalid));
    assert.equal(existsSync(join(root, 'must-not-run')), false);
  }
  for (const invalidPlan of [[], {}, 'not json']) {
    assert.equal(invoke(root, invalidPlan).status, 2);
  }
});

test('missing evidence exclusion blocks execution without changing ignore files', (t) => {
  const root = repository(t, false);
  const ignorePath = join(root, '.git/info/exclude');
  for (const exclusion of ['', '.scratch/verify/.check-evidence\n']) {
    writeFileSync(ignorePath, exclusion);
    const result = invoke(root, [check('side-effect', "require('node:fs').writeFileSync('must-not-run', 'bad')")]);
    assert.equal(result.status, 2, result.stderr);
    assert.equal(existsSync(join(root, 'must-not-run')), false);
    assert.equal(readFileSync(ignorePath, 'utf8'), exclusion);
    assert.equal(existsSync(join(root, '.gitignore')), false);
  }
});

test('missing executable is blocked and never reported as success', (t) => {
  const root = repository(t);
  const result = invoke(root, [{ name: 'missing', command: [join(root, 'absent-executable')] }]);
  assert.equal(result.status, 2, result.stderr);
  assert.match(result.stdout + result.stderr, /BLOCKED/);
  assert.ok(existsSync(join(runs(root)[0], 'missing.log')));
});

test('arguments remain literal even with shell syntax and spaces', (t) => {
  const root = repository(t);
  const args = ['hello world', '$(touch injected)', '`touch injected-too`', 'a;b', '*.mjs', '$HOME', '--flag=value'];
  const result = invoke(root, [{
    name: 'literal',
    command: [process.execPath, '-e', 'process.stdout.write(JSON.stringify(process.argv.slice(1)))', '--', ...args],
  }]);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(log(root, 'literal').includes(JSON.stringify(args)));
  assert.equal(existsSync(join(root, 'injected')), false);
  assert.equal(existsSync(join(root, 'injected-too')), false);
});

test('exit code is authoritative even when output contains FAIL', (t) => {
  const root = repository(t);
  const result = invoke(root, [check('exit-zero', "console.log('FAIL is fixture text, not a verdict')")]);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(log(root, 'exit-zero').includes('FAIL is fixture text, not a verdict'));
});

test('large child output stays in complete logs instead of the tool response', (t) => {
  const root = repository(t);
  const result = invoke(root, [check('noisy', "process.stdout.write('x'.repeat(200000)); process.stderr.write('stderr-complete')")]);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.length + result.stderr.length < 4096);
  assert.ok(log(root, 'noisy').includes('x'.repeat(200000)));
  assert.ok(log(root, 'noisy').includes('stderr-complete'));
});

test('successive runs preserve separate evidence directories', (t) => {
  const root = repository(t);
  for (const marker of ['first-evidence', 'second-evidence']) {
    const result = invoke(root, [check('saved', `console.log(${JSON.stringify(marker)})`)]);
    assert.equal(result.status, 0, result.stderr);
  }
  const saved = runs(root).map((directory) => readFileSync(join(directory, 'saved.log'), 'utf8'));
  assert.equal(saved.length, 2);
  assert.ok(saved.some((entry) => entry.includes('first-evidence')));
  assert.ok(saved.some((entry) => entry.includes('second-evidence')));
});

test('timed-out checks stop descendants and do not prevent the next check', async (t) => {
  const root = repository(t);
  const started = Date.now();
  const result = invoke(root, [
    check('timeout', hangingCode, { timeoutMs: 700 }),
    check('after-timeout', "require('node:fs').writeFileSync('continued', 'yes')"),
  ]);
  assert.notEqual(result.status, 0);
  assert.ok(Date.now() - started < 6000);
  assert.ok(log(root, 'timeout').includes('started-long-check'));
  assert.equal(readFileSync(join(root, 'continued'), 'utf8'), 'yes');
  assert.ok(existsSync(join(root, 'descendant.pid')));
  const heartbeat = readFileSync(join(root, 'heartbeat'), 'utf8');
  await delay(100);
  assert.equal(readFileSync(join(root, 'heartbeat'), 'utf8'), heartbeat);
});

test('an unusable evidence directory blocks checks before side effects', (t) => {
  const root = repository(t);
  mkdirSync(join(root, '.scratch'));
  writeFileSync(join(root, '.scratch/verify'), 'this is a file');
  const result = invoke(root, [check('side-effect', "require('node:fs').writeFileSync('must-not-run', 'bad')")]);
  assert.equal(result.status, 2, result.stderr);
  assert.equal(existsSync(join(root, 'must-not-run')), false);
  assert.equal(readFileSync(join(root, '.scratch/verify'), 'utf8'), 'this is a file');
});

test('SIGTERM stops the active process group and leaves later checks unrun', { timeout: 5000 }, async (t) => {
  const root = repository(t);
  const planPath = join(root, 'checks.json');
  writeFileSync(planPath, JSON.stringify([
    check('interrupted', hangingCode),
    check('later', "require('node:fs').writeFileSync('must-not-run', 'bad')"),
  ]));
  const child = spawn(process.execPath, [runner, planPath], { cwd: root, env: environment });
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); });
  let output = '';
  child.stdout.on('data', (data) => { output += data; });
  child.stderr.on('data', (data) => { output += data; });
  const closed = new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('close', (code, signal) => resolve({ code, signal }));
  });
  const deadline = Date.now() + 2500;
  while (!existsSync(join(root, 'descendant.pid'))) {
    assert.ok(Date.now() < deadline, 'child fixture did not become ready');
    await delay(10);
  }
  assert.equal(child.kill('SIGTERM'), true);
  const result = await closed;
  assert.equal(result.code, 130, output);
  assert.equal(result.signal, null, output);
  assert.equal(existsSync(join(root, 'must-not-run')), false);
  assert.ok(log(root, 'interrupted').includes('started-long-check'));
  assert.equal(existsSync(join(runs(root)[0], 'later.log')), false);
  const heartbeat = readFileSync(join(root, 'heartbeat'), 'utf8');
  await delay(100);
  assert.equal(readFileSync(join(root, 'heartbeat'), 'utf8'), heartbeat);
});

for (const launcherExit of [0, 7]) {
  test(`launcher exit ${launcherExit} stops remaining workers before the next check`, async (t) => {
    const root = repository(t);
    const launcher = `const fs = require('node:fs'); fs.writeFileSync('check.pid', String(process.pid)); const worker = require('node:child_process').spawn(process.execPath, ['-e', ${JSON.stringify(descendantCode)}], {stdio: 'ignore'}); worker.unref(); const ready = setInterval(() => { if (fs.existsSync('descendant.pid')) { clearInterval(ready); process.exit(${launcherExit}); } }, 5)`;
    const after = "const fs = require('node:fs'); const before = fs.readFileSync('heartbeat', 'utf8'); setTimeout(() => { if (fs.readFileSync('heartbeat', 'utf8') !== before) process.exit(9); fs.writeFileSync('later-ran', 'yes'); }, 100)";
    const result = invoke(root, [check('launcher', launcher), check('after-launcher', after)]);
    assert.equal(result.status, launcherExit === 0 ? 0 : 1, result.stdout + result.stderr);
    assert.equal(existsSync(join(root, 'later-ran')), true, 'worker kept writing during the next check');
    const heartbeat = readFileSync(join(root, 'heartbeat'), 'utf8');
    await delay(100);
    assert.equal(readFileSync(join(root, 'heartbeat'), 'utf8'), heartbeat);
  });
}

test('an absolute plan runs in its owning repository when called from another checkout', (t) => {
  const intended = repository(t);
  const unrelated = repository(t);
  writeFileSync(join(intended, 'check.mjs'), "import {writeFileSync} from 'node:fs'; writeFileSync('intended-ran', 'yes'); process.exit(7);");
  writeFileSync(join(unrelated, 'check.mjs'), "import {writeFileSync} from 'node:fs'; writeFileSync('unrelated-ran', 'bad');");
  const result = invoke(intended, [{ name: 'target', command: [process.execPath, 'check.mjs'] }], unrelated);
  assert.equal(result.status, 1, result.stdout + result.stderr);
  assert.equal(readFileSync(join(intended, 'intended-ran'), 'utf8'), 'yes');
  assert.equal(existsSync(join(unrelated, 'unrelated-ran')), false);
  assert.equal(existsSync(join(unrelated, '.scratch')), false);
  assert.ok(log(intended, 'target').includes('exit 7'));
});

test('a plan outside Git cannot borrow the caller repository', (t) => {
  const caller = repository(t);
  const outside = realpathSync(mkdtempSync(join(tmpdir(), 'jor-checks-external-plan-')));
  t.after(() => rmSync(outside, { recursive: true, force: true }));
  const result = invoke(outside, [check('outside', "require('node:fs').writeFileSync('must-not-run', 'bad')")], caller);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.equal(existsSync(join(caller, 'must-not-run')), false);
  assert.equal(existsSync(join(caller, '.scratch')), false);
});
