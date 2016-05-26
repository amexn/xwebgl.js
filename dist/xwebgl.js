var xwebgl = {
    REVISION: '1'
};

xwebgl.Vec2 = function (x, y) {

    this.x = x || 0;
    this.y = y || 0;

};
xwebgl.Vec3 = function (x, y, z) {

    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;

};
xwebgl.Geometry = function () {
    this.vertices = [];
};
xwebgl.Scene = function () {

};
xwebgl.Mesh = function (vertices, colors, canvas, numvertices, program) {
    this.program = null;
    var _gl;
    _gl = canvas.getContext('experimental-webgl');
    var vertexBuffer = null;
    var colorBuffer = null
    var vertexAttrLoc = gl.getAttribLocation(program, "vPosition");
    var colorAttrLoc = gl.getAttribLocation(program, "vertexColor");

    function Init() {

        vertexBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, vertexBuffer);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        colorBuffer = _gl.createBuffer();
        _gl.bindBuffer(_gl.ARRAY_BUFFER, colorBuffer);
        _gl.bufferData(_gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        colorBuffer.itemSize = 4;
        colorBuffer.numItems = 3;
        _gl.useProgram(program);

    }
    Init();

    this.render = function () {
        _gl.bindBuffer(_gl.ARRAY_BUFFER, vertexBuffer);

        _gl.vertexAttribPointer(vertexAttrLoc, 3, _gl.FLOAT, false, 0, 0);
        _gl.enableVertexAttribArray(vertexAttrLoc);

        _gl.bindBuffer(_gl.ARRAY_BUFFER, colorBuffer);
        _gl.vertexAttribPointer(colorAttrLoc, 4, gl.FLOAT, false, 0, 0);
        _gl.enableVertexAttribArray(colorAttrLoc);

        _gl.useProgram(program);
        _gl.drawArrays(_gl.TRIANGLES, 0, numvertices);
    }
};
xwebgl.Color = function (r, g, b) {

    if (g === undefined && b === undefined) {

        // r is xwebgl.Color, hex or string
        return this.set(r);

    }

    return this.setRGB(r, g, b);

};
xwebgl.GLRenderer = function (canvas) {
    //window.alert("error");
    var _gl;
    _gl = canvas.getContext('experimental-webgl');

    if (_gl === null) {
        window.alert("_gl null");
    }
    //var _this = this,

    this.setClearColor = function (color, alpha) {
        glClearColor(color.r, color.g, color.b, alpha);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
    };
    this.render = function (scene) {
        _gl.viewport(0, 0, canvas.width, canvas.height);
        _gl.clear(_gl.COLOR_BUFFER_BIT | _gl.DEPTH_BUFFER_BIT);
        renderObjects(scene);
    };

    function glClearColor(r, g, b, a) {
        _gl.clearColor(r, g, b, a);
    }

    function renderObjects(scene) {

        for (var i = 0, l = scene.length; i < l; i++) {
            //window.alert("inside");
            var renderItem = scene[i];
            renderItem.render();
        }

    }
};
xwebgl.GLState = function () {
    var _this = this;
    this.enableAttribute = function (attribute) {
        gl.enableVertexAttribArray(attribute);
    };

};
xwebgl.GLProgram = (function () {

    return function (gl, vertshader, fragshader) {
        var program = gl.createProgram();

        gl.attachShader(program, vertshader);
        gl.attachShader(program, fragshader);
        gl.linkProgram(program);
        return program;
    };
})();
xwebgl.GLShader = (function () {

    return function GLShader(gl, type, string) {

        var shader = gl.createShader(type);

        gl.shaderSource(shader, string);
        gl.compileShader(shader);
        //window.alert("in");
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {

            window.alert('THREE.WebGLShader: Shader couldn\'t compile.');

        }

        if (gl.getShaderInfoLog(shader) !== '') {

            window.alert('THREE.WebGLShader: gl.getShaderInfoLog()', type === gl.VERTEX_SHADER ? 'vertex' : 'fragment', gl.getShaderInfoLog(shader), addLineNumbers(string));

        }

        // --enable-privileged-webgl-extension
        // console.log( type, gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( shader ) );

        return shader;

    };
})();

xwebgl.Color.prototype = {
    constructor: xwebgl.Color,

    r: 1,
    g: 1,
    b: 1,
    set: function (value) {

        if (value instanceof THREE.Color) {

            this.copy(value);

        } else if (typeof value === 'number') {

            this.setHex(value);

        } else if (typeof value === 'string') {

            this.setStyle(value);

        }

        return this;

    },

    setHex: function (hex) {

        hex = Math.floor(hex);

        this.r = (hex >> 16 & 255) / 255;
        this.g = (hex >> 8 & 255) / 255;
        this.b = (hex & 255) / 255;

        return this;

    },

    setRGB: function (r, g, b) {

        this.r = r;
        this.g = g;
        this.b = b;

        return this;

    },

    clone: function () {

        return new this.constructor(this.r, this.g, this.b);

    },

    copy: function (color) {

        this.r = color.r;
        this.g = color.g;
        this.b = color.b;

        return this;

    }
};
