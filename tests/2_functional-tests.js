const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js')

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Post valid puzzle', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: puzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.solution, solution)
        done();
      });
  });

  test('Post missing puzzle', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const solution = puzzlesAndSolutions[0][1];
    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Required field missing')
        done();
      });
  });

  test('Post invalid character', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const indexToChange = 15;
    const invalidCharacter = 'a'
    const invalidatedPuzzle = puzzle.slice(0, indexToChange) + invalidCharacter + puzzle.slice(indexToChange + 1);

    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: invalidatedPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done();
      });
  });

  test('Post short puzzle', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const invalidatedPuzzle = puzzle.slice(0, 75);

    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: invalidatedPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done();
      });
  });

  test('Post unsolvable puzzle', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const indexToChange = 1;
    const invalidSolution = '1'
    const invalidatedPuzzle = puzzle.slice(0, indexToChange) + invalidSolution + puzzle.slice(indexToChange + 1);

    chai
      .request(server)
      .keepOpen()
      .post('/api/solve')
      .send({ puzzle: invalidatedPuzzle })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Puzzle cannot be solved')
        done();
      });
  });


  test('Post check valid number', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'A2',
        value: '3'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test('Post check single conflict', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'A2',
        value: '4'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  test('Post check multiple conflicts', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'A2',
        value: '1'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Post check all conflicts', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'B5',
        value: '1'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.valid, false);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  test('Post check missing value', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'B5'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  test('Post check invalid characters', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const indexToChange = 15;
    const invalidCharacter = 'a'
    const invalidatedPuzzle = puzzle.slice(0, indexToChange) + invalidCharacter + puzzle.slice(indexToChange + 1);

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: invalidatedPuzzle,
        coordinate: 'A1',
        value: '1'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  test('Post check short puzzle', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];
    const invalidatedPuzzle = puzzle.slice(0, 75);

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: invalidatedPuzzle,
        coordinate: 'A1',
        value: '1'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  test('Post check invalid coordinate', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'J9',
        value: '1'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  test('Post check invalid value', function (done) {
    const puzzle = puzzlesAndSolutions[0][0];

    chai
      .request(server)
      .keepOpen()
      .post('/api/check')
      .send({
        puzzle: puzzle,
        coordinate: 'A1',
        value: '15'
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});
