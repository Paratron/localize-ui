import {defaultSettings, defaultFormatters} from './formatters.js';

let localizations = {};
let currentLocale = null;
let currentSettings = null;
let formatters = Object.assign({}, defaultFormatters);
let phrases = {};

/**
 * Use this method to call a formatter function from within another formatter function.
 * @param {string} formatterName
 * @param {*} value
 * @param {object} [settings] Optional. Extends the default settings for the formatter.
 */
formatters.format = (formatterName, value, settings) => {
    settings = Object.assign({}, currentSettings[formatterName] || {}, settings || {});
    return formatters[formatterName].call(formatters, value, settings);
};

/**
 * Use this method to retrieve the default Settings of a formatter within another formatter function.
 * @param {string} formatterName
 * @returns {*}
 */
formatters.defaultSettings = (formatterName) => {
    return Object.assign({}, currentSettings[formatterName]);
};

/**
 * For example, {debugger: {title: "test"} } becomes {"debugger.title": "test"}
 * @param {object} inObject
 * @param {string} [prefix]
 * @returns {*}
 */
function flattenObject(inObject, prefix = '') {
    return Object.keys(inObject).reduce((values, key) => {
        let value = inObject[key];
        let prefixedKey = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
            values[prefixedKey] = value;
        } else {
            Object.assign(values, flattenObject(value, prefixedKey));
        }

        return values;
    }, {});
}

const regexSplit = /{{.+?}}}*/;
const regexFind = /{{ *([a-z]+?)(, *([a-z]+?))*( *, *{(.+?)})* *}}/g;

/**
 * This method scans a template string if it contains any placeholders.
 * @param templateString
 * @returns {*}
 */
function prepare(templateString) {
    if (templateString.search('{{') === -1) {
        return templateString;
    }

    const out = {
        tpl: templateString.split(regexSplit),
        keys: []
    };

    let result;

    // eslint-disable-next-line
    while (result = regexFind.exec(templateString)) {
        //Stores propertyName, formatterName, formatterSettings
        out.keys.push(
            [
                result[1],
                result[3],
                result[5] ? JSON.parse('{' + result[5] + '}') : null
            ]
        );
    }

    return out;
}

/**
 * Take a translation Object, retrieved from a previously compiled template string and
 * fill in the placeholders with parameters.
 * @param translationObject
 * @param parameters
 * @returns {string}
 */
function resolveTemplate(translationObject, parameters) {
    let out = '';
    const tpl = translationObject.tpl;
    const keys = translationObject.keys;

    for (let i = 0; i < tpl.length; i++) {
        out += tpl[i];

        const k = keys[i];

        if (!k) {
            continue;
        }

        if (parameters[k[0]] === undefined) {
            out += '{{' + k[0] + '}}';
            continue;
        }

        if (!k[1]) {
            out += parameters[k[0]];
            continue;
        }

        if (k[1]) {
            if (formatters[k[1]]) {
                out += formatters.format(k[1], parameters[k[0]], k[2]);
            } else {
                out += parameters[k[0]];
            }
        }
    }

    return out;
}

/**
 * Use this method to define translation data for a given locale. If you do not plan to switch the localization
 * during runtime, you may leave out the locale attribute.
 *
 * @param {object} phrases
 * @param {object} [formatters]
 * @param {object} [formatterSettings]
 * @param {string} [locale="default"]
 */
export function defineLocalization({phrases, formatters: inFormatters, formatterSettings: inFormatterSettings, locale = 'default'}) {
    const data = flattenObject(inPhrases);

    Object.keys(data).map(v => prepare(v));

    localizations[locale] = {
        phrases: data,
        formatters: Object.assign({}, formatters, inFormatters || {}),
        settings: Object.assign({}, defaultSettings, inFormatterSettings || {})
    };
    if (currentLocale === null) {
        setLocalization(locale);
    }
}

/**
 * If you have previously defined multiple translations, you can swith the used localization
 * with this method.
 *
 * You need to redraw your user interface after you have switched the locale.
 * @param {string} localeKey
 */
export function setLocalization(localeKey) {
    currentLocale = localeKey;
    phrases = localizations[localeKey].phrases;
    currentSettings = localizations[localeKey].settings;
    formatters = localizations[localeKey].formatters;
}

/**
 * Returns the key of the currently active language.
 * @returns {*}
 */
export function getCurrentLocale() {
    return currentLocale;
}

/**
 * Call this method to retrieve phrases by key from your active localization set.
 * The function will automatically replace and format all placeholders.
 *
 * If the given key is not found in your localization set, the return value of this
 * function will be "[key]" where key is your given input key.
 *
 * @param {string} key
 * @param {object} [parameters]
 * @private
 */
export function __(key, parameters) {
    const t = phrases[key];
    parameters = parameters || {};

    if (!t) {
        return '[' + key + ']';
    }

    if (typeof t === 'string') {
        return t;
    }

    return resolveTemplate(t, parameters);
}

/**
 * This binds the __ method to a given namespace, so you don't always need to mention the full
 * keys of your phrases.
 *
 * Example:
 * __('my.namespaced.key1');
 * __('my.namespaced.key2');
 * __('my.namespaced.key3');
 *
 *
 * Versus:
 * const __ = __ns('my.namespaced');
 *
 * __('key1');
 * __('key2');
 * __('key3');
 *
 * @param {string} namespace
 * @returns {Function}
 */
export function __ns(namespace) {
    return (key, defaultString, parameters) => {
        return __(namespace + '.' + key, defaultString, parameters);
    }
}
