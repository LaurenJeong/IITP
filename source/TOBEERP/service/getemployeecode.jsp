<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>

<%@ page contentType="text/xml; charset=utf-8" %>

<%
/****** Service API initialization ******/
PlatformData pdata = new PlatformData();

HttpPlatformRequest req = new HttpPlatformRequest(request);
req.receiveData();
		
PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");

int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs1   = null;
ResultSet  rs2   = null;
ResultSet  rs3   = null;
ResultSet  rs4   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
    DataSet dsdepart = new DataSet("dsdepart");
    dsdepart.addColumn("code",DataTypes.STRING, 256);
    dsdepart.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsstatus = new DataSet("dsstatus");
    dsstatus.addColumn("code",DataTypes.STRING, 256);
    dsstatus.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsgroup = new DataSet("dsgroup");
    dsgroup.addColumn("code",DataTypes.STRING, 256);
    dsgroup.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsposition = new DataSet("dsposition");
    dsposition.addColumn("code",DataTypes.STRING, 256);
    dsposition.addColumn("value",DataTypes.STRING, 256);
    
    /******* SQL query *************/
    String	SQL1  = "select STATUS_CODE, STATUS_VALUE from ERP_EMP_STATUS";
    int row = 0;
    
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dsstatus.newRow();
   		dsstatus.set(row, "code", rs1.getString("STATUS_CODE"));    
   		dsstatus.set(row, "value", rs1.getString("STATUS_VALUE"));
    }
    
    String SQL2 = "select POSITION_CODE, POSITION_VALUE from ERP_EMP_POSITION";
    row = 0;
    
    rs2 = stmt.executeQuery(SQL2);  
   
    while(rs2.next())
    {
   		row = dsposition.newRow();
   		dsposition.set(row, "code", rs2.getString("POSITION_CODE"));    
   		dsposition.set(row, "value", rs2.getString("POSITION_VALUE"));
    }
    
    String SQL3 = "select DEPARTMENT_CODE, DEPARTMENT_VALUE from ERP_EMP_DEPARTMENT";
	row = 0;
	   
	rs3 = stmt.executeQuery(SQL3);  
	
	while(rs3.next())
	{
		row = dsdepart.newRow();
		dsdepart.set(row, "code", rs3.getString("DEPARTMENT_CODE"));    
		dsdepart.set(row, "value", rs3.getString("DEPARTMENT_VALUE"));
	}
	 
	String SQL4 = "select GROUP_CODE, GROUP_VALUE from ERP_EMP_GROUP";
	row = 0;
	   
	rs4 = stmt.executeQuery(SQL4);  
	
	while(rs4.next())
	{
		row = dsgroup.newRow();
		dsgroup.set(row, "code", rs4.getString("GROUP_CODE"));    
		dsgroup.set(row, "value", rs4.getString("GROUP_VALUE"));
	}

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsstatus);
    pdata.addDataSet(dsposition);
    pdata.addDataSet(dsdepart);
    pdata.addDataSet(dsgroup);

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
