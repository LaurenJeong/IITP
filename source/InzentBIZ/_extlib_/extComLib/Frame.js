/**
*  InzentBIZ
*  @FileName 	Frame.js 
*  @Creator 	Creator
*  @CreateDate 	2022.10.31
*  @Desction    
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2022.10.31     		Creator		       	      	최초 생성
*******************************************************************************
*/

var pForm  = nexacro.Form.prototype;

pForm.ADMIN_AUTH_CD = "99";				// 권한코드(관리자)

/**
 * @class 현재 실행된 어플리케이션의 Application 오브젝트를 반환하는 메소드 <br>
 * @param  none
 * @return Object
 */
pForm.gfnGetApplication = function()
{
	// nexacro 14/17 구분하여 Application object를 사용한다.
	var objApp = nexacro.getApplication();
	
	return objApp;
};

/**
* @class form open 시 초기 처리 <br>
* @param {Object} obj - 화면
* @return N/A
* @example 
* this.gfnFormOnLoad(this);
*/
pForm.gfnFormOnLoad = function(objForm)
{
	//trace("================ gfnFormOnLoad objForm : " + objForm.name);
		
	// 부모가 divWork일때(화면일때) keyDown 이벤트 추가 및 화면 loading 시간 측정
	if (objForm.parent.name == "divWork")
	{
		// 키다운 이벤트 추가
		objForm.addEventHandler("onkeydown", this.gfnOnkeydown, this);	
	}
	
	// 팝업 일때 처리
	if (objForm.opener)
	{
		if (objForm.parent instanceof nexacro.ChildFrame)
		{
			// 키다운 이벤트 추가
			objForm.addEventHandler("onkeydown", this.gfnOnkeydown, this);
		}
		
	}
};

/**
 * @description 각 화면에서 단축키 지정
*/
pForm.gfnOnkeydown = function(obj, e)
{
	//trace("e.ctrlkey : " + e.ctrlkey + " / e.keycode : " + e.keycode);
	
	// 디버그 창 : Ctrl + Q
	if (e.ctrlkey && e.keycode == 81)
	{
		// 운영환경에서는 실행 방지
		//if (nexacro.getEnvironmentVariable("evRunMode") == "R") return;
		
		//var oArg = {};
		//var oOption = {popuptype:"modeless", titlebar : "true", title:"디 버 그",width:"1080",height:"703"};
		//this.gfnOpenPopup("debugging","frame::frmDebug.xfdl",oArg,"",oOption);
		
		if (obj.oDebugAction == null)
		{
			// <PopupAction id="PopupAction00" formurl="gwp::gwppurchaserequestpop.xfdl" popupstyle="modal" popupid="popup" popupdatatype="none" popupleft="-1" popuptop="-1" popupwidth="-1" popupheight="-1" title="구매요청" targetview="gwppurchaselist">
			var oPopupAction = new nexacro.PopupAction("ActionPopupDebug", this);
			oPopupAction.set_formurl("frame::frmDebug.xfdl");
			oPopupAction.set_popupstyle("modeless");
			oPopupAction.set_popupid("debugging");
			oPopupAction.set_popupdatatype("none");
			//oPopupAction.set_popupleft(-1);
			//oPopupAction.set_popuptop(-1);
			oPopupAction.set_popupwidth(1080);
			oPopupAction.set_popupheight(703);
			
			obj.oDebugAction = oPopupAction;
		}
		obj.oDebugAction.run();
	}
};

pForm.gfnCallMenu = function(sMenuId, objArg)
{
	var objApp  = nexacro.getApplication();
	
	var nFRow = objApp.gdsMenu.findRow("MENU_CD",sMenuId);
	
	if (nFRow < 0)		return;
	
	var sMenuNm		= objApp.gdsMenu.getColumn(nFRow, "MENU_NM");
	var sPgmPath	= objApp.gdsMenu.getColumn(nFRow, "PGM_PATH");
	var sPgmId		= objApp.gdsMenu.getColumn(nFRow, "PGM_ID");
	var sMenuUrl	= sPgmPath + "::" + sPgmId;
	var sMenuNavi	= this.divLeft.form.grdLeft.getTreePath(nFRow, true);
	
	if (this.gfnIsNull(sPgmPath)|| this.gfnIsNull(sPgmId))		return;
	
	var oArgs 	= this.gfnIsNull(objArg) ? "" : objArg;   //넘어온 arguments
	
	var oMenuArg = {};
	oMenuArg["menuid"] = sMenuId;
	oMenuArg["oArgs"] = oArgs;
	
	// 메뉴버튼
	var oMenuBtn = {};
	for(var i=1; i<=5; i++)
	{
		sBtnYn = objApp.gdsMenu.getColumn(nFRow, "BTN_YN_" + i);
		
		if (sBtnYn == "Y")
		{
			oMenuBtn["BTN_" + i] = {
				  "id"			: "BTN_" + i
				, "text"		: objApp.gdsMenu.getColumn(nFRow, "BTN_TEXT_" + i)
			};
		}
	}
	
	var objNewWin = this.objApp.gvWorkFrame;
		objNewWin.set_url("");
	
	// Div Arguments Setting
	objNewWin._menuid = sMenuId;
	objNewWin._menunm = sMenuNm;
	objNewWin._menuurl = sMenuUrl;
	objNewWin._menunavi = sMenuNavi;
	objNewWin._menuauth = oMenuBtn;
	
 	objNewWin.arguments = [];
	objNewWin.arguments["menuid"] = sMenuId;
 	objNewWin.arguments["oArgs"	] = oArgs;
	
	objNewWin.set_url("frame::frmWorkSDI.xfdl");
};

//화면간 파라미터 반환 함수
pForm.gfnMenuGetParams = function(sParamNm)
{
	var oParam;
	var oRtn = "";
    var objApp  = nexacro.getApplication();
	
	try 
    {	
        if (this.parent instanceof nexacro.ChildFrame)
        {
            oParam = this.getOwnerFrame(); 
        }
        else
        {
            oParam = objApp.gvAllFrame.arguments["oArgs"]; 
        }
		
		if (this.gfnIsNull(sParamNm)) {
			oRtn = oParam;
		} else if (oParam) {
			oRtn = oParam[sParamNm];
		}
	}
	catch(e)
    {
    
		trace(" 파라미터가 선언되지 않았습니다.");
	}
	
	return oRtn;
};

// 사용자정보 반환
pForm.gfnGetUserInfo = function (sKey)
{
	sUserInfo = nexacro.getApplication().gdsUserInfo.getColumn(0, sKey);
	
	return sUserInfo;
};