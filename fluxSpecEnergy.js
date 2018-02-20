//checks if input event fits within parameters set by flux/spec/energy sliders

function fluxSpecEnergy(word, indices, kind ){
	var range = []; 
	var refinedKind =(kind.toLowerCase().includes('hawc'))? 'source': kind.split('userupload')[0].toLowerCase();
	/*
	The following gets the min and max values of the slider from the text input box above it. 
	range[0] = min
	range[1] = max
	*/
	range = [sliders(refinedKind+"slider").get(0),sliders(refinedKind+"slider").get(1)];

	if (document.getElementById('spec_index').checked == true && ['hawc', 'source'].includes(kind.split('userupload')[0].toLowerCase())){
		if ( parseFloat(word[indices[8]]) >= range[0] && parseFloat(word[indices[8]]) <= range[1]  ||
		(kind.includes('userupload') && (word[indices[8]] == 'null' || word[indices[8]] == null))){
			return true;
		}
			return false;
	}
	if (document.getElementById('flux').checked == true && ['hawc', 'source'].includes(kind.split('userupload')[0].toLowerCase())){
		if (parseFloat(word[indices[7]]) >= range[0] && parseFloat(word[indices[7]]) <= range[1] ||
		(kind.includes('userupload') && (word[indices[7]] == 'null' || word[indices[8]] == null))){
			return true;
		}
		return false;
	}
	if(['gamma_ray', 'neutrino'].includes(kind.split('userupload')[0].toLowerCase())){
		if (range[0] <= parseInt(word[indices[5]]) && range[1] >= parseInt(word[indices[5]]) ||
		(kind.includes('userupload') && (word[indices[5]] == 'null' || word[indices[5]] == null))){
			return true;
		}
		return false;
	}
return true;
}