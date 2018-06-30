let express = require('express');
let routes = express.Router();
let stuffController = require('../controllers/stuff.controller')

//Getting stuff from categories
routes.get('/category/:IDCategory/spullen', stuffController.getStuff)
routes.get('/category/:IDCategory/spullen/:IDSpullen', stuffController.getStuffByID)

//Posting new stuff to category
routes.post('/category/:IDCategory/spullen', stuffController.addStuff)

//Deleting stuff from category
routes.delete('/category/:IDCategory/spullen/:IDSpullen', stuffController.deleteStuffByID)

//editing stuff in category
routes.put('/category/:IDCategory/spullen/:IDSpullen', stuffController.editStuffByID)

module.exports = routes