# LemonPI Scraper Helper

> Asynchronously scrape a website, and push product data to [LemonPI](http://www.lemonpi.io/)'s Manage-R.

## Install

```shell
npm install --save lemonpi-scraper-helper
# Or
yarn add lemonpi-scraper-helper
```

## Usage

```js
import { scrape, getUrl } from 'lemonpi-scraper-helper';

scrape({
  // Optional, but recommended: Whitelist specific URL(s) using a regular expression
  urlTest: /www\.example\.com/,

  // Required
  fields: {
    // Required fields with example values
    'advertiser-id': 123,
    sku: () => window.dataLayer.filter(entry => entry.sku).pop().sku,

    // Optional, arbitrary fields with example values
    url: getUrl,
    name: () => document.querySelector('h1').textContent,
  },
});
```

Or directly in the browser:

```html
<script src="https://unpkg.com/lemonpi-scraper-helper"></script>
<script>
  window.lemonpiScraperHelper.scrape({ ... });
</script>
```

## API

When using LemonPI Scraper Helper directly from the browser, prepend all following methods with `window.lemonpiScraperHelper.`:

### `scrape(Object)`

- **`fields`** (`object`, required)
  - **`advertiser-id`** (`number`, required)
  - **`sku`** (`string`, required)
  - **`...`** (`mixed`)
    Product field values to be pushed to LemonPI. **Use function expressions to access asynchronous or variable entities, like DOM elements, data layers, or the URL.** Should always return a JSON-friendly value.
- **`urlTest`** (`regex`, default: `/$/`)
  Only scrape when this regular expression matches `window.location.href`.
- **`optionalFields`** (`array` of `string` values, default: `[]`)
  Add field names that may allow a scrape if their value returns empty.
- **`beforePush`** (`function`, default: `(fields, done) => { done(fields); }`)
  Lifecycle hook to asynchronously manipulate field data before pushing to LemonPI. Takes arguments "fields" (`object`) containing the values for each configured field, and "done" (`function`) containing the callback function which expects a "fields" object.
- **`afterPush`** (`function`, default: `(fields) => {}`)
  Lifecycle hook to execute after pushing data to LemonPI successfully. Takes arguments "fields" (`object`) containing the values for each configured field.
- **`keepScraping`** (`boolean`, default: `true`)
  After one successful scrape, continue to scrape when field values update.
- **`interval`** (`number`, default: `750`)
  The delay between field value checks in milliseconds.
- **`allowTranslated`** (`boolean`, default: `false`)
  Enables scraping of client-translated pages (i.e. Google Translate).
- **`debug`** (`boolean`, default: `/lemonpi_debug/i.test(window.location.href)`)
  Enables console debugging.

### `getUrl([Object])` (`string`)

Returns the current URL without query string parameters or location hash. Use the optional configuration to make exceptions:

- **`"allowedParameters"`** (`array` of `string` values)
  Whitelist specific query string parameters to be included with the URL.
- **`"customParameters"`** (`object` of `string` values)
  Add custom query string parameters and valuesto be included with the URL.
- **`"allowHash"`** (`boolean`, default: `false`)
  Include the location hash with the URL.

### `getUrlPathSegment(Integer)` (`string`)

Retrieves a path segment from the URL by index. E.g. `"http://www.example.com/foo/bar"` → `getUrlPathSegment(0)` returns `"foo"`.

### `getUrlPathSegments()` (`array` of `string` values)

Retrieves all path segments from the URL.

### `getUrlQueryParameter(String)` (`string`)

Retrieves a query string parameter value from the URL. E.g. `"http://www.example.com/?foo=bar"` → `getUrlQueryParameter('foo')` returns `"bar"`.

### `getUrlQueryParameters()` (`object` of `string` values)

Retrieves all query string parameters from the URL.

### `getBackgroundImageUrl(String|Object)` (`string`)

Enter a DOM selector or element node to retrieve its background image URL. Works cross-browser.

### `generateHash(JSON-friendly-types[, ...])` (`string`)

Returns a unique hash for the supplied arguments.

### `setCookie(String, JSON-friendly-types)`

Store mixed data in a cookie. Cookie names will be prepended with `lemonpi_`.

### `getCookie(String)` (`mixed`)

Retrieve mixed data from an earlier stored cookie.
