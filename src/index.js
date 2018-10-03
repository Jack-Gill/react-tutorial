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
    renderSquare(index) {
        return <Square
            index={index}
            value={this.props.squares[index]}
            onClick={(index) => this.props.onClick(index)}
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

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                winner: null,
            }],
            currentHistoryIndex: 0,
            secondPlayerActive: false,
        };
    }

    handleClick(index){
        const { secondPlayerActive, currentHistoryIndex } = this.state;
        const history = this.state.history.slice(0, currentHistoryIndex + 1);
        const current = history[history.length - 1];
        const currentSquares = current.squares;

        if (current.winner || currentSquares[index]) return;

        const newSquares = [...currentSquares];
        newSquares[index] = secondPlayerActive ? 'O' : 'X';

        const newWinner = calculateWinner(newSquares) || null;

        this.setState({
            history: history.concat([{
                squares: newSquares,
                winner: newWinner,
            }]),
            secondPlayerActive: !this.state.secondPlayerActive,
            currentHistoryIndex: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            currentHistoryIndex: step,
            secondPlayerActive: (step % 2) !== 0,
        });
    }

    render() {
        const { secondPlayerActive, history, currentHistoryIndex } = this.state;
        const currentHistoryStep = history[currentHistoryIndex];
        const playerSymbol = secondPlayerActive ? 'O' : 'X';

        let status;

        if (currentHistoryStep.winner) {
            status = `Winner: ${currentHistoryStep.winner}`;
        }
        else {
            status = `Next player: ${playerSymbol}`;
        }

        const moves = history.map((step, moveNumber) => {
            const desc = moveNumber ?
                'Go to move #' + moveNumber :
                'Go to game start';
            return (
                <li key={`move-${moveNumber}`}>
                    <button onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        onClick={(index) => this.handleClick(index)}
                        squares={currentHistoryStep.squares}
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