function parseCustomFormat(text){
var words = text.split('\n');
headed = false;
var indices = [0,1,2,3,4,5,6,7,8,9];
var offset = 0;

if (words[0].trim().toLowerCase().includes('dec')){
	console.log('found header');
		headed = true
		indices = [null,null,null,null,null,null,null,null,null,null]
		var columns = words.shift().trim().split(/\s+/);
		
		var combos = {"DISTRIBUTED":"ENERGY",
					  "ANG":"RESOLUTION",
					  "ANGULAR":"RESOLUTION",
					  "DEPOSITED":"ENERGY",
					  "RIGHT":"ASCENSION"}
		
		for(var h = 0; h < columns.length; h++){
			for(key in combos){
				if(columns[h].toUpperCase() == key){ 
					if(columns[h+1].toUpperCase() == combos[key]){
						var s = (columns.slice(h, h+1).concat(columns.slice(h+1, h+2))).join("_");
						console.log('s ' + s);
						columns.splice(h+1,1);
						columns[h] = s;
					}
				}
			}
		}
	//console.log(columns);
		for(m = 0; m < columns.length; m++){
			c = columns[m]
			if (c.toUpperCase().charAt(0) == "[" && c.toUpperCase().charAt(c.length-1) == "]") {
				offset++;
			}
			else if (c.toUpperCase().charAt(0) == "(" && c.toUpperCase().charAt(c.length-1) == ")") {
				offset++;
			}
			else if (c == null || c.length < 1) {
				console.log('found null!');
				offset++;
			}
			else if(c.toUpperCase().includes("RA") || c.toUpperCase() == "RIGHT_ASCENSION"){
				indices[1] = m-offset;
			}
			else if (c.toUpperCase().includes("DEC") || c.toUpperCase().includes("DECLINATION")){
				indices[0] = m-offset;
			}
			else if (c.toUpperCase().includes("FLUX") || c.toUpperCase() == "FL"){
				indices[7] = m-offset;
			}
			else if (c.toUpperCase().includes("SPECTRAL INDEX") || c.toUpperCase() == "SPEC"){
				indices[8] = m-offset;
			}
			else if (c.toUpperCase() == "E" || c.toUpperCase().includes("ENERGY") || 
					 c.toUpperCase().includes("MEV") || c.toUpperCase().includes("GEV") || 
					 c.toUpperCase().includes("TEV") || c.toUpperCase().includes("KEV") ){
				indices[5] = m-offset;
			}
			else if (c.toUpperCase() == "TOPOLOGY" || c.toUpperCase().includes("TOP") ||
					 c.toUpperCase() == "SIGNATURE"){
				indices[3] = m-offset;
			}
			else if (c.toUpperCase().includes("ERR") || c.toUpperCase().includes("ANG_RESOLUTION") ||
					 c.toUpperCase().includes("ANGULAR_RESOLUTION")){
				indices[2] = m-offset;
			}
			else if (c.toUpperCase().includes("TIME") || c.toUpperCase().includes("MDJ")){
				indices[6] = m-offset;
			}
		}
		
	}

	return indices;
}