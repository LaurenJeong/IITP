//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DeviceAPISearchContactsActionM		
// Group : Action		
//==============================================================================		
if (!nexacro.DeviceAPISearchContactsActionM)		
{		
    nexacro.DeviceAPISearchContactsActionM = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
		
		// ContactSet이 여러개인 경우 오작동함. Action실행시 ContactSet찾아서 실행하는것으로 수정
		// ContactSet을 생성 후 바로 query()실행시 오작동하여 Action 생성시 만듬.
		var oContactSet = this.fnGetContactSet(parent);
		if (this.gfnIsNull(oContactSet))
		{
			oContactSet = new nexacro.ContactSet();
			parent.addChild("ContactSet" + this.id, oContactSet); 
			this._contactset = oContactSet;
		}
    };		
        		
    nexacro.DeviceAPISearchContactsActionM.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DeviceAPISearchContactsActionM);		
    nexacro.DeviceAPISearchContactsActionM.prototype._type_name = "DeviceAPISearchContactsActionM";	
	
	//===============================================================		
    // nexacro.DeviceAPISearchContactsActionM : 변수선언 부분
    //===============================================================
	nexacro.DeviceAPISearchContactsActionM.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	nexacro.DeviceAPISearchContactsActionM.prototype._contactset;
	
	//===============================================================		
    // nexacro.DeviceAPISearchContactsActionM : Create & Destroy		
    //===============================================================		
    nexacro.DeviceAPISearchContactsActionM.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DeviceAPISearchContactsActionM : Method		
    //===============================================================		
    nexacro.DeviceAPISearchContactsActionM.prototype.run = function()		
	{	
        //Import the object set as TargetView			
		var sSearchTarget = this.searchtarget;
		var sSearchValue = this.searchvalue;
		var sReturnDataType = this.returndatatype;
		
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			var objForm = this.parent;
			var oContactSet = this._contactset;
			var objView = this.getTargetView();	
			var sTargetDs = this.targetdataset;
			var objDs = this._targetdataset;
			
			if (this.gfnIsNull(oContactSet))
			{
				oContactSet = this.fnGetContactSet(parent);
				
				// 정상동작하지 않지만 스크립트는 넣어둠.
				if (this.gfnIsNull(oContactSet))
				{
					oContactSet = new nexacro.ContactSet();
					objForm.addChild("ContactSet" + this.id, oContactSet); 
					this._contactset = oContactSet;
				}
			}
			
			if (this.gfnIsNull(this._contactset))
			{
				this.gfnLog("ContactSet Object를 생성 할 수 없습니다.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			if (this.gfnIsNull(objDs))	objDs 	= this.gfnGetDataset(objView,sTargetDs);
			
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset does not found.","info");
				this.on_fire_onerror("error");
				return;
			}
			else
			{
				this._targetdataset = objDs;
			}
			
			oContactSet.addEventHandler("onsuccess", this.fnActionContactSetOnsuccess, this);	
			oContactSet.addEventHandler("onerror", this.fnActionContactSetOOnerror, this);
			
			// 연락처 조회 쿼리 생성
			var strQueryString = "";
			
 			if (this.gfnIsNull(sSearchValue))
			{
				strQueryString = "uniqueid:*";
			}
			else
			{
				strQueryString = sSearchTarget + ":*" + sSearchValue + "*";
			}
			
			this.gfnLog(strQueryString);
			
			this.parent.setWaitCursor(true);
			var ret = oContactSet.query(strQueryString);

			if (ret != true) 
			{
				this.parent.setWaitCursor(false);
				this.gfnLog("검색조건 입력 오류.","info");
				this.on_fire_onerror("error");
				return;
			}
		}	
	};	
	
	nexacro.DeviceAPISearchContactsActionM.prototype._targetdataset = null;
	nexacro.DeviceAPISearchContactsActionM.prototype.set_targetdataset = function (v)				
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
	
	nexacro.DeviceAPISearchContactsActionM.prototype.set_searchtarget = function (v)				
	{
		var searchtarget_enum = ["all","phonenumbers","contactname","nickname","emails","categories","birthday","addresses","organizations","note"];
		if (v && searchtarget_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.searchtarget != v) {			
			this.searchtarget = v;		
		}			
	};
	
	nexacro.DeviceAPISearchContactsActionM.prototype.searchvalue = "";
	nexacro.DeviceAPISearchContactsActionM.prototype.set_searchvalue = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.searchvalue != v) {
			this.searchvalue = v;
		}
	};
	
	nexacro.DeviceAPISearchContactsActionM.prototype.set_returndatatype = function (v)				
	{
		var returndatatype_enum = ["none","copyrow","adddata","replace"];
		if (v && returndatatype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.returndatatype != v) {			
			this.returndatatype = v;		
		}			
	};
	
	//===============================================================		
    // nexacro.DeviceAPISearchContactsActionM : Event		
    //===============================================================
	nexacro.DeviceAPISearchContactsActionM.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DeviceAPISearchContactsActionM.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DeviceAPISearchContactsActionM.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		
		this.gfnLog("on_fire_onerror : " + userdata);
		
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
    // nexacro.DeviceAPISearchContactsActionM : 공통함수(Util)
    //===============================================================
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnLog = function(sMsg, sType)
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
	
	/**
	 * 데이터셋 반환(sDatasetId가 입력되지 않는 경우 objView의 viewdataset 반환)
	 * @param {Object} objView View 객체
	 * @param {String} sDatasetId 데이터셋 ID
	 * @return {Object} 데이터셋 객체
	 */
	// run()에서만 동작함.
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnGetDataset = function (objView, sDatasetId)
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
		} else if(objView instanceof nexacro.View){						// targetgrid 미설정시 View에 있는 Grid
			objDs = objView.getViewDataset();
		}

		return objDs;
	};
	//===============================================================		
    // nexacro.DeviceAPISearchContactsActionM : 공통함수 전환부분
    //===============================================================
	nexacro.DeviceAPISearchContactsActionM.prototype.fnActionContactSetOnsuccess = function(obj,e)
	{
		this.gfnLog("fnActionContactSetOnsuccess >>> e.reason : " + e.reason);
		
		// 1 : query()
		if (e.reason == "1") 
		{
			this.gfnLog("e.contacts.length : " + e.contacts.length);
			
			if (e.contacts.length == 0) 
			{
				this.parent.setWaitCursor(false);
				this.on_fire_onsuccess(e.contacts);
				return;
			}
			else        
			{
				// 데이터셋에 데이터 셋팅
				this.gfnSetReturnData(e.contacts);
			}

		}
	};

	nexacro.DeviceAPISearchContactsActionM.prototype.fnActionContactSetOnerror = function(obj,e)
	{	
		this.parent.setWaitCursor(false);
		this.on_fire_onerror(e.errormsg);
	};
	
	nexacro.DeviceAPISearchContactsActionM.prototype.fnGetContactSet = function(objForm)
	{
		var allobjects = objForm.all;
		var oContactSet;
		
		for(var i = 0; i < allobjects.length; i++)
		{
			if (allobjects[i] instanceof nexacro.ContactSet)
			{
				oContactSet = allobjects[i];
			}
		}
		
		return oContactSet;
	};
	
	// 리턴값 설정
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnSetReturnData = function(arrContacts)
	{
		var sReturnDataType = this.returndatatype;
		var oTargetView = this.getTargetView();
		var objDs = this._targetdataset;
		var arrContData = arrContacts;
		
		//this.gfnLog(arrContacts);
		//this.gfnLog(sReturnDataType);
		
		// 리턴 데이터 처리
		if (!this.gfnIsNull(arrContacts)
			&& !this.gfnIsNull(sReturnDataType) && sReturnDataType != "none")
		{
			if (this.gfnIsNull(objDs))
			{
				this.gfnLog("Dataset이 없습니다.","info");
				this.on_fire_onerror();
				return;
			}
			
			var nDataCnt = arrContacts.length;
			var nCRow = objDs.rowposition;
			
			if (sReturnDataType == "copyrow")										// 0번째 데이터만 복사
			{
				this.gfnSetModelArgument(objDs,nCRow,arrContacts[0]);
				this.gfnSetUserArgument(objDs,nCRow,arrContacts[0]);
			}
			else if (sReturnDataType == "adddata" || sReturnDataType == "replace")	// 모든 데이터 복사
			{
				objDs.set_enableevent(false);
				
				// replace 인 경우 기존 데이터 삭제
				if (sReturnDataType == "replace")
				{
					objDs.clearData();
				}
				
				// 모든 데이터 복사
				for(i=0; i< arrContacts.length; i++)
				{
					nARow = objDs.addRow();
					this.gfnSetModelArgument(objDs,nARow,arrContacts[i]);
					this.gfnSetUserArgument(objDs,nARow,arrContacts[i]);
				}
				
				// rowposition 유지
				objDs.set_rowposition(nCRow);
				
				objDs.set_enableevent(true);
			}
		}
		
		this.parent.setWaitCursor(false);
		this.on_fire_onsuccess(arrContacts);
	};
	
	// Model Argument 처리 : 해당 데이터셋에 value값 설정(viewdataset용)
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnSetModelArgument = function(objDs, nRow, oContact)
	{
		if (!objDs)						return false;
		if (nRow < 0)					return false;
		
		if (objDs.id != "viewdataset")
		{
			this.gfnLog("viewdataset만 설정 할 수 있습니다.","info");
			return true;
		}
		
		var oModelList = this.getContents("model");		// Action 내 model 정보 
		
		//this.gfnLog("model >>> ");
		//this.gfnLog(oModelList);
		
		if (!oModelList)					return true;
		
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
		
		var oParent = objDs.parent.parent;
		var sParentId = oParent.id;
		
		for (var i = 0; i < oModelList.length; i++)
        {
			oModel		= oModelList[i];
			
			sViewId		= oModel["viewid"];
			sModelId	= oModel["modelid"];
			sIOType		= oModel["iotype"];
			oFieldList	= oModel["fieldlist"];
			
			if (sParentId == sViewId)
			{
				// 컬럼 셋팅
				for (var j = 0; j < oFieldList.length; j++)
				{
					oField = oFieldList[j];
					
					// Field의 value값 반환
					sFieldValue = this.gfnGetContactValue(oContact, oField["value"]);
					
					// 데이터 셋팅
					objDs.setColumn(nRow, oField["fieldid"], sFieldValue);
				}
				
				break;
			}
		}
		
		return true;
	};
	
	// User Argument 처리 : 해당 데이터셋에 value값 설정
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnSetUserArgument = function(objDs, nRow, oContact)
	{
		if (!objDs)						return false;
		if (nRow < 0)					return false;
		
		var oExtraList = this.getContents("extra");		// Action 내 extra 정보 
		
		//this.gfnLog("extra >>> ");
		//this.gfnLog(oExtraList);
		
		if (!oExtraList)		return true;
		
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
			sExtraValue = this.gfnGetContactValue(oContact, oExtra["value"]);
			
			// 데이터 셋팅
			objDs.setColumn(nRow, sExtraName, sExtraValue);
		}
		
		return true;
	};
	
	nexacro.DeviceAPISearchContactsActionM.prototype.gfnGetContactValue = function(oContact, sId)
	{
		var sValue = "";
		
		switch(sId)
		{
			case "uniqueid" :		// 연락처의 식별자(id) 값
			case "birthday" :		// 생년월일
			case "nickname" :		// 별명
			case "note" :			// 메모
				sValue = oContact[sId];
				break;
			case "contactname" :	// 이름
				if (this.gfnIsNull(oContact.contactname.displayname)) 
                {
                    if (this.gfnIsNull(oContact.contactname.givenname)) 
                    {
                        sValue = oContact.contactname.familyname;
                    }
                    else 
                    {
                        sValue = oContact.contactname.givenname;
                    }
                }
                else 
                {
                    sValue = oContact.contactname.displayname;
                }
				break;
			case "displayname" :	// 전체표시이름
				sValue = oContact.contactname.displayname;
				break;
			case "familyname" :		// 성
				sValue = oContact.contactname.familyname;
				break;
			case "givenname" :		// 이름
				sValue = oContact.contactname.givenname;
				break;
			case "phonenumber" :	// 전화번호
				if (oContact.phonenumbers.length > 0) 
                {
                    sValue = oContact.phonenumbers[0].value;
                }
				break;
			case "addresses" :		// 주소
				if (oContact.addresses.length > 0) 
                {
                    sValue = oContact.addresses[0].street;
                }
				break;
			case "company" :		// 조직이름
			case "department" :		// 부서명
				if (oContact.organizations.length > 0) 
                {
                    sValue = oContact.organizations[0][sId];
                }
				break;
			case "emails" :			// 이메일
				if (oContact.emails.length > 0) 
                {
                    sValue = oContact.emails[0].value;
                }
				break;
			default : sValue = "";
		}
		
		return sValue;
	};
}
