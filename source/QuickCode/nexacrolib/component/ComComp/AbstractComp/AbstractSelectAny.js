//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html	
//
//==============================================================================

if(!nexacro.AbstractSelectAny)
{
    //==============================================================================
    // nexacro.AbstractSelectAny
    //==============================================================================

    nexacro.AbstractSelectAny = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.AbstractComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

		this._property_map = [];

		this.selectmulticombo = null;
		this.selectcheckboxset = null;
		this.selectlistbox = null;

		this.readonly = false;
		// TODO : controltype 별 property map depth 분리 (auto, multicombo, listbox, checkboxset)
		// this._property_map_auto = [];
    };
	
	var _pAbstractSelectAny = nexacro._createPrototype(nexacro.AbstractComponent, nexacro.AbstractSelectAny);
	nexacro.AbstractSelectAny.prototype = _pAbstractSelectAny;
	_pAbstractSelectAny._type_name = "AbstractSelectAny";
	
    /* control */

	/* default properties */
	// TODO : property init
	_pAbstractSelectAny.value = undefined;
	_pAbstractSelectAny.index = -1;
	_pAbstractSelectAny.text = "";
	
	_pAbstractSelectAny.controltype = "auto";
	_pAbstractSelectAny.innerdataset = "";
	_pAbstractSelectAny.codecolumn = "";
	_pAbstractSelectAny.datacolumn = "";
	
	_pAbstractSelectAny.selectmulticombo = null;
	_pAbstractSelectAny.selectcheckboxset = null;
	_pAbstractSelectAny.selectlistbox = null;
    

    /* internal variable */
	_pAbstractSelectAny._ctrltype = 0;
	_pAbstractSelectAny._ctrlobjtype = 0;
    _pAbstractSelectAny._ctrlobj = null;
    
	_pAbstractSelectAny._real_visible = false;

	nexacro._AbstractSelectAny_ControlConst =
	{
		CTRLTYPE_AUTO 	: 0,
		CTRLTYPE_MULTICOMBO: 1,
		CTRLTYPE_CHECKBOXSET: 2,
		CTRLTYPE_LISTBOX	: 3,
		CTRLTYPE_HLIMIT1 : 150,
		CTRLTYPE_HLIMIT2 : 300,
		CTRLTYPE_VLIMIT1: 60,
		CTRLTYPE_VLIMIT2: 150,
		CTRLTYPE_VLIMIT3: 200
	};

    /* status */

    /* accessibility */
    _pAbstractComponent.accessibilityrole = "form";

    // TODO : checkboxset
	_pAbstractSelectAny._event_list = {
		// auto
		"canitemchange": 1, "oncontextmenu": 1,
		"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
		"oninnerdatachanged": 1, "onitemchanged": 1, "onitemclick": 1,
        "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1,
		"onlbuttondown": 1, "onlbuttonup": 1, "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
		"onrbuttondown": 1, "onrbuttonup": 1, "onsetfocus": 1, "onsize": 1,
		"ontouchend": 1, "ontouchmove": 1, "ontouchstart": 1,
		// multicombo
        "oncloseup": 1, "ondropdown": 1, "oneditclick": 1, "oninput": 1, "onmouseup": 1, "onmousewheel": 1,
		// listBox
		"onhscroll": 1, "onitemdbclick": 1, "onvscroll": 1 
    };

	
    
    //===============================================================
    // nexacro.AbstractSelectAny : Create & Destroy & Update
    //===============================================================

    _pAbstractSelectAny.on_create_contents = function ()
	{
		// Component의 ControlElement와 ContainerElement가 생성된 후 호출
		// 이 함수에서는 Component의 구성에 필요한 Control 또는 Contents Element Object를 생성(new)하고 개별 속성을 설정하는 등의 처리

		nexacro.AbstractComponent.prototype.on_create_contents.call(this);

		this._initValue();
	};

    _pAbstractSelectAny.on_created_contents = function (win)
	{
		// 다른 Object 또는 Component와 관계있는 설정 처리
		// 생성된 Component의 ControlElement가 실체화(DOM Node 생성 등)된 후 호출
		// 이 함수에서는 다른 Object 또는 생성된 Control 또는 Contents Element Object를 실체화하기 위한 처리

		nexacro.AbstractComponent.prototype.on_created_contents.call(this, win);
		
		//trace("on_created_contents:");
		this._appearControl(true);

		if (this._ctrlobj)
		{
			this._ctrlobj.on_created_contents(win);
			this._ctrlobj._is_created = true;
        }

		// notify event : callback function 등록은 on_created_contents에서 설정
		// this._ctrlobj._setEventHandler("ondropdown", this.on_notify_ctrlobj_ondropdown, this);
	};

	_pAbstractSelectAny.on_notify_ctrlobj_ondropdown = function ()
	{
		// ??
	}

    _pAbstractSelectAny.on_create_contents_command = function ()
	{
		// TODO : Create a string in the format of innerhtml by calling the createCommnad() function of control.
		//trace("on_create_contents_command:");

		var ret = nexacro.AbstractComponent.prototype.on_create_contents_command.call(this);

		if (this._ctrlobj)
			ret = this._ctrlobj.on_create_contents_command();

		return ret;
	};

    _pAbstractSelectAny.on_attach_contents_handle = function (win)
	{
		// TODO : Call attachHandle() function of control to attach actual node handle to handle of nexacro.Element.
		nexacro.AbstractComponent.prototype.on_attach_contents_handle.call(this, win);
		
		//trace("on_attach_contents_handle:");
		
		this._appearControl(true);

		if (this._ctrlobj)
		{
			this._ctrlobj.on_attach_contents_handle(win);
			this._ctrlobj._is_created = true;
        }
	};

    _pAbstractSelectAny.on_destroy_contents = function ()
	{
		nexacro.AbstractComponent.prototype.on_destroy_contents.call(this);

		//trace("on_destroy_contents:");
		
		this._destroyControl();
	};
    
    //===============================================================
    // nexacro.AbstractSelectAny : Override
    //===============================================================

    
    //===============================================================
    // nexacro.AbstractSelectAny : Properties
    //===============================================================
    
	_pAbstractSelectAny._setPropertyMap = function (prop, val)
	{
		var _property_map = this._property_map;
		for (var i = 0; i < _property_map.length; i++)
		{
			var propname = _property_map[i][0];
			var propval = _property_map[i][1];

			if (propname == prop && propval == val)
				return;

			if (propname == prop)
			{
				_property_map[i][1] = val;
				return;
            }
		}		
		_property_map.push([prop, val]);
	}

	_pAbstractSelectAny._setControlCommonProperty = function ()
	{
		var ctrl = this._ctrlobj;
		if (!ctrl)
			return;

		var _property_map = this._property_map;
		var v, prop;

		for (var i = 0, n = _property_map.length; i < n; i++)
		{
			prop = _property_map[i][0];
			if (prop != null)
			{
				v = this[prop];
				ctrl["set_" + prop](v);
			}
		}
	};

	_pAbstractSelectAny._setControlSpecificProperty = function (prop/*, value*/)
	{
		var ctrl = this._ctrlobj;
		if (!ctrl)
			return;

		if (prop != null)
		{
			var v = this[prop];
			ctrl["set_" + prop](v);
			if (prop == "index" || prop == "value" || prop == "text" || prop == "innerdataset")
			{
				this.text = ctrl.text;
				this._setPropertyMap("text", ctrl.text);
				this.index = ctrl.index;
				this._setPropertyMap("index", ctrl.index);
				this.value = ctrl.value;
				this._setPropertyMap("value", ctrl.value);
				//this.innerdataset = ctrl.innerdataset;
				//this._setPropertyMap("innerdataset", ctrl.innerdataset);
			}
		}
	};
	
	// normal properties
	_pAbstractSelectAny.set_cssclass = function (val)
	{
		if (this.cssclass != val)
		{
			this.cssclass = val;			
			this._setPropertyMap("cssclass", val);
			if(this._ctrlobj)
				this._setControlSpecificProperty("cssclass");
		}
	};

	_pAbstractSelectAny.set_initvalueid = function (val)
	{
		if (this.initvalueid != val)
		{
			this.initvalueid = val;
			this._setPropertyMap("initvalueid", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("initvalueid");
        }
	};

	// Binding	
	_pAbstractSelectAny.set_codecolumn = function (val)
	{
		if (this.codecolumn != val)
		{
			this.codecolumn = val;
			this._resetInnerBind();
			this._setPropertyMap("codecolumn",val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("codecolumn");
		};
	};

	_pAbstractSelectAny.set_datacolumn = function (val)
	{
		if (this.datacolumn != val)
		{
			this.datacolumn = val;
			this._resetInnerBind();
			this._setPropertyMap("datacolumn", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("datacolumn");
		}
	};
	
	_pAbstractSelectAny.set_innerdataset = function (val)
	{
		var valueid;
		if (this.innerdataset != val)
		{
			if (val instanceof nexacro.Dataset)
			{				
				this._innerdataset = val;
				valueid = val.id;
			}
			else
			{
				valueid = val;
			}
			
			this.innerdataset = valueid;
			this._resetInnerBind();
			this._setPropertyMap("innerdataset", valueid); // TODO : allocateProperty 공통함수 분리
			if (this._ctrlobj)
			{
				this._resetControlByData();
				this._setControlSpecificProperty("innerdataset");
				this._setControlSpecificProperty("index");
			}
		}
	};

	// TODO : 바인딩된 dataset이 변경되어 바인딩이 끊어지는 경우 갱신
	_pAbstractSelectAny.on_init_bindSource = function (columnid, propid, ds)
	{
		//trace("on_init_bindSource:");
	};

	_pAbstractSelectAny.on_change_bindSource = function (propid, ds, row, col)
	{
		//trace("on_change_bindSource:");
		if(this._ctrlobj) 
		{
			this.index = this._ctrlobj.index;
			this.value = this._ctrlobj.value;
			this.text = this._ctrlobj.text;
		}		
	};

	_pAbstractSelectAny.on_getBindableProperties = function () {
		return ["value"];
	};

	// Style
	_pAbstractSelectAny.set_background = function (val)
	{
		if (this.background != val)
		{
			this.background = val;
			this._setPropertyMap("background", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("background");
		}
	};

	_pAbstractSelectAny.set_border = function (val)
	{
		if (this.border != val)
		{
			this.border = val;
			this._setPropertyMap("border", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("border");
		}
	};

	_pAbstractSelectAny.set_borderRadius = function (val)
	{
		if (this.borderRadius != val)
		{
			this.borderRadius = val;
			this._setPropertyMap("borderRadius", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("borderRadius");
		}
	};

	_pAbstractSelectAny.set_boxShadow = function (val)
	{
		if (this.boxShadow != val)
		{
			this.boxShadow = val;
			this._setPropertyMap("boxShadow", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("boxShadow");
		}
	};

	_pAbstractSelectAny.set_color = function (val)
	{
		if (this.color != val)
		{
			this.color = val;
			this._setPropertyMap("color", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("color");
		}
	};

	_pAbstractSelectAny.set_cursor = function (val)
	{
		if (this.cursor != val)
		{
			this.cursor = val;
			this._setPropertyMap("cursor", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("cursor");
		}
	};

	_pAbstractSelectAny.set_edge = function (val)
	{
		if (this.edge != val)
		{
			this.edge = val;
			this._setPropertyMap("edge", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("edge");
		}
	};

	_pAbstractSelectAny.set_font = function (val)
	{
		if (this.font != val)
		{
			this.font = val;
			this._setPropertyMap("font", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("font");
		}
	};

	_pAbstractSelectAny.set_letterSpacing = function (val)
	{
		if (this.letterSpacing != val)
		{
			this.letterSpacing = val;
			this._setPropertyMap("letterSpacing", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("letterSpacing");
		}
	};

	_pAbstractSelectAny.set_opacity = function (val)
	{
		if (this.opacity != val)
		{
			this.opacity = val;
			this._setPropertyMap("opacity", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("opacity");
		}
	};

	_pAbstractSelectAny.set_padding = function (val)
	{
		if (this.padding != val)
		{
			this.padding = val;
			this._setPropertyMap("padding", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("padding");
		}
	};

	_pAbstractSelectAny.set_wordSpacing = function (val)
	{
		if (this.wordSpacing != val)
		{
			this.wordSpacing = val;
			this._setPropertyMap("wordSpacing", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("wordSpacing");
		}
	};

	// Action
	_pAbstractSelectAny.set_enable = function (val)
	{
		val = nexacro._toBoolean(val);
		if (this.enable != val)
		{
			this.enable = val;
			this._setPropertyMap("enable", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("enable");
		}
	};

	_pAbstractSelectAny.set_enableevent = function (val)
	{
		val = nexacro._toBoolean(val);
		if (this.enableevent != val)
		{
			this.enableevent = val;
			this._setPropertyMap("enableevent", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("enableevent");
		}
	};

	_pAbstractSelectAny.set_hotkey = function (val)
	{
		if (this.hotkey != val)
		{
			this.hotkey = val;
			this._setPropertyMap("hotkey", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("hotkey");
		}
	};

	_pAbstractSelectAny.set_index = function (val)
	{
		if (this.index != val)
		{
			this.index = val;
			this._setPropertyMap("index", val);
			if (this._ctrlobj)
			{
				this._setControlSpecificProperty("index");
            }
		}
	};

	_pAbstractSelectAny.set_readonly = function (val)
	{
		if (this.readonly != val)
		{
			this.readonly = val;
			this._setPropertyMap("readonly", val);
			if (this._ctrlobj)
			{
				this._setControlSpecificProperty("readonly");
            }
		}
	};
	
	_pAbstractSelectAny.set_rtl = function (val)
	{
		if (this.rtl != val)
		{
			this.rtl = val;
			this._setPropertyMap("rtl", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("rtl");
		}
	};

	_pAbstractSelectAny.set_taborder = function (val)
	{
		if (this.taborder != val)
		{
			this.taborder = val;
			this._setPropertyMap("taborder", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("taborder");
		}
	};

	_pAbstractSelectAny.set_tabstop = function (val)
	{
		if (this.tabstop != val)
		{
			this.tabstop = val;
			this._setPropertyMap("tabstop", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tabstop");
		}
	};

	_pAbstractSelectAny.set_text = function (val)
	{
		if (this.text != val)
		{
			this.text = val;
			this._setPropertyMap("text", val);
			if (this._ctrlobj)
			{
				this._setControlSpecificProperty("text");
            }
		}
	};

	_pAbstractSelectAny.set_tooltiptext = function (val)
	{
		if (this.tooltiptext != val)
		{
			this.tooltiptext = val;
			this._setPropertyMap("tooltiptext", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tooltiptext");
		}
	};

	_pAbstractSelectAny.set_tooltiptype = function (val)
	{
		if (this.tooltiptype != val)
		{
			this.tooltiptype = val;
			this._setPropertyMap("tooltiptype", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tooltiptype");
		}
	};

	_pAbstractSelectAny.set_value = function (val)
	{
		if (this.value != val)
		{
			this.value = val;
			this._changeValue();
			this._setPropertyMap("value", val);
			if (this._ctrlobj)
			{
				this._setControlSpecificProperty("value");
            }
		}
	};

	_pAbstractSelectAny.set_visible = function (val)
	{
		if (this.visible != val)
		{
			this.visible = val;
			this._setPropertyMap("visible", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("visible");
		}
	};

	// Position
	_pAbstractSelectAny.set_positionstep = function (val)
	{
		if (this.positionstep != val)
		{
			this.positionstep = val;
			this._setPropertyMap("positionstep", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("positionstep");
		}
	};

	_pAbstractSelectAny.set_left = function (val)
	{
		if (this.left != val)
		{
			this.left = val;
			this._setPropertyMap("left", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("left");
		}
	};

	_pAbstractSelectAny.set_top = function (val)
	{
		if (this.top != val)
		{
			this.top = val;
			this._setPropertyMap("top", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("top");
		}
	};

	_pAbstractSelectAny.set_width = function (val)
	{
		if (this.width != val)
		{
			this.width = val;
			this._setPropertyMap("width", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("width");
		}
	};

	_pAbstractSelectAny.set_height = function (val)
	{
		if (this.height != val)
		{
			this.height = val;
			this._setPropertyMap("height", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("height");
		}
	};

	_pAbstractSelectAny.set_right = function (val)
	{
		if (this.right != val)
		{
			this.right = val;
			this._setPropertyMap("right", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("right");
		}
	};

	_pAbstractSelectAny.set_bottom = function (val)
	{
		if (this.bottom != val)
		{
			this.bottom = val;
			this._setPropertyMap("bottom", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("bottom");
		}
	};

	_pAbstractSelectAny.set_minwidth = function (val)
	{
		if (this.minwidth != val)
		{
			this.minwidth = val;
			this._setPropertyMap("minwidth", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("minwidth");
		}
	};

	_pAbstractSelectAny.set_minheight = function (val)
	{
		if (this.minheight != val)
		{
			this.minheight = val;
			this._setPropertyMap("minheight", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("minheight");
		}
	};

	_pAbstractSelectAny.set_maxwidth = function (val)
	{
		if (this.maxwidth != val)
		{
			this.maxwidth = val;
			this._setPropertyMap("maxwidth", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("maxwidth");
		}
	};

	_pAbstractSelectAny.set_maxheight = function (val)
	{
		if (this.maxheight != val)
		{
			this.maxheight = val;
			this._setPropertyMap("maxheight", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("maxheight");
		}
	};

	_pAbstractSelectAny.set_flexgrow = function (val)
	{
		if (this.flexgrow != val)
		{
			this.flexgrow = val;
			this._setPropertyMap("flexgrow", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("flexgrow");
		}
	};

	_pAbstractSelectAny.set_flexshrink = function (val)
	{
		if (this.flexshrink != val)
		{
			this.flexshrink = val;
			this._setPropertyMap("flexshrink", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("flexshrink");
		}
	};

	_pAbstractSelectAny.set_layoutorder = function (val)
	{
		if (this.layoutorder != val)
		{
			this.layoutorder = val;
			this._setPropertyMap("layoutorder", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("layoutorder");
		}
	};

	_pAbstractSelectAny.set_tablecellarea = function (val)
	{
		if (this.tablecellarea != val)
		{
			this.tablecellarea = val;
			this._setPropertyMap("tablecellarea", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tablecellarea");
		}
	};

	// Misc
	_pAbstractSelectAny.set_acceptvaluetype = function (val)
	{
		if (this.acceptvaluetype != val)
		{
			this.acceptvaluetype = val;
			this._setPropertyMap("acceptvaluetype", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("acceptvaluetype");
		}
	};

	_pAbstractSelectAny.readonly = function (val)
	{
		if (this.readonly != val)
		{
			this.readonly = val;
			this._setPropertyMap("readonly", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("readonly");
		}
	};

	// Appearance
	_pAbstractSelectAny.set_controltype = function (v)
	{
		if (this.controltype != v)
		{
			this.controltype = v;

			switch (v)
			{
				case "multicombo": this._ctrltype = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO; break;
				case "checkboxset": this._ctrltype = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET; break;
				case "listbox": this._ctrltype = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX; break;
				default: this._ctrltype = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_AUTO; break;
			}

			this._resetControl(true);
		}
	};

	// Accessibility
	_pAbstractSelectAny.set_accessibilityaction = function (val)
	{
		if (this.accessibilityaction != val)
		{
			this.accessibilityaction = val;
			this._setPropertyMap("accessibilityaction", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilityaction");
		}
	};

	_pAbstractSelectAny.set_accessibilitydesclevel = function (val)
	{
		if (this.accessibilitydesclevel != val)
		{
			this.accessibilitydesclevel = val;
			this._setPropertyMap("accessibilitydesclevel", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilitydesclevel");
		}
	};

	_pAbstractSelectAny.set_accessibilitydescription = function (val)
	{
		if (this.accessibilitydescription != val)
		{
			this.accessibilitydescription = val;
			this._setPropertyMap("accessibilitydescription", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilitydescription");
		}
	};

	_pAbstractSelectAny.set_accessibilityenable = function (val)
	{
		if (this.accessibilityenable != val)
		{
			this.accessibilityenable = val;
			this._setPropertyMap("accessibilityenable", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilityenable");
		}
	};

	_pAbstractSelectAny.set_accessibilitylabel = function (val)
	{
		if (this.accessibilitylabel != val)
		{
			this.accessibilitylabel = val;
			this._setPropertyMap("accessibilitylabel", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilitylabel");
		}
	};

	_pAbstractSelectAny.set_accessibilityrole = function (val)
	{
		if (this.accessibilityrole != val)
		{
			this.accessibilityrole = val;
			this._setPropertyMap("accessibilityrole", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilityrole");
		}
	};

	_pAbstractSelectAny.on_change_containerRect = function (width, height)
	{
		//trace("on_change_containerRect:" + width + "," + height);

		this._resetControl();
		//this._resetContainer(width, height);
	};
    
    //===============================================================
    // nexacro.AbstractSelectAny : OUTER FUNCTIONS (Methods)
    //===============================================================

	_pAbstractSelectAny.getCount = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getCount)
			return this._ctrlobj.getCount();

		return 0;
	}

	_pAbstractSelectAny.getInnerDataset = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getInnerDataset)
			return this._ctrlobj.getInnerDataset();

		return null;
	}

	_pAbstractSelectAny.setInnerDataset = function (obj)
	{
		if (this._ctrlobj && this._ctrlobj.setInnerDataset)
		{
			this._ctrlobj.setInnerDataset(obj);
			this.set_innerdataset(this._ctrlobj.innerdataset);			
        }
	}

	_pAbstractSelectAny.setSelect = function (start, end)
	{
		if (this._ctrlobj && this._ctrlobj.setSelect)
			return this._ctrlobj.setSelect(start, end);

		return false;
	}

	_pAbstractSelectAny.setSelectedText = function (v)
	{
		if (this._ctrlobj && this._ctrlobj.setSelectedText)
			return this._ctrlobj.setSelectedText(v);

		return "";
	}

	_pAbstractSelectAny.updateToDataset = function ()
	{
		if (this._ctrlobj && this._ctrlobj.updateToDataset)
		{
			this._ctrlobj.updateToDataset();
			this.set_innerdataset(this._ctrlobj.innerdataset);
        }
	}

	_pAbstractSelectAny.getSelectedItems = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getSelectedItems)
			return this._ctrlobj.getSelectedItems();
	}

	_pAbstractSelectAny.clearSelect = function ()
	{
		if (this._ctrlobj && this._ctrlobj.clearSelect)
			this._ctrlobj.clearSelect();;
	}

	_pAbstractSelectAny.getSelect = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getSelect)
			return this._ctrlobj.getSelect();
	}

	_pAbstractSelectAny.getSelectedCount = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getSelectedCount)
			return this._ctrlobj.getSelectedCount();
	}
	
    //===============================================================
    // nexacro.AbstractSelectAny : INNER FUNCTIONS (Methods)
    //===============================================================
    _pAbstractSelectAny._resetContainer = function (width, height)
	{
		//trace("_resetContainer:"+width+","+height);
		
		this.resize(width, height);
		this._getForm().resetScroll();
	};

	_pAbstractSelectAny._resetControl = function (force)
	{
		var oldctrl = this._ctrlobjtype;
		var newctrl = this._ctrlobjtype;

		if (this._ctrltype == nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_AUTO)
		{
			// var fw = this.getOffsetWidth();
			var fh = this.getOffsetHeight();

			// Component Size Rule
			if (fh <= nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_VLIMIT1)
				newctrl = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO;
			else if (fh <= nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_VLIMIT2)
				newctrl = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX;
			else
				newctrl = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET;

			// TODO : CheckboxSet direction 기준

			//this._resetControlByData();
			this._ctrlobjtype = newctrl;
		}		
		else if (!this._ctrlobjtype || force)
		{
			newctrl = this._ctrlobjtype = this._ctrltype;
		}

		//trace("_resetControl:" + this.controltype + "-" + oldctrl + "-->" + newctrl);

		if (oldctrl != newctrl)
		{
			//this._unlinkControl();
			this._deleteControl(oldctrl);
			this._createControl(newctrl);
			this._setattControl(newctrl);
			this._appearControl(true);
			this._resetControlByData();
		}
	};

	_pAbstractSelectAny._resetControlByData = function (force)
	{
		var oldctrl = this._ctrlobjtype;
		var newctrl = this._ctrlobjtype;

		if (this._ctrltype == nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_AUTO)
		{
			if (this.innerdataset && this._ctrlobj)
			{
				// TODO : innerdataset type check
				// 첫 로드 시 page rowcunt 유무 확인
				// 애초에 control을 다 만들고 binddata를 비교해야하나 ?
				if (this.selectcheckboxset && this.selectcheckboxset._innerdataset)
				{
					// TODO
					var item = this.selectcheckboxset._items[0];
					var item_height = item._on_getFitSize()[1];
					var total_height = item_height * this.selectcheckboxset._innerdataset.rowcount;
					if (total_height > this.height)
						newctrl = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX;					
				}
				else if (this.selectlistbox && this.selectlistbox._innerdataset && this.selectlistbox._page_rowcount > this.selectlistbox._innerdataset.rowcount)
				{
					newctrl = nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET;
				}

				this._ctrlobjtype = newctrl;
			}
		}
		else if (!this._ctrlobjtype || force)
		{
			newctrl = this._ctrlobjtype = this._ctrltype;
		}

		if (oldctrl != newctrl)
		{
			//this._select_multi = this._ctrlobj._select_multi; // multi select info 끌어올리기
			this._deleteControl(oldctrl);
			this._createControl(newctrl);
			this._setattControl(newctrl);
			this._appearControl(true);
		}
	};

	_pAbstractSelectAny._destroyControl = function ()
	{
		//trace("_destroyControl:");
		
		var oldctrl = this._ctrlobjtype;
		if (oldctrl)
		{
			this._deleteControl(oldctrl);
		}
	};
	
	_pAbstractSelectAny._deleteControl = function(oldctrl)
	{
		//trace("_deleteControl:"+oldctrl);
		
		if (oldctrl)
		{
			switch(oldctrl)
			{
				case 1 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO*/: this._deleteMultiComboControl(); break;
				case 2 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET*/: this._deleteCheckboxSetControl(); break;
				case 3 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX*/ : this._deleteListBoxControl(); break;
			}
		}
		
		this._ctrlobj = null;
	};

	_pAbstractSelectAny._createControl = function (newctrl)
	{
		//trace("_createControl:"+newctrl);
		
		var ctrlobj = null;
		
		if (newctrl)
		{
			switch(newctrl)
			{
				case 1 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO*/: ctrlobj = this._createMultiComboControl(); break;
				case 2 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET*/: ctrlobj = this._createCheckboxSetControl(); break;
				case 3 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX*/ : ctrlobj = this._createListBoxControl(); break;
			}
			ctrlobj._is_control_component = true;
			this._ctrlobj = ctrlobj;
			this._setEventHandlerToControlComponent();
		}
	};

	_pAbstractSelectAny._setattControl = function (newctrl)
	{
		//trace("_setattControl:"+this._ctrlobj);
		
		var ctrlobj = this._ctrlobj;
		if (ctrlobj)
		{
			// common attribute
			this._setControlCommonProperty();

			// apply multi select info
			//this._setControlSelectMultiInfo();

			// control attribute
			switch(newctrl)
			{
				case 1 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO*/: this._setattMultiComboControl(); break;
				case 2 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET*/: this._setattCheckboxSetControl(); break;
				case 3 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX*/ : this._setattListBoxControl(); break;
			}
			
			// bind
			this._resetInnerBind();

			// value
			this._initValue();
		}
	};
	/*
	_pAbstractSelectAny._setControlSelectMultiInfo = function () 
	{		
		var ctrl = this._ctrlobj;
		if (!ctrl)
			return;
		
		if (this._select_multi) 
		{
			ctrl._select_multi = this._select_multi;
			ctrl._select_withmouseevent(ctrl.index);
		}
	};
	*/
	_pAbstractSelectAny._appearControl = function (force)
	{
		if (!this._is_created && !force) return;

		//trace("_appearControl:"+this._ctrlobj+(force ? ",force" : ""));
		
		var ctrlobj = this._ctrlobj;
		if (ctrlobj)
		{
			/*
			if (!this.parent[this.name])
				this.parent.addChild(this.name, this);
			
			if (!ctrlobj.id)
				ctrlobj.id = ctrlobj.name = ctrlobj.name;
			else
				ctrlobj.id = ctrlobj.name;
			*/
			ctrlobj.show();
		}
	};


	_pAbstractSelectAny._unlinkControl = function()
	{
		//trace("_unlinkControl:"+this._ctrlobj);
		
		var ctrlobj = this._ctrlobj;
		if (ctrlobj)
		{
			this.form.removeChild(ctrlobj.name);
		}
	};
	
	_pAbstractSelectAny._createMultiComboControl = function ()
	{
		//trace("_createMultiComboControl:");

		if (!this.selectmulticombo)
		{
			this.selectmulticombo = new nexacro.MultiCombo("selectmulticombo", this.left, this.top, this.width, this.height, this.right, this.bottom, this.minwidth, this.maxwidth, this.minheight, this.maxheight, this);

			//this.selectmulticombo.addEventHandler("onitemchanged", this._onControlItemChanged, this);
			//this.selectmulticombo.addEventHandler("onitemclick", this._onControlItemClick, this);

		};
		
		return this.selectmulticombo;
	};

	_pAbstractSelectAny._createCheckboxSetControl = function ()
	{
		//trace("_createCheckboxSetControl:");

		if (!this.selectcheckboxset)
		{
			this.selectcheckboxset = new nexacro.CheckBoxSet("selectcheckboxset", this.left, this.top, this.width, this.height, this.right, this.bottom, this.minwidth, this.maxwidth, this.minheight, this.maxheight, this);

			//this.selectcheckboxset.addEventHandler("onitemchanged", this._onControlItemChanged, this)
			//this.selectcheckboxset.addEventHandler("onclick", this._onControlItemChanged, this)
		}

		return this.selectcheckboxset;
	};

	_pAbstractSelectAny._createListBoxControl = function ()
	{
		//trace("_createListBoxControl:");

		if (!this.selectlistbox)
		{
			this.selectlistbox = new nexacro.ListBox("selectlistbox", this.left, this.top, this.width, this.height, this.right, this.bottom, this.minwidth, this.maxwidth, this.minheight, this.maxheight, this);
			
			// TODO : multiselect = true (readonly)
			this.selectlistbox.set_multiselect(true);
			
			//this.selectlistbox.addEventHandler("onitemchanged", this._onControlItemChanged, this)
		}

		return this.selectlistbox;
	};

	_pAbstractSelectAny._setattMultiComboControl = function ()
	{
		//trace("_setattMultiComboControl:");
		
		if (this.selectmulticombo)
		{
			// TODO
		}
	};

	_pAbstractSelectAny._setattCheckboxSetControl = function () 
	{
		//trace("_setattcheckboxsetControl:");

		if (this.selectcheckboxset)
		{
			// TODO
			this.selectcheckboxset.set_direction("vertical");

		}
	};

	_pAbstractSelectAny._setattListBoxControl = function ()
	{
		//trace("_setattListBoxControl:");
		
		if (this.selectlistbox)
		{
			// TODO
		}
	};
	
	_pAbstractSelectAny._deleteMultiComboControl = function ()
	{
		//trace("_deleteMultiComboControl:");
		
		if (this.selectmulticombo)
		{
			this.selectmulticombo.destroy();
			delete this.selectmulticombo;
			this.selectmulticombo = null;
		}
	};

	_pAbstractSelectAny._deleteCheckboxSetControl = function ()
	{
		//trace("_deleteCheckboxSetControl:");

		if (this.selectcheckboxset)
		{
			this.selectcheckboxset.destroy();
			delete this.selectcheckboxset;
			this.selectcheckboxset = null;
		}
	};

	_pAbstractSelectAny._deleteListBoxControl = function ()
	{
		//trace("_deleteListBoxControl:");
		
		if (this.selectlistbox)
		{
			this.selectlistbox.destroy();
			delete this.selectlistbox;
			this.selectlistbox = null;
		}
	};
	/*
	_pAbstractSelectAny._recheckSelectItemValue = function ()
	{
		var ctrl = this._ctrlobj;
		if (!ctrl)
			return;

		var _property_map = this._property_map;

		for (var i = 0, n = _property_map.length; i < n; i++)
		{
			var v;
			var prop = _property_map[i][0];
			if (prop != null)
				v = this[prop];

			if (prop == "value" || prop == "index" || prop == "text")
			{
				this[prop] = v;
				this._setPropertyMap(prop, v);
			}
		}
	};
	*/
	_pAbstractSelectAny._initValue = function ()
	{
		//trace("_initValue:"+this.value);
		
		// init value info
		
		// set value
		this._changeValue();
	};

	_pAbstractSelectAny._changeValue = function ()
	{
		//trace("_changeValue:"+this.value);

		// get value

		// set control value
		this._setControlValue();
	};

	_pAbstractSelectAny._setControlValue = function ()
	{
		//trace("_setControlValue:" + this._ctrlobjtype + this._ctrlobj + "<--" + this.value);

		if (this._ctrlobjtype && this._ctrlobj)
		{
			switch (this._ctrlobjtype)
			{
				case 1 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO*/: this._ctrlobj.set_value(this.value); break;
				case 2 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET*/: this._ctrlobj.set_value(this.value); break;
				case 3 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX*/: this._ctrlobj.set_value(this.value); break;
			}
		}
	};

	_pAbstractSelectAny._resetInnerBind = function ()
	{
		//trace("_resetInnerBind:" + this._ctrlobjtype + this._ctrlobj + "<--" + this.innerdataset + "-" + this.codecolumn + "," + this.datacolumn);

		// set innerbind
		if (this._ctrlobjtype && this._ctrlobj)
		{			
			var ds = this._innerdataset? this._innerdataset : this.innerdataset;
			
			switch(this._ctrlobjtype)
			{
				case 1 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_MULTICOMBO*/: this._ctrlobj.set_innerdataset(ds); this._ctrlobj.set_codecolumn(this.codecolumn); this._ctrlobj.set_datacolumn(this.datacolumn); break;
				case 2 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_CHECKBOXSET*/: this._ctrlobj.set_innerdataset(ds); this._ctrlobj.set_codecolumn(this.codecolumn); this._ctrlobj.set_datacolumn(this.datacolumn); break;
				case 3 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX*/: this._ctrlobj.set_innerdataset(ds); this._ctrlobj.set_codecolumn(this.codecolumn); this._ctrlobj.set_datacolumn(this.datacolumn); break;
			}			
		}
    };
    
	//_removeEventHandlerToInnerDataset
	
    //===============================================================
    // nexacro.AbstractSelectAny : Events
    //===============================================================
    
	_pAbstractSelectAny._setEventHandlerToControlComponent = function ()
	{
		var ctrlobj = this._ctrlobj;
		if (!ctrlobj)
			return;

		// notify user event
		this._evt_arr = ["canitemchange", "onitemchanged", "onitemclick", "oncontextmenu", "oninnerdatachanged"];
		if (this._evt_arr && 0 < this._evt_arr.length)
		{
			for (var i = 0; i < this._evt_arr.length; i++)
			{
				var evt_id = this._evt_arr[i];
				var listener = this[evt_id];
				if (listener && listener._has_handlers)
					ctrlobj._setEventHandler(evt_id, listener._user_handlers[0].handler, this);
			}
		}
	};

	/*
	_pAbstractSelectAny._onControlItemChanged = function (o, e)
	{
		this.value = e.postvalue;
		trace("_onControlItemChanged - object : ", o, " / event : ",  e);
		this.on_fire_onitemchanged(o, e);
	};

	_pAbstractSelectAny.on_fire_onitemchanged = function (o, e)
	{
		if (this.onitemchanged && this.onitemchanged._has_handlers)
		{
			var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", e.preindex, e.pretext, e.prevalue, e.postindex, e.posttext, e.postvalue);
			
			return this.onitemchanged.fireEvent(this, evt);
		}
		return false;
	};

	_pAbstractSelectAny._onControlItemClick = function (o, e) {
		this.value = e.postvalue;
		trace("_onControlItemClick - object : ", o, " / event : ", e);
		this.on_fire_onitemclick(o, e);
	};

	_pAbstractSelectAny.on_fire_onitemclick = function (o, e)
	{
		if (this.onitemclick && this.onitemclick._has_handlers)
		{
			var evt = new nexacro.ItemClickEventInfo(o, "onitemclick", e.preindex, e.pretext, e.prevalue, e.postindex, e.posttext, e.postvalue);
			this.onitemclick._fireEvent(this, evt);
		}

		return false;
	};
	*/
	//===============================================================
	// nexacro.AbstractSelectAny : Style Part
	//===============================================================

	// genie : 필요한가?
	_pAbstractSelectAny.on_get_css_assumedtypename = function ()
	{
		if (this.selectmulticombo)
			return "MultiCombo";
		else if (this.selectcheckboxset)
			return "CheckboxSet";
		else if (this.selectlistbox)
			return "ListBox";

		return this._type_name; // genie : default return 값을 어떻게 가져갈까? 
	};
}

