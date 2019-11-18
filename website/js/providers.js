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
		this.url = url;
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
		provider website and converts it to a `Project`
	*/
	fetch() {
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
