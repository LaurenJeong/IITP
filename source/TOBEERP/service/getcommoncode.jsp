<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>

<%@ page contentType="text/xml; charset=utf-8" %>
<%@ include file="lib/include_const.jsp" %>
<%
/****** Service API initialization ******/
PlatformData pdata = new PlatformData();

HttpPlatformRequest req = new HttpPlatformRequest(request);
req.receiveData();
		
PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");
//String dbUrl  = "172.10.12.58";
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs1   = null;
ResultSet  rs2   = null;
ResultSet  rs3   = null;
ResultSet  rs4   = null;

Class.forName(jdbcClass);
conn = DriverManager.getConnection(jdbcUrl,dbId,dbPass);
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
    DataSet dsarea = new DataSet("dsarea");
    dsarea.addColumn("code",DataTypes.STRING, 256);
    dsarea.addColumn("value",DataTypes.STRING, 256);
    
    /******* SQL query *************/
    String	SQL1  = "select CODE_NUM,CODE_VALUE from erp_area";
    int row = 0;
    
    rs1 = stmt.executeQuery(SQL1);  
    System.out.println("SQL1:" + SQL1);
    while(rs1.next())
    {
   		row = dsarea.newRow();
   		dsarea.set(row, "code", rs1.getString("CODE_NUM"));    
   		dsarea.set(row, "value", rs1.getString("CODE_VALUE"));
    }


    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsarea);

    nErrorCode = 0;
    strErrorMsg = "SUCC";
}
catch(SQLException e) {
    nErrorCode = -1;
    strErrorMsg = e.getMessage();
}

/******** JDBC Close *******/
if ( stmt != null ) try { stmt.close(); } catch (Exception e) {}
if ( conn != null ) try { conn.close(); } catch (Exception e) {}

PlatformData senddata = new PlatformData();
VariableList sendList = senddata.getVariableList();
sendList.add("ErrorCode", nErrorCode);
sendList.add("ErrorMsg", strErrorMsg);

/******** XML data Create ******/
HttpPlatformResponse res = new HttpPlatformResponse(response, 
    PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(pdata);
res.sendData();
%>
