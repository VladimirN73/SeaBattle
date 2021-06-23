
function func(){
  var currentdate = new Date(); 


  var day = currentdate.getDate() + "";
  if (currentdate.getDate()<10) day = "0" + day;
  

  var iMonth = currentdate.getMonth() + 1;
  var month =  iMonth;
  if (iMonth<10) month = "0" + month;
  


  var datetime = day + "." + month + "." + currentdate.getFullYear() + " "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
  console.log("build at " + datetime);


var fs = require('fs')
var strFile ="./src/environments/environment.base.ts";
var regEx = /(temp)\s*(:).*(,)/g;  // /\s+(temp)\s*(:)\s*(").*(")\s*(,)/g;  // /\s+(temp)\s*(:).*[,]\s*$/g; // /\s+(temp)\s*(:).*$/g

fs.readFile(strFile , 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(regEx, `temp: "${datetime}",`);

  fs.writeFile(strFile , result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
}

func();