import process from 'node:process'
import fs from 'node:fs'
import consola from 'consola'
import packageJson from '../package.json'
import { prepareSync } from './features/sync/pre'
import { launch } from './launch'
import { checkAIConfig, injectEnv } from './utils/env.util'
import { DATA, TMP } from './constants'
import { prepareShortcutRunner } from './utils/shortcuts.util'
import { prepareCache, registCache } from './utils/cache.util'

injectEnv()

process.title = packageJson.name

function prepareTmp() {
  consola.info('[Tmp] Checking tmp folder...')
  const tmp = TMP
  if (!fs.existsSync(tmp)) {
    consola.info('[Tmp] Preparing tmp folder...')
    fs.mkdirSync(tmp)
    consola.success('[Tmp] tmp folder created.')
  }
  consola.success('[Tmp] tmp prepared.')
}

function prepareData() {
  consola.info('[Data] Checking Data folder...')
  if (!fs.existsSync(DATA)) {
    consola.info('[Data] Preparing Data folder...')
    fs.mkdirSync(DATA)
    consola.success('[Data] Data folder created.')
  }
  consola.success('[Data] Data prepared.')
}

launch()

Promise.all([
  prepareTmp(),
  prepareData(),
  prepareSync(),
]).then(() => {
  consola.success('Root Preparation is done.')
})

Promise.all([
  prepareShortcutRunner(),
  prepareCache(),
]).then(() => {
  consola.success('Utils Preparation is done.')
})

Promise.all([
  registCache('copilot'),
]).then(() => {
  consola.success('Cache Registration is done.')
})

checkAIConfig()
consola.info('Translate Type:', process.env.TRANSLATE_TYPE)
