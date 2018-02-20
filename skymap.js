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


var reset_styles = function(context) {
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.setLineDash([]);
  context.fillStyle = 'black';
  context.font = '10px sans-serif';
}
var draw = function(context, projection){
  var raw_curve = d3.line()
    .context(context);
  var curve = d3.line()
    .curve(d3.curveCardinal)
    .x(function(d){ return projection(d)[0]; })
    .y(function(d){ return projection(d)[1]; })
    .context(context);
  var safe_curve = d3.line()
    .curve(d3.curveCardinal)
    .defined(function(d){
    	if (Galactic){
    	  if (d[0] < -179.8|| d[0] > 179.8)
        	return null;
    	} else {
    		if (d[0] < 0.2 || d[0] > 359.8)
    		return null;
    	}
      	if (d[1] < -90 || d[1] > 90)
      	return null;
      return d;
    })
    .x(function(d){ return projection(d)[0]; })
    .y(function(d){ return projection(d)[1]; })
    .context(context);
  var wrap_coords = function(coords) {
    while (coords[1] < -90 || coords[1] > 90) {
      if (coords[1] > 90)
        coords[1] = 180 - coords[1];
      else
        coords[1] = -180 - coords[1];
      coords[0] += 180;
    }
    if (Galactic){
    	while (coords[0] < -181) { coords[0] += 360; } 
    	while (coords[0] > 181) { coords[0] -= 360; } 
    	return coords;
    } 
    while (coords[0] < -1) { coords[0] += 360; } 
    while (coords[0] > 361) { coords[0] -= 360; } 
    return coords;
  }
  return {
    text: function(params) {
      params = Object.assign({
        coords: [],
        offset: [5, -5],
        font: "10px sans-serif",
        color: "black",
        text: ""
      }, params);
      params.coords = projection(params.coords);
      var x = params.coords[0]+params.offset[0];
      var y = params.coords[1]+params.offset[1]

      context.font = params.font;
      context.fillStyle = params.color;
      context.fillText(params.text, x, y);
      reset_styles(context);
    },
    line: function(params) {
      params = Object.assign({
        coords: [],
        project: true, // project the coordinates 
        wrap: true,
        strokeStyle: "black",
        lineWidth: 1
      }, params);

      context.beginPath();
      if (!params.project)
        raw_curve(params.coords);
      else if (params.wrap)
        safe_curve(params.coords);
      else
        curve(params.coords);
      context.strokeStyle = params.strokeStyle;
      context.lineWidth = params.lineWidth;
      context.stroke();
      reset_styles(context);
    },
    circle: function(params){
      params = Object.assign({
        coords: [],
        radius: 1,
        wrap: true,
        raw: false, // just project the coords, not the bounding circle
        fill: false,
        stroke: true,
        fillStyle: "black",
        strokeStyle: "black",
        lineWidth: 1
      }, params);
      //var raw = params.coords //rd
      if (params.raw)
        params.coords = projection(params.coords);
      var data = [];
      for(var i=0;i<2*Math.PI+.1;i+=Math.PI/500) {
        var tmp = [params.coords[0] + params.radius * Math.cos(i),
                   params.coords[1] + params.radius * Math.sin(i)];
        if (params.wrap && !params.raw)
          tmp = wrap_coords(tmp);
        data.push(tmp);
      }

      if (params.fill) {
        context.beginPath();
        if (params.raw)
          raw_curve(data);
        else if (params.wrap)
          safe_curve(data);
        else
          curve(data);
        context.fillStyle = params.fillStyle;
        context.fill();
      }
      if (params.stroke) {
        context.beginPath();
        if (params.raw)
          raw_curve(data);
        else if (params.wrap)
          safe_curve(data);
        else
          curve(data);
        context.strokeStyle = params.strokeStyle;
        context.lineWidth = params.lineWidth;
        context.stroke();
      }
      reset_styles(context);
    }
  }
};

var types = {

//NEUTRINO TYPES
  shower: function(draw, coords, radius, color){
    var c = radius;
    draw.line({
      coords: [[coords[0]-c, coords[1]], [coords[0]+c, coords[1]]],
      lineWidth: 2,
      strokeStyle: 'white',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]-c], [coords[0], coords[1]+c]],
      lineWidth: 2,
      strokeStyle: 'white',
      project: false
    });
  },
  track: function(draw, coords, radius, color){
    var c = Math.sqrt(radius*radius*2)/2;
    draw.line({
      coords: [[coords[0]-c, coords[1]-c], [coords[0]+c, coords[1]+c]],
      lineWidth: 2,
      strokeStyle: 'white',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]+c], [coords[0]+c, coords[1]-c]],
      lineWidth: 2,
      strokeStyle: 'white',
      project: false
    });
  },
  
//SOURCE TYPES
/*
			agn   = other non-blazar active galaxy-orange/brown cross
            bcu   = active galaxy of uncertain type- dark grey linestar
            bin   = binary - nOT IN
            bll   = BL Lac type of blazar - blue down facing triangle
            css   = compact steep spectrum quasar- purple diamond
            fsrq  = FSRQ type of blazar-dark blue, up facing triangle
            gal   = normal galaxy (or part)- NOT IN
            glc   = globular cluster- two unfilled magenta circles
            hmb   = high-mass binary- NOT IN
            nlsy1 = narrow line Seyfert 1- NOT IN
            nov   = nova- NOT IN
            PSRI   = pulsar, identified by pulsations-maroon circle with a maroon filled circle inside
            psr   = pulsar, no pulsations seen in LAT yet-dark red circle, no fill
            pwn   = pulsar wind nebula-red circle with cross inside
            rdg   = radio galaxy-orange linestar
            sbg   = starburst galaxy-orangered linestar
            sey   = Seyfert galaxy NOT IN
            sfr   = star-forming region NOT IN
            snr   = supernova remnant-green square
            spp   = special case - potential association with SNR or PWN-orange circle w/linestar inside
            ssrq  = soft spectrum radio quasar -purple diamond w/line inside
            High frequency Blazar (HBL)-black triangle w/line in the middle
			Composite Supernova remnant (CompositeSNR)- green square w/circle inside
			Massive Star Cluster (MassiveStarCluster)-pink star
			Shell (Shell-pink line with two little lines crossing it
			Supernova remnant Molecular Cloud (SNRMolecCloud)-green square with line across
			unid- grey square
*/
//PULSAR-CIRCLE
  pwn: function(draw, coords, radius, color){//pulsar wind nebula-red circle with cross ND
   var c = radius*.66;
    draw.circle({
	   coords: [coords[0][0], coords[0][1]],
        radius: c,
        wrap: true,
        raw: true, 
        fill: false,
        lineWidth: 1,
        stroke: true,
        strokeStyle: (color != 'useDefault')? color : 'red'
	});
    draw.line({
      coords: [[coords[1][0], coords[1][1]-c], [coords[1][0], coords[1][1]+c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'red',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]+c, coords[1][1]], [coords[1][0]-c, coords[1][1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'red',
      project: false
    });
  },//pulsar wind nebula-red circle with cross ND
  psri: function(draw, coords, radius, color){//pulsar, identified by pulsations 
    var c = radius*.66;
   draw.circle({
	  coords: [coords[0][0], coords[0][1]],
	  radius: c,
	  raw: true,
	  fill: false,
	  strokeStyle: (color != 'useDefault')? color: 'maroon'
	});

	draw.circle({
	  coords: [parseFloat(coords[0][0])+c/8, parseFloat(coords[0][1])+c/8],
	  radius: c-3,
	  raw: true,
	  fill: false,
	  strokeStyle: (color != 'useDefault')? color: 'maroon'
	});
	draw.circle({
	  coords: [parseFloat(coords[0][0])-c/8, parseFloat(coords[0][1])-c/8],
	  radius: c-3,
	  raw: true,
	  fill: false,
	  strokeStyle: (color != 'useDefault')? color: 'maroon'
	});
  },//pulsar, identified by pulsations  
  psr: function(draw, coords, radius, color){//pulsar, no pulsations seen in LAT yet 
    var c = radius-3;
	draw.circle({
	  coords: [coords[0][0], coords[0][1]],
	  radius: radius,
	  fill: false,
	  stroke: true,
	  strokeStyle: (color != 'useDefault')? color: 'darkred',
	  raw: true
	});
  },//pulsar, no pulsations seen in LAT yet - ND
  
//pulsar/snr
 spp: function(draw, coords, radius, color){//pulsar wind nebula-red circle with cross ND
   var c = radius*.66;
    draw.circle({
	   coords: [coords[0][0], coords[0][1]],
        radius: c,
        wrap: true,
        raw: true, 
        fill: false,
        stroke: true,
        strokeStyle: (color != 'useDefault')? color : 'orange'
	});
    draw.line({
      coords: [[coords[1][0], coords[1][1]-c], [coords[1][0], coords[1][1]+c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]-c, coords[1][1]], [coords[1][0]+c, coords[1][1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]-c*.85, coords[1][1]-c*.85], [coords[1][0]+c*.85, coords[1][1]+c*.85]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]-c*.85, coords[1][1]+c*.85], [coords[1][0]+c*.85, coords[1][1]-c*.85]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
  },//spp circle with line star inside
  
//BLAZAR-TRIANGLE
  fsrq: function(draw, coords, radius, color){//FSRQ type of blazar 
   var c = radius*.66;
    draw.line({
      coords: [[coords[0], coords[1]-c*1.25], [coords[0]+c, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'navy',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]-c*1.25], [coords[0]-c, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'navy ',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c, coords[1]+c*.75], [coords[0]-c, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'navy',
      project: false
    });
  },//blazar-green up triangle
  hbl: function(draw, coords, radius, color){//high frequency blazar 
   var c = radius*.75;
   draw.line({
      coords: [[coords[0]-c*.75, coords[1]], [coords[0]+c*.75, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'black',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0]-c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'black',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0]+c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'black',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]-c*.75], [coords[0]+c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'black',
      project: false
    });
  },//high frequency blazar-black tri w/line in middle
  bll: function(draw, coords, radius, color){//blue triangle
   var c = radius*.75;
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0]-c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'blue',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0]+c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'blue',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]-c*.75], [coords[0]+c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'blue',
      project: false
    });
  },//blazar- blue triangle
 
  unid: function(draw, coords, radius, color){//unidentified-grey square
    var c = radius*1.25;
    draw.line({
      coords: [[coords[0]-c/2, coords[1]-c/2], [coords[0]+c/2, coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color == 'useDefault')? 'grey':color,//'grey',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]+c/2], [coords[0]+c/2, coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color == 'useDefault')? 'grey':color,
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]+c/2], [coords[0]-c/2, coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color == 'useDefault')? 'grey':color,
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/2, coords[1]-c/2], [coords[0]+c/2, coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color == 'useDefault')? 'grey':color,
      project: false
    });
  }, //grey square

//SNR- DIAMOND/SQUARE   GREEN
  compositesnr: function(draw, coords, radius, color){
    var c = radius*1.25;
    draw.circle({
	   coords: [coords[0][0], coords[0][1]],
        radius: c-2,
        wrap: true,
        raw: true, 
        fill: true,
        fillStyle: (color != 'useDefault')? color : 'green'
	});
      draw.line({
      coords: [[coords[1][0]-c/2, coords[1][1]-c/2], [coords[1][0]+c/2, coords[1][1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]-c/2, coords[1][1]+c/2], [coords[1][0]+c/2, coords[1][1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]-c/2, coords[1][1]+c/2], [coords[1][0]-c/2, coords[1][1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
    draw.line({
      coords: [[coords[1][0]+c/2, coords[1][1]-c/2], [coords[1][0]+c/2, coords[1][1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
  },//supernova remm- red square w/red circle inside nOT DISPLAYING
  snr: function(draw, coords, radius, color){//snr   = supernova remnant 23
    var c = radius*1.25;
    draw.line({
      coords: [[coords[0]-c/2, coords[1]-c/2], [coords[0]+c/2, coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]+c/2], [coords[0]+c/2, coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]+c/2], [coords[0]-c/2, coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/2, coords[1]-c/2], [coords[0]+c/2, coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'green',
      project: false
    });
  },//supernova remnant - red square 
  snrmoleccloud: function(draw, coords, radius, color){
    var c = radius*0.75;
    draw.line({
      coords: [[coords[0]-c*.70, coords[1]], [coords[0]+c*.70, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'limegreen',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]-c/2], [coords[0]+c/2, coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'limegreen',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]+c/2], [coords[0]+c/2, coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'limegreen',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]+c/2], [coords[0]-c/2, coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'limegreen',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/2, coords[1]-c/2], [coords[0]+c/2, coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'limegreen',
      project: false
    });
  },//supernova remm- red square w/red cross inside
  
  massivestarcluster: function(draw, coords, radius, color){
    var c = radius*0.75;
    draw.line({
      coords: [[coords[0], coords[1]-c*1.25], [coords[0]+c, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'pink',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]-c*1.25], [coords[0]-c, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'pink',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c, coords[1]+c*.75], [coords[0]-c, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'pink',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0]-c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'pink',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0]+c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'pink',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]-c*.75], [coords[0]+c, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'pink',
      project: false
    });
  },//large orange star
  glc: function(draw, coords, radius, color){
  var c = radius*.66
   draw.circle({
	   coords: [coords[0][0], coords[0][1]],
        radius: c,
        wrap: true,
        raw: true, 
        fill: false,
        stroke: true,
        lineWidth: 1,
        strokeStyle: (color != 'useDefault')? color : 'magenta'
	});
	draw.circle({
	   coords: [coords[0][0], coords[0][1]],
        radius: c-3,
        wrap: true,
        raw: true, 
        fill: false,
        stroke: true,
        lineWidth: 1,
        strokeStyle: (color != 'useDefault')? color : 'magenta'
	});
  },//glc clobular cluster two unfilled circles, one in the other
  shell: function(draw, coords, radius, color){
    var c = radius;
    draw.line({
      coords: [[coords[0]-c, coords[1]], [coords[0]+c, coords[1]]],
      lineWidth: 2,
      strokeStyle: 'DarkSalmon',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/3, coords[1]-c/3], [coords[0]-c/3, coords[1]+c/3]],
      lineWidth: 2,
      strokeStyle: 'DarkSalmon',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/3, coords[1]-c/3], [coords[0]-c/3, coords[1]+c/3]],
      lineWidth: 2,
      strokeStyle: 'DarkSalmon',
      project: false
    });
  },//nd
  
//GALAXY LINE STAR  ORANGE
  bcu: function(draw, coords, radius, color){ //active galaxy of uncertain type-dark grey cross
   var c = radius*.66;
    draw.line({
      coords: [[coords[0], coords[1]-c], [coords[0], coords[1]+c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'grey',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]], [coords[0]+c, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'grey',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c*.85, coords[1]-c*.85], [coords[0]+c*.85, coords[1]+c*.85]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'grey',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c*.85, coords[1]+c*.85], [coords[0]+c*.85, coords[1]-c*.85]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'grey',
      project: false
    });
    
  },//active galaxy of uncertain type-dark grey linestar
  rdg: function(draw, coords, radius, color){//radio galaxy
    var c = radius*.75;
    draw.line({
      coords: [[coords[0]-c*.75, coords[1]], [coords[0]+c*.75, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*.75], [coords[0], coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]-c], [coords[0]+c, coords[1]+c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]+c], [coords[0]+c, coords[1]-c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
  },//radio galaxy
  sbg: function(draw, coords, radius, color){//starburst galaxy, totally round star
    var c = radius*.75;
    draw.line({
      coords: [[coords[0]-c*1.25, coords[1]], [coords[0]+c*1.25, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orangered',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c*1.25], [coords[0], coords[1]-c*1.25]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orangered',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c*.55, coords[1]-c*.55], [coords[0]+c*.55, coords[1]+c*.55]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orangered',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c*.55, coords[1]+c*.55], [coords[0]+c*.55, coords[1]-c*.55]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orangered',
      project: false
    });
    /*draw.line({
      coords: [[coords[0]-c, coords[1]], [coords[0]+c, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[0], coords[1]+c], [coords[0], coords[1]-c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c*.75, coords[1]-c*.75], [coords[0]+c*.75, coords[1]+c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c*.75, coords[1]+c*.75], [coords[0]+c*.75, coords[1]-c*.75]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'orange',
      project: false
    });*/
  },//starburst galaxy
  agn: function(draw, coords, radius, color){
  c = radius
  	draw.line({
      coords: [[coords[0]-c, coords[1]-c], [coords[0]+c, coords[1]+c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'peru',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c, coords[1]+c], [coords[0]+c, coords[1]-c]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'peru',
      project: false
    });
  },//orange/brown cross
  
  //QUASAR-DIAMOND PURPLE
  css: function (draw, coords, radius, color){
  c = radius*1.25;
  draw.line({
      coords: [[coords[0], coords[1]-c/2], [coords[0]+c/2, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'purple',
      project: false
    }); // \
    draw.line({
      coords: [[coords[0]-c/2, coords[1]], [coords[0], coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'purple',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]], [coords[0], coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'purple',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/2, coords[1]], [coords[0], coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'purple',
      project: false
    });
  },// compact steep spectrun quasar purple diamond
  ssrq: function (draw, coords, radius, color){
  c = radius*1.25;
  draw.line({
      coords: [[coords[0], coords[1]-c/2], [coords[0]+c/2, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'DarkViolet',
      project: false
    }); // \
    draw.line({
      coords: [[coords[0]-c/2, coords[1]], [coords[0], coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'DarkViolet',
      project: false
    });
    draw.line({
      coords: [[coords[0]-c/2, coords[1]], [coords[0], coords[1]-c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'DarkViolet',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/2, coords[1]], [coords[0], coords[1]+c/2]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'DarkViolet',
      project: false
    });
    draw.line({
      coords: [[coords[0]+c/2, coords[1]], [coords[0]-c/2, coords[1]]],
      lineWidth: 1,
      strokeStyle: (color != 'useDefault')? color : 'DarkViolet',
      project: false
    });
  },//ssrq quasar purple diamond    

};

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
		console.log(canGo);
		console.log('x: '+ x+',  y: '+ y);
		var elements = dataContainer.selectAll("custom.point");
		elements.each(function(d) {
			var node = d3.select(this);
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
						hideshow(true);
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

if(selected_source[0] != null && neutrinos_drawn){ //performs likelihood analysis if a gamma-ray source is selected and neutrinos are being drawn

mydraw.circle({
						coords: [selected_source[0], selected_source[1]],
						radius: 7,
						wrap: true,
						raw: true, 
						fill: false,
						stroke: true,
						lineWidth: 2,
						strokeStyle: 'green'
					});

d3.selectAll("svg").remove(); //removes all svg elements that persist from earlier runs

	  var margin = {top: 50, right: 30, bottom: 50, left: 50}, //general dimensions for visualization graphs
	  	width = 250 - 50,
      	height = 250 - 40;
		
	  var x = d3.scaleLinear().range([0,width])     //scaling axes to the width/height of graphs given the bounds
	  var y = d3.scaleLinear().range([height,0])
	  
	var svg = d3.select("body").append("svg")                                   //proximity visualization element
    		.attr("width", width + 150 + margin.right)
    		.attr("height", height + margin.top + margin.bottom + 50)
  		.append("g")
   	 		.attr("transform", "translate(" + 150 + "," + margin.top + ")");
	$("svg").css({top:1100,left:125,position:'absolute'});
	
	var ts_ns_svg = d3.select("body").append("svg")                             //likelihood graph element
    		.attr("width", width + 450 + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
   	 		.attr("transform", "translate(" + 450 + "," + margin.top + ")");
	$("svg").css({top:1100,left:300,position:'absolute'});
	
	var ts_ns_svg2 = d3.select("body").append("svg")                            //analysis summary element
    		.attr("width", width + 900 + margin.right)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
   	 		.attr("transform", "translate(" + 750 + "," + margin.top + ")");
	$("svg").css({top:1100,left:750,position:'absolute'});
	
	var analysis_summary =                                                        //text for analysis summary
['These graphs visually represent the likelihood that the selected', 
 'gamma-ray source can be considered a source of neutrino events ',
 'in the selected dataset.                        ',
 '',
 'The proximity graph shows surrounding neutrino events within a',
 '20° x 20° square of the selected source.',
 'The angular error of the neutrino events is represented by a    ',
 '2D Gaussian gradient.',
 '',
 'The likelihood graph displays TS (test statistic), which is a quantification',
 'of the likelihood that ns neutrino events originated from the source,',
 'for ns values between 0 and 10. In calculating TS, spatial clustering of',
 'events, as well as their proximity to the source and the angular errors',
 'are taken into account. Generally, a TS ≥ 25 is considered significant.'
 ];
 
	ts_ns_svg2.append("text") //writes summary header text 
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(15,-5)")
	  	.text("Analysis Summary")	
		.attr('font-size','20')
		.attr('font-weight', 'bold')
		
	for(var n = 0; n < analysis_summary.length; n++){ //writes summary body text
	ts_ns_svg2.append("text")
	  	.attr("text-anchor", "start")
	  	.attr("transform", "translate(-65,".concat(String((n + 1) * 12)).concat(")"))
	  	.text(analysis_summary[n])	
		.attr('font-size','12')
		}
	
	ts_ns_svg2.append("svg:image")
.attr('x', 0)
.attr('y', 140)
.attr('width', 200)
.attr('height', 100)
.attr("xlink:href", "https://i.imgur.com/UKcHX3z.png")

	ts_ns_svg2.append("svg:image")
.attr('x', -5)
.attr('y', 177)
.attr('width', 200)
.attr('height', 100)
.attr("xlink:href", "https://i.imgur.com/7TUEasI.png")
	
	var svg_container_text = d3.select("body").append("svg") //Section header ('Source Analysis')
    		.attr("width", 40)
    		.attr("height", height + margin.top + margin.bottom)
  		.append("g")
   	 		.attr("transform", "translate(" + 25 + "," + margin.top + ")");
	$("svg").css({top:1100,left:0,position:'absolute'});
	
	
	
	var ras = {'min': selected_source[0] - 10, 'max': selected_source[0] + 10} //sets bounds for proximity graph, 20 degrees x 20 degrees
	var decs = {'min': selected_source[1] - 10, 'max': selected_source[1] + 10} //centered around the selected source
	
	x.domain([ras['min'], ras['max']]);
	y.domain([decs['min'], decs['max']]);
	
	
	
	
	// *****LIKELIHOOD ANALYSIS*****
	
	function sph_dot(th1, th2, phi1, phi2){
		
		return Math.sin(th1)*Math.sin(th2)*Math.cos(phi1-phi2) + Math.cos(th1)*Math.cos(th2);
		
	}	
	
	function event_angular_distribution(event){ //implementation of kent distribution
	
		var kappa = 1.0/(event.attr('err') * Math.PI/180)**2;
		
		var log_dist = Math.log(kappa) - Math.log(2*Math.PI) - kappa + kappa*sph_dot(Math.PI/2-parseFloat(event.attr('dec') * Math.PI/180), Math.PI/2 - (parseFloat(selected_source[1]) * Math.PI/180), parseFloat(event.attr('ra') * Math.PI/180), parseFloat(selected_source[0] * Math.PI/180));
		
		return Math.E ** log_dist;	
	
	}
	
	h_sum = 0.0;
	function H(ns){
	
		h_sum = 0.0;
		var N = 40
		
		var elements = dataContainer.selectAll("custom.point");
		
		elements.each(function(d) {
			
			if(d3.select(this).attr('type') == 'shower'){
			h_sum += Math.log((ns/N)*event_angular_distribution(d3.select(this))+(1-(ns/N))/(4*Math.PI))
			}
		})
		
		return 2 * h_sum;

	}
	
	function TS(ns){
	
		return H(ns) - H(0);
	
	}
	
	var x_arr = [];
	var y_arr = [];
	var ts_best = 0.0;
	var ns_best = 0.0;
	for(var ns = 0; ns < 10; ns += 0.01){
	
		var ts = TS(ns);
		
		x_arr.push(ns);
		y_arr.push(ts);
	
		if(ts > ts_best){
			ts_best = ts;
			ns_best = ns;
		}
		
	}
	
	var xdomain = d3.scaleLinear().range([0,width]).domain([0,10]);
	var ydomain = d3.scaleLinear().range([height,0]).domain([0,10]);
	
	for(var i = 0; i < y_arr.length; i++){
		
		if(y_arr[i] > 0){
			ts_ns_svg.append('circle')
						.attr('r', 1)
						.attr('cx', xdomain(x_arr[i]))
						.attr('cy', ydomain(y_arr[i]));
		}
	}
	
	ts_ns_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xdomain).ticks(10))
      
	   ts_ns_svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(xdomain).ticks(10))
      
	  ts_ns_svg.append("g")
      	.call(d3.axisLeft(ydomain));
	  
	  ts_ns_svg.append("g")
	  	.attr("transform","translate(200,0)")
      	.call(d3.axisRight(ydomain));
	  
	  ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(-25,100)rotate(-90)")
	  	.text("TS")
	  	
	  ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,240)")
	  	.text("ns")	
		
		ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,-35)")
	  	.text("Likelihood Graph")
		.attr('font-size', '15')
		.attr('font-weight', 'bold')
		
	 ts_ns_svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,-25)")
	  	.text(("Most Likely Answer: ts = ").concat(Math.round(ts_best * 100) / 100).concat(" ns = ").concat(Math.round(ns_best * 100) / 100))	
		.attr('font-size', '10')
	
	var elements = dataContainer.selectAll("custom.point");
		elements.each(function(d) {
			
			var node = d3.select(this);
			
			if(node.attr('kind') == 'neutrino' && node.attr('ra') > ras['min'] && node.attr('ra') < ras['max'] && node.attr('dec') > decs['min'] && node.attr('dec') < decs['max']){
				var cont = true;
				var ang_err = node.attr('err');
				console.log(ang_err);
				for(var c = 1; c < 50; c++){

					if(cont){
						
						var opacity = String(Math.E ** ((-1 * ((c/1) ** 2)) / (2 * ang_err ** 2)) / (2 * Math.PI * (ang_err ** 2)))
						console.log(opacity);
						
						if(opacity > 0.00001){
					
							svg.append('circle')
								.attr('r', function(d) { if(node.attr('type') == 'shower'){ return c * 10; }else{return 0;}	})
								.attr('cx', x(node.attr('ra')))
								.attr('cy', y(node.attr('dec')))
								.attr('stroke', 'black')                                   
								.style('fill', 'none')
								.attr('opacity', String(opacity * 200))
								.attr('stroke-width', 10.05);
						
					}else{
						cont = false;
					}
					}
				}
			
				svg.append('circle')
					.attr('r', 5)
					.attr('cx', x(node.attr('ra')))
					.attr('cy', y(node.attr('dec')));
			
			}
			})
	
	svg.append('circle')
					.attr('r', 2)
					.attr('cx', x(selected_source[0]))
					.attr('cy', y(selected_source[1]))
					.attr('fill', 'red');
					
	  svg.append("rect")
		.attr('x', -200)
		.attr('y', 0)
		.attr('width', 200)
		.attr('height', 500)
		.attr('fill', 'white');
	  
	  svg.append("rect")
		.attr('x', 0)
		.attr('y', 210)
		.attr('width', 500)
		.attr('height', 100)
		.attr('fill', 'white');
		
	  svg.append("rect")
		.attr('x', 200)
		.attr('y', 0)
		.attr('width', 100)
		.attr('height', 500)
		.attr('fill', 'white');
		
      svg.append("rect")
		.attr('x', -200)
		.attr('y', -50)
		.attr('width', 500)
		.attr('height', 50)
		.attr('fill', 'white');
	  
	 svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10))
      
	   svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(x).ticks(10))
      
	  svg.append("g")
      	.call(d3.axisLeft(y));
	  
	  svg.append("g")
	  	.attr("transform","translate(200,0)")
      	.call(d3.axisRight(y));
	  
	  svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(-25,100)rotate(-90)")
	  	.text("Declination (deg)")
		
	  svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,240)")
	  	.text("Right Ascension (deg)")	
	
	svg.append("text")
	  	.attr("text-anchor", "middle")
	  	.attr("transform", "translate(100,-35)")
	  	.text("Proximity Visualization")
		.attr('font-size', '15')
		.attr('font-weight', 'bold')
		
	 svg_container_text.append("rect")
		.attr('x', -100)
		.attr('y', -100)
		.attr('width', 300)
		.attr('height', 500)
		.attr('fill', 'white');	
		
	 svg_container_text.append("rect")
		.attr('x', -100)
		.attr('y', -100)
		.attr('width', 350)
		.attr('height', 350)
		.attr('fill', 'rgb(135,206,250)');

	svg_container_text.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(5,100)rotate(-90)')
		.text('Source Analysis')
		.attr('font-size','30')
		
	for(var h = 0; h < 50; h++){
	
		svg.append("rect")
			.attr('x', h * (200 / 50))
			.attr('y', 250)
			.attr('width', (200 / 50))
			.attr('height', 20)
			.attr('fill', 'black')
			.attr('opacity', 1 - (h / 50));
	}	
		
	svg.append("rect")
					.attr('x', 0)
					.attr('y', 250)
					.attr('width', 200)
					.attr('height', 20)
					.attr('fill', 'none')
					.attr('stroke', 'black')
					.attr('stroke-width', 2);
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(-10,260)')
		.text('f(r)')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(0,280)')
		.text('≥5e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(50,280)')
		.text('3.75e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(100,280)')
		.text('2.5e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(150,280)')
		.text('1.25e-3')
		.attr('font-size','10');
	svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(200,280)')
		.text('0')
		.attr('font-size','10');	
	svg.append("svg:image")
.attr('x', 42)
.attr('y', 270)
.attr('width', 50)
.attr('height', 50)
.attr("xlink:href", "https://i.imgur.com/O7y5cpw.png")

svg.append('text')
		.attr('text-anchor', 'middle')
		.attr('transform', 'translate(137,300)')
		.text('σ = angular error')
		.attr('font-size','10');

}

console.log('drawPoints done');
}//end of drawPoints
});//end of astrojs
}//end of skymap function
//}