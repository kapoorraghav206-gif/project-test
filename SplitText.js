export default class SplitText {
    constructor(options) {
        const {
            target,
            text,
            className = '',
            delay = 0,
            duration = 0.0006,
            ease = 'power3.out',
            splitType = 'chars',
            from = { opacity: 0, transform: 'translateY(40px)' },
            to = { opacity: 1, transform: 'translateY(0)' },
            threshold = 0.1,
            rootMargin = '0px',
            textAlign = 'left',
            onLetterAnimationComplete = () => {}
        } = options;

        this.options = { target, text, className, delay, duration, ease, splitType, from, to, threshold, rootMargin, textAlign, onLetterAnimationComplete };
        this.init();
    }

    init() {
        const el = document.querySelector(this.options.target);
        if (!el) return;

        if (this.options.text) {
            el.textContent = '';
        }
        el.style.textAlign = this.options.textAlign;

        const content = this.options.text || el.textContent;
        const fragments = this.split(content, this.options.splitType);

        const fragmentElements = fragments.map((frag) => {
            const span = document.createElement('span');
            span.textContent = frag.text;
            span.style.display = 'inline-block';
            span.style.opacity = (this.options.from.opacity ?? 1).toString();
            if (this.options.from.transform) span.style.transform = this.options.from.transform;
            if (this.options.className) span.className = this.options.className;
            return span;
        });

        // Build DOM
        el.innerHTML = '';
        fragmentElements.forEach((node) => el.appendChild(node));

        const animate = () => {
            fragmentElements.forEach((node, index) => {
                const totalDelay = (this.options.delay || 0) * index;
                setTimeout(() => {
                    node.style.transition = `all ${this.options.duration}s cubic-bezier(0.22, 1, 0.36, 1)`;
                    if (typeof this.options.to.opacity !== 'undefined') node.style.opacity = this.options.to.opacity;
                    if (this.options.to.transform) node.style.transform = this.options.to.transform;
                    // callback per letter
                    this.options.onLetterAnimationComplete?.();
                }, totalDelay);
            });
        };

        // Observe when in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animate();
                    observer.disconnect();
                }
            });
        }, { threshold: this.options.threshold, rootMargin: this.options.rootMargin });
        observer.observe(el);
    }

    split(text, type) {
        if (type === 'chars') {
            return Array.from(text).map((ch) => ({ type: 'char', text: ch }));
        }
        if (type === 'words') {
            return text.split(/(\s+)/).map((w) => ({ type: 'word', text: w }));
        }
        return [{ type: 'text', text }];
    }
}


