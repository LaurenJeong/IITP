//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsCopyRowDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsCopyRowDataAction)		
{		
    nexacro.DsCopyRowDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsCopyRowDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsCopyRowDataAction);		
    nexacro.DsCopyRowDataAction.prototype._type_name = "DsCopyRowDataAction";		
	
	//===============================================================		
    // nexacro.DsCopyRowDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsCopyRowDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsCopyRowDataAction : Method		
    //===============================================================		
    nexacro.DsCopyRowDataAction.prototype.run = function()		
	{	
        //Import the object set as TargetView			
		var objView = this.getTargetView();	
		var sTargetDs = this.targetdataset;
		var nTargetRow;
		var objFromView = this._findViewObject(this.fromview);
		var sFromDs = this.fromdataset;
		var nFromRow;
		
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			var objToDs 	= this._targetdataset;
			var objFormDs	= this._fromdataset;
			
			if (objToDs == undefined)	objToDs 	= this.gfnGetDataset(objView,sTargetDs);
			if (objFormDs == undefined)	objFormDs	= this.gfnGetDataset(objFromView,sFromDs);
			
			if (objToDs == undefined)
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			if (objFormDs == undefined)
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			// Call Function
 			this.gfnCopyRowData(objToDs,objFormDs,nTargetRow,nFromRow);
		}	
	};	
	
	nexacro.DsCopyRowDataAction.prototype._targetdataset = null;
	nexacro.DsCopyRowDataAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DsCopyRowDataAction.prototype.fromview = "";
	nexacro.DsCopyRowDataAction.prototype._fromview = null;
	nexacro.DsCopyRowDataAction.prototype.set_fromview = function (v) {
		if (this.fromview !== v) {
			this.fromview = v;
			this._fromview = null;
		}
	};
	
	nexacro.DsCopyRowDataAction.prototype._fromdataset = null;
	nexacro.DsCopyRowDataAction.prototype.set_fromdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.fromdataset != v.name) {			
				this.fromdataset = v.name;
				this._fromdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			var objForm = this.parent;
			var objDs = objForm._findDataset(v);
			if (this.fromdataset != v && objDs != undefined) {
				this.fromdataset = v;
				this._fromdataset = objDs;
			}
		}
	};
	
	nexacro.DsCopyRowDataAction.prototype.targetrow = -1;
	nexacro.DsCopyRowDataAction.prototype.set_targetrow = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.targetrow != v) {
			this.targetrow = v;
		}
	};
	
	nexacro.DsCopyRowDataAction.prototype.fromrow = -1;
	nexacro.DsCopyRowDataAction.prototype.set_fromrow = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.fromrow != v) {
			this.fromrow = v;
		}
	};
	
	//===============================================================		
    // nexacro.DsCopyRowDataAction : Event		
    //===============================================================
	nexacro.DsCopyRowDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsCopyRowDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsCopyRowDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsCopyRowDataAction : 공통함수 전환부분
    //===============================================================
	/**
	 * @class 데이터를 복사
	 * @param {Object} objToDs - 복사 될 Dataset
	 * @param {Object} objFormDs - 복사 할 Dataset
	 * @param {String} nToRow - 복사 될 Row
	 * @param {String} nFromRow - 복사 할 Row
	 * @return N/A
	 */   
	nexacro.DsCopyRowDataAction.prototype.gfnCopyRowData = function (objToDs,objFormDs,nToRow,nFromRow)
	{
		if (this.gfnIsNull(nToRow))			nToRow = objToDs.rowposition;
		if (this.gfnIsNull(nFromRow))		nFromRow = objFormDs.rowposition;
		
		if (nFromRow < 0 || objFormDs.rowcount == 0)
		{
			this.gfnLog("선택된 행이 없습니다.","info");
			this.on_fire_onerror();
			return;
		}
		
		// To Dataset 처리
		if (nToRow < 0)
		{
			if (objToDs.rowcount == 0)		// To Dataset에 데이터 없는 경우 행 1개 추가
			{
				nToRow = objToDs.addRow();
			}
			else
			{
				nToRow = 0;
			}
		}
		
		var rtn = objToDs.copyRow(nToRow, objFormDs, nFromRow);
		
		if (rtn == false)
		{
			this.on_fire_onerror();
		}
		else
		{
			this.on_fire_onsuccess();
		}
	};
}