// ====== 回到主页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== BPM 核心逻辑 ======
const bpmValue = document.getElementById('bpmValue');
const tapCount = document.getElementById('tapCount');
const avgInterval = document.getElementById('avgInterval');
const tapBtn = document.getElementById('tapBtn');
const resetBtn = document.getElementById('resetBtn');

let tapTimes = [];
let timeoutId = null;
const RESET_DELAY = 3000; // 3秒未点击自动重置

// ====== 计算 BPM ======
function calculateBPM() {
    const count = tapTimes.length;
    if (count < 3) {
        bpmValue.textContent = '--';
        avgInterval.textContent = '--';
        return;
    }

    // 计算间隔
    let totalInterval = 0;
    for (let i = 1; i < count; i++) {
        totalInterval += tapTimes[i] - tapTimes[i - 1];
    }
    const avg = totalInterval / (count - 1);
    const bpm = Math.round(60000 / avg);

    bpmValue.textContent = bpm;
    avgInterval.textContent = Math.round(avg);
}

// ====== 记录点击 ======
function tap() {
    const now = Date.now();

    // 如果距离上次点击超过 3 秒，重置
    if (tapTimes.length > 0 && now - tapTimes[tapTimes.length - 1] > RESET_DELAY) {
        tapTimes = [];
    }

    tapTimes.push(now);
    tapCount.textContent = tapTimes.length;

    // 清除之前的超时
    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    // 设置自动重置
    timeoutId = setTimeout(() => {
        if (tapTimes.length > 0) {
            tapTimes = [];
            tapCount.textContent = '0';
            bpmValue.textContent = '--';
            avgInterval.textContent = '--';
            timeoutId = null;
        }
    }, RESET_DELAY);

    calculateBPM();

    // 按钮反馈动画
    tapBtn.style.transform = 'scale(0.92)';
    setTimeout(() => {
        tapBtn.style.transform = 'scale(1)';
    }, 100);
}

// ====== 重置 ======
function resetBPM() {
    tapTimes = [];
    if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
    }
    tapCount.textContent = '0';
    bpmValue.textContent = '--';
    avgInterval.textContent = '--';
}

// ====== 事件绑定 ======
tapBtn.addEventListener('click', tap);

resetBtn.addEventListener('click', resetBPM);

// 键盘事件（空格键）
document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault(); // 防止页面滚动
        tap();
    }
});

// 触摸设备防止双击缩放
document.addEventListener('dblclick', function(e) {
    e.preventDefault();
}, { passive: false });