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

if (nexacro.Div)
{
    var _pDiv = nexacro.Div.prototype;
    _pDiv._getHeadingOrderNext = function (current, direction, filter_type)
    {
        return nexacro.FormBase.prototype._getHeadingOrderNext.call(this, current, direction, filter_type);
    };

    _pDiv._getHeadingOrderFirst = function (filter_type)
    {
       return nexacro.FormBase.prototype._getHeadingOrderFirst.call(this, filter_type);
    };

    _pDiv._getHeadingOrderLast = function (filter_type)
    {
        return nexacro.FormBase.prototype._getHeadingOrderLast.call(this, filter_type);
    };

    _pDiv._searchNextHeadingFocus = function (current, bSearchFromFirst, opt_force_cycle, filter_type)
    {
        var ret = nexacro.FormBase.prototype._searchNextHeadingFocus.call(this, current, bSearchFromFirst, opt_force_cycle, filter_type);
        if (bSearchFromFirst && ret && ret[0] === this.form)
        {
            return this.parent._searchNextHeadingFocus(this, undefined, undefined, filter_type);
        }

        return ret;
    };

    _pDiv._searchPrevHeadingFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
    {
       return nexacro.FormBase.prototype._searchPrevHeadingFocus.call(this, current, bSearchFromLast, opt_force_cycle, filter_type);
    };

    _pDiv._skip_mobile_tabfocus = true;
    _pDiv = null;
    delete _pDiv;
}

if (nexacro.Tab)
{
    var _pTab = nexacro.Tab.prototype;

    _pTab.on_get_accessibility_label = function ()
    {
        var label = this.text ? this.text : (this.name ? this.name : this.value);
        return label ? label : "";
    };

    _pTab._getHeadingOrderNext = function (current, direction, filter_type)
    {
        return nexacro.FormBase.prototype._getHeadingOrderNext.call(this, current, direction);
    };

    _pTab._getHeadingOrderFirst = function (filter_type)
    {
        return nexacro.FormBase.prototype._getHeadingOrderFirst.call(this, filter_type);
    };

    _pTab._getHeadingOrderLast = function (filter_type)
    {
        return nexacro.FormBase.prototype._getHeadingOrderLast.call(this, filter_type);
    };

    _pTab._searchNextHeadingFocus = function (current, bSearchFromFirst, opt_force_cycle, filter_type)
    {
        return nexacro.FormBase.prototype._searchNextHeadingFocus.call(this, current, bSearchFromFirst, opt_force_cycle, filter_type);
    };

    _pTab._searchPrevHeadingFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
    {
        return nexacro.FormBase.prototype._searchPrevHeadingFocus.call(this, current, bSearchFromLast, opt_force_cycle, filter_type);
    };

    _pTab._skip_mobile_tabfocus = true;
    _pTab = null;
    delete _pTab;
}

if (nexacro.FormBase)
{
    var _pFormBase = nexacro.FormBase.prototype;
    _pFormBase._isComponentKeydownAction  = function()
    {
        if (nexacro._enableaccessibility)
        {
            var _win = this._getWindow();
            if (_win && nexacro._accessibilitytype == 2 && _win._virtual_cursor_keydown == false)
            {
                return false;
            }
        }        
        return true;
    };

    _pFormBase._searchNextHeadingFocus = function (current, b_search_from_first, opt_force_cycle, filter_type)
    {
        if (filter_type === undefined)
            filter_type = 4;

        var opt_cycle = (opt_force_cycle == undefined) ? (nexacro._tabkeycirculation == 0) : opt_force_cycle;

        // my child중 누군가를 기준으로 탐색
        var ret, next;
        var my_tapstop_childs = this._getComponentsByTaborder(this, filter_type);
        var my_tabstop_child_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;

        var parent = this.parent;
        while ((parent && !parent._hasContainer() && !parent._is_frame))
        {
            parent = parent.parent;
        }

        if (my_tabstop_child_cnt > 0 && current && !b_search_from_first)
        {
            next = this._getHeadingOrderNext(current, 1, filter_type, true);
            if (opt_cycle && !next && this._isPopupVisible())
                next = this._getHeadingOrderFirst(filter_type, true);
            if (!next)
            {
                // 한바퀴 다 돈 경우
                var parent_tabstop_childs = parent._getComponentsByTaborder(parent, filter_type);
                var parent_tabstop_child_cnt = parent_tabstop_childs ? parent_tabstop_childs.length : 0;
                if (!opt_cycle && (parent._is_frame || this._is_window))
                {
                    // "마지막 컴포넌트 입니다."
                    ret = [null, this, 1];
                }
                else if (parent._hasContainer() && parent_tabstop_child_cnt > 0)
                {
                    ret = parent._searchNextHeadingFocus(this, false, opt_cycle, filter_type);
                }
                else
                {
                    next = this._getHeadingOrderFirst(filter_type, true);
                }
            }
        }
        else
        {
            // this 자체가 focus되어있는 경우
            next = this._getHeadingOrderFirst(filter_type, true);
            if (!next)
            {
                // 텅빈 div인 경우
                if (!nexacro._isNull(parent))
                {
                    ret = parent._searchNextHeadingFocus(this, false, opt_cycle, filter_type);
                }
                else
                {
                    ret = null;
                }
            }
        }

        if (next && !ret)
        {
            var next_tabstop_childs = (next._hasContainer() ? next._getComponentsByTaborder(next, filter_type) : null);
            var next_tabstop_child_cnt = next_tabstop_childs ? next_tabstop_childs.length : 0;
            if (next._hasContainer() && next._checkContainerHeadingFocus() == true && (filter_type & 4) && ((filter_type & 8) && next._isAccessibilityEnable()))
            {
                ret = [next];
            }
            else if (next._hasContainer() && next_tabstop_child_cnt > 0)
            {
                ret = next._searchNextTabFocus(null, true, undefined, filter_type);
            }
            else
            {
                ret = [next];
            }
        }
        
        return ret;
    };

    _pFormBase._searchPrevHeadingFocus = function (current, bSearchFromLast, opt_force_cycle, filter_type)
    {
        var opt_cycle = (opt_force_cycle == undefined) ? (nexacro._tabkeycirculation == 0) : opt_force_cycle;

        var ret, next;
        var my_tapstop_childs = this._getComponentsByTaborder(this, filter_type);
        var my_tabstop_child_cnt = my_tapstop_childs ? my_tapstop_childs.length : 0;

        var parent = this.parent;
        while ((parent && !parent._hasContainer() && !parent._is_frame))
        {
            parent = parent.parent;
        }

        if (my_tabstop_child_cnt && current && !bSearchFromLast)
        {
            next = this._getHeadingOrderNext(current, -1, filter_type, true);

            // PopupDiv 내부 순환
            if (opt_cycle && !next && this._isPopupVisible())
                next = this._getHeadingOrderLast(filter_type, true);
            if (!next)
            {
                // 한바퀴 다 돈 경우
                if (filter_type & 4 && parent._hasContainer())
                {
                    next = parent;
                }
                else
                {
                    var parent_tabstop_childs = parent._getComponentsByTaborder(parent, filter_type);
                    var parent_tabstop_child_cnt = parent_tabstop_childs ? parent_tabstop_childs.length : 0;
                    if (opt_cycle == false && (parent._is_frame || this._is_window))
                        ret = [null, this, -1];
                    else if (parent._hasContainer() && parent_tabstop_child_cnt > 0)
                        ret = parent._searchPrevHeadingFocus(this, undefined, undefined, filter_type);
                    else
                        next = this._getHeadingOrderLast(filter_type, true);
                }

            }
        }
        else
        {
            // Div인데 Child가 없거나, 
            // Div의 Next Comp에서 이동하는 경우..
            if (!bSearchFromLast)
            {
                if (this instanceof nexacro.PopupDiv)
                    next = this._getTabOrderHeadingLast(filter_type, true);
                else
                {
                    ret = parent._searchPrevHeadingFocus(this, undefined, undefined, filter_type);
                }
            }

            if (!ret)
            {
                next = this._getHeadingOrderLast(filter_type, true);
                if (!next && ret !== null)
                {
                    if (this._checkContainerHeadingFocus() == true)
                        ret = [this];
                    else
                    {
                        ret = parent._searchPrevHeadingFocus(this, undefined, undefined, filter_type);
                    }
                }
            }
        }

        if (next && !ret)
        {
            var next_tabstop_childs = (next._hasContainer() ? next._getComponentsByTaborder(next, filter_type) : null);
            var next_tabstop_child_cnt = next_tabstop_childs ? next_tabstop_childs.length : 0;
            if (next._hasContainer() && next_tabstop_child_cnt > 0)
            {
                if (this.parent === next)
                {
                    ret = next._searchPrevHeadingFocus(null, undefined, undefined, filter_type);
                }
                else
                    ret = next._searchPrevHeadingFocus(null, true, undefined, filter_type);
            }                
            else
                ret = [next];
        }

        return ret;
    };

    
    _pFormBase._getHeadingOrderLast = function (filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 4;

        var ar = this._getComponentsByTaborder(this, filter_type);
        if (ar && ar.length > 0)
        {
            var len = ar.length;
            var comp = null;
            for (var i = len - 1; i >= 0; i--)
            {
                comp = ar[i];
                if (comp._isAccessibilityRoleHeading())
                    break;
                else if (comp._hasContainer())
                {
                    comp = comp._getHeadingOrderLast(filter_type);

                    if (comp)
                        break;
                }
                comp = null;
            }
            return comp;
        }

        return null;
    };


    _pFormBase._getHeadingOrderFirst = function (filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 4;

        var ar = this._getComponentsByTaborder(this, filter_type);
        if (ar && ar.length > 0)
        {
                var len = ar.length;
                var comp = null;
                for (var i = 0; i < len; i++)
                {
                    comp = ar[i];
                    if (comp._isAccessibilityRoleHeading())
                        break;
                    else if (comp._hasContainer())
                    {
                        comp = comp._getHeadingOrderFirst(filter_type);

                        if (comp)
                            break;
                    }
                    comp = null;
                }

                return comp;
          }

        return null;
    };

    _pFormBase._getHeadingOrderNext = function (current, direction, filter_type)
    {
        if (nexacro._isNull(filter_type))
            filter_type = 4;

        var child = null;
        var ar = this._getComponentsByTaborder(this, filter_type);
        var cur_idx = nexacro._indexOf(ar, current._getRootComponent(current));
        if (cur_idx < 0)
            return null;


        var len = ar.length;
        var comp = null;
        var i;

        if (direction < 0)
        {
            for (i = cur_idx - 1; i >= 0; i--)
            {
                comp = ar[i];
                if (!comp._hasContainer() && comp._isAccessibilityRoleHeading())
                    break;
                else if (comp._hasContainer())
                {
                    child = comp._getHeadingOrderLast(filter_type);

                    if (child)
                    {
                        comp = child;
                        break;
                    }
                    else if (comp._isAccessibilityRoleHeading())
                        break;

                }

                comp = null;
            }
        }
        else
        {
            for (i = cur_idx + 1; i < len; i++)
            {
                comp = ar[i];
                if (!comp._hasContainer() && comp._isAccessibilityRoleHeading())
                    break;
                else if (comp._hasContainer())
                {
                    if (comp._isAccessibilityRoleHeading())
                        break;

                    child = comp._getHeadingOrderFirst(filter_type);

                    if (child)
                    {
                        comp = child;
                        break;
                    }
                }

                comp = null;
            }
        }
        return comp;

    };


    _pFormBase._skip_mobile_tabfocus = true;
    _pFormBase = null;
    delete _pFormBase;
}

if (nexacro.Form)
{
    var _pForm = nexacro.Form.prototype;

    _pForm._getPrevHeadingComponent = function (current)
    {
        var arcomp = this._searchPrevHeadingFocus(current, undefined, undefined, 15);     
        if (arcomp)
            return arcomp[0];
    };

    _pForm._getNextHeadingComponent = function (current)
    {
        var arcomp = null;
        if (current && current._hasContainer())
            arcomp = current._searchNextHeadingFocus(null, true, undefined, 15);
        else
            arcomp = this._searchNextHeadingFocus(current, undefined, undefined, 15);
        if (arcomp)
            return arcomp[0];
    };
    _pForm = null;
    delete _pForm;
}

if (nexacro.Radio)
{
    var _pRadio = nexacro.Radio.prototype;
    _pRadio._skip_mobile_tabfocus = true;
    _pRadio.on_get_accessibility_label = function ()
    {
        if (!this._is_first_focus)
        {
            var label = this.text ? this.text : (this.name ? this.name : this.value);
        }
        return label ? label : "";
    };

    _pRadio._on_getAccessibilityAdditionalLabel = function ()
    {
        if (this._isAccessibilityEnable() && !this._is_first_focus)
        {
            var count = 0;
            var items = this._items;
            if (items)
                count = items.length;
            return (+this.index + 1) + " " + count; //2014-06-23 pss [REQ_35826] - index + 1
        }
        return "";
    };

    _pRadio._on_getAccessibilityAdditionalRole = function ()
    {
        var _role = "";
        if (!this._is_first_focus && this._getAccessibilityRole(this.accessibility == "radio"))
        {
            _role = " radio";
        }
        return _role;
    };

    _pRadio.set_itemaccessibilityenable = function (accessibilityenable)
    {
        var accenable = nexacro._toBoolean(accessibilityenable);
        if (this.itemaccessibilityenable != accenable)
        {
            this.itemaccessibilityenable = accenable;
            this.on_apply_prop_itemaccessibilityenable();
        }
    };

    _pRadio.on_apply_prop_itemaccessibilityenable = function ()
    {
        var items = this._items;
        var item_len = items.length;
        this._block_read_aria_stat = this.itemaccessibilityenable == false ? true : false;
        for (var i = 0; i < item_len; i++)
        {
            var item = items[i];
            item.accessibilityenable = this.itemaccessibilityenable;
            item._setAccessibilityStatHidden(this._block_read_aria_stat);
        }
    };

    _pRadio = null;
}

if (nexacro._RadioItemControl)
{
    _pRadioItemControl = nexacro._RadioItemControl.prototype;
    _pRadioItemControl._getAccessibilityLabel = function (accessibility)
    {
        var label = "";
        if (this.parent._is_first_focus)
        {
            var parent = this.parent;
            var p_accessibility = parent.accessibility;
            label = parent._getAccessibilityParentValue(p_accessibility);
        }
        label += " " + nexacro.Component.prototype._getAccessibilityLabel.call(this, accessibility);
        return label;
    };

	_pRadioItemControl._on_getAccessibilityAdditionalLabel = function ()
	{
		if (this._isAccessibilityEnable() && !this.parent._is_first_focus)
		{
			// additional fix.
			if (this._index > -1)
			{
				return (+this._index + 1) + " " + this.parent._items.length;
			}
		}
		return "";
	};

    _pRadioItemControl = null;
}

if (nexacro.Edit)
{
    var _pEdit = nexacro.Edit.prototype;
    if (nexacro._Browser != "Runtime")
    {
        //RP : 74932
        if (nexacro._accessibilitytype == 4)
        {
            _pEdit.on_attach_contents_handle = function (win)
            {
                var input_elem = this._input_element;
                if (input_elem)
                {
                    input_elem.attachHandle(win);

                    if (nexacro._isNull(this.value))
                    {
                        this._changeUserStatus("nulltext", true);
                    }
                }
             //   if ((!(this.accessibilitydesclevel == "none") && !(this.accessibilitydesclevel == "child")))
             //       this._setAccessibilityActiveDescendant(this._input_element);
            };

            _pEdit.on_created_contents = function (win)
            {
                var input_elem = this._input_element;
                if (input_elem)
                {
                    this.on_apply_value(this.value);

                    input_elem.create(win);
                    this.set_usesoftkeyboard(this.usesoftkeyboard, true);

                    if (nexacro._isNull(this.value))
                    {
                        this._changeUserStatus("nulltext", true);
                    }
                }
             //   if ((!(this.accessibilitydesclevel == "none") && !(this.accessibilitydesclevel == "child")))
             //       this._setAccessibilityActiveDescendant(this._input_element);
            };

            _pEdit._on_getAccessibilityAdditionalLabel = function ()
            {
                //return this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
            	return "";
            };
        }
        else
        {
        	_pEdit._on_getAccessibilityAdditionalLabel = function ()
        	{        	    
        		var strAdditionalLabel = "";

        		if (!this.text)
        			strAdditionalLabel = this.displaynulltext ? this.displaynulltext : "";

        		return strAdditionalLabel;
        	};
        }
        /*else
        {
            _pEdit._on_getAccessibilityAdditionalLabel = function ()
            {
                if (this.enable)
                    return this.text ? this.text : this.displaynulltext ? this.displaynulltext : "";
                return "";
            };
        }*/
    }
    else //Runtime
    {
        _pEdit.on_get_accessibility_label = function ()
        {
            return "";
        };

        _pEdit._on_getAccessibilityAdditionalLabel = function ()
        {
            if (this._onlydisplay)
            {
                var strAdditionalLabel = "";

                if (!this.text)
                    strAdditionalLabel = this.displaynulltext ? this.displaynulltext : "";

                return strAdditionalLabel;
            }
            else
            {
                var input_elem = this._input_element;
                if (input_elem)
                {
                    if (input_elem.inputtype == "password")
                    {
                        this._setAccessibilityFlagPassword(true);
                        return this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
                    }
                }

                return this.text ? this.text : this.displaynulltext ? this.displaynulltext : "";
            }
        };
    }
    _pEdit = null;
    delete _pEdit;
}

if (nexacro.Combo)
{
    var _pCombo = nexacro.Combo.prototype;
    _pCombo._is_compound = true;

    if (nexacro._OS != "Runtime")
    {
        if (nexacro._accessibilitytype == 5)
        {
            _pCombo._apply_setfocus = function (evt_name)
            {
                var comboedit = this.comboedit;
                if (comboedit)
                {
                    comboedit._changeStatus("focused", true);

                    var control_elem = this.getElement();
                    if (control_elem && nexacro._isTouchInteraction && nexacro._SupportTouch)
                    {
                        //control_elem.setElementFocus(true);
                        if (evt_name !== undefined)
                        {
                            control_elem.setElementFocus(true);
                        }
                        else
                        {
                            setTimeout(this._on_accessibility_lazy_focus, 30, control_elem, true);
                        }
                    }
                    else
                    {
                        comboedit.on_focus_basic_action(true, evt_name);
                    }
                }
            };

            _pCombo._on_accessibility_lazy_focus = function (elem, bool)
            {
                elem.setElementFocus(bool);
            };
        }        
    }

    if (nexacro._OS == "Android" || nexacro._Browser == "Runtime")
    {
        _pCombo._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.text ? this.text : this.displaynulltext ? this.displaynulltext : "";
        };
    }
    else
    {
        _pCombo._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
        };
    }
   
    _pCombo = null;
}

if (nexacro._ComboListControl)
{
    var _pComboListControl = nexacro._ComboListControl.prototype;
    _pComboListControl._setAccessibilityStatFlag = function (status, userstatus)
    {
        if (status == "enable")
        {
            this._setAccessibilityStatDisabled(false);
        }
        if (status == "disabled")
        {
            this._setAccessibilityStatDisabled(true);
        }
        else if (status == "readonly")
        {
            this._setAccessibilityFlagReadOnly(true);
        }
    };

    _pComboListControl = null;
}

if (nexacro._ComboEditControl)
{
    var _pComboEditControl = nexacro._ComboEditControl.prototype;

    _pComboEditControl.on_created_contents = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            this.on_apply_value(this.value);

            input_elem.create(win);

            if (nexacro._isNull(this.value))
            {
                this._changeUserStatus("nulltext", true);
            }

            //동작하지않음
            if (nexacro._enableaccessibility && nexacro._accessibilitytype != 2)
            {
                if (this.parent.type == "dropdown" && !this.parent.readonly)
                {
                    input_elem.setElementAccessibilityRole(this.parent.accessibilityrole);
                    if (nexacro._Browser == "Chrome" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "WebKit"))
                    {
                        if (this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
                            this._setAccessibilityActiveDescendant(input_elem);
                    }
                }
            }
        }
    };

    _pComboEditControl.on_attach_contents_handle = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.attachHandle(win);

            if (nexacro._isNull(this.value))
            {
                this._changeUserStatus("nulltext", true);
            }
            if (nexacro._enableaccessibility)
            {
				var combo = this.parent;
				if (combo && !combo.readonly)
                {
					// WAI-ARIA 1.2부터 input에 직접 마크업 하도록 변경
					var owns_list = combo._unique_id + ".combolist";
                    input_elem.setElementAccessibilityOwns(owns_list);
                    input_elem.setElementAccessibilityStatAutoComplete("list");
                    input_elem.setElementAccessibilityStatExpanded(false);
                    input_elem.setElementAccessibilityFlagHasPopup("listbox");

					// combo에서 설정하는 것을 옮김
					if (!nexacro._isDesktop())
					{
						this._setAccessibilityStatHidden(true);
					}
					if (combo.type === "dropdown")
					{
						this._setAccessibilityReadOnly(false);
					}
                    //-------------------------------------------

					// 필요없음 (가상커서 꺼지고는 어떤지 체크 필요)
					if (nexacro._accessibilitytype != 2)
                    {
                        input_elem.setElementAccessibilityRole(this.parent.accessibilityrole);
						if (nexacro._Browser == "Chrome" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "WebKit"))
						{
							if (this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
								this._setAccessibilityActiveDescendant(input_elem);
						}
					}
				}
            }
        }
    };

    if (nexacro._Browser == "Runtime")
    {
        _pComboEditControl._getAccessibilityRole = function ()
        {
            if (this._is_subfocused == true)
            {
                this._setAccessibilityRole("none");
                return "";
            }
            else
            {
                this._setAccessibilityRole("combobox");
                return this.parent.accessibilityrole ? this.parent.accessibilityrole : "combobox";
            }
        };
    }
    else
	{
        _pComboEditControl._setAccessibilityReadOnly = function (v)
        {
            var input_elem = this._input_element;
            if (input_elem)
            {
                input_elem.setElementAccessibilityFlagReadOnly(v);
            }
        };
    }

    _pComboEditControl._getAccessibilityLabel = function ()
    {
        var label = "";
        return (label = this._getLinkedLabel(this.parent.accessibilitylabel)) ? label : this.parent.on_get_accessibility_label();
    };

    _pComboEditControl._getAccessibilityDescription = function ()
    {
        var description = "";
        return (description = this._getLinkedDescription(this.parent.accessibilitydescription)) ? description : this.parent.on_get_accessibility_description();
    };

    _pComboEditControl._getAccessibilityAction = function ()
    {
        var action = this._getLinkedAction(this.parent.accessibilityaction);
        return action ? action : (action = this.on_get_accessibility_action()) ? action : "";
    };

    _pComboEditControl.on_get_accessibility_label = function ()
    {
        return "";
    };

    if (nexacro._Browser == "MobileSafari")
    {
        _pComboEditControl._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.value ? "" : this.displaynulltext ? this.displaynulltext : "";
        };
    }
    else if (nexacro._Browser == "Runtime")
    {
        _pComboEditControl._on_getAccessibilityAdditionalLabel = function () 
        {
            if (this._is_subfocused == true) 
            {
                this._setAccessibilityRole("none");
                return "";
            }
            else 
            {
                this._setAccessibilityRole("combobox");
                return this.value ? this.value : this.displaynulltext ? this.displaynulltext : "";
            }
        };
    }
    else
    {
        _pComboEditControl._on_getAccessibilityAdditionalLabel = function ()
        {
            //if (!this.text)
            //    return this.displaynulltext ? this.displaynulltext : "";
            return this.parent._on_getAccessibilityAdditionalLabel();
        };
    }
    _pComboEditControl = null;
    delete _pComboEditControl;
}

if (nexacro._ComboListItemControl)
{
    var _pComboListItemControl = nexacro._ComboListItemControl.prototype;

    /* 이중 출력 문제 수정 */
    _pComboListItemControl.on_get_accessibility_label = function ()
    {
        return "";
    };

    _pComboListItemControl = null;
    delete _pComboListItemControl
};

if (nexacro.Calendar)
{
    var _pCalendar = nexacro.Calendar.prototype;
    if (nexacro._accessibilitytype == 4)
    {
        _pCalendar._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.displaynulltext ? this.displaynulltext : "";
        };
    }
    else if (nexacro._accessibilitytype == 5)
    {
        _pCalendar._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.value ? this.value : this.displaynulltext ? this.displaynulltext : "";
        };
    }	
    else if (nexacro._Browser != "Runtime")
    {
		_pCalendar.on_attach_contents_handle = function (win)
		{
            if (this.calendaredit)
            {
                this.calendaredit.attachHandle(win);
            }
            if (this.dropbutton)
            {
                this.dropbutton.attachHandle(win);
            }
            if (this.calendarspindownbutton)
            {
                this.calendarspindownbutton.attachHandle(win);
            }
            if (this.calendarspinupbutton)
            {
                this.calendarspinupbutton.attachHandle(win);
            }
            if (this.datepicker)
            {
                this.datepicker.attachHandle(win);
            }

            this.on_apply_displaynulltext(this.displaynulltext);
            this.on_apply_displayinvalidtext(this.displayinvalidtext);

            if (nexacro._enableaccessibility)
            {
                if (this._type == "monthonly")
                {
                    this._setAccessibilityRole("datepicker");
                    this._accessibilityvalue = this._masktypeobj.applyMask(this.datepicker.body.on_get_accessibility_label());
                }
				else
				{
					if (nexacro._Browser == "IE" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "Edge"))
						this.calendaredit._setAccessibilityStatHidden(true);
                    if (this.calendarspindownbutton)
                        this.calendarspindownbutton._setAccessibilityStatHidden(true);
					if (this.calendarspinupbutton)
                        this.calendarspinupbutton._setAccessibilityStatHidden(true);

                    var owns_list = this._unique_id + ".calendarpopup";
                    this._setAccessibilityOwns(owns_list);

					if (this.dropbutton)
					{
                        this.dropbutton._setAccessibilityStatHidden(true);
                    }
                }
			}

			this._default_value = this.value;
			this._default_text = this.text;
		};        

		_pCalendar._on_getAccessibilityAdditionalLabel = function ()
		{
			return this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
        };
	}

    _pCalendar = null;
}

if (nexacro._CalendarEditControl)
{
    var _pCalendarEditControl = nexacro._CalendarEditControl.prototype;

    _pCalendarEditControl.on_created_contents = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            this.on_apply_value(this.value);

            input_elem.create(win);

            this.on_apply_displaynulltext(this.displaynulltext);
            this.on_apply_displayinvalidtext(this.displayinvalidtext);

            if (nexacro._isNull(this.value))
            {
                this._changeUserStatus("nulltext", true);
            }
            if (nexacro._enableaccessibility)
                input_elem.setElementAccessibilityRole(this.accessibilityrole);
        }
    };

    _pCalendarEditControl.on_attach_contents_handle = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            input_elem.attachHandle(win);

            this.on_apply_displaynulltext(this.displaynulltext);
            this.on_apply_displayinvalidtext(this.displayinvalidtext);

            if (nexacro._isNull(this.value))
            {
                this._changeUserStatus("nulltext", true);
			}
			if (nexacro._enableaccessibility)
				input_elem.setElementAccessibilityRole(this.accessibilityrole);
		}
    };

    _pCalendarEditControl._getAccessibilityLabel = function ()
    {
        var label = "";
        return (label = this._getLinkedLabel(this.parent.accessibilitylabel)) ? label : this.parent.on_get_accessibility_label();
    };

    _pCalendarEditControl._getAccessibilityDescription = function ()
    {
        var description = "";
        return (description = this._getLinkedDescription(this.parent.accessibilitydescription)) ? description : this.parent.on_get_accessibility_description();
    };

    _pCalendarEditControl._getAccessibilityAction = function ()
    {
        var action = this._getLinkedAction(this.parent.accessibilityaction);
        return action ? action : (action = this.on_get_accessibility_action()) ? action : "";
    };

    _pCalendarEditControl.on_get_accessibility_label = function ()
    {
        return "";
    };

    //check
    if (nexacro._accessibilitytype == 4 || nexacro._accessibilitytype == 5)
    {
        _pCalendarEditControl._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.value ? this.value : this.displaynulltext ? this.displaynulltext : "";
        };
    }
    else if (nexacro._Browser == "Runtime")
    {
        _pCalendarEditControl._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.parent._on_getAccessibilityAdditionalLabel();
        };
    }

    _pCalendarEditControl = null;
    delete _pCalendarEditControl;
}

if (nexacro._CalendarDropButtonControl)
{
    var _pCalendarDropButtonControl = nexacro._CalendarDropButtonControl.prototype;

    _pCalendarDropButtonControl.onCreatedAfter = function (resultCreated)
    {
        nexacro.Component.prototype.onCreatedAfter.call(this, resultCreated);
        if (resultCreated && nexacro._enableaccessibility && nexacro._accessibilitytype === 2)
        {
            this._setAccessibilityStatHidden(true);
        }
    };

    _pCalendarDropButtonControl = null;
    delete _pCalendarDropButtonControl;
};

if (nexacro._SpinEditControl)
{
    var _pSpinEditControl = nexacro._SpinEditControl.prototype;
    _pSpinEditControl.accessibilityrole = "spinbutton";

    if (nexacro._accessibilitytype == 4 || nexacro._accessibilitytype == 5)
    {
        _pSpinEditControl.on_get_accessibility_label = function ()
        {
            return "";
        };

        _pSpinEditControl._on_getAccessibilityAdditionalLabel = function ()
        {
            return "";//this.parent._on_getAccessibilityAdditionalLabel();
        };

    }

    _pSpinEditControl.on_attach_contents_handle = function (win)
    {
        nexacro.MaskEdit.prototype.on_attach_contents_handle.call(this, win);

        var _spin = this.parent;
        var input_elem = this._input_element;
        if (input_elem && _spin)
        {
            input_elem.setElementAccessibilityRole(this.accessibilityrole);            
            input_elem.setElementAccessibilityInfoValueMax(_spin.max);
            input_elem.setElementAccessibilityInfoValueMin(_spin.min);
            input_elem.setElementAccessibilityInfoValueCur(_spin.value);

            if (nexacro._accessibilitytype != 2)
            {
                if (this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
                {
                    input_elem.setElementAccessibilityActiveDescendant(_spin._unique_id);
                }
            }
            else
            {
                if (nexacro._accessibilitytype == 5)
                {
                    this._setAccessibilityStatHidden(true);
                }
            }
        }
    }

    _pSpinEditControl._getAccessibilityLabel = function ()
    {
        var label = "";
        return (label = this._getLinkedLabel(this.parent.accessibilitylabel)) ? label : this.parent.on_get_accessibility_label();
    };

    _pSpinEditControl._getAccessibilityDescription = function ()
    {
        var description = "";
        return (description = this._getLinkedDescription(this.parent.accessibilitydescription)) ? description : this.parent.on_get_accessibility_description();
    };

    _pSpinEditControl._getAccessibilityAction = function ()
    {
        var action = this._getLinkedAction(this.parent.accessibilityaction);
        return action ? action : (action = this.parent.on_get_accessibility_action()) ? action : "";
    };

    _pSpinEditControl = null;
    delete _pSpinEditControl;
}

if (nexacro.TextArea)
{
    var _pTextArea = nexacro.TextArea.prototype;
    if (nexacro._Browser == "Runtime")
    {
        _pTextArea._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.text ? this.text : this.displaynulltext ? this.displaynulltext : "";
        };

    }
    else if (nexacro._accessibilitytype == 4)
    {
        //_pTextArea._skip_mobile_tabfocus = true;
        _pTextArea._on_getAccessibilityAdditionalLabel = function ()
        {
            //if (this.enable)
            //    return this.value ? "" : this.displaynulltext ? this.displaynulltext : "";
            return "";
        };
    }
    else
    {
        _pTextArea._on_getAccessibilityAdditionalLabel = function ()
        {
            if (nexacro._accessibilitytype == 2)
            {                
                return this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
            }
            else if(this.enable)
                return this.text ? this.text : this.displaynulltext ? this.displaynulltext : "";
            return "";
        };
    }
    _pTextArea = null;
    delete _pTextArea;
}

if (nexacro.MaskEdit)
{
    var _pMaskEdit = nexacro.MaskEdit.prototype;
    if (nexacro._accessibilitytype == 4)
    {
        _pMaskEdit.on_get_accessibility_label = function ()
        {
            var label = "";
            //label = this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
            return label;
        };
        _pMaskEdit._on_getAccessibilityAdditionalLabel = function ()
        {
            return "";//this.text ? "" : this.displaynulltext ? this.displaynulltext : "";
        };
    }    
    else if (nexacro._Browser == "Runtime")
    {
        _pMaskEdit.on_get_accessibility_label = function ()
        {
            return "";
        };
        _pMaskEdit._on_getAccessibilityAdditionalLabel = function ()
        {
            return this.text ? this.text : this.displaynulltext ? this.displaynulltext : "";
        };
    }
	else if (nexacro._Browser == "Chrome" || nexacro._Browser == "Gecko" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "WebKit"))
    {
        _pMaskEdit._on_getAccessibilityAdditionalLabel = function ()
        {
            return "";
        };
    }    

    _pMaskEdit = null;
    delete _pMaskEdit;
}

if (nexacro.ListBox)
{
    var _pListBox = nexacro.ListBox.prototype;
    
    _pListBox._skip_mobile_tabfocus = true;    

    _pListBox.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)    
	{
		var item;
		var accIdx = this._accessibility_index;
		var rowcount = this._getInnerdatasetInfo("_rowcount");

		if (keycode == nexacro.Event.KEY_UP)
		{
			if (accIdx < 0)
			{
				this._want_arrow = false;
			}
			else
			{
				this._accessibility_index = accIdx += -1;
				this._refreshScroll(accIdx, shift_key ? 1 : 0);
				item = this._getItem(accIdx);
				if (item)
					item._on_focus(true);
				else
				{
					if (accIdx == -1)
					{
                        if (this._isAccessibilityEnable())
                        {
                            var last_focused = this._last_focused;
                            if (last_focused)
                                this._do_defocus(last_focused, true);
                            else
                                this._do_defocus(this);

                            this._on_focus(true);
                        }
                        else
                        {
                            this._want_arrow = false;
                        }
					}
				}
			}
		}
		else if (keycode == nexacro.Event.KEY_DOWN)
		{
			if ((accIdx + 1) >= rowcount)
			{
				this._want_arrow = false;
			}
			else
			{
				this._accessibility_index = accIdx += 1;
				this._refreshScroll(accIdx, shift_key ? 1 : 0);
				item = this._getItem(accIdx);
				if (item)
					item._on_focus(true);
			}
		}
		else if (keycode == nexacro.Event.KEY_PAGE_UP)
		{
			if (accIdx < 0)
			{
				this._want_arrow = false;
			}
			else
			{
				accIdx = accIdx < 0 ? 0 : accIdx;
				this._accessibility_index = accIdx -= this._page_rowcount;
				this._refreshScroll(accIdx, shift_key ? 1 : 0, keycode);
				item = this._getItem(accIdx);
				if (item)
					item._on_focus(true);
				else
				{
					if (accIdx == -1)
					{
						if (this._isAccessibilityEnable())
						{
							var last_focused = this._last_focused;
							if (last_focused)
								this._do_defocus(last_focused, true);
							else
								this._do_defocus(this);

							this._on_focus(true);
						}
						else
							this._want_arrow = false;

					}
				}
			}
		}
		else if (keycode == nexacro.Event.KEY_PAGE_DOWN)
		{
			if ((accIdx + this._page_rowcount) > rowcount)
			{
				this._want_arrow = false;
			}
			else
			{
				accIdx = accIdx < 0 ? 0 : accIdx;
				this._accessibility_index = accIdx += this._page_rowcount;
				this._refreshScroll(accIdx, shift_key ? 1 : 0, keycode);
				item = this._getItem(accIdx);
				if (item)
					item._on_focus(true);
			}
		}
		else if (keycode == nexacro.Event.KEY_HOME)
		{
			if (accIdx < 0)
			{
				this._want_arrow = false;
			}
			else
			{
				this._accessibility_index = accIdx = 0;
				this._refreshScroll(accIdx, shift_key ? 1 : 0, keycode);
				item = this._getItem(accIdx);
				if (item)
					item._on_focus(true);
			}
		}
		else if (keycode == nexacro.Event.KEY_END)
		{
			if ((accIdx + this._page_rowcount) > rowcount)
			{
				this._want_arrow = false;
			}
			else
			{
				this._accessibility_index = accIdx = rowcount - 1;
				this._refreshScroll(accIdx, shift_key ? 1 : 0, keycode);
				item = this._getItem(accIdx);
				if (item)
					item._on_focus(true);
			}
		}

		return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
	};

    _pListBox.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp)
    {
        if (this.readonly)
            return;

        var rowcount = this._getInnerdatasetInfo("_rowcount");
        if (!rowcount)
            return;

        this._shiftKey = shift_key;
        this._ctrlKey = ctrl_key;
        this._altKey = alt_key;

        if (!this._shiftKey)
        {
            this._shift_select_base_index = this.index;
        }

        this._last_keydown_keycode = keycode;

        if (keycode == nexacro.Event.KEY_UP)
        {
            if (ctrl_key)
            {
                this._do_scroll("up");
                return true;
            }
        }
        else if (keycode == nexacro.Event.KEY_DOWN)
        {
            if (ctrl_key)
            {
                this._do_scroll("down");
                return true;
            }
        }
        else if (keycode === nexacro.Event.KEY_SPACE  || keycode === nexacro.Event.KEY_ENTER)
        {            
            if (!this.multiselect)            
            {
                var nextidx = this._accessibility_index;
                if (nextidx > -1)
                {
                    if (this._changeIndex(nextidx))
                    {
                        if (this._last_focused)
                            this._do_defocus(this._last_focused);
                        this.on_apply_index(nextidx);

                        var item = this._getItem(nextidx);
                        item._setAccessibilityActiveDescendant(this.getElement());
                    }
                }
            }
        }
    };

    _pListBox._accessibility_focusin = function (refer_comp, related_comp)
    {
        if (refer_comp instanceof nexacro._ListBoxItemControl)
        {
            if (!(related_comp instanceof nexacro.ListBox))
            {
                this._first_focus = true;
            }

            refer_comp._on_focus(true);            
        }
    };

    _pListBox._accessibility_keyaction = function (elem, refer_comp, keycode, alt_key, ctrl_key, shift_key, meta_key)
    {
        var index = refer_comp.index;
        if (this._first_focus)
        {
            if (keycode == nexacro.Event.KEY_TAB || keycode == nexacro.Event.KEY_DOWN)
            {
                this._accessibility_index = -1;
            }
            else if ((keycode == nexacro.Event.KEY_TAB && shift_key) || keycode == nexacro.Event.KEY_UP)
			{
                this._accessibility_index = this._getInnerdatasetInfo("_rowcount");
			}
            this._first_focus = false;
        }
        var ret = nexacro.Component.prototype._accessibility_keyaction.call(this, elem, refer_comp, keycode, alt_key, ctrl_key, shift_key, meta_key);
        return ret;
    };

    _pListBox._apply_setfocus = function (evt_name)
    {
        var win = this._getWindow();
        var elem = this.getElement();
        if (win && elem && elem.handle)
        {
            // 가상커서에 따른 tabindex 동적 변경
            if (win._virtual_cursor_keydown)
            {
                elem._refreshControlTabIndex(elem.handle, -1);
            }
            else
            {
                elem._refreshControlTabIndex(elem.handle, null);
            }
        }
        nexacro.Component.prototype._apply_setfocus.call(this, evt_name);
    };    
    _pListBox = null;
    delete _pListBox;
}

if (nexacro._ListBoxItemControl)
{
    var _pListBoxItemControl = nexacro._ListBoxItemControl.prototype;
    _pListBoxItemControl.on_keydown_default_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp)
    {
        if (nexacro._enableaccessibility)
        {
            var listbox = this.parent;
            if (listbox)
            {
                listbox.on_keydown_default_action(keycode, alt_key, ctrl_key, shift_key, refer_comp);
            }
        }
    };
    _pListBoxItemControl = null;
    delete _pListBoxItemControl;
}

if (nexacro.WebBrowser)
{
    var _pWebBrowser = nexacro.WebBrowser.prototype;

    _pWebBrowser._skip_mobile_tabfocus = true;

    _pWebBrowser = null;
    delete _pWebBrowser;
}
if (nexacro.WebView)
{
	var _pWebView = nexacro.WebView.prototype;

	_pWebView._skip_mobile_tabfocus = true;

	_pWebView = null;
	delete _pWebView;
}
if (nexacro.FileUpload)
{
    var _pFileUpload = nexacro.FileUpload.prototype;
    
    _pFileUpload._skip_mobile_tabfocus = true;

    _pFileUpload = null;
    delete _pFileUpload;
}

if (nexacro._FileUploadItemControl)
{
    var _pFileUploadItemControl = nexacro._FileUploadItemControl.prototype;
    
    _pFileUploadItemControl._skip_mobile_tabfocus = true;

    _pFileUploadItemControl = null;
    delete _pFileUploadItemControl;
}

if (nexacro.Grid)
{
    var _pGrid = nexacro.Grid.prototype;
    
    _pGrid._skip_mobile_tabfocus = true;
	_pGrid._accessibility_focusin = function (refer_comp, related_comp)
    {   
        if (!this._accept_arrow)
        {
            nexacro.Component.prototype._accessibility_focusin.call(this, refer_comp, related_comp);
        }

        if (refer_comp)
        {
			if (refer_comp instanceof nexacro._CellControl)
			{
				this._moveToPosCell(refer_comp._rowidx, refer_comp._cellidx);
			}
        }
	};

    _pGrid._accessibility_focusout = function (refer_comp, related_comp)
    {        
        this._accept_arrow = false;
    };
    _pGrid = null;
    delete _pGrid;
}

if (nexacro._GridBandControl)
{
    var _pGridBandControl = nexacro._GridBandControl.prototype;
    
    _pGridBandControl._skip_mobile_tabfocus = true;

    _pGridBandControl = null;
    delete _pGridBandControl;
}

if (nexacro._GridRowControl)
{
    var _pGridRowControl = nexacro._GridRowControl.prototype;
    
    _pGridRowControl._skip_mobile_tabfocus = true;

    _pGridRowControl = null;
    delete _pGridRowControl;
}

//nexacro._CellEditControl
if (nexacro._CellEditControl)
{    
    var _pCellEditControl = nexacro._CellEditControl.prototype;
    _pCellEditControl._skip_mobile_tabfocus = true;
    _pCellEditControl.accessibilityrole = "gridcell";

    _pCellEditControl.on_created_contents = function (win)
    {
        var input_elem = this._input_element;
        if (input_elem)
        {
            this.on_apply_value(this.value);
            input_elem.create(win);

            if (nexacro._Browser == "Runtime" && nexacro._enableaccessibility)
            {
                nexacro._flushCommand(win);
            }
            if (nexacro._isNull(this.value))
            {
                this._changeUserStatus("nulltext", true);
            }
            if (nexacro._OS == "iOS" && this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
                this._setAccessibilityActiveDescendant(input_elem, this.parent);
        }
    };

    _pCellEditControl.on_attach_contents_handle = function (win)
    {
        nexacro.Edit.prototype.on_attach_contents_handle.call(this, win);
        if (nexacro._OS == "iOS" && this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
            this._setAccessibilityActiveDescendant(this._input_element, this.parent);
    };

    _pCellEditControl = null;
    delete _pCellEditControl;
}

//nexacro._CellTextAreaControl
if (nexacro._CellTextAreaControl)
{
    var _pCellTextAreaControl = nexacro._CellTextAreaControl.prototype;


    _pCellTextAreaControl = null;
    delete _pCellTextAreaControl;
}

if (nexacro._CellImageControl)
{
    var _pCellImageControl = nexacro._CellImageControl.prototype;
    

    _pCellImageControl = null;
    delete _pCellImageControl;
}

//nexacro._CellMaskEditControl
if (nexacro._CellMaskEditControl)
{
    var _pCellMaskEditControl = nexacro._CellMaskEditControl.prototype;


    _pCellMaskEditControl = null;
    delete _pCellMaskEditControl;
}

//nexacro._CellCalendarControl
if (nexacro._CellCalendarControl)
{
    var _pCellCalendarControl = nexacro._CellCalendarControl.prototype;

	if (nexacro._Browser == "IE" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "Edge"))
    {
        _pCellCalendarControl._setAccessibilityInputLabel = function (label)
        {
            var calendaredit = this.calendaredit;
            if (calendaredit)
            {
                var input_elem = calendaredit._input_element;
                if (input_elem && input_elem._setAccessibilityLabel)
                    input_elem._setAccessibilityLabel(label);
            }
        };
    }

    _pCellCalendarControl = null;
    delete _pCellCalendarControl;
}

// nexacro._CellComboControl

if (nexacro._CellComboControl)
{
    var _pCellComboControl = nexacro._CellComboControl.prototype;
	if (nexacro._Browser == "IE" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "Edge"))
    {
        _pCellComboControl._setAccessibilityInputLabel = function (label)
        {
            var comboedit = this.comboedit;
            if (comboedit)
            {
                var input_elem = comboedit._input_element;
                if (input_elem && input_elem._setAccessibilityLabel)
                    input_elem._setAccessibilityLabel(label);
            }
        };
    }

    _pCellComboControl = null;
    delete _pCellComboControl;
}

//nexacro._CellControl
if (nexacro._CellControl)
{
    var _pCellControl = nexacro._CellControl.prototype;
    _pCellControl.on_get_accessibility_label = function ()
    {
        var usedecoratetext = false;
        if (this._refinfo)
        {
            var dt = this._refinfo.displaytype;
            if (dt == "checkboxcontrol" || dt == "radioitemcontrol")
                return "";

            usedecoratetext = (dt == "decoratetext" ? true : false);
        }

        var label = "";
        if (!this._isEditable() || !this._editor || !this._editor._has_inputElement)
            label = this._getDisplayText();
        if (usedecoratetext)
            return nexacro._getDisplayTextfromDecorateText(label);
        return label;
    };

    _pCellControl.on_apply_accessibility = function ()
    {
        nexacro.Component.prototype.on_apply_accessibility.call(this);

        if (this._subComp)
        {
            this._subComp.on_apply_accessibility();
        }
    };
    
    _pCellControl.on_apply_prop_accessibilityrole = function ()
    {
        nexacro.Component.prototype.on_apply_prop_accessibilityrole.call(this);
        var subcomp = this._subComp;
        if (subcomp)
        {
            var role = this._getAccessibilityRole();
            subcomp.set_accessibilityrole(role ? role : this.accessibilityrole);
        }        
    };

    _pCellControl._setAccessibilityStatExpanded = function (expanded)
    {
        nexacro.Component.prototype._setAccessibilityStatExpanded.call(this, expanded);

        var subcomp = this._subComp;
        if (subcomp)
        {
            subcomp._setAccessibilityStatExpanded(expanded);
        }
    };

    _pCellControl._setAccessibilityStatLive = function (v)
    {
        this._accessibilitylive = v;
        var subcomp = this._subComp;
        if (subcomp)
        {
            subcomp._setAccessibilityStatLive(v);
        }
    };    

    _pCellControl._getAccessibilityRoleParentType = function () { };// parent 구조에 따라 다르므로 재정의하여 사용.

    _pCellControl._getAccessibilityRole = function ()
    {
        var role = this.accessibilityrole;

        if (role === "gridcell")
        {
            var _role = this._getAccessibilityRoleParentType();

            if (_role)
                role = _role;

            if (this._curDisplayType === "treeitemcontrol")
                role = "treeitem";
            else if (this._subComp)
                role = this._subComp._getAccessibilityRole();
        }
        else if (role === "calendar")
        {
            role = "edit";
        }
        return role;
    };    

    _pCellControl._setAccessibilityStatFocus = function ()
    {
        if (nexacro._accessibilitytype == 4 || nexacro._accessibilitytype == 5 || (nexacro._accessibilitytype == 2 && nexacro._Browser != "IE"))
            return;
        var acclabel = this._refinfo._getAttrValue(this._refinfo.accessibilitylabel, this._getDataRow());
        this.set_accessibilitylabel(acclabel);
        this.on_apply_accessibility();

        this.on_apply_prop_accessibilitydescription();
        this.on_apply_prop_accessibilityaction();
        var tmp_label = "";
        /* get accessibility label (view + leftBand + headBand)*/
        tmp_label = this._getAccessibilityMakeAddLabel() + " " + this._getCellAccessibilityLabel();
        this._setAccessibilityStatSelected(this.selected);
        tmp_label = tmp_label.trim();
        /* set accessibility cellLabel*/
        this._setAccessibilityLabel(tmp_label);
        if (this._editor && this._editor.visible && this._editor._adjust_width > 0)
        {
            this._editor._setAccessibilityStatFocus();
        }
        else if (this._subComp && this._curDisplayType != "treeitemcontrol")
        {
            this._subComp._setAccessibilityStatFocus();
        }
        else
        {
            nexacro.Component.prototype._setAccessibilityStatFocus.call(this);
        }
    };

    _pCellControl._getAccessibilityLabel = function (is_no_make)
    {
        var label = nexacro.Component.prototype._getAccessibilityLabel.call(this);

        if (!label && this.subcells.length > 0)// cell merge by use subcell
        {
            var subcells = this.subcells;
            var subcell_text;

            for (var i = 0, n = subcells.length; i < n; i++)
            {
                if (subcell_text = subcells[i]._getDisplayText())
                {
                    if (label)
                        label = label + " " + subcell_text;
                    else
                        label = subcell_text;
                }
            }
        }

        if ((nexacro._accessibilitytype == 4 || nexacro._accessibilitytype == 5 || (nexacro._accessibilitytype == 2 && nexacro._Browser != "IE"))
            && !is_no_make)
        {
            // voiceover에서는 생성시에 만들어줌
            var tmp_label = this._getAccessibilityMakeAddLabel();
            label = tmp_label + " " + label;
        }

        return label;
    };

    _pCellControl._getCellAccessibilityLabel = function ()
    {
        var tmpLabel = "";

        /* make cell accessibility label */
        tmpLabel = this._getAccessibilityLabel();

        /* accessibility stat setting */
        if (this._subComp)
        {
            var subComp = this._subComp;
            var displayType = this._curDisplayType;

            if (displayType == "checkboxcontrol" || displayType == "radioitemcontrol")
            {
                //tmpLabel = "";
                this._setAccessibilityStatChecked(subComp.isChecked());
            }
            else if (displayType == "treeitemcontrol")
            {
                var datarow = this._getDataRow();
                var cellinfo = this._refinfo;
                var state = this._getTreeStatus();
                var level = cellinfo._getTreeLevel(datarow);
                var startlevel = cellinfo._getTreeStartLevel(datarow);

                switch (state)
                {
                    case 0:
                        this._setAccessibilityStatExpanded(false);
                        break;
                    case 1:
                        this._setAccessibilityStatExpanded(true);
                        break;
                    default:
                        this._setAccessibilityStatExpanded(undefined);
                }
                this._setAccessibilityInfoLevel(level - startlevel + 1);
            }
        }
        return tmpLabel;
    };

    _pCellControl.__getAccessibilityMakeAddLabelMiddleClass = function ()   // parent 구조에 따라 다르므로 재정의하여 사용.
    {
        return "";
    };

    _pCellControl._getAccessibilityMakeAddLabel = function ()
    {
        var tmpLabel = "", view = this._view;

        var desclevel = this._getDescLevel();
        if (desclevel == "none" || desclevel == "child")
            return "";
        /* first focus add view accessibility label */
        if (view._is_first_focus && view._control_element)
        {
            tmpLabel = view._getAccessibilityLabel();
        }

        /* make cellLabel parent */
        tmpLabel += this.__getAccessibilityMakeAddLabelMiddleClass();
        return tmpLabel;
    };

    _pCellControl._setAccessibilityNotifyEvent = function (direction)
    {
        var label = this._getCellAccessibilityLabel();
        label = label.trim();
        this._setAccessibilityLabel(label);
        return nexacro.Component.prototype._setAccessibilityNotifyEvent.call(this, (direction && direction > 0) ? 0 : 1);
    };    

    _pCellControl = null;
    delete _pCellControl;
}

//nexacro._CellButtonControl
if (nexacro._CellButtonControl)
{
    var _pCellButtonControl = nexacro._CellButtonControl.prototype;
    _pCellButtonControl._skip_mobile_tabfocus = true;


    _pCellButtonControl = null;
    delete _pCellButtonControl;
}

if (nexacro._CellTreeControl)
{
    var _pCellTreeControl = nexacro._CellTreeControl.prototype;
    _pCellTreeControl._skip_mobile_tabfocus = true;
    //_pCellTreeControl.accessibilityenable = false
    _pCellTreeControl._setAccessibilityStatExpanded = function (expanded)
    {
        if (this._text_ctrl)
        {
            this._text_ctrl._setAccessibilityStatExpanded(expanded);
        }
    };

    _pCellTreeControl._setAccessibilityStatLive = function (v)
    {
        this._accessibilitylive = v;
        if (this._text_ctrl)
            this._text_ctrl._setAccessibilityStatLive(v);       
    };

    _pCellTreeControl = null;
    delete _pCellTreeControl;
}

if (nexacro._CellTreeLineControl)
{
    var _pCellTreeLineControl = nexacro._CellTreeLineControl.prototype;
    _pCellTreeLineControl._skip_mobile_tabfocus = true;

    _pCellTreeLineControl = null;
    delete _pCellTreeLineControl;
}

if (nexacro._TreeItemTextControl)
{
    var _pTreeItemTextControl = nexacro._TreeItemTextControl.prototype;

    _pTreeItemTextControl.accessibilityrole = "treeitem";

    _pTreeItemTextControl._getAccessibilityLabel = function ()
    {
        var cellobj = this.parent._cellobj;
        var datarow = cellobj._getDataRow();
        var cellinfo = cellobj._refinfo;
        var state = cellobj._getTreeStatus();
        var level = cellinfo._getTreeLevel(datarow);
        var startlevel = cellinfo._getTreeStartLevel(datarow);

        switch (state)
        {
            case 0:
                this._setAccessibilityStatExpanded(false);
                break;
            case 1:
                this._setAccessibilityStatExpanded(true);
                break;
            default:
                this._setAccessibilityStatExpanded("");
    }

        level = level - startlevel +1;
        this._setAccessibilityInfoLevel(level);

        var label = cellobj._getAccessibilityLabel();
        
        if (!nexacro._isDesktop() && nexacro._Browser != "Runtime")
            label += " level " + level;

        return label;
    };

    _pTreeItemTextControl.on_created_contents = function (win)
    {
        nexacro.Static.prototype.on_created_contents.call(this,win);
        this.on_apply_accessibility();
    };

    _pTreeItemTextControl = null;
    delete _pTreeItemTextControl;
}

if (nexacro.ScrollBarControl)
{
    var _pScrollBarControl = nexacro.ScrollBarControl.prototype;
    _pScrollBarControl.accessibilityenable = false;

    _pScrollBarControl = null;
    delete _pScrollBarControl;
}

if (nexacro.ScrollIndicatorControl)
{
    var _pScrollIndicatorControl = nexacro.ScrollIndicatorControl.prototype;
    _pScrollIndicatorControl.accessibilityenable = false;

    _pScrollIndicatorControl = null;
    delete _pScrollIndicatorControl;
}

//ImageViewer
if (nexacro.ImageViewer)
{
    var _pImageViewer = nexacro.ImageViewer.prototype;
    _pImageViewer.on_created_contents = function (win)
    {
        this.on_apply_stretch();

        if (this._image)
        {
            this._image.on_created(win);
            if (nexacro._accessibilitytype == 5 || nexacro._accessibilitytype == 4)
            {
                this._image._setAccessibilityStatHidden(true);
            }
        }

        if (this._imagetext)
        {
            this._imagetext.on_created(win);
            if (nexacro._accessibilitytype == 5)
            {
                this._imagetext._setAccessibilityStatHidden(true);
            }
        }
    };

    _pImageViewer.on_attach_contents_handle = function (win)
    {
        if (this._image)
        {
            this._image.attachHandle(win);
            if (nexacro._accessibilitytype == 5 || nexacro._accessibilitytype == 4)
            {
                this._image._setAccessibilityStatHidden(true);
            }
        }

        if (this._imagetext)
        {
            this._imagetext.attachHandle(win);
            if (nexacro._accessibilitytype == 5)
            {
                this._imagetext._setAccessibilityStatHidden(true);
            }
        }
    };

    _pImageViewer = null;
    delete _pImageViewer;
}


//DatePicker
if (nexacro._DatePickerBodyControl)
{
    var _pDatePickerBodyControl = nexacro._DatePickerBodyControl.prototype;
    if (nexacro._Browser == "Runtime")
    {
        _pDatePickerBodyControl._getAccessibilityRole = function ()
        {
            var calendar = this.parent.parent;
            return calendar.accessibilityrole ? calendar.accessibilityrole : "datepicker";
        };
    }
    else
    {
        _pDatePickerBodyControl._getAccessibilityRole = function ()
        {
            var calendar = this.parent.parent;
            if (calendar.accessibilityrole == "calendar")
                return "datepicker";
            return calendar.accessibilityrole;// ? calendar.accessibilityrole : "datepicker";
        };
    }

    _pDatePickerBodyControl._setCalendarAccessibility = function ()
    {
        if (nexacro._enableaccessibility)
        {
            var calendar = this.parent.parent;
            var date = this._date;
            var cal_value = date.str_year + date.str_month + date.str_day;

            var editmask_type = calendar._masktypeobj.getEditFormatType();
            if (editmask_type == 1)
                cal_value = calendar.value ? calendar.value : "";
            else if (editmask_type == 2)
                cal_value += calendar.value ? calendar.value.substr(8) : "";

            var accessibility_value = calendar._masktypeobj.applyMask(cal_value);            
            if (calendar.type != "monthonly")
            {
                /* popup calendar 선택 출력 */
                calendar._popupcontrol._setAccessibilityLabel(accessibility_value);
                calendar.calendaredit.setCaretPos(-1); // 공백 읽음 방지 by 스펙 변경이 필요
            }
            else
            {
                this.parent._setAccessibilityLabel(accessibility_value);
                this._setAccessibilityLabel(accessibility_value);
            }
                        
            if (nexacro._accessibilitytype != 2)
            {
                // 사용하지 않아도 정상 동작 (센스리더)
                nexacro._notifyAccessibilityValue(this._control_element, accessibility_value, "daychange");
            }
        }
    };

    _pDatePickerBodyControl._getAccessibilityLabel = function ()
    {
        var label = "";
        var calendar = this.parent.parent;
        return (label = this._getLinkedLabel(calendar.accessibilitylabel)) ? label : calendar.on_get_accessibility_label();
    };

    _pDatePickerBodyControl._getAccessibilityDescription = function ()
    {
        var description = "";
        var calendar = this.parent.parent;
        return (description = this._getLinkedDescription(calendar.accessibilitydescription)) ? description : calendar.on_get_accessibility_description();
    };

    _pDatePickerBodyControl._getAccessibilityAction = function ()
    {
        var calendar = this.parent.parent;
        var action = this._getLinkedAction(calendar.accessibilityaction);
        return action ? action : (action = calendar.on_get_accessibility_action()) ? action : "";
    };

    _pDatePickerBodyControl._on_getAccessibilityAdditionalLabel = function ()
    {
        var cal = this.parent.parent;
        if (cal)
            return cal._on_getAccessibilityAdditionalLabel();
        return "";
    };
    _pDatePickerBodyControl = null;
}

if (nexacro._WaitControl)
{
    var __pWaitControl = nexacro._WaitControl.prototype;
    __pWaitControl._setAccessibilityStatHidden = function (hidden)
    {
        if (hidden == false)
            return;
        nexacro.Component.prototype._setAccessibilityStatHidden.call(this, hidden);
    };
    __pWaitControl._skip_mobile_tabfocus = true;
    __pWaitControl = null;
}

if (nexacro.ChildFrame)
{
    var _pChildFrame = nexacro.ChildFrame.prototype;
    if (nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari")
    {
        _pChildFrame._accessibilityModalLock = function (modal_stack)
        {
            if (modal_stack.length > 0)
            {
                var modal_info = modal_stack[modal_stack.length - 1];
                var overlay_elem = modal_info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(true);
                }
            }
            else
            {
                var app = nexacro.getApplication();
                var parent_frame = app.mainframe.frame;
                var control_elem = parent_frame.getElement();
                if (control_elem)
                {
                    control_elem.setElementAccessibilityStatHidden(true);
                    parent_frame._skip_mobile_tabfocus = false;
                    control_elem.setElementAccessibilityRole("button");
                }
            }
        };

        _pChildFrame._accessibilityModalUnLock = function (modal_stack)
        {

            if (modal_stack.length > 0)
            {
                var info = modal_stack[modal_stack.length - 1];
                var overlay_elem = info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(false);
                }
            }
            else
            {
                var app = nexacro.getApplication();
                var parent_frame = app.mainframe.frame;
                var control_elem = parent_frame.getElement();
                if (control_elem)
                {
                    control_elem.setElementAccessibilityStatHidden(false);
                    parent_frame._skip_mobile_tabfocus = true;
                    control_elem.setElementAccessibilityRole(parent_frame.accessibilityrole);
                }
            }
        };
    }
    else
    {
        _pChildFrame._accessibilityModalLock = function (modal_stack)
        {
            if (modal_stack.length > 0)
            {
                var modal_info = modal_stack[modal_stack.length - 1];
                var overlay_elem = modal_info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(true);
                }
            }
            else
            {
                var app = nexacro.getApplication();
                var parent_frame = app.mainframe.frame;
                var control_elem = parent_frame.getElement();
                if (control_elem)
                    control_elem.setElementAccessibilityStatHidden(true);
            }
        };

        _pChildFrame._accessibilityModalUnLock = function (modal_stack)
        {
            if (modal_stack.length > 0)
            {
                var info = modal_stack[modal_stack.length - 1];
                var overlay_elem = info[0]._modal_overlay_elem;
                if (overlay_elem)
                {
                    overlay_elem.setElementAccessibilityStatHidden(false);
                }
            }
            else
            {
                var app = nexacro.getApplication();
                var parent_frame = app.mainframe.frame;
                var control_elem = parent_frame.getElement();
                if (control_elem)
                {
                    control_elem.setElementAccessibilityStatHidden(false);
                }
            }
        };
    }
    _pChildFrame = null;
}

if (nexacro.Menu)
{
    var _pMenu = nexacro.Menu.prototype;
    
    // Android Runtime
    if (nexacro._Browser == "Runtime" && nexacro._accessibilitytype == 5)
    {
        _pMenu._getDlgCode = function (keycode/*, altKey, ctrlKey, shiftKey*/)
        {
            var want_tab = this._want_tab;
            var want_arrow = this._want_arrow; // true

            return { want_tab: want_tab, want_return: true, want_escape: false, want_chars: false, want_arrows: want_arrow };
        };

        _pMenu.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
        {
            var ret = false;
            var item_len = this._items.length;
            var menuitem = this._items;        
            
            if (menuitem && item_len > 0)
            {                
                if (direction > 0)
                    this._accessibility_index++;
                else
                    this._accessibility_index--;
            
                if (menuitem[this._accessibility_index])
                {
                    ret = true;
                    menuitem[this._accessibility_index]._setAccessibilityNotifyEvent();
                } else {
                    this._accessibility_index = -1;
                }
            }
            return ret;
        };

        _pMenu._setAccessibilityNotifyEvent = function (direction)
        {
            var item_len = this._items.length;
            var menuitem = this._items;        

            if(menuitem && item_len > 0)
            {
                var obj = null;
                this._accessibility_index = -1;

                if (this._accessibility_index < 0 || this._accessibility_index >= item_len)
                {
                    if (direction == undefined)
                        direction = 1;

                    if (direction > 0)
                        this._accessibility_index = 0;
                    else
                        this._accessibility_index = item_len - 1;
                }

                obj = menuitem[this._accessibility_index];
                if (obj) 
                {
                    return obj._setAccessibilityNotifyEvent();
                }
            }
            else
            {
                return nexacro.Component.prototype._setAccessibilityNotifyEvent.call(this, direction);
            }
        };

        _pMenu._setAccessibilityInfoByHover = function (control)
        {
            if (control)
            {
                if (control.parent instanceof nexacro._MenuItemControl)
                {
                    control = control.parent;
                }
                
                this._accessibility_index = control.index;
                return control._setAccessibilityNotifyEvent();
            }
            else
            {
                this._accessibility_index = -1;
                return nexacro.Component.prototype._setAccessibilityNotifyEvent.call(this);
            }
        }; 
    }
    
    _pMenu = null;
}

if (nexacro.Spin)
{
	var _pSpin = nexacro.Spin.prototype;

	_pSpin.on_created_contents = function ()
	{
		this._setEventHandlerToCalendarEdit();
		this._setEventHandlerToSpinButtons();

		this.on_apply_displaycomma(this.displaycomma);
		this.on_apply_type(this.type);
		this.on_apply_readonly(this.readonly);
		this.on_apply_value(this.value);
		this.on_apply_usecontextmenu(this.usecontextmenu);

		this.spinupbutton.on_created();
		this.spindownbutton.on_created();
		this.spinedit.on_created();

		this.on_apply_displaynulltext(this.displaynulltext);
		this.on_apply_displayinvalidtext(this.displayinvalidtext);

		this._recalcLayout();
		this._updateButton();
		this._setDefaultProp();

		if (nexacro._enableaccessibility)
		{
			this._setAccessibilityInfoValueMax(this.max);
			this._setAccessibilityInfoValueMin(this.min);
			this._setAccessibilityInfoValueCur(this.value);
			if (this.accessibilitydesclevel != "none" && this.accessibilitydesclevel != "child")
				this._setAccessibilityActiveDescendant(this.spinedit._input_element);
			if (nexacro._accessibilitytype == 5)
				this.spinedit._setAccessibilityStatHidden(true);
			this.spinupbutton._setAccessibilityStatHidden(true);
			this.spindownbutton._setAccessibilityStatHidden(true);
			this._want_arrow = false;
		}

		if (this.spinedit)
		{
			this.spinedit.set_usesoftkeyboard(this.usesoftkeyboard, true);
		}
	};

	_pSpin.on_attach_contents_handle = function (win)
	{
		if (this.spinedit)
		{
			this.spinedit.attachHandle(win);
		}
		if (this.spinupbutton)
		{
			this.spinupbutton.attachHandle(win);
		}
		if (this.spindownbutton)
		{
			this.spindownbutton.attachHandle(win);
		}

		this.on_apply_displaynulltext(this.displaynulltext);
		this.on_apply_displayinvalidtext(this.displayinvalidtext);

		this._setEventHandlerToCalendarEdit();
		this._setEventHandlerToSpinButtons();

		this._recalcLayout();
        this._updateButton();
		if (nexacro._enableaccessibility)
		{
			this._setAccessibilityInfoValueMax(this.max);
			this._setAccessibilityInfoValueMin(this.min);
            this._setAccessibilityInfoValueCur(this.value);
            this._updateAccessibilityLabel();
			if (nexacro._accessibilitytype != 5 && nexacro._accessibilitytype != 4)
			{
				this.spinupbutton._setAccessibilityStatHidden(true);
				this.spindownbutton._setAccessibilityStatHidden(true);
			}
			else
			{

				this.spinupbutton.set_accessibilitylabel("spinnupbutton");
				this.spindownbutton.set_accessibilitylabel("spinndownbutton");
			}
			this._want_arrow = false;
		}
	};

	_pSpin.on_get_accessibility_label = function ()
	{
		return "";
	};

	if (nexacro._Browser == "Chrome" || (nexacro._Browser == "Edge" && nexacro._BrowserType == "WebKit"))
	{
		_pSpin._on_getAccessibilityAdditionalLabel = function ()
		{
            return "";
		};
	}
	else
	{
		_pSpin._on_getAccessibilityAdditionalLabel = function ()
		{
			var label = "";
			if (this.spinedit)
			{
				if (this.spinedit.text)
					label = this.spinedit.text;
				else if (this._default_value != null)
					label = this._default_value;
				else if (this.displaynulltext)
					label = this.displaynulltext;
			}
			return label;// + " " + this.min + " " + this.max;
		};
	}

	_pSpin._on_edit_onkeydown = function (obj, e)
	{
		if (nexacro._enableaccessibility)
		{
			switch (e.keycode)
			{
				case nexacro.Event.KEY_UP:
					if (e.ctrlkey)
					{
						this._on_spin_up();
					}
					break;
				case nexacro.Event.KEY_DOWN:
					if (e.ctrlkey)
					{
						this._on_spin_down();
					}
					break;
				case nexacro.Event.KEY_ENTER:
					if (this._default_value != this.spinedit.value)
					{
						this._on_value_change();
					}
					break;
			}
		}
		else
		{
			switch (e.keycode)
			{
				case nexacro.Event.KEY_UP:
					this._on_spin_up();
					break;
				case nexacro.Event.KEY_DOWN:
					this._on_spin_down();
					break;
				case nexacro.Event.KEY_ENTER:
					if (this._default_value != this.spinedit.value)
					{
						this._on_value_change();
					}
					break;
			}
		}
		
    };

	_pSpin = null;
}

if (nexacro.CheckBox)
{
    var _pCheckBox = nexacro.CheckBox.prototype;
    _pCheckBox.on_keyup_basic_action = function (key_code, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (key_code == nexacro.Event.KEY_SPACE)
        {
            // 가상커서가 마우스 이벤트 발생하므로 패스
            var win = this._getWindow();
            if (win && win._virtual_cursor_keydown)
            {
                this.on_fire_onclick("", alt_key, ctrl_key, shift_key, -1, -1, -1, -1, -1, -1, refer_comp, refer_comp, meta_key);
            }
        }
    };
    _pCheckBox = null;
}