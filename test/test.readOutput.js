const fs = require('fs');


fs.readFile('./output.webm', {encoding: "base64"}, function(err, data) {
				if (err) {
					throw err;
				}
				
				fs.writeFileSync('./tmp.txt', "data:video/webm;base64," + data);
			});
