//==============================================================================					
//	Define the Action.				
//==============================================================================					
//==============================================================================					
// Object : nexacro.TranAction					
// Group : Action					
//==============================================================================					
if (!nexacro.TranAction)					
{					
	nexacro.TranAction = function(id, parent)				
	{				
		nexacro.Action.call(this, id, parent);			
		this.addEvent("canrun");			
	};				
					
	nexacro.TranAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.TranAction);				
	nexacro.TranAction.prototype._type_name = "TranAction";				
					
	//===============================================================				
	// nexacro.TranAction : Create & Destroy				
	//===============================================================				
	nexacro.TranAction.prototype.destroy = function()				
	{				
		nexacro.Action.prototype.destroy.call(this);			
	};				
					
	//===============================================================				
	// nexacro.TranAction : Method				
	//===============================================================				
	nexacro.TranAction.prototype.run = function()				
	{				
		//TODO			
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			var objForm;		
					
			//Import the object set as TargetView		
			var objView = this.getTargetView();		
					
			//Import the Param data to use in Transaction		
			var sId = this.serviceid;		
			var sUrl = this.serviceurl;		
			var sInDs = this.inputdatasets;		
			var sOutDs = this.outputdatasets;		
			var sArgs = this.args;		
			var sAsync = this.async;		
			var sCallBack = "fnTranActionCallback";		
					
			//If the TargetView is set as View, not Form		
			if(objView instanceof View)objForm = objView.form;		
			else objForm = this.parent;		
					
			//Set to load Callback function in Action Scope		
			objForm.fnTranActionCallback = this.fnTranActionCallback;		
			objForm.targetTranAction = this;		
					
			//Load Transaction		
			objForm.transaction(sId, sUrl, sInDs, sOutDs, sArgs, sCallBack, sAsync);		
		}			
	};				
					
	nexacro.TranAction.prototype.fnTranActionCallback = function(sId, nErrorCd, sErrorMsg)				
	{				
		//If ErrorCode is larger than -1, load onsuccess event
		if(nErrorCd>-1)			
		{			
			this.targetTranAction.on_fire_onsuccess();		
		}			
		//If ErrorCode is smaller than 0, load onerror event 			
		else			
		{			
			this.targetTranAction.on_fire_onerror();		
		}			
	};				
					
	nexacro.TranAction.prototype.serviceid = "";				
	nexacro.TranAction.prototype.set_serviceid = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.serviceid != v) {			
			this.serviceid = v;		
		}			
	};				
					
	nexacro.TranAction.prototype.serviceurl = "";				
	nexacro.TranAction.prototype.set_serviceurl = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.serviceurl != v) {			
			this.serviceurl = v;		
		}			
	};				
					
	nexacro.TranAction.prototype.inputdatasets = "";				
	nexacro.TranAction.prototype.set_inputdatasets = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.inputdatasets != v) {			
			this.inputdatasets = v;		
		}			
	};				
					
	nexacro.TranAction.prototype.outputdatasets = "";				
	nexacro.TranAction.prototype.set_outputdatasets = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.outputdatasets != v) {			
			this.outputdatasets = v;		
		}			
	};				
					
	nexacro.TranAction.prototype.args = "";				
	nexacro.TranAction.prototype.set_args = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
					
		if (this.args != v) {			
			this.args = v;		
		}			
	};				
					
	nexacro.TranAction.prototype.async = "";				
	nexacro.TranAction.prototype.set_async = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toBoolean(v);			
					
		if(this.async != v)			
		{			
			this.async = v;		
		}			
	};				
					
	nexacro.TranAction.prototype.targetview = "";				
	nexacro.TranAction.prototype.set_targetview = function (v)				
	{				
		// TODO : enter your code here.			
		this.targetview = v;			
	};				
					
	nexacro.TranAction.prototype.on_fire_canrun = function (/*TODO*/)				
	{				
		if (this.canrun && this.canrun._has_handlers)			
		{			
			var evt = new nexacro.ActionEventInfo(this, "canrun"); //TODO		
			return this.canrun._fireCheckEvent(this, evt);		
		}			
		return true;			
	};				
}