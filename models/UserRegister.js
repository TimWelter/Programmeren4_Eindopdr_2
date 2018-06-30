const assert = require('assert')
const ApiError = require('../models/ApiError')

class UserRegister {
    constructor(firstName, lastName, email, password) {
        try {
            assert(typeof(firstName) === 'string', "First name must be a string")
            assert(typeof(lastName) === 'string', "Last namee must be a string")
            assert(typeof(email) === 'string', "Email must be a string")
            assert(email.test(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/), "Not a valid email")
            assert(typeof(password) === 'string', "Password must be a string")
        } catch (ex) {
            throw(new ApiError(ex.toString(), 422))
        }
        
        this.firstName = firstName
        this.lastName = lastName
        this.email = email
        this.password = password
    }

    getFirstName() {
        return this.firstName
    }

    getLastName() {
        return this.lastName
    }

    getEmail() {
        return this.email
    }

    getPassword() {
        return this.password
    }
}

module.exports = UserRegister