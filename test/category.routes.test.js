const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const assert = require('assert');
const mocha = require('mocha')
chai.should()
chai.use(chaiHttp)
const endpoint = '/api/category'
let token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMDk3NzgsImlhdCI6MTUzMDQ0NTc3OCwic3ViIjp7InVzZXIiOiJuaWV0dmVyd2lqZGVyZW5AZ21haWwuY29tIiwicm9sZSI6InNwdWxsZW5kZWxlbnVzZXIiLCJpZCI6NCwibmFtZSI6IlRlc3QgYm90In19.vnMDpHeBhVShBarmbAfVihGxMK6vsGdH4ui6pAcjQQc"
let wrongToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMDk3NzgsImlhdCI6MTUzMDQ0NTc3OCwic3ViIjp7InVzZXIiOiJuaWV0dmVyd2lqZGVyZW5AZ21haWwuY29tIiwicm9sZSI6InNwdWxsZW5kZWxlbnVzZXIiLCJpZCI6NCwibmFtZSI6IlRlc3QgYm90In19.vnMDpHeBhVShBarmbAfVihGxMK6vsGdH4ui6pAcjQQk"


describe('Get categories', () => {
  it('should throw 401 when no token is provided', (done) => {
    chai.request(server)
      .get(endpoint)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })

  })
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .get(endpoint)
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })

  })
  it('should return status 200 when a correct token is provided', (done) => {
    chai.request(server)
      .get(endpoint)
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })

  })
})

describe('Get specific categories', () => {
  it('should throw 401 when no token is provided', (done) => {
    chai.request(server)
      .get(endpoint + "/1")
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })
  })
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .get(endpoint + "/1")
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        done()
      })

  })
  it('should return status 200 when a correct token is provided and category ID exists', (done) => {
    chai.request(server)
      .get(endpoint + "/1")
      .set('x-access-token', token)
      .end((err, res) => {
        const result = res.body.result
        result.should.have.property('ID')
        result.should.have.property('Naam')
        result.should.have.property('Beschrijving')
        result.should.have.property('Beheerder')
        result.should.have.property('Email')
        res.should.have.status(200)
        done()
      })

  })
  it('should return status 404 when an invalid ID was provided', (done) => {
    chai.request(server)
      .get(endpoint+"/99999")
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404)
        done()
      })

  })
})