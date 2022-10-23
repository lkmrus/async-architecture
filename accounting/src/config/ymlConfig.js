import yaml from 'yaml'
import fs from 'fs'
import { resolve, } from 'path'
import merge from 'merge-deep'

const defaultConfigPath = resolve('./config.yml')
const devConfigPath = resolve('./config.dev.yml')
const defaultConfig = yaml.parse(fs.readFileSync(defaultConfigPath, 'utf8'))

const config = !fs.existsSync(devConfigPath)
  ? defaultConfig
  : merge(defaultConfig, yaml.parse(fs.readFileSync(devConfigPath, 'utf8')))

export default config
