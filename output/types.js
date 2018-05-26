/**
*Defines how to draw different types of data
*@function types
*<p> Neutrino types include showers, which have error regions drawn as circles, and tracks, which do not.
*<p> Source types:
*<p>			agn   = other non-blazar active galaxy-orange/brown cross
*<p>            bcu   = active galaxy of uncertain type- dark grey linestar
*<p>            bin   = binary - nOT IN
*<p>            bll   = BL Lac type of blazar - blue down facing triangle
*<p>            css   = compact steep spectrum quasar- purple diamond
*<p>            fsrq  = FSRQ type of blazar-dark blue, up facing triangle
*<p>            gal   = normal galaxy (or part)- NOT IN
*<p>            glc   = globular cluster- two unfilled magenta circles
*<p>            hmb   = high-mass binary- NOT IN
*<p>            nlsy1 = narrow line Seyfert 1- NOT IN
*<p>            nov   = nova- NOT IN
*<p>            PSRI   = pulsar, identified by pulsations-maroon circle with a maroon filled circle inside
*<p>            psr   = pulsar, no pulsations seen in LAT yet-dark red circle, no fill
*<p>            pwn   = pulsar wind nebula-red circle with cross inside
*<p>            rdg   = radio galaxy-orange linestar
*<p>            sbg   = starburst galaxy-orangered linestar
*<p>            sey   = Seyfert galaxy NOT IN
*<p>            sfr   = star-forming region NOT IN
*<p>            snr   = supernova remnant-green square
*<p>            spp   = special case - potential association with SNR or PWN-orange circle w/linestar inside
*<p>            ssrq  = soft spectrum radio quasar -purple diamond w/line inside
*<p>            High frequency Blazar (HBL)-black triangle w/line in the middle
*<p>			Composite Supernova remnant (CompositeSNR)- green square w/circle inside
*<p>			Massive Star Cluster (MassiveStarCluster)-pink star
*<p>			Shell (Shell-pink line with two little lines crossing it
*<p>			Supernova remnant Molecular Cloud (SNRMolecCloud)-green square with line across
*<p>			unid- grey square
*@memberof Output.skymap
*/
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
    draw.line({
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
    });
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
    }); 
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
    }); 
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
