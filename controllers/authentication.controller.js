const assert = require('assert')
const ApiError = require('../models/ApiError')
const db = require('../config/db')
const auth = require('../util/auth/authentication')
const bcrypt = require('bcryptjs')
const UserLogin = require('../models/UserLogin')
const UserRegister = require('../models/UserRegister')
const ValidToken = require('../models/ValidToken')

module.exports = {

    /**
     * Authenticate the incoming request by validating the JWT token. 
     * On success, we pass further processing to the next express handler.
     * 
     * https://www.sitepoint.com/using-json-web-tokens-node-js/
     * 
     * @param {*} req The incoming request, should contain valid JWT token in headers.
     * @param {*} res None. The request is passed to next for further processing.
     * @param {*} next ApiError when token is invalid, or req containing logged-in user.
     */
    validateToken(req, res, next) {
        console.log('validateToken called')

        /**
         * A token can be sent in the body of a request, via a query parameter (in the URL),
         * or as an HTTP header. We choose the header variant.
         */
        const token = req.header('x-access-token') || ''

        auth.decodeToken(token, (err, payload) => {
            if (err) {
                // Invalid token
                const error = new ApiError(err.message || err, 401)
                next(error)
            } else {
                console.log('Authenticated! Payload = ')
                console.dir(payload)

                /**
                 * The payload contains the values that were put in it via the sub-field.
                 * We could use those in our application to trace actions that a user performs, 
                 * such as monitor CRUD operations, by storing the user ID in a logging database.
                 * Example: User 12345 performed an update operation on item xyz on date dd-mm-yyyy.
                 * To do so, we attach the payload.sub (or only a part of that) to the request object.
                 * In this way, every next express handler has access to it - and could do 
                 * something smart with it.  
                 */

                console.log("PAYLOAD:" + payload.sub)
                req.user = payload.sub
                next()
            }
        })
    },

    /**
     * Log a user in by validating the email and password in the request.
     * Email is supposed to be more unique than a username, so we use that for identification.
     * When the email/password combination is valid a token is returned to the client. 
     * The token provides access to the protected endpoints in subsequent requests, as long 
     * as it is valid and not expired.
     * 
     * Security issue: the password is probably typed-in by the client and sent as 
     * plain text. Anyone listening on the network could read the password. The 
     * connection should therefore be secured and encrypted.
     * 
     * @param {*} req The incoming request, should contain valid JWT token in headers.
     * @param {*} res The token, additional user information, and status 200 when valid.
     * @param {*} next ApiError when token is invalid.
     */

    login(req, res, next) {
        // Verify that we receive the expected input
        let loginInfo
        try {
            loginInfo = new UserLogin(req.body.email, req.body.password)
        } catch (ex) {
            const error = new ApiError(ex.message, ex.code)
            next(error)
            return
        }

        // Verify that the email exists and that the password matches the email.
        let email
        const query = {
            sql: 'SELECT * FROM user WHERE Email = ?',
            values: [loginInfo.getEmail()]
        }
        db.query(query, (error, rows, fields) => {
            if (error) {
                next(new ApiError(error, 401));
            } else {
                if (rows.length !== 0 && loginInfo.getPassword() === rows[0].Password) {
                    // console.log('passwords DID match, sending valid token')
                    // Create an object containing the data we want in the payload.
                    const payload = {
                        user: rows[0].Email,
                        role: 'admin, user'
                    }
                    // User info returned to the caller.
                    let tokenResponse = new ValidToken(auth.encodeToken(payload), loginInfo.getEmail())
                    res.status(200).json(tokenResponse.getResponse()).end()
                } else {
                    // console.log('passwords DID NOT match')
                    console.log(rows[0])
                    res.status(401)
                    next(new ApiError('Invalid credentials, bye.', 401))
                }
            }
        })
    },

    /**
     * Register a new user. The user should provide a firstname, lastname, emailaddress and 
     * password. The emailaddress should be unique when it exists, an error must be thrown.
     * The password will be encrypted by the Person class and must never be stored as plain text! 
     * 
     * @param {*} req The incoming request, containing valid properties.
     * @param {*} res The created user on success, or error on invalid properties.
     * @param {*} next ApiError when supplied properties are invalid.
     */
    register(req, res, next) {

        let registerInfo
        try {
            registerInfo = new UserRegister(req.body.firstname, req.body.lastname, req.body.email, req.body.password)
        } catch (ex) {
            const error = new ApiError(ex.message, ex.code)
            res.status(422)
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
                        next(new ApiError(error, 401))
                    } else {
                        console.log("added user")
                    }
                })


                // Unique email person was added to the list.
                // Choices we can make here: 
                // - return status OK, user must issue separate login request, or
                // - return valid token, user is immediately logged in.

                // Create an object containing the data we want in the payload.
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

                        // Userinfo returned to the caller.
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