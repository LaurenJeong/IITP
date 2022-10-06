//XJS=chart.xjs
(function()
{
	this.ENUM_INPUT = "input";

	//----------------------------- 차트 디자인관련 상수 설정부 START ---------------------------------
	// 차트색상 - Category10
	this.arrBaseChartColor = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];

	// 컬러 Array [참고] https://observablehq.com/@d3/color-schemes#Category10
	this.arrColorCategory10	= ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];
	this.arrColorTableau10	= ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"];
	this.arrColorAccent		= ["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"];
	this.arrColorDark2		= ["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"];
	this.arrColorPaired		= ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"];
	this.arrColorPastel1	= ["#fbb4ae","#b3cde3","#ccebc5","#decbe4","#fed9a6","#ffffcc","#e5d8bd","#fddaec","#f2f2f2"];
	this.arrColorPastel2	= ["#b3e2cd","#fdcdac","#cbd5e8","#f4cae4","#e6f5c9","#fff2ae","#f1e2cc","#cccccc"];
	this.arrColorSet1		= ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#ffff33","#a65628","#f781bf","#999999"];
	this.arrColorSet2		= ["#66c2a5","#fc8d62","#8da0cb","#e78ac3","#a6d854","#ffd92f","#e5c494","#b3b3b3"];
	this.arrColorSet3		= ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"];

	// 차트 기본속성
	oBaseChartAttr =	{
								"id" : "chart", "left" : 0,  "top" : 0, "right" : 0, "bottom" : 0
								, "legendspacing"	: "10px"
								, "binddataset" : "viewdataset"
								//, "binddataset" 	: "dsData"
							};

	// 타이틀 기본속성
	this.oBaseTitle = 		{
								  "id"					: "title"
								, "textfont"			: "normal 700 17px/normal 'Arial,Malgun Gothic,Gulim'"
								, "padding"				: "0px 0px 5px"
								, "subtextcolor"		: "gray"
								, "subtextfont"			: "italic 8/normal 'Arial'"
								, "visible"				: false
							};

	// 툴팁 기본속성
	this.oBaseTooltip =		{
								  "id"					: "tooltip"
								, "background"			: "#4b4b4b"
								, "linestyle"			: "0px none"
								, "textcolor"			: "white"
								, "textfont"			: "10pt/normal '맑은 고딕'"
								, "padding"				: "5px"
							};

	// 배경 기본속성
	this.oBaseBoard =		{
								  "id"					: "board"
							};

	// 범례 기본속성
	this.oBaseLegend = 		{
								  "id" 					: "legend"
								, "padding" 			: "3px 10px 3px 10px"
								, "itemtextfont" 		: "9pt '맑은 고딕'"
								, "itemtextcolor" 		: "#4c4c4c"
								, "itemautofit" 		: "true"
								, "markertextgap" 		: "5"
								, "markertype" 			: "circle"
								, "verticalitemgap" 	: "5"
								, "linestyle" 			: "0px none"
								, "visible"				: false
							};

	// 카테고리축(x축) 기본속성
	this.oBaseCategoryaxis =	{
								  "id" 					: "categoryaxis"
								, "titletextcolor"		: "#4c4c4c"
								, "titletextfont"		: "bold 8pt '맑은 고딕'"
								, "titletextalign"		: "high"
								, "titlegap"			: "5"
								, "labeltextcolor"		: "#6f6f6f"
								, "labeltextfont"		: "9pt '맑은 고딕'"
								, "axislinestyle"		: "1px solid #525252"
								, "ticklinestyle"		: "1px solid #525252"
								, "boardlinestyle"		: "1px solid #d0d0d0"
								, "ticksize"			: "5"
								, "labelgap"			: "5"
							};

	// 데이터축(y축) 기본속성
	this.oBaseValueaxis =	{
								  "id" 					: "valueaxis"
								, "boardlinevisible"	: true
								, "boardlinestyle" 		: "1px solid #d0d0d0"
								, "labeltextcolor" 		: "#6f6f6f"
								, "labeltextfont" 		: "9pt/normal '맑은 고딕'"
								, "titletextcolor" 		: "#4c4c4c"
								, "titletextfont" 		: "bold 8pt '맑은 고딕'"
								, "titlerotate"			: "0"
								, "titletextalign"		: "high"
								, "titlegap"			: "5"
								, "ticklinestyle" 		: "1px solid #525252"
								, "axislinestyle" 		: "1px solid #525252"
								, "labelgap" 			: "5"
								, "ticksize" 			: "5"
								, "autotickscale"		: "10"
							};

	// 데이터축(y2축) 기본속성
	this.oBaseValueaxis2 =	{
								  "id" 					: "valueaxisy2"
								, "boardlinevisible"	: false							// 라인표시안함.
								, "opposite"			: true							// 오른쪽 표시
								, "boardlinestyle" 		: "1px solid #d0d0d0"
								, "labeltextcolor" 		: "#6f6f6f"
								, "labeltextfont" 		: "9pt/normal '맑은 고딕'"
								, "titletextcolor" 		: "#4c4c4c"
								, "titletextfont" 		: "bold 8pt '맑은 고딕'"
								, "titlerotate"			: "0"
								, "titletextalign"		: "high"
								, "titlegap"			: "5"
								, "ticklinestyle" 		: "1px solid #525252"
								, "axislinestyle" 		: "1px solid #525252"
								, "labelgap" 			: "5"
								, "ticksize" 			: "5"
								, "autotickscale"		: "10"
							};

	// [TimeLineChart] 데이터축 기본속성
	this.oBaseValueaxisTime =	{
								  "id"					: "valueaxistime"
								, "labeltextcolor"		: "#6f6f6f"
								, "labeltextfont"		: "10pt '맑은 고딕'"
								, "axislinestyle"		: "1px solid #d0d0d0"
								, "boardlinestyle"		: "1px solid #d0d0d0"
								, "opposite"			: "true"
								, "labeltype"			: "normal"
								, "boardlinevisible"	: "true"
								//, "tickinterval"		: ""
							};

	// [BarChart] 막대그래프 시리즈 기본속성
	this.oBaseSeriesBar =	{
								  "barvisible" 			: true
								, "barsize" 			: "75"
								, "barlinestyle"		: "1px solid"
								, "itemtextcolor"		: "#4c4c4c"
								, "itemtextfont"		: "normal 10/normal '맑은 고딕'"
								, "baritemtextgap"		: 5
							};

	// [LineChart] 선그래프 시리즈 기본속성
	this.oBaseSeriesLine =	{
								  "barvisible" 			: false
								, "linevisible" 		: true
								, "pointsize"			: "7"
								, "pointlinestyle"		: "0px solid"
								, "itemtextcolor"		: "#4c4c4c"
								, "itemtextfont"		: "normal 10/normal '맑은 고딕'"
								, "lineitemtextgap"		: 5
								, "pointitemtextgap"	: 5
							};

	// [AreaChart] 영역그래프 시리즈 기본속성
	this.oBaseSeriesArea =	{
								  "barvisible" 			: false
								, "linevisible" 		: true
								, "lineareavisible"		: true
								, "pointlinestyle"		: "0px solid"
								, "lineareaopacity"		: "0.5"
								, "itemtextcolor"		: "#4c4c4c"
								, "itemtextfont"		: "normal 10/normal '맑은 고딕'"
								, "lineitemtextgap"		: 5
							};

	// [PieChart] 원그래프 시리즈 기본속성
	this.oBaseSeriesPie =	{
								  "radius" 					: "70"
								, "opacity" 				: "0.8"
								, "linestyle" 				: "1px solid #ffffff"
								, "itemtextvisible" 		: true
								, "itemtextfont"			: "normal 12/normal '맑은 고딕'"
								, "itemtextguidelinestyle"	: "1px solid darkgray"
								, "itemtextguideopacity" 	: "1"
								, "itemtextguidesize" 		: "20"
								, "selectindent" 			: "20"
								, "highlightvisible"		: true
								, "highlightradius"			: "70"
								, "highlightopacity"		: "0.3"
								, "highlightfillstyle"		: "#ffffff"
								, "highlightlinestyle"		: "1px solid #ffffff"
							};

	// [PyramidChart] 피라미드그래프 시리즈 기본속성
	this.oBaseSeriesPyramid =	{
								  "margintopdown"		: 10
								, "linestyle"			: "2px solid #ffffff"
								, "itemtextfont"		: "10pt/normal '맑은 고딕'"
								, "graphhalign"			: "center"
								, "itemtextguidesize"	: "30"
								, "autogradation"		: "none"
								, "marginleftright"		: "30"
							};

	// [BubbleChart] 버블차트 시리즈 기본속성
	this.oBaseSeriesBubble =	{
								  "itemtextfont"		: "bold 8pt '맑은 고딕'"
							};

	// [RadarChart] 레이더차트 시리즈 기본속성
	this.oBaseSeriesRadar =	{
								  "linevisible"			: true
								, "itemtextfont"		: "8pt '맑은 고딕'"
								, "lineareaopacity"		: "0.5"
								, "pointsize"			: "7"
							};

	// [RoseChart] 장미도표 시리즈 기본속성
	this.oBaseSeriesRose =	{
								  "linevisible"			: true
								, "itemtextfont"		: "8pt '맑은 고딕'"
							};

	// [GaugeChart] 게이지차트 게이지선 기본속성
	this.oBaseIndicator =	{
								  "id"					: "indicator"
								, "visible"				: "true"
								, "indicatorimage"		: ""
								, "indicatorsize"		: ""
								, "indicatorindent"		: ""
								, "indicatorfillstyle"	: "white"
								, "indicatorlinestyle"	: "1px solid black"
								, "indicatoropacity"	: "1"
								, "linestyle"			: "1px solid black"
								, "fillstyle"			: "white"
								, "opacity"				: "1"
							};

	// [GaugeChart] 게이지차트 시리즈 기본속성
	this.oBaseSeriesGauge =	{
								  "id"					: "series"
								, "itemtextfont"		: "bold 12pt '맑은 고딕'"
								, "radius"				: "100"
								, "userrangeradius"		: "100"
								, "opacity"				: "0.5"
								, "barsize"				: "100"
								, "baropacity"			: "1"
							};

	// [BarGaugeChart] 막대게이지차트 시리즈 기본속성
	this.oBaseSeriesBarGauge =	{
								  "id"					: "series"
								, "itemtextcolor"		: "#ffffff"
								, "itemtextfont"		: "bold 20pt '맑은 고딕'"
								, "opacity"				: "0.5"
								, "barsize"				: "80"
								, "baropacity"			: "1"
							};

	// [FloatChart] 플로트차트 시리즈 기본속성
	this.oBaseSeriesFloat =	{
								  "id"						: "series"
								, "barvisible" 				: true
								, "linevisible" 			: false
								, "barsize" 				: "50"
								, "itemtextfont" 			: "bold 10pt '맑은 고딕'"
								, "baropacity" 				: "0.8"
								, "positivebarlinestyle"	: "0px solid"
								, "negativebarlinestyle"	: "0px solid"
						};

	// [WaterfallChart] 폭포차트 시리즈 기본속성
	this.oBaseSeriesWaterfall =	{
								  "id"							: "series"
								, "barvisible" 					: true
								, "linevisible" 				: false
								, "barsize" 					: "50"
								, "itemtextfont" 				: "bold 10pt '맑은 고딕'"
								, "baropacity" 					: "0.8"
								, "positivebarlinestyle"		: "0px solid"
								, "negativebarlinestyle"		: "0px solid"
								, "waterfallsumbarlinestyle"	: "0px solid"
						};

	// [TimeLineChart] 타임라인차트 시리즈 기본속성
	this.oBaseSeriesTimeLine =	{
								  "id"						: "series"
								, "barvisible" 				: true
								, "linevisible" 			: false
								, "barsize" 				: "50"
								, "itemtextcolor" 			: "#ffffff"
								, "itemtextfont" 			: "bold 10pt '맑은 고딕'"
								, "baropacity" 				: "0.8"
								, "positivebarlinestyle"	: "0px solid"
								, "negativebarlinestyle"	: "1px solid #ffffff"				// %색상과 구분을 위해 line값 설정
						};
	//----------------------------- 차트 디자인관련 상수 설정부 END -----------------------------------

	/**
	 * @class 색상배열에서 Index에 해당하는 Chart 색상을 반환한다.
	 * @param {number} nIdx - 색상 Index
	 * @param {array} arrColor - 16진 색상코드 배열
	 * @return {string} 16진 색상코드
	 * @example
	 * var sColor = lfn_GetChartColor(0);	// "#1f77b4" <br>
	 * var sColor2 = lfn_GetChartColor(0,this.arrColorTableau10);	// "#4e79a7"
	 */
	lfn_GetChartColor = function(nIdx,arrColor)
	{
		if (lfn_IsNull(arrColor))		arrColor = this.arrBaseChartColor;

		var nArrIdx = nIdx % arrColor.length;
		return arrColor[nArrIdx];
	};

	/**
	 * @class 데이터 타입에 따른 Mask값 반환.
	 * @param {string} sDataType - 데이터타입
	 * @return {array} 데이터 타입에 따른 Mask값
	 * @example
	 * var sMask = lfn_GetDataTypeMask("INT");	// ["","number","number"]
	 */
	lfn_GetDataTypeMask= function(sDataType, sChartType)
	{
		if (lfn_IsNull(sChartType))		sChartType = "";

		var sCheckDataType = lfn_IsNullEmpty(sDataType).toUpperCase();
		var sMask = "";
		var sMaskType = "normal";
		var sDataGroup = "";

		switch(sCheckDataType) {
			case "INT":
			case "FLOAT":
			case "BIGDECIMAL":
				sMask		= "";
				sMaskType	= "number";
				sDataGroup 	= "number";
				break;
			case "DATE":
				if (sChartType == "timeline") {
					sMask		= "yyyy-MM-dd";
				} else {
					sMask		= "@@@@-@@-@@";
				}
				sDataGroup 	= "date";
				break;
			case "TIME":
				if (sChartType == "timeline") {
					sMask		= "hh";
				} else {
					sMask		= "@@:@@";
				}
				sDataGroup 	= "date";
				break;
			case "DATETIME":
				if (sChartType == "timeline") {
					sMask		= "yyyy-MM-dd hh:mm";
				} else {
					sMask		= "@@@@-@@-@@ @@:@@";
				}
				sDataGroup 	= "date";
				break;
			case "STRING":
				sMask		= "";
				sMaskType	= "normal";
				sDataGroup 	= "string";
			default:
		}

		return [sMask, sMaskType, sDataGroup];
	};

	/**
	 * @class Preview용 데이터 반환
	 * @param {object} oFieldArray - Field JSON Array
	 * @param {number} nRowIndex - Dataset Row Index
	 * @return {object} Row Data JSON Array
	 */
	lfn_GetPreviewData= function(oFieldArray, nRowCount)
	{
		var oRows = [];
		var oRow = {};

		var oField;
		var sFieldId;
		var sDataType;
		var sValue;

		//컬럼 개수
		var nColCnt = oFieldArray.fieldcount;

		for(i=0;i<nRowCount;i++)
		{
			oRow = {};

			// 필드별로 데이터 생성
			for(j=0;j<nColCnt;j++)
			{
				oField = oFieldArray.fields[j];

				sFieldId = oField.id;
				sDataType = lfn_IsNullEmpty(oField.datatype).toUpperCase();

				// 데이터 형식에 따라 데이터 기본값제공
				switch(sDataType) {
					case "INT":
					case "FLOAT":
					case "BIGDECIMAL":
						sValue = Math.floor(Math.random()*100);						// 0~100
						break;
					case "DATE":
						sValue = lfn_AddDate(lfn_GetDate(),i);	// 오늘날짜 + nRowIndex
						break;
					default:
						sValue = String.fromCharCode((65 + i));				// A~Z + nRowIndex
						break;
				}

				oRow[sFieldId] = sValue;
			}

			oRows.push(oRow);
		}

		return oRows;
	};
}
());
