const { temporaryAllocator } = require('@angular/compiler/src/render3/view/util');

const strKeys=[];
const strValues=[];

function func()
{
    setBuildAt();
    setBuildBranch();

    replaceEnvironmentValues();
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
  
  var strDateTime =  "" 
    + addLeadingZero(currentdate.getUTCDate()) + "."  
    + addLeadingZero(currentdate.getUTCMonth() + 1) + "." 
    + addLeadingZero(currentdate.getUTCFullYear()) + " "  
    + addLeadingZero(currentdate.getUTCHours()) + ":"  
    + addLeadingZero(currentdate.getUTCMinutes()) + ":" 
    + addLeadingZero(currentdate.getUTCSeconds());


    strKeys.push("buildAt");
    strValues.push(strDateTime);
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

function replaceEnvironmentValues()
{  
    var fs = require('fs');
    var strFile ="./src/environments/environment.base.ts";
    console.log("strFile = ", strFile);

    fs.readFile(strFile , 'utf8', function (err,data) {

      if (err) {
        return console.log(err);
      }

      console.log("source = ", data);

      var result = data; 
      let iCount = strKeys.length;

      for (let i = 0; i < iCount; i++) {
        var regEx = new RegExp(`(${strKeys[i]})\s*(:).*(,)`)
        console.log(`${i}. strKey=${strKeys[i]}, strValue=${strValues[i]},    regEx = ${regEx}`);
        result = result.replace(regEx, `${strKeys[i]}: "${strValues[i]}",`);
      }

      console.log("result = ", result);

      fs.writeFile(strFile , result, 'utf8', function (err) {
        if (err) return console.log(err);
      });
    });
}

function setBuildBranch()
{
    var strKey = "buildBranch";
    var strValue = process.env.BUILD_BRANCH;

    strKeys.push(strKey);
    strValues.push(strValue);
}

func();