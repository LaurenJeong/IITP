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
PlatformData pdata = new PlatformData();

/** 4. Receiving a request from the client **/
// create HttpPlatformRequest for receive data from client
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
    pdata = req.getData();
	
   // VariableList in_varList = pdata.getVariableList();
    //String sVar1 = in_varList.getString("in_var1");
    /** Obtaining a dataset from the received data **/
    DataSet ds = pdata.getDataSet("dsemployee");
	
    /** Saving data as a file with init data **/
    String SQL = "";
    int    i;        
    /******** DELETE ********/
    for( i = 0; i < ds.getRemovedRowCount(); i++ )
    {
        String sEmpCode = ds.getRemovedData(i, "EMPLOYEE_CODE").toString();
        SQL = "DELETE FROM ERP_EMPLOYEE WHERE EMPLOYEE_CODE = '" + sEmpCode + "'";
        stmt.executeUpdate(SQL);
    }

    /******** INSERT, UPDATE ********/
    for( i = 0; i < ds.getRowCount(); i++ )
    {
        int rowType = ds.getRowType(i);

        if( rowType == DataSet.ROW_TYPE_INSERTED )
        {
        	SQL =	"INSERT INTO ERP_EMPLOYEE( EMPLOYEE_NAME,		\n" +
				 	"                 		 SEX,				\n" +
				 	"                 		 DEPARTMENT,		\n" +
				 	"                 		 POSITION,			\n" +
					"                 		 GROUPS,			\n" +
					"                 		 JOIN_DATE,			\n" +
					"                 		 BREAK_DATE,		\n" +
					"                 		 TELNUM,			\n" +
					"                 		 PHONE,				\n" +
					"                 		 POSTAL_CODE,		\n" +
					"                 		 ADRESS1,			\n" +
					"                 		 ADRESS2,			\n" +
					"                 		 MEMO,				\n" +
					"                 		 EMPLOYEE_STATUS,	\n" +
					"                 		 CAREERLIST,	\n" +
					"                 		 EMAIL,	\n" +
					"                 		 PHOTO,	\n" +
					"                 		 EMPLOYEE_CODE			)	\n" +
					"     SELECT '" + dsGet(ds, i, "EMPLOYEE_NAME") + "',\n" +
					"            '" + dsGet(ds, i, "SEX")  				+ "',\n" +
					"            '" + dsGet(ds, i, "DEPARTMENT")  		+ "',\n" +
					"            '" + dsGet(ds, i, "POSITION")  		+ "',\n" +
					"            '" + dsGet(ds, i, "GROUPS")  			+ "',\n" +
					"            '" + dsGet(ds, i, "JOIN_DATE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "BREAK_DATE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "TELNUM")  			+ "',\n" +
					"            '" + dsGet(ds, i, "PHONE")  			+ "',\n" +
					"            '" + dsGet(ds, i, "POSTAL_CODE")  		+ "',\n" +
					"            '" + dsGet(ds, i, "ADRESS1")  			+ "',\n" +
					"            '" + dsGet(ds, i, "ADRESS2")  			+ "',\n" +
					"            '" + dsGet(ds, i, "MEMO")				+ "',\n" +
					"            '" + dsGet(ds, i, "EMPLOYEE_STATUS")   + "',\n" +
					"            '" + dsGet(ds, i, "CAREERLIST")   + "',\n" +
					"            '" + dsGet(ds, i, "EMAIL")   			+ "',\n" +
					"            '" + dsGet(ds, i, "PHOTO")   			+ "',\n" +
					" 			 '" + dsGet(ds, i, "JOIN_DATE") + "'+ RIGHT('00'  + CAST(ISNULL(count(0) + 1, 2) AS NVARCHAR), 2) FROM ERP_EMPLOYEE WHERE JOIN_DATE='"+dsGet(ds, i, "JOIN_DATE") +"'";
          
        }
        else if( rowType == DataSet.ROW_TYPE_UPDATED )
        {
            String sOrgEmpCode = ds.getSavedData(i, "EMPLOYEE_CODE").toString(); 
            SQL =	"UPDATE ERP_EMPLOYEE     \n" +
                 	"SET 	EMPLOYEE_NAME	= '" + dsGet(ds, i, "EMPLOYEE_NAME")	+"',\n" +
					"   	SEX				= '" + dsGet(ds, i, "SEX")					+ "',\n" +
					"   	DEPARTMENT		= '" + dsGet(ds, i, "DEPARTMENT")			+ "',\n" +
					"   	POSITION		= '" + dsGet(ds, i, "POSITION")				+ "',\n" +
					"   	GROUPS			= '" + dsGet(ds, i, "GROUPS")				+ "',\n" +
					"   	JOIN_DATE		= '" + dsGet(ds, i, "JOIN_DATE")			+"',\n" +
					"   	BREAK_DATE		= '" + dsGet(ds, i, "BREAK_DATE")			+ "',\n" +
					"   	TELNUM			= '" + dsGet(ds, i, "TELNUM")				+ "',\n" +
					"   	PHONE			= '" + dsGet(ds, i, "PHONE")				+ "',\n" +
					"   	POSTAL_CODE		= '" + dsGet(ds, i, "POSTAL_CODE")			+ "',\n" +
					"   	ADRESS1			= '" + dsGet(ds, i, "ADRESS1")				+ "',\n" +
					"   	ADRESS2			= '" + dsGet(ds, i, "ADRESS2")				+ "',\n" +
					"   	MEMO			= '" + dsGet(ds, i, "MEMO")					+"',\n" +
					"   	PHOTO			= '" + dsGet(ds, i, "PHOTO")		+"',\n" +
					"   	CAREERLIST		= '" + dsGet(ds, i, "CAREERLIST")		+"',\n" +
					"   	EMPLOYEE_STATUS	= '" + dsGet(ds, i, "EMPLOYEE_STATUS")		+"',\n" +
					"   	EMAIL			= '" + dsGet(ds, i, "EMAIL")		+ "'\n" +                 
                	" WHERE EMPLOYEE_CODE   = '" + sOrgEmpCode + "'";

         // System.out.println(">>> update : "+SQL);
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
