# MMM-AutelisPentair
MagicMirror2 module for Autelis Pool Control for Pentair

Examples
  
 MagicMirror/modules
 ![](Capture.jpg)
  
 git clone https://github.com/cowboysdude/MMM-History
 ![](Capture2.jpg)
  
 # Installation
     ~MagicMirror/modules
     `git clone https://github.com/emlowe/MMM-AutelisPentair.git`
     cd ~MagicMirror/modules/MMM-AutelisPentair

	This module requires the xml2js module. Install it with "npm install xml2js"
 
 # Add to Config.js
  
        {
		username: "", // username for your Autelis Pool Control
		password: "", // password for your Autelis Pool Control
		hostname: "", // just the hostname part of your URL 
		initialLoadDelay: 0,
		updateInterval:  10 * 60 * 1000, // every 10 minutes
	},
          
  Restart mirror... enjoy...  

