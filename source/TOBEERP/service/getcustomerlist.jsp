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
String sStatus  = varList.getString("argStatus");

		
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

/******* SQL query *************/

String SQL = "select * from ERP_CUSTOMER";
if(sSearch != null)
{
	SQL += " WHERE CORPORATE_NAME like '%"+sSearch+"%'";
}

if(sStatus != null)
{
	if(sSearch == null)
	{
		SQL += " WHERE DEAL_STATUS='"+sStatus+"'";
	}
	else
	{
		SQL += " AND DEAL_STATUS='"+sStatus+"'";
	}
}
else
{
	if(sSearch == null)
	{
		SQL += " WHERE DEAL_STATUS != 's3'";
	}
	else
	{
		SQL += " AND DEAL_STATUS != 's3'";
	}
}

SQL += " ORDER BY CORPORATE_NAME ASC";
try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dscustomer");
    ds.addColumn("BUSINESS_LICENSE_NUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_NAME",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_CODE",DataTypes.STRING, 256);
    ds.addColumn("ESTABLISHMENT_NUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_TYPE",DataTypes.STRING, 256);
    ds.addColumn("REPRESENTATIVE_NAME",DataTypes.STRING, 256);
    ds.addColumn("REPRESENTATIVE_SOCIAL_NUM",DataTypes.STRING, 256);
    ds.addColumn("BUSINESS_CONDITION",DataTypes.STRING, 256);
    ds.addColumn("BUSINESS_TYPE",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_AREA",DataTypes.STRING, 256);
    ds.addColumn("STAFF_NAME",DataTypes.STRING, 256);
    ds.addColumn("STAFF_TELNUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_EMAIL",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_HOMEPAGE",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_TELNUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_FAXNUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_POSTAL_CODE",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_ADRESS1",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_ADRESS2",DataTypes.STRING, 256);
    ds.addColumn("SALESPERSON_CODE",DataTypes.STRING, 256);
    ds.addColumn("UNIT_PRICE_CODE",DataTypes.STRING, 256);
    ds.addColumn("SALES_STATUS_CODE",DataTypes.STRING, 256);
    ds.addColumn("ORDER_PASSWORD",DataTypes.STRING, 256);
    ds.addColumn("DEAL_START_DATE",DataTypes.STRING, 256);
    ds.addColumn("DEAL_FINAL_DATE",DataTypes.STRING, 256);
    ds.addColumn("PAYMENT_DATE",DataTypes.STRING, 256);
    ds.addColumn("LOAN_LIMIT",DataTypes.STRING, 256);
    ds.addColumn("UNCOLLECTED_AMOUNT",DataTypes.STRING, 256);
    ds.addColumn("UNPAID_AMOUNT",DataTypes.STRING, 256);
    ds.addColumn("ACCOUMULATE_FUND",DataTypes.STRING, 256);
    ds.addColumn("ADD_TAX_RATE",DataTypes.STRING, 256);
    ds.addColumn("DISCOUNT_EXTRA_RATE",DataTypes.STRING, 256);
    ds.addColumn("ETC1",DataTypes.STRING, 256);
    ds.addColumn("ETC2",DataTypes.STRING, 256);
    ds.addColumn("UNIT_DISPLAY",DataTypes.STRING, 256);
    ds.addColumn("INIT_ACCOUMULATE_FUND",DataTypes.STRING, 256);
    ds.addColumn("DEAL_STATUS",DataTypes.STRING, 256);
    
    DataSet dsdealunit = new DataSet("dsdealunit");
    dsdealunit.addColumn("code",DataTypes.STRING, 256);
    dsdealunit.addColumn("value",DataTypes.STRING, 256);
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "BUSINESS_LICENSE_NUM", rs.getString("BUSINESS_LICENSE_NUM"));
        ds.set(row, "CORPORATE_NAME", rs.getString("CORPORATE_NAME"));
        ds.set(row, "CORPORATE_CODE", rs.getString("CORPORATE_CODE"));
        ds.set(row, "ESTABLISHMENT_NUM", rs.getString("ESTABLISHMENT_NUM"));
        ds.set(row, "CORPORATE_TYPE", rs.getString("CORPORATE_TYPE"));
        ds.set(row, "REPRESENTATIVE_NAME", rs.getString("REPRESENTATIVE_NAME"));
        ds.set(row, "REPRESENTATIVE_SOCIAL_NUM", rs.getString("REPRESENTATIVE_SOCIAL_NUM"));
        ds.set(row, "BUSINESS_CONDITION", rs.getString("BUSINESS_CONDITION"));
        ds.set(row, "BUSINESS_TYPE", rs.getString("BUSINESS_TYPE"));
        ds.set(row, "CORPORATE_AREA", rs.getString("CORPORATE_AREA"));
        ds.set(row, "STAFF_NAME", rs.getString("STAFF_NAME"));
        ds.set(row, "STAFF_TELNUM", rs.getString("STAFF_TELNUM"));
        ds.set(row, "CORPORATE_EMAIL", rs.getString("CORPORATE_EMAIL"));
        ds.set(row, "CORPORATE_HOMEPAGE", rs.getString("CORPORATE_HOMEPAGE"));
        ds.set(row, "CORPORATE_TELNUM", rs.getString("CORPORATE_TELNUM"));
        ds.set(row, "CORPORATE_FAXNUM", rs.getString("CORPORATE_FAXNUM"));
        ds.set(row, "CORPORATE_POSTAL_CODE", rs.getString("CORPORATE_POSTAL_CODE"));
        ds.set(row, "CORPORATE_ADRESS1", rs.getString("CORPORATE_ADRESS1"));
        ds.set(row, "CORPORATE_ADRESS2", rs.getString("CORPORATE_ADRESS2"));
        ds.set(row, "SALESPERSON_CODE", rs.getString("SALESPERSON_CODE"));
        ds.set(row, "UNIT_PRICE_CODE", rs.getString("UNIT_PRICE_CODE"));
        ds.set(row, "SALES_STATUS_CODE", rs.getString("SALES_STATUS_CODE"));
        ds.set(row, "ORDER_PASSWORD", rs.getString("ORDER_PASSWORD"));
        ds.set(row, "DEAL_START_DATE", rs.getString("DEAL_START_DATE"));
        ds.set(row, "DEAL_FINAL_DATE", rs.getString("DEAL_FINAL_DATE"));
        ds.set(row, "PAYMENT_DATE", rs.getString("PAYMENT_DATE"));
        ds.set(row, "LOAN_LIMIT", rs.getString("LOAN_LIMIT"));
        ds.set(row, "UNCOLLECTED_AMOUNT", rs.getString("UNCOLLECTED_AMOUNT"));
        ds.set(row, "UNPAID_AMOUNT", rs.getString("UNPAID_AMOUNT"));
        ds.set(row, "ACCOUMULATE_FUND", rs.getString("ACCOUMULATE_FUND"));
        ds.set(row, "ADD_TAX_RATE", rs.getString("ADD_TAX_RATE"));
        ds.set(row, "DISCOUNT_EXTRA_RATE", rs.getString("DISCOUNT_EXTRA_RATE"));
        ds.set(row, "ETC1", rs.getString("ETC1"));
        ds.set(row, "ETC2", rs.getString("ETC2"));
        ds.set(row, "UNIT_DISPLAY", rs.getString("UNIT_DISPLAY"));
        ds.set(row, "INIT_ACCOUMULATE_FUND", rs.getString("INIT_ACCOUMULATE_FUND"));
        ds.set(row, "DEAL_STATUS", rs.getString("DEAL_STATUS"));
    }
    
    String SQL1 = "select UNIT_CODE, UNIT_VALUE from ERP_DEAL_UNIT";
	row = 0;
	   
	rs = stmt.executeQuery(SQL1);  
	
	while(rs.next())
	{
		row = dsdealunit.newRow();
		dsdealunit.set(row, "code",  rs.getString("UNIT_CODE"));    
		dsdealunit.set(row, "value", rs.getString("UNIT_VALUE"));
	}
	
    

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(ds);
    pdata.addDataSet(dsdealunit);
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
