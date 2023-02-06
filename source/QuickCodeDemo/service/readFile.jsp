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
String strFilePath = inVariableList.getString("FilePath");
//System.out.println("strFilePath ====================== " + strFilePath);

int nErrorCode = 0;
String strErrorMsg = "START";
String Contents = "";
BufferedReader reader = null;

String contextRealPath = request.getServletContext().getRealPath("/WEB-INF/files");

String resourcePath = contextRealPath + "/" + strProjectId + "/" + strFilePath;

try
{
	
	StringBuffer sb = new StringBuffer();
	reader = new BufferedReader(new FileReader(resourcePath));
    while(true){
    	String str = reader.readLine();
    	if(str == null) break;
    	sb.append(str);
    	sb.append("\n");
    }
    
 	DataSet ds = new DataSet("output");

	ds.addColumn("contents", DataTypes.STRING, 5000);

	int row = ds.newRow();
	ds.set(row, "contents", sb.toString());

	o_xpData.addDataSet(ds);

	nErrorCode = 0;
	strErrorMsg = "SUCC";
 
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


reader.close();
out.clear();
pRes.sendData();
%>