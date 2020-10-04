
const packageInfo = require('../package.json')

const provider = {
  type: 'provider',
  name: 'koop-provider-dgt-datex',
  version: packageInfo.version,
  hosts: false,
  disableIdParam: true,
  Model: require('./model')
}

module.exports = provider
