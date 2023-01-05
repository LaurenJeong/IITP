var pAction = nexacro.Action.prototype;

//===============================================================
// nexacro.Action : 변수선언 부분(변경불가)
//===============================================================
// 대상 Action : PopupAction, PopupActionM
pAction._POPUP_CALLBACK = "fnPopupActionCallback";			// 팝업 Callback함수(Action 내부에서 사용)

// 대상 Action : TransactionAction
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
