let express = require('express');
let routes = express.Router();
let categoryController = require('../controllers/category.controller')

//Getting category's
routes.get('/category', categoryController.getAllCategories())
routes.get('/category/:IDCategory', categoryController.getCategoryByID())

//Posting a new category
routes.post('/category', categoryController.addCategory())

//Deleting a category
routes.delete('/category/:IDCategory', categoryController.deleteCategoryByID())

//editing categories
routes.put('/category/:IDCategory', categoryController.editCategoryByID())

module.exports = routes