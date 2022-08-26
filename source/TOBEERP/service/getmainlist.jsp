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
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

try {
	
	/********* Dataset Create ************/
	DataSet dsdeal = new DataSet("dsdeal");
	dsdeal.addColumn("DEAL_CODE",DataTypes.STRING, 256);
	dsdeal.addColumn("DEAL_TYPE",DataTypes.STRING, 256);
	dsdeal.addColumn("DEAL_DATE",DataTypes.STRING, 256);
	dsdeal.addColumn("CUSTOMER_NAME",DataTypes.STRING, 256);
	dsdeal.addColumn("ADD_IN_TAX",DataTypes.STRING, 256);
	dsdeal.addColumn("TOTAL_PRICE",DataTypes.STRING, 256);
	
	DataSet dsestimate = new DataSet("dsestimate");
	dsestimate.addColumn("ESTIMATE_DATE",DataTypes.STRING, 256);
	dsestimate.addColumn("ESTIMATE_STATUS",DataTypes.STRING, 256);
	dsestimate.addColumn("SALESMAN_CODE",DataTypes.STRING, 256);
	dsestimate.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
	dsestimate.addColumn("ESTIMATE_TYPE",DataTypes.STRING, 256);
	dsestimate.addColumn("ESTIMATE_TITLE",DataTypes.STRING, 256);
	dsestimate.addColumn("EXPIRY_TERM",DataTypes.STRING, 256);
	dsestimate.addColumn("CORPORATE_NAME",DataTypes.STRING, 256);
	
	DataSet dscustomer = new DataSet("dscustomer");
	dscustomer.addColumn("CUSTOMER",DataTypes.STRING, 256);
	dscustomer.addColumn("TOTAL_PRICE",DataTypes.STRING, 256);
    
    /******* SQL query *************/
    String	SQL1  = "SELECT TOP 5 DEAL_CODE, TYPE_VALUE, DEAL_DATE , ADD_IN_TAX, CORPORATE_NAME, TOTAL_PRICE "+ "\n" +
    				"FROM ERP_DEAL, ERP_ACCOUNT_TYPE, ERP_CUSTOMER " + "\n" +
    				"WHERE ERP_ACCOUNT_TYPE.TYPE_CODE=ERP_DEAL.DEAL_TYPE AND ERP_CUSTOMER.CORPORATE_CODE = ERP_DEAL.CUSTOMER_CODE ORDER BY ERP_DEAL.DEAL_DATE DESC";
    int row = 0;
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dsdeal.newRow();
   		dsdeal.set(row, "DEAL_CODE", rs1.getString("DEAL_CODE"));    
   		dsdeal.set(row, "DEAL_TYPE", rs1.getString("TYPE_VALUE"));
   		dsdeal.set(row, "DEAL_DATE", rs1.getString("DEAL_DATE"));
   		dsdeal.set(row, "CUSTOMER_NAME", rs1.getString("CORPORATE_NAME"));
   		dsdeal.set(row, "ADD_IN_TAX", rs1.getString("ADD_IN_TAX"));
   		dsdeal.set(row, "TOTAL_PRICE", rs1.getString("TOTAL_PRICE"));
    }
    
    String SQL2 = "SELECT TOP 5 ESTIMATE_DATE,ESTIMATE_STATUS,SALESMAN_CODE,CUSTOMER_CODE, CORPORATE_NAME ,ESTIMATE_TYPE,ESTIMATE_TITLE,EXPIRY_TERM FROM ERP_ESTIMATE ,ERP_CUSTOMER" +
    			" WHERE ERP_ESTIMATE.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE ORDER BY ERP_ESTIMATE.ESTIMATE_DATE DESC";
    
    row = 0;
    rs2 = stmt.executeQuery(SQL2);  
    while(rs2.next())
    {
   		row = dsestimate.newRow();
   		dsestimate.set(row, "ESTIMATE_DATE", rs2.getString("ESTIMATE_DATE"));    
   		dsestimate.set(row, "ESTIMATE_STATUS", rs2.getString("ESTIMATE_STATUS"));
   		dsestimate.set(row, "SALESMAN_CODE", rs2.getString("SALESMAN_CODE"));
   		dsestimate.set(row, "CUSTOMER_CODE", rs2.getString("CUSTOMER_CODE"));
   		dsestimate.set(row, "ESTIMATE_TYPE", rs2.getString("ESTIMATE_TYPE"));
   		dsestimate.set(row, "ESTIMATE_TITLE", rs2.getString("ESTIMATE_TITLE"));
   		dsestimate.set(row, "EXPIRY_TERM", rs2.getString("EXPIRY_TERM"));
   		dsestimate.set(row, "CORPORATE_NAME", rs2.getString("CORPORATE_NAME"));
    }
    
    String SQL3 = "SELECT SALES_TOTAL_PRICE, CUSTOMER_CODE, CORPORATE_NAME FROM ERP_DEAL_CUSTOMER, ERP_CUSTOMER WHERE ERP_DEAL_CUSTOMER.CUSTOMER_CODE=ERP_CUSTOMER.CORPORATE_CODE  order by  ERP_DEAL_CUSTOMER.SALES_TOTAL_PRICE desc";

	row = 0;
	rs3 = stmt.executeQuery(SQL3);  
	while(rs3.next())
	{
			row = dscustomer.newRow();
			dscustomer.set(row, "CUSTOMER", rs3.getString("CORPORATE_NAME"));    
			dscustomer.set(row, "TOTAL_PRICE", rs3.getString("SALES_TOTAL_PRICE"));
	}
    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsdeal);
    pdata.addDataSet(dsestimate);
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
