import React from "react";
import  ReactDOM  from "react-dom";
import "./index.css";

/*
  TODO: Implement improvements listed here: https://reactjs.org/tutorial/tutorial.html#wrapping-up
  4. Add a toggle button that lets you sort the moves in either ascending or descending order.
  5. When someone wins, highlight the three squares that caused the win.
  6. When no one wins, display a message about the result being a draw.
*/

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const rows = [];
    for (let x = 0; x < 3; x++){
      const squares = [];
      for (let y = 0; y < 3; y++){
        squares.push(this.renderSquare((x * 3) + y));
      }
      rows.push(<div className="board-row" key={x}>{squares}</div>);
    }
    return <div>{rows}</div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    
    const moves = history.map((step, move) => {
      const loc = findMoveLocation(move, history);
      let desc = move ?
        `Go to move #${move} (${loc[0]}, ${loc[1]})` :
        'Go to game start';
      // Make last item bold
      if(move === history.length -1) {
        desc = <strong>{desc}</strong>
      }
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = `Winner: ${winner}`;
    } else {
      status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function findMoveLocation (move, history) {
  if (move === 0) return null;

  const newSquares = history[move].squares.slice();
  const oldSquares = history[move - 1].squares.slice();

  const diffIndex = newSquares.findIndex(function (element, index) {
    return element !== oldSquares[index];
  });

  const [col, row] = [diffIndex % 3 + 1, Math.floor(diffIndex / 3) + 1];

  return [col, row];
}

function calculateWinner(squares) {
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
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <React.StrictMode>
    <Game />
  </React.StrictMode>,
  document.getElementById('root')
);
