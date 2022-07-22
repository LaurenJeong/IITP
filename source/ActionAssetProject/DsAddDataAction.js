﻿//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsAddDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsAddDataAction)		
{		
    nexacro.DsAddDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsAddDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsAddDataAction);		
    nexacro.DsAddDataAction.prototype._type_name = "DsAddDataAction";		
	
	//===============================================================		
    // nexacro.DsAddDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsAddDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsAddDataAction : Method		
    //===============================================================		
    nexacro.DsAddDataAction.prototype.run = function()		
	{	
		//Import the object set as TargetView			
		var objView = this.getTargetView();	
		
		var sTarget = this.targetdataset;
			
		var objDataset;
		var objComp;

		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			var objDs = this._targetdataset;
			
			if (objDs == undefined)		objDs 	= this.gfnGetDataset(objView,sTarget);
			
			if (objDs == undefined)
			{
				trace("[Info] Dataset does not found.");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			var rtn = this.gfnAddRow(objDs);
			
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
	
	nexacro.DsAddDataAction.prototype._targetdataset = null;
	nexacro.DsAddDataAction.prototype.set_targetdataset = function (v)				
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
	
	//===============================================================		
    // nexacro.DsAddDataAction : Event		
    //===============================================================
	nexacro.DsAddDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsAddDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsAddDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsAddDataAction : 공통함수 전환부분
    //===============================================================
	/**
	 * @class Dataset에 행추가
	 * @param {Object} objDs - 대상 Dataset
	 * @return {Number} 추가된 행 Index
	 */   
	nexacro.DsAddDataAction.prototype.gfnAddRow = function (objDs)
	{
		var nRow;
		
		// 행추가
		nRow = objDs.addRow();
		
		// TODO : 추가된 행에 데이터 설정
		//var oModelArg = this.getContents("model");
		
		return nRow;
	};
}
