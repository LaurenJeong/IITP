/**
*  컨설팅 표준화 작업
*  @FileName 	Popup.js 
*  @Creator 	consulting
*  @CreateDate 	2017.03.08
*  @Desction   		
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2017.03.08     	consulting 	           	    최초 생성 
*  2017.10.17     	consulting  	           	주석 정비
*  2018.01.16		consulting					gfnGetApplication 공통함수 변경
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

pForm.gvPopCommHeight = 60;		// 공통 표준 추가높이(여백)
pForm.gvPopCommWidth  = 20;		// 공통 표준 추가넓이(여백)

/**
 * @class 공통 디자인이 적용된 팝업 오픈
 * @param {String} sPopupId	- 팝업ID
 * @param {String} sUrl	 - 팝업URL
 * @param {String} [oParam] - 전달값
 * @param {String} [sPopupCallback] - 팝업콜백
 * @param {Object} [oOption] - 팝업옵션 <br>
 *	oOption.top : 상단 좌표 <br>
 *	oOption.left : 좌측 좌표 <br>
 *	oOption.width : 넓이 <br>
 *	oOption.height : 높이 <br>
 *	oOption.popuptype : 팝업종류(modal:showModal, modeless:application.open, modalsync:showModalSync, modalwindow:showModalWindow) <br>
 *	oOption.layered : 투명 윈도우 <br>
 *	oOption.opacity : 투명도 <br>
 *	oOption.autosize : autosize <br>
  *	oOption.resizable : 리사이즈 가능여부. default:false <br>
 * @return N/A
 */
pForm.gfnPopup = function(sPopupId, sUrl, oParam, sPopupCallback, oOption)
{
	if (this.gfnIsNull(sPopupId)){
		this.gfnLog("[gfnPopup] Popup ID가 없습니다","info");
		return false;
	}
	if (this.gfnIsNull(sUrl)){
		this.gfnLog("[gfnPopup] Url이 없습니다","info");
		return false;
	}
	if (this.gfnIsNull(oOption["title"])){
		this.gfnLog("[gfnPopup] Title이 없습니다","info");
		return false;
	}
	if (this.gfnIsNull(oOption["width"])){
		this.gfnLog("[gfnPopup] Width가 없습니다","info");
		return false;
	}
	if (this.gfnIsNull(oOption["height"])){
		this.gfnLog("[gfnPopup] Height가 없습니다","info");
		return false;
	}
	
	var oArg = {};
	oArg["popupTitle"]	= oOption["title"];
	oArg["popupUrl"]	= sUrl;
	oArg["menuId"] 		= this.gfnGetArgument("menuId");		// 팝업은 부모의 값 그대로 가져감
	
	if (this.gfnIsNull(oOption))			oOption = {};
	oOption["width"]	= parseInt(oOption["width"]) + this.gvPopCommWidth;
	oOption["height"]	= parseInt(oOption["height"]) + this.gvPopCommHeight;
	
	this.gfnOpenPopup(sPopupId,"frame::framePopup.xfdl",oParam,sPopupCallback,oOption,oArg);	
};

/**
 * @class 팝업오픈
 * @param {String} sPopupId	- 팝업ID
 * @param {String} sUrl	 - 팝업URL
 * @param {String} [oArg] - 전달값
 * @param {String} [sPopupCallback] - 팝업콜백
 * @param {Object} [oOption] - 팝업옵션 <br>
 *	oOption.top : 상단 좌표 <br>
 *	oOption.left : 좌측 좌표 <br>
 *	oOption.width : 넓이 <br>
 *	oOption.height : 높이 <br>
 *	oOption.popuptype : 팝업종류(modal:showModal, modeless:application.open, modalsync:showModalSync, modalwindow:showModalWindow) <br>
 *	oOption.layered : 투명 윈도우 <br>
 *	oOption.opacity : 투명도 <br>
 *	oOption.autosize : autosize <br>
 * @return N/A
 * @example
 * this.gfnOpenPopup(this);
 */
pForm.gfnOpenPopup = function (sPopupId, sUrl, oParam, sPopupCallback, oOption, oArg)
{
    var objApp = pForm.gfnGetApplication();
	var nLeft = -1;
	var nTop = -1;
	var nWidth = -1;
	var nHeight = -1;
	var bShowTitle = false;	
	var bShowStatus = false;	
	var sPopupType = "modal";
	var bLayered = false;
	var nOpacity = 100;
	var bAutoSize = false;
	var bResizable = false;
	var bTopmost = false;
	
	//callback함수(명)을 전달하지 않아도 기본명이 선언되어 있다면 기본명을 사용하도록 기본셋팅
	var sPopupCallback = (this.gfnIsNull(sPopupCallback) && this["fnPopupCallback"]) ? "fnPopupCallback" : sPopupCallback;
				
	var sTitleText = "";
	
	for (var key in oOption) {
       if (oOption.hasOwnProperty(key)) {
            switch (key) {
				case "top":				
					nTop = parseInt(oOption[key]);
					break;
				case "left":
					nLeft = parseInt(oOption[key]);
					break;
				case "width":
					nWidth = parseInt(oOption[key]);
					break;
				case "height":
					nHeight = parseInt(oOption[key]);
					break;
				case "popuptype":
					sPopupType = oOption[key];
					break;
				case "layered":
					bLayered = oOption[key];
					break;
				case "opacity":
					nOpacity = oOption[key];
					break;
				case "autosize":
					bAutoSize = oOption[key];
					break;
				case "titlebar":
					if ("" + oOption[key] == "true") {
						bShowTitle = true;
					}
					break;
				case "title":					
					sTitleText = oOption[key];	
					break;
				case "topmost":		
					bTopmost = oOption[key];
					break;
				case "resizable":		
					bResizable = oOption[key];
					break;
			}	
        }
    }

	var sOpenalign = "";
	if (nLeft == -1 && nTop == -1) 
	{		
		sOpenalign = "center middle";
		if (system.navigatorname == "nexacro") {
			var curX = objApp.mainframe.left;
			var curY = objApp.mainframe.top;
		}
		else{
			var curX = window.screenLeft;
			var curY = window.screenTop;
		}
		
        nLeft   =  curX + (objApp.mainframe.width / 2) - Math.round(nWidth / 2);
	    nTop    = curY + (objApp.mainframe.height / 2) - Math.round(nHeight / 2);
	} 
	else {
		nLeft   =  this.getOffsetLeft() + nLeft;
		nTop   =  this.getOffsetTop() + nTop;
	}
		
	if(nWidth == -1 || nHeight == -1)
	{
	    bAutoSize = true;
	}
	
	// modeless를 위해 팝업 Type 및 callBack함수 지정
	if (this.gfnIsNull(oArg))			oArg = {};
	if (this.gfnIsNull(oParam))			oParam = {};
	
	oArg["popupType"]	= sPopupType;
	oArg["popupId"]		= sPopupId;
	oArg["callback"]	= sPopupCallback;
	oArg["oArgs"]		= oParam;
	
	// 높이 체크
	var nMaxHeight;
	if (sPopupType == "modeless") {		// 모니터 해상도로 체크
		nMaxHeight = system.getScreenHeight();
	} else {							// 어플리케이션 크기로 체크
		nMaxHeight = objApp.mainframe.height;
	}
	
	nMaxHeight = parseInt(nMaxHeight) - 50;
	
	// 최대해상도보다 큰 경우
	if (nHeight > nMaxHeight) {
		nTop = 0;
		nHeight = nMaxHeight;
		bAutoSize = false;
		sOpenalign = "center top";
	}
	
	var objParentFrame = this.getOwnerFrame();

    if(sPopupType == "modeless")
    {
        var sOpenStyle= "showtitlebar=" + bShowTitle + " showstatusbar=false showontaskbar=true showcascadetitletext=false resizable=" + bResizable + " autosize=" + bAutoSize + " titletext=" + sTitleText;
		if (bTopmost == true)	sOpenStyle += " topmost=true";
		
		var arrPopFrame = nexacro.getPopupFrames();

		if (arrPopFrame[sPopupId]) {	
			if (system.navigatorname == "nexacro") {
				arrPopFrame[sPopupId].setFocus();
			} else {	
				arrPopFrame[sPopupId]._getWindowHandle().focus();
			}
		}
		else {
			nexacro.open(sPopupId, sUrl, objParentFrame, {"arguments" : oArg}, sOpenStyle, nLeft, nTop, nWidth, nHeight, this);
		}
    }
	else {
		newChild = new nexacro.ChildFrame;
		newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sUrl);
		
		newChild.set_dragmovetype("all");
		newChild.set_showcascadetitletext(false);
		newChild.set_showtitlebar(bShowTitle);    //titlebar는 안보임
        if (bShowTitle) {
            newChild.set_titlebarheight(this.titlebarheight);
        }
		newChild.set_autosize(bAutoSize);	
		newChild.set_resizable(bResizable);    //resizable 안됨
		if (!this.gfnIsNull(sTitleText)) {
            newChild.set_titletext(sTitleText);
        }
		newChild.set_showstatusbar(bShowStatus);    //statusbar는 안보임
		newChild.set_openalign(sOpenalign);
		newChild.set_layered(bLayered);
		newChild.set_topmost(bTopmost);
		newChild.set_overlaycolor("RGBA(0, 0, 0, 0.2)");
			
		if (sPopupType == "modalsync")
		{			
			// modalsync 팝업은 return이 없어 gfnClosePopup 함수에서 셋팅한 값으로 리턴처리
			system.showModalSync(newChild, objParentFrame, {"arguments" : oArg});
			var rtn = objParentFrame.form["rtnVal"];
			return rtn;
		}
		else if(sPopupType == "modalwindow")
		{			
			var rtn = system.showModalWindow(newChild, sPopupId, objParentFrame, {"arguments" : oArg});		
			return rtn;
		}
		// modal
		else
		{
			//newChild.showModal(objParentFrame, oArg, this, this[sPopupCallback]);
			//2018.10.05 mkn : callback function object도 처리하기위해 그대로 전달함.
			newChild.showModal(sPopupId, objParentFrame, {"arguments" : oArg}, this, sPopupCallback);
		}
	}
};

/**
 * @description 팝업화면에서 창 닫기
*/
pForm.gfnClosePopup = function(objRtn)
{
	var objFrame = this.getOwnerFrame();
	var objChild = objFrame.form;
	
	if (objChild == null) {
		return;
	}
	
	// modalsync 팝업일때 리턴값 전달 시 사용
	objChild.opener["rtnVal"] = objRtn;
	
	// modeless 팝업일때 부모창의 callBack 함수 실행
	if (objChild.opener) {		
		// 팝업이 modeless 일때
		if (objFrame.popupType == "modeless") {
			var sPopupId  = objFrame.popupId;
			var sCallBack = objFrame.callback;

			// callBack 함수가 있을 때
			if (this.gfnIsNull(sCallBack) == false) {	
			
				//2018.10.05 mkn : callback 함수object로 파라미터 전달시 바로 호출
				if (typeof(sCallBack) == "function") {
					sCallBack.call(objChild.opener, sPopupId, objRtn);
				}
				else {
					objChild.opener.lookupFunc(sCallBack).call(sPopupId, objRtn);
				}
			}
		}
	}
	
	// 팝업창 닫기
	objChild.close(objRtn);
};