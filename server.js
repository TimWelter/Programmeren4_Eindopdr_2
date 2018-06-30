const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const auth_routes = require('./routes/auth.routes')
const category_routes = require('./routes/category.routes')
const sharer_routes = require('./routes/sharer.routes')
const stuff_routes = require('./routes/stuff.routes')
const authController = require('./controllers/authentication.controller')
const ApiError = require('./models/ApiError')
const settings = require('./config/config')

const port = settings.webPort

let app = express()

app.use(bodyParser.json())

app.use(morgan('dev'))

app.use('*', function(req, res, next){
	next()
})

app.use('/api', auth_routes)
app.all('/api', authController.validateToken);
app.use('/api', category_routes)
app.use('/api', sharer_routes)
app.use('/api', stuff_routes)

app.use('*', (req, res, next) => {
	console.log('Non-existing endpoint')
	const error = new ApiError("Deze endpoint bestaat niet", 404)
	next(error)
})

app.use((err, req, res, next) => {
	console.dir(err)
	res.status((err.code || 404)).json(err).end()	
})

app.listen(port, () => {
	console.log('Server running on port ' + port)
})

module.exports = app