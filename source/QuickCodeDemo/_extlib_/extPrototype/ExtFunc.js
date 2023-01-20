if(!nexacro.ExtFunc) {
	nexacro.ExtFunc = true;
	
	//----------------------------------------------------------------------
	//2018.11.22 팝업창 or 업무화면창이 종료시 메모리에 값이 남아 있는 경우있어서
	//           공통함수에서 처리해야 하나, 업무/공통 수정이 어려운 상태에서
	//           _pForm.on_destroy_contents 에서 gc를 강제로 호출함(자동이다보니 반복호출될수도 있음.)
	//           가능하면 공통에서 처리하여 호출을 최소화 해야함.
	//           메모리여부는 HxD(Freeware)로 nexacro process attach후 검색하여 값여부 확인할수있음.
	//----------------------------------------------------------------------
	var _pFrame = nexacro.Frame.prototype;
	_pFrame._originalOn_close = _pFrame._on_close;
	_pFrame._on_close = function () {
		if(this._type_name == "MainFrame") {
			nexacro._allClose = true;
		}
		var rtn = this._originalOn_close();
		return rtn;
	};
	delete _pFrame;
	
	var _pForm = nexacro.Form.prototype;
	_pForm.originalOn_destroy_contents = _pForm.on_destroy_contents;
	_pForm.on_destroy_contents = function () {
		this.originalOn_destroy_contents();
		
		if (!nexacro._allClose && system.navigatorname == "nexacro") {
			//프로젝트별로 공통폼사용시 처리 가능 부분 
			//trace(this.name);
			//frameWork(mainframe mdi), cmmPopup(팝업공통폼)
			if (this.name == "frameWork"
			 || this.name == "cmmPopup"
			)
			{
				nexacro._OnceCallbackTimer.callonce(nexacro.getApplication().mainframe
													, function ()
													{
														//trace("gc start");
														nexacro.gc();
														trace("gc end");
													}
													, 1000);  
			}
		}
	};
	delete _pForm;
}