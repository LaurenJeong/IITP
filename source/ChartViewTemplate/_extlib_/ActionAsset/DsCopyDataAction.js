//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DsCopyDataAction		
// Group : Action		
//==============================================================================		
if (!nexacro.DsCopyDataAction)		
{		
    nexacro.DsCopyDataAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DsCopyDataAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DsCopyDataAction);		
    nexacro.DsCopyDataAction.prototype._type_name = "DsCopyDataAction";
	
	//===============================================================		
    // nexacro.DsCopyDataAction : 변수선언 부분
    //===============================================================
	nexacro.DsCopyDataAction.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	//===============================================================		
    // nexacro.DsCopyDataAction : Create & Destroy		
    //===============================================================		
    nexacro.DsCopyDataAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DsCopyDataAction : Method		
    //===============================================================		
    nexacro.DsCopyDataAction.prototype.run = function()		
	{			
		//Import the object set as TargetView			
		var objView = this.getTargetView();	
		var sTargetDs = this.targetdataset;
		var objFromView = this._findViewObject(this.fromview);
		var sFromDs = this.fromdataset;
		var sCopyType = this.copytype;
		var sFilter = this.filter;
		
		
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			var objToDs 	= this._targetdataset;
			var objFormDs	= this._fromdataset;
			
			if (objToDs == undefined)	objToDs 	= this.getDataset(objView,sTargetDs);
			if (objFormDs == undefined)	objFormDs	= this.getDataset(objFromView,sFromDs);
			
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
 			var rtn = this.gfnCopyData(objToDs,objFormDs,sCopyType,sFilter);
			
			if(rtn==0)
			{
				this.on_fire_onerror();
			}
			else
			{
				this.on_fire_onsuccess(rtn);
			}
		}
	};
	
	nexacro.DsCopyDataAction.prototype._targetdataset = null;
	nexacro.DsCopyDataAction.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DsCopyDataAction.prototype.fromview = "";
	nexacro.DsCopyDataAction.prototype._fromview = null;
	nexacro.DsCopyDataAction.prototype.set_fromview = function (v) {
		if (this.fromview !== v) {
			this.fromview = v;
			this._fromview = null;
		}
	};
	
	nexacro.DsCopyDataAction.prototype._fromdataset = null;
	nexacro.DsCopyDataAction.prototype.set_fromdataset = function (v)				
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
	
	nexacro.DsCopyDataAction.prototype.set_copytype = function (v)				
	{
		var copytype_enum = ["replace", "append"];
		if (v && copytype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.copytype != v) {			
			this.copytype = v;		
		}			
	};
	
	nexacro.DsCopyDataAction.prototype.filter = "";
	nexacro.DsCopyDataAction.prototype.set_filter = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.filter != v) {
			this.filter = v;
		}
	};
	//===============================================================		
    // nexacro.DsCopyDataAction : Event		
    //===============================================================
	nexacro.DsCopyDataAction.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DsCopyDataAction.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DsCopyDataAction.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DsCopyDataAction : 공통함수(Util)
    //===============================================================
	nexacro.DsCopyDataAction.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DsCopyDataAction.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.DsCopyDataAction : 공통함수 전환부분
    //===============================================================
	// run()에서만 동작함.
	nexacro.DsCopyDataAction.prototype.getDataset = function (objView, sDatasetId)
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
	/**
	 * @class 데이터를 복사
	 * @param {Object} objToDs - 복사 될 Dataset
	 * @param {Object} objFormDs - 복사 할 Dataset
	 * @param {String} sCopyType - 복사타입(기본값:replace)
	 * @param {String} sFilter - 필터 String
	 * @return N/A
	 */   
	nexacro.DsCopyDataAction.prototype.gfnCopyData = function (objToDs,objFormDs,sCopyType,sFilter)
	{
		var sOrgFilter = objFormDs.filterstr;
		var nCnt = 0;
		
		if (this.gfnIsNull(sOrgFilter))		sOrgFilter = "";
		
		objFormDs.set_enableevent(false);
		
		if (!this.gfnIsNull(sFilter))
		{
			objFormDs.filter("");
			objFormDs.filter(sFilter);
		}
		
		if (sCopyType == "append")
		{
			nCnt = objToDs.appendData(objFormDs, true, true);
		}
		else
		{
			nCnt = objToDs.copyData(objFormDs, true);
		}
		
		if (!this.gfnIsNull(sFilter))
		{
			objFormDs.filter(sOrgFilter);
		}
		
		objFormDs.set_enableevent(true);
		
		return nCnt;
	};
}