#!/usr/bin/env node
import { execFileSync, spawn } from 'node:child_process';
import { closeSync, existsSync, lstatSync, mkdirSync, mkdtempSync, openSync, readFileSync, realpathSync, writeSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

async function execute(check, root, log) {
  const fd = openSync(log, 'wx', 0o600);
  writeSync(fd, `cwd: ${root}\ncommand: ${JSON.stringify(check.command)}\n\n`);
  try {
    return await new Promise((done) => {
      const child = spawn(check.command[0], check.command.slice(1), {
        cwd: root,
        stdio: ['ignore', fd, fd],
        detached: true,
      });
      let reason;
      let interrupted = false;
      function killGroup() {
        if (child.pid) {
          try {
            process.kill(-child.pid, 'SIGKILL');
          } catch (error) {
            if (error.code !== 'ESRCH') throw error;
          }
        }
      }
      function stop(message, signal = false) {
        reason = message;
        interrupted = signal;
        killGroup();
      }
      const onInterrupt = () => stop('interrupted', true);
      process.once('SIGINT', onInterrupt);
      process.once('SIGTERM', onInterrupt);
      const timer = setTimeout(() => stop('timed out'), check.timeoutMs ?? 300_000);
      child.once('error', (error) => { reason = `could not start: ${error.code}`; });
      child.once('close', (code, signal) => {
        clearTimeout(timer);
        process.removeListener('SIGINT', onInterrupt);
        process.removeListener('SIGTERM', onInterrupt);
        try {
          killGroup();
        } catch (error) {
          reason = `cleanup failed: ${error.code}`;
        }
        const detail = reason ?? (signal ? `signal ${signal}` : `exit ${code}`);
        writeSync(fd, `\nresult: ${detail}\n`);
        done({ status: reason?.startsWith('could not start') ? 'BLOCKED' : code === 0 && !reason ? 'PASS' : 'FAIL', interrupted });
      });
    });
  } finally {
    closeSync(fd);
  }
}

async function main() {
  if (process.argv.length !== 3) throw new Error('Usage: node run-checks.mjs <checks.json>');
  if (process.platform === 'win32') throw new Error('This runner requires macOS or Linux process groups.');
  const planPath = resolve(process.argv[2]);
  let checks;
  try {
    checks = JSON.parse(readFileSync(planPath, 'utf8'));
  } catch {
    throw new Error(`Cannot read a valid JSON check plan: ${planPath}`);
  }
  if (!Array.isArray(checks) || checks.length === 0) throw new Error('The check plan must be a nonempty array.');
  const names = new Set();
  for (const check of checks) {
    if (!check || typeof check !== 'object' || Array.isArray(check)
      || Object.keys(check).some((key) => !['name', 'command', 'timeoutMs'].includes(key))
      || typeof check.name !== 'string' || check.name.length > 64 || !/^[A-Za-z0-9_-]+$/.test(check.name)
      || names.has(check.name)
      || !Array.isArray(check.command) || check.command.length === 0
      || check.command.some((arg) => typeof arg !== 'string' || arg.includes('\0'))
      || !check.command[0].trim()
      || (check.timeoutMs !== undefined && (!Number.isInteger(check.timeoutMs) || check.timeoutMs < 1 || check.timeoutMs > 2_147_483_647))) {
      throw new Error('Invalid check plan: unique safe names up to 64 characters, command argument arrays, and positive timeoutMs are required.');
    }
    names.add(check.name);
  }

  let root;
  try {
    root = realpathSync(execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: dirname(realpathSync(planPath)), encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim());
    execFileSync('git', ['check-ignore', '--quiet', '--', '.scratch/'], { cwd: root, stdio: 'ignore' });
  } catch {
    throw new Error('Store the check plan inside the target Git repo and exclude .scratch/ in its local Git exclude file before running checks.');
  }
  for (const folder of [join(root, '.scratch'), join(root, '.scratch', 'verify')]) {
    if (existsSync(folder) && lstatSync(folder).isSymbolicLink()) throw new Error('Evidence folders must not be symbolic links.');
    mkdirSync(folder, { recursive: true });
  }
  const evidence = mkdtempSync(join(root, '.scratch', 'verify', 'checks-'));
  for (const check of checks) {
    try {
      execFileSync('git', ['check-ignore', '--quiet', '--', relative(root, join(evidence, `${check.name}.log`))], { cwd: root, stdio: 'ignore' });
    } catch {
      throw new Error('Every check log must be ignored by Git before any check runs.');
    }
  }
  let passed = 0;
  let exitCode = 0;
  let completed = 0;
  for (const check of checks) {
    const log = join(evidence, `${check.name}.log`);
    const result = await execute(check, root, log);
    completed += 1;
    console.log(`${result.status} ${check.name} | ${relative(root, log)}`);
    if (result.status === 'PASS') passed += 1;
    else exitCode = Math.max(exitCode, result.status === 'BLOCKED' ? 2 : 1);
    if (result.interrupted) {
      exitCode = 130;
      break;
    }
  }
  console.log(`${passed}/${checks.length} configured checks passed; ${checks.length - completed} not run.`);
  process.exitCode = exitCode;
}

main().catch((error) => {
  console.error(`BLOCKED ${error.message}`);
  process.exitCode = 2;
});
