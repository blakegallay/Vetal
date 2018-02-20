function addFileName (filepath, placement){
if (placement == 'hawc'  || placement == 'fermi'){
	placement = 'source';
}
if (!(placement == 'source' || placement == 'neutrino' || placement == 'gamma_ray')){
	placement = 'other';
}
	var pathArray = filepath.split('/');
	var fileName = pathArray[pathArray.length-1];
	var drop = document.createElement('option');
	drop.value = fileName;
	drop.text = getDropDownText(fileName);
	var canUse = true;
	for (var i = 0; i < document.getElementById(placement.toLowerCase()+'select').length; i++){
		if (document.getElementById(placement+i) != null){
			if (document.getElementById(placement+i).value == fileName){ //if the name is already in that dropdown
				canUse = false;
			}
		}
	}
	if (canUse){ //if the name isn't in the dropdown.
		drop.id = (placement+document.getElementById(placement+'select').length);
		document.getElementById(placement+'select').add(drop);
		}
}