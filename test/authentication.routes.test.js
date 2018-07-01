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
    it('should throw 412 ')


})

