
var main = function () {
    var CANVAS = document.getElementById("maincanvas");
    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    /*========================= GET WEBGL CONTEXT ========================= */
    var GL;
    try {
        GL = CANVAS.getContext("experimental-webgl", { antialias: true });
    } catch (e) {
        alert("You are not webgl compatible :(");
        return false;
    }

    /*========================= SHADERS ========================= */
    /*jshint multistr: true */

    var shader_vertex_source = "\n\
attribute vec3 position;\n\
uniform mat4 Pmatrix;\n\
uniform mat4 Vmatrix;\n\
uniform mat4 Mmatrix;\n\
attribute vec3 color; //the color of the point\n\
varying vec3 vColor;\n\
void main(void) { //pre-built function\n\
gl_Position = Pmatrix*Vmatrix*Mmatrix*vec4(position, 1.);\n\
vColor=color;\n\
}";

    var shader_fragment_source = "\n\
precision mediump float;\n\
varying vec3 vColor;\n\
void main(void) {\n\
gl_FragColor = vec4(vColor, 1.);\n\
}";

    var get_shader = function (source, type, typeString) {
        var shader = GL.createShader(type);
        GL.shaderSource(shader, source);
        GL.compileShader(shader);
        if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
            alert("ERROR IN " + typeString + " SHADER : " + GL.getShaderInfoLog(shader));
            return false;
        }
        return shader;
    };

    var shader_vertex = get_shader(shader_vertex_source, GL.VERTEX_SHADER, "VERTEX");
    var shader_fragment = get_shader(shader_fragment_source, GL.FRAGMENT_SHADER, "FRAGMENT");

    var SHADER_PROGRAM = GL.createProgram();
    GL.attachShader(SHADER_PROGRAM, shader_vertex);
    GL.attachShader(SHADER_PROGRAM, shader_fragment);

    GL.linkProgram(SHADER_PROGRAM);

    var _Pmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Pmatrix");
    var _Vmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Vmatrix");
    var _Mmatrix = GL.getUniformLocation(SHADER_PROGRAM, "Mmatrix");

    var _color = GL.getAttribLocation(SHADER_PROGRAM, "color");
    var _position = GL.getAttribLocation(SHADER_PROGRAM, "position");

    GL.enableVertexAttribArray(_color);
    GL.enableVertexAttribArray(_position);

    GL.useProgram(SHADER_PROGRAM);

    /*========================= THE CUBE ========================= */
    //POINTS :
    var cube_vertex = [
        //left first three Z , X, Y second 3 color
        -2, -1, -1, 0.01, 1, 0.01,
        1, -1, -1, 0.02, 0.99, 0.2,
        1, 1, -1, 0.03, 0.98, 0.3,
        -1, 1, -1, 0.04, 0.97, 0.4,
        //right,,,,,,
        -2, -1, 1, 0.1, 0.91, 1,
        1, -1, 1, 0.11, 0.9, 0.01,
        1, 1, 1, 0.12, 0.89, 0.2,
        -1, 1, 1, 0.13, 0.88, 0.3,
        //top,,,0.14,0.87,0.4,
        -2, -1, -1, 0, 0.25, 0.25,
        -1, 1, -1, 0, 0.25, 0.25,
        -1, 1, 1, 0, 0.25, 0.25,
        -2, -1, 1, 0, 0.25, 0.25,
        //bottom,,,,,,
        1, -1, -1, 1, 0, 0,
        1, 1, -1, 1, 0, 0,
        1, 1, 1, 1, 0, 0,
        1, -1, 1, 1, 0, 0,
        //front,,,,,,
        -2, -1, -1, 0.7, 0.31, 1,
        -2, -1, 1, 0.71, 0.3, 0.01,
        1, -1, 1, 0.72, 0.29, 0.2,
        1, -1, -1, 0.73, 0.28, 0.3,
        //back,,,,,,
        -1, 1, -1, 0.97, 0.04, 0.7,
        -1, 1, 1, 0.98, 0.03, 0.8,
        1, 1, 1, 0.99, 0.02, 0.9,
        1, 1, -1, 1, 0.01, 1,


    ];

    var CUBE_VERTEX = GL.createBuffer();
    GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
    GL.bufferData(GL.ARRAY_BUFFER,
        new Float32Array(cube_vertex),
        GL.STATIC_DRAW);

    //FACES :
    var cube_faces = [
        0, 1, 2,
        0, 2, 3,

        4, 5, 6,
        4, 6, 7,

        8, 9, 10,
        8, 10, 11,

        12, 13, 14,
        12, 14, 15,

        16, 17, 18,
        16, 18, 19,

        20, 21, 22,
        20, 22, 23

    ];
    var CUBE_FACES = GL.createBuffer();
    GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
    GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(cube_faces), GL.STATIC_DRAW);

    /*========================= MATRIX ========================= */

    var PROJMATRIX = LIBS.get_projection(50, CANVAS.width / CANVAS.height, 1, 100);
    var MOVEMATRIX = LIBS.get_I4();
    var VIEWMATRIX = LIBS.get_I4();

    LIBS.translateZ(VIEWMATRIX, -6);

    /*========================= DRAWING ========================= */
    GL.enable(GL.DEPTH_TEST);
    GL.depthFunc(GL.LEQUAL);
    GL.clearColor(0.0, 0.0, 0.0, 0.0);
    GL.clearDepth(1.0);

    var time_old = 0;
    const Near = 40;
    const Far = 150;
    var InOut = 40;
    var Change = 1;
    var animate = function (time) {

        var dt = time - time_old;
        LIBS.rotateZ(MOVEMATRIX, dt * 0.0002);
        LIBS.rotateY(MOVEMATRIX, dt * 0.0003);
        LIBS.rotateX(MOVEMATRIX, dt * 0.0004);
        PROJMATRIX = LIBS.get_projection(InOut, CANVAS.width / CANVAS.height, 1, 100);
        InOut = InOut + (0.055 * Change);
        if (InOut < Near || InOut > Far) {
            Change = Change * (-1);
        }


        time_old = time;

        GL.viewport(0.0, 0.0, CANVAS.width, CANVAS.height);
        GL.clear(GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT);
        GL.uniformMatrix4fv(_Pmatrix, false, PROJMATRIX);
        GL.uniformMatrix4fv(_Vmatrix, false, VIEWMATRIX);
        GL.uniformMatrix4fv(_Mmatrix, false, MOVEMATRIX);
        GL.bindBuffer(GL.ARRAY_BUFFER, CUBE_VERTEX);
        GL.vertexAttribPointer(_position, 3, GL.FLOAT, false, 4 * (3 + 3), 0);
        GL.vertexAttribPointer(_color, 3, GL.FLOAT, false, 4 * (3 + 3), 3 * 4);
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, CUBE_FACES);
        GL.drawElements(GL.TRIANGLES, 6 * 2 * 3, GL.UNSIGNED_SHORT, 0);

        GL.flush();

        window.requestAnimationFrame(animate);
    };
    animate(0);
};