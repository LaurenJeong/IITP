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
if (nexacro.Button)
{
    var _pButton = nexacro.Button.prototype;

    //==============================================================================
    // nexacro.Button
    //==============================================================================


    //===============================================================
    // nexacro.Button : Create & Destroy & Update
    //===============================================================


    //===============================================================
    // nexacro.Button : Override
    //===============================================================


    //===============================================================
    // nexacro.Button : Properties
    //===============================================================


    //===============================================================
    // nexacro.Button : Methods
    //===============================================================


    //===============================================================
    // nexacro.Button : Events
    //===============================================================


    //===============================================================
    // nexacro.Button : Logical part
    //===============================================================
    _pButton.createCssDesignContents = function ()
    {
        this.set_text("Button");
    };

    delete _pButton;
}