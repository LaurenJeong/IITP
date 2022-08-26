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
PlatformData pdata = new PlatformData();
VariableList varList = reqdata.getVariableList();
String dbUrl  = varList.getString("argDB");
String strDate  = varList.getString("argDate");
String strType  = varList.getString("argType");
String strCustomer  = varList.getString("argCustomer");


/** 6.1 Processing ErrorCode and ErrorMsg **/
int nErrorCode = 0;
String strErrorMsg = "START";

/******* JDBC Connection *******/
Connection conn = null;
Statement  stmt = null;
Statement  stmtin = null;
ResultSet  rs   = null;
ResultSet  rsin   = null;
Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
conn = DriverManager.getConnection("jdbc:sqlserver://"+dbUrl+";databaseName=TESTDB;","test","tobesoft");
stmt = conn.createStatement();
stmtin = conn.createStatement();
try {
    /** 5. Processing data: Loading data from the file **/
    /** 5.1 Loading data from the http object **/ 
    /** Obtaining a dataset from the received data **/    
    /** Saving data as a file with init data **/
    
    String SQLCode = "SELECT RIGHT('00' + CAST(ISNULL(MAX(ESTIMATE_SEQ) + 1, 1) AS NVARCHAR), 2) AS TEMP_SEQ, ISNULL(MAX(ESTIMATE_SEQ) + 1, 1) AS ESTIMATE_SEQ  FROM ERP_ESTIMATE WHERE CUSTOMER_CODE='"+strCustomer+"' AND  ESTIMATE_DATE='"+strDate+"' AND  ESTIMATE_TYPE='"+strType+"'";
    rs = stmt.executeQuery(SQLCode);
    
    DataSet ds = new DataSet("dscode");
    ds.addColumn("code",DataTypes.STRING, 256);
    ds.addColumn("seq",DataTypes.STRING, 256);
    
    String sEstimateCode = "";
    String sEstimateSeq = "";
    int row = 0;
    String sCode = "";
    while(rs.next())
   {
    	sEstimateCode = strDate+strType+strCustomer +rs.getString("TEMP_SEQ");
    	sEstimateSeq = rs.getString("ESTIMATE_SEQ");
        row = ds.newRow();
        ds.set(row, "code", sEstimateCode); 
        ds.set(row, "seq", sEstimateSeq);
        
    }
    
    System.out.println("sEstimateSeq" + sEstimateCode);
    String SQL =	"INSERT INTO ERP_ESTIMATE(	ESTIMATE_CODE,		\n" +
					"           		      	ESTIMATE_SEQ		\n)"+ 
					"VALUES( '"				+ sEstimateCode		+ "'," +
					"'"						+ sEstimateSeq		+ "')" ;
    
      
    stmtin.executeUpdate(SQL);
 
    
    
    //conn.commit();

    /** 6.2 Setting ErrorCode and ErrorMsg for success **/
     pdata.addDataSet(ds);
 	
     nErrorCode = 0;
     strErrorMsg = "SUCC";
    
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
