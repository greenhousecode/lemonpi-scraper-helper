import { fetch } from './helpers';

const requiredFields = { 'advertiser-id': 'number', type: 'string', sku: 'string' };
const getFormattedConsoleMessage = (message, messageStyle = '') => [
  `%cScraper Helper (event)%c ${message}`,
  'padding:1px 6px 0;border-radius:2px;background:#fedc00;color:#313131',
  messageStyle,
];

export default class Event {
  constructor(config) {
    this.errors = {};
    this.config = {
      debug: /lemonpi_debug/i.test(window.location.href),
      type: 'product-viewed',
      ...config,
    };

    Object.keys(requiredFields).forEach(field => {
      // eslint-disable-next-line valid-typeof
      if (typeof this.config[field] !== requiredFields[field]) {
        this.logError(field, `needs to be a ${requiredFields[field]}`);
      }
    });

    this.event();
  }

  logError(subject, ...args) {
    if (this.config.debug) {
      console.error(...getFormattedConsoleMessage(subject, 'font-weight:bold'), ...args);
    }
  }

  logSuccess(message, ...args) {
    if (this.config.debug) {
      console.log(...getFormattedConsoleMessage(message, 'color:green'), ...args);
    }
  }

  onEvent(result) {
    if (result) {
      this.logError(`Event "${this.config.type}" unsuccessful!`, 'LemonPI responded:', result);
    } else {
      this.logSuccess(`Event "${this.config.type}" successful`);
    }
  }

  event() {
    const e = { 'event-type': this.config.type, sku: this.config.sku };

    try {
      fetch(
        `https://d.lemonpi.io/a/${
          this.config['advertiser-id']
        }/product/event?e=${encodeURIComponent(JSON.stringify(e))}`,
        this.onEvent.bind(this),
      );
    } catch ({ message }) {
      this.logError(`Event "${this.config.type}" unsuccessful:`, message);
    }
  }
}
