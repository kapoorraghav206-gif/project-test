// Pill-style navigation with animated indicator and theme toggler hook

const NAV_CONFIG = {
	logoSrc: 'img/logo.svg',
	logoAlt: 'Company Logo',
	items: [
		{ label: 'Home', href: 'index.html' },
		{ label: 'About', href: '#about' },
		{ label: 'Services', href: '#services' },
		{ label: 'Contact', href: '#contact' }
	],
	activeHref: (typeof window !== 'undefined') ? (location.pathname.split('/').pop() || 'index.html') : 'index.html',
	className: 'custom-nav',
	baseColor: '#000000',
	pillColor: '#ffffff',
	pillTextColor: '#000000',
	hoveredPillTextColor: '#ffffff'
};

function createNavRoot() {
	let root = document.getElementById('app-nav');
	if (!root) {
		root = document.createElement('div');
		root.id = 'app-nav';
		document.body.prepend(root);
	}
	return root;
}

function renderPillNav(config = NAV_CONFIG) {
	const root = createNavRoot();
	root.innerHTML = '';

	const nav = document.createElement('nav');
	nav.className = `pill-nav ${config.className || ''}`.trim();
	
	const inner = document.createElement('div');
	inner.className = 'pill-nav-inner';

	const left = document.createElement('a');
	left.className = 'pill-nav-logo';
	left.href = config.items?.[0]?.href || '#';
	left.ariaLabel = config.logoAlt || 'Logo';
	left.innerHTML = config.logoSrc ? `<img src="${config.logoSrc}" alt="${config.logoAlt || ''}" />` : `<span class="logo-text">Logo</span>`;

	const listWrap = document.createElement('div');
	listWrap.className = 'pill-nav-list';

	const indicator = document.createElement('div');
	indicator.className = 'pill-indicator';
	indicator.style.backgroundColor = config.pillColor;

	const ul = document.createElement('ul');
	ul.role = 'menubar';

	const currentPath = config.activeHref || location.pathname;

	config.items.forEach((item) => {
		const li = document.createElement('li');
		li.role = 'none';
		const a = document.createElement('a');
		a.role = 'menuitem';
		a.href = item.href;
		a.textContent = item.label;
		a.dataset.href = item.href;
		li.appendChild(a);
		ul.appendChild(li);
	});

	listWrap.appendChild(indicator);
	listWrap.appendChild(ul);

	const right = document.createElement('div');
	right.className = 'pill-nav-right';
	// placeholder for theme toggler (mounted by theme-toggler.js)
	const togglerMount = document.createElement('div');
	togglerMount.id = 'theme-toggler-mount';
	right.appendChild(togglerMount);

	inner.appendChild(left);
	inner.appendChild(listWrap);
	inner.appendChild(right);
	nav.appendChild(inner);
	root.appendChild(nav);

	const updateIndicator = (targetAnchor) => {
		if (!targetAnchor) return;
		const rect = targetAnchor.getBoundingClientRect();
		const containerRect = ul.getBoundingClientRect();
		const leftOffset = rect.left - containerRect.left;
		indicator.style.transform = `translateX(${leftOffset}px)`;
		indicator.style.width = `${rect.width}px`;
	};

	const anchors = Array.from(ul.querySelectorAll('a'));
	const activeAnchor = anchors.find(a => a.getAttribute('href') === currentPath || a.dataset.href === currentPath) || anchors[0];
	anchors.forEach(a => {
		a.addEventListener('mouseenter', () => updateIndicator(a));
		a.addEventListener('focus', () => updateIndicator(a));
	});
	listWrap.addEventListener('mouseleave', () => updateIndicator(activeAnchor));

	// Initial layout after frame paint
	requestAnimationFrame(() => updateIndicator(activeAnchor));

	// Expose colors to CSS via vars
	listWrap.style.setProperty('--pill-text', config.pillTextColor);
	listWrap.style.setProperty('--pill-text-hover', config.hoveredPillTextColor);

	return nav;
}

export function mountPillNav(customConfig) {
	return renderPillNav({ ...NAV_CONFIG, ...(customConfig || {}) });
}

// Auto-mount when loaded directly
if (typeof window !== 'undefined') {
	window.addEventListener('DOMContentLoaded', () => {
		if (!document.querySelector('.pill-nav')) {
			mountPillNav();
		}
	});
}


