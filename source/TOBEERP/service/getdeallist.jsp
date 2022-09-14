<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>

<%@ page contentType="text/xml; charset=utf-8" %>

<%!
public static boolean isNull(String str)
{
    return str == null || str.length() == 0;
}
%>

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
String dealcode  = varList.getString("argDealCode");

String sWhere = null;
String sWhereCustomer = null;

//QuickCode를 위해 Dataset으로 input조회조건 변경
DataSet dsinput = reqdata.getDataSet("dsinput");

if (dsinput != null && dsinput.hasData())
{
	customercode = dsinput.getString(0, "CUSTOMER");
	title = dsinput.getString(0, "TITLE");
	startday = dsinput.getString(0, "STARTDAY");
	endday = dsinput.getString(0, "ENDDAY");
	salesmancode = dsinput.getString(0, "SALESMAN");
	typecode = dsinput.getString(0, "TYPE");
	statuscode = dsinput.getString(0, "STATUS");
	dealcode = dsinput.getString(0, "DEAL_CODE");
}

if(!isNull(startday))
{
	sWhere = " WHERE ERP_DEAL.DEAL_DATE = '"+startday+"'"; 
}

if(!isNull(endday))
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_DEAL.DEAL_DATE = '"+endday+"'"; 
	}
	else
	{
		sWhere = " WHERE ERP_DEAL.DEAL_DATE <= '"+endday+"' AND ERP_DEAL.DEAL_DATE >= '"+startday+"'";
	}
}

if(!isNull(customercode))
{
	if(sWhere == null)
	{
		sWhere = " WHERE (ERP_CUSTOMER.CORPORATE_NAME LIKE '%"+customercode+"%' OR ERP_CUSTOMER.CORPORATE_CODE = '"+customercode+"')";
		sWhereCustomer = " WHERE ERP_CUSTOMER.CORPORATE_NAME LIKE '%"+customercode+"%'";
	}
	else
	{
		sWhere += " AND (ERP_CUSTOMER.CORPORATE_NAME LIKE '%"+customercode+"%' OR ERP_CUSTOMER.CORPORATE_CODE = '"+customercode+"')";
		sWhereCustomer += "  AND ERP_CUSTOMER.CORPORATE_NAME LIKE '%"+customercode+"%'";
	}
}
	
if(!isNull(typecode))
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_DEAL.DEAL_TYPE='"+typecode+"'";
	}
	else
	{
		sWhere += " AND ERP_DEAL.DEAL_TYPE='"+typecode+"'";
	}
}
	
if(!isNull(statuscode))
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_DEAL.DEAL_STATUS='"+statuscode+"'";
	}
	else
	{
		sWhere += " AND ERP_DEAL.DEAL_STATUS='"+statuscode+"'";
	}
}
	
if(!isNull(salesmancode))
{
	if(sWhere == null)
	{
		sWhere = " WHERE ERP_DEAL.SALESMAN_CODE='"+salesmancode+"'";
	}
	else
	{
		sWhere += " AND ERP_DEAL.SALESMAN_CODE='"+salesmancode+"'";
	}
}

if(sWhere == null)
{
	sWhere = " WHERE ERP_DEAL.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE ";
	sWhereCustomer = " WHERE ERP_DEAL_CUSTOMER.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE ";
}
else
{
	sWhere += " AND ERP_DEAL.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE ";
	sWhereCustomer += " AND ERP_DEAL_CUSTOMER.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE "; 
}

if(!isNull(dealcode))
{
	sWhere = " WHERE ERP_DEAL.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE AND ERP_DEAL.DEAL_CODE='"+dealcode+"' ";
	sWhereCustomer = "";
}

String SQL = "SELECT * ";
SQL += " , CASE WHEN ERP_DEAL.DEAL_TYPE = 'pS' THEN ERP_DEAL.PAYMENT_PRICE ELSE 0 END PS_PAYMENT_PRICE";
SQL += " , CASE WHEN ERP_DEAL.DEAL_TYPE = 'lS' THEN ERP_DEAL.PAYMENT_PRICE ELSE 0 END lS_PAYMENT_PRICE";
SQL += " , TOTAL_PRICE-PAYMENT_PRICE STATEMENT_BALANCE_PRICE";
SQL += " FROM ERP_DEAL, ERP_CUSTOMER"+ sWhere + "  ORDER BY ERP_DEAL.DEAL_DATE DESC"; 
		
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
	//System.out.println(SQL);
    rs = stmt.executeQuery(SQL);

    /********* Dataset Create ************/
    DataSet dsdeal = new DataSet("dsdeal");
    dsdeal.addColumn("DEAL_CODE",DataTypes.STRING, 256);    
    dsdeal.addColumn("DEAL_DATE",DataTypes.STRING, 256);
    dsdeal.addColumn("DEAL_TYPE",DataTypes.STRING, 256);
    dsdeal.addColumn("DEAL_TITLE",DataTypes.STRING, 256);
    dsdeal.addColumn("TOTAL_AMOUNT",DataTypes.INT, 256);
    dsdeal.addColumn("CUSTOMER_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("ADD_IN_TAX",DataTypes.STRING, 256);
    dsdeal.addColumn("ACCOUNT_BILL",DataTypes.STRING, 256);
    dsdeal.addColumn("SALESMAN_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("BEFORE_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("DISCOUNT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("LAST_PRICE",DataTypes.INT, 256);    
    dsdeal.addColumn("CREDIT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("CASH_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("ACCOUNT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("BILL_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("CARD_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("ESTIMATE_CODE",DataTypes.STRING, 256);
    dsdeal.addColumn("ACCOUMULATE_FUND",DataTypes.STRING, 256);
    dsdeal.addColumn("ADD_RESERVE_FUND",DataTypes.INT, 256);
    dsdeal.addColumn("USE_RESERVE_FUND",DataTypes.INT, 256);
    dsdeal.addColumn("ETC",DataTypes.STRING, 256);
    dsdeal.addColumn("DEAL_STATUS",DataTypes.STRING, 256);    
    dsdeal.addColumn("DEAL_SEQ",DataTypes.INT, 256);
    dsdeal.addColumn("TAX_TYPE",DataTypes.STRING, 256);
    dsdeal.addColumn("UNIT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("TOTAL_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("PAYMENT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("TAX_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("PS_PAYMENT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("lS_PAYMENT_PRICE",DataTypes.INT, 256);
    dsdeal.addColumn("STATEMENT_BALANCE_PRICE",DataTypes.INT, 256);
    
    DataSet dsdetail = new DataSet("dsdetail");
    dsdetail.addColumn("DEAL_CODE",DataTypes.STRING, 256);   
    dsdetail.addColumn("DEAL_NUMBER",DataTypes.STRING, 256);    
    dsdetail.addColumn("PRODUCT_CODE",DataTypes.STRING, 256);
    dsdetail.addColumn("AMOUNT",DataTypes.STRING, 256);
    dsdetail.addColumn("LAST_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("UNIT_PRICE",DataTypes.STRING, 256);
    dsdetail.addColumn("ETC",DataTypes.STRING, 256);
    dsdetail.addColumn("SURTAX_TYPE",DataTypes.STRING, 256); 
    dsdetail.addColumn("TAX_PRICE",DataTypes.STRING, 256); 
    dsdetail.addColumn("PRODUCT_NAME",DataTypes.STRING, 256);
    dsdetail.addColumn("STANDARD",DataTypes.STRING, 256);
    dsdetail.addColumn("UNIT",DataTypes.STRING, 256);
    dsdetail.addColumn("TOTAL_PRICE",DataTypes.STRING, 256); 
    dsdetail.addColumn("DISCOUNT_PRICE",DataTypes.STRING, 256); 
     
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
        
    String sCode = "";
    String sParentCode = "";
    String sProductCode = "";
    String sCustomerCode = "";
    int row = 0;
    int customerRow = 0;
    int detailrow = 0;
    while(rs.next())
    { 
        row = dsdeal.newRow();
        dsdeal.set(row, "DEAL_CODE",  rs.getString("DEAL_CODE"));
        dsdeal.set(row, "DEAL_DATE",  rs.getString("DEAL_DATE"));
        dsdeal.set(row, "DEAL_TYPE",  rs.getString("DEAL_TYPE"));
        dsdeal.set(row, "DEAL_TITLE",  rs.getString("DEAL_TITLE"));
        dsdeal.set(row, "TOTAL_AMOUNT",  rs.getString("TOTAL_AMOUNT"));
        dsdeal.set(row, "CUSTOMER_CODE",  rs.getString("CUSTOMER_CODE"));
        dsdeal.set(row, "ADD_IN_TAX",     rs.getString("ADD_IN_TAX"));
        dsdeal.set(row, "ACCOUNT_BILL",   rs.getString("ACCOUNT_BILL"));
        dsdeal.set(row, "SALESMAN_CODE",  rs.getString("SALESMAN_CODE"));
        dsdeal.set(row, "BEFORE_PRICE",   rs.getString("BEFORE_PRICE"));
        dsdeal.set(row, "DISCOUNT_PRICE", rs.getString("DISCOUNT_PRICE"));
        dsdeal.set(row, "LAST_PRICE",    rs.getString("LAST_PRICE"));
        dsdeal.set(row, "CREDIT_PRICE",  rs.getString("CREDIT_PRICE"));
        dsdeal.set(row, "CASH_PRICE",    rs.getString("CASH_PRICE"));
        dsdeal.set(row, "ACCOUNT_PRICE", rs.getString("ACCOUNT_PRICE"));
        dsdeal.set(row, "BILL_PRICE",    rs.getString("BILL_PRICE"));
        dsdeal.set(row, "CARD_PRICE",    rs.getString("CARD_PRICE"));
        dsdeal.set(row, "ESTIMATE_CODE", rs.getString("ESTIMATE_CODE"));
        dsdeal.set(row, "ACCOUMULATE_FUND", rs.getString("ACCOUMULATE_FUND"));
        dsdeal.set(row, "ADD_RESERVE_FUND", rs.getString("ADD_RESERVE_FUND"));
        dsdeal.set(row, "USE_RESERVE_FUND", rs.getString("USE_RESERVE_FUND"));
        dsdeal.set(row, "ETC", rs.getString("ETC"));
        dsdeal.set(row, "DEAL_STATUS", rs.getString("DEAL_STATUS"));
        dsdeal.set(row, "DEAL_SEQ", rs.getString("DEAL_SEQ"));
        dsdeal.set(row, "TAX_TYPE", rs.getString("TAX_TYPE"));
        dsdeal.set(row, "UNIT_PRICE", rs.getString("UNIT_PRICE"));
        dsdeal.set(row, "TOTAL_PRICE", rs.getString("TOTAL_PRICE"));
        dsdeal.set(row, "PAYMENT_PRICE", rs.getString("PAYMENT_PRICE"));
        dsdeal.set(row, "PS_PAYMENT_PRICE", rs.getString("PS_PAYMENT_PRICE"));
        dsdeal.set(row, "lS_PAYMENT_PRICE", rs.getString("lS_PAYMENT_PRICE"));
        dsdeal.set(row, "STATEMENT_BALANCE_PRICE", rs.getString("STATEMENT_BALANCE_PRICE"));
        dsdeal.set(row, "TAX_PRICE", rs.getString("TAX_PRICE"));
       
        
       // sCustomerCode =  rs.getString("CUSTOMER_CODE");
        sParentCode = rs.getString("DEAL_CODE");     
        
        String SQL2 = "";
        
        SQL2 = "SELECT * FROM ERP_DEALDETAIL, ERP_PRODUCT " +
				"WHERE ERP_DEALDETAIL.PRODUCT_CODE = ERP_PRODUCT.PRODUCT_CODE " +
				"AND ERP_DEALDETAIL.DEAL_CODE = '"+ sParentCode +"'";
        //sWhereCustomer
        
        rs2 = stmt2.executeQuery(SQL2);
        while(rs2.next())
        {
        	detailrow = dsdetail.newRow();
        	dsdetail.set(detailrow, "DEAL_CODE", rs2.getString("DEAL_CODE"));
            dsdetail.set(detailrow, "DEAL_NUMBER", rs2.getString("DEAL_NUMBER"));            
            dsdetail.set(detailrow, "PRODUCT_CODE", rs2.getString("PRODUCT_CODE"));
            dsdetail.set(detailrow, "AMOUNT", rs2.getString("AMOUNT"));
            dsdetail.set(detailrow, "LAST_PRICE", rs2.getString("LAST_PRICE"));
            dsdetail.set(detailrow, "UNIT_PRICE", rs2.getString("UNIT_PRICE"));
            dsdetail.set(detailrow, "ETC", rs2.getString("ETC"));
            dsdetail.set(detailrow, "SURTAX_TYPE", rs2.getString("SURTAX_TYPE"));
            dsdetail.set(detailrow, "TAX_PRICE", rs2.getString("TAX_PRICE"));
            dsdetail.set(detailrow, "PRODUCT_NAME", rs2.getString("PRODUCT_NAME"));
            dsdetail.set(detailrow, "STANDARD", rs2.getString("STANDARD"));
            dsdetail.set(detailrow, "UNIT", rs2.getString("UNIT"));
            dsdetail.set(detailrow, "TOTAL_PRICE", rs2.getString("TOTAL_PRICE"));
            dsdetail.set(detailrow, "DISCOUNT_PRICE", rs2.getString("DISCOUNT_PRICE"));
        }        
    }
    
    String SQLCustomer = "";
    String sCustomerdistint = "";
    
    SQLCustomer = "SELECT distinct CUSTOMER_CODE FROM ERP_DEAL, ERP_CUSTOMER " + sWhere;
    
    rs1= stmt1.executeQuery(SQLCustomer);
   
    customerRow = -1;
    String SQLDealCustomer = "";
   	while(rs1.next())
 	{
   		sCustomerdistint =  rs1.getString("CUSTOMER_CODE");
   		SQLDealCustomer = "SELECT * " + 
   						" , PURCHASE_TOTAL_PRICE - PURCHASE_PAYMENT_PRICE AS NON_PURCHASE_PAYMENT" + 
   						" , SALES_TOTAL_PRICE - SALES_PAYMENT_PRICE AS NON_SALES_PAYMENT" +
   						" , SALES_TOTAL_PRICE - SALES_PAYMENT_PRICE - PURCHASE_TOTAL_PRICE - PURCHASE_PAYMENT_PRICE AS NON_TOTAL_PAYMENT" +
						" FROM ERP_DEAL_CUSTOMER,ERP_CUSTOMER" + 
   				          " WHERE ERP_DEAL_CUSTOMER.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE" +
   						  " AND CUSTOMER_CODE='"+sCustomerdistint+"'";
   		//System.out.println(SQLDealCustomer);
   		rs3= stmt3.executeQuery(SQLDealCustomer);
   		
   		while(rs3.next())
   		{
   			customerRow = dsdealcustomer.newRow();
	   		dsdealcustomer.set(customerRow, "CUSTOMER_CODE",  rs3.getString("CUSTOMER_CODE"));
	   		dsdealcustomer.set(customerRow, "PURCHASE_TOTAL_PRICE",  rs3.getString("PURCHASE_TOTAL_PRICE"));
	   		dsdealcustomer.set(customerRow, "SALES_TOTAL_PRICE", rs3.getString("SALES_TOTAL_PRICE"));
	   		dsdealcustomer.set(customerRow, "PURCHASE_PAYMENT_PRICE", rs3.getString("PURCHASE_PAYMENT_PRICE"));
	   		dsdealcustomer.set(customerRow, "SALES_PAYMENT_PRICE", rs3.getString("SALES_PAYMENT_PRICE"));
	   		dsdealcustomer.set(customerRow, "PURCHASE_DISCOUNT", rs3.getString("PURCHASE_DISCOUNT"));
	   		dsdealcustomer.set(customerRow, "SALES_DISCOUNT", rs3.getString("SALES_DISCOUNT"));
	   		dsdealcustomer.set(customerRow, "PAYMENT_DATE", rs3.getString("PAYMENT_DATE"));
	   		dsdealcustomer.set(customerRow, "ACCOUMULATE_FUND", rs3.getString("ACCOUMULATE_FUND"));
	   		
	   		dsdealcustomer.set(customerRow, "CUSTOMER_NAME", rs3.getString("CORPORATE_NAME"));
	   		dsdealcustomer.set(customerRow, "CUSTOMER_TELNUM", rs3.getString("CORPORATE_TELNUM"));
	   		dsdealcustomer.set(customerRow, "CUSTOMER_CONDITION", rs3.getString("BUSINESS_CONDITION"));
	   		dsdealcustomer.set(customerRow, "STAFF_NAME", rs3.getString("STAFF_NAME"));
	   		dsdealcustomer.set(customerRow, "STAFF_TELNUM", rs3.getString("STAFF_TELNUM"));
	   		dsdealcustomer.set(customerRow, "SALESMAN_CODE", rs3.getString("SALESPERSON_CODE"));
	   		dsdealcustomer.set(customerRow, "BUSINESS_CODE", rs3.getString("BUSINESS_LICENSE_NUM"));
	   		dsdealcustomer.set(customerRow, "REPRESENT_NAME", rs3.getString("REPRESENTATIVE_NAME"));
	   		dsdealcustomer.set(customerRow, "CORPORATE_TYPE", rs3.getString("CORPORATE_TYPE"));
	   		
	   		dsdealcustomer.set(customerRow, "NON_PURCHASE_PAYMENT", rs3.getString("NON_PURCHASE_PAYMENT"));
	   		dsdealcustomer.set(customerRow, "NON_SALES_PAYMENT", rs3.getString("NON_SALES_PAYMENT"));
	   		dsdealcustomer.set(customerRow, "NON_TOTAL_PAYMENT", rs3.getString("NON_TOTAL_PAYMENT"));
   		}
 	}

    /********* Adding Dataset to PlatformData ************/
    pdata.addDataSet(dsdeal);
    pdata.addDataSet(dsdetail);
    pdata.addDataSet(dsdealcustomer);
    

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

