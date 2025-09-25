(() => {
    const byId = (id) => document.getElementById(id);
    const savedLang = localStorage.getItem('selectedLang') || 'en';
    const indicator = byId('lang-indicator');
    if (indicator) indicator.textContent = `Language: ${savedLang.toUpperCase()}`;

    // Seed: 20 artist descriptions
    const seedArtists = [
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

    // User card from saved profile (if available)
    const savedState = localStorage.getItem('artisanSetup');
    if (savedState) {
        try {
            const data = JSON.parse(savedState);
            const profile = data?.profile || {};
            if (profile?.name || profile?.bio) {
                seedArtists.unshift({
                    name: profile.name || 'You',
                    handle: '@you',
                    img: 'https://avatar.vercel.sh/you',
                    desc: profile.bio || 'Your artisan profile is saved. Share your craft with the world.'
                });
            }
        } catch {}
    }

    // Bind form to override/create the user card and persist to storage
    const form = byId('artist-form');
    const nameInput = byId('artist-name');
    const descInput = byId('artist-desc');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (nameInput?.value || '').trim();
        const desc = (descInput?.value || '').trim();
        // Update existing storage block used by index flow
        const existing = JSON.parse(localStorage.getItem('artisanSetup') || '{}');
        existing.profile = existing.profile || {};
        if (name) existing.profile.name = name;
        if (desc) existing.profile.bio = desc;
        localStorage.setItem('artisanSetup', JSON.stringify(existing));
        // Reflect immediately in marquee by updating the first card
        if (name || desc) {
            const first = seedArtists[0];
            if (first && first.handle === '@you') {
                if (name) first.name = name;
                if (desc) first.desc = desc;
            } else {
                seedArtists.unshift({ name: name || 'You', handle: '@you', img: 'https://avatar.vercel.sh/you', desc: desc || 'Sharing your craft.' });
            }
            render();
        }
    });

    const createCard = (a) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'card';
        wrapper.innerHTML = `
            <div class="card-head">
                <img class="avatar" src="${a.img}" alt="${a.name}">
                <div>
                    <p class="name">${a.name}</p>
                    <p class="handle">${a.handle}</p>
                </div>
            </div>
            <p class="desc">${a.desc}</p>
        `;
        return wrapper;
    };

    const renderRow = (targetEl, list) => {
        targetEl.innerHTML = '';
        // Duplicate the list to enable seamless scroll to 50%
        const double = [...list, ...list];
        double.forEach((a) => targetEl.appendChild(createCard(a)));
    };

    const render = () => {
        const half = Math.ceil(seedArtists.length / 2);
        const row1 = seedArtists.slice(0, half);
        const row2 = seedArtists.slice(half);
        renderRow(byId('row-1'), row1);
        renderRow(byId('row-2'), row2);
    };

    // Pause/play
    const pauseBtn = byId('pause');
    const playBtn = byId('play');
    const setPlayState = (state) => {
        document.querySelectorAll('.marquee-row').forEach(el => {
            el.style.animationPlayState = state;
        });
    };
    pauseBtn?.addEventListener('click', () => setPlayState('paused'));
    playBtn?.addEventListener('click', () => setPlayState('running'));

    // Initial render
    render();
})();


