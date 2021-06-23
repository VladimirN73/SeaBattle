
function func()
{
    setBuildAt();
    setBuildBranch();
}

function setBuildAt()
{
  var currentdate = new Date();
    
  var utc_timestamp = Date.UTC(
    currentdate.getUTCFullYear(),
    currentdate.getUTCMonth(),
    currentdate.getUTCDate() , 
    currentdate.getUTCHours(),
    currentdate.getUTCMinutes(), 
    currentdate.getUTCSeconds(), 
    currentdate.getUTCMilliseconds());

  currentdate = new Date(utc_timestamp) ;

  currentdate.setHours(currentdate.getHours() + 2); // move to german-time

  console.log("utc_timestamp", utc_timestamp.toString());
  
  var strDateTime =  "" 
    + addLeadingZero(currentdate.getUTCDate()) + "."  
    + addLeadingZero(currentdate.getUTCMonth() + 1) + "." 
    + addLeadingZero(currentdate.getUTCFullYear()) + " "  
    + addLeadingZero(currentdate.getUTCHours()) + ":"  
    + addLeadingZero(currentdate.getUTCMinutes()) + ":" 
    + addLeadingZero(currentdate.getUTCSeconds());

  console.log("strDateTime ", strDateTime);

  replaceEnvironmentValue("buildAt", strDateTime);
}

function addLeadingZero(str)
{
    var ret = str + "";
    if (ret.length == 1)
    {
        ret = "0" + ret;
    }
    return ret;
}

function replaceEnvironmentValue(strKey, strValue)
{  

    if (strValue == undefined)
    {
        strValue = "undefined";
    }

    console.log("strKey = ", strKey);
    console.log("strValue = ", strValue);


    var fs = require('fs');
    var strFile ="./src/environments/environment.base.ts";
    //var regEx = /(buildAt)\s*(:).*(,)/g; 

    var regEx = new RegExp(`(${strKey})\s*(:).*(,)`)

    console.log("strFile = ", strFile);
    console.log("regEx = ", regEx);


  fs.readFileSync(strFile , 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(regEx, `${strKey}: "${strValue}",`);

    fs.writeFileSync(strFile , result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });

}


function setBuildBranch()
{
    var strKey = "buildBranch";
    var strValue = process.env.BUILD_BRANCH;

    replaceEnvironmentValue(strKey, strValue);
}

func();