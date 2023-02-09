var pAction = nexacro.Action.prototype;

//===============================================================
// nexacro.Action : 변수선언 부분(변경불가)
//===============================================================
// 대상 Action : APITransactionAction, RestAPIAction
pAction._TRAN_CALLBACK_NM = "fnTranActionCallback";			// Action공통 Callback함수명

//===============================================================
// nexacro.Action : 변수선언 부분(프로젝트마다 변경)
//===============================================================
// 대상 Action : APITransactionAction
// Service URL prefix로 전환용
pAction._API_SVC_PREFIX	= "svc::";						// prefix ID
pAction._API_SVC_URL	= "http://127.0.0.1:8087/";		// Service URL

//===============================================================
// nexacro.Action : 공통함수
//===============================================================
/**
 * @class 데이터셋이 있는지 확인하고 없으면 생성해주는 함수
 * @param {String} sDatasetId - 데이터셋 ID
 * @param {Object} objForm - 부모 Form
 * @param {Array} arrColNm - 생성할 컬럼명 배열
 * @return {Object} 데이터셋
 * @example
 */
pAction.gfnCheckDataset = function(sDatasetId, objForm, arrColNm)
{
	// Form에 Dataset있는지 체크
	var bRet = objForm.isValidObject(sDatasetId);
	var oDataset;
	
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
	
	// 컬럼정보가 있는 경우 컬럼정보 생성
	if (arrColNm)
	{
		for(var i=0; i< arrColNm.length; i++)
		{
			oDataset.addColumn(arrColNm[i], "string");
		}
	}
	
	return oDataset;
};
//===============================================================
// nexacro.Action : 공통함수(프로젝트마다 변경)
//===============================================================
// Transaction 함수
pAction.gfnCallTransaction = function(objForm, objSvcId, sService, sInDs, sOutDs, sArgs, sCallback, bAsync)
{
	// TODO : 프로젝트마다 필요시 구현필요
	var objApp = nexacro.getApplication();
	
	var sDsHeaderId = "Header";
	var sActionDsHeaderId = this.name + "_" + sDsHeaderId;
	var oDsHeader;
	var oGdsHeader;
	
	// 1) Service URL 전환
	if (this.gfnIsNull(sService) == false) {
		sService = nexacro.replaceAll(sService,this._API_SVC_URL,this._API_SVC_PREFIX);
	}
	
	// 2) sOutDs에 Header 추가
	var sAddOutDs = "";
	sAddOutDs += this.name + "_" + sDsHeaderId + "=" + sDsHeaderId;
	
	if (this.gfnIsNull(sOutDs))		sOutDs = "";
	sOutDs = sAddOutDs + " " + sOutDs;
	
	// 3) [InzentBIZ] InZent 통신시 Hearder 설정
	if (objForm.isValidObject(sActionDsHeaderId))
	{
		oDsHeader = objForm.all[sActionDsHeaderId];
		
		oGdsHeader = objApp.gdsHeader;
		
		for(var i=0; i < oGdsHeader.colcount; i++)
		{
			oDsHeader.copyRow(0,oGdsHeader,0);
		}
		
		//trace(oDsHeader.saveXML());
	}
	
	// transaction 호출
	objForm.transaction(JSON.stringify(objSvcId), sService, sInDs, sOutDs, sArgs, sCallback, bAsync);
};

// Transaction 처리후 공통처리 함수
pAction.gfnAfterTransaction = function(oParam)
{
	// TODO : 프로젝트마다 필요시 구현필요
	var bRet = true;
	var objForm = this.gfnGetForm();
	var objApp = nexacro.getApplication();
	
	// 1) [InzentBIZ] Header값 Session 정보처리, 코드 처리
	var sDsHeaderId = "Header";
	var sActionDsHeaderId = this.name + "_" + sDsHeaderId;
	var oDsHeader;
	var oGdsHeader;
	var sMsgCode = "";
	var sMsg = "";
	
	if (objForm.isValidObject(sActionDsHeaderId))
	{
		oDsHeader = objForm.all[sActionDsHeaderId];
		oGdsHeader = objApp.gdsHeader;
		
		// Session 정보처리
		if (oDsHeader)
		{
			oGdsHeader.copyRow(0,oDsHeader,0);
			
			//trace(oGdsHeader.saveXML());
		}
	}
	
	// API용 데이터 초기화
// 	if (this._arrInDs)
// 	{
// 		for(var i=0; i< this._arrInDs.length; i++)
// 		{
// 			this._arrInDs[i].clearData();
// 		}
// 	}
	
	return bRet;
};