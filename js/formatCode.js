var nameInput = document.querySelector('#nameInput');
var blockInput = document.querySelector('#blockInput');
var assignmentNumberInput = document.querySelector('#assignmentNumberInput');
var urlInput = document.querySelector('#urlInput');
var submitButton = document.querySelector('#submitButton');

pdfMake.fonts = {
	droidSerif: {
		normal: 'droidSerif.ttf',
		bold: 'droidSerifBold.ttf',
		italics: 'droidSerifItalic.ttf',
		bolditalics: 'droidSerifBoldItalic.ttf'
	},
	courier: {
		normal: 'courier.ttf',
		bold: 'courierBold.ttf',
		italics: 'courierItalic.ttf',
		bolditalics: 'courierBoldItalic.ttf'
	}
};

submitButton.addEventListener('click', submit);

function submit() {
	if (nameInput.value !== '' && blockInput.value !== '' && assignmentNumberInput.value !== '' && urlInput.value !== '') {
		var anchor = document.createElement('a');

		var url;

		if (!(/^http.*/.test(urlInput.value))) {
			url = "https://" + urlInput.value;
		} else {
			url = urlInput.value;
		}
		anchor.href = url;

		urlPath = anchor.pathname;
		if (anchor.host !== "paiza.io") {
			alert("You need to enter a valid paiza.io URL.");
			return;
		} else if (!(/^\/projects\/[^/]*$/.test(urlPath))) {
			alert("Are you sure that you compiled at least once? (press the green \"Run\" button). The URL should be in the format paiza.io/projects/xxxx");
			return;
		}
		$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent('https://paiza.io/api' + urlPath + '.json') + '&callback=?', function(data) {
			parseProject(JSON.parse(data.contents));
		});
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
	projectInfo.source = project.source_files[0].body;
	projectInfo.output = project.stdout;
	makePdf(projectInfo);
}

function makePdf(projectInfo) {

	var docDefinition = {
		content: [{
			text: projectInfo.header,
			style: 'header'
		}, {
			text: "\nMY CODE:",
			style: ['body', 'label']
		}, {
			text: '\n' + projectInfo.source,
			style: 'body'
		}, {
			text: "\nRESULTS:",
			style: ['body', 'label']
		}, {
			text: '\n' + projectInfo.output,
			style: 'body'
		}],
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
}
