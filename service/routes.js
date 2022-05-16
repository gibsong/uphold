const controller = require('./controller');

module.exports = (app) => {

    app.route('/api/v1/service/history/:ticker').get( async(req, res) => {
        await controller.history(req, res)
    });
}