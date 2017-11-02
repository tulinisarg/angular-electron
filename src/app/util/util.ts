export class Utility {
  constructor() { }
  generateArray(obj) {
    if (obj && Object.keys(obj).length > 0) {
      return Object.keys(obj).map((key) => { return obj[key] });
    }
    return [];
  }

  /**
   * index of the array in which the object was found.
   * if index = -1, then the object was not found
   * Returns {
   *  index: index, bool: true|false
   * }
   * @param obj Object to be searched in the list
   * @param list List of type array in which the object is to be searched
   */
  containsObject(obj, list) {
    for (let index = 0; index < list.length; index++) {
      if (this.objectEquals(list[index].config, obj)) {
        return {
          "index": index,
          "bool": true
        }
      }
    }
    return {
      "index": -1,
      "bool": false
    };
  }

  objectEquals(x, y) {

    if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) { return false; }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) { return x === y; }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) { return x === y; }
    if (x === y || x.valueOf() === y.valueOf()) { return true; }
    if (Array.isArray(x) && x.length !== y.length) { return false; }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) { return false; }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) { return false; }
    if (!(y instanceof Object)) { return false; }

    // recursive object equality check
    var p = Object.keys(x);
    return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
      p.every((i) => { return this.objectEquals(x[i], y[i]); });
  }

  generateUUID() {
    return this.__s4() + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + '-' + this.__s4() + this.__s4() + this.__s4();
  }

  __s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  /* generates array of keys when complex object is provided */
  generateArrayOfKeys(obj) {
    if (obj && Object.keys(obj).length > 0) {
      return Object.keys(obj).map((key) => {
        return obj[key];
      });
    }
    return [];
  }

  /* generates array of keys and value pairs of each object when complex object is provided */
  generateArrayOfKeyValuePairs(obj) {
    var arr = [];
    if (obj && Object.keys(obj).length > 0) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          arr.push({ key: key, val: obj[key] });
        }
      };
      return arr;
    }
    return [];
  }
}
