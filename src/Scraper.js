import { generateHash, fetch } from './helpers';

const requiredFields = { 'advertiser-id': 'number', sku: 'string' };
const getFormattedConsoleMessage = (message, messageStyle = '') => [
  `%cScraper Helper%c ${message}`,
  'padding:1px 6px 0;border-radius:2px;background:#fedc00;color:#313131',
  messageStyle,
];

export default class Scraper {
  constructor(config) {
    this.lastScrapedHash = '';
    this.errors = {};
    this.config = {
      debug: /lemonpi_debug/i.test(window.location.href),
      allowTranslated: false,
      optionalFields: [],
      keepScraping: true,
      beforePush: null,
      interval: 750,
      urlTest: /$/,
      fields: {},
      ...config,
    };

    this.scrape();
  }

  logSuccess(message, ...args) {
    if (this.config.debug) {
      console.log(...getFormattedConsoleMessage(message, 'color:green'), ...args);
    }
  }

  addError(subject, ...args) {
    if (!this.errors[subject]) {
      this.errors[subject] = args;
    }
  }

  hasErrors() {
    return !!Object.keys(this.errors).length;
  }

  logErrors() {
    if (this.config.debug) {
      Object.keys(this.errors).forEach(subject =>
        console.error(
          ...getFormattedConsoleMessage(subject, 'font-weight:bold'),
          ...this.errors[subject],
        ),
      );
    }
  }

  onPush(fieldValues, result) {
    if (result) {
      const { message, details } = result.warning || result.error;
      this.addError('Push unsuccessful!', `LemonPI responded: ${message}`, details);
      this.logErrors();
    } else {
      this.logSuccess('Scrape & push successful:', fieldValues);
    }
  }

  push(fieldValues) {
    const { 'advertiser-id': advertiserId, sku } = fieldValues;
    const fields = fieldValues;
    delete fields['advertiser-id'];
    delete fields.sku;

    try {
      const url = this.config.debug
        ? 'https://d.lemonpi.io/scrapes?validate=true'
        : 'https://d.lemonpi.io/scrapes';

      fetch(url, this.onPush.bind(this, fields), {
        method: 'POST',
        body: { 'advertiser-id': advertiserId, sku, fields },
      });
    } catch ({ message }) {
      this.addError('Push unsuccessful:', message);
    }
  }

  scrape() {
    // Clear errors for each new scrape
    this.errors = {};

    // Merge in required fields, if not present
    const fieldValues = Object.keys(requiredFields).reduce(
      (fields, requiredField) => ({
        ...fields,
        [requiredField]: fields[requiredField] || null,
      }),
      this.config.fields,
    );

    // Test the URL for admittance
    if (!this.config.urlTest.test(window.location.href)) {
      this.addError('The URL', `doesn't match "${this.config.urlTest.toString()}"`);
    }

    // Ignore client-translated pages
    if (!this.config.allowTranslated && document.querySelector('html[class*="translated-"]')) {
      this.addError('The page', 'has been translated by the browser, and will be ignored');
    }

    if (!this.hasErrors()) {
      // Resolve field result values
      Object.keys(fieldValues).forEach(field => {
        // Execute function type fields
        if (typeof fieldValues[field] === 'function') {
          try {
            fieldValues[field] = fieldValues[field]();
          } catch ({ message }) {
            if (!this.config.optionalFields.includes(field)) {
              this.addError(field, message);
            }
          }
        }

        // String trimming
        if (typeof fieldValues[field] === 'string') {
          fieldValues[field] = fieldValues[field].replace(/\s+/g, ' ').trim();
        }

        // Remove empty fields
        if (fieldValues[field] == null || fieldValues[field] === '') {
          delete fieldValues[field];

          if (!this.config.optionalFields.includes(field)) {
            this.addError(field, 'is empty');
          }
        }

        // Field exceptions
        if (Object.keys(requiredFields).includes(field)) {
          // eslint-disable-next-line valid-typeof
          if (typeof fieldValues[field] !== requiredFields[field]) {
            this.addError(field, `needs to be a ${requiredFields[field]}`);
          }
        }
      });
    }

    const hashedResult = generateHash(fieldValues, window.location.href);

    if (this.lastScrapedHash !== hashedResult) {
      this.lastScrapedHash = hashedResult;

      if (!this.hasErrors()) {
        // Execute optional lifecycle hook to manipulate fields before pushing
        if (typeof this.config.beforePush === 'function') {
          try {
            this.config.beforePush(fieldValues, this.push.bind(this));
          } catch ({ message }) {
            this.addError('beforePush failed:', message);
          }
        } else {
          this.push(fieldValues);
        }
      } else {
        this.addError('Scrape unsuccessful:', fieldValues);
      }

      this.logErrors();
    }

    // Scrape again?
    if (this.config.keepScraping || this.hasErrors()) {
      setTimeout(this.scrape.bind(this), this.config.interval);
    }
  }
}
