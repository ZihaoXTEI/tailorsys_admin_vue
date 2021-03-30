export function fabricNoEnough(msg) {
    var message = ''
    if (msg instanceof Array) {
        for (let str of msg) {
            message += ('布料编号[<strong> ' + str + ' </strong>]的库存不足<br>')
        }
    }
    return message

}

export function MapListToArray(mapList) {
    var array = []
    for (let map of mapList) {
        var values = []
        for (let obj in map) {
            values.push(map[obj])
        }
        array.push(values)
    }
    return array
}
