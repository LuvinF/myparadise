// Decorative effects and mobile-friendly Wordle interaction.
const stars = document.getElementById('stars');
const petals = document.getElementById('petals');
const hearts = document.getElementById('hearts');

const SECRET = 'MAHALKITA';
const MAX_ATTEMPTS = 6;
let attempts = 0;
let locked = false;

function random(min, max) { return Math.random() * (max - min) + min; }

function buildAtmosphere() {
  for (let i = 0; i < 150; i++) {
    const s = document.createElement('i');
    s.className = 'star';
    s.style.left = random(0, 100) + '%';
    s.style.top = random(0, 100) + '%';
    s.style.setProperty('--duration', random(1.8, 5.5) + 's');
    s.style.animationDelay = random(-5, 0) + 's';
    s.style.opacity = random(.2, .9);
    stars.appendChild(s);
  }
  for (let i = 0; i < 34; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    p.style.left = random(0, 100) + '%';
    p.style.setProperty('--fall', random(10, 23) + 's');
    p.style.setProperty('--delay', random(-24, 0) + 's');
    p.style.transform = `scale(${random(.55, 1.25)})`;
    petals.appendChild(p);
  }
  for (let i = 0; i < 13; i++) {
    const h = document.createElement('i');
    h.className = 'float-heart';
    h.textContent = ['♡', '♥', '✧'][Math.floor(random(0, 3))];
    h.style.left = random(0, 100) + '%';
    h.style.fontSize = random(12, 25) + 'px';
    h.style.setProperty('--rise', random(13, 25) + 's');
    h.style.setProperty('--delay', random(-24, 0) + 's');
    hearts.appendChild(h);
  }
}

function initBoard() {
  const board = document.getElementById('board');
  board.innerHTML = '';
  for (let r = 0; r < MAX_ATTEMPTS; r++) {
    const row = document.createElement('div');
    row.className = 'board-row';
    row.style.display = 'contents';
    for (let c = 0; c < SECRET.length; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.setAttribute('aria-label', `Attempt ${r + 1}, letter ${c + 1}`);
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function scoreGuess(guess, answer) {
  const result = Array(answer.length).fill('absent');
  const remaining = {};
  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) result[i] = 'correct';
    else remaining[answer[i]] = (remaining[answer[i]] || 0) + 1;
  }
  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue;
    if (remaining[guess[i]] > 0) {
      result[i] = 'present';
      remaining[guess[i]]--;
    }
  }
  return result;
}

function showGuess(guess, feedback) {
  const row = document.getElementById('board').children[attempts];
  [...row.children].forEach((tile, i) => {
    tile.textContent = guess[i];
    tile.classList.add(feedback[i], 'reveal');
    setTimeout(() => tile.classList.remove('reveal'), 500);
  });
}

function submitGuess(event) {
  event.preventDefault();
  if (locked) return;

  const input = document.getElementById('guess-input');
  const guess = input.value.trim().toUpperCase();

  if (!/^[A-Z]{9}$/.test(guess)) {
    showStatus('Please enter exactly nine letters.');
    input.focus();
    return;
  }

  const feedback = scoreGuess(guess, SECRET);
  showGuess(guess, feedback);
  attempts++;

  if (guess === SECRET) {
    locked = true;
    input.disabled = true;
    document.getElementById('submit-guess').disabled = true;

    showStatus('Thou hast spoken the secret, and the gates of my heart shall open unto thee.');

    // Start the background song and keep it looping
    const audio = document.getElementById('background-music');
    audio.loop = true;

    audio.play().catch(error => {
        console.log("Tap the music button to start playback:", error);
    });

    window.setTimeout(unlockCard, 550);
    return;
}

  if (attempts >= MAX_ATTEMPTS) {
    locked = true;
    input.disabled = true;
    document.getElementById('submit-guess').disabled = true;
    showStatus('The secret remains veiled. Refresh the page to begin again.');
    return;
  }

  const remaining = MAX_ATTEMPTS - attempts;
  showStatus(`Not quite, my love. ${remaining} ${remaining === 1 ? 'chance remains' : 'chances remain'}.`);
  input.value = '';
  input.focus();
}

function showStatus(message) {
  document.getElementById('status').textContent = message;
}

function unlockCard() {
  locked = true;
  document.body.classList.add('unlocked');
  const burst = document.getElementById('magic-burst');
  const colors = ['#ffd5e8', '#ff7eb7', '#e9c78b', '#ffffff', '#d88bff'];
  for (let i = 0; i < 220; i++) {
    const particle = document.createElement('i');
    particle.className = 'burst-particle';
    const angle = random(0, Math.PI * 2);
    const distance = random(90, Math.max(innerWidth, innerHeight) * .72);
    particle.style.setProperty('--x', Math.cos(angle) * distance + 'px');
    particle.style.setProperty('--y', Math.sin(angle) * distance + 'px');
    particle.style.setProperty('--size', random(2, 6) + 'px');
    particle.style.setProperty('--color', colors[Math.floor(random(0, colors.length))]);
    burst.appendChild(particle);
    setTimeout(() => particle.remove(), 1700);
  }

  const gate = document.getElementById('gate');
  const letter = document.getElementById('letter-screen');
  gate.classList.add('leaving');
  setTimeout(() => {
    gate.classList.add('hidden');
    letter.classList.remove('hidden');
    letter.setAttribute('aria-hidden', 'false');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 850);
}

function shootStar() {
  const s = document.createElement('i');
  s.className = 'shooting-star';
  s.style.left = random(55, 105) + '%';
  s.style.top = random(0, 55) + '%';
  document.getElementById('shooting-stars').appendChild(s);
  setTimeout(() => s.remove(), 1500);
}

document.getElementById('guess-form').addEventListener('submit', submitGuess);
document.getElementById('music-toggle').addEventListener('click', async () => {
  const audio = document.getElementById('background-music');
  const button = document.getElementById('music-toggle');
  if (audio.paused) {
    try {
      await audio.play();
      button.setAttribute('aria-pressed', 'true');
      button.querySelector('span').textContent = 'Pause our music';
    } catch (err) {
      button.querySelector('span').textContent = 'Add assets/our-song.mp3 first';
    }
  } else {
    audio.pause();
    button.setAttribute('aria-pressed', 'false');
    button.querySelector('span').textContent = 'Play our music';
  }
});

buildAtmosphere();
initBoard();
document.getElementById('guess-input').addEventListener('input', event => {
  event.target.value = event.target.value.replace(/[^a-z]/gi, '').toUpperCase().slice(0, 9);
});
setInterval(() => { if (Math.random() > .35) shootStar(); }, 4200);
