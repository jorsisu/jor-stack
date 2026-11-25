# T3 Code, Claude Code, and Antigravity install

Use standalone skill links with `~/.agents/skills/` as the shared hub when using `jor-stack` in T3 Code (with Claude and Antigravity models), standalone Claude Code, or standalone Antigravity.

These are standalone skill links, not plugin installs: they do not load this repository's `mcp.json`, so browser skills require separately configured browser tooling. The shell examples below use Bash or Zsh on macOS/Linux.

## Why each tool needs its own link

| Tool / provider | Global skill path | Behavior |
| --- | --- | --- |
| Shared hub (Codex, Cursor) | `~/.agents/skills/` | Canonical symlink target pointing to your local `jor-stack` checkout. |
| Claude Code & T3 Code (`claudeAgent`) | `~/.claude/skills/` | Reads `~/.claude/skills/` directly, not `~/.agents/skills/`. May also contain Claude-managed folders such as `synced/` that must be preserved. |
| Antigravity & T3 Code (`antigravity`) | `~/.gemini/config/skills/` | T3 Code's `/` slash-command picker scans `~/.gemini/config/skills/` directly (it does not read `skills.json` manifests). T3 Code also links `~/.gemini/config/skills/` into each isolated Antigravity profile under `~/.t3/userdata/providers/antigravity/<id>/config/skills`. |

## Setup

Clone the repository or open a terminal at an existing `jor-stack` checkout's root, then keep the checkout at that path:

```sh
# 1. Hub: link each jor-* skill into ~/.agents/skills/
mkdir -p "$HOME/.agents/skills"
for skill in "$PWD"/skills/jor-*; do
  [ -d "$skill" ] || continue
  target="$HOME/.agents/skills/$(basename "$skill")"
  if [ ! -e "$target" ] && [ ! -L "$target" ]; then
    ln -s "$skill" "$target"
  fi
done

# 2. Claude: link each jor-* skill into ~/.claude/skills/ (preserves synced/ and other folders)
mkdir -p "$HOME/.claude/skills"
for skill in "$HOME/.agents/skills"/jor-*; do
  [ -e "$skill" ] || continue
  target="$HOME/.claude/skills/$(basename "$skill")"
  if [ ! -e "$target" ] && [ ! -L "$target" ]; then
    ln -s "$skill" "$target"
  fi
done

# 3. Antigravity: link each jor-* skill into ~/.gemini/config/skills/ (leaves an existing symlink alone)
gemini_skills="$HOME/.gemini/config/skills"
if [ -L "$gemini_skills" ]; then
  echo "Skipping $gemini_skills: already symlinked to $(readlink "$gemini_skills")"
elif mkdir -p "$gemini_skills"; then
  for skill in "$HOME/.agents/skills"/jor-*; do
    [ -e "$skill" ] || continue
    target="$gemini_skills/$(basename "$skill")"
    if [ ! -e "$target" ] && [ ! -L "$target" ]; then
      ln -s "$skill" "$target"
    fi
  done
fi

# 4. Existing T3 Code Antigravity profiles (if any exist yet)
if [ -d "$HOME/.t3/userdata/providers/antigravity" ]; then
  find "$HOME/.t3/userdata/providers/antigravity" -mindepth 1 -maxdepth 1 -type d | while IFS= read -r profile; do
    mkdir -p "$profile/config"
    p_skills="$profile/config/skills"
    if [ ! -e "$p_skills" ] && [ ! -L "$p_skills" ]; then
      ln -s "$gemini_skills" "$p_skills"
    elif [ -d "$p_skills" ] && [ ! -L "$p_skills" ]; then
      if [ -z "$(ls -A "$p_skills")" ]; then
        rmdir "$p_skills" && ln -s "$gemini_skills" "$p_skills"
      else
        for skill in "$HOME/.agents/skills"/jor-*; do
          [ -e "$skill" ] || continue
          target="$p_skills/$(basename "$skill")"
          if [ ! -e "$target" ] && [ ! -L "$target" ]; then
            ln -s "$skill" "$target"
          fi
        done
      fi
    fi
  done
fi
```

If `~/.t3/userdata/providers/antigravity/` does not exist yet, step 4 is a no-op; T3 Code links `~/.gemini/config/skills` automatically the first time you launch an Antigravity session.

## Verify

Check that every `jor-*` skill resolves to a readable `SKILL.md` through each target directory:

```sh
for dir in "$HOME/.agents/skills" "$HOME/.claude/skills" "$HOME/.gemini/config/skills"; do
  [ -d "$dir" ] || continue
  count=$(find -L "$dir" -maxdepth 2 -path "$dir/jor-*/SKILL.md" -type f 2>/dev/null | wc -l | tr -d ' ')
  echo "$count  $dir"
done
if [ -d "$HOME/.t3/userdata/providers/antigravity" ]; then
  find "$HOME/.t3/userdata/providers/antigravity" -mindepth 1 -maxdepth 1 -type d | while IFS= read -r profile; do
    dir="$profile/config/skills"
    [ -d "$dir" ] || continue
    count=$(find -L "$dir" -maxdepth 2 -path "$dir/jor-*/SKILL.md" -type f 2>/dev/null | wc -l | tr -d ' ')
    echo "$count  $dir"
  done
fi
```

Then start a new thread (or reload T3 Code) and type `/jor` in both a Claude thread and an Antigravity thread to confirm the skills appear in the `/` picker.

## Notes and troubleshooting

- **Keep the checkout path stable:** symlinks resolve back to this repository, so edits here take effect immediately and moving the repo breaks the links.
- **Adding or renaming skills later:** re-run the setup block to add missing links in all three targets, and remove stale links manually after a rename.
- **Existing `~/.gemini/config/skills` symlink:** setup leaves it unchanged. If it points to `~/.agents/skills`, Antigravity and every T3 Code Antigravity profile see every skill there, not only `jor-*`.
- **Avoid duplicates in Cursor and Codex:** Cursor and Codex also read `~/.agents/skills/`. Use one install method per app; see [Install](../README.md#install) for plugin installs.
- **Why not `skills.json` for Antigravity:** Antigravity's runtime reads `skills.json`, but T3 Code's `/` command picker scans `~/.gemini/config/skills/` directly and ignores `skills.json`.
