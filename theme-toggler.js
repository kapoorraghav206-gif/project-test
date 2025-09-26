// Minimal animated theme toggler inspired by AnimatedThemeToggler API

const STORAGE_KEY = 'theme';

function getStoredTheme() {
	return localStorage.getItem(STORAGE_KEY);
}

function applyTheme(theme) {
	const root = document.documentElement;
	root.setAttribute('data-theme', theme);
	localStorage.setItem(STORAGE_KEY, theme);
}

function getPreferredTheme() {
	const stored = getStoredTheme();
	if (stored) return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function createTogglerElement() {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'theme-toggler';
	btn.ariaLabel = 'Toggle theme';
	btn.innerHTML = `
		<span class="sun" aria-hidden="true">☀️</span>
		<span class="moon" aria-hidden="true">🌙</span>
	`;
	return btn;
}

export function mountAnimatedThemeToggler(targetId = 'theme-toggler-mount') {
	const mount = document.getElementById(targetId);
	if (!mount) return null;
	const btn = createTogglerElement();
	mount.innerHTML = '';
	mount.appendChild(btn);

	let theme = getPreferredTheme();
	applyTheme(theme);
	updateButtonState(btn, theme);

	btn.addEventListener('click', () => {
		const next = theme === 'dark' ? 'light' : 'dark';
		// small animation by toggling class
		btn.classList.add('spin');
		setTimeout(() => btn.classList.remove('spin'), 350);
		applyTheme(next);
		theme = next;
		updateButtonState(btn, theme);
	});

	return btn;
}

function updateButtonState(btn, theme) {
	btn.dataset.theme = theme;
}

// Auto-mount if used standalone after DOM ready
if (typeof window !== 'undefined') {
	window.addEventListener('DOMContentLoaded', () => {
		if (document.getElementById('theme-toggler-mount')) {
			mountAnimatedThemeToggler();
		}
	});
}


