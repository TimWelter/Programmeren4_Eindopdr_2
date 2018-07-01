const ApiError = require('../models/ApiError')
const assert = require('assert')
const db = require('../config/db')
const Category = require('../models/Category')
const CategoryResponse = require('../models/CategoryResponse')
let category


module.exports = {

    addCategory(req, res, next) {
        try {
            assert(req.user && req.user.id, 'User ID is missing!')
            assert(typeof (req.body) === 'object', 'request body must have an object containing naam and adres.')
            category = new Category(req.body.naam, req.body.beschrijving)
        } catch (ex) {
            const error = new ApiError(ex.toString(), 422)
            next(error)
            return
        }

        try {
            db.query('INSERT INTO `categorie` (`Naam`, `Beschrijving`, UserID) VALUES (?,?,?)', [category.getName(), category.getDescription(), req.user.id],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err.toString(), 412)
                        next(error);
                    } else {
                        let categoryResponse = new CategoryResponse(rows.insertId, category.getName(), category.getDescription(), req.user.name, req.user.user)
                        res.status(200).json(
                            categoryResponse.getResponse()
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
    getAllCategories(req, res, next) {
        try {
            db.query('SELECT * FROM view_categorie',
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else if (rows.length === 0) {
                        const error = new ApiError("Geen categorieen gevonden", 404)
                        next(error)
                    } else {
                        res.status(200).json({
                            categories: rows
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
    getCategoryByID(req, res, next) {
        try {
            assert(req.params.IDCategory, 'ID is missing!')
        } catch (ex) {
            const error = new ApiError(ex.toString(), 500)
            next(error)
            return
        }

        try {

            db.query('SELECT * FROM view_categorie WHERE ID = ?', [req.params.IDCategory],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else if (rows.length === 0) {
                        const error = new ApiError('Niet gevonden (categorieId bestaat niet)', 404)
                        next(error);
                    } else {
                        res.status(200).json({
                            result: rows[0]
                        }).end()
                    }
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
            category = new Category(req.body.naam, req.body.beschrijving)
        } catch (ex) {
            const error = new ApiError(ex.toString(), 422)
            next(error)
            return
        }
        // Hier hebben we de juiste body als input.

        let ID = req.params.IDCategory
        // 1. Zoek in db of studentenhuis met huisId bestaat
        try {
            db.query('SELECT * FROM categorie WHERE ID = ?', [ID],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else {
                        // rows MOET hier 1 waarde bevatten - nl. de gevonden categorie.
                        if (rows.length !== 1) {
                            // zo nee, dan error 
                            const error = new ApiError('Niet gevonden (categorieId bestaat niet)', 404)
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
                                    'UPDATE categorie SET Naam = ?, Beschrijving = ? WHERE ID = ?', [category.getName(), category.getDescription(), req.params.IDCategory],
                                    (err, rows, fields) => {
                                        if (err) {
                                            // handle error
                                            const error = new ApiError(err, 412)
                                            next(error);
                                        } else {
                                            // handle success
                                            db.query('SELECT * FROM view_categorie WHERE ID = ?', [req.params.IDCategory],
                                                (err, rows, fields) => {
                                                    if(err) {
                                                        const error = new ApiError(err.toString, 412)
                                                        next(error)
                                                    }
                                                    let categoryResponse = new CategoryResponse(rows[0].ID, category.getName(), category.getDescription(), rows[0].Beheerder, rows[0].Email)
                                                    res.status(200).json(
                                                        categoryResponse.getResponse()
                                                    ).end()
                                                })
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

        let ID = req.params.IDCategory
        // 1. Zoek in db of studentenhuis met huisId bestaat
        console.log(req.params.IDCategory)
        try {
            db.query('SELECT * FROM `categorie` WHERE ID = ?', [ID],
                (err, rows, fields) => {
                    if (err) {
                        const error = new ApiError(err, 412)
                        next(error);
                    } else {
                        // rows MOET hier 1 waarde bevatten - nl. de gevonden categorie.
                        if (rows.length !== 1) {
                            // zo nee, dan error 
                            const error = new ApiError('Niet gevonden (categorieId bestaat niet)', 404)
                            next(error);
                        } else {
                            // zo ja, dan
                            // - check eerst of de huidige user de 'eigenaar' van de catagorie is
                            if (rows[0].UserID !== req.user.id) {
                                //  - zo nee, error
                                const error = new    ApiError('Conflict (Gebruiker mag deze data niet verwijderen)', 409)
                                next(error);
                            } else {
                                //  - zo ja, dan SQL query UPDATE
                                db.query(
                                    'DELETE FROM categorie WHERE ID = ?', [req.params.IDCategory],
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