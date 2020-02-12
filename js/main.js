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
    move() {
        if (this.isKing) {
            // king move logic

        } else {
            if (selectedPieceClasses.includes('even') && desiredSqrClasses.includes('even') || selectedPieceClasses.includes('odd') && desiredSqrClasses.includes('odd')) {
                jumpCheck(7, 9)
            } else if (this.player === 1) {
                moveCheck(4, 5);
            } else if (this.player === -1) {
                moveCheck(3, 4);
            } else {
                gameState.desiredSqr = undefined;
                return;
            }
        }
    }
    // check for available jump forward
    // jump forward again
    // chain jumps? - don't switch turn yet to allow for second jump?

    // if click on king
    // check if move or jump
    // call kingMove or kingJump method
}

/*----- app's state (variables) -----*/
let gameState = {
    board: null, // becomes board array of 32 playable sqaures
    turn: null,
    win: null,
    selectedPiece: null,
    desiredSqr: undefined
}
let selectedPieceIdx = NaN;
let desiredSqrIdx = NaN;
let selectedPieceClasses = [];
let desiredSqrClasses = [];
let sqrIdx = NaN;

/*----- cached element references -----*/
let playSqrs = Array.from(document.querySelectorAll('td span'));
let msgEl = document.querySelector('#msg');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleMove);
document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
function handleMove(evt) {
    sqrIdx = playSqrs.indexOf(evt.target);
    if (sqrIdx === -1) return;
    let eventClasses = Array.from(evt.target.classList);
    if (eventClasses.includes(`team${playerIds[gameState.turn]}-piece`) || eventClasses.includes(`team${playerIds[gameState.turn]}-king`) || (gameState.selectedPiece !== null && eventClasses.includes('empty'))) {
        if (gameState.selectedPiece === null) {
            setSelectedPiece(evt, eventClasses, sqrIdx);
        } else if (gameState.desiredSqr === undefined) {
            setRowClasses();
            setDesiredPiece(evt, sqrIdx, eventClasses);
        }
    }
    // if landed on end square call kingMe function
    render();
}

function render() {
    // update message for player turn
    // display win message
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
    gameState.selectedPiece !== null ? gameState.selectedPiece.classList.remove('selected') : true;
    resetSelectors();
    setRowClasses();
    // update win count per player?
    // reset taken pieces count
    render();
}

function movePiece() {
    gameState.board[desiredSqrIdx] = new Piece(gameState.turn);
    gameState.selectedPiece.classList.remove('selected');
    gameState.board[selectedPieceIdx] = null;
    resetSelectors();
    gameState.turn *= -1;
}
function moveCheck(move1, move2) {
    if (selectedPieceClasses.includes('odd')) {
        if (selectedPieceIdx + (gameState.turn * move1) === desiredSqrIdx || selectedPieceIdx + (gameState.turn * move2) === desiredSqrIdx) {
            movePiece()
        } else {
            gameState.desiredSqr = undefined;
        }
    } else if (selectedPieceClasses.includes('even')) {
        if (selectedPieceIdx + (gameState.turn * (move1 - gameState.turn)) === desiredSqrIdx || selectedPieceIdx + (gameState.turn * (move2 - gameState.turn)) === desiredSqrIdx) {
            movePiece()
        } else {
            gameState.desiredSqr = undefined;
        }
    }
}
function jumpCheck(move1, move2) {
    if (selectedPieceIdx + (gameState.turn * move1) === desiredSqrIdx || selectedPieceIdx + (gameState.turn * move2) === desiredSqrIdx) {
        movePiece()
    } else {
        gameState.desiredSqr = undefined;
    }
}
function edgeCheck() {
    let edgeSqrs = [3, 4, 11, 12, 19, 20, 27, 28];
    return !edgeSqrs.includes(selectedPieceIdx) ? !edgeSqrs.includes(desiredSqrIdx) : false;
}
function setDesiredPiece(evt, sqrIdx, eventClasses) {
    desiredSqrIdx = sqrIdx;
    desiredSqrClasses = eventClasses;
    gameState.desiredSqr = evt.target;
    if (desiredSqrClasses.includes('empty')) {
        gameState.board[selectedPieceIdx].move();
    } else if (gameState.desiredSqr === gameState.selectedPiece) {
        gameState.selectedPiece.classList.remove('selected');
        resetSelectors();
        return;
    } else {
        gameState.desiredSqr = undefined;
        return;
    }
}
function setSelectedPiece(evt, eventClasses, sqrIdx) {
    gameState.selectedPiece = evt.target;
    gameState.selectedPiece.classList.add('selected');
    selectedPieceClasses = eventClasses;
    selectedPieceIdx = sqrIdx;
}
function resetSelectors() {
    gameState.selectedPiece = null;
    gameState.desiredSqr = undefined;
}
function setRowClasses() {
    playSqrs.forEach((piece, idx) => {
        if (idx < 4) {
            addOdd(piece);
        } else if (idx < 8) {
            addEven(piece);
        } else if (idx < 12) {
            addOdd(piece)
        } else if (idx < 16) {
            addEven(piece);
        } else if (idx < 20) {
            addOdd(piece)
        } else if (idx < 24) {
            addEven(piece);
        } else if (idx < 28) {
            addOdd(piece)
        } else if (idx < 32) {
            addEven(piece);
        }
    });
    function addOdd(piece) {
        piece.classList.add('odd');
        piece.classList.remove('even');
    }
    function addEven(piece) {
        piece.classList.add('even');
        piece.classList.remove('odd');
    }
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
    function updateClasses(sqr, class1, class2, class3, class4, class5) {
        sqr.classList.remove(class1);
        sqr.classList.remove(class2);
        sqr.classList.remove(class3);
        sqr.classList.remove(class4);
        sqr.classList.add(class5);
    }
}

init();