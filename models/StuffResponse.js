class StuffResponse {
    constructor(ID, name, description, brand, kind, year) {
        this.ID = ID
        this.name = name
        this.description = description
        this.brand = brand
        this.kind = kind
        this.year = year
    }

    getResponse() {
        let response = {
            ID: this.ID,
            Naam: this.name,
            Beschrijving: this.description,
            Merk: this.brand,
            Soort: this.kind,
            Bouwjaar: this.year
        }
        return response
    }
}
 
    module.exports = StuffResponse
