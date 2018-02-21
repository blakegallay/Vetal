//set the sliders max and min energy params according to the files selected
function updateEnergyRange(name){
	var a = 0;
	var min = -1;
	var max = -1;
		$('#'+name+'select option').each(function(){
		if (this.selected){
			for (a = 0; a < rangeList.length; a++){
				if (rangeList[a][0].split('/')[rangeList[a][0].split('/').length-1] == this.value.split('/')[this.value.split('/').length-1] ){
					var index = (document.getElementById('spec_index').checked && name == 'source') ? 2:1;
					if ((min == -1 || rangeList[a][index][0] < min) && rangeList[a][index][0] != "null" && rangeList[a][index][0] != null) { min = rangeList[a][index][0]; }
					if ((max == -1 || rangeList[a][index][1] > max) && rangeList[a][index][1] != "null" && rangeList[a][index][1] != null) { max = rangeList[a][index][1]; }
				}
			}
		}
		});
		sliders(name+"slider").set(parseFloat(min),parseFloat(max),null);
		if (name == 'source'){ //go and switch the displayed text
		//hideshow is called here because changeEnergyParams() could be being called because of the user changing the flux/spectral index checkboxes. When they change, not only does the energy values shown on the slider need to change, but the text over the slider needs to change as well, and that is done in hideshow.
			hideshow();
		}
}