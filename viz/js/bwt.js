/**
 * Simple implementation of bwt index creation. Does a full sort of all
 * the suffixes and extracts bwt
 */
function getBWTIndex(text) {
    var cmap = getCumulativeMap(text);
    var suffixDetails  = new Array();
    for (var i=0; i < text.length; ++i) {
        var next = text.slice(i, text.length) + text.slice(0, i);
        suffixDetails.push({text : next, position : i});
    }
    var sortedSuffixDetails = suffixDetails.sort(getSortFunction(function(a){return a.text;}));
    var bwt = new Array(), suffixArray = new Array();
    _.each(sortedSuffixDetails, function(item) {
        bwt.push(item.text[item.text.length-1]);
        suffixArray.push(item.position);
    });
    var ranks = getRanks(bwt); 
    return new BWTIndex(bwt, suffixArray, cmap, ranks);
}

/**
 * Get rank of all alphabets at each row. Again a simple implementation
 * which stores rank at each row (instead of periodically)
 */
function getRanks(bwt) {
    var i = 0, ranks = new Array();
    var ranksMap = {};
    for (i=0; i<bwt.length; ++i)
        ranksMap[bwt[i]] = 0;
    for (i=0; i<bwt.length; ++i) {
        ranks.push(deepcopy(ranksMap));
        ranksMap[bwt[i]] += 1;
    }
    return ranks;
}

/**
 * BWT index DS
 */
function BWTIndex(bwt, suffixArray, cmap, ranks) {
    this.bwt = bwt;
    this.suffixArray = suffixArray;
    this.cmap = cmap;
    this.ranks = ranks;
}

BWTIndex.prototype.search = function(query) {
    var start, end;
    start = this.cmap.getStart(query[query.length-1]);
    end = this.cmap.getEnd(query[query.length-1]);

};

BWTIndex.prototype.start = function(alphabet) {
    if (!this.cmap.contains(alphabet))
        return null;
    return {start:this.cmap.getStart(alphabet), end:this.cmap.getEnd(alphabet)};
};

BWTIndex.prototype.advance = function(start, end, alphabet) {
    if ((start >= end) || !this.cmap.contains(alphabet))
        return null;
    var startRank = this.ranks[start][alphabet];
    var endRank = this.ranks[end][alphabet];
    var newStart = this.cmap.getStart(alphabet) + startRank;
    var newEnd = this.cmap.getStart(alphabet) + endRank;
    return {start:newStart, end:newEnd};
};

