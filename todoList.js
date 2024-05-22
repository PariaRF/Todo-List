const todoForm = document.querySelector(".todo-form");
const formInput = document.querySelector(".form__input");
const todoList = document.querySelector(".todolist");
const selectFilter = document.querySelector(".filter-todos");
const backdrop  = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const closeModalBtn = document.querySelector(".modal__close");
const cancelModalBtn = document.querySelector(".modal__cancel");
const modalInput = document.querySelector(".modal__input");
const saveModalBtn = document.querySelector(".modal__save");


let filterValue = "all";

// EVENTS
document.addEventListener("DOMContentLoaded",(e)=>{
   const todos =  getAllTodos();
   generateTodos(todos);
})
todoForm.addEventListener("submit", addTodo)
selectFilter.addEventListener("change",(e)=>{
    filterValue = e.target.value;
    filterTodos();
})
closeModalBtn.addEventListener("click", closeModal)
cancelModalBtn.addEventListener("click", closeModal)
backdrop.addEventListener("click", closeModal)
// saveModalBtn.addEventListener("click", saveModal)


// FUNCTIONS
function addTodo(e){
    e.preventDefault();

    if(!formInput.value) return;
    
    const newTodo ={
        id: new Date().getTime(),
        createdAt: new Date().toISOString(),
        title: formInput.value,
        isCompeleted: false,
    }
    saveTodo(newTodo)
    filterTodos();
}

function generateTodos(todos){
    removeBtns = document.querySelectorAll(".todo__remove");
    let generateTodo = "";
    todos.forEach(todo=>{
        return generateTodo +=`<li class="todo">
            <p class="todo__title ${todo.isCompeleted && "completed"}">${todo.title}</p>
            <div class="todo__action">
                <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
                <button class="todo__check" data-todo-id=${todo.id}>
                    <i class="far fa-check-square"></i>
                </button>
                <button class="todo__edit" data-todo-id=${todo.id}>
                    <i class="fas fa-edit"></i>
                </button>
                <button class="todo__remove" data-todo-id=${todo.id}>
                    <i class="far fa-trash-alt"></i>
                </button>
            </div>
         </li>`
    })

    todoList.innerHTML= generateTodo;
    formInput.value = "";

    const removeBtn = [...document.querySelectorAll(".todo__remove")];
    removeBtn.forEach(btn => btn.addEventListener("click",removeTodo))

    const checkBtn = [...document.querySelectorAll(".todo__check")];
    checkBtn.forEach(btn => btn.addEventListener("click", checkTodo))

    const editBtn = [...document.querySelectorAll(".todo__edit")];
    editBtn.forEach(btn => btn.addEventListener("click",editTodo ));
}

function filterTodos(){
    const todos = getAllTodos();

    switch (filterValue) {
        case "all":{
            generateTodos(todos);
            break;
        }
        case "completed":{
            const filteredTodos = todos.filter(todo => todo.isCompeleted);
            generateTodos(filteredTodos);
            break;
        }
        case "uncompleted":{
            const filteredTodos = todos.filter(todo=> !todo.isCompeleted);
            generateTodos(filteredTodos);
            break;
        }
        default:
            generateTodos(todos);
            break;
    }
}

function closeModal(){
    backdrop.classList.add("hidden");
    modal.classList.add("hidden");
}

function removeTodo(e){
   let todos = getAllTodos();
 
    const todoId = Number(e.target.dataset.todoId);
    todos = todos.filter(todo => todo.id !== todoId);

    saveAllTodos(todos);
    filterTodos();
}

function checkTodo(e){
   let todos = getAllTodos();

    const todoId = Number(e.target.dataset.todoId);
    const todo = todos.find(todo => todo.id === todoId)
    todo.isCompeleted = !todo.isCompeleted;

    saveAllTodos(todos);
    filterTodos();
}

function editTodo(e){
    let todos = getAllTodos();

    const todoId = Number(e.target.dataset.todoId);
    const todo = todos.find(todo => todo.id === todoId);

    openModal(todos,todo);  
}

function openModal(todos,todo){

    modalInput.value = todo.title;
    modalInput.addEventListener("input",(e)=> {
        todo.title = e.target.value;
        todo.editAt = new Date().toISOString();
    })
        
    backdrop.classList.remove("hidden");
    modal.classList.remove("hidden");

    saveModalBtn.addEventListener("click",(e)=>{
        e.preventDefault();
        saveAllTodos(todos);
        filterTodos();
        closeModal();
    })
}

function editTodoTitle(todo){

}

function getAllTodos(){
    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    return savedTodos;
}

function saveTodo(todo){
    const savedTodos = getAllTodos();
    savedTodos.push(todo);
    localStorage.setItem("todos", JSON.stringify(savedTodos));
    return savedTodos;
}

function saveAllTodos(todos){
    localStorage.setItem("todos", JSON.stringify(todos))
}