import { generate as id } from 'shortid';
import { Dispatcher, ReduceStore} from './flux';

const tasksDispatcher = new Dispatcher();

const CREATE_TASK = 'CREATE_TASK';
const COMPLETE_TASK = 'COMPLETE_TASK';
const SHOW_TASKS = 'SHOW_TASK';

const createNewTasksAction = (content)=>{
  return {
    type: CREATE_TASK,
    value: content
  }
}


const completeTasksAction = (id, isComplete)=>{
  return {
    type: COMPLETE_TASK,
    id,
    value: isComplete
  }
}

const showTasksAction = (show) => {
  return {
    type: SHOW_TASKS,
    value: show
  }
}

class TasksStore extends ReduceStore {
  getInitialState() {
    return {
      tasks: [
        {
          id: id(),
          content: "Update CSS styles",
          complete: false
        }, {
          id: id(),
          content: "Add unit tests",
          complete: false
        }, {
          id: id(),
          content: "Post to social media",
          complete: false
        }, {
          id: id(),
          content: "Install new OS",
          complete: true
        }
      ],
      showComplete: true
    }
  }

  reduce(state, action) {
    console.log("Reducing .. ", state, action);
    let newState;
    switch(action.type){
      case CREATE_TASK:
        newState = { ...state, tasks: [...state.tasks]}
        newState.tasks.push({
          id: id(),
          content: action.value,
          complete: false
        });
        return newState;

      case COMPLETE_TASK:
        newState = { ...state, tasks: [...state.tasks]}
        const affectedElementIndex = newState.tasks.findIndex(t=>t.id === action.id);
        newState.tasks[affectedElementIndex] = { ...state.tasks[affectedElementIndex], complete: action.value};
        return newState;
      case SHOW_TASKS:
        newState = { ...state, tasks: [...state.tasks], showComplete: action.value};
        return newState;

    }
    return state;
  }

  getState() {
    return this.__state;
  }

}
const tasksStore = new TasksStore(tasksDispatcher);


document.forms.undo.addEventListener('submit', (e) => {
  e.preventDefault();
  tasksStore.revertLastState();
})

const render = () => {

  const TasksComponent = ({content, complete, id}) => (
    `<section>
    ${content} <input type="checkbox" name="taskCompleteCheck" data-taskid=${id} ${complete ? "checked" : ""}>
  </section>`
  )

  const tasksSection = document.getElementById('tasks');
  const state = tasksStore.getState();
  const rendered = state.tasks
    .filter(task => state.showComplete ? true: !task.complete)
    .map(TasksComponent).join("");

  tasksSection.innerHTML = rendered;

  document.getElementsByName('taskCompleteCheck').forEach(element => {
    element.addEventListener('change', (e) => {
      const id = e.target.attributes['data-taskid'].value;
      const checked = e.target.checked;
      tasksDispatcher.dispatch(completeTasksAction(id, checked));
    })
  });

};

document.forms.newTask.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = e.target.newTaskName.value;
  if(name){
    tasksDispatcher.dispatch(createNewTasksAction(name));
    e.target.newTaskName.value = null;
  }
});

document.getElementById('showComplete').addEventListener('change', ({target}) => {
  const showComplete = target.checked;
  tasksDispatcher.dispatch(showTasksAction(showComplete));
});

tasksStore.addListener( ()=> {
  render();
});


render();

