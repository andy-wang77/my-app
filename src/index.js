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

    renderRow(rowNumber) {
        const squares = [];
        const numberOfColumns = this.props.coordinates.cols;
        const offset = rowNumber * numberOfColumns;
        for (let i = 0; i < numberOfColumns; i++) {
            squares.push(
                this.renderSquare(offset + i)
            )
        }
        return (
            <div className='board-row'>
                {squares}
            </div>
        )
    }


    render() {
        const rows = [];
        const numberOfRows = this.props.coordinates.rows;

        for (let i = 0; i < numberOfRows; i++) {
            rows.push(
                this.renderRow(i)
            )
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

function HistoryOrderToggle(props) {
    const historyOrder = props.historyOrder;
    return (
        <button className='historyOrderToggle' onClick={props.onClick}>
            {historyOrder}
        </button>
    )
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            coordinates: {
                rows: 3,
                cols: 3
            },
            history: [{
                squares: Array(9).fill(null),
            }],
            moveHistory: [],
            historyOrder: 'Unordered',
            orderedMoveHistory: [],
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

        const moveHistory = this.state.moveHistory.slice(0, this.state.stepNumber);
        moveHistory.push(getCoordinateForIndex(i))

        const orderValue = this.state.historyOrder;
        squares[i] = this.state.isXNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            moveHistory: moveHistory,
            orderedMoveHistory: this.determineOrder(orderValue, moveHistory),
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

    determineOrder(orderValue, moves) {
        if (orderValue === 'Ascending') {
            return moves.sort();
        }
        else if (orderValue === 'Descending') {
            return moves.sort().reverse();
        }
        else {
            return moves;
        }
    }

    switchToggle() {
        const orderValue = this.state.historyOrder;
        const historyOrderValues = ['Unordered', 'Ascending', 'Descending']
        const orderValueIndex = historyOrderValues.indexOf(orderValue);

        let newOrderValue;
        if (orderValueIndex === (historyOrderValues.length - 1))
            newOrderValue = historyOrderValues[0];
        else
            newOrderValue = historyOrderValues[orderValueIndex + 1];

        const moveHistory = this.state.moveHistory.slice();

        this.setState({
            historyOrder: newOrderValue,
            orderedMoveHistory: this.determineOrder(newOrderValue, moveHistory)
        });
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

            const isCurrent = move === this.state.stepNumber;

            return (
                <li key={move}>
                    <div className={`${isCurrent ? "bold" : ""}`}>
                        <button onClick={() => this.jumpTo(move)}>
                            {desc}
                        </button>
                        {moveCoordinate}
                    </div>
                </li>
            )
        })
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.isXNext ? 'X' : 'O');
        }

        const orderedMoveHistory = this.state.orderedMoveHistory.map((move) => {
            return (
                <li key={move}>
                    {move}
                </li>
            )
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        coordinates={this.state.coordinates}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <HistoryOrderToggle
                        historyOrder={this.state.historyOrder}
                        onClick={() => this.switchToggle()}
                    />
                    <ol>{moves}</ol>
                    <div>
                        <b>Ordered Move History</b>
                        <ol>{orderedMoveHistory}</ol>
                    </div>
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
