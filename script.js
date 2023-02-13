// HTML Elements
const board = document.getElementById('board');
const scoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');

// Game settings
// Tamaño del board
const boardSize = 10;
// Velocidad del juego
const gameSpeed = 500;
// Tipos de cuadrados
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2
};
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1,
};

// Game variables
let snake;
let score;
let direction;
// Guardamos array con la info del tablero
let boardSquares;
// Generar la comida de la serpiente en lugares aleaotorios vacios
let emptySquares;
// Intervalo de funcion cada determinado tiempo
let moveInterval;

const drawSnake = () => {
    snake.forEach( square => drawSquare(square, 'snakeSquare'));
}

// Rellena cada cuadrado del tablero
// @params 
// square: posicion del cuadrado,
// type: tipo de cuadrado (emptySquare, snakeSquare, foodSquare)
const drawSquare = (square, type) => {
    const [ row, column ] = square.split('');
    boardSquares[row][column] = squareTypes[type];
    const squareElement = document.getElementById(square);
    squareElement.setAttribute('class', `square ${type}`);
// Crear un elemento de array vacio para cuando se mueva la snake
    if(type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        if(emptySquares.indexOf(square) !== -1) {
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }
}

const moveSnake = () => {
    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    const [row, column] = newSquare.split('');


    if( newSquare < 0 || 
        newSquare > boardSize * boardSize  ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9 ||
        boardSquares[row][column] === squareTypes.snakeSquare) ) {
        gameOver();
    } else {
        snake.push(newSquare);
        if(boardSquares[row][column] === squareTypes.foodSquare) {
            addFood();
        } else {
            const emptySquare = snake.shift();
            drawSquare(emptySquare, 'emptySquare');
        }
        drawSnake();
    }
}

const addFood = () => {
    score++;
    updateScore();
    createRandomFood();
}

const gameOver = () => {
    gameOverSign.style.display = 'block';
    clearInterval(moveInterval)
    startButton.disabled = false;
}

const setDirection = newDirection => {
    direction = newDirection;
}

const directionEvent = key => {
    switch (key.code) {
        case 'ArrowUp':
            direction != 'ArrowDown' && setDirection(key.code)
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code)
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code)
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code)
            break;
    }
}

const createRandomFood = () => {
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
    drawSquare(randomEmptySquare, 'foodSquare');
}

const updateScore = () => {
    scoreBoard.innerText = score;
}

const createBoard = () => {
    boardSquares.forEach( (row, rowIndex) => {
        row.forEach( (column, columnndex) => {
            const squareValue = `${rowIndex}${columnndex}`;
            const squareElement = document.createElement('div');
            squareElement.setAttribute('class', 'square emptySquare');
            squareElement.setAttribute('id', squareValue);
            board.appendChild(squareElement);
            emptySquares.push(squareValue);
        })
    })
}

const setGame = () => {
    snake = ['00', '01', '02', '03'];
    score = snake.length;
    direction = 'ArrowRight';
    // Creación del board
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    // Borrar todo lo que tenga el board cuando se inicialice el juego
    board.innerHTML = '';
    emptySquares = [];
    // Creación del tablero☺
    createBoard();
}

const startGame = () => {
    setGame();
    // Quitar el game over
    gameOverSign.style.display = 'none';
    // Deshabilitar el botón de start para cuando se este jugango
    startButton.disabled = true;
    drawSnake();
    updateScore();
    createRandomFood();
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval( () => moveSnake(), gameSpeed);
}

startButton.addEventListener('click', startGame);