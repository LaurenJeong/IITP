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
String customerCode = varList.getString("argCustomerCode");
String productName = varList.getString("argProductName");
String checked = varList.getString("argChecked");
		
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
String SQL = "select p1.*, p2.* from ERP_PRICE p1, ERP_PRODUCT p2 WHERE p1.PRODUCT_CODE=p2.PRODUCT_CODE AND p1.CUSTOMER_CODE='"+customerCode+"'";

if(productName != null)
{
	SQL += " AND p2.PRODUCT_NAME LIKE '%"+productName+"%'";
}

if(checked != null)
{
	SQL += " AND p1.TRADING_TYPE='s2'";
}

try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsprice");
    ds.addColumn("CUSTOMER_PRICE_CODE",DataTypes.STRING, 256);
    ds.addColumn("PRICE_VERSION",DataTypes.STRING, 256);
    ds.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_CODE",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
    ds.addColumn("COMPANY_CODE",DataTypes.STRING, 256);
    ds.addColumn("STANDARD",DataTypes.STRING, 256);
    ds.addColumn("COLOR",DataTypes.STRING, 256);
    ds.addColumn("UNIT",DataTypes.STRING, 256);
    ds.addColumn("BARCODE",DataTypes.STRING, 256);
    ds.addColumn("ASSET_GROUPS",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_GROUPS",DataTypes.STRING, 256);
    ds.addColumn("LAST_PRICE",DataTypes.STRING, 256);    
    ds.addColumn("RECEIVING_PRICE",DataTypes.STRING, 256);
    ds.addColumn("WHOLESALE_PRICE",DataTypes.STRING, 256);
    ds.addColumn("RETAIL_PRICE",DataTypes.STRING, 256);
    ds.addColumn("SPECIAL_PRICE1",DataTypes.STRING, 256);
    ds.addColumn("SPECIAL_PRICE2",DataTypes.STRING, 256);
    ds.addColumn("SPECIAL_PRICE3",DataTypes.STRING, 256);
    ds.addColumn("TAX_FREE_CHECK",DataTypes.STRING, 256);
    ds.addColumn("DISCOUNT_RATE",DataTypes.STRING, 256);
    ds.addColumn("TRADING_TYPE",DataTypes.STRING, 256);    
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "CUSTOMER_PRICE_CODE", rs.getString("CUSTOMER_PRICE_CODE"));
        ds.set(row, "PRICE_VERSION", rs.getString("PRICE_VERSION"));
        ds.set(row, "CUSTOMER_CODE", rs.getString("CUSTOMER_CODE"));
        ds.set(row, "PRODUCT_CODE", rs.getString("PRODUCT_CODE"));
        ds.set(row, "PRODUCT_NAME", rs.getString("PRODUCT_NAME"));
        ds.set(row, "COMPANY_CODE", rs.getString("COMPANY_CODE"));
        ds.set(row, "STANDARD", rs.getString("STANDARD"));
        ds.set(row, "COLOR", rs.getString("COLOR"));
        ds.set(row, "UNIT", rs.getString("UNIT"));
        ds.set(row, "BARCODE", rs.getString("BARCODE"));
        ds.set(row, "ASSET_GROUPS", rs.getString("ASSET_GROUPS"));
        ds.set(row, "PRODUCT_GROUPS", rs.getString("PRODUCT_GROUPS"));
        ds.set(row, "LAST_PRICE", rs.getString("LAST_PRICE"));
        ds.set(row, "RECEIVING_PRICE", rs.getString("RECEIVING_PRICE"));
        ds.set(row, "WHOLESALE_PRICE", rs.getString("WHOLESALE_PRICE"));
        ds.set(row, "RETAIL_PRICE", rs.getString("RETAIL_PRICE"));
        ds.set(row, "SPECIAL_PRICE1", rs.getString("SPECIAL_PRICE1"));
        ds.set(row, "SPECIAL_PRICE2", rs.getString("SPECIAL_PRICE2"));
        ds.set(row, "SPECIAL_PRICE3", rs.getString("SPECIAL_PRICE3"));
        ds.set(row, "TAX_FREE_CHECK", rs.getString("TAX_FREE_CHECK"));
        ds.set(row, "DISCOUNT_RATE", rs.getString("DISCOUNT_RATE"));
        ds.set(row, "TRADING_TYPE", rs.getString("TRADING_TYPE"));
    }

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
//varList.add("ErrorCode", nErrorCode);
//varList.add("ErrorMsg", strErrorMsg);

/******** XML data Create ******/
HttpPlatformResponse res = new HttpPlatformResponse(response, 
    PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(pdata);
res.sendData();
%>
