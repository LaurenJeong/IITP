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
String startday  = varList.getString("argStartday");
String endday  = varList.getString("argEndDay");
String typecode  = varList.getString("argType");
String customercode  = varList.getString("argCustomer");
String title  = varList.getString("argTitle");
String statuscode  = varList.getString("argStatus");
String salesmancode  = varList.getString("argSalesman");


String sWhere = null;


if(startday != null)
{
	sWhere = " WHERE ERP_ESTIMATE.ESTIMATE_DATE = '"+startday+"'"; 
}

if(endday != null)
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_ESTIMATE.ESTIMATE_DATE = '"+endday+"'"; 
	}
	else
	{
		sWhere = " WHERE ERP_ESTIMATE.ESTIMATE_DATE <= '"+endday+"' AND ERP_ESTIMATE.ESTIMATE_DATE >= '"+startday+"'";
	}
}
	
if(typecode != null)
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_ESTIMATE.ESTIMATE_TYPE='"+typecode+"'";
	}
	else
	{
		sWhere += " AND ERP_ESTIMATE.ESTIMATE_TYPE='"+typecode+"'";
	}
}
	
if(customercode != null)
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_CUSTOMER.CORPORATE_NAME LIKE '%"+customercode+"%'";
	}
	else
	{
		sWhere += " AND ERP_CUSTOMER.CORPORATE_NAME LIKE '%"+customercode+"%'";
	}
}
	
if(statuscode != null)
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_ESTIMATE.ESTIMATE_STATUS='"+statuscode+"'";
	}
	else
	{
		sWhere += " AND ERP_ESTIMATE.ESTIMATE_STATUS='"+statuscode+"'";
	}
}
	
if(salesmancode != null)
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_ESTIMATE.SALESMAN_CODE='"+salesmancode+"'";
	}
	else
	{
		sWhere += " AND ERP_ESTIMATE.SALESMAN_CODE='"+salesmancode+"'";
	}
}

if(sWhere == null)
{
	sWhere = " WHERE ERP_ESTIMATE.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE ";
}
else
{
	sWhere += " AND ERP_ESTIMATE.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE ";
}
String SQL = "SELECT * FROM ERP_ESTIMATE, ERP_CUSTOMER" + sWhere + " ORDER BY ERP_ESTIMATE.ESTIMATE_DATE DESC";

int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
Statement  stmt1 = null;
Statement  stmt2 = null;
Statement  stmt3 = null;
ResultSet  rs   = null;
ResultSet  rs1   = null;
ResultSet  rs2   = null;
ResultSet  rs3   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
stmt1 = conn.createStatement();
stmt2 = conn.createStatement();
stmt3 = conn.createStatement();

/******* SQL query *************/


try {
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet ds = new DataSet("dsestimate");
    ds.addColumn("ESTIMATE_CODE",DataTypes.STRING, 256);    
    ds.addColumn("ESTIMATE_DATE",DataTypes.STRING, 256);
    ds.addColumn("ESTIMATE_STATUS",DataTypes.STRING, 256);
    ds.addColumn("SALESMAN_CODE",DataTypes.STRING, 256);
    ds.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
    ds.addColumn("ESTIMATE_TYPE",DataTypes.STRING, 256);
    ds.addColumn("ESTIMATE_TITLE",DataTypes.STRING, 256);
    ds.addColumn("TAX_TYPE",DataTypes.STRING, 256);
    ds.addColumn("EXPIRY_TERM",DataTypes.STRING, 256);
    ds.addColumn("PAYMENT_TYPE",DataTypes.STRING, 256);
    ds.addColumn("DELIVERTY_DATE",DataTypes.STRING, 256);
    ds.addColumn("ESTIMATE_ETC",DataTypes.STRING, 256);
    ds.addColumn("SEAL_CHECK",DataTypes.STRING, 256);
    ds.addColumn("SEAL_IMAGE",DataTypes.STRING, 256);
    ds.addColumn("DISCOUNT_PRICE",DataTypes.STRING, 256);    
    ds.addColumn("ADDIN_PRICE",DataTypes.STRING, 256);
    ds.addColumn("UPDATE_DATE",DataTypes.STRING, 256);
    ds.addColumn("TOTAL_PRICE",DataTypes.STRING, 256);
    ds.addColumn("TOTAL_AMOUNT",DataTypes.STRING, 256);
    ds.addColumn("CUSTOMER_NAME",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_TELNUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_FAXNUM",DataTypes.STRING, 256);
    ds.addColumn("STAFF_TELNUM",DataTypes.STRING, 256);
    ds.addColumn("CORPORATE_EMAIL",DataTypes.STRING, 256);
    
    DataSet dsdetail = new DataSet("dsestimatedetail");
    dsdetail.addColumn("ESTIMATEDETAIL_CODE",DataTypes.STRING, 256);
    dsdetail.addColumn("ESTIMATE_CODE",DataTypes.STRING, 256);    
    dsdetail.addColumn("PRODUCT_CODE",DataTypes.STRING, 256);    
    dsdetail.addColumn("LAST_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("DISCOUNT_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("AMOUNT",DataTypes.STRING, 256);
    dsdetail.addColumn("SURTAX_TYPE",DataTypes.STRING, 256);
    dsdetail.addColumn("ETC",DataTypes.STRING, 256);
    dsdetail.addColumn("TOTAL_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
    dsdetail.addColumn("STANDARD",DataTypes.STRING, 256);
    dsdetail.addColumn("UNIT",DataTypes.STRING, 256);
    dsdetail.addColumn("UNIT_PRICE",DataTypes.STRING, 256);
   
    
    String sCode = "";
    String sParentCode = "";
    String sProductCode = "";
    
    int row = 0;
    int detailrow = 0;
    while(rs.next())
    { 
        row = ds.newRow();
        ds.set(row, "ESTIMATE_CODE",  rs.getString("ESTIMATE_CODE"));
        ds.set(row, "ESTIMATE_DATE",  rs.getString("ESTIMATE_DATE"));
        ds.set(row, "ESTIMATE_STATUS",  rs.getString("ESTIMATE_STATUS"));
        ds.set(row, "SALESMAN_CODE",  rs.getString("SALESMAN_CODE"));
        ds.set(row, "CUSTOMER_CODE",  rs.getString("CUSTOMER_CODE"));
        ds.set(row, "ESTIMATE_TYPE",  rs.getString("ESTIMATE_TYPE"));
        ds.set(row, "ESTIMATE_TITLE",  rs.getString("ESTIMATE_TITLE"));
        ds.set(row, "TAX_TYPE", 		rs.getString("TAX_TYPE"));
        ds.set(row, "EXPIRY_TERM", 		rs.getString("EXPIRY_TERM"));
        ds.set(row, "PAYMENT_TYPE", rs.getString("PAYMENT_TYPE"));
        ds.set(row, "DELIVERTY_DATE", rs.getString("DELIVERTY_DATE"));
        ds.set(row, "ESTIMATE_ETC", rs.getString("ESTIMATE_ETC"));
        ds.set(row, "SEAL_CHECK", rs.getString("SEAL_CHECK"));
        ds.set(row, "SEAL_IMAGE", rs.getString("SEAL_IMAGE"));
        ds.set(row, "DISCOUNT_PRICE", rs.getString("DISCOUNT_PRICE"));
        ds.set(row, "ADDIN_PRICE", rs.getString("ADDIN_PRICE"));
        ds.set(row, "UPDATE_DATE", rs.getString("UPDATE_DATE"));
        ds.set(row, "TOTAL_PRICE", rs.getString("TOTAL_PRICE"));
        ds.set(row, "TOTAL_AMOUNT", rs.getString("TOTAL_AMOUNT"));
        
           
        sParentCode= rs.getString("ESTIMATE_CODE");
        sCode = rs.getString("CUSTOMER_CODE");
        rs1= stmt1.executeQuery("SELECT * FROM ERP_CUSTOMER WHERE CORPORATE_CODE='"+sCode+"'");
      
        while(rs1.next())
   		 { 
        	ds.set(row, "CUSTOMER_NAME",  rs1.getString("CORPORATE_NAME"));
        	ds.set(row, "CORPORATE_TELNUM", rs1.getString("CORPORATE_TELNUM"));
            ds.set(row, "CORPORATE_FAXNUM", rs1.getString("CORPORATE_FAXNUM"));
            ds.set(row, "STAFF_TELNUM", rs1.getString("STAFF_TELNUM"));
            ds.set(row, "CORPORATE_EMAIL", rs1.getString("CORPORATE_EMAIL"));
   		 }
        
        String SQL2 = "select * from ERP_ESTIMATEDETAIL WHERE ESTIMATE_CODE = '"+ sParentCode +"'";
        //String SQL2 = "select * from ERP_ESTIMATEDETAIL";
        rs2 = stmt2.executeQuery(SQL2);
        while(rs2.next())
        {        	
        	detailrow = dsdetail.newRow();
        	
        	dsdetail.set(detailrow, "ESTIMATEDETAIL_CODE", rs2.getString("ESTIMATEDETAIL_CODE"));
            dsdetail.set(detailrow, "ESTIMATE_CODE", rs2.getString("ESTIMATE_CODE"));
            dsdetail.set(detailrow, "PRODUCT_CODE", rs2.getString("PRODUCT_CODE"));            
            dsdetail.set(detailrow, "LAST_PRICE", rs2.getString("LAST_PRICE"));
            dsdetail.set(detailrow, "DISCOUNT_PRICE", rs2.getString("DISCOUNT_PRICE"));
            dsdetail.set(detailrow, "AMOUNT", rs2.getString("AMOUNT"));
            dsdetail.set(detailrow, "SURTAX_TYPE", rs2.getString("SURTAX_TYPE"));
            dsdetail.set(detailrow, "ETC", rs2.getString("ETC"));
            dsdetail.set(detailrow, "TOTAL_PRICE", rs2.getString("TOTAL_PRICE"));
            
            sProductCode = rs2.getString("PRODUCT_CODE");
            rs3= stmt3.executeQuery("SELECT PRODUCT_NAME,STANDARD,UNIT,RETAIL_PRICE FROM ERP_PRODUCT WHERE PRODUCT_CODE='"+sProductCode+"'");
          
            while(rs3.next())
       		 {
            	dsdetail.set(detailrow, "PRODUCT_NAME",  rs3.getString("PRODUCT_NAME"));
            	dsdetail.set(detailrow, "STANDARD", rs3.getString("STANDARD"));
            	dsdetail.set(detailrow, "UNIT", rs3.getString("UNIT"));
            	dsdetail.set(detailrow, "UNIT_PRICE", rs3.getString("RETAIL_PRICE"));
       		 }
            
        }
        
    }

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(ds);
    pdata.addDataSet(dsdetail);

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