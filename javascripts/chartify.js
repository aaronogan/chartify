(function( $ ){
	// do not worry: these are only applied to array instances, not to the Array class
	var ArrayExtensions = {
		max : function () {
			var max = parseFloat(this[0]);
			for(var i = 1; i < this.length; i++) {
				if (parseFloat(this[i]) > max) max = parseFloat(this[i]);
			}
			return max;
		},
		min : function () {
			var min = parseFloat(this[0]);
			for(var i = 1; i < this.length; i++) {
				if (parseFloat(this[i]) < min) min = parseFloat(this[i]);
			}
			return min;
		},
		sum : function () {
			var sum = 0;
			for(var i = 0; i < this.length; i++) {
				sum = sum + parseFloat(this[i]);
			}
			return sum;
		},
		range : function (min, max, step) {
			for (var i = min; min + i * step <= max; i++) {
				this[i] = min + i * step;
			}
			return this;
		},
		round : function (precision) {
			var precisionFactor = 1;
			for (var i = 0; i < precision; i++) {
				precisionFactor = precisionFactor * 10;
			}
			arr = [];
			jQuery.extend(arr, ArrayExtensions);
			for(var i = 0; i < this.length; i++) {
				arr[i] = Math.round(precisionFactor * this[i]) / precisionFactor;
			}
			return arr;
		},
		appendEach : function (str) {
			for(var i = 0; i < this.length; i++) {
				this[i] = this[i].toString() + str;
			}
			return this;
		},
		first : function (num) {
			var num = num || 1;
			var arr = [];
			jQuery.extend(arr, ArrayExtensions);
			for(var i = 0; i < Math.min(this.length, num); i++) {
				arr[i] = this[i];
			}
			return arr;
		},
		last : function (num) {
			var num = num || 1;
			var arr = [];
			jQuery.extend(arr, ArrayExtensions);
			for(var i = 0; i < Math.min(this.length, num); i++) {
				arr[i] = this[this.length - 1 - i];
			}
			return arr;
		},
		toPercentages : function () {
			var arr = [];
			jQuery.extend(arr, ArrayExtensions);
			var sum = this.sum();
			for(var i = 0; i < this.length; i++) {
				arr[i] = 100 * this[i] / sum;
			}
			return arr;
		}
	};
	jQuery.extend(String.prototype, { toString : function () { return this; } });
	
	// default global settings
	var settings = {
		chartWidth:  	496, // in pixels
		chartHeight: 	180,  // used when fixed height
		marginTop: 		0,
		marginRight: 	0,
		marginBottom: 	0,
		marginLeft: 	0,
		legendWidth: 	0,
		legendHeight: 	0,
		pieChartRotation: 0,
		
		textSize:		11,
		textColor:   	"666666",
		colors: 		["ff9daa","ffc000","007ec6","433840","6cc05c","ff710f","ED1F27","95a8ad","0053aa"],
		xAxisBoundaries:'auto',
		xAxisStep: 		'auto',
		axisTickSize: 	5,
		showLabels: 	true,
		showLegend: 	true,
		legendPosition: '',
		isStacked: 		false,
		isDistribution: false,
		barWidth: 		20,
		barSpacing: 	2,
		groupSpacing: 	10,
		imageClass: 	'',
		unit: 			'',
		legendType:     'none' // options are 'none', 'header', 'sum', or 'percentage'
	};
	
	var methods = {
		// getter / setter of global settings
		settings : function (options) {
			if (options) {
				$.extend(settings, options);
				return this.each(function(){});
			} else {
				return settings;
			}
		},
		pie : function (options) {
			var mySettings = getSettings(options);
			return this.each(function () {
				var table = $(this);
				var data = table.chartifyTableData({ isDistribution: mySettings.isDistribution });
				var chart = new PieChart();
				var imgUrl = chart.getImageUrl(data, mySettings);
				
				table.after('<img class="' + mySettings.imageClass + '" src="' + imgUrl + '" width="' + mySettings.chartWidth + '" height="' + mySettings.chartHeight + '" alt="" />');
				table.attr("style", "position: absolute; left: -9999px;");
			});
		},
		pie3d : function (options) {
			var mySettings = getSettings(options);
			return this.each(function () {
				var table = $(this);
				var data = table.chartifyTableData({ isDistribution: mySettings.isDistribution });
				var chart = new PieChart3d();
				var imgUrl = chart.getImageUrl(data, mySettings);
				
				table.after('<img class="' + mySettings.imageClass + '" src="' + imgUrl + '" width="' + mySettings.chartWidth + '" height="' + mySettings.chartHeight + '" alt="" />');
				table.attr("style", "position: absolute; left: -9999px;");
			});
		},
		bar : function (options) {
			var mySettings = getSettings(options);
			return this.each(function () {
				var table = $(this);
				var data = table.chartifyTableData({ isDistribution: mySettings.isDistribution });
				var chart = new BarChart();
				var imgUrl = chart.getImageUrl(data, mySettings);
				
				table.after('<img class="' + mySettings.imageClass + '" src="' + imgUrl + '" alt="" />');
				table.attr("style", "position: absolute; left: -9999px;");
			});
		},
		venn : function (options) {
			var mySettings = getSettings(options);
			return this.each(function () {
				var table = $(this);
				var data = table.chartifyTableData();
				var chart = new VennDiagram();
				var imgUrl = chart.getImageUrl(data, mySettings);
				
				table.after('<img class="' + mySettings.imageClass + '" src="' + imgUrl + '" width="' + mySettings.chartWidth + '" height="' + mySettings.chartHeight + '" alt="" />');
				table.attr("style", "position: absolute; left: -9999px;");
			});
		},
		gender : function (options) {
			var mySettings = getSettings(options);
			$.extend(mySettings, {
				chartWidth : 480,
				chartHeight: 200,
				numCols : 20,
				numRows : 5
			});
			return this.each(function (){
				var table = $(this);
				var data = table.chartifyTableData({isDistribution: true});
				var men = data.getColumnData("men").round(0)[0];
				var menCols = Math.round(men / mySettings.numRows);
				var menRemainder = men % mySettings.numRows;
				var womenCols = menRemainder == 0 ? mySettings.numCols - menCols : mySettings.numCols - menCols - 1;
				var womenRemainder = (100 - men) % mySettings.numRows;
				var colWidth = Math.round(mySettings.chartWidth / mySettings.numCols);
				var rowHeight = Math.round(mySettings.chartHeight / mySettings.numRows);
				var womenWidth = mySettings.chartWidth - colWidth * menCols;
				var menColor = "#" + mySettings.colors[0];
				var womenColor = "#" + mySettings.colors[1];
				var html = [];
				html.push('<div class="gender-map" style="position:relative;width:'+mySettings.chartWidth+'px;height:'+mySettings.chartHeight+'px">');
				html.push('<div class="men" style="position:absolute; left:0; background-color: '+menColor+'; top:0;width: '+colWidth*menCols+'px;height: '+mySettings.chartHeight+'px"></div>');
				if (menRemainder > 0) {
					womenWidth -= colWidth;
					html.push('<div class="men" style="position:absolute; background-color: '+menColor+';top: 0; left: '+colWidth*menCols+'px;width: '+colWidth+'px;height: '+ menRemainder * rowHeight + 'px"></div>');
					html.push('<div class="women" style="position:absolute; background-color: '+womenColor+'; top:'+menRest * rowHeight+'px; left: '+colWidth*menCols+'px;width :'+colWidth+'px;height :'+rowHeight*womenRemainder+'px"></div>');
				}
				html.push('<div class="women" style="position:absolute; background-color: '+womenColor+'; right:0; top: 0;width :'+womenWidth+'px;height :'+rowHeight*mySettings.numRows+'px"></div>');
				html.push('</div>');

				table.after(html.join(''));
				table.attr("style", "position: absolute; left: -9999px;");
			});
		}
	};
	
	function Chart() { }
	
	Chart.prototype = {
		init: function (tableData, options) {
			this.table = tableData;
			
			this.width = options.chartWidth;
			this.height = options.chartHeight;
			
			this.params = {
				chs : '' + options.chartWidth+'x' + options.chartHeight, // size
				chdlp : options.legendPosition, // legend position
				chdls : options.textColor + ',' + options.textSize, // legend style
				chma : '' + options.marginLeft + ',' + options.marginRight + ',' + options.marginTop + ',' + options.marginBottom + '|' + options.legendWidth + ',' + options.legendHeight, // margins
				chd : 't:' + this.table.toString(',', '|'), // data
				chco : options.colors.first(this.table.numColumns) // colors
			};
			
			this.initChartType(options);
			this.initLegend(options);
			this.initLabels(options);
		},
		initCaption: function (options) {
			if (options.showTitle) {
				this.params.chtt = this.table.getCaption();
			}
		},
		initChartType: function (options) {
			this.params.cht = 'p';
		},
		initLegend: function (options) {
			if (options.legendType === 'header') {
				this.params.chdl = this.table.getValueRowHeaders().round(1).appendEach(options.unit).join('|');
			} else if (options.legendType === 'sum') {
				this.params.chdl = this.table.getValueRowHeaders().round(1).appendEach(options.unit).join('|');
			} else if (options.legendType === 'percentage') {
				this.params.chdl = this.table.getValueRowHeaders().round(1).appendEach(options.unit).join('|');
			}
		},
		getImageUrl: function (tableData, options) {
			this.init(tableData, options);
			return 'http://chart.apis.google.com/chart?' + serialize(this.params);
		}
	};
	
	
	function PieChart() { }
	
	PieChart.prototype = new Chart();
	
	PieChart.prototype.init = function (tableData, options) {
		Chart.prototype.init.call(this, tableData, options);
		
		this.params.chp = options.pieChartRotation;
		this.params.chts = options.textColor + ',' + options.textSize; //legend style
	}
	
	PieChart.prototype.initLabels = function (options) {
		if (options.showLabels) {
			if (options.useHeadersForLegend) {
			
				if (options.displaySumAndPercentage) {
					var totals = this.table.getValueRowHeaders();
					var percentages = this.table.getValueRowHeaders().toPercentages().round(1);
					
					var labels = [];
					for(var i = 0; i < totals.length; i++) {
						labels[i] = percentages[i] + '% ' + options.unit + totals[i];
					}
					this.params.chl = labels.join('|');
				} else {
					this.params.chl = this.table.getValueRowHeaders().round(1).appendEach(options.unit).join('|');
				}
			} else {
				this.params.chl = this.table.getColumnHeaders().join('|');
			}
		}
	}
	
	
	function PieChart3d() { }
	
	PieChart3d.prototype = new PieChart();
	
	PieChart.prototype.initChartType = function (options) {
		this.params.cht = 'p3';
	}
	
	function BarChart() { }
	
	BarChart.prototype = new Chart();
	
	BarChart.prototype.init = function (tableData, options) {
		Chart.prototype.init.call(this, tableData, options);
		
		this.params.chxs = '0,' + options.textColor + ',' + options.textSize + ',0,lt,' + options.textColor + '|0,' + options.textColor + ',' + options.textSize + ',0,lt,'+ options.textColor; //
		this.params.chxt = 'x,y'; //axis
		this.params.chxtc = '0,' + options.axisTickSize + '|1,' + options.axisTickSize; // tick style
		this.params.chbh = options.barWidth.toString() + ',' + options.barSpacing + ',' + options.groupSpacing; // bar width, spacing
		
		this.isGrouped = !options.isStacked && this.table.numRows > 1;
		this.initChartType(options);
		
		this.initDimensions(options);
		this.initAxes(options);
	}
	
	BarChart.prototype.initChartType = function (options) {
		this.params.cht = this.isGrouped ? 'bhg' : 'bhs';
	}
	
	BarChart.prototype.initLabels = function (options) {
		if (options.showLabels) {
			var chm = '';
			for(var i = 0; i < this.table.numRows; i++) {
				if (i > 0) chm += '|';
				chm += 'N*0*' + options.unit + ',' + options.textColor + ',' + i + ',-1,' + options.textSize + ",0,r:-3:0";
			}
			this.params.chm = chm;
		}
	}
	
	BarChart.prototype.initLegend = function (options) {
		if (options.legendType === 'header') {
			this.params.chdl = this.table.getRowHeaders().join('|');
		} else if (options.legendType === 'sum') {
			this.params.chdl = this.table.getRowHeaders().join('|');
		} else if (options.legendType === 'percentage') {
			this.params.chdl = this.table.getRowHeaders().join('|');
		}
	}
	
	BarChart.prototype.initDimensions = function (options) {
		var numGroups = this.isGrouped ? this.table.numRows : 1;
		var groupHeight = options.barWidth * numGroups + options.barSpacing * (numGroups - 1);
		var numMargins = options.showLegend && options.legendPosition.match(/^(b|t)/) ? 2 : 1; // 1 margin if no legend at top/bottom, 2 otherwise.
		if (this.isGrouped) {
			this.height = groupHeight * this.table.numColumns + options.groupSpacing * (this.table.numColumns - 1) + numMargins * 20 + options.textSize;
		} else {
			this.height = this.table.numColumns * (groupHeight + options.barSpacing) - options.barSpacing + numMargins * 20 + options.textSize;
		}
		
		this.params.chs = '' + this.width + 'x' + this.height;
	}
	
	BarChart.prototype.initAxes = function (options) {
		var maxXValue, minXValue, xAxisStep;
		
		if (options.xAxisBoundaries == 'auto') {
			minXValue = 0;
			maxXValue = Math.round(this.table.getMax(options));
			var xAxisPadding = options.isStacked && options.isDistribution ? 0 : 1;
			xAxisStep = options.xAxisStep == 'auto' ? getAxisStep(minXValue, maxXValue) : options.xAxisStep;
			maxXValue += xAxisPadding * xAxisStep;
		} else {
			minXValue = options.xAxisBoundaries[0];
			maxXValue = options.xAxisBoundaries[1];
			xAxisStep = options.xAxisStep == 'auto' ? getAxisStep(minXValue, maxXValue) : options.xAxisStep;
		}
		
		var xAxisLabels = getAxisLabels(minXValue, maxXValue, xAxisStep);
		var yAxisLabels = this.table.getColumnHeaders().reverse();

		var xMax = xAxisLabels[xAxisLabels.length - 1];
		if (options.unit) xAxisLabels = xAxisLabels.appendEach(options.unit);
		this.params.chxl = '0:|' + xAxisLabels.join('|') + '|1:|' + yAxisLabels.join('|');  // labels

		this.params.chxr = '0,0,' + xMax + '|1,0,0'; // scale axis
		this.params.chds = '0,' + xMax; // scale chart
	}
	
	
	function VennDiagram() { }
	
	VennDiagram.prototype = new Chart();
	
	VennDiagram.prototype.init = function (tableData, options) {
		Chart.prototype.init.call(this, tableData, options);
	}
	
	VennDiagram.prototype.initChartType = function (options) {
		this.params.cht = 'v';
	}
	
	VennDiagram.prototype.initLabels = function (options) {
		
	}
	
	VennDiagram.prototype.initLegend = function (options) {
		if (options.legendType === 'header') {
			this.params.chdl = this.table.getValueRowHeaders().round(1).appendEach(options.unit).join('|');
		} else if (options.legendType === 'sum') {
			this.params.chdl = this.table.getColumnHeaders().join('|');
		} else if (options.legendType === 'percentage') {
			this.params.chdl = this.table.getColumnHeaders().join('|');
		}
	}
	
	
	function getAxisLabels (minValue, maxValue, step) {
		var arr = [];
		$.extend(arr, ArrayExtensions);
		return arr.range(minValue, maxValue, step);
	}
	// TODO: actually write this function
	function getAxisStep (minValue, maxValue) {
		var range = maxValue - minValue;
		if (range <= 60) {
			return 5;
		} else if (range <= 120) {
			return 10;
		} else {
			return 25;
		}
	}
	function serialize (obj) {
		var str = [];
		for (var p in obj)
		str.push(p + "=" + encodeURIComponent(obj[p]));
		return str.join("&");
	}
	function getSettings(options) {
		var s = $.extend({}, settings);
		if (options) {
			$.extend(s, options);
		}
		$.extend(s.colors, ArrayExtensions);
		return s;
	}
	function tableData (table, options) {
		var settings = {
			isStacked : false,
			isDistribution : false
		};
		if (options) { 
			$.extend(settings, options);
		}
		this.table = $(table);
		this.caption = this.table.find("caption").html() || '';
		this.numRows = 0;
		this.numColumns = 0;
		this.rows = {};
		this.rowHeaders = [];
		this.columnHeaders = [];
		this.verboseColumnHeaders = {};
		this.initColumns();
		this.initRows(settings);
	}
	tableData.prototype = {
		initColumns: function () {
	    	var tmpVerboseColumnHeaders = {};
			var tmpColumnHeaders = [];
			this.table.find("thead th").each(function(index, element) {
				var content = $(element).html();
				if (content.length > 0) {
					var abbr = $(element).attr("abbr");
					if (!abbr) abbr = content;
					tmpVerboseColumnHeaders[abbr] = content;
					tmpColumnHeaders.push(abbr);
				}
			});
			this.verboseColumnHeaders = tmpVerboseColumnHeaders;
			this.columnHeaders = tmpColumnHeaders;
			this.numColumns = this.columnHeaders.length;
			return this;
		},
		initRows: function (options) {
			var options = options || {};
			var tmpRows = {};
			var tmpRowHeaders = [];
			this.table.find("tbody tr").each(function (i, row) {
				var arr = [];
				jQuery.extend(arr, ArrayExtensions);
				$(row).find("td").each(function(j, cell) {
					arr.push(parseFloat($(cell).html()));
				});
				if (!options.isStacked && options.isDistribution) {
					arr = arr.toPercentages();
				}
				var header = $(row).find("th").html() || 'data';
				tmpRowHeaders.push(header);
				tmpRows[header] = arr;
			});
			if (options.isStacked && options.isDistribution) {
				for (var col = 0; col < this.numColumns; col++) {
					var sum = 0;
					for(var row = 0; row < tmpRowHeaders.length; row++) {
						sum += tmpRows[tmpRowHeaders[row]][col];
					}
					for(var row = 0; row < tmpRowHeaders.length; row++) {
						tmpRows[tmpRowHeaders[row]][col] = 100 * tmpRows[tmpRowHeaders[row]][col] / sum;
					}
				}
			}
			this.rowHeaders = tmpRowHeaders;
			this.rows = tmpRows;
			this.numRows = this.rowHeaders.length;
			return this;
		},
		toString: function (colSep, rowSep) {
			var arr = [];
			jQuery.extend(arr, ArrayExtensions);
			for (var key in this.rows) {
				arr.push(this.rows[key].round(1).join(colSep));
			}
			return arr.join(rowSep);
		},
		getMax: function (options) {
			var options = options || {};
			if (options.isStacked) {
				var globalMax = 0;
				for (var i = 0; i < this.numColumns; i++) {
					var sum = 0;
					for (var key in this.rows) {
						sum += this.rows[key][i];
					}
					if (sum > globalMax) globalMax = sum;
				}
				return globalMax;
			} else {
				var i = 0;
				var globalMax;
				for (var key in this.rows) {
					var localMax = this.rows[key].max();
					if (i == 0) {
						globalMax = localMax;
					} else if (localMax > globalMax) {
						globalMax = localMax;
					}
					i++;
				}
				return globalMax;
			}
		},
		getColumnHeaders: function () {
			return this.columnHeaders;
		},
		getRowHeaders: function () {
			return this.rowHeaders;
		},
		getValueRowHeaders: function () {
			return this.rows[this.rowHeaders[0]];
		},
		getColumnHeadersIndices: function () {
			var obj = {};
			for (var i = 0; i < this.numColumns; i++) {
				obj[this.columnHeaders[i]] = i;
			}
			return obj;
		},
		getColumnData: function (columnHeader) {
			for (var index = 0; index < this.numColumns; index++) {
				if (this.columnHeaders[index] == columnHeader) break;
			}
			var data = [];
			jQuery.extend(data, ArrayExtensions);
			for (key in this.rows) {
				data.push(this.rows[key][index]);
			}
			return data;
		},
		getCaption: function () {
			return this.caption;
		}
	};
	$.fn.chartify = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.chartify' );
		}    
	};
	$.fn.chartifyTableData = function (options) {
		return new tableData($(this), options);
	};
})(jQuery);