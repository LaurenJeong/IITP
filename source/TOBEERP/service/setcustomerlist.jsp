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
    DataSet ds = reqdata.getDataSet("dscustomer");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sCustomerCode = ds.getRemovedData(i, "CORPORATE_CODE").toString();
        String sCustomerName = ds.getRemovedData(i, "CORPORATE_NAME").toString();
        //SQL = "DELETE FROM ERP_CUSTOMER WHERE CORPORATE_CODE = '" + sCustomerCode + "'";
        SQL = "UPDATE ERP_CUSTOMER SET DEAL_STATUS = 's3' WHERE CORPORATE_CODE = '" + sCustomerCode + "'";
        stmt.executeUpdate(SQL);
    }

    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	SQL =	"INSERT INTO ERP_CUSTOMER( BUSINESS_LICENSE_NUM,		\n" +
				 	"                 		 CORPORATE_NAME,				\n" +
				 	"                 		 ESTABLISHMENT_NUM,				\n" +
					"                 		 CORPORATE_TYPE,				\n" +
					"                 		 REPRESENTATIVE_NAME,			\n" +
					"                 		 REPRESENTATIVE_SOCIAL_NUM,		\n" +
					"                 		 BUSINESS_CONDITION,			\n" +
					"                 		 BUSINESS_TYPE,					\n" +
					"                 		 CORPORATE_AREA,				\n" +
					"                 		 STAFF_NAME,					\n" +
					"                 		 STAFF_TELNUM,					\n" +
					"                 		 CORPORATE_EMAIL,				\n" +
					"                 		 CORPORATE_HOMEPAGE,			\n" +
					"                 		 CORPORATE_TELNUM,	\n" +
					"                 		 CORPORATE_FAXNUM,	\n" +
					"                 		 CORPORATE_POSTAL_CODE,			\n" +
					"                 		 CORPORATE_ADRESS1,		\n" +
					"                 		 CORPORATE_ADRESS2,			\n" +
					"                 		 SALESPERSON_CODE,				\n" +
					"                 		 UNIT_PRICE_CODE,		\n" +
					"                 		 SALES_STATUS_CODE,			\n" +
					"                 		 ORDER_PASSWORD,			\n" +
					"                 		 DEAL_START_DATE,				\n" +
					"                 		 DEAL_FINAL_DATE,		\n" +
					"                 		 PAYMENT_DATE,	\n" +
					"                 		 LOAN_LIMIT,	\n" +
					"                 		 UNCOLLECTED_AMOUNT,			\n" +
					"                 		 UNPAID_AMOUNT,		\n" +
					"                 		 ACCOUMULATE_FUND,			\n" +
					"                 		 ADD_TAX_RATE,				\n" +
					"                 		 DISCOUNT_EXTRA_RATE,		\n" +
					"                 		 ETC1,			\n" +
					"                 		 ETC2,			\n" +
					"                 		 CORPORATE_CODE,				\n" +
					"                 		 UNIT_DISPLAY,		\n" +
					"                 		 INIT_ACCOUMULATE_FUND,	\n" +
					"                 		 DEAL_STATUS			)	\n" +
					"     VALUES('" + dsGet(ds, i, "BUSINESS_LICENSE_NUM") + "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_NAME") + "',\n" +
					"            '" + dsGet(ds, i, "ESTABLISHMENT_NUM")  				+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_TYPE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "REPRESENTATIVE_NAME")  		+ "',\n" +
					"            '" + dsGet(ds, i, "REPRESENTATIVE_SOCIAL_NUM")  			+ "',\n" +
					"            '" + dsGet(ds, i, "BUSINESS_CONDITION")  		+ "',\n" +
					"            '" + dsGet(ds, i, "BUSINESS_TYPE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_AREA")  			+ "',\n" +
					"            '" + dsGet(ds, i, "STAFF_NAME")  			+ "',\n" +
					"            '" + dsGet(ds, i, "STAFF_TELNUM")  		+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_EMAIL") + "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_HOMEPAGE")  				+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_TELNUM")  		+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_FAXNUM")  		+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_POSTAL_CODE")  			+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_ADRESS1")  		+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_ADRESS2")  		+ "',\n" +
					"            '" + dsGet(ds, i, "SALESPERSON_CODE")  			+ "',\n" +
					"            '" + dsGet(ds, i, "UNIT_PRICE_CODE")  			+ "',\n" +
					"            '" + dsGet(ds, i, "SALES_STATUS_CODE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "ORDER_PASSWORD") + "',\n" +
					"            '" + dsGet(ds, i, "DEAL_START_DATE")  				+ "',\n" +
					"            '" + dsGet(ds, i, "DEAL_FINAL_DATE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "PAYMENT_DATE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "LOAN_LIMIT")  			+ "',\n" +
					"            '" + dsGet(ds, i, "UNCOLLECTED_AMOUNT")  		+ "',\n" +
					"            '" + dsGet(ds, i, "UNPAID_AMOUNT")  		+ "',\n" +
					"            '" + dsGet(ds, i, "ACCOUMULATE_FUND")  			+ "',\n" +
					"            '" + dsGet(ds, i, "ADD_TAX_RATE")  			+ "',\n" +
					"            '" + dsGet(ds, i, "DISCOUNT_EXTRA_RATE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "ETC1")  			+ "',\n" +
					"            '" + dsGet(ds, i, "ETC2")  			+ "',\n" +
					"            '" + dsGet(ds, i, "CORPORATE_CODE")				+ "',\n" +
					"            '" + dsGet(ds, i, "UNIT_DISPLAY") 	+ "',\n" +
					"            '" + dsGet(ds, i, "INIT_ACCOUMULATE_FUND")   + "',\n" +
					"            '" + dsGet(ds, i, "DEAL_STATUS")	+ "')  ";
           
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCustomerCode = ds.getSavedData(i, "CORPORATE_CODE").toString();
            String sCustomerName = ds.getSavedData(i, "CORPORATE_NAME").toString();
            SQL =	"UPDATE ERP_CUSTOMER     \n" +
                 	"SET 	BUSINESS_LICENSE_NUM		= '" + dsGet(ds, i, "BUSINESS_LICENSE_NUM")		+ "',\n" +
					"   	CORPORATE_NAME				= '" + dsGet(ds, i, "CORPORATE_NAME")			+ "',\n" +
					"   	ESTABLISHMENT_NUM			= '" + dsGet(ds, i, "ESTABLISHMENT_NUM")		+ "',\n" +
					"   	CORPORATE_TYPE				= '" + dsGet(ds, i, "CORPORATE_TYPE")			+ "',\n" +
					"   	REPRESENTATIVE_NAME			= '" + dsGet(ds, i, "REPRESENTATIVE_NAME")		+ "',\n" +
					"   	REPRESENTATIVE_SOCIAL_NUM	= '" + dsGet(ds, i, "REPRESENTATIVE_SOCIAL_NUM")+ "',\n" +
					"   	BUSINESS_CONDITION			= '" + dsGet(ds, i, "BUSINESS_CONDITION")		+ "',\n" +
					"   	BUSINESS_TYPE				= '" + dsGet(ds, i, "BUSINESS_TYPE")			+ "',\n" +
					"   	CORPORATE_AREA				= '" + dsGet(ds, i, "CORPORATE_AREA")			+ "',\n" +
					"   	STAFF_NAME					= '" + dsGet(ds, i, "STAFF_NAME")				+ "',\n" +
					"   	STAFF_TELNUM				= '" + dsGet(ds, i, "STAFF_TELNUM")				+ "',\n" +
					"   	CORPORATE_EMAIL				= '" + dsGet(ds, i, "CORPORATE_EMAIL")			+ "',\n" +
					"   	CORPORATE_HOMEPAGE			= '" + dsGet(ds, i, "CORPORATE_HOMEPAGE")		+ "',\n" +
					"   	CORPORATE_TELNUM			= '" + dsGet(ds, i, "CORPORATE_TELNUM")			+ "',\n" +
					"   	CORPORATE_FAXNUM			= '" + dsGet(ds, i, "CORPORATE_FAXNUM")			+ "',\n" +
					"   	CORPORATE_POSTAL_CODE		= '" + dsGet(ds, i, "CORPORATE_POSTAL_CODE")	+ "',\n" +
					"   	CORPORATE_ADRESS1			= '" + dsGet(ds, i, "CORPORATE_ADRESS1")		+ "',\n" +
					"   	CORPORATE_ADRESS2			= '" + dsGet(ds, i, "CORPORATE_ADRESS2")		+ "',\n" +
					"   	SALESPERSON_CODE			= '" + dsGet(ds, i, "SALESPERSON_CODE")			+ "',\n" +
					"   	UNIT_PRICE_CODE				= '" + dsGet(ds, i, "UNIT_PRICE_CODE")			+ "',\n" +
					"   	SALES_STATUS_CODE			= '" + dsGet(ds, i, "SALES_STATUS_CODE")		+ "',\n" +
					"   	ORDER_PASSWORD				= '" + dsGet(ds, i, "ORDER_PASSWORD")			+ "',\n" +
					"   	DEAL_START_DATE				= '" + dsGet(ds, i, "DEAL_START_DATE")			+ "',\n" +
					"   	DEAL_FINAL_DATE				= '" + dsGet(ds, i, "DEAL_FINAL_DATE")			+ "',\n" +
					"   	PAYMENT_DATE				= '" + dsGet(ds, i, "PAYMENT_DATE")				+ "',\n" +
					"   	LOAN_LIMIT					= '" + dsGet(ds, i, "LOAN_LIMIT")				+ "',\n" +
					"   	UNCOLLECTED_AMOUNT			= '" + dsGet(ds, i, "UNCOLLECTED_AMOUNT")		+ "',\n" +
					"   	UNPAID_AMOUNT				= '" + dsGet(ds, i, "UNPAID_AMOUNT")			+ "',\n" +
					"   	ACCOUMULATE_FUND			= '" + dsGet(ds, i, "ACCOUMULATE_FUND")			+ "',\n" +
					"   	ADD_TAX_RATE				= '" + dsGet(ds, i, "ADD_TAX_RATE")				+ "',\n" +
					"   	DISCOUNT_EXTRA_RATE			= '" + dsGet(ds, i, "DISCOUNT_EXTRA_RATE")		+ "',\n" +
					"   	ETC1						= '" + dsGet(ds, i, "ETC1")						+ "',\n" +
					"   	ETC2						= '" + dsGet(ds, i, "ETC2")						+ "',\n" +
					"   	CORPORATE_CODE				= '" + dsGet(ds, i, "CORPORATE_CODE")			+ "',\n" +    
					"   	UNIT_DISPLAY				= '" + dsGet(ds, i, "UNIT_DISPLAY")				+ "',\n" +
					"   	INIT_ACCOUMULATE_FUND		= '" + dsGet(ds, i, "INIT_ACCOUMULATE_FUND")	+ "',\n" +
					"   	DEAL_STATUS					= '" + dsGet(ds, i, "DEAL_STATUS")				+ "'\n" +  
                	" WHERE CORPORATE_CODE   			= '" + sCustomerCode + "'";

         System.out.println(">>> update : "+SQL);
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
