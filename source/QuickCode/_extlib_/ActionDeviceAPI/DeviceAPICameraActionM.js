﻿//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DeviceAPICameraActionM		
// Group : Action		
//==============================================================================		
if (!nexacro.DeviceAPICameraActionM)		
{		
    nexacro.DeviceAPICameraActionM = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DeviceAPICameraActionM.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DeviceAPICameraActionM);		
    nexacro.DeviceAPICameraActionM.prototype._type_name = "DeviceAPICameraActionM";		
	
	//===============================================================		
    // nexacro.DsCopyRowDataAction : 변수선언 부분
    //===============================================================
	nexacro.DeviceAPICameraActionM.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	nexacro.DeviceAPICameraActionM.prototype._camera;
	
	//===============================================================		
    // nexacro.DeviceAPICameraActionM : Create & Destroy		
    //===============================================================		
    nexacro.DeviceAPICameraActionM.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DeviceAPICameraActionM : Method		
    //===============================================================		
    nexacro.DeviceAPICameraActionM.prototype.run = function()		
	{	
        // Camera.takePicture();
		var sGettype = this.returntype;
		var nImageHeight = this.imageheight;
		var nImageWidth = this.imagewidth;
		var bUseGallery = this.savegallery;
		
        //If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			var objForm = this.parent;
			var oCamera = this._camera;
			
			if (oCamera == undefined)
			{
				oCamera = new nexacro.Camera();
				objForm.addChild("Camera" + this.id, oCamera); 
				this._camera = oCamera;
			}
			
			if (this._camera == undefined)
			{
				this.gfnLog("Camera Object를 생성 할 수 없습니다.","info");
				this.on_fire_onerror("error");
				return;
			}
			
			oCamera.set_gettype(sGettype);
			oCamera.set_imageheight(nImageHeight);
			oCamera.set_imagewidth(nImageWidth);
			oCamera.set_usegallery(bUseGallery);
			
			oCamera.addEventHandler("oncapture", this.fnActionCameraOnsuccess, this);	
			oCamera.addEventHandler("onerror", this.fnActionCameraOnerror, this);	
			
 			oCamera.takePicture();
		}
	};	
	
	nexacro.DeviceAPICameraActionM.prototype.set_returntype = function (v)				
	{	
		var returntype_enum = ["imagedata", "url"];
		if (v && returntype_enum.indexOf(v) == -1) {
			return;
		}
		
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.returntype != v) {			
			this.returntype = v;		
		}			
	};
	
	nexacro.DeviceAPICameraActionM.prototype.set_imageheight = function (v)				
	{
		var nNum = nexacro.toNumber(v,0,0,0);
		
		// TODO : enter your code here.
		if (nNum >= 0) {
			this.imageheight = nNum;
		}
	};
	
	nexacro.DeviceAPICameraActionM.prototype.set_imagewidth = function (v)				
	{
		var nNum = nexacro.toNumber(v,0,0,0);
		
		// TODO : enter your code here.
		if (nNum >= 0) {
			this.imagewidth = nNum;
		}
	};
	
	nexacro.DeviceAPICameraActionM.prototype.set_savegallery = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toBoolean(v);
		
		if(this.savegallery != v)
		{
			this.savegallery = v;
		}
	};
	
	//===============================================================		
    // nexacro.DeviceAPICameraActionM : Event		
    //===============================================================
	nexacro.DeviceAPICameraActionM.prototype.on_fire_canrun = function (userdata)
	{
		var event = this.canrun;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionRunEventInfo 생성
		  var evt = new nexacro.ActionRunEventInfo(this, "canrun", userdata); //TODO
		  
		  //true/false 리턴값을 받기 위해 _fireCheckEvent 함수 실행
		  return this.canrun._fireCheckEvent(this, evt);
		}
		return true;
	};
	
	nexacro.DeviceAPICameraActionM.prototype.on_fire_onsuccess = function (userdata)
	{
		var event = this.onsuccess;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionSuccessEventInfo 생성
		  var evt = new nexacro.ActionSuccessEventInfo(this, "onsuccess", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	  
	nexacro.DeviceAPICameraActionM.prototype.on_fire_onerror = function (userdata)
	{
		var event = this.onerror;
		
		//이벤트가 존재하고 사용자가 정의한 이벤트 핸들러 함수가 있을 경우
		if (event && event._has_handlers)
		{
		  //ActionErrorEventInfo 생성
		  var evt = new nexacro.ActionErrorEventInfo(this, "onerror", userdata); //TODO
		  
		  //리턴값이 필요 없으므로 _fireEvent 함수 실행
		  event._fireEvent(this, evt);
		}
	};
	
	//===============================================================		
    // nexacro.DeviceAPICameraActionM : 공통함수(Util)
    //===============================================================
	nexacro.DeviceAPICameraActionM.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DeviceAPICameraActionM.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.DeviceAPICameraActionM : 공통함수 전환부분
    //===============================================================
	nexacro.DeviceAPICameraActionM.prototype.fnActionCameraOnsuccess = function(obj,e)
	{
		if (this.returntype == "url")
		{
			var realpath = e.url.replace("%USERAPP%", "");
			var sUrl = "file://"+ system.convertRealPath("%USERAPP%") + realpath;
			
			this.on_fire_onsuccess(sUrl);
		}
		else
		{
			this.on_fire_onsuccess(e.imagedata);
		}
	}

	nexacro.DeviceAPICameraActionM.prototype.fnActionCameraOnerror = function(obj,e)
	{
		this.on_fire_onerror(e.errormsg);	
	}
}
