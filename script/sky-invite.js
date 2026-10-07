// ====== 回到首页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== DOM 引用 ======
const inviteCodeInput = document.getElementById('inviteCode');
const codeHint = document.getElementById('codeHint');
const form = document.querySelector('.apply-form');
const submitBtn = document.getElementById('submitBtn');

// ====== 邀请码格式校验 ======
const CODE_PATTERN = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

function validateCode(code) {
    return CODE_PATTERN.test(code);
}

// ====== 自动格式化输入 ======
inviteCodeInput.addEventListener('input', function () {
    let val = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 12) val = val.slice(0, 12);

    let formatted = '';
    for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += '-';
        formatted += val[i];
    }
    this.value = formatted;

    // 实时反馈
    if (formatted.length === 0) {
        codeHint.textContent = '格式：4位-4位-4位（字母或数字）';
        codeHint.className = 'input-hint';
    } else if (formatted.length < 14) {
        codeHint.textContent = `还需输入 ${14 - formatted.length} 位`;
        codeHint.className = 'input-hint';
    } else if (validateCode(formatted)) {
        codeHint.textContent = '✓ 格式正确';
        codeHint.className = 'input-hint valid';
    } else {
        codeHint.textContent = '✗ 格式不正确';
        codeHint.className = 'input-hint invalid';
    }
});

// ====== 表单提交前校验 ======
form.addEventListener('submit', function (e) {
    const code = inviteCodeInput.value.trim();

    // 格式校验
    if (!validateCode(code)) {
        e.preventDefault();
        codeHint.textContent = '✗ 邀请码格式不正确，请检查后重试';
        codeHint.className = 'input-hint invalid';
        inviteCodeInput.focus();
        return false;
    }

    // 防重复提交
    submitBtn.disabled = true;
    submitBtn.textContent = '提交中...';

    // 允许表单继续提交（不阻止默认行为）
    return true;
});

// ====== 页面加载时聚焦邀请码输入框 ======
document.addEventListener('DOMContentLoaded', function () {
    // 可选：自动聚焦
    // inviteCodeInput.focus();
});