/*----- constants -----*/
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
let moveIdx;
let selectedPiece;

let gameState = {

    board: null, // becomes board array, 32
    turn: null,
    win: null,
}

/*----- cached element references -----*/
const playSqrs = Array.from(document.querySelectorAll('td span'));
let msgEl = document.querySelector('#msg');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleMove);
document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
function handleMove(evt) {
    const sqrIdx = playSqrs.indexOf(evt.target);
    if (sqrIdx === -1) return;

    // check piece clicked against current turn
    // if click on piece
    // check if move or jump
    // call pieceMove or pieceJump method

    // if click on king
    // check if move or jump
    // call kingMove or kingJump method

    // if landed on end square call kingMe function
    console.log(sqrIdx);
    render();
}

function play() {
    // check for win
    // update positions
    // check for "jumps"
    // remove jumped pieces

    gameState.turn *= -1;
}
function kingMe() {
    // remove piece object
    // create instance of king object
}
function render() {
    renderBoard();
    // remove jumped pieces
    // update positions of pieces moved
    // remove pieces that reach the end
    // if pieces reach end, add kings

    //update "knocked off lillypad" count?
    //update win count per player?
}

function renderBoard() {
    debugger;
    gameState.board.forEach((piece, idx) => {
        let sqr = playSqrs[idx];
        if (piece === null) {
            sqr.className = 'empty';
        } else if (piece.player === 1 && !piece.isKing) {
            // render to player one class
        } else if (piece.player === -1 && !piece.isKing) {
            // render to player two class
        } else if (piece.player === 1 && piece.isKing) {
            // render to player one king class
        } else if (piece.player === -1 && piece.isKing) {
            // render to player two king class
        }
    });
}

function init() {
    gameState.board = new Array(32).fill(null);
    for (let i = 0; i < 12; i++) gameState.board[i] = new Piece(1);
    for (let i = 19; i < 32; i++) gameState.board[i] = new Piece(-1);

    gameState.turn = 1;
    gameState.win = null;
    // call initRender function
    // reset board
    // update win count per player?

    // reset play state
    // initialize starting pieces
    // reset taken pieces count
    // remove kings
    render();
}

init();