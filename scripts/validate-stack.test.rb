require 'fileutils'
require 'tmpdir'
require_relative 'validate-stack'

root = Pathname.new(File.expand_path('..', __dir__))
validate_stack(root)

# Mutate only a temporary copy: each broken fixture must fail, then pass restored.
cases = [
  ['skill name', 'skills/jor-mode/SKILL.md', 'name: jor-mode', 'name: wrong-name', /name must match/],
  ['YAML syntax', 'skills/jor-mode/SKILL.md', 'name: jor-mode', 'name: [', /./],
  ['description', 'skills/jor-mode/SKILL.md', /^description:.*$/, 'description: 42', /invalid description/],
  ['provenance', 'skills/jor-mode/SKILL.md', 'based-on:', 'unused:', /missing based-on/],
  ['Cursor policy', 'skills/jor-mode/SKILL.md', 'disable-model-invocation: true', 'disable-model-invocation: false', /Cursor invocation/],
  ['Codex policy', 'skills/jor-mode/agents/openai.yaml', 'allow_implicit_invocation: false', 'allow_implicit_invocation: true', /Codex invocation/],
  ['automatic policy', 'skills/jor-peer-review/agents/openai.yaml', 'allow_implicit_invocation: true', 'allow_implicit_invocation: false', /Codex invocation/],
  ['README catalog', 'README.md', '`jor-domain`, `jor-prototype`', '`jor-domain`, `jor-missing`', /README skill catalog/],
  ['README table coverage', 'README.md', '| Automatic — after implementation checks | `jor-peer-review` |', '| Automatic — after implementation checks | `jor-mode` |', /README skill catalog/],
  ['README counts', 'README.md', /\*\*\d+ automatic, \d+ manual\.\*\*/, '**0 automatic, 0 manual.**', /invocation counts/],
  ['router coverage', 'skills/jor-mode/SKILL.md', /jor-teach/, 'jor-missing', /Router skill coverage/],
  ['provenance catalog', 'UPSTREAM.md', '| `jor-teach` |', '| `jor-missing` |', /UPSTREAM skill catalog/],
  ['diagram drift', 'docs/flow.mmd', 'flowchart TB', 'flowchart LR', /Mermaid source/],
  ['JSON syntax', 'plugin.json', /\{/, '{broken', /./],
  ['package identity', 'plugin.json', '"name": "jor-stack"', '"name": "wrong"', /package name/],
  ['version drift', 'plugin.json', /"version": "[^"]+"/, '"version": "invalid-test-version"', /Plugin version/],
  ['description drift', 'plugin.json', /"description": "[^"]+"/, '"description": "stale"', /Plugin description/],
  ['license metadata', 'plugin.json', '"license": "MIT"', '"license": "UNLICENSED"', /license must be MIT/],
  ['repository URL', '.cursor-plugin/plugin.json', '"repository": "https://github.com/jorsisu/jor-stack"', '"repository": "https://example.com"', /repository mismatch/],
  ['Cursor discovery', '.cursor-plugin/plugin.json', '"skills": "./skills/"', '"skills": "../skills/"', /discovery path/],
  ['Cursor marketplace', '.cursor-plugin/marketplace.json', '"source": "./"', '"source": "../"', /discovery path/],
  ['Codex marketplace', '.agents/plugins/marketplace.json', '"path": "./"', '"path": "/tmp/"', /discovery path/],
  ['license file', 'LICENSE', 'MIT License', 'Unlicensed', /Invalid MIT/],
  ['truncated license', 'LICENSE', /Permission is hereby granted.*\z/m, '', /Invalid MIT/],
  ['missing warranty', 'LICENSE', /THE SOFTWARE IS PROVIDED.*\z/m, '', /Invalid MIT/],
  ['copyright notice', 'THIRD_PARTY_NOTICES.md', 'Copyright (c) 2026 Lauren Tan', 'Copyright removed', /third-party notice/],
  ['permission notice', 'THIRD_PARTY_NOTICES.md', 'Permission is hereby granted', 'Permission removed', /third-party notice/],
  ['MCP configuration', 'mcp.json', '"chrome-devtools":', '"missing":', /Missing Chrome/],
  ['MCP privacy', 'mcp.json', '--no-usage-statistics', '--usage-statistics', /Missing MCP privacy/],
  ['publication link', 'CONTRIBUTING.md', '(SECURITY.md)', '(MISSING.md)', /missing local link/],
  ['local link', 'README.md', '(UPSTREAM.md)', '(MISSING.md)', /missing local link/]
]

Dir.mktmpdir('jor-stack-validation-') do |directory|
  fixture = Pathname.new(directory)
  paths = %w[README.md UPSTREAM.md CHANGELOG.md THIRD_PARTY_NOTICES.md CONTRIBUTING.md SECURITY.md LICENSE skills scripts docs .github .cursor-plugin .agents plugin.json mcp.json].map { |path| root.join(path) }
  paths.each { |path| FileUtils.cp_r(path.to_s, directory) }
  validate_stack(fixture)
  cases.each do |label, relative, pattern, replacement, expected|
    path = fixture.join(relative)
    original = path.read
    changed = original.gsub(pattern, replacement)
    raise "#{label}: fixture mutation did not apply" if changed == original
    path.write(changed)
    failure = nil
    begin
      validate_stack(fixture)
    rescue StandardError => error
      failure = error
    ensure
      path.write(original)
    end
    raise "#{label}: invalid fixture passed" unless failure
    raise "#{label}: wrong failure: #{failure.message}" unless failure.message.match?(expected)
    validate_stack(fixture)
  end
  fixture.join('LICENSE').write(root.join('LICENSE').read.gsub(/\s+/, "\r\n"))
  validate_stack(fixture)
end
puts "PASS: #{cases.length} invalid fixtures rejected; restored fixtures and rewrapped license pass"
