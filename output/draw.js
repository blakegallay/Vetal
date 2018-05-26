/**
*Defines drawing function and draws the skymap background
*@function draw
*@param {CanvasRenderingContext2D} context the canvas drawing context. in Vetal's case, the used instance of draw will always be a two-dimensional rendering context.
*@param {d3.geoMollweide} projection the instructions for how to draw the points for either galactic or equatorial coordinate systems.
*<p> Each time the map is redrawn, a new instance of this function is created, called mydraw. the context remains the same, but the projection changes based on coordinate system and level of zoom
*@memberof Output.skymap
*/
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

var reset_styles = function(context) {
  context.lineWidth = 1;
  context.strokeStyle = 'black';
  context.setLineDash([]);
  context.fillStyle = 'black';
  context.font = '10px sans-serif';
}