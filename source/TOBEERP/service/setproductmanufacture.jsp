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
    DataSet ds = reqdata.getDataSet("dsmanufacture");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sCode = ds.getRemovedData(i, "MENUFACTURE_CODE").toString();
        SQL = "DELETE FROM ERP_PRODUCT_MENUFACTURE WHERE MENUFACTURE_CODE = '" + sCode + "'";
        stmt.executeUpdate(SQL);
    }

    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	SQL =	"INSERT INTO ERP_PRODUCT_MENUFACTURE (	MENUFACTURE_NAME,	\n" +
        			"           		      		MENUFACTURE_TELNUM,			\n" +
    				"           		      		MENUFACTURE_FAXNUM,			\n" +
					"			               		MENUFACTURE_POSTALCODE,		\n" +
        			"           		      		MENUFACTURE_ADRESS1,		\n" +
    				"           		      		MENUFACTURE_ADRESS2,		\n" +
    				"           		      		MANUFACTURE_AREA,			\n" +
    				"           		      		MENUFACTURE_CODE,			\n" +
					"                 		 		MENUFACTURE_SEQ	)			\n" +
        			"SELECT '"	+ dsGet(ds, i, "MENUFACTURE_NAME") + "'," +
        			"'"			+ dsGet(ds, i, "MENUFACTURE_TELNUM") + "'," +
        			"'"			+ dsGet(ds, i, "MENUFACTURE_FAXNUM") + "'," +
        			"'"			+ dsGet(ds, i, "MENUFACTURE_POSTALCODE") + "'," +
        			"'"			+ dsGet(ds, i, "MENUFACTURE_ADRESS1") + "'," +
        			"'"			+ dsGet(ds, i, "MENUFACTURE_ADRESS2") + "'," +
        			"'"			+ dsGet(ds, i, "MANUFACTURE_AREA") + "'," +
        			"'mf'+  RIGHT('0000' + CAST(ISNULL(MAX(MENUFACTURE_SEQ) + 1, 1) AS NVARCHAR), 4)," +		
					"ISNULL(MAX(MENUFACTURE_SEQ) + 1, 1) FROM ERP_PRODUCT_MENUFACTURE";
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sCode = ds.getSavedData(i, "MENUFACTURE_CODE").toString();
            SQL =	"UPDATE ERP_PRODUCT_MENUFACTURE  \n" +
                 	"SET 	MENUFACTURE_NAME		= '" + dsGet(ds, i, "MENUFACTURE_NAME")			+ "',\n" +
                 	"   	MENUFACTURE_TELNUM		= '" + dsGet(ds, i, "MENUFACTURE_TELNUM")		+ "',\n" +
                 	"   	MENUFACTURE_FAXNUM		= '" + dsGet(ds, i, "MENUFACTURE_FAXNUM")		+ "',\n" +
           			"   	MENUFACTURE_POSTALCODE	= '" + dsGet(ds, i, "MENUFACTURE_POSTALCODE")	+ "',\n" +
                   	"   	MENUFACTURE_ADRESS1		= '" + dsGet(ds, i, "MENUFACTURE_ADRESS1")		+ "',\n" +
            		"   	MENUFACTURE_ADRESS2		= '" + dsGet(ds, i, "MENUFACTURE_ADRESS2")		+ "',\n" +
                    "   	MANUFACTURE_AREA		= '" + dsGet(ds, i, "MANUFACTURE_AREA")			+ "'\n" +
                	"WHERE	MENUFACTURE_CODE		= '" + sCode + "'";
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
