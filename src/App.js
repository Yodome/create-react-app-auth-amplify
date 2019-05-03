import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { Auth } from 'aws-amplify';
import aws_exports from './aws-exports';
Amplify.configure(aws_exports);

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}


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
      <Square value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
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

class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          history: [{
              squares: Array(9).fill(null),
          }],
          xIsNext: true,
          stepNumber: 0,
      };
      
  }

  handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length -1];
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

      var f1Transfo = (step, move) => {
          var sq = step.squares;
          const desc = move ?
              'Go to move #' + move + ' ' + sq.reduce((prev,cur,i) => { return prev +( cur=='X' ? 1 : 0) ;}):
              'Go to game start';
              return (
                  <li key={move}>
                      <button onClick={() => this.jumpTo(move)}>{desc}</button>
                  </li>
              );
      };
      //const moves = history.map(f1Transfo);

      var s = [1,3,6].reduce((prev,cur,i) => { return prev + cur;},2);
      console.log(s);
      
      function monMap(f1,arr){
          var arr2 = [];
          for(var i=0; i< arr.length; i++){                                
              arr2.push(f1(arr[i], i));
          }
          return arr2;
      }
      /*
      const moves = [];
      for(var i=0; i< history.length; i++){
          var item = history[i];
          var newItem = f1Transfo(item, i);
          moves.push(newItem);
      }*/
      const moves = monMap(f1Transfo,history);
  

      let status;
      if ( winner ) {
          status = 'Winner: ' + winner;
      } else {
          status = "Next playeur: " + (this.state.xIsNext ? 'X' : 'O');
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
          <div>{ status }</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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

export default withAuthenticator(Game, true);
