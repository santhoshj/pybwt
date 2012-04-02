/**
 * Cumulative map for the given text. For example, for input text
 * abracadabra$, the map would be 4a2b1c1d2r1$ . Supports queries like
 * getStart(char) and getEnd(char) which returns the start position and 
 * end position of char. For the above example, getStart('b') and getEnd('b')
 * would return 
 */
function getCumulativeMap(text) {
    var freq = {};
    for (var i=0; i < text.length; ++i) {
        var item = text[i];
        if (freq[item])
            freq[item] += 1;
        else
            freq[item] = 1;
    }
    var alphabet = _.keys(freq);
    alphabet = alphabet.sort(getSortFunction(function(a){return a;}));

    var ret = {}, cumulative = 0;
    _.each(alphabet, function(item) {
        ret[item] = {start:cumulative, end:cumulative + freq[item]};
        cumulative += freq[item];
    });
    return new CumulativeMap(ret);
}


/**
 * Simple DS for the cumulative counts of first column
 */
function CumulativeMap(cmap) {
    this.cumulativeMap = cmap; 
}

/**
 * Get start position of the given character. See doc above.
 */
CumulativeMap.prototype.getStart = function(el) {
    if (this.cumulativeMap[el])
        return this.cumulativeMap[el].start;
    else
        return -1;
};


/**
 * Get end position of the given character. See doc above.
 */
CumulativeMap.prototype.getEnd = function(el) {
    if (this.cumulativeMap[el])
        return this.cumulativeMap[el].end;
    else
        return -1;
};

/**
 * Check for presence of an alphabet
 */
CumulativeMap.prototype.contains = function(el) {
    if (this.cumulativeMap[el])
        return true;
    else
        return false;
};
