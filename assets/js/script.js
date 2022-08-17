const sol = document.getElementById("sol");
const page = document.getElementById("page");
const button = document.getElementsByTagName("button")[0];
const ImageDiv = document.getElementById("nasa-images");

//--------------------------------------------------------------
//FUNCTION: Handles the Submit Button Click//
button.onclick = async function (event) {
	try {
		event.stopPropagation();
		event.preventDefault();
		const solValue = sol.value;
		const pageValue = page.value;
		if (
			solValue === "" ||
			pageValue === "" ||
			solValue === null ||
			pageValue === null ||
			solValue === undefined ||
			pageValue === undefined ||
			solValue === NaN ||
			pageValue === NaN
		) {
			alert("Please fill the field correctly");
			return;
		}

		const response = await fetch(
			`/images/?solValue=${solValue}&pageValue=${pageValue}`
		);
		const data = await response.json();
		const photos = data.data;

		ImageDiv.querySelectorAll("img").forEach((img) => img.remove());
		if (photos.length === 0) {
			alert("No images found");
			return;
		}
		for (let photo of photos) {
			const img = document.createElement("img");
			img.src = photo.img_src;
			img.alt = photo.id;
			ImageDiv.appendChild(img);
		}
	} catch (error) {
		console.log(error);
	}
};
