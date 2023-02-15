/**
*  컨설팅 표준화 작업
*  @FileName 	Comp.js 
*  @Creator 	consulting
*  @CreateDate 	2017.03.08
*  @Desction   		
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2017.03.08     	consulting 	                최초 생성 
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

pForm.RTE_PREVIEW_URL = "richtexteditor/html/preview.html";

/**
 * @class 해당 콤포넌트의 form으로 부터의 경로를 구하는 함수
 * @param {Object} obj - 콤포넌트
 * @return {String} 해당 콤포넌트의 form으로 부터의 경로
 */
pForm.gfnGetCompId = function (obj)
{
	var sCompId = obj.name;
	var objParent = obj.parent;
	
	while (true)
	{
		//trace("" + objParent + " / " + objParent.name);
		if (objParent instanceof nexacro.ChildFrame )
		{
			break;
		}
		else {
			sCompId = objParent.name + "." + sCompId;
		}
		objParent = objParent.parent;		
	}
	return sCompId;
};

/**
 * @class 공통코드 조회
 * @param	{Array} arrComCodeArg - 조회할 공통코드 정보
	  - grpcd : 공통코드 그룹ID
	  - obj     : 조회된 공통코드를 적용할 객체(Dataset/Combo). Combo 선택시 첫번째 index 자동설정
	  - firstcd : 첫번째 Row에 추가할 CD값. ex) all
	  - firstnm : 첫번째 Row에 추가할 값 ex) 전체
	  - filter : expr로 추가할 filter 문자열 ex) COMM_CD<='100'
 * @return N/A
 */
pForm.gfnSearchCommonCode = function(arrComCodeArg) 
{
	var objGdsCode = pForm.gfnGetApplication().gdsCommCode;
	
	for(var i=0; i<arrComCodeArg.length; i++)
	{
		pForm.gfnGetCommonCode(objGdsCode,arrComCodeArg[i]);
	}
};

/**
 * @class 조회된 공통코드를 컴포넌트에 셋팅
 * @param	{Object}	objDsComm		: 공통코드 Dataset
 * @param	{Array}	arrComCodeArg 	: 조회할 공통코드 정보
	  - grpcd : 공통코드 그룹ID
	  - obj     : 조회된 공통코드를 적용할 객체(Dataset/Combo). Combo 선택시 첫번째 index 자동설정
	  - firstcd : 첫번째 Row에 추가할 CD값. ex) all
	  - firstnm : 첫번째 Row에 추가할 값 ex) 전체
	  - filter : expr로 추가할 filter 문자열 ex) COMM_CD<='100'
 * @return N/A
 */
pForm.gfnGetCommonCode = function(objDsComm, oCommArg) 
{
	var objDs;		// 대상 데이터셋
	var objCbo;		// 대상 콤보
	
	var obj = oCommArg.obj
	
	if( obj instanceof nexacro.Combo ){		//obj 가 콤보일경우
		objDs = obj.getInnerDataset();
		objCbo = obj;
	} else if( obj instanceof Dataset){		//obj 가 데이터셋일경우
		objDs = obj;
		objCbo = null;
	}
	
	if( objDs == null )
	{	
		this.gfnLog("gfnGetCommonCode :  [Dataset]이 Null 입니다. ","error");
		return;
	}
	
	objDsComm.set_enableevent(false);
	objDs.set_enableevent(false);
	
   	var strFilter = "GRP_COMM_CD==" + nexacro.wrapQuote(oCommArg.grpcd); 		

   	//FIlter조건 추가
    if(!pForm.gfnIsNull(oCommArg.filter)) {
     	strFilter = strFilter + " && " + oCommArg.filter;
    }
	
	objDsComm.filter(strFilter);
	objDs.copyData(objDsComm, true);
	objDsComm.filter("");
	objDs.set_enableevent(true);
	objDsComm.set_enableevent(true);
	
	// first set 세팅
	pForm.gfnSetFirstCd(obj, oCommArg.firstnm, oCommArg.firstcd);
};

/**
 * @class 첫번째 Row에 데이터 추가(콤보용)
 * @param {Object}	objComp 		: 적용할 객체(Dataset/Combo). Combo 선택시 첫번째 index 자동설정
 * @param {String}	sFirstNm 		: 첫번째 Row에 추가할 값 ex) 전체
 * @param {String}	sFirstCd 		: 첫번째 Row에 추가할 CD값. ex) 00
 * @param {String}	sFirstNmCol 	: 첫번째 Row에 추가할 값 컬럼ID. (기본값:Combo의 경우 codecolumn값 사용. Dataset은 "COMM_CD")
 * @param {String}	sFirstCdCol 	: 첫번째 Row에 추가할 CD값  컬럼ID. (기본값:Combo의 경우 datacolumn값 사용. Dataset은 "COMM_NM")
 * @return N/A
 */
pForm.gfnSetFirstCd = function(objComp, sFirstNm, sFirstCd, sFirstNmCol, sFirstCdCol) 
{
	var objDs;		// 대상 데이터셋
	var objCbo;		// 대상 콤보
	
	var sCodeCol = sFirstCdCol;
	var sDataCol = sFirstNmCol;
	
	var obj = objComp;
	
	if( obj instanceof nexacro.Combo ){		//obj 가 콤보일경우
		objDs = obj.getInnerDataset();
		objCbo = obj;
		
		if(this.gfnIsNull(sCodeCol)) {
			sCodeCol = objCbo.codecolumn;
		}
		
		if(this.gfnIsNull(sDataCol)) {
			sDataCol = objCbo.datacolumn;
		}
		
	} else if( obj instanceof Dataset){		//obj 가 데이터셋일경우
		objDs = obj;
		objCbo = null;
	}
	
	if(this.gfnIsNull(sCodeCol)) {
		sCodeCol = "COMM_CD";
	}
	
	if(this.gfnIsNull(sDataCol)) {
		sDataCol = "COMM_NM";
	}
		
	if( objDs == null )
	{	
		this.gfnLog("gfnGetCommonCode :  [Dataset]이 Null 입니다. ","error");
		return;
	}
	
	// first set 세팅
	if(this.gfnIsNull(sFirstNm) != true)
	{
		objDs.insertRow(0);
		if(sFirstCd == "")
		{
			objDs.setColumn(0, sCodeCol, "");
		}
		else
		{
			objDs.setColumn(0, sCodeCol, sFirstCd);
		}
		
		objDs.setColumn(0, sDataCol, sFirstNm);
	}
	
	//콤보값을 넘긴 경우 0번째 인덱스 설정
	if( this.gfnIsNotNull(objCbo) ){
		objCbo.set_index(0);
	}
};

/**
 * dataset의 Column명을 배열로 반환
 * @param {dataset} 대상 Dataset
 * @return {Array} 컬럼명 배열
 */
pForm.gfnGetDatasetCols = function(ds)
{
	var arrCol = new Array();
	var name;
	
	for(i = 0, len = ds.getColCount(); i < len; i++)
	{
		name = ds.getColID(i);
		
		arrCol.push(name);
	}
	
	return arrCol;
};