/**
 * Created by zhangyongn on 14-8-20.
 */
(function () {
    var languages = {};

    var Timespan = function (value, unit) {
//        this._lang = {};
        var getMilliseconds = function (value, unit) {
            var ret = value;
            switch (unit) {
                case "minutes":
                case "m":
                    ret = value * 1000 * 60;
                    break;
            }
            return ret;
        }
        this.msec = getMilliseconds(value, unit);


    }
    Timespan.version = '0.0.1';
    Timespan.fromDates = function (startDate, endDate) {

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

        },
        seconds: function () {

        },
        minutes: function () {
            return Math.floor(this.msec / (1000 * 60));
        },
        hours: function () {
        },
        days: function () {
        },
        weeks: function () {
        },
        months: function () {
        },
        years: function () {
        },
        humanize: function (baseUnit, length) {
            return this.lang().humanize(this);
        },
        add: function (value, unit) {

        },
        subtract: function (value, unit) {
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
     * 中文
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
                M: "%d month",
                y: "%d year"
            },
            PLURAL: {
                s: "%d seconds",
                m: "%d minutes",
                h: "%d hours",
                d: "%d days",
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

    return Timespan;

}).call(this);