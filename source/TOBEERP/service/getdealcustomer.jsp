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
String customerCode  = varList.getString("argCustomer");

		
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt1 = null;
ResultSet  rs1   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");

stmt1 = conn.createStatement();

try {
	
	/******* Create Dataset *************/
    DataSet dsdealcustomer = new DataSet("dsdealcustomer");
    dsdealcustomer.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("PURCHASE_TOTAL_PRICE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("SALES_TOTAL_PRICE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("PURCHASE_PAYMENT_PRICE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("SALES_PAYMENT_PRICE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("PURCHASE_DISCOUNT",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("SALES_DISCOUNT",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("PAYMENT_DATE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("ACCOUMULATE_FUND",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("CUSTOMER_NAME",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("CUSTOMER_TELNUM",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("CUSTOMER_CONDITION",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("STAFF_NAME",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("STAFF_TELNUM",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("SALESMAN_CODE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("BUSINESS_CODE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("REPRESENT_NAME",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("CORPORATE_TYPE",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("NON_PURCHASE_PAYMENT",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("NON_SALES_PAYMENT",DataTypes.STRING, 256);
    dsdealcustomer.addColumn("NON_TOTAL_PAYMENT",DataTypes.STRING, 256);
    
    int row = 0;   
    
    /******* SQL query *************/
    String sWhere = "";
    if(customerCode != null)
    {
    	sWhere = "\n" + " WHERE ERP_DEAL_CUSTOMER.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE" + 
    			 "\n" + " AND ERP_DEAL_CUSTOMER.CUSTOMER_CODE = '"+customerCode+"'";
    }
    
    String SQLCustomer = "SELECT * FROM ERP_DEAL_CUSTOMER, ERP_CUSTOMER" + sWhere;
   // System.out.println(SQLCustomer);
    rs1= stmt1.executeQuery(SQLCustomer);
    
   	while(rs1.next())
 	{
   		row = dsdealcustomer.newRow();
   		dsdealcustomer.set(row, "CUSTOMER_CODE",  rs1.getString("CUSTOMER_CODE"));
   		dsdealcustomer.set(row, "PURCHASE_TOTAL_PRICE",  rs1.getString("PURCHASE_TOTAL_PRICE"));
   		dsdealcustomer.set(row, "SALES_TOTAL_PRICE", rs1.getString("SALES_TOTAL_PRICE"));
   		dsdealcustomer.set(row, "PURCHASE_PAYMENT_PRICE", rs1.getString("PURCHASE_PAYMENT_PRICE"));
   		dsdealcustomer.set(row, "SALES_PAYMENT_PRICE", rs1.getString("SALES_PAYMENT_PRICE"));
   		dsdealcustomer.set(row, "PURCHASE_DISCOUNT", rs1.getString("PURCHASE_DISCOUNT"));
   		dsdealcustomer.set(row, "SALES_DISCOUNT", rs1.getString("SALES_DISCOUNT"));
   		dsdealcustomer.set(row, "PAYMENT_DATE", rs1.getString("PAYMENT_DATE"));
   		dsdealcustomer.set(row, "ACCOUMULATE_FUND", rs1.getString("ACCOUMULATE_FUND"));
   		
   		dsdealcustomer.set(row, "CUSTOMER_NAME", rs1.getString("CORPORATE_NAME"));
   		dsdealcustomer.set(row, "CUSTOMER_TELNUM", rs1.getString("CORPORATE_TELNUM"));
   		dsdealcustomer.set(row, "CUSTOMER_CONDITION", rs1.getString("BUSINESS_CONDITION"));
   		dsdealcustomer.set(row, "STAFF_NAME", rs1.getString("STAFF_NAME"));
   		dsdealcustomer.set(row, "STAFF_TELNUM", rs1.getString("STAFF_TELNUM"));
   		dsdealcustomer.set(row, "SALESMAN_CODE", rs1.getString("SALESPERSON_CODE"));
   		dsdealcustomer.set(row, "BUSINESS_CODE", rs1.getString("BUSINESS_LICENSE_NUM"));
   		dsdealcustomer.set(row, "REPRESENT_NAME", rs1.getString("REPRESENTATIVE_NAME"));
   		dsdealcustomer.set(row, "CORPORATE_TYPE", rs1.getString("CORPORATE_TYPE"));
   		
   		dsdealcustomer.set(row, "NON_PURCHASE_PAYMENT", 0);
   		dsdealcustomer.set(row, "NON_SALES_PAYMENT", 0);
   		dsdealcustomer.set(row, "NON_TOTAL_PAYMENT", 0);
 	}

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsdealcustomer);
    

    nErrorCode = 0;
    strErrorMsg = "SUCC";
}
catch(SQLException e) {
    nErrorCode = -1;
    strErrorMsg = e.getMessage();
}

/******** JDBC Close *******/
if ( stmt1 != null ) try { stmt1.close(); } catch (Exception e) {}
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

