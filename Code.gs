function doGet(e) {
  if(e.parameter.mode=="confirm") {
    confirmed(e.parameter.user)
    return HtmlService.createHtmlOutput('<html><body style="font-family:sans-serif"><h1>Thank you!</h1><p>The user '+e.parameter.user+' has been successfully signed up. You can close this tab and log into the game!')
  } else if(e.parameter.mode=="recover") {
    return HtmlService.createHtmlOutput('<html><body style="font-family:sans-serif"><h1>Recover Password</h1><p>Please enter your email below, and we will send the password to that email.</p><form><input type="text" id="emul"></input></form><button onClick="Javascript:google.script.run.withSuccessHandler(moot).resendPass(document.getElementById(\'emul\').value)">Get Password</button></body><script>function moot(resp) {document.getElementById(\'emul\').value="";if(resp){window.alert("SUCCESS! We sent it to your email! If the window does not close, you can close it");close()}else{window.alert("Sorry, bad email")}}</script></html>')
  } else {
  return HtmlService.createHtmlOutputFromFile("game.html")
  }
}
function signIn(user,pass){
  var u = -1
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In").getDataRange().getValues()
  for(i=0;i<s.length;i++) {
    if(s[i][0]==user) {u=i}
  }
  if(u!=-1){
    if(s[u][1]==pass) {return [1,s[u][3]]} else {return [-2,0]}
  } else {return [-1,0]}
}
function signUp(user,pass,email) {
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Signing up Queue")
  var d = new Date()
  s.appendRow([user,pass,email,d.getTime()])
  MailApp.sendEmail(email, "NO-REPLY: Dodger The Game Sign Up", "Welcome!\n\nYou're Dodger account is nearly set up, we just need you to confirm your username by clicking the link below.\nhttps://script.google.com/macros/s/AKfycbxvhXbpKyCOFd3MirgJRemjPmOxylwE71l_KpDvHqikXFay4Abh/exec?mode=confirm&user="+user.replace(" ","%20"))
}
function confirmed(user){
  var u = []
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In")
  var t = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Signing up Queue")
  for(i=0;i<t.getDataRange().getValues().length;i++) {
    if(t.getDataRange().getValues()[i][0]==user) {
      u=t.getDataRange().getValues()[i]
      u[3]=5
      t.deleteRow(i+1)
      s.appendRow(u)
    }
  }
}
function updateScore(user,score) {
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In").getDataRange().getValues()
  for(i=0;i<s.length;i++) {
    if(s[i][0]==user) {SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In").getRange(i+1,4).setValue(score);break}
  }
}
function UserTest(u){
  var t = false
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In").getDataRange().getValues()
  for(i=0;i<s.length;i++){
    if(s[i][0]==u) {t=true;break}
  }
  return t;
}
function EmailTest(u){
  var t = false
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In").getDataRange().getValues()
  for(i=0;i<s.length;i++){
    if(s[i][2]==u) {t=true;break}
  }
  return t;
}
function refreshUsers(){
  var d = new Date();
  var t = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Signing up Queue")
  for(i=1;i<t.getDataRange().getValues().length;i++) {
    if(t.getRange(i+1,4).getValue()-(1000*24*3600)<d.getTime()) {
      t.deleteRow(i+1)
    }
  }
}
function resendPass(email) {
  var ret = false
  var s = SpreadsheetApp.openByUrl("<link to the spreadsheet>").getSheetByName("Log In").getDataRange().getValues()
  for(i=0;i<s.length;i++){
    if(email==s[i][2]) {
      ret=true
      MailApp.sendEmail(email, "NO-REPLY: Dodger The Game - Password Recovery", "Hi!\n\nWe're sending you this email because "+s[i][0]+" requested their password.\nThe password is "+s[i][1])
      break;
    }
  }
  return ret;
}