import path from 'node:path'
import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfigWithVueTs(
  includeIgnoreFile(path.join(import.meta.dirname, '.gitignore')),
  {
    name: 'app/files-to-ignore',
    ignores: ['src/ghostscript/gs.js']
  },
  pluginVue.configs['flat/recommended'],
  js.configs.recommended,
  vueTsConfigs.base,
  vueTsConfigs.eslintRecommended,
  {
    name: 'app/typescript-aware-rules',
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error'
    }
  },
  skipFormatting
)
