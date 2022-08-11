//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.APIInzentTranAction		
// Group : Action		
//==============================================================================		
if (!nexacro.APIInzentTranAction)		
{		
    nexacro.APIInzentTranAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.APIInzentTranAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.APIInzentTranAction);		
    nexacro.APIInzentTranAction.prototype._type_name = "APIInzentTranAction";	
	
	//===============================================================
    // nexacro.APIInzentTranAction : 변수선언 부분
    //===============================================================
	nexacro.APIInzentTranAction.prototype._LOG_LEVEL			= -1;							// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	nexacro.APIInzentTranAction.prototype._TRAN_CALLBACK_NM		= "gfnTranActionCallback";		// Action공통 Callback함수명
	
	// Inzent Service URL prefix로 전환용
	nexacro.APIInzentTranAction.prototype._INZENT_SVC_PREFIX	= "svc::";						// prefix ID
	nexacro.APIInzentTranAction.prototype._INZENT_SVC_URL		= "http://59.10.169.3:28080/";	// Inzent Service URL
	
	//===============================================================
    // nexacro.APIInzentTranAction : Action관련 공통함수
    //===============================================================
	/**
	 * Action에서 targetview 기준으로 form 반환
	 * @return {Object} Form 객체
	 */
	// run()에서만 동작함.
	nexacro.APIInzentTranAction.prototype.gfnGetForm = function ()				
	{				
		//var objView 		= this._findViewObject(this.targetview);
		var objView 		= this.getTargetView();
		var objForm;
		
		if(objView)objForm = objView.form;		
		else objForm = this.parent;
				
		return objForm;			
	};
	
	//===============================================================
    // nexacro.APIInzentTranAction : 공통함수(Util)
    //===============================================================
	/**
	 * @class 값이 존재하는지 여부 체크 <br>
	 * @param {String} sValue	
	 * @return {Boolean} true/false
	 * @example
	 * var bNull = this.gfnIsNull("aaa");	// false
	 */
	nexacro.APIInzentTranAction.prototype.gfnIsNull = function (Val)				
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
	nexacro.APIInzentTranAction.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.APIInzentTranAction : Create & Destroy		
    //===============================================================		
    nexacro.APIInzentTranAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.APIInzentTranAction : Method		
    //===============================================================		
    nexacro.APIInzentTranAction.prototype.run = function()		
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
	
	nexacro.APIInzentTranAction.prototype.set_servicemodel = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.APIInzentTranAction.prototype.serviceurl = "";
	nexacro.APIInzentTranAction.prototype.set_serviceurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.APIInzentTranAction.prototype.inputdatasets = "";
	nexacro.APIInzentTranAction.prototype.set_inputdatasets = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.inputdatasets != v) {
			this.inputdatasets = v;
		}
	};
	
	nexacro.APIInzentTranAction.prototype.outputdatasets = "";
	nexacro.APIInzentTranAction.prototype.set_outputdatasets = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.outputdatasets != v) {
			this.outputdatasets = v;
		}
	};
	
	nexacro.APIInzentTranAction.prototype.args = "";
	nexacro.APIInzentTranAction.prototype.set_args = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		
		if (this.args != v) {
			this.args = v;
		}
	};
// 	
// 	nexacro.APIInzentTranAction.prototype.async = "";
// 	nexacro.APIInzentTranAction.prototype.set_async = function (v)
// 	{
// 		// TODO : enter your code here.
// 		v = nexacro._toBoolean(v);
// 		
// 		if(this.async != v)
// 		{
// 			this.async = v;
// 		}
// 	};
	
	
	nexacro.APIInzentTranAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.APIInzentTranAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.APIInzentTranAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
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
	nexacro.APIInzentTranAction.prototype.gfnTransaction = function(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync)
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
		
		// TODO : Inzent용 Service URL 전환
		if (this.gfnIsNull(sService) == false) {
			sService = nexacro.replaceAll(sService,this._INZENT_SVC_URL,this._INZENT_SVC_PREFIX);
		}
		
		// Inzent용 Dataset 생성 및 InputDataset 정보 반환
		var sAddInDs = this.gfnSetInzentDataset(objForm);
		if (this.gfnIsNull(sAddInDs) == false) {
			sInDs = sAddInDs + " " + sInDs;
		}
		
		// Log처리용
		var dStartDate = new Date();
		var sStartTime = dStartDate.getTime();
		
		// 1. callback에서 처리할 서비스 정보 저장
		var objSvcId = { 
			svcId		: sSvcId
		  , svcUrl    	: sService
		  , callback	: sCallback
		  , isAsync   	: bAsync
		  , startTime	: sStartTime
		};
		
		//Action Scope에 있는 CallBack 함수가 호출되도록 설정
		objForm.gfnTranActionCallback = this.gfnTranActionCallback;
		
		if (this.gfnIsNull(objForm.targetTranAction))		objForm.targetTranAction = {};
		objForm.targetTranAction[sSvcId] = this;
		
		//Transaction 호출
		objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};
	
	// Transaction Callback
	nexacro.APIInzentTranAction.prototype.gfnTranActionCallback = function(svcId, nErrorCd, sErrorMsg)
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
	
	// Inzent 통신용 Dataset 생성 및 InputDataset 정보 반환
	nexacro.APIInzentTranAction.prototype.gfnSetInzentDataset = function(objForm)
	{
		var sReference = this.getContents("reference");		// Action 내 reference 정보 
		
		if (this.gfnIsNull(sReference))		return "";
		
		// DomParser용 Reference Tag 추가
		sReference = "<Reference>" + sReference + "</Reference>";
	
		var domPar = new nexacro.DomParser();
		var objXml = new nexacro.XmlSerializer();
		var domDoc;
		var referenceNode, childNode;
		
		var oDataset;
		var sDatasetId;
		var sDatasetXML;
		var bRet;
		
		// Inzent 연동용 input dataset Array
		var aInzentDs = new Array();

		// reference 정보를 Dom객체로 전환
		domDoc = domPar.parseFromString(sReference);
		
		// reference Node
		referenceNode = domDoc.firstChild;
		if(!referenceNode)		return "";
		
		// 첫번째 Node
		childNode = referenceNode.firstChild;
		
		while(childNode)
		{
			// Dataset Tag일때 
			if (childNode.tagName == "Dataset" && childNode.hasAttributes("id"))
			{
				sDatasetId = childNode.getAttribute("id");
				sDatasetXML = objXml.serializeToString(childNode);
				oDataset = null;
				
				// Input Dataset용 Array
				aInzentDs.push(sDatasetId+"="+sDatasetId);
				
				// Form에 Dataset있는지 체크
				bRet = objForm.isValidObject(sDatasetId);
				
				// Form에 Dataset이 있는 경우 oDataset에 셋팅, 없는 경우 생성 후 셋팅
				if (bRet)
				{
					oDataset = objForm.all[sDatasetId];
				}
				else
				{
					oDataset = new Dataset();
					objForm.addChild(sDatasetId, oDataset);
				}
				
				// Dataset에 XML Load
				if (oDataset)
				{
					oDataset.loadXML(sDatasetXML);
				}
			}
			
			// 다음 Node
			childNode = childNode.nextSibling;
		}
		
		// Return Input Ds
		return aInzentDs.join(" ");
	};
}