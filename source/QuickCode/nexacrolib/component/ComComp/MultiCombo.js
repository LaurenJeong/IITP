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
if (!nexacro.MultiCombo)
{
    //==============================================================================
    // nexacro.MultiCombo
    //==============================================================================
    nexacro.MultiCombo = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        this._onlydisplay = onlydisplay;

        this._select_multi = {"items": [], "map": {}, "keys": [], "length": 0, "lastselected": null};
        this.search_items = {"name": [], "id": []};
    };

    var _pMultiCombo = nexacro._createPrototype(nexacro.Component, nexacro.MultiCombo);
    nexacro.MultiCombo.prototype = _pMultiCombo;
    _pMultiCombo._type_name = "MultiCombo";

    /* control */
    _pMultiCombo.multicomboedit = null;
    _pMultiCombo.dropbutton = null;
    _pMultiCombo.multicombolist = null;
    _pMultiCombo._popupcontrol = null;
    _pMultiCombo.multicombotext = null;
    _pMultiCombo.multicombotagbox = null;
    _pMultiCombo.selectallbutton = null;

    /* default properties */
    _pMultiCombo.value = undefined;
    _pMultiCombo.index = -1;
    _pMultiCombo.text = "";

    _pMultiCombo.codecolumn = "";
    _pMultiCombo.datacolumn = "";
    _pMultiCombo.innerdataset = "";

    _pMultiCombo.autoselect = false;
    _pMultiCombo.autoskip = false;
    _pMultiCombo.usesoftkeyboard = true;
    _pMultiCombo.displaynulltext = "";
    _pMultiCombo.imemode = "none";
    _pMultiCombo.readonly = false;
    _pMultiCombo.usecontextmenu = true;

    _pMultiCombo.displayrowcount = undefined;
    _pMultiCombo.buttonsize = undefined;
    _pMultiCombo.itemheight = undefined;
    _pMultiCombo.type = "dropdown";
    _pMultiCombo.popuptype = "normal";
    _pMultiCombo.popupsize = undefined;
    _pMultiCombo.acceptvaluetype = "allowinvalid";   //allowinvalid | ignoreinvalid

    _pMultiCombo.selectall = false;
    _pMultiCombo.edittype = "text";
    _pMultiCombo.separator = ",";
    _pMultiCombo.counttext = "";

    /* internal variable */
    _pMultiCombo._is_close_popup_by_select = false;
    _pMultiCombo._isFiredOnInput = false;
    _pMultiCombo._innerdataset = "";
    _pMultiCombo._filtereddataset = "";
    _pMultiCombo._default_value = undefined;
    _pMultiCombo._default_text = "";
    _pMultiCombo._default_index = -1;
    _pMultiCombo._has_inputElement = true;
    _pMultiCombo._processing_keyfilter = false;
    _pMultiCombo._count_tmpl = null;

    /* status */
    _pMultiCombo._use_readonly_status = true;
    _pMultiCombo._is_editable_control = true;

    /* event list */
    _pMultiCombo._event_list = {
        "oneditclick": 1, "onitemclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmousemove": 1, "onmouseleave": 1,
        "onmove": 1, "onsize": 1,
        "canitemchange": 1, "onitemchanged": 1, "oninput": 1,
        "onmousewheel": 1, "oncontextmenu": 1,
        "ondropdown": 1, "oncloseup": 1,
        "oninnerdatachanged": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };

    /* accessibility */
    _pMultiCombo.accessibilityrole = "multicombobox";

    //===============================================================
    // nexacro.MultiCombo : Create & Update
    //===============================================================
    _pMultiCombo.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            if (this.edittype == "tag")
            {
                this._createMultiComboTagBoxControl();
            }
            else if (this.edittype == "count")
            {
                this._createMultiComboTextControl();
            }

            this.multicomboedit = new nexacro._MultiComboEditControl("multicomboedit", 0, 0, 0, 0, null, null, null, null, null, null, this, this._onlydisplay);
            this.dropbutton = new nexacro._MultiComboButtonControl("dropbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

            this.multicomboedit.createComponent();
            this.dropbutton.createComponent();
        }
    };

    _pMultiCombo.on_created_contents = function (win)
    {
        if (this.innerdataset && !this._innerdataset)
        {
            this._setInnerDatasetStr(this.innerdataset);
            this.on_apply_innerdataset(this._innerdataset);
        }
        this.on_apply_autoskip(this.autoskip);
        this.on_apply_displaynulltext(this.displaynulltext);
        this.on_apply_imemode(this.imemode);
        this.on_apply_autoselect(this.autoselect);
        this.on_apply_usecontextmenu(this.usecontextmenu);

        if (!this._onlydisplay)
        {
            var init_comobovalue = (this.value == undefined && this.index == -1);
            if (init_comobovalue)
            {
                // 툴에서 MultiCombo 디자인할때 기본값이어도 text가 항상 남아있어서 오동작 문제가 있음.
                this.on_apply_value(this.value);
            }
            else
            {
                if (this.index > -1)
                {
                    this.on_apply_index(this.index);
                }
                else if (this.value !== undefined)
                {
                    this.on_apply_value(this.value);
                }
                else if (this.text !== "")
                {
                    this.on_apply_text(this.text);
                }
            }
        }

        this.redraw();
        this._recalcLayout();
        this._setDefaultProps(this.index, this.value, this.text);

        this._setEventHandlerToMultiComboEdit();
        this._setEventHandlerToDropButton();
        this._setEventHandlerToMultiComboText();

        this.multicomboedit.on_created(win);
        this.dropbutton.on_created(win);

        if (this.multicombotext)
            this.multicombotext.on_created(win);

        if (this.multicombotagbox)
            this.multicombotagbox.on_created(win);

        if (this.type == "dropdown")
        {
            this.multicomboedit._setReadonlyView(true);
        }

        if (nexacro._enableaccessibility)
        {
            this._want_arrows = false;
            this._setAccessibilityStatAutoComplete("list");

            if (!nexacro._isDesktop())
            {
                this.multicomboedit._setAccessibilityStatHidden(true);
                this.dropbutton._setAccessibilityStatHidden(true);
            }

            if (this.type == "dropdown" && !this.readonly)
            {
                if (this.multicomboedit)
                    this.multicomboedit._setAccessibilityReadOnly(false);
            }
        }

        if (this.multicomboedit)
        {
            this.multicomboedit.set_usesoftkeyboard(this.usesoftkeyboard, true);
        }
        this.on_apply_type(this.type);
    };

    _pMultiCombo.on_destroy_contents = function ()
    {
        if (this.multicomboedit)
        {
            this.multicomboedit.destroy();
            this.multicomboedit = null;
        }

        if (this.dropbutton)
        {
            this.dropbutton.destroy();
            this.dropbutton = null;
        }

        if (this.multicombotext)
        {
            this.multicombotext.destroy();
            this.multicombotext = null;
        }

        if (this.multicombotagbox)
        {
            this.multicombotagbox.destroy();
            this.multicombotagbox = null;
        }

        if (this.multicombolist)
        {
            this.multicombolist.destroy();
            this.multicombolist = null;
        }

        if (this._popupcontrol)
        {
            this._popupcontrol.destroy();
            this._popupcontrol = null;
        }

        this._removeEventHandlerToInnerDataset();

        this._select_multi = null;
    };

    _pMultiCombo._removeEventHandlerToInnerDataset = function ()
    {
        if (this._innerdataset)
        {
            this._innerdataset._removeEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            this._innerdataset._removeEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);
            this._innerdataset = null;
        }

        if (this._filtereddataset)
        {
            this._filtereddataset.destroy();
            this._filtereddataset = null;
        }
    };

    _pMultiCombo.on_create_contents_command = function ()
    {
        this.on_apply_autoskip(this.autoskip);
        this.on_apply_displaynulltext(this.displaynulltext);
        this.on_apply_imemode(this.imemode);
        this.on_apply_autoselect(this.autoselect);
        this.on_apply_usecontextmenu(this.usecontextmenu);

        var init_comobovalue = (this.value == undefined && this.index == -1);
        if (init_comobovalue)
        {
            // 툴에서 MultiCombo 디자인할때 기본값이어도 text가 항상 남아있어서 오동작 문제가 있음.
            this.on_apply_value(this.value);
        }
        else
        {
            if (this.index > -1)
            {
                this.on_apply_index(this.index);
            }
            else if (this.value !== undefined)
            {
                this.on_apply_value(this.value);
            }
            else if (this.text !== "")
            {
                this.on_apply_text(this.text);
            }
        }

        this.redraw();
        this._recalcLayout();

        this._setEventHandlerToMultiComboEdit();
        this._setEventHandlerToDropButton();
        this._setEventHandlerToMultiComboText();

        var str = "";

        if (this.edittype == "tag")
        {
            str += this.multicombotagbox.createCommand();
        }
        else if (this.edittype == "count")
        {
            if (this.multicombotext)
            {
                str += this.multicombotext.createCommand();
            }
        }

        if (this.multicomboedit)
        {
            str += this.multicomboedit.createCommand();
        }

        if (this.dropbutton)
        {
            str += this.dropbutton.createCommand();
        }

        return str;
    };

    _pMultiCombo.on_attach_contents_handle = function (win)
    {
        if (this.multicomboedit)
        {
            this.multicomboedit.attachHandle(win);
            if (nexacro._enableaccessibility && !nexacro._isDesktop())
            {
                this.multicomboedit._setAccessibilityStatHidden(true);
            }
            if (this.type == "dropdown")
            {
                this.multicomboedit._setReadonlyView(true);
            }
        }

        if (this.dropbutton)
        {
            this.dropbutton.attachHandle(win);
            this.dropbutton._setAccessibilityStatHidden(true);
        }

        if (this.multicombotagbox)
        {
            this.multicombotagbox.attachHandle(win);
            this.multicombotagbox._setAccessibilityStatHidden(true);
        }

        if (this.multicombotext)
        {
            this.multicombotext.attachHandle(win);
            this.multicombotext._setAccessibilityStatHidden(true);
        }

        if (nexacro._enableaccessibility)
        {
            this._want_arrows = false;
            this._setAccessibilityStatAutoComplete("list");

            if (this.type == "dropdown" && !this.readonly)
            {
                if (this.multicomboedit)
                    this.multicomboedit._setAccessibilityReadOnly(false);
            }
        }

        this._setDefaultProps(this.index, this.value, this.text);
        this.on_apply_type(this.type);
    };

    _pMultiCombo.on_change_containerRect = function (width, height)
    {
        this._recalcLayout();
    };

    _pMultiCombo.on_change_containerPos = function (left, top)
    {
        this._recalcLayout();
    };

    //===============================================================
    // nexacro.MultiCombo : Override
    //===============================================================
    _pMultiCombo._apply_setfocus = function (evt_name)
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit._changeStatus("focused", true);

            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                if (this.type == "dropdown")
                {
                    var control_elem = this.getElement();
                    if (control_elem)
                    {
                        control_elem.setElementFocus(true);
                    }
                    else
                    {
                        multicomboedit._on_focus(true, evt_name);
                    }
                }
                else
                {
                    multicomboedit._on_focus(true, evt_name);
                }
            }
            else
            {
                multicomboedit._on_focus(true, evt_name);
            }
        }
    };

    _pMultiCombo.on_apply_prop_enable = function (v)
    {
        v = (v != null) ? v : this._isEnable();

        if (this.multicomboedit)
        {
            this.multicomboedit._setEnable(v);
        }
        if (this.dropbutton && !this._isReadOnly())
        {
            this.dropbutton._setEnable(v);
        }
        if (this.multicombolist)
        {
            this.multicombolist._setEnable(v);
        }
    };

    _pMultiCombo.on_apply_prop_cssclass = function ()
    {
        if (this.multicomboedit)
        {
            this.multicomboedit.on_apply_cssclass();
        }
        if (this.dropbutton)
        {
            this.dropbutton.on_apply_cssclass();
        }
        if (this.multicombolist)
        {
            this.multicombolist.on_apply_cssclass();
        }
    };

    _pMultiCombo.on_init_bindSource = function (columnid, propid, ds)
    {
        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        this._setValue(undefined);
        this._setIndex(-1);
        this._setText("");

        this.redraw();
    };

    _pMultiCombo.on_change_bindSource = function (propid, ds, row, col)
    {
        if (propid == "value")
        {
            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            var idx = -1;
            var txt = "";
            var val = ds.getColumn(row, col);

            val = this._convertValueType(val, true);

            if (this.value == val)
            {
                return;
            }

            this._setValue(val);

            ds = this._selectDataset();
            if (ds)
            {
                idx = this._getIndexFromValue(ds, val);
                if (idx > -1)
                {
                    txt = this._getItemText(idx);
                }

                this._setIndex(idx);
                this._setText(txt);
            }

            this.redraw();
            this._setDefaultProps(this.index, this.value, this.text);
        }
    };

    _pMultiCombo.on_getBindableProperties = function ()
    {
        return "value";
    };

    _pMultiCombo._getDragData = function ()
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            return multicomboedit.getSelectedText();
        }
    };

    _pMultiCombo._getDlgCode = function (keycode, altKey, ctrlKey, shiftKey)
    {
        if ((keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN) && (ctrlKey || altKey))
        {
            return {want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: true};
        }

        return {want_tab: false, want_return: false, want_escape: false, want_chars: false, want_arrows: this._want_arrows};
    };

    _pMultiCombo.on_get_accessibility_label = function ()
    {
        return "";
    };

    _pMultiCombo._getAccessibilityReadLabel = function (bwholeread)
    {
        var _readlabel = nexacro.Component.prototype._getAccessibilityReadLabel.call(this);
        if (bwholeread && this.multicomboedit._input_element && this._status != "focus")
        {
            if (!this.multicomboedit._input_element._wantAccessibilityAdditionalLabel || !this.multicomboedit._input_element._wantAccessibilityAdditionalLabel())
            {
                _readlabel = this.text + " " + _readlabel;
            }
        }

        return _readlabel;
    };

    //===============================================================
    // nexacro.MultiCombo : Properties
    //===============================================================
    _pMultiCombo.set_text = function (v)
    {
        v = nexacro._toString(v);
        if (this.text != v)
        {
            this.text = v;
            this.on_apply_text(v);
        }
    };

    _pMultiCombo.on_apply_text = function (text)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var value = this.value;

            var ds = this._selectDataset();
            if (!ds || (!this.datacolumn && !this.codecolumn))
            {
                if (value)
                {
                    this._setEditValue(text);
                }
                else
                {
                    if (this.displaynulltext || text == "")
                    {
                        this._setEditValue(undefined);
                    }
                    else
                    {
                        this._setEditValue(text);
                    }
                }
            }
            else
            {
                var idx = this._getIndexFromText(ds, text);

                this._setIndex(idx);
                if (idx > -1)
                {
                    this._setValue(this._getItemValue(idx));
                }
                else
                {
                    this._setValue(undefined);
                    this._setText("");
                }

                var info = this._select_multi;
                var len = info.length;
                var range = [];
                var i;

                for (i = 0; i < len; i++)
                {
                    range[range.length] = info.items[i];
                }

                for (i = 0; i < range.length; i++)
                    this._select_remove(range[i]);
                this._select_add(idx);

                this.redraw();
            }

            this._setDefaultProps(this.index, this.value, this.text);
        }
    };

    _pMultiCombo.set_value = function (v)
    {
        if (!this._is_created && (v === undefined || v === null || v === ""))   // tool에서 입력된 빈값은 ""으로 들어와 구분이 불가하여 체크.
            return;

        v = this._convertValueType(v);

        if (this.value !== v)
        {
            if (this.acceptvaluetype == "ignoreinvalid")
            {
                var idx = -1;
                var ds = this._selectDataset();
                if (ds)
                {
                    idx = this._getIndexFromValue(ds, v);
                    if (idx < 0)
                        return;
                }
            }

            if (this.applyto_bindSource("value", v))
            {
                this.value = v;
                this.on_apply_value(v);
                this.redraw();
            }
        }
    };

    _pMultiCombo.on_apply_value = function (value)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var idx = -1;
            var txt = "";

            var ds = this._selectDataset();
            if (ds)
            {
                idx = this._getIndexFromValue(ds, value);
                if (idx > -1)
                {
                    txt = this._getItemText(idx);
                }

                this._setIndex(idx);
                this._setText(txt);

                var info = this._select_multi;
                var len = info.length;
                var range = [];
                var i;

                for (i = 0; i < len; i++)
                {
                    range[range.length] = info.items[i];
                }

                for (i = 0; i < range.length; i++)
                    this._select_remove(range[i]);
                this._select_add(idx);

                if (nexacro._enableaccessibility)
                {
                    this._updateAccessibilityLabel();
                }
            }

            this._setDefaultProps(this.index, this.value, this.text);
        }
    };

    _pMultiCombo.set_index = function (v)
    {
        if (isNaN(v = +v) || v < -1)
        {
            return;
        }

        if (this.index != v)
        {
            this.index = v;
            this.on_apply_index(v);
            this.redraw();
        }
        else
        {
            this.on_apply_index(v);
            this.redraw();
        }
    };

    _pMultiCombo.on_apply_index = function (idx)
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var val;
            var txt = "";

            var ds = this._innerdataset;
            if (ds)
            {
                if (idx !== null && idx >= 0 && idx < ds.getRowCount())
                {
                    val = this._getItemValue(idx);
                    txt = this._getItemText(idx);
                }
                else
                {
                    idx = -1;
                }

                if (this.applyto_bindSource("value", val))
                {
                    this._setValue(val);
                    this._setText(txt);
                    if (this.index != idx)
                    {
                        this._setIndex(-1);
                    }

                    var info = this._select_multi;
                    var len = info.length;
                    var range = [];
                    var i;

                    for (i = 0; i < len; i++)
                    {
                        range[range.length] = info.items[i];
                    }

                    for (i = 0; i < range.length; i++)
                        this._select_remove(range[i]);
                    this._select_add(idx);
                }
                else
                {
                    var result = "restore";

                    // check bind value
                    var form = this._getForm();
                    var item = form._bind_manager._findBindItem(this, "value");
                    if (item)
                    {
                        var bind_ds = item._dataset;
                        if (bind_ds.rowcount > 0)
                        {
                            if (val == this.value)
                            {
                                if (txt == this.text)
                                {
                                    result = "change";
                                }
                            }
                        }
                    }

                    // apply bind result
                    if (result == "restore")
                    {
                        this._setIndex(this._default_index);
                        this._setValue(this._default_value);
                        this._setText(this._default_text);
                    }
                    else if (result == "change")
                    {
                        this._setIndex(idx);
                        this._setValue(val);
                        this._setText(txt);
                    }
                }
            }
            else
            {
                this._setIndex(-1);
                this._setValue(undefined);
                this._setText("");
            }

            this._setDefaultProps(this.index, this.value, this.text);
        }
    };

    _pMultiCombo.set_displaynulltext = function (v)
    {
        v = nexacro._toString(v).replace(/&quot;/g, "\"");
        if (this.displaynulltext != v)
        {
            this.displaynulltext = v;
            this.on_apply_displaynulltext(v);
        }
    };

    _pMultiCombo.on_apply_displaynulltext = function (displaynulltext)
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit.set_displaynulltext(displaynulltext);
        }
    };

    _pMultiCombo.set_readonly = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this.readonly != v)
        {
            this.readonly = v;
            this.on_apply_readonly();
        }
    };

    _pMultiCombo._isReadOnly = function ()
    {
        return this.readonly;
    };

    _pMultiCombo.on_apply_readonly = function ()
    {
        var readonly = this._isReadOnly();
        this._changeStatus("readonly", readonly);

        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            if (!this._onlydisplay)
            {
                multicomboedit.set_readonly(readonly);
            }
            else
            {
                multicomboedit._changeStatus("readonly", readonly);
            }
            if (this.type == "dropdown")
            {
                multicomboedit._setReadonlyView(true);
                if (nexacro._enableaccessibility)
                    multicomboedit._setAccessibilityReadOnly(readonly);
            }
            else
            {
                if (readonly == true)
                    multicomboedit._setReadonlyView(true);
                else
                    multicomboedit._setReadonlyView(false);
            }
        }

        var dropbutton = this.dropbutton;
        if (dropbutton)
        {
            dropbutton._setEnable(this._isEnable() && !readonly);
        }

        var multicombolist = this.multicombolist;
        if (multicombolist)
        {
            multicombolist.set_readonly(readonly);
        }
    };

    _pMultiCombo.set_autoselect = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this.autoselect != v)
        {
            this.autoselect = v;
            this.on_apply_autoselect(v);
        }
    };

    _pMultiCombo.on_apply_autoselect = function (autoselect)
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            if (this.type != "dropdown")
            {
                multicomboedit.set_autoselect(autoselect);
            }
            else
            {
                multicomboedit.set_autoselect(false);
            }
        }
    };

    _pMultiCombo.set_autoskip = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this.autoskip != v)
        {
            this.autoskip = v;
            this.on_apply_autoskip(v);
        }
    };

    _pMultiCombo.on_apply_autoskip = function (autoskip)
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit.set_autoskip(autoskip);
        }
    };

    _pMultiCombo.set_usesoftkeyboard = function (v, bforce)
    {
        v = nexacro._toBoolean(v);
        if (v != this.usesoftkeyboard || bforce)
        {
            this.usesoftkeyboard = v;
            this.on_apply_usesoftkeyboard(bforce);
        }
    };

    _pMultiCombo.on_apply_usesoftkeyboard = function (bforce)
    {
        if (this.multicomboedit)
        {
            this.multicomboedit.set_usesoftkeyboard(this.usesoftkeyboard, bforce);
        }
    };

    _pMultiCombo.set_imemode = function (v)
    {
        var imemode_enum = ["none", "alpha", "alpha,full", "hangul", "hangul,full", "katakana", "katakana,full", "hiragana", "direct"];
        if (imemode_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this.imemode != v)
        {
            this.imemode = v;
            this.on_apply_imemode(v);
        }
    };

    _pMultiCombo.on_apply_imemode = function (imemode)
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit.set_imemode(imemode);
        }
    };

    _pMultiCombo.set_type = function (v)
    {
        var type_enum = ["dropdown", "search", "filter", "filterlike", "caseisearch", "caseifilter", "caseifilterlike"];
        if (type_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this.type != v)
        {
            this.type = v;
            this.on_apply_type(v);
        }
    };

    _pMultiCombo.on_apply_type = function (type)
    {
        var control_elem = this.getElement();
        if (control_elem && this.edittype != "text")
        {
            var tag;
            if (type == "dropdown")
            {
                if (this.edittype == "tag")
                {
                    this.multicombotagbox.set_cssclass("dropdown");
                    for (tag in this.multicombotagbox.multicombotags)
                    {
                        this.multicombotagbox.multicombotags[tag].move(0, 0, 0, 0, null, null);
                    }
                }
                else if (this.edittype == "count")
                {
                    this.multicombotext.set_cssclass("dropdown");
                }
            }
            else
            {
                if (this.edittype == "tag")
                {
                    this.multicombotagbox.set_cssclass();
                    for (tag in this.multicombotagbox.multicombotags)
                    {
                        this.multicombotagbox.multicombotags[tag].move(0, 0, 0, 0, null, null);
                    }
                }
                else if (this.edittype == "count")
                {
                    this.multicombotext.set_cssclass();
                }
            }
        }

        if (this._filtereddataset)
        {
            this._filtereddataset.filter("");
        }

        this.on_apply_readonly();
        this.on_apply_autoselect(this.autoselect);

        this._recalcLayout();
    };

    _pMultiCombo.set_popuptype = function (v)
    {
        var popuptype_enum = ["normal", "center", "system", "none"];
        if (popuptype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this.popuptype != v)
        {
            this.popuptype = v;
            this.on_apply_popuptype(v);
        }
    };

    _pMultiCombo.on_apply_popuptype = function (popuptype)
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            popupcontrol._setType(popuptype);
        }
    };

    _pMultiCombo.set_popupsize = function (v)
    {
        if (this.popupsize != v)
        {
            this.popupsize = v;
        }
    };

    _pMultiCombo.set_usecontextmenu = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this.usecontextmenu != v)
        {
            this.usecontextmenu = v;
            this.on_apply_usecontextmenu(v);
        }
    };

    _pMultiCombo.set_acceptvaluetype = function (v)
    {
        var type_enum = ["allowinvalid", "ignoreinvalid"];

        if (type_enum.indexOf(v) == -1)
        {
            return;
        }
        this.acceptvaluetype = v;
    };

    _pMultiCombo.on_apply_usecontextmenu = function (usecontextmenu)
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit.set_usecontextmenu(usecontextmenu);
        }
    };

    _pMultiCombo.set_innerdataset = function (v)
    {
        if (typeof v != "string")
        {
            this.setInnerDataset(v);
            return;
        }

        if (this.innerdataset != v)
        {
            this._removeEventHandlerToInnerDataset();

            if (!v)
            {
                this._innerdataset = null;
                this.innerdataset = "";
            }
            else
            {
                v = v.replace("@", "");
                var _v = this._findDataset(v);
                this._innerdataset = _v ? _v : "";
                this.innerdataset = v;
            }
            this.on_apply_innerdataset(this._innerdataset);
        }
        else if (this.innerdataset && !this._innerdataset)
        {
            this._setInnerDatasetStr(this.innerdataset);
            this.on_apply_innerdataset(this._innerdataset);
        }
    };

    _pMultiCombo.on_apply_innerdataset = function (ds)
    {
        if (this.multicombolist)
        {
            this.multicombolist.setInnerDataset(ds);
        }

        if (ds)
        {
            ds._setEventHandler("onvaluechanged", this._on_dataset_onvaluechanged, this);
            ds._setEventHandler("onrowsetchanged", this._on_dataset_onrowsetchanged, this);

            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            if (this.index > -1)
            {
                this._recheckIndex();
            }
            else if (this.value !== undefined)
            {
                this._recheckValue();
            }
            else if (this.text !== "")
            {
                this._recheckText();
            }

            this.redraw();
        }
    };

    _pMultiCombo.set_codecolumn = function (v)
    {
        if (this.codecolumn != v)
        {
            this.codecolumn = v;
            this.on_apply_codecolumn(v);
        }
    };

    _pMultiCombo.on_apply_codecolumn = function (codecolumn)
    {
        if (this.multicombolist)
        {
            this.multicombolist.set_codecolumn(codecolumn);
        }

        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        if (this._is_created)
        {
            if (this.index > -1)
            {
                this._recheckIndex();
            }
            else if (this.value !== undefined)
            {
                this._recheckValue();
            }
            else if (this.text !== "")
            {
                this._recheckText();
            }
            this._setDefaultProps(this.index, this.value, this.text);
            this.redraw();
        }
    };

    _pMultiCombo.set_datacolumn = function (v)
    {
        if (this.datacolumn != v)
        {
            this.datacolumn = v;
            this.on_apply_datacolumn(v);
        }
    };

    _pMultiCombo.on_apply_datacolumn = function (datacolumn)
    {
        var multicombolist = this.multicombolist;
        if (multicombolist)
        {
            multicombolist.set_datacolumn(this.datacolumn);
        }

        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        if (this._is_created)
        {
            if (this.index > -1)
            {
                this._recheckIndex();
            }
            else if (this.value !== undefined)
            {
                this._recheckValue();
            }
            else if (this.text !== "")
            {
                this._recheckText();
            }
            this._setDefaultProps(this.index, this.value, this.text);
            this.redraw();
        }
    };

    _pMultiCombo.set_buttonsize = function (v)
    {
        if (this.buttonsize != v)
        {
            this.buttonsize = v;
            this.on_apply_buttonsize(v);
        }
    };

    _pMultiCombo.on_apply_buttonsize = function (buttonsize)
    {
        this._recalcLayout();
    };

    _pMultiCombo.set_displayrowcount = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v) || v < 0)
            {
                return;
            }
        }

        if (this.displayrowcount != v)
        {
            this.displayrowcount = v;
        }
    };

    _pMultiCombo.set_itemheight = function (v)
    {
        if (v !== undefined)
        {
            if (isNaN(v = +v))
            {
                return;
            }
        }

        if (this.itemheight != v)
        {
            this.itemheight = v;
            this.on_apply_itemheight(v);
        }
    };

    _pMultiCombo.on_apply_itemheight = function (itemheight)
    {
        var multicombolist = this.multicombolist;
        if (multicombolist)
        {
            multicombolist.set_itemheight(itemheight);
        }
    };

    _pMultiCombo.set_visible = function (v)
    {
        nexacro.Component.prototype.set_visible.call(this, v);

        if (!this.visible && this._isPopupVisible())
        {
            this._closePopup();
        }
    };
    /*
    _pMultiCombo.on_apply_accessibility = function (accessibility)
    {
        nexacro.Component.prototype.on_apply_accessibility.call(this, accessibility);
        if (this.multicomboedit)
        {
            this.multicomboedit.on_apply_accessibility(accessibility);
        }
    };
    */
    _pMultiCombo.set_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (scrollbarbarminsize !== undefined)
        {
            scrollbarbarminsize = parseInt(scrollbarbarminsize);
            if (isNaN(scrollbarbarminsize))
                return;
        }

        this.on_apply_scrollbarbarminsize(scrollbarbarminsize);
    };

    _pMultiCombo.on_apply_scrollbarbarminsize = function (scrollbarbarminsize)
    {
        if (this.scrollbarbarminsize != scrollbarbarminsize)
        {
            this.scrollbarbarminsize = scrollbarbarminsize;

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist.set_scrollbarbarminsize(scrollbarbarminsize);
            }
        }
    };

    _pMultiCombo.set_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (scrollbardecbuttonsize !== undefined)
        {
            scrollbardecbuttonsize = parseInt(scrollbardecbuttonsize);
            if (isNaN(scrollbardecbuttonsize))
                return;
        }

        this.on_apply_scrollbardecbuttonsize(scrollbardecbuttonsize);
    };

    _pMultiCombo.on_apply_scrollbardecbuttonsize = function (scrollbardecbuttonsize)
    {
        if (this.scrollbardecbuttonsize != scrollbardecbuttonsize)
        {
            this.scrollbardecbuttonsize = scrollbardecbuttonsize;

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist.set_scrollbardecbuttonsize(scrollbardecbuttonsize);
            }
        }
    };

    _pMultiCombo.set_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (scrollbarbaroutsize !== undefined)
        {
            scrollbarbaroutsize = parseInt(scrollbarbaroutsize);
            if (isNaN(scrollbarbaroutsize))
                return;
        }

        this.on_apply_scrollbarbaroutsize(scrollbarbaroutsize);
    };

    _pMultiCombo.on_apply_scrollbarbaroutsize = function (scrollbarbaroutsize)
    {
        if (this.scrollbarbaroutsize != scrollbarbaroutsize)
        {
            this.scrollbarbaroutsize = scrollbarbaroutsize;

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist.set_scrollbarbaroutsize(scrollbarbaroutsize);
            }
        }
    };

    _pMultiCombo.set_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (scrollbarincbuttonsize !== undefined)
        {
            scrollbarincbuttonsize = parseInt(scrollbarincbuttonsize);
            if (isNaN(scrollbarincbuttonsize))
                return;
        }

        this.on_apply_scrollbarincbuttonsize(scrollbarincbuttonsize);
    };

    _pMultiCombo.on_apply_scrollbarincbuttonsize = function (scrollbarincbuttonsize)
    {
        if (this.scrollbarincbuttonsize != scrollbarincbuttonsize)
        {
            this.scrollbarincbuttonsize = scrollbarincbuttonsize;

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist.set_scrollbarincbuttonsize(scrollbarincbuttonsize);
            }
        }
    };

    _pMultiCombo.set_scrollbarsize = function (scrollbarsize)
    {
        if (scrollbarsize !== undefined)
        {
            scrollbarsize = parseInt(scrollbarsize);
            if (isNaN(scrollbarsize))
                return;
        }

        this.on_apply_scrollbarsize(scrollbarsize);
    };

    _pMultiCombo.on_apply_scrollbarsize = function (scrollbarsize)
    {
        if (this.scrollbarsize != scrollbarsize)
        {
            this.scrollbarsize = scrollbarsize;

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist.set_scrollbarsize(scrollbarsize);
            }
        }
    };

    _pMultiCombo.set_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (scrollbartrackbarsize !== undefined)
        {
            scrollbartrackbarsize = parseInt(scrollbartrackbarsize);
            if (isNaN(scrollbartrackbarsize))
                return;
        }

        this.on_apply_scrollbartrackbarsize(scrollbartrackbarsize);
    };

    _pMultiCombo.on_apply_scrollbartrackbarsize = function (scrollbartrackbarsize)
    {
        if (this.scrollbartrackbarsize != scrollbartrackbarsize)
        {
            this.scrollbartrackbarsize = scrollbartrackbarsize;

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist.set_scrollbartrackbarsize(scrollbartrackbarsize);
            }
        }
    };

    _pMultiCombo.set_selectall = function (v)
    {
        v = nexacro._toBoolean(v);
        if (this.selectall != v)
        {
            this.selectall = v;
			if (this.multicombolist)
            {
                this.on_apply_selectall();
			}
        }
    };

    _pMultiCombo.on_apply_selectall = function ()
    {
        var ds;

        if (!this.isDropdown())
        {
            ds = this._selectDataset(true);

            if ((this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike") && ds.rowcount == 0)
            {
                ds = this._innerdataset;
            }
			
            this._popupcontrol.destroy();
            this._popupcontrol = null;

            this.multicombolist.destroy();
            this.multicombolist = null;

            if (this.selectallbutton)
            {
                this.selectallbutton.destroy();
                this.selectallbutton = null;
            }
        }
        else
        {
            return false;
        }
        this._createPopupListBoxControl(ds);
    };

    _pMultiCombo.set_edittype = function (v)
    {
        var edittype_enum = ["text", "tag", "count"];
        if (edittype_enum.indexOf(v) == -1)
        {
            return;
        }

        if (this.edittype != v)
        {
            this.edittype = v;
            this.on_apply_edittype(v);
        }
    };

    _pMultiCombo.on_apply_edittype = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (this.edittype == "tag")
            {
                this._createMultiComboTagBoxControl();
                this.multicomboedit.set_value();
            }
            else if (this.edittype == "count")
            {
                this._createMultiComboTextControl();
                this.multicomboedit.set_value();
            }
            else if (this.edittype == "text")
            {
                this._setMultiComboTextValue();
            }
        }
    };

    _pMultiCombo.set_separator = function (v)
    {
        if (this.separator != v)
        {
            if (v == "" || v == undefined)
                this.separator = ",";
            else
                this.separator = nexacro._toString(v);

            this.on_apply_separator();
        }
    };

    _pMultiCombo.on_apply_separator = function ()
    {
        if (this.edittype == "text")
            this._setMultiComboTextValue();
    };

    _pMultiCombo.set_counttext = function (v)
    {
        v = nexacro._toString(v);
        if (this.counttext != v)
        {
            this.counttext = v;
            this.on_apply_counttext(v);
        }
    };

    _pMultiCombo.on_apply_counttext = function (tmpl)
    {
        if (tmpl)
            this._count_tmpl = this.getSelectedCount() + tmpl;

        if (this.multicombotext && this.edittype == "count")
            this._setMultiComboCountValue();
    };

    //===============================================================
    // nexacro.MultiCombo : Methods
    //===============================================================
    _pMultiCombo.dropdown = function ()
    {
        var ds;

        if (!this.enable || this.readonly || !this.visible)
        {
            return false;
        }

        var multicomboedit = this.multicomboedit;
        var input_elem = multicomboedit ? multicomboedit._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
        {
            return false;
        }

        if (!this.isDropdown())
        {
            ds = this._selectDataset(true);

            if ((this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike") && ds.rowcount == 0)
            {
                ds = this._innerdataset;
            }
        }
        else
        {
            return false;
        }

        var lastfocus = this._find_lastFocused();
        if (lastfocus instanceof nexacro.Div)
            lastfocus = lastfocus._getLastFocused();

        if (lastfocus != this)
            this.setFocus(false);

        this._showPopup(ds, this.index, 1);
    };

    _pMultiCombo.isDropdown = function ()
    {
        return this._isPopupVisible();
    };

    _pMultiCombo.getCaretPos = function ()
    {
        if (this.readonly)
        {
            return -1;
        }

        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            return multicomboedit.getCaretPos();
        }

        return -1;
    };

    _pMultiCombo.getSelect = function (v)
    {
        var selectedItems = this._select_multi.items;
        var selectedCount = selectedItems.length;

        for (var i = 0; i < selectedCount; i++)
        {
            if (selectedItems[i] == v)
            {
                return true;
            }
        }
        return false;
    };

    _pMultiCombo.setSelect = function (index, bSelect)
    {
        bSelect = nexacro._toBoolean(bSelect);
        index = parseInt(index) | 0;

        if (index >= 0)
        {
            if (bSelect == true)
            {
                this._select_add(index);
                this._changeIndex(index, true);
            }
            else
            {
                this._select_remove(index);

                var sel = this._select_multi;
                if (sel.length > 0)
                {
                    this._changeIndex(sel.items[sel.length - 1], true);
                }
                else
                {
                    this._changeIndex(-1, true);
                }
            }
        }
        else
        {
            this._clear_all();
            this._changeIndex(-1, true);
        }

        this.redraw();
    };

    _pMultiCombo.getSelectedText = function ()
    {
        if (this.getElement() && this.multicomboedit)
        {
            return this.multicomboedit.getSelectedText();
        }

        return "";
    };

    _pMultiCombo.setSelectedText = function (v)
    {
        if (this.getElement() && this.multicomboedit && this.type != "dropdown")
        {
            return this.multicomboedit.setSelectedText(v);
        }
    };

    _pMultiCombo.getInnerDataset = function ()
    {
        return this._innerdataset;
    };

    _pMultiCombo.setInnerDataset = function (obj)
    {
        this._removeEventHandlerToInnerDataset();

        if (!obj)
        {
            this._innerdataset = null;
            this.innerdataset = "";
            this.on_apply_innerdataset(null);
        }
        else if (obj instanceof nexacro.Dataset || (typeof obj == "object" && obj._type_name == "Dataset"))
        {
            this._innerdataset = obj;
            this.innerdataset = obj.id;
            this.on_apply_innerdataset(obj);
            if (this._is_created)
            {
                this._recheckIndex();
                this.redraw();
            }
        }
    };

    _pMultiCombo.getCount = function ()
    {
        if (this.getElement())
        {
            if (this.multicombolist)
            {
                return this.multicombolist.getCount();
            }
            else if (this._innerdataset)
            {
                return this._innerdataset.getRowCount();
            }
        }

        return 0;
    };

    _pMultiCombo.redraw = function ()
    {
        if (this.edittype == "text")
        {
            this._setMultiComboTextValue();
        }
        else if (this.edittype == "count")
        {
            this._setMultiComboCountValue();
            //this.multicomboedit.set_value();
        }
        else if (this.edittype == "tag")
        {
            this._setMultiComboTagBoxValue();
            //this.multicomboedit.set_value();
        }
    };

    _pMultiCombo.updateToDataset = function ()
    {
        return this.applyto_bindSource("value", this.value);
    };

    _pMultiCombo.getSelectedCount = function ()
    {
        return this._select_multi.length;
    };

    _pMultiCombo.getSelectedItems = function ()
    {
        if (this._select_multi && this._select_multi.length > 0)
        {
            var obj = this._select_multi.items;
            var objsorted = [];
            for (var i = 0, len = obj.length; i < len; i++)
            {
                objsorted[i] = obj[i];
            }
            objsorted.sort(function (a, b) {return a - b;});
            return objsorted;
        }
    };

    _pMultiCombo.selectAll = function ()
    {
        var rowcount = this._innerdataset.rowcount;
        if (rowcount < this._select_multi.length)
        {
            return;
        }

        for (var idx = 0; idx < rowcount; idx++)
        {
            this._select_add(idx);
        }

        var sel = this._select_multi;
        this._changeIndex(sel.items[sel.length - 1], true);
        this.redraw();
    };

    _pMultiCombo.clearSelect = function ()
    {
        var rowcount = this._innerdataset.rowcount;
        for (var idx = 0; idx < rowcount; idx++)
        {
            this._select_remove(idx);
        }
        this._changeIndex(-1, true);
        this.redraw();
    };

    _pMultiCombo.setSelectRange = function (start, end, bSelect)
    {
        bSelect = nexacro._toBoolean(bSelect);
        start = parseInt(start) | 0;
        end = parseInt(end) | 0;

        if (start >= 0 && end <= this.getCount())
        {
            var i;
            if (bSelect == true)
            {
                for (i = start; i <= end; i++)
                {
                    this._select_add(i);
                }
            }
            else
            {
                for (i = start; i <= end; i++)
                {
                    this._select_remove(i);
                }
            }

            var sel = this._select_multi;
            if (sel.length > 0)
            {
                this._changeIndex(sel.items[sel.length - 1], true);
            }
            else
            {
                this._changeIndex(-1, true);
            }

            this.redraw();
        }
    };

    _pMultiCombo.setSelectItems = function (items, bSelect)
    {
        bSelect = nexacro._toBoolean(bSelect);
        var i;

        if (bSelect == true)
        {
            for (i = 0; i < items.length; i++)
            {
                this._select_add(items[i]);
            }
        }
        else
        {
            for (i = 0; i < items.length; i++)
            {
                this._select_remove(items[i]);
            }
        }

        var sel = this._select_multi;
        if (sel.length > 0)
        {
            this._changeIndex(sel.items[sel.length - 1], true);
        }
        else
        {
            this._changeIndex(-1, true);
        }

        this.redraw();
    };

    //===============================================================
    // nexacro.MultiCombo : Events
    //===============================================================
    _pMultiCombo._on_activate = function ()
    {
        nexacro.Component.prototype._on_activate.call(this);

        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            nexacro.Edit.prototype._on_activate.call(multicomboedit);
        }
    };

    _pMultiCombo._on_dropdown = function ()
    {
        if (this.readonly)
        {
            return;
        }

        var multicomboedit = this.multicomboedit;
        var input_elem = multicomboedit ? multicomboedit._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
        {
            return false;
        }

        var ds = this._selectDataset(true);
        var idx = this.index;

        if (this._isPopupVisible())
        {
            this._closePopup();
            this._setEditValue(this._getItemText(this.index));
        }
        else
        {
            if (multicomboedit)
            {
                multicomboedit.setSelect(0, 0);
            }

            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                this._clearFilteredDataset();
            }

            this._showPopup(ds, idx, 1);
        }
    };

    _pMultiCombo._on_value_change = function (preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (!this.on_fire_canitemchange(this, preindex, pretext, prevalue, postindex, posttext, postvalue))
        {
            return false;
        }

        var ds = this._selectDataset();
        var before_index = ds ? this._getIndexFromValue(ds, postvalue) : this.index;

        var bind_applied = this.applyto_bindSource("value", postvalue);
        if (bind_applied)
        {
            var after_index = ds ? this._getIndexFromValue(ds, postvalue) : this.index;
            if (before_index == after_index)
            {
                this.value = postvalue;
                this.text = posttext;
                this.index = postindex;
            }
        }
        else
        {
            if (prevalue == postvalue)
            {
                // Dataset Event의 반환인지, 중복체크로 인한 결과값인지 알수 없음. TODO
                if (preindex != postindex)
                {
                    // 기존 요구사항(RP_84541)으로 처리되었지만, Dataset cancolumnchange 반환값에 대한 대응을 하지 못함.
                    this.value = postvalue;
                    this.text = posttext;
                    this.index = postindex;
                }
            }
            else
            {
                // Dataset Event의 반환값.
                return false;
            }
        }

        if (nexacro._enableaccessibility)
        {
            this._updateAccessibilityLabel();
        }

        this.on_fire_onitemchanged(this, preindex, pretext, prevalue, postindex, posttext, postvalue);

        return true;
    };

    _pMultiCombo._on_dataset_onvaluechanged = function (obj, e)
    {
        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            this._createFilteredDataset();
        }

        this._recheckValue();
        this.redraw();

        if (this._is_created)
        {
            this.on_fire_oninnerdatachanged(obj, e.oldvalue, e.newvalue, e.columnid, e.col, e.row);
        }
    };

    _pMultiCombo._on_dataset_onrowsetchanged = function (obj, e)
    {
        if (e.reason == nexacro.NormalDataset.REASON_FILTER)
        {
            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                this._createFilteredDataset();
            }

            this._recheckValue();
            this.redraw();

            return;
        }
        else if (e.reason == nexacro.NormalDataset.REASON_ASSIGN)
        {
            this.set_index(-1);
            this._recheckIndex();
            this.redraw();
        }
        else if (e.reason == nexacro.NormalDataset.REASON_COPY ||
            e.reason == nexacro.NormalDataset.REASON_ENABLEEVENT)
        {
            if (this.index > -1)
            {
                this._recheckIndex();
            }
            else if (this.value !== undefined)
            {
                this._recheckValue();
            }
            else if (this.text !== "")
            {
                this._recheckText();
            }

            this.redraw();
            this._setDefaultProps(this.index, this.value, this.text);
        }
    };

    _pMultiCombo._on_edit_onlbuttondown = function (obj, e)
    {
        if (this.readonly || (nexacro._isTouchInteraction && nexacro._SupportTouch))
        {
            return;
        }

        var multicomboedit = this.multicomboedit;
        var input_elem = multicomboedit ? multicomboedit._input_element : null;
        if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
        {
            return false;
        }

        var ds = this._selectDataset(true);
        var idx = this.index;

        if (this._isPopupVisible())
        {
            this._closePopup();
            this._setEditValue(this._getItemText(this.index));
        }
        else
        {
            if (this.type == "dropdown")
            {
                this._showPopup(ds, idx, 1);
            }
        }
    };

    _pMultiCombo._on_edit_onkeydown = function (obj, e)
    {
        var multicombolist = this.multicombolist;

        if (this.readonly)
        {
            return false;
        }

        var ds = this._selectDataset();
        var datacol = this.datacolumn;
        var codecol = this.codecolumn;
        var col = this.datacolumn || this.codecolumn;

        if (!ds || (!datacol && !codecol))
        {
            return;
        }

        var keycode = e.keycode;

        var cur_value = this.value;
        var cur_text = this.text;
        var cur_index = this.index;
        var nextidx;
        var rawidx;
        var curobj = null;
        var text = "";
        var rowcnt = ds.getRowCount();
        var enableaccessibility = nexacro._enableaccessibility;
        var filter_last;
        var sel = this._select_multi;

        if (this._isPopupVisible())
        {
            // filter 일 때 재정렬된 값 으로 인자 넘기게 수정
            if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
            {
                for (var i = 0; i < this._filtereddataset._viewRecords.length; i++)
                {
                    if (sel.lastselected == this._filtereddataset._viewRecords[i]._rawidx)
                    {
                        filter_last = i;
                    }
                }
                curobj = multicombolist._get_rowobj_status("mouseover", "status") || multicombolist._get_rowobj_status("selected", "userstatus", filter_last);
                if (curobj)
                {
                    cur_index = curobj.index;
                }
            }
            else
            {
                curobj = multicombolist._get_rowobj_status("mouseover", "status") || multicombolist._get_rowobj_status("selected", "userstatus", sel.lastselected);
                if (curobj)
                {
                    cur_index = curobj.index;
                }
            }
        }

        if (keycode == nexacro.Event.KEY_ESC)
        {
            if (this._isPopupVisible())
            {
                text = this._getItemText(this.index);

                this._closePopup();
                this._setEditValue(text);
            }
        }
        else if (keycode == nexacro.Event.KEY_UP)
        {
            nextidx = cur_index - 1;

            if (this._isPopupVisible())
            {
                if (!e.altkey)
                {
                    if (nextidx < 0)
                    {
                        nextidx = 0;
                    }

                    multicombolist._refreshScroll(nextidx, 1);
                    multicombolist._change_status_item_from_key(cur_index, nextidx);
                }

                multicombolist._select_withkeyupevent(e.shiftkey, cur_index, nextidx);

                if (sel.length > 0)
                {
                    this._changeIndex(sel.items[sel.length - 1]);
                }
                else
                {
                    this._changeIndex(-1);
                }

                this.redraw();
            }
        }
        else if (keycode == nexacro.Event.KEY_DOWN)
        {
            nextidx = cur_index + 1;

            if (this._isPopupVisible())
            {
                if (!e.altkey)
                {
                    if (nextidx >= rowcnt)
                    {
                        nextidx = cur_index;
                    }

                    multicombolist._refreshScroll(nextidx, 0);
                    multicombolist._change_status_item_from_key(cur_index, nextidx);
                    multicombolist._select_withkeydownevent(e.shiftkey, cur_index, nextidx);

                    if (sel.length > 0)
                    {
                        this._changeIndex(sel.items[sel.length - 1]);
                    }
                    else
                    {
                        this._changeIndex(-1);
                    }

                    this.redraw();
                }
            }
            else
            {
                var multicomboedit = this.multicomboedit;
                var input_elem = multicomboedit ? multicomboedit._input_element : null;
                if (e.altkey && (!input_elem || (input_elem && (!input_elem._is_accept_touch || (input_elem._is_accept_touch && input_elem._is_accept_touch())))))
                {
                    this._showPopup(ds, cur_index, 1);
                }
            }
        }
        else if (keycode == nexacro.Event.KEY_ENTER)
        {
            if (cur_index >= 0)
            {
                if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
                {
                    rawidx = this._getRawIndex(ds, cur_index);
                    rawidx = (rawidx == -1) ? cur_index : rawidx;
                    ds.set_filterstr("");
                }
                else
                {
                    rawidx = cur_index;
                }
            }
            else
            {
                rawidx = cur_index;
            }
            this.redraw();

            var rowcount = this._innerdataset.rowcount;
            var idx;

            if (this.edittype == "text")
            {
                // searh일 때
                if (this.type == "search" || this.type == "caseisearch")
                {

                    for (i = 0; i < rowcount; i++)
                    {
                        this._select_remove(i);
                    }
                    var sitems_length = this.search_items.id.length;
                    for (i = 0; i < sitems_length; i++)
                    {
                        // 검색한 값과 ds의 id값을 비교하여 일치하면 _select_multi에 추가
                        if (this.type == "caseisearch")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/^" + this.search_items.id[i] + "/i)");
                            if(ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] == this.search_items.id[i])
                            {
                                this.multicombolist._select_add(idx);
                            }
                        }
                        else
                        {
                            idx = ds.findRowAs(codecol, this.search_items.id[i]);
                            if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] == this.search_items.id[i])
                            {
                                this.multicombolist._select_add(idx);
                            }
                        }
                    }
                    this.multicomboedit.set_value();
                    this.redraw();
                }
                // filter일 때
                if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
                {
                    for (i = 0; i < rowcount; i++)
                    {
                        this._select_remove(i);
                    }
                    for (i = 0; i < this.search_items.name.length; i++)
                    {
                        if (this.type == "filter")
                        {
                            idx = ds.findRowAs(codecol, this.search_items.id[i]);
                        }
                        else if (this.type == "caseisearch")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/^" + this.search_items.id[i] + "/i)");
                        }
                        else if (this.type == "caseifilter")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/^(" + this.search_items.id[i] + ")/i)");
                        }
                        else if (this.type == "filterlike")
                        {
                            idx = ds.findRowExpr(codecol + ".indexOf('" + this.search_items.id[i] + "') > -1");
                        }
                        else if (this.type == "caseifilterlike")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/(" + this.search_items.id[i] + ")/i)");
                        }
                        // 검색한 값과 ds의 id값을 비교하여 일치하면 _select_multi에 추가
                        if (ds._viewRecords[idx] != undefined && ds._viewRecords[idx][0] == this.search_items.id[i])
                        {
                            this.multicombolist._select_add(ds._viewRecords[idx]._rawidx);
                        }
                    }
                    this.multicomboedit.set_value();
                    this.redraw();
                }
            }
            else  // edittype count, tag 일때
            {
                // search 일 때
                if (this.type == "search" || this.type == "caseisearch")
                {
                    for (var i = 0; i < this.search_items.name.length; i++)
                    {
                        // 검색한 값과 ds의 id값을 비교하여 일치하면 _select_multi에 추가
                        if (this.type == "caseisearch")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/^" + this.search_items.id[i] + "/i)");
                            if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] == this.search_items.id[i])
                            {
                                this.multicombolist._select_add(idx);
                            }
                        }
                        else
                        {
                            idx = ds.findRowAs(codecol, this.search_items.id[i]);
                            if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] == this.search_items.id[i])
                            {
                                this.multicombolist._select_add(idx);
                            }
                        }
                    }
                    this.multicomboedit.set_value();
                    this.redraw();
                }
                // filter 일 때 
                if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
                {
                    for (i = 0; i < this.search_items.name.length; i++)
                    {
                        if (this.type == "filter")
                        {
                            idx = ds.findRowAs(codecol, this.search_items.id[i]);
                        }
                        else if (this.type == "caseisearch")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/^" + this.search_items.id[i] + "/i)");
                        }
                        else if (this.type == "caseifilter")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/^(" + this.search_items.id[i] + ")/i)");
                        }
                        else if (this.type == "filterlike")
                        {
                            idx = ds.findRowExpr(codecol + ".indexOf('" + this.search_items.id[i] + "') > -1");
                        }
                        else if (this.type == "caseifilterlike")
                        {
                            idx = ds.findRowExpr(codecol + ".match(/(" + this.search_items.id[i] + ")/i)");
                        }
                        // 검색한 값과 ds의 id값을 비교하여 일치하면 _select_multi에 추가
                        if (ds._viewRecords[idx] != undefined && ds._viewRecords[idx][0] == this.search_items.id[i])
                        {
                            this.multicombolist._select_add(ds._viewRecords[idx]._rawidx);
                        }
                    }
                    this.multicomboedit.set_value();
                    this.redraw();
                }
            }

            if (this._isPopupVisible())
            {
                this._is_close_popup_by_select = true;
                this._closePopup();
                this._is_close_popup_by_select = false;

                if (this.autoskip)
                {
                    this._setFocusToNextComponent();
                }
            }

            var sel = this._select_multi;
            if (sel.length > 0)
            {
                this._changeIndex(sel.items[sel.length - 1]);
            }
            else
            {
                this._changeIndex(-1);
            }

            this._setDefaultProps(cur_index, cur_value, cur_text);
        }
        else if (keycode == nexacro.Event.KEY_PAGE_UP)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = cur_index - multicombolist._page_rowcount;

                if (nextidx <= 0)
                {
                    nextidx = 0;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                multicombolist._refreshScroll(null, null, keycode);
                multicombolist._change_status_item_from_key(cur_index, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_PAGE_DOWN)
        {
            if (this._isPopupVisible())
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = curidx + multicombolist._page_rowcount;

                if (nextidx >= rowcnt)
                {
                    nextidx = rowcnt - 1;
                }

                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                multicombolist._refreshScroll(null, null, keycode);
                multicombolist._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_HOME)
        {
            if (this._isPopupVisible() && this.type == "dropdown")
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = 0;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                multicombolist._refreshScroll(null, null, keycode);
                multicombolist._change_status_item_from_key(curidx, nextidx);
            }
        }
        else if (keycode == nexacro.Event.KEY_END)
        {
            if (this._isPopupVisible() && this.type == "dropdown")
            {
                var curidx = cur_index;
                if (curidx < 0)
                    curidx = 0;

                nextidx = rowcnt - 1;
                text = ds.getColumn(nextidx, datacol || codecol);
                text = text == undefined ? "" : text;

                this._setEditValue(text);
                multicombolist._refreshScroll(null, null, keycode);
                multicombolist._change_status_item_from_key(curidx, nextidx);
            }
        }
        // space+ctrl 선택
        else if ((keycode == nexacro.Event.KEY_SPACE) && e.ctrlkey)
        {
            if (this.type == "dropdown")
            {
                this.multicombolist._select_withmouseevent(cur_index);
            }
            else if (this.type == "search" || this.type == "caseisearch")
            {
                this.multicombolist._select_withmouseevent(curobj.index, curobj);
            }
            else 
            {
                this.multicombolist._select_withmouseevent(this._filtereddataset._viewRecords[curobj.index]._rawidx, curobj);
            }

            if (sel.length > 0)
            {
                this._changeIndex(sel.items[sel.length - 1]);
            }
            else
            {
                this._changeIndex(-1);
            }

            this.redraw();
        }
        // alt + A 전체선택
        else if ((keycode == 65) && e.altkey)
        {
            if (this._select_multi.length != this._innerdataset.rowcount)
            {
                this._select_all();
                var last_idx = this._select_multi.items[this._select_multi.length - 1];
                this._changeIndex(last_idx);
            }
            else
            {
                this._clear_all();
                this._changeIndex(-1);
            }
            this.redraw();
        }
    };

    _pMultiCombo._on_edit_onkeyup = function (obj, e)
    {
        var multicombolist = this.multicombolist;

        if (this.readonly)
        {
            return false;
        }

        var ds = this._selectDataset();
        var datacol = this.datacolumn;
        var codecol = this.codecolumn;

        if (!ds || (!datacol && !codecol))
        {
            return;
        }

        var keycode = e.keycode;

        if (keycode == nexacro.Event.KEY_UP || keycode == nexacro.Event.KEY_DOWN)
        {
            if (this._isPopupVisible())
            {
                var curobj = multicombolist._get_rowobj_status("mouseover", "status") || multicombolist._get_rowobj_status("selected", "userstatus");
                if (curobj)
                {
                    var curidx = curobj.index;
                    if (!e.shiftkey)
                    {
                        if (this.type == "dropdown" || this.type == "search" || this.type == "caseisearch")
                        {
                            multicombolist._shift_select_base_index = curidx;
                            multicombolist._is_shift_select_base_index = multicombolist._is_selected(curidx);
                        }
                        else
                        {
                            multicombolist._shift_select_base_index = curidx;
                            multicombolist._is_shift_select_base_index = multicombolist._is_selected(this._filtereddataset._viewRecords[curidx]._rawidx);
                        }

                    }
                }
            }
        }
    };

    _pMultiCombo._on_edit_oninput = function (obj, e)
    {
        if (this.readonly || !this._isEnable())
        {
            return false;
        }

        this._isFiredOnInput = true;
        this.on_fire_oninput();

        var multicomboedit = this.multicomboedit;
        var input_elem = multicomboedit ? multicomboedit._input_element : null;
        if (input_elem && (input_elem._is_accept_touch && !input_elem._is_accept_touch()))
        {
            if (this._isPopupVisible())
            {
                this._closePopup();
            }
            return false;
        }

        var ds = this._selectDataset();
        if (ds && multicomboedit._processing_keyfilter)
        {
            var col = this.datacolumn || this.codecolumn;
            var edit_val = multicomboedit.text;
            var codecol = this.codecolumn;
            // search_items.name 배열
            var str = edit_val;
            this.search_items.name = str.split(this.separator);
            
            var last_separator_index = edit_val.lastIndexOf(this.separator);
            edit_val = edit_val.substr(last_separator_index + 1);

            var type = this.type;
            if (type != "dropdown")
            {
                if (!this.multicombolist)
                {
                    this._createPopupListBoxControl(ds);
                }
            }

            switch (type)
            {
                case "search":
                case "caseisearch":
                    var index;
                    
                    if (this.type == "caseisearch")
                    {
                        index = ds.findRowExpr(col + ".match(/^" + edit_val + "/i)");
                        if (edit_val == "")
                        {
                            index = -1;
                        }
                    }
                    else
                        index = ds.findRowAs(col, edit_val);

                    if (index >= 0)
                    {
                        this._showPopup(ds, index);

                        // 검색한 값의 상태 mouseover로 변경
                        var rowobj = this.multicombolist._getItem(index);
                        if (rowobj)
                        {
                            rowobj._changeStatus("mouseover", true);
                            this.multicombolist._set_last_selectfocused(index);
                        }

                        // 검색한 값 search_items에 저장
                        if (edit_val)
                        {
                            this.search_items.name[this.search_items.name.length - 1] = edit_val;
                        }
						else
                        {
                            this.search_items.name[this.search_items.name.length - 1] = null;
                        }

                        var search_id = ds._rawRecords[index][0];
                        // 검색한 값과 ds의 값이 일치하면 search_items에 id 추가
                        if (ds._rawRecords[index][1].toLowerCase() == this.search_items.name[this.search_items.name.length - 1].toLowerCase())
                        {
                            this.search_items.id[this.search_items.name.length - 1] = search_id;
                        }
						else // 일치하지 않으면 삭제 
                        {	
							if (this.search_items.id[this.search_items.name.length - 1] == search_id)
                            {
                                this.search_items.id.splice(this.search_items.name.length - 1, 1);
							}
						}
                    }
                    else
                    {
                        if (this._isPopupVisible())
                        {
                            this._closePopup();
                            // seperator 들어갈 때 선택여부
                            for (var i = 0; i < this.search_items.name.length; i++)
                            {
                                var idx;
                                // 구분자가 들어 갈 때 검색한 값의 id로 그 값의 index를 가져와서 비교
                                if (this.search_items.name[this.search_items.name.length - 1] == "")
                                {
                                    if (this.type == "caseisearch")
                                    {
                                        var sidx = ds.findRowAs(col, this.search_items.name[i]);
                                        idx = ds.findRowExpr(codecol + ".match(/^" + this.search_items.id[i] + "/i)");
                                        if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] == this.search_items.id[i])
                                        {
                                            this.multicombolist._select_add(idx);
                                            if (ds._rawRecords[idx][0] != this.search_items.id[i])
                                            {
                                                this.redraw();
                                            }
                                        }
                                        else if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] != this.search_items.id[i])
                                        {
                                            this.multicombolist._select_remove(idx);
                                            this.redraw();
                                        }
                                    }
                                    else
                                    {
                                        idx = ds.findRowAs(codecol, this.search_items.id[i]);
                                        if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] == this.search_items.id[i])
                                        {
                                            this.multicombolist._select_add(idx);
                                        }
                                        else if (ds._rawRecords[idx] != undefined && ds._rawRecords[idx][0] != this.search_items.id[i])
                                        {
                                            this.multicombolist._select_remove(idx);
                                            this.redraw();
                                        }
                                    }
                                }
                            }
                            var sel = this._select_multi;
                            if (sel.length > 0)
                            {
                                this._changeIndex(sel.items[sel.length - 1]);
                            }
                            else
                            {
                                this._changeIndex(-1);
                            }
                        }
                    }
                    break;
                case "filter":
                case "filterlike":
                case "caseifilter":
                case "caseifilterlike":
                    var regExp;
                    var parse_val = "";
                    var trans_val = "";
                    var edit_val_len = edit_val.length;
                    var index;
                    // 특수문자 입력시 \\을 붙여준다.
                    for (var i = 0; i < edit_val_len; i++)
                    {
                        regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
                        var c = edit_val.charAt(i);

                        if (regExp.test(c))
                            parse_val += "\\";
                        parse_val += c;
                    }

                    trans_val = new nexacro.ExprParser()._transferWhitespace(parse_val);

                    if (this.type == "filter")
                    {
                        ds.set_filterstr(col + ".match(/^(" + trans_val + ")/)");
                        index = ds.findRowAs(col, parse_val);
                    }
                    else if (this.type == "filterlike")
                    {
                        ds.set_filterstr(col + ".indexOf('" + parse_val + "') > -1");
                        index = ds.findRowExpr(col + ".indexOf('" + parse_val + "') > -1");
                    }
                    else if (this.type == "caseifilter")
                    {
                        ds.set_filterstr(col + ".match(/^(" + trans_val + ")/i)");
                        index = ds.findRowExpr(col + ".match(/^(" + trans_val + ")/i)");
                    }
                    else  //caseifilterlike
                    {
                        ds.set_filterstr(col + ".match(/(" + trans_val + ")/i)");
                        index = ds.findRowExpr(col + ".match(/(" + trans_val + ")/i)");
					}  

                    if (edit_val && ds.getRowCount() > 0)
                    {
                        this._showPopup(ds, 0);

                        var win = this._getWindow();
                        if (win)
                        {
                            if (nexacro._Browser == "Runtime" && (nexacro._SystemType.toLowerCase() == "win32" || nexacro._SystemType.toLowerCase() == "win64"))
                                nexacro._flushCommand(win);
                        }

                        // 검색한 값의 상태 변경
                        var rowobj = this.multicombolist._getItem(index);
                        if (rowobj)
                        {
                            rowobj._changeStatus("mouseover", true);
                            this.multicombolist._set_last_selectfocused(index);
                        }

                        // search_items에 검색한 값 저장
                        this.search_items.name = str.split(this.separator);

                        // 검색한 값과 ds의 값이 일치하면 그 값의 id search_items에 추가
                        var search_id = ds._viewRecords[index][0];
                        if (index != -1 && ds._viewRecords[index][1] == this.search_items.name[this.search_items.name.length - 1])
                        {
                            this.search_items.id[this.search_items.name.length - 1] = search_id;
                        }
                        else // 일치하지 않으면 삭제
                        {
                            var sitems_id = this.search_items.id;
                            for (i = 0; i < sitems_id.length; i++)
                            {
                                if (sitems_id[i] == search_id)
                                {
                                    this.search_items.id.splice(i, 1);
                                }
                            }
                        }
                    }
                    else
                    {
                        if (this._isPopupVisible())
                        {
                            this._closePopup();

                            // search_items 의 id으로 ds에서 index를 가져옴
                            for (var i = 0; i < this.search_items.name.length; i++)
                            {
                                var idx;
                                if (this.search_items.name[this.search_items.name.length - 1] == "")
                                {
                                    // var sidx = ds.findRowAs(col, this.search_items.name[i]);
                                    if (this.type == "filter")
                                    {
                                        idx = ds.findRowAs(codecol, this.search_items.id[i]);
                                    }
                                    else if (this.type == "caseifilter")
                                    {
                                        idx = ds.findRowExpr(codecol + ".match(/^(" + this.search_items.id[i] + ")/i)");
                                    }
                                    else if (this.type == "filterlike")
                                    {
                                        idx = ds.findRowExpr(codecol + ".indexOf('" + this.search_items.id[i] + "') > -1");
                                    }
                                    else if (this.type == "caseifilterlike")
                                    {
                                        idx = ds.findRowExpr(codecol + ".match(/(" + this.search_items.id[i] + ")/i)");
                                    }
                                    // 가져온 index를 이용하여 값을 비교 
                                    if (ds._viewRecords[idx] != undefined && ds._viewRecords[idx][1].toLowerCase() == this.search_items.name[i].toLowerCase() && ds._viewRecords[idx][0] == this.search_items.id[i])
                                    {
                                        this.multicombolist._select_add(idx);
                                        if (ds._viewRecords[idx][0] != this.search_items.id[i])
                                        {
                                            this.redraw();
                                        }
                                    }
                                    else if (ds._viewRecords[idx] != undefined && ds._viewRecords[idx][0] != this.search_items.id[i])
                                    {
                                        this.multicombolist._select_remove(idx);
                                        this.redraw();
                                    }
                                }
                            }
                            var sel = this._select_multi;
                            if (sel.length > 0)
                            {
                                this._changeIndex(sel.items[sel.length - 1]);
                            }
                            else
                            {
                                this._changeIndex(-1);
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    };

    _pMultiCombo._on_edit_oneditclick = function (obj, e)
    {
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pMultiCombo._on_edit_mobile_oneditclick = function (obj, e)
    {
        if (!this.readonly)
        {
            var multicomboedit = this.multicomboedit;
            var input_elem = multicomboedit ? multicomboedit._input_element : null;
            if (input_elem && input_elem._is_accept_touch && !input_elem._is_accept_touch())
            {

            }
            else
            {
                var ds = this._selectDataset(true);
                var idx = this.index;

                if (this._isPopupVisible())
                {
                    this._closePopup();
                    this._setEditValue(this._getItemText(this.index));
                }
                else
                {
                    if (this.type == "dropdown")
                    {
                        this._showPopup(ds, idx, 1);
                    }
                }
            }
        }
        this.on_fire_oneditclick(obj, e.caretpos, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, obj, obj, e.metakey);
    };

    _pMultiCombo._on_drop_onlbuttondown = function (obj, e)
    {
        if (e.button == "lbutton")
            this._on_dropdown();
    };

    _pMultiCombo._on_drop_mobile_onclick = function (obj, e)
    {
        this._on_dropdown();
    };

    _pMultiCombo._on_drop_onclick = function (obj, e)
    {
        if (e.button == "touch")
            this._on_dropdown();
    }; // control

    _pMultiCombo._on_list_onitemclick = function (obj, e)
    {
        if (!this.multicombolist || !this.multicomboedit)
        {
            return false;
        }

        var cur_index = e.index;
        var cur_text = e.itemtext;
        var cur_value = e.itemvalue;

        this.on_fire_onitemclick(obj, cur_index, cur_text, cur_value, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.metakey);

        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            var ds = this._selectDataset();
            cur_index = this._getRawIndex(ds, e.index);
            if (cur_index != this.index)
            {
                cur_text = this._getItemText(cur_index);
                cur_value = this._getItemValue(cur_index);
            }
        }

        this._is_close_popup_by_select = true;

        var sel = this._select_multi;
        if (sel.length > 0)
        {
            this._changeIndex(sel.items[sel.length - 1]);
        }
        else
        {
            this._changeIndex(-1);
        }

        this.redraw();

        if (this._isPopupVisible())
        {
            //this._closePopup();

            if (this.autoskip)
            {
                this._setFocusToNextComponent();
            }
        }

        this._is_close_popup_by_select = false;
    };

    _pMultiCombo._on_list_oncloseup = function (obj, e)
    {
        var _window = this._getWindow();
        if (_window && this._track_capture)
        {
            _window._releaseCaptureLock(this);
        }

        if (!this._isFiredOnInput)
        {
            if (this.displaynulltext != "" && nexacro._isNull(this.value))
            {
                this._setEditValue(undefined);
            }
            else
            {
                this._setEditValue(this.text);
            }
        }

        this._isFiredOnInput = false;
        this._changeStatus("mouseover", false);
        this.multicomboedit._changeStatus("mouseover", false);
        this.dropbutton._changeStatus("mouseover", false);

        this.on_fire_oncloseup(this, this._default_index, this._default_text, this._default_value, this.index, this.text, this.value, this._is_close_popup_by_select);

    };

    _pMultiCombo.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        this._changeStatus("focused", true);

        if (nexacro._enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }

        this._apply_setfocus(evt_name);
    };

    _pMultiCombo.on_killfocus_basic_action = function (new_focus, new_refer_focus)
    {
        nexacro.Component.prototype.on_killfocus_basic_action.call(this);

        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            multicomboedit._changeStatus("focused", false);
            if (nexacro._enableaccessibility)
            {
                if (nexacro._Browser == "Runtime")
                {
                    multicomboedit._is_subfocused = false;
                }
            }

            if (this.text != this.multicomboedit.text)
            {
                multicomboedit.setCaretPos(0);
            }
        }

        //this.redraw();

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
    };

    _pMultiCombo.on_fire_sys_onaccessibilitygesture = function (direction, fire_comp, refer_comp)
    {
        var ret = false;
        if (this._isPopupVisible())
        {
            var multicombolist = this.multicombolist;
            var item = null;
            var item_len = multicombolist._getContentsCount();
            if (item_len)
            {
                if (direction)
                {
                    multicombolist._overeditemindex++;
                }
                else
                {
                    multicombolist._overeditemindex--;
                }

                // 첫번째 아이템에서 역방향으로 슬라이드하면 이전 컴포넌트로 이동.
                // 마지막 아이템에서 순방향으로 슬라이드하면 다음 컴포넌트로 이동.
                if (multicombolist._overeditemindex < 0 || multicombolist._overeditemindex > item_len - 1)
                {
                    if (this._isPopupVisible())
                    {
                        this._closePopup();
                    }
                    multicombolist._overeditemindex = -1;
                }
                else
                {
                    item = multicombolist._getItem(multicombolist._overeditemindex);
                }
            }

            if (item)
            {
                ret = true;
                item._setAccessibilityNotifyEvent();
            }
        }
        return ret;
    };

    _pMultiCombo.on_fire_sys_onslide = function (elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_onslide.call(this, elem, touch_manager, touchinfos, xaccvalue, yaccvalue, xdeltavalue, ydeltavalue, from_comp, from_refer_comp);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pMultiCombo.on_fire_sys_onfling = function (elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_onfling.call(this, elem, fling_handler, xstartvalue, ystartvalue, xdeltavalue, ydeltavalue, touchlen, from_comp, from_refer_comp);

        return (this._popupcontrol && this._popupcontrol._is_popup()) ? true : false;
    };

    _pMultiCombo.on_fire_oneditclick = function (obj, caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        if (this.oneditclick && this.oneditclick._has_handlers)
        {
            var evt = new nexacro.EditClickEventInfo(obj, "oneditclick", caretpos, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this, from_refer_comp, meta_key);
            return this.oneditclick._fireEvent(this, evt);
        }

        //this._on_dropdown();
        return true;
    };

    _pMultiCombo.on_fire_onitemclick = function (obj, index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key)
    {
        if (this.onitemclick && this.onitemclick._has_handlers)
        {
            var evt = new nexacro.ItemClickEventInfo(obj, "onitemclick", index, itemtext, itemvalue, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, meta_key);
            this.onitemclick._fireEvent(this, evt);
        }

        return false;
    };

    _pMultiCombo.on_fire_canitemchange = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.canitemchange && this.canitemchange._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "canitemchange", preindex, pretext, prevalue, postindex, posttext, postvalue);
            var ret = this.canitemchange._fireCheckEvent(this, evt);
            return nexacro._toBoolean(ret);
        }

        return true;
    };

    _pMultiCombo.on_fire_onitemchanged = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue)
    {
        if (this.onitemchanged && this.onitemchanged._has_handlers)
        {
            var evt = new nexacro.ItemChangeEventInfo(this, "onitemchanged", preindex, pretext, prevalue, postindex, posttext, postvalue);
            this.onitemchanged._fireEvent(this, evt);
        }
    };

    _pMultiCombo.on_fire_oncloseup = function (obj, preindex, pretext, prevalue, postindex, posttext, postvalue, is_select)
    {
        var ret;
        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            var evt = new nexacro.ComboCloseUpEventInfo(this, "oncloseup", preindex, pretext, prevalue, postindex, posttext, postvalue, is_select);
            ret = this.oncloseup._fireEvent(this, evt);
            ret = nexacro._toBoolean(ret);
        }
        
        return ret;
    };

    _pMultiCombo.on_fire_ondropdown = function (obj)
    {
        if (this.ondropdown && this.ondropdown._has_handlers)
        {
            var evt = new nexacro.EventInfo(this, "ondropdown");
            return this.ondropdown._fireCheckEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_oninput = function ()
    {
        if (this.oninput && this.oninput._has_handlers)
        {
            var evt = new nexacro.InputEventInfo(this, "oninput");
            return this.oninput._fireEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_oninnerdatachanged = function (obj, oldvalue, newvalue, columnid, col, row)
    {
        if (this.oninnerdatachanged && this.oninnerdatachanged._has_handlers)
        {
            var evt = new nexacro.InnerdataChangedEventInfo(obj, "oninnerdatachanged", oldvalue, newvalue, columnid, col, row);
            return this.oninnerdatachanged._fireEvent(this, evt);
        }

        return true;
    };

    _pMultiCombo.on_fire_sys_onrbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        if (this.isDropdown())
        {
            var sel_info_list = this.multicombolist._selectinfo_list;

            if (this._scroll_proc)
            {
                if (sel_info_list.length)
                {
                    var last = sel_info_list.length - 1;
                    var info = sel_info_list[last];

                    if (info.index != this.index)
                    {
                        info.obj._stat_change("notselect", "normal");
                        sel_info_list.splice(last, 1);
                    }
                }
                return;
            }

            while (sel_info_list.length)
            {
                var down_item = sel_info_list[0].obj;
                if (down_item)
                {
                    if (!down_item.selected)
                    {
                        down_item._stat_change("notselect", "normal");
                    }

                }
                sel_info_list.shift();
            }
        }
        return;
    };

    _pMultiCombo._on_multicombotext_onlbuttondown = function (obj, e)
    {
        if (this.readonly || (nexacro._isTouchInteraction && nexacro._SupportTouch))
        {
            return;
        }

        var ds = this._selectDataset(true);
        var idx = this.index;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
        else
        {
            this._showPopup(ds, idx, 1);
        }
    };

    _pMultiCombo._on_multicombotext_mobile_onclick = function (obj, e)
    {
        var ds = this._selectDataset(true);
        var idx = this.index;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }
        else
        {
            this._showPopup(ds, idx, 1);
        }
    };

    _pMultiCombo._on_tagbutton_click = function (index, obj)
    {
        if (!this.enable || this.readonly || !this.visible)
        {
            return false;
        }

        if (this.multicombolist)
            this.multicombolist._select_withmouseevent(index, obj);
        else
            this._select_remove(index);

        this.multicombotagbox._destroyMulticomboTag(index);

        this._recalcLayout();
    };

    //===============================================================
    // nexacro.MultiCombo : Logical part
    //===============================================================
    _pMultiCombo._createListBoxControl = function (ds)
    {
        if (!this._isUsableDataset(ds))
        {
            return;
        }

        var datacol = this.datacolumn;
        var codecol = this.codecolumn;
        var multicombolist = this.multicombolist;

        if (!multicombolist)
        {
            multicombolist = this.multicombolist = new nexacro._MultiComboListControl("multicombolist", 0, 0, 0, 0, null, null, null, null, null, null, this);

            multicombolist.set_scrolltype("vertical");
            var vscrollbartype = this._getVScrollBarType() || "auto";

            multicombolist.set_scrollbartype("none " + vscrollbartype);
            multicombolist.setInnerDataset(ds);
            multicombolist.set_codecolumn(codecol);
            multicombolist.set_datacolumn(datacol);
            multicombolist.set_index(this.index);
            multicombolist.set_itemheight(this.itemheight);
            multicombolist.set_cssclass(this.cssclass);
            multicombolist.set_scrollbarbarminsize(this.scrollbarbarminsize);
            multicombolist.set_scrollbardecbuttonsize(this.scrollbardecbuttonsize);
            multicombolist.set_scrollbarbaroutsize(this.scrollbarbaroutsize);
            multicombolist.set_scrollbarincbuttonsize(this.scrollbarincbuttonsize);
            multicombolist.set_scrollbarsize(this.scrollbarsize);
            multicombolist.set_scrollbartrackbarsize(this.scrollbartrackbarsize);

            multicombolist._setPopupContains(true);
            multicombolist.createComponent(true);
        }
        else
        {
            if (multicombolist._is_created)
            {
                if (multicombolist._innerdataset != ds)
                {
                    multicombolist.setInnerDataset(ds);
                }
            }
        }
    };

    _pMultiCombo._createSelectAllButtonControl = function (ds)
    {
        if (!this._isUsableDataset(ds))
        {
            return;
        }
        var selectallbutton = this.selectallbutton;
        var selectall_width;

        // popupsize에 따라 width 수정
        if (this.popupsize)
        {
            selectall_width = this.popupsize.split(" ", 1);
        }
		else
        {
            selectall_width = this._width;
		}
        if (!selectallbutton)
        {
            selectallbutton = this.selectallbutton = new nexacro._SelectAllControl("selectall", 0, 0, selectall_width, this.height/2, null, null, null, null, null, null, this);

            selectallbutton.set_text(nexacro._toString("SELECT ALL"));
            selectallbutton.set_textAlign("center");
            selectallbutton._setPopupContains(true);
            selectallbutton.createComponent(true);
        }
    };

    _pMultiCombo._createdListBoxControl = function (ds)
    {
        var multicombolist = this.multicombolist;
        if (multicombolist && !multicombolist._is_created)
        {
            multicombolist._setEventHandler("oncloseup", this._on_list_oncloseup, this);
            multicombolist._setEventHandler("onitemclick", this._on_list_onitemclick, this);

            multicombolist.on_created();
        }
    };

    _pMultiCombo._createdSelectAllButtonControl = function (ds)
    {
        var selectallbutton = this.selectallbutton;
        if (selectallbutton && !selectallbutton._is_created)
        {
            selectallbutton.on_created();
        }
    };
    _pMultiCombo._createPopupControl = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (!popupcontrol)
        {
            popupcontrol = this._popupcontrol = new nexacro._MultiComboPopupControl("multicombopopup", 0, 0, 0, 0, null, null, null, null, null, null, this);
            popupcontrol._setType(this.popuptype);

            popupcontrol.createComponent(true);
        }
    };

    _pMultiCombo._createdPopupControl = function (attach_comp, selectallbutton)
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol && !popupcontrol._is_created)
        {
            if (!this.selectall)
            {
                popupcontrol._attach(attach_comp);
                popupcontrol.on_created();
            }
			else
            {
                popupcontrol._attach_multi(attach_comp, selectallbutton);
                popupcontrol.on_created();
			}
            
        }
    };

    _pMultiCombo._createPopupListBoxControl = function (ds)
    {
        if (!this._isUsableDataset(ds))
        {
            return;
        }

        if (!this.selectall)
        {
            this._createPopupControl();
            this._createListBoxControl(ds);

            this._createdPopupControl(this.multicombolist);
            this._createdListBoxControl();
        }
		else
        {
            this._createPopupControl();
            this._createListBoxControl(ds);
            this._createSelectAllButtonControl(ds);

            this._createdPopupControl(this.multicombolist, this.selectallbutton);
            this._createdListBoxControl();
            this._createdSelectAllButtonControl();

		}
    };

    _pMultiCombo._createFilteredDataset = function ()
    {
        var ids = this._innerdataset;
        var fds = this._filtereddataset;
        var codecol = this.codecolumn;
        var datacol = this.datacolumn;
        var multicombolist = this.multicombolist;

        if (ids && (!(codecol in ids.colinfos) || !(datacol in ids.colinfos)))
        {
            return;
        }

        if (!this._isUsableDataset(ids))
        {
            return;
        }

        if (!fds)
        {
            fds = this._filtereddataset = new nexacro.Dataset("filter_" + this.id);
        }

        fds.set_enableevent(false);

        fds.clear();
        fds.addColumn(codecol, "string");
        fds.addColumn(datacol, "string");

        for (var i = 0, cnt = ids.getRowCount(); i < cnt; i++)
        {
            fds.insertRow(i);
            fds.setColumn(i, codecol, ids.getColumn(i, codecol));
            fds.setColumn(i, datacol, ids.getColumn(i, datacol));
        }

        fds.set_enableevent(true);

        if (multicombolist)
        {
            multicombolist._redrawListBoxContents(false);
            multicombolist._onRecalcScrollSize();
        }
    };

    _pMultiCombo._recalcLayout = function ()
    {
        if (this._is_created_contents)
        {
            var multicomboedit = this.multicomboedit;
            var dropbutton = this.dropbutton;
            var multicombotext = this.multicombotext;
            var multicombotagbox = this.multicombotagbox;

            var client_left = this._getClientLeft();
            var client_top = this._getClientTop();
            var client_width = this._getClientWidth();
            var client_height = this._getClientHeight();

            var dropbutton_size = this.buttonsize;
            var dropbutton_width, dropbutton_height;

            var edit_height = 0;

            if (this.type == "dropdown" || this.edittype == "text")
            {
                if (dropbutton_size == undefined)
                {
                    dropbutton_width = client_height;
                    dropbutton_height = client_height;
                }
                else
                {
                    if (typeof (dropbutton_size) == "number")
                    {
                        dropbutton_width = dropbutton_height = dropbutton_size;
                    }
                    else
                    {
                        dropbutton_size = dropbutton_size.split(" ");
                        dropbutton_width = +dropbutton_size[0];
                        dropbutton_height = (dropbutton_size[1]) ? +dropbutton_size[1] : client_height;
                    }
                }
            }
            else
            {
                var textsize = nexacro._getTextSize("A",
                    this._getCurrentStyleInheritValue("font"), false, undefined, "none",
                    this._getCurrentStyleInheritValue("wordSpacing"),
                    this._getCurrentStyleInheritValue("letterSpacing"));

                if (dropbutton_size == undefined)
                {
                    edit_height = textsize[1];
                    dropbutton_width = dropbutton_height = textsize[1];
                }
                else
                {
                    if (typeof (dropbutton_size) == "number")
                    {
                        edit_height = dropbutton_width = dropbutton_height = Math.max(dropbutton_size, textsize[1]);
                    }
                    else
                    {
                        dropbutton_size = dropbutton_size.split(" ");
                        dropbutton_width = +dropbutton_size[0];

                        if (dropbutton_size.length == 1)
                            edit_height = dropbutton_height = textsize[1];
                        else
                            edit_height = dropbutton_height = Math.max((dropbutton_size[1]) ? +dropbutton_size[1] : client_height, textsize[1]);
                    }
                }
            }

            if (dropbutton_width > client_width)
            {
                dropbutton_width = client_width;
            }
            if (dropbutton_height > client_height)
            {
                dropbutton_height = client_height;
                edit_height = client_height;
            }

            if (multicombotext)
            {
                var text_width, text_height;

                if (this.type == "dropdown")
                {
                    text_width = client_width - dropbutton_width;
                    text_height = client_height;
                }
                else
                {
                    text_width = client_width;
                    text_height = client_height - edit_height;
                }

                multicombotext.move(client_left, client_top, text_width, text_height, null, null);
            }

            if (multicombotagbox)
            {
                var tagbox_width, tagbox_height;

                if (this.type == "dropdown")
                {
                    tagbox_width = client_width - dropbutton_width;
                    tagbox_height = client_height;
                }
                else
                {
                    tagbox_width = client_width;
                    tagbox_height = client_height - edit_height;
                }

                multicombotagbox.move(client_left, client_top, tagbox_width, tagbox_height, null, null);

                multicombotagbox._recalcTagLayout(tagbox_width, tagbox_height);
            }

            if (dropbutton)
            {
                var btn_left = client_width - dropbutton_width;
                var btn_top = client_top;

                if (dropbutton_height < client_height)
                    btn_top = (client_height - dropbutton_height) / 2;

                if (this.type != "dropdown" && this.edittype != "text")
                    btn_top = client_height - dropbutton_height;

                dropbutton.move(btn_left, btn_top, dropbutton_width, dropbutton_height, null, null);
            }

            if (multicomboedit)
            {
                var edit_left, edit_top, edit_width;

                if (this.edittype == "text")
                {
                    edit_left = client_left;
                    edit_top = client_top;
                    edit_width = client_width - dropbutton_width;
                    edit_height = client_height;
                }
                else
                {
                    edit_left = client_left;
                    edit_top = client_height - edit_height;
                    edit_width = client_width - dropbutton_width;
                }

                multicomboedit.move(edit_left, edit_top, edit_width, edit_height, null, null);
            }
        }
    };

    _pMultiCombo._recheckIndex = function ()
    {
        var idx = this.index;
        var txt = "";
        var val;

        var ds = this._innerdataset;
        if (ds)
        {
            var rowcount = ds.getRowCount();
            if (idx > -1 && rowcount > 0 && idx < rowcount)
            {
                val = this._getItemValue(idx);
                txt = this._getItemText(idx);
            }
            else
            {
                idx = -1;
            }
        }
        else
        {
            idx = -1;
        }

        this._setValue(val);
        this._setText(txt);
        this._setIndex(idx);
    };

    _pMultiCombo._recheckValue = function ()
    {
        var idx = -1;
        var txt = "";
        var val = this.value;
        var column = this.codecolumn || this.datacolumn;

        var ds = this._innerdataset;
        if (ds)
        {
            var rowcount = ds.getRowCount();
            if (rowcount > 0 && ds._isValidColumn(column))
            {
                for (var i = 0; i < rowcount; i++)
                {
                    if (val == this._getItemValue(i))
                    {
                        idx = i;
                        txt = this._getItemText(i);
                        break;
                    }
                }
            }
        }
        else
        {
            val = undefined;
        }

        this._setValue(val);
        this._setText(txt);
        this._setIndex(idx);
    };

    _pMultiCombo._recheckText = function ()
    {
        var idx = -1;
        var txt = this.text;
        var val;

        var ds = this._innerdataset;
        if (ds)
        {
            var rowcount = ds.getRowCount();
            if (rowcount > 0)
            {
                for (var i = 0; i < rowcount; i++)
                {
                    if (txt == this._getItemText(i))
                    {
                        idx = i;
                        val = this._getItemValue(i);
                        break;
                    }
                }
            }
            else
            {
                txt = "";
            }
        }
        else
        {
            txt = "";
        }

        this._setValue(val);
        this._setText(txt);
        this._setIndex(idx);
    };

    _pMultiCombo._selectDataset = function (bInit)
    {
        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            if (!this._filtereddataset)
            {
                this._createFilteredDataset();
            }
            else
            {
                if (bInit)
                {
                    this._clearFilteredDataset();
                }
            }

            return this._filtereddataset;
        }
        else
        {
            return this._innerdataset;
        }
    };

    _pMultiCombo._showPopup = function (ds, index, use_timer)
    {

        if (!nexacro._isDesktop() && !(nexacro._Browser == "Runtime" && nexacro._OS == "Android") && use_timer)
        {
            var thisP = this;

            setTimeout(function ()
            {
                thisP._on_showPopup(ds, index);
            }, 200);
        }
        else
        {
            this._on_showPopup(ds, index);
        }
    };

    _pMultiCombo._on_showPopup = function (ds, index)
    {
        if (!this.visible)
            return;

        if (this._isPopupVisible())
        {
            this._closePopup();
        }

        var win = this._getWindow();
        var rowcnt = this._innerdataset.rowcount;

        if (this.on_fire_ondropdown(this))
        {
            // TODO : ondropdown에서 index변경경우 필요.
            if ((this.ondropdown && this.dropdown.preventable && this.ondropdown.defaultprevented) || !this._isUsableDataset(ds) || this._getPopupType() == "none")
            {
                return;
            }

            index = (rowcnt == this._innerdataset.rowcount) ? index : this.index;

            this._createPopupListBoxControl(ds);

            var multicombolist = this.multicombolist;
            var multicomboedit = this.multicomboedit;

            var popupcontrol = this._popupcontrol;
            if (popupcontrol)
            {
                popupcontrol._popupAuto();
            }
			
            multicombolist._redrawListBoxContents(false);
            multicombolist._onRecalcScrollSize();

            if (multicombolist)
            {
                // selectall이 true면 multicombolist 위치 조정
                if (this.selectall)
                {
                    multicombolist.move(0, this.height / 2, null, multicombolist.height - this.height / 2, null, null);
                }
                multicombolist.set_index(index);
                multicombolist._refreshScroll(index, 1);

                if (win)
                {
                    win._setCaptureLock(this, true, false);
                }

                if (nexacro._enableaccessibility)
                {
                    this._setAccessibilityStatExpanded(true);

                    if (nexacro._accessibilitytype == 4)
                    {
                        multicombolist.setFocus(false);
                    }
                    else if (nexacro._accessibilitytype == 5)
                    {
                        this._want_arrows = true;
                        multicombolist._setAccessibilityNotifyEvent();
                    }

                    if (nexacro._Browser == "Runtime")
                    {
                        if (multicomboedit)
                        {
                            multicomboedit._setAccessibilityLabel(this.text);
                            multicomboedit._setAccessibilityDescription("");
                            multicomboedit._setAccessibilityAction("");
                            multicomboedit.setFocus(true);
                        }
                    }
                }
            }
        }
    };

    _pMultiCombo._applyZoomPopup = function ()
    {
        if (this._popupcontrol && this._popupcontrol._is_popup())
        {
            if (this.enable === false || this.readonly === true || this.visible === false) return;

            var ds = this._selectDataset();
            if (ds)
            {
                if (ds.getRowCount() <= 0)
                {
                    ds = this._innerdataset;
                }

                this._showPopup(ds, this.index);
            }
        }
    };

    _pMultiCombo._closePopup = function ()
    {
        var _window = this._getWindow();
        if (_window)
        {
            _window._releaseCaptureLock(this);
        }

        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            popupcontrol._closePopup();
            nexacro._refreshWindow(_window.handle);
        }

        if (nexacro._enableaccessibility)
        {
            this._want_arrows = false;
            this._setAccessibilityStatExpanded(false);

            var multicombolist = this.multicombolist;
            if (multicombolist)
            {
                multicombolist._overeditemindex = -1;
            }

            if (nexacro._Browser == "Runtime")
            {
                var multicomboedit = this.multicomboedit;
                if (multicomboedit)
                {
                    multicomboedit.on_apply_accessibility();
                }
            }
        }
    };

    _pMultiCombo._setContents = function (str)
    {
        var doc = nexacro._parseXMLDocument(str);
        var node = doc.getElementsByTagName("Dataset")[0];

        if (!node)
            return false;

        var idstr = node.attributes[0].value;

        var normalDataset = new nexacro.NormalDataset(idstr, this);

        // has subcontents
        if (node.firstChild)
        {
            var childnode = node.firstChild;

            var strXML = "";
            while (childnode)
            {
                if (node.nodeType == 1)
                {
                    strXML += nexacro._documentToXml(childnode);
                }
                childnode = childnode.nextSibling;
            }
            normalDataset._setContents(strXML);
        }

        this.set_innerdataset(normalDataset);

        return true;
    };

    _pMultiCombo._createMultiComboTagBoxControl = function ()
    {
        if (this.edittype != "tag")
            return false;

        if (this.multicombotext)
        {
            this.multicombotext.destroy();
            this.multicombotext = null;
        }

        if (!this.multicombotagbox)
        {
            var multicombotagbox = this.multicombotagbox = this._createMultiComboTagBox("multicombotagbox", 0, 0, 0, 0, null, null, null, null, null, null, this);

            multicombotagbox.createComponent();

            this._setMultiComboTagBoxValue();

            if (this.type == "dropdown")
                this.multicombotagbox.set_cssclass("dropdown");
        }
    };

    _pMultiCombo._createMultiComboTagBox = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._MultiComboTagBoxControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiCombo._createMultiComboTextControl = function ()
    {
        if (this.edittype != "count")
        {
            return false;
        }

        if (this.multicombotagbox)
        {
            this.multicombotagbox.destroy();
            this.multicombotagbox = null;
        }

        if (!this.multicombotext)
        {
            var multicombotext = this.multicombotext = this._createMultiComboText("multicombotext", 0, 0, 0, 0, null, null, null, null, null, null, this);

            multicombotext.createComponent(this._is_created ? false : true);

            this._setMultiComboCountValue();

            if (this.type == "dropdown")
                this.multicombotext.set_cssclass("dropdown");
        }
    };

    _pMultiCombo._createMultiComboText = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._MultiComboTextControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiCombo._select_indexOfkey = function (k)
    {
        k += "";
        return nexacro._indexOf(this._select_multi.keys, k);
    };

    _pMultiCombo._select_replace = function (k, selectIdx)
    {
        var idx = this._select_indexOfkey(k);
        var info = this._select_multi;
        info.items[idx] = selectIdx;
        info.map[k] = selectIdx;
    };

    _pMultiCombo._select_add = function (selectIdx)
    {
        if (selectIdx < 0 || selectIdx > this._innerdataset.getRowCount() - 1)
        {
            return;
        }

        var k = selectIdx + "";
        var info = this._select_multi;
        var idx = this._select_indexOfkey(selectIdx);

        if (idx < 0)
        {
            info.map[k] = selectIdx;
            info.length++;
            info.items.push(selectIdx);
            info.keys.push(k);
        }
    };

    _pMultiCombo._select_remove = function (selectIdx)
    {
        var idx = this._select_indexOfkey(selectIdx);
        var info = this._select_multi;
        if (idx < info.length && idx >= 0)
        {
            info.length--;
            info.items.splice(idx, 1);
            var k = info.keys[idx];
            if (typeof k != 'undefined')
            {
                info.map[k] = undefined;
            }
            info.keys.splice(idx, 1);

            return selectIdx;
        }

        return false;
    };

    _pMultiCombo._clear_all = function ()
    {
        var multicombolist = this.multicombolist;
        var rowcount = this._innerdataset.rowcount;
        if (multicombolist)
        {
            for (var i = 0; i < rowcount; i++)
            {
                multicombolist._clearAll(i);
            }
        }
        else
        {
            for (var i = 0; i < rowcount; i++)
            {
                this._select_remove(i);
            }
        }
    };

    _pMultiCombo._select_all = function ()
    {
        var multicombolist = this.multicombolist;
        var rowcount = this._innerdataset.rowcount;
        if (multicombolist)
        {
            for (var i = 0; i < rowcount; i++)
            {
                multicombolist._selectAll(i);
            }
        }
        else
        {
            if (rowcount < this._select_multi.length)
            {
                return;
            }
            for (var idx = 0; idx < rowcount; idx++)
            {
                this._select_add(idx);
            }
        }
    };

    _pMultiCombo._changeIndex = function (index, change_by_script)
    {
        if (this.index != index)
        {
            var pre_index = this.index;
            var pre_value = this.value;
            var pre_text = this.text;

            var cur_index = parseInt(index, 10) | 0;
            var cur_value = this._getItemValue(cur_index);
            var cur_text = this._getItemText(cur_index);

            // 스크립트로 선택하면 itemchange 이벤트 x
            if (change_by_script != true)
            {
                if (this.on_fire_canitemchange(this, pre_index, pre_text, pre_value, cur_index, cur_value, cur_value) != false)
                {
                    this.index = cur_index;
                    this.value = cur_value;
                    this.text = cur_text;

                    this.applyto_bindSource("value", this.value);
                    this.on_fire_onitemchanged(this, pre_index, pre_text, pre_value, cur_index, cur_value, cur_value);
                }
            }
            else
            {
                this.index = cur_index;
                this.value = cur_value;
                this.text = cur_text;
            }
        }
    };


    //===============================================================
    // nexacro.MultiCombo : Util Function
    //===============================================================
    _pMultiCombo._convertValueType = function (v, bapplyrule)
    {
        var ret;
        if (bapplyrule)
            ret = nexacro.Component.prototype._convertValueType.call(this, v);
        else
            ret = nexacro._isNull(v) ? v : nexacro._toString(v);

        return ret;
    };

    _pMultiCombo._setValue = function (v)
    {
        this.value = v;
    };

    _pMultiCombo._setEditValue = function (v)
    {
        return;
    };

    _pMultiCombo._setIndex = function (v)
    {
        this.index = v;
    };

    _pMultiCombo._setText = function (v)
    {
        this.text = v;
    };

    _pMultiCombo._setDefaultProps = function (index, value, text)
    {
        this._default_value = value;
        this._default_text = text;
        this._default_index = index;
    };

    _pMultiCombo._setEventHandlerToMultiComboEdit = function ()
    {
        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                multicomboedit._setEventHandler("oneditclick", this._on_edit_mobile_oneditclick, this);
                this._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
                this._setEventHandler("onkeyup", this._on_edit_onkeyup, this);
            }
            else
            {
                multicomboedit._setEventHandler("onlbuttondown", this._on_edit_onlbuttondown, this);
                multicomboedit._setEventHandler("oneditclick", this._on_edit_oneditclick, this);
                multicomboedit._setEventHandler("onkeydown", this._on_edit_onkeydown, this);
                multicomboedit._setEventHandler("onkeyup", this._on_edit_onkeyup, this);
            }


            multicomboedit._setEventHandler("oninput", this._on_edit_oninput, this);
            //multicomboedit._setEventHandler("onlbuttonup", this.on_notify_edit_onlbuttonup, this);
            //multicomboedit._setEventHandler("ontouchstart", this.on_notify_edit_ontouchstart, this);
        }
    };

    _pMultiCombo._setEventHandlerToDropButton = function ()
    {
        var dropbutton = this.dropbutton;
        if (dropbutton)
        {
            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                dropbutton._setEventHandler("onclick", this._on_drop_mobile_onclick, this);
            }
            else
            {
                dropbutton._setEventHandler("onclick", this._on_drop_onclick, this);
                dropbutton._setEventHandler("onlbuttondown", this._on_drop_onlbuttondown, this);
            }
        }
    };

    _pMultiCombo._setEventHandlerToListBox = function ()
    {
        var multicombolist = this.multicombolist;
        if (multicombolist)
        {
            multicombolist._setEventHandler("onitemclick", this._on_list_onitemclick, this);
            multicombolist._setEventHandler("canitemchange", this.on_notify_list_canitemchange, this);
            multicombolist._setEventHandler("onitemchanged", this.on_notify_list_onitemchanged, this);
        }
    };

    _pMultiCombo._setInnerDatasetStr = function (str)
    {
        this._removeEventHandlerToInnerDataset();

        if (str)
        {
            str = str.replace("@", "");
            var _v = this._findDataset(str);
            this._innerdataset = _v ? _v : "";
            this.innerdataset = str;
        }
        else
        {
            this._innerdataset = null;
            this.innerdataset = "";
        }
    };

    _pMultiCombo._setDefaultCaret = function ()
    {
        var edit = this.multicomboedit;
        if (edit)
        {
            edit.setCaretPos(0);
        }
    };

    _pMultiCombo._setFocusToNextComponent = function ()
    {
        var root_comp = this._getRootComponent(this);
        var next_comp = this._getForm().getNextComponent(root_comp, true);
        if (next_comp)
        {
            next_comp.setFocus();
            if (next_comp._is_editable_control)
                next_comp._setDefaultCaret();
        }
    };

    _pMultiCombo._getColumn = function (ds, index, column)
    {
        return ds.getColumn(index, column);
    };

    _pMultiCombo._getRowCount = function (ds)
    {
        return ds.getRowCount();
    };

    _pMultiCombo._getItemValue = function (index)
    {
        var ds = this._innerdataset;
        var column = this.codecolumn || this.datacolumn;

        if (ds && column)
        {
            var rtn = this._getColumn(ds, index, column);
            if (rtn == undefined && (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike") && this._filtereddataset)
            {
                rtn = this._filtereddataset.getColumn(index, column);
            }

            return this._convertValueType(rtn, true);
        }

        return null;
    };

    _pMultiCombo._getItemText = function (index)
    {
        var ds = this._innerdataset;
        var column = this.datacolumn || this.codecolumn;

        if (ds && column)
        {
            var rtn = this._getColumn(ds, index, column);
            if (rtn == undefined && (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike") && this._filtereddataset)
            {
                rtn = this._filtereddataset.getColumn(index, column);
            }

            return nexacro._toString(rtn);
        }

        return null;
    };

    _pMultiCombo._getIndexFromValue = function (ds, value)
    {
        if (value instanceof nexacro.Decimal)
        {
            value = value.toString();
        }

        var column = this.codecolumn || this.datacolumn;
        if (!ds._isValidColumn(column)) return -1;

        var row_count = this._getRowCount(ds);
        for (var i = 0; i < row_count; i++)
        {
            var v = this._getItemValue(i);
            if (v instanceof nexacro.Decimal)
            {
                v = v.toString();
            }

            if (value == v)
            {
                var newval = value;
                var preval = v;

                if (newval === 0)
                    newval = newval + "";
                if (preval === 0)
                    preval = preval + "";

                if (newval == preval)
                {
                    return i;
                }
            }
        }

        return -1;
    };

    _pMultiCombo._getIndexFromText = function (ds, text)
    {
        var row_count = this._getRowCount(ds);
        for (var i = 0; i < row_count; i++)
        {
            if (this._getItemText(i) == this.text)
            {
                return i;
            }
        }

        return -1;
    };

    _pMultiCombo._getRawToListindex = function (idx)
    {
        if (this.type == "filter" || this.type == "filterlike" || this.type == "caseifilter" || this.type == "caseifilterlike")
        {
            var fds = this._getFilteredDataset();
            var fdsArr = fds._viewRecords;
            var row_count = fdsArr.length;

            for (var i = 0; i < row_count; i++)
            {
                if (fdsArr[i]._rawidx == idx)
                {
                    return i;
                }
            }
        }
        return idx;
    };

    _pMultiCombo._getRawIndex = function (fds, idx)
    {
        var ids = this._innerdataset;

        if (idx == -1 || (fds._viewRecords.length <= idx))
        {
            return -1;
        }

        var rawidx = fds._viewRecords[idx]._rawidx;
        var idsArr = ids._rawRecords;
        var row_count = idsArr.length;

        for (var i = 0; i < row_count; i++)
        {
            if (idsArr[i]._rawidx == rawidx)
            {
                return rawidx;
            }
        }

        return -1;
    };

    _pMultiCombo._getPopupType = function ()
    {
        return this.popuptype ? this.popuptype : "normal";
    };

    _pMultiCombo._isUsableDataset = function (ds)
    {
        if (!ds)
        {
            return false;
        }
        else
        {
            if (ds.getRowCount <= 0)
            {
                return false;
            }
            if (!this.datacolumn && !this.codecolumn)
            {
                return false;
            }
        }

        return true;
    };

    _pMultiCombo._isPopupVisible = function ()
    {
        var popupcontrol = this._popupcontrol;
        if (popupcontrol)
        {
            return popupcontrol._is_popup();
        }

        return false;
    };

    _pMultiCombo._clearFilteredDataset = function ()
    {
        if (this._filtereddataset)
        {
            this._filtereddataset.set_filterstr("");
        }
    };

    _pMultiCombo._setAccessibilityInfoByHover = function (control)
    {
        if (this._isPopupVisible())
        {
            var multicombolist = this.multicombolist;
            return multicombolist._setAccessibilityInfoByHover(control);
        }
        else
        {
            return this._setAccessibilityNotifyEvent();
        }
    };

    _pMultiCombo._clearAccessibilityInfoByHover = function ()
    {
        var multicombolist = this.multicombolist;
        if (multicombolist)
        {
            multicombolist._clearAccessibilityInfoByHover();
        }
    };

    _pMultiCombo._getPopupSizeArr = function ()
    {
        var size = this.popupsize;
        if (!size)
            return;
        size = size.split(/\s+/);
        var width = +size[0];
        var height = size[1] ? +size[1] : undefined;
        return {width: width, height: height};
    };

    _pMultiCombo._cancelEvent = function ()
    {
        this._processing_keyfilter = false;
    };

    _pMultiCombo._setMultiComboTextValue = function ()
    {
        if (this.multicombotext)
        {
            this.multicombotext.destroy();
            this.multicombotext = null;
        }

        if (this.multicombotagbox)
        {
            this.multicombotagbox.destroy();
            this.multicombotagbox = null;
        }

        var multicomboedit = this.multicomboedit;
        if (multicomboedit)
        {
            var selectedItems = this._select_multi;

            if (selectedItems.length > 0)
            {
                var str = "";

                for (var i = 0; i < selectedItems.length; i++)
                {
                    if (this.type == "dropdown")
                    {
                        if (i == selectedItems.length - 1)
                            str += this._getItemText(selectedItems.items[i]);
                        else
                            str += this._getItemText(selectedItems.items[i]) + this.separator;
                    }
                    else
                    {
                        if (i == selectedItems.length)
                            str += this._getItemText(selectedItems.items[i]);
                        else
                            str += this._getItemText(selectedItems.items[i]) + this.separator;
                    }
                }

                multicomboedit.set_value(str);
            }
            else
            {
                multicomboedit.set_value();
            }

            this._recalcLayout();
        }
    };

    _pMultiCombo._setMultiComboCountValue = function ()
    {
        if (this.multicombotags)
        {
            this._destroyMulticomboTags();
        }

        if (this.multicombotagcount)
        {
            this.multicombotagcount.destroy();
            this.multicombotagcount = null;
        }

        var multicombotext = this.multicombotext;
        if (multicombotext)
        {
            if (this.counttext)
            {
                this._count_tmpl = this.getSelectedCount() + this.counttext;
                multicombotext.set_text(this._count_tmpl);
            }
            else
            {
                multicombotext.set_text(this.getSelectedCount() + " item(s) selected");
            }

            this._recalcLayout();
        }
    };

    _pMultiCombo._setEventHandlerToMultiComboText = function ()
    {
        var multicombotext = this.multicombotext;
        if (multicombotext)
        {
            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                multicombotext._setEventHandler("onclick", this._on_multicombotext_mobile_onclick, this);
            }
            else
            {
                multicombotext._setEventHandler("onlbuttondown", this._on_multicombotext_onlbuttondown, this);
            }
        }
    };

    _pMultiCombo._setMultiComboTagBoxValue = function ()
    {
        if (this.multicombotext)
        {
            this.multicombotext.destroy();
            this.multicombotext = null;
        }

        var multicombotagbox = this.multicombotagbox;
        if (multicombotagbox)
        {
            multicombotagbox._setMultiComboTagValue();
        }

        this._recalcLayout();
    };

    delete _pMultiCombo;

    //==============================================================================
    // nexacro._MultiComboEditControl
    //==============================================================================
    nexacro._MultiComboEditControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay)
    {
        nexacro.Edit.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent, onlydisplay);
    };

    var _pMultiComboEditControl = nexacro._createPrototype(nexacro.Edit, nexacro._MultiComboEditControl);
    nexacro._MultiComboEditControl.prototype = _pMultiComboEditControl;
    _pMultiComboEditControl._type_name = "EditControl";

    /* default properties */
    /* internal variable */
    _pMultiComboEditControl._is_subcontrol = true;
    _pMultiComboEditControl._is_subfocused = false;

    /* status */
    /* event list */
    /* accessibility */
    _pMultiComboEditControl.accessibilityrole = "multicombobox";

    //===============================================================
    // nexacro._MultiComboEditControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboEditControl : Override
    //===============================================================

    _pMultiComboEditControl._getFromComponent = function (comp)
    {
        var parent = comp.parent;
        if (parent && parent._isPopupVisible())
        {
            return parent;
        }
        else
        {
            return nexacro.Component.prototype._getFromComponent.call(this, comp);
        }
    };

    _pMultiComboEditControl.on_keydown_basic_action = function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
    {
        if (this.readonly || !this._isEnable())
        {
            return;
        }

        var input_elem = this._input_element;
        if (input_elem)
        {
            this._processing_keyfilter = true;

            if (nexacro._enableaccessibility)
            {
                if (nexacro._Browser == "Runtime")
                {
                    this._is_subfocused = true;
                }
            }

            if (nexacro._OS == "Mac OS" || nexacro._OS == "OSX")
                ctrl_key = meta_key;

            if (keycode == nexacro.KeyCode_ImeInput && this._imedisable) // 229
            {
                input_elem.stopSysEvent();
                return;
            }
            else if (!alt_key && !shift_key && ctrl_key && keycode == 90) // 'z'
            {
                if (input_elem.isComposing())
                {
                    input_elem.setCompositionComplete();
                }

                if (this._undostack && this.parent.type != "dropdown")
                {
                    this._undostack.undo();
                    input_elem.stopSysEvent();
                    return;
                }
            }
            else if (!alt_key && !shift_key && ctrl_key && keycode == 89) // 'y'
            {
                if (this._undostack)
                {
                    this._undostack.redo();
                    input_elem.stopSysEvent();
                    return;
                }
            }

            if (this._undostack)
            {
                var pos = input_elem.getElementCaretPos();
                if (pos && pos != -1)
                {
                    this._undostack.update(pos.begin, pos.end);
                }
            }
        }
    };

    if (nexacro._Browser == "Runtime")
    {
        _pMultiComboEditControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
        {
            this._processing_keyfilter = false;
        };
    }
    else
    {
        _pMultiComboEditControl.on_keyup_basic_action = function (/*keycode, alt_key, ctrl_key, shift_key, refer_comp*/)
        {
            this._processing_keyfilter = true;
        };
    }

    //===============================================================
    // nexacro._MultiComboEditControl : Properties
    //===============================================================
    _pMultiComboEditControl.set_value = function (v)
    {
        nexacro.Edit.prototype.set_value.call(this, v);

        this._setAccessibilityValue(this.text, false);
    };

    //===============================================================
    // nexacro._MultiComboEditControl : Events
    //===============================================================
    _pMultiComboEditControl.on_fire_ondblclick = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key)
    {
        return this.parent.on_fire_ondblclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, this.parent, from_refer_comp, meta_key);
    };

    delete _pMultiComboEditControl;

    //==============================================================================
    // nexacro._MultiComboButtonControl
    //==============================================================================
    nexacro._MultiComboButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._MultiComboButtonControl);
    nexacro._MultiComboButtonControl.prototype = _pMultiComboButtonControl;
    _pMultiComboButtonControl._type_name = "ButtonControl";

    /* internal variable */
    _pMultiComboButtonControl._is_subcontrol = true;
    _pMultiComboButtonControl._is_focus_accept = false;

    //===============================================================
    // nexacro._MultiComboButtonControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboButtonControl : Events
    //===============================================================
    _pMultiComboButtonControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        // not used
        var multicombo = this.parent;
        if (multicombo)
        {
            var bMobile = (nexacro._isTouchInteraction && nexacro._SupportTouch);
            if (bMobile)
            {
                nexacro.Component.prototype.on_focus_basic_action.call(this, self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus);
            }
            else
            {
                multicombo._apply_setfocus(evt_name);
            }
        }

        if (nexacro._enableaccessibility)
        {
            this._setAccessibilityStatFocus(evt_name);
        }
    };

    _pMultiComboButtonControl._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        if (!this._is_alive) return;

        if (this.visible && this.parent._isEnable() && this.enableevent)
        {
            var clientXY = this._getClientXY(canvasX, canvasY);
            this.on_fire_onclick(button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientXY[0], clientXY[1], this, this, meta_key);
            this.on_click_basic_action(elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key);
        }
    };

    delete _pMultiComboButtonControl;

    //==============================================================================
    // nexacro._MultiComboListControl
    //==============================================================================
    nexacro._MultiComboListControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.CheckBoxSet.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);

        this._overedItem = null;
        this._select_multi = this.parent._select_multi;
    };

    var _pMultiComboListControl = nexacro._createPrototype(nexacro.CheckBoxSet, nexacro._MultiComboListControl);
    nexacro._MultiComboListControl.prototype = _pMultiComboListControl;
    _pMultiComboListControl._type_name = "CheckBoxSetControl";
    _pMultiComboListControl._is_subcontrol = true;

    /* default properties */
    _pMultiComboListControl.select_all = null;

    /* internal variable */
    _pMultiComboListControl._overeditemindex = -1;

    /* status */
    _pMultiComboListControl._is_scrollable = true;

    /* event list */
    _pMultiComboListControl._event_list = {
        "onitemclick": 1, "onitemdblclick": 1,
        "onkeydown": 1, "onkeyup": 1,
        "onkillfocus": 1, "onsetfocus": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1, "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1,
        "onmove": 1, "onsize": 1,
        "canitemchange": 1, "onitemchanged": 1,
        "oncloseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "onvscroll": 1, "onhscroll": 1, "ondevicebuttonup": 1
    };

    //===============================================================
    // nexacro._MultiComboListControl : Create & Update
    //===============================================================
    _pMultiComboListControl.on_create_contents = function ()
    {
        this._temp_item = new nexacro._CheckBoxSetItemControl("_temp_item", 0, 0, 0, 0, null, null, null, null, null, null, this);
        this._temp_item.createComponent();
    };

    _pMultiComboListControl.on_created_contents = function (win)
    {
        if (this.innerdataset)
        {
            if (!this._innerdataset)
            {
                this._setInnerDatasetStr(this.innerdataset);
            }

            this.on_apply_innerdataset(this._innerdataset);
        }

        this._redrawListBoxContents(true);

        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].on_created(win);
        }

        this._selectinfo.obj = null;
        this._selectinfo.index = this.index;
        this._selectinfo.text = this.text;
        this._selectinfo.value = this.value;

        //this._setEventHandler("onkeydown", this._on_onkeydown, this);

        if (nexacro._enableaccessibility)
        {
            this._want_arrow = true;
            this.on_apply_prop_accessibilitylabel();
        }

        this._is_created = true;
        this._onRecalcScrollSize();
    };

    _pMultiComboListControl.on_destroy_contents = function ()
    {
        var item = this._temp_item;
        if (item)
        {
            item.destroy();
        }
        this._temp_item = null;

        this._destroyListBoxContents();
        this._buffer_pages = null;

        this._removeEventHandlerToInnerDataset();
        //this._removeEventHandler("onkeydown", this._on_onkeydown, this);

        this._selectinfo = null;
        this._select_multi = null;
        this._selectinfo_list.length = 0;
        this._scroll_vpos_queue = null;
    };

    _pMultiComboListControl.on_create_contents_command = function ()
    {
        if (this.innerdataset)
        {
            if (!this._innerdataset)
            {
                this._setInnerDatasetStr(this.innerdataset);
            }

            this._parseInnerDataset();
        }

        this._redrawListBoxContents(true);

        var str = "";
        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            str += items[i].createCommand();
        }

        return str;
    };

    _pMultiComboListControl.on_attach_contents_handle = function (win)
    {
        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            items[i].attachHandle(win);
        }

        this._selectinfo.obj = null;
        this._selectinfo.index = this.index;
        this._selectinfo.text = this.text;
        this._selectinfo.value = this.value;

        //this._setEventHandler("onkeydown", this._on_onkeydown, this);

        if (nexacro._enableaccessibility)
            this.on_apply_prop_accessibilitylabel();

        this._is_created = true;
        this._onRecalcScrollSize();
    };

    _pMultiComboListControl.on_change_containerRect = function (/*width, height*/)
    {
        if (this._is_created_contents)
        {
            var itemheight = this._getItemHeight();
            var client_h = this._getClientHeight();
            var page_rowcount = itemheight ? client_h / itemheight : 0;

            if (this._page_rowcount != page_rowcount)
            {
                this._redrawListBoxContents(false);
            }
            else
            {
                this._recalcLayout();
            }

            if (!this._calc_scroll)
            {
                this._onRecalcScrollSize();
            }
            else
            {
                this._cnt_resetscroll++;
                this._onResetScrollBar();
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Override
    //===============================================================
    _pMultiComboListControl._on_getFitSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            var rowcount = this._getInnerdatasetInfo("_rowcount");
            var data_maxwidth = this._getInnerdatasetInfo("_max_width");
            var data_maxheight = this._getInnerdatasetInfo("_max_height");

            total_w += data_maxwidth;
            total_h += data_maxheight * rowcount;

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    _pMultiComboListControl._onRecalcScrollSize = function ()
    {
        var control_elem = this.getElement();
        var multicombo = this.parent;
        if (control_elem)
        {
            var client_w = this._getClientWidth();
            var client_h = this._getClientHeight();

            var scrollWidth = Math.max(this._contents_maxwidth, client_w);
            var scrollHeight = Math.max(this._contents_maxheight, client_h);

            this._calc_scroll = true;

            if (this._contents_maxheight > client_h && multicombo.selectall == true)
            {
                if (multicombo.displayrowcount)
                {
                    control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight);
                }
				else
                {
                    control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight + multicombo._height / 2);
				}
            }
            else
            {
                control_elem.setElementScrollMaxSize(scrollWidth, scrollHeight);
            }

            if (!this._cnt_resetscroll)
                this._onResetScrollBar();

            this._calc_scroll = false;
            this._cnt_resetscroll = 0;
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Properties
    //===============================================================
    _pMultiComboListControl.on_apply_index = function (index)
    {
        var text = "";
        var value;// = undefined;

        var data = this._getInnerdatasetInfo("_rows", index);
        if (data)
        {
            value = data.value;
            text = data.text;
        }

        if (this.value != value)
        {
            if (!this.applyto_bindSource("value", value))
            {
                this.index = this._default_index;
                return;
            }

            this._setValue(value);
            this._setText(text);
        }
    };

    _pMultiComboListControl.on_apply_value = function (value)
    {
        var ds = this._innerdataset;
        var codecolumn = this.codecolumn;
        var datacolumn = this.datacolumn == "" ? codecolumn : this.datacolumn;
        if (ds && codecolumn)
        {
            var index = ds.findRow(codecolumn, value);
            var text = "";
            if (index > -1)
                text = ds.getColumn(index, datacolumn);

            // this._accessibility_index = index;

            this._setIndex(index);
            this._setText(text);
        }
    };

    _pMultiComboListControl.on_apply_codecolumn = function (codecolumn)
    {
        if (this._is_created)
        {
            this._parseInnerDataset();
            this._redrawListBoxContents(!this._keep_scrolling);
            this._onRecalcScrollSize();
        }
    };

    _pMultiComboListControl.on_apply_datacolumn = function (datacolumn)
    {
        if (this._is_created)
        {
            this._parseInnerDataset();
            this._redrawListBoxContents(!this._keep_scrolling);
            this._onRecalcScrollSize();
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListControl : Events
    //===============================================================
    _pMultiComboListControl.on_notify_item_onlbuttondown = function (obj, e)
    {
        // todd 이벤트 안겹치게 안에 내용 제거
    };

    _pMultiComboListControl.on_notify_item_onlbuttonup = function (obj, e)
    {
        var up_item = this._upitem;

        if (up_item)
        {
            if (nexacro._isTouchInteraction && nexacro._SupportTouch)
            {
                var win = this._getWindow();
                var touch_manager = win ? win._gesture_manager : null;
                if (touch_manager && touch_manager._is_ondrag)
                    return;
            }

            if ((up_item.index >= 0) && this._contains(up_item))
            {
                obj = up_item;
            }
            else
            {
                return;
            }
            this._shiftKey = e.shiftkey;
            if (!this._shiftKey)
            {
                this._shift_select_base_index = obj.index;
            }
            this._select_withmouseevent(this._innerdataset._viewRecords[obj.index]._rawidx, obj);
            this.on_fire_onitemclick(obj, obj.index, obj.text, obj.value, e.button, e.altkey, e.ctrlkey, e.shiftkey, e.screenx, e.screeny, e.canvasx, e.canvasy, e.clientx, e.clienty, e.metakey);
        }
    };

    _pMultiComboListControl.on_notify_item_ontouchstart = function (obj, e)
    {
        //this._do_select(obj.index, false);
    };

    _pMultiComboListControl.on_notify_item_ontouchend = function (obj, e)
    {
        var info = (e.changedtouchinputinfos && e.changedtouchinputinfos[0]) ? e.changedtouchinputinfos[0] : null;
        if (info)
        {
            e.button = "lbutton";
            e.altkey = false;
            e.ctrlkey = false;
            e.shiftkey = false;
            e.metakey = false;
            e.screenx = info.screenx;
            e.screeny = info.screeny;
            e.canvasx = info.canvasx;
            e.canvasy = info.canvasy;
            e.clientx = info.clientx;
            e.clienty = info.clienty;
        }

        this.on_notify_item_onlbuttonup(obj, e);
    };

    _pMultiComboListControl.on_notify_listbox_onkeydown = function (obj, e)
    {

    };

    _pMultiComboListControl.on_notify_item_onmouseenter = function (obj, e)
    {

    };

    _pMultiComboListControl.on_notify_item_onmouseleave = function (obj, e)
    {

    };

    _pMultiComboListControl.on_notify_item_onmousemove = function (obj, e)
    {
        if (this._overeditemindex > -1)
        {
            var rowobj = this._getItem(this._overeditemindex);
            if (rowobj)
            {
                rowobj._changeStatus("mouseover", false);
            }
        }
    };

    _pMultiComboListControl.on_focus_basic_action = function (self_flag, evt_name, lose_focus, refer_lose_focus, new_focus, refer_new_focus)
    {
        var multicombo = this.parent;
        if (multicombo)
        {
            if (nexacro._enableaccessibility)
            {
                multicombo._setAccessibilityStatFocus(evt_name);
            }

            multicombo._apply_setfocus(evt_name);
        }
    };

    _pMultiComboListControl.on_fire_user_onkeydown = function (keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key)
    {
        return nexacro.Component.prototype.on_fire_user_onkeydown.call(this, keycode, alt_key, ctrl_key, shift_key, fire_comp, refer_comp, meta_key);
    };

    _pMultiComboListControl.on_fire_user_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        return nexacro.Component.prototype.on_fire_user_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, meta_key);
    };

    _pMultiComboListControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        nexacro.Component.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
    };

    _pMultiComboListControl.on_fire_sys_ontouchstart = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_ontouchstart.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pMultiComboListControl.on_fire_sys_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        nexacro.Component.prototype.on_fire_sys_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pMultiComboListControl.on_fire_sys_ontouchcancel = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {

    };

    _pMultiComboListControl.on_fire_oncloseup = function (obj)
    {
        var rowobj = this._get_rowobj_status("mouseover", "status");
        if (rowobj)
        {
            rowobj._changeStatus("mouseover", false);
        }

        if (this.oncloseup && this.oncloseup._has_handlers)
        {
            return this.oncloseup._fireEvent(this);
        }

        return false;
    };
        
    //===============================================================
    // nexacro._MultiComboListControl : Logical part
    //===============================================================
    _pMultiComboListControl._set_last_selectfocused = function (idx, isNotFireEvent)
    {
        var rowBeforeLast = this._select_multi.lastselected;
        this._select_multi.lastselected = idx;

        if (idx !== rowBeforeLast)
        {
            this._on_last_selectfocuschanged(idx, isNotFireEvent);
        }
    };

    _pMultiComboListControl._select_add = function (selectIdx, isNotFireEvent)
    {
        var multicombo = this.parent;
        var filtered = multicombo._filtereddataset;
        if (filtered._viewRecords != undefined && filtered._viewRecords == filtered._rawRecords)
        {
            if (selectIdx < 0 || selectIdx > this._innerdataset.getRowCount() - 1)
            {
                return;
            }
        }

        var k = selectIdx + "";
        var info = this._select_multi;
        var old = info.map[k];

        if (typeof old != 'undefined')
        {
            return this._select_replace(k, selectIdx);
        }
        info.map[k] = selectIdx;
        info.length++;
        info.items.push(selectIdx);
        info.keys.push(k);
        if (multicombo.type != "dropdown")
        {
            var ds_name = multicombo._innerdataset._rawRecords[selectIdx][1];
            var ds_id = multicombo._innerdataset._rawRecords[selectIdx][0];
            var sitems = multicombo.search_items;
            var sitems_length = sitems.name.length > sitems.id.length ? sitems.name.length : sitems.id.length;
            for (i = 0; i < sitems_length; i++)
            {
                if (sitems.name[i] == "")
                {
                    sitems.name.splice(i, 1);
                }
                if (sitems.id[i] == "")
                {
                    sitems.id.splice(i, 1);
                }
            }
			if (this._is_clicked)
            {
                
                sitems.name.push(ds_name);
                sitems.id.push(ds_id);
			}
        }

        this._changeIndex(selectIdx, undefined, isNotFireEvent);
        //this._changeIndex(selectIdx);

        if (this.parent._is_control_component)
        {
            this.parent.parent.index = this.index;
            this.parent.parent.text = this.text;
            this.parent.parent.value = this.value;
        }
        if (this.parent._is_abstract)
        {
            this.parent.index = this.index;
            this.parent.text = this.text;
            this.parent.value = this.value;
        }
    };

    _pMultiComboListControl._select_remove = function (selectIdx)
    {
        var multicombo = this.parent;
        var idx = this._select_indexOfkey(selectIdx);
        var info = this._select_multi;


        if (multicombo.type != "dropdown")
        {
            var ds_name = multicombo._innerdataset._rawRecords[selectIdx][1];
            var ds_id = multicombo._innerdataset._rawRecords[selectIdx][0];
            var sitems = multicombo.search_items;
            var sitems_length = sitems.name.length > sitems.id.length ? sitems.name.length : sitems.id.length;
            for (i = 0; i < sitems_length; i++)
            {
                if (sitems.name[i] == "")
                {
                    sitems.name.splice(i, 1);
                }
                if (sitems.id[i] == "")
                {
                    sitems.id.splice(i, 1);
                }
            }

            for (i = 0; i < sitems.id.length; i++)
            {
                if (sitems.id[i] == ds_id && this._is_clicked)
                {
                    sitems.id.splice(i, 1);
                    sitems.name.splice(i, 1);
                }
            }
        }

        if (idx < info.length && idx >= 0)
        {
            info.length--;
            info.items.splice(idx, 1);
            var k = info.keys[idx];
            if (typeof k != 'undefined')
            {
                info.map[k] = undefined;
            }
            info.keys.splice(idx, 1);
            if (!this.multiselect && info.length == 0)
            {
                this.index = -1;
                this.text = "";

                if (!this._do_not_change_value)
                    this.value = undefined;
            }

            return selectIdx;
        }

        return false;
    };

    _pMultiComboListControl._select_withmouseevent = function (idx, obj)
    {
        var obj_idx;
        var sel = this._select_multi;
        var len = sel ? sel.length : 0;
        var multicombo = this.parent;

        var filtered_ds = multicombo._filtereddataset._viewRecords;

        if (this._shiftKey)
        {
            // type filter일 때  shift + click 영역 선택
            if (this._innerdataset._rawRecords != this._innerdataset._viewRecords)
            {
                for (var i = 0; i < filtered_ds.length; i++)
                {
                    if (idx == filtered_ds[i]._rawidx)
                    {
                        obj_idx = i;
                    }
                }

                var startRow = this._shift_select_base_index < filtered_ds.length ? this._shift_select_base_index : 0;
                var endRow = obj_idx;

                if (!nexacro._isNumber(startRow))
                {
                    startRow = 0;
                }
                if (!nexacro._isNumber(endRow))
                {
                    endRow = this._getInnerdatasetInfo("_rowcount");
                }

                var item = this._getItem(obj_idx);
                if (startRow > endRow)
                {
                    for (i = startRow; endRow <= i; i--)
                    {
                        if (!item.selected)
                        {
                            var _item = this._getItem(i);
                            _item.set_selected(true);
                            this._select_add(filtered_ds[i]._rawidx);
                        }
						else
                        {
                            var _item = this._getItem(i);
                            _item.set_selected(false);
                            this._select_remove(filtered_ds[i]._rawidx);
						}
                    }
                }
                else
                {
                    for (i = startRow; i <= endRow; i++)
                    {
                        if (!item.selected)
                        {
                            var _item = this._getItem(i);
                            _item.set_selected(true);
                            this._select_add(filtered_ds[i]._rawidx);
                        }
                        else
                        {
                            var _item = this._getItem(i);
                            _item.set_selected(false);
                            this._select_remove(filtered_ds[i]._rawidx);
                        }
                    }
                }

                this._shift_select_base_index = endRow;
                this._changeIndex(idx);
            }
            else
            {
                var startIdx = this._shift_select_base_index ? this._shift_select_base_index : 0;
                var endIdx = idx;
                var i;
                var rows = [];
                var item = this._getItem(idx);
                if (startIdx > endIdx)
                {
                    for (i = startIdx; endIdx <= i; i--)
                    {
                        rows.push(i);
                    }
                }
                else
                {
                    for (i = startIdx; i <= endIdx; i++)
                    {
                        rows.push(i);
                    }
                }

                var info = this._select_multi;
                if (!item.selected)
                {
                    this._doMultiSelect(rows, true, true);
                    this._changeIndex(info.items[info.length - 1]);
                }
                else
                {
                    this._do_deselect(rows, true);
                    if (info && info.length == 0)
                    {
                        this._changeIndex(-1);
                    }
                    else
                    {
                        this._changeIndex(info.items[info.length - 1]);
                    }
                }
                this._shift_select_base_index = endIdx;
            }
        }
        else
        {
            //type search or caseisearch일때
            if (multicombo.type == "search" || multicombo.type == "caseisearch")
            {
                var sitems = multicombo.search_items;
                for (var i = 0; i < sitems.name.length; i++)
                {
                    var col = multicombo.datacolumn || multicombo.codecolumn;
                    var ds = multicombo._selectDataset();
                    var index;

                    if (multicombo.type == "caseisearch")
                    {
                        index = ds.findRowExpr(col + ".match(/^" + sitems.name[i] + "/i)");
                        // 입력한 값과 ds의 값을 소문자로 비교하여 일치하는지 비교
                        if (ds._rawRecords[index] != undefined && ds._rawRecords[index][1].toLowerCase() == sitems.name[i].toLowerCase() && ds._rawRecords[index][0] == sitems.id[i])
                        {
                            this._select_add(index);
                            if (index != -1 && index != idx)
                            {
                                var _item = this._getItem(index);
                                if (_item)
                                {
                                    _item.set_selected(true);
                                }
                            }
                        }
                    }
                    else
                    {
                        index = ds.findRowAs(col, sitems.name[i]);
                        if (ds._rawRecords[index] != undefined && ds._rawRecords[index][1] == sitems.name[i] && ds._rawRecords[index][0] == sitems.id[i])
                        {
                            this._select_add(index);
                            if (index != -1 && index != idx)
                            {
                                var _item = this._getItem(index);
                                if (_item)
                                {
                                    _item.set_selected(true);
                                }
                            }
                        }
                    }

                }
            }

            // type filter일때
            if (this._innerdataset._rawRecords != this._innerdataset._viewRecords)
            {
                for (var i = 0; i < filtered_ds.length; i++)
                {
                    if (idx == filtered_ds[i]._rawidx)
                    {
                        obj_idx = i;
                    }
                }
                var item = this._getItem(obj_idx);
            }
            else
            {
                var item = this._getItem(idx);
            }

            if (item)
            {
                item.set_selected(!item.selected);
            }

            if (!item)
            {
                return;
            }

            if (item.selected === false)
            {
                var changeidx = this.index;
                var currentidx;
                if (this._select_multi && this._select_multi.length > 0)
                {
                    if (this.index == idx)
                    {
                        var obj = this._select_multi.items;

                        currentidx = obj.indexOf(this.index);
                        if (currentidx > 0)
                        {
                            changeidx = obj[currentidx - 1];
                        }
                    }
                }
                for (var i = 0; i < len; i++)
                {
                    if (idx === sel.items[i])
                    {
                        this._is_clicked = true;
                        this._select_remove(idx);
                        this._is_clicked = false;
                        if (multicombo.type != "dropdown")
                        {
                            var sitem = multicombo._innerdataset._rawRecords[idx][1];
                            var index = multicombo.search_items.name.indexOf(sitem);
                            if (index > -1)
                            {
                                multicombo.search_items.name.splice(index, 1);
                            }
                        }
                    }


                }
                if (this._select_multi && this._select_multi.length == 0)
                {
                    this._changeIndex(-1);
                }
                else if (this._select_multi && this._select_multi.length > 0)
                {

                    this._changeIndex(changeidx);
                }
            }
            else
            {
                this._is_clicked = true;
                this._select_add(idx);
                this._is_clicked = false;
                
            }

            for (i = 0; i < this._innerdataset.rowcount; i++)
            {
                var all_item = this._getItem(i);
                if (all_item)
                {
                    all_item._changeStatus("mouseover", false);
                }
            }
        }

        this._set_last_selectfocused(idx);
    };

    _pMultiComboListControl._select_withkeyupevent = function (shiftkey, curidx, nextidx)
    {
        var multicombo = this._getRootComponent(this);
        this._is_clicked = true;
        if (shiftkey)
        {
            if (multicombo.type == "dropdown" || multicombo.type == "search" || multicombo.type == "caseisearch")
            {
                if (curidx > this._shift_select_base_index)
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (this._is_selected(curidx))
                            this._do_deselect(curidx, true);
                        this._do_deselect(nextidx, true);
                    }
                    else
                    {
                        if (!this._is_selected(curidx))
                            this._do_select(curidx, true);
                        this._do_select(nextidx, true);
                    }
                }
                else
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (!this._is_selected(curidx))
                            this._do_select(curidx, true);
                        this._do_select(nextidx, true);
                    }
                    else
                    {
                        if (this._is_selected(curidx))
                            this._do_deselect(curidx, true);
                        this._do_deselect(nextidx, true);
                    }
                }
            }
            else
            {
                var cur_item = this._getItem(curidx);
                var next_item = this._getItem(nextidx);
                var filtered_curidx = multicombo._filtereddataset._viewRecords[curidx]._rawidx;
                var filtered_nextidx = multicombo._filtereddataset._viewRecords[nextidx]._rawidx;

                if (curidx > this._shift_select_base_index)
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(false);
                            this._select_remove(filtered_curidx);
                        }
                        next_item.set_selected(false);
                        this._select_remove(filtered_nextidx);
                    }
                    else
                    {
                        if (!this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(true);
                            this._select_add(filtered_curidx);
                        }
                        next_item.set_selected(true);
                        this._select_add(filtered_nextidx);
                    }
                }
                else
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (!this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(true);
                            this._select_add(filtered_curidx);
                        }
                        next_item.set_selected(true);
                        this._select_add(filtered_nextidx);
                    }
                    else
                    {
                        if (this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(false);
                            this._select_remove(filtered_curidx);

                        }
                        next_item.set_selected(false);
                        this._select_remove(filtered_nextidx);
                    }
                }
            }
        }
        this._is_clicked = false;
    };

    _pMultiComboListControl._select_withkeydownevent = function (shiftkey, curidx, nextidx)
    {
        var multicombo = this._getRootComponent(this);
        this._is_clicked = true;
        if (shiftkey)
        {
            if (multicombo.type == "dropdown" || multicombo.type == "search" || multicombo.type == "caseisearch")
            {
                if (curidx < this._shift_select_base_index)
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (this._is_selected(curidx))
                            this._do_deselect(curidx, true);
                        this._do_deselect(nextidx, true);
                    }
                    else
                    {
                        if (!this._is_selected(curidx))
                            this._do_select(curidx, true);
                        this._do_select(nextidx, true);
                    }
                }
                else
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (!this._is_selected(curidx))
                            this._do_select(curidx, true);
                        this._do_select(nextidx, true);
                    }
                    else
                    {
                        if (this._is_selected(curidx))
                            this._do_deselect(curidx, true);
                        this._do_deselect(nextidx, true);
                    }
                }
            }
            else if(curidx != -1)
            {
                var cur_item = this._getItem(curidx);
                var next_item = this._getItem(nextidx);
                var filtered_curidx = multicombo._filtereddataset._viewRecords[curidx]._rawidx;
                var filtered_nextidx = multicombo._filtereddataset._viewRecords[nextidx]._rawidx;

                if (curidx < this._shift_select_base_index)
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(false);
                            this._select_remove(filtered_curidx);
                        }
                        next_item.set_selected(false);
                        this._select_remove(filtered_nextidx);
                    }
                    else
                    {
                        if (!this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(true);
                            this._select_add(filtered_curidx);
                        }
                        next_item.set_selected(true);
                        this._select_add(filtered_nextidx);
                    }
                }
                else 
                {
                    if (!this._is_shift_select_base_index)
                    {
                        if (!this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(true);
                            this._select_add(filtered_curidx);
                        }
                        next_item.set_selected(true);
                        this._select_add(filtered_nextidx);
                    }
                    else
                    {
                        if (this._is_selected(filtered_curidx))
                        {
                            cur_item.set_selected(false);
                            this._select_remove(filtered_curidx);

                        }
                        next_item.set_selected(false);
                        this._select_remove(filtered_nextidx);
                    }
                }
            }
        }
        this._is_clicked = false;
    };

    _pMultiComboListControl._redrawListBoxContentsAfter = nexacro._emptyFn;

    _pMultiComboListControl._createListItemControl = function (index)
    {
        var ds = this._innerdataset;

        if (!ds)
            return null;

        var dataCol = this.datacolumn ? this.datacolumn : this._datacolumn;
        var codeCol = this.codecolumn ? this.codecolumn : this._codecolumn;
        var txt = ds.getColumn(index, dataCol);
        txt = nexacro._toString(txt);
        var val = ds.getColumn(index, codeCol);
        val = this._convertValueType(val, true);

        var itemheight = this._getItemHeight();
        var client_w = this._getClientWidth();

        var item = this._createListItem("item_" + index, 0, index * itemheight, Math.max(this._contents_maxwidth, client_w), itemheight, null, null, null, null, null, null, this);
        item.set_value(val);
        item.set_text(txt);
        item.set_index(index);
        item.set_selected(false);
        item.set_readonly(this.readonly);

        // 선택 유지, Type = filter일 때 선택 반영
        var filtered_idx = ds._viewRecords[index]._rawidx;
        if (ds._viewRecords != ds._rawRecords)
        {
            for (var i = 0; i < this._select_multi.length; i++)
            {
                if (this._select_multi.items[i] == ds._rawRecords[filtered_idx]._rawidx)
                {
                    item.set_selected(true);
                }
            }
        }
        else
        {
            for (var i = 0; i < this._select_multi.length; i++)
            {
                if (index == this._select_multi.items[i])
                {
                    item.set_selected(true);
                }
            }
        }

        if (nexacro._enableaccessibility)
        {
            this._setItemAccessibility(item);
        }

        // todo 안쓰는 이벤트 지워야 할지
        item._setEventHandler("onlbuttondown", this.on_notify_item_onlbuttondown, this);
        item._setEventHandler("onlbuttonup", this.on_notify_item_onlbuttonup, this);
        item._setEventHandler("ontouchstart", this.on_notify_item_ontouchstart, this);
        item._setEventHandler("ontouchend", this.on_notify_item_ontouchend, this);
        item._setEventHandler("onmouseenter", this.on_notify_item_onmouseenter, this);
        item._setEventHandler("onmouseleave", this.on_notify_item_onmouseleave, this);
        item._setEventHandler("onmousemove", this.on_notify_item_onmousemove, this);

        item.createComponent(this._is_created ? false : true);

        return item;
    };

    _pMultiComboListControl._change_status_item_from_key = function (curidx, nextidx)
    {
        var currowobj = this._getItem(curidx);
        var rowobj = this._getItem(nextidx);

        if (currowobj)
        {
            currowobj._changeStatus("mouseover", false);
        }
        if (rowobj)
        {
            rowobj._changeStatus("mouseover", true);
            this._overeditemindex = rowobj.index;
        }
    };

    _pMultiComboListControl._selectAll = function (idx)
    {
        var sel = this._select_multi;
        var len = sel ? sel.length : 0;
        var item = this._getItem(idx);

        if (item)
        {
            item.set_selected(true);
            item._changeStatus("mouseover", false);
        }
        this._is_clicked = true;
        this._select_add(idx);
        this._is_clicked = false;
    };

    _pMultiComboListControl._clearAll = function (idx)
    {
        var sel = this._select_multi;
        var len = sel ? sel.length : 0;
        var item = this._getItem(idx);

        if (item)
        {
            item.set_selected(false);
            item._changeStatus("mouseover", false);
        }
        var changeidx = this.index;
        var currentidx;
        if (this._select_multi && this._select_multi.length > 0)
        {
            if (this.index == idx)
            {
                var obj = this._select_multi.items;

                currentidx = obj.indexOf(this.index);
                if (currentidx > 0)
                {
                    changeidx = obj[currentidx - 1];
                }
            }
        }
        for (var i = 0; i < len; i++)
        {
			if (idx === sel.items[i])
            {
                this._is_clicked = true;
                this._select_remove(idx);
                this._is_clicked = false;
			}
        }
        if (this._select_multi && this._select_multi.length == 0)
        {
            this._changeIndex(-1);
        }
        else if (this._select_multi && this._select_multi.length > 0)
        {

            this._changeIndex(changeidx);
        }
    };

    _pMultiComboListControl._createListItem = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._MultiComboListItemControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiComboListControl._recalcLayout = function ()
    {
        var itemheight = this._getItemHeight();
        var client_w = this._getClientWidth();

        var item;
        var items = this._getContentsItem();
        var item_len = items.length;
        for (var i = 0; i < item_len; i++)
        {
            item = items[i];
            if (item)
                item.move(0, item.index * itemheight, Math.max(this._contents_maxwidth, client_w), itemheight);
        }
    };

    _pMultiComboListControl._on_select_change = function (idx, isSelected, jobgbn, params, isNotFireEvent)
    {
        var multicombo = this.parent;
        if ((multicombo.type == "search" || multicombo.type == "caseisearch") && multicombo._isFiredOnInput)
        {

            var rowobj = this._getItem(idx);
            if (rowobj)
            {
                if (isSelected)
                    rowobj.set_selected(true);
                else
                    rowobj.set_selected(false);

                if (nexacro._enableaccessibility)
                {
                    rowobj._setAccessibilityInfoIndex(idx + 1);
                    rowobj._setAccessibilityInfoCount(this._getInnerdatasetInfo("_rowcount"));
                }
            }

        }
        else
        {
            if (this._select_commit(jobgbn, idx, params, isNotFireEvent) !== false)
            {
                var rowobj = this._getItem(idx);
                if (rowobj)
                {
                    if (isSelected)
                        rowobj.set_selected(true);
                    else
                        rowobj.set_selected(false);

                    if (nexacro._enableaccessibility)
                    {
                        rowobj._setAccessibilityInfoIndex(idx + 1);
                        rowobj._setAccessibilityInfoCount(this._getInnerdatasetInfo("_rowcount"));
                    }
                }
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboListControl : Util Function
    //===============================================================
    _pMultiComboListControl._changeIndex = function (v)
    {
        if (this.index != v)
        {
            var dataset = this._innerdataset;
            var postindex = parseInt(v, 10) | 0;

            if (dataset && (this.codecolumn || this.datacolumn))
            {
                var datavalue = dataset.getColumn(postindex, this.datacolumn || this.codecolumn);
                var codevalue = dataset.getColumn(postindex, this.codecolumn || this.datacolumn);

                var posttext = datavalue == undefined ? "" : nexacro._toString(datavalue);
                var postvalue = codevalue;

                this._accessibility_index = this.index = postindex;
                this.text = posttext;
                this.value = postvalue;

                this._selectinfo.obj = null;
                this._selectinfo.index = postindex;
                this._selectinfo.text = posttext;
                this._selectinfo.value = postvalue;

                return true;
            }
        }

        return false;
    };

    _pMultiComboListControl._getItem = function (index)
    {
        var pages = this._buffer_pages;
        var page, item;
        var i, j;

        for (i in pages)
        {
            page = pages[i];
            for (j in page)
            {
                item = page[j];
                if (item && (item.index == index))
                    return item;
            }
        }

        return null;
    };

    _pMultiComboListControl._getContentsItem = function ()
    {
        var ret = [];
        var pages = this._buffer_pages;
        for (var i in pages)
        {
            if (pages[i] && pages.hasOwnProperty(i))
            {
                ret = ret.concat(pages[i]);
            }
        }

        return ret;
    };

    _pMultiComboListControl._get_rowobj_status = function (status, flag, lastselected)
    {
        var buffer_pages = this._buffer_pages;
        if (buffer_pages)
        {
            var rowobjs, rowobj;
            for (var i = 0, n = buffer_pages.length; i < n; i++)
            {
                rowobjs = buffer_pages[i];
                if (rowobjs)
                {
                    for (var j = 0, jlen = rowobjs.length; j < jlen; j++)
                    {
                        rowobj = rowobjs[j];

                        if ((lastselected) && lastselected == rowobj.index)
                        {
                            return rowobj;
                        }

                        if (rowobj && ((flag == "status" && rowobj._status == status) || (flag == "userstatus" && rowobj._userstatus == status)))
                        {
                            if (!lastselected)
                                return rowobj;
                        }
                    }
                }
            }
        }

        return null;
    };

    _pMultiComboListControl._get_all_rowobj_status = function (status, flag)
    {
        var ret = [];
        var buffer_pages = this._buffer_pages;
        if (buffer_pages)
        {
            var rowobjs, rowobj;
            for (var i = 0, n = buffer_pages.length; i < n; i++)
            {
                rowobjs = buffer_pages[i];
                if (rowobjs)
                {
                    for (var j = 0, jlen = rowobjs.length; j < jlen; j++)
                    {
                        rowobj = rowobjs[j];
                        if (rowobj &&
                            ((flag == "status" && rowobj._status == status) || (flag == "userstatus" && rowobj._userstatus == status)))
                        {
                            ret.push(rowobj);
                        }
                    }
                }
            }
        }

        return ret;
    };

    delete _pMultiComboListControl;

    //==============================================================================
    // nexacro._MultiComboListItemControl
    //==============================================================================
    nexacro._MultiComboListItemControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro._CheckBoxSetItemControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboListItemControl = nexacro._createPrototype(nexacro._CheckBoxSetItemControl, nexacro._MultiComboListItemControl);
    nexacro._MultiComboListItemControl.prototype = _pMultiComboListItemControl;

    /* default properties */

    /* internal variable */

    /* status */

    /* event list */

    /* accessibility */

    //===============================================================
    // nexacro._MultiComboListItemControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Override
    //===============================================================
    _pMultiComboListItemControl._on_getFitSize = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            var total_w = 0;
            var total_h = 0;

            var border = this._getCurrentStyleBorder();
            if (border)
            {
                total_w += border._getBorderWidth();
                total_h += border._getBorderHeight();
            }

            var padding = this._getCurrentStylePadding();
            if (padding)
            {
                total_w += padding.left + padding.right;
                total_h += padding.top + padding.bottom;
            }

            var text;
            if (this._displaytext && this._displaytext !== "")
            {
                // apply_text로 처리된 대상 기준으로 fittocontects가 이루어져야 함
                text = this._displaytext;
            }
            else
                text = this.text;
            var font = this._getCurrentStyleInheritValue("font");
            var wordspace = this._getCurrentStyleInheritValue("wordSpacing");
            var letterspace = this._getCurrentStyleInheritValue("letterSpacing");
            // var wordwrap = this.wordWrap || this._getCSSStyleValue("wordWrap");

            var text_size = nexacro._getTextSize(text ? text : "<가", font, false, undefined, "none", wordspace, letterspace);

            total_w += Math.ceil(this.textwidth != null ? this.textwidth : text_size[0]);
            total_h += Math.ceil(text_size[1]);

            return [total_w, total_h];
        }

        return [this._adjust_width, this._adjust_height];
    };

    //===============================================================
    // nexacro._MultiComboListItemControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Events
    //===============================================================
    _pMultiComboListItemControl.on_fire_sys_onlbuttonup = function (button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key)
    {
        var list = this.parent;
        if (list)
        {
            var window = this._getWindow();
            var comp = window.findComponent(from_elem);

            list._upitem = comp;
        }
        return nexacro.Component.prototype.on_fire_sys_onlbuttonup.call(this, button, alt_key, ctrl_key, shift_key, screenX, screenY, canvasX, canvasY, clientX, clientY, from_comp, from_refer_comp, from_elem, meta_key);
    };

    _pMultiComboListItemControl.on_fire_sys_ontouchend = function (touchinfos, changedtouchinfos, from_comp, from_refer_comp)
    {
        var list = this.parent;
        if (list)
        {
            var comp;
            var window = this._getWindow();
            var touchinfo = touchinfos ? touchinfos[0] : null;
            if (touchinfo)
            {
                var elem = touchinfo.target;
                comp = window.findComponent(elem);
            }
            else
            {
                comp = window.findComponent(from_comp);
            }

            list._upitem = comp;
        }
        return nexacro.Component.prototype.on_fire_sys_ontouchend.call(this, touchinfos, changedtouchinfos, from_comp, from_refer_comp);
    };

    _pMultiComboListItemControl.on_tap_basic_action = function (elem, canvasX, canvasY, screenX, screenY, refer_comp)
    {
        return;
    };

    //===============================================================
    // nexacro._MultiComboListItemControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._MultiComboListItemControl : Util Function
    //===============================================================

    delete _pMultiComboListItemControl;

    //==============================================================================
    // nexacro._MultiComboPopupControl
    //==============================================================================
    nexacro._MultiComboPopupControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.PopupControl.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboPopupControl = nexacro._createPrototype(nexacro.PopupControl, nexacro._MultiComboPopupControl);
    nexacro._MultiComboPopupControl.prototype = _pMultiComboPopupControl;
    _pMultiComboPopupControl._type_name = "popupMultiCombo";

    /* internal variable */

    //===============================================================
    // nexacro._MultiComboPopupControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboPopupControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboPopupControl : Logical part
    //===============================================================
    _pMultiComboPopupControl._popupAuto = function ()
    {
        var pos = {};
        var multicombo = this.parent;
        if (this._type == "center")
        {
            pos = this._getPopupPositionCenter();

            var root_frame = this._getRootFrame();
            if (root_frame)
            {
                this._popupBy(root_frame, pos.left, pos.top, pos.width, pos.height, true);
            }
        }
        else
        {
            pos = this._getPopupPosition();
            if (multicombo.selectall)
            {
                this._popupBy(multicombo, pos.left, pos.top, pos.width, pos.height + multicombo._height/2);
            }
			else
            {
                this._popupBy(multicombo, pos.left, pos.top, pos.width, pos.height);
			}
        }
    };

    //===============================================================
    // nexacro._MultiComboPopupControl : Util Function
    //===============================================================
    _pMultiComboPopupControl._setType = function (type)
    {
        this._type = type;
    };

    _pMultiComboPopupControl._getElementPosition = function ()
    {
        // for Preview
        var multicombo = this.parent;
        if (multicombo)
        {
            return nexacro._getElementPositionInFrame(multicombo.getElement());
        }

        return {};
    };

    _pMultiComboPopupControl._getPopupParentPos = function ()
    {
        var multicombo = this.parent;
        var multicombo_size = [multicombo._adjust_width, multicombo._adjust_height];
        var multicombo_elem_pos = nexacro._getElementPositionInFrame(multicombo.getElement());

        var xgap = 0, ygab = 0;
        /* rootframe의 top 값이 음수이면 보정 */
        if (nexacro._Browser == "MobileSafari")
        {
            var rootframe = this._getRootFrame();
            if (rootframe)
            {
                var rootframe_pos = nexacro._getElementPositionInFrame(rootframe.getElement());
                ygab = rootframe_pos.y < 0 ? rootframe_pos.y * (-1) : 0;
            }
        }

        return {"x": multicombo_elem_pos.x, "y": multicombo_elem_pos.y, "width": multicombo_size[0], "height": multicombo_size[1], "xgap": xgap, "ygap": ygab};
    };

    _pMultiComboPopupControl._getPopupPosition = function ()
    {
        var popup_left = 0;
        var popup_top = 0;
        var popup_width = 0;
        var popup_height = 0;
        var xgap = 0;
        var ygap = 0;

        var multicombo = this.parent;
        var multicombolist = this._attached_comp;
        var rootframe = this._getRootFrame();
        if (multicombo && multicombolist && rootframe)
        {
            var win = this._getWindow();

            var minimum_row = 3;

            var multicombopos = this._getPopupParentPos();
            var multicombo_elem_pos = {"x": multicombopos.x, "y": multicombopos.y};
            var multicombo_size = [multicombopos.width, multicombopos.height];
            xgap = multicombopos.xgap;
            ygap = multicombopos.ygap;

            var multicombo_vscrollsize = multicombo._getVScrollBarSize();
            var multicombo_displayrowcount = multicombo.displayrowcount;
            var multicombo_roucount;
            multicombo_roucount = multicombo._selectDataset() ? multicombo._selectDataset().getRowCount() : 0;

            var multicombo_popupsize = multicombo._getPopupSizeArr();

            var multicombolist_size = multicombolist._on_getFitSize();
            var multicombolist_itemheight = multicombolist._getItemHeight();

            var multicombolist_bordersize = multicombolist._getCurrentStyleBorder();
            multicombolist_bordersize = multicombolist_bordersize ? multicombolist_bordersize._getBorderHeight() : 0;

            var multicombolist_paddingsize = multicombolist._getCurrentStylePadding();
            multicombolist_paddingsize = multicombolist_paddingsize ? multicombolist_paddingsize.top + multicombolist_paddingsize.bottom : 0;

            var multicombolist_stylesize = multicombolist_bordersize + multicombolist_paddingsize;
            var multicombolist_minimum_height;
            var multicombolist_height;

            var screen_height = nexacro._getScreenAvailHeight();

            var rootframe_elem_pos = nexacro._getElementPositionInFrame(rootframe.getElement());
            var rootframe_screen_pos = nexacro._getElementScreenPosition(rootframe.getElement());


            var win_left = nexacro._allow_default_pinchzoom ? nexacro._getWindowOffsetPosition(win).left : rootframe_elem_pos.x;
            var window_width = win ? nexacro._getWindowHandleClientWidth(win.handle) : 0;
            var window_height = win ? nexacro._getWindowHandleClientHeight(win.handle) : 0;

            if (nexacro._Browser != "Runtime")
            {
                // screen 높이에 따라 계산 되어야 하므로 보정
                window_width = Math.round(window_width * nexacro._getDevicePixelRatio(rootframe.getElement()));
                window_height = Math.round(window_height * nexacro._getDevicePixelRatio(rootframe.getElement()));
            }
            var view_height;
            if ((window_height + rootframe_screen_pos.y) <= screen_height)
            {
                view_height = window_height;
            }
            else
            {
                view_height = screen_height - rootframe_screen_pos.y;
            }
            // screen기준 canvas pos 기준으로 처리 
            view_height = Math.round(view_height / nexacro._getDevicePixelRatio(rootframe.getElement()));
            var upper_space_height = multicombo_elem_pos.y;
            var below_space_height = view_height - (multicombo_elem_pos.y + multicombo_size[1]);

            popup_top = multicombo_size[1];

            if (multicombo_popupsize)
            {
                popup_width = multicombo_popupsize.width;
                popup_height = multicombo_popupsize.height ? multicombo_popupsize.height : popup_height;
            }
            else
            {
                popup_width = Math.max(multicombo_size[0], multicombolist_size[0]);
            }

            if (multicombo_displayrowcount == null)
            {
                multicombolist_minimum_height = (multicombo_roucount < minimum_row ? multicombo_roucount : minimum_row) * multicombolist_itemheight + multicombolist_stylesize;
                multicombolist_height = popup_height ? popup_height : (multicombo_roucount * multicombolist_itemheight) + multicombolist_stylesize;

                if (below_space_height > multicombolist_minimum_height) // enough below space
                {
                    if (below_space_height > multicombolist_height)
                    {
                        popup_height = multicombolist_height;
                    }
                    else
                    {
                        popup_height = below_space_height;

                        if (!multicombo_popupsize)
                        {
                            if (popup_width == multicombolist_size[0])
                            {
                                popup_width += multicombo_vscrollsize;
                            }
                        }
                    }
                }
                else // not enough below space
                {
                    if (upper_space_height > multicombolist_minimum_height)// enough upper space
                    {
                        if (upper_space_height > multicombolist_height)
                        {
                            popup_top = -multicombolist_height;
                            popup_height = multicombolist_height;
                        }
                        else
                        {
                            popup_top = -upper_space_height;
                            popup_height = upper_space_height;
                        }
                    }
                    else
                    {
                        if (below_space_height > upper_space_height)
                        {
                            popup_height = below_space_height;
                        }
                        else
                        {
                            popup_top = -upper_space_height;
                            popup_height = upper_space_height;
                        }
                    }
                }
            }
            else
            {
                if (multicombo_roucount > multicombo_displayrowcount)
                {
                    multicombo_roucount = multicombo_displayrowcount;

                    if (!multicombo_popupsize && popup_width <= multicombolist_size[0] + multicombo_vscrollsize)
                    {
                        popup_width = multicombolist_size[0] + multicombo_vscrollsize;
                    }
                }

                multicombolist_minimum_height = multicombo_roucount * multicombolist_itemheight + multicombolist_stylesize;
               
                if (below_space_height > multicombolist_minimum_height) // enough below space
                {
                    if (popup_height == 0)
                        popup_height = multicombolist_minimum_height;
                }
                else // not enough below space
                {
                    if (upper_space_height > multicombolist_minimum_height)// enough upper space
                    {
                        popup_top = -multicombolist_minimum_height;
                        popup_height = multicombolist_minimum_height;
                    }
                    else // not enough below space and upper space
                    {
                        if (below_space_height > upper_space_height)
                        {
                            popup_height = below_space_height;
                        }
                        else
                        {
                            popup_top = -upper_space_height;
                            popup_height = upper_space_height;
                        }
                    }
                }
            }


            var client_width = win ? nexacro._getWindowHandleClientWidth(win.handle) : 0;

            if (multicombo_elem_pos.x < win_left)
            {
                popup_left += win_left - multicombo_elem_pos.x;
            }
            else if (multicombo_elem_pos.x + popup_width > win_left + client_width)
            {
                popup_left -= (multicombo_elem_pos.x + popup_width) - (win_left + client_width);

                if (popup_left < (win_left - multicombo_elem_pos.x))
                {
                    popup_left = win_left - multicombo_elem_pos.x;
                }
            }
        }

        return {left: popup_left + xgap, top: popup_top + ygap, width: popup_width, height: popup_height};
    };

    _pMultiComboPopupControl._getPopupPositionCenter = function ()
    {
        var popup_left = 0;
        var popup_top = 0;
        var popup_width = 0;
        var popup_height = 0;

        var window_width = 0;
        var window_height = 0;

        var multicombo = this.parent;
        var multicombolist = this._attached_comp;
        if (multicombo && multicombolist)
        {
            var add_addressbar_height = 0;
            var win = this._getWindow();
            if (win)
            {
                if (nexacro._OS == "iOS" && nexacro._Browser == "MobileSafari")
                {
                    window_width = win.handle.innerWidth;
                    window_height = win.handle.innerHeight;
                    // ios browser에서 주소창이 갑작스럽게 생겨날경우 document.body에 scroll값이 생길때가 있다.
                    // 전체 화면 height 값에서 이걸 분간할 방법이 없기 때문에, 최종 top값에 보정시켜준다.
                    var body_scroll = nexacro._getWindowDestinationHandle(win.handle).scrollTop;
                    if (body_scroll > 0)
                        add_addressbar_height += body_scroll * 2;
                }
                else
                {
                    window_width = nexacro._getWindowHandleClientWidth(win.handle);
                    window_height = nexacro._getWindowHandleClientHeight(win.handle);
                }
            }
            if (nexacro._Browser == "Runtime")
            {
                // screen 높이에 따라 계산 되어야 하므로 보정 
                window_width = Math.round(window_width / nexacro._getDevicePixelRatio(multicombo.getElement()));
                window_height = Math.round(window_height / nexacro._getDevicePixelRatio(multicombo.getElement()));
            }
            var multicombo_vscrollsize = multicombo._getVScrollBarSize();
            var multicombo_displayrowcount = multicombo.displayrowcount;
            var multicombo_roucount;
            multicombo_roucount = multicombo._selectDataset() ? multicombo._selectDataset().getRowCount() : 0;

            var multicombo_popupsize = multicombo._getPopupSizeArr();

            var multicombolist_size = multicombolist._on_getFitSize();
            var multicombolist_itemheight = multicombolist._getItemHeight();

            var multicombolist_bordersize = multicombolist._getCurrentStyleBorder();
            multicombolist_bordersize = multicombolist_bordersize ? multicombolist_bordersize._getBorderHeight() : 0;

            var multicombolist_paddingsize = multicombolist._getCurrentStylePadding();
            multicombolist_paddingsize = multicombolist_paddingsize ? multicombolist_paddingsize.top + multicombolist_paddingsize.bottom : 0;

            var multicombolist_stylesize = multicombolist_bordersize + multicombolist_paddingsize;

            popup_width = multicombo_popupsize ? multicombo_popupsize.width : multicombolist_size[0];
            if (multicombo_popupsize && multicombo_popupsize.height)
            {
                popup_height = multicombo_popupsize.height;
            }
            else
                popup_height = (multicombo_roucount * multicombolist_itemheight) + multicombolist_stylesize;

            if (multicombo_displayrowcount == null)
            {
                if (popup_height > window_height)
                {
                    popup_height = window_height;
                    popup_width += multicombo_vscrollsize;
                }
            }
            else
            {
                if (multicombo_roucount > multicombo_displayrowcount)
                {
                    popup_height = (multicombo_displayrowcount * multicombolist_itemheight) + multicombolist_stylesize;

                    if (popup_height > window_height)
                    {
                        popup_height = window_height;
                    }

                    popup_width += multicombo_vscrollsize;
                }
                else
                {
                    if (popup_height > window_height)
                    {
                        popup_height = window_height;
                        popup_width += multicombo_vscrollsize;
                    }
                }
            }

            popup_left = ((window_width / 2) - (popup_width / 2));
            popup_top = ((window_height / 2) - (popup_height / 2));
            popup_top = popup_top < 0 ? 0 : popup_top;
            popup_top += add_addressbar_height;
        }

        return {left: popup_left, top: popup_top, width: popup_width, height: popup_height};
    };

    _pMultiComboPopupControl._setZoom = function (scale)
    {
        var elem = this.getElement();
        if (elem.setElementZoom)
        {
            elem.setElementZoom(scale * 100);
        }
        else if (nexacro.ScrollableControlElement.prototype.setElementZoom)
        {
            nexacro.ScrollableControlElement.prototype.setElementZoom.call(elem, scale * 100);
        }
    };

    delete _pMultiComboPopupControl;

    //==============================================================================
    // nexacro._MultiComboTextControl
    //==============================================================================
    nexacro._MultiComboTextControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Static.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboTextControl = nexacro._createPrototype(nexacro.Static, nexacro._MultiComboTextControl);
    nexacro._MultiComboTextControl.prototype = _pMultiComboTextControl;
    _pMultiComboTextControl._type_name = "MultiComboTextControl";

    /* default properties */

    /* internal variable */
    _pMultiComboTextControl._is_subcontrol = true;

    /* status */

    /* event list */

    /* accessibility */

    //===============================================================
    // nexacro._MultiComboTextControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTextControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTextControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTextControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTextControl : Events
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTextControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTextControl : Util Function
    //===============================================================

    delete _MultiComboTextControl;

    //==============================================================================
    // nexacro._MultiComboTagBoxControl
    //==============================================================================
    nexacro._MultiComboTagBoxControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboTagBoxControl = nexacro._createPrototype(nexacro.Component, nexacro._MultiComboTagBoxControl);
    nexacro._MultiComboTagBoxControl.prototype = _pMultiComboTagBoxControl;
    _pMultiComboTagBoxControl._type_name = "MultiComboTagBoxControl";

    /* control */
    _pMultiComboTagBoxControl.multicombotags = null;
    _pMultiComboTagBoxControl.multicombotagcount = null;

    /* default properties */

    /* internal variable */
    _pMultiComboTagBoxControl._is_subcontrol = true;

    /* status */

    /* event list */

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Create & Update
    //===============================================================
    _pMultiComboTagBoxControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            //this._cell_elem = new nexacro.IconTextElement(control, "icontext", this._is_fiticonsize);

            var selectedItems = this.parent._select_multi;

            if (!selectedItems)
                return;

            for (var i = 0; i < selectedItems.length; i++)
            {
                this._createMultiComboTagControl(selectedItems.items[i]);
            }
        }
    };

    _pMultiComboTagBoxControl.on_created_contents = function (win)
    {
        if (this.multicombotags)
        {
            var selectedItems = this.parent._select_multi;
            for (var i = 0; i < selectedItems.length; i++)
            {
                this.multicombotags[selectedItems.items[i]].on_created(win);
            }
        }
    };

    _pMultiComboTagBoxControl.on_destroy_contents = function ()
    {
        if (this.multicombotags)
        {
            for (var tag in this.multicombotags)
            {
                this.multicombotags[tag].destroy();
            }
            this.multicombotags = null;
        }

        this._removeEventHandlerToInnerDataset();
    };

    _pMultiComboTagBoxControl._removeEventHandlerToInnerDataset = function ()
    {
    };

    _pMultiComboTagBoxControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this.multicombotags)
        {
            var selectedItems = this.parent._select_multi;
            for (var i = 0; i < selectedItems.length; i++)
            {
                str += this.multicombotags[selectedItems.items[i]].createCommand();
            }
        }

        if (this.multicombotagcount)
        {
            str += this.multicombotagcount.createCommand();
        }

        return str;
    };

    _pMultiComboTagBoxControl.on_attach_contents_handle = function (win)
    {
        if (this.multicombotags)
        {
            var selectedItems = this.parent._select_multi;

            for (var i = 0; i < selectedItems.length; i++)
            {
                this.multicombotags[selectedItems.items[i]].attachHandle(win);
                this.multicombotags[selectedItems.items[i]]._setAccessibilityStatHidden(true);
            }
        }

        if (this.multicombotagcount)
        {
            this.multicombotagcount.attachHandle(win);
            this.multicombotagcount._setAccessibilityStatHidden(true);
        }
    };

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Events
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Logical part
    //===============================================================
    _pMultiComboTagBoxControl._createMultiComboTagControl = function (index)
    {
        var multicombo = this.parent;

        if (!this.multicombotags)
            this.multicombotags = {};

        this.multicombotags[index] = this._createMultiComboTag("tag_" + index, 0, 0, 0, 0, null, null, null, null, null, null, this);
        this.multicombotags[index].set_index(index);
        this.multicombotags[index].set_value(multicombo._getItemValue(index));
        this.multicombotags[index].set_text(multicombo._getItemText(index));

        this.multicombotags[index].createComponent(this._is_created ? false : true);
    };

    _pMultiComboTagBoxControl._createMultiComboTag = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._MultiComboTagControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiComboTagBoxControl._createMultiComboTagCountControl = function ()
    {
        if (!this.multicombotagcount)
        {
            var multicombotagcount = this.multicombotagcount = this._createMultiComboTagCount("multicombotagcount", 0, 0, 0, 0, null, null, null, null, null, null, this);

            multicombotagcount.createComponent();
        }
    };

    _pMultiComboTagBoxControl._createMultiComboTagCount = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        return new nexacro._MultiComboTextControl(id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    _pMultiComboTagBoxControl._recalcTagLayout = function (tagbox_width, tagbox_height)
    {
        var multicombotags = this.multicombotags;

        if (multicombotags)
        {
            var selectedItems = this.parent._select_multi;
            var invisible_tag_count = 0;
            var last_visible_tag, last_visible_tag_width, total_tags_row;

            var tag_paddingsize = multicombotags[selectedItems.items[0]]._getCurrentStylePadding();
            var tag_marginsize = 5;

            // tag text 사이즈
            var tagtext_size = multicombotags[selectedItems.items[0]].tagtext._on_getFitSize();
            var tagtext_width;
            var tagtext_height = tagtext_size[1];
            var tagtext_left = 0;
            var tagtext_top = 0;

            // tag button 사이즈
            var tagbutton_width = tagtext_height;
            var tagbutton_height = tagtext_height;
            var tagbutton_left;

            // tag 사이즈
            var tag_width;
            var tag_height = tagtext_height + tag_paddingsize.top + tag_paddingsize.bottom;
            var tag_left = tag_marginsize;
            var tag_top = tag_marginsize;

            // tags 사이즈
            var tags_width = tag_marginsize;
            var tags_height = tag_height + tag_marginsize + tag_marginsize;
            var tags_row = 1;
            total_tags_row = Math.floor(tagbox_height / (tag_height + tag_marginsize)) || 1;

            for (var i = 0; i < selectedItems.length; i++)
            {
                tagtext_size = multicombotags[selectedItems.items[i]].tagtext._on_getFitSize();
                tagtext_width = tagtext_size[0];

                tagbutton_left = tagtext_left + tagtext_width;

                tag_width = tagtext_width + tagbutton_width + tag_paddingsize.left + tag_paddingsize.right;
                // tag_width가 tagbox_width보다 클 경우
                if (tag_width > tagbox_width - tag_marginsize - tag_marginsize)
                {
                    tag_width = tagbox_width - tag_marginsize - tag_marginsize;
                    tagtext_width = tag_width - tagbutton_width - tag_paddingsize.left - tag_paddingsize.right;
                    tagbutton_left = tagtext_width + tag_paddingsize.left;
                }

                tags_width += (tag_width + tag_marginsize);

                // 너비 초과
                if (tags_width > tagbox_width)
                {
                    // 높이 초과
                    if (tags_row >= total_tags_row)
                    {
                        tags_width = tags_width - tag_width - tag_marginsize;
                        invisible_tag_count = selectedItems.length - i;

                        // 1. tagcount 컨트롤 생성
                        this._createMultiComboTagCountControl();

                        var multicombotagcount = this.multicombotagcount;
                        multicombotagcount.set_text("+" + invisible_tag_count + " item(s)");

                        // 2. tagcount move
                        var tagcount_size = multicombotagcount._on_getFitSize();
                        var tagcount_width = tagcount_size[0];
                        var tagcount_height = tagcount_size[1];
                        var tagcount_left = tag_left;
                        var tagcount_top = tag_top;

                        // 3. 자리 부족하면 마지막 태그 삭제
                        var cnt = 1;
                        while (tagcount_width > tagbox_width - tags_width)
                        {
                            last_visible_tag.move(0, 0, 0, 0, null, null);

                            invisible_tag_count++;
                            multicombotagcount.set_text("+" + invisible_tag_count + " item(s)");

                            tagcount_left = tagcount_left - last_visible_tag_width - tag_marginsize;
                            tags_width = tags_width - last_visible_tag_width - tag_marginsize;

                            last_visible_tag = multicombotags[selectedItems.items[i - 1 - cnt]];
                            last_visible_tag_width = last_visible_tag ? last_visible_tag.width : undefined;

                            cnt++;
                        }

                        this.multicombotagcount.move(tagcount_left, tagcount_top, tagcount_width, tagcount_height, null, null);

                        break;
                    }

                    tags_row++;

                    tag_left = tag_marginsize;
                    tag_top = tags_height;
                    tags_width = tag_width + tag_marginsize + tag_marginsize;
                    tags_height += (tag_height + tag_marginsize);
                }
                else
                {
                    if (this.multicombotagcount)
                    {
                        this.multicombotagcount.destroy();
                        this.multicombotagcount = null;
                    }
                }

                multicombotags[selectedItems.items[i]].tagtext.move(tagtext_left, tagtext_top, tagtext_width, tagtext_height, null, null);
                multicombotags[selectedItems.items[i]].tagbutton.move(tagbutton_left, tagtext_top, tagbutton_width, tagbutton_height, null, null);
                multicombotags[selectedItems.items[i]].move(tag_left, tag_top, tag_width, tag_height, null, null);

                last_visible_tag = multicombotags[selectedItems.items[i]];
                last_visible_tag_width = last_visible_tag.width;
                tag_left = tags_width;
            }
        }
    };

    //===============================================================
    // nexacro._MultiComboTagBoxControl : Util Function
    //===============================================================
    _pMultiComboTagBoxControl._setMultiComboTagValue = function ()
    {
        var selectedItems = this.parent._select_multi;

        if (this.multicombotags)
        {
            this._destroyMulticomboTags();
        }

        if (this.multicombotagcount)
        {
            this.multicombotagcount.destroy();
            this.multicombotagcount = null;
        }

        for (var i = 0; i < selectedItems.length; i++)
        {
            this._createMultiComboTagControl(selectedItems.items[i]);
        }
    };

    // 태그 전부 destroy
    _pMultiComboTagBoxControl._destroyMulticomboTags = function ()
    {
        if (this.multicombotags)
        {
            for (var tag in this.multicombotags)
            {
                this.multicombotags[tag].destroy();
            }
        }
        this.multicombotags = null;
    };

    // 태그 하나만 destroy
    _pMultiComboTagBoxControl._destroyMulticomboTag = function (index)
    {
        this.multicombotags[index].destroy();
        delete this.multicombotags[index];

        if (Object.keys(this.multicombotags).length <= 0)
            this.multicombotags = null;
    };

    delete _pMultiComboTagBoxControl;

    //==============================================================================
    // nexacro._MultiComboTagControl
    //==============================================================================
    nexacro._MultiComboTagControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboTagControl = nexacro._createPrototype(nexacro.Component, nexacro._MultiComboTagControl);
    nexacro._MultiComboTagControl.prototype = _pMultiComboTagControl;
    _pMultiComboTagControl._type_name = "MultiComboTagControl";

    /* default properties */
    _pMultiComboTagControl.index = "";
    _pMultiComboTagControl.value = undefined;

    /* internal variable */
    _pMultiComboTagControl._is_subcontrol = true;

    /* status */

    /* event list */
    _pMultiComboTagControl._event_list = {
        "onclick": 1, "ondblclick": 1,
        "onflingstart": 1, "onfling": 1, "onflingend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };

    //===============================================================
    // nexacro._MultiComboTagControl : Create & Update
    //===============================================================
    _pMultiComboTagControl.on_create_contents = function ()
    {
        var control = this.getElement();
        if (control)
        {
            var tagtext = this.tagtext = new nexacro._MultiComboTextControl("tagtext", 0, 0, 0, 0, null, null, null, null, null, null, this);
            var tagbutton = this.tagbutton = new nexacro._MultiComboTagButtonControl("tagbutton", 0, 0, 0, 0, null, null, null, null, null, null, this);

            this.tagtext.createComponent();
            this.tagbutton.createComponent();

            tagbutton._setEventHandlerToTagButton();

            tagtext.set_text(this.text);
        }
    };

    _pMultiComboTagControl.on_created_contents = function (win)
    {
        this.tagtext.on_created(win);
        this.tagbutton.on_created(win);
    };

    _pMultiComboTagControl.on_destroy_contents = function ()
    {
        if (this.tagtext)
        {
            this.tagtext.destroy();
            this.tagtext = null;
        }

        if (this.tagbutton)
        {
            this.tagbutton.destroy();
            this.tagbutton = null;
        }

        this._removeEventHandlerToInnerDataset();
    };

    _pMultiComboTagControl._removeEventHandlerToInnerDataset = function ()
    {
    };

    _pMultiComboTagControl.on_create_contents_command = function ()
    {
        var str = "";

        if (this.tagtext)
        {
            str += this.tagtext.createCommand();
        }

        if (this.tagbutton)
        {
            str += this.tagbutton.createCommand();
        }

        return str;
    };

    _pMultiComboTagControl.on_attach_contents_handle = function (win)
    {
        if (this.tagtext)
        {
            this.tagtext.attachHandle(win);
            this.tagtext._setAccessibilityStatHidden(true);
        }

        if (this.tagbutton)
        {
            this.tagbutton.attachHandle(win);
            this.tagbutton._setAccessibilityStatHidden(true);
        }
    };

    //===============================================================
    // nexacro._MultiComboTagControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagControl : Properties
    //===============================================================
    _pMultiComboTagControl.set_index = function (v)
    {
        if (v !== this.index)
        {
            this.index = parseInt(v, 10);
        }
    };

    _pMultiComboTagControl.set_value = function (v)
    {
        if (v !== this.value)
        {
            this.value = v;
        }
    };

    //===============================================================
    // nexacro._MultiComboTagControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagControl : Events
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagControl : Util Function
    //===============================================================

    delete _pMultiComboTagControl;

    //==============================================================================
    // nexacro._MultiComboTagButtonControl
    //==============================================================================
    nexacro._MultiComboTagButtonControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pMultiComboTagButtonControl = nexacro._createPrototype(nexacro.Button, nexacro._MultiComboTagButtonControl);
    nexacro._MultiComboTagButtonControl.prototype = _pMultiComboTagButtonControl;
    _pMultiComboTagButtonControl._type_name = "MultiComboTagButtonControl";

    /* default properties */

    /* internal variable */
    _pMultiComboTagButtonControl._is_subcontrol = true;

    /* status */

    /* event list */

    /* accessibility */

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Override
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Properties
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Events
    //===============================================================
    _pMultiComboTagButtonControl._on_tagbutton_onclick = function (obj, evt)
    {
        var root_comp = this._getRootComponent(this);
        var tagobj = obj.parent;

        root_comp._on_tagbutton_click(this.parent.index, tagobj);
    };

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._MultiComboTagButtonControl : Util Function
    //===============================================================
    _pMultiComboTagButtonControl._setEventHandlerToTagButton = function ()
    {
        this._setEventHandler("onclick", this._on_tagbutton_onclick, this);
    };

    delete _pMultiComboTagButtonControl;

    //==============================================================================
    // nexacro._SelectAllControl
    //==============================================================================
    nexacro._SelectAllControl = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Button.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
    };

    var _pSelectAllControl = nexacro._createPrototype(nexacro.Button, nexacro._SelectAllControl);
    nexacro._SelectAllControl.prototype = _pSelectAllControl;
    _pSelectAllControl._type_name = "SelectAllControl";

    /* default properties */
    _pSelectAllControl.index = "";
    _pSelectAllControl.value = undefined;
    _pSelectAllControl.selected = false;
    _pSelectAllControl.wordWrap = "none";

    /* status */
    _pSelectAllControl._is_subcontrol = true;

    _pSelectAllControl.accessibilityrole = "SelectAllControl";

    /* event list */
    _pSelectAllControl._event_list =
    {
        "onclick": 1, "ondblclick": 1,
        "onflingstart": 1, "onfling": 1, "onflingend": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onlongpress": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmove": 1,
        "onmousedown": 1, "onmouseup": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1,
        "oncontextmenu": 1,
        "onrbuttondown": 1, "onrbuttonup": 1
    };
    //===============================================================
    // nexacro._SelectAllControl : Create & Update
    //===============================================================

    //===============================================================
    // nexacro._SelectAllControl : Override
    //===============================================================
    _pSelectAllControl._on_click = function (elem, button, alt_key, ctrl_key, shift_key, canvasX, canvasY, screenX, screenY, meta_key)
    {
        // todo 이벤트 호출 방식
        var multicombolist = this.parent.multicombolist;
        var root_comp = this._getRootComponent(this);
        var rowcount = root_comp._innerdataset.rowcount;
        if (this.parent._select_multi.length > rowcount / 2)
        {
            this.set_selected(false);
            for (var i = 0; i < rowcount; i++)
            {
                multicombolist._clearAll(i);
            }
            root_comp._changeIndex(-1);
        }
        else
        {
            this.set_selected(true);
            for (var i = 0; i < rowcount; i++)
            {
                multicombolist._selectAll(i);
            }
            root_comp._changeIndex(multicombolist.index);
        }
        root_comp.redraw();
    };
    
    _pSelectAllControl.on_getIDCSSSelector = function ()
    {
        return "selectall";
    };

    _pSelectAllControl._apply_setfocus = function (evt_name)
    {
        if (!this.parent._is_subcontrol && this.parent._status == "focused")
        {
            nexacro.Component.prototype._apply_setfocus.call(this, evt_name);
        }
    };

    //===============================================================
    // nexacro._SelectAllControl : Properties
    //===============================================================
    _pSelectAllControl.set_index = function (v)
    {
        if (v !== this.index)
        {
            this.index = parseInt(v, 10);
        }
    };

    _pSelectAllControl.set_value = function (v)
    {
        if (v !== this.value)
        {
            this.value = v;
        }
    };

    _pSelectAllControl.set_selected = function (v)
    {
        if (v != this.selected)
        {
            this.selected = v;
            this.on_apply_selected();
        }
    };

    _pSelectAllControl.on_apply_selected = function ()
    {
        var bfocused = this.parent._statusmap ? this.parent._statusmap['focused'] : false;
        if (this.selected)
        {
            this._changeUserStatus("selected", true);
            if (bfocused)
                this._changeStatus("focused", true);
        }
        else
        {
            if (this._status == "focused")
            {
                this._changeStatus("focused", false);
            }

            this._changeUserStatus("selected", false);

        }
    };

    //===============================================================
    // nexacro._SelectAllControl : Methods
    //===============================================================

    //===============================================================
    // nexacro._SelectAllControl : Events
    //===============================================================

    //===============================================================
    // nexacro._SelectAllControl : Logical part
    //===============================================================

    //===============================================================
    // nexacro._SelectAllControl : Util Function
    //===============================================================

    delete _pSelectAllControl;

}