// ====== 回到首页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== DOM 引用 ======
const featureText = document.getElementById('featureText');
const featureHint = document.getElementById('featureHint');
const emailInput = document.getElementById('email');
const emailHint = document.getElementById('emailHint');
const form = document.querySelector('.apply-form');
const submitBtn = document.getElementById('submitBtn');

// ====== 校验规则 ======
const MIN_FEATURE_LEN = 4;
const MAX_FEATURE_LEN = 300;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    return EMAIL_PATTERN.test(email);
}

// ====== 功能描述实时反馈 ======
featureText.addEventListener('input', function () {
    const len = this.value.trim().length;

    if (len === 0) {
        featureHint.textContent = `至少 ${MIN_FEATURE_LEN} 个字，最多 ${MAX_FEATURE_LEN} 字`;
        featureHint.className = 'input-hint';
    } else if (len < MIN_FEATURE_LEN) {
        featureHint.textContent = `还需 ${MIN_FEATURE_LEN - len} 个字（当前 ${len} 字）`;
        featureHint.className = 'input-hint';
    } else if (len >= MAX_FEATURE_LEN) {
        featureHint.textContent = `已到上限 ${MAX_FEATURE_LEN} 字`;
        featureHint.className = 'input-hint count-warn';
    } else {
        featureHint.textContent = `✓ 已输入 ${len} 字`;
        featureHint.className = 'input-hint valid';
    }
});

// ====== 邮箱实时反馈（选填） ======
emailInput.addEventListener('input', function () {
    const val = this.value.trim();

    if (val.length === 0) {
        emailHint.textContent = '不填也可以，只是收不到实现通知';
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
    const feature = featureText.value.trim();
    const email = emailInput.value.trim();
    let hasError = false;

    // 功能描述：必填且达到最小长度
    if (feature.length < MIN_FEATURE_LEN) {
        e.preventDefault();
        if (feature.length === 0) {
            featureHint.textContent = '✗ 请描述你想要的新功能';
        } else {
            featureHint.textContent = `✗ 至少需要 ${MIN_FEATURE_LEN} 个字`;
        }
        featureHint.className = 'input-hint invalid';
        featureText.focus();
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
    submitBtn.textContent = '⏳ 许愿中...';
    return true;
});
