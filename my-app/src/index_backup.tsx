import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { getDefaultCompilerOptions, isPropertyAccessOrQualifiedName } from 'typescript';
import './index.css';

interface ISquareProps {
  value: string;
  onClick: any;  
}

function Square(props: ISquareProps) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

interface IBoardProps {
  squares: string[];
  onClick: any;  
}

interface IBoardState {
}

class Board extends React.Component<IBoardProps, IBoardState> {
  renderSquare(i: number) {
    return <Square 
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

interface IGameProps {  
}

interface ISquares {
  squares: string[];
}

interface IHistoryState {
  history: ISquares[];
  xIsNext: boolean;
  stepNumber: number;
}

class Game extends React.Component<IGameProps, IHistoryState> {
  constructor(props: IGameProps) {
    super(props);
    this.state = {
      history: [{
        squares: []
      }],
      xIsNext: true,
      stepNumber: 0,
    }
  } 

  handleClick(i: number) {
    const history: ISquares[] = this.state.history;
    const current: ISquares = history[history.length - 1];
    const squares: string[] = current.squares.slice();

    if(calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    })
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history: ISquares[] = this.state.history;
    const current: ISquares = history[this.state.stepNumber];
    const winner: string | null = calculateWinner(current.squares);

    const moves = history.map(
      (step, move) => {
          const desc: string = move ?
          'Go to move #' + move :
          'Go to game start';

          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
          );
      }
    )

    let status: string;
    if (winner) {
      status = 'Winner: ' + winner
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">      
          <Board
            squares={current.squares}
            onClick={(i: number) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares: string[]): string | null {
  const lines: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i:number = 0; i < lines.length; i++) {
    const [a, b, c]: number[] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ================

const rootElement = document.getElementById("root")
const root = ReactDOM.createRoot(rootElement!);
root.render(<Game />);

// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
