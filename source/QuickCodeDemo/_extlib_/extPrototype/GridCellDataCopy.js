if (!nexacro.GridCellDataCopy)
{
	var browser = system.navigatorname;
	if( browser == "nexacro" || browser == "IE")
	{
		/**
		 * constructor
		 * @param {form} scope form object
		 * @param {boolean=} keepData 복사된 데이터 유지여부(default: false)
		 * @param {boolean=} useBlink blink 사용여부(default: false)
		 * @class Util
		 * @classdesc Uitlity class.
		 * @constructor nexacro.GridCellDataCopy
		*/
		nexacro.GridCellDataCopy = function(scope, keepData, useBlink)
		{
			this.scope = scope;
			this.colSeperator = "	";

			this.targetGrid = null; 

			var tempBlinkColor = ["#66CC88", "#66CC66", "#66CC44", "#66CC22", "#66CC00"];
			var tempBlinkColor2 = tempBlinkColor.slice(0,4);
			tempBlinkColor2 = tempBlinkColor2.reverse();
			this.blinkColor = tempBlinkColor.concat(tempBlinkColor2);
			//this.blinkTime = [10,10,10,20,100,20,10,10,10];
			this.blinkTime = [20,20,20,20,120,20,20,20,20];					

			//trace("this.blinkColor="+this.blinkColor);

			if(this.gfnIsNull(keepData)) {
				this.keepData = false;
			} else {
				this.keepData = keepData;
			}

			if(this.gfnIsNull(useBlink)) {
				this.useBlink = false;
			} else {
				this.useBlink = useBlink;
			}

			this.scope.addEventHandler("ontimer", this.blinkTimerHandler(this), this.scope);
			//return this;
		};
		
		var _pGridCellDataCopy = nexacro._createPrototype(nexacro.Object, nexacro.GridCellDataCopy);
		nexacro.GridCellDataCopy.prototype = _pGridCellDataCopy;
		_pGridCellDataCopy._type_name = "GridCellDataCopy";

		_pGridCellDataCopy.clearClipboard = function()
		{
			system.clearClipboard();
		};

		/*
		 * 대상 그리드 추가.
		 * @param {grid} grid grid component
		 * @param {function=} copyCallback 복사 후 호출될 함수
		 * @param {function=} pasteCallback 붙여넣기 후 호출될 함수
		 */						
		_pGridCellDataCopy.addGrid = function(grid, copyCallback, pasteCallback)
		{
			//if (this.gfnIsNull(grid) || !this.scope.gfnIsXComponent(grid) || this.scope.gfnTypeOf(grid) != "Grid" )
			if (this.gfnIsNull(grid) || this.scope.gfnTypeOf(grid) != "Grid" )
			{
				trace("first argument named grid is type of Grid.");
				return;
			}
alert("2 "+grid.name);

			trace(grid.addEventHandler("onkeydown", this.copyGridCellData(this.scope), this));		
			grid.selectBackgroundHandler = [];
			
			if(!this.gfnIsNull(copyCallback) && (typeof(copyCallback) == "function")) {
				grid["copyCallback"] = copyCallback;
			}

			if(!this.gfnIsNull(pasteCallback) && (typeof(pasteCallback) == "function")) {
				grid["pasteCallback"] = pasteCallback;
			}
		};

		/**
		 * copy & paste 처리
		 * @param {object} pThis Link.CellDataCopy
		 */
		_pGridCellDataCopy.copyGridCellData = function(pThis)
		{
			//obj grid 
			//e key event object.
			return function(obj, e) {
			  

				var keycode = e.keycode;
			
				//if(e.ctrlKey && !e.shiftKey && !e.altKey){
		      trace("keycode33333 : "+keycode);
					if(keycode == 67){
					  
						var startrow = nexacro.toNumber(obj.selectstartrow),
							endrow   = nexacro.toNumber(obj.selectendrow),
							startcol = nexacro.toNumber(obj.selectstartcol),
							endcol   = nexacro.toNumber(obj.selectendcol);

							var copyData = "";
							var colSeperator = pThis.colSeperator;
							
							var checkIndex = {};
							
							obj.selectBackgroundHandler = [];
							
							pThis.targetGrid = null;

							for (var i = startrow; i <= endrow; i++) {
								for (var j = startcol; j <= endcol; j++) {

									if(!checkIndex[j]) {
										//this.setSelectBgInfo(obj, j); 

										checkIndex[j] = 1;
									}

									var value = obj.getCellValue(i,j);

									if(!this.gfnIsNull(value) && value != "undefined") //"undefined" <--- bug ???
									{
										if (j < obj.selectendcol) {
											copyData += obj.getCellValue(i,j) + colSeperator;
										} else {
											copyData += obj.getCellValue(i,j);
										}
									}
								}

								if (i < obj.selectendrow) {
										copyData += "\r\n";
								}
							}

							copyData += "\r\n";

							system.clearClipboard();

							system.setClipboard("CF_TEXT",copyData);

							pThis.targetGrid = obj;

							if(pThis.useBlink && copyData.length > 0) {
								pThis.scope.setTimer(1000, 50);
							}

							var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
							pThis.notify("copy", obj, e, areaInfo);									

					} else if(keycode == 86) {

						var copyData = system.getClipboard("CF_TEXT");

						copyData = new String(copyData);
						var colSeperator = pThis.colSeperator;
						var rowData = copyData.split("\r\n");
						var rowDataCount = rowData.length - 1;
						
						if(rowDataCount < 1) {
							e.stopPropagation();
							return;
						}

						obj.set_enableevent(false);
						obj.set_enableredraw(false); 

						var datasetName = obj.binddataset;
						//var ds = this.gfn_lookup(pThis.scope, datasetName);
						var ds = obj.getBindDataset();

						ds.set_enableevent(false); 

						var grdCellCount = obj.getCellCount("body");
						var rowCount = ds.getRowCount();
						var startrow = nexacro.toNumber(obj.selectstartrow),
							endrow   = nexacro.toNumber(obj.selectendrow),
							startcol = nexacro.toNumber(obj.selectstartcol),
							endcol = 0;

						var currRow = startrow;
						var cellIndex = startcol;
						var maxColumnCount = 0;
						var checkIndex = {};	
						//check current cell editType 
						for (var i = 0; i < rowDataCount; i++) {
							if(rowCount <= currRow)
							{
								ds.addRow();
							}

							var columnData = rowData[i].split(colSeperator);
							var columnLoopCount = cellIndex + columnData.length;

							if(columnLoopCount > grdCellCount) {
								columnLoopCount = grdCellCount;
							}

							if(maxColumnCount < columnLoopCount) {
								maxColumnCount = columnLoopCount;
							}

							var k = 0;
							for(var j = cellIndex; j < columnLoopCount; j++) {
								if(!checkIndex[j]) {
									//this.setSelectBgInfo(obj, j);

									checkIndex[j] = 1;
								}

								var colid = obj.getCellProperty("body", j, "text").substr(5);
								var tempValue = columnData[k];
								if(!this.gfnIsNull(tempValue) && tempValue != "undefined") //"undefined" <--- bug ???
								{
									ds.setColumn(currRow, colid, tempValue);
								}

								k++;
							}

							currRow++;
						}

						ds.rowposition = currRow;	

						endrow = endrow + rowDataCount - 1;
						endcol = maxColumnCount - 1;

						if(!pThis.keepData) {
							pThis.clearClipboard();
						}

						obj.set_enableredraw(true);
						obj.set_enableevent(true);
						ds.set_enableevent(true); 

						obj.selectArea(startrow, startcol, endrow, endcol);

						pThis.targetGrid = obj;

						if(pThis.useBlink) {
							pThis.scope.setTimer(1000, 50);
						}

						var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
						pThis.notify("paste", obj, e, areaInfo);

						//grid enableredraw가 false일 경우 
						//event 전파과정에서 error발생을 막기위한 처리.2015.02.25 버전.
						e.stopPropagation();
					}
				//}
			}
		};

		_pGridCellDataCopy.notify = function(type, grid, e, areaInfo)
		{
			if(type == "copy") {
				if(grid["copyCallback"]) {
					grid["copyCallback"](grid, e, areaInfo);
				}
			} else if(type == "paste") {
				if(grid["pasteCallback"]) {
					grid["pasteCallback"](grid, e, areaInfo);
				}
			}
		};

		_pGridCellDataCopy.setSelectBgInfo = function(grid, cellIndex)
		{
			var bgHandler = grid.selectBackgroundHandler;
			
			var type = "cell";

			//  nexacro.Style_background
			var selectBgValue = "";//grid.getCellProperty("Body", cellIndex, "selectbackground");
			
			if(this.gfnIsNull(selectBgValue)) {
				type = "body";

				//nexacro.Style_value
				//selectBgValue = this.getBandCurrentStyle(grid, "body", "selectbackground");
				selectBgValue = selectBgValue.toString();
				
			}

			selectBackground = this.getStyleBackground(selectBgValue);
			var handler = this.getSelectBackgroundHandler(type, grid, cellIndex);

			bgHandler.push({cellIndex:cellIndex, selectBackground: selectBackground, handler:handler});
		};

		_pGridCellDataCopy.getSelectBackgroundHandler = function(type, grid, cellIndex)
		{
			if(type == "cell") {
				return function(selectBg) {
					var value = selectBg.toString();
					//grid.setCellProperty( "Body", cellIndex, "selectbackground", value);
				};

			} else if(type == "body") {
				return function(selectBg) {
					var value = selectBg.toString();
					//grid.setBandProperty( "Body", "selectbackground", value);
				};
			}
		};

		/*
		 * style background 객체 반환
		 */
		_pGridCellDataCopy.getStyleBackground = function(value)	
		{
			var styleBackground = "";//new nexacro.Style_background();
			if(typeof(value) == "object") {
				styleBackground = value.clone();

			} else if(typeof(value) == "string") {
				//styleBackground._setValue(value);
			}

			return styleBackground;
		};

		_pGridCellDataCopy.getBandCurrentStyle = function(grid, band, propName)	
		{
			var bandObj = grid[band];

			if(this.gfnIsNull(bandObj)) { 
				return "";
			}

			var value = bandObj["style"][propName];
			
			if(this.gfnIsNull(value)) {
				var ref_finder = bandObj.bandctrl._ref_css_finder;
				
				if(!ref_finder["normal"]){
					return null;
					
				} else if(ref_finder["normal"][propName]){
					return ref_finder["normal"][propName];
					
				} else {
					return null;

				}
			}

			return value;
		};

		_pGridCellDataCopy.blinkTimerHandler = function(pThis)
		{
			return function(obj, e) {
				var timerid = e.timerid;
				obj.killTimer(timerid);
				var remainder = timerid%1000;
				//trace("timerid="+timerid + ", remainder="+remainder);

				if(remainder < 9) {
					pThis.blinkSelectBg(pThis.blinkColor[remainder]);
					pThis.scope.setTimer(++timerid, pThis.blinkTime[remainder]);

				} else {
					pThis.blinkSelectBg(null);
					pThis.initBlinkData();
				}
			}
		};

		_pGridCellDataCopy.initBlinkData = function()
		{
			var grid   = this.targetGrid;
			grid.selectBackgroundHandler = [];
			grid.targetGrid = null;
		};
		
		_pGridCellDataCopy.gfnIsNull = function(sValue)
		{
			if (new String(sValue).valueOf() == "undefined") return true;
      if (sValue == null) return true;
      
      var ChkStr = new String(sValue);
  
      if (ChkStr == null) return true;
      if (ChkStr.toString().length == 0 ) return true;
      return false;
		};

		_pGridCellDataCopy.blinkSelectBg = function(color)
		{
			var grid   = this.targetGrid;
			var bgHandler = grid.selectBackgroundHandler;
			var len = bgHandler.length;

			var item,
				handler, 
				selectBackground,
				cloneBg;

			for(var i = 0; i < len; i++) {
				item = bgHandler[i];
				selectBackground = item["selectBackground"];
				handler = item["handler"];

				if(color === null) {
					cloneBg = selectBackground;
				} else {
					cloneBg = selectBackground.clone();
					cloneBg.set_color(color);
				}

				handler(cloneBg);
			}
		};
	} //end of if (nexacro.Browser == "Runtime" && nexacro.Browser=="IE" ) 
	else 
	{
		/**
		 * constructor
		 * @param {form} scope form object
		 * @param {boolean=} keepData 복사된 데이터 유지여부(default: false)
		 * @param {boolean=} useBlink blink 사용여부(default: false)
		 * @class Util
		 * @classdesc Uitlity class.
		 * @constructor nexacro.GridCellDataCopy
		*/
		nexacro.GridCellDataCopy = function(scope, keepData, useBlink)
		{
			this.scope = scope;
			this.colSeperator = "	";

			this.targetGrid  = undefined; 
			this.targetEvent = undefined;
			
			var tempBlinkColor = ["#66CC88", "#66CC66", "#66CC44", "#66CC22", "#66CC00"];
			var tempBlinkColor2 = tempBlinkColor.slice(0,4);
			tempBlinkColor2 = tempBlinkColor2.reverse();
			this.blinkColor = tempBlinkColor.concat(tempBlinkColor2);
			//this.blinkTime = [10,10,10,20,100,20,10,10,10];
			this.blinkTime = [20,20,20,20,120,20,20,20,20];

			//trace("this.blinkColor="+this.blinkColor);

			if(this.gfnIsNull(keepData)) {
				this.keepData = false;
			} else {
				this.keepData = keepData;
			}

			if(this.gfnIsNull(useBlink)) {
				this.useBlink = false;
			} else {
				this.useBlink = useBlink;
			}

			this.scope.addEventHandler("ontimer", this.blinkTimerHandler(this), this.scope);

			//return this;
		};

		var _pGridCellDataCopy = nexacro._createPrototype(nexacro.Object, nexacro.GridCellDataCopy);
		nexacro.GridCellDataCopy.prototype = _pGridCellDataCopy;
		_pGridCellDataCopy._type_name = "GridCellDataCopy";

		_pGridCellDataCopy._createTextarea = function(innerText)
		{
			var ta = document.createElement('textarea');
			ta.id = "textAreabyCopyAndPaste";
			ta.style.position = 'absolute';
			ta.style.left = '-1000px';
			ta.style.top = document.body.scrollTop + 'px';
			ta.value = innerText;
			document.body.appendChild(ta);
			ta.select();
			trace("dddddddddddddddddddddddddd " + ta.value);
			//document.execCommand("copy"); 

			return ta;
		};


		


		_pGridCellDataCopy.clearClipboard = function()
		{

		};

		/*
		 * 대상 그리드 추가.
		 * @param {grid} grid grid component
		 * @param {function=} copyCallback 복사 후 호출될 함수
		 * @param {function=} pasteCallback 붙여넣기 후 호출될 함수
		 */
		_pGridCellDataCopy.addGrid = function(grid, copyCallback, pasteCallback)
		{			
			//if (this.gfnIsNull(grid) || !this.scope.gfnIsXComponent(grid) || this.scope.gfnTypeOf(grid) != "Grid" )
			if (this.gfnIsNull(grid) || this.scope.gfnTypeOf(grid) != "Grid" )
			{
				trace("first argument named grid is type of Grid.");
				return;
			}
alert(1);
			grid.addEventHandler("onkeydown", this.copyGridCellData(this.scope), this.scope);
			grid.selectBackgroundHandler = [];
			
			if(!this.gfnIsNull(copyCallback) && (typeof(copyCallback) == "function")) {
				grid["copyCallback"] = copyCallback;
			}

			if(!this.gfnIsNull(pasteCallback) && (typeof(pasteCallback) == "function")) {
				grid["pasteCallback"] = pasteCallback;
			}
		};

		/**
		 * copy & paste 처리
		 * @param {object} pThis Link.CellDataCopy
		 */
		_pGridCellDataCopy.copyGridCellData = function(pThis)
		{
			//obj grid 
			//e key event object.
			return function(obj, e) {
				var keycode = e.keycode;

				//if(e.ctrlKey && !e.shiftKey && !e.altKey){
				  if(1==1){
					if(keycode == 67){
						var startrow = nexacro.toNumber(obj.selectstartrow),
							endrow   = nexacro.toNumber(obj.selectendrow),
							startcol = nexacro.toNumber(obj.selectstartcol),
							endcol   = nexacro.toNumber(obj.selectendcol);

						var checkIndex = {};

						obj.selectBackgroundHandler = [];

						pThis.targetGrid = undefined;

						var clipText = "";
						var colSeperator = pThis.colSeperator;
						for (var i = startrow; i <= endrow; i++) {
							var copyData = [];
							var styleData = [];

							for (var j = startcol; j <= endcol; j++) {
								var value = obj.getCellValue(i,j);
								copyData.push(value);

								if(!checkIndex[j]) {
									//this.setSelectBgInfo(obj, j);
									checkIndex[j] = 1;
								}

								if (j < endcol) {
									clipText += value + colSeperator;
								} else {
									clipText += value;
								}
							}
							clipText += "\r\n";
						}

						//clipText += "\r\n";

						this.targetGrid = obj;

						var ta = pThis._createTextarea(clipText);

						this.targetGrid["ta"] = ta;
trace("targetGrid1 : " +  this.targetGrid["ta"].value);
						//pThis.scope.setTimer(777, 100);

// 						if(pThis.useBlink && !pthis.gfnIsNull(clipText)) {
// 							pThis.scope.setTimer(1000, 110);
// 						}

						var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
						//pThis.notify("copy", obj, e, areaInfo);

						e.stopPropagation();

					} else if(keycode == 86) {
						this.targetGrid = obj;
						this.targetEvent = e;
						
// 						var ta = pThis._createTextarea('');
// 						pThis.targetGrid["ta"] = ta;
						
						this.setTimer(888, 1);
						

						
						e.stopPropagation();
					}
				}
			}
		};

		_pGridCellDataCopy.notify = function(type, grid, e, areaInfo)
		{
			if(type == "copy") {
				if(grid["copyCallback"]) {
					grid["copyCallback"](grid, e, areaInfo);
				}
			} else if(type == "paste") {
				if(grid["pasteCallback"]) {
					grid["pasteCallback"](grid, e, areaInfo);
				}
			}
		};

		_pGridCellDataCopy.setSelectBgInfo = function(grid, cellIndex)
		{
			var bgHandler = grid.selectBackgroundHandler;
			
			var type = "cell";

			//  nexacro.Style_background
			var selectBgValue ="";// grid.getCellProperty("Body", cellIndex, "selectbackground");
			
			if(this.gfnIsNull(selectBgValue)) {
				type = "body";
				
				//nexacro.Style_value
				selectBgValue = "";//this.getBandCurrentStyle(grid, "body", "selectbackground");
				selectBgValue = selectBgValue.toString();
				
			}

			selectBackground = "";//this.getStyleBackground(selectBgValue);
			var handler = "";//this.getSelectBackgroundHandler(type, grid, cellIndex);
			
			
			bgHandler.push({cellIndex:cellIndex, selectBackground: selectBackground, handler:handler});
		};

		_pGridCellDataCopy.getSelectBackgroundHandler = function(type, grid, cellIndex)
		{
			if(type == "cell") {
				return function(selectBg) {
					var value = selectBg.toString();
					//grid.setCellProperty( "Body", cellIndex, "selectbackground", value);
				};
				
			} else if(type == "body") {
				return function(selectBg) {
					var value = selectBg.toString();
					//grid.setBandProperty( "Body", "selectbackground", value);
				};
			}
		};

		/*
		 * style background 객체 반환
		 */
		_pGridCellDataCopy.getStyleBackground = function(value)	
		{
			var styleBackground = "";//new nexacro.Style_background();
			if(typeof(value) == "object") {
				styleBackground = value.clone();

			} else if(typeof(value) == "string") {
				//styleBackground._setValue(value);
			}

			return styleBackground;
		};

		_pGridCellDataCopy.getBandCurrentStyle = function(grid, band, propName)	
		{
			var bandObj = grid[band];

			//head나 summ이 없을 경우
			if(this.gfnIsNull(bandObj)) { 
				return "";
			}

			var value = bandObj["style"][propName];
			
			if(this.gfnIsNull(value)) {
				var ref_finder = bandObj.bandctrl._ref_css_finder;
				
				if(!ref_finder["normal"]){
					return null;
					
				} else if(ref_finder["normal"][propName]){
					return ref_finder["normal"][propName];
					
				} else {
					return null;
					
				}
			}

			return value;
		};	

		_pGridCellDataCopy.blinkTimerHandler = function(pThis)
		{
			return function(obj, e) {
				var timerid = e.timerid;
				obj.killTimer(timerid);
				//trace("[timerid] " + timerid);
				if(timerid >= 1000) {
					var remainder = timerid%1000;
					//trace("timerid="+timerid + ", remainder="+remainder);

					if(remainder < 9) {
						pThis.blinkSelectBg(pThis.blinkColor[remainder]);
						pThis.scope.setTimer(++timerid, pThis.blinkTime[remainder]);
						
					} else {
						pThis.blinkSelectBg(null);
						pThis.initBlinkData();
					}
				} else {
					if(timerid == 777) { //after copy
					
						//trace("timer after copy 호출 " + obj);
						var ta = this.targetGrid["ta"];
						trace("7771");
						if(!ta) return;
trace("7772");
						document.body.removeChild(ta);
						this.targetGrid["ta"] = undefined;

					} else if(timerid == 888) { //after paste
						//trace("timer after paste 호출 " +   obj);
						var ta = this.targetGrid["ta"];
						trace(ta);


						if(!ta) return;

						var clipText = ta.value;
						document.body.removeChild(ta);
						this.targetGrid["ta"] = undefined;
						alert(this.targetGrid["ta"]);
						this.pasteData(clipText);
						
					}
				}
			}
		};

		_pGridCellDataCopy.initBlinkData = function()
		{
			var grid   = this.targetGrid;
			grid.selectBackgroundHandler = [];
			grid.targetGrid = null;
		};
		
		_pGridCellDataCopy.pasteData = function(clipText)
		{
			var pThis = this;
			var obj = this.targetGrid;
			var e = this.targetEvent;
alert(this.targetGrid);
			obj.set_enableevent(false);
			obj.set_enableredraw(false); 

			var datasetName = obj.binddataset;
			//var ds = this.gfn_lookup(pThis.scope, datasetName);
			var ds = obj.getBindDataset();

			ds.set_enableevent(false); 

			var grdCellCount = obj.getCellCount("body");
			var rowCount = ds.getRowCount();
			var startrow = nexacro.toNumber(obj.selectstartrow),
				endrow   = nexacro.toNumber(obj.selectendrow),
				startcol = nexacro.toNumber(obj.selectstartcol),
				endcol   = nexacro.toNumber(obj.selectendcol);

			var currRow = startrow;
			var cellIndex = startcol;

			copyData = clipText;
			var seperator = pThis.colSeperator;

			var rowData = copyData.split(/[\n\f\r]/); 
			var rowDataCount = rowData.length - 1;
			var maxColumnCount = 0;
			var checkIndex = {};	

			for (var i = 0; i < rowDataCount; i++) {

				if(rowCount <= currRow)
				{
					ds.addRow();
				}

				var columnData = rowData[i].split(seperator);
				var columnLoopCount = cellIndex + columnData.length;

				if(columnLoopCount > grdCellCount) {
					columnLoopCount = grdCellCount;
				}

				if(maxColumnCount < columnLoopCount) {
					maxColumnCount = columnLoopCount;
				}

				var k = 0;
				for(var j = cellIndex; j < columnLoopCount; j++) {
					if(!checkIndex[j]) {
						//this.setSelectBgInfo(obj, j);

						checkIndex[j] = 1;
					}

					var colid = obj.getCellProperty("body", j, "text").substr(5);
					var tempValue = columnData[k];
					if(!this.gfnIsNull(tempValue) && tempValue != "undefined") //"undefined" <--- bug ???
					{
						ds.setColumn(currRow, colid, tempValue);
					}

					k++;
				}
				currRow++;
			}

			ds.rowposition = currRow;

			endrow = endrow + rowDataCount - 1;
			endcol = maxColumnCount - 1;

			if(!pThis.keepData) {
				pThis.clearClipboard();
			}

			obj.set_enableredraw(true);
			obj.set_enableevent(true);
			ds.set_enableevent(true); 

			obj.selectArea(startrow, startcol, endrow, endcol);

			if(pThis.useBlink) {
				pThis.scope.setTimer(1000, 50);
			}

			var areaInfo = {"startrow": startrow, "startcol": startcol, "endrow": endrow, "endcol": endcol};
			pThis.notify("paste", obj, e, areaInfo);

			pThis.targetEvent = undefined;
			e.stopPropagation();
		};
		
		_pGridCellDataCopy.gfnIsNull = function(sValue)
		{
			if (new String(sValue).valueOf() == "undefined") return true;
      if (sValue == null) return true;
      
      var ChkStr = new String(sValue);
  
      if (ChkStr == null) return true;
      if (ChkStr.toString().length == 0 ) return true;
      return false;
		};

		_pGridCellDataCopy.blinkSelectBg = function(color)
		{
			var grid   = this.targetGrid;
			var bgHandler = grid.selectBackgroundHandler;
			var len = bgHandler.length;

			var item,
				handler, 
				selectBackground,
				cloneBg;

			for(var i = 0; i < len; i++){
				item = bgHandler[i];
				selectBackground = item["selectBackground"];
				handler = item["handler"];

				if(color === null) {
					cloneBg = selectBackground;
				} else {
					cloneBg = selectBackground.clone();
					cloneBg.set_color(color);
				}

				handler(cloneBg);
			}
		};
	} // end of 'if (nexacro.GridCellDataCopy) )
}