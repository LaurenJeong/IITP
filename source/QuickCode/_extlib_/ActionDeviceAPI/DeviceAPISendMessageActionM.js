//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.DeviceAPISendMessageActionM		
// Group : Action		
//==============================================================================		
if (!nexacro.DeviceAPISendMessageActionM)		
{		
    nexacro.DeviceAPISendMessageActionM = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);
		this.addEvent("canrun");
    };		
        		
    nexacro.DeviceAPISendMessageActionM.prototype = nexacro._createPrototype(nexacro.Action, nexacro.DeviceAPISendMessageActionM);		
    nexacro.DeviceAPISendMessageActionM.prototype._type_name = "DeviceAPISendMessageActionM";		
	
	//===============================================================		
    // nexacro.DsCopyRowDataAction : 변수선언 부분
    //===============================================================
	nexacro.DeviceAPISendMessageActionM.prototype._LOG_LEVEL		= -1;					// 디버깅 레벨. 설정된 레벨보다 낮은 디버깅 로그는 출력안됨.(-1 : 체크안함) [0:"debug", 1:"info", 2:"warn", 3:"error"]
	nexacro.DeviceAPISendMessageActionM.prototype._sms;
	
	//===============================================================		
    // nexacro.DeviceAPISendMessageActionM : Create & Destroy		
    //===============================================================		
    nexacro.DeviceAPISendMessageActionM.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.DeviceAPISendMessageActionM : Method		
    //===============================================================		
    nexacro.DeviceAPISendMessageActionM.prototype.run = function()		
	{	
        // Sms.sendMessage([strNumber [,strMessage]]);
		var sPhoneNumber = this.phonenumber;
		var sMessage = this.message;
		
        //If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{
			var objForm = this.parent;
			var oSms = this._sms;
			
			if (oSms == undefined)
			{
				oSms = new nexacro.Sms();
				objForm.addChild("sms" + this.id, oSms); 
				this._sms = oSms;
			}
			
			if (this._sms == undefined)
			{
				this.gfnLog("SMS Object를 생성 할 수 없습니다.","info");
				this.on_fire_onerror("error");
				return;
			}
			
 			var ret = oSms.sendMessage(sPhoneNumber,sMessage);
			
			if (ret == false)
			{
				this.on_fire_onerror();
			}
			else
			{
				this.on_fire_onsuccess();
			}
		}
	};
	
	nexacro.DeviceAPISendMessageActionM.prototype.phonenumber = "";
	nexacro.DeviceAPISendMessageActionM.prototype.set_phonenumber = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.phonenumber != v) {
			this.phonenumber = v;
		}
	};
	
	nexacro.DeviceAPISendMessageActionM.prototype.message = "";
	nexacro.DeviceAPISendMessageActionM.prototype.set_message = function (v)
	{
		// TODO : enter your code here.
		v = nexacro._toString(v);
		if (this.message != v) {
			this.message = v;
		}
	};
	
	//===============================================================		
    // nexacro.DeviceAPISendMessageActionM : Event		
    //===============================================================
	nexacro.DeviceAPISendMessageActionM.prototype.on_fire_canrun = function (userdata)
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
	
	nexacro.DeviceAPISendMessageActionM.prototype.on_fire_onsuccess = function (userdata)
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
	  
	nexacro.DeviceAPISendMessageActionM.prototype.on_fire_onerror = function (userdata)
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
    // nexacro.DeviceAPISendMessageActionM : 공통함수(Util)
    //===============================================================
	nexacro.DeviceAPISendMessageActionM.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	};
	
	nexacro.DeviceAPISendMessageActionM.prototype.gfnLog = function(sMsg, sType)
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
    // nexacro.DeviceAPISendMessageActionM : 공통함수 전환부분
    //===============================================================
	
}
