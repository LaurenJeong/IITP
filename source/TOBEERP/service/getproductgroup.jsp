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
String sSearch  = varList.getString("argAsset");

		
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
String SQL = "select * from ERP_PRODUCT_GROUP";
if(sSearch != null)
{
	SQL += " WHERE ASSET_CODE='"+sSearch+"'";
}

try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsgroup");
    ds.addColumn("GROUP_CODE",DataTypes.STRING, 256);
    ds.addColumn("GROUP_SEQ",DataTypes.STRING, 256);
    ds.addColumn("GROUP_VALUE",DataTypes.STRING, 256);
    ds.addColumn("ASSET_CODE",DataTypes.STRING, 256);
    ds.addColumn("GROUP_STANDARD",DataTypes.STRING, 256);
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "GROUP_CODE", rs.getString("GROUP_CODE"));
        ds.set(row, "GROUP_SEQ", rs.getString("GROUP_SEQ"));
        ds.set(row, "GROUP_VALUE", rs.getString("GROUP_VALUE"));
        ds.set(row, "ASSET_CODE", rs.getString("ASSET_CODE"));
        ds.set(row, "GROUP_STANDARD", rs.getString("GROUP_STANDARD"));
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
