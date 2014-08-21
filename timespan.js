/**
 * Created by houyhea on 14-8-20.
 */
(function () {
    var VERSION = "0.0.1",
        globalScope = typeof global !== 'undefined' ? global : this,
        oldGlobalMoment;

    var languages = {};
    var MILLISECONDS_PER_SECOND = 1000;
    var SECONDS_PER_MINUTE = 60;
    var MINUTES_PER_HOUR = 60;
    var HOURS_PER_DAY = 24;
    var DAYS_PER_WEEK = 7;
    var DAYS_PER_MONTH = 30;//由于这里体现的是相对值（差值），所以这里统一规定：一个月就是30天
    var MONTHS_PER_YEAR = 12;

    function getMilliseconds(value, unit) {
        var ret = value;
        switch (unit) {
            case "milliseconds":
            case "ms":
                ret = value;
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


    var config = {
        digits: 2       //小数点位数
    };
    var Timespan = function (value, unit) {

        this.msec = getMilliseconds(value, unit);
        this._config = config;
    }
    Timespan.version = VERSION;
    Timespan.fromDates = function (startDate, endDate) {
        var msec = Math.abs(startDate.getTime() - endDate.getTime());
        return new Timespan(msec, 'ms');
    }
    var getLang = function (key) {
        return languages[key];
    }
    var loadLang = function (key, value) {
        value.abbr = key;
        languages[key] = value;
        return languages[key];
    }
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
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * DAYS_PER_WEEK)).toFixed(this._config.digits);

        },
        asMonths: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * DAYS_PER_MONTH)).toFixed(this._config.digits);
        },
        asYears: function () {
            return (+this / (MILLISECONDS_PER_SECOND * SECONDS_PER_MINUTE * MINUTES_PER_HOUR * DAYS_PER_MONTH * MONTHS_PER_YEAR)).toFixed(this._config.digits);
        },
        humanize: function (baseUnit, length) {
            return this.lang().humanize(this);
        },
        add: function (value, unit) {
            var ms = getMilliseconds(value, unit);
            this.msec += ms;
        },
        subtract: function (value, unit) {
            var ms = getMilliseconds(value, unit);
            this.msec -= ms;
        },
        set: function (value, unit) {
            var ms = getMilliseconds(Math.abs(value), unit);
            this.msec = ms;
        },
        config: function (config) {
            extend(this._config, config);
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


    /**
     * 中文-简体
     */
    (function (factory) {
        factory(Timespan);
    }(function (Timespan) {
        return Timespan.lang('zh-cn', {
            humanize: function (ts, baseUnit, length) {
                return this.SINGLUAR["m"].replace(/%d/i, ts.minutes());
            },
            SINGLUAR: {
                s: "%d秒",
                m: "%d分钟",
                h: "%d小时",
                d: "%d天",
                w:"%d周",
                M: "%d个月",
                y: "%d年"
            },
            PLURAL: {
                s: "%d秒",
                m: "%d分钟",
                h: "%d小时",
                d: "%d天",
                M: "%d个月",
                y: "%d年"
            }
        });
    }));
    /**
     * 中文-繁体
     */
    (function (factory) {
        factory(Timespan);
    }(function (Timespan) {
        return Timespan.lang('zh-tw', {
            humanize: function (ts, baseUnit, length) {
                return this.SINGLUAR["m"].replace(/%d/i, ts.minutes());
            },
            SINGLUAR: {
                s: "%d秒",
                m: "%d分鐘",
                h: "%d小時",
                d: "%d天",
                w:"%週",
                M: "%d個月",
                y: "%d年"
            },
            PLURAL: {
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
     * 英文
     */
    (function (factory) {
        factory(Timespan);
    }(function (Timespan) {
        return Timespan.lang('en', {
            humanize: function (ts, baseUnit, length) {
                var min = ts.minutes();
                var text = min > 1 ? this.PLURAL['m'] : this.SINGLUAR['m'];
                return text.replace(/%d/i, min);
            },
            SINGLUAR: {
                s: "%d second",
                m: "%d minute",
                h: "%d hour",
                d: "%d day",
                w: "%d week",
                M: "%d month",
                y: "%d year"
            },
            PLURAL: {
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
    Timespan.lang("en");
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Timespan;

    } else if (typeof window.define === 'function' && window.define.amd) {
        window.define('timespanjs', [], function () {
            return Timespan;
        });
    }
    else {
        globalScope.Timespan = Timespan;
    }

    return Timespan;

}).call(this);