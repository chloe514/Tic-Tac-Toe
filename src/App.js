import { useState } from 'react';

// Square component: Represents an individual square on the tic-tac-toe board
// Props: value (either 'X', 'O', or null), onSquareClick (function to handle click events)
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component represents the entire board with 9 squares
// Props: xIsNext (boolean indicating if 'X' is the next player), squares (array of 9 elements representing the board state), onPlay (function to handle the state change when a square is clicked)
function Board({ xIsNext, squares, onPlay }) {

  // handleClick function handles a click on a square
  function handleClick(i) {
    // If there's a winner or the square is filled, do nothing
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Copy squares array and update it
    const nextSquares = squares.slice();
    // Set the clicked square to 'X' or 'O' based on current player
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    // Call onPlay with the updated squares array
    onPlay(nextSquares);
  }

  // Determine the winner using the calculateWinner function
  const winner = calculateWinner(squares);
  // Set the status message based on whether there is a winner or whose turn is next
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Return the JSX for the board, including the status message and the squares
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

// Game component: The main game component that represents the overall game and renders the board and move history
export default function Game() {
  // useState hooks to manage the history of moves and the current move
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  // Determine if 'X' is the next player based on the current move index
  const xIsNext = currentMove % 2 === 0;
  // Get the current state of the board from the history
  const currentSquares = history[currentMove];

  // handlePlay updates the game state when a move is made
  // Params: nextSquares (array representing the new state of the board)
  function handlePlay(nextSquares) {
    // Create a new history array that includes the new board state up to the current move
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    // Update the state with the new history and set the current move to the latest move
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // jumpTo allows the user to jump to a specific move in the history
  // Params: nextMove (index of the move to jump to)
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Generate the list of moves for the history buttons
  const moves = history.map((squares, move) => {
    // Description for each move button
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    // Return a list item with a button that calls jumpTo with the move index
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Return the JSX for the game, including the board and the move history
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// calculateWinner function: Determines if there is a winner on the board.
// Params: squares (array representing the state of the board)
// Returns: 'X' or 'O' if there is a winner, otherwise null.
function calculateWinner(squares) {
  // Array of winning line combinations
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Loop through the winning lines and check if any line has the same value (either 'X' or 'O')
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Return the winner ('X' or 'O') if a winning line is found
      return squares[a];
    }
  }
  // Return null if no winner is found
  return null;
}


