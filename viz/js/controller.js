$(document).ready(function(){
    var text = "abracadabra$";
    var query = "ab";
    var controller = new Controller();
    controller.loadText(text);
    controller.loadQuery(query);
});

function Controller() {
    this.bwtView = new BWTView("bwt");
    var controller = this;
    $("#step").click(function() {
        controller.step();
    });
}

Controller.prototype.loadText = function(text) {
    this.bwtIndex = getBWTIndex(text);
    var suffixes = getSortedSuffixes(text);
    var suffixArray = this.bwtIndex.suffixArray;
    var ranks = this.bwtIndex.ranks;
    this.bwtView.load(text, suffixes, suffixArray, ranks);
};

Controller.prototype.loadQuery = function(query) {
    this.query = query;
    this.bwtView.loadQuery(query);
    this.queryPosition = query.length - 1;
    this.range = null;
    this.started = false;
};

Controller.prototype.step = function() {
    if (!this.started)
        this.start();
    else
        this.advance();
};

Controller.prototype.start = function() {
    var alphabet = this.query[this.queryPosition];
    this.bwtView.query.setActive([this.queryPosition]);
    this.range = this.bwtIndex.start(alphabet);
    this.started = true;
    if (this.range !== null) {
        var controller = this;
        this.queryPosition = this.queryPosition - 1;
        this.bwtView.grid.setRange(this.range.start, this.range.end);
    }
};

Controller.prototype.advance = function() {
    if (this.queryPosition < 0)
        return;
    var alphabet = this.query[this.queryPosition];
    this.bwtView.query.setActive([this.queryPosition]);
    this.range = this.bwtIndex.advance(this.range.start, this.range.end, alphabet);
    if (this.range !== null) {
        this.queryPosition = this.queryPosition - 1;
        this.bwtView.grid.setRange(this.range.start, this.range.end);
    }
};
