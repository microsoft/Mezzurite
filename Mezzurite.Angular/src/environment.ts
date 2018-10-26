/**
 * Gets information from package.json
 */
const environment = {
    version: require('../package.json').version,
    name: require('../package.json').name
};

export { environment }