function hideshow(cont){
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
	
	var r;
	if (document.getElementById("timebox").checked){
	document.getElementById("times").style.display = "initial"; 
	 document.getElementById("set_margin").style.display = "initial";
	}else{
	document.getElementById("times").style.display = "none";
	 document.getElementById("set_margin").style.display = "none";
	}
	if(document.getElementById("spec_index").checked){
	document.getElementById("spec_form").style.display = 'initial';
	}else{
	document.getElementById("spec_form").style.display = 'none';
	}
	if(document.getElementById("flux").checked){
	document.getElementById("flux_form").style.display = 'initial';
	}else{
	document.getElementById("flux_form").style.display = 'none';
	}
	
	//handles user inputted files
	var input = document.getElementById("myFile"); 
		var text = [];
		var inInputKinds = false
		for (r =0; r < input.files.length; r++){
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
						
						if (isSelected(kind, input.files[r].name) && cont){
							text.push([input.files[r].name, filterLine(reader.result, kind+'userupload')]);
						}
						addFileName(input.files[r].name, kind);
						findRangeEnergy(input.files[r].name, reader.result, kind);
						if (input.files.length == r+1 && cont){
							changeParams(text);
						}
			};  } (r, reader, inputKinds);
			 if (input.files.length > 0){
			 while (reader.readyState == 1 ){
				}
				 reader.readAsText(input.files[r]);
				}
		}
		if (input.files.length <= 0 && cont){changeParams([]);}
}
