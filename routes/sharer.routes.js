const routes = require('express').Router()
const sharerController = require('../controllers/sharer.controller')

routes.post('/category/:IDCategory/spullen/:IDSpullen/delers', sharerController.addDeelSharer)
routes.get('/category/:IDCategory/spullen/:IDSpullen/delers', sharerController.getSharer)
routes.delete('/category/:IDCategory/spullen/:IDSpullen/delers', sharerController.deleteSharer)

module.exports = routes