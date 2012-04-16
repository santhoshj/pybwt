/**
 * Suffix grid - suffix array + all suffixes grid + tooltip for
 * indicating rank
 */
function SuffixGrid(paper, x, y, width, height) {
    this.paper = paper;
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
}

/**
 * Load text to search on
 */
SuffixGrid.prototype.loadText = function(suffixes, suffixArray, ranks) {
    this.ranks = ranks;
    this.recomputeParams(suffixes.length);
    this.drawSuffixArray(suffixArray);
    this.drawSuffixGrid(suffixes);
    this.highLightColumns(suffixes.length);
    this.startRank = null;
    this.startRankText = null;
    this.endRank = null;
    this.endRankText = null;
};

/**
 * Based on the text provided, recompute the view params like cell width, height, etc
 */
SuffixGrid.prototype.recomputeParams = function(textLength) {
    this.cellHeight = this.height/textLength;
    // Width is distributed among three elements, suffixArray, grid and tooltip for ranks
    // suffixarray first, then one cell width gap and then grid followed by tooltip which
    // is 2*cellWidth
    this.cellWidth = this.width/(1+1+textLength);
};

/**
 * Draw the suffix array column
 */
SuffixGrid.prototype.drawSuffixArray = function(suffixArray) {
    var x = this.x;
    for (var i=0; i < suffixArray.length; ++i) {
        var y = this.y + i*this.cellHeight;
        var rect = this.paper.rect(x, y, this.cellWidth, this.cellHeight);
        rect.attr({
            "fill" : 'lightgrey',
            "opacity" : 0.3
        });
        var text = this.paper.text(x+this.cellWidth/2, y+this.cellHeight/2, suffixArray[i]);
        text.attr({
            "font-size" : this.cellHeight/1.5,
            "text-anchor" : "middle"
        });
    }
};

/**
 * Draw the suffix grid
 */
SuffixGrid.prototype.drawSuffixGrid = function(suffixes) {
    var startX = this.x + 2*this.cellWidth;
    var startY = this.y;
    for (var i=0; i < suffixes.length; ++i) {
        for (var j=0; j < suffixes[0].length; ++j) {
            var x = startX + j*this.cellWidth;
            var y = startY + i*this.cellHeight;
            var rect = this.paper.rect(x, y, this.cellWidth, this.cellHeight);
            rect.attr({
                "fill" : 'lightgrey',
                "opacity" : 0.3
            });
            var text = this.paper.text(x+this.cellWidth/2, y+this.cellHeight/2, suffixes[i][j]);
            text.attr({
                "font-size" : this.cellHeight/1.5,
                "text-anchor" : "middle"
            });
        }
    }
};

/**
 * Highlight the important columns using special colors.
 * Suffix array, first column of suffix grid and the bwt column
 * are highlighted
 */
SuffixGrid.prototype.highLightColumns = function(textLength) {
    // Suffix array
    var suffixArray = this.paper.rect(this.x, this.y, this.cellWidth, this.cellHeight * textLength);
    suffixArray.attr({
        fill : "orange",
        opacity : 0.3
    });

    // First column 
    var firstCol = this.paper.rect(this.x+this.cellWidth*2, this.y, 
                    this.cellWidth, this.cellHeight * textLength);
    firstCol.attr({
        fill : "green",
        opacity : 0.3
    });

    // BWT column
    var bwtCol = this.paper.rect(this.x+this.cellWidth*2+this.cellWidth*(textLength-1), 
                    this.y, this.cellWidth, this.cellHeight * textLength);
    bwtCol.attr({
        fill : "red",
        opacity : 0.3
    });

};

SuffixGrid.prototype.setRange = function(start, end, callback) {
    if (!this.rangeRect) {
        this.rangeRect = this.paper.rect(this.x,this.y,this.width,0);
        this.rangeRect.attr({
            fill : "blue",
            opacity : 0.3
        });
    }

    var x = this.x;
    var y = this.y + start * this.cellHeight;
    var width = this.width;
    var height = (end - start) * this.cellHeight;
    this.rangeRect.animate({
        x : x,
        y : y,
        width : width,
        height : height
    }, 1000, callback);
};

/**
 * Show rank as a tooltip
 */
SuffixGrid.prototype.showRanks = function(start, end, alph) {
    if (this.startRank === undefined || this.startRank === null) {
        this.startRankText = this.paper.text(10, 10, "Rank of  xx : yy  ");
        this.startRank = this.paper.popup(this.x + this.width, this.y + this.cellWidth/2, this.startRankText, "right");
        this.startRank.prevY = this.y;
    }

    if (this.endRank === undefined || this.endRank === null) {
        this.endRankText = this.paper.text(10, 10, "Rank of xx : yy  ");
        this.endRank = this.paper.popup(this.x + this.width, this.y + this.cellWidth/2, this.endRankText, "right"); 
        this.endRank.prevY = this.y;
    }
    console.log("Start bbox x: " + this.startRankText.getBBox().x + " y: " + this.startRankText.getBBox().y);
    var startRank = this.ranks[start][alph];
    if (startRank !== undefined)
        this.startRankText.attr("text", "Rank of "+ alph + " : " + startRank);
    else
        this.startRankText.attr("text", alph + " not present");
    var endRank = this.ranks[end][alph];
    if (endRank !== undefined)
        this.endRankText.attr("text", "Rank of "+ alph + " : " + endRank);
    else
        this.endRankText.attr("text", alph + " not present");
    
    this.startRank.translate(0, this.y+this.cellHeight*start - this.startRank.prevY, 1000);
    this.endRank.translate(0, this.y+this.cellHeight*end - this.endRank.prevY);
    
    this.startRankText.translate(0, this.y+this.cellHeight*start - this.startRank.prevY);
    this.endRankText.translate(0, this.y+this.cellHeight*end - this.endRank.prevY);
    
    this.startRank.prevY = this.y+this.cellHeight*start;
    this.endRank.prevY = this.y+this.cellHeight*end;
};

/**
 * View for showing the text that is searched. Indicates the search results after search is complete.
 */
function Text(paper, x, y, width, height) {
    this.paper = paper;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}

/**
 * Load text to show
 */
Text.prototype.loadText = function(text) {
    this.recomputeParams(text.length);
    this.drawText(text);
};

/**
 * Recompute params based on text loaded
 */
Text.prototype.recomputeParams = function(textLength) {
    this.cellWidth = this.width/textLength;
    this.cellHeight = this.height;
    this.active = new Array();
};

Text.prototype.drawText = function(text) {
    for (var i=0; i < text.length; ++i) {
        var x = this.x + i*this.cellWidth;
        var rect = this.paper.rect(x, this.y, this.cellWidth, this.cellHeight);
        rect.attr({
            fill : 'yellow',
            opacity : 0.3
        });
        var textEl = this.paper.text(x+this.cellWidth/2, this.y + this.cellHeight/2, text[i]);
        textEl.attr({
            "font-size" : this.cellHeight/1.5,
            "text-anchor" : "middle"
        });
    }
};

Text.prototype.setActive = function(item) {
    this.clearActive();
    var x = this.x  + this.cellWidth * item;
    var rect = this.paper.rect(x, this.y, this.cellWidth, this.cellHeight);
    rect.attr({
        fill : 'red',
        opacity : 0.2
    });
    this.active.push(rect);
};

Text.prototype.setActiveAll = function(items, color) {
    this.clearActive();
    for (var i=0; i < items.length; ++i) {
        var x = this.x  + this.cellWidth * items[i];
        var rect = this.paper.rect(x, this.y, this.cellWidth, this.cellHeight);
        rect.attr({
            fill : color,
            opacity : 0.2
        });
        this.active.push(rect);
    }
};


Text.prototype.clearActive = function() {
    for (var i=0; i < this.active.length; ++i)
        this.active[i].remove();
    this.active = new Array();
};

/**
 * The main view. combines all the views above
 */
function BWTView(divID) {
    var div = $('#' + divID);
    this.width = div.width();
    this.height = div.height();
    this.paper = Raphael(divID, div.width(), div.height());
    this.padding = 10;
    this.rightPadding = 100;
}

BWTView.prototype.clear = function() {
    this.paper.clear();
};

BWTView.prototype.load = function(text, suffixes, suffixArray, ranks) {
    this.clear();
    this.cellHeight = (this.height-2*this.padding)/(1 + 1 + text.length + 1 + 1);
    this.loadText(text);
    this.loadGrid(suffixes, suffixArray, ranks);
};

BWTView.prototype.loadText = function(text) {
    var x = this.padding;
    var y = this.padding;
    var width = this.width - this.padding - this.rightPadding;
    var height = this.cellHeight;
    
    this.text = new Text(this.paper, x, y, width, height);
    this.text.loadText(text);
};

BWTView.prototype.loadGrid = function(suffixes, suffixArray, ranks) {
    var x = this.padding;
    var y = this.padding + 2*this.cellHeight;
    var width = this.width - this.padding - this.rightPadding;
    var height = this.cellHeight*suffixes.length;
    this.grid = new SuffixGrid(this.paper, x, y, width, height);
    this.grid.loadText(suffixes, suffixArray, ranks);
};

BWTView.prototype.loadQuery = function(query) {
    var cellWidth = 30;
    var width = cellWidth * query.length;
    var height = this.cellHeight;

    var x = this.padding + (this.width - 2*this.padding - width)/2;
    var y = this.padding + 3 * this.cellHeight + this.grid.height;
    this.query = new Text(this.paper, x, y, width, height);
    this.query.loadText(query);
};
