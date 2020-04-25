import api from '../../axios'

// 城市数据接口
export function getCityInfo (name) {
    // 返回一个promise
    return api.get('/area/info',{
        params: {
            name
        }
    })
}

// 获取城市列表数据
export function getCityList (level=1) {
    // 返回一个promise
    return api.get('/area/city',{
        params: {
            level
        }
    })
}

// 获取热门城市
export function getHotCity (level=1) {
    // 返回一个promise
    return api.get('/area/hot')
}