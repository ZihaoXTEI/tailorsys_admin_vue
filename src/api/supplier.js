import request from '@/utils/request'

export function getSupplierList(queryInfo) {
    return request({
        url: 'supplier/',
        method: 'get',
        params: queryInfo
    })
}

export function addSupplier(formData) {
    return request({
        url: 'supplier/',
        method: 'post',
        data: formData
    })
}

export function getSupplier(id) {
    return request({
        url: `supplier/${id}`,
        method: 'get',
    })
}

export function updateSupplier(id, formData) {
    return request({
        url: `supplier/${id}`,
        method: 'put',
        data: formData
    })
}

export function updateSupplierStatus(id,status){
    return request({
        url: `supplier/${id}/${status}`,
        method: 'put',
    })
}

export function deleteSupplier(id){
    return request({
        url: `supplier/${id}`,
        method: 'delete',
    })
}