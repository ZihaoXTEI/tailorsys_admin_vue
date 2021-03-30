import request from '@/utils/request'

export function removeImage(imagename) {
    if(imagename == null || imagename === ''){
        return
    }
    return request({
        url: `file/removeimage/${imagename}`,
        method: 'get'
    })
}