import qs from 'qs';

class RequestError extends Error {
    constructor (message, type, xhr) {
        super(message);
        this.errorType = type;
        this.xhr = xhr;
    }
}

function request (url, options = {}) {
    let {data, method, headers} = options;
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

            if (data !== undefined) {
                if (method === 'GET') {
                    url = url + '?' + qs.encode(data);
                    data = undefined;
                } else if (method === 'POST') {
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
            let allHeaders = Object.assign({}, request.commonHeaders, headers || {} );
            Object.entries(allHeaders).forEach(([key, val]) => xhr.setRequestHeader(key, val))

            xhr.send(data);
        }
    );
}
request.commonHeaders = {};

function json (url, options) {
    return request(url, options)
    .then(xhr => JSON.parse(xhr.responseText))
}

function rpc(url, method, data) {
    return request(url, {
        data,
        method: 'POST',
        headers: {
            'X-RPC-Action': method,
            'Content-Type': 'application/json'
        }
    })
    .then(xhr => (xhr.status == 204) ? '' : JSON.parse(xhr.responseText))
}

export default {request, json, rpc};

