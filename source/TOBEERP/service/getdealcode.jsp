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
ResultSet  rs7   = null;

Class.forName(jdbcClass);
conn = DriverManager.getConnection(jdbcUrl,dbId,dbPass);
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
	
    //dsType=dstype dsSalesman=dssalesman dsCoporType=dscoportype dsDealType=dsdealtype
    DataSet dstype = new DataSet("dstype");
    dstype.addColumn("code",DataTypes.STRING, 256);
    dstype.addColumn("value",DataTypes.STRING, 256);  
    
    DataSet dssalesman = new DataSet("dssalesman");
    dssalesman.addColumn("code",DataTypes.STRING, 256);
    dssalesman.addColumn("value",DataTypes.STRING, 256);
        
    DataSet dsdealtype = new DataSet("dsdealtype");
    dsdealtype.addColumn("code",DataTypes.STRING, 256);
    dsdealtype.addColumn("value",DataTypes.STRING, 256);

    DataSet dscoportype = new DataSet("dscoportype");
    dscoportype.addColumn("code",DataTypes.STRING, 256);
    dscoportype.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dsunit = new DataSet("dsunit");
    dsunit.addColumn("code",DataTypes.STRING, 256);
    dsunit.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dscondition = new DataSet("dscondition");
    dscondition.addColumn("code",DataTypes.STRING, 256);
    dscondition.addColumn("value",DataTypes.STRING, 256);
    
    DataSet dscustomer = new DataSet("dscustomer");
    dscustomer.addColumn("code",DataTypes.STRING, 256);
    dscustomer.addColumn("value",DataTypes.STRING, 256);
    dscustomer.addColumn("unit",DataTypes.STRING, 256);
    //select * from ERP_DEAL_STATUS
    
    /******* SQL query *************/
   
    
    String SQL1 = "select TYPE_CODE, TYPE_VALUE from erp_account_type";
    int row = 0;
    
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dstype.newRow();
   		dstype.set(row, "code",  rs1.getString("TYPE_CODE"));    
   		dstype.set(row, "value", rs1.getString("TYPE_VALUE"));
    }
    
    String SQL2 = "select EMPLOYEE_CODE,EMPLOYEE_NAME from erp_employee where GROUPS = 'gpbus'";
	row = 0;
	   
	rs2 = stmt.executeQuery(SQL2);  
	
	while(rs2.next())
	{
		row = dssalesman.newRow();
		dssalesman.set(row, "code",  rs2.getString("EMPLOYEE_CODE"));    
		dssalesman.set(row, "value", rs2.getString("EMPLOYEE_NAME"));
	}
	 
	String SQL3 = "select TYPE_CODE, TYPE_VALUE from erp_deal_type";
	row = 0;
	   
	rs3 = stmt.executeQuery(SQL3);  
	
	while(rs3.next())
	{
		row = dsdealtype.newRow();
		dsdealtype.set(row, "code",  rs3.getString("TYPE_CODE"));    
		dsdealtype.set(row, "value", rs3.getString("TYPE_VALUE"));
	}
	
	String SQL4 = "select TYPE_CODE, TYPE_VALUE from erp_customer_type";
	row = 0;
	   
	rs4 = stmt.executeQuery(SQL4);  
	
	while(rs4.next())
	{
		row = dscoportype.newRow();
		dscoportype.set(row, "code",  rs4.getString("TYPE_CODE"));    
		dscoportype.set(row, "value", rs4.getString("TYPE_VALUE"));
	}
	
	String SQL5 = "select UNIT_CODE, UNIT_VALUE from erp_product_unit";
	row = 0;
	   
	rs5 = stmt.executeQuery(SQL5);  
	
	while(rs5.next())
	{
		row = dsunit.newRow();
		dsunit.set(row, "code",  rs5.getString("UNIT_CODE"));    
		dsunit.set(row, "value", rs5.getString("UNIT_VALUE"));
	}
	
	String SQL6 = "select CONDITION_CODE, CONDITION_VALUE from erp_business_condition where CONDITION_STATUS='Y'";
	row = 0;
	   
	rs6 = stmt.executeQuery(SQL6);  
	
	while(rs6.next())
	{
		row = dscondition.newRow();
		dscondition.set(row, "code",  rs6.getString("CONDITION_CODE"));    
		dscondition.set(row, "value", rs6.getString("CONDITION_VALUE"));
	}
	
	// QuickCode ���ÿ� �ŷ�ó ������ ��ȸ
	String SQL7 = "select CORPORATE_CODE, CORPORATE_NAME, UNIT_PRICE_CODE from erp_customer WHERE DEAL_STATUS != 's3'";
	row = 0;
	   
	rs7 = stmt.executeQuery(SQL7);  
	
	while(rs7.next())
	{
		row = dscustomer.newRow();
		dscustomer.set(row, "code", rs7.getString("CORPORATE_CODE"));    
		dscustomer.set(row, "value", rs7.getString("CORPORATE_NAME"));
		dscustomer.set(row, "unit", rs7.getString("UNIT_PRICE_CODE"));
	}
	//
    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dstype);
    pdata.addDataSet(dssalesman);
    pdata.addDataSet(dsdealtype);
    pdata.addDataSet(dscoportype);
    pdata.addDataSet(dsunit);
    pdata.addDataSet(dscondition);
    pdata.addDataSet(dscustomer);
    
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
