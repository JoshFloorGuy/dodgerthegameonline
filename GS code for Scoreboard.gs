function doGet() {
  return HtmlService.createHtmlOutputFromFile("hs.html")
}
function refresh() {
  var l = []
  var s = SpreadsheetApp.openByUrl("<Link to the spreadsheet>").getDataRange().getValues()
  for(i=0;i<s.length;i++) {
    l.push([s[i][3],s[i][0]])
  }
  var m = l.sort(function(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}
);
	return m;
}