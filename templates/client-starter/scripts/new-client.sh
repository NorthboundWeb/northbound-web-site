#!/usr/bin/env bash
# Usage: new-client.sh <slug> "<Client Name>" [target-dir]
# Copies the starter kit to ../<slug> (or target-dir) and sets the client name.
set -euo pipefail

slug="${1:-}"
name="${2:-}"
if [[ -z "$slug" || -z "$name" ]]; then
  echo "Usage: $0 <slug> \"<Client Name>\" [target-dir]" >&2
  exit 1
fi
if [[ ! "$slug" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "Slug must be lowercase letters, numbers and hyphens." >&2
  exit 1
fi

here="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
target="${3:-$here/../../../$slug}"

if [[ -e "$target" ]]; then
  echo "Refusing to overwrite existing path: $target" >&2
  exit 1
fi

mkdir -p "$target"
# Copy everything except installed or generated folders.
(cd "$here" && tar --exclude=node_modules --exclude=.next --exclude=scripts -cf - .) | (cd "$target" && tar -xf -)

# Set the package name, and the business name placeholder if present.
sed -i "s/\"name\": \"[^\"]*\"/\"name\": \"$slug\"/" "$target/package.json"
# Escape for a single-quoted TS string inside a sed replacement.
esc=$(printf '%s' "$name" | sed -e 's/[\\&|]/\\&/g' -e "s/'/\\\\\\\\'/g")
sed -i "s|name: 'Client Name'|name: '$esc'|" "$target/src/lib/site.ts"

echo "Created $target"
echo "Next: edit src/lib/site.ts, rewrite src/app/privacy/page.tsx, then npm install."
