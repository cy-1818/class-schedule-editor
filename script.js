const table = document.getElementById('list')
const choice = document.getElementById('choice')

var maxDay = 7
var maxNum = 7
var day = 0
var number = 0
var classes = []

function buttonAdd(value){
    let button = document.createElement('input')
    button.type = 'button'
    button.value = value
    button.tagName = value
    button.classList = ["button"]
    button.addEventListener('click',function (event) {
        let obj = event.target
        let edit = document.getElementById(`${day},${number}`)
        edit.innerText = obj.value
        classes[day][number] = '____'
        if (number == 6) {
            day += 1
        }
        number = (number+1) % 7
    })
    document.getElementById("addButton").before(button)
}
function makeTimeTable(days, num) {
    for (let i=0;i<days;i++) {
        let tr = document.createElement('tr')
        for (let j=0;j<num;j++) {
            let td = document.createElement('td')
            let txt = document.createElement('p')
            txt.id = `${i},${j}`
            if(classes[i]===undefined||classes[i][j]===undefined){
                txt.innerText = '____'
                classes[i][j] = '____'
            }else{
                txt.innerText = classes[i][j]
            }
            txt.contentEditable = true
            td.appendChild(txt)
            tr.appendChild(td)
        }

        table.appendChild(tr)
    }
}

function setUp(){
    makeTimeTable(maxDay,maxNum)
    var addButton = document.createElement('input')
    addButton.id = "addButton"
    addButton.type = 'button'
    addButton.value = "+"
    addButton.classList = ["button"]
    addButton.onclick = () => {
        var str = prompt("教科名(｢、｣区切りで複数入力)").split('、');
        for(var i of str){
            var obj = choice.getElementsByTagName(i)[0]
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
    for(var i=0;i<maxDay;i++){
        for(var j=0;j<maxNum;j++){
            classes[i][j]=document.getElementById(`${i},${j}`).innerText
            if(classes[i][j]=='____'){
                classes[i][j]='　'
            }

        }
    }
}

function collectData() {
    format()
    console.log(classes)
    navigator.clipboard.writeText(JSON.stringify(classes))
    document.getElementById('getData').value = '時間割がコピーされました'
}

document.documentElement.addEventListener('touchstart', function (e) {
  if (e.touches.length >= 2) e.preventDefault();
  }, {passive: false});
  var t = 0;
  document.documentElement.addEventListener('touchend', function (e) {
  var now = new Date().getTime();
  if ((now - t) < 350){
    e.preventDefault();
  }
  t = now;
}, false);

function del(){
    if(number===0){
        day-=1
    }
    number=(number+6)%7
    document.getElementById(`${day},${number}`).innerText='____'
    classes[day][number]='____'
}

function space(){
    document.getElementById(`${day},${number}`).innerText='____'
    classes[day][number]='____'
    if(number==6){
        day+=1
    }
    number=(number+1)%7
}

setUp()
