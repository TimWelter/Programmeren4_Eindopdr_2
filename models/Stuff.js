const assert = require('assert')
const ApiError = require('../models/ApiError')

class Stuff {
    constructor(name, description, brand, kind, year) {
        try {
            assert(typeof (name) === 'string', "Name must be a string")
            assert(typeof (description) === 'string', "Description must be a string")
            assert(typeof (brand) === 'string', "Brand must be a string")
            assert(typeof (kind) === 'string', "Kind must be a string")
            assert(typeof (year) === 'number', "Year must be a number")
        } catch (ex) {
            throw (new ApiError(ex.toString(), 412))
        }

        this.name = name
        this.description = description
        this.brand = brand
        this.kind = kind
        this.year = year
    }

    getName() {
        return this.name
    }

    getDescription() {
        return this.description
    }

    getBrand() {
        return this.brand
    }

    getKind() {
        return this.kind
    }

    getYear() {
        return this.year
    }
}

module.exports = Stuff