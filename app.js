let show = document.getElementById("show");
let clear = document.getElementById("clear");

let data = [] || JSON.parse(localStorage.getItem("data"));

add.addEventListener("click", function () {
  let text = document.getElementById("text").value;

  data.push(text);
  console.log(data);
  show.style.display = "inline";
  // show.innerHTML+=`data`;

  localStorage.setItem("data", JSON.stringify(data));

  render();
});

function render() {
  show.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    show.innerHTML += `<li>${data[i]} <div><button onclick="edit(${[
      i,
    ]})">Edit</button> <button onclick="del(${[i]})">delete
   </button></div> </li>`;
  }
  Event.location.reload("index.html");

  text.value = "";
}

function edit(index) {
  let add = prompt("put the value");
  data.splice(index, 1, add);
  show.innerHTML = "";

  localStorage.setItem("data", JSON.stringify(data));
  render();
}

function del(index) {
  // show.innerHMTL = "";

  data.splice(index, 1);
  alert("Your data is Deleted");
  localStorage.removeItem("data", data[index]);
  render();
}

clear.addEventListener("click", function () {
  localStorage.clear("data");
  show.innerHTML = "";
});
