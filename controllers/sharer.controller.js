const ApiError = require('../models/ApiError')
const assert = require('assert')
const db = require('../config/db')
const Sharer = require('../models/Sharer')
const SharerResponse = require('../models/SharerResponse')


module.exports = {

    addSharer(req, res, next) {

        let sharer
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            sharer = new Sharer(req.user.id, req.params.IDCategory, req.params.IDSpullen)
        } catch (ex) {
            const error = new ApiError(ex.toString(), 401)
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
                        const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet)', 404)
                        next(error);
                    } else {
                        db.query('SELECT * FROM delers WHERE UserID = ? AND categorieID = ? AND spullenID = ?', [sharer.getUserId(), sharer.getCategoryId(), sharer.getSpullenId()],
                            (err, rows, fields) => {
                                if (err) {
                                    const error = new ApiError(err.toString(), 412)
                                    next(error)
                                } else if (rows.length === 1) {
                                    const error = new ApiError("U bent al deler van dit item", 409)
                                    next(error)
                                } else {
                                    db.query('INSERT INTO `delers` (`UserID`, `categorieID`, spullenID) VALUES (?,?,?)', [sharer.getUserId(), sharer.getCategoryId(), sharer.getSpullenId()],
                                        (err, rows, fields) => {
                                            if (err) {
                                                const error = new ApiError(err.toString(), 412)
                                                next(error);
                                            } else {
                                                db.query('SELECT Voornaam, Achternaam, Email FROM view_delers WHERE categorieID = ? AND spullenID = ? AND Email = ?', [sharer.getCategoryId(), sharer.getSpullenId(), req.user.user],
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

    getSharers(req, res, next) {
        try {
            db.query('SELECT Voornaam, Achternaam, Email FROM view_delers WHERE categorieID = ? AND spullenID = ?', [req.params.IDCategory, req.params.IDSpullen],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else if (rows.length < 1) {
                        const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet of er zijn geen delers gevonden)', 404)
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

        try {
            assert(req.user && req.user.id, 'User ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 401)
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
                        if (rows.length !== 1) {
                            const error = new ApiError('Niet gevonden (categorieId of spullenId bestaat niet of er zijn geen delers gevonden)', 404)
                            next(error);
                        } else {
                            if (rows[0].UserID !== req.user.id) {
                                const error = new ApiError('Conflict (Gebruiker mag deze data niet verwijderen)', 409)
                                next(error);
                            } else {
                                db.query('DELETE FROM delers WHERE UserID = ? AND categorieID = ? AND spullenID = ?', [req.user.id, req.params.IDCategory, req.params.IDSpullen],
                                    (err, rows, fields) => {
                                        if (err) {
                                            const error = new ApiError(err, 412)
                                            next(error);
                                        } else {
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