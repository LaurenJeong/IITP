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

if(!nexacro.AbstractComponent)
{
    //==============================================================================
    // nexacro.AbstractComponent
    //==============================================================================

    nexacro.AbstractComponent = function (id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent)
    {
        nexacro.Component.call(this, id, left, top, width, height, right, bottom, minwidth, maxwidth, minheight, maxheight, parent);
        
        this._is_abstract = true;
    };

    var _pAbstractComponent = nexacro._createPrototype(nexacro.Component, nexacro.AbstractComponent);
    nexacro.AbstractComponent.prototype = _pAbstractComponent;
    _pAbstractComponent._type_name = "AbstractComponent";

    /* control */

    /* default properties */    

    /* internal variable */
    // _pAbstractComponent._is_visible = false;
    _pAbstractComponent._real_visible = false;

    /* status */

    /* accessibility */
    // _pAbstractComponent.accessibilityrole = "form";

    /*
    _pAbstractComponent._event_list = {
        "onclick": 1, "ondblclick": 1, "onkillfocus": 1, "onsetfocus": 1,
        "oninput": 1, "onkeydown": 1, "onkeyup": 1,
        "onlbuttondown": 1, "onlbuttonup": 1, "onrbuttondown": 1, "onrbuttonup": 1,
        "onmousedown": 1, "onmouseup": 1,
        "onmouseenter": 1, "onmouseleave": 1, "onmousemove": 1, "onmousewheel": 1,
        "ondrag": 1, "ondragenter": 1, "ondragleave": 1, "ondragmove": 1, "ondrop": 1,
        "onmove": 1, "onsize": 1, "oncontextmenu": 1,
        "ontouchstart": 1, "ontouchmove": 1, "ontouchend": 1, "ondevicebuttonup": 1
    };
    */
    //===============================================================
    // nexacro.AbstractComponent : Create & Destroy & Update
    //===============================================================

    
    //===============================================================
    // nexacro.AbstractComponent : Override
    //===============================================================

    
    //===============================================================
    // nexacro.AbstractComponent : Properties
    //===============================================================
    
    
    //===============================================================
    // nexacro.AbstractComponent : Methods
    //===============================================================

    
    //===============================================================
    // nexacro.AbstractComponent : Events
    //===============================================================
}

