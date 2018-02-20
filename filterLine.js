function filterLine(text, kind){
	var words = text.split('\n');
	var type = 'null';
	var neutrino_events = [];
	var search = 1; 
	var stop = 0;
	var h; var entry;
	var setoff = [0,0,0,0,0,0,0,0,0];
	
	if(document.getElementById("timeselect").value == "s"){
	var margin = parseFloat(document.getElementById("margin").value);
}else if(document.getElementById("timeselect").value == "m"){
	var margin = parseFloat(document.getElementById("margin").value) * 60;
}else if(document.getElementById("timeselect").value == "h"){
	var margin = parseFloat(document.getElementById("margin").value) * 3600;
}else if(document.getElementById("timeselect").value == "d"){
	var margin = parseFloat(document.getElementById("margin").value) * 86400;
}else if(document.getElementById("timeselect").value == "m"){
	var margin = parseFloat(document.getElementById("margin").value) * 2592000;
}else if(document.getElementById("timeselect").value == "y"){
	var margin = parseFloat(document.getElementById("margin").value) * 31104000;
}
	//param has some of the parameters for the data the user wants. the rest of the parameters are directly from html input elements and from typeList and rangeList
	var param = {'kind': ['null'], 
				 'timeMin': (Date.parse(document.getElementById("day").value + " " + document.getElementById("month").value + " "
				  + document.getElementById("year").value + " " + document.getElementById("hour").value + ":" 
				  + document.getElementById("minute").value + ":" + document.getElementById("second").value)/1000 - margin), 
				  'timeMax': (Date.parse(document.getElementById("day").value + "-" + document.getElementById("month").value 
				  + "-" + document.getElementById("year").value + " " + document.getElementById("hour").value + ":" 
				  + document.getElementById("minute").value + ":" + document.getElementById("second").value)/1000 + margin)};
				  
	//if (document.getElementById('gamma_ray').checked) {
		param["kind"].splice(-1, 0, 'gamma_ray', 'Gamma_Ray', 'Gamma_ray'); //fermi
	//} 
	//if (document.getElementById('neutrino').checked) {
		param["kind"].splice(-1, 0, 'neutrino', 'Neutrino');//icecube
	//}
	//if (document.getElementById('source').checked) {
		param["kind"].splice(-1, 0, 'hawc', 'HAWC', 'Source', 'source');//hawc
	//}
	//if (document.getElementById('other').checked) {//start of change
		param["kind"].splice(-1, 0, 'other');//other
	//}//end of change
		
	indices = getIndices(text);
	//search must be greater than words.length
	//stop is if you want a certain amount of data points from the current set
	while (search < 100000 && stop < 22500 && search < words.length) {
		
		//resets setoff
		for (item in indices){
			setoff[item] = indices[item];
		}
		
		var word = words[search].trim().split(/\s+/);
		
		if (words == null ){
			break;
		}
		if(word[1] == null || words.length < 2){
			search++;
			continue;
		}
		
		//check for items in parenthesis, which will be excluded.
		/*
		This is checked for every word instead of for just one entry in the list words
		because one line could contain :
			( -21.6  +25.9)
		and be broken up into [ (, -21.6, +25.9) ], while another line could contain :
			(-144.4 +131.6)
		could be broken up into [ (-144.4, +131.6) ] meaning the number to offset the 
		index by in one line is not always the same as in another line.
		*///info
		for (entry = 0; entry < word.length; entry++){
			if (word[entry] != null && word[entry] != undefined) {
				if (word[entry].includes('(')){
					for (var h = entry; h < word.length; h++) {
						if (word[h].includes(')')){
							for (item in indices){
								if (indices[item] >= entry){
									setoff[item] += h-entry+1;
								}
							}
						}
					} 
				}
			}
		}
		
		//if index of a param wasn't found, set the index to point to 'null' MOVE LATER
		word.push('null');
		for(var index = 0; index < setoff.length; index++){
			if(setoff[index] == null){
				setoff[index] = parseInt(word.length);	
			}
		}
		
		//for user uploaded files, the kind is inputted by the user. 
		eventKind = (kind != 'nope' && kind != null)? kind : word[4]; 
		eventType = (word[setoff[3]] == null)? 'null' : word[setoff[3]];
		eventType = (eventType.toLowerCase() == 'cascade')? 'shower' : eventType;
		
		if (param["kind"].includes(eventKind.split('userupload')[0].toLowerCase())){ 
			 if (updateTypeList().includes(eventType.toLowerCase()) || eventKind.includes('userupload')){
					if (document.getElementById("timebox").checked == false || param['timeMin'] < parseFloat(word[setoff[6]]) && param['timeMax'] > parseFloat(word[setoff[6]])){
						if (fluxSpecEnergy(word, setoff, eventKind)){ //compares flux/spec/energy of event to the slider ranges - only passes if within range
							astrojs.ready(function(e){
								if (Galactic){
									var c = astrojs.coordinates.eq2gal(parseFloat(word[setoff[1]]), parseFloat(word[setoff[0]]), 2000);
									word[setoff[0]] = c.b;
									word[setoff[1]] = c.l;
									//lat = b or dec, long = l or ra
								} }); 
								neutrino_events.push({dec: parseFloat(word[setoff[0]]), ra: parseFloat(word[setoff[1]]),
								err: parseFloat(word[setoff[2]]), type: eventType,
								kind: eventKind, energy: parseFloat(word[setoff[5]]), flux: parseFloat(word[setoff[7]]), spec: parseFloat(word[setoff[8]])}) ;
								stop ++;
						}
				   }     	    	    
			 }
		}
		search++;
	}	
	return neutrino_events;
}//end of filterLine
