// ====== 回到主页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== 文件映射（含标题和副标题） ======
const fileMap = {
    gaokao: {
        path: 'Assets/docs/Quotes/gaokao.md',
        mainTitle: '📖 乾坤未定，你我皆是黑马',
        subTitle: '明天一定会更好！'
    },
    oral: {
        path: 'Assets/docs/Quotes/gaokaoOralEnExam.md',
        mainTitle: '🎤 今天，世界听你说',
        subTitle: '明天一定会更好！'
    },
    schoolgame: {
        path: 'Assets/docs/Quotes/schoolgame.md',
        mainTitle: '🏃 脚下有风，心中有梦',
        subTitle: '明天一定会更好！'
    }
};

// ====== DOM 引用 ======
const buttons = document.querySelectorAll('.nav button[data-file]');
const quotesPage = document.getElementById('quotesPage');
const quotesMainTitle = document.getElementById('quotesMainTitle');
const quotesSubTitle = document.getElementById('quotesSubTitle');
const quotesContent = document.getElementById('quotes-content');

// ====== 触发淡入动画 ======
function triggerFadeIn() {
    // 移除动画类，触发重排，再重新添加
    quotesPage.classList.remove('fade-in');
    // 强制重排（触发浏览器重新计算样式）
    void quotesPage.offsetWidth;
    quotesPage.classList.add('fade-in');
}

// ====== 加载语录 ======
async function loadQuote(fileKey) {
    const info = fileMap[fileKey];
    if (!info) return;

    // 更新标题
    quotesMainTitle.textContent = info.mainTitle;
    quotesSubTitle.textContent = info.subTitle;

    // 显示加载状态
    quotesContent.innerHTML = '<div style="text-align:center;padding:30px 0;color:rgba(255,255,255,0.6);">⏳ 加载中...</div>';

    // 触发淡入动画（标题+内容整体淡入）
    triggerFadeIn();

    try {
        const response = await fetch(info.path);
        if (!response.ok) throw new Error('文件加载失败');
        const markdown = await response.text();
        quotesContent.innerHTML = marked.parse(markdown);
        // 内容加载完成后再次触发淡入，让内容也有淡入效果
        triggerFadeIn();
    } catch (error) {
        quotesContent.innerHTML =
            `<div style="text-align:center;padding:30px 0;color:rgba(255,255,255,0.6);">
                ❌ 加载失败<br>
                <span style="font-size:12px;opacity:0.5;">${error.message}</span>
            </div>`;
        console.error('加载语录失败:', error);
        triggerFadeIn();
    }
}

// ====== 按钮切换 ======
buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        const fileKey = this.dataset.file;
        loadQuote(fileKey);
    });
});

// ====== 默认加载第一个 ======
document.addEventListener('DOMContentLoaded', function() {
    // 页面加载时先添加淡入类
    quotesPage.classList.add('fade-in');
    
    const activeBtn = document.querySelector('.nav button[data-file].active');
    if (activeBtn) {
        loadQuote(activeBtn.dataset.file);
    } else {
        loadQuote('gaokao');
    }
});