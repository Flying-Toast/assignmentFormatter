const electron = require("electron");
const app = electron.app;

let mainWindow;

app.on("window-all-closed", function() {
	app.quit();
});

app.on("ready", function() {
	mainWindow = new electron.BrowserWindow({
		width: 480,
		height: 240,
		icon: `${__dirname}/icon.png`
	});
	mainWindow.setMenu(null);
	mainWindow.loadURL(`file://${__dirname}/pages/index.html`);
});
