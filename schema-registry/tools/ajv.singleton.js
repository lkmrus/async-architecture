const path = require('path')
const fs = require('fs')
const Ajv = require('ajv')

const pluckFileName = (absolutPath) => {
  if (!absolutPath) {
    return;
  }
  return absolutPath.split('/').pop().split('.')[0]
}

/**
 *
 * @param folder {string}
 * @returns {string[]}
 */
const getFiles = (folder) => {
  const items = fs.readdirSync(folder, { withFileTypes: true })
  let result = []

  for (const item of items) {
    const absoluteFilePath = path.resolve(folder, item.name)

    if (item.isDirectory()) {
      result = result.concat(getFiles(absoluteFilePath))
    } else {
      const index = result.findIndex((path) => path.match(new RegExp(folder)))
      if (index !== -1 && pluckFileName(result[index]) < pluckFileName(item.name)) {
        result = absoluteFilePath
      } else {
        result.push(absoluteFilePath)
      }
    }
  }
  return result
}

const ajv = new Ajv({ allErrors: true })

;(() => {
  const files = getFiles(path.resolve(__dirname, '../schemas'))
  for (const schemaFile of files) {
    if (!schemaFile) {
      continue
    }
    const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'))
    try {
      ajv.addSchema(schema)
    } catch (e) {
      console.error(e)
    }
  }
})()

module.exports = {
  getFiles,
  ajv,
}
