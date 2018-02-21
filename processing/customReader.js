/**
*@namespace customReader
*@memberof Processing
*/

/**
*Handles user inputted files
*@function customReader
*@param {array} input gunth gunth
*@memberof Processing.customReader
*/
function customReader(input){
	d3.selectAll("svg").remove();
	
	var credits = d3.select("body").append("svg")
    		.attr("width", 1000)
    		.attr("height", 100)
  		.append("g")
   	 		.attr("transform", "translate(" + 0 + "," + 75 + ")");
	$("svg").css({top:page_height,left:0,position:'absolute'});
	
	credits.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(600,0)")
	  	.text("Created by Elsa Forberger, Haley James, and Blake Gallay")	
		.attr('font-size','15')
	
	//handles user inputted files
		/**
		*@memberof Processing
		*/
		var text = [];
		var inInputKinds = false
		for (var r =0; r < input.files.length; r++){
            inInputKinds = false;
            for (entry in inputKinds) {
                if (inputKinds[entry][0] == input.files[r].name) {
                    inInputKinds = true;
                }
            }
            if (!inInputKinds){
                var found = false;
                while (!found){
                    var kind = prompt("Please enter the kind of data in file: " + input.files[r].name + "\n This can be 'neutrino', 'source', 'gamma ray', or 'other'.", "other");
                    if (kind != null){
                        kind = (kind.toLowerCase() == 'gamma ray') ? 'gamma_ray' : kind.toLowerCase();
                        if (['gamma_ray', 'neutrino', 'source', 'other'].includes(kind)){
                            found = true;
                        }
                    }
                }
				
                inputKinds.push([input.files[r].name, kind]);
            }
			var reader = new FileReader();
				reader.onload = function (r, reader, inputKinds){ return function() {
					var kind;
						for (item in inputKinds){
							if (inputKinds[item][0] == input.files[r].name) {
								kind = inputKinds[item][1];
								break;
							}
						}
						
						if (isSelected(kind, input.files[r].name)){
							text.push([input.files[r].name, filter(reader.result, kind+'userupload')]);
						}
						addFile(input.files[r].name, kind);
						findRangeEnergy(input.files[r].name, reader.result, kind);
						if (input.files.length == r+1){
							pushFiles(text);
						}
			};  } (r, reader, inputKinds);
			 if (input.files.length > 0){
			 while (reader.readyState == 1 ){
				}
				 reader.readAsText(input.files[r]);
				}
		}
		if (input.files.length <= 0 && cont){pushFiles([]);}
}
