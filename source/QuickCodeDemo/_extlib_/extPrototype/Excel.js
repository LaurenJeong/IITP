/**
*  컨설팅 표준화 작업
*  @FileName 	Excel.js 
*  @Creator 	consulting
*  @CreateDate 	2017.03.08
*  @Desction   
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2017.03.08     	consulting 	           		최초 생성 
*  2017.10.17     	consulting       	        주석 정비
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

pForm.COM_EXCEL_TYPE = "EXCEL2007";

// xeni URL
pForm.COM_EXCEL_URL = "svc::XExportImport";

/**
 * @class gfnGetSheetName : Sheet명 반환(지원안하는 특수문자 제거)
* @param	{String} sSheetName	- Sheet명
* @param	{String} sNullNm	- 빈값일때 sheet명
* @return	{String} Sheet명
*/
pForm.gfnGetSheetName = function(sSheetName, sNullNm)
{
	if (this.gfnIsNull(sNullNm))	sNullNm = "Sheet1";

	var regExp = /[?*:\/\[\]]/g;
	var sRetuenNm;

	if (this.gfnIsNull(sSheetName))	sSheetName = sNullNm;

	sRetuenNm = sSheetName.replace(regExp,""); //시트명에 특수문자 제거
	sRetuenNm = this.gfnIsNull(sRetuenNm) ?sNullNm : sRetuenNm;

	//sheetName 30이상일경우 기본시트명
	if( String(sRetuenNm).length > 30 ){
		sRetuenNm =  sNullNm;
	}

	return sRetuenNm;
};

/**
 * @class excel export <br>
 * @param {Object} objGrid - Grid Object	
 * @param {String} [sSheetName]	- sheet name
 * @param {String} [sFileName]	- file name
 * @return N/A
 * @example
 * this.gfnExcelExport(this.grid_export, "SheetName","");
 */
pForm.gfnExcelExport = function(objGrid,  sSheetName, sFileName)
{
	//this.setWaitCursor(true);
	var objGridExcel;
	var regExp = /[?*:\/\[\]]/g;  				//(엑셀에서 지원하지않는 모든 문자)
	
	//fileName nullcheck
	sFileName = this.gfnIsNull(sFileName) ? "ExcelExport_" + this.gfnGetArgument(this.FRAME_MENUCOLUMNS.menuNm) + "_" + this.gfnGetDate("time") : sFileName;		// fileName nullcheck
	sFileName = sFileName.replace(regExp, "");	// 파일명에 특수문자 제거
	
	var sType	= objGrid.toString().toUpperCase();
	
	this.objExport = null;
	this.objExport = new ExcelExportObject();
	this.objExport.set_exporturl(this.COM_EXCEL_URL);
	
	if(sType == "[OBJECT GRID]")
	{
		sSheetName = this.gfnGetSheetName(sSheetName);
		objGridExcel = objGrid;

		this.objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGridExcel, sSheetName + "!A1","allband","allrecord","nosuppress","allstyle","image","","width");

		this.objExport.objgrid = objGridExcel;
	}
	else
	{
		var arrGridExcel = new Array();

		for(var i=0; i<objGrid.length; i++)
		{
			strSheetNm = sSheetName[i];
			strSheetNm = this.gfnIsNull(strSheetNm) ? "Sheet" + (i+1) : strSheetNm;
			strSheetNm = this.gfnGetSheetName(strSheetNm);

			objGridExcel = objGrid[i];

			arrGridExcel.push(objGridExcel);

			this.objExport.addExportItem(nexacro.ExportItemTypes.GRID, objGridExcel, strSheetNm + "!A1","allband","allrecord","nosuppress","allstyle","image","","width");
		}
		this.objExport.objgrid = arrGridExcel;
	}

	this.objExport.set_exporttype(eval("nexacro.ExportTypes." + this.COM_EXCEL_TYPE));	//내보내기 할 엑셀 형식 지정
	this.objExport.set_exportfilename(sFileName);
 	//this.objExport.set_exportuitype("none");
 	//this.objExport.set_exportmessageprocess("");
	this.objExport.set_exportuitype("exportprogress");
 	this.objExport.set_exporteventtype("itemrecord");
	this.objExport.set_exportmessageprocess("%d[%d/%d]");
	this.objExport.set_exportactivemode('active');

	this.objExport.addEventHandler("onsuccess", this.gfnExportOnsuccess, this);
	this.objExport.addEventHandler("onerror", this.gfnExportOnerror, this);
	
	var result = this.objExport.exportData();
};

/**
 * @class excel export on sucess <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnExportOnsuccess = function(obj, e)
{	
	//this.setWaitCursor(false);
};

/**
 * @class  excel export on error <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnExportOnerror = function(obj,  e)
{
	this.alert("Excel Export Error!!");
	//this.setWaitCursor(false);
};

/**
 * @class  FileDialog에서 사용할 확장자별 파일유형 반환
 * @param {String} sImportType - 타입(EXCEL,EXCEL2007,HANCELL2014,CSV)
 * @return {String} 적용될 파일형식
 */
pForm.gfnGetFileFilter = function(sImportType)
{
	var strFilefilter = "";

	switch(sImportType)
	{
	    case "EXCEL":
			strFilefilter = "Worksheet 97 - 2003 Files (*.xls)|*.xls|";
			break;
	    case "EXCEL2007":
	    	strFilefilter = "Worksheet Files (*.xlsx)|*.xlsx|";
			break;
	    case "HANCELL2014":
	    	strFilefilter = "Hancell Files (*.cell)|*.cell|";
			break;
	    case "CSV":
	    	strFilefilter = "CSV (*.csv)|*.csv|";
			break;
	    default : break;
	}

	strFilefilter += "All (*.xls;*.xlsx;*.cell;*.csv)|*.xls;*.xlsx;*.cell;*.csv|";

	return strFilefilter;
};

/**
 * @class  excel import( 데이터 헤더포함 ) <br>
 * @param {String} objDs - dataset	
 * @param {String} [sSheet]	- sheet name(default:Sheet1)
 * @param {String} sHead - Head 영역지정	
 * @param {String} [sBody] - body 영역지정(default A2)	
 * @param {String} [sCallback]	- callback 함수
 * @param {String} [sImportId] - import id(callback호출시 필수)	
 * @param {Object} [objForm] - form object(callback호출시 필수)
 * @return N/A
 * @example
 * this.gfnExcelImportAll("dsList","SheetName","A1:G1","A2","fnImportCallback","import",this);
 */
pForm.gfnExcelImportAll = function(objDs,sSheet,sHead,sBody,sCallback,sImportId,objForm)
{	
	this.setWaitCursor(true);    	
	
	if(this.gfnIsNull(sSheet)) sSheet = "Sheet1";
	if(this.gfnIsNull(sBody)) sBody = "A2";
	if(this.gfnIsNull(sHead)) return false;
	
	var objImport ;	
	var sFilefilter = this.gfnGetFileFilter(this.COM_EXCEL_TYPE);
	
	objImport = new nexacro.ExcelImportObject(objDs+"_ExcelImport",this);				
	objImport.set_importurl(this.COM_EXCEL_URL);						
	objImport.set_importtype(eval("nexacro.ExportTypes." + this.COM_EXCEL_TYPE));			
	objImport.set_filefilter(sFilefilter);
	
	if (!this.gfnIsNull(sCallback))
	{
		objImport.callback = sCallback;
		objImport.importid = sImportId;
		objImport.form = objForm;
	}
	
	objImport.addEventHandler("onsuccess", this.gfnImportAllOnsuccess, this);
	objImport.addEventHandler("onerror", this.gfnImportAllOnerror, this);	
	var sParam1 = "[Command=getsheetdata;Output=outds;Head="+sSheet+"!"+sHead+";Body="+sSheet+"!"+sBody+"]";
	var sParam2 = "["+objDs+"=outds]";


	objImport.importData("", sParam1, sParam2);						
	objImport = null;	 
};

/**
 * @class excel import on success <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnImportAllOnsuccess = function(obj,  e)
{		
	this.setWaitCursor(false);
	var sCallback = obj.callback;
	var sImportId = obj.importid;
	
	//화면의 callback 함수 호출
	if (!this.gfnIsNull(sCallback)) {
		if (this[sCallback]) this.lookupFunc(sCallback).call(sImportId);
	}
};

/**
 * @class  excel import( 데이터 헤더제외 ) <br>
 * @param {String} sDataset - dataset	
 * @param {String} [sSheet]	- sheet name
 * @param {String} [sBody] - body 영역지정	
 * @param {String} [sCallback] - callback 함수	
 * @param {String} [sImportId] - import id(callback호출시 필수)	
 * @param {Object} [objForm] - form object(callback호출시 필수)	
 * @return N/A
 * @example
 * this.gfnExcelImport("dsList","SheetName","A2","fnImportCallback","import",this);
 */
pForm.gfnExcelImport = function(sDataset, sSheet, sBody, sCallback, sImportId, objForm)
{
	//trace("gfnExcelImport");
	this.setWaitCursor(true);    	
	
	if(this.gfnIsNull(sSheet)) sSheet = "sheet1";
	if(this.gfnIsNull(sBody)) sBody = "A2";
	
	var sFilefilter = this.gfnGetFileFilter(sImportType);
	
	var objImport;	
	objImport = new nexacro.ExcelImportObject(sDataset+"_ExcelImport",this);				
	objImport.set_importurl(this.COM_EXCEL_URL);						
	objImport.set_importtype(eval("nexacro.ExportTypes." + this.COM_EXCEL_TYPE));	
	objImport.set_filefilter(sFilefilter);

	if (!this.gfnIsNull(sCallback))
	{
		objImport.callback = sCallback;
		objImport.importid = sImportId;
		objImport.form = objForm;
	}
	
	//out dataset 생성(차후 onsucess 함수에서 헤더생성하기 위한)
	var sOutDsName = sDataset+"_outds";	
	if(this.isValidObject(sOutDsName)) this.removeChild(sOutDsName);	
	
	var objOutDs = new Dataset();
	objOutDs.name = sOutDsName;
	this.addChild(objOutDs.name, objOutDs);
	
	objImport.addEventHandler("onsuccess", this.gfnImportOnsuccess, this);
	objImport.addEventHandler("onerror", this.gfnImportAllOnerror, this);	
	var sParam = "[command=getsheetdata;output=outDs;body=" + sSheet + "!" + sBody +";]";
 	var sParam2 = "[" + sOutDsName + "=outDs]";
 	
	objImport.importData("", sParam, sParam2);						
	objImport = null;	
	
	this.setWaitCursor(false);
};

/**
 * @class excel import on success <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnImportOnsuccess = function(obj,  e)
{		
	this.setWaitCursor(false);
	
	var objOutDs = this.objects[obj.outds+"_outds"];
	var objOrgDs = this.objects[obj.outds];
	var sCallback = obj.callback;
	var sImportId = obj.importid;
	var objForm = obj.form;
	var sColumnId;

	//기존 데이터셋의 내용으로 헤더복사
	for (var i=0; i<objOrgDs.getColCount(); i++)
	{
		sColumnId = "Column"+i;
		if (sColumnId != objOrgDs.getColID(i))
		{
			objOutDs.updateColID(sColumnId, objOrgDs.getColID(i))
		}
	}
	
	objOrgDs.clearData();
	objOrgDs.copyData(objOutDs);

	//화면의 callback 함수 호출
	if (!this.gfnIsNull(sCallback)) {
		if (this[sCallback]) this.lookupFunc(sCallback).call(sImportId);
	}
};

/**
 * @class  excel import on error <br>
 * @param {Object} obj	
 * @param {Event} e		
 * @return N/A
 * @example
 */
pForm.gfnImportAllOnerror = function(obj,  e)
{
	this.setWaitCursor(false);	
	this.alert(e.errormsg);
};

// 그리드에 연결된 정보로 데이터셋 컬럼 생성
pForm.gfnMakeColInfoFromGrid = function(objGrid, objToDs)
{
	var sColID = "";
	var sBand = "body";

	objToDs.clear();		// 데이터셋초기화

	// 그리드 정보로 dataset 컬럼 생성
	for(var i=0; i < objGrid.getCellCount(sBand); i++)
	{
		sColID = this._gfnGridGetBindColumnNameByIndex(objGrid, i);

		if (sColID != "")
		{
			objToDs.addColumn(sColID, "string" );
		}
		else
		{
			objToDs.addColumn("COL_" + i, "string" );
		}
	}
};