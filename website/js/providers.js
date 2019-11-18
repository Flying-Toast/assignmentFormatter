class File {
	constructor(filename, contents) {
		this.filename = filename;
		this.contents = contents;
	}

	headerText() {
		return `In file ${this.filename}:`;
	}
}

class Project {
	/*
	Parameters:
		files = an array of `File`s, one for each source file in the project
		buildSucceeded = a bool that denotes if the project compiled without errors.
		output = a string containing the projects stdout.
	*/
	constructor(files, buildSucceeded, output) {
		this.files = files;
		this.buildSucceeded = buildSucceeded;
		this.output = output;
	}
}

class Provider {
	constructor(url) {
		//adds a protocol to the url if missing
		if (!(/^http.*/.test(url))) {
			this.url = `https://${url}`
		} else {
			this.url = urlInput.value;
		}
	}

	/*
	--override this--

	Checks if the URL is valid for this provider.
	Returns: bool
	*/
	validateURL() {
		throw new Error("Override this.");
	}

	/*
	--override this--

	*Synchronously* retrieves the project information from the
		provider website and converts it to a `Project` to be
		retrieved by the `getProject` function.
	Calls `cb()` after the fetch is done.
	*/
	fetch(cb) {
		throw new Error("Override this.");
	}

	/*
	--override this--

	Returns the information from the provider as a `Project` object.
	*/
	getProject() {
		throw new Error("Override this.");
	}
}

class PaizaProvider extends Provider {
	constructor(url) {
		super(url);
	}

	validateURL() {
		let anchor = document.createElement("a");
		anchor.href = this.url;
		let urlPath = anchor.pathname;

		if (anchor.host !== "paiza.io" || !(/^\/projects\/[^/]*$/.test(urlPath))) {
			return false;
		}

		return true;
	}

	fetch(cb) {
		let request = new XMLHttpRequest();
		request.open("GET", "https://non-cors.herokuapp.com/" + "https://paiza.io/api" + urlPath + ".json");
		request.onload = request.onerror = function() {
			//TODO: create this.project

			cb();
		};
		request.send();
	}
}
