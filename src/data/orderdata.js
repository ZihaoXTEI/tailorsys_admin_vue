export var getTableDate = [
        { label: '订单名称', prop: 'orderName' },
        { label: '顾客名称', prop: 'customerName' },
        { label: '量体数据编号', prop: 'anthrId' },
        { label: '衣服类型', prop: 'clothtypeName' },
        { label: '订做数量', prop: 'orderNumber' },
        { label: '预定金额', prop: 'bookedAmount' },
        { label: '订单总价', prop: 'totalAmount' },
        { label: '支付方式', prop: 'paymentMethod' },
        { label: '订单状态', prop: 'orderStatus' },
        { label: '创建时间', prop: 'createdTime' },
        { label: '交货日期', prop: 'deadline' },
        { label: '订单备注', prop: 'orderNote' }];

export var newOrderForm = {
        customerId: null,
        anthrId: null,
        clothtypeId: null,
        orderName: '',
        orderNote: '',
        orderNumber: 1,
        totalAmount: 0.0,
        paymentMethod: '',
        bookedAmount: 0.0,
        orderStatus: 1,
        createdTime: null,
        deadline: null,
        orderFabricDetailList: []
}


