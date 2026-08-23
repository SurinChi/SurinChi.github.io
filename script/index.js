// ====== 导航切换 ======
const buttons = document.querySelectorAll('.nav button');
const pageMap = {
    home: document.getElementById('page-home'),
    about: document.getElementById('page-about'),
    contact: document.getElementById('page-contact'),
    projects: document.getElementById('page-projects'),
    tools: document.getElementById('page-tools')
};

buttons.forEach(btn => {
    btn.addEventListener('click', function() {
        buttons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        Object.values(pageMap).forEach(p => p.classList.remove('active'));
        const target = document.getElementById(this.dataset.page);
        if (target) target.classList.add('active');
    });
});

// ====== 加载 Markdown ======
async function loadAboutMD() {
    const container = document.getElementById('about-content');
    try {
        const response = await fetch("Assets/docs/self-intro.md");
        if (!response.ok) throw new Error('文件加载失败');
        const markdown = await response.text();
        container.innerHTML = marked.parse(markdown);
    } catch (error) {
        container.innerHTML =
            `<div style="text-align:center;padding:30px 0;color:rgba(255,255,255,0.6);">
                ❌ 加载失败<br><span style="font-size:12px;opacity:0.5;">${error.message}</span>
            </div>`;
        console.error('加载 about.md 失败:', error);
    }
}

document.addEventListener('DOMContentLoaded', loadAboutMD);