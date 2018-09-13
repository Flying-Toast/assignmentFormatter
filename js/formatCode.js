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
	sourcecodepro: {
		normal: 'sourcecodepro.ttf',
		bold: 'sourcecodepro.ttf',
		italics: 'sourcecodepro.ttf',
		bolditalics: 'sourcecodepro.ttf'
	}
}

submitButton.addEventListener('click', submit);

function submit() {
	if (nameInput.value !== '' && blockInput.value !== '' && assignmentNumberInput.value !== '' && urlInput.value !== '') {
		var anchor = document.createElement('a');
		anchor.href = urlInput.value;
		var urlPath = anchor.pathname;
		$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent('https:\//paiza.io/api' + urlPath + '.json') + '&callback=?', function(data) {
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
			text: projectInfo.header + '\n\n',
			style: 'header'
		}, {
			text: "Source:",
			style: 'label'
		}, {
			text: "\n" + projectInfo.source,
			style: 'source'
		}, {
			text: "\nOutput:",
			style: 'label'
		}, {
			text: "\n" + projectInfo.output,
			style: 'source'
		}],
		styles: {
			header: {
				fontSize: 24,
			},
			source: {
				font: 'sourcecodepro',
				margin: [15, 0, 0, 0],
				fontSize: 10
			},
			label: {
				fontSize: 12
			}
		},
		defaultStyle: {
			font: 'droidSerif'
		},
		pageSize: 'LETTER'
	}

	pdfMake.createPdf(docDefinition).download(`${nameInput.value.replace(" ","")}Assignment${assignmentNumberInput.value}.pdf`);
}