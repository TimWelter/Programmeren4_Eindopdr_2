const assert = require('assert')
const ApiError = require('../models/ApiError')
const db = require('../config/db')
const auth = require('../util/auth/authentication')
const bcrypt = require('bcryptjs')
const UserLogin = require('../models/UserLogin')
const UserRegister = require('../models/UserRegister')
const ValidToken = require('../models/ValidToken')

module.exports = {
    validateToken(req, res, next) {
        console.log('validateToken called')
        const token = req.header('x-access-token') || ''

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                // Invalid token
                const error = new ApiError('Niet geautoriseerd (geen valid token)', 401)
                next(error)
            } else {
                console.log('Authenticated! Payload = ')
                console.dir(payload)
                console.log("PAYLOAD:" + payload.sub)
                req.user = payload.sub
                next()
            }
        })
    },
    login(req, res, next) {
        let loginInfo
        try {
            loginInfo = new UserLogin(req.body.email, req.body.password)
        } catch (ex) {
            const error = new ApiError(ex.message, ex.code)
            next(error)
            return
        }

        const query = {
            sql: 'SELECT * FROM user WHERE Email = ?',
            values: [loginInfo.getEmail()]
        }
        db.query(query, (error, rows, fields) => {
            if (error) {
                next(new ApiError(error, 412));
            } else {
                if (rows.length !== 0 && loginInfo.getPassword() === rows[0].Password) {
                    const payload = {
                        user: rows[0].Email,
                        role: 'spullendelenuser',
                        id: rows[0].ID,
                        name: rows[0].Voornaam + " " + rows[0].Achternaam
                    }
                    let tokenResponse = new ValidToken(auth.encodeToken(payload), loginInfo.getEmail())
                    res.status(200).json(tokenResponse.getResponse()).end()
                } else {
                    console.log(rows[0])
                    res.status(401)
                    next(new ApiError('Invalid credentials, bye.', 401))
                }
            }
        })
    },
    register(req, res, next) {

        let registerInfo
        try {
            registerInfo = new UserRegister(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
        } catch (ex) {
            const error = new ApiError(ex.message, ex.code)
            res.status(412)
            next(error)
            return
        }

        const query = {
            sql: 'SELECT Email FROM user WHERE Email = ?',
            values: [req.body.email]
        }
        db.query(query, (error, result) => {
            if (result.length === 0) {
                const query = {
                    sql: 'INSERT INTO user (Voornaam, Achternaam, Email, Password) VALUES (?, ?, ?, ?)',
                    values: [registerInfo.getFirstName(), registerInfo.getLastName(), registerInfo.getEmail(), registerInfo.getPassword()]
                }
                db.query(query, (error, rows) => {
                    if (error) {
                        next(new ApiError(error, 412))
                    } else {
                        console.log("added user")
                    }
                })
                const query2 = {
                    sql: 'SELECT * FROM user WHERE Email = ?',
                    values: [registerInfo.getEmail()]
                }
                let payload
                db.query(query2, (error, result) => {
                    if (error) {
                        next(new ApiError(error, 401))
                    } else {

                        payload = {
                            user: registerInfo.getEmail(),
                            role: 'spullendelenuser',
                            id: result[0].ID,
                            name: result[0].Voornaam + " " + result[0].Achternaam
                        }
                        const userInfo = {
                            token: auth.encodeToken(payload),
                            email: registerInfo.getEmail()
                        }
                        res.status(200).json(userInfo).end()
                    }
                })



            } else {
                res.status(409)
                next(new ApiError("Email already registered", 409))
            }
        })

    }
}