
var gl;
var canvas;
var sprogram;
var mvMatrix = mat4.create();
var pMatrix = mat4.create();
    
function initShaders() {
    sprogram = gl.createProgram();
    $.ajax({url:'shaders/default.frag',dataType:'text'}).done(
        function(src) {
            var frags = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(frags, src);
            gl.compileShader(frags);
            if (!gl.getShaderParameter(frags, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(frags));
                return;
            }
            
            gl.attachShader(sprogram, frags);
        }
    );
    
    
    $.ajax({url:'shaders/default.vert',
        dataType:'text',
        success:function(src) {
            var verts = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(verts, src);
            gl.compileShader(verts);
            if (!gl.getShaderParameter(verts, gl.COMPILE_STATUS)) {
                alert(gl.getShaderInfoLog(verts));
                return;
            }
            gl.attachShader(sprogram, verts);
        }
    });

    gl.linkProgram(sprogram);
    if (!gl.getProgramParameter(sprogram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
        return false;
    }
    gl.useProgram(sprogram);
    sprogram.vertexPositionAttribute = gl.getAttribLocation(sprogram, "aVertexPosition");
    sprogram.vertexColorAttribute = gl.getAttribLocation(sprogram, "aVertexColor");
    gl.enableVertexAttribArray(sprogram.vertexPositionAttribute);
    gl.enableVertexAttribArray(sprogram.vertexColorAttribute);
    sprogram.pMatrixUniform = gl.getUniformLocation(sprogram, "uPMatrix");
    sprogram.mvMatrixUniform = gl.getUniformLocation(sprogram, "uMVMatrix");
    
}

function initBuffers() {
    
    
}
function initGL() {
    $('#body-main').append('<canvas id="canvas-main" style="border: none;" width="1024" height="600"></canvas>');
    canvas = $('#canvas-main')[0];
    
    gl = canvas.getContext('webgl') || canvas.getContext("experimental-webgl");
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
      
    if (!gl) {
        alert("Unable to initialize WebGL. Your browser may not support it.");
        return false;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    initShaders();
    return true;
}


function renderScene() {
    var triangleVertexPositionBuffer = gl.createBuffer();
    var triangleVertexColorBuffer = gl.createBuffer();
    var t = (new Date).getTime()/1000.0;
    var vertices = [
         0.0, 1.0, 0.0,
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0
    ];
    
    var colors = [
         1.0, 0.0, 0.0,
         0.0, 1.0, 0.0,
         0.0, 0.0, 1.0
    ];
        
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
    
    triangleVertexColorBuffer.itemSize = 3;
    triangleVertexColorBuffer.numItems = 3;
    
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);
    mat4.identity(mvMatrix);
    mat4.translate(mvMatrix, [0.0, 0.0, -5.0]);
    mat4.rotate(mvMatrix, t,[0.0,1.0,0.0],0.0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexColorBuffer);
    gl.vertexAttribPointer(sprogram.vertexColorAttribute, triangleVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(sprogram.vertexPositionAttribute, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    
    
    gl.uniformMatrix4fv(sprogram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(sprogram.mvMatrixUniform, false, mvMatrix);
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
    
    
}


$(window).load(function() {
    $.ajaxSetup({
        async:false,
        error: function(jqXHR, exception) {
            if (jqXHR.status === 0) {
                alert('Not connect.\n Verify Network.');
            } else if (jqXHR.status == 404) {
                alert('Requested page not found. [404]');
            } else if (jqXHR.status == 500) {
                alert('Internal Server Error [500].');
            } else if (exception === 'parsererror') {
                alert('parsererror.');
            } else if (exception === 'timeout') {
                alert('Time out error.');
            } else if (exception === 'abort') {
                alert('Ajax request aborted.');
            } else {
                alert('Uncaught Error.\n' + jqXHR.responseText);
            }
        }
    });
    
    
    initGL();
    
    var mainloop = setInterval(renderScene,16);
    
});