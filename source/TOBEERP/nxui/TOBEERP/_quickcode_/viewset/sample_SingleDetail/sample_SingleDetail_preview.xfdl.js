(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_name("sample");
            this.set_titletext("OO관리");
            if (Form == this.constructor)
            {
                this._setFormPosition(1120,650);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new View("viewMaster","10","54",null,null,"10","10",null,null,null,null,this);
            obj.set_taborder("0");
            obj.set_text("viewMaster");
            obj.set_viewdataset("viewdataset");
            this.addChild(obj.name, obj);
            // Layout Functions
            //-- Default Layout : this.viewMaster
            obj = new Layout("default","",0,0,this.viewMaster.form,function(p){});
            this.viewMaster.form.addLayout(obj.name, obj);

            //-- Default Layout : this
            obj = new Layout("default","",1120,650,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.addIncludeScript("sample_SingleDetail.xfdl","lib::libCommon.xjs");
        this.registerScript("sample_SingleDetail.xfdl", function() {
        /**
        *  @MenuPath    샘플 > OO관리
        *  @FileName	sample.xfdl
        *  @Desction	OO관리 화면
        *******************************************************************************
        *  2022.01.01		Creator			최초 생성
        *******************************************************************************
        */

        /**************************************************************************
         * include 영역
         **************************************************************************/
        this.executeIncludeScript("lib::libCommon.xjs"); /*include "lib::libCommon.xjs"*/;

        /**************************************************************************
         * FORM 변수 선언 영역
         **************************************************************************/
        this.application = null;

        /**************************************************************************
         * FORM EVENT 영역(onload)
         **************************************************************************/
        /**
         * @description form onload
         */
        this.form_onload = function(obj,e)
        {
        	// application 변수 셋팅
        	this.application = nexacro.getApplication();

        	// Title 영역 셋팅
        	this.parent.parent.fn_setFavoriteButton(obj);
        };

        /**************************************************************************
         * CALLBACK 콜백 처리부분(Transaction)
         **************************************************************************/

        /**************************************************************************
         * CRUD 및 TRANSACTION 서비스 호출 처리
         **************************************************************************/

        /**************************************************************************
         * 사용자 FUNCTION 영역
         **************************************************************************/

        /**************************************************************************
        * 각 COMPONENT 별 EVENT 영역
        **************************************************************************/
        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.addEventHandler("onload",this.form_onload,this);
        };
        this.loadIncludeScript("sample_SingleDetail.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
