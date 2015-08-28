


v_radius = 10;
v_color = 'red'
e_width = 5
e_color = 'black'

mode = 'v'
curr_vert = null;

evt = null;

main = function() {
    var canvas = new fabric.Canvas("surface",{backgroundColor:'white'});
//    canvas.add(Edge({x1:44,y1:44,x2:88,y2:88,fill:'red',stroke:'red'}))
    canvas.on('mouse:down',function(o){mousedown(o,canvas)});
}


var mousedown = function(options,canvas) {
    evt = options
    switch(mode) {
    case 'v':
	if(!options.target) {
	    var vert = new Vertex({x:options.e.pageX,
				   y:options.e.pageY});
	    canvas.add(vert);
	    canvas.bringToFront(vert);
	    console.log(vert)
	    console.log(options.e.pageY-v_radius)
	}
	break;
    case 'e':
	if(options.target && options.target.type=='Vertex') {
	    if(curr_vert==null) {
		curr_vert = options.target;
	    }
	    else {
		vertices = [options.target, curr_vert]
		var edge = new Edge({x1:curr_vert.left,
				     y1:curr_vert.top,
				     x2:options.target.left,
				     y2:options.target.top,
				     vertices:vertices});
		canvas.add(new fabric.Rect({
		    left:Math.min(curr_vert.left,options.target.left),
		    top:Math.min(curr_vert.top,options.target.top),
		    width:Math.abs(curr_vert.left-options.target.left),
		    height:Math.abs(curr_vert.top-options.target.top),
		    fill:'green'
		}));
		curr_vert = null;
		canvas.add(edge);
		canvas.sendToBack(edge);
		console.log(edge);
		console.log(options.target.left)
	    }
	}
	break;
    default:
	break;
    
    };
    canvas.renderAll();
};



var Vertex = fabric.util.createClass(fabric.Circle, {
    type: 'Vertex',
    initialize: function(options) {
	options || (options = { });
	this.callSuper('initialize',{radius:v_radius,fill:v_color,
				     originX:'center',originY:'center'});
	this.set({'top':(options.y || 0)-v_radius});
    	this.set({'left':(options.x || 0)-v_radius});
	this.set({'label':options.label||''});
	this.set({'edges':options.edges||[]});
	this.set({'hasControls':false});
	this.set({'hasBorders':false});
    },
    toObject: function() {
	return fabric.util.object.extend(this.callSuper('toObject'), {
	    label: this.get('label'), edges: this.get('edges')
	});
    },
    _render: function(ctx) {
	this.callSuper('_render',ctx);
    }
});

var Edge = fabric.util.createClass(fabric.Line, {
    type: 'Edge',
    initialize: function(options) {
	options || (options = { });
	this.callSuper('initialize',
		       {stroke:e_color,strokeWidth:e_width,
			selectable:false});
	// this.set({'vertices':options.vertices||[]});
	// this.set({'x1':options.x1||0});
	// this.set({'x2':options.x2||0});
	// this.set({'y1':options.y1||0});
	// this.set({'y2':options.y2||0});
    },
    toObject: function() {
	return fabric.util.object.extend(this.callSuper('toObject'), {
	    vertices: this.get('vertices')
	});
    },
    _render: function(ctx) {
	this.callSuper('_render',ctx);
    }
    
});


    
window.onload = main;
