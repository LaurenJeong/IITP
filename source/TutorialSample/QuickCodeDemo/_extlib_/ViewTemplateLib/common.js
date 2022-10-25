//XJS=common.xjs
(function()
{
	/******************************************************************************
	*  ViewTemplate
	*  @FileName 	common.js
	*  @Creator
	*  @CreateDate
	*  @Desction    ViewTemplate관련 공통 함수
	*******************************************************************************/
	//--------------------------------------------------------------------------------------------------------
	// ViewTemplate 공통변수
	//--------------------------------------------------------------------------------------------------------
	// View에서 생성한 컴포넌트의 Field ID
	this.VIEW_COMP_FIELD_ID = "_viewcomp";
	//--------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------------------------------
	// 프로젝트 공통 변수
	//--------------------------------------------------------------------------------------------------------
	// 네이밍 컨벤션 종류 (C : camelCase, S : snakeCase, LS : lower snakeCase, 빈값 : 지정안함.)
	this.COMP_NAMING_RULE	= "C";

	/** @const {string} */
	// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	this.LOG_LEVEL			= -1;
	//--------------------------------------------------------------------------------------------------------

	//--------------------------------------------------------------------------------------------------------
	// View 여백관련 상수
	//--------------------------------------------------------------------------------------------------------		
	this.oAttrViewPadding =	{
								"id": "viewpadding",
								"edittype": "String",
								"defaultvalue": lfn_Nvl(this.VIEW_PADDING, ""),
								"description": "View 여백 설정(px)"
												+ "\n" + "(숫자만 입력 가능하며, 빈칸으로 구분하여 설정가능합니다.)"
												+ "\n" + "1회 입력 : [1번째값] top/right/bottom/left 에 모두 적용"
												+ "\n" + "2회 입력 : [1번째값] top/bottom, [2번째값] right/left 에 적용"
												+ "\n" + "3회 입력 : [1번째값] top, [2번째값] right/left, [3번째값] bottom 에 적용"
												+ "\n" + "4회 입력 : [1번째값] top, [2번째값] right, [3번째값] bottom, [4번째값] left 에 적용"
							};
	//--------------------------------------------------------------------------------------------------------
	// 타이틀 객체 관련 상수(ExpandButton + Title + TotalCount)
	//--------------------------------------------------------------------------------------------------------	
	// Title 영역 Div ID
	this.DIV_TITLE_ID						= "divTitle";
	// Title 영역 Height
	this.TITLE_AREA_HEIGHT					= 30;
	// Title 영역 컴포넌트 Gap
	this.TITLE_AREA_COMP_SPACE				= 5;

	// Title ID
	this.TITLE_ID							= "staTitle";
	// Title 높이
	this.TITLE_HEIGHT						= 30;
	// Title Text (ViewTemplate에서 this.TITLE_TEXT 설정하지 않을때 기본값)
	this.TITLE_TEXT_BASE					= "";
	// Title fittocontents
	this.TITLE_FITTOCONTENTS 				= "width";
	// Title Default CSS Class
	this.TITLE_CSSCLASS						= "sta_subtitle";
	// Title Default CSS Class
	this.TITLE_NOICON_CSSCLASS				= "sta_subtitle_noicon";

	// TotalCount 객체 사용여부 (ViewTemplate에서 this.USE_TOT_COUNT 설정하지 않을때 기본값)
	this.USE_TOT_COUNT_BASE					= "false";
	// TotalCount ID
	this.TOT_COUNT_ID						= "staTotCnt";
	// TotalCount 높이
	this.TOT_COUNT_HEIGHT					= 30;
	// TotalCount 기본Text
	this.TOT_COUNT_TEXT						= "(총 <b v='true'><fc v='#da291c'>0</fc></b>건)";
	// TotalCount fittocontents
	this.TOT_COUNT_FITTOCONTENTS 			= "width";
	// TotalCount usedecorate
	this.TOT_COUNT_USEDECORATE				= "true";
	// TotalCount Default CSS Class
	this.TOT_COUNT_CSSCLASS					= "sta_total_count";

	// expand 버튼 객체 사용여부 (ViewTemplate에서 this.USE_EXPAND_BUTTON 설정하지 않을때 기본값)
	this.USE_EXPAND_BUTTON_BASE				= "none";
	// expand/collapse 버튼 사이즈(width, height)
	this.EXPAND_BUTTON_SIZE					= 20;

	// expand 버튼 ID
	this.EXPAND_BUTTON_ID					= "btnExpand";
	// open 버튼 cssclass
	this.EXPAND_BUTTON_OPEN_CSSCLASS 		= "btn_title_open";
	// close 버튼 cssclass
	this.EXPAND_BUTTON_CLOSE_CSSCLASS 		= "btn_title_close";

	this.oAttrTitleText =	{
								  "id"				: "titletext"
								, "edittype"		: "String"
								, "defaultvalue"	: lfn_Nvl(this.TITLE_TEXT, this.TITLE_TEXT_BASE)
								, "description"		: "Title Text(titletext 미입력 다른 항목들도 생성안됨.)"
						};
	this.oAttrTitleUseTotolCount =	{
								  "id"				: "usetotalcount"
								, "edittype"		: "Boolean"
								, "defaultvalue"	: lfn_Nvl(this.USE_TOT_COUNT, this.USE_TOT_COUNT_BASE)
								, "description"		: "전체건수 표시여부"
						};
	this.oAttrTitleExpandButton =	{
								  "id"				: "useexpandbutton"
								, "edittype"		: "Enum"
								, "enumlist"		: ["none", "open","close"]
								, "defaultvalue"	: lfn_Nvl(this.USE_EXPAND_BUTTON, this.USE_EXPAND_BUTTON_BASE)
								, "description"		: "접기/펼치기 버튼 표시여부"
														+ "\n" + "(※주의 - View ID를 변경시 정상동작하지 않습니다.)"
														+ "\n" + "none : 표시안함"
														+ "\n" + "open : 펼침"
														+ "\n" + "close : 접기"
						};
	//--------------------------------------------------------------------------------------------------------

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetCompId
	 * Parameter    : 
					- sCompId : 생성할 컴포넌트 아이디
	 * Return       : sRtnCompId : 컴포넌트 ID
	 * Description  : 컴포넌트 ID 생성 함수
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetCompId = function(sCompId)
	{
		var sNewCompId = "";
		
		if (this.COMP_NAMING_RULE == "C") {
			sNewCompId = lfn_ToCamelCase(sCompId);
		} else if (this.COMP_NAMING_RULE == "S") {
			sNewCompId = lfn_ToSnakeCase(sCompId);
		} else if (this.COMP_NAMING_RULE == "LS") {
			sNewCompId = lfn_ToLowerSnakeCase(sCompId);
		} else {
			sNewCompId = sCompId;
		}
		//trace("fn_GetCompId() : " + sCompId + " -> " + sNewCompId);
		
		//동일한 Field로 생성된 컴포넌트 있는지 체크
		var arrTemp = this.arrCompIds.filter(arrCompIds=>arrCompIds.indexOf(sNewCompId)==0);
		var sRtnCompId;
		
		//동일한 Field로 생성된 컴포넌트가 존재할 경우
		if(arrTemp.length>0)sRtnCompId = sNewCompId+"_"+arrTemp.length;
		
		//동일한 Field로 생성된 컴포넌트가 없을 경우 
		else sRtnCompId = sNewCompId;
		
		//컴포넌트 ID관리 Array에 추가
		this.arrCompIds[this.arrCompIds.length] = sRtnCompId;
		
		//컴포넌트 ID 리턴
		return sRtnCompId;
	};

	/**
	 * @class 문자열을 CamelCase 형식으로 변환한다.
	 * @param {string} sValue - 변환할 문자열
	 * @return {string} CamelCase 형식으로 변환된 문자열
	 * @example
	 * var sReturn = lfn_ToCamelCase("background color");	// backgroundColor <br>
	 * var sReturn2 = lfn_ToCamelCase("USER_TYPE");			// userType <br>
	 */
	lfn_ToCamelCase = function(sValue)
	{
	  return sValue.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
	};

	/**
	 * @class 문자열을 SnakeCase 형식으로 변환한다.
	 * @param {string} sValue - 변환할 문자열
	 * @return {string} SnakeCase 형식으로 변환된 문자열
	 * @example
	 * var sReturn = lfn_ToSnakeCase("background color");	// background_color <br>
	 * var sReturn2 = lfn_ToSnakeCase("USER_TYPE");			// _u_s_e_r__t_y_p_e <br>
	 */
	lfn_ToSnakeCase = function(sValue)
	{
		var result = sValue.replace( /([A-Z])/g, " $1" );
		return result.split(' ').join('_').toLowerCase();
	};

	/**
	 * @class 문자열을 소문자로 변환 후 SnakeCase 형식으로 변환한다.
	 * @param {string} sValue - 변환할 문자열
	 * @return {string} SnakeCase 형식으로 변환된 문자열(상수형 문자열도 SnakeCase로 변환)
	 * @example
	 * var sReturn = lfn_ToLowerSnakeCase("background color");	// background_color <br>
	 * var sReturn2 = lfn_ToLowerSnakeCase("USER_TYPE");			// user_type <br>
	 */
	lfn_ToLowerSnakeCase = function(sValue)
	{
		var result = sValue.toLowerCase().replace( /([A-Z])/g, " $1" );
		return result.split(' ').join('_');
	};

	/**
	 * @class 디버깅용 log를 출력하는 함수
	 * @param {(string|object)} sMsg - 출력할 문자열
	 * @param {string} sType - loglevel (예 : "debug","info","warn","error") (기본값 : "debug")
	 * @example
	 * lfn_Log("test log");	// [debug] test log
	 */
	lfn_Log = function(sMsg, sType)
	{
		var arrLogLevel = ["debug","info","warn","error"];
		
		if(sType == undefined)	sType = "debug";
		var nLvl = arrLogLevel.indexOf(sType);
		
		if (nLvl < this.LOG_LEVEL)		return;
		
		if (system.navigatorname == "nexacro DesignMode"
			|| system.navigatorname == "nexacro") {
			if (sMsg instanceof Object) {
				trace("[" + sType + "] " + JSON.stringify(sMsg, null, "\t"));
	// 			for(var x in sMsg){
	// 				trace("[" + sType + "] " + x + " : " + sMsg[x]);
	// 			}
			} else {
				trace("[" + sType + "] " + sMsg);
			}
		} else {
			console.log(sMsg);
		}
	};

	/**
	 * @class Generation용 변수 생성 함수
	 * @param {object} fieldarray - FieldUserAttribute값
	 * @param {object} contents - View Contents값
	 * @param {object} generationattr - ViewAttribute값
	 * @param {boolean} bUseComp - this.oUseFieldArray 생성정보
	 * @return N/A
	 * 		Generation용 폼 변수 생성
	 * 		 - this.oFieldArray : Model Information as JSON Object
	 * 		 - this.oContents : View Component Information as JSON Object
	 * 		 - this.oContents.View.Model : Model Information Initialization
	 * 		 - this.oGenerationAttr : Setting Information as JSON Object
	 * 		 - this.oUseFieldArray : Use Model Information as JSON Object
	 */
	lfn_MakeGenerationInfo = function(fieldarray, contents, generationattr, bUseComp)
	{
		//Set Model Information as JSON Object
		if(fieldarray)this.oFieldArray = JSON.parse(fieldarray);

		//Set View Component Information as JSON Object
		if(contents)
		{
			//trace(">> contents : " + contents);
			this.oContents = JSON.parse(contents);
			this.oContentsOrg = JSON.parse(contents);
			
		}
		
		//Set Option Setting Information as JSON Object
		if(generationattr)this.oGenerationAttr = JSON.parse(generationattr);

		//Initialize Model Information
		this.oContents.View.Model = [];
		
		if (this.oContentsOrg.View.Model == null) {
			this.oContentsOrg.View.Model = [];
		}

		if (bUseComp) {
			lfn_MakeUseFieldArray(fieldarray);
		}
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_MakeUseFieldArray
	 * Parameter    :
						- fieldarray     : model field list
	 * Return       :
	 * Description  : Model Information Production Function
	 *---------------------------------------------------------------------------------------------*/
	lfn_MakeUseFieldArray = function(fieldarray)
	{
		var bUseComp;
		var oModel = this.oContents.View.Model;

		if(fieldarray)this.oUseFieldArray = JSON.parse(fieldarray);

		var arrFields = this.oUseFieldArray.fields;

		for(var i=arrFields.length-1;i>=0;i--)
		{
			bUseComp = arrFields[i].usecomp;

			if(bUseComp=="false")
			{
				oModel[oModel.length] =
				{
					"fieldid" : arrFields[i].id,
					"Components" :[]
				};
				arrFields.splice(i, 1);
			}
		}
		this.oUseFieldArray.fieldcount = arrFields.length;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetCompClass
	 * Parameter    :
	 *                - sCompType : CompType of field
	 * Return       : component class data
	 * Description  : Returns class information of the component based on Field data
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetCompClass = function(sCompType)
	{
		var oCompClass = { "classId" : null, "prefix" : null };

		switch(sCompType)
		{
			case "button" : oCompClass.classId = "Button";
							oCompClass.prefix = "btn";
							break;
			case "combo" : oCompClass.classId = "Combo";
							oCompClass.prefix = "cmb";
							break;
			case "edit" : oCompClass.classId = "Edit";
							oCompClass.prefix = "edt";
							break;
			case "maskedit" : oCompClass.classId = "MaskEdit";
							oCompClass.prefix = "msk";
							break;
			case "textarea" : oCompClass.classId = "TextArea";
							oCompClass.prefix = "txt";
							break;
			case "static" : oCompClass.classId = "Static";
							oCompClass.prefix = "sta";
							break;
			case "radio" : oCompClass.classId = "Radio";
							oCompClass.prefix = "rdo";
							break;
			case "checkbox" : oCompClass.classId = "CheckBox";
							oCompClass.prefix = "chk";
							break;
			case "spin" : oCompClass.classId = "Spin";
							oCompClass.prefix = "spn";
							break;
			case "calendar" : oCompClass.classId = "Calendar";
							oCompClass.prefix = "cal";
							break;
			case "imageviewer" : oCompClass.classId = "ImageViewer";
							oCompClass.prefix = "img";
							break;
			case "progressbar" : oCompClass.classId = "ProgressBar";
							oCompClass.prefix = "prg";
							break;
			case "grid" : oCompClass.classId = "Grid";
							oCompClass.prefix = "grd";
							break;
			case "webview" : oCompClass.classId = "WebView";
							oCompClass.prefix = "web";
							break;
			default : oCompClass.classId = "Static";
					  oCompClass.prefix = "sta";
		}

		//컴포넌트 정보 리턴
		return oCompClass;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetRealSize
	 * Parameter    :
					- sSize : Size Information(% or px)
					- nLabelSize  : Size Information of Label Area
					- nParentSize : Size Information of Parent Area
					- sDefSize : Default Size Information
					- nLabelPadding : Size Information of Label Padding Area
					- nCompWidthPadding : Size Information of Component Padding Area
	 * Return       : nRealSize : px standard Size
	 * Description  : Function to Evaluate actual usage size based on the registered size
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetRealSize = function(sSize, nLabelSize, nParentSize, sDefSize, nLabelPadding, nCompPadding)
	{
		var nRealSize;
		var nSizeType;

		if(!sSize)sSize = sDefSize;

		nSizeType = sSize.replace(/[0-9]/g, "");

		if(nSizeType=="%")
		{
			nRealSize = nexacro.toNumber(sSize.replace(/[^0-9]/g, ""));
			nRealSize = (nRealSize/100) * nParentSize;

			nRealSize = nRealSize - nLabelSize - nLabelPadding - nCompPadding;
		}else
		{
			nRealSize = nexacro.toNumber(sSize.replace(/[^0-9]/g, ""));
		}

		return nRealSize;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetCellSize
	 * Parameter    :
					- arrList : columnsize or rowsize 사이즈정보(% or px)
					- nIdx : 시작 Column/Row Index 정보
					- nSpan : Column/Row Span 정보
					- nDefSize : -1 일 경우 사용할 디폴트 사이즈 정보

	 * Return       : nSize : px기준 사이즈
	 * Description  : Cell의 Width/Height 구하는 함수
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetCellSize = function(arrList, nIdx, nSpan, nDefSize)
	{
		var nSize = 0;

		for(var i=nIdx; i<nIdx+nSpan; i++)
		{
			if(nexacro.toNumber(arrList[i])==-1)
			{
				nSize += nexacro.toNumber(nDefSize);
			}else
			{
				nSize += nexacro.toNumber(arrList[i]);
			}
		}

		return nSize;
	}

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_CalcPaddingToSpace
	 * Parameter    :
					- sType : Col or Row
					- nIdx1 : Component Index Value to Calculate Padding
					- nIdx2 : Component Index Value to Calculate Padding + Space
					- bLayout : Whether Layout was used
	 * Return       : nTemp : Calibrated px value
	 * Description  : If the interval value set as padding is converted to Padding + CompSpace or LineSpace
					  Function to evaluate px value that needs calibration
	 *---------------------------------------------------------------------------------------------*/
	lfn_CalcPaddingToSpace = function(sType, nIdx1, nIdx2, nPadding, nSpace, bLayout)
	{
		var nTemp;

		//Formula to calibrate the location as the gap between components is calculated with Comp/Line Space instead of Padding information
		//Component Padding Formula = (Component Left/Right Padding * Component number
		//Component Space Formula = (Left/Top Padding of the First Component + Right/Bottom Padding of Last Component + Space * Component number)
		//Calculate difference = Component Padding Formula - Component Space Formula
	// 	if(bLayout==true)
	// 	{
	// 		if(sType=="Col")
	// 		{
	// 			nTemp = ((this.COMP_PADDING_LEFT+this.COMP_PADDING_RIGHT) * nIdx1) - (this.COMP_PADDING_LEFT + this.COMP_PADDING_RIGHT + (this.COMP_SPACE * nIdx2));
	// 		}else
	// 		{
	// 			nTemp = ((this.COMP_PADDING_TOP+this.COMP_PADDING_BOTTOM) * nIdx1) - (this.COMP_PADDING_TOP + this.COMP_PADDING_BOTTOM + (this.LINE_SPACE * nIdx2));
	// 		}
	// 	}else
	// 	{
	// 		if(sType=="Col")
	// 		{
	// 			nTemp = (this.COMP_PADDING_RIGHT * nIdx1) - (this.COMP_PADDING_RIGHT + (this.COMP_SPACE * nIdx2));
	// 		}else
	// 		{
	// 			nTemp = -(this.LINE_SPACE * nIdx2);
	// 		}
	// 	}

		if(bLayout==true)
		{
			if(sType=="Col")
			{
				nTemp = (nPadding * nIdx1) - (nPadding + (nSpace * nIdx2));
			}else
			{
				nTemp = (nPadding * nIdx1) - (nPadding + (nSpace * nIdx2));
			}
		}else
		{
			if(sType=="Col")
			{
				nTemp = (nPadding * nIdx1) - (nPadding + (nSpace * nIdx2));
			}else
			{
				nTemp = -(nSpace * nIdx2);
			}
		}

		return nTemp;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_CalcAlignPos
	 * Parameter    :
					- sAlign : 컴포넌트 정렬 방식
					- nParentSize : 부모영역의 사이즈
					- nSize : 컴포넌트영역의 사이즈
	 * Return       : nRtnValue : 시작위치 px 값
	 * Description  : Row/Col의 Align 시작위치값 구하기
	 *---------------------------------------------------------------------------------------------*/
	lfn_CalcAlignPos = function(sAlign, nParentSize, nSize)
	{
		var nRtnValue;

		if(sAlign=="center"||sAlign=="middle")nRtnValue = (nParentSize - nSize)/2;
		else if(sAlign=="right"||sAlign=="bottom")nRtnValue = nParentSize - nSize;
		else nRtnValue = 0;

		if(nRtnValue<0)nRtnValue = 0;

		return nRtnValue;
	}

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetDataset
	 * Parameter    :
					- sDatasetId : 데이터셋ID
					- objFieldArr : 데이터셋으로 만들 Field 객체
					- nRowCnt : 데이터셋 rowcount
					- arrRows : 데이터셋 row 데이터 정보
	 * Return       : 데이터셋 객체 Json 반환
	 * Description  : 데이터셋 객체 Json 생성 함수
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetDataset = function(sDatasetId, objFieldArr, nRowCnt, arrRows)
	{
		var oDatasetInfo = {
				"tag": "Dataset",
				"attribute": { "id": sDatasetId },
				"Dataset": [
				{
					"tag": "ColumnInfo",
					"attribute": {},
					//Load Column Information Setting Function
					"ColumnInfo": lfn_GetDsColumns(objFieldArr)
				},
				{
					"tag": "Rows",
					"attribute": {},
					//Load Row Information Setting Function
					"Rows": lfn_GetDsRows(nRowCnt, arrRows)
				}]
			};

		return oDatasetInfo;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetDsColumns
	 * Parameter    :
	 *                - oFieldArray : model field data
	 * Return       : dataset column(s) data
	 * Description  : Function to generate <Column> source
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetDsColumns = function(objFieldArr)
	{
		var i;
		var oColumns = [];

		var oField;
		var sLabel;
		var sFieldId;
		var sDataType;
		var sDataSize;
		var sProp;
		var sSumText;

		//모델 Field 개수 가져오기
		var nCount = objFieldArr.fieldcount;

		//모델 Field 개수 만큼 컬럼 정보 만들기
		for(i=0;i<nCount;i++)
		{
			oField = objFieldArr.fields[i];

			sFieldId 	= oField.id;
			sLabel		= oField.label;
			sDataType 	= oField.datatype;
			sDataSize 	= oField.datasize;
			sProp		= oField.prop;
			sSumText	= oField.sumtext;

			if(oField.comptype!="button")
			{
				oColumns[i] =
				{
					"tag": "Column",
					"attribute":
					{
						"id": sFieldId, "type": sDataType, "size": sDataSize
					}
				};
				
				if(lfn_IsNotNull(sLabel))			oColumns[i]["attribute"]["description"] = sLabel;
				if(lfn_IsNotNull(sProp))			oColumns[i]["attribute"]["prop"] = sProp;
				if(lfn_IsNotNull(sSumText))		oColumns[i]["attribute"]["sumtext"] = sSumText;
			}
		}

		//컬럼 정보 리턴
		return oColumns;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetDsRows
	 * Parameter    : nRowCnt : 데이터셋 Row
	 * Return       : dataset row(s) data
	 * Description  : Function to generate <Row> source
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetDsRows = function(nRowCnt, arrRows)
	{
		if (nRowCnt == null)		nRowCnt = 1;

		var i;
		var oRows = [];
		var oRow = [];

		var oRowInfo;
		var oRowCol;

		for(i=0;i<nRowCnt;i++)
		{
			oRow = [];
			
			// Row 데이터 정보가 있는 경우 Row정보 생성
			if (arrRows)
			{
				oRowInfo = arrRows[i];
				
				if (oRowInfo)
				{
					for(var oInfo in oRowInfo) {
						oRowCol = {
								"tag" : "Col",
								"attribute" : {"id" : oInfo},
								"value" : oRowInfo[oInfo]
						};
						
						oRow.push(oRowCol);
					}
				}
			}

			//Row정보 Rows에 추가
			oRows[i] = {"tag": "Row",    "attribute": {},"Row": oRow};
		}

		//Rows 정보 리턴
		return oRows;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetBindItem
	 * Return       : bind contents (JSON format)
	 * Description  : Function to generate <Bind> source
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetBindItem = function(sBindDataset, arrBindItem)
	{
		if (sBindDataset == null)		sBindDataset = "viewdataset";

		var oBind = [];
		var oBindItems = [];

		var sCompId
		var sFieldId;
		var sCompType;
		var nBindItemCount = arrBindItems.length;

		for(var i=0;i<nBindItemCount;i++)
		{
			sCompId		= arrBindItem[i].compid;
			sFieldId	= arrBindItem[i].fieldid;
			sCompType	= arrBindItem[i].comptype;

			if(sCompType=="static")
			{
				oBindItems[i] =
				{
					"tag" : "BindItem",
					"attribute" :
					{
						"id" : "bind_"+sCompId, "compid" : sCompId, "propid" : "text", "datasetid" : sBindDataset, "columnid" : sFieldId
					}
				}
			}
			else if(sCompType=="imageviewer")
			{
				oBindItems[i] =
				{
					"tag" : "BindItem",
					"attribute" :
					{
						"id" : "bind_"+sCompId, "compid" : sCompId, "propid" : "image", "datasetid" : sBindDataset, "columnid" : sFieldId
					}
				}
			}
			else if(sCompType=="webview")
			{
				oBindItems[i] =
				{
					"tag" : "BindItem",
					"attribute" :
					{
						"id" : "bind_"+sCompId, "compid" : sCompId, "propid" : "url", "datasetid" : sBindDataset, "columnid" : sFieldId
					}
				}
			}
			else
			{
				oBindItems[i] =
				{
					"tag" : "BindItem",
					"attribute" :
					{
						"id" : "bind_"+sCompId, "compid" : sCompId, "propid" : "value", "datasetid" : sBindDataset, "columnid" : sFieldId
					}
				}
			}

		}

		oBind[oBind.length] = {"tag" : "Bind", "Bind" : oBindItems};

		return oBind;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_SetViewPadding
	 * Parameter    : N/A
	 * Return       : N/A
	 * Description  : viewpadding값 기준으로 view padding 전역변수 설정
	 *---------------------------------------------------------------------------------------------*/
	lfn_SetViewPadding = function()
	{
		var sViewPadding = "";
		
		if (this.oGenerationAttr.attributes.hasOwnProperty("viewpadding")) {
			sViewPadding = this.oGenerationAttr.attributes.viewpadding;
			//lfn_Log("viewpadding");
		} else {
			sViewPadding = this.VIEW_PADDING;
			//lfn_Log("this.VIEW_PADDING");
		}
		
		if (sViewPadding)
		{
			var arrViewPadding = sViewPadding.split(" ");
			var nPaddingTop, nPaddingRight, nPaddingBottom, nPaddingLeft;
			
	// 		1회 입력 : top/right/bottom/left 에 모두 적용됩니다.
	// 		2회 입력 : top/bottom, right/left 에 첫번째 값부터 각각 적용됩니다.
	// 		3회 입력 : top, right/left, bottom 에 첫번째 값부터 각각 적용됩니다.
	// 		4회 입력 : top, right, bottom, left 에 첫번째 값부터 각각 적용됩니다.
			if (arrViewPadding.length == 1)
			{
				this.VIEW_PADDING_TOP = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_RIGHT = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_BOTTOM = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_LEFT = nexacro.toNumber(arrViewPadding[0]);
			}
			else if (arrViewPadding.length == 2)
			{
				this.VIEW_PADDING_TOP = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_RIGHT = nexacro.toNumber(arrViewPadding[1]);
				this.VIEW_PADDING_BOTTOM = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_LEFT = nexacro.toNumber(arrViewPadding[1]);
			}
			else if (arrViewPadding.length == 3)
			{
				this.VIEW_PADDING_TOP = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_RIGHT = nexacro.toNumber(arrViewPadding[1]);
				this.VIEW_PADDING_BOTTOM = nexacro.toNumber(arrViewPadding[2]);
				this.VIEW_PADDING_LEFT = nexacro.toNumber(arrViewPadding[1]);
			}
			else if (arrViewPadding.length == 4)
			{
				this.VIEW_PADDING_TOP = nexacro.toNumber(arrViewPadding[0]);
				this.VIEW_PADDING_RIGHT = nexacro.toNumber(arrViewPadding[1]);
				this.VIEW_PADDING_BOTTOM = nexacro.toNumber(arrViewPadding[2]);
				this.VIEW_PADDING_LEFT = nexacro.toNumber(arrViewPadding[3]);
			}
			
			//lfn_Log(this.VIEW_PADDING_TOP + " " + this.VIEW_PADDING_RIGHT + " " + this.VIEW_PADDING_BOTTOM+ " " + this.VIEW_PADDING_LEFT);
		}
	};
	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_MakeTitleArea
	 * Parameter    : 	sTitleText - titletext 속성값
						sUseTotalCount - usetotalcount 속성값
						sUseExpandButton - useexpandbutton 속성값
						bFluidLayout - FluidLayout 여부
	 * Return       : Title영역 높이
	 * Description  : 타이틀 영역 생성 함수
	 *---------------------------------------------------------------------------------------------*/
	lfn_MakeTitleArea = function(sTitleText, sUseTotalCount, sUseExpandButton, bFluidLayout)
	{
		if (sTitleText == null)			return this.VIEW_PADDING_TOP;
		if (sUseTotalCount == null)		sUseTotalCount = "false";
		if (bFluidLayout == null)		bFluidLayout = false;

		var oModel = this.oContents.View.Model;
		var arrComponents	= new Array();
		var oField;
		var oComp;

		var nCompTop		= 0;
		var nCompLeft		= 0;
		var nCompWidth		= 0;
		var nCompHeight		= 0;
		
		var sCompId			= "";
		var sText			= "";
		var sCssClass		= "";
		
		// 1) ExpandButton 객체 생성
		if (sUseExpandButton != "none")
		{
			var sViewNm = this.oContents.View.attribute.id;
			
			sCompId		= this.EXPAND_BUTTON_ID;
			sCssClass	= sUseExpandButton == "close" ? this.EXPAND_BUTTON_OPEN_CSSCLASS : this.EXPAND_BUTTON_CLOSE_CSSCLASS;
			
			nCompWidth	= this.EXPAND_BUTTON_SIZE;
			nCompHeight	= this.EXPAND_BUTTON_SIZE;
			nCompTop	= nexacro.round((this.TITLE_AREA_HEIGHT - this.EXPAND_BUTTON_SIZE) / 2, 0);
			
			arrComponents.push({
				"tag" : "Button",
				"attribute" :
				{
					"id" : sCompId, "left" : nCompLeft, "top" : nCompTop, "height" : nCompHeight, "width" : nCompWidth
					, "cssclass" : sCssClass
					, "onclick" : sViewNm + ".form." + "vfn_Title_btnTitleOpenClose_onclick"
					, "_openclose" : sUseExpandButton
				}
			});
				
			nCompLeft = nCompLeft + nCompWidth + this.TITLE_AREA_COMP_SPACE;
		}
		
		// 2) Title 객체 생성
		sCompId		= this.TITLE_ID;
		sText		= sTitleText;
		sCssClass	= sUseExpandButton == "none" ? this.TITLE_CSSCLASS : this.TITLE_NOICON_CSSCLASS;
		
		nCompWidth	= 120;
		nCompHeight	= this.TITLE_HEIGHT;
		nCompTop	= 0;
			
		arrComponents.push({
			"tag" : "Static",
			"attribute" :
			{
				"id" : sCompId, "left" : nCompLeft, "top" : nCompTop, "height" : nCompHeight, "width" : nCompWidth,
				"text" : sText, "fittocontents" : this.TITLE_FITTOCONTENTS,
				"cssclass" : sCssClass
			}
		});
		
		// 3) TotalCount 객체 생성
		if (sUseTotalCount == "true") {
			sCompId		= this.TOT_COUNT_ID;
			sText		= this.TOT_COUNT_TEXT;
			sCssClass	= this.TOT_COUNT_CSSCLASS;
			
			nCompWidth	= 50;
			nCompHeight	= this.TOT_COUNT_HEIGHT;
			nCompLeft	= this.TITLE_ID + ":5";
		
			arrComponents.push({
				"tag" : "Static",
				"attribute" :
				{
					"id" : sCompId, "left" : nCompLeft, "top" : nCompTop, "height" : nCompHeight, "width" : nCompWidth,
					"text" : sText, "fittocontents" : this.TOT_COUNT_FITTOCONTENTS, "usedecorate" : this.TOT_COUNT_USEDECORATE,
					"cssclass" : sCssClass
				}
			});
		}
		
		// 모델에 Component 설정
		var nModelIndex = oModel.length;
		oModel[nModelIndex] =
		{
			"fieldid" : this.VIEW_COMP_FIELD_ID,
			"Components" : [{
							"tag" : "Div",
							"attribute" : { "id" : this.DIV_TITLE_ID, "left" : this.VIEW_PADDING_LEFT, "top" : this.VIEW_PADDING_TOP, "height" : this.TITLE_AREA_HEIGHT},
							"Div" : [{
									"tag" : "Layouts",
									"Layouts" : [{
											"tag" : "Layout",
											"Layout" : arrComponents
									}]
							}]
						}]
						
		};
		
		// FluidLayout일때는 width 설정, 그외는 right 설정
		if (bFluidLayout == true) {
			oModel[nModelIndex]["Components"][0]["attribute"]["width"] = "100%";
		} else {
			oModel[nModelIndex]["Components"][0]["attribute"]["right"] = this.VIEW_PADDING_RIGHT;
		}
		
		return this.VIEW_PADDING_TOP + this.TITLE_AREA_HEIGHT;
	};

	/*---------------------------------------------------------------------------------------------*
	 * Function     : lfn_GetTitleScript
	 * Parameter    :	sViewNm - View 객체명
						sUseExpandButton - useexpandbutton 설정값
	 * Return       : Script 문자열
	 * Description  : 타이틀 Expand버튼 동작 스크립트
	 *---------------------------------------------------------------------------------------------*/
	lfn_GetTitleScript = function(sViewNm, sUseExpandButton)
	{
		var sScript = "";
		
		// Expand버튼 동작 스크립트 - sUseExpandButton : ["none", "open","close"]
		if (sUseExpandButton == "open" || sUseExpandButton == "close")
		{
			// expand 토글버튼 클릭 이벤트 함수
			sScript += "this.vfn_Title_btnTitleOpenClose_onclick = function(obj:nexacro.Button,e:nexacro.ClickEventInfo)";
			sScript += "{";
			sScript += "	if (obj.cssclass == '" + this.EXPAND_BUTTON_OPEN_CSSCLASS + "') {";
			sScript += "		this." + sViewNm + ".form.vfn_Title_SetSearchOpenClose(obj,'open');";
			sScript += "	} else {";
			sScript += "		this." + sViewNm + ".form.vfn_Title_SetSearchOpenClose(obj,'close');";
			sScript += "	}";
			sScript += "};";
			
			// expand 토글 함수
			sScript += "this.vfn_Title_SetSearchOpenClose = function(obj,sStatus)";
			sScript += "{";
			sScript += "	var objForm = obj.parent.parent.parent;";
			sScript += "	var objView = objForm.parent;";
			sScript += "	";
			sScript += "	if (sStatus == 'close') {";
			sScript += "		objView.set_height('" + this.VIEW_PADDING_TOP + "');";
			sScript += "		objView.set_formscrolltype('none');";
			sScript += "		obj.set_cssclass('" + this.EXPAND_BUTTON_OPEN_CSSCLASS + "');";
			sScript += "	} else {";
			sScript += "		if (objView._openHeight > 0) {";
			sScript += "			objView.set_height(objView._openHeight);";
			sScript += "		} else {";
			sScript += "			objView.set_bottom(objView._openBottom);";
			sScript += "		}";
			sScript += "		objView.set_formscrolltype(objView._formscrolltype);";
			sScript += "		obj.set_cssclass('" + this.EXPAND_BUTTON_CLOSE_CSSCLASS + "');";
			sScript += "	}";
			sScript += "	";
			sScript += "	objView['_openclose'] = sStatus;";
			sScript += "	";
			sScript += "	objView.parent.resetScroll();";
			sScript += "};";
			
			// View 사이즈 초기값 설정 함수(onload시 호출됨)
			sScript += "this.vfn_Title_SetViewInit = function(obj,sStatus)";
			sScript += "{";
			sScript += "	var objView = obj.parent;";
			sScript += "	objView._openclose = sStatus;";
			sScript += "	objView._openHeight = objView.height;";
			sScript += "	objView._openBottom = objView.bottom;";
			sScript += "	objView._formscrolltype = objView.formscrolltype;";
			sScript += "	this.vfn_Title_SetSearchOpenClose(obj."+this.DIV_TITLE_ID+".form."+"btnExpand,sStatus);";
			sScript += "};";

			//View onload시 호출 
			sScript += "this.vfn_Title_SetViewInit(this,'" + sUseExpandButton + "');";
		}
		
		return sScript;
	};
}());