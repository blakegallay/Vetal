/**
*@namespace skymap
*@memberof Output
*/

/**
*Defines drawing function and draws the skymap
*@function skymap
*@param {array} stringout all filtered event data
*<p> format: (input format later)
*@memberof Output.skymap
*/
function skymap(stringout) {

if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }
    var to = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];
      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

astrojs.ready(function(e){

// Create an in memory only element of type 'custom'
var detachedContainer = document.createElement("custom");

// Create a d3 selection for the detached container. We won't
// actually be attaching it to the DOM.
var dataContainer = d3.select(detachedContainer);

	  // make a canvas
	  var width = 1000,//960
		  height = 500;
		  d3.select('body').selectAll('canvas').remove(); 
	  var canvas = d3.select("#div_canvas")
		.append("canvas")
	    .attr("style", "outline: solid black;")
		.attr("width", width)
		.attr("height", height);
	  $("canvas").css({top:10,left:150,position:'relative'});
	  

/*
	  $("canvas").prop("title", "SPACE THE FINAL FRONTIER");
	  
	  $("cavnas").tooltip ({
	   disabled: true,
	   close: function (event,ui) {$(this).tooltip("disable");}
	  });
	  $("canvas").on("click", function () {
	   $(this).tooltip("enable").tooltip("open");
	  });
*/


	  var context = canvas.node().getContext("2d");
	  var coords, coords2;
	  

	  var projection = d3.geoMollweide()
		  .scale(170)//165
		 .translate([width /2, height /2])
		  .precision(.1);
		

//create zoom
canvas.call(d3.zoom()
    .scaleExtent([1 / 3, 3])
    .translateExtent([[-50,-50],[1050, 550]]) //keeps the map in the area
    .on("zoom", zoomed));

drawPoints();//draw the points

var initial_transform = [0,0,1];
function zoomed() {
	if (document.getElementById("zoombox").checked){
		  context = canvas.node().getContext("2d");
		  context.clearRect(0, 0, width, height);
		  context.translate(d3.event.transform.x-initial_transform[0],
							d3.event.transform.y-initial_transform[1]);
		  var scale = 1+d3.event.transform.k-initial_transform[2];
		  context.scale(scale, scale);
		  initial_transform = [d3.event.transform.x, d3.event.transform.y, d3.event.transform.k];
		  drawPoints();
		  context.restore();
	}
}


/**
*Draws all of the data onto the skymap
*@function drawPoints
*<p> A more in-depth explanation of this function will be added later. Different members of the team know about different aspects of this code, so it will take work to come up with a comprehensive guide.
*@memberof Output.skymap
*/
function drawPoints(){


var drawPoint = false;
	var data = [];
	  d3_events_length = 0;
	
 	 // mirror the projection so it matches official plots
	  var project = function(d) {
	  	if (!Galactic){
		return projection([(d[0]-180)*-1,d[1]]);
		}
		return projection([(d[0]) * -1 ,d[1]]);
	  };

	  // add background
	  var path = d3.geoPath()
		  .projection(projection)
		  .context(context);
	  var graticule = d3.geoGraticule()
			  .step([30, 30]);
	  context.clearRect(0,0,width,height);
	  context.beginPath();
	  path({type: "Sphere"});
	  context.lineWidth = 2;
	  context.stroke();
	  reset_styles(context);

	  context.beginPath();
	  path(graticule());
	  context.strokeStyle = 'grey';
	  context.setLineDash([1,6]);
	  context.stroke();
	  reset_styles(context);
	
	  
	  var mydraw = draw(context,project);


	  // make equator
	  mydraw.line({
		coords: [[0,0],[360,0]],
		wrap: false,
		strokeStyle: "grey",
	  });

	  // make galactic plane
	  var plane_data = [];
	  for(var i=-180;i<180;i+=.1) {
	  var tmp;
	  if (Galactic){
	  tmp = [i, 0];
	  plane_data.push(tmp);
	  }
	  else {
	  tmp = astrojs.coordinates.galactic2equatorial(i,2);
		plane_data.push([tmp.ra, tmp.dec]);
		}
	  }  
	  mydraw.line({
		coords: plane_data,
		strokeStyle: 'grey'
	  });
	  
	for (item in stringout){ //add points to list data
	  	for (point in stringout[item][1]){
	  		data.push(stringout[item][1][point]);
		}
	}
		//info on data binding: http://alignedleft.com/tutorials/d3/binding-data
	dataBinding = dataContainer.selectAll("custom.point")
    .data(data, function(d) { return d; });
	
    //handle selecting neutrinos for the ability to only draw the points inside the error range of selected neutrinos
    d3.select('canvas').on("click", function (){
		
		var x = d3.mouse(this)[0];
		var y = d3.mouse(this)[1];
		console.log('test');
		console.log('x: '+ x+',  y: '+ y);
		var elements = dataContainer.selectAll("custom.point");
		elements.each(function(d) {
			var node = d3.select(this);
			console.log(node.attr('kind'));
			var pointCoords = project([node.attr('ra'), node.attr('dec')]);
			if (Math.abs(x-pointCoords[0]) < 5 && Math.abs(y-pointCoords[1]) < 5){
				
				if(canGo){ 
					canGo = false;
					setTimeout(function(){ canGo = true;}, 500);
				
				console.log('dec: '+ node.attr('dec')+' ra: '+ node.attr('ra'));
				var selected = false
				for(var i = 0;i < selected_events.length;i++){
					if(selected_events[i] == node.attr('id')){
						selected = true
						var selectedindex = i;		
					}
				}
				if(selected == false){
					selected_events.push(node.attr('id'));
					if(node.attr('kind') == 'neutrino'){
					mydraw.circle({
						coords: [node.attr('ra'), node.attr('dec')],
						radius: 10,
						wrap: true,
						raw: true, 
						fill: false,
						stroke: true,
						lineWidth: 2,
						strokeStyle: 'red'
					});
					}
				}
				else{
					selected_events.splice(selectedindex, 1);
					if(node.attr('kind') == 'neutrino'){
					mydraw.circle({
						coords: [node.attr('ra'), node.attr('dec')],
						radius: 10,
						wrap: true,
						raw: true, 
						fill: false,
						stroke: true,
						lineWidth: 3,
						strokeStyle: 'white'
					});
					}
				}
				
				if(node.attr('kind').includes('source')){
					var old_source = selected_source;
					
					selected_source = [parseFloat(node.attr('ra')), parseFloat(node.attr('dec'))];
					if(old_source != selected_source){
						analysis_drawn = true;
					
						initialize();
					}
					
					mydraw.circle({
						coords: [node.attr('ra'), node.attr('dec')],
						radius: 7,
						wrap: true,
						raw: true, 
						fill: false,
						stroke: true,
						lineWidth: 2,
						strokeStyle: 'green'
					});

				}
				}
			}
		});
		
});
/*
		Here a nest is used to organize data.
		info on nests: https://github.com/d3/d3-collection/blob/master/README.md#nest
		This is not yet implemented, but is being considered for use.
	*///info
	var sortedData = d3.nest()
    .key(function(d, i) { return d.kind; })
    .key(function(d, i) { return d.type; })
    .entries(data);
	
	var sortedData = d3.nest()

  
  //d3_events_length = 0;
  
  // for new elements, create a 'custom' dom node, of class point.
  //each dictionary entry is turned into a node of class point
  /*
  	The idea is that eventually, instead of the files being turned into text and then into a dictionary, and then into nodes in dataBinding, they are turned straight from the filetext into nodes in dataBinding
  *///info
  dataBinding.enter()
      .append("custom")
      .classed("point", true)
      .attr("dec", function (d, i){
      	return d['dec']
      })
      .attr("ra",function (d, i){
      	return d['ra']
      })
      .attr("err", function (d, i){
      	return d['err']
      })
      .attr("energy", function (d, i){
      	return d['energy']
      })
      .attr("type", function (d, i){
      	return d['type']
      })
      .attr("kind", function (d, i){
      	return d['kind']
      })
      .attr("flux", function (d, i){
      	return d['flux']
      })
      .attr("spec", function (d, i){
      	return d['spec']
      })
      .attr("id",function (d){
        if(d['kind'] == 'neutrino'){
        d3_events_length++
        return d3_events_length;
        }else{
        return 0;
        }
      });
    dataBinding.exit()
    	.remove();

//draws all non-neutrino events
var elements = dataContainer.selectAll("custom.point");
  elements.each(function(d) {
  var drawPoint = false;
    var node = d3.select(this);
    drawPoint = false;
    //skip the point if it's a neutrino
    if (node.attr("kind").includes('neutrino')){
    	return; 
	}
	function findRadius(){
		  	if (node.attr("kind").includes('gamma_ray')){		  	
		  			return 2; //gamma_ray
		  		}
		  	else if (node.attr("kind").includes('source') ||node.attr("kind").includes('source')){
		  			console.log('found source');
		  			return 4; //source
		  		}
		  	return 3;//can't tell what it is... :(
	}

	if(document.getElementById('onlyErr').checked){
		var all_events = dataContainer.selectAll("custom.point");
		all_events.each(function(d) {
			var n = d3.select(this);
			//console.log(n.attr('id'))
			if(n.attr('kind').includes('neutrino') && parseFloat(n.attr('err')) > 0){
				for(var u = 0;u<selected_events.length;u++){
					if(selected_events[u] == n.attr('id')){
						if(Math.sqrt(Math.pow(Math.abs(n.attr('ra') - node.attr('ra')),2) + Math.pow(Math.abs(n.attr('dec') - node.attr('dec')),2)) < n.attr('err')){
							drawPoint = true;
						}
	
					}
				}
			}
		})
	
	}//
	else {
		drawPoint = true;
	}
	console.log('draw point is: '+ drawPoint);
	if (drawPoint){
		if (node.attr('kind').includes('gamma_ray') || node.attr('kind').includes('other')){
			mydraw.circle({
				  coords: [node.attr("ra"), node.attr("dec")],
				  radius: findRadius (node),
				  fill: true,
				  stroke: false,
				  fillStyle: colorfinder(node),
				  raw: true
				})
		}//source data & types called to draw here. 
		var type = (node.attr("type") == 'null' && node.attr("type").includes('source') && document.getElementById(1).checked)? 'UNID' : node.attr("type");
		if (type != undefined && type != null && type != 'null') {
			if (['pwn','psri', 'psr', 'spp', 'glc', 'bcu', 'agn', /*'bin',*/ 'bll', 'css', 'fsrq',/*'gal', 'hmb', 'nlsy1', 'nov',*/ 'rdg', 'sbg', /*'sey', 'sfr',*/ 'snr', 'spp', 'ssrq', 'hbl', 'compositesnr', 'massivestarcluster', 'shell', 'snrmoleccloud', 'unid'].includes(type.toLowerCase())){
				
				var coords = (['pwn','psri', 'psr', 'spp', 'glc'].includes(type.toLowerCase()))? [[node.attr("ra"), node.attr("dec")], project([node.attr("ra"), node.attr("dec")])] : project([node.attr("ra"), node.attr("dec")]);
				if ((node.attr("kind").includes('source') || node.attr("kind").toLowerCase().includes('hawc')) && (document.getElementById('spec_index').checked || document.getElementById('flux').checked)){
					types[type.toLowerCase()](mydraw, coords, 6, colorfinder(point));//keep in mind this is 6 for everything when creating/editing types
				}
				else {
					types[type.toLowerCase()](mydraw, coords, 6, 'useDefault');
				}
			}
		}
	}	
//return color for the point
function colorfinder(){
	//linear scale
	var linColorScaleGamma = d3.scaleLinear()
   //.domain([Math.sqrt(sliders("gamma_rayslider").get(0)),Math.sqrt(sliders("gamma_rayslider").get(1))])
   .domain([sliders("gamma_rayslider").get(0),sliders("gamma_rayslider").get(1)])
    .range([document.getElementById('colgmin').value, document.getElementById('colgmax').value]);  // or use hex values;
    
    var linColorScalesourcespec = d3.scaleLinear()
   //.domain([Math.sqrt(sliders("sourceslider").get(0)),Math.sqrt(sliders("sourceslider").get(1))])
   .domain([sliders("sourceslider").get(0),sliders("sourceslider").get(1)])
    .range([document.getElementById('colsourcemin').value, document.getElementById('colsourcemax').value]); 
    
    var linColorScalesourceflux = d3.scaleLinear()
   .domain([sliders("sourceslider").get(0),sliders("sourceslider").get(1)])
    .range([document.getElementById('colsourcemin').value, document.getElementById('colsourcemax').value]); 
    
    //linear squareroot scale
    var linsqrtColorScaleGamma = d3.scaleLinear()
   .domain([Math.sqrt(sliders("gamma_rayslider").get(0)),Math.sqrt(sliders("gamma_rayslider").get(1))])
    .range([document.getElementById('colgmin').value, document.getElementById('colgmax').value]);  // or use hex values;
    
    var linsqrtColorScalesourcespec = d3.scaleLinear()
   .domain([Math.sqrt(sliders("sourceslider").get(0)),Math.sqrt(sliders("sourceslider").get(1))])
    .range([document.getElementById('colsourcemin').value, document.getElementById('colsourcemax').value]); 
    
    var linsqrtColorScalesourceflux = d3.scaleLinear()
   .domain([Math.sqrt(sliders("sourceslider").get(0)),Math.sqrt(sliders("sourceslider").get(1))])
    .range([document.getElementById('colsourcemin').value, document.getElementById('colsourcemax').value]); 
    
    //logarithmic scale
    var logColorScaleGamma = d3.scaleLog()
    .base([10])
   .domain([sliders("gamma_rayslider").get(0),sliders("gamma_rayslider").get(1)])
    .range([document.getElementById('colgmin').value, document.getElementById('colgmax').value]);  // or use hex values;

    var logColorScalesourcespec = d3.scaleLog()
    .base([10])
   .domain([sliders("sourceslider").get(0),sliders("sourceslider").get(1)])
    .range([document.getElementById('colsourcemin').value, document.getElementById('colsourcemax').value]); 
    
    var logColorScalesourceflux = d3.scaleLog()
    .base([10])
   .domain([sliders("sourceslider").get(0),sliders("sourceslider").get(1)])
    .range([document.getElementById('colsourcemin').value, document.getElementById('colsourcemax').value]);
	
	if (node.attr('kind').includes("gamma_ray")){
		var scaleType = document.getElementById('gamma_rayColorScale').options[document.getElementById('gamma_rayColorScale').selectedIndex].value;
		if (scaleType.includes('lin')){
			return (scaleType == 'linsqrt')? linsqrtColorScaleGamma(Math.sqrt(node.attr('energy'))) : linColorScaleGamma(node.attr('energy'));
		}
			return logColorScaleGamma(node.attr('energy'));
	
		}
	else if (node.attr('kind').toLowerCase().includes('hawc') || node.attr('kind').includes('source')){
		var scaleType = document.getElementById('sourceColorScale').options[document.getElementById('sourceColorScale').selectedIndex].value;
		if (document.getElementById('spec_index').checked) {
			if (scaleType.includes('lin')){
					return (scaleType == 'linsqrt')? linsqrtColorScalesourcespec(Math.sqrt(node.attr('spec'))) : linColorScalesourcespec(node.attr('spec'));
				}
				return logColorScalesourcespec(node.attr('spec'));		
		} 
		if (document.getElementById('flux').checked) {
			if (scaleType.includes('lin')){
					return (scaleType == 'linsqrt')? linsqrtColorScalesourceflux(Math.sqrt(node.attr('flux'))) : linColorScalesourceflux(node.attr('flux'));
				}
				return logColorScalesourceflux(node.attr('flux'));
		}
			
		return 'black'
	}
}
		
});//end of for each node loop

//draws all neutrinos
var ncount = 0;
  elements.each(function(d) {
    var node = d3.select(this);
    if (!node.attr("kind").includes('neutrino') ) //if not a neutrino, move on
    	return;

    var neutrino_selected = false;
    for(var o = 0;o < selected_events.length; o++){
		if(selected_events[o] == node.attr('id')){
			neutrino_selected = true
		}
    }
    if(!document.getElementById('filterNeutrinos').checked){
    	neutrino_selected = true;
    }
    if(neutrino_selected == false){
    	return;
    }

			mydraw.circle({
			  coords: [node.attr("ra"), node.attr("dec")],
			  radius: 6,
			  fill: true,
			  stroke: false,
			  fillStyle: colorFinder(),
			  raw: true
			})
			
			if (node.attr("err") > 6) {
			  mydraw.circle({
				coords: [parseFloat(node.attr("ra")), parseFloat(node.attr("dec"))],
				radius: parseFloat(node.attr("err")),
				strokeStyle: colorFinder(),
				wrap: true
			  });
			}
				//this.parentNode.appendChild(this);
				ncount++;
				mydraw.text({
				  coords: [node.attr("ra"), node.attr("dec")],
				  font: "12px sans-serif",
				  text: ""+node.attr("id")
				});	
				
		//draw the type of the neutrino: the cross(shower) or x(track).
		var type = node.attr("type");
		if (type != undefined && type != null && type != 'null') {
			if (['track', 'shower'].includes(type.toLowerCase())){
		  		types[type.toLowerCase()](mydraw, project([node.attr("ra"), node.attr("dec")]), 6, 'useDefault');	
		  	}
		}
//return color for neutrinos
function colorFinder(){
	//linear scale
    var linColorScaleNeutrino = d3.scaleLinear()
   	.domain([sliders("neutrinoslider").get(0),sliders("neutrinoslider").get(1)])
    .range([document.getElementById('colnmin').value, document.getElementById('colnmax').value]); 

	//linear squareroot scale
	var linsqrtColorScaleNeutrino = d3.scaleLinear()
   	.domain([Math.sqrt(sliders("neutrinoslider").get(0)), Math.sqrt(sliders("neutrinoslider").get(1))])
    .range([document.getElementById('colnmin').value, document.getElementById('colnmax').value]); 

    //logarithmic scale
    var logColorScaleNeutrino = d3.scaleLog()
    .base([10])
   	.domain([sliders("neutrinoslider").get(0),sliders("neutrinoslider").get(1)])
    .range([document.getElementById('colnmin').value, document.getElementById('colnmax').value]); 
    
	var scaleType = document.getElementById('neutrinoColorScale').options[document.getElementById('neutrinoColorScale').selectedIndex].value;
	if (scaleType.includes('lin')){
		return (scaleType == 'linsqrt')? linsqrtColorScaleNeutrino(Math.sqrt(node.attr('energy'))) : linColorScaleNeutrino(node.attr('energy'));
	}
	return logColorScaleNeutrino(node.attr('energy'));
}
		
});//end of for each node loop (neutrino)

var elements = dataContainer.selectAll("custom.point");
var neutrinos_drawn = false;
var sources_drawn = false;
		elements.each(function(d) {
			
			var node = d3.select(this);
			
			if(node.attr('kind') == 'neutrino'){
				neutrinos_drawn = true;
			}else if(node.attr('kind') == 'source'){
				sources_drawn = true;
			}
		})
		
var neutrino_info_html = document.getElementById("selectioninfo_neutrino");
    if (neutrinos_drawn) {
        neutrino_info_html.style.display = "block";
    } else {
        neutrino_info_html.style.display = "none";
    }
	
var source_info_html = document.getElementById("selectioninfo_source");
    if (sources_drawn && neutrinos_drawn) {
        source_info_html.style.display = "block";
    } else {
        source_info_html.style.display = "none";
    }
	
var clearselection_html = document.getElementById("clearselection");
	if((sources_drawn && neutrinos_drawn) || neutrinos_drawn){
		clearselection_html.style.display = "block";
	}else{
		clearselection_html.style.display = "none";
	}

likelihood_analysis(neutrinos_drawn, mydraw, dataContainer);
console.log('drawPoints done');
}//end of drawPoints
});//end of astrojs
}//end of skymap function
//}