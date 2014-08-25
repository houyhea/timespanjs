# Timespanjs API

本文档描述timespanjs的方法。

## 静态方法
### Timespan.fromDates(startDate, endDate)
通过javascript Date对象获取Timespan实例
#### startDate:Date类型
起始日期，必须
#### endDate:Date类型
结束日期，可选。默认:now


```js
var dt=new Date("2014-7-1");
var dt1=new Date("2014-8-1 10:12:15:234");
var ts=Timespan.fromDates(dt,dt1);
```

### Timespan.version
获取Timespanjs的版本信息
### Timespan.lang(key, value)
设置(获取）当前语言（如果value为空），添加语言（如果value不为空）
如果不传任何参数，则返回当前语言选项配置。
#### key:string
语言键，该参数的值按照区域标准字符串表示。
区域ID，又称区域设置标识符。区域ID一般由两个常量组成：国家码和语言码。例如：en-US,en-UK分别表示在US和UK使用的英文。参考[维基百科](http://zh.wikipedia.org/wiki/%E5%8C%BA%E5%9F%9F%E8%AE%BE%E7%BD%AE)
本文档描述的国际化方案指定的区域ID统一采用小写模式，比如：en-us，en-uk。
#### value:object
语言对象.该对象必须包含一个humanize方法。可以通过如下示例添加一种语言支持。
```js
Timespan.lang('en', {
            humanize: function (ts, baseUnit, length) {
                return _humanize.call(this, ts, baseUnit, length, this.DELIMITER);
            },
            DELIMITER: ",",
            SINGLUAR: {
                ms: "%d ms",
                s: "%d second",
                m: "%d minute",
                h: "%d hour",
                d: "%d day",
                w: "%d week",
                M: "%d month",
                y: "%d year"
            },
            PLURAL: {
                ms: "%d ms",
                s: "%d seconds",
                m: "%d minutes",
                h: "%d hours",
                d: "%d days",
                w: "%d weeks",
                M: "%d months",
                y: "%d years"
            }
        }
```
##### humanize(ts, baseUnit, length)
该方法实现具体的时间差人性化显示。返回而人性化字符串。
###### ts
Timespan对象实例

###### baseUnit
基本显示单位，可选值：
+ y。表示：年
+ M。表示：月
+ w。表示：周
+ d。表示：日
+ h。表示：小时
+ m。表示：分钟
+ s。表示：秒
+ ms。表示：毫秒
###### length:显示长度
显示单位的长度。最大不能超过：8。最小：1.超过则默认为8.

