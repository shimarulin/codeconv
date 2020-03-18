async function readJsonFile (helper, filePath = 'package.json') {
  const file = await helper.readFile(filePath)
  return JSON.parse(file)
}

module.exports = {
  readJsonFile,
}
