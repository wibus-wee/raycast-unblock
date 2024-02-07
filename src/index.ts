import process from 'node:process'
import fs from 'node:fs'
import packageJson from '../package.json'
import { prepareSync } from './features/sync/pre'
import { launch } from './launch'
import { injectEnv } from './utils/env.util'
import { DATA, TMP } from './constants'
import { prepareShortcutRunner } from './utils/shortcuts.util'
import { prepareCache, registCache } from './utils/cache.util'
import { Debug } from './utils/log.util'

injectEnv()

process.title = packageJson.name

function prepareTmp() {
  Debug.info('[Tmp] Checking tmp folder...')
  const tmp = TMP
  if (!fs.existsSync(tmp)) {
    Debug.info('[Tmp] Preparing tmp folder...')
    fs.mkdirSync(tmp)
    Debug.success('[Tmp] tmp folder created.')
  }
  Debug.success('[Tmp] tmp prepared.')
}

function prepareData() {
  Debug.info('[Data] Checking Data folder...')
  if (!fs.existsSync(DATA)) {
    Debug.info('[Data] Preparing Data folder...')
    fs.mkdirSync(DATA)
    Debug.success('[Data] Data folder created.')
  }
  Debug.success('[Data] Data prepared.')
}

launch()

Promise.all([
  prepareTmp(),
  prepareData(),
  prepareSync(),
]).then(() => {
  Debug.success('Root Preparation is done.')
})

Promise.all([
  prepareShortcutRunner(),
  prepareCache(),
]).then(() => {
  Debug.success('Utils Preparation is done.')
})

Promise.all([
  registCache('copilot'),
]).then(() => {
  Debug.success('Cache Registration is done.')
})
