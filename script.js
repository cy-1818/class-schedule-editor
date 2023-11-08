const table = document.getElementById('list')
const choice = document.getElementById('choice')

var maxDay = 7
var maxNum = 7
var day = 0
var number = 0
var classes = [[]]
var week = ["noname"]
var showSunday = true
var SundayLeft = true
var ask = async function(str){
  return prompt(str)
}
var askflg = false
var formatType = 1
var finalJSON
var daynames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function buttonAdd(value){
    let button = document.createElement('input')
    button.type = 'button'
    button.value = value
    button.name = value
    button.classList = ["button"]
    button.onclick = function (){
        let edit = document.getElementById(`${day},${number}`)
        edit.innerText = this.value
        classes[day][number] = this.value
        if (number == maxNum-1) {
            day += 1
        }
        number = (number+1) % maxNum
        makeTimeTable()
    }
    document.getElementById("addButton").before(button)
}

function addDay(char){
    var dayNode = document.createElement('td')
    dayNode.innerText=char
    return dayNode
}

function makeTimeTable() {
    table.innerHTML=""
    var head = document.createElement('tr')
    var days = document.createElement('tr')
    for (var n=0;n<week.length;n++){
        var weekTitle = document.createElement('th')
        weekTitle.colSpan=6+Number(showSunday)
        weekTitle.innerText=week[n]
        head.append(weekTitle)
        if(showSunday&&SundayLeft){
            days.append(addDay('日'))
        }
        days.append(addDay('月'))
        days.append(addDay('火'))
        days.append(addDay('水'))
        days.append(addDay('木'))
        days.append(addDay('金'))
        days.append(addDay('土'))
        if(showSunday&&!SundayLeft){
            days.append(addDay('日'))

        }
    }
    table.append(head)
    table.append(days)
    for (let j=0;j<maxNum;j++) {
        let tr = document.createElement('tr')
        for (let i=0;i<maxDay;i++) {
            let td = document.createElement('td')
            let txt = document.createElement('p')
            td.align="center"
            txt.width="3em"
            if(i==day && j==number){
                td.bgColor = "lightskyblue"
            }
            txt.id = `${i},${j}`
            if(classes[i]===undefined||classes[i][j]===undefined){
                if(classes[i]===undefined){
                    classes[i]=[]
                }
                txt.innerText = '____'
                classes[i][j] = '____'
            }else{
                if(classes[i][j]=='　'){
                    classes[i][j]='____'
                }
                txt.innerText = classes[i][j]
            }
            txt.contentEditable = true
            td.appendChild(txt)
            tr.appendChild(td)
        }

        table.appendChild(tr)
    }
}

async function setUp(){
    makeTimeTable()
    var addButton = document.createElement('input')
    addButton.id = "addButton"
    addButton.type = 'button'
    addButton.value = "±"
    addButton.classList = ["button"]
    addButton.onclick = async function(){
        var str = (await ask("教科名(｢、｣区切りで複数入力)")).split('、');
        for(var i of str){
            var obj = document.getElementsByName(i)[0]
            if(obj === undefined){
                buttonAdd(i)
            }else{
                obj.remove()
            }
        }
    }
    choice.appendChild(addButton)
    let subjs = ["英語","国語","数学"]
    for (let i of subjs) {
        buttonAdd(i)
    }
}

function format(){
    for(var i=0;i<classes.length;i++){
        for(var j=0;j<classes[0].length;j++){
            classes[i][j]=document.getElementById(`${i},${j}`).innerText
            if(classes[i][j]=='____'){
                classes[i][j]='　'
            }

        }
    }
}

function finalFormat(){
  switch(formatType){
    case 1:
      format();
      return classes;
      break;
    case 2:
      finalJSON = {}
      for(var n=0;n<week.length;n++){
      console.log(finalJSON)
        finalJSON[week[n]]={}
        for(var k=0;k<7;k++){
          if(!showSunday && k===0){
            finalJSON[week[n]].Sun = []
          }else{
            var i;
            if(!SundayLeft && k===0){
              i = 6
            }else if(SundayLeft && showSunday){
              i = k
            }else{
              i = k-1
            }
            var dayJSON = []
            if(showSunday){
              i += n*7
            }else{
              i += n*6
            }
            for(var j=0;j<classes[0].length;j++){
              dayJSON[j]=document.getElementById(`${i},${j}`).innerText
              if(dayJSON[j]=='____'){
                dayJSON[j]='　'
              }
            }
            finalJSON[week[n]][daynames[k]] = dayJSON
          }
        }
      }
      return finalJSON;
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

function del(){
    if(number===0){
        day-=1
    }
    number=(number+maxNum-1)%maxNum
    document.getElementById(`${day},${number}`).innerText='____'
    classes[day][number]='____'
    format()
    makeTimeTable()
}

function down(){
    if(number==maxNum-1&&day!=maxDay-1){
        day+=1
    }
    number=(number+1)%maxNum
    format()
    makeTimeTable()
}

function up(){
    if(number===0&&day!==0){
        day-=1
    }
    number=(number+maxNum-1)%maxNum
    format()
    makeTimeTable()
}

function left(){
    if(day!==0){
        day-=1
    }
    format()
    makeTimeTable()
}

function right(){
    if(day!=maxDay-1){
        day+=1
    }
    format()
    makeTimeTable()
}

async function editWeek(){
    week = await ask("週を編集(,区切り)",week.join(',')).split(',')
    format()
    if(showSunday){
        maxDay=week.length*7
    }else{
        maxDay=week.length*6
    }
    makeTimeTable()
}

async function editNum(){
    var newNum = Math.floor(Number(await ask("1日の授業数")))
    format()
    if(isNaN(newNum)){
        newNum=maxNum
    }
    if(maxNum>newNum){
        for(var n=0;n<maxDay;n++){
            classes[n]=classes[n].slice(0,newNum).concat()
        }
    }
    maxNum=newNum
    makeTimeTable()
}

function showSun(){
    format()
    showSunday=!showSunday
    if(showSunday){
        maxDay=week.length*7
        for(var n=0;n<week.length;n++){
            if(SundayLeft){
                classes.splice(n*7,0,[])
            }else{
                classes.splice(n*7+6,0,[])
            }
        }
        document.getElementById('showSun').value = "日曜を非表示"
    }else{
        maxDay=week.length*6
        for(var n=0;n<week.length;n++){
            if(SundayLeft){
                classes.splice(n*6,1)
            }else{
                classes.splice(n*6+6,1)
            }
        }
        document.getElementById('showSun').value = "日曜を表示"
    }
    makeTimeTable()
}

function transSun(){
    format()
    SundayLeft=!SundayLeft
    if(SundayLeft){
        if(showSunday){
            for(var n=0;n<week.length;n++){
                classes.splice(n*7,0,classes[n*7+6].concat())
                classes.splice(n*7+7,1)
            }
        }
        document.getElementById('transSun').value="日月火…土"
    }else{
        if(showSunday){
            for(var n=0;n<week.length;n++){
                classes.splice(n*7+7,0,classes[n*7].concat())
                classes.splice(n*7,1)
            }
        }
        document.getElementById('transSun').value="月…金土日"
    }
    makeTimeTable()
}

function changeJSON(){
  formatType++;
  if(formatType == 3){
    formatType = 1
  }
  document.getElementById('changeJSON').value="JSON形式:"+formatType
}



setUp()

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
