// Crude fetch mimic
export const fetch = (url, resolve = () => {}, options = {}) => {
  const { method = 'GET', body } = options;

  const requestTimeout = setTimeout(() => {
    throw new Error('Request timed out');
  }, 3000);

  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      clearTimeout(requestTimeout);

      try {
        resolve(JSON.parse(xhr.responseText));
      } catch (_) {
        resolve();
      }
    }
  };

  if (method === 'POST' && body) {
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(body));
  } else {
    xhr.send();
  }
};

// Returns all URL path segments
export const getUrlPathSegments = () =>
  window.location.pathname
    .split('/')
    .filter(segment => segment)
    .map(segment => decodeURI(segment));

// Returns an URL path segment
export const getUrlPathSegment = index => getUrlPathSegments()[index];

// Returns all URL query parameters
export const getUrlQueryParameters = () =>
  window.location.search
    .replace(/^\?/, '')
    .split('&')
    .filter(parameter => parameter)
    .reduce(
      (parameters, parameter) =>
        Object.assign(parameters, {
          [decodeURI(parameter.split('=')[0])]: decodeURI(parameter.split('=')[1]),
        }),
      {},
    );

// Returns a URL query parameter
export const getUrlQueryParameter = key => getUrlQueryParameters()[key];

// Returns the current URL with optional query string parameters and / or hash
export const getUrl = urlConfig => {
  let url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;

  if (urlConfig) {
    let paramAdded = false;

    if (urlConfig.allowedParameters && urlConfig.allowedParameters.length) {
      urlConfig.allowedParameters.forEach(parameter => {
        const separator = paramAdded ? '&' : '?';
        const key = encodeURI(parameter);
        const value = getUrlQueryParameter(parameter);

        if (value !== undefined) {
          url += `${separator}${key}=${encodeURI(value)}`;
          paramAdded = true;
        }
      });
    }

    if (urlConfig.customParameters) {
      const parameters = Object.keys(urlConfig.customParameters);
      parameters.forEach(parameter => {
        const separator = paramAdded ? '&' : '?';
        const key = encodeURI(parameter);
        const value = encodeURI(urlConfig.customParameters[parameter]);
        url += `${separator}${key}=${value}`;
        paramAdded = true;
      });
    }

    if (urlConfig.allowHash) {
      url += window.location.hash;
    }
  }

  return url;
};

// Cross-browser background image URL retrieval
export const getBackgroundImageUrl = elementOrSelector => {
  let element = elementOrSelector;

  if (typeof elementOrSelector === 'string') {
    element = document.querySelector(elementOrSelector);
  }

  if (!element) {
    return undefined;
  }

  const backgroundImage = window
    .getComputedStyle(element)
    .getPropertyValue('background-image')
    .replace(/url\(['"]?|['"]?\)/g, '');

  return backgroundImage === 'none' ? undefined : backgroundImage;
};

// Create a unique hash based on any arguments passed
export const generateHash = (...args) => {
  const string = JSON.stringify(args);
  let hash = 0;
  let chr;

  for (let i = 0; i < string.length; i += 1) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr; // eslint-disable-line no-bitwise
    hash |= 0; // eslint-disable-line no-bitwise
  }

  return hash.toString();
};

// Set a cookie using any JSON-friendly value
export const setCookie = (key, value) => {
  const val = typeof value === 'string' ? value : JSON.stringify(value);
  document.cookie = `lemonpi_${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
};

// Get a cookie by its key
export const getCookie = key => {
  const cookie = `; ${document.cookie}`;
  const parts = cookie.split(`; lemonpi_${key}=`);

  if (parts.length === 2) {
    let value = decodeURIComponent(
      parts
        .pop()
        .split(';')
        .shift(),
    );

    try {
      value = JSON.parse(value);
    } catch (_) {} // eslint-disable-line no-empty

    return value;
  }

  return undefined;
};

// Console styling
export const getFormattedConsoleMessage = (message, messageStyle = '') => [
  `%cScraper Helper%c ${message}`,
  'padding:1px 6px 0;border-radius:2px;background:#fedc00;color:#313131',
  messageStyle,
];
