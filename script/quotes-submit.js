// ====== 回到首页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== DOM 引用 ======
const quoteText = document.getElementById('quoteText');
const quoteHint = document.getElementById('quoteHint');
const emailInput = document.getElementById('email');
const emailHint = document.getElementById('emailHint');
const form = document.querySelector('.apply-form');
const submitBtn = document.getElementById('submitBtn');

// ====== 校验规则 ======
const MIN_QUOTE_LEN = 4;
const MAX_QUOTE_LEN = 300;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    return EMAIL_PATTERN.test(email);
}

// ====== 语录内容实时反馈 ======
quoteText.addEventListener('input', function () {
    const len = this.value.trim().length;

    if (len === 0) {
        quoteHint.textContent = `至少 ${MIN_QUOTE_LEN} 个字，最多 ${MAX_QUOTE_LEN} 字`;
        quoteHint.className = 'input-hint';
    } else if (len < MIN_QUOTE_LEN) {
        quoteHint.textContent = `还需 ${MIN_QUOTE_LEN - len} 个字（当前 ${len} 字）`;
        quoteHint.className = 'input-hint';
    } else if (len >= MAX_QUOTE_LEN) {
        quoteHint.textContent = `已到上限 ${MAX_QUOTE_LEN} 字`;
        quoteHint.className = 'input-hint count-warn';
    } else {
        quoteHint.textContent = `✓ 已输入 ${len} 字`;
        quoteHint.className = 'input-hint valid';
    }
});

// ====== 邮箱实时反馈（选填，仅在填写后校验） ======
emailInput.addEventListener('input', function () {
    const val = this.value.trim();

    if (val.length === 0) {
        emailHint.textContent = '不填也可以，只是无法收到采纳通知';
        emailHint.className = 'input-hint';
    } else if (validateEmail(val)) {
        emailHint.textContent = '✓ 邮箱格式正确';
        emailHint.className = 'input-hint valid';
    } else {
        emailHint.textContent = '✗ 邮箱格式不正确';
        emailHint.className = 'input-hint invalid';
    }
});

// ====== 表单提交前校验 ======
form.addEventListener('submit', function (e) {
    const quote = quoteText.value.trim();
    const email = emailInput.value.trim();
    let hasError = false;

    // 语录内容：必填且达到最小长度
    if (quote.length < MIN_QUOTE_LEN) {
        e.preventDefault();
        if (quote.length === 0) {
            quoteHint.textContent = '✗ 请填写语录内容';
        } else {
            quoteHint.textContent = `✗ 语录至少需要 ${MIN_QUOTE_LEN} 个字`;
        }
        quoteHint.className = 'input-hint invalid';
        quoteText.focus();
        hasError = true;
    }

    // 邮箱：选填，但一旦填写就必须合法
    if (email.length > 0 && !validateEmail(email)) {
        e.preventDefault();
        emailHint.textContent = '✗ 邮箱格式不正确，请检查或留空';
        emailHint.className = 'input-hint invalid';
        if (!hasError) emailInput.focus();
        hasError = true;
    }

    if (hasError) return false;

    // 防重复提交
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ 投稿中...';
    return true;
});
