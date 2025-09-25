document.addEventListener('DOMContentLoaded', () => {
    const byId = (id) => document.getElementById(id);
    const nameEl = byId('full-name');
    const emailEl = byId('email');
    const bioEl = byId('bio');
    const micBtn = byId('mic-btn');

    // Load
    try {
        const saved = JSON.parse(localStorage.getItem('artisanSetup') || '{}');
        const p = saved.profile || {};
        nameEl.value = p.name || '';
        emailEl.value = p.email || '';
        bioEl.value = p.bio || '';
    } catch {}

    const save = () => {
        const existing = JSON.parse(localStorage.getItem('artisanSetup') || '{}');
        existing.profile = existing.profile || {};
        existing.profile.name = nameEl.value.trim();
        existing.profile.email = emailEl.value.trim();
        existing.profile.bio = bioEl.value.trim();
        localStorage.setItem('artisanSetup', JSON.stringify(existing));
    };

    ;[nameEl, emailEl, bioEl].forEach((el) => el?.addEventListener('input', save));

    // Voice on bio
    try {
        if (window.bindVoiceToField && micBtn && bioEl) {
            window.bindVoiceToField(micBtn, bioEl, () => save());
        }
    } catch {}
});


