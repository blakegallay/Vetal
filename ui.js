function hideshow(){
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
	
}