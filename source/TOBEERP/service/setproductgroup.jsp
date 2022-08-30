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
    DataSet ds = reqdata.getDataSet("dsgroup");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sSeqCode = ds.getRemovedData(i, "GROUP_CODE").toString();
        SQL = "DELETE FROM ERP_PRODUCT_GROUP WHERE GROUP_CODE = '" + sSeqCode + "'";
        stmt.executeUpdate(SQL);
    }

    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	SQL =	"INSERT INTO ERP_PRODUCT_GROUP(	GROUP_VALUE,	\n" +
        			"			               		ASSET_CODE,		\n" +
        			"           		      		GROUP_STANDARD,	\n" +
    				"           		      		GROUP_CODE,		\n" +
					"                 		 		GROUP_SEQ	)	\n" +
        			"SELECT '"	+ dsGet(ds, i, "GROUP_VALUE") + "'," +
        			"'"			+ dsGet(ds, i, "ASSET_CODE") + "'," +
        			"'"			+ dsGet(ds, i, "GROUP_STANDARD") + "'," +
        			"'"			+ dsGet(ds, i, "ASSET_CODE") + "'+  RIGHT('00' + CAST(ISNULL(MAX(GROUP_SEQ) + 1, 1)AS NVARCHAR), 2)," +	
					"ISNULL(MAX(GROUP_SEQ) + 1, 1) FROM ERP_PRODUCT_GROUP";
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
        	String sSeqCode = ds.getSavedData(i, "GROUP_CODE").toString();
            SQL =	"UPDATE ERP_PRODUCT_GROUP     \n" +
                 	"SET 	GROUP_VALUE			= '" + dsGet(ds, i, "GROUP_VALUE")		+ "',\n" +
                 	"   	ASSET_CODE			= '" + dsGet(ds, i, "ASSET_CODE")		+ "',\n" +
                 	"   	GROUP_STANDARD		= '" + dsGet(ds, i, "GROUP_STANDARD")	+ "'\n" +
                	"WHERE	GROUP_CODE   		= '" + sSeqCode + "'";
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