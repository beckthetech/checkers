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
        if (this.isKing) {
            // king move logic
            if (this.player === 1) {
                kingMoveCheck(4, 5, 3);
            } else if (this.player === -1) {
                kingMoveCheck(3, 4, 5);
            } else {
                desiredSqr = undefined;
                return;
            }
        } else {
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
                desiredSqr = undefined;
            } else if (this.player === 1) {
                moveCheck(4, 5);
            } else if (this.player === -1) {
                moveCheck(3, 4);
            } else {
                desiredSqr = undefined;
                return;
            }
        }
    }
}

/*----- app's state (variables) -----*/
let turnCounter = 0;
let board = null;
let turn = null;
let win = null;
let evtSqrIdx = NaN;
let selectedPiece = null;
let selectedPieceIdx = NaN;
let desiredSqr = undefined;
let desiredSqrIdx = NaN;
let jumpedPieceIds = {};
let selectedPieceClasses = [];
let desiredSqrClasses = [];
let jumpedPieceClasses = {};
let winTally = [];

/*----- cached element references -----*/
let playSqrs = Array.from(document.querySelectorAll('td span'));
let msgEl = document.querySelector('#msg');

/*----- event listeners -----*/
document.querySelector('table').addEventListener('click', handleMove);
document.getElementById('replay').addEventListener('click', init);

/*----- functions -----*/
function handleMove(evt) {
    evtSqrIdx = playSqrs.indexOf(evt.target);
    if (evtSqrIdx === -1) return;
    let eventClasses = Array.from(evt.target.classList);
    if (eventClasses.includes(`team${playerIds[turn]}-piece`) || eventClasses.includes(`team${playerIds[turn]}-king`) || (selectedPiece !== null && eventClasses.includes('empty'))) {
        if (selectedPiece === null) {
            setSelectedPiece(evt, eventClasses, evtSqrIdx);
        } else if (desiredSqr === undefined) {
            setRowClasses();
            setDesiredPiece(evt, evtSqrIdx, eventClasses);
        }
    }
    render();
}

function render() {
    msgEl.textContent = `Player's ${playerIds[turn]} turn!`
    //update "knocked off lillypad" count?
    //update win count per player?
    winCheck();
    renderBoard();
}

function init() {
    board = new Array(32).fill(null);
    for (let i = 0; i < 12; i++) board[i] = new Piece(1);
    for (let i = 20; i < 32; i++) board[i] = new Piece(-1);
    turn = 1;
    turnCounter = 0;
    win = null;
    selectedPiece !== null ? selectedPiece.classList.remove('selected') : true;
    resetSelectors();
    setRowClasses();
    render();
}

function movePiece() {
    board[desiredSqrIdx] = new Piece(turn);
    kingMe(desiredSqrIdx);
    selectedPiece.classList.remove('selected');
    board[selectedPieceIdx] = null;
    resetSelectors();
    turn *= -1;
    turnCounter += 1;
}
function kingMoveCheck(move1, move2, move3) {
    if (selectedPieceClasses.includes('odd')) {
        if (selectedPieceIdx + (turn * move1) === desiredSqrIdx || selectedPieceIdx + (turn * move2) === desiredSqrIdx) {
            movePiece()
        } else if (selectedPieceIdx + (turn * (move1 - turn)) === desiredSqrIdx || selectedPieceIdx + (turn * (move3 - turn)) === desiredSqrIdx) {
            movePiece()
        } else {
            desiredSqr = undefined;
        }
    } else if (selectedPieceClasses.includes('even')) {
        if (selectedPieceIdx + (turn * (move1 - turn)) === desiredSqrIdx || selectedPieceIdx + (turn * (move2 - turn)) === desiredSqrIdx) {
            movePiece()
        } else if (selectedPieceIdx + (turn * move1) === desiredSqrIdx || selectedPieceIdx + (turn * move3) === desiredSqrIdx) {
            movePiece()
        } else {
            desiredSqr = undefined;
        }
    }
}
function moveCheck(move1, move2) {
    if (selectedPieceClasses.includes('odd')) {
        if (selectedPieceIdx + (turn * move1) === desiredSqrIdx || selectedPieceIdx + (turn * move2) === desiredSqrIdx) {
            movePiece()
        } else {
            desiredSqr = undefined;
        }
    } else if (selectedPieceClasses.includes('even')) {
        if (selectedPieceIdx + (turn * (move1 - turn)) === desiredSqrIdx || selectedPieceIdx + (turn * (move2 - turn)) === desiredSqrIdx) {
            movePiece()
        } else {
            desiredSqr = undefined;
        }
    }
}
function jumpCheck(move1, move2, move1A, move2A) {
    jumpedPieceIds[1] = selectedPieceIdx + (turn * move1);
    jumpedPieceIds[2] = selectedPieceIdx + (turn * move2);
    jumpedPieceClasses[1] = Array.from((playSqrs[jumpedPieceIds[1]]).classList);
    jumpedPieceClasses[2] = Array.from((playSqrs[jumpedPieceIds[2]]).classList);

    if (jumpedPieceClasses[1].includes(`team${playerIds[turn * -1]}-piece`)) {
        if (jumpedPieceIds[1] + (turn * move1A) === desiredSqrIdx) {
            movePiece();
            board[jumpedPieceIds[1]] = null;
            jumpedPieceIds[1] = NaN;
            return;
        }
    }
    if (jumpedPieceClasses[2].includes(`team${playerIds[turn * -1]}-piece`)) {
        if (jumpedPieceIds[2] + (turn * move2A) === desiredSqrIdx) {
            movePiece();
            board[jumpedPieceIds[2]] = null;
            jumpedPieceIds[2] = NaN;
            return;
        }
    }
}
function setDesiredPiece(evt, evtSqrIdx, eventClasses) {
    desiredSqrIdx = evtSqrIdx;
    desiredSqrClasses = eventClasses;
    desiredSqr = evt.target;
    if (desiredSqrClasses.includes('empty')) {
        board[selectedPieceIdx].move();
    } else if (desiredSqr === selectedPiece) {
        selectedPiece.classList.remove('selected');
        resetSelectors();
        return;
    } else {
        desiredSqr = undefined;
        return;
    }
}
function setSelectedPiece(evt, eventClasses, evtSqrIdx) {
    selectedPiece = evt.target;
    selectedPiece.classList.add('selected');
    selectedPieceClasses = eventClasses;
    selectedPieceIdx = evtSqrIdx;
}
function resetSelectors() {
    selectedPiece = null;
    desiredSqr = undefined;
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
        board[desiredSqrIdx] = null;
        // board[desiredSqrIdx].isKing = true;
    }
}
function winCheck() {
    winTally = board;
    let p1Count = 0;
    let p2Count = 0;
    winTally.forEach((el) => {
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
            win = 'tie';
            msgEl.textContent = "It's a tie! Click below to play again."
        } else if (p1Count > p2Count) {
            win = 1;
            msgEl.textContent = 'Well done, Player 1! Click below to play again.'
        } else if (p2Count > p1Count) {
            win = -1;
            msgEl.textContent = 'Well done, Player 2! Click below to play again.'
        }
    }
}
function renderBoard() {
    board.forEach((piece, idx) => {
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