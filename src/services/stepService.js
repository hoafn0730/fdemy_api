const db = require('~/models');
const methodsService = require('./index');

module.exports = {
    ...methodsService('Step'),
    bulkCreate: (data) => {
        db.Step.bulkCreate(data);
    },
};
