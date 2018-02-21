		   	//files already included in the program. They should be in the Data folder.
/*var files = ["/~eforberger/Data/hawc2.txt","/~eforberger/Data/nhdata.txt", "/~eforberger/Data/output_Observation.txt",
		     "/~eforberger/Data/fermit1.txt", "/~eforberger/Data/fermit2.txt", "/~eforberger/Data/fermit3.txt",
		      "/~eforberger/Data/fermit4.txt", "/~eforberger/Data/pointsources.txt"];
		      */
var files = ["./Data/hawc2.txt","./Data/nhdata.txt", "./Data/output_Observation.txt",
		     "./Data/fermit1.txt", "./Data/fermit2.txt", "./Data/fermit3.txt",
		      "./Data/fermit4.txt", "./Data/pointsources.txt"];//to run locally

function initialize(){
	var input = document.getElementById("myFile"); //checks for new uploaded file(s)
	hideshow();
	if (input.files.length <= 0){
		pushFiles([]); //if none, continue as normal
	}else{
		customReader(input) //read new file(s) and continue
	}
	
}