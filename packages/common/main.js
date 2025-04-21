if (process.env.NODE_ENV === 'production') {
    module.exports = require('./lib/cjs/index.production.js');
} else {
    module.exports = require('./lib/cjs/index.development.js');
}