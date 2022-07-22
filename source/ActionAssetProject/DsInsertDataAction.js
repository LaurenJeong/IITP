//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsInsertDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsInsertDataAction)		
{		
    nexacro.DsInsertDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsInsertDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsInsertDataAction);		
    nexacro.DsInsertDataAction.prototype._type_name = "DsInsertDataAction";		
	
	//===============================================================		
    // nexacro.DsInsertDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsInsertDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsInsertDataAction : Method		
    //===============================================================		
    nexacro.DsInsertDataAction.prototype.run = function()		
	{			
		//Import the object set as TargetView			
		var objView = this.getTargetView();	
		
		var sTarget = this.targetdataset;
			
		var objDataset;
		var objComp;

		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			var nRowIndex = this._rowindex;
			
			var objDs = this._targetdataset;
			
			if (objDs == undefined)		objDs 	= this.gfnGetDataset(objView,sTarget);
			
			if (objDs == undefined)
			{
				trace("[Info] Dataset does not found.");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnInsertRow(objDs, nRowIndex);
			
			if (rtn >= 0)
			{
				this.on_fire_onsuccess(rtn);
				return;
			}
			else
			{
				this.on_fire_onerror(rtn);
				return;
			}
		}		
	};	
	
	nexacro.DsInsertDataAction.prototype._targetdataset = null;
	nexacro.DsInsertDataAction.prototype.set_targetdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.targetdataset != v.name) {			
				this.targetdataset = v.name;
				this._targetdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			var objForm = this.parent;
			var objDs = objForm._findDataset(v);
			if (this.targetdataset != v && objDs != undefined) {
				this.targetdataset = v;
				this._targetdataset = objDs;
			}
		}
	};
	
	nexacro.DsInsertDataAction.prototype._rowindex = -1;
	nexacro.DsInsertDataAction.prototype.set_rowindex = function (v)				
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
    // nexacro.DsInsertDataAction : Event		
    //===============================================================
	nexacro.DsInsertDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsInsertDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsInsertDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsInsertDataAction : 공통함수 전환부분
    //===============================================================
		/**
	 * @class dataSet에 행추가
	 * @param {Object} objDs - 확인 대상 Dataset
	 * @param {Number} nRowIndex - 
	 * @return {Number} 추가된 행 Index
	 */   
	nexacro.DsInsertDataAction.prototype.gfnInsertRow = function (objDs, nRowIndex)
	{
		var nRow;
		var nARow;
		
		// 행 추가 위치 계산
		if (nRowIndex >= 0) {
			nARow = nRowIndex;
		} else if (objDs.rowposition < 0) {
			nARow = 0;
		} else {
			nARow = objDs.rowposition;
		}
		
		// 행추가
		nRow = objDs.insertRow(nARow);
		
		// TODO : 추가된 행에 데이터 설정
		//var oModelArg = this.getContents("model");
		
		return nRow;
	};
}
