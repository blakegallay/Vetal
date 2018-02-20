function changeParams(thing){
		//handles files already in the program
		function readTextFile(files, ready){
		var q;
		var output = [];
		for (q = 0; q < files.length; q++){
		   var rawFile = new XMLHttpRequest();
			rawFile.open("GET", files[q]);
			rawFile.overrideMimeType("text/plain; charset=x-user-defined");
			rawFile.onreadystatechange =  function(rawFile,q){ return function ()
			{
				if(rawFile.readyState === 4)
				{
					if(rawFile.status === 200 || rawFile.status == 0)
					{	
						var textid = (rawFile.responseText.split("\n")[2].split(" ")[4].toLowerCase() == 'hawc') ? 'source' :rawFile.responseText.split("\n")[2].trim().split(/\s+/)[4].toLowerCase(); console.log(textid);
            			if (isSelected(textid, files[q])){
							output.push([files[q], filterLine(rawFile.responseText)]);
						}
						else {
							output.push([files[q], []]);
						}
						addFileName(files[q], rawFile.responseText.split("\n")[1].split(" ")[4].toLowerCase());
						findRangeEnergy(files[q], rawFile.responseText, textid);
						if (output.length >= files.length){
							ready(output);
						}
					}
				}
			}; }(rawFile,q);
			rawFile.addEventListener("progress", function(){console.log("progress");});
			rawFile.addEventListener("load", function(){console.log("load");});
			rawFile.addEventListener("error", function(evt){
				console.log("error");
				console.log(evt);
			});
			rawFile.addEventListener("abort", function(){console.log("abort");});
			rawFile.send();
			}//here
}
		   	//files already included in the program. They should be in the Data file.
/*var files = ["/~eforberger/Data/hawc2.txt","/~eforberger/Data/nhdata.txt", "/~eforberger/Data/output_Observation.txt",
		     "/~eforberger/Data/fermit1.txt", "/~eforberger/Data/fermit2.txt", "/~eforberger/Data/fermit3.txt",
		      "/~eforberger/Data/fermit4.txt", "/~eforberger/Data/pointsources.txt"];
		      */
var files = ["./Data/hawc2.txt","./Data/nhdata.txt", "./Data/output_Observation.txt",
		     "./Data/fermit1.txt", "./Data/fermit2.txt", "./Data/fermit3.txt",
		      "./Data/fermit4.txt", "./Data/pointsources.txt"];//to run locally

readTextFile(files,function (filelist){
		
	//adds user inputted files to filelist:
	for (var h = 0; h  < thing.length; h++){
		filelist.push(thing[h]);
	}
//call skymap, draws the data and map, and handles zooming
skymap(filelist);
});
}
