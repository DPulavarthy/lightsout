const $ = (query, parent = document) => parent.querySelector(query);
const $$ = (query, parent = document) => parent.querySelectorAll(query);
let grid = 0;

$$('.option').forEach(option => {
    const row = (cells) => `<div class="row">${new Array(cells).fill(`<div class="cell"></div>`).join('')}</div>`;
    const id = +option.getAttribute('data-id');
    $(`.option[data-id="${id}"] .label`)?.setAttribute('data-id', id);
    const table = $(`.option[data-id="${id}"] .table`)
    table?.setAttribute('data-id', id);
    table?.insertAdjacentHTML('beforeend', new Array(id).fill(row(id)).join(''));
    option.onclick = () => {
        grid = id;
        if ($('#custom').classList.contains('active')) {
            grid = parseInt($('input').value);
            $('#custom').classList.remove('active');
        }
        $('nav').classList.add('hidden');
        setTimeout(() => {
            $('nav').classList.remove('hidden');
            $('nav').style.display = 'none';
            $('main').classList.add('active');
            $('main #grid').style.display = 'grid';
            $('main #grid').style.gridTemplateColumns = `repeat(${grid}, 1fr)`;
            $('main #grid').style.gridTemplateRows = `repeat(${grid}, 1fr)`;
            $('main #grid').innerHTML = new Array(grid * grid).fill(`<div class="cell"></div>`).join('');
            Game.start();
        }, 300);
    }
})

$('#back').onclick = () => {
    $('main').classList.remove('active');
    setTimeout(() => $('nav').style.display = 'flex', 300);
}

function again() {
    $('main').classList.remove('win');
    $('#overlay').classList.remove('active');
    $('main').classList.remove('active');
    setTimeout(() => $('nav').style.display = 'flex', 300);
}

$('h1').ondblclick = () => $('main').classList.contains('active') ? Game.move(true, true) : $('#custom').classList.add('active');

class Game {
    static grid = [];
    static moves = 0;
    static timerInterval;
    static startTime;

    static async start() {

        if (Game.timerInterval) clearInterval(Game.timerInterval);
        $('#timer').innerHTML = '00:00';
        $('#moves').innerHTML = '0<b>0</b>';
        Game.moves = 0;
        Game.grid = [];

        for (let i = 0; i < grid; i++) Game.grid.push(new Array(grid).fill(0));
        $('main #grid').classList.add('disabled')
        let i = 0;
        $$('main #grid .cell').forEach(cell => cell.id = i++);
        let temp = grid === 5 ? 3 : grid === 6 ? 4 : grid === 9 ? 6 : Math.round((grid * grid) * 0.1);

        while (temp--) {
            let selected = await Game.pick();
            Game.grid[Math.floor(selected / grid)][selected % grid] = 1;
            $('main #grid .cell[id="' + selected + '"]').classList.add('selected');
            Game.move(true);
        }
        $('main #grid').classList.remove('disabled');
        Game.timer();
        $$('main #grid .cell').forEach(cell => cell.onclick = () => Game.select(cell));
        document.getElementById('again').onclick = again;
    }

    static move(count, force) {
        if (!count) Game.moves++;

        let selected = 0;
        for (let i = 0; i < grid; i++) {
            for (let j = 0; j < grid; j++) {
                if (Game.grid[i][j] === 1) selected++;
            }
        }
        $('#moves').innerHTML = `${Game.moves}<b>${selected}</b>`;
        if (force || !count) {
            if (force || selected === 0) {
                clearInterval(Game.timerInterval);
                setTimeout(() => {
                    $('main').classList.add('win');
                    $('#overlay').classList.add('active');
                    const time = Date.now() - Game.startTime;
                    const hours = Math.floor(time / 3600000);
                    const minutes = Math.floor(time / 60000) % 60;
                    const seconds = Math.floor(time / 1000) % 60;
                    $('#overlay p').innerHTML = `It took you <b>${Game.moves}</b> moves and <b>${hours ? `${hours}:` : ''}${`${minutes < 10 ? '0' : ''}${minutes}`}:${seconds < 10 ? '0' : ''}${seconds}</b> to win!`
                }, 1000);
            }
        }
    }

    static select(cell) {
        const id = +cell.id;
        const y = Math.floor(cell.id / grid);
        const x = id % grid;
        $(`main #grid .cell[id="${id}"]`).classList[$(`main #grid .cell[id="${id}"]`).classList.contains('selected') ? 'remove' : 'add']('selected');
        Game.grid[y][x] = Game.grid[y][x] ? 0 : 1;

        if ([0, 1].includes(Game.grid[y - 1]?.[x])) {
            $(`main #grid .cell[id="${id - grid}"]`)?.classList[$(`main #grid .cell[id="${id - grid}"]`).classList.contains('selected') ? 'remove' : 'add']('selected');
            Game.grid[y - 1][x] = Game.grid[y - 1][x] ? 0 : 1;
        }

        if ([0, 1].includes(Game.grid[y + 1]?.[x])) {
            $(`main #grid .cell[id="${id + grid}"]`)?.classList[$(`main #grid .cell[id="${id + grid}"]`).classList.contains('selected') ? 'remove' : 'add']('selected');
            Game.grid[y + 1][x] = Game.grid[y + 1][x] ? 0 : 1;
        }

        if ([0, 1].includes(Game.grid[y]?.[x - 1])) {
            $(`main #grid .cell[id="${id - 1}"]`)?.classList[$(`main #grid .cell[id="${id - 1}"]`).classList.contains('selected') ? 'remove' : 'add']('selected');
            Game.grid[y][x - 1] = Game.grid[y][x - 1] ? 0 : 1;
        }

        if ([0, 1].includes(Game.grid[y]?.[x + 1])) {
            $(`main #grid .cell[id="${id + 1}"]`)?.classList[$(`main #grid .cell[id="${id + 1}"]`).classList.contains('selected') ? 'remove' : 'add']('selected');
            Game.grid[y][x + 1] = Game.grid[y][x + 1] ? 0 : 1;
        }
        Game.move();
    }

    static timer() {
        Game.startTime = Date.now();
        Game.timerInterval = setInterval(() => {
            const time = Date.now() - Game.startTime;
            const hours = Math.floor(time / 3600000);
            const minutes = Math.floor(time / 60000) % 60;
            const seconds = Math.floor(time / 1000) % 60;
            $('#timer').innerText = `${hours ? `${hours}:` : ''}${`${minutes < 10 ? '0' : ''}${minutes}`}:${seconds < 10 ? '0' : ''}${seconds}`;
        }, 500);
    }

    static pick() {
        return new Promise(resolve => {
            let id = 0;
            const interval = setInterval(() => {
                const cells = $$('main #grid .cell:not(.selected)');
                cells.forEach(cell => cell?.classList.remove('active'));
                const random = Math.floor(Math.random() * cells.length);
                cells[random].classList.add('active');
                id = cells[random].id;
            }, 100);
            setTimeout(() => {
                $$('main #grid .cell').forEach(cell => cell.classList.remove('active'));
                clearInterval(interval);
                resolve(id);
            }, 500);
        })
    }
}