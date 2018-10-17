var nameInput = document.querySelector('#nameInput');
var blockInput = document.querySelector('#blockInput');
var assignmentNumberInput = document.querySelector('#assignmentNumberInput');
var urlInput = document.querySelector('#urlInput');
var submitButton = document.querySelector('#submitButton');
var loadingDiv = document.querySelector('#loadingDiv');

var partySound = new Audio('media/sound/partyHorn.ogg');

var loading = false;

pdfMake.fonts = {
	droidSerif: {
		normal: 'droidSerif.ttf',
		bold: 'droidSerif.ttf',
		italics: 'droidSerif.ttf',
		bolditalics: 'droidSerif.ttf'
	},
	courier: {
		normal: 'courier.ttf',
		bold: 'courierBold.ttf',
		italics: 'courier.ttf',
		bolditalics: 'courier.ttf'
	}
};

urlInput.addEventListener('keydown', function(e) {
	if (e.key === "Enter") {
		submitButton.click();
	}
});

submitButton.addEventListener('click', submit);

function submit() {
	if (loading) {
		return;
	}

	if (nameInput.value !== '' && blockInput.value !== '' && assignmentNumberInput.value !== '' && urlInput.value !== '') {
		var anchor = document.createElement('a'); //this anchor element is used for parsing the URL, so that no complicated regex is needed

		var url;

		if (!(/^http.*/.test(urlInput.value))) { //checks if the protocol is missing from the supplied url, and adds one if it is
			url = "https://" + urlInput.value;
		} else {
			url = urlInput.value;
		}
		anchor.href = url;

		urlPath = anchor.pathname; //use the anchor element to extract the pathname from the url.
		if (anchor.host !== "paiza.io") {
			alert("You need to enter a valid paiza.io URL.");
			return;
		} else if (!(/^\/projects\/[^/]*$/.test(urlPath))) {
			alert("Are you sure that you compiled at least once? (press the green \"Run\" button). The URL should be in the format paiza.io/projects/xxxx");
			return;
		}
		loadingDiv.style.display = 'block'; //unhides the "loading..." message
		loading = true;
		var request = new XMLHttpRequest();
		request.open('GET', 'https://bypasscors.herokuapp.com/api/fetch/?url=https://paiza.io/api' + urlPath + '.json');
		request.onload = request.onerror = function() {
			loadingDiv.style.display = 'none'; //hides the "loading..." message
			loading = false;
			console.log(request.responseText);
			parseProject(JSON.parse(request.responseText));
		};
		request.send();

	} else {
		alert("You need to fill out all the inputs.");
	}
}

function parseProject(project) {
	if (project.build_result !== "success") {
		alert("You need to fix the errors in your code and try again.");
		return;
	}
	var projectInfo = {};
	projectInfo.header = `${nameInput.value}, ${blockInput.value} Block, Assignment #${assignmentNumberInput.value}`;
	projectInfo.sources = project.source_files;
	projectInfo.output = project.stdout;
	makePdf(projectInfo);
}

function makePdf(projectInfo) {

	var docContent = [{
		text: projectInfo.header,
		style: 'header'
	}, {
		text: "\nMY CODE:",
		style: ['body', 'label']
	}];

	if (projectInfo.sources.length === 1) { //if there is only one source file, add it to the docContent without a header
		docContent.push({
			text: '\n' + projectInfo.sources[0].body,
			style: 'body'
		});
	} else {
		for (var i = 0; i < projectInfo.sources.length; i++) {
			var source = projectInfo.sources[i];

			docContent.push({
				text: `\nIn file ${source.filename}:`, //for multiple source files, a header is added before each file
				style: ['body', 'label']
			});

			docContent.push({
				text: '\n' + source.body,
				style: 'body'
			});

		}
	}

	docContent.push({
		text: "\nRESULTS:",
		style: ['body', 'label']
	}, {
		text: '\n' + projectInfo.output,
		style: 'body'
	});

	var docDefinition = {
		content: docContent,
		styles: {
			header: {
				fontSize: 18
			},
			label: {
				bold: true
			},
			body: {
				font: 'courier',
				preserveLeadingSpaces: true,
				fontSize: 10
			}
		},
		defaultStyle: {
			font: 'droidSerif'
		},
		pageSize: 'LETTER'
	}

	pdfMake.createPdf(docDefinition).download(`${nameInput.value.replace(" ","")}Assignment${assignmentNumberInput.value}.pdf`);
	confetti({
		particleCount: 180,
		ticks: 500,
		spread: 70
	});
	partySound.play();
}