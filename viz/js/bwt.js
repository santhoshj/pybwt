$(document).ready(function(){
    var text = "abracadabra$";
    var query = "cad";

    var suffixes = getSuffixes(text);

    bwtViewer = new BWTViewer("bwt");
    bwtViewer.load(suffixes);

});

/**
 * Get sorted suffixes of the given text
 * Special handling is done for the character '$'. It is treated as the highest
 * character lexicographically.
 */
function getSuffixes(text) {
    var suffixes = new Array();
    // Collect all suffixes
    for (var i=0; i<text.length; ++i) {
        var next = text.slice(i, text.length) + text.slice(0, i);
        suffixes.push(next);
    }
    var sortedSuffixes = suffixes.sort(function(a, b) {
        // Sort logic to use if one the chars is $
        var customCompare = function(chr1, chr2) {
            if (chr1 === '$')
                return 1;
            else
                return -1;
        };
        // Default sort logic
        var defaultCompare = function(chr1, chr2) {
            if (chr1 < chr2)
                return -1;
            else
                return 1;
        };
        var length = a.length;
        for (var i=0; i < length; ++i) {
            var ac = a[i], bc = b[i];
            if (ac === bc)
                continue;
            if (ac === '$' || bc === '$') {
                return customCompare(ac, bc);
            } else {
                return defaultCompare(ac, bc);
            }
        }
        return 0;
    });
    return sortedSuffixes;
}

function BWTViewer(divID) {
    this.div = $('#' + divID);
    this.paper = Raphael(divID, this.div.width(), this.div.height());
    this.suffixGrid = new SuffixGrid(this.paper);
}

BWTViewer.prototype.load = function(suffixes) {
    var size = this.suffixGrid.getSize(suffixes.length, suffixes[0].length);
    this.div.height(size.height);
    this.div.width(size.width);
    this.paper.setSize(size.width, size.height);
    this.suffixGrid.load(suffixes);
};


function SuffixGrid(paper){
    this.paper = paper;
    this.textSize = 20;
    this.cellPadding = 4;
    this.padding = 10;
    this.cellWidth = 30;
}

SuffixGrid.prototype.load = function(suffixes) {
    var i,j;
    this.rowCount = suffixes.length;
    this.colCount = suffixes[0].length;
    var grid = new Array();
    // Load the text
    for (i=0; i < this.rowCount ; ++i) {
        var row = new Array();
        for (j=0; j < this.colCount ; ++j) {
            var next = suffixes[i][j];
            var pos = this.getTextPostion(i, j);
            var text = this.paper.text(pos.x, pos.y, next);
            text.attr({
                "font-size" : this.textSize,
                "text-anchor" : "middle"
            });
            row.push(text);
        }
        grid.push(row);
    }
    // Rectangles
    // First column
    var firstColumn = this.drawRectangles(0, "yellow");
    // BWT column (Last column)
    var xPos = this.cellWidth * (this.rowCount-1);
    var bwtColumn = this.drawRectangles(xPos, "red");
    var cellHeight = this.getTextItemHeight();
    // Create start and end markers
    var lineAttrs = {
        stroke : 'green',
        "stroke-width" : 5
    };
    
    this.startLine = this.paper.path(this.getPathString(0));
    this.startLine.attr(lineAttrs);
    
    this.endLine = this.paper.path(this.getPathString(this.rowCount*cellHeight));
    this.endLine.attr(lineAttrs);
};


SuffixGrid.prototype.setRange = function(start, end) {
    var cellHeight = this.getTextItemHeight();
    
    var startPath = this.getPathString(start*cellHeight);
    var endPath = this.getPathString(end*cellHeight);
    this.startLine.animate({path: startPath}, 1000);
    this.endLine.animate({path: endPath}, 1000);
};

SuffixGrid.prototype.getPathString = function(y) {
    return "M0,"+ y + "L"+ this.colCount*this.cellWidth + "," + y;
};

SuffixGrid.prototype.drawRectangles = function(xPos, color) {
    var col = new Array();
    var cellHeight = this.getTextItemHeight();
    for (var i=0; i < this.rowCount; ++i) {
        var y = cellHeight * i;
        var rect = this.paper.rect(xPos, y, this.cellWidth, cellHeight);
        rect.attr({
            fill : color,
            opacity : 0.3
        });
        col.push(rect);
    }
    return col;
};

SuffixGrid.prototype.getTextPostion = function(i, j) {
    var cellHeight = this.getTextItemHeight();
    var y = cellHeight * i + cellHeight/2;
    var x = this.cellWidth * j + this.cellWidth/2;
    return {x:x, y:y};
};

SuffixGrid.prototype.getTextItemHeight = function() {
    return this.textSize + 2*this.cellPadding;
};

SuffixGrid.prototype.getSize = function(rowCount, colCount) {
    var height = this.getTextItemHeight() * rowCount;
    var width = this.cellWidth * colCount;
    return {
        width : width,
        height : height
    };
};

