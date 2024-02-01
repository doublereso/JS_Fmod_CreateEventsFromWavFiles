// by Petr Iakiamsev, 2023
// It is creating fmod-events from wav files, while require txt file with the name of the files.
// Put this script in this folder in order for it to appear under scripts menu:
// C:\Program Files\FMOD SoundSystem\FMOD Studio 2.01.06\scripts

// Folder with the same address as pathVOwaves already should be created in Events tab.

studio.menu.addMenuItem({
    name: "VO import From File",
	execute: function() {
		createEventsFromFile();
	}
});

var pathVOwaves = "/Dialogs/English/Characters/"; // path to VO wave files
var extension = ".wav"; // extension of the file

var eventFolder = studio.project.lookup("event:/Dialogs/English/Characters");

function createEventsFromFile(){
	console.log("SCRIPT STARTED");

	// File with names - get to know its location and read it
	
	var path = "";
	studio.ui.showModalDialog({
				windowTitle: "Open a file",
				widgetType: studio.ui.widgetType.PathLineEdit,
		text: "",
		label: "Please select a file to open and close the window when done",
		onEditingFinished: function() {
			path = this.text();
		}
	});

	var theFile = studio.system.getFile(path);

	if (!theFile.open(studio.system.openMode.ReadOnly)) {    
        alert("Failed to open file {0}".format(theFile));
        console.error("Failed to open file {0}.".format(theFile));
        return;
    }
	
	var text = theFile.readText(theFile.size()); // Read entire text file
	var lines = text.split('\n'); // Split text to lines

	lines.forEach(lineToEvent);// For each line create an event and assign VO wave file to it

	theFile.close();
}
	
function lineToEvent(item){ // create event with wav file inside
	
	item = item.trim(); // remove spaces in file name
	var fullFilePath = pathVOwaves+item+extension; // full path to wav file
	
	// check if event is already exists
	if (studio.project.lookup("event:"+pathVOwaves+item)){
		console.warn("Event already exists: "+item);
		return;
	}
	else { //check if wav file exists
		if (studio.project.workspace.masterAssetFolder.getAsset(fullFilePath)){
			var asset = studio.project.workspace.masterAssetFolder.getAsset(fullFilePath);
			var event = studio.project.create("Event");
			event.name = item;
			event.folder = eventFolder;
			var track = event.addGroupTrack();
			var sound = track.addSound(event.timeline, "SingleSound", 0, 10);
			sound.audioFile = asset;
			sound.length = asset.length;
			console.log("Event created: "+item);
		}
		else {
			console.warn("There is no wav file: "+item);
			return;
		}
	}
};



