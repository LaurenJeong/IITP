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

int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs1   = null;
ResultSet  rs2   = null;
ResultSet  rs3   = null;
ResultSet  rs4   = null;
ResultSet  rs5   = null;
ResultSet  rs6   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
    DataSet dsdealstatus = new DataSet("dsdealstatus");
    dsdealstatus.addColumn("code",DataTypes.STRING, 256);
    dsdealstatus.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsbusscondition = new DataSet("dsbusscondition");
    dsbusscondition.addColumn("code",DataTypes.STRING, 256);
    dsbusscondition.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dscoportype = new DataSet("dscoportype");
    dscoportype.addColumn("code",DataTypes.STRING, 256);
    dscoportype.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsarea = new DataSet("dsarea");
    dsarea.addColumn("code",DataTypes.STRING, 256);
    dsarea.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dssalesman = new DataSet("dssalesman");
    dssalesman.addColumn("code",DataTypes.STRING, 256);
    dssalesman.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsunit = new DataSet("dsunit");
    dsunit.addColumn("code",DataTypes.STRING, 256);
    dsunit.addColumn("value",DataTypes.STRING, 256);
    
    /******* SQL query *************/
    String	SQL1  = "select * from ERP_DEAL_STATUS";
    int row = 0;
    
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dsdealstatus.newRow();
   		dsdealstatus.set(row, "code", rs1.getString("STATUS_CODE"));    
   		dsdealstatus.set(row, "value", rs1.getString("STATUS_VALUE"));
    }
    
    String SQL2 = "select CONDITION_CODE, CONDITION_VALUE from ERP_BUSINESS_CONDITION where CONDITION_STATUS='Y';";
    row = 0;
    
    rs2 = stmt.executeQuery(SQL2);  
   
    while(rs2.next())
    {
   		row = dsbusscondition.newRow();
   		dsbusscondition.set(row, "code", rs2.getString("CONDITION_CODE"));    
   		dsbusscondition.set(row, "value", rs2.getString("CONDITION_VALUE"));
    }
    
    String SQL3 = "select * from ERP_CUSTOMER_TYPE";
	row = 0;
	   
	rs3 = stmt.executeQuery(SQL3);  
	
	while(rs3.next())
	{
		row = dscoportype.newRow();
		dscoportype.set(row, "code", rs3.getString("TYPE_CODE"));    
		dscoportype.set(row, "value", rs3.getString("TYPE_VALUE"));
	}
	 
	String SQL4 = "select * from ERP_AREA";
	row = 0;
	   
	rs4 = stmt.executeQuery(SQL4);  
	
	while(rs4.next())
	{
		row = dsarea.newRow();
		dsarea.set(row, "code", rs4.getString("CODE_NUM"));    
		dsarea.set(row, "value", rs4.getString("CODE_VALUE"));
	}
	
	String	SQL5  = "select EMPLOYEE_CODE,EMPLOYEE_NAME from ERP_EMPLOYEE where GROUPS = 'gpbus'";
    row = 0;
    
    rs5 = stmt.executeQuery(SQL5);  
   
    while(rs5.next())
    {
   		row = dssalesman.newRow();
   		dssalesman.set(row, "code", rs5.getString("EMPLOYEE_CODE"));    
   		dssalesman.set(row, "value", rs5.getString("EMPLOYEE_NAME"));
    }
    
    String	SQL6  = "select * from ERP_DEAL_UNIT";
    row = 0;
    
    rs6 = stmt.executeQuery(SQL6);  
   
    while(rs6.next())
    {
   		row = dsunit.newRow();
   		dsunit.set(row, "code", rs6.getString("UNIT_CODE"));    
   		dsunit.set(row, "value", rs6.getString("UNIT_VALUE"));
    }

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsdealstatus);
    pdata.addDataSet(dsbusscondition);
    pdata.addDataSet(dscoportype);
    pdata.addDataSet(dsarea);
    pdata.addDataSet(dssalesman);
    pdata.addDataSet(dsunit);

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
