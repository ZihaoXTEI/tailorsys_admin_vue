// 验证输入数字字符是否合法
export var validateDouble = (rule, value, callback) => {
    if (
        rule.required === false &&
        (value === "" || value === null || value === undefined)
    ) {
        callback();
    }
    const isDouble = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
    if (isDouble.test(value)) {
        callback();
    } else {
        callback(
            new Error(rule.message || "请输入正确的数字格式，例：10, 10.00")
        );
    }
};

export var validateValue = (rule, value, callback) => {
    if (
        rule.required === false &&
        (value === "" || value === null || value === undefined)
    ) {
        callback();
    }

    if (value > 0) {
        callback();
    } else {
        callback(
            new Error(rule.message || "请输入数值")
        );
    }
};

