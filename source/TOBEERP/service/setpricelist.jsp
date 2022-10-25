<%@ page import = "org.apache.commons.logging.*" %>
<%@ page import = "com.nexacro.java.xapi.data.*" %>
<%@ page import = "com.nexacro.java.xapi.tx.*" %>
<%@ page import = "java.util.*" %>
<%@ page import = "java.sql.*" %>
<%@ page import = "java.io.*" %>
<%@ page contentType = "text/xml; charset=UTF-8" %>
<%@ include file="lib/include_const.jsp" %>
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
ResultSet  rs   = null;
Class.forName(jdbcClass);
conn = DriverManager.getConnection(jdbcUrl,dbId,dbPass);
stmt = conn.createStatement();

try {
    /** 5. Processing data: Loading data from the file **/
    /** 5.1 Loading data from the http object **/ 
    /** Obtaining a dataset from the received data **/
    DataSet ds = reqdata.getDataSet("dsprice");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sCode = ds.getRemovedData(i, "CUSTOMER_PRICE_CODE").toString();
        SQL = "DELETE FROM erp_price WHERE CUSTOMER_PRICE_CODE = '" + sCode + "'";
        stmt.executeUpdate(SQL);
    }

    String sCustomerCode = "";
    String sProductCode = "";
    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	sCustomerCode 	= dsGet(ds, i, "CUSTOMER_CODE"); 
        	sProductCode	= dsGet(ds, i, "PRODUCT_CODE");
        	
        	SQL =	"INSERT INTO erp_price (	CUSTOMER_CODE,		\n" +
					"			               	PRODUCT_CODE,		\n" +
        			"           		      	LAST_PRICE,			\n" +
    				"           		      	RECEIVING_PRICE,	\n" +
    				"           		      	WHOLESALE_PRICE,	\n" +
    				"           		      	RETAIL_PRICE,		\n" +
					"           		      	SPECIAL_PRICE1,		\n" +
    				"           		      	SPECIAL_PRICE2,		\n" +
    				"           		      	SPECIAL_PRICE3,		\n" +
    				"           		      	TAX_FREE_CHECK,		\n" +
					"           		      	DISCOUNT_RATE,		\n" +
					"                 		 	TRADING_TYPE,		\n" +
					"                 		 	CUSTOMER_PRICE_CODE,\n" +
					"           		      	PRICE_VERSION		\n)"+ 
        			"SELECT '"	+ sCustomerCode					 	+ "'," +
        			"'"			+ sProductCode						+ "'," +
        			"'"			+ dsGet(ds, i, "LAST_PRICE")		+ "'," +
        			"'"			+ dsGet(ds, i, "RECEIVING_PRICE")	+ "'," +
        			"'"			+ dsGet(ds, i, "WHOLESALE_PRICE")	+ "'," +
        			"'"			+ dsGet(ds, i, "RETAIL_PRICE")		+ "'," +
					"'"			+ dsGet(ds, i, "SPECIAL_PRICE1")	+ "'," +
					"'"			+ dsGet(ds, i, "SPECIAL_PRICE2")	+ "'," +
					"'"			+ dsGet(ds, i, "SPECIAL_PRICE3")	+ "'," +
					"'"			+ dsGet(ds, i, "TAX_FREE_CHECK")	+ "'," +
					"'"			+ dsGet(ds, i, "DISCOUNT_RATE")		+ "'," +
					"'"			+ dsGet(ds, i, "TRADING_TYPE") 		+ "'," +
					//"'" +sCustomerCode+sProductCode +"'+" +"RIGHT('00' + CONVERT(IFNULL(MAX(PRICE_VERSION) + 1, 1),NCHAR), 2)" +"," +
					"CONCAT('" +sCustomerCode+sProductCode +"',RIGHT(CONCAT('00',CONVERT(IFNULL(MAX(PRICE_VERSION) + 1, 1),NCHAR)), 2))" +"," +
					"IFNULL(MAX(PRICE_VERSION) + 1, 1) FROM erp_price WHERE CUSTOMER_CODE='"+sCustomerCode+"' AND  PRODUCT_CODE='"+sProductCode+"'";
					//"'" +sCustomerCode+sProductCode +"'+" +"RIGHT('00' + CAST(ISNULL(MAX(PRICE_VERSION) + 1, 1) AS NVARCHAR), 2)" +"," +
					//"ISNULL(MAX(PRICE_VERSION) + 1, 1) FROM ERP_PRICE WHERE CUSTOMER_CODE='"+sCustomerCode+"' AND  PRODUCT_CODE='"+sProductCode+"'";
        	System.out.println(SQL);
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = ds.getSavedData(i, "CUSTOMER_PRICE_CODE").toString();
            SQL =	"UPDATE erp_price  \n" +
                 	"SET 	CUSTOMER_CODE		= '" + dsGet(ds, i, "CUSTOMER_CODE")		+ "',\n" +
                 	"   	PRODUCT_CODE		= '" + dsGet(ds, i, "PRODUCT_CODE")			+ "',\n" +
                 	"   	LAST_PRICE			= '" + dsGet(ds, i, "LAST_PRICE")			+ "',\n" +
           			"   	RECEIVING_PRICE		= '" + dsGet(ds, i, "RECEIVING_PRICE")		+ "',\n" +
					"   	WHOLESALE_PRICE		= '" + dsGet(ds, i, "WHOLESALE_PRICE")		+ "',\n" +
					"   	RETAIL_PRICE		= '" + dsGet(ds, i, "RETAIL_PRICE")			+ "',\n" +
					"   	SPECIAL_PRICE1		= '" + dsGet(ds, i, "SPECIAL_PRICE1")		+ "',\n" +
					"   	SPECIAL_PRICE2		= '" + dsGet(ds, i, "SPECIAL_PRICE2")		+ "',\n" +
					"   	SPECIAL_PRICE3		= '" + dsGet(ds, i, "SPECIAL_PRICE3")		+ "',\n" +
					"   	TAX_FREE_CHECK		= '" + dsGet(ds, i, "TAX_FREE_CHECK")		+ "',\n" +
					"   	DISCOUNT_RATE		= '" + dsGet(ds, i, "DISCOUNT_RATE")		+ "',\n" +
					"   	TRADING_TYPE		= '" + dsGet(ds, i, "TRADING_TYPE")			+ "'\n" +
                	"WHERE	CUSTOMER_PRICE_CODE	= '" + sCode + "'";
            System.out.println(SQL);
        }                    
        stmt.executeUpdate(SQL);
    }
    
    
    //conn.commit();

    /** 6.2 Setting ErrorCode and ErrorMsg for success **/
    nErrorCode = 0;
    strErrorMsg = "person list saved complete : row count("+ds.getRowCount()+")";
    
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
