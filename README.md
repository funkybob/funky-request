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

Any values added to this Object will be set as Headers on all requests.

# request.json(url, options)

Automatically decodes successful responses from JSON.

# request.rpc(url, method, data)

Sets 'Content-Type' as 'application/json', passes *method* in a 'X-RPC-Action'
header, and JSON decodes the response.

# request.RequestError

All errors are raised using this class.

Properties:

 - message: the Method and URL of the request
 - errorType: one of 'error', 'timeout', or 'abort'
 - xhr : the XMLHttpRequest instance
