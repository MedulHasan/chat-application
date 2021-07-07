const moment = require('moment')

module.exports = () => {
    return (req, res, next) => {
        res.locals.moment = (time) => moment(time).fromNow()
        next()
    }
}