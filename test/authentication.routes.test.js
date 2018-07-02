const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const db = require('../config/db')
const assert = require('assert');
const mocha = require('mocha')
chai.should()
chai.use(chaiHttp)
const endpoint = '/api/'

describe('Register user', () => {
    it('should return status 200 when the correct credentials are given', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(200)
                const body = res.body
                body.should.have.property('token')
                body.should.have.property('email')
                done()
            })
    })

    it('should throw 409 when the user is already registered', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(409)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(409)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when no firstname is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'lastname': 'test',
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when no lastname is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when no email is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when an invalid email is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'email': 'test',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when no password is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'email': 'test@test.nl',
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when firstname is not a string', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 0,
                'lastname': 'test',
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when lastname is not a string', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 0,
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when email is not a string', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'email': 0,
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('should throw 412 when password is not a string', (done) => {
        chai.request(server)
            .post(endpoint + 'register')
            .send({
                'firstname': 'test',
                'lastname': 'test',
                'email': 'test@test.nl',
                'password': 0
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })
})

describe('Login user', () => {
    it('Should return status 200 if credentials are correct', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'email': 'test@test.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(200)
                const body = res.body
                body.should.have.property('token')
                body.should.have.property('email')
                done()
            })
    })

    it('Should throw 401 if email is incorrect', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'email': 'test@tes.nl',
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(401)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(401)
                error.should.have.property('datetime')
                done()
            })
    })

    it('Should throw 401 if password is incorrect', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'email': 'test',
                'password': 'tes'
            })
            .end((err, res) => {
                res.should.have.status(401)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(401)
                error.should.have.property('datetime')
                done()
            })
    })

    it('Should throw 412 when no email is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('Should throw 412 when no password is provided', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'email': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('Should throw 412 when email is not a string', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'email': 0,
                'password': 'test'
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })

    it('Should throw 412 when email is not a string', (done) => {
        chai.request(server)
            .post(endpoint + 'login')
            .send({
                'email': 'test@test.nl',
                'password': 0
            })
            .end((err, res) => {
                res.should.have.status(412)
                const error = res.body
                error.should.have.property('message')
                error.should.have.property('code').equals(412)
                error.should.have.property('datetime')
                done()
            })
    })





})