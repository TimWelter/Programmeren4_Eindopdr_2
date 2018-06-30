const assert = require('assert')
const ApiError = require('../models/ApiError')

class UserLogin {
    constructor(email, password) {
        try {
            assert(typeof(email) === 'string', "Not a valid email")
            assert(typeof(password) === 'string', "Password must be a string")
        } catch (ex) {
            throw(new ApiError(ex.toString(), 422))
        }

        this.email = email
        this.password = password
    }

    getEmail() {
        return this.email
    }

    getPassword() {
        return this.password
    }
}

module.exports = UserLogin