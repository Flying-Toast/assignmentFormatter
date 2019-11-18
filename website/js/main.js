let nameInput = document.querySelector("#nameInput");
let blockInput = document.querySelector("#blockInput");
let assignmentNumberInput = document.querySelector("#assignmentNumberInput");
let urlInput = document.querySelector("#urlInput");
let submitButton = document.querySelector("#submitButton");
let loadingDiv = document.querySelector("#loadingDiv");

let loading = false;

pdfMake.fonts = {
	droidSerif: {
		normal: "droidSerif.ttf",
		bold: "droidSerif.ttf",
		italics: "droidSerif.ttf",
		bolditalics: "droidSerif.ttf"
	},
	courier: {
		normal: "courier.ttf",
		bold: "courierBold.ttf",
		italics: "courier.ttf",
		bolditalics: "courier.ttf"
	}
};

urlInput.addEventListener("keydown", function(e) {
	if (e.key === "Enter") {
		submitButton.click();
	}
});

submitButton.addEventListener("click", submit);

function hideLoader() {
	loadingDiv.style.display = "none";
	loading = false;
}

function showLoader() {
	loadingDiv.style.display = "block";
	loading = true;
}

function submit() {
	if (loading) {
		return;
	}

	if (!nameInput.value || !blockInput.value || !assignmentNumberInput.value || !urlInput.value) {
		alert("You need to fill out all the inputs.");
		return;
	}

	//TODO: dont hard-code the provider
	let provider = new PaizaProvider(urlInput.value);

	if (!provider.validateURL()) {
		alert("The project URL is invalid.");
		return;
	}

	showLoader();

	provider.fetch(function() {
		hideLoader();

		let project = provider.getProject();
		if (!project.buildSucceeded) {
			alert("You need to fix the errors in your code and try again.");
			return;
		}

		let doc = makePDFContents(provider.getProject());
		pdfMake.createPdf(doc)
			.download(`${nameInput.value.replace(" ","")}Assignment${assignmentNumberInput.value}.pdf`);

		celebrate();
	});
}

function makePDFContents(project) {
	let header = `${nameInput.value}, ${blockInput.value} Block, Assignment: ${assignmentNumberInput.value}`;

	let doc = [{
		text: header,
		style: "header"
	}, {
		text: "\nMY CODE:",
		style: ["body", "label"]
	}];

	//if there is only one source file, add it to the document without a header
	if (project.files.length === 1) {
		doc.push({
			text: `\n${project.files[0].contents}`,
			style: "body"
		});
	} else {
		for (let file of project.files) {
			doc.push({
				text: `\n${file.headerText()}`, //for multiple source files, a header is added before each file
				style: ["body", "label"]
			});

			doc.push({
				text: `\n${file.contents}`,
				style: "body"
			});
		}
	}

	doc.push({
		text: "\nRESULTS:",
		style: ["body", "label"]
	}, {
		text: "\n" + project.output,
		style: "body"
	});

	return {
		content: doc,
		styles: {
			header: {
				fontSize: 18
			},
			label: {
				bold: true
			},
			body: {
				font: "courier",
				preserveLeadingSpaces: true,
				fontSize: 10
			}
		},
		defaultStyle: {
			font: "droidSerif"
		},
		pageSize: "LETTER"
	};
}

let partySound = new Audio("media/sound/partyHorn.ogg");
function celebrate() {
	confetti({
		particleCount: 180,
		ticks: 500,
		spread: 70
	});
	partySound.play();
}
