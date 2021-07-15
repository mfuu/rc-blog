import React from 'react'
import './404.less'

class Square extends React.Component {
  render() {
    return (
      <button 
        className="square"
        onClick={() => this.props.onClick()}>
        {this.props.value}
    </button>
    )
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      key={i}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
  }

  render() {
    return (
      <div>
        {
          Array(3).fill(null).map((itemx, x) => (
            <div className="board-row" key={x}>
            {
              Array(3).fill(null).map((itemy, y) => (
                this.renderSquare(3 * x + y)
              ))
            }
            </div>
          ))
        }
      </div>
    )
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
    [2, 4, 6]
  ]
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winnerName: squares[a],
        winIndex: [a, b, c]
      }
    }
  }
  return null
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      sort: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastIndex: i
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }

  jumpTo(step) {
    for (let i = 0; i < 9; i++) {
      document.getElementsByClassName('square')[i].style = ""
    }
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  order() {
    this.setState({
      sort: !this.state.sort
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move + ' 最后落棋点(列号，行号):（' + parseInt(step.lastIndex / 3) + ', ' + step.lastIndex % 3 + ')':
        'Go to game start';
        return (
          <li key={move}>
            <button
              onClick={() => this.jumpTo(move)}
              className={move === this.state.stepNumber ? 'bold' : ''}>{desc}</button>
          </li>
        )
    })

    let status
    if (winner) {
      status = 'Winner: ' + winner.winnerName
      for (let i of winner.winIndex) {
        document.getElementsByClassName('square')[i].style = "background: lightblue; color: #fff;"
      }
    } else {
      if (this.state.history.length > 9) {
        status = 'No player win! It ends in a draw!'
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      }
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
          {/* <button onClick={() => this.order()}>
            {this.state.sort ? '倒序' : '正序'}
          </button>
          <ol>{this.state.sort ? moves : moves.reverse()}</ol> */}
        </div>
      </div>
    )
  }
} 

export default Game