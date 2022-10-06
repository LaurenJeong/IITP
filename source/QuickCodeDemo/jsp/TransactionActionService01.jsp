<%@ page language="java" contentType="text/xml; charset=utf-8"%>

<%@ page import="com.nexacro.java.xapi.data.*" %>
<%@ page import="com.nexacro.java.xapi.tx.*" %>
<%@ page import="com.nexacro.java.xapi.data.datatype.*" %>

<%!
public static boolean isNull(String str)
{
    return str == null || str.length() == 0;
}
%>

<%
    String strCharset = "utf-8";
    PlatformData pdata = new PlatformData();
    PlatformRequest platformRequest = new PlatformRequest(request.getInputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
    platformRequest.receiveData();
    PlatformData inPD = platformRequest.getData();

    VariableList    inVariableList  = inPD.getVariableList();
    DataSetList     inDataSetList   = inPD.getDataSetList();
    
    PlatformResponse platformResponse = new PlatformResponse(response.getOutputStream(), PlatformType.CONTENT_TYPE_XML, strCharset);
	PlatformData outPD = new PlatformData();
    VariableList    outVariableList  = new VariableList();
    DataSetList     outDataSetList   = new DataSetList();
    
    String datacnt   = inVariableList.getString("datacnt");
    int nDataCnt = 10;
    
    if (!isNull(datacnt)) {
    	nDataCnt =  Integer.parseInt(datacnt);
    }
		
	DataSet inDataSet = inDataSetList.get("input");
	
	String company		= inDataSet.getString(0, "company");
	String department	= inDataSet.getString(0, "department");
	String name			= inDataSet.getString(0, "name");
	
	System.out.println("company : " + company);
	System.out.println("department : " + department);
	System.out.println("name : " + name);
	
	if (isNull(company))		company = "company";
	if (isNull(department))		department = "department";
	if (isNull(name))			name = "name";
	
   try {

        DataSet outDataSet = new DataSet("output");

        outDataSet.addColumn("company",			DataTypes.STRING, 80);
        outDataSet.addColumn("department",		DataTypes.STRING, 80);
        outDataSet.addColumn("name",			DataTypes.STRING, 80);
        outDataSet.addColumn("position",		DataTypes.STRING, 80);
        outDataSet.addColumn("phone",			DataTypes.STRING, 80);
        outDataSet.addColumn("address",			DataTypes.STRING, 80);
        
        int nRow;

        for(int i = 0; i < nDataCnt; i++) {

            nRow = outDataSet.newRow();

            outDataSet.set(nRow, "company",			company +i);
            outDataSet.set(nRow, "department",		department +i);
            outDataSet.set(nRow, "name",			name +i);
            outDataSet.set(nRow, "position",		"position" +i);
            outDataSet.set(nRow, "phone",			"phone" +i);
            outDataSet.set(nRow, "address",			"address" +i);
        }

        outDataSetList.add(outDataSet);

        outVariableList.add("ErrorCode", 0);
        outVariableList.add("ErrorMsg",  nDataCnt + "건 조회 성공");

    } catch(Exception e) {

        outVariableList.add("ErrorCode", -1);
        outVariableList.add("ErrorMsg",  e.toString());

    } finally {

        outPD.setDataSetList(outDataSetList);
        outPD.setVariableList(outVariableList);
        out.clear();
        out = pageContext.pushBody();
        platformResponse.setData(outPD);
        platformResponse.sendData();
    }
%>
