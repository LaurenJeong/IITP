//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsResetDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsResetDataAction)		
{		
    nexacro.DsResetDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsResetDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsResetDataAction);		
    nexacro.DsResetDataAction.prototype._type_name = "DsResetDataAction";		
	
	//===============================================================		
    // nexacro.DsResetDataAction : 변수선언 부분
    //===============================================================
	nexacro.DsResetDataAction.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	//===============================================================		
    // nexacro.DsResetDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsResetDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsResetDataAction : Method		
    //===============================================================		
    nexacro.DsResetDataAction.prototype.run = function()		
	{	
		var objForm;			
					
		//Import the object set as TargetView			
		var objView = this.getTargetView();	
		
		var sTarget = this.targetdataset;
		var sResetType = this.resettype;
			
		var objDataset;
		var objComp;

		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			//If the TargetView is set as View, not Form		
			if(objView)objForm = objView.form;		
			else objForm = this.parent;
			
			var objDs;
			
			// Dataset 객체 찾기
			if (sTarget) {				// targetgrid 설정시 해당 그리드
				sTarget = sTarget.replace("@", "");
				objDs = objForm._findDataset(sTarget);
			} else {						// targetgrid 미설정시 View에 있는 Grid
				objDs = objView.getViewDataset();
			}
			
			if (objDs == undefined)
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			this.gfnReset(objDs,sResetType);
		}
	};	
	
	nexacro.DsResetDataAction.prototype._targetdataset = "";
	nexacro.DsResetDataAction.prototype.set_targetdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.targetdataset != v) {			
				this.targetdataset = v;
				this._targetdataset = v.name;
			}		
		} else {
			v = nexacro._toString(v);
			
			var objForm = this.parent;
			var objDs = objForm._findDataset(v);
			if (this._targetdataset != v && objDs != undefined) {
				this._targetdataset = v;
				this.targetdataset = objDs;
			}
		}
	};
	
	nexacro.DsResetDataAction.prototype.set_resettype = function (v)				
	{
		var resettype_enum = ["all", "row"];
		if (v && resettype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.resettype != v) {			
			this.resettype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.DsResetDataAction : Event		
    //===============================================================
	nexacro.DsResetDataAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionRunEventInfo 생성
		  var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
		  
		  //true/false 리턴값을 받기 위해 _fireCheckEvent 함수 실행
		  return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
	};
	
	nexacro.DsResetDataAction.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionSuccessEventInfo 생성
		  var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	  
	nexacro.DsResetDataAction.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionErrorEventInfo 생성
		  var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.DsResetDataAction : 공통함수(Util)
    //===============================================================
	nexacro.DsResetDataAction.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DsResetDataAction.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.DsResetDataAction : 공통함수 전환부분
    //===============================================================
	/**
	 * @class 데이터를 마지막 저장 상태로 복구
	 * @param {Object} objDs - 대상 Dataset
	 * @param {String} sResetType - 데이터 복구타입(기본값:all)
	 * @return N/A
	 */   
	nexacro.DsResetDataAction.prototype.gfnReset = function (objDs, sResetType)
	{
		if (sResetType == "row")
		{
			var nRow = objDs.rowposition;
			
			if (nRow < 0)
			{
				this.on_fire_onerror();
				return;
			}
			
			// 데이터셋 행 초기화
			this.gfnResetRow(objDs, nRow);
			
		} else {
			objDs.reset();
		}
		
		// 성공 이벤트 발생
		this.on_fire_onsuccess();
	};
	
	/**
	 * @class 데이터셋 행초기화
	 * @param 	{Object} objDs - 대상 데이터셋 객체
	 * @param	{Number} nRow - 초기화할 행 Index(없는 경우 현재Row 초기화처리)
	 * @return	N/A
	 */
	nexacro.DsResetDataAction.prototype.gfnResetRow = function (objDs, nRow)
	{
		if (this.gfnIsNull(nRow))		nRow = objDs.rowposition;
		var nRowType = objDs.getRowType(nRow);
		
		if (nRowType == Dataset.ROWTYPE_INSERT) {					// 신규인 경우 행삭제
			objDs.deleteRow(nRow);
		} else if (nRowType == Dataset.ROWTYPE_UPDATE) {			// 수정인 경우 초기화
			// 컬럼값 초기화
			for (var i = 0, s = objDs.getColCount(); i < s; i++) {
				objDs.setColumn(nRow, i, objDs.getOrgColumn(nRow, i));
			}
		}
	};
}
