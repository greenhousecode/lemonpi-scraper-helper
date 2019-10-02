import Scraper from './Scraper';
import Event from './Event';
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
export const event = (...args) => new Event(...args);

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
