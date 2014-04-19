/**
 * @file random模块测试
 * - random提供了随机字符串、随机时间、随机数组的产生
 *
 * @author Liandong Liu (liuliandong01@baidu.com)
 */
var random = require('../src/index');

/**
 * isBetween 验证数据是否在指定范围
 * 
 * @param {number} num 数据
 * @param {Array} region 范围数组
 * @return {boolean} 是否在指定范围
 */
function isBetween(num, region) {
    return num >= region[0] && num <= region[1];
}

describe('jasmine-node', function () {

    it('test get random number', function () {

        // 测试产生随机数范围是否正确
        expect(
            isBetween(random.number(12, 15), [12, 15])
        ).toBe( true );

        // 测试负数范围是否正常
        expect(
            isBetween(random.number(-100, 500), [-100, 500]) 
        ).toBe( true );

        // 参数顺序自动反转
        expect( 
            isBetween(random.number(100, -100), [-100, 100]) 
        ).toBe( true );

        // 测试单个参数 (以0作为其它边界)
        expect(
            isBetween(random.number(12), [0, 12])
        ).toBe( true );

        expect(
            isBetween(random.number(-100), [-100, 0])
        ).toBe(true);

        expect(random.number(0)).toBe(0);

        // 测试无参数指定： 随机产生正数
        expect(random.number()).toBeGreaterThan(0);
    });

    it('test get random number Array', function () {
        expect(random.number({size: 15}).length).toBe(15);

        // 指定精度，则产生的是固定精度的浮点数
        var str = random.number(15, 99, {size: 15, precise: 2}).join(',');
        expect(str.length).toBeLessThan(90);
    });

    it('test get random floatNumber', function () {

        // 测试结果范围
        expect( 
            isBetween( random.floatNumber(12, 15, 2), [12, 15] )
            ).toBe(true);

        // 测试结果范围
        expect(
            isBetween( random.floatNumber(-12, 15, 2), [-12, 15] )
        ).toBe(true);

        // 指定精度
        var str = random.floatNumber(20, 99, {size: 15, precise: 2}).join(',');
        expect(str.length).toBeLessThan(90);
    });

    it('test get random boolean', function () {
        var rst = random.bool();
        rst = rst === true ||  rst === false;
        expect(rst).toBe(true);
    });

    it('test get random strings', function () {

        // 数组源
        var source = ['推广', '搜索', '营销'];

        // 获取长度为12-15的字符串
        expect(random.chars(12, 15)).toMatch(/[\w-]{12,15}/);

        // 获取长度为12的随机字符串
        expect(random.chars(12).length).toBe(12);

        // 从默认数组中获取长度为12 - 15的中文字符串
        expect(
            isBetween(random.words(12, 15).length, [12, 15])
        ).toBe(true);

        // 单独数组参数，表示从中取值一个单词
        expect(random.words(source).length).toBe(2);

        // 从源中产生长度为15的随机字符串
        expect(random.words(15, source).length).toBe(15);

        // 从数组中选取一个元素
        expect(random.getFrom(source).length).toBe(1);

        // 从数组中选取单词2词
        expect(random.getFrom(source, 5).length).toBe(5);
    });
});