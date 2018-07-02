let express = require('express');
let routes = express.Router();
let stuffController = require('../controllers/stuff.controller')


routes.get('/category/:IDCategory/spullen', stuffController.getStuff)
routes.get('/category/:IDCategory/spullen/:IDSpullen', stuffController.getStuffByID)


routes.post('/category/:IDCategory/spullen', stuffController.addStuff)


routes.delete('/category/:IDCategory/spullen/:IDSpullen', stuffController.deleteStuffByID)


routes.put('/category/:IDCategory/spullen/:IDSpullen', stuffController.editStuffByID)

module.exports = routes