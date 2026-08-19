/**
 * i18n Module - Client-side translation system for ProgressiveAddon
 * Uses data-i18n attributes on elements and swaps text content based on selected language.
 */
const I18n = (() => {
    let currentLang = 'en';
    let translations = {};
    let loadedLangs = {};

    const SUPPORTED_LANGS = ['en', 'id', 'ja'];
    const STORAGE_KEY = 'lang';

    async function loadLang(lang) {
        if (loadedLangs[lang]) return loadedLangs[lang];
        try {
            const resp = await fetch(`/assets/js/i18n/${lang}.json`);
            if (!resp.ok) throw new Error(`Failed to load ${lang}`);
            const data = await resp.json();
            loadedLangs[lang] = data;
            return data;
        } catch (e) {
            console.warn(`i18n: Could not load language "${lang}", falling back to en`);
            return null;
        }
    }

    function t(key) {
        if (translations[key]) return translations[key];
        if (loadedLangs['en'] && loadedLangs['en'][key]) return loadedLangs['en'][key];
        return key;
    }

    function applyTranslations() {
        // Translate static UI elements via data-i18n keys
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = t(key);
            if (translated) {
                el.textContent = translated;
            }
        });

        // Translate CMS content via data-lang-* attributes
        document.querySelectorAll('[data-lang-en]').forEach(el => {
            const attr = `data-lang-${currentLang}`;
            const fallback = el.getAttribute('data-lang-en');
            const translated = el.getAttribute(attr) || fallback;
            if (translated) {
                el.textContent = translated;
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            const translated = t(key);
            if (translated) {
                el.placeholder = translated;
            }
        });

        document.documentElement.lang = currentLang;

        const sortLabel = document.getElementById('sort-label');
        if (sortLabel) {
            sortLabel.textContent = t('collection.sort');
        }
    }

    function updateLangSwitcherUI(lang) {
        const langCurrent = document.querySelector('.lang-current');
        const langOptions = document.querySelectorAll('.lang-option');
        if (langCurrent) langCurrent.textContent = lang.toUpperCase();
        langOptions.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === lang);
        });
    }

    async function setLang(lang) {
        if (!SUPPORTED_LANGS.includes(lang)) lang = 'en';
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);

        const data = await loadLang(lang);
        if (data) translations = data;

        await loadLang('en');
        applyTranslations();
        updateLangSwitcherUI(lang);
    }

    function getLang() {
        return currentLang;
    }

    async function init() {
        const saved = localStorage.getItem(STORAGE_KEY) || 'en';
        currentLang = SUPPORTED_LANGS.includes(saved) ? saved : 'en';

        await loadLang('en');
        if (currentLang !== 'en') {
            await loadLang(currentLang);
        }

        translations = loadedLangs[currentLang] || loadedLangs['en'] || {};
        applyTranslations();
        updateLangSwitcherUI(currentLang);
    }

    return { init, setLang, getLang, t, SUPPORTED_LANGS };
})();
