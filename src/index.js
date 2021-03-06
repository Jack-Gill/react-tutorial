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
            key={`square-${index}`}
            index={index}
            value={this.props.squares[index]}
            onClick={(index) => this.props.onClick(index)}
        />;
    }

    render() {
        const squares = [];

        for (let height = 0; height < 3; height += 1) {
            const row = [];
            for(let width = 0; width < 3; width += 1) {
                row.push(this.renderSquare((height * 3) + width))
            }
            squares[height] = (
                <div key={`row-${height}`}>
                    {row}
                </div>
            );
        }
        return (
            <div>
                {squares}
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
                movePos: {
                    x: null,
                    y: null,
                },
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

        const xCoord = index % 3;
        const yCoord = Math.floor(index / 3);

        if (current.winner || currentSquares[index]) return;

        const newSquares = [...currentSquares];
        newSquares[index] = secondPlayerActive ? 'O' : 'X';

        const newWinner = calculateWinner(newSquares) || null;

        this.setState({
            history: history.concat([{
                squares: newSquares,
                winner: newWinner,
                movePos: {
                    x: xCoord,
                    y: yCoord,
                }
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
            let desc;
            const isCurrentMove = moveNumber === currentHistoryIndex;

            if(isCurrentMove) {
                desc = moveNumber ? `Current move: move #${moveNumber}` : 'Game start';
            }
            else {
                desc = moveNumber ? `Go to move #${moveNumber}` : 'Go to game start';
            }

            return (
                <li key={`move-${moveNumber}`}>
                    <button
                        onClick={() => this.jumpTo(moveNumber)}
                    >
                        <div style={isCurrentMove ? { fontWeight: 'bold' } : {}}>
                            {desc}
                        </div>
                    </button>
                    <div>
                        {`x: ${step.movePos.x}, y: ${step.movePos.y}`}
                    </div>
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