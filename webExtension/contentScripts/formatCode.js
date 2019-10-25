var loading = false;
var userInfo = {}; //nameInput.value, blockInput.value, etc

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

browser.runtime.onMessage.addListener(function(message) {
	userInfo = message;
	submit();
});

function submit() {
	if (loading) {
		return;
	}

	var anchor = document.createElement('a'); //this anchor element is used for parsing the URL, so that no complicated regex is needed

	anchor.href = window.location.toString();

	urlPath = anchor.pathname; //use the anchor element to extract the pathname from the url.

	if (!(/^\/projects\/[^/]*$/.test(urlPath))) {
		alert("Are you sure that you compiled at least once? (Press the green \"Run\" button).");
		return;
	}

	loading = true;
	var request = new XMLHttpRequest();
	request.open('GET', 'https://paiza.io/api' + urlPath + '.json');
	request.onload = request.onerror = function() {
		loading = false;
		parseProject(JSON.parse(request.responseText));
	};
	request.send();

}

function parseProject(project) {
	if (project.build_result !== "success") {
		alert("You need to fix the errors in your code and try again.");
		return;
	}
	var projectInfo = {};
	projectInfo.header = `${userInfo.name}, ${userInfo.block} Block, Assignment ${userInfo.assignmentNumber}`;
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

	pdfMake.createPdf(docDefinition).download(`${userInfo.name.replace(" ","")}Assignment${userInfo.assignmentNumber}.pdf`);
}
