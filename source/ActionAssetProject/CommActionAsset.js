//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.CommActionAsset		
// Group : Action		
//==============================================================================		
if (!nexacro.CommActionAsset)		
{		
    nexacro.CommActionAsset = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
    };		
        		
    nexacro.CommActionAsset.prototype = nexacro._createPrototype(nexacro.Action, nexacro.CommActionAsset);		
    nexacro.CommActionAsset.prototype._type_name = "CommActionAsset";		
	
	//===============================================================		
    // nexacro.CommActionAsset : Create & Destroy		
    //===============================================================		
    nexacro.CommActionAsset.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.CommActionAsset : Method		
    //===============================================================		
    nexacro.CommActionAsset.prototype.run = function()		
	{	
        //TODO		
	};	
	
	//===============================================================
    // nexacro.Action : 변수선언 부분
    //===============================================================
	var pAction = nexacro.Action.prototype;
	
	pAction._LOG_LEVEL		= -1;								// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	// 대상 Action : PopupAction, PopupActionM
	pAction._POPUP_CALLBACK = "fnPopupActionCallback";			// 팝업 Callback함수(Action 내부에서 사용)
	
	// 대상 Action : ExcelExportAction, ExcelImportAction
	pAction._COM_EXCEL_URL = "svc::XExportImport";				// XENI URL
	
	// 대상 Action : DsSetFirstCdAction
	pAction._COM_CODE_COL = "COMN_CD";							// 공통코드 코드컬럼명
	pAction._COM_NAME_COL = "COMN_CD_NM";						// 공통코드 코드명컬럼명
	
	// 대상 Action : SearchDBAction
	pAction._TRAN_CALLBACK_NM = "fnTranActionCallback";			// Action공통 Callback함수명
	//===============================================================
    // nexacro.Action : 공통함수(Util)
    //===============================================================
	/**
	 * @class 값이 존재하는지 여부 체크 <br>
	 * @param {String} sValue	
	 * @return {Boolean} true/false
	 * @example
	 * var bNull = this.gfnIsNull("aaa");	// false
	 */
	pAction.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	/**
	 * 로그 출력
	 * @param {String} sMsg 로그 출력 문자열
	 * @param {String} sType 로그 타입("debug","info","warn","error")	
	 */
	pAction.gfnLog = function(sMsg, sType)
	{
		var arrLogLevel = ["debug","info","warn","error"];
	
		if(sType == undefined)	sType = "debug";
		var nLvl = arrLogLevel.indexOf(sType);
		
		if (nLvl < this._LOG_LEVEL)		return;
		
		if (system.navigatorname == "nexacro DesignMode"
			|| system.navigatorname == "nexacro") {
			if (sMsg instanceof Object) {
				for(var x in sMsg){
					trace("[" + sType + "] " + this.name + " > " + x + " : " + sMsg[x]);
				}
			} else {
				trace("[" + sType + "] " + this.name + " > " + sMsg);
			}
		} else {
			console.log("[" + sType + "] " + this.name + " > " + sMsg);
		}
	};
	
	//===============================================================
    // nexacro.Action : Action관련 공통함수
    //===============================================================
	/**
	 * Action에서 targetview 기준으로 form 반환
	 * @return {Object} Form 객체
	 */
	// run()에서만 동작함.
	pAction.gfnGetForm = function ()				
	{				
		//var objView 		= this._findViewObject(this.targetview);
		var objView 		= this.getTargetView();
		var objForm;
		
		if(objView)objForm = objView.form;		
		else objForm = this.parent;
					
		return objForm;			
	};
	
	/**
	 * targetcomp 반환
	 * @param {String} sCompId 컴포넌트 ID
	 * @return {Object} 컴포넌트 객체
	 */
	// run()에서만 동작함.
	pAction.gfnGetTargetComp = function (sCompId)				
	{
		if (this._targetcomp) {
			return this._targetcomp;
		}
		
		var objForm = this.gfnGetForm();
		var objComp = null;
		
		if (objForm)
		{
			objComp = objForm._findComponentForArrange(sCompId);
		}
					
		return this._targetcomp = objComp;			
	};
	
	/**
	 * 데이터셋 반환(sDatasetId가 입력되지 않는 경우 objView의 viewdataset 반환)
	 * @param {Object} objView View 객체
	 * @param {String} sDatasetId 데이터셋 ID
	 * @return {Object} 데이터셋 객체
	 */
	// run()에서만 동작함.
	pAction.gfnGetDataset = function (objView, sDatasetId)
	{
		var objForm;
		var objDs;
		var objDsNm;
		
		if(objView)objForm = objView.form;		
		else objForm = this.parent;
		
		// Dataset 객체 찾기
		if (sDatasetId instanceof nexacro.NormalDataset) {				// targetgrid 설정시 해당 그리드
			objDs = sDatasetId;
		} else if (sDatasetId) {				// targetgrid 설정시 해당 그리드
			objDsNm = sDatasetId.replace("@", "");
			objDs = objForm._findDataset(objDsNm);
		} else {						// targetgrid 미설정시 View에 있는 Grid
			objDs = objView.getViewDataset();
		}

		return objDs;
	};
}
