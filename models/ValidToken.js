class ValidToken {
    constructor(token, email) {
        this.token = token
        this.email = email
    }

    getResponse() {
        let response = {
            Token: this.token,
            Email: this.email
        }
        return response
    }
}

module.exports = ValidToken