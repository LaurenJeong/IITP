//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.RestAPIAction		
// Group : Action		
//==============================================================================		
if (!nexacro.RestAPIAction)		
{		
    nexacro.RestAPIAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.RestAPIAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.RestAPIAction);		
    nexacro.RestAPIAction.prototype._type_name = "RestAPIAction";
	
	//===============================================================
    // nexacro.RestAPIAction : 변수선언 부분
    //===============================================================
	nexacro.RestAPIAction.prototype._LOG_LEVEL			= -1;								// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	nexacro.RestAPIAction.prototype._oRequestInfo		= {};								// request()용 정보저장 객체
	
	//===============================================================		
    // nexacro.RestAPIAction : Create & Destroy		
    //===============================================================		
    nexacro.RestAPIAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
	
	//===============================================================
    // nexacro.RestAPIAction : Action관련 공통함수
    //===============================================================
	/**
	 * Action에서 targetview 기준으로 form 반환
	 * @return {Object} Form 객체
	 */
	// run()에서만 동작함.
	nexacro.RestAPIAction.prototype.gfnGetForm = function ()				
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
	nexacro.RestAPIAction.prototype.gfnGetTargetComp = function (sCompId)				
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
	nexacro.RestAPIAction.prototype.gfnGetDataset = function (objView, sDatasetId)
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
	//===============================================================
    // nexacro.RestAPIAction : 공통함수(Util)
    //===============================================================
	/**
	 * @class 값이 존재하는지 여부 체크 <br>
	 * @param {String} sValue	
	 * @return {Boolean} true/false
	 * @example
	 * var bNull = this.gfnIsNull("aaa");	// false
	 */
	nexacro.RestAPIAction.prototype.gfnIsNull = function (Val)				
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
	nexacro.RestAPIAction.prototype.gfnLog = function(sMsg, sType)
	{
		var arrLogLevel = ["debug","info","warn","error"];
	
		if(sType == undefined)	sType = "debug";
		var nLvl = arrLogLevel.indexOf(sType);
		
		if (nLvl < this._LOG_LEVEL)		return;
		
		var sLog = "";
		
		if (sMsg instanceof Object) {
			sLog = "[" + sType + "] " + this.name + " > " + JSON.stringify(sMsg, null, "\t");
		} else {
			sLog = "[" + sType + "] " + this.name + " > " + sMsg;
		}
		
		if (system.navigatorname == "nexacro DesignMode"
			|| system.navigatorname == "nexacro") {
			trace(sLog);
		} else {
			console.log(sLog);
		}
	};
	
    //===============================================================		
    // nexacro.RestAPIAction : Method		
    //===============================================================		
    nexacro.RestAPIAction.prototype.run = function()		
	{	
        //canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{	
			//Transaction에서 사용할 Param정보 가져오기
			var sSvcId = this.id;
			var sServiceURL = this.serviceurl;
			var sRootpath = this.rootpath;
			var sCallback = this._TRAN_CALLBACK_NM;
			
			this.gfnLoadData(sSvcId, sServiceURL, sRootpath, sCallback);
		}
	};
	
	
	
	nexacro.RestAPIAction.prototype.set_servicemodel = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.RestAPIAction.prototype.serviceurl = "";
	nexacro.RestAPIAction.prototype.set_serviceurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.RestAPIAction.prototype.rootpath = "";
	nexacro.RestAPIAction.prototype.set_rootpath = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		
		if (this.rootpath != v) {
			this.rootpath = v;
		}
	};
	
	nexacro.RestAPIAction.prototype._targetdataset = null;
	nexacro.RestAPIAction.prototype.set_targetdataset = function (v)				
	{				
		if (v instanceof nexacro.NormalDataset) {
			if (this.targetdataset != v.name) {			
				this.targetdataset = v.name;
				this._targetdataset = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.targetdataset != v) {
				this.targetdataset = v;
				this._targetdataset = null;
				
				var objView = this.getTargetView();	
				if (objView)
				{
					var objForm = objView.form;
					var objDs = objForm._findDataset(v);
					
					if (objDs != undefined) {
						this._targetdataset = objDs;
		 			}
				}
			}
		}
	};
	
	nexacro.RestAPIAction.prototype._targetdataobject = null;
	nexacro.RestAPIAction.prototype.set_targetdataobject = function (v)				
	{				
		if (v instanceof nexacro.DataObject) {
			if (this.targetdataobject != v.name) {			
				this.targetdataobject = v.name;
				this._targetdataobject = v;
			}		
		} else {
			v = nexacro._toString(v);
			
			if (this.targetdataset != v) {
				this.targetdataobject = v;
				this._targetdataobject = null;
			}
		}
	};

	
	nexacro.RestAPIAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.RestAPIAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.RestAPIAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    //  공통함수 전환부분
    //===============================================================
	// Transaction
	nexacro.RestAPIAction.prototype.gfnLoadData = function(sSvcId, sServiceURL, sRootpath, sCallback, bAsync)
	{	
		if (this.gfnIsNull(sSvcId))
		{
			this.gfnLog("gfnLoadData() 함수의 인자값이 부족합니다.","error");
			return false;
		}
		
		// callback 함수 기본값 설정
		if (this.gfnIsNull(sCallback)) {
			sCallback = this._TRAN_CALLBACK_NM;
		}
		
		// Async
		if ((bAsync != true) && (bAsync != false)) {
			bAsync = true;	
		}
		
		var objForm = this.gfnGetForm();
		var objView = this.getTargetView();	
		
		// ----------------------------------------------------
		// 1) Dataset 객체 찾기
		// ----------------------------------------------------
		var sTargetDs = this.targetdataset;
		var objDs = this._targetdataset;
		
		if (this.gfnIsNull(objDs))		objDs 	= this.gfnGetDataset(objView,sTargetDs);
		
		if (this.gfnIsNull(objDs))
		{
			this.gfnLog("Dataset does not found.","info");
			this.on_fire_onerror("error");
			return;
		}
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 2) DataObject 객체 찾기
		// ----------------------------------------------------
		var sTargetDo = this.targetdataobject;
		var objDo;
		
		// targetdataobject 미설정시 view에 viewdataobject 생성
		if (this.gfnIsNull(sTargetDo))
		{
			sTargetDo = "viewdataobject";
			
			// Form에 DataObject있는지 체크
			var bRet = objForm.isValidObject(sTargetDo);
			
			// Form에 DataObject이 있는 경우 oDataset에 셋팅, 없는 경우 생성 후 셋팅
			if (bRet)
			{
				objDo = objForm.all[sTargetDo];
			}
			else
			{
				//objDo = new DataObject(sTargetDo, objForm);	
				objDo = new DataObject();	
				objForm.addChild(sTargetDo, objDo);
			}
		}
		else
		{
			objDo = objDs._findDataObject(sTargetDo);
		}
		
		if (this.gfnIsNull(objDo))
		{
			this.gfnLog("Dataobject does not found.","info");
			this.on_fire_onerror("error");
			return;
		}
		
		if(this.gfnIsNull(sServiceURL))		sServiceURL = objDo.url;
		if (this.gfnIsNull(sServiceURL))
		{
			this.gfnLog("Service URL does not found.","info");
			this.on_fire_onerror("error");
			return;
		}
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 3) Dataset에 DataObject 정보 설정
		// ----------------------------------------------------
		objDs.set_binddataobject(sTargetDo);
		// - dataobjectpath값 설정
		objDs.set_dataobjectpath(sRootpath);
		// - datapath에 @.fieldid 설정
		var objColInfo;
		for (var i = 0; i < objDs.getColCount(); i++) 
		{
			objColInfo = objDs.getColumnInfo(i);
			objColInfo.set_datapath("@."+objColInfo.id);
		}
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 4) Action의 onsuccess, onerror 처리를 위해 이벤트 추가
		// ----------------------------------------------------
		//DataObject 데이터 로딩 성공 시 이벤트는 다음 순서로 발생합니다.
		//request: DataObject.onsuccess -> DataObject.onload -> Dataset.onload
		//load: DataObject.onload -> Dataset.onload

		//request 정보 담을 객체 초기화
		this._oRequestInfo		= {"serviceid":sSvcId, "errorcode" : null, "responsedata" : null};
		
		// DataObjec 이벤트 추가
		//objDo.addEventHandler("onsuccess", this.gfnDataObjectOnsuccess, this);
		objDo.addEventHandler("onload", this.gfnDataObjectOnload, this);
		objDo.addEventHandler("onerror", this.gfnDataObjectOnerror, this);
		
		// Dataset 이벤트 추가
		objDs.insertEventHandler("onload", 0, this.gfnDataSetOnload, this);
		// ----------------------------------------------------
		
		// ----------------------------------------------------
		// 5) DataObject request()실행
		objDo.request(sSvcId,"GET",sServiceURL);
		// ----------------------------------------------------
		
		//this.gfnLog("id : " + objDs.id + "/ binddataobject : " + objDs.binddataobject + "/ dataobjectpath : " + objDs.dataobjectpath + "/ " + objDs.saveXML());
	};
	
// 	nexacro.RestAPIAction.prototype.gfnDataObjectOnsuccess = function(obj, e)
// 	{	
// 		this.on_fire_onsuccess(e.serviceid, e.statuscode, e.response);
// 	};
	
	nexacro.RestAPIAction.prototype.gfnDataObjectOnload = function(obj, e)
	{
		// request() 정보설정
		this._oRequestInfo["errorcode"] = e.reason;
		this._oRequestInfo["responsedata"] = obj.getResponse();
	};
	
	nexacro.RestAPIAction.prototype.gfnDataSetOnload = function(obj, e)
	{
		if (this._oRequestInfo["serviceid"] == this.id)
		{
			// 이벤트 발생
			this.on_fire_onsuccess(this._oRequestInfo["serviceid"], this._oRequestInfo["errorcode"], this._oRequestInfo["responsedata"]);
			
			// 초기화
			this._oRequestInfo = {};
			obj.removeEventHandlerLookup("onload", this.gfnDataSetOnload, this);
		}
	};

	nexacro.RestAPIAction.prototype.gfnDataObjectOnerror = function(obj,  e)
	{
		this.on_fire_onerror(this.id,e.statuscode,e.errormsg);	
	};
}