import request from '@/utils/request'

export function getClothConsumptionList(queryInfo) {
    return request({
        url: 'data/clothconsumption/',
        method: 'get',
        params: queryInfo
    })
}

export function addClothConsumption(formData){
    return request({
        url: 'data/clothconsumption/',
        method: 'post',
        data: formData
    })
}

export function getClothConsumption(id){
    return request({
        url: `data/clothconsumption/${id}`,
        method: 'get',
    })
}

export function updateClothConsumption(id,formData){
    return request({
        url: `data/clothconsumption/${id}`,
        method: 'put',
        data: formData
    })
}

//验证布料是否充足
export function verifyFabricIsEnough(anthrid,clothtypeid,list){
    console.log(list)
    return request({
        url:`data/clothconsumption/verif/${anthrid}/${clothtypeid}/${list}`,
        method:'get'
    })
}