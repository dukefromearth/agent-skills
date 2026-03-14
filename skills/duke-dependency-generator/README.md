# Duke Dependency Generator

A structured skill for creating deterministic architecture and dependency graph workflows in TypeScript repositories.

## Structure

- `rules/` - source rules
- `metadata.json` - version and abstract metadata
- `SKILL.md` - runtime trigger and quick guidance
- `AGENTS.md` - compiled long-form guide (generated)

## Getting Started

1. Install required analysis libraries:
   ```bash
   npm install --save-dev dependency-cruiser ts-morph fast-glob
   ```
2. Initialize dependency-cruiser in the target repository:
   ```bash
   npx depcruise --init oneshot
   ```
3. Implement and run your arch command:
   ```bash
   npm run arch -- --help
   ```
4. Validate repeatability:
   ```bash
   npm run arch -- --deps --minify false > /tmp/deps1.mmd
   npm run arch -- --deps --minify false > /tmp/deps2.mmd
   diff /tmp/deps1.mmd /tmp/deps2.mmd
   ```
