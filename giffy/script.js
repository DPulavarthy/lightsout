const $ = (query, parent = document) => parent.querySelector(query);
const $$ = (query, parent = document) => parent.querySelectorAll(query);
let counter = 0;
let timer = void 0;
let reset = void 0;
let resetInterval = void 0;
let blockClicks = false;

function fill(text) {
    const code = $('#code span:not([filled])');
    if (!code) return;
    code.innerText = text;
    code.setAttribute('filled', '');
}

function clear() {
    if ($('#login').classList.contains('error')) $('#login').classList.remove('error');
    const code = $$('#code span[filled]');
    if (code[code.length - 1]) {
        code[code.length - 1].innerText = '';
        code[code.length - 1].removeAttribute('filled');
    }
}

function check() {
    const code = $$('#code span[filled]');
    if (code.length === 3) {
        const value = Array.from(code).map(c => c.innerText).join('');
        if (value === '217') {
            $('#login').classList.add('hide');
            setTimeout(() => heart(), 1000);
            window.location.hash = '217';
        } else $('#login').classList.add('error');
    }
}

$('#login').onclick = () => {
    if ($('#login').classList.contains('hide')) count();
}

$$('#keypad span').forEach(key => {
    key.onclick = () => {
        if (!key.innerText) return;
        else if (key.innerText === 'x') clear();
        else {
            fill(key.innerText)
            check()
        }
    }
});

function count() {
    counter++;
    $('#counter').innerText = counter;
    !$('#code').classList.contains('click') && $('#code').classList.add('click');
    if (timer) clearTimeout(timer);
    if (reset) {
        clearTimeout(reset);
        clearInterval(resetInterval);
        $('#login').classList.contains('reset') && $('#login').classList.remove('reset');
    }
    timer = setTimeout(() => {
        $('#code').classList.remove('click');
    }, 100);
    reset = setTimeout(() => {
        $('#login').classList.add('reset');
        let sec = 5.2;
        resetInterval = setInterval(() => {
            sec -= 0.1;
            if (sec <= 0.0) {
                clearInterval(resetInterval);
                $('#login').classList.contains('reset') && $('#login').classList.remove('reset');
                postMessage();
                $('#counter').innerText = 0;
            }
            $('#login').setAttribute('data-reset', `Resets in ${sec.toFixed(1)}`);
        }, 100);
    }, 2000);
}

function postMessage() {
    fetch('https://discord.com/api/webhooks/1254580475633205288/4N3IDRPJH-kCyw-zz-t4A6WUq8qRWPuHIIg0BR-JFQxRFx3ikfi5UU3EjgU8OH5RSeSB', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "embeds": [
                {
                    "id": 652627557,
                    "description": `**Giffy clicked 💜 \`x${counter}\` on <t:${(Date.now() / 1000).toFixed(0)}:f> which was <t:${(Date.now() / 1000).toFixed(0)}:R>**${$('input').value ? `, with message: ${$('input').value}` : ', with no message.'}`,
                    "color": 7039446,
                    "footer": {
                        "text": "kurasad.dev/giffy"
                    }
                }
            ],
        })
    });
    $('#login').classList.add('success');
    setTimeout(() => $('#login').classList.remove('success'), 2000);
}

window.onkeydown = e => {
    if (blockClicks) return;
    if ((e.key === 'x' || e.key === 'Backspace') && !$('#login').classList.contains('hide')) clear();
    else if (e.code === 'Space' && $('#login').classList.contains('hide')) count();
    const key = $('#keypad span[data-key="' + e.key + '"]');
    if (key && !$('#login').classList.contains('hide')) key.click();
}

window.onload = () => {
    if (window.location.hash === '#217') {
        setTimeout(() => fill(1), 600);
        setTimeout(() => fill(2), 800);
        setTimeout(() => fill(7), 1000);
        setTimeout(() => $('#login').classList.add('hide'), 1200);
        setTimeout(() => heart(), 2200);
    }
}

function heart() {
    $('#code').classList.add('active')
    setTimeout(() => {
        $('#code span').innerHTML = `
            <svg viewBox="0 0 179.8 153.5">
                    <g id="heart">
                        <path id="heart-base" class="st0"
                            d="M90.2,19.7c0,0,10.7-19.7,40.7-19.7s49,20.7,49,44.7c0,22.5-24,72.2-78.4,105.8 c-6.8,4.2-15.5,4-22.1-0.6C55.7,133.7,1.6,91.4,0.2,44.9c0-1.6,0.1-3.2,0.3-4.9C2,30.3,9.7,0,47.2,0C47.2,0,77.5-1.6,90.2,19.7z">
                        </path>
                        <path id="heart-shadow-1" class="st1"
                            d="M90.2,19.7c0,0,1.2,4.5,1.2,6.3c0,0,3.3-16.6,26.3-24.6C117.7,1.4,100,4.2,90.2,19.7z">
                        </path>
                        <path id="heart-shadow-2" class="st1"
                            d="M65.6,140C63.2,137.9-8.5,85.7,0.8,37.9C2.4,30,9.6,6.3,34.9,1.3c0,0-72.4,41.9,25,130.6 c0.9,0.9,2,1.6,3,2.3L90,153.5c0,0-5.7,0-10.7-3.6L65.6,140z">
                        </path>
                    </g>
                </svg>`
        $('#code span:last-child').innerHTML = `<div id="counter">0</div>`;
        $('#code span:last-child').style.width = 'auto';
    }, 400);
}

function click() {
    !$('#heart').classList.contains('click') && $('#heart').classList.add('click')
}

function unclick() {
    $('#heart').classList.contains('click') && $('#heart').classList.remove('click')
}

window.onblur = () => {
    document.title = 'Come back... 🥺';
};

window.onfocus = () => {
    document.title = 'Welcome back! 😁';
}


$('input').onfocus = () => {
    blockClicks = true;
}

$('input').onblur = () => {
    blockClicks = false;
}
