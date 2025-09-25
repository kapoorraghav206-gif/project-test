/**
 * @typedef {Object} Profile
 * @property {string=} name
 * @property {string=} bio
 * @property {string=} email
 * @property {string=} location
 * @property {string[]=} shipping
 */

/**
 * @typedef {Object} AppState
 * @property {number=} currentScreen
 * @property {Profile=} profile
 */

const STORAGE_KEY = 'artisanSetup';
const LANG_KEY = 'selectedLang';

/**
 * @returns {AppState}
 */
export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

/**
 * @param {Partial<AppState>} partial
 * @returns {AppState}
 */
export function saveState(partial) {
    const current = loadState();
    const next = { ...current, ...partial };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
}

/**
 * @param {Partial<Profile>} partial
 * @returns {Profile}
 */
export function saveProfilePartial(partial) {
    const current = loadState();
    const nextProfile = { ...(current.profile || {}), ...partial };
    saveState({ profile: nextProfile });
    return nextProfile;
}

/**
 * @returns {Profile}
 */
export function loadProfile() {
    return loadState().profile || {};
}

/**
 * @param {string} lang
 */
export function setLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
}

/**
 * @returns {string|undefined}
 */
export function getLanguage() {
    return localStorage.getItem(LANG_KEY) || undefined;
}


