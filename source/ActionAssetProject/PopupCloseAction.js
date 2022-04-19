//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.PopupCloseAction		
// Group : Action		
//==============================================================================		
if (!nexacro.PopupCloseAction)		
{		
    nexacro.PopupCloseAction = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
    };		
        		
    nexacro.PopupCloseAction.prototype = nexacro._createPrototype(nexacro.Action, nexacro.PopupCloseAction);		
    nexacro.PopupCloseAction.prototype._type_name = "PopupCloseAction";		
	
	//===============================================================		
    // nexacro.PopupCloseAction : Create & Destroy		
    //===============================================================		
    nexacro.PopupCloseAction.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.PopupCloseAction : Method		
    //===============================================================		
    nexacro.PopupCloseAction.prototype.run = function()		
	{	
        //TODO		
	};	
	
}
