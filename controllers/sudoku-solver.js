class SudokuSolver {

  validate(puzzleString) {
    if (!puzzleString) throw new Error('Required field missing')
    if (puzzleString.length !== 81) throw new Error('Expected puzzle to be 81 characters long')
    if (!puzzleString.match(/^[\d\.]{81}$/)) throw new Error('Invalid characters in puzzle')
  }

  parse(puzzleString) {
    const puzzle = [];

    for (let i = 0; i < 9; i++) {
      const row = puzzleString.substring(i * 9, (i + 1) * 9).split('').map(cell => (cell === '.' ? 0 : parseInt(cell)));
      puzzle.push(row);
    }

    return puzzle;
  }

  parseCoordinate(coordinate) {
    if (!coordinate) throw new Error('Required field(s) missing');
    if (!coordinate.match(/^[a-iA-I][1-9]$/)) throw new Error('Invalid coordinate');

    const normalizedCoordinate = coordinate.toUpperCase()

    const row = normalizedCoordinate.charCodeAt(0) - 'A'.charCodeAt(0);
    const column = parseInt(normalizedCoordinate.charAt(1)) - 1;

    return [row, column]
  }

  stringify(puzzle) {
    let result = '';

    for (const row of puzzle) {
      for (const cell of row) {
        result += (cell === 0 ? '.' : cell);
      }
    }

    return result;
  }

  checkRowPlacement(puzzle, row, col, value) {
    if (puzzle[row][col] !== 0) {
      if (puzzle[row][col] === value) return true;
      return false;
    }
    for (let currentCol = 0; currentCol < 9; currentCol++) {
      if (col === currentCol) continue;
      if (puzzle[row][currentCol] === value) return false;
    }
    return true;
  }

  checkColPlacement(puzzle, row, col, value) {
    if (puzzle[row][col] !== 0) {
      if (puzzle[row][col] === value) return true;
      return false;
    }
    for (let currentRow = 0; currentRow < 9; currentRow++) {
      if (row === currentRow) continue;
      if (puzzle[currentRow][col] === value) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzle, row, col, value) {
    if (puzzle[row][col] !== 0) {
      if (puzzle[row][col] === value) return true;
      return false;
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;

    for (let currentRow = startRow; currentRow < startRow + 3; currentRow++) {
      for (let currentCol = startCol; currentCol < startCol + 3; currentCol++) {
        if (row === currentRow && col === currentCol) continue;
        if (puzzle[currentRow][currentCol] === value) return false;
      }
    }
    return true;
  }

  isValidNumber(puzzle, row, column, value) {
    return (
      this.checkRowPlacement(puzzle, row, column, value) &&
      this.checkColPlacement(puzzle, row, column, value) &&
      this.checkRegionPlacement(puzzle, row, column, value)
    )
  }

  solve(puzzleString) {
    this.validate(puzzleString);

    let puzzle = this.parse(puzzleString);
    if (this.solveImpl(puzzle)) {
      return this.stringify(puzzle);
    }

    throw new Error('Puzzle cannot be solved')
  }

  solveImpl(puzzle) {
    const emptyCell = this.findEmptyCell(puzzle);

    if (!emptyCell) {
      return true; // All cells filled, puzzle solved
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
      if (this.isValidNumber(puzzle, row, col, num)) {
        puzzle[row][col] = num;

        if (this.solveImpl(puzzle)) {
          return true; // Move to the next empty cell
        }

        // Backtrack if placing num doesn't lead to a solution
        puzzle[row][col] = 0;
      }
    }

    return false; // No valid number found, need to backtrack further
  }

  findEmptyCell(puzzle) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (puzzle[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null;
  }

  checkValuePlacement(puzzleStr, coordinateStr, valueStr) {
    // Annoyingly, in the value check, the error message is expected to have a plural s
    if (!puzzleStr) throw new Error('Required field(s) missing')
    this.validate(puzzleStr);
    const puzzle = this.parse(puzzleStr);

    const [row, col] = this.parseCoordinate(coordinateStr);
    if (!valueStr) throw new Error('Required field(s) missing');
    if (!valueStr.match(/^[1-9]$/)) throw new Error('Invalid value');
    const value = parseInt(valueStr);

    let valid = true;
    let conflict = [];
    if (!this.checkRowPlacement(puzzle, row, col, value)) {
      valid = false;
      conflict.push('row');
    }
    if (!this.checkColPlacement(puzzle, row, col, value)) {
      valid = false;
      conflict.push('column');
    }
    if (!this.checkRegionPlacement(puzzle, row, col, value)) {
      valid = false;
      conflict.push('region');
    }

    if (valid) {
      return { valid: true };
    }
    return {
      valid: false,
      conflict: conflict
    };
  }

}

module.exports = SudokuSolver;

