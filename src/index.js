import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
     function handleClick() {
        const {onClick, index} = props;
        if (onClick) {
            onClick(index);
        }
    }

    return (
        <button className="square" onClick={handleClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            winner: null,
        };
    }

    handleSquareClick(index) {
        const { winner, squares } = this.state;
        const { secondPlayerActive, onPlayerMadeMove } = this.props;

        if (winner || squares[index]) return;

        const newSquares = [...squares];
        newSquares[index] = secondPlayerActive ? 'O' : 'X';

        const newWinner = calculateWinner(newSquares) || null;

        this.setState({
            squares: newSquares,
            winner: newWinner,
        });

        if (onPlayerMadeMove) onPlayerMadeMove();
    }

    renderSquare(index) {
        return <Square
            index={index}
            value={this.state.squares[index]}
            onClick={(index) => this.handleSquareClick(index)}
        />;
    }

    render() {
        const { secondPlayerActive } = this.props;
        const { winner } = this.state;
        const playerSymbol = secondPlayerActive ? 'O' : 'X';

        let status;

        if (winner) {
            status = `Winner: ${winner}`;
        }
        else {
            status = `Next player: ${playerSymbol}`;
        }

        return (
            <div>
                <div className="status">{status}</div>
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
            secondPlayerActive: false,
        };
    }

    switchPlayer() {
        this.setState({
            secondPlayerActive: !this.state.secondPlayerActive,
        });
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        secondPlayerActive={this.state.secondPlayerActive}
                        onPlayerMadeMove={() => this.switchPlayer()}
                    />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);

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