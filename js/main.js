/*----- constants -----*/
const playerIds = {
    '1': 1,
    '-1': 2
}

class Piece {
    constructor(player) {
        this.player = player;
        this.isKing = false;
    }
    // move behavior

    move() {
        // check if king
        // move forward diagonal
        // pass in variable of selected piece
        // pass in variable of desired space
    }
    jump() {
        // check if king
        // jump forward over one piece
        // check for available jump forward
        // jump forward again
        //  ''
    }
}

/*----- app's state (variables) -----*/
let gameState = {
    board: null, // becomes board array of 32 playable sqaures
    turn: null,
    win: null,
    selectedPiece: null,
    desiredSqr: undefined
}

/*----- cached element references -----*/
let playSqrs = Array.from(document.querySelectorAll('td span'));
let msgEl = document.querySelector('#msg');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleMove);
document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
function handleMove(evt) {
    const sqrIdx = playSqrs.indexOf(evt.target);
    if (sqrIdx === -1) return;
    if (evt.target.className === `team${playerIds[gameState.turn]}-piece` || evt.target.className === `team${playerIds[gameState.turn]}-king` || (gameState.selectedPiece !== null && evt.target.className === 'empty')) {
        if (gameState.selectedPiece === null) {
            gameState.selectedPiece = evt.target;
        } else if (gameState.desiredSqr === undefined) {
            gameState.desiredSqr = evt.target;
            if (gameState.desiredSqr.className === 'empty') {
                gameState.board[sqrIdx] = new Piece(gameState.turn);
                gameState.board[playSqrs.indexOf(gameState.selectedPiece)] = null;
                gameState.selectedPiece = null;
                gameState.desiredSqr = undefined;
                gameState.turn *= -1;
            } else if (gameState.desiredSqr === gameState.selectedPiece) {
                gameState.selectedPiece = null;
                gameState.desiredSqr = undefined;
                return;
            } else {
                gameState.desiredSqr = undefined;
                return;
            }
            // check if desired is valid move
            // create new piece in desired location
        }
    }

    // check piece clicked against current turn
    // if click on piece
    // check if move or jump
    // call pieceMove or pieceJump method

    // if click on king
    // check if move or jump
    // call kingMove or kingJump method

    // if landed on end square call kingMe function
    // console.log(evt.target);
    // console.log(gameState.selectedPiece);
    play();
}

function play() {
    // check for win
    // update positions
    // check for "jumps"
    // remove jumped pieces
    render();
}
function kingMe() {
    // remove piece object
    // create instance of king object
}
function render() {
    // change value in gamestate.board array of clicked piece
    // remove jumped pieces
    // update positions of pieces moved
    // remove pieces that reach the end
    // if pieces reach end, add kings

    //update "knocked off lillypad" count?
    //update win count per player?
    renderBoard();
}

function renderBoard() {
    gameState.board.forEach((piece, idx) => {
        let sqr = playSqrs[idx];
        if (piece === null) {
            sqr.className = 'empty';
        } else if (piece.player === 1 && !piece.isKing) {
            // render to player one class
            sqr.className = 'team1-piece';
        } else if (piece.player === -1 && !piece.isKing) {
            // render to player two class
            sqr.className = 'team2-piece';
        } else if (piece.player === 1 && piece.isKing) {
            // render to player one king class
            sqr.className = 'team1-king';
        } else if (piece.player === -1 && piece.isKing) {
            // render to player two king class
            sqr.className = 'team2-king';
        }
    });
}

function init() {
    gameState.board = new Array(32).fill(null);
    for (let i = 0; i < 12; i++) gameState.board[i] = new Piece(1);
    for (let i = 20; i < 32; i++) gameState.board[i] = new Piece(-1);

    gameState.turn = 1;
    gameState.win = null;
    gameState.selectedPiece = null;
    gameState.desiredSqr = undefined;
    // call initRender function
    // reset board
    // update win count per player?

    // reset play state
    // initialize starting pieces
    // reset taken pieces count
    // remove kings
    render();
    console.log(gameState.turn);
}

init();