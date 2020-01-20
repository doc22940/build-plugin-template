const execa = require('execa')
const { red } = require('chalk')

const { getOptions } = require('./options.js')
const { copyFiles } = require('./copy.js')
const { applyTemplates } = require('./template.js')
const { runTests } = require('./test.js')
const { cleanRepo } = require('./clean.js')

// `npm run init` main logic.
// Initialize/scaffold the template repository.
const init = async function(options) {
  try {
    const { variables } = await getOptions(options)
    await copyFiles()
    await applyTemplates(variables)
    await cleanRepo()
    await execa.command('npm install --loglevel error --no-audit --no-fund', {
      stdio: 'inherit',
    })
    await runTests()
    await execa.command('git add -A')
    await execa.command('git commit -m Init')
  } catch (error) {
    console.error(red('Error: Initialization failed.'))
    await execa.command('git reset --hard')
    throw error
  }
}

module.exports = { init }
