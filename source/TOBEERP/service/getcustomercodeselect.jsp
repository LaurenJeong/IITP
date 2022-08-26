<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>

<%@ page contentType="text/xml; charset=utf-8" %>

<%
/****** Service API initialization ******/
PlatformData pdata = new PlatformData();

//create HttpPlatformRequest for receive data from client
HttpPlatformRequest req = new HttpPlatformRequest(request);
req.receiveData();
		
PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");
String sSearch  = varList.getString("argSearch");
		
int nErrorCode = 0;
String strErrorMsg = "START";
String sEstimateCode = "";
/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
/******* SQL query *************/
String SQLCode = "SELECT CORPORATE_CODE FROM ERP_CUSTOMER WHERE CORPORATE_CODE='"+sSearch+"'";

try {
    rs = stmt.executeQuery(SQLCode);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dscode");
    ds.addColumn("code",DataTypes.STRING, 256);
    
    int row = 0;
    String sCode = "";
    while(rs.next())
   {
    	sCode = rs.getString("CORPORATE_CODE");
        row = ds.newRow();
        ds.set(row, "code", sCode); 
        
    }
	
   // System.out.println(sEstimateCode);
    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(ds);
	
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
varList.add("ErrorCode", nErrorCode);
varList.add("ErrorMsg", strErrorMsg);
/******** XML data Create ******/
HttpPlatformResponse res = new HttpPlatformResponse(response, 
    PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(pdata);
res.sendData();
%>
