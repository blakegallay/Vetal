function isSelected(kind, filename){
	var end = false;
			$('#'+kind+"select option").each(
				function(){
					if (this.selected){ 
						if (filename.split('/')[filename.split('/').length-1] == this.value.split('/')[this.value.split('/').length-1]){
							end = true;
						}
					}
				});//end of 1st function
	return end;
}


function toDegrees(angle) {
  return angle * (180 / Math.PI);
}


function toRadians(angle) {
  return angle * (Math.PI / 180);
}


function coordType(){
if (document.getElementById("galactic").checked){
Galactic = true;
}
if (document.getElementById("equatorial").checked){
Galactic = false;
}
}