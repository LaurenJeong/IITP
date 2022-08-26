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
String sDealCode  = varList.getString("argDealCode");
		
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
Statement  stmt1 = null;
Statement  stmt2 = null;
Statement  stmt3 = null;
Statement  stmt4 = null;
ResultSet  rs   = null;
ResultSet  rs1   = null;
ResultSet  rs2   = null;
ResultSet  rs3   = null;
ResultSet  rs4   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
stmt1 = conn.createStatement();
stmt2 = conn.createStatement();
stmt3 = conn.createStatement();
stmt4 = conn.createStatement();
/******* SQL query *************/

try {
	String SQL = "SELECT * FROM ERP_DEAL WHERE DEAL_CODE='"+sDealCode+"'";
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet dsdeal = new DataSet("dsdeal");
    dsdeal.addColumn("DEAL_CODE",DataTypes.STRING, 256);    
    dsdeal.addColumn("DEAL_DATE",DataTypes.STRING, 256);
    dsdeal.addColumn("DEAL_TYPE",DataTypes.STRING, 256);
    dsdeal.addColumn("TAX_TYPE",DataTypes.STRING, 256);
    dsdeal.addColumn("DEAL_TITLE",DataTypes.STRING, 256);
    dsdeal.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("ADD_IN_TAX",DataTypes.STRING, 256);
    dsdeal.addColumn("ACCOUNT_BILL",DataTypes.STRING, 256);
    dsdeal.addColumn("BEFORE_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("DISCOUNT_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("LAST_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("CREDIT_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("CASH_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("ACCOUNT_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("BILL_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("CARD_PRICE",DataTypes.STRING, 256);
    dsdeal.addColumn("ESTIMATE_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("ADD_RESERVE_FUND",DataTypes.STRING, 256);
    dsdeal.addColumn("USE_RESERVE_FUND",DataTypes.STRING, 256);
    dsdeal.addColumn("ETC",DataTypes.STRING, 256);
    dsdeal.addColumn("DEAL_STATUS",DataTypes.STRING, 256);
    dsdeal.addColumn("CUSTOMER_NAME",DataTypes.STRING, 256);    
    dsdeal.addColumn("CUSTOMER_TELNUM",DataTypes.STRING, 256);    
    dsdeal.addColumn("CORPORATE_TYPE",DataTypes.STRING, 256);
    dsdeal.addColumn("CUSTOMER_STAFF",DataTypes.STRING, 256);
    dsdeal.addColumn("SALESMAN_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("BUSINESS_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("REPRESENT_NAME",DataTypes.STRING, 256);
    dsdeal.addColumn("ACCOUMULATE_FUND",DataTypes.STRING, 256);
    dsdeal.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
   
    DataSet dsdetail = new DataSet("dsdetail");
    dsdetail.addColumn("DEAL_CODE",DataTypes.STRING, 256);   
    dsdetail.addColumn("DEAL_NUMBER",DataTypes.STRING, 256);    
    dsdetail.addColumn("PRODUCT_CODE",DataTypes.STRING, 256);
    dsdetail.addColumn("AMOUNT",DataTypes.STRING, 256);
    dsdetail.addColumn("LAST_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("UNIT_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("ETC",DataTypes.STRING, 256);
    dsdetail.addColumn("SURTAX_TYPE",DataTypes.STRING, 256); 
    dsdetail.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
    dsdetail.addColumn("STANDARD",DataTypes.STRING, 256);
    dsdetail.addColumn("UNIT",DataTypes.STRING, 256); 
       
    String sCode = "";
    String sParentCode = "";
    String sProductCode = "";
    
    int row = 0;
    int customerRow = 0;
    int detailrow = 0;
    while(rs.next())
    {     	
        row = dsdeal.newRow();
        dsdeal.set(row, "DEAL_CODE",  rs.getString("DEAL_CODE"));
        dsdeal.set(row, "DEAL_DATE",  rs.getString("DEAL_DATE"));
        dsdeal.set(row, "DEAL_TYPE",  rs.getString("DEAL_TYPE"));
        dsdeal.set(row, "TAX_TYPE",  rs.getString("TAX_TYPE"));
        dsdeal.set(row, "DEAL_TITLE",  rs.getString("DEAL_TITLE"));
        dsdeal.set(row, "CUSTOMER_CODE",  rs.getString("CUSTOMER_CODE"));
        dsdeal.set(row, "ADD_IN_TAX",     rs.getString("ADD_IN_TAX"));
        dsdeal.set(row, "ACCOUNT_BILL",   rs.getString("ACCOUNT_BILL"));
        dsdeal.set(row, "BEFORE_PRICE",   rs.getString("BEFORE_PRICE"));
        dsdeal.set(row, "DISCOUNT_PRICE", rs.getString("DISCOUNT_PRICE"));
        dsdeal.set(row, "LAST_PRICE",    rs.getString("LAST_PRICE"));
        dsdeal.set(row, "CREDIT_PRICE",  rs.getString("CREDIT_PRICE"));
        dsdeal.set(row, "CASH_PRICE",    rs.getString("CASH_PRICE"));
        dsdeal.set(row, "ACCOUNT_PRICE", rs.getString("ACCOUNT_PRICE"));
        dsdeal.set(row, "BILL_PRICE",    rs.getString("BILL_PRICE"));
        dsdeal.set(row, "CARD_PRICE",    rs.getString("CARD_PRICE"));
        dsdeal.set(row, "ESTIMATE_CODE", rs.getString("ESTIMATE_CODE"));
        dsdeal.set(row, "ADD_RESERVE_FUND", rs.getString("ADD_RESERVE_FUND"));
        dsdeal.set(row, "USE_RESERVE_FUND", rs.getString("USE_RESERVE_FUND"));
        dsdeal.set(row, "ETC",         rs.getString("ETC"));
        dsdeal.set(row, "DEAL_STATUS", rs.getString("DEAL_STATUS"));

        
        sParentCode= rs.getString("DEAL_CODE"); 
        sCode = rs.getString("CUSTOMER_CODE");
        
        rs1= stmt1.executeQuery("select * from ERP_CUSTOMER WHERE CORPORATE_CODE='"+sCode+"'");
       	while(rs1.next())
     	{
       		dsdeal.set(row, "CUSTOMER_NAME",  rs1.getString("CORPORATE_NAME"));
       		dsdeal.set(row, "CUSTOMER_TELNUM", rs1.getString("CORPORATE_TELNUM"));
       		dsdeal.set(row, "CORPORATE_TYPE", rs1.getString("CORPORATE_TYPE"));
       		dsdeal.set(row, "CUSTOMER_STAFF", rs1.getString("STAFF_NAME"));
       		dsdeal.set(row, "SALESMAN_CODE", rs1.getString("SALESPERSON_CODE"));
        	dsdeal.set(row, "BUSINESS_CODE", rs1.getString("BUSINESS_LICENSE_NUM"));
        	dsdeal.set(row, "REPRESENT_NAME", rs1.getString("REPRESENTATIVE_NAME"));
        	dsdeal.set(row, "ACCOUMULATE_FUND", rs1.getString("ACCOUMULATE_FUND"));
     	}   
             
    }
    
    String SQL2 = "select * from ERP_DEALDETAIL WHERE DEAL_CODE = '"+ sParentCode +"'";
    
    rs2 = stmt2.executeQuery(SQL2);
    
    while(rs2.next())
    {        	
    	detailrow = dsdetail.newRow();
    	
    	sProductCode = rs2.getString("PRODUCT_CODE");
    	dsdetail.set(detailrow, "DEAL_CODE", rs2.getString("DEAL_CODE"));
        dsdetail.set(detailrow, "DEAL_NUMBER", rs2.getString("DEAL_NUMBER"));            
        dsdetail.set(detailrow, "PRODUCT_CODE", rs2.getString("PRODUCT_CODE"));
        dsdetail.set(detailrow, "AMOUNT", rs2.getString("AMOUNT"));
        dsdetail.set(detailrow, "LAST_PRICE", rs2.getString("LAST_PRICE"));
        dsdetail.set(detailrow, "UNIT_PRICE", rs2.getString("UNIT_PRICE"));
        dsdetail.set(detailrow, "ETC", rs2.getString("ETC"));
        dsdetail.set(detailrow, "SURTAX_TYPE", rs2.getString("SURTAX_TYPE"));
        
        
        rs3= stmt3.executeQuery("SELECT PRODUCT_NAME,STANDARD,UNIT FROM ERP_PRODUCT WHERE PRODUCT_CODE='"+sProductCode+"'");
        while(rs3.next())
   		 {
        	dsdetail.set(detailrow, "PRODUCT_NAME",  rs3.getString("PRODUCT_NAME"));
        	dsdetail.set(detailrow, "STANDARD", rs3.getString("STANDARD"));
        	dsdetail.set(detailrow, "UNIT", rs3.getString("UNIT"));
   		 }
        
    }   

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsdeal);
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

