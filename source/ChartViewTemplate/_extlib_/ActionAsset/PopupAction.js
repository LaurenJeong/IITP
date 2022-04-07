//==============================================================================					
//	Define the Action.				
//==============================================================================					
//==============================================================================					
// Object : nexacro.PopupAction					
// Group : Action					
//==============================================================================					
if (!nexacro.PopupAction)					
{					
	nexacro.PopupAction = function(id, parent)				
	{				
		nexacro.Action.call(this, id, parent);			
		this.addEvent("canrun");			
	};				
					
	nexacro.PopupAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.PopupAction);				
	nexacro.PopupAction.prototype._type_name = "PopupAction";				
					
	//===============================================================				
	// nexacro.PopupAction : Create & Destroy				
	//===============================================================				
	nexacro.PopupAction.prototype.destroy = function()				
	{				
		nexacro.Action.prototype.destroy.call(this);			
	};				
					
	//===============================================================				
	// nexacro.PopupAction : Method				
	//===============================================================				
	nexacro.PopupAction.prototype.run = function()				
	{				
		//TODO			
		var objForm;			
					
		//Import the object set as TargetView			
		var objView = this.getTargetView();			
					
		//Import Param data to use when loading pop-up			
		var sPopupId = this.popupid;			
		var sFormUrl = this.formurl;			
		var sTitle = this.title;			
		var sPopupStyle = this.popupstyle;			
		var nLeft = this.popupleft;			
		var nTop = this.popuptop;			
		var nWidth = this.popupwidth;
		var nHeight = this.popupheight;			
		var objArgs = this._args;			

		//If the canrun event return value is not false			
		if(this.on_fire_canrun()!=false)			
		{			
			//If the TargetView is set as View, not Form		
			if(objView)objForm = objView.form;		
			else objForm = this.parent;		
					
			//Set to load Callback function in Action Scope		
			objForm.fnPopupActionCallback = this.fnPopupActionCallback;		
			objForm.targetPopupAction = this;		
					
			//Load Modeless Pop-up		
			if(sPopupStyle=="modeless")		
			{		
				this.gfnModeless(sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, "fnPopupActionCallback");	
			}		
			//Load Modal Pop-up		
			else		
			{		
				this.gfnShowModal(sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, "fnPopupActionCallback");	
			}		
		}			
	};				
					
	nexacro.PopupAction.prototype.gfnShowModal = function (sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, sCallback)				
	{				
		//Create Childframe to use as Modal Pop-up			
		var objChildFrame = new ChildFrame();			
					
		//Import Parent Frame Information			
		var objOwnerFrame = objForm.getOwnerFrame();			
					
		var sOpenAlignType = "";			
					
		//			
		if (this.gfnIsNull(nLeft))nLeft = 0;			
					
		if (this.gfnIsNull(nTop))nTop = 0;			
					
		if (this.gfnIsNull(nWidth)) nWidth = 400;			
					
		if (this.gfnIsNull(nHeight)) nHeight = 300;			
					
		if(nLeft==-1)sOpenAlignType = "center ";			
					
		if(nTop==-1)sOpenAlignType += "middle";			
					
		objChildFrame.init(sPopupId, nLeft, nTop, nWidth, nHeight, null, null, sFormUrl);			
		objChildFrame.set_openalign(sOpenAlignType);			
					
		objChildFrame.showModal(objOwnerFrame, objArgs, objForm, sCallback, true);			
	};				
					
	nexacro.PopupAction.prototype.gfnModeless = function(sPopupId, sTitle, sFormUrl, nLeft, nTop, nWidth, nHeight, objArgs, objForm, sCallback)				
	{				
		var objOwnerFrame = objForm.getOwnerFrame();			
					
		if (this.gfnIsNull(nLeft))nLeft = 0;			
					
		if (this.gfnIsNull(nTop))nTop = 0;			
					
		if (this.gfnIsNull(nWidth)||nWidth==-1) nWidth = 400;			
					
		if (this.gfnIsNull(nHeight)||nHeight==-1) nHeight = 300;			
					
		if(nLeft==-1)nLeft = system.clientToScreenX(objForm, 0) + (objForm.getOffsetWidth() / 2) - (nWidth/2);			
					
		if(nTop==-1)nTop = system.clientToScreenY(objForm, 0) + (objForm.getOffsetHeight() / 2) - (nHeight/2);			
					
		var sOpt = "showtitlebar=true";			
					
		nexacro.open(sPopupId, sFormUrl, objOwnerFrame, objArgs, sOpt, nLeft, nTop, nWidth, nHeight, objForm);			
	};				
					
	nexacro.PopupAction.prototype.gfnIsNull = function (Val)				
	{				
		if (new String(Val).valueOf() == "undefined") return true;			
		if (Val == null) return true;			
		if (("x" + Val == "xNaN") && (new String(Val.length).valueOf() == "undefined")) return true;			
		if (Val.length == 0) return true;			
					
		return false;			
	}				
					
	nexacro.PopupAction.prototype.fnPopupActionCallback = function(sId, sParam)				
	{				
		this.targetPopupAction.on_fire_onsuccess();			
	};				

	nexacro.PopupAction.prototype.formurl = "";				
	nexacro.PopupAction.prototype.set_formurl = function (v)				
	{
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.formurl != v) {			
			this.formurl = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.popupid = "";				
	nexacro.PopupAction.prototype.set_popupid = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.popupid != v) {			
			this.popupid = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.title = "";				
	nexacro.PopupAction.prototype.set_title = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.title != v) {			
			this.title = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.popupstyle = "";				
	nexacro.PopupAction.prototype.set_popupstyle = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._toString(v);			
		if (this.popupstyle != v) {			
			this.popupstyle = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.popupleft = "";				
	nexacro.PopupAction.prototype.set_popupleft = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._parseInt(v);			
		if (this.popupleft != v) {			
			this.popupleft = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.popuptop = "";				
	nexacro.PopupAction.prototype.set_popuptop = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._parseInt(v);			
		if (this.popuptop != v) {			
			this.popuptop = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.popupwidth = "";				
	nexacro.PopupAction.prototype.set_popupwidth = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._parseInt(v);			
		if (this.popupwidth != v) {			
			this.popupwidth = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.popupheight = "";				
	nexacro.PopupAction.prototype.set_popupheight = function (v)				
	{				
		// TODO : enter your code here.			
		v = nexacro._parseInt(v);			
		if (this.popupheight != v) {			
			this.popupheight = v;		
		}			
	};				
					
	nexacro.PopupAction.prototype.args = "";				
	nexacro.PopupAction.prototype._args;				
	nexacro.PopupAction.prototype.set_args = function (v)				
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
					
	nexacro.PopupAction.prototype.on_fire_canrun = function (/*TODO*/)				
	{				
		if (this.canrun && this.canrun._has_handlers)			
		{			
			var evt = new nexacro.ActionEventInfo(this, "canrun"); //TODO		
			return this.canrun._fireCheckEvent(this, evt);		
		}			
		return true;			
					
	};				
}