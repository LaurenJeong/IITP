//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsDeleteAllDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsDeleteAllDataAction)		
{		
    nexacro.DsDeleteAllDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsDeleteAllDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsDeleteAllDataAction);		
    nexacro.DsDeleteAllDataAction.prototype._type_name = "DsDeleteAllDataAction";		
	
	//===============================================================		
    // nexacro.DsDeleteAllDataAction : 변수선언 부분
    //===============================================================
	nexacro.DsDeleteAllDataAction.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	//===============================================================		
    // nexacro.DsDeleteAllDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsDeleteAllDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsDeleteAllDataAction : Method		
    //===============================================================		
    nexacro.DsDeleteAllDataAction.prototype.run = function()		
	{	
		var objForm;			
					
		//Import the object set as TargetView			
		var objView = this.getTargetView();	
		
		var sTarget = this.targetdataset;
		var sDeleteType = this.deletetype;
			
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
 			var rtn = this.gfnDeleteAll(objDs,sDeleteType);
			
			if(rtn==0)
			{
				this.on_fire_onerror(rtn);
				
			}
			else
			{
				this.on_fire_onsuccess(rtn);
			}
		}
	};	
	
	nexacro.DsDeleteAllDataAction.prototype._targetdataset = "";
	nexacro.DsDeleteAllDataAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DsDeleteAllDataAction.prototype.set_deletetype = function (v)				
	{
		var deletetype_enum = ["delete", "clear"];
		if (v && deletetype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.deletetype != v) {			
			this.deletetype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.DsDeleteAllDataAction : Event		
    //===============================================================
	nexacro.DsDeleteAllDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsDeleteAllDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsDeleteAllDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsDeleteAllDataAction : 공통함수(Util)
    //===============================================================
	nexacro.DsDeleteAllDataAction.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DsDeleteAllDataAction.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.DsDeleteAllDataAction : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet 전체삭제
	 * @param {Object} objDs - 대상 Dataset
	 * @param {String} sDeleteType - 삭제타입(기본값:delete)
	 * @return {Number} 삭제된 데이터(Row) 의 갯수를 반환
	 */   
	nexacro.DsDeleteAllDataAction.prototype.gfnDeleteAll = function (objDs, sDeleteType)
	{
		var nDeleteCnt = 0;
		
		if (sDeleteType == "clear") {
			nDeleteCnt = objDs.clearData();
		} else {
			nDeleteCnt = objDs.deleteAll();
		}
		
		return nDeleteCnt;
	};
}
