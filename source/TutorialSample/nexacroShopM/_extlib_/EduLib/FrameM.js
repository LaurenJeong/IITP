var pForm  = nexacro.Form.prototype;


pForm.gfn_callMenuM = function(sMenuId, objArg)
{
	var objApp  = nexacro.getApplication();
	
	var nFRow = objApp.gdsMenu.findRow("MENU_CD",sMenuId);
	
	if (nFRow < 0)		return;
	
	var sMenuNm		= objApp.gdsMenu.getColumn(nFRow, "MENU_NM");
	var sPgmPath	= objApp.gdsMenu.getColumn(nFRow, "PGM_PATH");
	var sPgmId		= objApp.gdsMenu.getColumn(nFRow, "PGM_ID");
	var sPageUrl	= sPgmPath + "::" + sPgmId;
	
	if (this.gfn_isNull(sPgmPath)|| this.gfn_isNull(sPgmId))		return;
	
	var aArgs 	= this.gfn_isNull(objArg) ? "" : objArg;   //넘어온 arguments
	
	var oMenuArg = {};
	oMenuArg["menuid"] = sMenuId;
	oMenuArg["oArgs"] = aArgs;
	
	var pThis = this.objApp.gvFrmAll;
	
    pThis.divMain.set_visible(false);
    pThis.divCenter.set_visible(true);

    pThis.divCenter.form.vscrollbar.set_pos(0);
	pThis.divTop.form.staTopTitle.set_text(sMenuNm);
    pThis.divCenter.form.divWork.set_url(sPageUrl);
    pThis.fnAction("MENU", false);   
	
    pThis.fnAction("HISTORY", oMenuArg);
    
    pThis.arguments = [];
	pThis.arguments["menuid"] = sMenuId;
    pThis.arguments["oArgs"] = aArgs;
};

//화면간 파라미터 반환 함수
pForm.gfn_menuGetParamsM = function()
{
	var oRtn = "";
    var objApp  = nexacro.getApplication();
	
	try 
    {	
        if (this.parent instanceof nexacro.ChildFrame)
        {
            oRtn = this.getOwnerFrame(); 
        }
        else
        {
            oRtn = objApp.gvFrmAll.arguments["oArgs"]; 
        }

	}
	catch(e)
    {
    
		trace(" 파라미터가 선언되지 않았습니다.");
	}
	
	return oRtn;
};