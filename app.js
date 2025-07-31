const supabaseUrl = "https://blkxlczwjkjgdfixbide.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsa3hsY3p3amtqZ2RmaXhiaWRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzA3NDcsImV4cCI6MjA2ODQwNjc0N30.z6vZxMuPTvTn7ShSexmSo9C5gGJpl4AvJCSBknIDOZc";

const client = supabase.createClient(supabaseUrl, supabaseKey);

let show = document.getElementById("show");
let clear = document.getElementById("clear");
let textInput = document.getElementById("text");
let addbtn = document.getElementById("add");
let updatebtn = document.getElementById("updatebtn");

async function addTodo() {
  if (!textInput.value.trim()) {
    Swal.fire("Input Required", "Please enter a todo!", "warning");
    return;
  }
  const { error } = await client
    .from("todo_list")
    .insert({ todo_text: textInput.value });

  if (error) {
    console.log(error.message);
    Swal.fire("Error", "Failed to add todo", "error");
    return;
  }

  Swal.fire("Success", "Todo added!", "success");
  textInput.value = "";
  show.innerHTML = "";
  showData();
}

textInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    // addbtn.addEventListener("click", async () => {
    if (!textInput.value.trim()) {
      Swal.fire("Input Required", "Please enter a todo!", "warning");
      return;
    }
    addTodo();
  }
});

async function showData() {
  show.innerHTML = "";

  const { data, error } = await client.from("todo_list").select("*");

  if (error) {
    console.error(error.message);
    Swal.fire("Error", "Could not fetch todos", "error");
    return;
  }

  data.forEach((element) => {
    show.innerHTML += `<li><div>
      ${element.todo_text}
      <button onclick="editValue(${element.id})">Edit</button>
      <button onclick="del(${element.id})">Delete</button>
    </div></li>`;
  });
}
showData();

let currentEditId = null;

async function editValue(todo_id) {
  const { data, error } = await client
    .from("todo_list")
    .select("todo_text")
    .eq("id", todo_id)
    .single();

  if (error) {
    console.log(error.message);
    Swal.fire("Error", "Could not load todo", "error");
    return;
  }

  textInput.value = data.todo_text;
  currentEditId = todo_id;
  addbtn.style.display = "none";
  updatebtn.style.display = "inline-block";
}

updatebtn.addEventListener("click", async () => {
  if (!currentEditId) return;

  const { error } = await client
    .from("todo_list")
    .update({ todo_text: textInput.value })
    .eq("id", currentEditId);

  if (error) {
    console.log(error.message);
    Swal.fire("Error", "Update failed", "error");
    return;
  }

  Swal.fire("Updated", "Todo updated!", "success");
  textInput.value = "";
  currentEditId = null;
  showData();
  updatebtn.style.display = "none";
  addbtn.style.display = "inline-block";
});

async function del(todo_id) {
  const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This will delete the todo!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
  });

  if (!confirm.isConfirmed) return;

  const { error } = await client.from("todo_list").delete().eq("id", todo_id);

  if (error) {
    console.log(error.message);
    Swal.fire("Error", "Could not delete", "error");
    return;
  }

  Swal.fire("Deleted!", "Todo deleted", "success");
  showData();
}

clear.addEventListener("click", async () => {
  const confirm = await Swal.fire({
    title: "Clear All?",
    text: "This will delete all todos!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, clear all!",
  });

  if (!confirm.isConfirmed) return;

  const { error } = await client.from("todo_list").delete().neq("id", 0); // delete all

  if (error) {
    console.log(error.message);
    Swal.fire("Error", "Failed to clear all", "error");
    return;
  }

  Swal.fire("Cleared", "All todos deleted!", "success");
  showData();
});
