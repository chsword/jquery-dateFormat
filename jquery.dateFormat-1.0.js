//modifed by zoujian
//from http://plugins.jquery.com/project/jquery-dateFormat
//
(function ($) {
    var zeropad = function (val, len) {
        val = '' + val;
        len = len || 2;
        while (val.length < len) { val = "0" + val; }
        return val;
    };
    var monthDict = {
        "Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04", "May": "05", "Jun": "06",
        "Jul": "07", "Aug": "08", "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"
    };
    var parseTime = function (value) {
        var retValue = value;
        if (retValue.indexOf(".") !== -1) {
            retValue = retValue.substring(0, retValue.indexOf("."));
        }
        var values3 = retValue.split(":");
        if (values3.length === 3) {
            hour = values3[0];
            minute = values3[1];
            second = values3[2].split(' ')[0];
            return {
                time: retValue,
                hour: hour,
                minute: minute,
                second: second
            };
        } else {
            return {
                time: "",
                hour: "",
                minute: "",
                second: ""
            };
        }
    };


    if (!$.format)
        $.format = {
            date: function (value, format) {
                try {
                    if (value == 'Invalid Date' || value == ' ' || value == '0001-1-1 0:00:00') return '';

                    var year = null;
                    var month = null;
                    var dayOfMonth = null;
                    var ispm = false;
                    var time = null; //json, time, hour, minute, second
                    if (typeof value.getFullYear === "function") {
                        year = value.getFullYear();
                        month = value.getMonth() + 1;
                        dayOfMonth = value.getDate();
                        time = parseTime(value.toTimeString());
                    } else {
                        var values = value.split(" ");

                        switch (values.length) {
                            case 6: //Wed Jan 13 10:43:41 CET 2010
                                year = values[5];
                                month = monthDict[values[1]];
                                dayOfMonth = values[2];
                                time = parseTime(values[3]);
                                break;
                            case 2: //2009-12-18 10:54:50.546
                                var values2 = values[0].split("-");
                                year = values2[0];
                                month = values2[1];
                                dayOfMonth = values2[2];
                                time = parseTime(values[1]);
                                break;
                            case 3: //8/17/2010 12:00:00 AM add by zj
                                var values2 = values[0].split("/");
                                year = values2[2];
                                month = values2[0];
                                dayOfMonth = values2[1];
                                time = parseTime(values[1]);
                                if (values[2] == 'PM')  //    time += 12;
                                    ispm = true;
                                break;
                            default:
                                return value;
                        }
                    }
                    //modifed by zoujian
                    var replaceDict = {
                        'yyyy': function () { return year; },
                        'yy': function () { return year.substr(2); },
                        'MM': function () { return zeropad(month, 2); },
                        'M': function () { return zeropad(month, 1); },
                        'dd': function () { return zeropad(dayOfMonth, 2); },
                        'd': function () { return zeropad(dayOfMonth, 1); },
                        'HH': function () {
                            if (ispm) { time.hour = parseInt(time.hour) + 12; }
                            return zeropad(time.hour, 2);
                        },
                        'H': function () {
                            if (ispm) { time.hour = parseInt(time.hour) + 12; }
                            return time.hour;
                        },
                        'hh': function () { return zeropad(parseInt(time.hour) % 12, 2); },
                        'h': function () { return parseInt(time.hour) % 12; },
                        'mm': function () { return zeropad(time.minute, 2); },
                        'm': function () { return time.minute; },
                        "ss": function () { return zeropad(time.second, 2); },
                        's': function () { return time.second; },
                        'a': function () { return time.hour > 12 ? "PM" : "AM"; }
                    };
                    var retValue = format;
                    for (var t in replaceDict) {
                        if (retValue.indexOf(t) >= 0)
                            retValue = retValue.replace(t, replaceDict[t]());
                    }

                    return retValue;
                } catch (e) {
                    return value;
                }
            }
        };
} (jQuery));