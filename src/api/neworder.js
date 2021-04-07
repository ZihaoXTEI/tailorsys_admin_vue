import request from '@/utils/request'

//验证布料是否充足
export function verifyFabricIsEnough(anthrid,clothtypeid,list){
    console.log(list)
    return request({
        url:`data/clothconsumption/verif/${anthrid}/${clothtypeid}/${list}`,
        method:'get'
    })
}

//新建订单方法
export function addOrder(formData){
    return request({
        url:'neworder/',
        method:'post',
        data:formData
    })
}
