document.addEventListener('DOMContentLoaded', () => {
    const byId = (id) => document.getElementById(id);
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    const indicator = byId('lang-indicator');
    if (indicator) indicator.textContent = savedLang.toUpperCase();

    const firstname = byId('firstname');
    const lastname = byId('lastname');
    const email = byId('email');
    const password = byId('password');
    const desc = byId('artist-desc');
    const form = byId('join-form');

    // Load previously saved profile if present
    const stateRaw = localStorage.getItem('artisanSetup');
    if (stateRaw) {
        try {
            const data = JSON.parse(stateRaw);
            const profile = data?.profile || {};
            if (profile.name) {
                const parts = String(profile.name).split(' ');
                firstname.value = parts[0] || '';
                lastname.value = parts.slice(1).join(' ');
            }
            if (profile.bio) desc.value = profile.bio;
        } catch {}
    }

    const saveProfile = () => {
        const existing = JSON.parse(localStorage.getItem('artisanSetup') || '{}');
        existing.profile = existing.profile || {};
        const fullName = [firstname.value, lastname.value].filter(Boolean).join(' ').trim();
        if (fullName) existing.profile.name = fullName;
        if (desc.value) existing.profile.bio = desc.value.trim();
        if (email.value) existing.profile.email = email.value.trim();
        localStorage.setItem('artisanSetup', JSON.stringify(existing));
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfile();
        // After saving, ensure the marquee reflects updates immediately
        render();
        // Optionally toast or indicate success
    });

    [firstname, lastname, email, password, desc].forEach((el) => {
        el?.addEventListener('input', saveProfile);
    });

    // Marquee data and rendering
    const seed = [
        { name: 'Maya Kapoor', handle: '@maya', img: 'https://avatar.vercel.sh/maya', desc: 'Textile artist weaving stories with natural dyes and handloom traditions.' },
        { name: 'Arjun Das', handle: '@arjun', img: 'https://avatar.vercel.sh/arjun', desc: 'Woodturner crafting heirloom bowls from reclaimed teak and rosewood.' },
        { name: 'Leela Shah', handle: '@leela', img: 'https://avatar.vercel.sh/leela', desc: 'Ceramicist exploring ash glazes and quiet, functional forms.' },
        { name: 'Ravi Menon', handle: '@ravi', img: 'https://avatar.vercel.sh/ravi', desc: 'Metalsmith forging minimal jewelry inspired by coastal geometry.' },
        { name: 'Nora Iqbal', handle: '@nora', img: 'https://avatar.vercel.sh/nora', desc: 'Glass artist capturing light through blown, iridescent vessels.' },
        { name: 'Ira Bose', handle: '@ira', img: 'https://avatar.vercel.sh/ira', desc: 'Paper maker coaxing textures from cotton, abaca and silks.' },
        { name: 'Vikram Rao', handle: '@vikram', img: 'https://avatar.vercel.sh/vikram', desc: 'Stone carver shaping quiet guardians from basalt and granite.' },
        { name: 'Tara Singh', handle: '@tara', img: 'https://avatar.vercel.sh/tara', desc: 'Natural dyer and quilt designer stitching color into memory.' },
        { name: 'Kunal Jain', handle: '@kunal', img: 'https://avatar.vercel.sh/kunal', desc: 'Leather artisan crafting lifetime belts and thoughtful carry goods.' },
        { name: 'Sara Pillai', handle: '@sara', img: 'https://avatar.vercel.sh/sara', desc: 'Basket weaver translating river rhythms into cane and willow.' },
        { name: 'Omar Kazmi', handle: '@omar', img: 'https://avatar.vercel.sh/omar', desc: 'Calligrapher blending Kufic structure with contemporary motion.' },
        { name: 'Neel Roy', handle: '@neel', img: 'https://avatar.vercel.sh/neel', desc: 'Luthier building small-bodied guitars with a warm, present voice.' },
        { name: 'Asha Patel', handle: '@asha', img: 'https://avatar.vercel.sh/asha', desc: 'Embroidery artist mapping cities with thread and negative space.' },
        { name: 'Jonah Mehra', handle: '@jonah', img: 'https://avatar.vercel.sh/jonah', desc: 'Blacksmith tempering kitchen knives for daily ceremony.' },
        { name: 'Zoya Khan', handle: '@zoya', img: 'https://avatar.vercel.sh/zoya', desc: 'Beadwork storyteller threading color gradients like sunrise.' },
        { name: 'Kiran Rao', handle: '@kiran', img: 'https://avatar.vercel.sh/kiran', desc: 'Wheel potter chasing soft rims and generous handles.' },
        { name: 'Meera Joshi', handle: '@meera', img: 'https://avatar.vercel.sh/meera', desc: 'Macramé sculptor exploring tension, suspension and shadow.' },
        { name: 'Dev Gupta', handle: '@dev', img: 'https://avatar.vercel.sh/dev', desc: 'Printmaker layering linocuts with monotype accidents.' },
        { name: 'Anu Rao', handle: '@anur', img: 'https://avatar.vercel.sh/anur', desc: 'Glass fuser composing moonscapes with powdered frits.' },
        { name: 'Farah Ali', handle: '@farah', img: 'https://avatar.vercel.sh/farah', desc: 'Textile conservator reviving patterns with hand restoration.' },
    ];

    // Insert user card at top if present
    const injectUserCard = (list) => {
        const saved = JSON.parse(localStorage.getItem('artisanSetup') || '{}');
        const profile = saved?.profile || {};
        if (profile.name || profile.bio) {
            list.unshift({
                name: profile.name || 'You',
                handle: '@you',
                img: 'https://avatar.vercel.sh/you',
                desc: profile.bio || 'Your artisan profile is saved. Share your craft with the world.'
            });
        }
        return list;
    };

    const makeCard = (a) => {
        const el = document.createElement('div');
        el.className = 'min-w-[260px] max-w-[260px] bg-white/5 border border-white/10 rounded-xl p-3';
        el.innerHTML = `
            <div class="flex items-center gap-2">
                <img class="w-9 h-9 rounded-full" src="${a.img}" alt="${a.name}">
                <div>
                    <p class="text-neutral-100 text-sm font-semibold">${a.name}</p>
                    <p class="text-neutral-400 text-xs">${a.handle}</p>
                </div>
            </div>
            <p class="text-neutral-200 text-sm mt-2 leading-snug">${a.desc}</p>
        `;
        return el;
    };

    const renderRow = (target, list) => {
        target.innerHTML = '';
        const double = [...list, ...list];
        double.forEach((a) => target.appendChild(makeCard(a)));
    };

    const render = () => {
        const data = injectUserCard([...seed]);
        const half = Math.ceil(data.length / 2);
        renderRow(byId('row-1'), data.slice(0, half));
        renderRow(byId('row-2'), data.slice(half));
    };

    // Pause/Play
    const setPlayState = (state) => {
        document.querySelectorAll('.marquee-row').forEach((el) => el.style.animationPlayState = state);
    };
    byId('pause')?.addEventListener('click', () => setPlayState('paused'));
    byId('play')?.addEventListener('click', () => setPlayState('running'));

    // Voice input
    try {
        if (window.bindVoiceToField) {
            const micBtn = byId('mic-btn');
            if (micBtn && desc) {
                window.bindVoiceToField(micBtn, desc, () => saveProfile());
            }
        }
    } catch {}

    render();
});


