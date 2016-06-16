const fs = require('fs');
const routesPath = __dirname + '/routes/';
const routeFiles = fs.readdirSync(routesPath);

module.exports.applyTo = server => {
    routeFiles.forEach(route => {
        server.use(require(routesPath + route));
    });
};
