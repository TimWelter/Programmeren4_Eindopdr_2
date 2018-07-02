const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../server')
const db = require('../config/db')
const assert = require('assert');
const mocha = require('mocha')
chai.should()
chai.use(chaiHttp)
const endpoint = '/api/category'
let wrongToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1MzEzMDk3NzgsImlhdCI6MTUzMDQ0NTc3OCwic3ViIjp7InVzZXIiOiJuaWV0dmVyd2lqZGVyZW5AZ21haWwuY29tIiwicm9sZSI6InNwdWxsZW5kZWxlbnVzZXIiLCJpZCI6NCwibmFtZSI6IlRlc3QgYm90In19.vnMDpHeBhVShBarmbAfVihGxMK6vsGdH4ui6pAcjQQk"


describe('Get categories', () => {
  it('should throw 401 when no token is provided', (done) => {
    chai.request(server)
      .get(endpoint)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .get(endpoint)
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should return status 200 when a correct token is provided', (done) => {
    const token = require('./authentication.routes.test').validToken
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
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })
  })
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .get(endpoint + "/1")
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should return status 200 when a correct token is provided and category ID exists', (done) => {
    const token = require('./authentication.routes.test').validToken
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
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .get(endpoint + "/99999")
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(404)
        error.should.have.property('datetime')
        done()
      })

  })
})
describe('Add a category', () => {
  it('should throw 401 when no token is provided', (done) => {
    chai.request(server)
      .post(endpoint)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  }) 
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should return status 200 when a correct token is provided, and naam and beschrijving are valid', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
        'naam': 'testCategorie',
        'beschrijving': 'Deze categorie is gemaakt door de test'
    })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })

  })
  it('should throw error 412 when naam has an invalid type', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
        'naam': 12345,
        'beschrijving': 'Deze categorie is gemaakt door de test'
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
  it('should throw error 412 when beschrijving has an invalid type', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
        'naam': "testCategorie",
        'beschrijving': 12345
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
  it('should throw error 412 when naam and beschrijving have an invalid type', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
        'naam': 12345,
        'beschrijving': 12345
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
  it('should throw error 412 when naam is non-existent', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
        'beschrijving': 'Deze categorie is gemaakt door de test'
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
  it('should throw error 412 when beschrijving is non-existent', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
        'naam': "testCategorie"
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
  it('should throw error 412 when naam and beschrijving is non-existent', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .post(endpoint)
      .set('x-access-token', token)
      .send({
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
describe('Edit a category', () => {
  it('should throw 401 when no token is provided', (done) => {
    chai.request(server)
      .put(endpoint)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .put(endpoint)
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should return status 200 when a correct token is provided, the author is logged in, and category id is correct', (done) => {
    const token = require('./authentication.routes.test').validToken
    db.query('SELECT * FROM categorie ORDER BY ID DESC',
        (err, rows, fields) => {
            if (err) {
              
                const error = new ApiError(err, 412)
                next(error);
            } else {
               let categoryToBeEdited = rows[0]
               let IdToBeEdited = categoryToBeEdited.ID

               chai.request(server)
               .put(endpoint+"/"+IdToBeEdited)
               .set('x-access-token', token)
               .send({
                'naam': "testCategorieAangepast",
                'beschrijving': "Deze categorie is aangepast door de test"
               })
               .end((err, res) => {
                 res.should.have.status(200)
                 res.body.should.be.a('object')
                 done()
               })
            }
        })
})
it('should throw 412 when naam has an invalid type', (done) => {
  const token = require('./authentication.routes.test').validToken
  db.query('SELECT * FROM categorie ORDER BY ID DESC',
      (err, rows, fields) => {
          if (err) {
            
              const error = new ApiError(err, 412)
              next(error);
          } else {
             let categoryToBeEdited = rows[0]
             let IdToBeEdited = categoryToBeEdited.ID

             chai.request(server)
             .put(endpoint+"/"+IdToBeEdited)
             .set('x-access-token', token)
             .send({
              'naam': 12345,
              'beschrijving': "Deze categorie is aangepast door de test"
             })
             .end((err, res) => {
               res.should.have.status(412)
               const error = res.body
               error.should.have.property('message')
               error.should.have.property('code').equals(412)
               error.should.have.property('datetime')
               done()
             })
          }
      })
})
it('should throw 412 when beschrijving has an invalid type', (done) => {
  const token = require('./authentication.routes.test').validToken
  db.query('SELECT * FROM categorie ORDER BY ID DESC',
      (err, rows, fields) => {
          if (err) {
            
              const error = new ApiError(err, 412)
              next(error);
          } else {
             let categoryToBeEdited = rows[0]
             let IdToBeEdited = categoryToBeEdited.ID

             chai.request(server)
             .put(endpoint+"/"+IdToBeEdited)
             .set('x-access-token', token)
             .send({
              'naam': "testCategorieAangepast",
              'beschrijving': 12345
             })
             .end((err, res) => {
               res.should.have.status(412)
               const error = res.body
               error.should.have.property('message')
               error.should.have.property('code').equals(412)
               error.should.have.property('datetime')
               done()
             })
          }
      })
})
it('should throw 412 when beschrijving and naam have an invalid type', (done) => {
  const token = require('./authentication.routes.test').validToken
  db.query('SELECT * FROM categorie ORDER BY ID DESC',
      (err, rows, fields) => {
          if (err) {
            
              const error = new ApiError(err, 412)
              next(error);
          } else {
             let categoryToBeEdited = rows[0]
             let IdToBeEdited = categoryToBeEdited.ID

             chai.request(server)
             .put(endpoint+"/"+IdToBeEdited)
             .set('x-access-token', token)
             .send({
              'naam': 12345,
              'beschrijving': 12345
             })
             .end((err, res) => {
               res.should.have.status(412)
               const error = res.body
               error.should.have.property('message')
               error.should.have.property('code').equals(412)
               error.should.have.property('datetime')
               done()
             })
          }
      })
})
it('should throw 412 when naam is non-existant', (done) => {
  const token = require('./authentication.routes.test').validToken
  db.query('SELECT * FROM categorie ORDER BY ID DESC',
      (err, rows, fields) => {
          if (err) {
            
              const error = new ApiError(err, 412)
              next(error);
          } else {
             let categoryToBeEdited = rows[0]
             let IdToBeEdited = categoryToBeEdited.ID

             chai.request(server)
             .put(endpoint+"/"+IdToBeEdited)
             .set('x-access-token', token)
             .send({
              'beschrijving': 12345
             })
             .end((err, res) => {
               res.should.have.status(412)
               const error = res.body
               error.should.have.property('message')
               error.should.have.property('code').equals(412)
               error.should.have.property('datetime')
               done()
             })
          }
      })
})
it('should throw 412 when beschrijving is non-existant', (done) => {
  const token = require('./authentication.routes.test').validToken
  db.query('SELECT * FROM categorie ORDER BY ID DESC',
      (err, rows, fields) => {
          if (err) {
            
              const error = new ApiError(err, 412)
              next(error);
          } else {
             let categoryToBeEdited = rows[0]
             let IdToBeEdited = categoryToBeEdited.ID

             chai.request(server)
             .put(endpoint+"/"+IdToBeEdited)
             .set('x-access-token', token)
             .send({
              'naam': 12345
             })
             .end((err, res) => {
               res.should.have.status(412)
               const error = res.body
               error.should.have.property('message')
               error.should.have.property('code').equals(412)
               error.should.have.property('datetime')
               done()
             })
          }
      })
})
it('should throw 412 when naam and beschrijving is non-existant', (done) => {
  const token = require('./authentication.routes.test').validToken
  db.query('SELECT * FROM categorie ORDER BY ID DESC',
      (err, rows, fields) => {
          if (err) {
            
              const error = new ApiError(err, 412)
              next(error);
          } else {
             let categoryToBeEdited = rows[0]
             let IdToBeEdited = categoryToBeEdited.ID

             chai.request(server)
             .put(endpoint+"/"+IdToBeEdited)
             .set('x-access-token', token)
             .send({
             })
             .end((err, res) => {
               res.should.have.status(412)
               const error = res.body
               error.should.have.property('message')
               error.should.have.property('code').equals(412)
               error.should.have.property('datetime')
               done()
             })
          }
      })
})
})
describe('Delete a category', () => {
  it('should throw 401 when no token is provided', (done) => {
    chai.request(server)
      .delete(endpoint)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })
  it('should throw 401 when a wrong token is provided', (done) => {
    chai.request(server)
      .delete(endpoint)
      .set('x-access-token', wrongToken)
      .end((err, res) => {
        res.should.have.status(401)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(401)
        error.should.have.property('datetime')
        done()
      })

  })

  it('should return status 200 when a correct token is provided, the author is logged in, and category id is correct', (done) => {
    const token = require('./authentication.routes.test').validToken
      db.query('SELECT * FROM categorie ORDER BY ID DESC',
          (err, rows, fields) => {
              if (err) {
                
                  const error = new ApiError(err, 412)
                  next(error);
              } else {
                 let categoryToBeDeleted = rows[0]
                 let IdToBeDeleted = categoryToBeDeleted.ID

                 chai.request(server)
                 .delete(endpoint+"/"+IdToBeDeleted)
                 .set('x-access-token', token)
                 .end((err, res) => {
                   res.should.have.status(200)
                   res.body.should.be.a('object')
                   done()
                 })
              }
          })
  })

  it('should return status 404 when an invalid ID was provided', (done) => {
    const token = require('./authentication.routes.test').validToken
    chai.request(server)
      .delete(endpoint + "/99999")
      .set('x-access-token', token)
      .end((err, res) => {
        res.should.have.status(404)
        const error = res.body
        error.should.have.property('message')
        error.should.have.property('code').equals(404)
        error.should.have.property('datetime')
        done()
      })

  })

})