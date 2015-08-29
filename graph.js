


v_radius = 10;
v_color = 'red'
e_width = 5
e_color = 'black'

v_counter = 0;
e_counter = 0;


mode = 'v'
curr_vert = null;
curr_ed = null;

evt = null;

main = function() {
    var canvas = new fabric.Canvas("surface",{backgroundColor:'white'});

    canvas.on('mouse:down',function(o){mousedown(o,canvas)});
    canvas.on('object:moving',function(o){movement(o,canvas)});
}


var movement = function(options,canvas) {
    vert = options.target;
    edges = [];
    canvas.forEachObject(function (o) {
	if(o.type == 'Edge' && o.vertices.indexOf(vert)!=-1) {
	    if(o.vertices.indexOf(vert)==0) {
		o.set({'x1':vert.left,'y1':vert.top});
	    }
	    else {
		o.set({'x2':vert.left,'y2':vert.top});
	    }
	}
    });
    canvas.renderAll();
};

var mousedown = function(options,canvas) {
    evt = options
    switch(mode) {
    case 'v':
	if(!options.target) {
	    var vert = new Vertex({x:options.e.pageX,
				   y:options.e.pageY});
	    canvas.add(vert);
	    canvas.bringToFront(vert);
	}
	break;
    case 'e':
	if(options.target && options.target.type=='Vertex') {
	    if(curr_vert==null) {
		curr_vert = options.target;
		curr_vert.set({'fill':'orange'});
	    }
	    else {
		curr_vert.set({'fill':'red'});
		vertices = [curr_vert,options.target];
		var edge = new Edge({x1:curr_vert.left,
				     y1:curr_vert.top,
				     x2:options.target.left,
				     y2:options.target.top,
				     vertices:vertices});
		curr_vert = null;
		canvas.add(edge);
		canvas.sendToBack(edge);
	    }
	}
	break;
    case 's':
	if(options.target && options.target.type == 'Vertex') {
	    curr_ed = options.target;
	    document.getElementById("label").value = curr_ed.label;
	    document.getElementById("editor").style.display = "block";
	    
	}
	break;
    case 'd':
	if(options.target) {
	    if(options.target.type=='Vertex') {
		edges = getEdges(options.target,canvas);
		edges.map(function(e){canvas.remove(e);});
	    }
	    canvas.remove(options.target);
	}
	break;
    default:
	break;
    
    };
    canvas.renderAll();
};

var submit = function() {
    var label = document.getElementById('label').value;
    labelVertex(curr_ed,label);
}

var labelVertex = function(vert,label) {
    vert.set({'label':label});
}

var getEdges = function(vert,canvas) {
    edges = [];
    canvas.forEachObject(function(o) {
	if(o.type == 'Edge' && o.vertices != []) {
	    if(o.vertices[0]==vert) {
		edges.push(o);
	    }
	    else if(o.vertices[1]==vert) {
		edges.push(o);
	    }
	}
    });
    return edges;//here too
}

var getNeighbors = function(vert,canvas) {
    neighbors = [];
    canvas.forEachObject(function(o) {
	// here
	if(o.type == 'Edge' && o.vertices!=[]) {
	    if(o.vertices[0]==vert) {
		neighbors.push(o.vertices[1]);
	    }
	    else if(o.vertices[1]==vert) {
		neighbors.push(o.vertices[0]);
	    }
	}
    });
    return neighbors;
}

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
    },
    add_edge: function(edge) {
	this.set({'edges':this.edges.push(edge)});
    }
});

var Edge = fabric.util.createClass(fabric.Line, {
    type: 'Edge',
    initialize: function(options) {
	options || (options = { });
	y1 = options.y1||0;
	x1 = options.x1||0;
	y2 = options.y2||0;
	x2 = options.x2||0;
	arr = [x1,y1,x2,y2];
	this.callSuper('initialize',arr,
		       {stroke:e_color,strokeWidth:e_width,
			selectable:false,
			originX:'center',
			originY:'center'});
	this.vertices = options.vertices||[];
	this.id = e_counter++;
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
