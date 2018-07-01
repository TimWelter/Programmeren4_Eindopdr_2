const ApiError = require('../models/ApiError')
const assert = require('assert')
const db = require('../config/db')
const SharerResponse = require('../models/SharerResponse')


module.exports = {

    addSharer(req, res, next) {

        let stuff
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.message || ex.toString(), ex.code || 422)
            next(error)
            return
        }

        try {
            db.query('SELECT * FROM spullen WHERE ID = ?', [req.params.IDSpullen],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else if (rows.length !== 1) {
                        // zo nee, dan error 
                        const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)
                        next(error);
                    } else {
                        db.query('SELECT * FROM delers WHERE UserID = ? AND categorieID = ? AND spullenID = ?', [req.user.id, req.params.IDCategory, req.params.IDSpullen],
                            (err, rows, fields) => {
                                if (err) {
                                    const error = new ApiError(err.toString(), 412)
                                    next(error)
                                } else if (rows.length === 1) {
                                    const error = new ApiError("U bent al deler van dit item", 409)
                                    next(error)
                                } else {
                                    db.query('INSERT INTO `delers` (`UserID`, `categorieID`, spullenID) VALUES (?,?,?)', [req.user.id, req.params.IDCategory, req.params.IDSpullen],
                                        (err, rows, fields) => {
                                            if (err) {
                                                const error = new ApiError(err.toString(), 412)
                                                next(error);
                                            } else {
                                                db.query('SELECT Voornaam, Achternaam, Email FROM view_delers WHERE categorieID = ? AND spullenID = ? AND Email = ?', [req.params.IDCategory, req.params.IDSpullen, req.user.user],
                                                    (err, rows, fields) => {
                                                        let sharerResponse = new SharerResponse(rows[0].Voornaam, rows[0].Achternaam, rows[0].Email)
                                                        res.status(200).json(
                                                            sharerResponse.getResponse()
                                                        ).end()
                                                    })

                                            }
                                        })
                                }
                            })
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
    getSharers(req, res, next) {
        try {
            db.query('SELECT Voornaam, Achternaam, Email FROM view_delers WHERE categorieID = ? AND spullenID = ?', [req.params.IDCategory, req.params.IDSpullen],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else if(rows.length < 1) {
                        const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)
                        next(error)
                    } else {
                        res.status(200).json({
                            delers: rows
                        }).end()
                    }
                })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },
   
    deleteSharer(req, res, next) {

        // req moet de juiste attributen hebben - het nieuwe studentenhuis
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 422)
            next(error)
            return
        }

        try {
            db.query('SELECT * FROM delers WHERE UserID = ? AND categorieID = ? AND spullenID = ?', [req.user.id, req.params.IDCategory, req.params.IDSpullen],
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
                                db.query('DELETE FROM delers WHERE UserID = ? AND categorieID = ? AND spullenID = ?', [req.user.id, req.params.IDCategory, req.params.IDSpullen],
                                    (err, rows, fields) => {
                                        if (err) {
                                            // handle error
                                            const error = new ApiError(err, 412)
                                            next(error);
                                        } else {
                                            // handle success
                                            res.status(200).json({
                                                status: 'Deler deleted'
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