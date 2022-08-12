//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.SearchDBAction		
// Group : Action		
//==============================================================================		
if (!nexacro.SearchDBAction)		
{		
    nexacro.SearchDBAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.SearchDBAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.SearchDBAction);		
    nexacro.SearchDBAction.prototype._type_name = "SearchDBAction";	
	
	//===============================================================		
    // nexacro.SearchDBAction : Create & Destroy		
    //===============================================================		
    nexacro.SearchDBAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.SearchDBAction : Method		
    //===============================================================		
    nexacro.SearchDBAction.prototype.run = function()		
	{	
        //canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{	
			//Transaction에서 사용할 Param정보 가져오기
			var sSvcId = this.id;
			var sService = this.serviceurl;
			var sInDs = this.inputdatasets;
			var sOutDs = this.outputdatasets;
			var sArgs = this.args;
			var sCallback = this._TRAN_CALLBACK_NM;
			
			this.gfnTransaction(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback);
		}
	};
	
	
	
	nexacro.SearchDBAction.prototype.set_servicemodel = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.SearchDBAction.prototype.serviceurl = "";
	nexacro.SearchDBAction.prototype.set_serviceurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.SearchDBAction.prototype.inputdatasets = "";
	nexacro.SearchDBAction.prototype.set_inputdatasets = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.inputdatasets != v) {
			this.inputdatasets = v;
		}
	};
	
	nexacro.SearchDBAction.prototype.outputdatasets = "";
	nexacro.SearchDBAction.prototype.set_outputdatasets = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.outputdatasets != v) {
			this.outputdatasets = v;
		}
	};
	
	nexacro.SearchDBAction.prototype.args = "";
	nexacro.SearchDBAction.prototype.set_args = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		
		if (this.args != v) {
			this.args = v;
		}
	};
// 	
// 	nexacro.SearchDBAction.prototype.async = "";
// 	nexacro.SearchDBAction.prototype.set_async = function (v)
// 	{
// 		// TODO : enter your code here.
// 		v = nexacro._toBoolean(v);
// 		
// 		if(this.async != v)
// 		{
// 			this.async = v;
// 		}
// 	};
	
	
	nexacro.SearchDBAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.SearchDBAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.SearchDBAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionErrorEventInfo(this, "onerror", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.DsCopyRowDataAction : 공통함수 전환부분
    //===============================================================
	// Transaction
	nexacro.SearchDBAction.prototype.gfnTransaction = function(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync)
	{	
		if (this.gfnIsNull(sSvcId) || this.gfnIsNull(sService))
		{
			this.gfnLog("gfnTransaction() 함수의 인자값이 부족합니다.","error");
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
		
		// Log처리용
		var dStartDate = new Date();
		var sStartTime = dStartDate.getTime();
		
		// callback에서 처리할 서비스 정보 저장
		var objSvcId = { 
			svcId		: sSvcId
		  , svcUrl    	: sService
		  , callback	: sCallback
		  , isAsync   	: bAsync
		  , startTime	: sStartTime
		};
		
		//Action Scope에 있는 CallBack 함수가 호출되도록 설정
		objForm.fnTranActionCallback = this.fnTranActionCallback;
		
		// Action정보를 폼에 설정
		if (this.gfnIsNull(objForm.targetTranAction))		objForm.targetTranAction = {};
		objForm.targetTranAction[sSvcId] = this;
		
		//Transaction 호출
		objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};
	
	// Transaction Callback
	nexacro.SearchDBAction.prototype.fnTranActionCallback = function(svcId, nErrorCd, sErrorMsg)
	{
		var objSvcId = JSON.parse(svcId);
		var sSvcId = objSvcId.svcId;
		
		var dEndDate = new Date();
		var nElapseTime = (dEndDate.getTime() - objSvcId.startTime) / 1000;
		
		var objTarget = this.targetTranAction[sSvcId];
		if (objTarget == undefined || objTarget == null)		return;
		
		// Transaction Log
		objTarget.gfnLog("ElapseTime >> " + nElapseTime + ", ErrorCd >> " + nErrorCd + ", ErrorMsg >> " + sErrorMsg);
		
		//ErrorCode가 -1보다 클 경우 onsuccess 이벤트 호출
		if(nErrorCd>-1)
		{
			objTarget.on_fire_onsuccess(sSvcId, nErrorCd, sErrorMsg);
		}
		//ErrorCode가 0보다 작을 경우 onerror 이벤트 호출
		else
		{
			objTarget.on_fire_onerror(sSvcId, nErrorCd, sErrorMsg);
		}
	};
	
}
