import request from '@/utils/request'

export function getOrderViewList(formData) {
    return request({
        url: 'order/',
        method: 'get',
        params: formData
    })
}

export function getOrder(id) {
    return request({
        url: `order/${id}`,
        method: 'get'
    })

}

export function getOrderDetailAndFabric(id) {
    return request({
        url: `order/orderdetailfabric/${id}`,
        method: 'get'
    })
}

export function updateOrder(id, formData) {
    return request({
        url: `order/${id}`,
        method: 'put',
        data: formData
    })
}

export function updateOrderFabricDetail(id, formData) {
    return request({
        url: `order/orderdetail/${id}`,
        method: 'put',
        data: formData
    })
}

export function deleteOrderFabricDetail(id) {
    return request({
        url: `order/orderdetail/${id}`,
        method: 'delete'
    })
}

export function addOrderFabricDetail(formData) {
    return request({
        url: 'order/orderdetail',
        method: 'post',
        data: formData
    })
}