const https = require("http");

let rateLimited = 0;
let respond = 0;
for (let index = 0; index < 1001; index++) {
	https
		.get("http://localhost:5000/pastes/read?id=1", (resp) => {
			let data = "";
			resp.on("data", (chunk) => {
				data += chunk;
			});
			resp.on("end", () => {
				const response = JSON.parse(data);
				if (response.error) {
					rateLimited += 1;
				} else {
					respond += 1;
				}
			});
		})
		.on("error", (err) => {
			console.log("Error: " + err.message);
		});
}
setTimeout(() => {
	console.log(rateLimited);
	console.log(respond);
}, 2000);
