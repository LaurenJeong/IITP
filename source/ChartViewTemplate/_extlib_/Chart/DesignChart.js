//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro._ChartBase && !nexacro._ChartBaseloaded)
{
    //==================================================================//
    // BasicChart
    //==================================================================//
    nexacro._ChartBaseloaded = true;
    var _pChartBase = nexacro._ChartBase.prototype;

    _pChartBase.createCssDesignContents = function ()
    {
    };

    _pChartBase.destroyCssDesignContents = function ()
    {
    };

    _pChartBase.afterSetProperty = function ()
    {
		
        this._draw();
    };

    _pChartBase.on_create_contents = function ()
    {
        var control_elem = this.getElement();
        if (control_elem)
        {
            if (!this._cell_elem)
            {
                var cell_elem = this._cell_elem = new nexacro.TextBoxElement(control_elem);
                cell_elem.setElementVerticalAlign("middle");
                cell_elem.setElementTextAlign("center");
                cell_elem.setElementText(this.id);
            }

            if (!this._graphicsControl)
            {
                this._graphicsControl = new nexacro.ChartGraphicsControl("GraphicsControl", 0, 0, control_elem.client_width, control_elem.client_height, null, null, null, null, null, null, this);
            }
            this._graphicsControl.createComponent();
        }
    };

    _pChartBase.on_created_contents = function (win)
    {
        if (this._cell_elem)
            this._cell_elem.create(win);

        // event 버블링 처리
        // 컴포넌트와 컨트롤 사이에서 컴포넌트 개발자가 _setEventHandler를 통해 콜백 핸들러를 등록해 놓게한다.
        this._setEventHandlerToGraphicsControl();
        this._graphicsControl.on_created(win);


        /*var control_elem = this.getElement();
        if (control_elem && !this._landmarktext)
        {
            this._landmarktext = new nexacro.ChartGraphicsText(0, 0);
            this._landmarktext.set_id(this.id + "ChartLandMarkText");
            this._landmarktext.set_text("trial version");
            this._landmarktext.set_font("12pt/normal '맑은 고딕'");
            this._landmarktext.set_color("red");
            this._landmarktext.set_verticalAlign("top");
            this._graphicsControl.addChild(this._landmarktext);
        }*/

        // set color			
        this.on_apply_colorset(this._colorset);
        this.on_apply_contents();
		
        this._draw();
    };

    _pChartBase.on_change_containerRect = function (width, height)
    {
        var control_elem = this.getElement();
        if (control_elem && this._is_created_contents)
        {
            var cell_elem = this._cell_elem;
            if (!this.contents)
            {
                cell_elem.setElementSize(width, height);
                cell_elem.setElementText(this.id);
            }
            else
            {
                cell_elem.setElementText("");
            }

            if (this._graphicsControl)
            {
                this._graphicsControl.resize(control_elem.client_width, control_elem.client_height);
				this._graphicsControl.draw();
                this._changedData = true;
				
                this._draw();
            }
        }
    };

    _pChartBase.set_binddataset = function (str)
    {
        if (str && typeof str != "string")
        {
            this.setBindDataset(str);
            this._draw();
			if(this._binddataset)
            {
				return this._binddataset.id;
			}
			else
			{
				return this.binddataset;
			}
        }
        if (str != this.binddataset || this.binddataset && !this._binddataset)
        {
            if (this._binddataset)
                this._removeDatasetEventHandlers(this._binddataset);

            if (!str)
            {
                this._binddataset = null;
                this.binddataset = "";
            }
            else
            {
                str = str.replace("@", "");
                this._binddataset = this._findDataset(str);
                this.binddataset = str;
            }
            this.on_apply_binddataset();

            if (this._type_name == "BasicChart" || this._type_name == "PieChart" || this._type_name == "RadarChart" 
				|| this._type_name == "GaugeChart" || this._type_name == "FloatChart" || this._type_name == "RoseChart")
            {
                if (this._binddataset && this._binddataset.getColCount() > 0)
                {
                    if (!this._getBindableValue("categorycolumn"))
                        this.set_categorycolumn("bind:" + this._binddataset.getColID(0));
                        //this.categorycolumn._set("bind:" + this._binddataset.getColID(0));
                       // this.categorycolumn._set("bind:");
                }
                else
                {
                    this.categorycolumn._set("");
                }
            }
        }
		if(this.contents != null)
			this._draw();
		else
		{
			this._calcbinddraw = true;
		}
        return this.binddataset;
    };

    _pChartBase.on_apply_contents = function ()
    {
        if (this._control_element)
        {
            var cell_elem = this._cell_elem;
            if (!this.contents)
            {
                cell_elem.setElementText(this.id);
            }
            else
            {
                cell_elem.setElementText("");
            }
            
            // 현재는 연관된 property가 적어서 직접 호출.
            // 연관된 proeprty 갯수가 늘어나게 되면 다른방법으로 처리.
            //if (this._use_makeContentsString && this._use_categorycolumn)
            //{
            //    if (this.contents)
            //    {
            //        var val = (this._binddataset && this._binddataset.getColCount() > 0) ? "bind:" + this._binddataset.getColID(0) : null;
            //        this.set_categorycolumn(val);
            //    }
            //    else
            //    {
            //        this.set_categorycolumn("");
            //        this._use_makeContentsString = false;
            //    }
            //}
            
            this._isApplyContents = true;
            this._destroySubControl();
            this._createSubControl(this.contents);
            this._isApplyContents = false;
        }
    };

    _pChartBase._setContents = function (contents)
    {
		
		
		var redraw = false;
		this.enableredraw = false;
		if(this.contents != null)redraw = true;
        this.contents = contents;
        this.on_apply_contents();
		this._changedData = true;
		this.enableredraw = true;
		
		if(redraw == true)
			this._draw();
		else if(this._calcbinddraw == true)	
		{
			this._calcbinddraw = false;
			this._draw();
		}
        
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.BasicChart)
{
    //==================================================================//
    // BasicChart
    //==================================================================//
    var _pBasicChart = nexacro.BasicChart.prototype;

    _pBasicChart._use_makeContentsString = false;
    _pBasicChart._use_categorycolumn = true;

    _pBasicChart.createCssDesignContents = function ()
    {
    };

    _pBasicChart.destroyCssDesignContents = function ()
    {
    };

    _pBasicChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }
    };

    _pBasicChart.makeContentsString = function ()
    {
        // BasicChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
                //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsHrangebar() + ", \n";
			str_contents += this._getDesignContentsVrangebar() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
            str_contents += this._getDesignContentsCategoryaxis() + ", \n";
            str_contents += this._getDesignContentsSereisset() + ", \n";
            str_contents += this._getDesignContentsValueaxes(1) + "\n";
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pBasicChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Bar Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBasicChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
       // str_contents += "\t\t\"linestyle\": \"0px solid #717a8380\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBasicChart._getDesignContentsHrangebar = function ()
    {
        var str_contents = "\t\"hrangebar\": {\n";
        str_contents += "\t\t\"id\": \"hrangebar\", \n";
        str_contents += "\t\t\"trackbarpadding\": \"1px\", \n";
        str_contents += "\t\t\"background\": \"#eaeaea\", \n";
        str_contents += "\t\t\"linestyle\": \"1px solid #d5d5d5\", \n";
        str_contents += "\t\t\"trackbarlinestyle\": \"0px none\", \n";
        str_contents += "\t\t\"trackbarfillstyle\": \"#c9c9c9\", \n";
        str_contents += "\t\t\"size\": \"12\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	 _pBasicChart._getDesignContentsVrangebar = function ()
    {
        var str_contents = "\t\"vrangebar\": {\n";
        str_contents += "\t\t\"id\": \"vrangebar\", \n";
        str_contents += "\t\t\"trackbarpadding\": \"1px\", \n";
        str_contents += "\t\t\"background\": \"#eaeaea\", \n";
        str_contents += "\t\t\"linestyle\": \"1px solid #d5d5d5\", \n";
        str_contents += "\t\t\"trackbarlinestyle\": \"0px none\", \n";
        str_contents += "\t\t\"trackbarfillstyle\": \"#c9c9c9\", \n";
        str_contents += "\t\t\"size\": \"12\"\n";
        str_contents += "\t}";

        return str_contents;
    };
    _pBasicChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"white\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBasicChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBasicChart._getDesignContentsCategoryaxis = function ()
    {
        var str_contents = "\t\"categoryaxis\": {\n";
        str_contents += "\t\t\"id\": \"categoryaxis\", \n";
        str_contents += "\t\t\"titletext\": \"categoryaxis\", \n";
        str_contents += "\t\t\"titletextcolor\": \"#4c4c4c\", \n";
        str_contents += "\t\t\"titletextfont\": \"bold 12pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"11pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #525252\", \n";
        str_contents += "\t\t\"ticklinestyle\": \"1px solid #525252\", \n";
        str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBasicChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";

            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                var index_cnt = 0;

                for (var i = 1; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };

    _pBasicChart._getDesignContentsValueaxes = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
    };

    _pBasicChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"series\", \n";
        str_contents += "\t\t\"barvisible\": true, \n";
        str_contents += "\t\t\"barsize\": \"65\", \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextcolor\": \"#003860\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 12pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

    _pBasicChart._getDesignContentsAxis = function (index)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"valueaxis\", \n";
        str_contents += "\t\t\"boardlinevisible\": true, \n";
        str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"titletextcolor\": \"#4c4c4c\", \n";
        str_contents += "\t\t\"titletextfont\": \"bold 12pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"ticklinestyle\": \"1px solid #525252\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #525252\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.BubbleChart)
{
    //==================================================================//
    // BubbleChart
    //==================================================================//
    var _pBubbleChart = nexacro.BubbleChart.prototype;

    _pBubbleChart._use_makeContentsString = false;
    _pBubbleChart._use_categorycolumn = false;

    _pBubbleChart.createCssDesignContents = function ()
    {
    };

    _pBubbleChart.destroyCssDesignContents = function ()
    {
    };

    _pBubbleChart.makeContentsString = function ()
    {
        // BubbleChart
        // column 0 : series valuecolumn
        // column 1 : series value2column
        // column 2 ~ n : series value3column
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() <= 2)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsHrangebar() + ", \n";
			str_contents += this._getDesignContentsVrangebar() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
            str_contents += this._getDesignContentsSereisset() + ", \n";
            str_contents += this._getDesignContentsValueaxes(2) + "\n";
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pBubbleChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Bubble Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBubbleChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
       // str_contents += "\t\t\"linestyle\": \"0px solid #717a8380\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBubbleChart._getDesignContentsHrangebar = function ()
    {
        var str_contents = "\t\"hrangebar\": {\n";
        str_contents += "\t\t\"id\": \"hrangebar\", \n";
        str_contents += "\t\t\"trackbarpadding\": \"1px\", \n";
        str_contents += "\t\t\"background\": \"#eaeaea\", \n";
        str_contents += "\t\t\"linestyle\": \"1px solid #d5d5d5\", \n";
        str_contents += "\t\t\"trackbarlinestyle\": \"0px none\", \n";
        str_contents += "\t\t\"trackbarfillstyle\": \"#c9c9c9\", \n";
        str_contents += "\t\t\"size\": \"12\", \n";
        str_contents += "\t\t\"visible\": \"true\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	_pBubbleChart._getDesignContentsVrangebar = function ()
    {
        var str_contents = "\t\"vrangebar\": {\n";
        str_contents += "\t\t\"id\": \"vrangebar\", \n";
        str_contents += "\t\t\"trackbarpadding\": \"1px\", \n";
        str_contents += "\t\t\"background\": \"#eaeaea\", \n";
        str_contents += "\t\t\"linestyle\": \"1px solid #d5d5d5\", \n";
        str_contents += "\t\t\"trackbarlinestyle\": \"0px none\", \n";
        str_contents += "\t\t\"trackbarfillstyle\": \"#c9c9c9\", \n";
        str_contents += "\t\t\"size\": \"12\", \n";
        str_contents += "\t\t\"visible\": \"true\"\n";
        str_contents += "\t}";

        return str_contents;
    };
    _pBubbleChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"white\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBubbleChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pBubbleChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";
            var col_cnt = ds.getColCount();
            if (col_cnt > 2)
            {
                var index_cnt = 0;
                var valuecolumn_id = ds.getColID(0);
                var value2column_id = ds.getColID(1);
                for (var i = 2; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, valuecolumn_id, value2column_id, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };

    _pBubbleChart._getDesignContentsValueaxes = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
    };

    _pBubbleChart._getDesignContentsSereis = function (index, valuecolumn_id, value2column_id, value3column_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"itemtextvisible\": \"true\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\", \n";
        str_contents += "\t\t\"value2column\": \"bind:" + value2column_id + "\", \n";
        str_contents += "\t\t\"value3column\": \"bind:" + value3column_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

    _pBubbleChart._getDesignContentsAxis = function (index)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"valueaxis\", \n";
        str_contents += "\t\t\"boardlinevisible\": \"true\", \n";
        str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"titletextcolor\": \"#4c4c4c\", \n";
        str_contents += "\t\t\"titletextfont\": \"bold 12pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"ticklinestyle\": \"1px solid #525252\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #525252\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.PieChart)
{
    //==================================================================//
    // PieChart
    //==================================================================//
    var _pPieChart = nexacro.PieChart.prototype;

    _pPieChart._use_makeContentsString = false;
    _pPieChart._use_categorycolumn = true;

    _pPieChart.createCssDesignContents = function ()
    {
    };

    _pPieChart.destroyCssDesignContents = function ()
    {
    };

    _pPieChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pPieChart.makeContentsString = function ()
    {
        // PieChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn only one (column 1)
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pPieChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Pie Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPieChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPieChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPieChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
       // str_contents += "\t\t\"linestyle\": \"0px solid #717a8380\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPieChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";
            var max_series = 1;
            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                str_contents += this._getDesignContentsSereis(0, ds.getColID(1)) + "\n";
            }

            str_contents += "\t]";

            return str_contents;
        }
    };

    _pPieChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"radius\": 150, \n";
        str_contents += "\t\t\"innerradius\": 70, \n";
        str_contents += "\t\t\"linestyle\": \"2px solid #ffffff\", \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.GaugeChart)
{
    //==================================================================//
    // GaugeChart
    //==================================================================//
    var _pGaugeChart = nexacro.GaugeChart.prototype;

    _pGaugeChart._use_makeContentsString = false;
    _pGaugeChart._use_categorycolumn = true;

    _pGaugeChart.createCssDesignContents = function ()
    {
    };

    _pGaugeChart.destroyCssDesignContents = function ()
    {
    };

    _pGaugeChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pGaugeChart.makeContentsString = function ()
    {
        // GaugeChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn only one (column 1)
		// Gauge chart는 categoryaxis,valueaxis 각각 1개씩만 존재한다.
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
			str_contents += this._getDesignContentsIndicator() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
			str_contents += this._getDesignContentsValueaxis(1) + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pGaugeChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Gauge Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pGaugeChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pGaugeChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pGaugeChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	_pGaugeChart._getDesignContentsIndicator = function ()
    {
        var str_contents = "\t\"indicator\": {\n";
        str_contents += "\t\t\"id\": \"indicator\", \n";
        str_contents += "\t\t\"visible\": \"true\", \n";
        str_contents += "\t\t\"image\": \"\", \n";
		str_contents += "\t\t\"size\": \"\", \n";
		str_contents += "\t\t\"indent\": \"\", \n";
		str_contents += "\t\t\"fillstyle\": \"#4b4b4b\", \n";
		str_contents += "\t\t\"linestyle\": \"0px none\", \n";
		str_contents += "\t\t\"opacity\": \"1\"\n";
        str_contents += "\t}";

        return str_contents;
    };
    _pGaugeChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";

            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                var index_cnt = 0;

                for (var i = 1; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };
	
	_pGaugeChart._getDesignContentsValueaxis = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
    };
	_pGaugeChart._getDesignContentsAxis = function (index)
	{
		var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\" \n";
		str_contents += "\t  }";

        return str_contents;
	};
    _pGaugeChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"series\", \n";
        str_contents += "\t\t\"itemtextvisible\": \"true\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#003860\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 12pt \'맑은 고딕\'\", \n";
        //str_contents += "\t\t\"radius\": \"80\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.RadarChart)
{
    //==================================================================//
    // RadarChart
    //==================================================================//
    var _pRadarChart = nexacro.RadarChart.prototype;

    _pRadarChart._use_makeContentsString = false;
    _pRadarChart._use_categorycolumn = true;

    _pRadarChart.createCssDesignContents = function ()
    {
    };

    _pRadarChart.destroyCssDesignContents = function ()
    {
    };

    _pRadarChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pRadarChart.makeContentsString = function ()
    {
        // RadarChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn
		// radar chart는 categoryaxis,valueaxis 각각 1개씩만 존재한다.
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
			str_contents += this._getDesignContentsCategoryaxis() + ", \n";
			str_contents += this._getDesignContentsValueaxis(1) + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pRadarChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Radar Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRadarChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";

            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                var index_cnt = 0;

                for (var i = 1; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };
	 _pRadarChart._getDesignContentsCategoryaxis = function ()
    {
        var str_contents = "\t\"categoryaxis\": {\n";
        str_contents += "\t\t\"id\": \"categoryaxis\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	_pRadarChart._getDesignContentsValueaxis = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
    };
	_pRadarChart._getDesignContentsAxis = function (index)
	{
		var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t  }";

        return str_contents;
	};
    _pRadarChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"series\", \n";
        str_contents += "\t\t\"linevisible\": true, \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextcolor\": \"#003860\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 6pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.RoseChart)
{
    //==================================================================//
    // RoseChart
    //==================================================================//
    var _pRoseChart = nexacro.RoseChart.prototype;

    _pRoseChart._use_makeContentsString = false;
    _pRoseChart._use_categorycolumn = true;

    _pRoseChart.createCssDesignContents = function ()
    {
    };

    _pRoseChart.destroyCssDesignContents = function ()
    {
    };

    _pRoseChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pRoseChart.makeContentsString = function ()
    {
        // RoseChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn
		// Rose chart는 categoryaxis,valueaxis 각각 1개씩만 존재한다.
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
			str_contents += this._getDesignContentsCategoryaxis() + ", \n";
			str_contents += this._getDesignContentsValueaxis(1) + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pRoseChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Rose Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRoseChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRoseChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRoseChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pRoseChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";

            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                var index_cnt = 0;

                for (var i = 1; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };
	 _pRoseChart._getDesignContentsCategoryaxis = function ()
    {
        var str_contents = "\t\"categoryaxis\": {\n";
        str_contents += "\t\t\"id\": \"categoryaxis\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	_pRoseChart._getDesignContentsValueaxis = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
    };
	_pRoseChart._getDesignContentsAxis = function (index)
	{
		var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t  }";

        return str_contents;
	};
    _pRoseChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"series\", \n";
        str_contents += "\t\t\"linevisible\": true, \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextcolor\": \"#003860\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 6pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.FloatChart)
{
    //==================================================================//
    // FloatChart
    //==================================================================//
    var _pFloatChart = nexacro.FloatChart.prototype;

    _pFloatChart._use_makeContentsString = false;
    _pFloatChart._use_categorycolumn = true;

    _pFloatChart.createCssDesignContents = function ()
    {
    };

    _pFloatChart.destroyCssDesignContents = function ()
    {
    };

    _pFloatChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pFloatChart.makeContentsString = function ()
    {
        // FloatChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn
		// Float chart는 categoryaxis,valueaxis 각각 1개씩만 존재한다.
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
			str_contents += this._getDesignContentsCategoryaxis() + ", \n";
			str_contents += this._getDesignContentsValueaxis(1) + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pFloatChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Float Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pFloatChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pFloatChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pFloatChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pFloatChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";

            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                var index_cnt = 0;

                for (var i = 1; i < col_cnt; i++)
                {
                    str_contents += this._getDesignContentsSereis(index_cnt, ds.getColID(i));
                    index_cnt++;

                    if (i == (col_cnt - 1))
                        str_contents += "\n";
                    else
                        str_contents += ", \n";
                }
            }

            str_contents += "\t]";

            return str_contents;
        }
    };
	 _pFloatChart._getDesignContentsCategoryaxis = function ()
    {
        var str_contents = "\t\"categoryaxis\": {\n";
        str_contents += "\t\t\"id\": \"categoryaxis\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t}";

        return str_contents;
    };
	_pFloatChart._getDesignContentsValueaxis = function (min_axis)
    {
        var str_contents = "\t\"valueaxes\": [\n";
        for (var i = 0; i < min_axis; i++)
        {
            str_contents += this._getDesignContentsAxis(i);

            if (i == (min_axis - 1))
                str_contents += "\n";
            else
                str_contents += ", \n";
        }
        str_contents += "\t]";

        return str_contents;
    };
	_pFloatChart._getDesignContentsAxis = function (index)
	{
		var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"valueaxis" + index + "\", \n";
        str_contents += "\t\t\"labeltextcolor\": \"#6f6f6f\", \n";
        str_contents += "\t\t\"labeltextfont\": \"10pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"axislinestyle\": \"1px solid #d0d0d0\", \n";
		str_contents += "\t\t\"boardlinestyle\": \"1px solid #d0d0d0\"\n";
        str_contents += "\t  }";

        return str_contents;
	};
    _pFloatChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"titletext\": \"series\", \n";
        str_contents += "\t\t\"linevisible\": true, \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextcolor\": \"#003860\", \n";
        str_contents += "\t\t\"itemtextfont\": \"bold 6pt \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacrochart-public-license-readme-1.0.html
//
//==============================================================================
if (nexacro.PyramidChart)
{
    //==================================================================//
    // PyramidChart
    //==================================================================//
    var _pPyramidChart = nexacro.PyramidChart.prototype;

    _pPyramidChart._use_makeContentsString = false;
    _pPyramidChart._use_categorycolumn = true;

    _pPyramidChart.createCssDesignContents = function ()
    {
    };

    _pPyramidChart.destroyCssDesignContents = function ()
    {
    };

    _pPyramidChart.set_categorycolumn = function (v)
    {
        if (v === undefined || v === null)
            v = "";

        if (this.categorycolumn._value != v)
        {
            this.categorycolumn._set(v);
            this.on_apply_categorycolumn();
        }

        this._draw();
    };

    _pPyramidChart.makeContentsString = function ()
    {
        // PyramidChart
        // column 0 : chart categorycolumn
        // column 1 ~ n : series valuecolumn only one (column 1)
        var ds = this._binddataset;
        if (ds && ds.getColCount() > 0)
        {
            //if (ds.getColCount() == 1)
            //nexacro.__onNexacroStudioError("not enough Dataset Columns.");

            var str_contents = "{\n";
            str_contents += this._getDesignContentsTitle() + ", \n";
            str_contents += this._getDesignContentsLegend() + ", \n";
            str_contents += this._getDesignContentsTooltip() + ", \n";
            str_contents += this._getDesignContentsBoard() + ", \n";
            str_contents += this._getDesignContentsSereisset() + "\n"
            str_contents += "}";

            return "<Contents><![CDATA[" + str_contents + "]]></Contents>";
        }

        return "";
    };

    _pPyramidChart._getDesignContentsTitle = function ()
    {
        var str_contents = "\t\"title\": {\n";
        str_contents += "\t\t\"id\": \"title\", \n";
        str_contents += "\t\t\"text\": \"Pyramid Chart\", \n";
        str_contents += "\t\t\"textfont\": \"20pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"0px 0px 5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPyramidChart._getDesignContentsBoard = function ()
    {
        var str_contents = "\t\"board\": {\n";
        str_contents += "\t\t\"id\": \"board\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPyramidChart._getDesignContentsTooltip = function ()
    {
        var str_contents = "\t\"tooltip\": {\n";
        str_contents += "\t\t\"id\": \"tooltip\", \n";
        str_contents += "\t\t\"background\": \"#4b4b4b\", \n";
        str_contents += "\t\t\"linestyle\": \"0px none\", \n";
        str_contents += "\t\t\"textcolor\": \"#ffffff\", \n";
        str_contents += "\t\t\"textfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"padding\": \"5px\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPyramidChart._getDesignContentsLegend = function ()
    {
        var str_contents = "\t\"legend\": {\n";
        str_contents += "\t\t\"id\": \"legend\", \n";
       // str_contents += "\t\t\"linestyle\": \"0px solid #717a8380\", \n";
        str_contents += "\t\t\"padding\": \"3px 10px 3px 10px\", \n";
        str_contents += "\t\t\"itemtextfont\": \"9pt \'맑은 고딕\'\", \n";
		str_contents += "\t\t\"visible\": \"false\", \n";
        str_contents += "\t\t\"itemtextcolor\": \"#4c4c4c\"\n";
        str_contents += "\t}";

        return str_contents;
    };

    _pPyramidChart._getDesignContentsSereisset = function ()
    {
        var ds = this._binddataset;
        if (ds)
        {
            var str_contents = "\t\"seriesset\": [\n";
            var max_series = 1;
            var col_cnt = ds.getColCount();
            if (col_cnt > 1)
            {
                str_contents += this._getDesignContentsSereis(0, ds.getColID(1)) + "\n";
            }

            str_contents += "\t]";

            return str_contents;
        }
    };

    _pPyramidChart._getDesignContentsSereis = function (index, valuecolumn_id)
    {
        var str_contents = "\t  {\n";
        str_contents += "\t\t\"id\": \"series" + index + "\", \n";
        str_contents += "\t\t\"margintopdown\": 10, \n";
        str_contents += "\t\t\"marginleftright\": 10, \n";
		str_contents += "\t\t\"graphratio\": 60, \n";
        str_contents += "\t\t\"linestyle\": \"2px solid #ffffff\", \n";
        str_contents += "\t\t\"itemtextvisible\": true, \n";
        str_contents += "\t\t\"itemtextfont\": \"10pt/normal \'맑은 고딕\'\", \n";
        str_contents += "\t\t\"valuecolumn\": \"bind:" + valuecolumn_id + "\"\n";
        str_contents += "\t  }";

        return str_contents;
    };

}
