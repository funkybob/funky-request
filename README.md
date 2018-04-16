# funky-request
Simple Promise wrapper for XHR

# request.request(url, options)

Options:

 - method : GET | POST | ...
 - data : post body
 - form : form element to POST
 - headers: {}
 - query:

If *form* is provided, it will override *data*, and a FormData instance will be
constructed with it.

If provided, *data* will be encoded according to the 'Content-Type' header. If
it is 'application/json', then *data* will be JSON encoded. Otherwise, URL
encoding will be applied.

# request.defaultHeaders = {}

# request.json(url, options)

# request.rpc(url, method, data)

# request.RequestError

All errors are raised using this class.

Properties:

 - message: the Method and URL of the request
 - errorType: one of 'error', 'timeout', or 'abort'
 - xhr : the XMLHttpRequest instance
