//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.APILogAction		
// Group : Action		
//==============================================================================		
if (!nexacro.APILogAction)		
{
    nexacro.APILogAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.APILogAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.APILogAction);		
    nexacro.APILogAction.prototype._type_name = "APILogAction";	
	
	//===============================================================
    // nexacro.APILogAction : 변수선언 부분
    //===============================================================
	nexacro.APILogAction.prototype._arrInDs = new Array();
	 
	//===============================================================		
    // nexacro.APILogAction : Create & Destroy		
    //===============================================================		
    nexacro.APILogAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.APILogAction : Method		
    //===============================================================		
    nexacro.APILogAction.prototype.run = function()		
	{	
        //canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{	
			//Transaction에서 사용할 Param정보 가져오기
			var sSvcId = this.id;
			var sService = this.serviceurl;
			var sCallback = this._TRAN_CALLBACK_NM;
			
			this.gfnTransaction(sSvcId, sService, sCallback);
		}
	};
	
	nexacro.APILogAction.prototype.set_servicemodel = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.servicemodel != v) {
			this.servicemodel = v;
		}
	};
	
	nexacro.APILogAction.prototype.serviceurl = "";
	nexacro.APILogAction.prototype.set_serviceurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.serviceurl != v) {
			this.serviceurl = v;
		}
	};
	
	nexacro.APILogAction.prototype.message = "";
	nexacro.APILogAction.prototype.set_message = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		
		if (this.message != v) {
			this.message = v;
		}
	};
	
	nexacro.APILogAction.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return event._fireCheckEvent(this, evt);
		}
		return true;	
	};
	
	nexacro.APILogAction.prototype.on_fire_onsuccess = function (sSvcId, nErrorCd, sErrorMsg)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.TranActionSuccessEventInfo(this, "onsuccess", sSvcId, nErrorCd, sErrorMsg); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.APILogAction.prototype.on_fire_onerror = function (sSvcId, nErrorCd, sErrorMsg)
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
	nexacro.APILogAction.prototype.gfnTransaction = function(sSvcId, sService, sCallback, bAsync)
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
		
		var sInDs = "";
		var sOutDs = "";
		var sArgs = "";
		
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
	nexacro.APILogAction.prototype.fnTranActionCallback = function(svcId, nErrorCd, sErrorMsg)
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
	
	// API 통신용 Dataset 생성 및 InputDataset 정보 반환
	nexacro.APILogAction.prototype.gfnSetAPIDataset = function(objForm)
	{
		// 1) reference 정보로 API 데이터셋 생성
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
		var arrColNm;
		var sDatasetXML;
		var bRet;
		var oMessage = {};
		var sMessage = "";
		
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
				
				// 데이터셋 가져오기
				oDataset = this.gfnCheckDataset(sActionDatasetId, objForm);
				
				// Dataset에 XML Load
				if (oDataset)
				{
					oDataset.loadXML(sDatasetXML);
					
					// Input Dataset용 Array
					aAPIDs.push(sDatasetId+"="+sActionDatasetId);
					this._arrInDs.push(oDataset);
				}
			}
			
			// 다음 Node
			childNode = childNode.nextSibling;
		}
		
		// 2) TODO : 로그용 데이터셋 생성(하드코딩)
		oMessage = {
			"Header" : {
				"UUID" : "b202211011020COM00001",
				"IFID" : "BIZ_M_ERP_S_COM00001",
				"SvcID" : "ISD_ERP_S_COM00001 ",
				"ChlCode" : "BIZ",
				"SysCode" : "ERP",
				"BizCode" : "COM",
				"UserID" : "T000000001",
				"SessionId" : "",
				"MsgCode" : "",
				"Msg" : ""
			},
			"Data" : {
				"START_DATE" : "20221001",
				"END_DATE" : "20221230",
				"CHG_NM" : "MANAGER",
				"PURCHASE_NO" : "I000000001",
				"TRAN_TIME" : this.gfnGetDate("milli")
			}
		};
		
		this.gfnLog(oMessage);
		
		// Message base64Encode
		sMessage = JSON.stringify(oMessage);
		if (!this.gfnIsNull(sMessage))			sMessage = nexacro.base64Encode(sMessage);
		
		// 2-1) SI
		arrColNm = ["LOGDATA_CNT"];
		sDatasetId = "SI";
		sActionDatasetId = this.name + "_" + sDatasetId;
		oDataset = this.gfnCheckDataset(sActionDatasetId, objForm, arrColNm);
		aAPIDs.push(sDatasetId+"="+sActionDatasetId);
		this._arrInDs.push(oDataset);
		oDataset.clearData();
		nRow = oDataset.addRow();
		oDataset.setColumn(nRow, "LOGDATA_CNT",1);
		
		//this.gfnLog(oDataset.saveXML());

		// 2-1) SI_LOGDATA
		arrColNm = ["TRANSACTION_ID","LOG_CODE","SYSTEM_CODE","REQUEST_TIMESTAMP","RESPONSE_TIMESTAMP","MESSAGE"];
		sDatasetId = "SI_LOGDATA";
		sActionDatasetId = this.name + "_" + sDatasetId;
		oDataset = this.gfnCheckDataset(sActionDatasetId, objForm, arrColNm);
		aAPIDs.push(sDatasetId+"="+sActionDatasetId);
		this._arrInDs.push(oDataset);
		oDataset.clearData();
		nRow = oDataset.addRow();
		oDataset.setColumn(nRow, "TRANSACTION_ID",this.id);
		oDataset.setColumn(nRow, "LOG_CODE","TNI");
		oDataset.setColumn(nRow, "SYSTEM_CODE","BIZ");
		oDataset.setColumn(nRow, "REQUEST_TIMESTAMP",this.gfnGetDate("milli"));
		oDataset.setColumn(nRow, "RESPONSE_TIMESTAMP","");
		oDataset.setColumn(nRow, "MESSAGE",sMessage);
		//this.gfnLog(oDataset.saveXML());
		
		// Return Input Ds
		return aAPIDs.join(" ");
	};
	
	/**
	 * @class 현재일자를 구한다. <br>
	 * @param {String} [sGubn] - date/null : 일자, time : 일자+시간, milli : Milliseconds
	 * @return {String} 8자리 날짜(YYYYMMMDD)문자열
	 */
	nexacro.APILogAction.prototype.gfnGetDate = function(sGubn) 
	{
		if(this.gfnIsNull(sGubn)) sGubn = "date";
		var d = new Date();
		
		var s;
		
		if (sGubn == "date") {
			s = d.getFullYear()
				  + ((d.getMonth() + 1) + "").padLeft(2, '0')
				  + (d.getDate() + "").padLeft(2, '0');
		}
		else if (sGubn == "time") {
			s = d.getFullYear()
			  + ((d.getMonth() + 1) + "").padLeft(2, '0')
			  + (d.getDate() + "").padLeft(2, '0')
			  + (d.getHours() + "").padLeft(2, '0')
			  + (d.getMinutes() + "").padLeft(2, '0')
			  + (d.getSeconds() + "").padLeft(2, '0');
		}
		else if (sGubn == "milli") {
			s = d.getFullYear()
			  + ((d.getMonth() + 1) + "").padLeft(2, '0')
			  + (d.getDate() + "").padLeft(2, '0')
			  + (d.getHours() + "").padLeft(2, '0')
			  + (d.getMinutes() + "").padLeft(2, '0')
			  + (d.getSeconds() + "").padLeft(2, '0')
			  + (d.getMilliseconds() + "").padLeft(3, '0');
		}
		return (s);
	};
}