// ====== 回到首页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== DOM 引用 ======
const resultNumber = document.getElementById('resultNumber');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const countInput = document.getElementById('countInput');
const generateBtn = document.getElementById('generateBtn');
const historyList = document.getElementById('historyList');
const historyCount = document.getElementById('historyCount');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const exportBtn = document.getElementById('exportBtn');
const resultDisplay = document.getElementById('resultDisplay');

// ====== 弹窗 DOM ======
const detailModal = document.getElementById('detailModal');
const modalTitle = document.getElementById('modalTitle');
const modalRange = document.getElementById('modalRange');
const modalBody = document.getElementById('modalBody');
const modalCount = document.getElementById('modalCount');

let currentModalData = [];

// ====== 历史记录管理 ======
const STORAGE_KEY = 'random_history';
const MAX_HISTORY = 500;

function getHistory() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveHistory(history) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
        console.warn('保存历史记录失败:', e);
    }
}

function addHistoryBatch(values, min, max) {
    const history = getHistory();
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    const entry = {
        type: 'batch',
        values: values,
        count: values.length,
        min: min,
        max: max,
        time: timeStr,
        timestamp: Date.now()
    };
    history.unshift(entry);

    if (history.length > MAX_HISTORY) {
        history.length = MAX_HISTORY;
    }
    saveHistory(history);
    renderHistory();
}

function clearHistory() {
    if (confirm('确定要清空所有历史记录吗？')) {
        saveHistory([]);
        renderHistory();
    }
}

// ====== 导出功能 ======
function exportHistory() {
    const history = getHistory();
    if (history.length === 0) {
        alert('暂无历史记录可导出');
        return;
    }

    // 生成导出文本
    let text = '═══════════════════════════════════════\n';
    text += '  随机数生成器 · 历史记录导出\n';
    text += '  原始URL: https://surinchi.github.io/random.html\n';
    text += `  导出时间: ${new Date().toLocaleString('zh-CN')}\n`;
    text += `  记录总数: ${history.length} 条\n`;
    text += '═══════════════════════════════════════\n\n';

    history.forEach((item, index) => {
        const num = index + 1;
        if (item.type === 'batch') {
            const valuesStr = item.values.join(', ');
            text += `[${num}] 范围: ${item.min} ~ ${item.max}  |  个数: ${item.count}  |  时间: ${item.time}\n`;
            text += `    └─ ${valuesStr}\n\n`;
        } else {
            // 兼容旧版单条记录
            text += `[${num}] 值: ${item.value}  |  范围: ${item.min} ~ ${item.max}  |  时间: ${item.time}\n\n`;
        }
    });

    text += '═══════════════════════════════════════\n';
    text += ' 导出完成 \n';

    // 创建下载
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `随机数历史记录_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ====== 详情弹窗 ======
function openDetail(item) {
    currentModalData = item.values || [];
    const count = currentModalData.length;

    modalTitle.textContent = item.type === 'batch' ? `详情` : '详情';
    modalRange.textContent = `范围: ${item.min} ~ ${item.max}`;
    modalCount.textContent = `共 ${count} 个数字`;

    // 渲染数字列表
    modalBody.innerHTML = currentModalData.map(n =>
        `<span class="modal-number">${n}</span>`
    ).join('');

    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeDetail() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
}

function copyModalContent() {
    const text = currentModalData.join(', ');
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.modal-copy-btn');
        const original = btn.textContent;
        btn.textContent = '✓ 已复制';
        setTimeout(() => { btn.textContent = original; }, 1500);
    }).catch(() => {
        // 降级方案
        const textarea = document.createElement('textarea');
        textarea.value = currentModalData.join('\n');
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        const btn = document.querySelector('.modal-copy-btn');
        const original = btn.textContent;
        btn.textContent = '已复制';
        setTimeout(() => { btn.textContent = original; }, 1500);
    });
}

// 点击弹窗外部关闭
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDetail();
    }
});

// ====== 渲染历史记录 ======
function renderHistory() {
    const history = getHistory();
    historyCount.textContent = history.length;

    if (history.length === 0) {
        historyList.innerHTML = `
            <div style="text-align:center;padding:40px 0;color:rgba(255,255,255,0.5);">
                ⓘ 还没有记录 / No records yet
            </div>
        `;
        return;
    }

    historyList.innerHTML = history.map((item, index) => {
        let displayText, rangeText, detailAttr = '';

        if (item.type === 'batch') {
            const preview = item.values.slice(0, 5).join(', ');
            const suffix = item.values.length > 5 ? ` ... ` : ''; // 共${item.count}个
            displayText = preview + suffix;
            rangeText = `${item.min} ~ ${item.max} × ${item.count}`;
            detailAttr = `data-index="${index}"`;
        } else {
            displayText = item.value;
            rangeText = `${item.min} ~ ${item.max}`;
            detailAttr = `data-index="${index}"`;
        }

        return `
            <div class="history-item" ${detailAttr} onclick="handleItemClick(${index})">
                <span class="history-value">${displayText}</span>
                <span class="history-range">${rangeText}</span>
                <span class="history-time">${item.time}</span>
            </div>
        `;
    }).join('');
}

// ====== 点击历史条目 ======
function handleItemClick(index) {
    const history = getHistory();
    const item = history[index];
    if (item) {
        // 如果是旧版单条记录，转为数组
        if (item.type !== 'batch' && item.value !== undefined) {
            item.values = [item.value];
            item.type = 'batch';
            item.count = 1;
        }
        openDetail(item);
    }
}

// ====== 生成随机数 ======
function generateRandom() {
    const min = parseInt(minInput.value);
    const max = parseInt(maxInput.value);
    let count = parseInt(countInput.value) || 1;

    if (isNaN(min) || isNaN(max)) {
        resultDisplay.innerHTML = `<span class="result-number">❌</span>`;
        return;
    }

    if (min >= max) {
        resultDisplay.innerHTML = `<span class="result-number">⚠️</span>`;
        return;
    }

    if (count < 1) count = 1;
    if (count > 100) count = 100;
    countInput.value = count;

    const results = [];
    for (let i = 0; i < count; i++) {
        results.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }

    addHistoryBatch(results, min, max);

    if (count === 1) {
        resultDisplay.innerHTML = `<span class="result-number pop">${results[0]}</span>`;
    } else {
        resultDisplay.innerHTML = `
            <div class="result-batch">
                ${results.map(n => `<span class="batch-item">${n}</span>`).join('')}
            </div>
        `;
    }
}

// ====== 页面切换 ======
const buttons = document.querySelectorAll('.nav button[data-page]');
const pages = {
    generator: document.getElementById('page-generator'),
    history: document.getElementById('page-history')
};

buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        Object.values(pages).forEach(p => p.classList.remove('active'));
        const target = document.getElementById(this.dataset.page);
        if (target) target.classList.add('active');
    });
});

// ====== 事件绑定 ======
generateBtn.addEventListener('click', generateRandom);

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        const activePage = document.querySelector('.random-page.active');
        if (activePage && activePage.id === 'page-generator') {
            e.preventDefault();
            generateRandom();
        }
    }
});

minInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') generateRandom();
});
maxInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') generateRandom();
});
countInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') generateRandom();
});

clearHistoryBtn.addEventListener('click', clearHistory);
exportBtn.addEventListener('click', exportHistory);

// ====== 启动 ======
renderHistory();

document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        renderHistory();
    }
});

// 暴露给全局（用于 onclick）
window.handleItemClick = handleItemClick;
window.closeDetail = closeDetail;
window.copyModalContent = copyModalContent;