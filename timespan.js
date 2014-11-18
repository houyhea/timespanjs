/**
 * Created by houyhea on 14-8-20.
 * copyright © houyhea{at}126.com www.timespanjs.com
 *
 */
(function () {
    'use strict';
    var VERSION = "0.1.1",
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment,
        languages = {},
        MILLISECONDS_PER_SECOND = 1000,
        SECONDS_PER_MINUTE = 60,
        MINUTES_PER_HOUR = 60,
        HOURS_PER_DAY = 24,
        DAYS_PER_WEEK = 7,
        DAYS_PER_MONTH = 30,    //由于这里体现的是相对值（差值），所以这里统一规定：一个月就是30天
        MONTHS_PER_YEAR = 12,    //统一规定，一年360天。
        CONFIG = {
            digits: 2,         //小数点位数
            baseUnit: "s",     //最小显示单位，在现有单位中配置，从 y 到 ms
            length: 0          //友好字符串显示组数，如果为0，则显示全部（如果某个单位上为0，则不计入显示）
        };

    /*******************************************************
     private functions
     *******************************************************/
    function getMilliseconds(value, unit) {
        var ret = value;
        switch (unit) {
            case "milliseconds":
            case "ms":
                ret = value;
            default :
                break;
            case "seconds":
            case "s":
                ret = value * MILLISECONDS_PER_SECOND;
                break;
            case "minutes":
            case "m":
                ret = value * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE;
                break;
            case "hours":
            case "h":
                ret = value * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR;
                break;
            case "days":
            case "d":
                ret = value * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY;
                break;
            case "weeks":
            case "w":
                ret = value * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK;
                break;
            case "months":
            case "M":
                ret = value * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH;
                break;
            case "years":
            case "y":
                ret = value * MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH * MONTHS_PER_YEAR;
                break;
        }
        return ret;
    }

    function extend(a, b) {
        if (!b || !a)
            return a;

        for (var i in b) {
            if (b.hasOwnProperty(i)) {
                a[i] = b[i];
            }
        }

        if (b.hasOwnProperty("toString")) {
            a.toString = b.toString;
        }

        if (b.hasOwnProperty("valueOf")) {
            a.valueOf = b.valueOf;
        }

        return a;
    }

    function getLang(key) {
        return languages[key];
    }

    function loadLang(key, value) {
        value.abbr = key;
        languages[key] = value;
        return languages[key];
    }

    function _humanize(ts, baseUnit, length, delimiter) {
        var methods = "years_months_weeks_days_hours_minutes_seconds_milliseconds".split("_");
        var units = "y_M_w_d_h_m_s_ms".split("_");
        var i = units.indexOf(baseUnit);
        if (i < 0)i = units.length - 2;//默认：秒
        if (length > units.length)length = units.length;
        if (length <= 0)length = units.length;
        var texts = [];
        var len = 0;
        for (var j = i; j >= 0; j--) {
            if (len >= length)
                break;
            var v = ts[methods[j]]();
            if (v <= 0)
                continue;

            var t = (v > 1 ? this.PLURAL[units[j]] : this.SINGLUAR[units[j]]).replace(/%d/gi, v);
            texts.push(t);
            len++;
        }
        return texts.reverse().join(delimiter || "");
    }

    /******************************************************
     Timespan class
     *******************************************************/

    /**
     *构造函数
     * @param value 必须，number类型。时间差值
     * @param unit 可选，指定value的单位。默认：ms，可选值：y|years,M|months,d|days,h|hours,m|minutes,s|seconds,ms|milliseconds
     * @param config 可选，配置参数。
     * @constructor
     */
    var Timespan = function (value, unit, config) {
        var v=parseInt(value);
        if (isNaN(v)) {
            throw new Error("value must be a number");
        }
        unit = unit || "ms";
        this.msec = getMilliseconds(v, unit);
        this._config = extend(CONFIG, config);
    }

    /**
     * 通过javascript Date对象获取Timespan实例
     * @param startDate 起始日期，必须
     * @param endDate 结束日期，可选。默认:now
     * @returns {Timespan}
     */
    Timespan.fromDates = function (startDate, endDate) {
        endDate = endDate || Date.now();
        var msec = Math.abs(startDate.getTime() - endDate.getTime());
        return new Timespan(msec, 'ms');
    }

    Timespan.version = VERSION;
    /**
     * 设置当前语言（如果value为空），添加语言（如果value不为空）
     * @param key 语言键
     * @param value 语言对象
     * @returns {string|n.abbr|*|abbr}
     */
    Timespan.lang = function (key, value) {
        if (!key) {
            return Timespan.prototype._lang.abbr;
        }
        if (value) {
            var l = loadLang(key, value);
        } else {
            var r = Timespan.prototype._lang = getLang(key);
            return r.abbr;
        }

    };

    Timespan.prototype = {
        milliseconds: function () {
            return this.msec % MILLISECONDS_PER_SECOND;
        },
        seconds: function () {
            return Math.floor(this.msec / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE;
        },
        minutes: function () {
            return Math.floor(this.msec / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)) % MINUTES_PER_HOUR;
        },
        hours: function () {
            return Math.floor(this.msec / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)) % HOURS_PER_DAY;
        },
        days: function () {
            var days = Math.floor(this.msec / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)) % DAYS_PER_MONTH;
            if (days >= DAYS_PER_WEEK)
                return days % DAYS_PER_WEEK;
            else
                return days;
        },
        weeks: function () {
            var days = Math.floor(this.msec / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)) % DAYS_PER_MONTH;
            return Math.floor(days / DAYS_PER_WEEK);
        },
        months: function () {
            return Math.floor(this.msec / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH)) % MONTHS_PER_YEAR;
        },
        years: function () {
            return Math.floor(this.msec / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH * MONTHS_PER_YEAR));
        },
        asMilliseconds: function () {
            return +this;
        },
        asSeconds: function () {
            return (+this / MILLISECONDS_PER_SECOND).toFixed(this._config.digits);
        },
        asMinutes: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE)).toFixed(this._config.digits);
        },
        asHours: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR)).toFixed(this._config.digits);
        },
        asDays: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY)).toFixed(this._config.digits);
        },
        asWeeks: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_WEEK)).toFixed(this._config.digits);

        },
        asMonths: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH)).toFixed(this._config.digits);
        },
        asYears: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * HOURS_PER_DAY * DAYS_PER_MONTH * MONTHS_PER_YEAR)).toFixed(this._config.digits);
        },
        humanize: function (baseUnit, length) {
            return this.lang().humanize(this, baseUnit || this._config.baseUnit, length || this._config.length);
        },
        add: function (value, unit) {
            if (!value)
                return;
            if (value instanceof Timespan) {
                this.msec += value.asMilliseconds();
                return;
            }
            var ms = getMilliseconds(value, unit);
            this.msec += ms;
        },
        subtract: function (value, unit) {
            if (!value)
                return;
            if (value instanceof Timespan) {
                this.msec -= value.asMilliseconds();
                return;
            }
            var ms = getMilliseconds(value, unit);
            this.msec -= ms;
        },
        get: function () {
            return this.msec;
        },
        set: function (value, unit) {
            if (!value)
                return;
            if (value instanceof Timespan) {
                this.msec = value.asMilliseconds();
                return;
            }
            var ms = getMilliseconds(Math.abs(value), unit);
            this.msec = ms;
        },
        config: function (config) {
            if (config === undefined) {
                return this._config;
            }
            else {
                extend(this._config, config);
            }
        },
        lang: function (key) {
            if (key === undefined) {
                return this._lang;
            } else {
                this._lang = getLang(key);
                return this;
            }
        },
        toString: function () {
            return this.msec + '';
        },
        valueOf: function () {
            return this.msec;
        }

    };


    /******************************************************
     languages
     *******************************************************/

    /**
     * 中文-简体(zh-cn)
     */
    (function (factory) {
        factory(Timespan);
    }(function (Timespan) {
        return Timespan.lang('zh-cn', {
            humanize: function (ts, baseUnit, length) {
                return _humanize.call(this, ts, baseUnit, length, this.DELIMITER);

            },
            DELIMITER: "",
            SINGLUAR: {
                ms: "%d毫秒",
                s: "%d秒",
                m: "%d分钟",
                h: "%d小时",
                d: "%d天",
                w: "%d周",
                M: "%d个月",
                y: "%d年"
            },
            PLURAL: {
                ms: "%d毫秒",
                s: "%d秒",
                m: "%d分钟",
                h: "%d小时",
                d: "%d天",
                w: "%d周",
                M: "%d个月",
                y: "%d年"
            }
        });
    }));
    /**
     * 中文-繁体(zh-tw)
     */
    (function (factory) {
        factory(Timespan);
    }(function (Timespan) {
        return Timespan.lang('zh-tw', {
            humanize: function (ts, baseUnit, length) {
                return _humanize.call(this, ts, baseUnit, length, this.DELIMITER);
            },
            DELIMITER: "",
            SINGLUAR: {
                ms: "%d毫秒",
                s: "%d秒",
                m: "%d分鐘",
                h: "%d小時",
                d: "%d天",
                w: "%週",
                M: "%d個月",
                y: "%d年"
            },
            PLURAL: {
                ms: "%d毫秒",
                s: "%d秒",
                m: "%d分鐘",
                h: "%d小時",
                d: "%d天",
                w: "%d週",
                M: "%d個月",
                y: "%d年"
            }
        });
    }));
    /**
     * 英文(en)
     */
    (function (factory) {
        factory(Timespan);
    }(function (Timespan) {
        return Timespan.lang('en', {
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
        });
    }));
    Timespan.lang("zh-cn");//设置默认语言

    Timespan.noConflict = function () {
        globalScope.Timespan = oldGlobalMoment;
        return Timespan;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Timespan;

    } else if (typeof window.define === 'function' && window.define.amd) {
        window.define('timespanjs', [], function () {
            return Timespan;
        });
    }
    else {
        oldGlobalMoment = globalScope.Timespan;
        globalScope.Timespan = Timespan;
    }

    return Timespan;

}).call(this);