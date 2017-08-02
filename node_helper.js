/* Magic Mirror
 * 
 */
const NodeHelper = require('node_helper');
const request = require('request');
const xml2js = require('xml2js');

var parser = new xml2js.Parser();

parser.on("error", function(err) { console.log("Parser error", err); } );

module.exports = NodeHelper.create({
        
    start: function() {
        console.log("Starting module: " + this.name);
    },

    getPoolData: function() {
        var url = "http://" + this.config.username + ":" + this.config.password + "@" + this.config.hostname + "/status.xml";
        request({
            url: url,
            method: 'GET',
            headers: {
                'User-Agent': 'MagicMirror/1.0'
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
				var self=this;
				parser.parseString(body, function(err, result) {
					self.sendSocketNotification("POOL_DATA", result) ;
				});
			}
        });
    },

	getPumpData: function() {
        var url = "http://" + this.config.username + ":" + this.config.password + "@" + this.config.hostname + "/pumps.xml";
        request({
            url: url,
            method: 'GET',
            headers: {
                'User-Agent': 'MagicMirror/1.0'
            }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
				var self=this;
				parser.parseString(body, function(err, result) {
					self.sendSocketNotification("PUMP_DATA", result);
				});
			}
        });
	},
    
	getData: function() {
		this.getPoolData();
		this.getPumpData();
	},
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CONFIG") {
            this.config = payload;
        } else if (notification === "GET_DATA") {
            this.getData();
        }
    }

});
