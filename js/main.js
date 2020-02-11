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
        if (isKing) {
            // king move logic
        } else {
            // piece move logic
        }
        // check if king
        // move forward diagonal
        // pass in variable of selected piece
        // pass in variable of desired space
    }
    jump() {
        if (isKing) {
            // king jump logic
        } else {
            // piece jump logic
        }
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
    let eventClasses = Array.from(evt.target.classList);
    if (eventClasses.includes(`team${playerIds[gameState.turn]}-piece`) || eventClasses.includes(`team${playerIds[gameState.turn]}-king`) || (gameState.selectedPiece !== null && eventClasses.includes('empty'))) {
        if (gameState.selectedPiece === null) {
            setSelectedPiece(evt);
        } else if (gameState.desiredSqr === undefined) {
            setDesiredPiece(evt, sqrIdx);
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
    render();
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



function init() {
    gameState.board = new Array(32).fill(null);
    for (let i = 0; i < 12; i++) gameState.board[i] = new Piece(1);
    for (let i = 20; i < 32; i++) gameState.board[i] = new Piece(-1);
    
    gameState.turn = 1;
    gameState.win = null;
    resetSelectors();
    // reset board
    // update win count per player?
    
    // reset play state
    // initialize starting pieces
    // reset taken pieces count
    // remove kings
    render();
}

function setSelectedPiece(evt) {
    gameState.selectedPiece = evt.target;
    gameState.selectedPiece.classList.add('selected');
}
function setDesiredPiece(evt, sqrIdx) {
    gameState.desiredSqr = evt.target;
    if (gameState.desiredSqr.className === 'empty') {
        gameState.board[sqrIdx] = new Piece(gameState.turn);
        gameState.selectedPiece.classList.remove('selected');
        gameState.board[playSqrs.indexOf(gameState.selectedPiece)] = null;
        resetSelectors();
        gameState.turn *= -1;
    } else if (gameState.desiredSqr === gameState.selectedPiece) {
        gameState.selectedPiece.classList.remove('selected');
        resetSelectors();
        return;
    } else {
        gameState.desiredSqr = undefined;
        return;
    }
}
function resetSelectors() {
    gameState.selectedPiece = null;
    gameState.desiredSqr = undefined;
}
function kingMe() {
    // change isKing property to true
}
function renderBoard() {
    gameState.board.forEach((piece, idx) => {
        let sqr = playSqrs[idx];
        if (piece === null) {
            updateClasses(sqr, 'team1-piece', 'team2-piece', 'team1-king', 'team2-king', 'empty');
        } else if (piece.player === 1 && !piece.isKing) {
            updateClasses(sqr, 'team2-piece', 'team1-king', 'team2-king', 'empty', 'team1-piece');
        } else if (piece.player === -1 && !piece.isKing) {
            updateClasses(sqr, 'team1-king', 'team2-king', 'empty', 'team1-piece', 'team2-piece');
        } else if (piece.player === 1 && piece.isKing) {
            updateClasses(sqr, 'team2-king', 'empty', 'team1-piece', 'team2-piece', 'team1-king');
        } else if (piece.player === -1 && piece.isKing) {
            updateClasses(sqr, 'empty', 'team1-piece', 'team2-piece', 'team1-king', 'team2-king');
        }
    });
}
function updateClasses(sqr, class1, class2, class3, class4, class5) {
    sqr.classList.remove(class1);
    sqr.classList.remove(class2);
    sqr.classList.remove(class3);
    sqr.classList.remove(class4);
    sqr.classList.add(class5);
}

init();