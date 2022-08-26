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
String sCustomer = varList.getString("argCustomer");
		
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs   = null;
Statement  stmt2 = null;
ResultSet  rs2   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
stmt2 = conn.createStatement();

/******* SQL query *************/
String SQL = "SELECT pr.PRODUCT_CODE,pr.PRODUCT_NAME,pr.STANDARD,pr.COLOR,pr.UNIT,ut.UNIT_VALUE,"+
			 "pr.RECEIVING_PRICE,pr.WHOLESALE_PRICE,pr.RETAIL_PRICE,pr.SPECIAL_PRICE1,pr.SPECIAL_PRICE2,pr.SPECIAL_PRICE3, mt.MENUFACTURE_NAME " +
			 "FROM ERP_PRODUCT pr, ERP_PRODUCT_MENUFACTURE mt, ERP_PRODUCT_UNIT ut " +
			 "WHERE mt.MENUFACTURE_CODE = pr.COMPANY_CODE AND ut.UNIT_CODE = pr.UNIT";

if(sSearch != null)
{
	SQL += "AND pr.PRODUCT_NAME like '%"+sSearch+"%'";
}

try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsproduct");
    ds.addColumn("PRODUCT_CODE",DataTypes.STRING, 256);
    ds.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
    ds.addColumn("STANDARD",DataTypes.STRING, 256);
    ds.addColumn("COLOR",DataTypes.STRING, 256);
    ds.addColumn("UNIT",DataTypes.STRING, 256);
    ds.addColumn("UNIT_VALUE",DataTypes.STRING, 256);   
    ds.addColumn("RECEIVING_PRICE",DataTypes.STRING, 256);
    ds.addColumn("WHOLESALE_PRICE",DataTypes.STRING, 256);
    ds.addColumn("RETAIL_PRICE",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_NAME",DataTypes.STRING, 256);
    ds.addColumn("UNIT_PRICE",DataTypes.STRING, 256);
    ds.addColumn("LAST_PRICE",DataTypes.STRING, 256);
    
    String sProductCode = "";
    String SQLPrice = "";
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        sProductCode = rs.getString("PRODUCT_CODE");
        ds.set(row, "PRODUCT_CODE", rs.getString("PRODUCT_CODE"));
        ds.set(row, "PRODUCT_NAME", rs.getString("PRODUCT_NAME"));
        ds.set(row, "STANDARD", rs.getString("STANDARD"));
        ds.set(row, "COLOR", rs.getString("COLOR"));
        ds.set(row, "UNIT", rs.getString("UNIT"));
        ds.set(row, "UNIT_VALUE", rs.getString("UNIT_VALUE"));        
        ds.set(row, "RECEIVING_PRICE", rs.getString("RECEIVING_PRICE"));
        ds.set(row, "WHOLESALE_PRICE", rs.getString("WHOLESALE_PRICE"));
        ds.set(row, "RETAIL_PRICE", rs.getString("RETAIL_PRICE"));
        ds.set(row, "MENUFACTURE_NAME", rs.getString("MENUFACTURE_NAME"));
        
        String sLastPrice = rs.getString("RETAIL_PRICE");
        
        SQLPrice = "SELECT LAST_PRICE FROM ERP_PRICE WHERE PRODUCT_CODE='"+sProductCode+"' AND CUSTOMER_CODE='"+sCustomer+"'";
        //System.out.println(SQLPrice);
        rs2 = stmt2.executeQuery(SQLPrice);
        
        
        while(rs2.next())
        {
        	sLastPrice = rs2.getString("LAST_PRICE");
        }
        
        System.out.println(sLastPrice);
        
        ds.set(row, "UNIT_PRICE", sLastPrice);
        ds.set(row, "LAST_PRICE", sLastPrice);
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
