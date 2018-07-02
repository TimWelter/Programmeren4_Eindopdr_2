class ValidToken {
    constructor(token, email) {
        this.token = token
        this.email = email
    }

    getResponse() {
        let response = {
            token: this.token,
            email: this.email
        }
        return response
    }
}

module.exports = ValidToken