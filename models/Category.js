const assert = require('assert')
const ApiError = require('../models/ApiError')

class Category {
    constructor(name, description) {
        try {
            assert(typeof(name) === 'string', "Name must be a string")
            assert(typeof(description) === 'string', "Description must be a string")
        } catch (ex) {
            throw(new ApiError(ex.toString(), 422))
        }

        this.name = name
        this.description = description
    }

    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }
}

module.exports = Category