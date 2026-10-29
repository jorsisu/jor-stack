require 'json'
require 'digest'
require 'pathname'
require 'yaml'

def validate_stack(root)
  root = Pathname.new(root)
  automatic = %w[jor-dr-stack jor-peer-review jor-writing-for-agents]
  folders = root.join('skills').children.select(&:directory?).sort
  names = folders.map { |folder| folder.basename.to_s }
  raise 'No skill folders found' if names.empty?
  raise 'Missing automatic skill' unless (automatic - names).empty?

  folders.each do |folder|
    name = folder.basename.to_s
    source = folder.join('SKILL.md').read
    frontmatter = source.match(/\A---\r?\n(.*?)\r?\n---(?:\r?\n|\z)/m)
    raise "#{name}: missing frontmatter" unless frontmatter
    metadata = YAML.safe_load(frontmatter[1])
    raise "#{name}: invalid metadata" unless metadata.is_a?(Hash)
    unless metadata['name'] == name && name.match?(/\A[a-z0-9-]{1,64}\z/)
      raise "#{name}: name must match its folder and naming rules"
    end
    description = metadata['description']
    unless description.is_a?(String) && !description.strip.empty? && description.length <= 1024
      raise "#{name}: invalid description"
    end
    provenance = metadata['metadata']
    unless provenance.is_a?(Hash) && provenance['based-on'].is_a?(String) && !provenance['based-on'].strip.empty?
      raise "#{name}: missing based-on provenance"
    end
    implicit = automatic.include?(name)
    cursor_valid = implicit ? !metadata.key?('disable-model-invocation') : metadata['disable-model-invocation'] == true
    raise "#{name}: Cursor invocation policy mismatch" unless cursor_valid
    codex = YAML.safe_load(folder.join('agents/openai.yaml').read)
    unless codex.is_a?(Hash) && codex['policy'].is_a?(Hash) && codex['policy']['allow_implicit_invocation'] == implicit
      raise "#{name}: Codex invocation policy mismatch"
    end
  end

  readme = root.join('README.md').read
  catalog = readme[/## Skills and triggers\n(.*?)\n## How work flows/m, 1]
  catalog_names = catalog.to_s.lines.grep(/^\|/).join.scan(/`(jor-[a-z0-9-]+)`/).flatten.sort
  raise 'README skill catalog mismatch' unless catalog && catalog_names == names
  counts = "**#{automatic.length} automatic, #{names.length - automatic.length} manual.**"
  raise 'README invocation counts mismatch' unless catalog.include?(counts)
  router = root.join('skills/jor-mode/SKILL.md').read
  raise 'Router skill coverage mismatch' unless (names - router.scan(/\bjor-[a-z0-9-]+\b/)).empty?
  upstream = root.join('UPSTREAM.md').read.scan(/^\| `(jor-[a-z0-9-]+)` \|/).flatten.sort
  raise 'UPSTREAM skill catalog mismatch' unless upstream == names

  diagram = readme[/```mermaid\n(.*?)\n```/m, 1]
  raise 'Mermaid source mismatch' unless diagram && diagram.strip == root.join('docs/flow.mmd').read.strip

  manifests = %w[plugin.json .cursor-plugin/plugin.json .cursor-plugin/marketplace.json .agents/plugins/marketplace.json]
  parsed = manifests.map do |path|
    manifest = JSON.parse(root.join(path).read)
    raise "#{path}: package name mismatch" unless manifest.is_a?(Hash) && manifest['name'] == 'jor-stack'
    manifest
  end
  versions = [parsed[0]['version'], parsed[1]['version'], parsed[2].dig('metadata', 'version')]
  raise 'Plugin version mismatch' unless versions.first.is_a?(String) && !versions.first.empty? && versions.uniq.length == 1
  descriptions = [parsed[0]['description'], parsed[1]['description'], parsed[2].dig('plugins', 0, 'description')]
  unless descriptions.first.is_a?(String) && !descriptions.first.strip.empty? && descriptions.uniq.length == 1
    raise 'Plugin description mismatch'
  end
  parsed.first(2).each do |manifest|
    raise 'Plugin license must be MIT' unless manifest['license'] == 'MIT'
    raise 'Plugin repository mismatch' unless manifest['repository'] == 'https://github.com/jorsisu/jor-stack'
  end
  unless parsed[1]['skills'] == './skills/' &&
         parsed[2]['plugins'].length == 1 && parsed[2].dig('plugins', 0, 'name') == 'jor-stack' &&
         parsed[2].dig('plugins', 0, 'source') == './' &&
         parsed[3]['plugins'].length == 1 && parsed[3].dig('plugins', 0, 'name') == 'jor-stack' &&
         parsed[3].dig('plugins', 0, 'source') == { 'source' => 'local', 'path' => './' }
    raise 'Plugin discovery path mismatch'
  end

  %w[LICENSE THIRD_PARTY_NOTICES.md CONTRIBUTING.md SECURITY.md docs/publishing.md].each do |path|
    raise "Missing publication file: #{path}" unless root.join(path).file?
  end
  license = root.join('LICENSE').read.split.join(' ')
  # Pin the complete MIT notice, including copyright, while allowing line wrapping.
  expected_license_sha256 = '72d1c65e7ef48e29d92b7b307e8932dcc5131af488a17af3a1b9d9ba5fb2dcee'
  raise 'Invalid MIT license' unless Digest::SHA256.hexdigest(license) == expected_license_sha256
  notices = root.join('THIRD_PARTY_NOTICES.md').read.split.join(' ')
  ['Matt Pocock', 'Lauren Tan', 'HumanLayer'].each do |holder|
    unless notices.include?(license.sub('Jorge Galarza', holder))
      raise "Missing complete third-party notice: #{holder}"
    end
  end
  mcp = JSON.parse(root.join('mcp.json').read)
  raise 'Missing Chrome DevTools MCP configuration' unless mcp.is_a?(Hash) && mcp['mcpServers'].is_a?(Hash) && mcp['mcpServers'].key?('chrome-devtools')
  args = mcp.dig('mcpServers', 'chrome-devtools', 'args')
  unless args.is_a?(Array) && (%w[--no-usage-statistics --no-performance-crux] - args).empty?
    raise 'Missing MCP privacy flags'
  end

  docs = root.glob('*.md')
  docs += root.glob('skills/**/*.md') + root.glob('docs/**/*.md')
  docs.each do |path|
    source = path.read.gsub(/^```[^\n]*\n.*?^```[^\n]*(?:\n|\z)/m, '')
    # shortcut: checks inline file links, extend when reference-style links are introduced.
    source.scan(/\[[^\]\n]*\]\(([^)\n]+)\)/).flatten.each do |target|
      next if target.match?(/\A(?:[a-z][a-z0-9+.-]*:|#)/i)
      target = target.split('#', 2).first
      next if target.nil? || target.empty?
      raise "#{path.relative_path_from(root)}: missing local link #{target}" unless path.dirname.join(target).exist?
    end
  end
  names.length
end

if $PROGRAM_NAME == __FILE__
  begin
    raise 'Usage: ruby scripts/validate-stack.rb' unless ARGV.empty?
    count = validate_stack(File.expand_path('..', __dir__))
    puts "PASS: #{count} skills; metadata, policies, catalogs, packaging, notices, privacy flags, links, and Mermaid parity"
  rescue StandardError => error
    warn "FAIL: #{error.message}"
    exit 1
  end
end
