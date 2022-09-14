import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
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
            moveHistory: [],
            stepNumber: 0,
            isXNext: true,
        }
    };

    nextPlayer() {
        return this.state.isXNext ? 'X' : 'O';
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        console.log('Move: ' + getCoordinateForIndex(i))
        const moveHistory = this.state.moveHistory.slice(0, this.state.stepNumber);
        moveHistory.push(getCoordinateForIndex(i))

        squares[i] = this.nextPlayer();
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            moveHistory: moveHistory,
            stepNumber: history.length,
            isXNext: !this.state.isXNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            isXNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const moveHistory = this.state.moveHistory;

        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';


            
            const moveCoordinate = move ? 
                'Move:' + moveHistory[move - 1] :
                '';

            return (
                <li key={move}>
                    <div>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                        {moveCoordinate}
                    </div>
                </li>
            )
        })

        const stepNumber = this.state.stepNumber;
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + this.state.isXNext ? 'X' : 'O';
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
                    <div>{stepNumber}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function getCoordinateForIndex(index) {
    const coords = [
        "(1,1)", "(1,2)", "(1,3)",
        "(2,1)", "(2,2)", "(2,3)",
        "(3,1)", "(3,2)", "(3,3)",
    ];
    console.log('Index: ' + index + ', Coordinate:' + coords[index])

    return coords[index];

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

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
