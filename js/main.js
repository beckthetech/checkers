/*----- constants -----*/
const playerIds = {
    '1': 1,
    '-1': 2
}

const kingsRow = [0, 1, 2, 3, 28, 29, 30, 31];

class Piece {
    constructor(player) {
        this.player = player;
        this.isKing = false;
    }
    move() {
        if (selectedPieceClasses.includes('even') && desiredSqrClasses.includes('even') || selectedPieceClasses.includes('odd') && desiredSqrClasses.includes('odd')) {
            if (selectedPieceClasses.includes('odd')) {
                if (selectedPieceClasses.includes('team1-piece') || selectedPieceClasses.includes('team1-king')) {
                    jumpCheck(4, 5, 3, 4);
                } else if (selectedPieceClasses.includes('team2-piece') || selectedPieceClasses.includes('team2-king')) {
                    jumpCheck(3, 4, 4, 5);
                }
            } else if (selectedPieceClasses.includes('even')) {
                if (selectedPieceClasses.includes('team1-piece') || selectedPieceClasses.includes('team1-king')) {
                    jumpCheck(3, 4, 4, 5);
                } else if (selectedPieceClasses.includes('team2-piece') || selectedPieceClasses.includes('team2-king')) {
                    jumpCheck(4, 5, 3, 4);
                }
            }
            gameState.desiredSqr = undefined;
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

/*----- app's state (variables) -----*/
let turnCounter = 0;

let gameState = {
    board: null,
    turn: null,
    win: null,
    selectedPiece: null,
    desiredSqr: undefined
}

let selectedPieceClasses = [];
let desiredSqrClasses = [];
let jumpedPieceClasses = {};
let jumpedPieceIds = {};
let selectedPieceIdx = NaN;
let desiredSqrIdx = NaN;
let sqrIdx = NaN;
let winCountArray = [];

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
    render();
}

function render() {
    msgEl.textContent = `Player's ${playerIds[gameState.turn]} turn!`
    winCheck();
    renderBoard();
}

function init() {
    gameState.board = new Array(32).fill(null);
    for (let i = 0; i < 12; i++) gameState.board[i] = new Piece(1);
    for (let i = 20; i < 32; i++) gameState.board[i] = new Piece(-1);
    gameState.turn = 1;
    turnCounter = 0;
    gameState.win = null;
    gameState.selectedPiece !== null ? gameState.selectedPiece.classList.remove('selected') : true;
    resetSelectors();
    setRowClasses();
    render();
}

function movePiece() {
    gameState.board[desiredSqrIdx] = new Piece(gameState.turn);
    kingMe(desiredSqrIdx);
    gameState.selectedPiece.classList.remove('selected');
    gameState.board[selectedPieceIdx] = null;
    resetSelectors();
    gameState.turn *= -1;
    turnCounter += 1;
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
function jumpCheck(move1, move2, move1A, move2A) {
    jumpedPieceIds[1] = selectedPieceIdx + (gameState.turn * move1);
    jumpedPieceIds[2] = selectedPieceIdx + (gameState.turn * move2);
    jumpedPieceClasses[1] = Array.from((playSqrs[jumpedPieceIds[1]]).classList);
    jumpedPieceClasses[2] = Array.from((playSqrs[jumpedPieceIds[2]]).classList);

    if (jumpedPieceClasses[1].includes(`team${playerIds[gameState.turn * -1]}-piece`)) {
        if (jumpedPieceIds[1] + (gameState.turn * move1A) === desiredSqrIdx) {
            movePiece();
            gameState.board[jumpedPieceIds[1]] = null;
            jumpedPieceIds[1] = NaN;
            return;
        }
    }
    if (jumpedPieceClasses[2].includes(`team${playerIds[gameState.turn * -1]}-piece`)) {
        if (jumpedPieceIds[2] + (gameState.turn * move2A) === desiredSqrIdx) {
            movePiece();
            gameState.board[jumpedPieceIds[2]] = null;
            jumpedPieceIds[2] = NaN;
            return;
        }
    }
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
    jumpedPieceCheckIdx1 = NaN;
    jumpedPieceCheckIdx2 = NaN;
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
    if (kingsRow.includes(desiredSqrIdx)) {
        gameState.board[desiredSqrIdx] = null;
    }
}
function winCheck() {
    winCountArray = gameState.board;
    let p1Count = 0;
    let p2Count = 0;
    winCountArray.forEach((el) => {
        if (el !== null) {
            if (el.player === 1) {
                p1Count++;
            } else if (el.player === -1) {
                p2Count++;
            }
        }
    });
    if (p1Count === 0) {
        msgEl.textContent = 'Well done, Player 2! Click below to play again.'
    } else if (p2Count === 0) {
        msgEl.textContent = 'Well done, Player 1! Click below to play again.'
    }
    if (turnCounter === 60) {
        if (p1Count === p2Count) {
            gameState.win = 'tie';
            msgEl.textContent = "It's a tie! Click below to play again."
        } else if (p1Count > p2Count) {
            gameState.win = 1;
            msgEl.textContent = 'Well done, Player 1! Click below to play again.'
        } else if (p2Count > p1Count) {
            gameState.win = -1;
            msgEl.textContent = 'Well done, Player 2! Click below to play again.'
        }
    }
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