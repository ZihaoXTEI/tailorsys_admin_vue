import request from '@/utils/request'

export var ImageURL = 'http://localhost:8899/api/image/'
//export var ImageURL = '/api/image/'

export var uploadImage = 'http://localhost:8899/api/file/uploadimage';
//export var uploadImage = '/api/file/uploadimage';

export function removeImage(imagename) {
    if (imagename == null || imagename === '') {
        return
    }
    return request({
        url: `file/removeimage/${imagename}`,
        method: 'get'
    })
}