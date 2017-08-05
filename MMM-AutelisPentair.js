/* Module */

/* Magic Mirror
 * Module: MMM-AutelisPentair
 *
 * By Earle Lowe elowe@elowe.com
 * Apache Licensed.
 */

Module.register("MMM-AutelisPentair",{

	// Default module config.
	defaults: {
		username: "",
		password: "",
		hostname: "",
		initialLoadDelay: 0,
		updateInterval:  10 * 60 * 1000, // every 10 minutes
	},

	// Define start sequence.
	start: function() {
		this.loaded = false;
		this.poolData = null;
		this.pumpData = null;

		this.sendSocketNotification("CONFIG", this.config);

		this.scheduleUpdate(this.config.initialLoadDelay);
	},

    getStyles: function() {
        return ['font-awesome.css'];
    },

	getData: function() {
		Log.info("Getting Data");
		this.sendSocketNotification("GET_DATA");
	},

	socketNotificationReceived: function(notification, payload) {
		if (notification === "POOL_DATA") {
			this.poolData = payload.response;
			this.loaded = true;
			this.updateDom();
		} else if (notification === "PUMP_DATA") {
			this.pumpData = payload.response;
			this.loaded = true;
			this.updateDom();
		}
		this.scheduleUpdate()
	},

	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Getting Data";
			wrapper.className = "dimmed light small";

			return wrapper;
		}

		var large = document.createElement("div");
		large.className = "medium light";

		if (this.poolData) {
			poolStatus = this.poolData.equipment[0].circuit6[0];
			spaStatus = this.poolData.equipment[0].circuit1[0];
	
			var poolTemp = document.createElement("span");

			if (poolStatus === "1") {
				poolTemp.className = "bright poolTemp";
				poolString = "Pool is On: " + this.poolData.temp[0].pooltemp[0] + "&deg;";
			} else if (spaStatus === "1") {
				poolTemp.className = "bright poolTemp";
				spaString = "Spa is On" + this.poolData.temp[0].spatemp[0] + "&deg;";
			} else {
				poolTemp.className = "dimmed poolTemp";
				poolString = "Pool is Off";
			}

			poolTemp.innerHTML = poolString;
			large.appendChild(poolTemp);

			var htstatus = this.poolData.temp[0].htstatus[0];

			if (poolStatus === "1" || spaStatus === "1") {	
				if (this.pumpData) {
					// Add in Pump Speed
					var toSplit = this.pumpData.pumps[0].pump1[0].split(",");
					var pumpWatts = toSplit[0];
					var pumpSpeed = toSplit[1];
	
					var pumpInfo= document.createElement("div");
					pumpInfo.className = "bright small pumpInfo";
					pumpInfo.innerHTML = "Pump: " + pumpWatts + " Watts, " + pumpSpeed + " RPM";
					large.appendChild(pumpInfo);
				}

				// Show Pool heater information
				var heatInfo = document.createElement("div");
				if (htstatus === "0") {
					heatInfo.className = "dimmed small heatInfo";
					heatInfo.innerHTML = "Heat is off";
				} else if (htstatus === "12" || htstatus === "14") {
					heatInfo.className = "bright small heatInfo";
					heatInfo.innerHTML = "Heat is on: Solar";
				} else if (htstatus === "10" || htstatus === "18") {
					heatInfo.className = "bright small heatInfo";
					heatInfo.innerHTML = "Heat is on";
				}
				large.appendChild(heatInfo);

			}

			var airsolTemp = document.createElement("div");
			airsolTemp.className = "light medium";
			large.appendChild(airsolTemp);

			var airTemp = document.createElement("span");
			airTemp.innerHTML = "Air: " + this.poolData.temp[0].airtemp[0] + "&deg; ";
			airsolTemp.appendChild(airTemp);

			var solTemp = document.createElement("span");
			solTemp.className = "solTemp";
			solTemp.innerHTML = "Solar: " + this.poolData.temp[0].soltemp[0] + "&deg;";
			airsolTemp.appendChild(solTemp);
		}

		wrapper.appendChild(large);
		return wrapper;
	},

	notificationReceived: function(notification, payload, sender) {
		if (notification === "DOM_OBJECTS_CREATED") {	
			this.updateDom();
		}
	},

	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() { self.getData(); }, nextLoad);
	},

});
