import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { SkillConfig } from './types.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SKILLS_DIR = join(__dirname, '../../..', 'skills')
const BUILD_DIR = join(__dirname, '..')

export const SKILLS: Record<string, SkillConfig> = {
  'duke-dependency-generator': {
    name: 'duke-dependency-generator',
    title: 'Duke Dependency Generator',
    description: 'TypeScript architecture graph generation workflows',
    skillDir: join(SKILLS_DIR, 'duke-dependency-generator'),
    rulesDir: join(SKILLS_DIR, 'duke-dependency-generator/rules'),
    metadataFile: join(SKILLS_DIR, 'duke-dependency-generator/metadata.json'),
    outputFile: join(SKILLS_DIR, 'duke-dependency-generator/AGENTS.md'),
    sectionMap: {
      bootstrap: 1,
      scope: 2,
      deps: 3,
      types: 4,
      callgraph: 5,
      cli: 6,
      verify: 7,
      ops: 8
    }
  }
}

export const DEFAULT_SKILL = 'duke-dependency-generator'
export const TEST_CASES_FILE = join(BUILD_DIR, 'test-cases.json')
