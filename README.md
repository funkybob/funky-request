# funky-request
Simple Promise wrapper for XHR

# request.request(url, options)

Options:

 - method : GET
 - data : query params or post body
 - headers: {}

# request.defaultHeaders = {}

# request.json(url, options)

# request.rpc(url, method, data)

# request.RequestError

All errors are raised using this class.

Properties:

 - message: the Method and URL of the request
 - errorType: one of 'error', 'timeout', or 'abort'
 - xhr : the XMLHttpRequest instance
