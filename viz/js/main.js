/**
 * Main driver which combines the view and the algorithm
 * Lots of global variables here :( (because of the animate, callback loop)
 */
$(document).ready(function() {
    bwtView = new BWTView("bwt");
    loadText("abracadabra$");
    loadQuery("ada");
    $('#play').click(playhandler);
    $('#step').click(stephandler);
    $('#submit').click(submithandler);
});

/**
 * Load text to search
 */
function loadText(text) {
    $('#status').html("");
    bwtIndex = getBWTIndex(text);
    bwtView.loadText(text);
    var suffixes = getSortedSuffixes(text);
    var suffixArray = this.bwtIndex.suffixArray;
    var ranks = this.bwtIndex.ranks;
    bwtView.load(text, suffixes, suffixArray, ranks);
}

/**
 * Load query
 */
function loadQuery(q) {
    $('#status').html("");
    query = q;
    bwtView.loadQuery(q);
    queryPosition = q.length - 1;
}

/**
 * Handler for the play button
 */
function playhandler() {
    // disable play and step till play is complete
    $('#play').attr('disabled', true);
    $('#step').attr('disabled', true);
    if (queryPosition === query.length -1) {
        startSearch(true);
    } else {
        advance(true);
    }
}

/**
 * Handler for the step button
 */
function stephandler() {
    if (queryPosition === query.length -1) {
        startSearch(false);
    } else {
        delayedAdvance(false);
    }
}

/**
 * Start searching. play indicates if the mode is play or not.
 * If play is true, animation will happen
 */
function startSearch(play) {
    $("#status").html("");
    var next = query[queryPosition];
    bwtView.query.setActive(queryPosition);
    range = bwtIndex.start(next);
    if (range === null) {
        searchFailed();
    }else {
        queryPosition = queryPosition - 1;
        if (play)
            bwtView.grid.setRange(range.start, range.end, delayedAdvance);
        else
            bwtView.grid.setRange(range.start, range.end);
    }
}

/**
 * Perform a delayed advance to the next alphabet
 */
function delayedAdvance(play) {
    if (play === undefined || play === null)
        play = true;
    if (queryPosition >= 0)
        bwtView.grid.showRanks(range.start, range.end-1, query[queryPosition]);
    setTimeout(function() {
        advance(play);
    }, 1000);
}

/**
 * Search for the next character in the query.
 * If all characters are done, call searchSuccess. If any call returns a null range,
 * call searchFailed.
 */
function advance(play) {
    if (queryPosition === -1) {
        searchSuccess();
        return;
    }
    var next = query[queryPosition];
    bwtView.query.setActive(queryPosition);
    range = bwtIndex.advance(range.start, range.end, next);
    if (range === null) {
        searchFailed();
    }else {
        queryPosition = queryPosition - 1;
        if (play)
            bwtView.grid.setRange(range.start, range.end, delayedAdvance);
        else
            bwtView.grid.setRange(range.start, range.end);
    }
}

/**
 * Handler when search fails
 */
function searchFailed() {
    $('#status').html("Query not found");
    $('#status').css('color', 'red');
    queryPosition = query.length - 1;
    enableButtons();
}

/**
 * Handler when search succeeds
 */
function searchSuccess() {
    var results = range.end - range.start;
    if (results === 1)
        $('#status').html("Found " + (range.end-range.start) + " result");
    else
        $('#status').html("Found " + (range.end-range.start) + " results");
    $('#status').css('color', 'green');
    queryPosition = query.length - 1;
    var resultPositions = new Array();
    for (var i=range.start; i < range.end; ++i) {
        resultPositions.push(bwtIndex.suffixArray[i]);
    }
    bwtView.text.setActiveAll(resultPositions, 'green');
    enableButtons();
}

/**
 * Enable the play and step buttons
 */
function enableButtons() {
    $('#play').attr('disabled', false);
    $('#step').attr('disabled', false);
}

/**
 * Handler when submit button is clicked. Loads the values from the text
 * and query inputs to the viz
 */
function submithandler() {
    var text = $('#inptext').val();
    var query = $('#query').val();
    if (text !== null && text.length > 0) {
        loadText(text + '$');
    }
    if (query !== null && query.length > 0) {
        loadQuery(query);
    }
}
