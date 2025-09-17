// Redirect to index.html if not logged in
if (!localStorage.getItem("userEmail")) {
  window.location.replace("index.html");
}

// Sign out
var logOutBtn = document.querySelector("#log-out-btn");
if (logOutBtn != null) {
  logOutBtn.addEventListener("click", () => {
    window.location.replace("index.html");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
  });
}

// Welcome message in home page
if (localStorage.getItem("userName") != null) {
  document.querySelector("#my-userName").innerHTML = `Welcome ${localStorage.getItem("userName")}`;
}

var inputTaskName = document.getElementById("inputnametask");
var addTaskBtn = document.getElementById("addtaskbtn");
var alltaskscontainer = document.getElementById("alltaskscontainer");
var updataskbtn = document.getElementById("updataskbtn");
var inputsearchtask = document.getElementById("inputsearchtask");
var inputtaskstatus = document.getElementById("inputtaskstatus");
var allTasks = [];
var myElem = document.createElement("p");
myElem.classList.add("text-danger");
myElem.innerHTML = "";

// Get tasks for the logged-in user
var userEmail = localStorage.getItem("userEmail");
var tasksKey = `tasks_${userEmail}`;
if (localStorage.getItem(tasksKey) != null) {
  allTasks = JSON.parse(localStorage.getItem(tasksKey));
}

showTasks(allTasks);

function filterTasks() {
  var status = inputtaskstatus.value;
  var filterdTasks = [];
  if (status == "All") {
    filterdTasks = allTasks;
  } else if (status == "Pending") {
    filterdTasks = allTasks.filter(function (task) {
      return task.isCompleted == false;
    });
  } else if (status == "completed") {
    filterdTasks = allTasks.filter(function (task) {
      return task.isCompleted == true;
    });
  }
  showTasks(filterdTasks);
}

inputtaskstatus.addEventListener("change", filterTasks);

function AddNewTask() {
  if (inputTaskName.value != "") {
    myElem.innerHTML = "";
    var newTask = {
      name: inputTaskName.value,
      isCompleted: false,
    };
    allTasks.push(newTask);
    localStorage.setItem(tasksKey, JSON.stringify(allTasks));
    showTasks(allTasks);
    inputTaskName.value = "";
  } else {
    myElem.innerHTML = "Please enter your task";
    addTaskBtn.before(myElem);
  }
}

addTaskBtn.addEventListener("click", AddNewTask);

function showTasks(arrayOfTasks) {
  console.log(arrayOfTasks);
  var box = "";
  for (var i = 0; i < arrayOfTasks.length; i++) {
    box += `
      <div class="col-md-12">
        <div class="d-flex align-items-center task ${arrayOfTasks[i].isCompleted ? "done" : ""}">
          <input ${arrayOfTasks[i].isCompleted ? "checked" : ""} onchange="makeTaskDone(${i})" type="checkbox" class="mycheckbox d-none" name="" id="task${i}">
          <label class="mylabal" for="task${i}"></label>
          <p class="text-white m-0">${arrayOfTasks[i].name}</p>
          <button onclick="readyToUpdate(${i})" class="btn btn-warning ms-auto"> <i class="fa-solid fa-pen-nib"></i> update</button>
          <button onclick="deleteTask(${i})" class="btn btn-danger mx-4"> <i class="fa-solid fa-trash-can"></i> delete</button>
        </div>
      </div>
    `;
  }
  alltaskscontainer.innerHTML = box;
}

function makeTaskDone(index) {
  allTasks[index].isCompleted = !allTasks[index].isCompleted;
  localStorage.setItem(tasksKey, JSON.stringify(allTasks));
  showTasks(allTasks);
}

function deleteTask(index) {
  allTasks.splice(index, 1);
  localStorage.setItem(tasksKey, JSON.stringify(allTasks));
  showTasks(allTasks);
}

var updateIndex;

function readyToUpdate(index) {
  updateIndex = index;
  inputTaskName.value = allTasks[index].name;
  addTaskBtn.classList.add("d-none");
  updataskbtn.classList.remove("d-none");
}

function updateTask() {
  allTasks[updateIndex].name = inputTaskName.value;
  localStorage.setItem(tasksKey, JSON.stringify(allTasks));
  showTasks(allTasks);
  updataskbtn.classList.add("d-none");
  addTaskBtn.classList.remove("d-none");
  inputTaskName.value = "";
}

updataskbtn.addEventListener("click", updateTask);

function searchTask() {
  var searchValue = inputsearchtask.value;
  var searchTasks = [];
  for (var i = 0; i < allTasks.length; i++) {
    if (allTasks[i].name.includes(searchValue)) {
      searchTasks.push(allTasks[i]);
    }
  }
  console.log(searchTasks);
  showTasks(searchTasks);
}

inputsearchtask.addEventListener("input", searchTask);