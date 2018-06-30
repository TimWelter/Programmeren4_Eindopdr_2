class CategooryResponse {
    constructor(ID, name, description, owner, email) {
        this.ID = ID
        this.name = name
        this.description = description
        this.owner = owner
        this.email = email
    }

    getResponse() {
        let response = {
            ID: this.ID,
            Naam: this.name,
            Beschrijving: this.description,
            Beheerder: this.owner,
            Email: this.email
        }
        return response
    }
}
 
    module.exports = StuffResponse