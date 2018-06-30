const ApiError = require('../models/ApiError')
const assert = require('assert')
const db = require('../config/db')
const Stuff = require('../models/Stuff')
const StufResponse = require('../models/StuffResponse')


module.exports = {

    addCategory(req, res, next) {

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
                db.query('INSERT INTO `spullen` (`Naam`, `Beschrijving`, UserID) VALUES (?,?,?)', [stuff.getName(), stuff.getDescription(), req.user.id],
                    (err, rows, fields) => {
                        if (err) {
                            const error = new ApiError(err.toString(), 412)
                            next(error);
                        } else {
                            //Doesnt Give Correct Response Yet
                            res.status(200).json({
                                status: rows
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
    getAllCategories(req, res, next) {
        try {
            db.getConnection((err, connection) => {
                if (err) {
                    console.dir(ex)
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie',
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            res.status(200).json({
                                result: rows
                            }).end()
                        }
                    })
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
    getCategoryByID(req, res, next) {
        try {
            assert(req.params.IDCategory, 'ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {
            db.getConnection((err, connection) => {
                if (err) {
                    console.dir('Error getting connection from database: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie WHERE ID = ?', [req.params.IDCategory],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            res.status(200).json({
                                result: rows[0]
                            }).end()
                        }
                    })
            })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 412)
            next(error);
        }
    },

    /**
     * Replace an existing object in the database.
     */
    editCategoryByID(req, res, next) {

        // req moet de juiste attributen hebben - het nieuwe studentenhuis
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(req.params.IDCategory, 'ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and adres.')
            assert(typeof (req.body.naam) === 'string', 'naam must be a string.')
            assert(typeof (req.body.beschrijving) === 'string', 'beschrijving must be a string.')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        const ID = req.params.IDCategory
        // 1. Zoek in db of studentenhuis met huisId bestaat
        try {
            db.getConnection((err, connection) => {
                if (err) {
                    console.dir('Error getting connection from database: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie WHERE ID = ?', [ID],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            // rows MOET hier 1 waarde bevatten - nl. de gevonden categorie.
                            if (rows.length !== 1) {
                                // zo nee, dan error 
                                const error = new ApiError(err, 404)
                                next(error);
                            } else {
                                // zo ja, dan
                                // - check eerst of de huidige user de 'eigenaar' van de catagorie is
                                if (rows[0].UserID !== req.user.id) {
                                    //  - zo nee, error
                                    const error = new ApiError(err, 412)
                                    next(error);
                                } else {
                                    //  - zo ja, dan SQL query UPDATE
                                    db.query(
                                        'UPDATE categorie SET Naam = ?, Beschrijving = ? WHERE ID = ?', [req.body.naam, req.body.beschrijving, req.params.IDCategory],
                                        (err, rows, fields) => {
                                            if (err) {
                                                // handle error
                                                const error = new ApiError(err, 412)
                                                next(error);
                                            } else {
                                                // handle success
                                                res.status(200).json({
                                                    result: rows
                                                }).end()
                                            }
                                        })
                                }
                            }
                        }
                    })
            })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },

    deleteCategoryByID(req, res, next) {

        // req moet de juiste attributen hebben - het nieuwe studentenhuis
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(req.params.IDCategory, 'ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        const ID = req.params.IDCategory
        // 1. Zoek in db of studentenhuis met huisId bestaat
        try {
            db.getConnection((err, connection) => {
                if (err) {
                    console.dir('Error getting connection from database: ' + err.toString())
                    const error = new ApiError(err, 500)
                    next(error);
                    return
                }
                connection.query('SELECT * FROM view_categorie WHERE ID = ?', [ID],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            const error = new ApiError(err, 412)
                            next(error);
                        } else {
                            // rows MOET hier 1 waarde bevatten - nl. de gevonden categorie.
                            if (rows.length !== 1) {
                                // zo nee, dan error 
                                const error = new ApiError(err, 404)
                                next(error);
                            } else {
                                // zo ja, dan
                                // - check eerst of de huidige user de 'eigenaar' van de catagorie is
                                if (rows[0].UserID !== req.user.id) {
                                    //  - zo nee, error
                                    const error = new ApiError(err, 412)
                                    next(error);
                                } else {
                                    //  - zo ja, dan SQL query UPDATE
                                    db.query(
                                        'DELETE categorie WHERE ID = ?', [req.params.IDCategory],
                                        (err, rows, fields) => {
                                            if (err) {
                                                // handle error
                                                const error = new ApiError(err, 412)
                                                next(error);
                                            } else {
                                                // handle success
                                                res.status(200).json({
                                                    result: rows
                                                }).end()
                                            }
                                        })
                                }
                            }
                        }
                    })
            })
        } catch (ex) {
            console.dir(ex)
            const error = new ApiError(ex, 500)
            next(error);
        }
    },
}