//==============================================================================
//	Define the Action.
//==============================================================================
//==============================================================================		
// Object : nexacro.ActionAssetComm		
// Group : Action		
//==============================================================================		
if (!nexacro.ActionAssetComm)		
{		
    nexacro.ActionAssetComm = function(id, parent)		
    {		
        nexacro.Action.call(this, id, parent);		
    };		
        		
    nexacro.ActionAssetComm.prototype = nexacro._createPrototype(nexacro.Action, nexacro.ActionAssetComm);		
    nexacro.ActionAssetComm.prototype._type_name = "ActionAssetComm";		
	
	//===============================================================		
    // nexacro.ActionAssetComm : Create & Destroy		
    //===============================================================		
    nexacro.ActionAssetComm.prototype.destroy = function()		
	{	
		nexacro.Action.prototype.destroy.call(this);
	};	
		
    //===============================================================		
    // nexacro.ActionAssetComm : Method		
    //===============================================================		
    nexacro.ActionAssetComm.prototype.run = function()		
	{	
        //TODO		
	};	
	
	
	//===============================================================		
    // nexacro.Action : 변수선언 부분
    //===============================================================
	var pAction = nexacro.Action.prototype;
	
	pAction._TEST_MSG = "공통파일 테스트용";
}
