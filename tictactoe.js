document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const cells = document.querySelectorAll('.cell');
    const newGameBtn = document.getElementById('newGame');
    const pvpBtn = document.getElementById('playerVsPlayer');
    const pvcBtn = document.getElementById('playerVsComputer');
    let currentPlayer = 'X';
    let boardState = Array(9).fill(null);
    let gameMode = '';

    newGameBtn.addEventListener('click', () => {
        reset();
        if (gameMode) start(gameMode);  // Biztosítjuk, hogy az eseménykezelők újra be legyenek állítva
    });
    pvpBtn.addEventListener('click', () => start('PvP'));
    pvcBtn.addEventListener('click', () => start('PvC'));

    function start(mode) {
        gameMode = mode;
        reset();
        status.textContent = `Player ${currentPlayer}'s turn`;
        cells.forEach(cell => cell.addEventListener('click', handleClick));
    }

    function reset() {
        boardState.fill(null);
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('disabled');  // Győződjünk meg arról, hogy a cellák kattinthatók
        });
        currentPlayer = 'X';
        status.textContent = `Player ${currentPlayer}'s turn`;
    }

    function handleClick(e) {
        const index = e.target.getAttribute('data-index');
        if (!boardState[index] && !checkWin()) {
            boardState[index] = currentPlayer;
            e.target.textContent = currentPlayer;
            if (checkWin()) {
                status.textContent = `Player ${currentPlayer} wins!`;
                cells.forEach(cell => cell.classList.add('disabled'));  // Leállítja a további kattintásokat
            } else if (boardState.every(cell => cell)) {
                status.textContent = "It's a draw!";
            } else {
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
                status.textContent = `Player ${currentPlayer}'s turn`;
                if (gameMode === 'PvC' && currentPlayer === 'O') {
                    setTimeout(computerMove, 500);  // Adjunk egy kis késleltetést a gép lépésének
                }
            }
        }
    }

    function computerMove() {
        let emptyCells = boardState.map((val, index) => val === null ? index : null).filter(val => val !== null);
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        boardState[randomIndex] = currentPlayer;
        cells[randomIndex].textContent = currentPlayer;
        if (checkWin()) {
            status.textContent = `Player ${currentPlayer} wins!`;
            cells.forEach(cell => cell.classList.add('disabled'));  // Leállítja a további kattintásokat
        } else if (boardState.every(cell => cell)) {
            status.textContent = "It's a draw!";
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = `Player ${currentPlayer}'s turn`;
        }
    }

    function checkWin() {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winPatterns.some(pattern => 
            pattern.every(index => boardState[index] === currentPlayer)
        );
    }
});
