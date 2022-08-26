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
ResultSet  rs5	 = null;
ResultSet  rs6   = null;
ResultSet  rs7   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
	DataSet dsstatus = new DataSet("dsstatus");
	dsstatus.addColumn("code",DataTypes.STRING, 256);
	dsstatus.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dstype = new DataSet("dstype");
    dstype.addColumn("code",DataTypes.STRING, 256);
    dstype.addColumn("value",DataTypes.STRING, 256);  
    
    DataSet dssalesman = new DataSet("dssalesman");
    dssalesman.addColumn("code",DataTypes.STRING, 256);
    dssalesman.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dspayment = new DataSet("dspayment");
    dspayment.addColumn("code",DataTypes.STRING, 256);
    dspayment.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dssurtax = new DataSet("dssurtax");
    dssurtax.addColumn("code",DataTypes.STRING, 256);
    dssurtax.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsunit = new DataSet("dsunit");
    dsunit.addColumn("code",DataTypes.STRING, 256);
    dsunit.addColumn("value",DataTypes.STRING, 256); 
    
    DataSet dsexpiry = new DataSet("dsexpiry");
    dsexpiry.addColumn("code",DataTypes.STRING, 256); 
    dsexpiry.addColumn("value",DataTypes.STRING, 256);
    dsexpiry.addColumn("term",DataTypes.STRING, 256); 
    //select * from ERP_DEAL_STATUS
    
    /******* SQL query *************/
    String	SQL1  = "select STATUS_CODE, STATUS_VALUE from ERP_ESTIMATE_STATUS";
    int row = 0;
    
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dsstatus.newRow();
   		dsstatus.set(row, "code", rs1.getString("STATUS_CODE"));    
   		dsstatus.set(row, "value", rs1.getString("STATUS_VALUE"));
    }
    
    String SQL2 = "select TYPE_CODE, TYPE_VALUE from ERP_ACCOUNT_TYPE";
    row = 0;
    
    rs2 = stmt.executeQuery(SQL2);  
   
    while(rs2.next())
    {
   		row = dstype.newRow();
   		dstype.set(row, "code", rs2.getString("TYPE_CODE"));    
   		dstype.set(row, "value", rs2.getString("TYPE_VALUE"));
    }
    
    String SQL3 = "select EMPLOYEE_CODE,EMPLOYEE_NAME from ERP_EMPLOYEE where GROUPS = 'gpbus'";
	row = 0;
	   
	rs3 = stmt.executeQuery(SQL3);  
	
	while(rs3.next())
	{
		row = dssalesman.newRow();
		dssalesman.set(row, "code", rs3.getString("EMPLOYEE_CODE"));    
		dssalesman.set(row, "value", rs3.getString("EMPLOYEE_NAME"));
	}
	 
	String SQL4 = "select PAYMENT_CODE, PAYMENT_VALUE from ERP_PAYMENT_TYPE";
	row = 0;
	   
	rs4 = stmt.executeQuery(SQL4);  
	
	while(rs4.next())
	{
		row = dspayment.newRow();
		dspayment.set(row, "code", rs4.getString("PAYMENT_CODE"));    
		dspayment.set(row, "value", rs4.getString("PAYMENT_VALUE"));
	}
	
	String SQL5 = "select TYPE_CODE, TYPE_VALUE from ERP_DEAL_TYPE";
	row = 0;
	   
	rs5 = stmt.executeQuery(SQL5);  
	
	while(rs5.next())
	{
		row = dssurtax.newRow();
		dssurtax.set(row, "code", rs5.getString("TYPE_CODE"));    
		dssurtax.set(row, "value", rs5.getString("TYPE_VALUE"));
	}
	
	String SQL6 = "select UNIT_CODE, UNIT_VALUE from ERP_PRODUCT_UNIT";
	row = 0;
	   
	rs6 = stmt.executeQuery(SQL6);  
	
	while(rs6.next())
	{
		row = dsunit.newRow();
		dsunit.set(row, "code", rs6.getString("UNIT_CODE"));    
		dsunit.set(row, "value", rs6.getString("UNIT_VALUE"));
	}
	
	String SQL7 = "select TYPE_CODE, TYPE_VALUE, TYPE_TERM from ERP_EXPIRY_TYPE";
	row = 0;
	   
	rs7 = stmt.executeQuery(SQL7);  
	
	while(rs7.next())
	{
		row = dsexpiry.newRow();
		dsexpiry.set(row, "code", rs7.getString("TYPE_CODE"));  		
		dsexpiry.set(row, "value", rs7.getString("TYPE_VALUE"));
		dsexpiry.set(row, "term", rs7.getString("TYPE_TERM"));
	}
	

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsstatus);
    pdata.addDataSet(dstype);
    pdata.addDataSet(dssalesman);
    pdata.addDataSet(dspayment);
    pdata.addDataSet(dssurtax);
    pdata.addDataSet(dsunit);
    pdata.addDataSet(dsexpiry);
    
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
