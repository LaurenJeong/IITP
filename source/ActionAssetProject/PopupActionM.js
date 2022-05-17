//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================
// Object : nexacro.PopupActionM
// Group : Action
//==============================================================================
if (!nexacro.PopupActionM)
{
	nexacro.PopupActionM = function(id, parent)
	{
		nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
	};
	
	nexacro.PopupActionM.prototype = nexacro._createPrototype(nexacro.Action, nexacro.PopupActionM);
	nexacro.PopupActionM.prototype._type_name = "PopupActionM";
	
	//===============================================================		
    // nexacro.PopupActionM : 변수선언 부분
    //===============================================================
	nexacro.PopupActionM.prototype._POPUP_CALLBACK = "fnPopupActionCallback";		// callback함수
	
	//===============================================================
	// nexacro.PopupActionM : Create & Destroy
	//===============================================================
	nexacro.PopupActionM.prototype.destroy = function()
	{
		nexacro.Action.prototype.destroy.call(this);
	};
	
	//===============================================================
	// nexacro.PopupActionM : Method
	//===============================================================
	nexacro.PopupActionM.prototype.run = function()
	{
		//TODO
		var objForm;
		
		//TargetView로 설정된 오브젝트 가져오기
		var objView = this.getTargetView();
		
		//팝업 호출시 사용할 Param정보 가져오기
		var sPopupId = this.popupid;
		var sFormUrl = this.formurl;
		var sTitle = this.title;
		var sPopupStyle = this.popupstyle;
		var nLeft = this.popupleft;
		var nTop = this.popuptop;
		var nWidth = this.popupwidth;
		var nHeight = this.popupheight;
		var objArgs = this._args;
		
		//canrun 이벤트의 리턴값이 false가 아닐경우
		if(this.on_fire_canrun("userdata")!=false)
		{
			//TargetView가 Form이 아닌 View로 설정되었을 경우
			if(objView)objForm = objView.form;
			else objForm = this.parent;
			
			//Action Scope에 있는 CallBack 함수가 호출되도록 설정
			objForm.fnPopupActionCallback = this.fnPopupActionCallback;
			objForm.targetPopupAction = this;
			
			if (this.gfnIsNull(objArgs)) {
				objArgs = {};
			}
			
			objArgs._PUPUP_STYLE = sPopupStyle;
			
			// 팝업 호출
			this.gfnOpenPopupM(sPopupStyle, sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, this._POPUP_CALLBACK);
		}
	};
	
	nexacro.PopupActionM.prototype.formurl = "";
	nexacro.PopupActionM.prototype.set_formurl = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.formurl != v) {
			this.formurl = v;
		}
	};
	
	nexacro.PopupActionM.prototype.popupid = "";
	nexacro.PopupActionM.prototype.set_popupid = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.popupid != v) {
			this.popupid = v;
		}
	};
	
	nexacro.PopupActionM.prototype.title = "";
	nexacro.PopupActionM.prototype.set_title = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.title != v) {
			this.title = v;
		}
	};
	
	nexacro.PopupActionM.prototype.popupstyle = "";
	nexacro.PopupActionM.prototype.set_popupstyle = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.popupstyle != v) {
			this.popupstyle = v;
		}
	};
	
	nexacro.PopupActionM.prototype.popupleft = "";
	nexacro.PopupActionM.prototype.set_popupleft = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popupleft != v) {
			this.popupleft = v;
		}
	};
	
	nexacro.PopupActionM.prototype.popuptop = "";
	nexacro.PopupActionM.prototype.set_popuptop = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popuptop != v) {
			this.popuptop = v;
		}
	};
	
	nexacro.PopupActionM.prototype.popupwidth = "";
	nexacro.PopupActionM.prototype.set_popupwidth = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popupwidth != v) {
			this.popupwidth = v;
		}
	};
	
	nexacro.PopupActionM.prototype.popupheight = "";
	nexacro.PopupActionM.prototype.set_popupheight = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._parseInt(v);
		if (this.popupheight != v) {
			this.popupheight = v;
		}
	};
		
	nexacro.PopupActionM.prototype.args = "";
	nexacro.PopupActionM.prototype._args;
	nexacro.PopupActionM.prototype.set_args = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.args != v) {
			this.args = v;
			
			if(this.gfnIsNull(this.args)==false)
			{
				this._args = JSON.parse(this.args);
			}else
			{
				this._args = null;
			}
		}
	};
	
	//===============================================================		
    // nexacro.PopupActionM : Event		
    //===============================================================
	nexacro.PopupActionM.prototype.on_fire_canrun = function (userdata)
	{
		if (this.canrun && this.canrun._has_handlers)
		{
			var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
			return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
		
	};
	
	nexacro.PopupActionM.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	nexacro.PopupActionM.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		if (event && event._has_handlers)
		{
			var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
			event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.PopupActionM : 공통함수(Util)
    //===============================================================
	nexacro.PopupActionM.prototype.gfnIsNull = function (Val)
	{
		if (new String(Val).valueOf() == "undefined") return true;
		if (Val == null) return true;
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;
		if (Val.length == 0) return true;
		
		return false;
	};
	
	nexacro.PopupActionM.prototype.gfnLog = function(sMsg, sType)
	{
		var arrLogLevel = ["debug","info","warn","error"];
	
		if(sType == undefined)	sType = "debug";
		var nLvl = arrLogLevel.indexOf(sType);
		
		if (nLvl < this._LOG_LEVEL)		return;
		
		if (system.navigatorname == "nexacro DesignMode"
			|| system.navigatorname == "nexacro") {
			if (sMsg instanceof Object) {
				for(var x in sMsg){
					trace("[" + sType + "] " + this.name + " > " + x + " : " + sMsg[x]);
				}
			} else {
				trace("[" + sType + "] " + this.name + " > " + sMsg);
			}
		} else {
			console.log("[" + sType + "] " + this.name + " > " + sMsg);
		}
	};
	
	//===============================================================		
    // nexacro.PopupActionM : 공통함수 전환부분
    //===============================================================
	nexacro.PopupActionM.prototype.gfnOpenPopupM = function (sPopupStyle, sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, sCallback)
	{
		//Modal 팝업으로 사용할 ChildFrame 생성
		var objChildFrame = new ChildFrame();
		
		var objApp = nexacro.getApplication();
		
		//부모 Frame 정보 가져오기
		var objOwnerFrame = objForm.getOwnerFrame();
		
		var sOpenAlignType = "";
		
		var bAutoSize = false;
		
		//
		if (this.gfnIsNull(nLeft))nLeft = -1;
		
		if (this.gfnIsNull(nTop))nTop = -1;
		
		if (this.gfnIsNull(nWidth)) nWidth = -1;
		
		if (this.gfnIsNull(nHeight)) nHeight = -1;
		
		if (nLeft == -1 && nTop == -1 && nWidth == -1 && nHeight == -1) 	//l,t,w,h 모두 기입하지 않으면 full
		{
			sModalSize = "full";
			if (nWidth == -1 || nWidth > nexacro.getApplication().mainframe.width)
			{	
				nWidth = nexacro.getApplication().mainframe.width;
			}
			
			if (nHeight == -1 || nHeight > nexacro.getApplication().mainframe.height)
			{
				nHeight = nexacro.getApplication().mainframe.height;
			}            
		}
		else 
		{
			bAutoSize = true;
			sModalSize = "center";
		}
		
		if(nLeft == -1 && nTop == -1) 
		{		
			sOpenAlignType = "center middle";
			if (system.navigatorname == "nexacro") {
				var curX = objApp.mainframe.left;
				var curY = objApp.mainframe.top;
			}else{
				var curX = window.screenLeft;
				var curY = window.screenTop;
			}
			
			nLeft   =  curX + (objApp.mainframe.width / 2) - Math.round(nWidth / 2);
			nTop    = curY + (objApp.mainframe.height / 2) - Math.round(nHeight / 2) ;		
			
		}else{
			nLeft   =  this.getOffsetLeft() + nLeft;
			nTop   =  this.getOffsetTop() + nTop;
		}
			
		//this.gfnLog("nLeft : " + nLeft + " nTop : " + nTop + " nWidth : " + nWidth + " nHeight : " + nHeight);
		
		var objParentFrame = objForm.getOwnerFrame();

		if(sPopupStyle == "modeless")
		{
			var sOpenStyle= "showtitlebar=true showstatusbar=false showontaskbar=true showcascadetitletext=false resizable=true autosize=false titletext="+sTitle;
			var arrPopFrame = nexacro.getPopupFrames();

			if (arrPopFrame[sPopupId]) {	
				if (system.navigatorname == "nexacro") {
					arrPopFrame[sPopupId].setFocus();
				} else {	
					arrPopFrame[sPopupId]._getWindowHandle().focus();
				}
			}
			else {
				nexacro.open(sPopupId, sFormUrl, objParentFrame, objArgs, sOpenStyle, nLeft, nTop, nWidth, nHeight, objForm);
			}
		}
		else
		{
			var newChild = new nexacro.ChildFrame;		
			newChild.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sFormUrl);
			
			newChild.set_dragmovetype("none");
			newChild.set_showtitlebar(false);	//titlebar는 안보임
			newChild.set_autosize(bAutoSize);	
			newChild.set_resizable(false);		//resizable 안됨
			if(!this.gfnIsNull(sTitle)) newChild.set_titletext(sTitle);
			newChild.set_showstatusbar(false);    //statusbar는 안보임
			newChild.set_openalign(sOpenAlignType);
			
			newChild.showModal(objOwnerFrame, objArgs, objForm, sCallback, true);
		}
	};
	
	nexacro.PopupActionM.prototype.fnPopupActionCallback = function(sId, sParam)
	{
		this.targetPopupAction.on_fire_onsuccess(sParam);
	};
}