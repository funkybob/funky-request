import qs from '@funkybob/qs';

/**
 * @external {XMLHttpRequest} https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest
 */

/**
 * @desc Error class for Request
 * @extends Error
 */
class RequestError extends Error {
    constructor (message, type, xhr) {
        super(message);
        this.errorType = type;
        this.xhr = xhr;
    }
}

/**
 * Case-insensitive Object lookup
 */
const ciget = (obj, key) => {
    key = key.toLowerCase()
    for (let k in obj) {
        if (k.toLowerCase() === key) return obj[k]
    }
    return undefined;
}

/**
 * Request class
 */
class Request {

    /**
     * @param {Object} encoders - Map of 'content/type': (data, options) => any message body encoder
     */
    constructor ({encoders}) {
        this.encoders = Object.apply({
            'application/json': (data, options) => JSON.stringify(data),
        }, encoders)
    }

    /**
     * @desc Initial a XHR request
     * @param {String} url
     * @param {Object} [options]
     * @param {String} [options.method] - HTTP Method to use (e.g. GET, POST, HEAD)
     * @param {any} [options.data] - Data for the request body
     * @param {Element} [options.form] - An HTMLFormElement to be encoded for the body
     * @param {Object} [options.headers] - Additional Headers for the request
     * @param {Object} [options.query] - Data for the URL querystring.
     * @returns {Promise<XMLHttpRequest, RequestError>}
     */
    request (url, options) {
        let {data, method, headers, query} = options;

        method = method || 'GET'
        headers = this.prepareHeaders(headers || {}, options)

        if (query !== undefined) {
            url = url + '?' + qs.encode(query);
        }

        if (data !== undefined) {
            data = this.prepareBody(data, options)
        }

        return new Promise(
            (resolve, reject) => {
                let xhr = new XMLHttpRequest();

                xhr.addEventListener('load', () => {
                    if (xhr.status < 300) resolve(xhr);
                    reject(new RequestError(`${method} ${url}`, 'load', xhr));
                });
                xhr.addEventListener('error', () => reject(new RequestError(`${method} ${url}`, 'error', xhr)));
                xhr.addEventListener('timeout', () => reject(new RequestError(`${method} ${url}`, 'timeout', xhr)));
                xhr.addEventListener('abort', () => reject(new RequestError(`${method} ${url}`, 'abort', xhr)));

                xhr.open(method, url);
                Object.entries(headers).forEach(([key, val]) => xhr.setRequestHeader(key, val))
                xhr.send(data);
            }
        );

    }

    /**
     * @desc Internal hook for preparing HTTP headers for each request
     * @param {Object} headers - The headers passsed in options
     * @param {Object} options - The options passed.
     * @returns {Object}
     */
    prepareHeaders (headers, options) { return headers }

    /**
     * @desc Internal hook to prepare data for each request
     * @param {any} data - data passed in options
     * @param {Object} options - The options passed
     * @returns {any}
     */
    prepareBody (data, options) {
        if (options.form instanceof HTMLFormElement) {
            return new FormData(options.form)
        }
        encoder = ciget(headers, 'Content-Type')
        if (encoder === undefined) encoder = qs.encode
        return encoder(data, options)
    }
}

export default Request;
