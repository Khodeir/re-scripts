var url = 'http://www.realestateegypt.com/Search/SecSearch.aspx?PropertyFor=XIwkOQiE7BE=&Duration=W+SVAO++WxE=&Loc=pixb61lCI4oASpxfeWX9Gg==&PropT=aUtGjcydRv8=&Rooms=aUtGjcydRv8=&PriceFrom=aUtGjcydRv8=&PriceTo=aUtGjcydRv8=&Currency=iNC77tP9Sq8=&Project=dvDaNdIjnQk=&Furnish=W+SVAO++WxE=&PropertyUse=VmlUj0PytKw=&imagesResult=2DDZRFhiOKk=&FirstResult=yes';
var casper = require('casper').create();


function getProps(){
	var page_props = [];

	var buttons = document.querySelectorAll('.SearchPropMore');
	console.log(buttons.length);
	return Array.prototype.map.call(buttons, function(e){
		var patt = /Prop=([^=]+)/g;
		// console.log(e.href);
		if (patt.test(e.href))
		// console.log(prop);
			return e.href;
	});
}
function get_current_count(){
	return document.getElementById("ctl00_ContentPlaceHolder1_ItemNumberFrom").innerHTML;
}
function getPropsAndWrite(){
	var current_count = casper.evaluate(get_current_count);
	// casper.echo(current_count);
    var props = casper.evaluate(getProps);

    content = props.join("\n");
    casper.echo(content);

    var nextLink = "#ctl00_ContentPlaceHolder1_BtnNext";
    if (casper.visible(nextLink)) {

        casper.thenClick(nextLink, function(){
        	// console.log("Clicked Next Button!");
        });

        casper.waitFor(function() {
        	return current_count != casper.evaluate(get_current_count);
        },null);

        casper.then(getPropsAndWrite);
    } else {
        casper.echo("END")
    }
}

casper.start(url);

// casper.on('remote.message', function(msg) {
//     this.echo('remote message caught: ' + msg);
// })

casper.then(getPropsAndWrite);

casper.run();