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

// interface IBoardState {
// }

// class Board extends React.Component<IBoardProps, IBoardState> {
//   renderSquare(i: number) {
//     return <Square 
//       value={this.props.squares[i]}
//       onClick={() => this.props.onClick(i)}
//     />;
//   }

//   render() {
//     return (
//       <div>
//         <div className="board-row">
//           {this.renderSquare(0)}
//           {this.renderSquare(1)}
//           {this.renderSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(3)}
//           {this.renderSquare(4)}
//           {this.renderSquare(5)}
//         </div>
//         <div className="board-row">
//           {this.renderSquare(6)}
//           {this.renderSquare(7)}
//           {this.renderSquare(8)}
//         </div>
//       </div>
//     );
//   }
// }

function renderSquare(i: number, props: IBoardProps) {
  return (
    <Square
      value={props.squares[i]}
      onClick={() => props.onClick(i)}
    />
  ); 
}


function Board(props: IBoardProps) {  
  return (
    <div>
      <div className="board-row">
        {renderSquare(0, props)}
        {renderSquare(1, props)}
        {renderSquare(2, props)}
      </div>
      <div className="board-row">
        {renderSquare(3, props)}
        {renderSquare(4, props)}
        {renderSquare(5, props)}
      </div>
      <div className="board-row">
        {renderSquare(6, props)}
        {renderSquare(7, props)}
        {renderSquare(8, props)}
      </div>
    </div>
  );
}

interface ISquares {
  squares: string[];
}

function Game() {
  const [history, setHistory] = useState<ISquares[]>([{squares: []}]);
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [stepNumber, setStepNumber] = useState<number>(0);

  const current: ISquares = history[stepNumber];
  const winner: string | null = calculateWinner(current.squares);

  const moves = history.map(
    (step, move) => {
      const desc: string = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick={() => {
              setStepNumber(move);
              setXIsNext((move % 2) === 0)
            }}>
              {desc}
          </button>
        </li>
      );
    }
  )

  let status: string;
  if (winner) {
    status = 'Winner: ' + winner
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">      
        <Board
          squares={current.squares}
          onClick={
            (i: number) => {
              const current: ISquares = history[history.length - 1];
              const squares: string[] = current.squares.slice();
          
              if(calculateWinner(squares) || squares[i]) {
                return;
              }
          
              squares[i] = xIsNext ? 'X' : 'O';
              setHistory(history.concat([{squares: squares}]));
              setStepNumber(history.length);
              setXIsNext(!xIsNext);
            }
          } />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// class Game extends React.Component<IGameProps, IHistoryState> {
//   constructor(props: IGameProps) {
//     super(props);
//     this.state = {
//       history: [{
//         squares: []
//       }],
//       xIsNext: true,
//       stepNumber: 0,
//     }
//   } 

//   handleClick(i: number) {
//     const history: ISquares[] = this.state.history;
//     const current: ISquares = history[history.length - 1];
//     const squares: string[] = current.squares.slice();

//     if(calculateWinner(squares) || squares[i]) {
//       return;
//     }

//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     this.setState({
//       history: history.concat([{
//         squares: squares,
//       }]),
//       stepNumber: history.length,
//       xIsNext: !this.state.xIsNext,
//     })
//   }

//   jumpTo(step: number) {
//    this.setState({
//       stepNumber: step,
//       xIsNext: (step % 2) === 0,
//     })
//   }

//   render() {
//     const history: ISquares[] = this.state.history;
//     const current: ISquares = history[this.state.stepNumber];
//     const winner: string | null = calculateWinner(current.squares);

//     const moves = history.map(
//       (step, move) => {
//           const desc: string = move ?
//           'Go to move #' + move :
//           'Go to game start';

//           return (
//             <li key={move}>
//               <button onClick={() => this.jumpTo(move)}>{desc}</button>
//             </li>
//           );
//       }
//     )

//     let status: string;
//     if (winner) {
//       status = 'Winner: ' + winner
//     } else {
//       status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }

//     return (
//       <div className="game">
//         <div className="game-board">      
//           <Board
//             squares={current.squares}
//             onClick={(i: number) => this.handleClick(i)} />
//         </div>
//         <div className="game-info">
//           <div>{status}</div>
//           <ol>{moves}</ol>
//         </div>
//       </div>
//     );
//   }
// }

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
