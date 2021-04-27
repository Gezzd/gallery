// 随机值
export function hashKey(len: number) {
  let resultStr = "";
  let hashStr = "abcdefghijklmnopquvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789#*";
  while (len > 0) {
    len--;
    resultStr += hashStr[Math.floor(Math.random() * hashStr.length)];
  }
  return resultStr;
}

// 深拷贝
export function deepCopy(args: any): any {
  if (!args || !("object" === typeof args)) {
    throw new Error("deepCopy方法参数类型错误！");
  }

  let result: any;
  if (Array.isArray(args)) {
    result = [];
    for (const ag of args) {
      result.push(ag);
    }
  }

  if ("object" === typeof args && !Array.isArray(args)) {
    result = {};
    for (const ag of Object.keys(args)) {
      if (args[ag] && "object" === typeof args[ag]) {
        result[ag] = deepCopy(args[ag]);
      } else {
        result[ag] = args[ag];
      }
    }
  }
  return result;
}

// 防抖函数
export function debounce(func: any, wait: number, self: object) {
  let timeout: ReturnType<typeof setTimeout> | null,
    _self = self || null,
    immediate: boolean = true;
  return function () {
    let context = _self;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    if (immediate) {
      if (immediate) func.apply(context, args);
      timeout = setTimeout(function () {
        immediate = true;
      }, wait);
      immediate = false;
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args);
        immediate = true;
      }, wait);
    }
  };
}
export default { hashKey, deepCopy, debounce };
