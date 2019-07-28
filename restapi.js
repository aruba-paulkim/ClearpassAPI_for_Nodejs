var https = require('https');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var API_HOST = "YOUR_CPPM_IP";
var CLIENT_ID = "YOUR_CLIENT_ID";
var CLIENT_SECRET = "YOUR_CLIENT_SECRET";
var authorization = "";

var getToken = function () {
	if(authorization != "") {
		return authorization;
	} else {
		var headers = {'Content-Type': 'application/json'}
		var options = { host: API_HOST, port: 443, path: '/api/oauth', method: 'POST', headers: headers};

		var apireq = https.request(options, function(apires) {
			apires.setEncoding('utf8');
			apires.on('data', function (chunk) {
				result = JSON.parse(chunk);
				authorization = result.token_type+" "+result.access_token;
				console.log('getToken : ' + authorization);
				createEndpoint('112233445566', 'Unknown');
			});
		});
		
		apireq.on('error', function(e) { console.log('problem with request: ' + e.message); });
		apireq.write('{"grant_type": "client_credentials","client_id": "'+CLIENT_ID+'","client_secret": "'+CLIENT_SECRET+'"}');
		apireq.end();
	}
}


var createEndpoint = function (mac_address,status) {
	var headers = {'Content-Type': 'application/json', 'Authorization': authorization, 'Accept': 'application/json'}
	var options = { host: API_HOST, port: 443, path: '/api/endpoint', method: 'POST', headers: headers};
	var apireq = https.request(options, function(apires) {
		apires.setEncoding('utf8');
		apires.on('data', function (chunk) {
			//console.log('createEndpoint BODY: ' + chunk);
			result = JSON.parse(chunk);
			console.log('createEndpoint');
			console.log(' - id : ' + result.id);
			console.log(' - mac_address : ' + result.mac_address);
			console.log(' - status : ' + result.status);
			console.log(' - description : ' + result.description);
		});
	});
	apireq.on('error', function(e) { console.log('problem with request: ' + e.message); });
	apireq.write('{"mac_address": "'+mac_address+'","description": "Using Clearpass API by apollo89","status": "'+status+'"}');
	apireq.end();
}

getToken();




