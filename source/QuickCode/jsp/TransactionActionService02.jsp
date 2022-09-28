<%@ page language="java" contentType="text/xml; charset=utf-8"%>

<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>
<%@ page import="com.nexacro.java.xapi.data.datatype.*" %>

<%
    String strCharset = "utf-8";
    PlatformData pdata = new PlatformData();
    PlatformRequest platformRequest = new PlatformRequest(request.getInputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
    platformRequest.receiveData();
    PlatformData inPD = platformRequest.getData();

    VariableList    inVariableList  = inPD.getVariableList();
    DataSetList     inDataSetList   = inPD.getDataSetList();
    
    PlatformResponse platformResponse = new PlatformResponse(response.getOutputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
	PlatformData outPD = new PlatformData();
    VariableList    outVariableList  = new VariableList();
    DataSetList     outDataSetList   = new DataSetList();
    
     outVariableList.add("ErrorCode", -100);
     outVariableList.add("ErrorMsg",  "ERROR 발생");
     
     outPD.setDataSetList(outDataSetList);
     outPD.setVariableList(outVariableList);
     out.clear();
     out = pageContext.pushBody();
     platformResponse.setData(outPD);
     platformResponse.sendData();
%>
