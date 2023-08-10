'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      try {
        const puzzleStr = req.body.puzzle;
        const coordinateStr = req.body.coordinate;
        const valueStr = req.body.value;

        res.json(solver.checkValuePlacement(puzzleStr, coordinateStr, valueStr));
      } catch (err) {
        res.json({ error: err.message });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      try {
        const solution = solver.solve(req.body.puzzle);

        res.json({ solution: solution });
      } catch (err) {
        res.json({ error: err.message });
      }
    });
};
