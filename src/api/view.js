import request from '@/utils/request'

export function getMenuList() {
    return request({
        url: 'view/menus/',
        method: 'get'
    })
}

export function getClothTypeSelect() {
    return request({
        url: 'view/clothtype',
        method: 'get'
    })
}

export function getFabricTypeSelect(){
    return request({
        url:'view/fabrictype',
        method:'get'
    })
}

export function getFabricInfoSelect(){
    return request({
        url:'view/fabricinfo/',
        method:'get'
    })
}

export function getSupplierSelect(){
    return request({
        url:'view/supplier',
        method:'get'
    })
}

export function getUserSelcet(){
    return request({
        url:'view/user',
        method:'get'
    })
}

export function getCustomerSelect(){
    return request({
        url:'view/customer',
        method:'get'
    })
}

export function getAnthropometrySelectByCustomerId(customerid){
    return request({
        url:`view/anthropometry/${customerid}`,
        method:'get'
    })
}

export function getFabricInfoSearch(name){
    return request({
        url:`view/fabricinfo/${name}`,
        method:'get'
    })
}

export function getClothConsumptionCloumnList() {
    return request({
        url: 'view/clothconsumptioncolumn',
        method: 'get'
    })
}

export function getClothTypeCloumnList(){
    return request({
        url: 'view/clothtypecolumn',
        method: 'get'
    })
}

export function getAnthropometryCloumnListByClothtypeId(clothtypeid){
    return request({
        url:`view/anthrdata/${clothtypeid}`,
        method:'get'
    })
}