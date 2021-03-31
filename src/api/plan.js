import request from '@/utils/request'

export function getOrderProcessList(queryInfo) {
    return request({
        url: 'plan/orderprocess/',
        method: 'get',
        params: queryInfo
    })
}

export function updateOrderStatus(id, name, datetime) {
    return request({
        url: `plan/updateorderstatus/${id}/${name}/${datetime}`,
        method: 'put'
    })
}

export function getEventList() {
    return request({
        url: 'plan/ordercalendar/event',
        method: 'get'
    })
}

export function addEvent(formData) {
    return request({
        url: 'plan/ordercalendar/',
        method: 'post',
        data: formData
    })
}

export function updateEvent(id, formData) {
    return request({
        url: `plan/ordercalendar/${id}`,
        method: 'put',
        data: formData
    })
}

export function deleteEvent(id) {
    return request({
        url: `plan/ordercalendar/${id}`,
        method: 'delete'
    })
}

export function getOrderList() {
    return request({
        url: 'plan/ordercalendar/order',
        method: 'get'
    })
}