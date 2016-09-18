export const defaultSettings = {
    number: {
        thousandsSeparator: ',',
        fractionSeparator: '.',
        fractionCount: 2
    },
    currency: {
        symbol: '$',
        symbolPlacement: 1,
        fractionCount: 2
    },
    naturalNumber: {
        literals: ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
    },
    femaleNaturalNumber: 'no',
    maleNaturalNumber: 'no',
    naturalList: {
        separator: ', ',
        finalSeparator: ' and '
    }
};

export const defaultFormatters = {
    /**
     * Pass a number between 0 and 1 to have it outputted in percentage format.
     * @param {number} value
     * @returns {string}
     */
    percent: function (value) {
        return value * 100 + '%';
    },
    /**
     * This formats a number according to the given settings.
     * Thousands separator, fraction separator and number of fraction digits are enforced.
     * @param {number} value
     * @param settings
     * @returns {string}
     */
    number: function (value, settings) {
        let p;

        value = parseFloat(value);
        p = value.toFixed(settings.fractionCount).split('.');

        return p[0].split('').reverse().reduce(function (acc, num, i) {
                return num === '-' ? acc : num + (i && !(i % 3) ? settings.thousandsSeparator : '') + acc;
            }, '') + (settings.fractionCount ? settings.fractionSeparator + p[1] : '');
    },
    /**
     * This formats a number with the "number" formatter, first and adds the currency symbol.
     * @param {number} value
     * @param settings
     * @returns {string}
     */
    currency: function (value, settings) {
        value = this.format('number', value, settings);

        if (!settings.symbol || !settings.symbolPlacement) {
            return value;
        }

        return settings.symbolPlacement - 1 ? value + settings.symbol : settings.symbol + value;
    },

    /**
     * The natural number formatter will write every number as a literal, if defined. All other numbers
     * will be forwarded to the number formatter.
     *
     * Examples:
     * 0 => no
     * 1 => one
     * 5 => five
     * 10 => 10
     * 1000 => 1,000
     *
     * @param {number} value
     * @param settings
     * @returns {string}
     */
    naturalNumber: function (value, settings) {
        if (settings.literals[value]) {
            return settings.literals[value];
        }

        return this.format('number', value, settings);
    },

    /**
     * Like the natural number selector, but replaces the word for "no" with a female version, if necessary in your language.
     * @param {number} value
     * @param settings
     * @returns {string}
     */
    femaleNaturalNumber: function (value, settings) {
        const subSettings = this.defaultSettings('naturalNumber');
        subSettings.literals[0] = settings;
        return this.format('naturalNumber', value, subSettings);
    },

    /**
     * Like the natural number selector, but replaces the word for "no" with a male version, if necessary in your language.
     * @param {number} value
     * @param settings
     */
    maleNaturalNumber: function (value, settings) {
        const subSettings = this.defaultSettings('naturalNumber');
        subSettings.literals[0] = settings;
        return this.format('naturalNumber', value, subSettings);
    },

    /**
     * This formatter will help you selecting plural forms of words depending on the value.
     * This formatter _requires_ you to define the settings in the template string.
     * It awaits a string with the plural forms separated by a pipe symbol (|). If the submitted value is
     * 1, the first of the two submitted words is returned, otherwise, the second word.
     *
     * Example:
     * settings = "boy|boys"
     *
     * 0 => boys
     * 1 => boy
     * 2 => boys
     * 3 => boys
     * ...
     *
     * Tip: Use this together with the naturalNumber formatter.
     *
     * @param {number} value
     * @param {string} settings
     * @returns {string}
     */
    plural: function (value, settings) {
        settings = settings.split('|');

        if (value === 1) {
            return settings[0];
        }

        return settings[1];
    },

    /**
     * This formatter will form a natural list from the array you pass as value.
     * All values in the array will be concatenated with a comma, except of the last one, which
     * will be concatenated with an "and".
     *
     * Example:
     * ['a', 'b', 'c'] => a, b and c
     *
     * @param {array} value
     * @param settings
     * @returns {string}
     */
    naturalList: function (value, settings) {
        if (value.length === 1) {
            return value[0];
        }
        const lastValue = value.pop();

        return value.join(settings.separator) + settings.finalSeparator + lastValue;
    }
};