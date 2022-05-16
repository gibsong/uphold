const dao = require('./history')

const controllers = {
    history: async (req, res) => {
        await dao.getHistory(req.params.ticker)
            .then((result) => {
                res.json(result);
            })
    },
};

module.exports = controllers;