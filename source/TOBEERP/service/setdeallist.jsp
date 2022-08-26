<%@ page import = "org.apache.commons.logging.*" %>
<%@ page import = "com.nexacro.java.xapi.data.*" %>
<%@ page import = "com.nexacro.java.xapi.tx.*" %>
<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page contentType = "text/xml; charset=UTF-8" %>

<%!
// Dataset value
public String  dsGet(DataSet ds, int rowno, String colid) throws Exception
{
    String value;
    value = ds.getString(rowno, colid);
    if( value == null )
        return "";
    else
        return value;
} 
%>

<%
/** 3. Creating a basic object of Nexacro Platform **/
//PlatformData pdata = new PlatformData();

//create HttpPlatformRequest for receive data from client
PlatformData pdata = new PlatformData();

HttpPlatformRequest req = new HttpPlatformRequest(request);
req.receiveData();
		
PlatformData reqdata = req.getData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");


/** 6.1 Processing ErrorCode and ErrorMsg **/
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
Statement  stmtd = null;
Statement  stmtc = null;

ResultSet  rs   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
stmtd = conn.createStatement();
stmtc = conn.createStatement();
try {
    /** 5. Processing data: Loading data from the file **/
    /** 5.1 Loading data from the http object **/ 
    /** Obtaining a dataset from the received data **/
    DataSet dsdeal = reqdata.getDataSet("dsdeal");
    DataSet dsdetail = reqdata.getDataSet("dsdetail");
    DataSet dsdealcustomer = reqdata.getDataSet("dedealcustomer");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    String SQLDetail = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < dsdeal.getRemovedRowCount(); i++ )
    {
        String sCode = dsdeal.getRemovedData(i, "DEAL_CODE").toString();
        SQL = "DELETE FROM ERP_DEAL WHERE DEAL_CODE = '" + sCode + "'";
        stmt.executeUpdate(SQL);
        
        SQLDetail = "DELETE FROM ERP_DEALDETAIL WHERE DEAL_CODE = '" + sCode + "'";
        stmtd.executeUpdate(SQLDetail);
    }

    String sEstimateCode = "";
    
    /******** INSERT, UPDATE ********/
    for( i = 0; i < dsdeal.getRowCount(); i++ )
    {
        int rowType = dsdeal.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	        	
        	String sCode = dsGet(dsdeal, i, "DEAL_CODE");
        	String sCustomer = dsGet(dsdeal, i, "CUSTOMER_CODE");
        	String sDate = dsGet(dsdeal, i, "DEAL_DATE");
        	SQL =	"INSERT INTO ERP_DEAL	 (	DEAL_CODE,		\n" +
        			"			               	DEAL_DATE,		\n" +
        			"			               	DEAL_TYPE,		\n" +        			
        			"			               	DEAL_TITLE,		\n" +
        			"			               	TOTAL_AMOUNT,		\n" +
        			"           		      	CUSTOMER_CODE,			\n" +
    				"           		      	ADD_IN_TAX,	\n" +
    				"           		      	SALESMAN_CODE,		\n" +
    				"           		      	BEFORE_PRICE,		\n" +
    				"           		      	DISCOUNT_PRICE,		\n" +
    				"           		      	LAST_PRICE,		\n" +
    				"           		      	CREDIT_PRICE,		\n" +
    				"           		      	CASH_PRICE,		\n" +
					"           		      	ACCOUNT_PRICE,		\n" +
					"           		      	BILL_PRICE,		\n" +
					"                 		 	CARD_PRICE,\n" +
					"                 		 	ESTIMATE_CODE,\n" +
					"                 		 	ACCOUMULATE_FUND,\n" +
					"                 		 	ADD_RESERVE_FUND,\n" +
					"                 		 	USE_RESERVE_FUND,\n" +
    				"           		      	ETC,		\n" +
					"           		      	DEAL_STATUS,		\n" +					
					"                 		 	TAX_TYPE,\n" +
					"                 		 	UNIT_PRICE,\n" +
					"                 		 	TOTAL_PRICE,\n" +
					"                 		 	PAYMENT_PRICE,\n" +
					"           		      	TAX_PRICE,		\n" +
					"		                 	DEAL_SEQ    \n)"+ 
					"SELECT '"	+ dsGet(dsdeal, i, "DEAL_CODE") 	+ "'," +
        			"'"			+ dsGet(dsdeal, i, "DEAL_DATE") 	+ "'," +
        			"'"			+ dsGet(dsdeal, i, "DEAL_TYPE")		+ "'," +  
        			"'"			+ dsGet(dsdeal, i, "DEAL_TITLE")		+ "'," +
        			"'"			+ dsGet(dsdeal, i, "TOTAL_AMOUNT")		+ "'," +
        			"'"			+ dsGet(dsdeal, i, "CUSTOMER_CODE")		+ "'," +
        			"'"			+ dsGet(dsdeal, i, "ADD_IN_TAX")		+ "'," +
        			"'"			+ dsGet(dsdeal, i, "SALESMAN_CODE")	+ "'," +
					"'"			+ dsGet(dsdeal, i, "BEFORE_PRICE") 		+ "'," +
					"'"			+ dsGet(dsdeal, i, "DISCOUNT_PRICE") 		+ "'," +
					"'"			+ dsGet(dsdeal, i, "LAST_PRICE")		+ "'," +					
					"'"			+ dsGet(dsdeal, i, "CREDIT_PRICE") 		+ "'," +
					"'"			+ dsGet(dsdeal, i, "CASH_PRICE")		+ "'," +
					"'"			+ dsGet(dsdeal, i, "ACCOUNT_PRICE") 		+ "'," +
					"'"			+ dsGet(dsdeal, i, "BILL_PRICE") 		+ "'," +
					"'"			+ dsGet(dsdeal, i, "CARD_PRICE") 		+ "'," +
					"'"			+ dsGet(dsdeal, i, "ESTIMATE_CODE") 		+ "'," +
        			"'" 		+ dsGet(dsdeal, i, "ACCOUMULATE_FUND") 		+ "'," +
        			"'" 		+ dsGet(dsdeal, i, "ADD_RESERVE_FUND") 		+ "'," +
        			"'" 		+ dsGet(dsdeal, i, "USE_RESERVE_FUND") 			+ "'," +        			
					"'" 		+ dsGet(dsdeal, i, "ETC") 			+ "'," +
					"'" 		+ dsGet(dsdeal, i, "DEAL_STATUS") 			+ "'," +
					"'" 		+ dsGet(dsdeal, i, "TAX_TYPE") 			+ "'," +
					"'" 		+ dsGet(dsdeal, i, "UNIT_PRICE") 			+ "'," +
					"'" 		+ dsGet(dsdeal, i, "TOTAL_PRICE") 			+ "'," +
					"'" 		+ dsGet(dsdeal, i, "PAYMENT_PRICE") 			+ "'," +
					"'" 		+ dsGet(dsdeal, i, "TAX_PRICE") 			+ "'," +
        			"ISNULL(MAX(DEAL_SEQ) + 1, 1) FROM ERP_DEAL WHERE DEAL_DATE='"+sDate+ "' AND CUSTOMER_CODE='"+sCustomer+"' AND  DEAL_CODE='"+sCode+"'";
        	
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = dsdeal.getSavedData(i, "DEAL_CODE").toString();
            SQL =	"UPDATE ERP_DEAL  \n" +
                 	"SET 	DEAL_STATUS			= '" + dsGet(dsdeal, i, "DEAL_STATUS")	+ "',\n" +
                 	"   	TAX_TYPE		= '" + dsGet(dsdeal, i, "TAX_TYPE")	+ "',\n" +
                 	"   	CUSTOMER_CODE		= '" + dsGet(dsdeal, i, "CUSTOMER_CODE")	+ "',\n" +
                 	"   	SALESMAN_CODE		= '" + dsGet(dsdeal, i, "SALESMAN_CODE")	+ "',\n" +
                 	"   	ADD_IN_TAX			= '" + dsGet(dsdeal, i, "ADD_IN_TAX")	+ "',\n" +
                 	"   	CREDIT_PRICE		= '" + dsGet(dsdeal, i, "CREDIT_PRICE")	+ "',\n" +
                 	"   	LAST_PRICE			= '" + dsGet(dsdeal, i, "LAST_PRICE")		+ "',\n" +
                 	"   	BEFORE_PRICE		= '" + dsGet(dsdeal, i, "BEFORE_PRICE")		+ "',\n" +
                 	"   	TOTAL_PRICE		= '" + dsGet(dsdeal, i, "TOTAL_PRICE")		+ "',\n" +
                 	"   	DISCOUNT_PRICE		= '" + dsGet(dsdeal, i, "DISCOUNT_PRICE")		+ "',\n" +
                 	"   	TAX_PRICE			= '" + dsGet(dsdeal, i, "TAX_PRICE")		+ "',\n" + 
                 	"   	TOTAL_AMOUNT		= '" + dsGet(dsdeal, i, "TOTAL_AMOUNT")		+ "',\n" + 
					"   	ACCOUNT_PRICE		= '" + dsGet(dsdeal, i, "ACCOUNT_PRICE")		+ "',\n" +
					"   	PAYMENT_PRICE		= '" + dsGet(dsdeal, i, "PAYMENT_PRICE")		+ "',\n" +
					"   	BILL_PRICE			= '" + dsGet(dsdeal, i, "BILL_PRICE")		+ "',\n" +
					"   	CARD_PRICE			= '" + dsGet(dsdeal, i, "CARD_PRICE")		+ "',\n" +
					"   	ESTIMATE_CODE		= '" + dsGet(dsdeal, i, "ESTIMATE_CODE")	+ "',\n" +
					"   	ADD_RESERVE_FUND	= '" + dsGet(dsdeal, i, "ADD_RESERVE_FUND")		+ "',\n" +
					"   	USE_RESERVE_FUND	= '" + dsGet(dsdeal, i, "USE_RESERVE_FUND")		+ "',\n" +
					"   	ETC					= '" + dsGet(dsdeal, i, "ETC")		+ "'\n" +
                	"WHERE	DEAL_CODE		= '" + sCode + "'";
            
           
        }                    
        stmt.executeUpdate(SQL);        
    }
    
    for( i = 0; i < dsdetail.getRowCount(); i++ )
    {
        int rowType = dsdetail.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	String sCode  = dsGet(dsdetail, i, "DEAL_CODE");
        	
        	SQLDetail =	"INSERT INTO ERP_DEALDETAIL (	DEAL_CODE,		\n" +
					"			               	PRODUCT_CODE,		\n" +
    				"           		      	AMOUNT,		\n" +
    				"           		      	LAST_PRICE,		\n" +
    				"           		     	UNIT_PRICE,		\n" +
    				"           		      	SURTAX_TYPE,		\n" +
					"           		      	DISCOUNT_PRICE,		\n" +
					"           		      	TAX_PRICE,		\n" +
					"           		      	TOTAL_PRICE,		\n" +
					"           		      	ETC,		\n" +
					"           		      	DEAL_NUMBER		\n)"+ 
        			"SELECT '"	+ dsGet(dsdetail, i, "DEAL_CODE")		+ "'," +
        			"'"			+ dsGet(dsdetail, i, "PRODUCT_CODE")		+ "'," +
        			"'"			+ dsGet(dsdetail, i, "AMOUNT")		+ "'," +
        			"'"			+ dsGet(dsdetail, i, "LAST_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "UNIT_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "SURTAX_TYPE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "DISCOUNT_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "TAX_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "TOTAL_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "ETC")	+ "'," +
					"ISNULL(MAX(DEAL_NUMBER) + 1, 1) FROM ERP_DEALDETAIL WHERE DEAL_CODE='"+sCode+"'";
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = dsdetail.getSavedData(i, "DEAL_CODE").toString();
        	String snum = dsdetail.getSavedData(i, "DEAL_NUMBER").toString();
        	SQLDetail =	"UPDATE ERP_DEALDETAIL  \n" +
                 	"SET 	PRODUCT_CODE		= '" + dsGet(dsdetail, i, "PRODUCT_CODE")	+ "',\n" +
                 	"   	DISCOUNT_PRICE		= '" + dsGet(dsdetail, i, "DISCOUNT_PRICE")	+ "',\n" +                 	
                 	"   	AMOUNT				= '" + dsGet(dsdetail, i, "AMOUNT")			+ "',\n" +
                 	"   	LAST_PRICE			= '" + dsGet(dsdetail, i, "LAST_PRICE")		+ "',\n" +
                 	"   	UNIT_PRICE			= '" + dsGet(dsdetail, i, "UNIT_PRICE")		+ "',\n" +
					"   	SURTAX_TYPE			= '" + dsGet(dsdetail, i, "SURTAX_TYPE")	+ "',\n" +
					"   	TAX_PRICE			= '" + dsGet(dsdetail, i, "TAX_PRICE")		+ "',\n" +	
					"   	TOTAL_PRICE			= '" + dsGet(dsdetail, i, "TOTAL_PRICE")	+ "',\n" +	
					"   	ETC					= '" + dsGet(dsdetail, i, "ETC")			+ "'\n" +
                	"WHERE	DEAL_CODE		= '" + sCode + "' AND DEAL_NUMBER		= '" + snum + "'";
          
        }                    
        stmtd.executeUpdate(SQLDetail);
    }
    
    //dsdealcustomer
    
    String SQLCustomer = "";
    for( i = 0; i < dsdealcustomer.getRowCount(); i++ )
    {
        int rowType = dsdealcustomer.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	SQLCustomer =	"INSERT INTO ERP_DEAL_CUSTOMER 		    \n(" + 
		        			"				CUSTOMER_CODE				,\n" +
							"				PURCHASE_TOTAL_PRICE		,\n" +
		    				"           	SALES_TOTAL_PRICE			,\n" +
		    				"           	PURCHASE_PAYMENT_PRICE		,\n" +
		    				"           	SALES_PAYMENT_PRICE			,\n" +
		    				"           	PURCHASE_DISCOUNT			,\n" +
							"           	SALES_DISCOUNT				,\n" +
							"           	PAYMENT_DATE				,\n" +
							"           	ACCOUMULATE_FUND			 \n)"+ 
		        			"VALUES (  									 \n"+ 
							"'"+ dsGet(dsdealcustomer, i, "CUSTOMER_CODE")			+ "',\n" +
		        			"'"+ dsGet(dsdealcustomer, i, "PURCHASE_TOTAL_PRICE")	+ "',\n" +
		        			"'"+ dsGet(dsdealcustomer, i, "SALES_TOTAL_PRICE")		+ "',\n" +
		        			"'"+ dsGet(dsdealcustomer, i, "PURCHASE_PAYMENT_PRICE")	+ "',\n" +
							"'"+ dsGet(dsdealcustomer, i, "SALES_PAYMENT_PRICE")	+ "',\n" +
							"'"+ dsGet(dsdealcustomer, i, "PURCHASE_DISCOUNT")		+ "',\n" +
							"'"+ dsGet(dsdealcustomer, i, "SALES_DISCOUNT")			+ "',\n" +
							"'"+ dsGet(dsdealcustomer, i, "PAYMENT_DATE")			+ "',\n" +
							"'"+ dsGet(dsdealcustomer, i, "ACCOUMULATE_FUND")		+ "'\n)";
        	 //System.out.println(SQLCustomer);
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = dsdealcustomer.getSavedData(i, "CUSTOMER_CODE").toString();
        	SQLCustomer =	"UPDATE ERP_DEAL_CUSTOMER  \n" +
		                 	"SET 	PURCHASE_TOTAL_PRICE	= '" + dsGet(dsdealcustomer, i, "PURCHASE_TOTAL_PRICE")		+ "',\n" +
		                 	"   	SALES_TOTAL_PRICE		= '" + dsGet(dsdealcustomer, i, "SALES_TOTAL_PRICE")		+ "',\n" +                 	
		                 	"   	PURCHASE_PAYMENT_PRICE	= '" + dsGet(dsdealcustomer, i, "PURCHASE_PAYMENT_PRICE")	+ "',\n" +
		                 	"   	SALES_PAYMENT_PRICE		= '" + dsGet(dsdealcustomer, i, "SALES_PAYMENT_PRICE")		+ "',\n" +
		                 	"   	PURCHASE_DISCOUNT		= '" + dsGet(dsdealcustomer, i, "PURCHASE_DISCOUNT")		+ "',\n" +
							"   	SALES_DISCOUNT			= '" + dsGet(dsdealcustomer, i, "SALES_DISCOUNT")			+ "',\n" +	
							"   	PAYMENT_DATE			= '" + dsGet(dsdealcustomer, i, "PAYMENT_DATE")				+ "',\n" +	
							"   	ACCOUMULATE_FUND		= '" + dsGet(dsdealcustomer, i, "ACCOUMULATE_FUND")			+ "'\n" +
		                	"WHERE	CUSTOMER_CODE			= '" + sCode + "'";
        	//System.out.println(SQLCustomer);
        }                    
        stmtc.executeUpdate(SQLCustomer);
    }

    /** 6.2 Setting ErrorCode and ErrorMsg for success **/
    nErrorCode = 0;
    strErrorMsg = "person list saved complete : row count("+dsdeal.getRowCount()+")";
    
} catch (Throwable th) {
    /** 6.3 Setting ErrorCode and ErrorMsg for failure **/
    nErrorCode = -1;
    strErrorMsg = th.getMessage();
    System.out.println("ERROR:"+strErrorMsg); 
}

/** 6.4 Saving ErrorCode and ErrorMsg to send them to the client **/
PlatformData senddata = new PlatformData();
VariableList sendList = senddata.getVariableList();
sendList.add("ErrorCode", nErrorCode);
sendList.add("ErrorMsg", strErrorMsg);

/** 7. Sending result data to the client **/
HttpPlatformResponse res = new HttpPlatformResponse(response, 
    PlatformType.CONTENT_TYPE_XML,"UTF-8");
res.setData(senddata);
res.sendData();
%>
