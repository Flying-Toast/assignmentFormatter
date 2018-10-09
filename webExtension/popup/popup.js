var nameInput = document.querySelector('#nameInput');
var blockInput = document.querySelector('#blockInput');
var assignmentNumberInput = document.querySelector('#assignmentNumberInput');
var submitButton = document.querySelector('#submitButton');
var alertBox = document.querySelector('#alert');
var alertMessageDiv = document.querySelector('#alertMessage');
var dismissAlert = document.querySelector('#dismissAlert');

submitButton.addEventListener('click', function() {
	if (areInputsEmpty()) {
		alertMessage("You need to fill out all the inputs.");
		return;
	}

	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(sendMessage).catch(function(error) {
		console.log(error);
	});
});

function areInputsEmpty() {
	if (nameInput.value.trim() === "" || blockInput.value.trim() === "" || assignmentNumberInput.value.trim() === "") {
		return true;
	} else {
		return false;
	}
}

function sendMessage(tabs) {
	var tab = tabs[0]; //tabs parameter should be an array of one single tab(currentWindow: true and active: true should always match one tab)

	var message = {};
	message.name = nameInput.value;
	message.block = blockInput.value;
	message.assignmentNumber = assignmentNumberInput.value;

	browser.tabs.sendMessage(tab.id, message);
}

dismissAlert.addEventListener('click', function() {
	alertBox.style.display = ""; //hide the alert box
});

function alertMessage(message) {
	alertMessageDiv.innerText = message;
	alertBox.style.display = "inline-block"; //show the alert box
}