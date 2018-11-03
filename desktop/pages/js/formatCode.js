const fs = require('fs');
const execSync = require('child_process').execSync;

const compiler = "swift";

let nameInput = document.querySelector('#nameInput');
let blockInput = document.querySelector('#blockInput');
let assignmentNumberInput = document.querySelector('#assignmentNumberInput');
let fileInput = document.querySelector('#fileInput');
let submitButton = document.querySelector('#submitButton');
let loadingDiv = document.querySelector('#loadingDiv');

function showLoading() {
	loadingDiv.style.display = "block";
}

function hideLoading() {
	loadingDiv.style.display = "";
}

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

submitButton.addEventListener('click', submit);

function submit() {
	if (nameInput.value !== '' && blockInput.value !== '' && assignmentNumberInput.value !== '' && fileInput.value !== undefined) {
		showLoading();

		let reader = new FileReader();
		reader.addEventListener("loadend", function() {
			fs.writeFileSync("/tmp/assignmentSource", reader.result);

			let stdout;
			try {
				stdout = execSync(`${compiler} /tmp/assignmentSource`);
			} catch (e) {
				hideLoading();
				alert(`Compilation failed with the error\n${e}`);
				return;
			}

			let projectInfo = {
				header: `${nameInput.value}, ${blockInput.value} Block, Assignment #${assignmentNumberInput.value}`,
				source: reader.result,
				output: stdout
			};

			makePdf(projectInfo);
		});
		reader.readAsText(fileInput.files[0]);
	} else {
		alert("You need to fill out all the inputs.");
	}
}

function makePdf(projectInfo) {

	let docContent = [
	{
		text: projectInfo.header,
		style: 'header'
	},
	{
		text: "\nMY CODE:",
		style: ['body', 'label']
	},
	{
		text: '\n' + projectInfo.source,
		style: 'body'
	},
	{
		text: "\nRESULTS:",
		style: ['body', 'label']
	},
	{
		text: '\n' + projectInfo.output,
		style: 'body'
	}];

	let docDefinition = {
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

	hideLoading();
	pdfMake.createPdf(docDefinition).download(`${nameInput.value.replace(" ","")}Assignment${assignmentNumberInput.value}.pdf`);
}
