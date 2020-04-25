// 全局公共方法
import {getCityInfo} from './api/City/index'

// 1\返回Promise =》 外边的调用者可以通过async await方式获取resolve的数据
// 2\ 城市信息存储到本地=》sessionStorage
const CURR_CITY = "curr_city";
export {CURR_CITY}

// 封装本地存储的方法
export function setLocal (key,value) {
    sessionStorage.setItem(key,value)
}
// 获取本地数据
export function getLocal (key) {
    sessionStorage.getItem(key)
}
// 删除本地数据的方法
export function delLocal (key) {
    sessionStorage.removeItem(key)
}

export function getCurCity() {
  // 先从本地获取之前保存过的城市信息
  let curCity = JSON.parse(sessionStorage.getItem(CURR_CITY));
  if (!curCity) {
    //    如果没有（第一次定位）
    // 获取定位信息 返回Promise对象
    return new Promise((resove, reject) => {
      // 根据IP定位当前城市的类
      let myCity = new window.BMap.LocalCity();
      // 调用了获取城市实例
      myCity.get(async (result) => {
        let cityName = result.name;
        console.log(result)
        console.log('当前定位城市：'+cityName)

        // 调用接口获取信息
        const res = await getCityInfo(cityName);
        // console.log(res)
        if (res.status === 200) {
        // 传递数据
        setLocal(CURR_CITY,JSON.stringify(res.data))
        //   存储到本地
          resove(res.data);
        }
      });
    });
  } else {
    //    如果有，返回本地存储获取信息
    return Promise.resolve(curCity)
  }
}
