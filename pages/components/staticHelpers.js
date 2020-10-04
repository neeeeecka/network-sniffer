class StaticHelpers {
  static animatorSingleton() {
    if (!window.animatorSingleton) {
      window.animatorSingleton = {};
      window.animatorSingleton.frames = {};
      frames = window.animatorSingleton.frames;
      const update = () => {
        let timeNow = new Date().getTime();
        const deltaTime = (timeNow - this.timePreFrame) / 1000;

        for (let frame in frames) {
          frames[frame](deltaTime);
        }

        this.timePreFrame = timeNow;
        window.requestAnimationFrame(update);
      };
      // window.animatorSingleton.newAnimationFrame = () => {
      //   update();
      //   return true;
      // };
      window.animatorSingleton.extendAnimationFrame = (extension, id) => {
        frames[id] = extension;
      };
      window.animatorSingleton.deleteAnimationFrame = id => {
        delete frames[id];
      };
      window.animatorSingleton.getId = tag => {
        return Object.keys(frames).length + "-" + tag;
      };
      update();
    }
    return window.animatorSingleton;
  }
  static clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }
  static lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }
  static flattenObj(obj, parent, _time = 0, res = {}) {
    const objTime = obj["_time"] ? obj["_time"] : 0;
    for (let key in obj) {
      let propName = parent ? parent + "." + key : key;
      if (this.isObject(obj[key])) {
        this.flattenObj(obj[key], propName, _time + objTime, res);
      } else {
        if (propName.includes("_time")) {
          res[propName] = obj[key] + _time;
        } else {
          res[propName] = obj[key] + _time + objTime;
        }
      }
    }
    return res;
  }
  static getKeyPath(obj, parent, res = "") {}
  static cloneObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  static getValueByKeyPath(object, splitKeyPath) {
    let next = null;
    for (let i = 0; i < splitKeyPath.length; i++) {
      next = object[splitKeyPath[i]];
      console.log(next, object, splitKeyPath[i]);
    }
    return next;
  }
  static getKeyByValue(object, findVal) {
    let res = undefined;
    this.iterateObject(object, (key, val) => {
      if (val == findVal) {
        res = key;
      }
    });
    return res;
  }
  static isObject(test) {
    return typeof test === "object" && test !== null;
  }
  static iterateObject(obj, isVal, optKey = "") {
    if (this.isObject(obj)) {
      Object.keys(obj).forEach(key => {
        isVal(key, obj);
        obj[key] = this.iterateObject(obj[key], isVal, key);
      });
    } else {
      const returned = isVal(optKey, obj);
      if (returned !== undefined) {
        obj = returned;
      }
    }
    return obj;
  }
  static setObjectValues(obj, newVal) {
    return this.iterateObject(obj, (key, val) => {
      if (typeof newVal === "function") {
        return newVal(key, val);
      } else {
        return newVal;
      }
    });
  }
}
export default StaticHelpers;
