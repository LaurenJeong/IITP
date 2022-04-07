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
if (nexacro.Edit)
{
    nexacro._defineImeLocaleEdit("ko", {               
        "Edit": {
            on_killfocus_basic_process: function ()
            {
                var input_elem = this._input_element;
                var cur_text;
                if (!this._onlydisplay)
                {
                    if (input_elem.isComposing())
                    {
                        cur_text = this.text;
                        var filter_text = this.text;
                        if (this._inputtype_obj)
                        {
                            filter_text = this._inputtype_obj.apply(cur_text);
                        }
                        if (this._inputfilter_obj)
                        {
                            filter_text = this._inputfilter_obj.apply(cur_text);
                        }

                        if (cur_text != filter_text)
                        {
                            input_elem.setCompositionCancel();
                        }
                        else
                        {
                            input_elem.setCompositionComplete();
                        }
                    }

                    var pre_value = this._default_value;
                    var pre_text = this._default_text;

                    var cur_value = input_elem.value;
                    cur_text = cur_value ? cur_value : "";

                    var pos = input_elem.getElementCaretPos();
                    if (pre_value != cur_value)
                    {
                        if (!this._processing_canchange)
                        {
                            if (!this._on_value_change(pre_text, pre_value, cur_text, cur_value))
                            {
                                var cur_text_len = cur_text ? cur_text.length : 0;
                                var pre_text_len = pre_text ? pre_text.length : 0;
                                if (pos != -1)
                                {
                                    if (cur_text_len - pre_text_len >= 0)
                                        pos.begin = pos.end = pos.begin - (cur_text_len - pre_text_len);
                                    if (pos.begin < 0) pos.begin = pos.end = 0;

                                    this._caret_pos = pos;
                                }
                                else
                                {
                                    this._caret_pos.begin = this._caret_pos.end = pre_value ? pre_value.length : 0;
                                }

                                this.value = pre_value;
                                this.text = pre_text;

                                input_elem.setElementValue(pre_value);
                                input_elem.setElementSetSelect(this._caret_pos.begin, this._caret_pos.end);
                            }
                        }
                    }
                    else
                    {
                        this._caret_pos = input_elem.getElementCaretPos();
                    }
                    
                    if (nexacro._isNull(this.value))
                    {
                        this._changeUserStatus("nulltext", true);
                    }

                    // for killfocus
                    if (nexacro._enableaccessibility && nexacro._Browser == "Runtime" && nexacro._accessibilitytype == 5)
                    {
                        this._setAccessibilityStatKillFocus();
                    }

                    var _win = this._getRootWindow();
                    var idx = _win._indexOfCurrentFocusPaths(this);
                    if (idx < 0)
                    {
                        input_elem.setElementBlur();
                    }
                }
                else
                {
                    if (nexacro._isNull(this.value))
                    {
                        this._changeUserStatus("nulltext", true);
                    }
                }

				if (nexacro._Browser == "IE")
				{
					if (this._inputtype_obj && this._inputtype_obj._imedisable)
					{
						this.on_apply_imemode(this.imemode);
					}
				} 

                return true;
            },
            on_keydown_basic_process: function (keycode, alt_key, ctrl_key, shift_key, refer_comp)
            {
                if (nexacro._OS == "Windows" && nexacro._OSVersion < 10 && nexacro._Browser == "IE")
                {
                    var input_elem = this._input_element;
                    if (this._undostack && !input_elem.isComposing())
                    {
                        var pos = input_elem.getElementCaretPos();

                        if (keycode == 229)
                        {
                            if (input_elem._last_selection_range)
                            {
                                pos.begin = input_elem._last_selection_range[0];
                                pos.end = input_elem._last_selection_range[1];
                            }
                            else
                            {
                                pos.begin = pos.end = pos.begin - 1;
                            }
                        }

                        if (pos && pos != -1)
                        {
                            this._undostack.update(pos.begin, pos.end);
                        }
                    }
                    return true;
                }
                else
                {
                    return nexacro.Edit.prototype.on_keydown_basic_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp);
                }
            },
            on_keypress_basic_process: function (keycode, charcode, alt_key, ctrl_key, shift_key, meta_key)
            {
                var input_elem = this._input_element;
                // IE < 9, Opera 에서는 charCode 안나옴
                charcode = charcode || keycode;
                if (!ctrl_key && !alt_key && charcode && !input_elem.isComposing())
                {
                    var inputChar = String.fromCharCode(charcode);
                    if (nexacro._OS == "iOS" && (charcode >= 12593 && charcode <= 12643))
                    {                        
                        if (inputChar.length > 0 && this._isFilterChar(inputChar))
                        {
                            input_elem.stopSysEvent();
                            return false;
                        }
                        return true;
                    }
                }

                return nexacro.Edit.prototype.on_keypress_basic_process.call(this, keycode, charcode, alt_key, ctrl_key, shift_key, meta_key);
            },
        },
        "TextArea": {
            on_keydown_basic_process: function (keycode, alt_key, ctrl_key, shift_key, refer_comp)
            {
                if (nexacro._OS == "Windows" && nexacro._OSVersion < 10 && nexacro._Browser == "IE")
                {
                    var input_elem = this._input_element;
                    if (this._undostack && !input_elem.isComposing())
                    {
                        var pos = input_elem.getElementCaretPos();

                        if (keycode == 229)
                        {
                            if (input_elem._last_selection_range)
                            {
                                pos.begin = input_elem._last_selection_range[0];
                                pos.end = input_elem._last_selection_range[1];
                            }
                            else
                            {
                                pos.begin = pos.end = pos.begin - 1;
                            }
                        }

                        if (pos && pos != -1)
                        {
                            this._undostack.update(pos.begin, pos.end);
                        }
                    }
                    return true;
                }
                else
                {
                    return nexacro.TextArea.prototype.on_keydown_basic_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp);
                }
            },
            on_keydown_default_specialkey_process: function (keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key)
            {
                var input_elem = this._input_element;

                // 일본어의 경우, keydown에서 keycode 알 수 없음
                if (keycode == nexacro.Event.KEY_RETURN) // 13
                {
                    if (input_elem.isComposing())
                        input_elem.setCompositionComplete();
                }

                return nexacro.TextArea.prototype.on_keydown_default_specialkey_process.call(this, keycode, alt_key, ctrl_key, shift_key, refer_comp, meta_key);
            },
            on_keypress_basic_process: function (keycode, charcode, alt_key, ctrl_key, shift_key, meta_key)
            {
                var input_elem = this._input_element;
                // IE < 9, Opera 에서는 charCode 안나옴
                charcode = charcode || keycode;
                if (!ctrl_key && !alt_key && charcode && !input_elem.isComposing())
                {
                    var inputChar = String.fromCharCode(charcode);
                    if (nexacro._OS == "iOS" && (charcode >= 12593 && charcode <= 12643))
                    {
                        if (inputChar.length > 0 && this._isFilterChar(inputChar))
                        {
                            input_elem.stopSysEvent();
                            return false;
                        }
                        return true;
                    }
                }

                return nexacro.TextArea.prototype.on_keypress_basic_process.call(this, keycode, charcode, alt_key, ctrl_key, shift_key, meta_key);
            },
            on_killfocus_basic_process: function ()
            {
                var ret = nexacro.TextArea.prototype.on_killfocus_basic_process.call(this);

				if (nexacro._Browser == "IE")
				{
					if (this._inputtype_obj && this._inputtype_obj._imedisable)
					{
						this.on_apply_imemode(this.imemode);
					}
				}

                return ret;
            }
        }
    });
}

if (nexacro._Browser != "Runtime")
{
    if (nexacro.InputElement)
    {
        nexacro._defineImeLocaleEdit("ko", {
            "InputElement": {
                on_sys_keydown_process: function (evt)
                {
                    var input_handle = (evt.target || evt.srcElement);                    
                    var pThis = input_handle._linked_element;   

                    if (pThis._force_fire_propertychange)                
                    {
                        var keycode = nexacro._getSysEventKey(evt);
                        if (keycode == nexacro.KeyCode_ImeInput)
                        {
                            if (!pThis.on_sys_propertychange_before_process.call(pThis, evt))
                                return;

                            pThis.on_sys_propertychange_process.call(pThis, evt);
                        }
                    }
                    return true;
                },
                on_sys_keyup_specialkey_process: function (evt)
                {
                    var input_handle = (evt.target || evt.srcElement);
                    var pThis = input_handle._linked_element;
                    var keycode = nexacro._getSysEventKey(evt);
                    var ctrlkey = evt.ctrlKey;
                    var pos = pThis.getElementCaretPos();
                    var is_composing = pThis._composer.isComposing();
                    if (is_composing)
                    {
                        var value = pThis._getInputValue();

                        if (keycode == nexacro.Event.KEY_RETURN || keycode == nexacro.Event.KEY_ESC || (ctrlkey && keycode == 77) || (ctrlkey && keycode == 90))
                        {
                            pThis._composer.setStatus(nexacro._CompositionState.END, pos.end);
                            pThis._updateInputValue(value, true);
                        }
                    }
                    return true;
                },
                on_sys_compositionstart_process: function (evt)
                {
                    var input_handle = (evt.target || evt.srcElement);
                    var pThis = input_handle._linked_element;
                    var pos = pThis.getElementCaretPos();
                    pThis._composer.setStatus(nexacro._CompositionState.START, pos.begin);

                    // win7 IE11에서 문제발생
                    // win7 IE11의 경우 가나 를 입력할 경우
                    // ㄱ => 가 => 간 => 'ㅏ'를 입력하여 가나로 될경우 compositionend 가 발생하지 않는다.
                    // 현재 제품에서는 compositionend 쪽에서 undostack을 관리하기때문에 win7 IE11에서 undostack이 정상동작하지 않음
                    if (nexacro._OS == "Windows" && nexacro._OSVersion < 10 && nexacro._Browser == "IE")
                    {
                        var value = this._getInputValue();

                        if (pThis._composer._prev_status == nexacro._CompositionState.NONE)
                        {
                            value = pThis.value;

                            if (this._last_selection_range)
                            {
                                pos.begin = this._last_selection_range[0];
                                pos.end = this._last_selection_range[1];
                            }
                            else
                            {
                                pos.begin = pos.end = pos.begin - 1;
                            }
                        }
                        else if (pThis._composer._prev_status == nexacro._CompositionState.COMPOSING)
                        {
                            var length = value.length;
                            var endpos = this._last_selection_range[1];
                            var val = value.substr(0, endpos);

                            if (length - 1 != endpos)
                                val += value.substr(endpos + 1);

                            value = val;

                            pos.begin = endpos;
                            pos.end = endpos;
                        }

                        var comp = this.parent.linkedcontrol;
                        if (comp)
                            comp._on_input_compositionend(value, pos);
                    }
                    return true;
                },
                on_sys_compositionend_process: function (evt)
                {
                    var input_handle = (evt.target || evt.srcElement);
                    var pThis = input_handle._linked_element;
                    var comp = pThis.parent_elem.linkedcontrol;
                    var value = pThis._getInputValue();
                    var pos = pThis.getElementCaretPos();
                    pThis._composer.setStatus(nexacro._CompositionState.END, pos.end);

                    // kindlion : IE9에서 한글 입력후 백스페이스 할때 여기를 타야 정상동작                
                    if (pThis._evtorder_compositionend_is_last)
                    {

                        // IE9 deactivate exception                    
                        setTimeout(function ()
                        {
                            pThis._updateInputValue(value, true);
                        }, 0);


                    }
                    /*                
                    else if (!pThis._evtfire_oninput_after_compositionend)
                    {
                        if (!nexacro._is_hangul(evt.data))
                        {
                            pThis._updateInputValue(value, true);
                        }
                        else
                        {
                            //pThis._on_sys_keyinput(evt);
                        }
                    }
                    else if (pThis._use_event_beforeinput && nexacro._OS == "Android")
                    */
                    if (pThis._use_event_beforeinput && nexacro._OS == "Android")
                    {
                        var beforeinput_data = evt.data;
                        var beforeinput_type = evt.type;

                        var input_value = pThis._getInputValue();
                        //var input_pos = pThis._composer.getOffset();

                        var composing_status = pThis.getCompositionStatus();
                        var beginOffset = pos.begin;
                        var endOffset = pos.end;

                        if (pThis._composing_start !== undefined && pThis._composing_end !== undefined)
                        {
                            beginOffset = pThis._composing_start;
                        }

                        if (endOffset == undefined)
                        {
                            if (pThis.maxlength > 0)
                                endOffset = Math.min(beginOffset + beforeinput_data.length, pThis.maxlength);
                            else
                                endOffset = beginOffset + beforeinput_data.length;
                        }
                        beforeinput_data = beforeinput_data.substr(0, endOffset - beginOffset);

                        input_value = input_value.substring(0, beginOffset) + input_value.substring(endOffset, Math.min(input_value.length, (pThis.maxlength > 0 ? pThis.maxlength : input_value.length)));

                        pThis._beforeinput_result = comp._on_beforekeyinput(pThis, beforeinput_data, composing_status, beginOffset, endOffset, beforeinput_type);
                        if (pThis._beforeinput_result)
                        {
                            pThis._beforeinput_result.forEach(function (state)
                            {
                                var caret_after_convert;
                                switch (state)
                                {
                                    case pThis._BeforeinputState.PASS:
                                        //console.log("PASS");
                                        break;
                                    case pThis._BeforeinputState.CANCEL:
                                        //console.log("CANCEL");
                                        //Chrome ( 61버전 기준 ) 에서 input event 에서 composition value 강제조정후, caret 보정하면 caret 상태가 조합중같이 보이고있다.
                                        pThis._beforeinput_result_data = input_value;
                                        pThis._beforeinput_result_pos = { begin: null, end: null };

                                        break;
                                    case pThis._BeforeinputState.CONVERT_UPPER:
                                        //console.log("CONVERT_UPPER");
                                        caret_after_convert = endOffset;// + beforeinput_data.length;

                                        pThis._beforeinput_result_data = input_value.substring(0, beginOffset) + beforeinput_data.toUpperCase() + input_value.substring(endOffset, input_value.length);
                                        pThis._beforeinput_result_pos = { begin: caret_after_convert, end: caret_after_convert };
                                        //trace(pThis._beforeinput_result_pos.begin, pThis._beforeinput_result_pos.end);
                                        break;
                                    case pThis._BeforeinputState.CONVERT_LOWER:
                                        //console.log("CONVERT_LOWER");
                                        caret_after_convert = endOffset + beforeinput_data.length;

                                        pThis._beforeinput_result_data = input_value.substring(0, beginOffset) + beforeinput_data.toLowerCase() + input_value.substring(endOffset);
                                        pThis._beforeinput_result_pos = { begin: caret_after_convert, end: caret_after_convert };

                                        break;
                                    case pThis._BeforeinputState.MAXLENGTH:
                                        //console.log("MAXLENGTH");
                                        break;
                                    case pThis._BeforeinputState.REPLACE:
                                        //console.log("REPLACE")
                                        //MaskEdit는 component 로직이 많이 필요하므로 component에서 처리.
                                        break;
                                    default:
                                        break;
                                }
                            }, pThis);
                        }

                        pThis._on_sys_keyinput(evt);
                    }
                    pThis._composing_start = pThis._composing_end = undefined;

                    var text = value;
                    if (pThis.maxlength > 0 && value && value.length > pThis.maxlength)
                    {
                        if (pThis._last_selection_range)
                        {
                            var head_text = text.substr(0, pThis._last_selection_range[0]);
                            var head_text_len = head_text.length;
                            var rear_text = text.substr(pos.end);
                            var rear_text_len = rear_text.length;
                            var middle_text_len = pThis.maxlength - (head_text_len + rear_text_len);
                            if (middle_text_len < 0) middle_text_len = 0;
                            var middle_text = text.substr(pThis._last_selection_range[0], middle_text_len);

                            text = head_text + middle_text + rear_text;
                        }
                        else
                        {
                            text = text.substring(0, pThis.maxlength);
                        }
                        value = text;
                    }

                    comp = pThis.parent.linkedcontrol;
                    if (comp)
                        comp._on_input_compositionend(value);

                    pThis._setElementLastSelectionRange();

                    return true;
                },
                _on_sys_keyinput_process_use_event_beforeinput: function (evt)
                {
                    var input_handle = (evt.target || evt.srcElement);
                    var pThis = input_handle._linked_element;
                    if (pThis._skip_sys_keyinput)
                    {
                        pThis._skip_sys_keyinput = false;
                        return;
                    }

                    var comp = pThis.parent_elem.linkedcontrol;
                    var ismax = false;
                    var value = pThis._getInputValue();
                    var pos;// = pThis.getElementCaretPos();
                    if (pThis._beforeinput_result)
                    {
                        var bcancle = false;
                        pThis._beforeinput_result.forEach(function (state)
                        {
                            switch (state)
                            {
                                case nexacro.InputElement.prototype._BeforeinputState.PASS:

                                    break;
                                case nexacro.InputElement.prototype._BeforeinputState.CANCEL:
                                    // input event를 발생시켜줄 필요가 없다.
                                    //start [RP 84327]
                                    //pThis._updateInputValue(pThis._beforeinput_result_data, false, pThis._beforeinput_result_pos.begin, pThis._beforeinput_result_pos.end);                                
                                    pThis._updateInputValue(pThis._beforeinput_result_data, false, pThis._beforeinput_result_pos.end, pThis._beforeinput_result_pos.end);
                                    //end
                                    bcancle = true;
                                    break;
                                case nexacro.InputElement.prototype._BeforeinputState.CONVERT_UPPER:
                                case nexacro.InputElement.prototype._BeforeinputState.CONVERT_LOWER:
                                case nexacro.InputElement.prototype._BeforeinputState.REPLACE:
                                    if (pThis._beforeinput_result_data != null)
                                        pThis._updateInputValue(pThis._beforeinput_result_data, false, pThis._beforeinput_result_pos.begin, pThis._beforeinput_result_pos.end);
                                    break;
                                case nexacro.InputElement.prototype._BeforeinputState.MAXLENGTH:
                                    ismax = true;
                                    
                                    break;
                            }
                        }, pThis);

                        if (pThis.autoskip && ismax)
			            {
                            if (pThis.value && value.length >= pThis.maxlength)
                                pThis._go_next_focus();
                        }

                        if (bcancle)
                            return;
                    }

                    value = pThis._getInputValue();
                    pos = pThis.getElementCaretPos();

                    if (pThis._composer.isComposing())
                        pThis._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);

                    // fire oninput event
                    var old_value = pThis.value;
                    pThis._updateElementValue(value);

                    if (comp._on_keyinput)
                        comp._on_keyinput(pThis);

			        if (pThis.getInputStatusPseudoClass("AUTOFILL"))
			        {
				        nexacro.__changeInputDOMNodeType(input_handle, pThis.inputtype);
			        }

                    // detemine changed status & value
                    var prev_status = pThis._composer._prev_status;
                    var cur_status = pThis._composer.status;

                    if (prev_status == cur_status && pThis.value == old_value)
                    {
                        // TODO : non composition, composition autoskip
                        if (comp._on_input_autoskip)
                        {
                            comp._on_input_autoskip();
                        }
                    }

                    pThis._composer._prev_status = cur_status;

                    return true;
                },
                _on_sys_keyinput_process_no_use_event_beforeinput: function (evt)
                {
                    if (nexacro._Browser == "Gecko")
                    {
                        var input_handle = evt ? (evt.target || evt.srcElement) : this.handle;
                        var input_elem = input_handle ? input_handle._linked_element : this;
                        var comp = input_elem.parent_elem.linkedcontrol;
                        var _win = comp._getRootWindow();

                        if (_win && _win._keydown_element)
                        {
                            if (_win._keydown_element !== input_elem && comp._processing_autoskip)
                            {
                                var old_value = input_elem.value;
                                var sel_range = (input_elem._last_selection_range) ? input_elem._last_selection_range : [0, 0]; // node에 갱신되기 전 caret 값 필요
                                input_elem._updateInputValue(old_value, false, sel_range[0], sel_range[1]);
                                comp._processing_autoskip = false;
                                return false;
                            }
                        }
                    }

                    return nexacro.InputElement.prototype.on_sys_keyinput_process.call(this, evt);
                },
                on_sys_keyinput_process: function (evt)
                {
                    if (this._use_event_beforeinput && nexacro._is_hangul(evt.data))
                    {
                        return this._on_sys_keyinput_process_use_event_beforeinput(evt);
                    }
                    else
                    {                     
                        return this._on_sys_keyinput_process_no_use_event_beforeinput(evt);
                    }
                },             
                on_apply_ime_environment_process: function (evt)
                {
                    var input_handle = evt ? (evt.target || evt.srcElement) : this.handle;
                    var pThis = input_handle ? input_handle._linked_element : this;

                    if (!pThis._apple_default_browser)
                        pThis._setElementUseMaxLength(true);
                    else
                        pThis._setElementUseMaxLength(false);

                    if (this._use_html_maxlength)
                        nexacro.__setDOMNode_MaxLength(input_handle, pThis.maxlength);
                    else
                        nexacro.__setDOMNode_MaxLength(input_handle, 0);

                    pThis.on_updateEvtOrder_process();

                    return true;
                },
                on_apply_force_imeSet: function (evt)
				{
					var input_handle = evt ? (evt.target || evt.srcElement) : this.handle;
					var pThis = input_handle ? input_handle._linked_element : this;
					var comp = pThis.parent_elem.linkedcontrol;
					var pos = pThis.getElementCaretPos();
					var new_val, begin;

					if (nexacro._Browser == "IE")
                    {
                        if (comp._inputtype_obj && comp._inputtype_obj._imedisable)
                        {
                            var is_change_evtorder = false;
                            if (pThis._evtorder_compositionend_is_last)
                            {
                                is_change_evtorder = true;
                                pThis._evtorder_compositionend_is_last = false;
                            }

                            comp.on_apply_imemode("alpha");
                            input_handle.blur();
                            input_handle.focus();

                            if (is_change_evtorder)
                            {
                                pThis._evtorder_compositionend_is_last = true;
                            }

                            pThis.setCompositionCancel();
                            new_val = this.value;
                            if (new_val === null || new_val === undefined)
                                new_val = "";

                            pThis._updateInputValue(new_val);

                            begin = pos.begin;
							if (begin > 0)
							{
								if (nexacro._Browser == "IE" && nexacro._BrowserVersion < 11)
								{
									begin -= 1;
								}
							}

							pThis.setElementSetSelect(begin, begin);

                            return false;
                        }
					}
					else if (nexacro._Browser == "Edge" && nexacro._BrowserType == "Edge")
					{
						if (comp._inputtype_obj && comp._inputtype_obj._imedisable)
						{
							pThis.setCompositionCancel();
							new_val = this.value;
							if (new_val === null || new_val === undefined)
								new_val = "";

							pThis._updateInputValue(new_val);

							begin = pos.begin;
							if (begin > 0)
							{
								begin -= 1;
							}

							pThis.setElementSetSelect(begin, begin);

							return false;
						}
					}
                    return true;
                },
            },
            "TextAreaElement": {
                on_reset_update_value: function (resetpos)
                {
                    if (this._need_reset_update_value)
                    {
                        this._need_reset_update_value = false;
                        var save = this._processing_oninput;
                        this._processing_oninput = true;
                        var pos;
                        if (resetpos)
                            pos = this.getElementCaretPos();
                        var val = nexacro.__getDOMNodeValue(this.handle);
                        if (val == '')
                            nexacro.__setDOMNode_Value(this.handle, ' ');
                        nexacro.__setDOMNode_Value(this.handle, val);
                        if (resetpos && pos)
                            this.setElementSetSelect(pos.begin, pos.end);
                        this._processing_oninput = save;
                    }
                }
            }
        });
    }
}
else
{   // Runtime
    if (nexacro.InputElement)
    {
        nexacro._defineImeLocaleEdit("ko", {
            "InputElement": {
                on_sys_compositionstart_process: function ()
                {                    
                    var pos = this.getElementCaretPos();
                    this._composer.setStatus(nexacro._CompositionState.START, pos.begin);

                    return false;   
                },
                on_sys_compositionupdate_process: function ()
                {                       
                    if (this._inputtype == "")
                    {                    
                        return true;
                    }

                    var pos = this.getElementCaretPos();
                    this._composer.setStatus(nexacro._CompositionState.COMPOSING, pos.end);

                    return false;
                },
                on_sys_compositionend_process: function ()
                {
                    if (this._inputtype == "")
                        return true;

                    var pos = this.getElementCaretPos();
                    this._composer.setStatus(nexacro._CompositionState.END, pos.end);
                    var value = this._getInputValue();

                    var text = value;
                    if (this.maxlength > 0 && value && value.length > this.maxlength)
                    {
                        if (this._last_selection_range)
                        {
                            var head_text = text.substr(0, this._last_selection_range[0]);
                            var head_text_len = head_text.length;
                            var rear_text = text.substr(pos.end);
                            var rear_text_len = rear_text.length;
                            var middle_text_len = this.maxlength - (head_text_len + rear_text_len);
                            if (middle_text_len < 0) middle_text_len = 0;
                            var middle_text = text.substr(this._last_selection_range[0], middle_text_len);

                            text = head_text + middle_text + rear_text;
                        }
                        else
                        {
                            text = text.substring(0, this.maxlength);
                        }
                        value = text;
                    }

                    var comp = this.parent.linkedcontrol;
                    if (comp)
                        comp._on_input_compositionend(value);

                    return false;
                }
            }
        });
    }
}

{       
    var regexp_ko = "[\\uac00-\\ud7af\\u3130-\\u318f\\u1100-\\u11ff]";
    nexacro._addImeLocaleInfo("ko", regexp_ko);
}
