
/**
 * 判断数组中是否有重复值，如果重复返回true，否则返回false
 */
export function isRepeat(list) {
    var hash = {};
    for (var i in list) {
        if (hash[list[i]]) {
            return true;
        }
        // 不存在该元素，则赋值为true
        hash[list[i]] = true;
    }
    return false;
}

export function setOrderStatusOptionsIsDisplay(orderstatus, orderStatusList) {

    //作废的订单不予修改
    if (orderstatus == -1) {
        for (let item of orderStatusList) {
            item.disabled = true
        }
        return
    }

    for (let item of orderStatusList) {
        if (item.value === -1) {
            continue
        } else if (item.value <= orderstatus) {
            item.disabled = true
        }
    }
}

// 筛选出库存不足的布料
export function fabricStockIsEnough(array) {
  let arr = array.filter(item => {
    if (item.enough === false) {
      return item
    }
  })

  let data = []
  for (let obj of arr) {
    data.push(obj.fabricId)
  }
  return data
}