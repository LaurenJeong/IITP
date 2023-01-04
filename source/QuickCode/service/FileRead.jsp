<%@ page contentType="text/html;charset=utf-8" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>
<%@ page language="java"%>
<%@ page import="java.io.*" %>
<%@ page import="java.util.Enumeration" %>
<%@ page import="java.sql.*" %>
<%@ page import="java.net.URL" %>
<%
	PlatformData o_xpData = new PlatformData();
HttpPlatformRequest platformRequest = new HttpPlatformRequest(request);

platformRequest.receiveData();

PlatformData pData = platformRequest.getData(); 

DataSetList  in_dl = new DataSetList();     //input dataset list
DataSetList  inDataSetList   = pData.getDataSetList();
VariableList inVariableList  = pData.getVariableList();

in_dl = pData.getDataSetList();  // dataset list	
DataSet in_ds = in_dl.get("input"); //Dataset

String strProjectId = inVariableList.getString("ProjectId");
//System.out.println("strProjectId ====================== " + strProjectId);
String strFolderPath = inVariableList.getString("FilePath");
//System.out.println("strFolderPath ====================== " + strFolderPath);
String strFilePath = inVariableList.getString("FileNm");
//System.out.println("strFilePath ====================== " + strFilePath);

int nErrorCode = 0;
String strErrorMsg = "START";
String Contents = "";


String strURLPath = request.getRequestURL().substring(0,request.getRequestURL().lastIndexOf("/"));
String resourcePath = strURLPath + "/" + "source" + "/" + strProjectId + "/" + strFolderPath + "/" + strFilePath;

//String resourcePath = "http://support.tobesoft.co.kr:8080/Next_JSP/nexacro_source" + strFolderPath + strFilePath ;

//System.out.println(">>>>>>>>>>>>>>> resourcePath : " + resourcePath);	

try
{

	BufferedReader br = null;
	char[] buff = new char[512];
	int len = -1;

	URL url = new URL(resourcePath);
 
	br = new BufferedReader(new InputStreamReader(url.openStream(), "utf-8")); //url.openStream()은 new InputStreamReader()랑 같은 기능을 함. 바이트->문자
	while ((len = br.read(buff)) != -1) {
		Contents += new String(buff, 0, len);
	}

	DataSet ds = new DataSet("output");

	ds.addColumn("contents", DataTypes.STRING, 5000);

	int row = ds.newRow();
	ds.set(row, "contents", Contents);

	o_xpData.addDataSet(ds);

	nErrorCode = 0;
	strErrorMsg = "SUCC";

	if (br != null)
		br.close();
} catch (Exception e) {
	nErrorCode = -1;
	strErrorMsg = e.getMessage();
}

VariableList varList = o_xpData.getVariableList();

varList.add("ErrorCode", 0);
varList.add("ErrorMsg", strErrorMsg);

HttpPlatformRequest pReq = new HttpPlatformRequest(request);
HttpPlatformResponse pRes = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML, "UTF-8");
//HttpPlatformResponse pRes = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_BINARY, "UTF-8");
pRes.setData(o_xpData);

out.clear();
pRes.sendData();
%>