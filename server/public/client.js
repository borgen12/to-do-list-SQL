console.log('go');
$(document).ready(onReady);
//run append on page load and ready the buttons for click events
function onReady() {
    getTasks();
    $('#submitButton').on('click', function (event) {
        event.preventDefault();
        addTask();
    })
    $('#tableBody').on('click', '#delButton', deleteTask);
    $('#tableBody').on('click', '#compButton', completeTask);
}
//logic for complete button
function completeTask() {
    console.log('in completeTask');
    //target DOM location of click event
    let $completeButton = $(this);
    let $tr = $completeButton.closest('tr');
    console.log('checking update tr', $tr);
    //relate click event to id number of item clicked
    let compId = $tr.data('id');
    console.log('taskId is ', compId);
    //modify data that was clicked
    let newResponse = {
        complete: 'Yes'
    }
//request to change data in database
    $.ajax({
        method: 'PUT',
         //make sure only the id of row that was clicked is updated
        url: `/tasks/${compId}`,
        data: newResponse
    })
    .then(function (response) {
        //go to get updated data
         getTasks();
    })
    .catch(function () {
        console.log(`Something bad happened updating task ${compId}`);
        alert('Couldn\'t update the task, try again later');
    })
}
//logic for when delete button is clicked
function deleteTask() {
    console.log('in deleteTask');
    //locate click event on DOM
    let $deleteButton = $(this);
    let $tr = $deleteButton.closest('tr');
    console.log('testing $tr', $tr);
    //capture data id in row that was clicked on
    let taskId = $tr.data('id');
    //request to delete data from database
    $.ajax({
        type: 'DELETE',
        //make sure only the id of row that was clicked is deleted
        url: `/tasks/${taskId}`
    })
    .then( function (response) {
        //got to get updated data
        getTasks();
    })
    .catch( function (error) {
        console.log(`Something bad happened adding tasks`, error);
        alert('Couldn\'t add the tasks, try again later');
    })

}
//logic for the submit button; request to add new item to the databse
function addTask() {
    console.log('in addTask');
    //creates new object from input fields
    let newTask = {
        task: $('#taskIn').val(),
        complete: $('#actionIn').val()
    }
    console.log('newTask is', newTask);
    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: newTask
    })
    .then(function (response) {
        getTasks();
        $('#taskIn').val('');
        $('#actionIn').val('');
    })
    .catch(function (error) {
        console.log(`Something bad happened adding tasks`, error);
        alert('Couldn\'t add the tasks, try again later');
    })
}
//logic to request information from database 
function getTasks() {
    console.log('in getTask');
    $.ajax({
        type: 'GET',
        url: '/tasks',
    })
    .then(function (response) {
        let task = response;
        console.log('GET response is', task);
        //sends response from server to append function
        appendTask(task);
   })
    .catch(function (error) {
        console.log(`Something bad happened getting tasks`, error);
        alert('Couldn\'t get the tasks, try again later');
    })
}
//logic that updates DOM with new data whenever GET request succeeds
function appendTask(taskArray) {
    console.log('in appendTask');
    $('#tableBody').empty();
    for(tasks of taskArray) {
        //turns row green if task is completed
        if(tasks.complete==='Yes') {
            let $tr = $(`<tr id="green">
         <td>${tasks.task}</td>
         <td>${tasks.complete}</td>
         <td><button type="button" id="delButton" class="btn btn-outline-danger">Delete</button>
         </td></tr>`);
            $('#tableBody').append($tr);
            //still not really sure what this does
            $tr.data(tasks);
        //adds complete button if task is not complete
        }else {
            let $tr = $(`<tr>
         <td>${tasks.task}</td>
         <td>${tasks.complete}</td>
         <td><button type="button" id="delButton" class="btn btn-outline-danger">Delete</button>
         <button type="button" id="compButton" class="btn btn-outline-success">Complete</button>
         </td></tr>`);
            $('#tableBody').append($tr);
            //see above
            $tr.data(tasks);
        }
    }
}
