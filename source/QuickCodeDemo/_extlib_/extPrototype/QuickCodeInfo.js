/**
*  컨설팅 표준화 작업
*  @FileName 	QuickCodeInfo.js 
*  @Creator 	consulting
*  @CreateDate 	2023.01.16
*  @Desction   		
************** 소스 수정 이력 ***********************************************
*  date          		Modifier                Description
*******************************************************************************
*  2023.01.16     	consulting 	                최초 생성 
*******************************************************************************
*/

var pForm = nexacro.Form.prototype;

/**
 * @class 파일의 URL 정보를 반환
 * @param {String} sFilePath - 파일 URL
 * @return N/A
 */
pForm.gfnGetSourceUrl = function (sFilePath)
{
	var sSourceUrl = sFilePath;
	
	// URL전환
	if (sSourceUrl.indexOf("::") >= 0)
	{
		var arrPrefix = sSourceUrl.split("::");
		var sPrefix = arrPrefix[0];
		
		sSourceUrl = nexacro.getEnvironment().services[sPrefix].url + arrPrefix[1];
		
		if (sSourceUrl.substr(0,2) == "./")		sSourceUrl = sSourceUrl.substring(2);
		//this.gfnLog("sFilePath : " + sFilePath);
	}
	
	return sSourceUrl;
};

/**
 * @class 파일의 내용을 읽는 함수
 * @param {Object} obj - 콤포넌트
 * @return N/A
 */
pForm.gfnGetReadFile = function (sFilePath, oDsOutputNm, sSvcId)
{
	if (this.gfnIsNull(sFilePath) || this.gfnIsNull(oDsOutputNm))
	{
		return;
	}
	
	sFilePath = this.gfnGetSourceUrl(sFilePath);
	
	// 파일읽기
	var strSvcId    = this.gfnNvl(sSvcId,"gfnGetReadFile");
	var strSvcUrl   = "readFile.jsp";
	var inData      = "";
	var outData     = oDsOutputNm + "=output";
	var callBackFnc = "fnCallbackReadFile";
	var isAsync   	= true;
	
	var strArg	 = "ProjectId=" + this.gfnGetApplication().id;
		strArg	+= " FilePath=" + nexacro.wrapQuote(sFilePath);
	
	this.gfnTransaction(strSvcId , 		// transaction을 구분하기 위한 svc id값
						strSvcUrl , 	// trabsaction을 요청할 주소
						inData , 		// 입력값으로 보낼 dataset id , a=b형태로 실제이름과 입력이름을 매칭
						outData , 		// 처리결과값으로 받을 dataset id, a=b형태로 실제이름과 입력이름을 매칭
						strArg); 		// 입력값으로 보낼 arguments, strFormData="20120607"
};

// xml을 json으로 변환해주는 xmlToJson함수 선언
pForm.gfnXmlToJson = function(xml)
{
    // Create the return object
    var obj = {};
	
    if (xml.nodeType == 1) {
		// element
		// do attributes
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
    } else if (xml.nodeType == 3) {
		// text
		obj = xml.nodeValue;
    }
	
    // do children
    // If all text nodes inside, get concatenated text from them.
    var textNodes = [].slice.call(xml.childNodes).filter(function(node) {
			return node.nodeType === 3;
		});
    if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
		obj = [].slice.call(xml.childNodes).reduce(function(text, node) {
				return text + node.nodeValue;
			}, "");
    } else if (xml.hasChildNodes()) {
		for (var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof obj[nodeName] == "undefined") {
				obj[nodeName] = this.gfnXmlToJson(item);
			} else {
				if (typeof obj[nodeName].push == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(this.gfnXmlToJson(item));
			}
		}
    }
    return obj;
};

pForm.gfnGetFormContents = function(sContents) 
{
	if (this.gfnIsNull(sContents))		return;
	
	var domPar, domDoc;
	var formNode;
	
	// 폼 읽은거 바로 사용하는 경우 웹에서 파싱을 하지 못해 폼정보만 추출 후 파싱함.
	var nSIdx = sContents.indexOf('<Form');
	var nEIdx = sContents.indexOf('</FDL>');
	
	sContents = sContents.substring(nSIdx , nEIdx -1);
	sContents = '<?xml version="1.0" encoding="UTF-8"?>' + sContents;
	
	domPar = new nexacro.DomParser();
	domDoc = domPar.parseFromString(sContents);
	
	if(!domDoc)		return;
		
	formNode = domDoc.firstChild;
//	
// 	if (formNode) {
// 		oContents = pForm.gfnXmlToJson(formNode);
// 	}
// 	
// 	return oContents;

	return formNode;
};

pForm.gfnGetChildContents = function(oContents, sTag) 
{
	var arrChildNodes = oContents.childNodes;
	var oChildren;
	var arrChild = new Array();
		
	for (var i = 0; i < arrChildNodes.length; i++)
	{
		oChildren = arrChildNodes[i];
		
		//trace("oChildren.tagName : " + oChildren.tagName);
		
		if (oChildren.tagName == sTag)
		{
			arrChild.push(oChildren);
		}
	}
	
	return arrChild;
};

pForm.gfnToStringXML = function(oDom) 
{
	var objXml = new nexacro.XmlSerializer();
	
	return objXml.serializeToString(oDom);
};

// /**
//  * @class Contents에서 해당하는 Contents 반환
//  * @param {Object} oTarget - 대상 Contents Object
//  * @param {String} sElem - 부모 Property 명
//  * @param {String} sKey	- 체크 할 Property 명
//  * @param {String} sValue - 체크 할 Property 값
//  * @return {Object} Contents
//  */
// pForm.gfnGetObjectContents = function(oTarget, sElem, sKey, sValue)
// {
// 	var oObject;
// 	var oContents;
// 	
// 	if (this.lfn_IsNotNull(oTarget))
// 	{
// 		if (this.lfn_IsNotNull(sElem)) {
// 			oObject = oTarget[sElem];
// 		} else {
// 			oObject = oTarget;
// 		}
// 		
// 		oContents = this.lfn_GetMatchObject(oObject, sKey, sValue);
// 	}
// 	
// 	return oContents;
// };
// 
// /**
//  * @class Object에 해당하는 Contents 반환
//  * @param {Object} oObject - 대상 Object
//  * @param {String} sKey	- 체크 할 Property 명
//  * @param {String} sValue - 체크 할 Property 값
//  * @return {Object} Contents
//  */
// pForm.gfnGetMatchObject = function(oObject, sKey, sValue)
// {
// 	var oRet;
// 	
// 	if (Array.isArray(oObject)) {
// 		oRet = oObject.find(oObject => oObject[sKey]==sValue || (oObject.hasOwnProperty("attribute") && oObject.attribute[sKey]==sValue));
// 	} else if (oObject instanceof Object) {
// 		for(var elem in oObject){
// 			if (elem == sKey && oObject[elem] == sValue)
// 			{
// 				oRet = oObject;
// 				break;
// 			}
// 			else if (oObject[elem][sKey] == sValue)
// 			{
// 				oRet = oObject[elem];
// 				break;
// 			}
// 		}
// 	}
// 	
// 	return oRet;
// };