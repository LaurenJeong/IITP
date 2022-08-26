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
String sSearch  = varList.getString("argProduct");
		
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
String SQL = "select * from ERP_PRODUCT";

if(sSearch != null)
{
	SQL += " WHERE PRODUCT_NAME like '%"+sSearch+"%'";
}

try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsproduct");
    ds.addColumn("PRODUCT_CODE",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_GROUPS",DataTypes.STRING, 256);
    ds.addColumn("ASSET_GROUPS",DataTypes.STRING, 256);
    ds.addColumn("STANDARD",DataTypes.STRING, 256);
    ds.addColumn("COLOR",DataTypes.STRING, 256);
    ds.addColumn("UNIT",DataTypes.STRING, 256);
    ds.addColumn("BARCODE",DataTypes.STRING, 256);
    ds.addColumn("COMPANY_CODE",DataTypes.STRING, 256);
    ds.addColumn("RECEIVING_PRICE",DataTypes.STRING, 256);
    ds.addColumn("WHOLESALE_PRICE",DataTypes.STRING, 256);
    ds.addColumn("RETAIL_PRICE",DataTypes.STRING, 256);
    ds.addColumn("SPECIAL_PRICE1",DataTypes.STRING, 256);
    ds.addColumn("SPECIAL_PRICE2",DataTypes.STRING, 256);
    ds.addColumn("SPECIAL_PRICE3",DataTypes.STRING, 256);
    ds.addColumn("TAX_FREE_CHECK",DataTypes.STRING, 256);
    ds.addColumn("DISCOUNT_RATE",DataTypes.STRING, 256);
    ds.addColumn("BASIC_STOCK_COUNT",DataTypes.STRING, 256);
    ds.addColumn("NOW_STOCK_COUNT",DataTypes.STRING, 256);
    ds.addColumn("BOX_COUNT",DataTypes.STRING, 256);
    ds.addColumn("UNIT_COUNT",DataTypes.STRING, 256);
    ds.addColumn("SAFETY_STOCK_COUNT",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_STORAGE_AREA",DataTypes.STRING, 256);
    ds.addColumn("COUNT_PER_BOX",DataTypes.STRING, 256);
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "PRODUCT_CODE", rs.getString("PRODUCT_CODE"));
        ds.set(row, "PRODUCT_NAME", rs.getString("PRODUCT_NAME"));
        ds.set(row, "PRODUCT_GROUPS", rs.getString("PRODUCT_GROUPS"));
        ds.set(row, "ASSET_GROUPS", rs.getString("ASSET_GROUPS"));
        ds.set(row, "STANDARD", rs.getString("STANDARD"));
        ds.set(row, "COLOR", rs.getString("COLOR"));
        ds.set(row, "UNIT", rs.getString("UNIT"));
        ds.set(row, "BARCODE", rs.getString("BARCODE"));
        ds.set(row, "COMPANY_CODE", rs.getString("COMPANY_CODE"));
        ds.set(row, "RECEIVING_PRICE", rs.getString("RECEIVING_PRICE"));
        ds.set(row, "WHOLESALE_PRICE", rs.getString("WHOLESALE_PRICE"));
        ds.set(row, "RETAIL_PRICE", rs.getString("RETAIL_PRICE"));
        ds.set(row, "SPECIAL_PRICE1", rs.getString("SPECIAL_PRICE1"));
        ds.set(row, "SPECIAL_PRICE2", rs.getString("SPECIAL_PRICE2"));
        ds.set(row, "SPECIAL_PRICE3", rs.getString("SPECIAL_PRICE3"));
        ds.set(row, "TAX_FREE_CHECK", rs.getString("TAX_FREE_CHECK"));
        ds.set(row, "DISCOUNT_RATE", rs.getString("DISCOUNT_RATE"));
        ds.set(row, "BASIC_STOCK_COUNT", rs.getString("BASIC_STOCK_COUNT"));
        ds.set(row, "NOW_STOCK_COUNT", rs.getString("NOW_STOCK_COUNT"));
        ds.set(row, "BOX_COUNT", rs.getString("BOX_COUNT"));
        ds.set(row, "UNIT_COUNT", rs.getString("UNIT_COUNT"));
        ds.set(row, "SAFETY_STOCK_COUNT", rs.getString("SAFETY_STOCK_COUNT"));
        ds.set(row, "PRODUCT_STORAGE_AREA", rs.getString("PRODUCT_STORAGE_AREA"));
        ds.set(row, "COUNT_PER_BOX", rs.getString("COUNT_PER_BOX"));
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
