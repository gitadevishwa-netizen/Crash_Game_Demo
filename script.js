// Free‑to‑play crash game demo (virtual credits only)
let balance = 1000.00;
let inRound = false;
let cashedOut = false;
let currentMultiplier = 1.00;
let crashPoint = 0;
let timer = null;
let betAmount = 0;

const balanceEl = document.getElementById('balance');
const multiplierEl = document.getElementById('multiplier');
const statusEl = document.getElementById('status');
const lastResultEl = document.getElementById('lastResult');
const startBtn = document.getElementById('startBtn');
const cashoutBtn = document.getElementById('cashoutBtn');
const betInput = document.getElementById('bet');
const planeEl = document.getElementById('plane');

function updateBalance() {
  balanceEl.textContent = balance.toFixed(2);
}

function randomCrashPoint() {
  // Simple demo distribution
  const r = Math.random();
  if (r < 0.60) return 1 + Math.random() * 2;      // 1x–3x
  if (r < 0.90) return 1 + Math.random() * 7;      // 1x–8x
  if (r < 0.98) return 1 + Math.random() * 22;     // 1x–23x
  return 30 + Math.random() * 70;                  // 30x–100x
}

function setButtonsForIdle() {
  startBtn.disabled = false;
  startBtn.classList.remove('btn-disabled');
  cashoutBtn.disabled = true;
  cashoutBtn.classList.add('btn-disabled');
}

function setButtonsForRunning() {
  startBtn.disabled = true;
  startBtn.classList.add('btn-disabled');
  cashoutBtn.disabled = false;
  cashoutBtn.classList.remove('btn-disabled');
}

function startRound() {
  if (inRound) return;

  betAmount = parseFloat(betInput.value);
  if (isNaN(betAmount) || betAmount <= 0) {
    alert('Enter a valid bet amount.');
    return;
  }
  if (betAmount > balance) {
    alert('Not enough balance.');
    return;
  }

  balance -= betAmount;
  updateBalance();

  inRound = true;
  cashedOut = false;
  currentMultiplier = 1.00;
  crashPoint = randomCrashPoint();
  multiplierEl.textContent = currentMultiplier.toFixed(2) + 'x';
  statusEl.textContent = 'Round running… click Cash Out before crash!';
  setButtonsForRunning();

  timer = setInterval(() => {
    currentMultiplier += 0.01 + (currentMultiplier * 0.005);
    multiplierEl.textContent = currentMultiplier.toFixed(2) + 'x';

    const leftPercent = Math.min(10 + currentMultiplier * 3, 120);
    planeEl.style.left = leftPercent + '%';

    if (currentMultiplier >= crashPoint) {
      clearInterval(timer);
      inRound = false;
      cashoutBtn.disabled = true;
      cashoutBtn.classList.add('btn-disabled');
      startBtn.disabled = false;
      startBtn.classList.remove('btn-disabled');

      multiplierEl.textContent = '💥 ' + crashPoint.toFixed(2) + 'x';
      statusEl.textContent = 'Crashed at ' + crashPoint.toFixed(2) + 'x. ' +
        (cashedOut ? 'You already cashed out.' : 'You lost this bet.');
      lastResultEl.textContent = crashPoint.toFixed(2) + 'x';
    }
  }, 50);
}

function cashOut() {
  if (!inRound || cashedOut) return;

  cashedOut = true;
  inRound = false;
  clearInterval(timer);

  const win = betAmount * currentMultiplier;
  balance += win;
  updateBalance();

  multiplierEl.textContent = currentMultiplier.toFixed(2) + 'x';
  statusEl.textContent = 'You cashed out at ' + currentMultiplier.toFixed(2) +
    'x and won ' + win.toFixed(2) + ' credits.';
  lastResultEl.textContent = currentMultiplier.toFixed(2) + 'x';

  cashoutBtn.disabled = true;
  cashoutBtn.classList.add('btn-disabled');
  startBtn.disabled = false;
  startBtn.classList.remove('btn-disabled');
}

startBtn.addEventListener('click', startRound);
cashoutBtn.addEventListener('click', cashOut);

updateBalance();
setButtonsForIdle();

