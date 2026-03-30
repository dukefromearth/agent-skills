#!/usr/bin/env bash
set -euo pipefail

# Generate raw architecture analysis from a Go codebase.
# Run from the Go module root (where go.mod lives).
# Output goes to docs/generated/ by default.

GOBIN="$(go env GOBIN)"
if [ -z "$GOBIN" ]; then
  GOBIN="$(go env GOPATH)/bin"
fi
MODULE_PATH=$(grep '^module ' go.mod | awk '{print $2}')
OUTPUT_DIR="${1:-docs/generated}"

if [ -z "$MODULE_PATH" ]; then
  echo "Error: Could not determine module path from go.mod" >&2
  echo "Make sure you're running this from the Go module root." >&2
  exit 1
fi

# Check tools are installed
for tool in goda goplantuml callgraph; do
  if [ ! -x "$GOBIN/$tool" ]; then
    echo "Error: $tool not found at $GOBIN/$tool" >&2
    echo "Install with: go install <package>@latest" >&2
    exit 1
  fi
done

# Check graphviz
if ! command -v dot &>/dev/null; then
  echo "Error: graphviz (dot) not found. Install with: brew install graphviz" >&2
  exit 1
fi

mkdir -p "$OUTPUT_DIR"

echo "Module: $MODULE_PATH"
echo "Output: $OUTPUT_DIR"
echo ""

echo "Generating package dependency graph..."
"$GOBIN/goda" graph ./... > "$OUTPUT_DIR/deps.dot"
dot -Tsvg "$OUTPUT_DIR/deps.dot" -o "$OUTPUT_DIR/deps.svg"
echo "  -> $OUTPUT_DIR/deps.dot"
echo "  -> $OUTPUT_DIR/deps.svg"

echo "Generating type diagram..."
"$GOBIN/goplantuml" \
  -recursive \
  -show-aggregations \
  -show-compositions \
  -show-implementations \
  -show-aliases \
  -show-connection-labels \
  . > "$OUTPUT_DIR/types.puml"
echo "  -> $OUTPUT_DIR/types.puml"

echo "Generating call graph (filtered to app code)..."
"$GOBIN/callgraph" \
  -algo static \
  -format "{{.Caller}} -> {{.Callee}}" \
  ./... 2>&1 \
  | grep "$MODULE_PATH" \
  | grep -v vendor \
  | grep -v '\.init ' \
  | grep -v 'Mock' \
  | grep -v 'mock' \
  > "$OUTPUT_DIR/callgraph-app.txt" || true
echo "  -> $OUTPUT_DIR/callgraph-app.txt"

echo ""
echo "Done. Review the files in $OUTPUT_DIR/ then distill into Mermaid diagrams."
