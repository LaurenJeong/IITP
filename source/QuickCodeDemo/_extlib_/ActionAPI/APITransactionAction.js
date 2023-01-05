//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.APITransactionAction		
// Group : Action		
//==============================================================================		
if (!nexacro.APITransactionAction)		
{
    nexacro.APITransactionAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.APITransactionAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.APITransactionAction);		
    nexacro.APITransactionAction.prototype._type_name = "APITransactionAction";	
	
	//===============================================================
    // nexacro.APITransactionAction : 변수선언 부분
    //===============================================================
	nexacro.APITransactionAction.prototype._LOG_LEVEL			= -1;							// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	
	nexacro.APITransactionAction.prototype._TRAN_CALLBACK_NM		= "fnTranActionCallback";		// Action공통 Callback함수명
	
	// Service URL prefix로 전환용
	nexacro.APITransactionAction.prototype._API_SVC_PREFIX	= "svc::";						// prefix ID
	nexacro.APITransactionAction.prototype._API_SVC_URL		= "http://172.10.12.58:28080/";	// Service URL
	
	//===============================================================
    // nexacro.APITransactionAction : Action관련 공통함수
    //===============================================================
	/**
	 * Action에서 targetview 기준으로 form 반환
	 * @return {Object} Form 객체
	 */
	// run()에서만 동작함.
	nexacro.APITransactionAction.prototype.gfnGetForm = function ()				
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
	nexacro.APITransactionAction.prototype.gfnGetTargetComp = function (sCompId)				
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
	nexacro.APITransactionAction.prototype.gfnGetDataset = function (objView, sDatasetId)
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
    // nexacro.APITransactionAction : 공통함수(Util)
    //===============================================================
	/**
	 * @class 값이 존재하는지 여부 체크 <br>
	 * @param {String} sValue	
	 * @return {Boolean} true/false
	 * @example
	 * var bNull = this.gfnIsNull("aaa");	// false
	 */
	nexacro.APITransactionAction.prototype.gfnIsNull = function (Val)				
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
	nexacro.APITransactionAction.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.APITransactionAction : Create & Destroy		
    //===============================================================		
    nexacro.APITransactionAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.APITransactionAction : Method		
    //===============================================================		
    nexacro.APITransactionAction.prototype.run = function()		
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
	
	nexacro.APITransactionAction.prototype.set_servicemodel = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.APITransactionAction.prototype.serviceurl = "";
	nexacro.APITransactionAction.prototype.set_serviceurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.APITransactionAction.prototype.inputdatasets = "";
	nexacro.APITransactionAction.prototype.set_inputdatasets = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.inputdatasets != v) {
			this.inputdatasets = v;
		}
	};
	
	nexacro.APITransactionAction.prototype.outputdatasets = "";
	nexacro.APITransactionAction.prototype.set_outputdatasets = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.outputdatasets != v) {
			this.outputdatasets = v;
		}
	};
	
	nexacro.APITransactionAction.prototype.args = "";
	nexacro.APITransactionAction.prototype.set_args = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		
		if (this.args != v) {
			this.args = v;
		}
	};
// 	
// 	nexacro.APITransactionAction.prototype.async = "";
// 	nexacro.APITransactionAction.prototype.set_async = function (v)
// 	{
// 		// TODO : enter your code here.
// 		v = nexacro._toBoolean(v);
// 		
// 		if(this.async != v)
// 		{
// 			this.async = v;
// 		}
// 	};
	
	
	nexacro.APITransactionAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.APITransactionAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.APITransactionAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
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
	nexacro.APITransactionAction.prototype.gfnTransaction = function(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync)
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
		
		// Model Argument 처리 : 해당 데이터셋에 value값 설정
		this.gfnSetModelArgument(objForm);
		
		// User Argument 처리 : transaction Argument로 추가
		var sAddArg = this.gfnSetUserArgument(objForm);
		if (this.gfnIsNull(sAddArg) == false) {
			sArgs = sAddArg + " " + sArgs;
		}
		
		// TODO : Service URL 전환
		if (this.gfnIsNull(sService) == false) {
			sService = nexacro.replaceAll(sService,this._API_SVC_URL,this._API_SVC_PREFIX);
		}
		
		// API용 Dataset 생성 및 InputDataset 정보 반환
		var sAddInDs = this.gfnSetAPIDataset(objForm);
		if (this.gfnIsNull(sAddInDs) == false) {
			sInDs = sAddInDs + " " + sInDs;
		}
		
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
	nexacro.APITransactionAction.prototype.fnTranActionCallback = function(svcId, nErrorCd, sErrorMsg)
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
	
	// Model Argument 처리 : 해당 데이터셋에 value값 설정
	nexacro.APITransactionAction.prototype.gfnSetModelArgument = function(objForm)
	{
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		//this.gfnLog("model >>> ");
		//this.gfnLog(oModelList);
		
		if (!oModelList)
            return;
		
		var sViewId;
		var sModelId;
		var sIOType;
		var oFieldList;
		
		var oModel;
		var oView;
		var oViewDataset;
		var oField;
		
		var nRow;
		var sFieldValue;
		
		for (var i = 0; i < oModelList.length; i++)
        {
			oModel		= oModelList[i];
			
			sViewId		= oModel["viewid"];
			sModelId	= oModel["modelid"];
			sIOType		= oModel["iotype"];
			oFieldList	= oModel["fieldlist"];
			
			// Model이 사용된 View 객체
			oView		= objForm._findComponentForArrange(sViewId);
			
			if (oView)
			{
				oViewDataset = oView.getViewDataset();								// viewdataset
				nRow = oViewDataset.rowposition ? oViewDataset.rowposition : 0;		// rowposition
				
				if (oViewDataset && oViewDataset._type_name == "Dataset")
				{
					for (var j = 0; j < oFieldList.length; j++)
					{
						oField = oFieldList[j];
						
						// Field의 value값 반환
						sFieldValue = this.gfnGetFieldValue(oField, oView, oViewDataset);
						
						// 데이터 셋팅
						oViewDataset.setColumn(nRow, oField["fieldid"], sFieldValue);
					}
				}
			}
		}
	};
	
	// Field의 value값 반환
	nexacro.APITransactionAction.prototype.gfnGetFieldValue = function(oField, oView)
	{
		var sReturnValue;
		
		if (this.gfnIsNull(oField))				return;
		
		var sFieldName	= oField["name"];
		var sFieldValue	= oField["value"];
		
		if (this.gfnIsNull(sFieldValue))		return;
		
		var sType = sFieldValue.toString().substr(0,5).toLowerCase();
		
		switch (sType)
		{
			case "expr:":
				var sExprText = sFieldValue.toString().substr(5);
				
				// expr 전환시 기준이 될 view name
				var sViewNm = oView ? oView.name : this.targetview;
				
				// expr Text 처리
				sExprText = this.gfnGetExprText(sExprText,sViewNm);
				
				sReturnValue = eval(sExprText);
				break;
			default:
				sReturnValue = sFieldValue;
				break;
		}
		
		//this.gfnLog(sFieldName + " : " +sReturnValue);
		
		return sReturnValue;
	};
	
	// expr Text 처리
	nexacro.APITransactionAction.prototype.gfnGetExprText = function(sExprText, sViewNm)
	{
		if (this.gfnIsNull(sExprText))				return sExprText;
		
		var sRetText = sExprText;
		
		// 1) '['와 ']' 사이값 추출
		// [field] 형식 : targetview의 viewdataset field컬럼값 반환 
		// [view:field] 형식 : view의 viewdataset field컬럼값 반환 
		// [view:datasetid:field] 형식 : view의 datasetid field컬럼값 반환
		// [view:datasetid:row:field] 형식 : view의 datasetid의 row행 field컬럼값 반환
		//var regEx = /(?<=\[)(.*?)(?=\])/g;
		//var regEx = new RegExp('(?<=\\[)(.*?)(?=\\])','g');
		var regEx = /\[.*?\]/g;
		var sMatch;
		var sView;
		var sViewDataset;
		var sColumnId;
		var sRow;
		var sReText;
		
		// 변환처리
		while ((m = regEx.exec(sRetText)) !== null)
		{
			// This is necessary to avoid infinite loops with zero-width matches
			if (m.index === regEx.lastIndex) {
				regEx.lastIndex++;
			}
			
			sMatch = m[0].substring(1,  m[0].length-1);
			
			var arrMatch = sMatch.split(":");
			
			if (arrMatch.length == 1) {				// [field] 형식
				sView			= sViewNm;
				sViewDataset	= "this.parent." + sView + ".form.viewdataset";
				sRow			= sViewDataset + ".rowposition";
				sColumnId		= arrMatch[0];
			} else if (arrMatch.length == 2) {		// [view:field] 형식
				sView			= arrMatch[0];
				sViewDataset	= "this.parent." + sView + ".form.viewdataset";
				sRow			= sViewDataset + ".rowposition";
				sColumnId		= arrMatch[1];
			} else if (arrMatch.length == 3) {		// [view:datasetid:field] 형식
				sView			= arrMatch[0];
				sViewDataset	= "this.parent." + sView + ".form." + arrMatch[1];
				sRow			= sViewDataset + ".rowposition";
				sColumnId		= arrMatch[2];
			} else if (arrMatch.length == 4) {		// [view:datasetid:row:field] 형식
				sView			= arrMatch[0];
				sViewDataset	= "this.parent." + sView + ".form." + arrMatch[1];
				sRow			= arrMatch[2];
				sColumnId		= arrMatch[3];
			} else {
				continue;
			}
			
			// 변환처리 : this.parent.[view].form.viewdataset.getColumn(this.parent.[view].form.viewdataset.rowposition,'[field]')
			sReplace = sViewDataset + ".getColumn(" + sRow + ",'" + sColumnId + "')";
			
			sRetText = sRetText.replace("[" + sMatch + "]",sReplace);
		}
		
		return sRetText;
	};
	
	// User Argument 처리 : transaction Argument로 추가
	nexacro.APITransactionAction.prototype.gfnSetUserArgument = function(objForm)
	{
		var sReturnValue = "";
		
		var oExtraList = this.getContents("extra");		// Action 내 extra 정보 
		
		//this.gfnLog("extra >>> ");
		//this.gfnLog(oExtraList);
		
		if (!oExtraList)
            return;
		
		var oExtra;
		var sExtraName;
		var sExtraValue;
		
		// oExtraList객체값을 transaction argument 형식으로 변환
		//oExtraList.forEach(oExtra => sReturnValue += " " + oExtra["name"] + "=" + nexacro.wrapQuote(oExtra["value"]));
		for (var i = 0; i < oExtraList.length; i++)
		{
			oExtra = oExtraList[i];
			sExtraName = oExtra["name"];
			
			// Field의 value값 반환
			sExtraValue = this.gfnGetFieldValue(oExtra);
			
			// transaction argument 형식으로 셋팅
			sReturnValue += " " + sExtraName + "=" + nexacro.wrapQuote(sExtraValue);
		}
		
		sReturnValue = sReturnValue.substr(1);
		//this.gfnLog(sReturnValue);
		
		return sReturnValue;
	};
	
	// API 통신용 Dataset 생성 및 InputDataset 정보 반환
	nexacro.APITransactionAction.prototype.gfnSetAPIDataset = function(objForm)
	{
		var sReference = this.getContents("reference");		// Action 내 reference 정보 
		
		//this.gfnLog("reference >>> ");
		//this.gfnLog(sReference);
		
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
		
		// API 연동용 input dataset Array
		var aAPIDs = new Array();

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
				aAPIDs.push(sDatasetId+"="+sDatasetId);
				
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
		return aAPIDs.join(" ");
	};
}