this.isMaterial = true;

    Object.defineProperty( this, 'id', { value: _materialId ++ } );

    this.uuid = generateUUID();

    this.name = '';
    this.type = 'Material';

    this.blending = NormalBlending;
    this.side = FrontSide;
    this.vertexColors = false;
  //透明度
    this.opacity = 1;
    //是否开启透明
    this.transparent = false;
    this.alphaHash = false;

    this.blendSrc = SrcAlphaFactor;
    this.blendDst = OneMinusSrcAlphaFactor;
    this.blendEquation = AddEquation;
    this.blendSrcAlpha = null;
    this.blendDstAlpha = null;
    this.blendEquationAlpha = null;
    this.blendColor = new Color( 0, 0, 0 );
    this.blendAlpha = 0;

    this.depthFunc = LessEqualDepth;
    this.depthTest = true;
    this.depthWrite = true;

    this.stencilWriteMask = 0xff;
    this.stencilFunc = AlwaysStencilFunc;
    this.stencilRef = 0;
    this.stencilFuncMask = 0xff;
    this.stencilFail = KeepStencilOp;
    this.stencilZFail = KeepStencilOp;
    this.stencilZPass = KeepStencilOp;
    this.stencilWrite = false;

    this.clippingPlanes = null;
    this.clipIntersection = false;
    this.clipShadows = false;

    this.shadowSide = null;

    this.colorWrite = true;

    this.precision = null; // override the renderer's default precision for this material

    this.polygonOffset = false;
    this.polygonOffsetFactor = 0;
    this.polygonOffsetUnits = 0;

    this.dithering = false;

    this.alphaToCoverage = false;
    this.premultipliedAlpha = false;
    this.forceSinglePass = false;

    this.visible = true;

    this.toneMapped = true;

    this.userData = {};

    this.version = 0;

    this._alphaTest = 0;