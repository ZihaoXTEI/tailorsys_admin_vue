import moment from 'moment'

export function changeTimeFormat() {
    //判断参数列表个数，如果小于2个则返回
    if (arguments <= 1) {
        console.log('该方法传入参数至少两个！')
        return
    }
    //检查第一个参数是否是数组类型
    if (!(arguments[0] instanceof Array)) {
        console.log('该方法传入首个参数须为数组！')
        return
    }
    for (let obj of arguments[0]) {
        for (let i = 1; i < arguments.length; i++) {
            if (obj[arguments[i]] == null || arguments[i] == '') continue;
            obj[arguments[i]] = moment(obj[arguments[i]]).format('YYYY-MM-DD hh:mm:ss')
        }
    }
}

export function changeDateFormat() {
    //判断参数列表个数，如果小于2个则返回
    if (arguments <= 1) {
        console.log('该方法传入参数至少两个！')
        return
    }
    //检查第一个参数是否是数组类型
    if (!(arguments[0] instanceof Array)) {
        console.log('该方法传入首个参数须为数组！')
        return
    }
    for (let obj of arguments[0]) {
        for (let i = 1; i < arguments.length; i++) {
            if (obj[arguments[i]] == null || arguments[i] == '') continue;
            obj[arguments[i]] = moment(obj[arguments[i]]).format('YYYY-MM-DD')
        }
    }
}


