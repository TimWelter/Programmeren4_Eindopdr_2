class SharerResponse {

    constructor(firstName, lastName, email){
        this.firstName = firstName,
        this.lastName = lastName,
        this.email = email
    }

    getResponse(){
        let response = {
            voornaam: this.firstName,
            achternaam: this.lastName,
            email: this.email
        }
        return response
    }
}
module.exports = SharerResponse