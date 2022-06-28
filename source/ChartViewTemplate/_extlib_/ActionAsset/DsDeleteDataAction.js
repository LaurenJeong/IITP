//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsDeleteDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsDeleteDataAction)		
{		
    nexacro.DsDeleteDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsDeleteDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsDeleteDataAction);		
    nexacro.DsDeleteDataAction.prototype._type_name = "DsDeleteDataAction";
	
	//===============================================================		
    // nexacro.DsDeleteDataAction : 변수선언 부분
    //===============================================================
	nexacro.DsDeleteDataAction.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	//===============================================================		
    // nexacro.DsDeleteDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsDeleteDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsDeleteDataAction : Method		
    //===============================================================		
    nexacro.DsDeleteDataAction.prototype.run = function()		
	{	
        var objForm;			
					
		//Import the object set as TargetView			
		var objView = this.getTargetView();	
		
		var sTarget = this.targetdataset;
			
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
				this.gfnLog("[Info] Dataset does not found.");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnDeleteRow(objDs);
			
			if(rtn==false)
			{
				this.on_fire_onerror();
				
			}
			else
			{
				this.on_fire_onsuccess();
			}
		}	
	};	
	
	nexacro.DsDeleteDataAction.prototype._targetdataset = "";
	nexacro.DsDeleteDataAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DsDeleteDataAction.prototype._rowindex = -1;
	nexacro.DsDeleteDataAction.prototype.set_rowindex = function (v)				
	{
		var nRow = nexacro.toNumber(v,-1,-1,-1);
		
		// TODO : enter your code here.
		if (nRow < 0) {
			this._rowindex = -1;
		} else {
			this._rowindex = nRow;
		}
	};
	
	//===============================================================		
    // nexacro.DsDeleteDataAction : Event		
    //===============================================================
	nexacro.DsDeleteDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsDeleteDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsDeleteDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsDeleteDataAction : 공통함수(Util)
    //===============================================================
	nexacro.DsDeleteDataAction.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DsDeleteDataAction.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.DsDeleteDataAction : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet에 행삭제
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @param {Number} nRowIndex - 필터된 데이터 체크여부(기본값:false)
	 * @return {Boolean} 삭제 성공실패여부
	 */   
	nexacro.DsDeleteDataAction.prototype.gfnDeleteRow = function (objDs)
	{
		var bSucc = objDs.deleteRow(objDs.rowposition);
		
		return bSucc;
	};
}
