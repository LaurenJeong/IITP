//==============================================================================					
//	Define the Action.				
//==============================================================================					
//==============================================================================					
// Object : nexacro.MessageAction					
// Group : Action					
//==============================================================================					
if (!nexacro.MessageAction)					
{					
	nexacro.MessageAction = function(id, parent)				
	{				
		nexacro.Action.call(this, id, parent);			
		this.addEvent("canrun");			
	};				
					
	nexacro.MessageAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.MessageAction);				
	nexacro.MessageAction.prototype._type_name = "MessageAction";				
					
	//===============================================================				
	// nexacro.MessageAction : Create & Destroy				
	//===============================================================				
	nexacro.MessageAction.prototype.destroy = function()				
	{				
		nexacro.Action.prototype.destroy.call(this);			
	};				
					
	//===============================================================				
	// nexacro.MessageAction : Method				
	//===============================================================				
	nexacro.MessageAction.prototype.run = function()				
	{				
		//TODO			
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			//If the messagetype is confirm		
			if(this.messagetype=="confirm")		
			{		
				//Load Confirm	
				var rtn = confirm(this.message);	
					
				//Load onsuccess or onerror event based on return value	
				if(rtn==true)	
				{	
					this.on_fire_onsuccess();
				}else	
				{	
					this.on_fire_onerror();
				}	
			}		
			//If messagetype is alert		
			else		
			{		
				//Load Alert	
				alert(this.message);	
					
				//Load onsuccess event	
				this.on_fire_onsuccess();	
			}		
		}			
	};				
					
	nexacro.MessageAction.prototype.message = "";				
	nexacro.MessageAction.prototype.set_message = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.message != v) {			
			this.message = v;		
		}			
	};				
					
	nexacro.MessageAction.prototype.messagetype = "";				
	nexacro.MessageAction.prototype.set_messagetype = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.messagetype != v) {			
			this.messagetype = v;		
		}			
	};				
					
	nexacro.MessageAction.prototype.on_fire_canrun = function (/*TODO*/)				
	{				
		if (this.canrun && this.canrun._has_handlers)			
		{			
			var evt = new (this, "canrun"); //TODO		
			return this.canrun._fireCheckEvent(this, evt);		
		}			
		return true;			
	};				
					
}//==============================================================================					
//	Define the Action.				
//==============================================================================					
//==============================================================================					
// Object : nexacro.MessageAction					
// Group : Action					
//==============================================================================					
if (!nexacro.MessageAction)					
{					
	nexacro.MessageAction = function(id, parent)				
	{				
		nexacro.Action.call(this, id, parent);			
		this.addEvent("canrun");			
	};				
					
	nexacro.MessageAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.MessageAction);				
	nexacro.MessageAction.prototype._type_name = "MessageAction";				
					
	//===============================================================				
	// nexacro.MessageAction : Create & Destroy				
	//===============================================================				
	nexacro.MessageAction.prototype.destroy = function()				
	{				
		nexacro.Action.prototype.destroy.call(this);			
	};				
					
	//===============================================================				
	// nexacro.MessageAction : Method				
	//===============================================================				
	nexacro.MessageAction.prototype.run = function()				
	{				
		//TODO			
		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			//If the messagetype is confirm		
			if(this.messagetype=="confirm")		
			{		
				//Load Confirm	
				var rtn = confirm(this.message);	
					
				//Load onsuccess or onerror event based on return value	
				if(rtn==true)	
				{	
					this.on_fire_onsuccess();
				}else	
				{	
					this.on_fire_onerror();
				}	
			}		
			//If messagetype is alert		
			else		
			{		
				//Load Alert	
				alert(this.message);	
					
				//Load onsuccess event	
				this.on_fire_onsuccess();	
			}		
		}			
	};				
					
	nexacro.MessageAction.prototype.message = "";				
	nexacro.MessageAction.prototype.set_message = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.message != v) {			
			this.message = v;		
		}			
	};				
					
	nexacro.MessageAction.prototype.messagetype = "";				
	nexacro.MessageAction.prototype.set_messagetype = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.messagetype != v) {			
			this.messagetype = v;		
		}			
	};				
					
	nexacro.MessageAction.prototype.on_fire_canrun = function (/*TODO*/)				
	{				
		if (this.canrun && this.canrun._has_handlers)			
		{			
			var evt = new nexacro.ActionEventInfo(this, "canrun"); //TODO		
			return this.canrun._fireCheckEvent(this, evt);		
		}			
		return true;			
	};				
					
}