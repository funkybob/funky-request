import qs from '@funkybob/qs';

class RequestError extends Error {
    constructor (message, type, xhr) {
        super(message);
        this.errorType = type;
        this.xhr = xhr;
    }
}

function request (url, options = {}) {
    let {data, method, headers, query} = options;
    method = method || 'GET';

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

            headers = Object.assign({}, request.commonHeaders, headers || {} );
            headers = request.prepareHeaders(headers);

            if (query !== undefined) {
                url = url + '?' + qs.encode(query);
            }
            if (data !== undefined) {
                if (options.form instanceof HTMLFormElement) {
                    data = new FormData(form)
                } else {
                    switch(headers['Content-Type']) {
                    case 'application/json':
                        data = JSON.stringify(data);
                        break;
                    default:
                        data = qs.encode(data);
                    }
                }
            }

            xhr.open(method, url);
            Object.entries(headers).forEach(([key, val]) => xhr.setRequestHeader(key, val))

            xhr.send(data);
        }
    );
}
request.commonHeaders = {};
request.prepareHeaders = headers => headers;

function json (url, options) {
    return request(url, options)
    .then(xhr => (xhr.status == 204) ? '' : JSON.parse(xhr.responseText))
}

function rpc (url, method, data) {
    return json(url, {
        data,
        method: 'POST',
        headers: {
            'X-RPC-Action': method,
            'Content-Type': 'application/json'
        }
    })
}

export default {request, json, rpc};

