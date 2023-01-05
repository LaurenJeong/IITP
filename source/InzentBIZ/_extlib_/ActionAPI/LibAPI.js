var pAction = nexacro.Action.prototype;

//===============================================================
// nexacro.Action : 변수선언 부분(변경불가)
//===============================================================
// 대상 Action : APITransactionAction, RestAPIAction
pAction._TRAN_CALLBACK_NM = "fnTranActionCallback";			// Action공통 Callback함수명

//===============================================================
// nexacro.Action : 변수선언 부분(프로젝트마다 변경)
//===============================================================
// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
pAction._LOG_LEVEL		= -1;

// 대상 Action : ExcelExportAction, ExcelImportAction
pAction._COM_EXCEL_URL = "svc::XExportImport.do";			// XENI URL

// 대상 Action : DsSetFirstCdAction
pAction._COM_CODE_COL = "COMN_CD";							// 공통코드 코드컬럼명
pAction._COM_NAME_COL = "COMN_CD_NM";						// 공통코드 코드명컬럼명

// 대상 Action : APITransactionAction
// Service URL prefix로 전환용
pAction._API_SVC_PREFIX	= "svc::";						// prefix ID
pAction._API_SVC_URL	= "http://127.0.0.1:8087/";		// Service URL

//===============================================================
// nexacro.Action : 공통함수(프로젝트마다 변경)
//===============================================================
// Transaction 처리전 공통처리 함수
pAction.gfnBeforeTransaction = function(oParam)
{
	// TODO : 프로젝트마다 필요시 구현필요
	var objApp = nexacro.getApplication();
	var objForm = this.parent;
	var oDsHeader;
	var oGdsHeader;
	
	// 1) InZent 통신시 Hearder 설정
	var sDsHeaderId = "Header";
	if (objForm.isValidObject(sDsHeaderId))
	{
		oDsHeader = objForm.all[sDsHeaderId];
		
		oGdsHeader = objApp.gdsHeader;
		
		for(var i=0; i < oGdsHeader.colcount; i++)
		{
			oDsHeader.copyRow(0,oGdsHeader,0);
		}
		
		trace(oDsHeader.saveXML());
	}
	return true;
};

// Transaction 처리후 공통처리 함수
pAction.gfnAfterTransaction = function(oParam)
{
	// TODO : 프로젝트마다 필요시 구현필요
	
	// 1) Header값 코드 처리
	
	return true;
};