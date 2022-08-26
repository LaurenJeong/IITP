<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>

<%@ page contentType="text/xml; charset=utf-8" %>

<%
/****** Service API initialization ******/
PlatformData pdata = new PlatformData();

/** 4. Receiving a request from the client **/
// create HttpPlatformRequest for receive data from client
HttpPlatformRequest req = new HttpPlatformRequest(request);
req.receiveData();
		
PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");
String columnCode  = varList.getString("argTitle");
String columnValue = varList.getString("argValue");
		
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
String SQL =  "select * from ERP_EMPLOYEE";

if(columnCode != null)
{
	if(columnCode.equals("EMPLOYEE_NAME") || columnCode.equals("EMPLOYEE_CODE"))
	{
		SQL += " WHERE " + columnCode + " LIKE '%" + columnValue + "%'";
	}
	else
	{
		SQL += " WHERE " + columnCode + "='" + columnValue + "'";
	}
}

SQL += " ORDER BY JOIN_DATE ASC";

try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsemployee");
    ds.addColumn("EMPLOYEE_CODE",DataTypes.STRING, 256);
    ds.addColumn("EMPLOYEE_NAME",DataTypes.STRING, 256);
    ds.addColumn("SEX", DataTypes.STRING, 256);
    ds.addColumn("DEPARTMENT", DataTypes.STRING, 256);
    ds.addColumn("POSITION", DataTypes.STRING, 256);
    ds.addColumn("GROUPS", DataTypes.STRING, 256);
    ds.addColumn("JOIN_DATE", DataTypes.STRING, 256);
    ds.addColumn("BREAK_DATE", DataTypes.STRING, 256);
    ds.addColumn("TELNUM", DataTypes.STRING, 256);
    ds.addColumn("PHONE", DataTypes.STRING, 256);
    ds.addColumn("POSTAL_CODE", DataTypes.STRING, 256);
    ds.addColumn("ADRESS1", DataTypes.STRING, 256);
    ds.addColumn("ADRESS2", DataTypes.STRING, 256);
    ds.addColumn("MEMO", DataTypes.STRING, 256);
    ds.addColumn("FILELIST_CODE", DataTypes.STRING, 256);
    ds.addColumn("CAREERLIST", DataTypes.STRING, 256);
    ds.addColumn("EMPLOYEE_STATUS", DataTypes.STRING, 256);
    ds.addColumn("EMAIL", DataTypes.STRING, 256);
    ds.addColumn("PHOTO", DataTypes.STRING, 256);
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "EMPLOYEE_CODE", rs.getString("EMPLOYEE_CODE"));    
        ds.set(row, "EMPLOYEE_NAME", rs.getString("EMPLOYEE_NAME"));
        ds.set(row, "SEX", rs.getString("SEX"));
        ds.set(row, "DEPARTMENT", rs.getString("DEPARTMENT"));
        ds.set(row, "POSITION", rs.getString("POSITION"));
        ds.set(row, "GROUPS", rs.getString("GROUPS"));
        ds.set(row, "JOIN_DATE", rs.getString("JOIN_DATE"));
        ds.set(row, "BREAK_DATE", rs.getString("BREAK_DATE"));    
        ds.set(row, "TELNUM", rs.getString("TELNUM"));
        ds.set(row, "PHONE", rs.getString("PHONE"));
        ds.set(row, "POSTAL_CODE", rs.getString("POSTAL_CODE"));
        ds.set(row, "ADRESS1", rs.getString("ADRESS1"));
        ds.set(row, "ADRESS2", rs.getString("ADRESS2"));
        ds.set(row, "MEMO", rs.getString("MEMO"));
        ds.set(row, "FILELIST_CODE", rs.getString("FILELIST_CODE"));
        ds.set(row, "CAREERLIST", rs.getString("CAREERLIST"));
        ds.set(row, "EMPLOYEE_STATUS", rs.getString("EMPLOYEE_STATUS"));
        ds.set(row, "EMAIL", rs.getString("EMAIL"));
        ds.set(row, "PHOTO", rs.getString("PHOTO"));
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
varList.add("ErrorCode", nErrorCode);
varList.add("ErrorMsg", strErrorMsg);

/******** XML data Create ******/
HttpPlatformResponse res = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(pdata);
res.sendData();
%>
