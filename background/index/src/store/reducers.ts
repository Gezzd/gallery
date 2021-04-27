import methods from "../methods";
import {
  CHANGE_GeLLART_STATUS,
  CHANGE_SLIDERCUSTTOM_INDEX,
  SAVE_DESC
} from "./actionType";
const defaultState = {}; //默认数据
export default (state = defaultState, action: any) => {
  if (action.type) {
    let currentState = {};
    switch (action.type) {
      case CHANGE_GeLLART_STATUS:
        currentState = (function () {
          let newState = methods.deepCopy(state);
          newState.galleryStatus = action.value;
          return newState;
        })();
        break;

      case CHANGE_SLIDERCUSTTOM_INDEX:
        currentState = (function () {
          let newState = methods.deepCopy(state);
          newState.slidercustomIndex = action.value;
          return newState;
        })();
        break;

      case SAVE_DESC:
        currentState = (function () {
          let newState = methods.deepCopy(state);
          newState.desc = action.value;
          return newState;
        })();
        break;
      default:
        break;
    }
    return currentState;
  }

  //就是一个方法函数
  return state;
};
