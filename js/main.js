/*----- constants -----*/
class Piece {
    constructor(player, inPlay, startPos, isTurn) {
        this.player = player;
        this.inPlay = inPlay;
        this.startPos = startPos;
        this.isTurn = isTurn;
    }
    // move behavior

    pieceMove() {
        // move forward diagonal
    }
    pieceJump() {
        // jump forward over one piece
        // check for available jump forward
        // jump forward again
        //  ''
    }
}

class King extends Piece {
    constructor(player, inPlay, startPos, isTurn) {
        super(player, inPlay, startPos, isTurn);
    }
    // move behavior
    
    kingMove() {
        // move diagonal forward or backward
    }
    kingJump() {
        // jump forward or backward over at least one piece
        // check for available jump
        // jump again
        //  ''
    }
}

/*----- app's state (variables) -----*/
let moveIdx;

let gameState = {

    board: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    turn: null,
    win: null,
}

/*----- cached element references -----*/
const playSqrs = document.querySelectorAll('.used');
const unUsedSqrs = document.querySelectorAll('.unused');
const replayButton = document.querySelector('#replay');
const team1 = document.querySelector('.team1');
const team2 = document.querySelector('.team2');
let msgEl = document.querySelector('#msg');

/*----- event listeners -----*/
playSqrs.forEach(e => e.addEventListener('click', handleMove));
replayButton.addEventListener('click', init);

/*----- functions -----*/
function handleMove() {
    // check piece clicked against current turn
    // if click on piece
    // check if move or jump
    // call pieceMove or pieceJump method

    // if click on king
    // check if move or jump
    // call kingMove or kingJump method

    // if landed on end square call kingMe function
    console.log(event.target.id);
}

function play() {
    // check for win
    // update positions
    // check for "jumps"
    // remove jumped pieces

    gameState.turn *= -1;
    render();
}
function kingMe() {
    // remove piece object
    // create instance of king object
}
function render(evt) {
    moveIdx = evt.target.id;
    if (gameState.board[moveIdx] !== null) return;
    // remove jumped pieces
    // update positions of pieces moved
    // remove pieces that reach the end
    // if pieces reach end, add kings

    //update "knocked off lillypad" count?
    //update win count per player?
};

function init() {
    gameState.board.fill(null);
    gameState.turn = 1;
    gameState.win = null;
    // call initRender function
    // reset board
    // update win count per player?


    // reset play state
    // initialize starting pieces
    // reset taken pieces count
    // remove kings
    initRender();
}
function initRender() {
    // playSqrs.forEach(e => e.style.backgroundImage = 'images/lilly-pad-clipart-12.png')
    // lily.style.backgroundImage = `url(images/lilly-pad-clipart-12.png)`;
};