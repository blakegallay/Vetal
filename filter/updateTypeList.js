function updateTypeList(){
	var k;
	var typelist = [];
	//this for loops goes through the source types and adds the selected ones to typeList
	for (k = 1; k < 21; k++){
		if (document.getElementById(String(k)).checked){
			typelist.unshift(document.getElementById(String(k)).name.toLowerCase());
		}
	}
	if (document.getElementById('track').checked) {typelist.unshift('track');} //************
	if (document.getElementById('shower').checked) {typelist.unshift('shower');}
	//************
	typelist.unshift('null');
	return typelist;
}