const table = document.getElementById('list')
const choice = document.getElementById('choice')

var day = 0
var number = 0

function buttonAdd(value){
    let button = document.createElement('input')
    button.type = 'button'
    button.value = value
    button.tagName = value
    button.addEventListener('click',function (event) {
        let obj = event.target
        let edit = document.getElementById(String(day)+String(number))
        edit.innerText = obj.value
        if (number == 6) {
            day += 1
        }
        number = (number+1) % 7
    })
    document.getElementById("addButton").before(button)
}
function setUp() {
    for (let i=0;i<7;i++) {

        let tr = document.createElement('tr')
        
        for (let j=0;j<12;j++) {
            let td = document.createElement('td')
            let txt = document.createElement('p')
            txt.id = String(j) + String(i)
            txt.innerText = '____'
            txt.contentEditable = true
            td.appendChild(txt)
            tr.appendChild(td)
        }

        table.appendChild(tr)
    }
    var addButton = document.createElement('input')
    addButton.id = "addButton"
    addButton.type = 'button'
    addButton.value = "+"
    addButton.onclick = () => {
        var str = prompt("教科名").split(',');
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

function collectData() {
    let classes = []
    for (let i=0;i<12;i++) {
        let today = []
        for (let j=0;j<7;j++) {
            let p = document.getElementById(String(i) + String(j))
            today.push(p.innerText)
        }
        if ([0, 6].includes(i)) {
          classes.push([])
        }
        classes.push(today)
    }
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

setUp()
