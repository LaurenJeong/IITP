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
String SQL = "select * from ERP_PRODUCT_MENUFACTURE";

if(sSearch != null)
{
	SQL += " WHERE MENUFACTURE_NAME LIKE '%"+sSearch+"%'";
}

System.out.println(SQL);
try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsmanufacture");
    ds.addColumn("MENUFACTURE_CODE",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_NAME",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_TELNUM",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_FAXNUM",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_POSTALCODE",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_ADRESS1",DataTypes.STRING, 256);
    ds.addColumn("MENUFACTURE_ADRESS2",DataTypes.STRING, 256);
    ds.addColumn("MANUFACTURE_AREA",DataTypes.STRING, 256);
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "MENUFACTURE_CODE", rs.getString("MENUFACTURE_CODE"));
        ds.set(row, "MENUFACTURE_NAME", rs.getString("MENUFACTURE_NAME"));
        ds.set(row, "MENUFACTURE_TELNUM", rs.getString("MENUFACTURE_TELNUM"));
        ds.set(row, "MENUFACTURE_FAXNUM", rs.getString("MENUFACTURE_FAXNUM"));
        ds.set(row, "MENUFACTURE_POSTALCODE", rs.getString("MENUFACTURE_POSTALCODE"));
        ds.set(row, "MENUFACTURE_ADRESS1", rs.getString("MENUFACTURE_ADRESS1"));
        ds.set(row, "MENUFACTURE_ADRESS2", rs.getString("MENUFACTURE_ADRESS2"));
        ds.set(row, "MANUFACTURE_AREA", rs.getString("MANUFACTURE_AREA"));
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
