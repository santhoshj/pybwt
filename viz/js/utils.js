/**
 * Custom text compare function generator. Special handling for the 
 * character '$'. It is treated as the lexicographically largest character.
 * Takes a function to access the text portion of an element in the array
 * that needs to be sorted.
 */
function getSortFunction(getText) {
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

    return function(a, b) {
        var aText = getText(a);
        var bText = getText(b);
        var length = aText.length;
        for (var i=0; i < length; ++i) {
            var ac = aText[i], bc = bText[i];
            if (ac === bc)
                continue;
            if (ac === '$' || bc === '$') {
                return customCompare(ac, bc);
            } else {
                return defaultCompare(ac, bc);
            }
        }
        return 0;
    };
}

/**
 * Utility to do a deep copy of a map.
 * Works if the values of the sourceMap are primitives.
 */
function deepcopy(sourceMap) {
    var ret = {};
    for (var i in sourceMap) {
        ret[i] = sourceMap[i];
    }
    return ret;
}

/**
 * Get all suffixes of the given text in sorted order
 * Used for showing in the grid view
 */
function getSortedSuffixes(text) {
    var suffixes = new Array();
    for (var i=0; i < text.length; ++i) {
        suffixes.push(text.slice(i, text.length) + text.slice(0, i));
    }
    return suffixes.sort(getSortFunction(function(a){return a;}));
}
