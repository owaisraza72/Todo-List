const supabaseUrl = "https://blkxlczwjkjgdfixbide.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa3hsY3p3amtqZ2RmaXhiaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzA3NDcsImV4cCI6MjA2ODQwNjc0N30.z6vZxMuPTvTn7ShSexmSo9C5gGJpl4AvJCSBknIDOZc";

const client = supabase.createClient(supabaseUrl, supabaseKey);

let show = document.getElementById("show");
let clear = document.getElementById("clear");
let textInput = document.getElementById("text");
let addbtn = document.getElementById("add");

addbtn.addEventListener("click", async () => {
  const { error } = await client
    .from("todo_list")
    .insert({ addTask: textInput.value });

  if (error) {
    console.log(error.message);
  }

  show.innerHTML = "";
});async function render() {
  show.innerHTML = "";

  const { data, error } = await client.from("todo_list").select("*");

  if (error) {
    console.error(error.message);
    return []; // ✅ safe fallback
  }

  for (let i = 0; i < data.length; i++) {
    show.innerHTML += `<li><div>
      ${data[i].addTask}
      <button onclick="editValue(${i})">Edit</button>
      <button onclick="del(${i})">Delete</button>
    </div></li>`;
  }

  return data; // ✅ so editValue() can use it
}


async function editValue(index) {
  render(); // ✅ ab data mil gaya
  console.log("ok");

  const task = data[index];
  textInput.value = task.addTask;

  // data.splice(index, 1, add);
  show.innerHTML = "";
  const { error } = await client
    .from("todo_list")
    .update({ addTask: textInput })
    .eq("id", 1);

  if (error) {
    console.log(error.message);
  }
  render();
}

function del(index) {
  alert("ok");
  //   data.splice(index, 1);
  //   alert("Your data is Deleted");
  //   localStorage.removeItem("data", data[index]);
  //   render();
}

// clear.addEventListener("click", function () {
//   localStorage.clear("data");
//   show.innerHTML = "";
// });
