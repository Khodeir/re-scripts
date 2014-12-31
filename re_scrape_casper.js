var url = 'http://www.realestateegypt.com/Search/SecSearch.aspx?PropertyFor=XIwkOQiE7BE=&Duration=W+SVAO++WxE=&Loc=pixb61lCI4oASpxfeWX9Gg==&PropT=aUtGjcydRv8=&Rooms=aUtGjcydRv8=&PriceFrom=aUtGjcydRv8=&PriceTo=aUtGjcydRv8=&Currency=iNC77tP9Sq8=&Project=dvDaNdIjnQk=&Furnish=W+SVAO++WxE=&PropertyUse=VmlUj0PytKw=&imagesResult=2DDZRFhiOKk=&FirstResult=yes';
var casper = require('casper').create();


function getProps(){
    var buttons = document.querySelectorAll('.SearchPropMore');
    return Array.prototype.map.call(buttons, function(e){
        var patt = /Prop=([^=]+)/g;
        if (patt.test(e.href)){
            return e.href;
        }
    });
}
function get_current_count(){
    return document.getElementById("ctl00_ContentPlaceHolder1_ItemNumberFrom").innerHTML;
}
function getPropsAndWrite(){
    // get current pagination number
    var current_count = casper.evaluate(get_current_count);

    // output all property urls found on this page
    var props = casper.evaluate(getProps);
    content = props.join("\n");
    casper.echo(content);

    // try to navigate to the next page
    var nextLink = "#ctl00_ContentPlaceHolder1_BtnNext";
    if (casper.visible(nextLink)) {

        casper.thenClick(nextLink, function(){
            // console.log("Clicked Next Button!");
        });

        // wait until javascript actually loads the new page
        casper.waitFor(function() {
            return current_count != casper.evaluate(get_current_count);
        },null);

        // continue recursively
        casper.then(getPropsAndWrite);
    }
    else {
        // no next link found so we've reached the end of the listing
        casper.echo("END")
    }
}


// casper.on('remote.message', function(msg) {
//     this.echo('remote message caught: ' + msg);
// })

casper.start(url);
casper.then(getPropsAndWrite);
casper.run();
