var color = 'white';
var $canvas = $("canvas");
var context = $canvas[0].getContext("2d");
var lastEvent;
var mouseDown = false;
var predictions = {}

function sort($list) {
    let sorted = Object.keys(predictions).sort(function(a, b){
        return parseFloat(predictions[a]) - parseFloat(predictions[b]);
    })

    let indx = 0
    sorted.reverse();
    for(let key in sorted){
        let elem = document.getElementById(sorted[key]);
        elem.parentElement.setAttribute("indx", indx++)
    }
}

//when "add color" is pressed
$("#clear").click(function(){
  //append the color to the controls ul
    context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
    surprise();
});

//round brush strokes
context.lineCap = "round";
context.filter = "blur(1px)";
context.lineWidth = 10;

$canvas.mousedown(function(e){
  lastEvent = e;
  mouseDown = true;
}).mousemove(function(e){
  //draw lines
  if(mouseDown) {
    context.beginPath();
    context.moveTo(lastEvent.offsetX, lastEvent.offsetY);
    context.lineTo(e.offsetX, e.offsetY);
    context.strokeStyle = color;
    context.stroke();
    lastEvent = e;
   }
}).mouseup(function(){
  mouseDown = false;
  surprise();
}).mouseleave(function(){
  $canvas.mouseup();
});

function surprise() {
  var dataURL = $canvas[0].toDataURL();
  $.ajax({
    type: "POST",
    url: "/predict",
    data:{
      imageBase64: dataURL
    },
    success: function(response) {
        if(jQuery.isEmptyObject(predictions)){
            predictions = JSON.parse(response);
            tree(predictions);
            console.log("initialized")
        }else{
            predictions = JSON.parse(response);
            for(let key in predictions){
                let elem = document.getElementById(key);
                elem.innerHTML = key + ' : ' + predictions[key];
            }
            sort()
        }
    },
    error: function(xhr) {
        //Do Something to handle error
    }
  }).done(function() {
    console.log("sent")
  });
}

function tree(data) {
    let indx = 0
    for(let key in data){
        const container = document.createElement("div");
        const item = document.createElement("span");
        item.innerHTML= key + ' : ' + data[key];
        item.setAttribute("id", key);

        container.classList.add("pushable");
        item.classList.add("front");
        item.classList.add("list-item");
        container.setAttribute("indx", indx);

        container.appendChild(item);
        document.getElementById("prediction-list").appendChild(container);
        indx += 1
    }
}