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

if(!nexacro.AbstractSelectOne)
{
    //==============================================================================
	// nexacro.AbstractSelectOne
	//==============================================================================

    nexacro.AbstractSelectOne = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
	{
		nexacro.AbstractComponent.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

		this._property_map = [];

		this.selectcombo = null;
		this.selectradio = null;
		this.selectlistbox = null;

		this.readonly = false;
		// TODO : controltype 별 property map depth 분리 (auto, combo, listbox, radio)
		// this._property_map_auto = [];
    };
	
	var _pAbstractSelectOne = nexacro._createPrototype(nexacro.AbstractComponent, nexacro.AbstractSelectOne);
	nexacro.AbstractSelectOne.prototype = _pAbstractSelectOne;
	_pAbstractSelectOne._type_name = "AbstractSelectOne";
	
    /* control */

	/* default properties */
	// TODO : property init
	_pAbstractSelectOne.value = undefined;
	_pAbstractSelectOne.index = -1;
	_pAbstractSelectOne.text = "";

	_pAbstractSelectOne.controltype = "auto";
	_pAbstractSelectOne.innerdataset = "";
	_pAbstractSelectOne.codecolumn = "";
	_pAbstractSelectOne.datacolumn = "";
	
	_pAbstractSelectOne.selectcombo = null;
	_pAbstractSelectOne.selectradio = null;
	_pAbstractSelectOne.selectlistbox = null;
    

    /* internal variable */
	_pAbstractSelectOne._ctrltype = 0;
	_pAbstractSelectOne._ctrlobjtype = 0;
    _pAbstractSelectOne._ctrlobj = null;
    
	_pAbstractSelectOne._real_visible = false;

	nexacro._AbstractSelectOne_ControlConst =
	{
		CTRLTYPE_AUTO 	: 0,
		CTRLTYPE_COMBO: 1,
		CTRLTYPE_RADIO: 2,
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

	_pAbstractSelectOne._event_list = {
		// auto
		"canitemchange": 1, "oncontextmenu": 1,
		"ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
		"oninnerdatachanged": 1, "onitemchanged": 1, "onitemclick": 1,
        "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "onkeydown": 1, "onkeyup": 1, "onkillfocus": 1,
		"onlbuttondown": 1, "onlbuttonup": 1, "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
		"onrbuttondown": 1, "onrbuttonup": 1, "onsetfocus": 1, "onsize": 1,
		"ontouchend": 1, "ontouchmove": 1, "ontouchstart": 1,
		// combo
		"oncloseup": 1, "ondropdown": 1, "oneditclick": 1, "oninput": 1, "onmouseup": 1, "onmousewheel": 1,
		// listBox
		"onhscroll": 1, "onitemdbclick": 1, "onvscroll": 1 
    };

    //===============================================================
    // nexacro.AbstractSelectOne : Create & Destroy & Update
    //===============================================================

    _pAbstractSelectOne.on_create_contents = function ()
	{
		// Component의 ControlElement와 ContainerElement가 생성된 후 호출
		// 이 함수에서는 Component의 구성에 필요한 Control 또는 Contents Element Object를 생성(new)하고 개별 속성을 설정하는 등의 처리

		nexacro.AbstractComponent.prototype.on_create_contents.call(this);

		this._initValue();
	};

    _pAbstractSelectOne.on_created_contents = function (win)
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

	_pAbstractSelectOne.on_notify_ctrlobj_ondropdown = function ()
	{
		// ??
	}

    _pAbstractSelectOne.on_create_contents_command = function ()
	{
		// TODO : Create a string in the format of innerhtml by calling the createCommnad() function of control.
		//trace("on_create_contents_command:");

		var ret = nexacro.AbstractComponent.prototype.on_create_contents_command.call(this);

		if (this._ctrlobj)
			ret = this._ctrlobj.on_create_contents_command();

		return ret;
	};

    _pAbstractSelectOne.on_attach_contents_handle = function (win)
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

    _pAbstractSelectOne.on_destroy_contents = function ()
	{
		nexacro.AbstractComponent.prototype.on_destroy_contents.call(this);

		//trace("on_destroy_contents:");
		
		this._destroyControl();
	};
	
    //===============================================================
    // nexacro.AbstractSelectOne : Override
    //===============================================================


    //===============================================================
    // nexacro.AbstractSelectOne : Properties
	//===============================================================

	_pAbstractSelectOne._setPropertyMap = function (prop, val)
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

	_pAbstractSelectOne._setControlCommonProperty = function ()
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

	_pAbstractSelectOne._setControlSpecificProperty = function (prop/*, value*/)
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
	_pAbstractSelectOne.set_cssclass = function (val)
	{
		if (this.cssclass != val)
		{
			this.cssclass = val;			
			this._setPropertyMap("cssclass", val);
			if(this._ctrlobj)
				this._setControlSpecificProperty("cssclass");
		}
	};

	_pAbstractSelectOne.set_initvalueid = function (val)
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
	_pAbstractSelectOne.set_codecolumn = function (val)
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

	_pAbstractSelectOne.set_datacolumn = function (val)
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

	_pAbstractSelectOne.set_innerdataset = function (val)
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
			}
		}
	};

	// TODO : 바인딩된 dataset이 변경되어 바인딩이 끊어지는 경우 갱신
	_pAbstractSelectOne.on_init_bindSource = function (columnid, propid, ds)
	{
		//trace("on_init_bindSource:");
	};

	_pAbstractSelectOne.on_change_bindSource = function (propid, ds, row, col)
	{
		//trace("on_change_bindSource:");
		if(this._ctrlobj) 
		{
			this.index = this._ctrlobj.index;
			this.value = this._ctrlobj.value;
			this.text = this._ctrlobj.text;
		}
	};

	_pAbstractSelectOne.on_getBindableProperties = function () {
		return ["value"];
	};

	// Style
	_pAbstractSelectOne.set_background = function (val)
	{
		if (this.background != val)
		{
			this.background = val;
			this._setPropertyMap("background", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("background");
		}
	};

	_pAbstractSelectOne.set_border = function (val)
	{
		if (this.border != val)
		{
			this.border = val;
			this._setPropertyMap("border", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("border");
		}
	};

	_pAbstractSelectOne.set_borderRadius = function (val)
	{
		if (this.borderRadius != val)
		{
			this.borderRadius = val;
			this._setPropertyMap("borderRadius", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("borderRadius");
		}
	};

	_pAbstractSelectOne.set_boxShadow = function (val)
	{
		if (this.boxShadow != val)
		{
			this.boxShadow = val;
			this._setPropertyMap("boxShadow", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("boxShadow");
		}
	};

	_pAbstractSelectOne.set_color = function (val)
	{
		if (this.color != val)
		{
			this.color = val;
			this._setPropertyMap("color", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("color");
		}
	};

	_pAbstractSelectOne.set_cursor = function (val)
	{
		if (this.cursor != val)
		{
			this.cursor = val;
			this._setPropertyMap("cursor", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("cursor");
		}
	};

	_pAbstractSelectOne.set_edge = function (val)
	{
		if (this.edge != val)
		{
			this.edge = val;
			this._setPropertyMap("edge", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("edge");
		}
	};

	_pAbstractSelectOne.set_font = function (val)
	{
		if (this.font != val)
		{
			this.font = val;
			this._setPropertyMap("font", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("font");
		}
	};

	_pAbstractSelectOne.set_letterSpacing = function (val)
	{
		if (this.letterSpacing != val)
		{
			this.letterSpacing = val;
			this._setPropertyMap("letterSpacing", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("letterSpacing");
		}
	};

	_pAbstractSelectOne.set_opacity = function (val)
	{
		if (this.opacity != val)
		{
			this.opacity = val;
			this._setPropertyMap("opacity", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("opacity");
		}
	};

	_pAbstractSelectOne.set_padding = function (val)
	{
		if (this.padding != val)
		{
			this.padding = val;
			this._setPropertyMap("padding", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("padding");
		}
	};

	_pAbstractSelectOne.set_wordSpacing = function (val)
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
	_pAbstractSelectOne.set_enable = function (val)
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

	_pAbstractSelectOne.set_enableevent = function (val)
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

	_pAbstractSelectOne.set_hotkey = function (val)
	{
		if (this.hotkey != val)
		{
			this.hotkey = val;
			this._setPropertyMap("hotkey", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("hotkey");
		}
	};

	_pAbstractSelectOne.set_index = function (val)
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

	_pAbstractSelectOne.set_readonly = function (val)
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

	_pAbstractSelectOne.set_rtl = function (val)
	{
		if (this.rtl != val)
		{
			this.rtl = val;
			this._setPropertyMap("rtl", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("rtl");
		}
	};

	_pAbstractSelectOne.set_taborder = function (val)
	{
		if (this.taborder != val)
		{
			this.taborder = val;
			this._setPropertyMap("taborder", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("taborder");
		}
	};

	_pAbstractSelectOne.set_tabstop = function (val)
	{
		if (this.tabstop != val)
		{
			this.tabstop = val;
			this._setPropertyMap("tabstop", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tabstop");
		}
	};

	_pAbstractSelectOne.set_text = function (val)
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

	_pAbstractSelectOne.set_tooltiptext = function (val)
	{
		if (this.tooltiptext != val)
		{
			this.tooltiptext = val;
			this._setPropertyMap("tooltiptext", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tooltiptext");
		}
	};

	_pAbstractSelectOne.set_tooltiptype = function (val)
	{
		if (this.tooltiptype != val)
		{
			this.tooltiptype = val;
			this._setPropertyMap("tooltiptype", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("tooltiptype");
		}
	};

	_pAbstractSelectOne.set_value = function (val)
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

	_pAbstractSelectOne.set_visible = function (val)
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
	_pAbstractSelectOne.set_positionstep = function (val)
	{
		if (this.positionstep != val)
		{
			this.positionstep = val;
			this._setPropertyMap("positionstep", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("positionstep");
		}
	};

	_pAbstractSelectOne.set_left = function (val)
	{
		if (this.left != val)
		{
			this.left = val;
			this._setPropertyMap("left", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("left");
		}
	};

	_pAbstractSelectOne.set_top = function (val)
	{
		if (this.top != val)
		{
			this.top = val;
			this._setPropertyMap("top", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("top");
		}
	};

	_pAbstractSelectOne.set_width = function (val)
	{
		if (this.width != val)
		{
			this.width = val;
			this._setPropertyMap("width", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("width");
		}
	};

	_pAbstractSelectOne.set_height = function (val)
	{
		if (this.height != val)
		{
			this.height = val;
			this._setPropertyMap("height", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("height");
		}
	};

	_pAbstractSelectOne.set_right = function (val)
	{
		if (this.right != val)
		{
			this.right = val;
			this._setPropertyMap("right", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("right");
		}
	};

	_pAbstractSelectOne.set_bottom = function (val)
	{
		if (this.bottom != val)
		{
			this.bottom = val;
			this._setPropertyMap("bottom", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("bottom");
		}
	};

	_pAbstractSelectOne.set_minwidth = function (val)
	{
		if (this.minwidth != val)
		{
			this.minwidth = val;
			this._setPropertyMap("minwidth", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("minwidth");
		}
	};

	_pAbstractSelectOne.set_minheight = function (val)
	{
		if (this.minheight != val)
		{
			this.minheight = val;
			this._setPropertyMap("minheight", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("minheight");
		}
	};

	_pAbstractSelectOne.set_maxwidth = function (val)
	{
		if (this.maxwidth != val)
		{
			this.maxwidth = val;
			this._setPropertyMap("maxwidth", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("maxwidth");
		}
	};

	_pAbstractSelectOne.set_maxheight = function (val)
	{
		if (this.maxheight != val)
		{
			this.maxheight = val;
			this._setPropertyMap("maxheight", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("maxheight");
		}
	};

	_pAbstractSelectOne.set_flexgrow = function (val)
	{
		if (this.flexgrow != val)
		{
			this.flexgrow = val;
			this._setPropertyMap("flexgrow", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("flexgrow");
		}
	};

	_pAbstractSelectOne.set_flexshrink = function (val)
	{
		if (this.flexshrink != val)
		{
			this.flexshrink = val;
			this._setPropertyMap("flexshrink", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("flexshrink");
		}
	};

	_pAbstractSelectOne.set_layoutorder = function (val)
	{
		if (this.layoutorder != val)
		{
			this.layoutorder = val;
			this._setPropertyMap("layoutorder", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("layoutorder");
		}
	};

	_pAbstractSelectOne.set_tablecellarea = function (val)
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
	_pAbstractSelectOne.set_acceptvaluetype = function (val)
	{
		if (this.acceptvaluetype != val)
		{
			this.acceptvaluetype = val;
			this._setPropertyMap("acceptvaluetype", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("acceptvaluetype");
		}
	};

	_pAbstractSelectOne.readonly = function (val)
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
	_pAbstractSelectOne.set_controltype = function (v)
	{
		if (this.controltype != v)
		{
			this.controltype = v;

			switch (v)
			{
				case "combo": this._ctrltype = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_COMBO; break;
				case "radio": this._ctrltype = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO; break;
				case "listbox": this._ctrltype = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX; break;
				default: this._ctrltype = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_AUTO; break;
			}

			this._resetControl(true);
		}
	};

	// Accessibility
	_pAbstractSelectOne.set_accessibilityaction = function (val)
	{
		if (this.accessibilityaction != val)
		{
			this.accessibilityaction = val;
			this._setPropertyMap("accessibilityaction", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilityaction");
		}
	};

	_pAbstractSelectOne.set_accessibilitydesclevel = function (val)
	{
		if (this.accessibilitydesclevel != val)
		{
			this.accessibilitydesclevel = val;
			this._setPropertyMap("accessibilitydesclevel", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilitydesclevel");
		}
	};

	_pAbstractSelectOne.set_accessibilitydescription = function (val)
	{
		if (this.accessibilitydescription != val)
		{
			this.accessibilitydescription = val;
			this._setPropertyMap("accessibilitydescription", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilitydescription");
		}
	};

	_pAbstractSelectOne.set_accessibilityenable = function (val)
	{
		if (this.accessibilityenable != val)
		{
			this.accessibilityenable = val;
			this._setPropertyMap("accessibilityenable", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilityenable");
		}
	};

	_pAbstractSelectOne.set_accessibilitylabel = function (val)
	{
		if (this.accessibilitylabel != val)
		{
			this.accessibilitylabel = val;
			this._setPropertyMap("accessibilitylabel", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilitylabel");
		}
	};

	_pAbstractSelectOne.set_accessibilityrole = function (val)
	{
		if (this.accessibilityrole != val)
		{
			this.accessibilityrole = val;
			this._setPropertyMap("accessibilityrole", val);
			if (this._ctrlobj)
				this._setControlSpecificProperty("accessibilityrole");
		}
	};

	_pAbstractSelectOne.on_change_containerRect = function (width, height)
	{
		//trace("on_change_containerRect:" + width + "," + height);

		this._resetControl();
		//this._resetContainer(width, height);
	};

	//===============================================================
    // nexacro.AbstractSelectOne : OUTER FUNCTIONS (Methods)
    //===============================================================

	_pAbstractSelectOne.getCount = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getCount)
			return this._ctrlobj.getCount();

		return 0;
	}

	_pAbstractSelectOne.getInnerDataset = function ()
	{
		if (this._ctrlobj && this._ctrlobj.getInnerDataset)
			return this._ctrlobj.getInnerDataset();

		return null;
	}

	_pAbstractSelectOne.setInnerDataset = function (obj)
	{
		if (this._ctrlobj && this._ctrlobj.setInnerDataset)
		{
			this._ctrlobj.setInnerDataset(obj);
			this.set_innerdataset(this._ctrlobj.innerdataset);
        }
	}

	_pAbstractSelectOne.setSelect = function (start, end)
	{
		if (this._ctrlobj && this._ctrlobj.setSelect)
			return this._ctrlobj.setSelect(start, end);

		return false;
	}

	_pAbstractSelectOne.setSelectedText = function (v)
	{
		if (this._ctrlobj && this._ctrlobj.setSelectedText)
			return this._ctrlobj.setSelectedText(v);

		return "";
	}

	_pAbstractSelectOne.updateToDataset = function ()
	{
		if (this._ctrlobj && this._ctrlobj.updateToDataset)
		{
			this._ctrlobj.updateToDataset();
			this.set_innerdataset(this._ctrlobj.innerdataset);
        }
	}

    //===============================================================
    // nexacro.AbstractSelectOne : INNER FUNCTIONS (Methods)
    //===============================================================
    _pAbstractSelectOne._resetContainer = function (width, height)
	{
		//trace("_resetContainer:"+width+","+height);
		
		this.resize(width, height);
		this._getForm().resetScroll();
	};

	_pAbstractSelectOne._resetControl = function (force)
	{
		var oldctrl = this._ctrlobjtype;
		var newctrl = this._ctrlobjtype;

		if (this._ctrltype == nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_AUTO)
		{
			// var fw = this.getOffsetWidth();
			var fh = this.getOffsetHeight();

			// Component Size Rule
			if (fh <= nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_VLIMIT1)
				newctrl = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_COMBO;
			else if (fh <= nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_VLIMIT2)
				newctrl = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX;
			else
				newctrl = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO;

			// TODO : Radio direction 기준

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

	_pAbstractSelectOne._resetControlByData = function (force)
	{
		var oldctrl = this._ctrlobjtype;
		var newctrl = this._ctrlobjtype;

		if (this._ctrltype == nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_AUTO)
		{
			if (this.innerdataset && this._ctrlobj)
			{
				// TODO : innerdataset type check
				// 첫 로드 시 page rowcunt 유무 확인
				// 애초에 control을 다 만들고 binddata를 비교해야하나 ?
				if (this.selectradio && this.selectradio._innerdataset)
				{
					var item = this.selectradio._items[0];
					var item_height = item._on_getFitSize()[1];
					var total_height = item_height * this.selectradio._innerdataset.rowcount;
					if (total_height > this.height)
						newctrl = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX;
				}
				else if (this.selectlistbox && this.selectlistbox._innerdataset && this.selectlistbox._page_rowcount > this.selectlistbox._innerdataset.rowcount)
				{
					newctrl = nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO;
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
			this._deleteControl(oldctrl);
			this._createControl(newctrl);
			this._setattControl(newctrl);
			this._appearControl(true);
		}
	};

	_pAbstractSelectOne._destroyControl = function ()
	{
		//trace("_destroyControl:");
		
		var oldctrl = this._ctrlobjtype;
		if (oldctrl)
		{
			this._deleteControl(oldctrl);
		}
	};
	
	_pAbstractSelectOne._deleteControl = function(oldctrl)
	{
		//trace("_deleteControl:"+oldctrl);
		
		if (oldctrl)
		{
			switch(oldctrl)
			{
				case 1 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_COMBO*/: this._deleteComboControl(); break;
				case 2 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO*/: this._deleteRadioControl(); break;
				case 3 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX*/ : this._deleteListBoxControl(); break;
			}
		}
		
		this._ctrlobj = null;
	};

	_pAbstractSelectOne._createControl = function (newctrl)
	{
		//trace("_createControl:"+newctrl);
		
		var ctrlobj = null;
		
		if (newctrl)
		{
			switch(newctrl)
			{
				case 1 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_COMBO*/: ctrlobj = this._createComboControl(); break;
				case 2 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO*/: ctrlobj = this._createRadioControl(); break;
				case 3 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX*/ : ctrlobj = this._createListBoxControl(); break;
			}
			ctrlobj._is_control_component = true;
			this._ctrlobj = ctrlobj;
			this._setEventHandlerToControlComponent();
		}
	};

	_pAbstractSelectOne._setattControl = function (newctrl)
	{
		//trace("_setattControl:"+this._ctrlobj);
		
		var ctrlobj = this._ctrlobj;
		if (ctrlobj)
		{
			// common attribute
			this._setControlCommonProperty();

			// control attribute
			switch(newctrl)
			{
				case 1 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_COMBO*/: this._setattComboControl(); break;
				case 2 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_RADIO*/: this._setattRadioControl(); break;
				case 3 /*nexacro._AbstractSelectAny_ControlConst.CTRLTYPE_LISTBOX*/ : this._setattListBoxControl(); break;
			}
			
			// bind
			this._resetInnerBind();

			// value
			this._initValue();
		}
	};

	_pAbstractSelectOne._appearControl = function (force)
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


	_pAbstractSelectOne._unlinkControl = function()
	{
		//trace("_unlinkControl:"+this._ctrlobj);
		
		var ctrlobj = this._ctrlobj;
		if (ctrlobj)
		{
			this.form.removeChild(ctrlobj.name);
		}
	};
	
	_pAbstractSelectOne._createComboControl = function ()
	{
		//trace("_createComboControl:");

		if (!this.selectcombo)
		{
			this.selectcombo = new nexacro.Combo("selectcombo", this.left, this.top, this.width, this.height, this.right, this.bottom, this.minwidth, this.maxwidth, this.minheight, this.maxheight, this);

			//this.selectcombo.addEventHandler("onitemchanged", this._onControlItemChanged, this);
			//this.selectcombo.addEventHandler("onitemclick", this._onControlItemClick, this);

		};
		
		return this.selectcombo;
	};

	_pAbstractSelectOne._createRadioControl = function ()
	{
		//trace("_createRadioControl:");

		if (!this.selectradio)
		{
			this.selectradio = new nexacro.Radio("selectradio", this.left, this.top, this.width, this.height, this.right, this.bottom, this.minwidth, this.maxwidth, this.minheight, this.maxheight, this);

			//this.selectradio.addEventHandler("onitemchanged", this._onControlItemChanged, this)
			//this.selectradio.addEventHandler("onclick", this._onControlItemChanged, this)
		}

		return this.selectradio;
	};

	_pAbstractSelectOne._createListBoxControl = function ()
	{
		//trace("_createListBoxControl:");

		if (!this.selectlistbox)
		{
			this.selectlistbox = new nexacro.ListBox("selectlistbox", this.left, this.top, this.width, this.height, this.right, this.bottom, this.minwidth, this.maxwidth, this.minheight, this.maxheight, this);

			//this.selectlistbox.addEventHandler("onitemchanged", this._onControlItemChanged, this)
		}

		return this.selectlistbox;
	};

	_pAbstractSelectOne._setattComboControl = function ()
	{
		//trace("_setattComboControl:");
		
		if (this.selectcombo)
		{
			// TODO
		}
	};

	_pAbstractSelectOne._setattRadioControl = function () {
		//trace("_setattRadioControl:");

		if (this.selectradio)
		{
			// TODO

		}
	};

	_pAbstractSelectOne._setattListBoxControl = function ()
	{
		//trace("_setattListBoxControl:");
		
		if (this.selectlistbox)
		{
			// TODO
		}
	};
	
	_pAbstractSelectOne._deleteComboControl = function ()
	{
		//trace("_deleteComboControl:");
		
		if (this.selectcombo)
		{
			this.selectcombo.destroy();
			delete this.selectcombo;
			this.selectcombo = null;
		}
	};

	_pAbstractSelectOne._deleteRadioControl = function ()
	{
		//trace("_deleteRadioControl:");

		if (this.selectradio)
		{
			this.selectradio.destroy();
			delete this.selectradio;
			this.selectradio = null;
		}
	};

	_pAbstractSelectOne._deleteListBoxControl = function ()
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
	_pAbstractSelectOne._recheckSelectItemValue = function ()
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
				v = ctrl[prop];

			if (prop == "value" || prop == "index" || prop == "text")
			{
				this[prop] = v;
				this._setPropertyMap(prop, v);
			}
		}
	};
	*/
	_pAbstractSelectOne._initValue = function ()
	{
		//trace("_initValue:"+this.value);
		
		// init value info
		
		// set value
		this._changeValue();
	};

	_pAbstractSelectOne._changeValue = function ()
	{
		//trace("_changeValue:"+this.value);

		// get value

		// set control value
		this._setControlValue();
	};

	_pAbstractSelectOne._setControlValue = function ()
	{
		//trace("_setControlValue:" + this._ctrlobjtype + this._ctrlobj + "<--" + this.value);

		if (this._ctrlobjtype && this._ctrlobj)
		{
			switch (this._ctrlobjtype)
			{
				case 1 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_COMBO*/: this._ctrlobj.set_value(this.value); break;
				case 2 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO*/: this._ctrlobj.set_value(this.value); break;
				case 3 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX*/: this._ctrlobj.set_value(this.value); break;
			}
		}
	};

	_pAbstractSelectOne._resetInnerBind = function ()
	{
		//trace("_resetInnerBind:" + this._ctrlobjtype + this._ctrlobj + "<--" + this.innerdataset + "-" + this.codecolumn + "," + this.datacolumn);

		// set innerbind
		if (this._ctrlobjtype && this._ctrlobj)
		{
			var ds = this._innerdataset? this._innerdataset : this.innerdataset;
			
			switch(this._ctrlobjtype)
			{
				case 1 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_COMBO*/: this._ctrlobj.set_innerdataset(ds); this._ctrlobj.set_codecolumn(this.codecolumn); this._ctrlobj.set_datacolumn(this.datacolumn); break;
				case 2 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_RADIO*/: this._ctrlobj.set_innerdataset(ds); this._ctrlobj.set_codecolumn(this.codecolumn); this._ctrlobj.set_datacolumn(this.datacolumn); break;
				case 3 /*nexacro._AbstractSelectOne_ControlConst.CTRLTYPE_LISTBOX*/: this._ctrlobj.set_innerdataset(ds); this._ctrlobj.set_codecolumn(this.codecolumn); this._ctrlobj.set_datacolumn(this.datacolumn); break;
			}			
		}
    };
    
    //_removeEventHandlerToInnerDataset
	
    //===============================================================
    // nexacro.AbstractSelectOne : Events
    //===============================================================
	
	_pAbstractSelectOne._setEventHandlerToControlComponent = function ()
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
					ctrlobj._setEventHandler(evt_id, listener._user_handlers[0].handler, listener._user_handlers[0].target);
			}
		}
	};

	/*
	_pAbstractSelectOne._onControlItemChanged = function (o, e)
	{
		this.value = e.postvalue;
		//trace("_onControlItemChanged - object : ", o, " / event : ",  e);
		this.on_fire_onitemchanged(o, e);
	};

	_pAbstractSelectOne.on_fire_onitemchanged = function (o, e)
	{
		if (this.onitemchanged && this.onitemchanged._has_handlers)
		{
			var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", e.preindex, e.pretext, e.prevalue, e.postindex, e.posttext, e.postvalue);
			
			return this.onitemchanged.fireEvent(this, evt);
		}
		return false;
	};

	_pAbstractSelectOne._onControlItemClick = function (o, e) {
		this.value = e.postvalue;
		//trace("_onControlItemClick - object : ", o, " / event : ", e);
		this.on_fire_onitemclick(o, e);
	};

	_pAbstractSelectOne.on_fire_onitemclick = function (o, e)
	{
		if (this.onitemclick && this.onitemclick._has_handlers)
		{
			var evt = new nexacro.ItemClickEventInfo(o, "onitemclick", e.preindex, e.pretext, e.prevalue, e.postindex, e.posttext, e.postvalue);
			this.onitemclick._fireEvent(this, evt);
		}

		return false;
	};
	*/

	//==============================================================================
	// nexacro.AbstractSelectOne : Style Part
	//==============================================================================

	// genie : 필요한가?
	_pAbstractSelectOne.on_get_css_assumedtypename = function ()
	{
		if (this.selectcombo)
			return "Combo";
		else if (this.selectradio)
			return "Radio";
		else if (this.selectlistbox)
			return "ListBox";

		return this._type_name; // genie : default return 값을 어떻게 가져갈까? 
	};


}