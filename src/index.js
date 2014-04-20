/**
 * @file 不同类型随机数产生器
 * - 本文件 为nodeJS module
 * - 浏览器端使用可以通过browsify等方式封装即可使用
 * 
 * @author Liandong Liu (liuliandong01@baidu.com)
 */

/**
 * 一天的毫秒数
 *
 * @const
 * @type {number}
 */
var ONE_DAY = 86400000;

/**
 * 设定的最大随机数
 *
 * @const
 * @type {number}
 */
var MAX_NUM = Math.pow(2, 32) - 1;

/**
 * 随机中文字符串，建议用户自己指定随机数组
 * 
 * @const
 * @type {Array.<string>}
 */
var CN_WORDS = [
    '第一', '权威', '儿童', '成人', '职场',
    '英语', '健康', '幼儿', '中学', '小学'
];

/**
 * 有偏差的随机英文数字随机字符组合
 *
 * @const
 * @type {string}
 */
var CHARS = 'abcdefg-hijklmnopqrstu-vwxyz-'
    + 'ABCDEFGHIG-KLMNOPQRSTU-VWXYZ-0123456789';

/**
 * 转化min及max参数
 * - 定义一个参数x，将产生[x, 0]值范围内随机数
 * - 自动会调整min与max, 直接的大小关系
 *
 * ```
 * randNumber(10) ~ [0, 10]
 * randNumber(-10) ~ [-10, 0]
 * randNumber(-10, 10) ~ [-10, 10]
 * randNumber(10, -10) ~ [-10, 10]
 * randNumber(0) ~ [0, 0]
 * ```
 * 
 * @inner
 * @param {number=} opt_min 最小值
 * @param {number=} opt_max 最大值
 * @return {Object} 参数对象
 */
function randNumber(opt_min, opt_max) {
    var isNumber = typeof opt_min === 'number';

    // 如果第二个参数不存在或不是数字
    if (typeof opt_max !== 'number') {
        // 如果第一个参数是数字，则第一个参数如果存在实际当作最大值
        opt_max = isNumber ? 0 : MAX_NUM;
    }

    // 取有意义的最小值，否则最小值为0
    opt_min = isNumber ? opt_min : 0;

    // 调整大小关系
    if (opt_max < opt_min) {
        var t = opt_min;
        opt_min = opt_max;
        opt_max = t;
    }

    return (opt_max - opt_min) * Math.random() + opt_min;
}

/**
 * randInt 随机整数
 * 
 * @inner
 * @param {number=} opt_min 最小取值
 * @param {number=} opt_max 最大取值
 * @return {number} 返回整数
 */
function randInt(opt_min, opt_max) {
    return Math.round(randNumber(opt_min, opt_max));
}

/**
 * randInt 随机浮点数
 * - 数据产生规则同randInt
 * - precize最大精度为20
 * 
 * @inner
 * @param {number=} opt_min 最小取值
 * @param {number=} opt_max 最大取值
 * @param {number=} opt_precise 精度(0-20)
 * @return {number} 返回浮点数
 */
function randFloat(opt_min, opt_max, opt_precise) {
    var num = randNumber(opt_min, opt_max);
    return opt_precise ? +(num).toFixed(opt_precise) : num;
}

/**
 * randIntArray 随机整数数组
 *
 * @inner
 * @param {number=} opt_min 最小取值
 * @param {number=} opt_max 最大取值
 * @param {number=} opt_size 数组长度
 * @return {Array.<number>} 随机数组
 */
function randIntArray(opt_min, opt_max, opt_size) {
    var arr = [];
    var i = opt_size || 0;
    while (i--) {
        arr.push(randInt(opt_min, opt_max))
    }
    return arr;
}

/**
 * randFloatArray 随机浮点数组
 *
 * @inner
 * @param {number=} opt_min 最小取值
 * @param {number=} opt_max 最大取值
 * @param {number=} opt_size 数组长度
 * @param {number=} opt_precise 精度位数(0-20)
 * @return {Array.<number>} 随机数组
 */
function randFloatArray(opt_min, opt_max, opt_size, opt_precise) {
    var arr = [];
    var i = opt_size || 0;
    while (i--) {
        arr.push(randFloat(opt_min, opt_max, opt_precise));
    }
    return arr;
}

/**
 * 判断是否数组
 * 
 * @param {*} obj 被判断对象
 * @return {boolean} 是否为数组
 */
function isArray(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    } else {
        return obj instanceof Array;
    }
}

/**
 * getFrom 从数组中随机选择num个元素
 *
 * @public
 * @param {Array.<*>=} opt_source 数据源
 * @param {number=} opt_num 个数
 * @return {Array.<*>} 返回数组
 */
exports.getFrom = function (opt_source, opt_num) {
    var source = opt_source || CN_WORDS;
    var len = source.length;
    var rst = [];
    var idx = 0;

    for (var i = 0, l = opt_num || 1; i < l; i++) {
        idx = randInt(0, len - 1);
        rst.push(source[idx]);
    }
    return rst;
};

/**
 * 获取随机整数
 *
 * @public
 * @param {number=} opt_min 最小取值
 * @param {number=} opt_max 最大取值
 * @param {Object=} opt_option 选项参数
 * @return {number} 随机数值
 */
exports.number = function (opt_min, opt_max, opt_option) {
    var option = {};

    // 最后一个object参数作为option
    for (var i = arguments.length - 1; i >= 0; i--) {
        if (typeof arguments[i] == 'object') {
            option = arguments[i];
        }
    };
     
     // 如果指定精度，返回浮点数据
    if (option.precise > 0) {
        return exports.floatNumber(opt_min, opt_max, option);
    }

    // 如果指定大小，返回整数数组
    if (option.size > 0) {
        return randIntArray(opt_min, opt_max, option.size);
    }

    // 返回单个整数
    return randInt(opt_min, opt_max);
};

/**
 * 获取随机浮点数
 *
 * @public
 * @param {number=} opt_min 最小取值
 * @param {number=} opt_max 最大取值
 * @param {Object=} opt_option 最大取值
 * @return {number} 随机数值
 */
exports.floatNumber = function (opt_min, opt_max, opt_option) {
    var option = {};

    // 最后一个object参数作为option
    for (var i = arguments.length - 1; i >= 0; i--) {
        if (typeof arguments[i] == 'object') {
            option = arguments[i];
        }
    };

    // 如果指定大小，返回浮点数组
    if (option.size > 0) {
        return randFloatArray(opt_min, opt_max, option.size, option.precise);
    }
    
    // 返回单个浮点数
    return randFloat(opt_min, opt_max, option.precise);
};

/**
 * 获取随机布尔值
 *
 * @public
 * @return {boolean} 随机布尔值
 */
exports.bool = function () {
    return Math.random() > 0.5;
};

/**
 * 获取随机时间戳
 * - 默认返回当前的时间戳
 * 
 * @public
 * @param {number=} opt_pre 当前时间之前多少天
 * @param {number=} opt_after 当前时间之后多少天
 * @return {string} 时间戳值
 */
exports.timestamp = function (opt_pre, opt_after) {
    var num = randInt(opt_pre || 0, opt_after || 0);
    var timestamp = +(new Date()) + ONE_DAY * num;
    return (timestamp).toString(10);
};

/**
 * 获得随机格式化时间
 *
 * @public
 * @param {number=} opt_pre 当前时间之前多少天
 * @param {number=} opt_after 当前时间之后多少天
 * @param {string=} opt_format 时间格式
 * @return {string} 格式化时间
 */
exports.formatDate = function (opt_pre, opt_after, opt_format) {
    var moment = require('moment');
    var format = opt_format || 'YYYY-MM-DD';
    var timestamp = +this.timestamp(opt_pre, opt_after);
    return moment.utc(timestamp).format(format);
};

/**
 * 获得随机字符串
 * - 长度按utf8长度计算，单个中英文字符长度均为1
 *
 * @public
 * @param {number=} opt_min 字符最小长度
 * @param {number=} opt_max 字符最大长度
 * @param {string|Array.<string>=} opt_source 数据源（字符串或字符串数组）
 * @return {string} 随机字符串
 */
exports.words = function (opt_min, opt_max, opt_source) {
    var arg1 = arguments[0];
    var source = opt_source || CN_WORDS;

    // 如果第一个参数是数组，则视为source
    if (isArray(opt_min)) {
        source = opt_min;
        opt_min = opt_max = 1;

    // 否则如果第二个参数为数组，则视为source
    } else if (isArray(opt_max)) {
        source = opt_max;
        opt_max = opt_min;

    // 如果第一个参数未定义，默认返回一个单词
    } else if (arg1 === undefined) {
        opt_min = opt_max = 1;
    }

    var len = source.length;
    var num = randInt(opt_min, opt_max || opt_min);
    var result = [];
    var count = 0;
    var idx = 0;
   
    for (var i = 0; i < num && count < num; i++) {
        idx = randInt(0, len - 1);
        count += source[idx].length;

        if (count <= num) {
            // 如果能够装下当前对象，直接装入
            result = result.concat(source[idx]);
        } else if (isArray(arg1)) {
            // 如果第一个参数是数组；从数组中随机取一个数
            result = result.concat(source[idx]);
            break;
        } else {
            // 如果不能装入，装入部分
            result = result.concat(
                source[idx].slice(0, num - count + source[idx].length)
            );
            break;
        }
    }

    // 拼接字符串
    return result.join('');
};

/**
 * 随机英文字符
 *
 * @public
 * @param {number=} opt_min 最小长度取值
 * @param {number=} opt_max 最大长度取值
 * @return {string} 返回英文字符
 */
exports.chars = function (opt_min, opt_max) {
    return exports.words(opt_min, opt_max, CHARS);
};
