import { createStore, combineReducers, applyMiddleware } from 'redux';
import { get } from './http';
import logger from 'redux-logger';


export const ONLINE = 'ONLINE';
export const AWAY = 'AWAY';
export const BUSY = 'BUSY';
export const OFFLINE = 'OFFLINE';

export const UPDATE_STATUS = 'UPDATE_STATUS';

export const CREATE_NEW_MESSAGE = 'CREATE_NEW_MESSAGE';

export const READY = 'READY';
export const WAITING = 'WAITING';
export const NEW_MESSAGE_SERVER_ACCEPTED = 'NEW_MESSAGE_SERVER_ACCEPTED';

const defaultState= {
  messages: [
    {
      date: new Date(),
      postedBy: 'aarohi',
      content: 'I <3 the 97.3'
    },
    {
      date: new Date(),
      postedBy: 'Asavari',
      content: 'Old hindi songs is the way to go'
    },
    {
      date: new Date(),
      postedBy: 'Rasika',
      content: 'K-pop only as far I know'
    },

  ],
  userStatus: ONLINE,
  apiCommunicationStatus: READY
}


const userStatusReducer = (state = defaultState.userStatus, {type, value}) => {
  switch(type){
    case UPDATE_STATUS:
      return value;
      break;
  }
  return state;
}

const apiCommunicationStatusReducer = (state = READY, {type}) => {
  switch(type) {
    case CREATE_NEW_MESSAGE:
      return WAITING;
    case NEW_MESSAGE_SERVER_ACCEPTED:
      return READY;
  }
  return state;
}

const messageReducer = (state = defaultState.messages, {type, value, postedBy, date}) => {
  switch(type) {
    case CREATE_NEW_MESSAGE:
      const newState = [{date, postedBy, content:value}, ... state];
      return newState;
  }
  return state;
}

const combinedReducer = combineReducers({
  userStatus: userStatusReducer,
  messages: messageReducer,
  apiCommunucationStatus: apiCommunicationStatusReducer
});

const Store = createStore(combinedReducer, applyMiddleware(logger));


document.forms.newMessage.addEventListener('submit', (e)=> {
  e.preventDefault();
  const value = e.target.newMessage.value;
  const username = localStorage['preferences'] ? JSON.parse(localStorage['preferences']).userName : 'Skale';
  Store.dispatch(newMessageAction(value, username));
})

const render = () => {
  const { messages, userStatus, apiCommunicationStatus } = Store.getState();
  document.getElementById('messages').innerHTML = messages
    .sort((a, b)=>b.date - a.date)
    .map(message=>(`
      <div>
        ${message.postedBy} : ${message.content}
      </div>
      `)).join("");

  document.forms.newMessage.fields.disabled = (userStatus === OFFLINE) || (apiCommunicationStatus === WAITING);
  document.forms.newMessage.newMessage.value = "";

}



const statusUpdateAction = (value) => {
  return {
    type: UPDATE_STATUS,
    value
  }
}

const newMessageAction = (content, postedBy) => {
  const date = new Date();

  get('/api/create', (id)=>{
    Store.dispatch({
      type: NEW_MESSAGE_SERVER_ACCEPTED
    })
  });

  return {
    type: CREATE_NEW_MESSAGE,
    value: content,
    postedBy,
    date
  }
}

document.forms.selectStatus.status.addEventListener('change', (e)=>{
  Store.dispatch(statusUpdateAction(e.target.value));
})

render();

Store.subscribe(render);


console.log('Making request');
get('http://pluralsight.com', (id)=> {
  console.log("received callback", id);
});
