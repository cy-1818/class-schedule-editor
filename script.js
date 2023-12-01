const table = document.getElementById('list')
const buttons = document.getElementById('buttons')

var maxDay = 7
var maxNum = 7
var editID;
var editNext = 0;
var timeNum = 360
var classes = {}
var week = ["noname"]
var subjs = ["英語","国語","数学"]
var showSunday = true
var SundayLeft = true
var ask = async function(str){
  return prompt(str)
}
var askflg = false
var formatType = 1
var daynames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
var daynameJP = ['日', '月', '火', '水', '木', '金', '土']
var patterns = {"*":[]}
var patternChoose = []
var patternElements = ["name", "start", "end"]
var finalJSON, firstTR, secondTR, thirdTR, fourthTR, trs;

function buttonAdd(value){
    let button = document.createElement('input')
    button.type = 'button'
    button.value = value
    button.name = value
    button.classList = ["button"]
    button.onclick = function (){
        document.getElementById(editID).innerText = this.value;
        editNext = 1;
        makeTimeTable()
    }
    document.getElementById("addButton").before(button)
}

function editTimeButtonAdd(str, node){
  var button = document.createElement('input')
  button.type = 'button'
  button.value = str
  button.classList = ["button"]
  button.onclick = function (){
    timeNum+=Number(this.value)
    document.getElementById(editID).innerText = numToTime(timeNum);
  }
  node.append(button)
}

function setClasses(){
  for(var n=0;n<week.length;n++){
    if(classes[week[n]]===undefined){
      classes[week[n]] = {}
    }
    for(var k=0;k<daynames.length;k++){
      if(classes[week[n]][daynames[k]]===undefined){
        classes[week[n]][daynames[k]]=[]
      }
      for(var j=0;j<maxNum;j++){
        if(classes[week[n]][daynames[k]][j]===undefined){
          classes[week[n]][daynames[k]][j]=null
        }
        var tn = document.getElementById(week[n]+"/"+n+"/"+daynames[k]+"/"+j)
        if(tn){
          classes[week[n]][daynames[k]][j]=tn.innerText;
          if(classes[week[n]][daynames[k]][j]=="____"){
            classes[week[n]][daynames[k]][j] = null
          }
        }
      }
    }
  }
}

function setPatterns(){
  var patternNames = Object.keys(patterns)
  for(var n=0;n<patternNames.length;n++){
    if(patterns[patternNames[n]]===undefined){
      patterns[patternNames[n]]=[]
    }
    for(var k=0;k<maxNum;k++){
      if(patterns[patternNames[n]][k]===undefined){
        patterns[patternNames[n]][k]={}
      }
      for(var j=0;j<patternElements.length;j++){
        var patID = "pattern//"+patternNames[n]+"/"+patternElements[j]+"/"+k
        var node=document.getElementById(patID)
        if(node){
          str=node.innerText
          if(patternElements[j]=="name"){
            if(!str){
              str = null
            }
          }else{
            str = timeToNum(str)
          }
          patterns[patternNames[n]][k][patternElements[j]] = str
        }
      }
    }
  }
}

function addDay(num, n){
    var dayNode = document.createElement('td')
    var flag = patternChoose.includes(week[n]+"/"+n+"/"+daynames[num])
    dayNode.innerText=daynameJP[num]
    dayNode.onclick = function(){
      var ind = patternChoose.indexOf(week[n]+"/"+n+"/"+daynames[num])
      if(ind == -1){
        patternChoose.push(week[n]+"/"+n+"/"+daynames[num])
        makeTimeTable()
      }else{
        patternChoose.splice(ind, 1)
        makeTimeTable()
      }
    }
    if(flag){
      dayNode.colSpan = 2
      var patternChooseTD = document.createElement('td');
      patternChooseTD.rowSpan = maxNum
      patternChooseTD.onclick=async function(){
        var setPattern = await ask("パターン名")
        if(patterns[setPattern]===undefined){
          patterns[setPattern] = structuredClone(patterns["*"])
        }
        classes[week[n]][daynames[num]]["pattern"] = setPattern
        makeTimeTable()
      }
      if(classes[week[n]][daynames[num]]["pattern"]!==undefined){
        patternChooseTD.innerText=classes[week[n]][daynames[num]]["pattern"]
      }
      trs[0].append(patternChooseTD)
    }
    for(var j=0;j<maxNum;j++){
      let td = document.createElement('td')
      let txt = document.createElement('p')
      let cellID = week[n] + "/"+n+"/" + daynames[num] + "/" + j
      td.style.align="center"
      td.style.width="3em"
      txt.id = cellID
      txt.onclick = function(){
        setSbjButtons()
        if(editID != this.id){
          editID = this.id
          makeTimeTable()
        }
      }
      if(!classes[week[n]][daynames[num]][j]){
        classes[week[n]][daynames[num]][j]='____'
      }
      txt.innerText = classes[week[n]][daynames[num]][j]
      txt.contentEditable = true
      td.appendChild(txt)
      trs[j].appendChild(td)
      if(cellID == editID || editNext == 2){
        if(editNext==1){
          editNext++;
        }else{
          if(editNext == 2){
            editID = cellID;
            editNext=0;
          }
          td.bgColor = "lightskyblue"
        }
      }
    }
    thirdTR.append(dayNode)
    return Number(flag);
}

function makeTR(){
  var tr = document.createElement('tr')
  table.append(tr);
  return tr
}

function makeTimeSetter(num, patternName){
  if(num == 3){
    var tr = firstTR
  }else if(num == 2){
    var tr = secondTR
  }else if(num == 1){
    var tr = thirdTR
  }
  for(var k=0;k<3;k++){
    var timeSetterTR = document.createElement('th')
    timeSetterTR.rowSpan = num
    timeSetterTR.innerText=["時間名", "開始時刻", "終了時刻"][k]
    tr.append(timeSetterTR)
  }
  for(var j=0;j<maxNum;j++){
    for(var k=0;k<3;k++){
      let patternTextID = "pattern//"+patternName+"/"+patternElements[k]+"/"+j
      let timeSetterTD = document.createElement('td')
      let timeSetterTxt = document.createElement('p')
      timeSetterTxt.id = patternTextID
      var patternSTR = patterns[patternName][j][patternElements[k]]
      if(!patternSTR){
        patternSTR=""
      }
      if(k===0){
        timeSetterTxt.innerText=patternSTR
        timeSetterTxt.onclick=function(){
          setKeyboard()
          if(editID != this.id){
            editID = this.id
            makeTimeTable()
            document.getElementById(editID).focus()
          }
        }
      }else{
        timeSetterTxt.innerText=numToTime(patternSTR)
        timeSetterTxt.onclick=function(){
          setTimeButtons(this.id)
          if(editID != this.id){
            editID = this.id
            makeTimeTable()
          }
        }
      }
      if(patternTextID==editID){
        timeSetterTD.bgColor = "lightskyblue"
      }
      timeSetterTD.style.align="center"
      timeSetterTxt.style.width="3em"
      timeSetterTxt.contentEditable = true
      timeSetterTD.appendChild(timeSetterTxt)
      trs[j].appendChild(timeSetterTD)
    }
  }
}

function makeTimeTable() {
    setClasses();
    setPatterns()
    table.innerHTML=""
    firstTR = makeTR()
    secondTR = makeTR()
    thirdTR = makeTR()
    trs = []
    for(var j=0;j<maxNum;j++){
      trs.push(makeTR())
    }
    var patternsKey = Object.keys(patterns)
    for(var n=0;n<patternsKey.length;n++){
      if(patternsKey[n]=="*"){
        continue;
      }
      var patternNameTH = document.createElement('th')
      patternNameTH.colSpan = 3;
      patternNameTH.innerText = patternsKey[n]
      patternNameTH.onclick = (function(str){
        return (async function(){
          var newName = await ask("パターン名")
          setPatterns()
          if(newName === ""){
            delete patterns[str];
          }else{
            patterns[newName] = structuredClone(patterns[str])
            delete patterns[str];
          }
          makeTimeTable();
        })
      })(patternsKey[n])
      secondTR.append(patternNameTH)
      makeTimeSetter(1, patternsKey[n])
    }
    var addPatternTH = document.createElement('th');
    addPatternTH.innerText = "パターンを追加"
    addPatternTH.onclick=async function(){
      var newPattern = await ask("パターン名")
      if(newPattern){
        patterns[newPattern] = structuredClone(patterns["*"])
        makeTimeTable()
      }
    }
    addPatternTH.rowSpan = maxNum+2
    secondTR.append(addPatternTH)
    var patternTH = document.createElement('th');
    patternTH.colSpan = patternsKey.length*3-2
    patternTH.innerText = "パターン"
    firstTR.append(patternTH)
    makeTimeSetter(2, "*")
    var allWeekColNum = 4
    for (var n=0;n<week.length;n++){
        var colNum = 6+Number(showSunday)
        if(showSunday&&SundayLeft){
          colNum+=addDay(0, n)
        }
        for(var k=1;k<7;k++){
          colNum+=addDay(k, n)
        }
        if(showSunday&&!SundayLeft){
          colNum+=addDay(0, n)
        }
        var weekTitle = document.createElement('th')
        weekTitle.colSpan=colNum;
        weekTitle.innerText=week[n]
        weekTitle.onclick = (function(num){
          return (async function(){
            var newName = await ask("週名")
            setClasses()
            if(newName === ""){
              delete classes[week[num]];
              week.splice(num, 1)
            }else{
              if(week.includes(newName)){
                delete classes[week[num]];
              }else{
                classes[newName] = structuredClone(classes[week[num]])
              }
              week[num] = newName;
            }
            makeTimeTable();
          })
        })(n)
        secondTR.append(weekTitle)
        allWeekColNum+=colNum
    }
    var addWeekTH = document.createElement('th')
    addWeekTH.rowSpan = maxNum+2
    addWeekTH.innerText = "週を追加";
    addWeekTH.onclick = async function(){
      var newWeek = await ask("週名")
      week.push(newWeek);
      makeTimeTable();
    }
    secondTR.append(addWeekTH)
    var weekTH = document.createElement('th')
    weekTH.colSpan = allWeekColNum;
    weekTH.innerText = "時間割";
    firstTR.append(weekTH)
}

function setSbjButtons(){
    buttons.innerHTML = ""
    var addButton = document.createElement('input')
    addButton.id = "addButton"
    addButton.type = 'button'
    addButton.value = "±"
    addButton.classList = ["button"]
    addButton.onclick = async function(){
        var str = (await ask("教科名(｢、｣区切りで複数入力)")).split('、');
        for(var i of str){
            var obj = document.getElementsByName(i)[0]
            var ind = subjs.indexOf(i)
            if(obj === undefined && ind==-1){
                subjs.push(i)
                buttonAdd(i)
            }else if(ind!=-1){
                obj.remove()
                subjs.splice(ind, 1)
            }else{
                console.warn(i)
            }
        }
    }
    buttons.appendChild(addButton)
    for (let i of subjs) {
        buttonAdd(i)
    }
}

function setKeyboard(){
  buttons.innerHTML = ""
}

function setTimeButtons(id){
  var str = document.getElementById(id).innerText
  if(str){
    timeNum = timeToNum(str)
  }
  buttons.innerHTML = ""
  var decideButton = document.createElement('input')
  decideButton.type = "button"
  decideButton.value = "確定"
  decideButton.classList = ["button"]
  decideButton.style.height="125px"
  decideButton.style.display = "inline-block"
  decideButton.style.margin = "0"
  decideButton.onclick = function(){
    document.getElementById(editID).innerText = numToTime(timeNum)
    var splitID = editID.split("/")
    if(splitID[3]=="start"){
      splitID[3]="end"
    }else if(Number(splitID[4])!=maxNum-1){
      splitID[4] = String(Number(splitID[4])+1)
      splitID[3]="start"
    }
    editID = splitID.join("/")
    makeTimeTable()
    setTimeButtons(editID)
  }
  var decideButtonNode = document.createElement("p")
  decideButtonNode.style.display="inline"
  decideButtonNode.style.height="130px"
  decideButtonNode.style.verticalAlign = "top"
  decideButtonNode.append(decideButton)
  buttons.append(decideButtonNode)
  var editNums=["1","5","10","15","30","60"]
  var editTimeButtons = document.createElement("p")
  editTimeButtons.style.display="inline-block"
  editTimeButtons.style.height="130px"
  editTimeButtons.style.verticalAlign = "top"
  for(var n=0;n<editNums.length;n++){
    editTimeButtonAdd("+"+editNums[n], editTimeButtons)
  }
  editTimeButtons.append(document.createElement("br"))
  for(var n=0;n<editNums.length;n++){
    editTimeButtonAdd("-"+editNums[n], editTimeButtons)
  }
  buttons.append(editTimeButtons)
  document.getElementById(id).innerText = numToTime(timeNum)
}

function timeToNum(time){
  if(time){
    var str = time.split(":")
    var hour = Number(str[0].trim())
    var minute = Number(str[1].trim())
    return hour*60 + minute
  }else{
    return null;
  }
}

function numToTime(num){
  if(num){
    var hour = Math.floor(num/60)
    var minute = num % 60
    return ("00"+hour).slice(-2) + ":" + ("00"+minute).slice(-2)
  }else{
    return ""
  }
}

function finalFormat(){
  switch(formatType){
    case 1:
        var ansJSON = []
        var nameList = Object.keys(classes)
        for(var n=0;n<nameList.length;n++){
          for(var k=0;k<7;k++){
            ansJSON.push([])
            for(var j=0;j<maxNum;j++){
              ansJSON[n*7+k].push(classes[nameList[n]][daynames[k]][j])
            }
          }
        }
      return ansJSON;
      break;
    case 2:
      setClasses()
      setPatterns()
      return {
        "week":week,
        "classes":classes,
        "patterns":patterns,
        "maxNum":maxNum,
        "subjs":subjs
      };
      break;
  }
}

function getCopy() {
    finalJSON = finalFormat()
    console.log(finalJSON)
    navigator.clipboard.writeText(JSON.stringify(finalJSON))
}

function getJSON(){
    finalJSON = finalFormat()
    var json = new Blob([JSON.stringify(finalJSON, null, "\t")],{type:'appliation/json'})
    var dummy = document.createElement('a')
    dummy.href = window.URL.createObjectURL(json)
    dummy.download = "Schedule.json"
    document.body.append(dummy)
    dummy.click()
    document.body.removeChild(dummy)
}

async function editNum(){
    var newNum = Math.floor(Number(await ask("1日の授業数")))
    if(isNaN(newNum)){
        newNum=maxNum
    }
    maxNum=newNum
    makeTimeTable()
}

function changeJSON(){
  formatType++;
  if(formatType == 3){
    formatType = 1
  }
  document.getElementById('changeJSON').value="JSON形式:"+formatType
}


makeTimeTable()
setSbjButtons()

document.body.addEventListener("touchstart", function(e){
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  }, {passive: false});
  document.body.addEventListener("touchmove", function(e){
    if (e.touches && e.touches.length > 1) {
      e.preventDefault();
    }
  },
{passive: false});

async function noprompt(){
  ask = async function(str){
    askflg = false
    var askpop = document.createElement("div")
    var asktxt = document.createElement("span")
    var askara = document.createElement("textarea")
    var askbtn = document.createElement("span")
    askpop.append(asktxt)
    askpop.append(askara)
    askpop.append(askbtn)
    askpop.className = "askpop"
    asktxt.className = "asktxt"
    askara.className = "askara"
    askbtn.className = "askbtn"
    document.body.append(askpop);
    asktxt.append(document.createTextNode(str));
    askbtn.append(document.createTextNode("Ok"));
    askbtn.onclick = function(){
      askflg = true
    }
    await askWait()
    var askans = askara.value
    askpop.remove()
    return askans
  }
}

async function askWait(){
  await (new Promise(function(resolve, reject){
    setTimeout(function(){
      if(askflg){
        resolve()
      }else{
        reject()
      }
    }, 100);
  })).then(function(){
  }).catch(askWait)
}

function loadJSON(json){
  table.innerHTML=""
  var obj = JSON.parse(json)
  week = obj.week
  classes = obj.classes
  patterns = obj.patterns
  maxNum = obj.maxNum
  subjs = obj.subjs
  makeTimeTable()
}
