// 首页相关所有接口

import api from '../../axios'

// 轮播图接口
export function getSwiper () {
    // 返回一个promise
    return api.get('/home/swiper')
}


// 租房小组接口
export function getGroup (area = 'AREA|88cf55c-aaa4-e2e0') {
    return api.get('/home/groups',{
        params:{
            area
        }
    })
}

// 资讯列表的数据
export function getNews (area = 'AREA|88cf55c-aaa4-e2e0') {
    return api.get('/home/news',{
        params:{
            area
        }
    })
}