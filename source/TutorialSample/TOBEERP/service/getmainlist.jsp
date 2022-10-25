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
		
PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");

int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
ResultSet  rs1   = null;
ResultSet  rs2   = null;
ResultSet  rs3   = null;
ResultSet  rs4   = null;
ResultSet  rs5	 = null;
ResultSet  rs6   = null;
Class.forName(jdbcClass);
conn = DriverManager.getConnection(jdbcUrl,dbId,dbPass);
stmt = conn.createStatement();

try {
	//dsStatus=dsstatus dsType=dstype dsSalesman=dssalesman dsPayment=dspayment dsSurtax=dssurtax
	/********* Dataset Create ************/
	DataSet dsdeal = new DataSet("dsdeal");
	dsdeal.addColumn("DEAL_CODE",DataTypes.STRING, 256);
	dsdeal.addColumn("DEAL_TYPE",DataTypes.STRING, 256);
	dsdeal.addColumn("DEAL_DATE",DataTypes.STRING, 256);
	dsdeal.addColumn("CUSTOMER_NAME",DataTypes.STRING, 256);
	dsdeal.addColumn("ADD_IN_TAX",DataTypes.STRING, 256);
	dsdeal.addColumn("TOTAL_PRICE",DataTypes.STRING, 256);
	
	DataSet dsestimate = new DataSet("dsestimate");
	dsestimate.addColumn("ESTIMATE_DATE",DataTypes.STRING, 256);
	dsestimate.addColumn("ESTIMATE_STATUS",DataTypes.STRING, 256);
	dsestimate.addColumn("SALESMAN_CODE",DataTypes.STRING, 256);
	dsestimate.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
	dsestimate.addColumn("ESTIMATE_TYPE",DataTypes.STRING, 256);
	dsestimate.addColumn("ESTIMATE_TITLE",DataTypes.STRING, 256);
	dsestimate.addColumn("EXPIRY_TERM",DataTypes.STRING, 256);
	dsestimate.addColumn("CORPORATE_NAME",DataTypes.STRING, 256);
	
	// [QuickCode] 거래처별 판매현황 
	DataSet dssalescustomer = new DataSet("dssalescustomer");
	dssalescustomer.addColumn("CUSTOMER",DataTypes.STRING, 256);
	dssalescustomer.addColumn("TOTAL_PRICE",DataTypes.INT, 256);
	
	// [QuickCode] 매출/매입 현황 추가
	DataSet dssales = new DataSet("dssales");
	dssales.addColumn("DT_YYYYMM",DataTypes.STRING, 256);
	dssales.addColumn("SALES_AMOUNT",DataTypes.INT, 256);
	dssales.addColumn("RECEIPT_AMOUNT",DataTypes.INT, 256);
	dssales.addColumn("PURCHASE_AMOUNT",DataTypes.INT, 256);
    
    /******* SQL query *************/
    /*
    String	SQL1  = "SELECT TOP 5 DEAL_CODE, TYPE_VALUE, DEAL_DATE , ADD_IN_TAX, CORPORATE_NAME, TOTAL_PRICE "+ "\n" +
    				"FROM ERP_DEAL, ERP_ACCOUNT_TYPE, ERP_CUSTOMER " + "\n" +
    				"WHERE ERP_ACCOUNT_TYPE.TYPE_CODE=ERP_DEAL.DEAL_TYPE AND ERP_CUSTOMER.CORPORATE_CODE = ERP_DEAL.CUSTOMER_CODE  ORDER BY ERP_DEAL.DEAL_DATE DESC";
    */
    String	SQL1  = "SELECT  DEAL_CODE, TYPE_VALUE, DEAL_DATE , ADD_IN_TAX, CORPORATE_NAME, TOTAL_PRICE "+ "\n" +
			"FROM erp_deal, erp_account_type, erp_customer " + "\n" +
			"WHERE erp_account_type.TYPE_CODE=erp_deal.DEAL_TYPE AND erp_customer.CORPORATE_CODE = erp_deal.CUSTOMER_CODE  ORDER BY erp_deal.DEAL_DATE DESC LIMIT 5";

    int row = 0;
    rs1 = stmt.executeQuery(SQL1);  
   
    while(rs1.next())
    {
   		row = dsdeal.newRow();
   		dsdeal.set(row, "DEAL_CODE", rs1.getString("DEAL_CODE"));    
   		dsdeal.set(row, "DEAL_TYPE", rs1.getString("TYPE_VALUE"));
   		dsdeal.set(row, "DEAL_DATE", rs1.getString("DEAL_DATE"));
   		dsdeal.set(row, "CUSTOMER_NAME", rs1.getString("CORPORATE_NAME"));
   		dsdeal.set(row, "ADD_IN_TAX", rs1.getString("ADD_IN_TAX"));
   		dsdeal.set(row, "TOTAL_PRICE", rs1.getString("TOTAL_PRICE"));
    }
    
    String SQL2 = "SELECT  ESTIMATE_DATE,ESTIMATE_STATUS,SALESMAN_CODE,CUSTOMER_CODE, CORPORATE_NAME ,ESTIMATE_TYPE,ESTIMATE_TITLE,EXPIRY_TERM FROM erp_estimate ,erp_customer" +
    			" WHERE erp_estimate.CUSTOMER_CODE = erp_customer.CORPORATE_CODE ORDER BY erp_estimate.ESTIMATE_DATE DESC LIMIT 5";
    
    row = 0;
    rs2 = stmt.executeQuery(SQL2);  
   System.out.println(SQL2);
    while(rs2.next())
    {
   		row = dsestimate.newRow();
   		dsestimate.set(row, "ESTIMATE_DATE", rs2.getString("ESTIMATE_DATE"));    
   		dsestimate.set(row, "ESTIMATE_STATUS", rs2.getString("ESTIMATE_STATUS"));
   		dsestimate.set(row, "SALESMAN_CODE", rs2.getString("SALESMAN_CODE"));
   		dsestimate.set(row, "CUSTOMER_CODE", rs2.getString("CUSTOMER_CODE"));
   		dsestimate.set(row, "ESTIMATE_TYPE", rs2.getString("ESTIMATE_TYPE"));
   		dsestimate.set(row, "ESTIMATE_TITLE", rs2.getString("ESTIMATE_TITLE"));
   		dsestimate.set(row, "EXPIRY_TERM", rs2.getString("EXPIRY_TERM"));
   		dsestimate.set(row, "CORPORATE_NAME", rs2.getString("CORPORATE_NAME"));
    }
    
    String SQL3 = "SELECT SALES_TOTAL_PRICE, CUSTOMER_CODE, CORPORATE_NAME FROM erp_deal_customer, erp_customer WHERE erp_deal_customer.CUSTOMER_CODE=erp_customer.CORPORATE_CODE  order by  erp_deal_customer.SALES_TOTAL_PRICE desc";

	row = 0;
	rs3 = stmt.executeQuery(SQL3);  
	while(rs3.next())
	{
			// [QuickCode] 거래처별 판매현황
			row = dssalescustomer.newRow();
			dssalescustomer.set(row, "CUSTOMER", rs3.getString("CORPORATE_NAME"));    
			dssalescustomer.set(row, "TOTAL_PRICE", rs3.getString("SALES_TOTAL_PRICE"));
	}
	
	// [QuickCode] 매출/매입 현황 데이터설정
	row = 0;
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.01");
	dssales.set(row, "SALES_AMOUNT", 960);
	dssales.set(row, "RECEIPT_AMOUNT", 850);
	dssales.set(row, "PURCHASE_AMOUNT", 1080);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.02");
	dssales.set(row, "SALES_AMOUNT", 380);
	dssales.set(row, "RECEIPT_AMOUNT", 250);
	dssales.set(row, "PURCHASE_AMOUNT", 530);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.03");
	dssales.set(row, "SALES_AMOUNT", 510);
	dssales.set(row, "RECEIPT_AMOUNT", 350);
	dssales.set(row, "PURCHASE_AMOUNT", 830);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.04");
	dssales.set(row, "SALES_AMOUNT", 1230);
	dssales.set(row, "RECEIPT_AMOUNT", 150);
	dssales.set(row, "PURCHASE_AMOUNT", 700);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.05");
	dssales.set(row, "SALES_AMOUNT", 1010);
	dssales.set(row, "RECEIPT_AMOUNT", 100);
	dssales.set(row, "PURCHASE_AMOUNT", 550);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.06");
	dssales.set(row, "SALES_AMOUNT", 980);
	dssales.set(row, "RECEIPT_AMOUNT", 200);
	dssales.set(row, "PURCHASE_AMOUNT", 680);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.07");
	dssales.set(row, "SALES_AMOUNT", 1370);
	dssales.set(row, "RECEIPT_AMOUNT", 300);
	dssales.set(row, "PURCHASE_AMOUNT", 1020);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.08");
	dssales.set(row, "SALES_AMOUNT", 840);
	dssales.set(row, "RECEIPT_AMOUNT", 400);
	dssales.set(row, "PURCHASE_AMOUNT", 680);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.09");
	dssales.set(row, "SALES_AMOUNT", 1830);
	dssales.set(row, "RECEIPT_AMOUNT", 350);
	dssales.set(row, "PURCHASE_AMOUNT", 1570);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.10");
	dssales.set(row, "SALES_AMOUNT", 770);
	dssales.set(row, "RECEIPT_AMOUNT", 250);
	dssales.set(row, "PURCHASE_AMOUNT", 930);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.11");
	dssales.set(row, "SALES_AMOUNT", 690);
	dssales.set(row, "RECEIPT_AMOUNT", 100);
	dssales.set(row, "PURCHASE_AMOUNT", 530);
	row = dssales.newRow();
	dssales.set(row, "DT_YYYYMM", "2020.12");
	dssales.set(row, "SALES_AMOUNT", 450);
	dssales.set(row, "RECEIPT_AMOUNT", 200);
	dssales.set(row, "PURCHASE_AMOUNT", 360);
	
    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsdeal);
    pdata.addDataSet(dsestimate);
    pdata.addDataSet(dssalescustomer);		// [QuickCode] 거래처별 판매현황
	pdata.addDataSet(dssales);				// [QuickCode] 매출/매입 현황
    
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
