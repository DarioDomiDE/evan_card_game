//var EventEmitter = require('events').EventEmitter
var utils = require('./../utils')
var createGameRoute = require('./../routes/createGame.js')
var createGameInstance = new createGameRoute()

class RouteHandler {
		
	constructor() {
	}
  
	handle(app) {
		app.post('/creategame', function (req, res) {
			handleCreateGame(req, res)
		})
		// app.post('/joingame', function (req, res) {
    //   // ToDo
		// })
		// app.get('/status', function (req, res) {
    //   // ToDo
		// })
		// app.post('/makemove', function (req, res) {
    //   // ToDo
		// })
		
		var handleCreateGame = function(req, res)
		{
			var url = req.params.url
			var route = urlHasRoute(url)
			if(!route) {
				if(url !== undefined) {
					startGameInstance.handle(req, res)
				} else {
					res.writeHead(200)
					res.end('Url is: ' + url)
				}
			} else {
				try {
					switch(req.method)
					{
						case 'GET':
							route.get(req, res)
							break
						case 'POST':
							var body = '';
							req.on('data', function (chunk) {
								body += chunk;
							});
							req.on('end', function () {
								var jsonObj = JSON.parse(body);
								route.post(req, res, jsonObj)
							})
							break
						case 'PUT':
							route.put(req, res)
							break
						case 'DELETE':
							route.delete(req, res)
							break
						default:
							throw 'invalid request method'
					}
				} catch(e) {
					throw404(req, res, e)
				}
			}
		}
		
		var urlHasRoute = function(url) {
			if(!utils.string.onlyLettersAndDigits(url)) {
				return false
			}
			try {
				// check if module exists in routes folder
				var module = require('./../routes/'+url+'.js')
			} catch(e) {
				if(e.toString().includes('Cannot find module'))
					console.log('Can\'t find route: /' + url)
				else
					console.log(e)
				return false
			}
			return module
		}
		
		var throw404 = function(req, res, e) {
			var url = req.params.url
			console.log("throw 404 error at " + url)
			console.log(e)
			res.writeHead(404)
			res.end()
    }
	
		return app
	}
}

module.exports = RouteHandler
RouteHandler.instance = new RouteHandler()