import request from '@/utils/request'

export function getCustomerList(queryInfo) {
    return request({
        url: 'customer/',
        method: 'get',
        params: queryInfo
    })
}

export function addCustomer(formData) {
    return request({
        url: 'customer/',
        method: 'post',
        data: formData
    })
}

export function getCustomer(id) {
    return request({
        url: `customer/${id}`,
        method: 'get',
    })
}

export function updateCustomer(id, formData) {
    return request({
        url: `customer/${id}`,
        method: 'put',
        data: formData
    })
}

export function updateCustomerStatus(id,status){
    return request({
        url: `customer/${id}/${status}`,
        method: 'put',
    })
}