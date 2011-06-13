(function($){
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
			$.extend(arr, ArrayExtensions);
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
			$.extend(arr, ArrayExtensions);
			for(var i = 0; i < Math.min(this.length, num); i++) {
				arr[i] = this[i];
			}
			return arr;
		},
		last : function (num) {
			var num = num || 1;
			var arr = [];
			$.extend(arr, ArrayExtensions);
			for(var i = 0; i < Math.min(this.length, num); i++) {
				arr[i] = this[this.length - 1 - i];
			}
			return arr;
		},
		toPercentages : function () {
			var arr = [];
			$.extend(arr, ArrayExtensions);
			var sum = this.sum();
			for(var i = 0; i < this.length; i++) {
				arr[i] = 100 * this[i] / sum;
			}
			return arr;
		}
	};
	$.extend(String.prototype, { toString : function () { return this; } });

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
		textColor:   	'666666',
		colors: 		['ff9daa','ffc000','007ec6','433840','6cc05c','ff710f','eD1f27','95a8ad','0053aa'],
		xAxisBoundaries:'auto',
		xAxisStep: 		'auto',
		axisTickSize: 	5,
		legendPosition: '',
		isStacked: 		false,
		isDistribution: false,
		barWidth: 		20,
		barSpacing: 	2,
		groupSpacing: 	10,
		imageClass: 	'',
		unit: 			'',
		labelType:      'none', // options are 'none', 'columnHeaders', 'rowHeaders'
		legendType:     'none' // options are 'none', 'distribution', 'sum', 'rowHeader', 'columnHeader', 'extended'
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
				table.attr('style', 'position: absolute; left: -9999px;');
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
				table.attr('style', 'position: absolute; left: -9999px;');
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
				table.attr('style', 'position: absolute; left: -9999px;');
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
				table.attr('style', 'position: absolute; left: -9999px;');
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
				var data = table.chartifyTableData({ isDistribution: true });
				var men = data.getColumnData('men').round(0)[0];
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
				table.attr('style', 'position: absolute; left: -9999px;');
			});
		}
	};

	function Chart() { }

	Chart.prototype.init = function (tableData, options) {
		this.table = tableData;
		this.options = options;

		this.width = this.options.chartWidth;
		this.height = this.options.chartHeight;

		this.params = {
			chs : '' + this.options.chartWidth + 'x' + this.options.chartHeight, // size
			chdlp : this.options.legendPosition, // legend position
			chdls : this.options.textColor + ',' + this.options.textSize, // legend style
			chma : '' + this.options.marginLeft + ',' + this.options.marginRight + ',' + this.options.marginTop + ',' + this.options.marginBottom + '|' + this.options.legendWidth + ',' + this.options.legendHeight, // margins
			chd : 't:' + this.table.toString(',', '|'), // data
			chco : this.options.colors.first(this.table.numColumns) // colors
		};

		this.initChartType();
		this.initLegend();
		this.initLabels();
	}

	Chart.prototype.initCaption = function () {
		if (this.options.showTitle) {
			this.params.chtt = this.table.getCaption();
		}
	}

	Chart.prototype.initChartType = function () {
		this.params.cht = 'p';
	}

	Chart.prototype.initLegend = function () {
		if (this.options.legendType != 'none') {
			var formatter = new LabelFormatter(this.table);
			var legend = formatter.format(this.options.legendType);
			this.params.chdl = legend.join('|');
		}
	}

	Chart.prototype.initLabels = function () {
		if (this.options.labelType != 'none') {
			var formatter = new LabelFormatter(this.table);
			var labels = formatter.formatColumns(this.options.labelType);
			this.params.chl = labels.join('|');
		}
	}

	Chart.prototype.getImageUrl = function (tableData, options) {
		this.init(tableData, options);
		return 'https://chart.googleapis.com/chart?' + serialize(this.params);
	}


	function PieChart() { }

	PieChart.prototype = new Chart();

	PieChart.prototype.init = function (tableData, options) {
		Chart.prototype.init.call(this, tableData, options);

		this.params.chp = this.options.pieChartRotation;
		this.params.chts = this.options.textColor + ',' + this.options.textSize; //legend style
	}


	function PieChart3d() { }

	PieChart3d.prototype = new PieChart();

	PieChart3d.prototype.initChartType = function () {
		this.params.cht = 'p3';
	}

	function BarChart() { }

	BarChart.prototype = new Chart();

	BarChart.prototype.init = function (tableData, options) {
		Chart.prototype.init.call(this, tableData, options);

		this.params.chxs = '0,' + this.options.textColor + ',' + this.options.textSize + ',0,lt,' + this.options.textColor + '|0,' + this.options.textColor + ',' + this.options.textSize + ',0,lt,'+ this.options.textColor;
		this.params.chxt = 'x,y'; //axis
		this.params.chxtc = '0,' + this.options.axisTickSize + '|1,' + this.options.axisTickSize; // tick style
		this.params.chbh = this.options.barWidth.toString() + ',' + this.options.barSpacing + ',' + this.options.groupSpacing; // bar width, spacing

		this.isGrouped = !this.options.isStacked && this.table.numRows > 1;
		this.initChartType(this.options);

		this.initDimensions();
		this.initAxes();
	}

	BarChart.prototype.initChartType = function () {
		this.params.cht = this.isGrouped ? 'bhg' : 'bhs';
	}

	BarChart.prototype.initLabels = function () {
		if (this.labelType != 'none') {
			var chm = '';
			for(var i = 0; i < this.table.numRows; i++) {
				if (i > 0) chm += '|';
				chm += 'N*0*' + this.options.unit + ',' + this.options.textColor + ',' + i + ',-1,' + this.options.textSize + ",0,r:-3:0";
			}
			this.params.chm = chm;
		}
	}

	BarChart.prototype.initLegend = function () {
		if (this.options.legendType === 'header') {
			this.params.chdl = this.table.getRowHeaders().join('|');
		} else if (this.options.legendType === 'sum') {
			this.params.chdl = this.table.getRowHeaders().join('|');
		} else if (this.options.legendType === 'percentage') {
			this.params.chdl = this.table.getRowHeaders().join('|');
		}
	}

	BarChart.prototype.initDimensions = function () {
		var numGroups = this.isGrouped ? this.table.numRows : 1;
		var groupHeight = this.options.barWidth * numGroups + this.options.barSpacing * (numGroups - 1);
		var showLegend = this.options.legendType != 'none';
		var numMargins = showLegend && this.options.legendPosition.match(/^(b|t)/) ? 2 : 1; // 1 margin if no legend at top/bottom, 2 otherwise.
		if (this.isGrouped) {
			this.height = groupHeight * this.table.numColumns + this.options.groupSpacing * (this.table.numColumns - 1) + numMargins * 20 + this.options.textSize;
		} else {
			this.height = this.table.numColumns * (groupHeight + this.options.barSpacing) - this.options.barSpacing + numMargins * 20 + this.options.textSize;
		}

		this.params.chs = '' + this.width + 'x' + this.height;
	}

	BarChart.prototype.initAxes = function () {
		var maxXValue, minXValue, xAxisStep;

		if (this.options.xAxisBoundaries == 'auto') {
			minXValue = 0;
			maxXValue = Math.round(this.table.getMax(this.options));
			var xAxisPadding = this.options.isStacked && this.options.isDistribution ? 0 : 1;
			xAxisStep = this.options.xAxisStep == 'auto' ? getAxisStep(minXValue, maxXValue) : this.options.xAxisStep;
			maxXValue += xAxisPadding * xAxisStep;
		} else {
			minXValue = this.options.xAxisBoundaries[0];
			maxXValue = this.options.xAxisBoundaries[1];
			xAxisStep = this.options.xAxisStep == 'auto' ? getAxisStep(minXValue, maxXValue) : this.options.xAxisStep;
		}

		var xAxisLabels = getAxisLabels(minXValue, maxXValue, xAxisStep);
		var yAxisLabels = this.table.getColumnHeaders().reverse();

		var xMax = xAxisLabels[xAxisLabels.length - 1];
		if (this.options.unit) xAxisLabels = xAxisLabels.appendEach(this.options.unit);
		this.params.chxl = '0:|' + xAxisLabels.join('|') + '|1:|' + yAxisLabels.join('|');  // labels

		this.params.chxr = '0,0,' + xMax + '|1,0,0'; // scale axis
		this.params.chds = '0,' + xMax; // scale chart
	}


	function VennDiagram() { }

	VennDiagram.prototype = new Chart();

	VennDiagram.prototype.initChartType = function () {
		this.params.cht = 'v';
	}

	VennDiagram.prototype.initLabels = function () {

	}

	VennDiagram.prototype.initLegend = function () {
		if (this.options.legendType === 'header') {
			this.params.chdl = this.table.getValueRowHeaders().round(1).appendEach(this.options.unit).join('|');
		} else if (this.options.legendType === 'sum') {
			this.params.chdl = this.table.getColumnHeaders().join('|');
		} else if (this.options.legendType === 'percentage') {
			this.params.chdl = this.table.getColumnHeaders().join('|');
		}
	}

	function LabelFormatter(tableData) {
		this.table = tableData;
		
		this.columnHeaders = tableData.getColumnHeaders();
		this.rowHeaders = tableData.getRowHeaders();
		this.sums = tableData.getColumnSums();
		this.distributions = tableData.getDistributionByRow();

		// d for distribution
		// l for literal
		// s for sum
		// r for row header
		// c for column header
		var knownFormats = {
			distribution : '{d}{l:%}',
			sum : '{s}',
			rowHeader : '{r}',
			columnHeader : '{c}',
			extended : '{d}{l:%} {l:$}{s}'
		};

		this.formatRows = function (patternName) {
			var results = [];
			var rowHeaders = tableData.getRowHeaders();
			var sums = tableData.getRowSums();
			var pattern = knownFormats[patternName] || knownFormats['rowHeader'];
			
			console.log('formatRows');
			return results;
		}
		
		var rowCustomFormatString = function (pattern, rowHeader, rowSum, rowDistribution) {
			var result = pattern;
			var regex = /{.?:?.*?}/g;
			var matches;
			while ((matches = regex.exec(pattern)) != null) {
				var parts = matches[0].replace('{', '').replace('}', '').split(':');
				if (parts.length == 2 && parts[0] === 'l') {
					result = result.replace(matches[0], parts[1]); // replace literal
				} else if (parts.length == 1) {
					if (parts[0] === 'r') {
						result = result.replace(matches[0], rowHeader);
					} else if (parts[0] === 'd') {
						result = result.replace(matches[0], columnDistribution);
					} else if (parts[0] === 's') {
						result = result.replace(matches[0], columnSum);
					} else if (parts[0] === 'c') {
						throw new SyntaxError(pattern + ' cannot contain "{c}" in row formatting.');
					}
				} else {
					throw new SyntaxError(pattern + ' is not a recognized format string.');
				}
			}
			return result;
		}

		this.formatColumns = function (patternName) {
			var results = [];
			var columnHeaders = tableData.getColumnHeaders();
			var sums = tableData.getColumnSums();
			var distribution = tableData.getDistributionByColumn().round(2);
			var pattern = knownFormats[patternName] || knownFormats['columnHeader'];
			
			for (var i = 0; i < this.table.numColumns; i++) {
				var result = columnCustomFormatString(pattern, columnHeaders[i], sums[i], distribution[i]);
				results.push(result);
			}
			return results;
		}
		
		var columnCustomFormatString = function (pattern, columnHeader, columnSum, columnDistribution) {
			var result = pattern;
			var regex = /{.?:?.*?}/g;
			var matches;
			while ((matches = regex.exec(pattern)) != null) {
				var parts = matches[0].replace('{', '').replace('}', '').split(':');
				if (parts.length == 2 && parts[0] === 'l') {
					result = result.replace(matches[0], parts[1]); // replace literal
				} else if (parts.length == 1) {
					if (parts[0] === 'r') {
						throw new SyntaxError(pattern + ' cannot contain "{r}" in column formatting.');
					} else if (parts[0] === 'd') {
						result = result.replace(matches[0], columnDistribution);
					} else if (parts[0] === 's') {
						result = result.replace(matches[0], columnSum);
					} else if (parts[0] === 'c') {
						result = result.replace(matches[0], columnHeader);
					}
				} else {
					throw new SyntaxError(pattern + ' is not a recognized format string.');
				}
			}
			return result;
		}
		

		this.format = function (patternName) {
			var pattern = knownFormats[patternName] || knownFormats['columnHeader'];
			return this.customFormat(pattern);
		}

		this.customFormat = function (pattern) {
			var results = [];
			var x = this.rowHeaders.length;
			var y = this.columnHeaders.length;
			// TODO: Mechanism for determining which axis to use.
			for (var i = 0; i < y; i++) {
				var result = customFormatString(pattern, this.columnHeaders[i], this.rowHeaders[i], this.sums[i], this.distributions[i]);
				results.push(result);
			}
			return results;
		}

		var customFormatString = function (pattern, columnHeader, rowHeader, sum, distribution) {
			var result = pattern;
			var regex = /{.?:?.*?}/g;
			var matches;
			while ((matches = regex.exec(pattern)) != null) {
				var parts = matches[0].replace('{', '').replace('}', '').split(':');
				if (parts.length == 2 && parts[0] === 'l') {
					result = result.replace(matches[0], parts[1]); // replace literal
				} else if (parts.length == 1) {
					if (parts[0] === 'r') {
						result = result.replace(matches[0], rowHeader);
					} else if (parts[0] === 'd') {
						result = result.replace(matches[0], distribution);
					} else if (parts[0] === 's') {
						result = result.replace(matches[0], sum);
					} else if (parts[0] === 'c') {
						result = result.replace(matches[0], columnHeader);
					}
				}
			}
			return result;
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

	function TableData (table, options) {
		var settings = {
			isStacked : false,
			isDistribution : false
		};
		if (options) {
			$.extend(settings, options);
		}
		this.table = $(table);
		this.caption = this.table.find('caption').html() || '';
		this.numRows = 0;
		this.numColumns = 0;
		this.rows = {};
		this.rowHeaders = [];
		this.columnHeaders = [];
		this.verboseColumnHeaders = {};
		this.initColumns();
		this.initRows(settings);
	}

	TableData.prototype.initColumns = function () {
		var tmpVerboseColumnHeaders = {};
		var tmpColumnHeaders = [];
		this.table.find('thead th').each(function(index, element) {
			var content = $(element).html();
			if (content.length > 0) {
				var abbr = $(element).attr('abbr');
				if (!abbr) abbr = content;
				tmpVerboseColumnHeaders[abbr] = content;
				tmpColumnHeaders.push(abbr);
			}
		});
		this.verboseColumnHeaders = tmpVerboseColumnHeaders;
		this.columnHeaders = tmpColumnHeaders;
		this.numColumns = this.columnHeaders.length;
		return this;
	}

	TableData.prototype.initRows = function (options) {
		var options = options || {};
		var tmpRows = {};
		var tmpRowHeaders = [];
		this.table.find('tbody tr').each(function (i, row) {
			var arr = [];
			$.extend(arr, ArrayExtensions);
			$(row).find('td').each(function(j, cell) {
				arr.push(parseFloat($(cell).html()));
			});
			if (!options.isStacked && options.isDistribution) {
				arr = arr.toPercentages();
			}
			var header = $(row).find('th').html() || 'data';
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
	}

	TableData.prototype.getColumnSums = function () {
		var arr = [];
		$.extend(arr, ArrayExtensions);
		for (var i = 0; i < this.numColumns; i++) arr.push(0);

		this.table.find('tbody tr').each(function (i, row) {
			$(row).find('td').each(function (j, cell) {
				var value = parseFloat($(cell).html());
				arr[j] += value;
			});
		});
		return arr;
	}

	TableData.prototype.getDistributionByColumn = function () {
		var arr = [];
		$.extend(arr, ArrayExtensions);
		var sums = this.getColumnSums();
		var total = sums.sum();
		for (var i = 0; i < this.numColumns; i++) arr.push((sums[i] / total) * 100);
		return arr;
	}

	TableData.prototype.getRowSums = function () {
		var arr = [];
		$.extend(arr, ArrayExtensions);
		this.table.find('tbody tr').each(function (i, row) {
			var sum = 0;
			$(row).find('td').each(function (j, cell) {
				var value = parseFloat($(cell).html());
				sum += value;
			});
			arr.push(sum);
		});
		return arr;
	}

	TableData.prototype.getDistributionByRow = function () {
		var arr = [];
		$.extend(arr, ArrayExtensions);
		var sums = this.getRowSums();
		var total = sums.sum();
		for (var i = 0; i < this.numRows; i++) arr.push((sums[i] / total) * 100);
		return arr;
	}

	TableData.prototype.toString = function (colSep, rowSep) {
		var arr = [];
		$.extend(arr, ArrayExtensions);
		for (var key in this.rows) {
			arr.push(this.rows[key].round(1).join(colSep));
		}
		return arr.join(rowSep);
	}

	TableData.prototype.getMax = function (options) {
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
	}

	TableData.prototype.getColumnHeaders = function () {
		return this.columnHeaders;
	}

	TableData.prototype.getRowHeaders = function () {
		return this.rowHeaders;
	}

	TableData.prototype.getValueRowHeaders = function () {
		return this.rows[this.rowHeaders[0]];
	}

	TableData.prototype.getColumnHeadersIndices = function () {
		var obj = {};
		for (var i = 0; i < this.numColumns; i++) {
			obj[this.columnHeaders[i]] = i;
		}
		return obj;
	}

	TableData.prototype.getColumnData = function (columnHeader) {
		for (var index = 0; index < this.numColumns; index++) {
			if (this.columnHeaders[index] == columnHeader) break;
		}
		var data = [];
		$.extend(data, ArrayExtensions);
		for (key in this.rows) {
			data.push(this.rows[key][index]);
		}
		return data;
	}

	TableData.prototype.getCaption = function () {
		return this.caption;
	}

	$.fn.chartify = function(method) {
		if (methods[method]) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' +  method + ' does not exist on jQuery.chartify');
		}
	};
	$.fn.chartifyTableData = function (options) {
		return new TableData($(this), options);
	};
})(jQuery);
