# Duke Dependency Generator

**Version 0.1.0**  
Duke Engineering  
March 2026

> **Note:**  
> This guide is optimized for agents and AI-assisted engineering workflows.
> It prioritizes deterministic behavior, explicit contracts, and maintainable defaults.

---

## Abstract

Implementation guide for adding deterministic architecture graph generation to TypeScript repositories. This skill focuses on install-first bootstrap, dependency-cruiser initialization, scope modeling, stable graph output, strict CLI contracts, and repeatability checks.

---

## Table of Contents

1. [Bootstrap and Toolchain](#1-bootstrap-and-toolchain) — **CRITICAL**
   - 1.1 [Install Required Analysis Libraries Before Any Init Step](#11-install-required-analysis-libraries-before-any-init-step)
2. [Scope and Project Model](#2-scope-and-project-model) — **CRITICAL**
   - 2.1 [Use a Dedicated tsconfig.arch.json for Analysis Scope](#21-use-a-dedicated-tsconfigarchjson-for-analysis-scope)
3. [Dependency Graph Generation](#3-dependency-graph-generation) — **HIGH**
   - 3.1 [Merge Mermaid Output Options with Generated depcruise Config](#31-merge-mermaid-output-options-with-generated-depcruise-config)
4. [Type Graph Generation](#4-type-graph-generation) — **HIGH**
   - 4.1 [Keep Type Graph IDs and Ordering Deterministic](#41-keep-type-graph-ids-and-ordering-deterministic)
5. [Callgraph Generation](#5-callgraph-generation) — **HIGH**
   - 5.1 [Seed Callgraph from Real Ingress Entrypoints](#51-seed-callgraph-from-real-ingress-entrypoints)
6. [CLI Contract](#6-cli-contract) — **HIGH**
   - 6.1 [Validate CLI Arguments Before Execution](#61-validate-cli-arguments-before-execution)
7. [Verification and Determinism](#7-verification-and-determinism) — **MEDIUM**
   - 7.1 [Prove Repeatability with Diff-Based Re-Runs](#71-prove-repeatability-with-diff-based-re-runs)
8. [Operational Hygiene](#8-operational-hygiene) — **MEDIUM**
   - 8.1 [Keep a Living GOTCHA Log for Recurring Failure Modes](#81-keep-a-living-gotcha-log-for-recurring-failure-modes)

---

## 1. Bootstrap and Toolchain

**Impact: CRITICAL**

Installation and initialization mistakes are the most common cause of failed architecture workflows.

### 1.1 Install Required Analysis Libraries Before Any Init Step

**Impact: CRITICAL**

`dependency-cruiser`, `ts-morph`, and `fast-glob` are hard requirements for this architecture workflow. Install them before initialization or wrapper scripts.

**Incorrect: partial setup causes failure**

```bash
npm install --save-dev dependency-cruiser
npx depcruise --init oneshot
npm run arch
```

**Correct: full install first**

```bash
npm install --save-dev dependency-cruiser ts-morph fast-glob
npx depcruise --init oneshot
npm run arch -- --help
```

Reference: [https://github.com/sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser)

---

## 2. Scope and Project Model

**Impact: CRITICAL**

Graph quality depends on accurate include/exclude scope and a dedicated analysis TS project.

### 2.1 Use a Dedicated tsconfig.arch.json for Analysis Scope

**Impact: CRITICAL**

Architecture analysis should run in a dedicated TS project so test/build artifacts and generated files do not pollute graph output.

**Incorrect: reusing app tsconfig pulls too much**

```json
{
  "extends": "./tsconfig.json"
}
```

**Correct: explicit analysis scope**

```json
{
  "extends": "./tsconfig.json",
  "include": ["src/**/*.ts", "src/**/*.tsx"],
  "exclude": ["dist", "build", "coverage", "**/*.test.ts", "**/*.spec.ts"]
}
```

Reference: [https://www.typescriptlang.org/tsconfig/](https://www.typescriptlang.org/tsconfig/)

---

## 3. Dependency Graph Generation

**Impact: HIGH**

Dependency graph customization must preserve repository-specific resolver behavior.

### 3.1 Merge Mermaid Output Options with Generated depcruise Config

**Impact: HIGH**

Custom graph output should extend generated dependency-cruiser config, not replace it, to preserve repository-specific resolver behavior.

**Incorrect: replace baseline resolver**

```js
const config = { outputType: "mermaid" }
```

**Correct: merge with baseline**

```js
const config = {
  ...baseConfig,
  outputType: "mermaid",
  reporterOptions: {
    ...(baseConfig.reporterOptions ?? {}),
    dot: { ...(baseConfig.reporterOptions?.dot ?? {}), collapsePattern: "node_modules" }
  }
}
```

Reference: [https://github.com/sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser)

---

## 4. Type Graph Generation

**Impact: HIGH**

Type graph output must remain bounded and deterministic to stay useful in large repositories.

### 4.1 Keep Type Graph IDs and Ordering Deterministic

**Impact: HIGH**

Sort declaration sources and assign stable node IDs so reruns produce clean diffs and CI can detect real graph changes.

**Incorrect: iteration-order dependent IDs**

```ts
for (const declaration of declarations) {
  nodes.push({ id: Math.random().toString(), label: declaration.getName() })
}
```

**Correct: stable sort and deterministic IDs**

```ts
for (const declaration of declarations
  .slice()
  .sort((a, b) => a.getSourceFile().getFilePath().localeCompare(b.getSourceFile().getFilePath(), "en-US"))) {
  const id = declaration.getSourceFile().getFilePath() + "::" + declaration.getName()
  nodes.push({ id, label: declaration.getName() ?? "anonymous" })
}
```

Reference: [https://ts-morph.com/](https://ts-morph.com/)

---

## 5. Callgraph Generation

**Impact: HIGH**

Entrypoint selection is the main signal control for callgraph value and noise.

### 5.1 Seed Callgraph from Real Ingress Entrypoints

**Impact: HIGH**

Choose entrypoints that represent real runtime ingress (API handlers, server bootstrap, CLI main). Arbitrary seeds create noisy, low-value graphs.

**Incorrect: random seed files**

```bash
npm run arch -- --callgraph --entry "src/**/*.ts"
```

**Correct: explicit ingress seeds**

```bash
npm run arch -- --callgraph --entry src/index.ts --entry src/server.ts
```

Reference: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)

---

## 6. CLI Contract

**Impact: HIGH**

Strict argument validation prevents confusing runtime failures and non-deterministic behavior.

### 6.1 Validate CLI Arguments Before Execution

**Impact: HIGH**

Reject missing values and incompatible flags early to avoid accidental graph generation with the wrong mode.

**Incorrect: silent argument swallowing**

```bash
npm run arch -- --config --deps
# --deps is consumed as config value
```

**Correct: explicit validation and failure**

```bash
npm run arch -- --config --deps
# exits with: Missing value for --config. Expected a path.
```

Reference: [https://nodejs.org/docs/latest-v20.x/api/process.html#processargv](https://nodejs.org/docs/latest-v20.x/api/process.html#processargv)

---

## 7. Verification and Determinism

**Impact: MEDIUM**

Deterministic outputs allow diff-based review and CI enforcement.

### 7.1 Prove Repeatability with Diff-Based Re-Runs

**Impact: MEDIUM**

Every graph mode should produce stable output across consecutive runs. This is required for trustworthy reviews and CI drift detection.

**Incorrect: single-run confidence only**

```bash
npm run arch -- --deps
```

**Correct: repeat and diff**

```bash
npm run arch -- --deps --minify false > /tmp/deps-1.mmd
npm run arch -- --deps --minify false > /tmp/deps-2.mmd
diff /tmp/deps-1.mmd /tmp/deps-2.mmd
```

Reference: [https://pubs.opengroup.org/onlinepubs/9699919799/utilities/diff.html](https://pubs.opengroup.org/onlinepubs/9699919799/utilities/diff.html)

---

## 8. Operational Hygiene

**Impact: MEDIUM**

Keep implementation gotchas explicit so teams do not rediscover the same failure modes.

### 8.1 Keep a Living GOTCHA Log for Recurring Failure Modes

**Impact: MEDIUM**

When setup or output behaves unexpectedly, document the trap in repo docs so future implementations avoid rediscovering it.

**Incorrect: tribal knowledge only**

```text
Team members repeatedly hit zsh globbing, entrypoint explosion, and npm preamble parsing issues.
```

**Correct: capture gotchas immediately**

```markdown
## GOTCHAs
- zsh expands unquoted globs; quote file patterns.
- npm command output includes preamble lines; parse graph sections explicitly.
- broad callgraph entrypoints can exceed max edge budgets.
```

Reference: [https://docs.github.com/en/get-started/writing-on-github](https://docs.github.com/en/get-started/writing-on-github)

---

## References

1. [https://github.com/sverweij/dependency-cruiser](https://github.com/sverweij/dependency-cruiser)
2. [https://ts-morph.com/](https://ts-morph.com/)
3. [https://github.com/mrmlnc/fast-glob](https://github.com/mrmlnc/fast-glob)
4. [https://www.typescriptlang.org/tsconfig/](https://www.typescriptlang.org/tsconfig/)
