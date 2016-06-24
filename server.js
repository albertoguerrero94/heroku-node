/*
	url: get parameters from URL
	http: create the server
	https: get the token using a HTTPS GET request
	port: assign or get the port used by Heroku
*/
const url = require('url');
const http = require('http');
const https = require('https');
const port = process.env.PORT || 8080;

http.createServer(function(request, response) {
	//access code gotten from slack servers when logged in
	const code = url.parse(request.url, true).query.code;
	
	//url for getting the token using slack API
	const tokenUrl = 'https://slack.com/api/oauth.access?client_id=18234493559.50922481703&client_secret=a6834faaa5a51002f3f37be7866b8c0c&code=' + code;
	
	//HTTPS GET request
	https.get(tokenUrl, function(res) {
		var body = '';
		
		res.on('data', function(d) {
			body += d;
		});
		
		//when everything from the request has been read
		res.on('end', function() {
			//transform result into JSON
			const json = JSON.parse(body);
			
			//if ok status is true, then get the token and redirect to home page
			//else, redirect to error page
			if(json.ok == true) {
				redirect(response, "http://www.google.com");
			} else {
				redirect(response, "http://www.bing.com");
			}
		});
	});
}).listen(port);

//redirect to a specific page
function redirect(response, url) {
	response.writeHead(301, {Location: url});
	response.end();
}