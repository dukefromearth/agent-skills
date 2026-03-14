#!/usr/bin/env node

import { readdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { DEFAULT_SKILL, SKILLS, TEST_CASES_FILE } from './config.js'
import { parseRuleFile } from './parser.js'
import { TestCase } from './types.js'

function extractTestCases(ruleId: string, ruleTitle: string, examples: any[]): TestCase[] {
  const tests: TestCase[] = []

  for (const example of examples) {
    const isBad = /incorrect|wrong|bad/i.test(example.label)
    const isGood = /correct|good/i.test(example.label)

    if (!isBad && !isGood) {
      continue
    }

    tests.push({
      ruleId,
      ruleTitle,
      type: isBad ? 'bad' : 'good',
      code: example.code,
      language: example.language ?? 'typescript',
      description: example.description
    })
  }

  return tests
}

async function main(): Promise<void> {
  const skill = SKILLS[DEFAULT_SKILL]
  const files = await readdir(skill.rulesDir)
  const ruleFiles = files.filter((file) => file.endsWith('.md') && !file.startsWith('_') && file !== 'README.md')

  const allTests: TestCase[] = []

  for (const file of ruleFiles) {
    const { rule } = await parseRuleFile(join(skill.rulesDir, file), skill.sectionMap)
    const tests = extractTestCases(rule.id || file.replace('.md', ''), rule.title, rule.examples)
    allTests.push(...tests)
  }

  await writeFile(TEST_CASES_FILE, JSON.stringify(allTests, null, 2) + '\n', 'utf-8')
  console.log(`✓ Extracted ${allTests.length} test cases to ${TEST_CASES_FILE}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
