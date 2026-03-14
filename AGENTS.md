# AGENTS.md

This repository stores reusable agent skills and deterministic build pipelines.

## Skill Layout

```text
skills/
  duke-dependency-generator/
    SKILL.md
    README.md
    metadata.json
    AGENTS.md
    rules/
      _sections.md
      _template.md
      *.md
```

## Build Layout

```text
packages/
  duke-dependency-generator-build/
    package.json
    tsconfig.json
    src/
      build.ts
      validate.ts
      parser.ts
      extract-tests.ts
      config.ts
      types.ts
```

## CI Contract

- CI triggers only when the skill or its build package changes.
- CI runs from the build package working directory.
- Required checks: `pnpm validate` and `pnpm build`.

## Authoring Rules

- Each rule file must include frontmatter, explanation, and bad/good examples.
- Rules are grouped by prefix and section metadata in `rules/_sections.md`.
- `AGENTS.md` inside a skill is generated from source rules; do not hand-edit it.
