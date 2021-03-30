export var paymentMethod = [
    {
        value: 1,
        label: '现金'
    },
    {
        value: 2,
        label: '支付宝'
    },
    {
        value: 3,
        label: '微信支付'
    },
    {
        value: 4,
        label: '其它方式'
    }
];

export var orderStatus = [
    { value: -1, label: '作废', disabled: false },
    { value: 1, label: '新创建', disabled: false },
    { value: 2, label: '已裁剪', disabled: false },
    { value: 3, label: '已缝纫', disabled: false },
    { value: 4, label: '已整烫', disabled: false },
    { value: 5, label: '已完成', disabled: false },
    { value: 6, label: '已交货', disabled: false }
];

export var sex = [
    {
        value: '男',
        label: '男'
    },
    {
        value: '女',
        label: '女'
    }
]