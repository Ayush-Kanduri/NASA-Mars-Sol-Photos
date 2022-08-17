const express = require("express");
const port = process.env.PORT || 8000;
const env = require("./config/environment");
const app = express();
const cors = require("cors");
const expressLayouts = require("express-ejs-layouts");
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const path = require("path");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(env.asset_path));
app.use(expressLayouts);
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
	return res.render("home", {
		title: "Mars Sol Photos",
	});
});
//Proxy Server for NASA API
app.get("/images", async (req, res) => {
	const solValue = req.query.solValue;
	const pageValue = req.query.pageValue;
	const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${solValue}&page=${pageValue}&api_key=${env.api_key}`;

	fetchImages(url);

	//FUNCTION: Fetches the Images based on the Sol & PageNo. using XHR_AJAX Call//
	function fetchImages(url) {
		//XHR AJAX Call
		const xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.onload = function () {
			if (this.status >= 200 && this.status < 300) {
				//If success, then Display the Images
				const data = JSON.parse(this.responseText);
				const photos = data.photos;
				try {
					return res.status(200).json({
						message: "Photos Fetched Successfully",
						data: photos,
					});
				} catch (error) {
					console.log(error);
					return res.status(500).json({
						message: "Internal Server Error",
						data: {},
					});
				}
			} else {
				//If error, then Display the error
				alert("Something went wrong");
				return;
			}
		};
		xhr.onerror = function () {
			alert("Something went wrong");
			return;
		};
		xhr.send();
	}
});

app.listen(port, (err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log(`Server is running successfully on port: ${port}`);
});
