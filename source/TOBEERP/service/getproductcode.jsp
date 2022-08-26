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
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
	DataSet dsasset = new DataSet("dsasset");
    dsasset.addColumn("code",DataTypes.STRING, 256);
    dsasset.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsgroup = new DataSet("dsgroup");
    dsgroup.addColumn("code",DataTypes.STRING, 256);
    dsgroup.addColumn("value",DataTypes.STRING, 256);
    dsgroup.addColumn("asset",DataTypes.STRING, 256);    
    
    DataSet dsmanufacture = new DataSet("dsmanufacture");
    dsmanufacture.addColumn("code",DataTypes.STRING, 256);
    dsmanufacture.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsunit = new DataSet("dsunit");
    dsunit.addColumn("code",DataTypes.STRING, 256);
    dsunit.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsstatus = new DataSet("dsstatus");
    dsstatus.addColumn("code",DataTypes.STRING, 256);
    dsstatus.addColumn("value",DataTypes.STRING, 256);
    //select * from ERP_DEAL_STATUS
    
    /******* SQL query *************/
    String	SQL1  = "select ASSET_CODE, ASSET_VALUE from ERP_PRODUCT_ASSET";
    int row = 0;
    
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dsasset.newRow();
   		dsasset.set(row, "code", rs1.getString("ASSET_CODE"));    
   		dsasset.set(row, "value", rs1.getString("ASSET_VALUE"));
    }
    
    String SQL2 = "select GROUP_CODE, GROUP_VALUE, ASSET_CODE from ERP_PRODUCT_GROUP";
    row = 0;
    
    rs2 = stmt.executeQuery(SQL2);  
   
    while(rs2.next())
    {
   		row = dsgroup.newRow();
   		dsgroup.set(row, "code", rs2.getString("GROUP_CODE"));    
   		dsgroup.set(row, "value", rs2.getString("GROUP_VALUE"));
   		dsgroup.set(row, "asset", rs2.getString("ASSET_CODE"));
    }
    
    String SQL3 = "select MENUFACTURE_CODE, MENUFACTURE_NAME from ERP_PRODUCT_MENUFACTURE";
	row = 0;
	   
	rs3 = stmt.executeQuery(SQL3);  
	
	while(rs3.next())
	{
		row = dsmanufacture.newRow();
		dsmanufacture.set(row, "code", rs3.getString("MENUFACTURE_CODE"));    
		dsmanufacture.set(row, "value", rs3.getString("MENUFACTURE_NAME"));
	}
	 
	String SQL4 = "select UNIT_CODE, UNIT_VALUE from ERP_PRODUCT_UNIT";
	row = 0;
	   
	rs4 = stmt.executeQuery(SQL4);  
	
	while(rs4.next())
	{
		row = dsunit.newRow();
		dsunit.set(row, "code", rs4.getString("UNIT_CODE"));    
		dsunit.set(row, "value", rs4.getString("UNIT_VALUE"));
	}
	
	String SQL5 = "select STATUS_CODE, STATUS_VALUE from ERP_DEAL_STATUS";
	row = 0;
	   
	rs5 = stmt.executeQuery(SQL5);  
	
	while(rs5.next())
	{
		row = dsstatus.newRow();
		dsstatus.set(row, "code", rs5.getString("STATUS_CODE"));    
		dsstatus.set(row, "value", rs5.getString("STATUS_VALUE"));
	}
	

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsasset);
    pdata.addDataSet(dsgroup);
    pdata.addDataSet(dsunit);
    pdata.addDataSet(dsmanufacture);
    pdata.addDataSet(dsstatus);

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
