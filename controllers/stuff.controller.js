const ApiError = require('../models/ApiError')
const assert = require('assert')
const db = require('../config/db')
const Stuff = require('../models/Stuff')
const StuffResponse = require('../models/StuffResponse')


module.exports = {

    addStuff(req, res, next) {

        let stuff
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and adres.')
            stuff = new Stuff(req.body.naam, req.body.beschrijving, req.body.merk, req.body.soort, req.body.bouwjaar)
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString()  , ex.code || 422)
            next(error)
            return
        }

        try {
                db.query('INSERT INTO `spullen` (`Naam`, `Beschrijving`, Merk, Soort, Bouwjaar, UserID, categorieID) VALUES (?,?,?,?,?,?,?)', [stuff.getName(), stuff.getDescription(), stuff.getBrand(), stuff.getKind(), stuff.getYear(), req.user.id, req.params.IDCategory],
                    (err, rows, fields) => {
                        if (err) {
                            const error = new ApiError(err.toString(), 412)
                            next(error);
                        } else {
                            stuffResponse = new StuffResponse(rows[0].insertedId, stuff.getName(), stuff.getDescription(), stuff.getBrand(), stuff.getKind(), stuff.getYear())
                            res.status(200).json(
                                stuffResponse.getResponse()
                            ).end()
                        }
                    })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    /**
     * Haal alle items op voor de user met gegeven id. 
     * De user ID zit in het request na validatie! 
     */
    getStuff(req, res, next) {
        try {
                db.query('SELECT ID, Naam, Beschrijving, Merk, Soort, Bouwjaar FROM spullen WHERE categorieID = ?', [req.params.IDCategory],
                    (err, rows, fields) => {
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            res.status(200).json({
                                result: rows
                            }).end()
                        }
                    })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    /**
     * Haal alle items op voor de user met gegeven id. 
     * De user ID zit in het request na validatie! 
     */
    getStuffByID(req, res, next) {
        try {

            db.query('SELECT ID, Naam, Beschrijving, Merk, Soort, Bouwjaar FROM spullen WHERE ID = ?', [req.params.IDSpullen],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else if(rows.length === 0) {
                        const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)
                        next(error)
                    } else {
                        res.status(200).json(
                            rows[0]
                        ).end()
                    }
                })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    /**
     * Replace an existing object in the database.
     */
    editStuffByID(req, res, next) {

        // req moet de juiste attributen hebben - het nieuwe studentenhuis
        let stuff
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and adres.')
            stuff = new Stuff(req.body.naam, req.body.beschrijving, req.body.merk, req.body.soort, req.body.bouwjaar)
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString(), ex.code || 500)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        const ID = req.params.IDSpullen
        // 1. Zoek in db of studentenhuis met huisId bestaat
        try {
            db.query('SELECT * FROM spullen WHERE ID = ?', [ID],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else {
                        // rows MOET hier 1 waarde bevatten - nl. de gevonden categorie.
                        if (rows.length !== 1) {
                            // zo nee, dan error 
                            const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)
                            next(error);
                        } else {
                            // zo ja, dan
                            // - check eerst of de huidige user de 'eigenaar' van de catagorie is
                            if (rows[0].UserID !== req.user.id) {
                                //  - zo nee, error
                                const error = new ApiError('Conflict (Gebruiker mag deze data niet wijzigen)', 409)
                                next(error);
                            } else {
                                //  - zo ja, dan SQL query UPDATE
                                db.query(
                                    'UPDATE spullen SET Naam = ?, Beschrijving = ?, Merk = ?, Soort = ?, Bouwjaar = ?  WHERE ID = ?', [stuff.getName(), stuff.getDescription(), stuff.getBrand(), stuff.getKind(), stuff.getYear(), req.params.IDSpullen],
                                    (err, rows, fields) => {
                                        if (err) {
                                            // handle error
                                            const error = new ApiError(err, 412)
                                            next(error);
                                        } else {
                                            // handle success
                                            stuffResponse = new StuffResponse(ID, stuff.getName(), stuff.getDescription(), stuff.getBrand(), stuff.getKind(), stuff.getYear())
                                            res.status(200).json(
                                                stuffResponse.getResponse()
                                            ).end()
                                        }
                                    })
                            }
                        }
                    }
                })

        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    deleteStuffByID(req, res, next) {

        // req moet de juiste attributen hebben - het nieuwe studentenhuis
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        const ID = req.params.IDSpullen
        // 1. Zoek in db of studentenhuis met huisId bestaat
        try {
            db.query('SELECT * FROM spullen WHERE ID = ?', [ID],
                (err, rows, fields) => {

                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else {
                        // rows MOET hier 1 waarde bevatten - nl. de gevonden categorie.
                        if (rows.length !== 1) {
                            // zo nee, dan error 
                            const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)
                            next(error);
                        } else {
                            // zo ja, dan
                            // - check eerst of de huidige user de 'eigenaar' van de catagorie is
                            if (rows[0].UserID !== req.user.id) {
                                //  - zo nee, error
                                const error = new ApiError('Conflict (Gebruiker mag deze data niet verwijderen)', 409)
                                next(error);
                            } else {
                                //  - zo ja, dan SQL query UPDATE
                                db.query('DELETE FROM spullen WHERE ID = ?', [ID],
                                    (err, rows, fields) => {
                                        if (err) {
                                            // handle error
                                            const error = new ApiError(err, 412)
                                            next(error);
                                        } else {
                                            // handle success
                                            res.status(200).json({
                                                status: 'Item deleted'
                                            }).end()
                                        }
                                    })
                            }
                        }
                    }
                })

        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },
}