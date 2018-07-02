let express = require('express');
let routes = express.Router();
let categoryController = require('../controllers/category.controller')


routes.get('/category', categoryController.getAllCategories)
routes.get('/category/:IDCategory', categoryController.getCategoryByID)


routes.post('/category', categoryController.addCategory)


routes.delete('/category/:IDCategory', categoryController.deleteCategoryByID)


routes.put('/category/:IDCategory', categoryController.editCategoryByID)

module.exports = routes