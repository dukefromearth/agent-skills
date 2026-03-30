---
name: go-architecture-diagrams
description: This skill should be used when the user asks to "generate architecture diagrams", "document codebase architecture", "create data flow diagrams", "visualize package dependencies", "generate call graph", "create type diagrams", "map the codebase", "create Mermaid diagrams from code", or wants to understand and document how a Go codebase is structured. Generates raw analysis from Go source using static analysis tools, then distills into Mermaid diagrams.
---

# Go Architecture Diagram Generation

Generate architecture and data-flow documentation for Go codebases by running static analysis tools and distilling the output into Mermaid diagrams.

## Prerequisites

Graphviz must be installed for rendering dot files:

```bash
brew install graphviz
```

The three Go analysis tools are pure Go (no CGo), so they will not trigger macOS Gatekeeper quarantine.

## Workflow

### Phase 1: Install Analysis Tools

Install all three tools. Use `$(go env GOPATH)/bin/` to run them, as `goenv` places binaries in version-specific directories that may not be on PATH.

```bash
go install github.com/loov/goda@latest
go install github.com/jfeliu007/goplantuml/cmd/goplantuml@latest
go install golang.org/x/tools/cmd/callgraph@latest
```

Note: `goda` may auto-download a newer Go toolchain to satisfy its module requirements. This is expected.

### Phase 2: Generate Raw Analysis

Run all three tools from the Go module root (where `go.mod` lives). Determine the module path from `go.mod` for use in the callgraph filter.

**Package dependencies (goda):**

```bash
$(go env GOPATH)/bin/goda graph ./... > deps.dot
dot -Tsvg deps.dot -o deps.svg
```

Produces a Graphviz dot file showing internal package dependency relationships.

**Type diagram (goplantuml):**

```bash
$(go env GOPATH)/bin/goplantuml \
  -recursive \
  -show-aggregations \
  -show-compositions \
  -show-implementations \
  -show-aliases \
  -show-connection-labels \
  . > types.puml
```

Produces a PlantUML file with every struct, interface, field, and relationship. View at plantuml.com or with the VS Code PlantUML extension.

**Call graph (callgraph):**

```bash
$(go env GOPATH)/bin/callgraph \
  -algo static \
  -format "{{.Caller}} -> {{.Callee}}" \
  ./... 2>&1 \
  | grep '<module-path>' \
  | grep -v vendor \
  | grep -v '\.init ' \
  | grep -v 'Mock' \
  | grep -v 'mock' \
  > callgraph-app.txt
```

Replace `<module-path>` with the module name from `go.mod` (extract with `grep '^module ' go.mod | awk '{print $2}'`). **Always filter** - unfiltered output is thousands of lines of Go runtime internals.

### Phase 3: Review Raw Output

Read all three generated files to build a complete understanding:

- **deps.dot / deps.svg** - Identify the package hierarchy and dependency direction. Look for unexpected cross-package dependencies.
- **types.puml** - Map all structs, interfaces, and their relationships. Identify which types implement which interfaces and how data structures compose.
- **callgraph-app.txt** - Trace from the main entry point through handlers to external calls. Identify the critical request processing path and any branching logic.

### Phase 4: Distill into Mermaid

Write Mermaid diagrams by hand from the raw analysis. The raw output is too detailed to use directly - the value is in understanding the structure, then creating clean diagrams.

Useful diagram types to consider:

| Diagram | Mermaid syntax | Answers | Primary input |
|---|---|---|---|
| System architecture | `flowchart` with subgraphs | What external systems does the service talk to? | Entry point initialization in call graph |
| Request processing flow | `flowchart TD` | What happens when a request arrives? | Call graph tracing from entry point through handlers |
| Type/conversion detail | `flowchart LR` | How does data get transformed? | types.puml + source code |
| Initialization sequence | `sequenceDiagram` | What's the startup order? | Entry point source |
| Package dependencies | `flowchart TD` | How are the internal packages organized? | deps.dot |

Not every codebase needs all five. Choose the diagrams that answer the questions a new developer would actually ask.

Mermaid renders natively on GitHub with no build step and no image files to commit.

## Tool Troubleshooting

### "command not found" after go install

`goenv` places binaries in version-specific directories not on PATH. Always use:

```bash
$(go env GOPATH)/bin/<tool-name>
```

### callgraph output is all runtime internals

The raw output is dominated by `runtime.*`, `sync.*`, and `atomic.*`. Always pipe through the grep filter chain to isolate application code.

## Scripts

The `scripts/generate.sh` helper automates Phase 2. Run from the Go module root:

```bash
$CODEX_HOME/skills/go-architecture-diagrams/scripts/generate.sh
```
