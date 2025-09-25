export function isVoiceSupported() {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function createRecognizer(lang) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return null;
    const rec = new SpeechRecognition();
    rec.lang = lang || (localStorage.getItem('selectedLang') || 'en-US');
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    return rec;
}

/**
 * Binds a mic button to fill a target textarea/input via voice
 * @param {HTMLButtonElement} button
 * @param {HTMLInputElement|HTMLTextAreaElement} target
 * @param {(text:string)=>void=} onFinal
 */
export function bindVoiceToField(button, target, onFinal) {
    const rec = createRecognizer();
    if (!rec) {
        button?.setAttribute('disabled', 'true');
        return () => {};
    }
    let listening = false;
    let accumulated = '';

    const start = () => {
        if (listening) return;
        accumulated = '';
        rec.start();
        listening = true;
        button.classList.add('recording');
    };
    const stop = () => {
        if (!listening) return;
        rec.stop();
        listening = false;
        button.classList.remove('recording');
    };

    rec.onresult = (e) => {
        let finalText = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
            const res = e.results[i];
            const transcript = res[0].transcript;
            if (res.isFinal) {
                finalText += transcript + ' ';
            } else {
                accumulated = transcript;
            }
        }
        const combined = (target.value + ' ' + finalText).trim();
        target.value = combined;
        if (finalText && onFinal) onFinal(combined);
    };

    rec.onerror = () => stop();
    rec.onend = () => { listening = false; button.classList.remove('recording'); };

    button?.addEventListener('click', () => {
        if (listening) stop(); else start();
    });

    return stop;
}


