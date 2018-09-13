var nameInput = document.querySelector('#nameInput');
var blockInput = document.querySelector('#blockInput');
var assignmentNumberInput = document.querySelector('#assignmentNumberInput');
var urlInput = document.querySelector('#urlInput');
var submitButton = document.querySelector('#submitButton');

pdfMake.fonts = {
	droidSerif: {
		normal: 'droidSerif.ttf',
		bold: 'droidSerif.ttf',
		italics: 'droidSerif.ttf',
		bolditalics: 'droidSerif.ttf'
	},
	courier: {
		normal: 'courier.ttf',
		bold: 'courier.ttf',
		italics: 'courier.ttf',
		bolditalics: 'courier.ttf'
	}
}

submitButton.addEventListener('click', submit);

function submit() {
	if (nameInput.value !== '' && blockInput.value !== '' && assignmentNumberInput.value !== '' && urlInput.value !== '') {
		var anchor = document.createElement('a');
		anchor.href = urlInput.value;
		var urlPath = anchor.pathname;
		$.getJSON('http:\//www.whateverorigin.org/get?url=' + encodeURIComponent('https:\//paiza.io/api' + urlPath + '.json') + '&callback=?', function(data) {
			parseProject(JSON.parse(data.contents));
		});
	}
}

function parseProject(project) {
	if (project.build_result !== "success") {
		alert("lol u r so dumb. ur code has errors!! fix them and try again");
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
			style: 'body'
		}, {
			text: '\n' + projectInfo.source,
			style: 'body'
		}, {
			text: "\nRESULTS:",
			style: 'body'
		}, {
			text: '\n' + projectInfo.output,
			style: 'body'
		}],
		styles: {
			header: {
				fontSize: 18
			},
			body: {
				font: 'courier',
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