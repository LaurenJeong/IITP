//==============================================================================
//
//  TOBESOFT Co., Ltd.
//  Copyright 2017 TOBESOFT Co., Ltd.
//  All Rights Reserved.
//
//  NOTICE: TOBESOFT permits you to use, modify, and distribute this file 
//          in accordance with the terms of the license agreement accompanying it.
//
//  Readme URL: http://www.nexacro.co.kr/legal/nexacro17-public-license-readme-1.1.html	
//
//==============================================================================

if (!nexacro.NormalDataset) 
{
	//==============================================================================
	// nexacro.NormalDataset	
	//==============================================================================
	nexacro.NormalDataset = function (id, parent) 
	{
		nexacro.Dataset.call(this, id, parent);
		
        this.url = "";
        this.arguments = "";    	
        this.serverdatasetid = "";
        this.firefirstcount = 0;
        this.firenextcount = 0;
        this.progressload = false;
        this.preload = false;

        // ----------------- internal variable ------------------ // 
		this._is_preloaded = false;
		this._is_created = false;
	};
	
	var _pNormalDataset = nexacro._createPrototype(nexacro.Dataset, nexacro.NormalDataset);
	nexacro.NormalDataset.prototype = _pNormalDataset;	

    // Dataset Event Reasons
	nexacro.NormalDataset.ROWTYPE_EMPTY = 0; //존재하지 않는 Row 상태
	nexacro.NormalDataset.ROWTYPE_NORMAL = 1; //초기 Row 상태
	nexacro.NormalDataset.ROWTYPE_INSERT = 2; //추가된 Row 상태
	nexacro.NormalDataset.ROWTYPE_UPDATE = 4; //수정된 Row 상태
	nexacro.NormalDataset.ROWTYPE_DELETE = 8; //삭제된 Row 상태
	nexacro.NormalDataset.ROWTYPE_GROUP = 16; //Group 정보 Row 상태

	nexacro.NormalDataset.REASON_LOAD = 0; //Dataset의 Load가 완료되었을 때
	nexacro.NormalDataset.REASON_LOADPROCESS = 1; //Dataset을 Loading 중일 때 
	nexacro.NormalDataset.REASON_RESET = 2; //Dataset의 변경사항을 무시하고 이전상태로 Reset되었을 때
	nexacro.NormalDataset.REASON_LOADCONTENT = 3; //ADL 또는 FDL에 정의된 Dataset의 Load가 완료되었을 때. Form의 onload() 이벤트보다 먼저 발생합니다.

	nexacro.NormalDataset.REASON_ASSIGN = 10; //Dataset이 Assign 되었을 때
	nexacro.NormalDataset.REASON_COPY = 11; //Dataset이 복사되었을 때
	nexacro.NormalDataset.REASON_APPEND = 12; //Dataset이 추가되었을 때
	nexacro.NormalDataset.REASON_MERGE = 13; //Dataset이 통합되었을 때
	nexacro.NormalDataset.REASON_DELETE = 20; //Dataset의 Row가 삭제되었을 때
	nexacro.NormalDataset.REASON_DELETEALL = 22; //Dataset의 모든 Row가 삭제되었을 때
	nexacro.NormalDataset.REASON_CLEARDATA = 23; //Dataset의 모든 Row가 완전 삭제되었을 때
	nexacro.NormalDataset.REASON_CLEAR = 24; //Dataset의 모든 Column 및 Row가 완전히 삭제되었을 때
	nexacro.NormalDataset.REASON_SORTGROUP = 30; //Dataset의 데이터가 정렬 또는 그룹화 되었을 때
	nexacro.NormalDataset.REASON_FILTER = 31; //Dataset의 데이터가 Filter 되었을 때
	nexacro.NormalDataset.REASON_MOVE = 32; //Dataset의 Row가 다른 위치로 이동되었을 때
	nexacro.NormalDataset.REASON_EXCHANGE = 33; //Dataset의 두 Row가 서로 위치가 바뀌었을 때
	nexacro.NormalDataset.REASON_CHANGELAYOUT = 34; //Dataset의 Column 정보가 변경되었을 때
	nexacro.NormalDataset.REASON_CHANGESTATUS = 40; //Dataset의 Row 상태(Type, Select)이 변경되었을 때
    nexacro.NormalDataset.REASON_ENABLEEVENT = 41; //Dataset의 enableevent 속성이 'true'가 되었을 때
    nexacro.NormalDataset.REASON_CHANGEDATAOBJECT = 43; //Dataset의 데이터가 DataObject로부터 변경되었을 때

	nexacro.NormalDataset.REASON_ROWCHANGE = 51; //Dataset의 row object, index가 함께 변경된 경우
	nexacro.NormalDataset.REASON_ROWINDEXCHANGE = 52; //Dataset의 row object는 변경없고, index만 변경된 경우
    nexacro.NormalDataset.REASON_ROWOBJECTCHANGE = 53; //Dataset의 row object가 변경되고, index는 변경없는 경우;
    
	nexacro.NormalDataset.REASON_BINDSOURCE = 90; //Dataset을 Bind 했을 때 

    nexacro.NormalDataset.REASON_BINDDATAOBJECT_UPDATE = 70; //Dataset의 DataObject에 대한 정보가 업데이트 되었을 때

    _pNormalDataset.on_created = function () 
    {
        if (this.binddataobject && !this._binddataobject)
        {
            this._binddataobject = this._findDataObject(this.binddataobject);
            this._loadDataObject(false);
        }

        if (this.url == "" || this.preload == false)
        {
            if (this.colcount > 0) 
            {
                this._endLoad(0, "SUCCESS", 3);	// 3 == REASON_LOADCONTENT
            }
        }
        
        //preload
        if (!nexacro.isDesignMode && this.preload && !this._is_preloaded)
		{
			if (this.url && this.parent)
			{
                //var bLoaded = false;

                var keys = [];
                keys.push("__preload");
                keys.push(this.url);
                keys.push(this.id);
                keys.push(this.serverdatasetid);
                var svcid = keys.join('_');
                
                var url = nexacro._getServiceLocation(this.url);
                
                var loadmanager = this.parent._load_manager;
                if (loadmanager)
                {
                    var data = loadmanager.getPreloadDataModule(this.id);
                    if (data)
                    {
                        var serverdatasetid = this.serverdatasetid;
                        if (!serverdatasetid)
                        {
                            serverdatasetid = "output";
                        }
                        var outds = this.id + "=" + serverdatasetid;
                        var tritem = new nexacro.TransactionItem(url, this.parent, svcid, "", outds, "", 0, true);
                        tritem._usewaitcursor = false;
                        tritem._loadFromData(data);
                        this._is_preloaded = true;
                    }
                }
            }
        }

		if (!this._is_created)
		{
			this._defaultKeyStr = this.keystring;
			this._defaultFilterStr = this.filterstr;
		}
		this._is_created = true;

    };
	
    _pNormalDataset.destroy = function ()
    {
        nexacro.Dataset.prototype.destroy.call(this);
        this._refform = null;
    };

   

	_pNormalDataset.set_url = function (v) 
	{
		this.url = v;
	};
	_pNormalDataset.set_arguments = function (v)
	{
        this.arguments = v;
	};

	_pNormalDataset.set_firefirstcount = function (v)
	{
        v = parseInt(v) | 0;
        if (isFinite(v))
            this.firefirstcount = v;
	};

	_pNormalDataset.set_firenextcount = function (v)
	{
        v = parseInt(v) | 0;
        if (isFinite(v))
            this.firenextcount = v;
	};

	_pNormalDataset.set_progressload = function (v)
	{
        this.progressload = nexacro._toBoolean(v);
	};

	_pNormalDataset.set_preload = function (v) 
	{
		this.preload = nexacro._toBoolean(v);
	};
	_pNormalDataset.set_serverdatasetid = function (v) 
	{
		this.serverdatasetid = v;
    };    

    _pNormalDataset._getRowcount = function ()
    {
        return this.rowcount;
    };

    _pNormalDataset.on_notify_onload_dataobject = function (/*dataobj, reason*/)
    {        
        this._loadDataObject(true, 0);
    };

    _pNormalDataset.on_notify_onvaluechanged_dataobject = function (dataobject, evtinfo)
    {   
        if (this.dataobjectbindmode == "twoway")
        {
            var datapath = evtinfo.dataobjectpath;
            var updatedsid = evtinfo.sourcedatasetid;
            if (updatedsid == this.id)// && evtinfo.reason != 16) //need to modify
                return; 

            if (this._isUpdatedBinddata(datapath) == false) //also need to modify
            {            
                return;
            }
            var idx = evtinfo.index;
            var value = evtinfo.value;
            var colid = this._getColIDFromDataobjectkey(evtinfo.key);
            this._is_data_updating = true;
            if (idx == -1)// || this.filterstr) //reload
            {
                this.loadFromDataObject();
            }
            else
            {                      
                var colinfo = this.colinfos[colid];
                if (colinfo)
                {
                    var rowRow = this.__getParsedRow(this._rawRecords[idx]);
                    if (rowRow)
                        this._setColumn(idx, rowRow, colinfo, value);
                }       
            }
            this._is_data_updating = false;
        }
    };

    _pNormalDataset._getColIDFromDataobjectkey = function (key)
    {
        var colist = this.colinfos;
        if (key)
        {
            var datapathkey = "@." + key;
            for (var i =0,len = colist.length;i<len;i++)
            {
                var col = colist[i];
                var datapath = col.datapath;
                if (datapath)
                {
                    if (datapath[0] == "$" && (("@." + datapath) == datapathkey))
                    {
                        //Todo..
                        return col.id;
                    }
                    else if (datapath == datapathkey)
                    {
                          return col.id;
                    }
                }              
            }
        }
    };

    _pNormalDataset.on_notify_ondatachanged_dataobject = function (dataobject, evtinfo)
    {
        //var datapath = evtinfo.dataobjectpath;
        //if (updatedsid == this.id) //need to modify
        //    return; //loop
        if (this.dataobjectbindmode == "twoway")
        {            
            var bFireevent = false;
            var bReload = false;
            var datasetid = this.id;
            this._is_data_updating = true;
            var infoarray = evtinfo.infoarray;
            if  (infoarray)
            {
                for (var i = 0, len = infoarray.length; i < len; i++)
                {
                    var item = infoarray[i];
                    var dataobjectpath = item.dataobjectpath;
                    var srcdsid = item.sourcedatasetid;
                    var index = item.index;
                    if (index == -1)
                    {
                        bReload = true;
                        break;
                    }

                    if (srcdsid == datasetid)
                        continue;
                    if (this._isUpdatedBinddata(dataobjectpath) == false) //also need to modify
                    {
                        continue;
                    }
                    var type = item.type;
                    var data = item.data;                   
                   
                    if (type == "update")
                    {
                        if (data)
                        {
                            var orgRow = this._rawRecords[index];
                            this._copyDataObjectRowData(this._rawRecords[index], data);
                            this._rawRecords[index]._orgrow = orgRow;
                            this._rawRecords[index]._rtype = 4;
                        }
                    }
                    else if (type == "add")
                    {                        
                        var rawRecords = this._rawRecords;
                        var viewRecords = this._viewRecords;

                        var idx = rawRecords.length;
                        var rowRow = [];
                        rowRow._rawidx = idx;
                        rowRow._rtype = (this.updatecontrol ? 2 : 1);
                        rowRow._level = 0;

                        if (viewRecords != rawRecords)
                        {
                            viewRecords[viewRecords.length] = rowRow;
                        }
                        
                        rawRecords[idx] = rowRow;
                        this.rowcount = viewRecords.length;
                        
                        ///this.addRow();
                        if (data)
                            this._addDataObjectRowData(this._rawRecords[idx], data);
                    }
                    else if (type == "insert")
                    {
                        // rawRecords Add
                        // viewRecords Insert
                        var viewRecords = this._viewRecords;
                        var rawRecords = this._rawRecords;

                        //if (index >= viewRecords.length)
                        //    this._appendRow();

                        var rowRow = [];
                        rowRow._rawidx = index;//rawRecords.length;
                        rowRow._rtype = (this.updatecontrol ? 2 : 1);
                        rowRow._level = 0;
                        var rawidx;
                        // direct control
                        if (viewRecords == rawRecords)
                        {
                            //not indexed
                            rawRecords.splice(index, 0, rowRow);
                            this._adjustRawIdx(index, rawRecords.length);
                        }
                        else
                        {
                            // indexed
                            rawidx = viewRecords[index]._rawidx;
                            viewRecords.splice(index, 0, rowRow);
                            rawRecords.splice(rawidx, 0, rowRow);
                            this._adjustRawIdx(rawidx, rawRecords.length);
                        }
                        this.rowcount = viewRecords.length;
                        if (data)
                            this._addDataObjectRowData(this._rawRecords[index], data);
                    }
                    else if (type == "delete")
                    {
                        //this.deleteRow(index);
                        this._deleteRow(index);
                    }                    
                    bFireevent = true;
                }
                if (bReload)
                {
                    this.loadFromDataObject();
                }
                else if (bFireevent)
                {
                    var oldpos = this.rowposition;
                    this.on_fire_onrowsetchanged(-1, "SUCCESS", 43);
                    var setpos = this.rowposition;
                    if (type == "delete" && oldpos == this.rowposition)
                    {
                        if (setpos == index)
                        {
                            if (this.rowcount == 0)
                            {
                                this._forcesetRowPosition(-1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                            }
                            else
                            {
                                if (setpos == this.rowcount)
                                {
                                    this._forcesetRowPosition(this.rowcount - 1, 51); //nexacro.Dataset.REASON_ROWCHANGE;
                                }
                                else
                                {
                                    this._setRowPosition(setpos, 53, true);// nexacro.Dataset.REASON_ROWOBJECTCHANGE
                                }
                            }
                        }
                        else if (setpos > index)
                        {
                            this._setRowPosition(setpos - 1, 51);
                        }
                    }
                    else if (type != "update")
                        this._setRowPosition(index, oldpos == index ? 53 : 51, true);
                }
                
            }
            this._is_data_updating = false;
            //test code for filter
            //        this._reFilter();
            // this._resetSortGroup();
        }
    };

    _pNormalDataset._isUpdatedBinddata = function (changeddatapath) 
    {
        var ret = false;
        var datapath = this.dataobjectpath;
        if (datapath == changeddatapath || datapath.indexOf(changeddatapath) > -1)
            ret = true;
        return ret;
    };

    _pNormalDataset._copyDataObjectRowData = function(destRow, srcRow)
    {
        var colList = this.colinfos;
        function __copyRowData_loopFn(i)
        {
            var dpath = this._getPath(colList[i]._datapath);
            if (srcRow[dpath] !== undefined)
            {
               if (typeof srcRow[dpath] == "object") // array
               {
                   for (var j = 0; j < srcRow[dpath].length; j++) {
                       destRow[i] = srcRow[dpath][j];
                       i++;
                   }
                }
                else
                {
                    destRow[i] = srcRow[dpath];
                }
            }
        }
        var cnt = Object.keys(srcRow).length < colList.length ? Object.keys(srcRow).length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyRowData_loopFn);
    };

    _pNormalDataset._addDataObjectRowData = function(destRow, srcRow)
    {
        var colList = this.colinfos;
        function __copyRowData_loopFn(i)
        {
            var dpath = this._getPath(colList[i]._datapath);
            destRow[i] = srcRow[dpath];
        }
        var cnt = srcRow.length < colList.length ? srcRow.length : colList.length;
        nexacro.__forLoop(this, 0, cnt, __copyRowData_loopFn);
    };

    _pNormalDataset._getPath = function (arr)
    {
        if (!arr)
            return;

        var first_char = arr[0];
        if (first_char == "@")
        {
            return arr[1];
        }
        else if (first_char == "$")
        {
            //Todo
            return arr[1];
        }
    };

    _pNormalDataset._getPathFromColinfo = function (colinfo)
    {
        var datapath;
        if (!colinfo || !colinfo.datapath)
            return;
        var arr_datapath = colinfo._datapath;
        if (!arr_datapath)
            arr_datapath = colinfo._datapath = colinfo.datapath.match(/[^\]\[.]+/g);
        var first_char = arr_datapath[0];
        if (first_char == "@")
        {
            var len = arr_datapath.length;
            if (len == 2)
                datapath = arr_datapath[1];
            else if (len > 2)
            {
                datapath = "";
                for (var i =1;i<len;i++)
                {
                    if (i == 1) 
                        datapath += arr_datapath[i];
                    else
                        datapath += '[' + arr_datapath[i] + ']';
                }
            }
        }
        else if (first_char == "$")
        {
            datapath = colinfo.datapath;
        }
        return datapath;
    };

    _pNormalDataset.set_binddataobject = function (str)
    {
        if (str != this.binddataobject)
        {
            var binddataobject = this._binddataobject;
            if (binddataobject)
                binddataobject._removeEventHandler("onload", this.on_notify_onload_dataobject, this);
            if (!str)
            {
                this._binddataobject = null;
                this.binddataobject = "";
            }
            else
            {
                binddataobject = this._binddataobject = this._findDataObject(str);
                if (binddataobject)
                {
                    binddataobject._setEventHandler("onload", this.on_notify_onload_dataobject, this);
                    binddataobject._setEventHandler("ondatachanged", this.on_notify_ondatachanged_dataobject, this);
                    binddataobject._setEventHandler("onvaluechanged", this.on_notify_onvaluechanged_dataobject, this);
                }
                this.binddataobject = str;
            }
            this.on_apply_binddataobject();
        }
        return this.binddataobject;
    };

    _pNormalDataset.on_apply_binddataobject = function ()
    {
        if (this._is_created)
            this._loadDataObject(true, 3);      
    };
    /*
    _pNormalDataset._on_apply_binddataobject = function ()
    {
        binddataobject = this._binddataobject = this._findDataObject(this.binddataobject);
        if (binddataobject)
        {
            binddataobject._setEventHandler("onload", this.on_notify_onload_dataobject, this);
            binddataobject._setEventHandler("ondatachanged", this.on_notify_ondatachanged_dataobject, this);
            binddataobject._setEventHandler("onvaluechanged", this.on_notify_onvaluechanged_dataobject, this);
        }
    };
    */
    _pNormalDataset.set_dataobjectpath = function (v)
    {
        this.dataobjectpath = v;
        this.on_apply_dataobjectpath();
    };

    _pNormalDataset.on_apply_dataobjectpath = function (v)
    {
        var dataobject = this._binddataobject;
        if (this._is_created && dataobject)
        {
            this._loadDataObject(true, 3);
        }
    };

    _pNormalDataset.set_dataobjectbindmode = function (v)
    {
        this.dataobjectbindmode = v;
    };

	_pNormalDataset.load = function (async, datatype) 
    {
        var baseurl;
        if (this._refform)
        {
            baseurl = this._refform._getRefFormBaseUrl();
        }
        var url = nexacro._getServiceLocation(this.url, baseurl);
        
        if (url.length && this.parent)
		{
			var svcid = "__normaldataset_loadurl_" + this.id;
			var loadmanager = this.parent._load_manager;
			if (loadmanager)
			{
                var serverdatasetid = this.serverdatasetid;			    
                if (!serverdatasetid)
                {
                    serverdatasetid = "output";
                }			    
                var outds = this.id + "=" + serverdatasetid;
                var service = nexacro._getServiceObject(this.url, true);
                loadmanager.loadDataModule(url, svcid, "", outds, this.arguments, null, async, datatype, false, service);
			}
		}
		else
		{
            this._endLoad(-1, "empty url", 3);	// 3 == REASON_LOADCONTENT
		}
	};


	_pNormalDataset.append = function (url)
	{
        this._append(url, true, 0); // async = true, datatype = XML
	};

	_pNormalDataset._append = function (svcurl, async, datatype)
	{
        var baseurl;
        if (this._refform)
        {
            baseurl = this._refform._getRefFormBaseUrl();
        }
        
        var serviceurl = svcurl ? svcurl : this.url;
        
        if (!serviceurl)
        {
            this._endLoad(-1, "empty url", 0);	// 3 == REASON_LOAD
            return;
        }
        
        var url = nexacro._getServiceLocation(serviceurl, baseurl);
        if (url && url.length && this.parent)
        {
            var svcid = "__normaldataset_appendurl_" + this.id;
            var loadmanager = this.parent._load_manager;
            if (loadmanager)
            {
                var serverdatasetid = this.serverdatasetid;
                if (!serverdatasetid)
                {
                    serverdatasetid = "output";
                }
                var outds = this.id + "=" + serverdatasetid + ":P";
                var service = nexacro._getServiceObject(url, true);
                
                loadmanager.loadDataModule(url, svcid, "", outds, this.arguments, null, async, datatype, false, service);
            }
        }
        else
        {
            this._endLoad(-1, "empty url", 0);	// 3 == REASON_LOAD
        }
	};

	_pNormalDataset.on_preload_data = function (url, errstatus, data, fireerrorcode, returncode, requesturi, locationuri, extramsg)
	{
        if (errstatus != 0)
        {	
            nexacro._onHttpSystemError(this, true, this, fireerrorcode, url, returncode, requesturi, locationuri, extramsg);
        }
        else if (data && !this._is_preloaded)
        {
            var keys = [];
            keys.push("__preload");
            keys.push(this.url);
            keys.push(this.id);
            keys.push(this.serverdatasetid);
            var svcid = keys.join('_');
        
            var serverdatasetid = this.serverdatasetid;
            if (!serverdatasetid)
            {
                serverdatasetid = "output";
            }
            var outds = this.id + "=" + serverdatasetid;
            var tritem = new nexacro.TransactionItem(this.url, this.parent, svcid, "", outds, "", 0, true);
            tritem._usewaitcursor = false;
            tritem._loadFromData(data);
            this._is_preloaded = true;
        }
    };

    _pNormalDataset._findDataObject = function (id)
    {
        if (id && id.length > 0)
        {
            var dataobj;
            var parent = this.parent;
            if (parent)
            {
                dataobj = parent[id];
                if (dataobj && (dataobj._type_name == "DataObject"))
                {
                    return dataobj;
                }
            }

            if (this._refform)
            {
                dataobj = this._refform.lookup(id);
                if (dataobj && (dataobj._type_name == "DataObject"))
                {
                    return dataobj;
                }
            }
        }
        return undefined;
    };

    _pNormalDataset._loadDataObject = function (fireevent, reason)
    {
        var data = null;
        var binddataobject = this.binddataobject;
        var _binddataobject = this._binddataobject;

        if (binddataobject && !_binddataobject)
            _binddataobject = this._binddataobject = this._findDataObject(binddataobject);

        if (_binddataobject)
        {
            data = _binddataobject.data;            
        }

        if (this.parent._is_created)
            this._is_created = true;

        this._loadFromJSONObject(data);

        if (fireevent !== false && this._is_created)
        {
            this._bWorkingstatus = true;

            this._reFilter();
            this._resetSortGroup();

            if (this._eventstat)
            {
                this.on_fire_onload(0, "SUCCESS", reason ? reason : 0);

                if (this._viewRecords && this._viewRecords.length > 0)
                {
                    this._forcesetRowPosition(0, 51);
                }
                else
                {
                    this._forcesetRowPosition(-1, 51);
                }
            }
            else if (this._viewRecords && this._viewRecords.length > 0)
            {
                this.rowposition = 0;
            }

            this._bWorkingstatus = false;
        }

        if (reason == 0 || reason == 3)
        {
            var view = nexacro.Component.prototype._getRootComponent.call(this, this.parent);
            if (view && view._is_view && view._ismodeltrigger)
            {
                if (this.name == view.viewdataset)
                {
                    // 반드시 view여야만 함.
                    var form = view.parent;
                    // view의 parent는 무조건 form이다
                    var manager = form._trigger_manager;
                    var triggertype = "";
                    var triggerview = view;
                    var triggerobj = view.getViewDataset();
                             
                    triggertype = "Model Load Success";
                    manager._notifyTrigger(triggertype, triggerobj, triggerview);
                }
            }       
        }
    };

    delete _pNormalDataset;
}
