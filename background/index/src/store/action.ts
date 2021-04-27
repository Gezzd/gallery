import {
  CHANGE_GeLLART_STATUS,
  CHANGE_SLIDERCUSTTOM_INDEX,
  SAVE_DESC
} from "./actionType";
export function store_changeGallery(value: any) {
  return {
    type: CHANGE_GeLLART_STATUS,
    value: value,
  };
}

export function store_changeSlidercustomIndex(value: any) {
  return {
    type: CHANGE_SLIDERCUSTTOM_INDEX,
    value: value,
  };
}

export function store_saveDesc(value: any) {
  return {
    type: SAVE_DESC,
    value: value,
  };
}
