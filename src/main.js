import Scraper from './Scraper';
import {
  getUrl,
  getUrlPathSegment,
  getUrlPathSegments,
  getUrlQueryParameter,
  getUrlQueryParameters,
  getBackgroundImageUrl,
  generateHash,
  setCookie,
  getCookie,
} from './helpers';

export const scrape = (...args) => new Scraper(...args);

// TODO: when the LP endpoint is known
// export const event = () => {};

export {
  getUrl,
  getUrlPathSegment,
  getUrlPathSegments,
  getUrlQueryParameter,
  getUrlQueryParameters,
  getBackgroundImageUrl,
  generateHash,
  setCookie,
  getCookie,
};
