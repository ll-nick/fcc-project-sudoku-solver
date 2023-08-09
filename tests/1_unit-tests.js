const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
puzzlesAndSolutions = require('../controllers/puzzle-strings.js')
const solver = new Solver();

const randomPlacement = () => Math.floor(Math.random() * 9);

suite('Unit Tests', () => {

    test('handle valid puzzle', () => {
        const puzzle = puzzlesAndSolutions[0][0];

        assert.doesNotThrow(solver.validate(puzzle));
    });

    test('handle invalid characters', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const indexToChange = 15;
        const invalidCharacter = 'a'
        const invalidatedPuzzle = puzzle.slice(0, indexToChange) + invalidCharacter + puzzle.slice(indexToChange + 1);

        assert.throws(() => solver.validate(invalidatedPuzzle), 'Invalid characters in puzzle');
    })

    test('handle invalid characters', () => {
        const invalidPuzzle = '123456789';

        assert.throws(() => solver.validate(invalidPuzzle), 'Expected puzzle to be 81 characters long');
    })

    test('handle valid row placement', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];

        const row = randomPlacement();
        const column = randomPlacement();
        value = solution[row * 9 + column];

        assert.isTrue(checkRowPlacement(puzzle, row, column, value));
    })

    test('handle invalid row placement', () => {
        const puzzle = puzzlesAndSolutions[0][0];

        const row = 0;
        const column = 1;
        value = 1;

        assert.isFalse(checkRowPlacement(puzzle, row, column, value));
    })

    test('handle valid column placement', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];

        const row = randomPlacement();
        const column = randomPlacement();
        value = solution[row * 9 + column];

        assert.isTrue(checkColPlacement(puzzle, row, column, value));
    })

    test('handle invalid column placement', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];

        const row = 1;
        const column = 0;
        value = 1;

        assert.isFalse(checkColPlacement(puzzle, row, column, value));
    })

    test('handle valid region placement', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];

        const row = randomPlacement();
        const column = randomPlacement();
        value = solution[row * 9 + column];

        assert.isTrue(checkRegionPlacement(puzzle, row, column, value));
    })

    test('handle invalid region placement', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];

        const row = 1;
        const column = 0;
        value = 1;

        assert.isFalse(checkRegionPlacement(puzzle, row, column, value));
    })

    test('handle valid puzzle', () => {
        const puzzle = puzzlesAndSolutions[0][0];

        assert.doesNotThrow(solver.solve(puzzle));
    });

    test('handle invalid puzzle', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const indexToChange = 15;
        const invalidCharacter = 'a'
        const invalidatedPuzzle = puzzle.slice(0, indexToChange) + invalidCharacter + puzzle.slice(indexToChange + 1);

        assert.throws(() => solver.solve(invalidatedPuzzle), 'Invalid characters in puzzle');

        invalidatedPuzzle = '123456789'
        assert.throws(() => solver.solve(invalidPuzzle), 'Expected puzzle to be 81 characters long');
    })

    test('solve valid puzzle', () => {
        const puzzle = puzzlesAndSolutions[0][0];
        const solution = puzzlesAndSolutions[0][1];
        const result = solver.solve(puzzle);

        assert.equal(result, solution);
    });

});
