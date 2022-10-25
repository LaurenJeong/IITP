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

int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs   = null;

PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");

Class.forName(jdbcClass);
conn = DriverManager.getConnection(jdbcUrl,dbId,dbPass);

stmt = conn.createStatement();

try {
    /******* SQL query *************/
    String SQL = "select * from erp_myinfo,erp_business_condition where erp_myinfo.BUSINESS_CONDITION = erp_business_condition.CONDITION_CODE";
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsmyinfo");     // [QuickCode] 
    ds.addColumn("BUSINESS_LICENSE_NUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_NAME",DataTypes.STRING, 256);
    ds.addColumn("COMPANY_NAME", DataTypes.STRING, 256);
    ds.addColumn("REPRESENTATIVE_NAME", DataTypes.STRING, 256);
    ds.addColumn("REPRESENTATIVE_SOCIAL_NUM", DataTypes.STRING, 256);
    ds.addColumn("BUSINESS_CONDITION", DataTypes.STRING, 256);
    ds.addColumn("BUSINESS_TYPE", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_AREA", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_EMAIL", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_HOMEPAGE", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_TELNUM", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_FAXNUM", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_POSTAL_CODE", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_ADRESS1", DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_ADRESS2", DataTypes.STRING, 256);
    ds.addColumn("MEMO", DataTypes.STRING, 256);
    ds.addColumn("OFFICAIL_SEAL_FILE", DataTypes.STRING, 256);
    ds.addColumn("COMPANY_CODE", DataTypes.STRING, 256); 
    ds.addColumn("CONDITION_VALUE", DataTypes.STRING, 256); 
    
    int row = 0;
    while(rs.next())
    {
        row = ds.newRow();
        ds.set(row, "BUSINESS_LICENSE_NUM", rs.getString("BUSINESS_LICENSE_NUM"));    
        ds.set(row, "CORPORATE_NAME", rs.getString("CORPORATE_NAME"));
        ds.set(row, "COMPANY_NAME", rs.getString("COMPANY_NAME"));
        ds.set(row, "REPRESENTATIVE_NAME", rs.getString("REPRESENTATIVE_NAME"));
        ds.set(row, "REPRESENTATIVE_SOCIAL_NUM", rs.getString("REPRESENTATIVE_SOCIAL_NUM"));
        ds.set(row, "BUSINESS_CONDITION", rs.getString("BUSINESS_CONDITION"));
        ds.set(row, "BUSINESS_TYPE", rs.getString("BUSINESS_TYPE"));
        ds.set(row, "CORPORATE_AREA", rs.getString("CORPORATE_AREA"));
        ds.set(row, "CORPORATE_EMAIL", rs.getString("CORPORATE_EMAIL"));    
        ds.set(row, "CORPORATE_HOMEPAGE", rs.getString("CORPORATE_HOMEPAGE"));
        ds.set(row, "CORPORATE_TELNUM", rs.getString("CORPORATE_TELNUM"));
        ds.set(row, "CORPORATE_FAXNUM", rs.getString("CORPORATE_FAXNUM"));
        ds.set(row, "CORPORATE_POSTAL_CODE", rs.getString("CORPORATE_POSTAL_CODE"));
        ds.set(row, "CORPORATE_ADRESS1", rs.getString("CORPORATE_ADRESS1"));
        ds.set(row, "CORPORATE_ADRESS2", rs.getString("CORPORATE_ADRESS2"));
        ds.set(row, "MEMO", rs.getString("MEMO"));
        ds.set(row, "OFFICAIL_SEAL_FILE", rs.getString("OFFICAIL_SEAL_FILE"));
        ds.set(row, "COMPANY_CODE", rs.getString("COMPANY_CODE"));
        ds.set(row, "CONDITION_VALUE", rs.getString("CONDITION_VALUE"));
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
VariableList sendList = senddata.getVariableList();
sendList.add("ErrorCode", nErrorCode);
sendList.add("ErrorMsg", strErrorMsg);

/******** XML data Create ******/
HttpPlatformResponse res = new HttpPlatformResponse(response, PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(pdata);
res.sendData();
%>
