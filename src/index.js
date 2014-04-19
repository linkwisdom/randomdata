/**
 * @file 不同类型随机数产生器
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */

/**
 * 随机数的配置
 *
 * @const
 * @type {number}
 */
var ONE_DAY = 86400000;
var MAX_NUM = Math.pow(2, 32);

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
 * @type {string}
 */
var CHARS = 'abcdefg-hijklmnopqrstu-vwxyz-'
    + 'ABCDEFGHIG-KLMNOPQRSTU-VWXYZ-0123456789';

/**
 * 转化参数
 *
 * @inner
 * @param {number=} min 最小值
 * @param {number=} max 最大值
 * @return {Obect}   参数对象
 */
function parseArgs(min, max) {
    var minType = typeof min;

    if (typeof max !== 'number') {
        max = (minType === 'number') ? 0 : MAX_NUM;
    }

    min = (minType === 'number') ? min : 0;

    if (max < min) {
        var t = min;
        min = max;
        max = t;
    }

    return {
        min: min,
        max: max
    };
}

/**
 * randInt 随机整数
 *
 * @inner
 * @param {number=} min 最小取值
 * @param {number=} max 最大取值
 * @return {number}     返回整数
 */
function randInt(min, max) {
    var args = parseArgs(min, max);
    return Math.round((args.max - args.min) * Math.random() + args.min);
}

/**
 * randInt 随机浮点数
 *
 * @inner
 * @param {number=} min 最小取值
 * @param {number=} max 最大取值
 * @param {number=} precise 精度(0-20)
 * @return {number}  返回浮点数
 */
function randFloat(min, max, precise) {
    var args = parseArgs(min, max);
    var num = (args.max - args.min) * Math.random() + args.min;
    return precise ? +(num).toFixed(precise) : num;
}

/**
 * randInt 随机布尔值
 *
 * @inner
 * @return {number} 返回布尔值
 */
function randBool() {
    return Math.random() > 0.5;
}

/**
 * initArray 随机整数数组
 *
 * @inner
 * @param {number=} min 最小取值
 * @param {number=} max 最大取值
 * @param {number=} size 数组长度
 * @return {Array.<number>}     随机数组
 */
function intArray(min, max, size) {
    var arr = [];
    for (var i = size - 1; i >= 0; i--) {
        arr[i] = randInt(min, max);
    }
    return arr;
}

/**
 * floatArray 随机浮点数组
 *
 * @inner
 * @param {number=} min 最小取值
 * @param {number=} max 最大取值
 * @param {number=} size 数组长度
 * @param {number=} precise 精度位数(0-20)
 * @return {Array.<number>}   随机数组
 */
function floatArray(min, max, size, precise) {
    var arr = [];
    for (var i = size - 1; i >= 0; i--) {
        arr[i] = randFloat(min, max, precise);
    }
    return arr;
}

/**
 * getFrom 从数组中随机选择num个元素
 *
 * @public
 * @param {Array.<*>=} source 数据源
 * @param {number=} num 个数
 * @return {Array.<*>}  返回数组
 */
exports.getFrom = function (source, num) {
    source || (source = CN_WORDS);
    var len = source.length;
    var rst = [];

    for (var i = 0, l = num || 1 ; i < l ; i++) {
        var idx = randInt(0, len - 1);
        rst.push(source[idx]);
    }
    return rst;
};

/**
 * 获取随机整数
 *
 * @public
 * @param {number=} min 最小取值
 * @param {number=} max 最大取值
 * @param {number=} option.size
 * @param {number=} option.precise
 * @return {number} 随机数值
 */
exports.number = function (min, max, option) {
    option = option || arguments[arguments.length - 1] || {};

    if (option.precise > 0) {
        return exports.floatNumber(min, max, option);
    }

    if (option.size > 0) {
        return intArray(min, max, option.size);
    }

    if (option.precise > 0) {
        return randFloat(min, max);
    }

    return randInt(min, max);
};

/**
 * 获取随机浮点数
 *
 * @public
 * @param {number=} min 最小取值
 * @param {number=} max 最大取值
 * @param {number=} precise 数值精度0-20
 * @param {number=} option.size
 * @param {number=} option.precise
 * @return {number} 随机数值
 */
exports.floatNumber = function (min, max, option) {
    option = option || arguments[arguments.length - 1] || {};
    if (option.size > 0) {
        return floatArray(min, max, option.size, option.precise);
    }
    
    return randFloat(min, max, option.precise);
};

/**
 * 获取随机布尔值
 *
 * @public
 * @return {boolean} 随机布尔值
 */
exports.bool = function () {
    return randBool();
};

/**
 * 获取随机时间戳
 *
 * @public
 * @param {number=} pre   当前时间之前多少天
 * @param {number=} after 当前时间之后多少天
 * @return {number} 时间戳值
 */
exports.timestamp = function (pre, after) {
    var num = randInt(pre || 0, after || 0);
    var timestamp = +(new Date()) + ONE_DAY * num;
    return (timestamp).toString(10);
};

/**
 * 获得随机格式化时间
 *
 * @public
 * @param {number=} pre   当前时间之前多少天
 * @param {number=} after 当前时间之后多少天
 * @param {string=} format 时间格式
 * @return {number} 格式化时间
 */
exports.formatDate = function (pre, after, format) {
    var moment = require('moment');
    format || (format = 'YYYY-MM-DD');
    var timestamp = +this.timestamp(pre, after);
    return moment.utc(timestamp).format(format);
};

/**
 * 获得随机字符串
 * - 长度按utf8长度计算，单个中英文字符长度均为1，
 *
 * @public
 * @param {number=} min 字符最小长度
 * @param {number=} max 字符最大长度
 * @param {Array.<string>=} source 字符最小长度
 * @return {string} 随机字符串
 */
exports.words = function (min, max, source) {
    var arg1 = arguments[0];

    // 如果第一个参数是数组，则视为source
    if (Array.isArray(min)) {
        source = min;
        min = max = 1;

    // 否则如果第二个参数为数组，则视为source
    } else if (Array.isArray(max)) {
        source = max;
        max = min;

    // 如果第一个参数未定义，默认返回一个单词
    } else if (arg1 === undefined) {
        min = max = 1;
    }

    source = source || CN_WORDS;
    var len = source.length;
    var num = randInt(min, max || min);
    var rst = [];
    var count = 0;
   
    for (var i = 0; i < num && count < num; i++) {
        var idx = randInt(0, len - 1);
        count += source[idx].length;

        if (count <= num) {

            // 如果更改装下当前对象，直接装入
            rst = rst.concat(source[idx]);
        } else if (Array.isArray(arg1)) {

            // 如果第一个参数是数组；从数组中随机取一个数
            rst = rst.concat(source[idx]);
            break;
        } else {

            // 如果不能装入；装入部分
            rst = rst.concat(
                source[idx].slice(0, num - count + source[idx].length)
            );
            break;
        }
    }

    // 拼接字符串
    return rst.join('');
};

/**
 * 随机英文字符
 *
 * @public
 * @param {number=} min 最小长度取值
 * @param {number=} max 最大长度取值
 * @return {string} 返回英文字符
 */
exports.chars = function (min, max) {
    return this.words(min, max, CHARS);
};