const GOT_TASK = 'GOT_TASK';

export const gotTask = task => ({ type: GOT_TASK, task });

const reducer = (state = {}, action) => {
  switch (action.type) {
  case GOT_TASK:
    return action.task;
  default:
    return state;
  }
};
export default reducer;