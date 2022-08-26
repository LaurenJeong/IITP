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
ResultSet  rs   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();

try {
    /** 5. Processing data: Loading data from the file **/
    /** 5.1 Loading data from the http object **/ 
    /** Obtaining a dataset from the received data **/
    DataSet ds = reqdata.getDataSet("dsproduct");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sCode = ds.getRemovedData(i, "PRODUCT_CODE").toString();
        SQL = "DELETE FROM ERP_PRODUCT WHERE PRODUCT_CODE = '" + sCode + "'";
        stmt.executeUpdate(SQL);
    }

    String sManufacture = "";
    String sUnitCode = "";
    String sGroupCode = "";
    String sProductCode = "";
    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	sManufacture 	= dsGet(ds, i, "COMPANY_CODE"); 
        	sUnitCode		= dsGet(ds, i, "UNIT");
        	sGroupCode		= dsGet(ds, i, "PRODUCT_GROUPS");
        	
        	SQL =	"INSERT INTO ERP_PRODUCT (	PRODUCT_NAME,		\n" +
        			"           		      	PRODUCT_GROUPS,		\n" +
    				"           		      	ASSET_GROUPS,		\n" +
					"			               	STANDARD,			\n" +
        			"           		      	COLOR,				\n" +
    				"           		      	UNIT,				\n" +
    				"           		      	BARCODE,			\n" +
    				"           		      	COMPANY_CODE,		\n" +
					"           		      	RECEIVING_PRICE,	\n" +
    				"           		      	WHOLESALE_PRICE,	\n" +
					"			               	RETAIL_PRICE,		\n" +
        			"           		      	SPECIAL_PRICE1,		\n" +
    				"           		      	SPECIAL_PRICE2,		\n" +
    				"           		      	SPECIAL_PRICE3,		\n" +
    				"           		      	TAX_FREE_CHECK,		\n" +
					"           		      	DISCOUNT_RATE,		\n" +
					"           		      	BASIC_STOCK_COUNT,	\n" +
					"           		      	NOW_STOCK_COUNT,	\n" +
					"			               	BOX_COUNT,			\n" +
					"           		      	UNIT_COUNT,			\n" +
					"           		      	SAFETY_STOCK_COUNT,	\n" +
					"           		      	PRODUCT_STORAGE_AREA,	\n" +
					"           		      	COUNT_PER_BOX,			\n" +
					"           		      	PRODUCT_CODE,			\n" +
					"                 		 	PRODUCT_SEQ	)			\n" +
        			"SELECT '"	+ dsGet(ds, i, "PRODUCT_NAME") 		+ "'," +
        			"'"			+ sGroupCode						+ "'," +
        			"'"			+ dsGet(ds, i, "ASSET_GROUPS")		+ "'," +
        			"'"			+ dsGet(ds, i, "STANDARD")			+ "'," +
        			"'"			+ dsGet(ds, i, "COLOR")				+ "'," +
        			"'"			+ sUnitCode							+ "'," +
        			"'"			+ dsGet(ds, i, "BARCODE") 			+ "'," +
					"'"			+ sManufacture						+ "'," +
					"'"			+ dsGet(ds, i, "RECEIVING_PRICE")	+ "'," +
					"'"			+ dsGet(ds, i, "WHOLESALE_PRICE")	+ "'," +
					"'"			+ dsGet(ds, i, "RETAIL_PRICE")		+ "'," +
					"'"			+ dsGet(ds, i, "SPECIAL_PRICE1")	+ "'," +
					"'"			+ dsGet(ds, i, "SPECIAL_PRICE2")	+ "'," +
					"'"			+ dsGet(ds, i, "SPECIAL_PRICE3")	+ "'," +
					"'"			+ dsGet(ds, i, "TAX_FREE_CHECK")	+ "'," +
					"'"			+ dsGet(ds, i, "DISCOUNT_RATE")		+ "'," +
					"'"			+ dsGet(ds, i, "BASIC_STOCK_COUNT") + "'," +
					"'"			+ dsGet(ds, i, "NOW_STOCK_COUNT")	+ "'," +
					"'"			+ dsGet(ds, i, "BOX_COUNT")			+ "'," +
					"'"			+ dsGet(ds, i, "UNIT_COUNT")		+ "'," +
					"'"			+ dsGet(ds, i, "SAFETY_STOCK_COUNT")+ "'," +
					"'"			+ dsGet(ds, i, "PRODUCT_STORAGE_AREA")+ "'," +
					"'"			+ dsGet(ds, i, "COUNT_PER_BOX")		+ "'," +
        			"RIGHT('000000000000' + '" +sManufacture+sGroupCode+sUnitCode +"', 12)+" +"RIGHT('000' + CAST(ISNULL(MAX(PRODUCT_SEQ) + 1, 1) AS NVARCHAR), 3)" +"," +
					"ISNULL(MAX(PRODUCT_SEQ) + 1, 1) FROM ERP_PRODUCT";
        	System.out.println(SQL);
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = ds.getSavedData(i, "PRODUCT_CODE").toString();
            SQL =	"UPDATE ERP_PRODUCT  \n" +
                 	"SET 	PRODUCT_NAME		= '" + dsGet(ds, i, "PRODUCT_NAME")			+ "',\n" +
                 	"   	PRODUCT_GROUPS		= '" + dsGet(ds, i, "PRODUCT_GROUPS")		+ "',\n" +
                 	"   	ASSET_GROUPS		= '" + dsGet(ds, i, "ASSET_GROUPS")			+ "',\n" +
           			"   	STANDARD			= '" + dsGet(ds, i, "STANDARD")				+ "',\n" +
                   	"   	COLOR				= '" + dsGet(ds, i, "COLOR")				+ "',\n" +
            		"   	UNIT				= '" + dsGet(ds, i, "UNIT")					+ "',\n" +
                    "   	BARCODE				= '" + dsGet(ds, i, "BARCODE")				+ "',\n" +
                   	"   	COMPANY_CODE		= '" + dsGet(ds, i, "COMPANY_CODE")			+ "',\n" +
					"   	RECEIVING_PRICE		= '" + dsGet(ds, i, "RECEIVING_PRICE")		+ "',\n" +
					"   	WHOLESALE_PRICE		= '" + dsGet(ds, i, "WHOLESALE_PRICE")		+ "',\n" +
					"   	RETAIL_PRICE		= '" + dsGet(ds, i, "RETAIL_PRICE")			+ "',\n" +
					"   	SPECIAL_PRICE1		= '" + dsGet(ds, i, "SPECIAL_PRICE1")		+ "',\n" +
					"   	SPECIAL_PRICE2		= '" + dsGet(ds, i, "SPECIAL_PRICE2")		+ "',\n" +
					"   	SPECIAL_PRICE3		= '" + dsGet(ds, i, "SPECIAL_PRICE3")		+ "',\n" +
					"   	TAX_FREE_CHECK		= '" + dsGet(ds, i, "TAX_FREE_CHECK")		+ "',\n" +
					"   	DISCOUNT_RATE		= '" + dsGet(ds, i, "DISCOUNT_RATE")		+ "',\n" +
					"   	BASIC_STOCK_COUNT	= '" + dsGet(ds, i, "BASIC_STOCK_COUNT")	+ "',\n" +
					"   	NOW_STOCK_COUNT		= '" + dsGet(ds, i, "NOW_STOCK_COUNT")		+ "',\n" +
					"   	BOX_COUNT			= '" + dsGet(ds, i, "BOX_COUNT")			+ "',\n" +
					"   	UNIT_COUNT			= '" + dsGet(ds, i, "UNIT_COUNT")			+ "',\n" +
					"   	SAFETY_STOCK_COUNT	= '" + dsGet(ds, i, "SAFETY_STOCK_COUNT")	+ "',\n" +
					"   	PRODUCT_STORAGE_AREA= '" + dsGet(ds, i, "PRODUCT_STORAGE_AREA")	+ "',\n" +
					"   	COUNT_PER_BOX		= '" + dsGet(ds, i, "COUNT_PER_BOX")		+ "'\n" +
                	"WHERE	PRODUCT_CODE		= '" + sCode + "'";
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
