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
	nexacro.APIInzentTranAction.prototype._TRAN_CALLBACK_NM = "gfnTranActionCallback";		// Action공통 Callback함수명
	
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
		
		var sAddInDs = this.gfnSetInzentDataset(objForm);
		if (this.gfnIsNull(sAddInDs) == false) {
			sInDs = sAddInDs + " " + sInDs;
		}
		
		//Action Scope에 있는 CallBack 함수가 호출되도록 설정
		objForm.gfnTranActionCallback = this.gfnTranActionCallback;
		
		if (this.gfnIsNull(objForm.targetTranAction))		objForm.targetTranAction = {};
		objForm.targetTranAction[sSvcId] = this;
		
		//Transaction 호출
		objForm.transaction(sSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
	};
	
	nexacro.APIInzentTranAction.prototype.gfnTranActionCallback = function(sSvcId, nErrorCd, sErrorMsg)
	{
		var objTarget = this.targetTranAction[sSvcId];
		if (objTarget == undefined || objTarget == null)		return;
		
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
	
	nexacro.APIInzentTranAction.prototype.gfnSetInzentDataset = function(objForm)
	{
		var sReference = this.getContents("reference");
		
		sReference = "<Reference>" + sReference + "</Reference>";
	
		var domPar = new nexacro.DomParser();
		var objXml = new nexacro.XmlSerializer();
		var domDoc;
		var referenceNode, childNode;
		
		var oDataset;
		var sDatasetId;
		var sDatasetXML;
		var bRet;
		
		var aInzentDs = new Array();

		domDoc = domPar.parseFromString(sReference);
		
		referenceNode = domDoc.firstChild;
		if(!referenceNode)
			return "";
		
		childNode = referenceNode.firstChild;
		
		while(childNode)
		{
			sDatasetId = childNode.getAttribute("id");
			sDatasetXML = objXml.serializeToString(childNode);
			
			// Input Dataset용 Array
			aInzentDs.push(sDatasetId+"="+sDatasetId);
			
			bRet = objForm.isValidObject(sDatasetId);
			
			if (bRet)
			{
				oDataset = objForm.all[sDatasetId];
			}
			else
			{
				oDataset = new Dataset();
				objForm.addChild(sDatasetId, oDataset);
			}
			
			if (oDataset != null)
			{
				oDataset.loadXML(sDatasetXML);
			}
			
			childNode = childNode.nextSibling;
		}
		
		// Return Input Ds
		return aInzentDs.join(" ");
	};
	
	//===============================================================
    // nexacro.Action : Action관련 공통함수
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
    // nexacro.Action : 공통함수(Util)
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
}