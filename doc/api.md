# Timespanjs API

本文档描述timespanjs的api接口方法及属性。

## 静态方法
### Timespan.fromDates(startDate, endDate)
通过javascript Date对象获取Timespan实例。
###### startDate:Date类型
起始日期，必须。
###### endDate:Date类型
结束日期，可选。默认:now。

```js
var dt=new Date(2014,7,1);
var dt1=new Date(2014,8,1,10,12,15,234);
var ts=Timespan.fromDates(dt,dt1);
```

### Timespan.version
获取Timespanjs的版本信息。
### Timespan.lang(key, value)
设置(获取）当前语言（如果value为空），添加语言（如果value不为空）
如果不传任何参数，则返回当前语言选项配置。
###### key:string
语言键，该参数的值按照区域标准字符串表示。
区域ID，又称区域设置标识符。区域ID一般由两个常量组成：国家码和语言码。例如：en-US,en-UK分别表示在US和UK使用的英文。参考[维基百科](http://zh.wikipedia.org/wiki/%E5%8C%BA%E5%9F%9F%E8%AE%BE%E7%BD%AE)
本文档描述的国际化方案指定的区域ID统一采用小写模式，比如：en-us，en-uk。
###### value:object
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
该方法实现具体的时间差人性化显示。返回人性化字符串。
###### ts
Timespan对象实例。

###### baseUnit
基本显示单位，可选值：
+ 'y'。表示：年
+ 'M'。表示：月
+ 'w'。表示：周
+ 'd'。表示：日
+ 'h'。表示：小时
+ 'm'。表示：分钟
+ 's'。表示：秒
+ 'ms'。表示：毫秒

###### length
显示单位的长度。最大不能超过：8。最小：1.超过则默认为8。
### Timespan.noConflict()
冲突处理方法。通过该方法返回Timespan类。解决全局命名空间冲突问题。

##对象方法

### Timespan(value, unit, config)
Timespan构造器。通过该构造器，构造Timespan对象实例。
######value
时间差值。
######unit
时间差值单位。可选，如果不传，默认是ms。
可选值：
+ 'y'或'years'。表示：年
+ 'M'或'months'。表示：月
+ 'w'或'weeks'。表示：周
+ 'd'或'days'。表示：日
+ 'h'或'hours'。表示：小时
+ 'm'或'minutes'。表示：分钟
+ 's'或'seconds'。表示：秒
+ 'ms'或'milliseconds'。表示：毫秒

######config
相关配置参数。主要有如下：
```js
CONFIG = {
            digits: 2,         //小数点位数,会影响到时间差的相关时间值的获取方法的返回精度（asxxxx方法），以及humanize方法的返回精度。
            baseUnit: "s",     //最小显示单位，在现有单位中配置，从 'y' 到 'ms'。
            length: 0          //友好字符串显示组数，如果为0，则显示全部（如果某个单位上为0，则不计入显示）。
        };
```
示例：
```js
var v = 85;
var ts = new Timespan(v, 'minutes');//'minutes'或'm'都是表示分钟。该ts对象实例表示85分钟。

```
###humanize(baseUnit, length)
人性化显示方法。该方法根据当前语言选择返回时间差的人性化显示字符串。
######baseUnit
最小显示单位，在现有单位中配置，从 'y' 到 'ms'。可选。
######length
友好字符串显示组数，如果为0，则显示全部（如果某个单位上为0，则不计入显示）。可选。
比如：
```js
var v = 85;
var ts = new Timespan(v, 'minutes');//'minutes'或'm'都是表示分钟。该ts对象实例表示85分钟。
var str=ts.humanize();//str='1小时25分钟'，假设当前是中文简体。
ts.config({'length':1});
str=ts.humanize();//str='25分钟'
```
###milliseconds()
返回时间差的毫秒位上的值。比如：
```js
var v = 1025;
var ts = new Timespan(v, 'ms');
var msv=ts.milliseconds();//msv=25。如果要返回1025，请使用asMilliseconds()。
```
###seconds()
返回时间差的秒位上的值。
###minutes()
返回时间差的分钟位上的值。
###hours()
返回时间差的小时位上的值。
###days()
返回时间差的天位上的值。
###weeks()
返回时间差的周位上的值。
###months()
返回时间差的月位上的值。
###years()
返回时间差的年位上的值。
###asMilliseconds()
返回时间差以毫秒为单位的值。该方法与milliseconds()有区别，具体区别见示例：
```js
var v = 1025;
var ts = new Timespan(v, 'ms');
var msv=ts.milliseconds();//msv=25。
var asmsv=ts.asMilliseconds();//asmsv=1025。
```

###asSeconds()
返回时间差以秒为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。
###asMinutes()
返回时间差以分钟为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。
###asHours()
返回时间差以小时为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。
###asDays()
返回时间差以天为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。
###asWeeks()
返回时间差以周为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。
###asMonths()
返回时间差以月为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。
###asYears()
返回时间差以年为单位的值。返回值可以是浮点数。小数位精度由digits参数决定。可通过config()设置。


###add(value, unit)
加时间差。比如：
```js
var v = 85;
var ts = new Timespan(v, 'minutes');//'minutes'或'm'都是表示分钟。该ts对象实例表示85分钟。
ts.add(5,'m');
var mv=ts.minutes();//mv=30。

```
######value
时间差值。可以是number类型、Timespan类型。
######unit
时间差值的单位，可选值见构造函数参数说明。

###subtract(value, unit)
减时间差值。value可以是number类型、Timespan类型。
###get()
获取timespan对象的毫秒数值。
###set(value, unit)
设置时间差值。该方法重新设置时间差对象的时间差值。value可以是number类型、Timespan类型。比如：
```js
var v = 85;
var ts = new Timespan(v, 'minutes');//'minutes'或'm'都是表示分钟。该ts对象实例表示85分钟。

var msv=ts.minutes();//msv=25。
var asmsv=ts.asMinutes();//asmsv=85。
ts.set(34,'m');
msv=ts.minutes();//msv=34。
asmsv=ts.asMinutes();//asmsv=34。
```
###config(config)
设置或获取时间差对象的配置参数。如果不传入config参数，则返回时间差的配置参数。
######config
配置参数对象。比如：
```js
var v = 85;
var ts = new Timespan(v, 'minutes');//'minutes'或'm'都是表示分钟。该ts对象实例表示85分钟。
var str=ts.humanize();//str='1小时25分钟'
ts.config({'baseUnit':'h'});
var str=ts.humanize();//str='1小时'
```
###lang(key)
设置当前Timespan对象的语言选项。该方法只设置当前实例的语言选项。如果不传key值，则表示获取当前实例的语言选项。
######key
语言选项参数，可选。
###toString()
转换成字符串。该方法会将当前时间差实例以毫秒数的字符串形式显示。
###valueOf()
转换成数字。返回当前实例的毫秒值。
