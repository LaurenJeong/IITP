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
		
		//Transaction 호출(프로젝트마다 다른값 처리위해 사용)
		this.gfnCallTransaction(objForm, objSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
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
		
		// Transaction 처리후 공통처리 함수(프로젝트마다 다른값 처리위해 사용)
		var oParam = {};
		var bRet = objTarget.gfnAfterTransaction(oParam);
		if (!bRet)
		{
			this.gfnLog("gfnAfterTransaction() 오류가 발생했습니다.","info");
			return false;
		}
		
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
		var sActionDatasetId;
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
				
				sActionDatasetId = this.name + "_" + sDatasetId;
				
				// Input Dataset용 Array
				aAPIDs.push(sDatasetId+"="+sActionDatasetId);
				
				// Form에 Dataset있는지 체크
				bRet = objForm.isValidObject(sActionDatasetId);
				
				// Form에 Dataset이 있는 경우 oDataset에 셋팅, 없는 경우 생성 후 셋팅
				if (bRet)
				{
					oDataset = objForm.all[sActionDatasetId];
				}
				else
				{
					oDataset = new Dataset();
					objForm.addChild(sActionDatasetId, oDataset);
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