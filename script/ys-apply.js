// ====== 回到首页 ======
function goHome() {
    window.location.href = 'index.html';
}

// ====== DOM 引用 ======
const uidInput = document.getElementById('uidInput');
const uidHint = document.getElementById('uidHint');
const emailInput = document.getElementById('emailInput');
const emailHint = document.getElementById('emailHint');
const form = document.querySelector('.apply-form');
const submitBtn = document.getElementById('submitBtn');

// ====== UID 格式校验：9位数字，且第一位只能是 1/2/3 ======
const UID_PATTERN = /^[123]\d{8}$/;

function validateUID(uid) {
    return UID_PATTERN.test(uid);
}

// ====== 邮箱格式校验 ======
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
    return EMAIL_PATTERN.test(email);
}

// ====== UID 实时反馈 ======
uidInput.addEventListener('input', function () {
    // 只保留数字
    this.value = this.value.replace(/\D/g, '').slice(0, 12);

    const val = this.value;

    if (val.length === 0) {
        uidHint.textContent = '请输入 9 位数字 UID（首位 1/2/3）';
        uidHint.className = 'input-hint';
        return;
    }

    // 首位校验
    if (!/^[123]/.test(val)) {
        uidHint.textContent = '✗ UID 首位只能是 1、2 或 3';
        uidHint.className = 'input-hint invalid';
        return;
    }

    if (val.length < 9) {
        uidHint.textContent = `还需输入 ${9 - val.length} 位`;
        uidHint.className = 'input-hint';
    } else if (validateUID(val)) {
        uidHint.textContent = '✓ 格式正确';
        uidHint.className = 'input-hint valid';
    } else {
        uidHint.textContent = '✗ UID 格式不正确（应为 9 位数字）';
        uidHint.className = 'input-hint invalid';
    }
});

// ====== 邮箱实时反馈 ======
emailInput.addEventListener('input', function () {
    const val = this.value.trim();

    if (val.length === 0) {
        emailHint.textContent = '此项为必填，请填写邮箱';
        emailHint.className = 'input-hint';
        return;
    }

    if (validateEmail(val)) {
        emailHint.textContent = '✓ 邮箱格式正确';
        emailHint.className = 'input-hint valid';
    } else {
        emailHint.textContent = '✗ 邮箱格式不正确';
        emailHint.className = 'input-hint invalid';
    }
});

// ====== 表单提交前校验 ======
form.addEventListener('submit', function (e) {
    const uid = uidInput.value.trim();
    const email = emailInput.value.trim();
    let hasError = false;

    // UID 校验
    if (!validateUID(uid)) {
        e.preventDefault();
        if (uid.length === 0) {
            uidHint.textContent = '✗ 请填写 UID';
        } else if (!/^[123]/.test(uid)) {
            uidHint.textContent = '✗ UID 首位只能是 1、2 或 3';
        } else {
            uidHint.textContent = '✗ UID 格式不正确，请检查后重试';
        }
        uidHint.className = 'input-hint invalid';
        uidInput.focus();
        hasError = true;
    }

    // 邮箱校验
    if (!validateEmail(email)) {
        e.preventDefault();
        if (email.length === 0) {
            emailHint.textContent = '✗ 请填写邮箱';
        } else {
            emailHint.textContent = '✗ 邮箱格式不正确，请检查后重试';
        }
        emailHint.className = 'input-hint invalid';
        if (!hasError) emailInput.focus();
        hasError = true;
    }

    if (hasError) return false;

    // 防重复提交
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ 提交中...';
    return true;
});