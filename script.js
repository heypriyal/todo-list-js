
// console.log("javascript Started");


// on click of add btn
document.querySelector(".addbtn").addEventListener("click", () => {
    //input value 
    let input_val = document.querySelector(".add-task-field").value;
    document.querySelector(".add-task-field").value = "";
    //priority btn
    let priorityelement = document.querySelector('.priority-btn input:checked');
    let priority = priorityelement ? priorityelement.value : "";

    if (input_val && priority) {
        // console.log(input_val, priority.value);
        document.querySelector(".errormsg").innerHTML = " ";
        if (priorityelement) priorityelement.checked = false;

    } else {
        let errormsg = document.querySelector(".errormsg");

        errormsg.innerHTML = "Please Select Priority & Write task";
        errormsg.classList.add("fadeout");

        setTimeout(() => {
            errormsg.innerHTML = "";
            errormsg.classList.remove("fadeout");
        }, 2000);

        return;
    }



    let newtask = {
        id: Date.now(),
        details: input_val,
        priority: priority
    }

    let alltasks = JSON.parse(localStorage.getItem("alltasks")) || [];
    // console.log(alltasks);

    alltasks.push(newtask);
    // console.log(alltasks);

    localStorage.setItem("alltasks", JSON.stringify(alltasks));
    // console.log("set item successfully");
    showtasks()
    alltaskTotal()
})


//function to show tasks
function showtasks() {
    let alltasks = JSON.parse(localStorage.getItem("alltasks"));
    // console.log(alltasks);
    let container = document.querySelector(".allcontainer")
    container.innerHTML = " ";

    alltasks.forEach(task => {
        let taskdiv = document.createElement("div");
        taskdiv.className = 'task-line';

        let checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        checkbox.name = 'checkbox';
        checkbox.id = task.id;
        checkbox.className = "task-checkbox";

        let tasktext = document.createElement("p");
        tasktext.className = "text";
        tasktext.textContent = task.details;
        
        let taskbtncontainer = document.createElement('div');
        taskbtncontainer.className = 'taskbtncontainer'; 

        let taskpriority = document.createElement('p');
        taskpriority.className = "show-priority";
        taskpriority.textContent = task.priority;
        
        let editbtn = document.createElement("button");
        editbtn.className = "edit";
        editbtn.onclick = updateData;
        editbtn.id = task.id;
        let editImg = document.createElement("img");
        editImg.src = "edit.svg";
        editbtn.appendChild(editImg);

        let dltbtn = document.createElement("button");
        dltbtn.className = "delete";
        dltbtn.id = task.id;
        let dltImg = document.createElement("img");
        dltImg.src = "dlt.svg";
        dltbtn.onclick = taskdlt;
        dltbtn.appendChild(dltImg);

        taskdiv.appendChild(checkbox);
        taskdiv.appendChild(tasktext);
        taskdiv.appendChild(taskbtncontainer);
        taskbtncontainer.appendChild(taskpriority);
        taskbtncontainer.appendChild(editbtn);
        taskbtncontainer.appendChild(dltbtn);

        container.appendChild(taskdiv);
    });

}
showtasks()


//function run on click of dlt btn
function taskdlt() {
    let taskdiv = this.closest(".task-line");
    let idtodlt = this.id;
    // console.log(taskdiv, idtodlt, "step1");


    let alltasks = JSON.parse(localStorage.getItem("alltasks"));
    // console.log(alltasks);
    let newalltasks = alltasks.filter(tasks => String(tasks.id) !== idtodlt);
    // console.log(newalltasks);
    localStorage.setItem("alltasks", JSON.stringify(newalltasks));


    taskdiv.classList.add("fadeout");
    setTimeout(() => {
        taskdiv.remove();
        // console.log("task deleted html element");
        showtasks();
    }, 500);
    // console.log("deleted and new set");
    alltaskTotal()
}




//editing updating data function

let updateID = null;
function updateData() {
    updateID = this.id;
    let alltasks = JSON.parse(localStorage.getItem("alltasks"));

    let taskdata = alltasks.find(tasks => String(tasks.id) == updateID)
    // console.log(taskdata, "this is the details to update");

    //hide add btn, show save btn
    document.getElementsByClassName("addbtn")[0].style.display = "none";
    document.getElementsByClassName("save-edit")[0].style.display = "inline";

    let currentText = taskdata.details;
    document.querySelector(".add-task-field").value = currentText;

    let currentPriority = taskdata.priority;
    document.querySelector(`input[value="${currentPriority}"]`).checked = true

}

function saveUpdate() {
    let alltasks = JSON.parse(localStorage.getItem("alltasks"));

    let newText = document.querySelector(".add-task-field").value;
    document.querySelector(".add-task-field").value = "";

    let newPriorityElement = document.querySelector('.priority-btn input:checked');
    let newPriority = newPriorityElement.value;
    if (newPriorityElement) newPriorityElement.checked = false;

    let updatedTask = {
        id: Number(updateID),
        details: newText,
        priority: newPriority
    }
    // console.log(updatedTask, "this is updated data");

    let oldTaskIndex = alltasks.findIndex(task => task.id == updateID);
    // console.log(oldTaskIndex, "this is old data Index")
    alltasks[oldTaskIndex] = updatedTask;
    // console.log("updatd successfully");

    localStorage.setItem("alltasks", JSON.stringify(alltasks));

    showtasks();

    //hide save btn, show add btn
    document.getElementsByClassName("addbtn")[0].style.display = "block";
    document.getElementsByClassName("save-edit")[0].style.display = "none";
    alert("data Updated Successfully.")
    updateID = null;

}




//checkbox
let checkbox = document.querySelectorAll(".task-checkbox");

checkbox.forEach(box => {
    box.addEventListener("change", function () {

        let parentdiv = this.closest(".task-line");
        let checkID = this.id;
        // console.log(checkID);

        if (this.checked) {
            parentdiv.classList.add("hide");
            setTimeout(() => {
                parentdiv.style.display = "none";
            }, 800);

            let alltasks = JSON.parse(localStorage.getItem("alltasks"));
            let newalltasks = alltasks.filter(tasks => String(tasks.id) !== checkID);
            // console.log(newalltasks);
            localStorage.setItem("alltasks", JSON.stringify(newalltasks));
        }

    });
});



//onclick of filter btn show filter options
filterbtn = document.querySelector(".filter")
filterOptions = document.querySelector(".filter-element")
filterbtn.addEventListener("click",()=>{
    if(filterOptions.style.display == "none"){
    filterOptions.style.display = "block";
    }else{
        filterOptions.style.display = "none";
    }
})


//show Data Based on Filter
function filterData(f_priority) {
//   console.log(f_priority);

  let alltasks = JSON.parse(localStorage.getItem("alltasks"));
  let filterd_task = alltasks.filter(function(task){
    return task.priority === f_priority;
  })

      let container = document.querySelector(".allcontainer")
    container.innerHTML = " ";

    filterd_task.forEach(task => {
        let taskdiv = document.createElement("div");
        taskdiv.className = 'task-line';

        let checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        checkbox.name = 'checkbox';
        checkbox.id = task.id;
        checkbox.className = "task-checkbox";

        let tasktext = document.createElement("p");
        tasktext.className = "text";
        tasktext.textContent = task.details;

        let taskpriority = document.createElement('p');
        taskpriority.className = "show-priority";
        taskpriority.textContent = task.priority;

        let editbtn = document.createElement("button");
        editbtn.className = "edit";
        editbtn.onclick = updateData;
        editbtn.id = task.id;
        let editImg = document.createElement("img");
        editImg.src = "edit.svg";
        editbtn.appendChild(editImg);

        let dltbtn = document.createElement("button");
        dltbtn.className = "delete";
        dltbtn.id = task.id;
        let dltImg = document.createElement("img");
        dltImg.src = "dlt.svg";
        dltbtn.onclick = taskdlt;
        dltbtn.appendChild(dltImg);

        taskdiv.appendChild(checkbox);
        taskdiv.appendChild(tasktext);
        taskdiv.appendChild(taskpriority);
        taskdiv.appendChild(editbtn);
        taskdiv.appendChild(dltbtn);

        container.appendChild(taskdiv);
    });
}


//show total tasks
function alltaskTotal() {
    let alltasks = JSON.parse(localStorage.getItem("alltasks")) || [];
let showtotaltask = document.querySelector(".box1-num");
let totaltask = alltasks.length;
showtotaltask.innerText = totaltask;
}alltaskTotal()



