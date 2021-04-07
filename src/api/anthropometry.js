import request from '@/utils/request'

//根据量体编号获取顾客的量体信息
export function getAnthropometry(id) {
    return request({
        url: `anthr/${id}`,
        method: 'get',
    })
}

//新建顾客量体信息
export function addAnthropometry(id,anthrnote) {
    return request({
        url: `anthr/${id}/${anthrnote}`,
        method:'post'
    })
}

//更新（保存）顾客的量体信息
export function updateAnthropometry(id,formData){
    return request({
        url:`anthr/${id}`,
        method:'put',
        data:formData
    })
}