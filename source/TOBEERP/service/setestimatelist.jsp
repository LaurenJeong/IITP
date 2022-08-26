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
ResultSet  rs   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
stmtd = conn.createStatement();
try {
    /** 5. Processing data: Loading data from the file **/
    /** 5.1 Loading data from the http object **/ 
    /** Obtaining a dataset from the received data **/
    DataSet ds = reqdata.getDataSet("dsestimate");
    DataSet dsdetail = reqdata.getDataSet("dsestimatedetail");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    String SQLDetail = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sCode = ds.getRemovedData(i, "ESTIMATE_CODE").toString();
        SQL = "DELETE FROM ERP_ESTIMATE WHERE ESTIMATE_CODE = '" + sCode + "'";
        stmt.executeUpdate(SQL);
        
        SQLDetail = "DELETE FROM ERP_ESTIMATEDETAIL WHERE ESTIMATE_CODE = '" + sCode + "'";
        stmtd.executeUpdate(SQLDetail);
    }

    String sEstimateCode = "";
    
    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);
       
        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	
        	SQL =	"INSERT INTO ERP_ESTIMATE (	ESTIMATE_DATE,		\n" +
					"			               	ESTIMATE_STATUS,		\n" +
        			"           		      	SALESMAN_CODE,			\n" +
    				"           		      	CUSTOMER_CODE,	\n" +
    				"           		      	ESTIMATE_TYPE,	\n" +
    				"           		      	ESTIMATE_TITLE,		\n" +
					"           		      	TAX_TYPE,		\n" +
    				"           		      	EXPIRY_TERM,		\n" +
    				"           		      	PAYMENT_TYPE,		\n" +
    				"           		      	DELIVERTY_DATE,		\n" +
					"           		      	ESTIMATE_ETC,		\n" +
					"                 		 	SEAL_CHECK,		\n" +
					"                 		 	SEAL_IMAGE,\n" +
					"                 		 	DISCOUNT_PRICE,\n" +
					"                 		 	TOTAL_PRICE,\n" +
					"                 		 	TOTAL_AMOUNT,\n" +
					"                 		 	ADDIN_PRICE,\n" +
					"		                 	ESTIMATE_CODE,\n" +		
					"           		      	ESTIMATE_SEQ		\n)"+ 
        			"SELECT '"	+ dsGet(ds, i, "ESTIMATE_DATE") 	+ "'," +
        			"'"			+ dsGet(ds, i, "ESTIMATE_STATUS")		+ "'," +
        			"'"			+ dsGet(ds, i, "SALESMAN_CODE")		+ "'," +
        			"'"			+ dsGet(ds, i, "CUSTOMER_CODE")		+ "'," +
        			"'"			+ dsGet(ds, i, "ESTIMATE_TYPE")		+ "'," +
        			"'"			+ dsGet(ds, i, "ESTIMATE_TITLE")	+ "'," +
					"'"			+ dsGet(ds, i, "TAX_TYPE")	+ "'," +
					"'"			+ dsGet(ds, i, "EXPIRY_TERM")	+ "'," +
					"'"			+ dsGet(ds, i, "PAYMENT_TYPE")	+ "'," +
					"'"			+ dsGet(ds, i, "DELIVERTY_DATE")	+ "'," +
					"'"			+ dsGet(ds, i, "ESTIMATE_ETC")		+ "'," +
					"'"			+ dsGet(ds, i, "SEAL_CHECK") 		+ "'," +
					"'"			+ dsGet(ds, i, "SEAL_IMAGE") 		+ "'," +
					"'"			+ dsGet(ds, i, "DISCOUNT_PRICE") 		+ "'," +
					"'"			+ dsGet(ds, i, "TOTAL_PRICE") 		+ "'," +
					"'"			+ dsGet(ds, i, "TOTAL_AMOUNT") 		+ "'," +
					"'"			+ dsGet(ds, i, "ADDIN_PRICE") 		+ "'," +
        			"'" 		+ dsGet(ds, i, "ESTIMATE_CODE") 		+ "'," +
        			"ISNULL(MAX(ESTIMATE_SEQ) + 1, 0) FROM ERP_ESTIMATE WHERE ESTIMATE_CODE='"+dsGet(ds, i, "ESTIMATE_CODE")+"'";
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = ds.getSavedData(i, "ESTIMATE_CODE").toString();
            SQL =	"UPDATE ERP_ESTIMATE  \n" +
                 	"SET 	ESTIMATE_STATUS		= '" + dsGet(ds, i, "ESTIMATE_STATUS")	+ "',\n" +
                 	"   	CUSTOMER_CODE		= '" + dsGet(ds, i, "CUSTOMER_CODE")	+ "',\n" +
                 	"   	SALESMAN_CODE		= '" + dsGet(ds, i, "SALESMAN_CODE")	+ "',\n" +
                 	"   	ESTIMATE_TYPE		= '" + dsGet(ds, i, "ESTIMATE_TYPE")	+ "',\n" +
                 	"   	ESTIMATE_TITLE		= '" + dsGet(ds, i, "ESTIMATE_TITLE")	+ "',\n" +
					"   	TAX_TYPE			= '" + dsGet(ds, i, "TAX_TYPE")			+ "',\n" +
					"   	EXPIRY_TERM			= '" + dsGet(ds, i, "EXPIRY_TERM")		+ "',\n" +
					"   	PAYMENT_TYPE		= '" + dsGet(ds, i, "PAYMENT_TYPE")		+ "',\n" +
					"   	DELIVERTY_DATE		= '" + dsGet(ds, i, "DELIVERTY_DATE")	+ "',\n" +
					"   	ESTIMATE_ETC		= '" + dsGet(ds, i, "ESTIMATE_ETC")		+ "',\n" +
					"   	SEAL_CHECK			= '" + dsGet(ds, i, "SEAL_CHECK")		+ "',\n" +
					"   	SEAL_IMAGE			= '" + dsGet(ds, i, "SEAL_IMAGE")		+ "',\n" +
					"   	DISCOUNT_PRICE		= '" + dsGet(ds, i, "DISCOUNT_PRICE")	+ "',\n" +
					"   	TOTAL_PRICE			= '" + dsGet(ds, i, "TOTAL_PRICE")	+ "',\n" +
					"   	TOTAL_AMOUNT		= '" + dsGet(ds, i, "TOTAL_AMOUNT")	+ "',\n" +
					"   	ADDIN_PRICE			= '" + dsGet(ds, i, "ADDIN_PRICE")		+ "'\n" +
                	"WHERE	ESTIMATE_CODE		= '" + sCode + "'";
        }
        
        
        stmt.executeUpdate(SQL);        
    }
    
    for( i = 0; i < dsdetail.getRowCount(); i++ )
    {
        int rowType = dsdetail.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	String sCode	= dsGet(dsdetail, i, "ESTIMATE_CODE");
        	
        	SQLDetail =	"INSERT INTO ERP_ESTIMATEDETAIL (	ESTIMATE_CODE,		\n" +
					"			               	PRODUCT_CODE,		\n" +
					"           		      	LAST_PRICE,		\n" +
    				"           		      	DISCOUNT_PRICE,		\n" +
    				"           		      	AMOUNT,		\n" +
    				"           		      	TOTAL_PRICE,		\n" +
    				"           		      	SURTAX_TYPE,		\n" +
					"           		      	ETC,		\n" +
					"           		      	ESTIMATEDETAIL_CODE,		\n" +
					"           		      	SEQ		\n)"+ 
        			"SELECT '"	+ dsGet(dsdetail, i, "ESTIMATE_CODE")		+ "'," +
        			"'"			+ dsGet(dsdetail, i, "PRODUCT_CODE")		+ "'," +
        			"'"			+ dsGet(dsdetail, i, "LAST_PRICE")		+ "'," +
        			"'"			+ dsGet(dsdetail, i, "DISCOUNT_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "AMOUNT")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "TOTAL_PRICE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "SURTAX_TYPE")	+ "'," +
					"'"			+ dsGet(dsdetail, i, "ETC")	+ "'," +
        			"'" 		+sCode +"'+" +"RIGHT('00' + CAST(ISNULL(MAX(SEQ) + 1, 1) AS NVARCHAR), 2)" +"," +
					"ISNULL(MAX(SEQ) + 1, 1) FROM ERP_ESTIMATEDETAIL WHERE ESTIMATE_CODE='"+sCode+"'";
        	
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = dsdetail.getSavedData(i, "ESTIMATEDETAIL_CODE").toString();
        	SQLDetail =	"UPDATE ERP_ESTIMATEDETAIL  \n" +
                 	"SET 	PRODUCT_CODE		= '" + dsGet(dsdetail, i, "PRODUCT_CODE")	+ "',\n" +
                 	"   	LAST_PRICE		= '" + dsGet(dsdetail, i, "LAST_PRICE")	+ "',\n" +
                 	"   	DISCOUNT_PRICE		= '" + dsGet(dsdetail, i, "DISCOUNT_PRICE")	+ "',\n" +
                 	"   	AMOUNT		= '" + dsGet(dsdetail, i, "AMOUNT")	+ "',\n" +
                 	"   	TOTAL_PRICE		= '" + dsGet(dsdetail, i, "TOTAL_PRICE")	+ "',\n" +
					"   	SURTAX_TYPE			= '" + dsGet(dsdetail, i, "SURTAX_TYPE")			+ "',\n" +					
					"   	ETC			= '" + dsGet(dsdetail, i, "ETC")		+ "'\n" +
                	"WHERE	ESTIMATEDETAIL_CODE		= '" + sCode + "'";
            
        }                    
        stmtd.executeUpdate(SQLDetail);
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
