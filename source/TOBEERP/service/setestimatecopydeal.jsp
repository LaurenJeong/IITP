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
ResultSet  rsc   = null;
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
	
    /** Saving data as a file with init data **/
    String SQL = "";
    String SQLDetail = "";
    
    String sDate = "";
	String sType = "";
	String sCustomerCode = "";
	
	String sDealCode = "";
	String sDealSql = "";
	
    int    i;        
    System.out.println("sss");
    /******** INSERT, UPDATE ********/
    for( i = 0; i < dsdeal.getRowCount(); i++ )
    {
    	sCustomerCode = dsGet(dsdeal, i, "CUSTOMER_CODE");
    	sType = dsGet(dsdeal, i, "ESTIMATE_TYPE");
    	sDate = dsGet(dsdeal, i, "DEAL_DATE");
    	
    	String SQLdealcode = "SELECT RIGHT('00' + CAST(ISNULL(MAX(DEAL_SEQ) + 1, 1) AS NVARCHAR), 2) AS TEMP_SEQ, ISNULL(MAX(DEAL_SEQ) + 1, 1) AS DEAL_SEQ  FROM ERP_DEAL WHERE CUSTOMER_CODE='"+sCustomerCode+"' AND  DEAL_DATE='"+sDate+"' AND  DEAL_TYPE='"+sType+"'";
    	
    	rs = stmt.executeQuery(SQLdealcode);
    	
    	while(rs.next())
   	   {
    		sDealCode = sDate+sType+sCustomerCode +rs.getString("TEMP_SEQ");
    		sDealSql  = rs.getString("DEAL_SEQ");
   	        
   	    }
    			
       	SQL =	"INSERT INTO ERP_DEAL	 (	DEAL_DATE,		\n" +
       			"			               	DEAL_TYPE,		\n" +     
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
				"                 		 	TAX_TYPE,\n" +
				"                 		 	UNIT_PRICE,\n" +
				"                 		 	TOTAL_PRICE,\n" +
				"                 		 	PAYMENT_PRICE,\n" +
				"           		      	TAX_PRICE,		\n" +
				"           		      	DEAL_CODE,		\n" +
				"		                 	DEAL_SEQ    \n)"+ 
				"VALUS( '"	+ dsGet(dsdeal, i, "DEAL_DATE") 	+ "'," +
       			"'"			+ dsGet(dsdeal, i, "ESTIMATE_TYPE")		+ "'," +  
       			"'"			+ dsGet(dsdeal, i, "TOTAL_AMOUNT")		+ "'," +
       			"'"			+ dsGet(dsdeal, i, "CUSTOMER_CODE")		+ "'," +
       			"'"			+ dsGet(dsdeal, i, "ADD_IN_TAX")		+ "'," +
       			"'"			+ dsGet(dsdeal, i, "SALESMAN_CODE")	+ "'," +
				"'"			+ dsGet(dsdeal, i, "UNIT_PRICE") 		+ "'," +
				"'"			+ dsGet(dsdeal, i, "DISCOUNT_PRICE") 		+ "'," +
				"'"			+ dsGet(dsdeal, i, "LAST_PRICE")		+ "'," +			
				"'0'," +
				"'0'," +
				"'0'," +
				"'0'," +
				"'0'," +
				"'"			+ dsGet(dsdeal, i, "ESTIMATE_CODE") 		+ "'," +
				"'0'," +
				"'0'," +
				"'0'," +      			
				"'" 		+ dsGet(dsdeal, i, "ETC") 			+ "'," +
				"'" 		+ dsGet(dsdeal, i, "TAX_TYPE") 			+ "'," +
				"'" 		+ dsGet(dsdeal, i, "UNIT_PRICE") 			+ "'," +
				"'" 		+ dsGet(dsdeal, i, "TOTAL_PRICE") 			+ "'," +
				"'0'," + 
				"'" 		+ dsGet(dsdeal, i, "TAX_PRICE") 			+ "'," +
				"'"			+sDealCode+ "'," +
       			"'"			+sDealSql+ "')";            
       	
       	String totalPrice = dsGet(dsdeal, i, "TOTAL_PRICE");	 
       	String paymentPrice = dsGet(dsdeal, i, "PAYMENT_PRICE");
       	String discountPrice = dsGet(dsdeal, i, "DISCOUNT_PRICE");
        
       	System.out.println(Integer.parseInt(totalPrice));
       	//stmt.executeUpdate(SQL);
       	System.out.println(SQL);
       	String SQLCustomer = "SELECT * FROM ERP_DEAL_CUSTOMER, ERP_CUSTOMER" +
        					" WHERE ERP_DEAL_CUSTOMER.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE" + 
        					" AND ERP_DEAL_CUSTOMER.CUSTOMER_CODE = '"+sCustomerCode+"'";
      
        rsc = stmtc.executeQuery(SQLCustomer);
       
        
        String SQLCustomerDeal = "";
        String psTotalPrice = "0";
        String lsTotalPrice = "0";
        String psPaymentPrice = "0";
        String lsPaymentprice = "0";
        String psDiscountPrice = "0";
        String lsDiscountPrice = "0";
        String paymentdate = "";
        
       	if(rsc.getRow()>0)
       	{
       		while(rsc.next())
       		{
       			psTotalPrice = rsc.getString("PURCHASE_TOTAL_PRICE");
       			lsTotalPrice = rsc.getString("SALES_TOTAL_PRICE");
           		psPaymentPrice = rsc.getString("PURCHASE_PAYMENT_PRICE"); 
           		lsPaymentprice = rsc.getString("SALES_PAYMENT_PRICE");
           		psDiscountPrice = rsc.getString("PURCHASE_DISCOUNT");
           		lsDiscountPrice = rsc.getString("SALES_DISCOUNT");
           		paymentdate = rsc.getString("PAYMENT_DATE"); 
       		}
       		
       		if(sType == "lS")
        	{
        		//매출거래
        		lsTotalPrice += Integer.parseInt(totalPrice); 
        		lsPaymentprice += Integer.parseInt(paymentPrice);
        		lsDiscountPrice += Integer.parseInt(discountPrice);
        	}
        	else
        	{
        		//매입거래
        		psTotalPrice += Integer.parseInt(totalPrice);
        		psPaymentPrice += Integer.parseInt(paymentPrice);
        		psDiscountPrice += Integer.parseInt(discountPrice);
        	}
       		
       		
       		SQLCustomerDeal =	"UPDATE ERP_DEAL_CUSTOMER  \n" +
                 	"SET 	PURCHASE_TOTAL_PRICE	= '" + psTotalPrice		+ "',\n" +
                 	"   	SALES_TOTAL_PRICE		= '" + lsTotalPrice		+ "',\n" +                 	
                 	"   	PURCHASE_PAYMENT_PRICE	= '" + psPaymentPrice	+ "',\n" +
                 	"   	SALES_PAYMENT_PRICE		= '" + lsPaymentprice		+ "',\n" +
                 	"   	PURCHASE_DISCOUNT		= '" + psDiscountPrice		+ "',\n" +
					"   	SALES_DISCOUNT			= '" + lsDiscountPrice		+ "',\n" +	
					"   	PAYMENT_DATE			= '" + paymentdate			+ "',\n" +	
					"   	ACCOUMULATE_FUND		= '" + 0			+ "'\n" +
                	"WHERE	CUSTOMER_CODE			= '" + sCustomerCode + "'";
       	}
       	else
       	{
       		if(sType == "lS")
        	{
        		//매출거래
        		lsTotalPrice += Integer.parseInt(totalPrice);
        		lsPaymentprice += Integer.parseInt(paymentPrice);
        		lsDiscountPrice += Integer.parseInt(discountPrice);
        	}
        	else
        	{
        		//매입거래
        		psTotalPrice += Integer.parseInt(totalPrice);
        		psPaymentPrice += Integer.parseInt(paymentPrice);
        		psDiscountPrice += Integer.parseInt(discountPrice);
        	}
        	
       		
       		SQLCustomerDeal =	"INSERT INTO ERP_DEAL_CUSTOMER 		    \n(" + 
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
					"'" + sCustomerCode			+ "',\n" +
					"'" + psTotalPrice			+ "',\n" +
                 	"'" + lsTotalPrice		+ "',\n" +                 	
                 	"'" + psPaymentPrice	+ "',\n" +
                 	"'" + lsPaymentprice		+ "',\n" +
                 	"'" + psDiscountPrice		+ "',\n" +
					"'" + lsDiscountPrice		+ "',\n" +	
					"'" + paymentdate			+ "',\n" +	
					"'" + 0						+ "'\n)";
       		
       		//stmt.executeUpdate(SQLCustomer);
       	  
        
    }
    /*
    String SQLCustomer = "SELECT * FROM ERP_DEAL_CUSTOMER, ERP_CUSTOMER" + sWhere;
    if(customerCode != null)
    {
    	sWhere = "\n" + " WHERE ERP_DEAL_CUSTOMER.CUSTOMER_CODE = ERP_CUSTOMER.CORPORATE_CODE" + 
    			 "\n" + " AND ERP_DEAL_CUSTOMER.CUSTOMER_CODE = '"+customerCode+"'";
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
        	 System.out.println(SQLCustomer);
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
        	System.out.println(SQLCustomer);
        }                    
        stmtc.executeUpdate(SQLCustomer);*/
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
