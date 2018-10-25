var awa = awa || {};
awa.isInitialized = false;
awa.verbosityLevels = {
    NONE: 0, ERROR: 1, WARNING: 2, INFORMATION: 3
};
awa.behavior = {
    UNDEFINED: 0, NAVIGATIONBACK: 1, NAVIGATION: 2, NAVIGATIONFORWARD: 3, APPLY: 4, REMOVE: 5, SORT: 6, EXPAND: 7, REDUCE: 8, CONTEXTMENU: 9, TAB: 10, COPY: 11, EXPERIMENTATION: 12, PRINT: 13, STARTPROCESS: 20, PROCESSCHECKPOINT: 21, COMPLETEPROCESS: 22, SCENARIOCANCEL: 23, DOWNLOADCOMMIT: 40, DOWNLOAD: 41, SEARCHAUTOCOMPLETE: 60, SEARCH: 61, SEARCHINITIATE: 62, PURCHASE: 80, ADDTOCART: 81, VIEWCART: 82, ADDWISHLIST: 83, FINDSTORE: 84, CHECKOUT: 85, REMOVEFROMCART: 86, PURCHASECOMPLETE: 87, VIEWCHECKOUTPAGE: 88, VIEWCARTPAGE: 89, VIEWPDP: 90, UPDATEITEMQUANTITY: 91, INTENTTOBUY: 92, PUSHTOINSTALL: 93, SIGNIN: 100, SIGNOUT: 101, SOCIALSHARE: 120, SOCIALLIKE: 121, SOCIALREPLY: 122, CALL: 123, EMAIL: 124, COMMUNITY: 125, VOTE: 140, SURVEYINITIATE: 141, SURVEYCOMPLETE: 142, REPORTAPPLICATION: 143, REPORTREVIEW: 144, SURVEYCHECKPOINT: 145, CONTACT: 160, REGISTRATIONINITIATE: 161, REGISTRATIONCOMPLETE: 162, CANCELSUBSCRIPTION: 163, RENEWSUBSCRIPTION: 164, CHANGESUBSCRIPTION: 165, REGISTRATIONCHECKPOINT: 166, CHATINITIATE: 180, CHATEND: 181, TRIALSIGNUP: 200, TRIALINITIATE: 201, PARTNERREFERRAL: 220, VIDEOSTART: 240, VIDEOPAUSE: 241, VIDEOCONTINUE: 242, VIDEOCHECKPOINT: 243, VIDEOJUMP: 244, VIDEOCOMPLETE: 245, VIDEOBUFFERING: 246, VIDEOERROR: 247, VIDEOMUTE: 248, VIDEOUNMUTE: 249, VIDEOFULLSCREEN: 250, VIDEOUNFULLSCREEN: 251, VIDEOREPLAY: 252, VIDEOPLAYERLOAD: 253, VIRTUALEVENTJOIN: 260, VIRTUALEVENTEND: 261, IMPRESSION: 280, CLICK: 281, RICHMEDIACOMPLETE: 282, ADBUFFERING: 283, ADERROR: 284, ADSTART: 285, ADCOMPLETE: 286, ADSKIP: 287, ADTIMEOUT: 288, OTHER: 300
};
awa.behaviorKeys = [];
for (var behaviorKey in awa.behavior)
{
    awa.behaviorKeys.push(behaviorKey)
}
awa.actionType = {
    CLICKLEFT: "CL", CLICKRIGHT: "CR", SCROLL: "S", ZOOM: "Z", RESIZE: "R", KEYBOARDENTER: "KE", KEYBOARDSPACE: "KS", OTHER: "O"
};
awa.cookie = (function()
{
    function getCookieKeyValue(cookieName, keyName)
    {
        var cookie = getCookie(cookieName);
        if (cookie && keyName)
        {
            for (var u = cookie.split("&"), r = 0; r < u.length; r++)
            {
                var keyvalue = u[r].split("=");
                if (keyvalue[0] && keyName.toLowerCase() === keyvalue[0].toLowerCase())
                {
                    return keyvalue[1]
                }
            }
        }
        return undefined
    }
    function getCookie(name, valuePrefix)
    {
        var allcookies = document.cookie.split(";");
        for (var i = 0; i < allcookies.length; i++)
        {
            var cookie = allcookies[i];
            while (cookie.charAt(0) === " ")
            {
                cookie = cookie.substring(1)
            }
            var parts = cookie.split("=");
            var cookieName = decode(parts.shift());
            if (cookieName === name && parts[0].indexOf(valuePrefix) == (awa.utils.isValueAssigned(valuePrefix) ? 0 : -1))
            {
                return decode(parts.join("="))
            }
        }
        return undefined
    }
    function decode(inputString)
    {
        var value = decodeURIComponent(inputString.replace("/\+/g", " "));
        if (value.indexOf("\"") === 0)
        {
            value = value.slice(1, -1).replace(/\\"/g, "\"").replace(/\\\\/g, "\\")
        }
        return value
    }
    function setCookie(name, value, days)
    {
        var expires;
        if (days)
        {
            var date = new Date;
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString()
        }
        else
        {
            expires = ""
        }
        window.document.cookie = name + "=" + value + expires + "; path=/;"
    }
    function deleteCookie(name)
    {
        setCookie(name, "", -1)
    }
    return {
            getCookie: getCookie, getCookieKeyValue: getCookieKeyValue, setCookie: setCookie, deleteCookie: deleteCookie
        }
})();
awa.cv = (function()
{
    var UNINITIALIZED_CV = "";
    var base = UNINITIALIZED_CV;
    var currentElement = 1;
    var eventTag = "cV";
    var header = "MS-CV";
    var base64CharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var cv1Constants = {};
    var related="";
    cv1Constants.maxCorrelationVectorLength = 63;
    cv1Constants.baseLength = 16;
    cv1Constants.validationPattern = new RegExp("^[" + base64CharSet + "]{" + cv1Constants.baseLength.toString() + "}(.[0-9]+)+$");
    var cv2Constants = {};
    cv2Constants.maxCorrelationVectorLength = 127;
    cv2Constants.baseLength = 22;
    cv2Constants.validationPattern = new RegExp("^[" + base64CharSet + "]{" + cv2Constants.baseLength.toString() + "}(.[0-9]+)+$");
    var currentCvConstants = cv2Constants;
    var cvVersionAtLatestValidityCheck = 2;
    function isInit()
    {
        return isValid(storedCv())
    }
    function storedCv()
    {
        return base.concat(".", currentElement.toString())
    }
    function getValue()
    {
        var value = storedCv();
        if (isValid(value))
        {
            return value
        }
    }
    
    function getRelatedCV()
    {
        return this.related;
    }

    function setRelatedCV(cv)
    {
        this.related = cv;
    }
    function baseIncrement()
    {
        var cvTemp = storedCv().split(".");
        var size = cvTemp.length;
        if (size > 2)
        {
            // reset base since we will rebuiding it.
            base = "";
            var cv_IgIndex = size - 2;
            var cv_ig = parseInt(cvTemp[cv_IgIndex]) +1;
            for(var i =0; i < cv_IgIndex; i++)
                {
                    base = base.concat(cvTemp[i], ".");
                }

            base = base.concat(cv_ig);
            currentElement = 0;
        }
        else
        {
            // the current cv is a custom set cv, and therefore should follow normal increment method;
            increment();
        }
        return storedCv();
    }

    function incrementExternal(externalCv)
    {
        if (isValid(externalCv))
        {
            var externalCvParts = externalCv.split(".");
            var numberOfCvParts = externalCvParts.length;
            externalCvParts[numberOfCvParts - 1] = (parseInt(externalCvParts[numberOfCvParts - 1], 10) + 1).toString();
            var incrementedCv = "";
            for (var i = 0; i < numberOfCvParts; i++)
            {
                incrementedCv += (externalCvParts[i]);
                if (i < (numberOfCvParts - 1))
                {
                    incrementedCv += "."
                }
            }
            var maxLength = (externalCvParts[0].length === cv2Constants.baseLength) ? cv2Constants.maxCorrelationVectorLength : cv1Constants.maxCorrelationVectorLength;
            if (incrementedCv.length <= maxLength)
            {
                return incrementedCv
            }
        }
    }
    function canExtend()
    {
        var currentCv = storedCv();
        if (isValid(currentCv))
        {
            return isLeqThanMaxCorrelationVectorLength(currentCv.length + 2)
        }
        return false
    }
    function canIncrement()
    {
        if (isValid(storedCv()))
        {
            return isLeqThanMaxCorrelationVectorLength(base.length + 1 + ((currentElement + 1) + "").length)
        }
        return false
    }
    function setValue(cv)
    {
        if (isValid(cv))
        {
            var lastIndex = cv.lastIndexOf(".");
            base = cv.substr(0, lastIndex);
            currentElement = parseInt(cv.substr(lastIndex + 1), 10)
        }
        else
        {
            awa.logger.logWarning("Cannot set invalid correlation vector value");
            return null
        }
        return storedCv()
    }
    function init(cvInitValue)
    {
        var oldValue = cvInitValue;
        if (cvInitValue)
        {
            setValue(cvInitValue);
            extend();
            extend();
        }
        else
        {
            base = seedCorrelationVector();
            currentElement = 1;
            extend();    
        }
        
        return  storedCv();
    }
    function seedCorrelationVector()
    {
        var result = "";
        for (var i = 0; i < currentCvConstants.baseLength; i++)
        {
            result += base64CharSet.charAt(Math.floor(Math.random() * base64CharSet.length))
        }
        return result
    }
    function extend()
    {
        if (canExtend())
        {
            base = base.concat(".", currentElement.toString());
            currentElement = 1;
            return storedCv()
        }
    }
    function increment()
    {
        if (canIncrement())
        {
            currentElement = currentElement + 1;
            return storedCv()
        }
    }
    function isValid(cvValue)
    {
        if (cvValue)
        {
            var baseValue = cvValue.split(".")[0];
            if (baseValue)
            {
                if (baseValue.length === 16)
                {
                    cvVersionAtLatestValidityCheck = 1;
                    return validateWithCv1(cvValue)
                }
                else if (baseValue.length === 22)
                {
                    cvVersionAtLatestValidityCheck = 2;
                    return validateWithCv2(cvValue)
                }
            }
        }
    }
    function validateWithCv1(cv)
    {
        if (cv1Constants.validationPattern.test(cv) && cv.length <= cv1Constants.maxCorrelationVectorLength)
        {
            return true
        }
    }
    function validateWithCv2(cv)
    {
        if (cv2Constants.validationPattern.test(cv) && cv.length <= cv2Constants.maxCorrelationVectorLength)
        {
            return true
        }
    }
    function isLeqThanMaxCorrelationVectorLength(length)
    {
        if (cvVersionAtLatestValidityCheck === 1)
        {
            return length <= cv1Constants.maxCorrelationVectorLength
        }
        else
        {
            return length <= cv2Constants.maxCorrelationVectorLength
        }
    }
    function useCv1()
    {
        currentCvConstants = cv1Constants
    }
    function useCv2()
    {
        currentCvConstants = cv2Constants
    }
    return {
            header: header, tag: eventTag, isInit: isInit, canExtend: canExtend, canIncrement: canIncrement, getValue: getValue, setValue: setValue, init: init, extend: extend, increment: increment, incrementExternal: incrementExternal, isValid: isValid, useCv1: useCv1, useCv2: useCv2, baseIncrement: baseIncrement, setRelatedCV: setRelatedCV, getRelatedCV: getRelatedCV
        }
})();
awa.logger = (function()
{
    function logError(message)
    {
        if (awa.consoleVerbosity >= awa.verbosityLevels.ERROR && console && console.error)
        {
            console.error("JSLL: " + message)
        }
    }
    function logWarning(message)
    {
        if (awa.consoleVerbosity >= awa.verbosityLevels.WARNING && console && console.warn)
        {
            console.warn("JSLL: " + message)
        }
    }
    function logInformation(message)
    {
        if (awa.consoleVerbosity >= awa.verbosityLevels.INFORMATION && console && console.log)
        {
            console.log("JSLL: " + message)
        }
    }
    return {
            logError: logError, logWarning: logWarning, logInformation: logInformation
        }
})();
awa.capabilitiesCheck = (function()
{
    return function()
        {
            if (!JSON || !JSON.stringify)
            {
                awa.logger.logError("Unable to write event: the global JSON.stringify method does not exist");
                awa.isAvailable = false;
                return false
            }
        }
})();
awa.utils = (function()
{
    var os = "";
    var userAgent = "";
    var windowPerformanceTiming = window.performance ? window.performance.timing : undefined;
    var APPIDPREFIX = "JS:";
    var attributeToLookFor = "";
    function stringifyField(fieldName, value)
    {
        if (value)
        {
            try
            {
                var stringified = JSON.stringify(value);
                if (stringified === "{}")
                {
                    if (fieldName === "timing")
                    {
                        return stringifyWindowPerformanceTiming()
                    }
                }
                return stringified
            }
            catch(e)
            {
                var message = "{\"error\": \"ERROR: could not stringify {0} {1}\"}";
                var token = (typeof value === "string") ? value : "";
                return message.replace("{0}", fieldName).replace("{1}", token)
            }
        }
    }
    function stringifyWindowPerformanceTiming()
    {
        var WPTfields = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
        var performanceString = "{";
        for (var i = 0; i < WPTfields.length; i++)
        {
            var WindowPerformanceTimingTempValue = windowPerformanceTiming[WPTfields[i]];
            if (isValueAssigned(WindowPerformanceTimingTempValue))
            {
                performanceString += "\"" + WPTfields[i] + "\":" + WindowPerformanceTimingTempValue;
                if (i < WPTfields.length - 1)
                {
                    performanceString += ","
                }
            }
        }
        performanceString += "}";
        return performanceString
    }
    function getMuidHost(rootDomain)
    {
        var supportedMuidHosts = {
                "microsoft.com": "c1.microsoft.com", "xbox.com": "c.xbox.com", "live.com": "c.live.com", "microsoftstore.com": "c.microsoftstore.com", "msn.com": "c.msn.com", "windows.com": "c.windows.com"
            };
        return supportedMuidHosts[rootDomain]
    }
    function isOfCorrectType(type, value)
    {
        if (type === "string")
        {
            return (typeof value === "string") || (value instanceof String) || (value instanceof Date)
        }
        else if (type === "bool")
        {
            return (typeof value === "boolean") || (value instanceof Boolean)
        }
        else
        {
            if (!((typeof value === "number") || (value instanceof Number)))
            {
                return false
            }
            if (type === "uint8")
            {
                if (value < 0 || value > 255 || (value % 1 !== 0))
                {
                    return false
                }
            }
            else if (type === "uint16")
            {
                if (value < 0 || value > 65535 || (value % 1 !== 0))
                {
                    return false
                }
            }
            else if (type === "uint32")
            {
                if (value < 0 || value > 4294967295 || (value % 1 !== 0))
                {
                    return false
                }
            }
            else if (type === "uint64")
            {
                if (value < 0 || value > 18446744073709551615 || value % 1 !== 0)
                {
                    return false
                }
            }
            else if (type === "int8")
            {
                if (value < -128 || value > 127 || value % 1 !== 0)
                {
                    return false
                }
            }
            else if (type === "int16")
            {
                if (value < -32768 || value > 32767 || value % 1 !== 0)
                {
                    return false
                }
            }
            else if (type === "int32")
            {
                if (value < -2147483648 || value > 2147483647 || value % 1 !== 0)
                {
                    return false
                }
            }
            else if (type === "int64")
            {
                if (value < -9223372036854775808 || value > 9223372036854775807 || value % 1 !== 0)
                {
                    return false
                }
            }
            else if (type === "float")
            {
                if (value < -3.402823e38 || value > 3.402823e38)
                {
                    return false
                }
            }
            else if (type === "double")
            {
                if (value < -Number.MAX_VALUE || value > Number.MAX_VALUE)
                {
                    return false
                }
            }
            return true
        }
    }
    function getOs()
    {
        if (os === "")
        {
            var lowercaseUserAgent = getUserAgent().toLowerCase();
            if (lowercaseUserAgent.indexOf("windows phone") !== -1)
            {
                os = "WindowsPhone"
            }
            else if (lowercaseUserAgent.indexOf("win") !== -1)
            {
                os = "Windows"
            }
            else if (lowercaseUserAgent.indexOf("mac") !== -1)
            {
                os = "MacOS"
            }
            else if (lowercaseUserAgent.indexOf("x11") !== -1)
            {
                os = "Unix"
            }
            else if (lowercaseUserAgent.indexOf("android") !== -1)
            {
                os = "Android"
            }
            else if (lowercaseUserAgent.indexOf("linux") !== -1)
            {
                os = "Linux"
            }
            else if (lowercaseUserAgent.indexOf("webos") !== -1)
            {
                os = "webOS"
            }
            else if (lowercaseUserAgent.indexOf("blackberry") !== -1)
            {
                os = "BlackBerry"
            }
            else if ((lowercaseUserAgent.indexOf("ipod") !== -1) || (lowercaseUserAgent.indexOf("ipad") !== -1) || (lowercaseUserAgent.indexOf("iphone") !== -1))
            {
                os = "iOS"
            }
            else if (lowercaseUserAgent.indexOf("symbian") !== -1)
            {
                os = "Symbian"
            }
            else if (lowercaseUserAgent.indexOf("nokia") !== -1)
            {
                os = "Nokia"
            }
            else
            {
                os = "Unknown"
            }
        }
        return os
    }
    function readAndAssignUserAgent()
    {
        userAgent = (window.navigator && window.navigator.userAgent) ? window.navigator.userAgent : ""
    }
    function getUserAgent()
    {
        if (userAgent === "")
        {
            readAndAssignUserAgent()
        }
        return userAgent
    }
    function extractFieldFromObject(obj, fieldName)
    {
        var fieldValue;
        if (obj && obj[fieldName])
        {
            fieldValue = obj[fieldName];
            delete obj[fieldName]
        }
        return fieldValue
    }
    function isElementTrulyVisible(element, viewportBoundingRect)
    {
        element = returnDomObjectIfjQuery(element);
        var rect = element.getBoundingClientRect();
        var intersectionArea = getIntersectionArea(rect, viewportBoundingRect);
        if (intersectionArea > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }
    function getIntersectionArea(rect1, rect2)
    {
        var x11 = rect1.left,
            y11 = rect1.top,
            x12 = rect1.right,
            y12 = rect1.bottom,
            x21 = rect2.left,
            y21 = rect2.top,
            x22 = rect2.right,
            y22 = rect2.bottom;
        var x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
        var y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
        return x_overlap * y_overlap
    }
    function returnDomObjectIfjQuery(element)
    {
        if (typeof jQuery === "function" && element instanceof jQuery)
        {
            return element[0]
        }
        return element
    }
    function pad(number)
    {
        var r = String(number);
        if (r.length === 1)
        {
            r = "0" + r
        }
        return r
    }
    function dateToISOString(date)
    {
        return date.getUTCFullYear() + "-" + pad(date.getUTCMonth() + 1) + "-" + pad(date.getUTCDate()) + "T" + pad(date.getUTCHours()) + ":" + pad(date.getUTCMinutes()) + ":" + pad(date.getUTCSeconds()) + "." + String((date.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + "Z"
    }
    var extend = function()
        {
            var extended = {};
            var deep = false;
            var i = 0;
            var length = arguments.length;
            if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]")
            {
                deep = arguments[0];
                i++
            }
            var merge = function(obj)
                {
                    for (var prop in obj)
                    {
                        if (Object.prototype.hasOwnProperty.call(obj, prop))
                        {
                            if (deep && Object.prototype.toString.call(obj[prop]) === "[object Object]")
                            {
                                extended[prop] = extend(true, extended[prop], obj[prop])
                            }
                            else
                            {
                                extended[prop] = obj[prop]
                            }
                        }
                    }
                };
            for (; i < length; i++)
            {
                var obj = arguments[i];
                merge(obj)
            }
            return extended
        };
    function getPerformanceData()
    {
        var performanceData;
        try
        {
            performanceData = window.performance.getEntries().filter(function(item)
            {
                return item.initiatorType === "script" || item.initiatorType === "link"
            })
        }
        catch(ex) {}
        return performanceData
    }
    function getPageLoadTime()
    {
        var pageLoadTime = undefined;
        if (windowPerformanceTiming.loadEventStart && windowPerformanceTiming.navigationStart)
        {
            if (windowPerformanceTiming.loadEventStart > 0)
            {
                pageLoadTime = windowPerformanceTiming.loadEventStart - windowPerformanceTiming.navigationStart
            }
        }
        return pageLoadTime
    }
    function getTitle()
    {
        return document.title.substring(0, 150)
    }
    function bracketIt(str)
    {
        return "[" + str + "]"
    }
    function findClosestByAttribute(el, attribute)
    {
        attributeToLookFor = attribute;
        return walkUpDomChainWithElementValidation(el, isAttributeInElement)
    }
    function findClosestAnchor(el)
    {
        return walkUpDomChainWithElementValidation(el, isElementAnAnchor)
    }
    function walkUpDomChainWithElementValidation(el, validationMethod)
    {
        var element = el;
        if (element)
        {
            element = returnDomObjectIfjQuery(element);
            while (!validationMethod(element))
            {
                element = element.parentNode;
                element = returnDomObjectIfjQuery(element);
                if (!element || !(element.getAttribute))
                {
                    return null
                }
            }
            return element
        }
    }
    function isAttributeInElement(element)
    {
        var value = element.getAttribute(attributeToLookFor);
        return isValueAssigned(value) || value === ""
    }
    function isElementAnAnchor(element)
    {
        return element.nodeName === "A"
    }
    function getAppIdWithPrefix(appId)
    {
        var result;
        if (appId)
        {
            var appIdArray = appId.split(":");
            result = appIdArray.length > 1 && appIdArray[0].toLowerCase() === "js" ? appId : APPIDPREFIX + appId
        }
        return result
    }
    function removeInvalidElements(object)
    {
        for (var property in object)
        {
            if (!isValueAssigned(object[property]) || (JSON.stringify(object[property]) === "{}" && (property !== "callback")))
            {
                delete object[property]
            }
        }
    }
    function isValueAssigned(value)
    {
        return !(value === undefined || value === null || value === "")
    }
    function removeNonObjectsAndInvalidElements(overrideConfig, attributeNamesExpectedObjects)
    {
        removeInvalidElements(overrideConfig);
        for (var i in attributeNamesExpectedObjects)
        {
            var objectName = attributeNamesExpectedObjects[i];
            if (typeof overrideConfig[objectName] === "object")
            {
                removeInvalidElements(overrideConfig[objectName])
            }
            else
            {
                delete overrideConfig[objectName]
            }
        }
    }
    return {
            stringifyField: stringifyField, getMuidHost: getMuidHost, isOfCorrectType: isOfCorrectType, getOs: getOs, getUserAgent: getUserAgent, extractFieldFromObject: extractFieldFromObject, isElementTrulyVisible: isElementTrulyVisible, dateToISOString: dateToISOString, extend: extend, returnDomObjectIfjQuery: returnDomObjectIfjQuery, findClosestByAttribute: findClosestByAttribute, findClosestAnchor: findClosestAnchor, getPerformanceData: getPerformanceData, getPageLoadTime: getPageLoadTime, getTitle: getTitle, removeInvalidElements: removeInvalidElements, removeNonObjectsAndInvalidElements: removeNonObjectsAndInvalidElements, bracketIt: bracketIt, getAppIdWithPrefix: getAppIdWithPrefix, isValueAssigned: isValueAssigned, testHook: {getIntersectionArea: getIntersectionArea}
        }
})();
awa.ids = (function()
{
    var impressionGuid = createImpressionGuid(),
        cookie = awa.cookie,
        appUserId = null,
        appExpId = null,
        firstImpressionGuidSent = false,
        expIdCookieName = "Treatments",
        deviceClass,
        userIdPrefixes = ["c:", "i:", "w:"],
        flightIdNameSpaces = ["AX", "EX", "SF", "CS", "CF", "CT", "CU", "DC", "DF", "H5", "HL", "WS", "WP"];
    function createGuid()
    {
        var guidPattern = "xxxxxxxx-xxxx-4xxx-Rxxx-xxxxxxxxxxxx";
        function randomHexDigit()
        {
            return Math.floor(Math.random() * 16).toString(16)
        }
        var result = guidPattern.replace(/x/g, randomHexDigit);
        return result.replace("R", (8 | Math.floor(Math.random() * 3)).toString(16))
    }
    function sessionId()
    {
        return cookie.getCookie("MS0")
    }
    function visitorId()
    {
        var userId = cookie.getCookie("MUID");
        return userId
    }
    function createImpressionGuid()
    {
        if (awa.cv.isInit()){
        awa.cv.baseIncrement();
        }
        return createGuid();
    }
    function getImpressionGuid()
    {
        return impressionGuid
    }
    function getPageViewImpressionGuid()
    {
        if (firstImpressionGuidSent)
        {
            impressionGuid = createImpressionGuid()
        }
        else
        {
            firstImpressionGuidSent = true
        }
        return impressionGuid
    }
    function groups()
    {
        return cookie.getCookie(expIdCookieName)
    }
    function muidUserId()
    {
        var muidValue = cookie.getCookie("MUID");
        return muidValue && muidValue.length ? "t:" + muidValue : muidValue
    }
    function setAppUserId(uid)
    {
        appUserId = null;
        if (!uid)
        {
            return
        }
        for (var i = 0; i < userIdPrefixes.length; i++)
        {
            if (userIdPrefixes[i] === uid.substring(0, 2))
            {
                appUserId = uid;
                break
            }
        }
        if (!appUserId)
        {
            awa.logger.logWarning("Unsupported app user id: " + uid + ". Supported app user ids are: c:, i:, and w:")
        }
    }
    function isValidAppFlightId(appFlightId)
    {
        if (!appFlightId || appFlightId.length < 4)
        {
            return false
        }
        var isValid = false,
            MAXFLIGHTIDLENGTH = 256,
            curNameSpace = (appFlightId.substring(0, 3)).toString().toUpperCase();
        for (var i = 0; i < flightIdNameSpaces.length; i++)
        {
            if (flightIdNameSpaces[i] + ":" === curNameSpace && appFlightId.length <= MAXFLIGHTIDLENGTH)
            {
                isValid = true;
                break
            }
        }
        return isValid
    }
    function setAppExpId(appExpIdNew)
    {
        if (!appExpIdNew)
        {
            appExpId = null;
            return
        }
        else if (appExpIdNew === appExpId)
        {
            return
        }
        else
        {
            appExpId = null;
            var expIdArray = appExpIdNew.split(",");
            for (var i = 0; i < expIdArray.length; i++)
            {
                if (isValidAppFlightId(expIdArray[i]))
                {
                    if (!appExpId)
                    {
                        appExpId = expIdArray[i]
                    }
                    else
                    {
                        appExpId += "," + expIdArray[i]
                    }
                }
                else
                {
                    awa.logger.logWarning("Unsupported flight id format for this app expId: " + expIdArray[i])
                }
            }
        }
    }
    function getAppExpId()
    {
        return appExpId
    }
    function setDeviceClass(newDeviceClass)
    {
        if (newDeviceClass)
        {
            deviceClass = newDeviceClass
        }
    }
    function getDeviceClass()
    {
        return deviceClass
    }
    return {
            getSessionId: sessionId, getVisitorId: visitorId, getMuidUserId: muidUserId, setAppUserId: setAppUserId, getAppUserId: function()
                {
                    return appUserId
                }, readExpIdFromCookie: function()
                {
                    setAppExpId(groups());
                    return getAppExpId()
                }, readExpIdFromCoreData: function(expId)
                {
                    setAppExpId(expId);
                    return getAppExpId()
                }, getImpressionGuid: getImpressionGuid, getPageViewImpressionGuid: getPageViewImpressionGuid, getGroups: groups, setDeviceClass: setDeviceClass, getDeviceClass: getDeviceClass, setExpIdCookieName: function(name)
                {
                    expIdCookieName = name
                }, getExpIdCookieName: function()
                {
                    return expIdCookieName
                }
        }
})();
awa.vortexEvents = (function()
{
    var ids = awa.ids;
    var nonCriticalEventsQueue = [];
    var overrideReadyState = "notInit";
    var numberOfEventsToBatch = 0;
    function batchQueuedEvents()
    {
        if (nonCriticalEventsQueue.length > 0)
        {
            awa.writeEvent(nonCriticalEventsQueue);
            nonCriticalEventsQueue = []
        }
    }
    function drainQueuedEvents()
    {
        if (document.readyState === "complete")
        {
            while (nonCriticalEventsQueue.length > 0)
            {
                awa.writeEvent(nonCriticalEventsQueue.pop())
            }
        }
        else
        {
            awa.ct.onDomReadyDo(awa.firstEventDoneTasks)
        }
    }
    function sendOrScheduleEvent(event, isCriticalEvent)
    {
        if (isCriticalEvent === true)
        {
            awa.writeEvent(event);
            return
        }
        else
        {
            if (overrideReadyState === "complete")
            {
                awa.writeEvent(event);
                return
            }
            nonCriticalEventsQueue.push(event);
            if (numberOfEventsToBatch > 1 && nonCriticalEventsQueue.length >= numberOfEventsToBatch)
            {
                batchQueuedEvents()
            }
        }
    }
    function jsllEvent(eventData)
    {
        var event = {};
        if (eventData.type === "CorsDisallowed")
        {
            awa.ct.captureCorsDisallowed(eventData)
        }
        else if (eventData.type === "EventTooLong")
        {
            awa.ct.captureEventTooLong(eventData)
        }
        ;
    }
    function error(errorInfo, displayedToUser)
    {
        awa.ct.captureClientError({
            errorInfo: errorInfo, displayedToUser: displayedToUser
        })
    }
    function outgoingRequest(eventData)
    {
        var event = {
                name: "Ms.Webi.OutgoingRequest", cV: eventData.cV, data: {
                        baseData: {
                            operationName: eventData.currentOperationName, targetUri: eventData.requestUri, latencyMs: eventData.latencyMs, serviceErrorCode: eventData.serviceErrorCode || -1, succeeded: eventData.isSuccess, requestMethod: eventData.httpMethod, responseContentType: eventData.contentType, protocolStatusCode: eventData.httpStatusCode, dependencyOperationName: eventData.operationName, dependencyOperationVersion: eventData.operationVersion, dependencyName: eventData.serviceName, dependencyType: eventData.serviceType || "WebService", responseSizeBytes: eventData.responseSize
                        }, baseType: "Ms.Qos.OutgoingServiceRequest", customSessionGuid: ids.getSessionId(), impressionGuid: ids.getImpressionGuid(), message: eventData.errorMessage, retryCount: eventData.retryCount, customData: eventData.customData
                    }
            };
        awa.ct.captureQos(event)
    }
    return {
            sendError: error, sendApiComplete: outgoingRequest, sendJsllEvent: jsllEvent, SendOrScheduleEvent: sendOrScheduleEvent, batchQueuedEvents: batchQueuedEvents, drainQueuedEvents: drainQueuedEvents, batchEventsByNumber: function(number)
                {
                    numberOfEventsToBatch = number
                }, addEventToQueue: function(obj)
                {
                    nonCriticalEventsQueue.push(obj)
                }, overrideQueueBehavior: function(options)
                {
                    if (options)
                    {
                        if (options.domReadyState)
                        {
                            overrideReadyState = options.domReadyState
                        }
                    }
                }
        }
})();
awa.errorHandler = (function()
{
    var vortexEvents = awa.vortexEvents;
    function windowErrorHandler(nextHandler)
    {
        var prevError = window.onerror;
        window.onerror = function()
        {
            if (prevError)
            {
                prevError.apply(this, arguments)
            }
            nextHandler.apply(this, arguments)
        }
    }
    function extractStackTrace(errorObject)
    {
        return errorObject.stack ? errorObject.stack.substring(0, 1000) : ""
    }
    function defaultHandler()
    {
        if (arguments)
        {
            var errorDetails = {
                    Page: window.location.href, Script: arguments[1] || "", Message: arguments[0] || "", LineNumber: arguments[2] || 0, StackTrace: arguments[4] ? extractStackTrace(arguments[4]) : "", UserAgent: awa.utils.getUserAgent() || "", Platform: window.navigator.platform || ""
                };
            vortexEvents.sendError(errorDetails, false)
        }
    }
    function init()
    {
        windowErrorHandler(defaultHandler)
    }
    return {init: init}
})();
awa.timespanHandler = (function()
{
    var timers = {};
    function recordTimeSpan(counterName, isComplete)
    {
        var timestamp = (new Date).getTime();
        if (!isComplete)
        {
            timers[counterName] = timestamp
        }
        else
        {
            return timestamp - timers[counterName]
        }
    }
    return {recordTimeSpan: recordTimeSpan}
})();
(function()
{
    awa._schemas = awa._schemas || [];
    var utils = awa.utils;
    var isValueAssigned = utils.isValueAssigned;
    var config = {
            endpoint: "https://web.vortex.data.microsoft.com/collect/v1", sendMode: 1, batchSize: 10, authMethod: 0, validateEvents: true, sendEvents: true, logLevel: awa.verbosityLevels.NONE, syncMuid: false, provisionMsfpc: true, useDefaultContentName: true, useShortNameForContentBlob: false, debounceMs: {
                    scroll: 600, resize: 3000
                }, muidDomain: "microsoft.com", biBlobAttributeTag: "data-m", isLoggedIn: false, shareAuthStatus: false, cookiesToCollect: ["MSFPC", "ANON", "Bounced"], mscomCookies: false, userConsentCookieName: "MSCC", userConsented: undefined, useBeacon: true, urlCollectHash: false, urlCollectQuery: true, initCv: false, enabledFeatures: true, ix: {
                    a: false, g: false
                }, autoCapture: {
                    pageView: true, onLoad: true, onUnload: true, click: true, scroll: false, resize: false, jsError: true, addin: true, perf: true, assets: false, lineage: false, invalidEvents: false, msTags: true, awaTags: true, eventTooLong: true, corsDisallowed: true
                }, callback: {
                    pageName: null, pageActionPageTags: null, pageViewPageTags: null, contentUpdatePageTags: null, pageActionContentTags: null, signedinStatus: null, jsllEventCallback: null, pageUnloadTimings: null
                }, coreData: {
                    referrerUri: document.referrer || undefined, requestUri: "", appId: window.location.hostname, pageName: "", pageType: "", env: "", product: "", market: "", serverImpressionGuid: "", expId: "", pageTags: {}
                }
        };
    awa.getConfig = function()
    {
        return config
    };
    var attributesThatAreObjectsInConfig = [];
    for (var attribute in config)
    {
        if (typeof config[attribute] === "object")
        {
            attributesThatAreObjectsInConfig.push(attribute)
        }
    }
    var CS_ENVLOPE_VERSION = "2.1";
    var JSLL_VERSION = "4.2.4.cV";
    var JSEXTENSION_VERSION = "1.1";
    var partAfieldsInOrder = ["ver", "name", "time", "flags", "os", "appId", "cV", "deviceClass"];
    var numberOfPartAFields = partAfieldsInOrder.length;
    var isOldIE = isOldIEBrowser();
    var allowedGetLength = isOldIE ? 2083 : 15000;
    var queryParameters = "";
    var signInRedirectCount = 0;
    var firstEventSent = false;
    var isBeaconAvailable = isValueAssigned(navigator) && isValueAssigned(navigator.sendBeacon);
    var isMsfpcProvisioned = isValueAssigned(awa.cookie.getCookie("MSFPC"));
    awa.experimentIdTag = "expId";
    awa.isAvailable = true;
    awa.requestBody = "";
    awa.getQueryStringParameters = function()
    {
        return queryParameters
    };
    if (Object.freeze)
    {
        Object.freeze(awa.verbosityLevels)
    }
    awa.capabilitiesCheck();
    var requestMechanism = window.XDomainRequest ? "XDomainRequest" : "xhr";
    var canMakeCrossDomainCall = function()
        {
            if (requestMechanism === "XDomainRequest")
            {
                if (config.endpoint && (config.endpoint.indexOf(window.location.protocol) !== 0))
                {
                    awa.logger.logError("Unable to write event: CORS requests are not supported cross-protocol in this browser");
                    return false
                }
            }
            return true
        };
    var modeOneFirstEventSent = function()
        {
            firstEventSent = true;
            if (config.sendMode == 1)
            {
                awa.vortexEvents.overrideQueueBehavior({domReadyState: "complete"});
                awa.vortexEvents.drainQueuedEvents()
            }
        };
    awa.firstEventDone = modeOneFirstEventSent;
    awa.firstEventDoneTasks = function()
    {
        awa.vortexEvents.drainQueuedEvents()
    };
    var xhrFailureCallback = function(textStatus, errorThrown)
        {
            awa.logger.logError("Failure sending data to vortex: " + textStatus + "Error: " + errorThrown.toString())
        };
    var xhrSuccessCallback = function(src, event, isScript)
        {
            if (awa.OnSuccessfulVortexRequest)
            {
                awa.OnSuccessfulVortexRequest(src)
            }
            if (event && typeof config.callback.jsllEventCallback === "function")
            {
                config.callback.jsllEventCallback(event)
            }
            if (firstEventSent === false)
            {
                firstEventSent = true;
                if (config.sendMode === 1 && !isScript)
                {
                    modeOneFirstEventSent()
                }
            }
            awa.logger.logInformation("Success sending data to vortex")
        };
    var xdrFailureCallback = function(xdr)
        {
            awa.logger.logError("Failure sending data to vortex using XDomainRequest.  Status code:" + xdr.status)
        };
    var quoteCharacter = "'";
    var doubleQuoteCharacter = "\"";
    var dashCharacter = "-";
    var starCharacter = "*";
    function addToQueryParam(queryParam, key, value)
    {
        if (isValueAssigned(value))
        {
            var returnString = "";
            if (queryParam.length > 0)
            {
                returnString += "&"
            }
            if (utils.isOfCorrectType("number", value) || utils.isOfCorrectType("bool", value))
            {
                returnString += key + "=" + value
            }
            else if (typeof value == "object")
            {
                returnString += key + "=" + JSON.stringify(value)
            }
            else
            {
                returnString += key + "=" + quoteCharacter + encodeURIComponent(value) + quoteCharacter
            }
            return returnString
        }
        else
        {
            return ""
        }
    }
    function addToRequestBody(requestBody, key, value)
    {
        if (isValueAssigned(value))
        {
            var returnString = "";
            if (requestBody.length > 1)
            {
                returnString += ","
            }
            if (utils.isOfCorrectType("number", value) || utils.isOfCorrectType("bool", value))
            {
                returnString += doubleQuoteCharacter + key + doubleQuoteCharacter + ":" + value
            }
            else if (typeof value == "object")
            {
                returnString += doubleQuoteCharacter + key + doubleQuoteCharacter + ":" + JSON.stringify(value)
            }
            else
            {
                returnString += doubleQuoteCharacter + key + doubleQuoteCharacter + ":" + doubleQuoteCharacter + value + doubleQuoteCharacter
            }
            return returnString
        }
        else
        {
            return ""
        }
    }
    function getQueryFromJSON(event)
    {
        var queryParameters = "";
        for (var i = 0; i < numberOfPartAFields; i++)
        {
            queryParameters += addToQueryParam(queryParameters, partAfieldsInOrder[i], event[partAfieldsInOrder[i]])
        }
        var data = event.data;
        for (var dataKey in data)
        {
            if (dataKey == "baseData")
            {
                var baseData = data[dataKey];
                for (var baseDataKey in baseData)
                {
                    queryParameters += addToQueryParam(queryParameters, dashCharacter + baseDataKey, baseData[baseDataKey])
                }
            }
            else
            {
                queryParameters += addToQueryParam(queryParameters, starCharacter + dataKey, data[dataKey])
            }
        }
        var extensions = event.ext;
        for (var extensionKey in extensions)
        {
            var currentExtension = extensions[extensionKey];
            for (var subExtensionKey in currentExtension)
            {
                queryParameters += addToQueryParam(queryParameters, "ext" + dashCharacter + extensionKey + dashCharacter + subExtensionKey, currentExtension[subExtensionKey])
            }
        }
        queryParameters += "&" + getMsComQueryParam();
        if (config.shareAuthStatus === true && config.authMethod == 2 && getSignedInStatus() === true)
        {
            queryParameters += "&" + getRedirectQueryParam()
        }
        setGlobalQueryParamForUnitTests(queryParameters);
        return queryParameters
    }
    ;
    function getRequestBodyFromJSON(event)
    {
        var openingCurl = "{";
        var closingCurl = "}";
        var requestBody = openingCurl;
        for (var i = 0; i < numberOfPartAFields; i++)
        {
            requestBody += addToRequestBody(requestBody, partAfieldsInOrder[i], event[partAfieldsInOrder[i]])
        }
        var data = event.data;
        if (data)
        {
            requestBody += addToRequestBody(requestBody, "data", data)
        }
        var extensions = event.ext;
        if (extensions)
        {
            requestBody += addToRequestBody(requestBody, "ext", extensions)
        }
        requestBody += closingCurl;
        awa.requestBody = requestBody;
        return requestBody
    }
    ;
    function setGlobalQueryParamForUnitTests(queryP)
    {
        queryParameters = queryP
    }
    awa.init = function(overrideConfig)
    {
        if (!awa.isInitialized)
        {
            awa.isInitialized = true;
            if (overrideConfig)
            {
                utils.removeNonObjectsAndInvalidElements(overrideConfig, attributesThatAreObjectsInConfig);
                config = utils.extend(true, config, overrideConfig)
            }
            var sendMode = config.sendMode;
            if (sendMode == 0)
            {
                firstEventSent = true;
                awa.vortexEvents.overrideQueueBehavior({domReadyState: "complete"})
            }
            if (sendMode >= 1)
            {
                awa.vortexEvents.overrideQueueBehavior({domReadyState: "notComplete"})
            }
            if (sendMode === 2)
            {
                awa.vortexEvents.batchEventsByNumber(config.batchSize)
            }
            awa.consoleVerbosity = config.logLevel;
            awa.ct.initialize(config);
            awa.ix.init(config);
            if (config.initCv)
            {
                    awa.cv.init()
            }
        }
    };
    var populatePartAandExtensions = function(event)
        {
            if (awa.translateEventFromIntermediateStructure)
            {
                event = awa.translateEventFromIntermediateStructure(event)
            }
            var cV = event.cV;
            var appId = event.appId;
            event.ver = "2.1";
            event.cV = isValueAssigned(cV) ? cV : awa.cv.increment();
            event.time = isValueAssigned(event.time) ? event.time : utils.dateToISOString(new Date);
            event.os = utils.getOs();
            event.deviceClass = awa.ids.getDeviceClass() || undefined;
            event.appId = utils.getAppIdWithPrefix(appId ? appId : config.coreData.appId);
            var domain = window.location.hostname;
            if (!isValueAssigned(domain))
            {
                domain = window.location.protocol == "file:" ? "local" : domain
            }
            var javascriptExtensionObject = {
                    ver: "1.1", libVer: "4.2.4.cv", domain: domain, msfpc: awa.cookie.getCookie("MSFPC", "GUID"), userConsent: isValueAssigned(config.userConsented) ? config.userConsented : (isValueAssigned(awa.cookie.getCookie(config.userConsentCookieName)) ? true : false)
                };
            if (event.ext)
            {
                event.ext.javascript = javascriptExtensionObject
            }
            else
            {
                event.ext = {javascript: javascriptExtensionObject}
            }
            var localId = awa.ids.getMuidUserId();
            if (localId)
            {
                event.ext.user = {localId: localId}
            }
            var configEnv = config.coreData.env;
            var envFromCT = event.ext.app ? event.ext.app.env : undefined;
            var envValue = isValueAssigned(envFromCT) ? envFromCT : configEnv;
            var expIdValue = config.coreData.expId ? awa.ids.readExpIdFromCoreData(config.coreData.expId) : awa.ids.readExpIdFromCookie();
            var userIdValue = awa.ids.getAppUserId();
            if (isValueAssigned(envValue) || isValueAssigned(expIdValue) || isValueAssigned(userIdValue))
            {
                if (!event.ext.app)
                {
                    event.ext.app = {}
                }
                if (envValue)
                {
                    event.ext.app.env = envValue
                }
                if (expIdValue)
                {
                    event.ext.app.expId = expIdValue
                }
                if (userIdValue)
                {
                    event.ext.app.userId = userIdValue
                }
            }
            if (config.validateEvents && awa.isEventValid && !awa.isEventValid(event))
            {
                return undefined
            }
            else
            {
                awa._validateAndTranslateEvent(event);
                return event
            }
        };
    awa.writeEvent = function(event)
    {
        if (!awa.isInitialized)
        {
            awa.vortexEvents.addEventToQueue(event);
            return
        }
        var actuallyUseGet = true;
        if (Object.prototype.toString.call(event) === "[object Array]")
        {
            var arrayOfEventsToSend = [];
            for (var i = 0; i < event.length; i++)
            {
                var currentEvent = populatePartAandExtensions(event[i]);
                if (currentEvent)
                {
                    arrayOfEventsToSend.push(currentEvent)
                }
            }
            if (arrayOfEventsToSend.length != 0)
            {
                event = arrayOfEventsToSend;
                actuallyUseGet = false
            }
            else
            {
                return
            }
        }
        else
        {
            event = populatePartAandExtensions(event);
            if (!event)
            {
                return
            }
        }
        if (config.sendEvents)
        {
            var payloadLength = JSON.stringify(event).length + config.endpoint.length;
            if (actuallyUseGet && payloadLength + 7 > allowedGetLength)
            {
                awa.logger.logWarning("event is too large to send using get -- using post instead");
                if (config.autoCapture.eventTooLong)
                {
                    var jsllEvent = {};
                    jsllEvent.eventName = event.name;
                    jsllEvent.payloadLength = payloadLength;
                    awa.ct.captureEventTooLong(jsllEvent)
                }
                actuallyUseGet = false
            }
            if (!actuallyUseGet && !canMakeCrossDomainCall())
            {
                if (config.autoCapture.corsDisallowed)
                {
                    var jsllEvent = {};
                    jsllEvent.eventName = event.name;
                    jsllEvent.type = "CorsDisallowed";
                    awa.ct.captureCorsDisallowed(jsllEvent)
                }
                return
            }
            if (awa.testHook && awa.testHook.testUsePost == true)
            {
                actuallyUseGet = false
            }
            if (actuallyUseGet)
            {
                if (firstEventSent === false || config.provisionMsfpc && !isMsfpcProvisioned || config.shareAuthStatus === true)
                {
                    isMsfpcProvisioned = true;
                    var telemetryResource = "/t.js";
                    if (config.shareAuthStatus === true && getSignedInStatus() === true)
                    {
                        if (config.authMethod === 1)
                        {
                            var isAlreadyAuthed = !(document.cookie.toLowerCase().indexOf("bounced=") === -1);
                            if (isAlreadyAuthed)
                            {
                                sendThroughImage(config.endpoint + "/asm.gif?" + getQueryFromJSON(event), event);
                                return
                            }
                            else
                            {
                                telemetryResource = "/asm.js"
                            }
                        }
                        else if (config.authMethod === 2)
                        {
                            telemetryResource = "/asa.js"
                        }
                    }
                    sendThroughScript(config.endpoint + telemetryResource + "?" + getQueryFromJSON(event), event)
                }
                else
                {
                    if (isBeaconAvailable && config.useBeacon === true)
                    {
                        sendThroughBeacon(event)
                    }
                    else
                    {
                        sendThroughImage(config.endpoint + "/t.gif?" + getQueryFromJSON(event), event)
                    }
                }
            }
            else
            {
                if (isBeaconAvailable && config.useBeacon === true && config.shareAuthStatus === false)
                {
                    sendThroughBeacon(event)
                }
                else
                {
                    sendThroughPost(event)
                }
            }
        }
        else
        {
            xhrSuccessCallback(getQueryFromJSON(event), event)
        }
    };
    function sendThroughImage(imageSrc, event)
    {
        var newImage = new Image;
        newImage.onload = function()
        {
            if (newImage.width === 1)
            {
                xhrSuccessCallback(imageSrc, event)
            }
        };
        newImage.onerror = function()
        {
            awa.logger.logWarning("Telemetry image beacon not sent properly. Sending through POST.");
            sendThroughPost(event)
        };
        newImage.src = imageSrc
    }
    function serializeEventForPost(translatedEvents)
    {
        var requestBody = "";
        var qp = "";
        var msfpc = "";
        if (translatedEvents.length)
        {
            msfpc = translatedEvents[0].ext.javascript.msfpc;
            for (var j = 0; j < translatedEvents.length; j++)
            {
                if (j > 0)
                {
                    requestBody += "\n"
                }
                requestBody += getRequestBodyFromJSON(translatedEvents[j])
            }
        }
        else
        {
            msfpc = translatedEvents.ext.javascript.msfpc;
            requestBody = getRequestBodyFromJSON(translatedEvents)
        }
        var requestSrc = config.endpoint + "/t.req?" + requestBody;
        var qp = "?" + getMsComQueryParam();
        qp += isValueAssigned(msfpc) ? "&ext-javascript-msfpc=" + encodeURIComponent(quoteCharacter + msfpc + quoteCharacter) : "";
        return {
                qp: qp, requestBody: requestBody, requestSrc: requestSrc
            }
    }
    function getMsComQueryParam()
    {
        return "$mscomCookies=" + config.mscomCookies
    }
    function getRedirectQueryParam()
    {
        return "$nr=" + isValueAssigned(awa.cookie.getCookie("Bounced"))
    }
    function sendThroughPost(translatedEvents)
    {
        var serializedEvent = serializeEventForPost(translatedEvents);
        if (requestMechanism === "xhr")
        {
            var request = new XMLHttpRequest;
            request.open("POST", config.endpoint + serializedEvent.qp, true);
            request.withCredentials = true;
            request.onload = function()
            {
                if (request.status === 200)
                {
                    xhrSuccessCallback(serializedEvent.requestSrc, translatedEvents)
                }
                else
                {
                    xhrFailureCallback(request.statusText, request.status)
                }
            };
            request.onerror = function()
            {
                xhrFailureCallback(request.statusText, request.status)
            };
            request.send(serializedEvent.requestBody)
        }
        else if (requestMechanism === "XDomainRequest")
        {
            var xdr = new window.XDomainRequest;
            xdr.onload = function()
            {
                xhrSuccessCallback(serializedEvent.requestSrc, translatedEvents)
            };
            xdr.onerror = function()
            {
                xdrFailureCallback(xdr)
            };
            xdr.open("POST", config.endpoint);
            xdr.send(serializedEvent.requestBody)
        }
        else
        {
            awa.logger.logError("No event is sent.")
        }
    }
    function sendThroughBeacon(translatedEvents)
    {
        var serializedEvent = serializeEventForPost(translatedEvents);
        if (navigator.sendBeacon(config.endpoint + serializedEvent.qp, serializedEvent.requestBody))
        {
            xhrSuccessCallback(serializedEvent.requestSrc, translatedEvents)
        }
        else
        {
            sendThroughPost(translatedEvents)
        }
    }
    function sendThroughScript(scriptSrc, event)
    {
        var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
        var script = document.createElement("script");
        script.onload = function()
        {
            xhrSuccessCallback(scriptSrc, event, true)
        };
        script.onerror = function()
        {
            modeOneFirstEventSent();
            awa.writeEvent(event)
        };
        script.async = true;
        script.src = scriptSrc;
        head.appendChild(script)
    }
    function getSignedInStatus()
    {
        if (config.callback && typeof(config.callback.signedinStatus) === "function")
        {
            return config.callback.signedinStatus()
        }
        else
        {
            return config.isLoggedIn
        }
    }
    awa.sendEventThroughIframe = function(frameSrc)
    {
        var frame = document.createElement("iframe");
        frame.id = "telframe";
        frame.style.display = "none";
        if (config.authMethod == 1)
        {
            if (frame.addEventListener)
            {
                frame.addEventListener("load", modeOneFirstEventSent)
            }
            else
            {
                frame.attachEvent("onload", modeOneFirstEventSent)
            }
        }
        frame.src = frameSrc;
        awa.cookie.setCookie("Bounced", utils.dateToISOString(new Date), 0.5 / 24);
        document.body.appendChild(frame)
    };
    awa._registerSchemas = function(schemas)
    {
        for (var i = 0; i < schemas.length; i++)
        {
            awa._schemas[schemas[i].name] = schemas[i]
        }
    };
    awa.console = window.console || {};
    awa.console.fallback = awa.console.log || function(){};
    var logTypes = ["log", "info", "warn", "error", "trace"];
    for (var i = 0; i < logTypes.length; i++)
    {
        var m = logTypes[i];
        if (!awa.console[m])
        {
            awa.console[m] = awa.console.fallback
        }
    }
    function isOldIEBrowser()
    {
        var newerBrowserVersion = 9;
        var ua = utils.getUserAgent();
        var msie = ua.indexOf("MSIE ");
        if (msie > 0)
        {
            return parseInt(ua.substring(msie + 5, ua.indexOf(".", msie)), 10) < newerBrowserVersion
        }
        return false
    }
    awa.extendCoreData = function(data)
    {
        utils.removeInvalidElements(data);
        config.coreData = utils.extend(true, config.coreData, data)
    };
    awa._validateAndTranslateEvent = function(eventObject)
    {
        return {event: eventObject}
    };
    awa.testHook = {
        JSLL_VERSION: JSLL_VERSION, defaultConfig: function()
            {
                return config
            }, setAllowedGetLength: function(len)
            {
                allowedGetLength = len
            }, testUsePost: false, getAllowedGetLength: function()
            {
                return allowedGetLength
            }, getQueryFromJSON: getQueryFromJSON
    }
})();
awa._registerSchemas([{
        name: "Ms.Cll.Javascript.CorsDisallowed", "Ms.Cll.Javascript.CorsDisallowed": {
                part: "C", def: {fields: [{
                                req: true, name: "eventName", type: "string"
                            }, {
                                name: "pageName", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "impressionGuid", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Cll.Javascript.EventTooLong", "Ms.Cll.Javascript.EventTooLong": {
                part: "C", def: {fields: [{
                                req: true, name: "eventName", type: "string"
                            }, {
                                req: true, name: "payloadLength", type: "int32"
                            }, {
                                name: "pageName", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "impressionGuid", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Cll.Javascript.Error", "Ms.Telemetry.Error": {
                part: "B", def: {fields: [{
                                name: "errorName", type: "string"
                            }, {
                                name: "errorMessage", type: "string"
                            }, {
                                name: "severity", type: "int32"
                            }, {
                                name: "errorType", type: "string"
                            }, {
                                name: "errorCode", type: "int32"
                            }, {
                                name: "lineNumber", type: "uint32"
                            }, {
                                name: "isDisplayed", type: "bool"
                            }, {
                                name: "errorLocation", type: "string"
                            }, {
                                name: "errorMethod", type: "string"
                            }]}
            }, "Ms.Cll.Javascript.Error": {
                part: "C", def: {fields: [{
                                req: true, name: "code", type: "int32"
                            }, {
                                req: true, name: "message", type: "string"
                            }, {
                                name: "pageName", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "impressionGuid", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Cll.Javascript.EventDropped", "Ms.Cll.Javascript.EventDropped": {
                part: "C", def: {fields: [{
                                req: true, name: "eventName", type: "string"
                            }, {
                                name: "pageName", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "impressionGuid", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }, {
                                name: "droppedInfo", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Webi.ClientError", "Ms.Webi.ClientError": {
                part: "B", def: {fields: [{
                                req: true, name: "errorInfo", type: "string"
                            }, {
                                name: "wasDisplayed", type: "bool"
                            }, {
                                name: "customSessionGuid", type: "string"
                            }, {
                                name: "impressionGuid", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }, {
                                name: "pageName", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "errorName", type: "string"
                            }, {
                                name: "errorMessage", type: "string"
                            }, {
                                name: "severity", type: "int32"
                            }, {
                                name: "errorType", type: "string"
                            }, {
                                name: "errorCode", type: "int32"
                            }, {
                                name: "lineNumber", type: "uint32"
                            }, {
                                name: "isDisplayed", type: "bool"
                            }, {
                                name: "errorLocation", type: "string"
                            }, {
                                name: "errorMethod", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Webi.OutgoingRequest", "Ms.Qos.OutgoingServiceRequest": {
                part: "B", def: {fields: [{
                                req: true, name: "operationName", type: "string"
                            }, {
                                name: "targetUri", type: "string"
                            }, {
                                req: true, name: "latencyMs", type: "int32"
                            }, {
                                name: "serviceErrorCode", type: "int32"
                            }, {
                                req: true, name: "succeeded", type: "bool"
                            }, {
                                name: "requestMethod", type: "string"
                            }, {
                                name: "responseContentType", type: "string"
                            }, {
                                name: "protocol", type: "string"
                            }, {
                                name: "protocolStatusCode", type: "string"
                            }, {
                                req: true, name: "dependencyOperationName", type: "string"
                            }, {
                                name: "dependencyOperationVersion", type: "string"
                            }, {
                                req: true, name: "dependencyName", type: "string"
                            }, {
                                name: "dependencyType", type: "string"
                            }, {
                                name: "responseSizeBytes", type: "int32"
                            }, {
                                name: "requestStatus", type: "int32"
                            }]}
            }, "Ms.Webi.OutgoingRequest": {
                part: "C", def: {fields: [{
                                name: "customSessionGuid", type: "string"
                            }, {
                                name: "impressionGuid", type: "string"
                            }, {
                                name: "message", type: "string"
                            }, {
                                name: "retryCount", type: "int32"
                            }, {
                                name: "customData", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }, {
                                name: "pageName", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Webi.PageView", "Ms.Content.PageView": {
                part: "B", def: {fields: [{
                                name: "ver", type: "string"
                            }, {
                                req: true, name: "impressionGuid", type: "string"
                            }, {
                                req: true, name: "pageName", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "referrerUri", type: "string"
                            }, {
                                name: "pageType", type: "string"
                            }, {
                                name: "pageTags", type: "string"
                            }, {
                                name: "product", type: "string"
                            }, {
                                name: "screenState", type: "int32"
                            }, {
                                name: "actionType", type: "string"
                            }, {
                                name: "behavior", type: "int32"
                            }, {
                                name: "resHeight", type: "int32"
                            }, {
                                name: "resWidth", type: "int32"
                            }, {
                                name: "vpHeight", type: "int32"
                            }, {
                                name: "vpWidth", type: "int32"
                            }, {
                                name: "market", type: "string"
                            }]}
            }, "Ms.Webi.PageView": {
                part: "C", def: {fields: [{
                                name: "cookieEnabled", type: "bool"
                            }, {
                                name: "flashInstalled", type: "bool"
                            }, {
                                name: "flashVersion", type: "string"
                            }, {
                                name: "cookies", type: "string"
                            }, {
                                name: "isJs", type: "bool"
                            }, {
                                name: "title", type: "string"
                            }, {
                                name: "isLoggedIn", type: "bool"
                            }, {
                                name: "isManual", type: "bool"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            },{
                                name: "RelatedCV", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Webi.ContentUpdate", "Ms.Content.ContentUpdate": {
                part: "B", def: {fields: [{
                                name: "ver", type: "string"
                            }, {
                                req: true, name: "impressionGuid", type: "string"
                            }, {
                                req: true, name: "pageName", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "pageTags", type: "string"
                            }, {
                                name: "pageHeight", type: "int32"
                            }, {
                                name: "vpHeight", type: "int32"
                            }, {
                                name: "vpWidth", type: "int32"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "actionType", type: "string"
                            }, {
                                name: "behavior", type: "int32"
                            }, {
                                name: "vScrollOffset", type: "int32"
                            }, {
                                name: "hScrollOffset", type: "int32"
                            }, {
                                name: "contentVer", type: "string"
                            }, {
                                req: true, name: "content", type: "string"
                            }]}
            }, "Ms.Webi.ContentUpdate": {
                part: "C", def: {fields: [{
                                name: "pageLoadTime", type: "int32"
                            }, {
                                name: "title", type: "string"
                            }, {
                                name: "isJs", type: "bool"
                            }, {
                                name: "cookieEnabled", type: "bool"
                            }, {
                                name: "isLoggedIn", type: "bool"
                            }, {
                                name: "isManual", type: "bool"
                            }, {
                                name: "isDomComplete", type: "bool"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }, {
                                name: "timings", type: "string"
                            },{
                                name: "RelatedCV", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Webi.PageAction", "Ms.Content.PageAction": {
                part: "B", def: {fields: [{
                                name: "ver", type: "string"
                            }, {
                                req: true, name: "impressionGuid", type: "string"
                            }, {
                                req: true, name: "pageName", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }, {
                                name: "destUri", type: "string"
                            }, {
                                name: "market", type: "string"
                            }, {
                                name: "pageType", type: "string"
                            }, {
                                name: "pageTags", type: "string"
                            }, {
                                name: "product", type: "string"
                            }, {
                                name: "screenState", type: "int32"
                            }, {
                                name: "actionType", type: "string"
                            }, {
                                name: "behavior", type: "int32"
                            }, {
                                name: "contentVer", type: "string"
                            }, {
                                name: "content", type: "string"
                            }]}
            }, "Ms.Webi.PageAction": {
                part: "C", def: {fields: [{
                                name: "timeToAction", type: "int32"
                            }, {
                                name: "cookieEnabled", type: "bool"
                            }, {
                                name: "cookies", type: "string"
                            }, {
                                name: "isJs", type: "bool"
                            }, {
                                name: "title", type: "string"
                            }, {
                                name: "referrerUri", type: "string"
                            }, {
                                name: "isLoggedIn", type: "bool"
                            }, {
                                name: "isManual", type: "bool"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }]}
            }
    }, {
        name: "Ms.Webi.PageUnload", "Ms.Content.PageUnload": {
                part: "B", def: {fields: [{
                                name: "ver", type: "string"
                            }, {
                                req: true, name: "impressionGuid", type: "string"
                            }, {
                                req: true, name: "pageName", type: "string"
                            }, {
                                name: "uri", type: "string"
                            }]}
            }, "Ms.Webi.PageUnload": {
                part: "C", def: {fields: [{
                                name: "dwellTime", type: "int32"
                            }, {
                                name: "scrollDepth", type: "string"
                            }, {
                                name: "serverImpressionGuid", type: "string"
                            }, {
                                name: "timings", type: "string"
                            }, {
                                name: "vScrollOffset", type: "int32"
                            }, {
                                name: "pageHeight", type: "int32"
                            }, {
                                name: "vpHeight", type: "int32"
                            }, {
                                name: "pageLoadTime", type: "int32"
                            }]}
            }
    }

]);
awa.isEventValid = (function(event)
{
    var logWarning = awa.logger.logWarning;
    function logAndSend(overrideValues, isDropped)
    {
        var details = overrideValues.eventName + " - " + overrideValues.droppedInfo;
        if (isDropped)
        {
            logWarning("Dropped event " + details);
            awa.ct.captureEventDrop(overrideValues)
        }
        else
        {
            logWarning("Dropped field from " + details)
        }
    }
    function isInArray(array, obj)
    {
        for (var i = 0; i < array.length; i++)
        {
            if (array[i] == obj)
            {
                return true
            }
        }
        return false
    }
    function validatePart(part, partSchema)
    {
        var partFields = [];
        var schemaFields = [];
        var numberOfFields = partSchema.length;
        for (var fieldIndex = 0; fieldIndex < numberOfFields; fieldIndex++)
        {
            var field = partSchema[fieldIndex];
            var fieldName = field.name;
            schemaFields.push(fieldName);
            var fieldType = field.type;
            var fieldValue = part[fieldName];
            var required = field.req;
            if (!awa.utils.isValueAssigned(fieldValue))
            {
                if (required === true)
                {
                    logAndSend({
                        eventName: eventName, droppedInfo: "Missing field: " + fieldName
                    }, true);
                    return false
                }
            }
            else if (!awa.utils.isOfCorrectType(fieldType, fieldValue))
            {
                logAndSend({
                    eventName: eventName, droppedInfo: "Incorrect type: " + fieldName
                }, required);
                if (required === true)
                {
                    return false
                }
                else
                {
                    delete part[fieldName]
                }
            }
        }
        var numberOfpartFieldsInEvent = partFields.length;
        for (var partField in part)
        {
            if (!(partField == "baseData" || partField == "baseType"))
            {
                if (!isInArray(schemaFields, partField))
                {
                    logAndSend({
                        eventName: eventName, droppedInfo: "Unexpected field " + partField
                    }, false);
                    delete part[partField]
                }
            }
        }
        return true
    }
    if (event)
    {
        var eventName = event.name;
        var schemas = awa._schemas;
        var partBName = event.data.baseType;
        var partCName = eventName;
        var thisEventSchema = schemas[eventName];
        if (thisEventSchema)
        {
            if (partBName)
            {
                var partB = event.data.baseData;
                var partBSchema = thisEventSchema[partBName] ? thisEventSchema[partBName].def.fields : undefined;
                if (partB && partBSchema)
                {
                    if (!validatePart(partB, partBSchema))
                    {
                        return false
                    }
                }
            }
            if (partCName)
            {
                var partC = event.data;
                var partCSchema = thisEventSchema[partCName] ? thisEventSchema[partCName].def.fields : undefined;
                if (partC && partCSchema)
                {
                    if (!validatePart(partC, partCSchema))
                    {
                        return false
                    }
                }
            }
        }
        else
        {
            logAndSend({
                eventName: eventName, droppedInfo: "Not registered in JSLL"
            }, true);
            return false
        }
        return true
    }
    else
    {
        return false
    }
});
awa.translateEventFromIntermediateStructure = (function(oldEvent)
{
    var eventName = oldEvent.name;
    var oldEventData = oldEvent.data;
    var utils = awa.utils;
    if (utils.isValueAssigned(oldEventData[eventName]))
    {
        var oldPartC = utils.extend(true, oldEventData[eventName]);
        delete oldEventData[eventName];
        var keysInData = [];
        for (var key in oldEventData)
        {
            keysInData.push(key)
        }
        var oldPartB = utils.extend(true, oldEventData[keysInData[0]]);
        delete oldEventData[keysInData[0]];
        delete oldEvent.content;
        var data = utils.extend(true, JSON.stringify(oldPartB) !== "{}" ? {baseData: oldPartB} : {}, oldPartC, {baseType: keysInData[0]});
        var returnObject = utils.extend(true, oldEvent, {data: data});
        return returnObject
    }
    else
    {
        return oldEvent
    }
});
awa.ix = (function()
{
    var configIx = {};
    var mc1 = "";
    var anid = "";
    var isAssigned = awa.utils.isValueAssigned;
    function init(config)
    {
        configIx = config.ix
    }
    function getAdobeUrl()
    {
        var mc1IdKey = "88170%01";
        var anidKey = "88169%01";
        var qpSeparation = "%01";
        var versionAndSuffix = "&d_ver=2";
        var authStatus = "%010";
        if (isAssigned(mc1) || isAssigned(anid))
        {
            return "https://dpm.demdex.net/id?d_orgid=A5FF776A5245AF830A490D44@AdobeOrg&d_cid=" + (isAssigned(mc1) ? mc1IdKey + mc1 + authStatus : "") + (isAssigned(anid) ? (isAssigned(mc1) ? qpSeparation : "") + anidKey + anid + authStatus : "") + versionAndSuffix
        }
        else
        {
            return undefined
        }
    }
    function getGoogleUrl()
    {
        if (isAssigned(mc1))
        {
            return "https://ad.doubleclick.net/ddm/activity/src=6952136;type=store0;cat=jsll;u58=" + mc1 + ";dc_lat=;dc_rdid=;tag_for_child_directed_treatment=;ord=1?"
        }
        return undefined
    }
    function receiveIdsFromVortex(ids)
    {
        if (ids)
        {
            mc1 = ids.mc1;
            anid = ids.anid;
            if (isAssigned(mc1) || isAssigned(anid))
            {
                if (configIx.a)
                {
                    var request = new XMLHttpRequest;
                    request.onreadystatechange = function()
                    {
                        if (request.readyState == 4 && request.status == 200)
                        {
                            awa.ct.captureSwap(JSON.parse(request.responseText))
                        }
                    };
                    var requestSrc = getAdobeUrl();
                    if (isAssigned(requestSrc))
                    {
                        request.open("GET", requestSrc, true);
                        request.setRequestHeader("Accept", "application/json; charset=utf-8");
                        request.send()
                    }
                }
                if (configIx.g)
                {
                    var requestSrc = getGoogleUrl();
                    if (isAssigned(requestSrc))
                    {
                        var newImage = new Image;
                        newImage.src = requestSrc
                    }
                }
            }
        }
    }
    ;
    return {
            init: init, set: receiveIdsFromVortex, testHook: {
                    getAdobeUrl: getAdobeUrl, getGoogleUrl: getGoogleUrl, setMc1: function(newMc1)
                        {
                            mc1 = newMc1
                        }, setAnid: function(newAnid)
                        {
                            anid = newAnid
                        }
                }
        }
})();
awa.ct = (function()
{
    var MSCONTENT_PARTB_VERSION = "1.0";
    var CONTENT_VERSION = "2.0";
    var MAX_CONTENTNAME_LENGTH = 200;
    var IS_SENSITIVE_FLAG = 0x080000;
    var config = {};
    var autoCapture = {};
    var cookie = awa.cookie;
    var errorHandler = awa.errorHandler;
    var ids = awa.ids;
    var vortexEvents = awa.vortexEvents;
    var utils = awa.utils;
    var actionTypeEnum = awa.actionType;
    var maxScroll = {
            h: 0, v: 0
        };
    var doNotTrackFieldName = "data-bi-dnt";
    var isPageUnloadFired = false;
    var contentBlobFieldNameObjects = {
            longNames: {
                isShortNames: false, id: "data-bi-id", areaName: "data-bi-area", slotNumber: "data-bi-slot", contentName: "data-bi-name", contentSource: "data-bi-source", templateName: "data-bi-view", productId: "data-bi-product", contentType: "data-bi-type"
            }, shortNames: {
                    isShortNames: true, id: "data-bi-id", areaName: "data-bi-an", slotNumber: "data-bi-sn", contentName: "data-bi-cn", contentSource: "data-bi-cs", templateName: "data-bi-tn", productId: "data-bi-pid", contentType: "data-bi-ct"
                }
        };
    var contentBlobFieldNames = contentBlobFieldNameObjects.longNames;
    var clickCaptureInputTypes = {
            BUTTON: true, CHECKBOX: true, RADIO: true, RESET: true, SUBMIT: true
        };
    function init(inputConfig)
    {
        if (!awa.isAvailable)
        {
            return
        }
        config = inputConfig;
        autoCapture = config.autoCapture;
        contentBlobFieldNames = config.useShortNameForContentBlob === true ? contentBlobFieldNameObjects.shortNames : contentBlobFieldNameObjects.longNames;
        if (autoCapture.pageView)
        {
            sendPageView({isAuto: true})
        }
        if (autoCapture.click)
        {
            if (window.addEventListener)
            {
                var event = (navigator.appVersion.indexOf("MSIE") !== -1) ? "click" : "mousedown";
                window.addEventListener(event, processClick, false);
                window.addEventListener("keyup", processClick, false)
            }
            else if (document.attachEvent)
            {
                document.attachEvent("onclick", processClick);
                document.attachEvent("keyup", processClick)
            }
        }
        if (autoCapture.jsError)
        {
            errorHandler.init()
        }
        if (autoCapture.scroll)
        {
            var processScroll = debounce(null, function()
                {
                    sendContentUpdate({
                        isAuto: true, actionType: awa.actionType.SCROLL
                    })
                }, config.debounceMs.scroll);
            if (window.addEventListener)
            {
                window.addEventListener("scroll", processScroll)
            }
            else if (window.attachEvent)
            {
                window.attachEvent("onscroll", processScroll)
            }
        }
        if (autoCapture.resize)
        {
            var processResize = debounce(function()
                {
                    sendContentUpdate({
                        isAuto: true, actionType: awa.actionType.RESIZE
                    })
                }, null, config.debounceMs.resize);
            if (window.addEventListener)
            {
                window.addEventListener("resize", processResize)
            }
            else if (window.attachEvent)
            {
                window.attachEvent("onresize", processResize)
            }
        }
        if (autoCapture.onUnload || config.manualPageUnload)
        {
            var getMaxScrollDepth = function()
                {
                    var currentScroll = getScrollOffset();
                    maxScroll.v = maxScroll.v > currentScroll.v ? maxScroll.v : currentScroll.v
                };
            if (window.addEventListener)
            {
                window.addEventListener("scroll", getMaxScrollDepth)
            }
            else if (window.attachEvent)
            {
                window.attachEvent("onscroll", getMaxScrollDepth)
            }
        }
        if (autoCapture.onUnload)
        {
            if (window.addEventListener)
            {
                window.addEventListener("beforeunload", sendPageUnload);
                window.addEventListener("unload", sendPageUnload)
            }
            else if (window.attachEvent)
            {
                window.attachEvent("onbeforeunload", sendPageUnload);
                window.attachEvent("onunload", sendPageUnload)
            }
        }
        if (config.sendMode == 2)
        {
            var sendBatched = awa.vortexEvents.batchQueuedEvents;
            if (window.addEventListener)
            {
                window.addEventListener("beforeunload", sendBatched);
                window.addEventListener("unload", sendBatched)
            }
            else if (window.attachEvent)
            {
                window.attachEvent("onbeforeunload", sendBatched);
                window.attachEvent("onunload", sendBatched)
            }
        }
        if (config.authMethod == 2 && config.shareAuthStatus == true && config.isLoggedIn == true)
        {
            if (window.addEventListener)
            {
                window.addEventListener("message", receiveMessage)
            }
            else if (window.attachEvent)
            {
                window.attachEvent("onmessage", receiveMessage)
            }
        }
        if (config.syncMuid || config.autoCapture.onLoad)
        {
            onDomReadyDo(awa.ct.domReadyTasksWrapper)
        }
    }
    function receiveMessage(event)
    {
        if (event.data == "firstEventDone" && (event.origin == "https://web.vortex.data.microsoft.com" || event.origin == "https://login.microsoftonline.com"))
        {
            awa.firstEventDone()
        }
    }
    function onDomReadyDo(f)
    {
        /in/.test(document.readyState) ? setTimeout(function()
        {
            awa.ct.onDomReadyDo(f)
        }, 100) : f.call()
    }
    function domReadyTasks()
    {
        if (config.syncMuid)
        {
            syncupMuid()
        }
        if (autoCapture.onLoad)
        {
            if (document.readyState === "complete")
            {
                sendAutoContentUpdate()
            }
            else
            {
                if (window.addEventListener)
                {
                    window.addEventListener("load", sendAutoContentUpdate)
                }
                else if (window.attachEvent)
                {
                    window.attachEvent("onload", sendAutoContentUpdate)
                }
            }
        }
    }
    function domReadyTasksWrapper()
    {
        awa.ct.domReadyTasks()
    }
    function getPageName()
    {
        if (config.callback && typeof(config.callback.pageName) === "function")
        {
            return config.callback.pageName()
        }
        else if (config.coreData.pageName)
        {
            return config.coreData.pageName
        }
        else
        {
            var pagename = window.location.pathname;
            var framents = pagename.split("/");
            if (framents.length > 2 && framents[2] !== "")
            {
                pagename = framents[2]
            }
            else
            {
                pagename = "Home"
            }
            return pagename
        }
    }
    function syncupMuid()
    {
        var muidHost = utils.getMuidHost(config.muidDomain || "microsoft.com");
        if (muidHost)
        {
            var muidsrc = (window.location.protocol || "http:") + "//" + muidHost + "/c.gif?DI=4050&did=1&t=";
            var img = document.createElement("IMG");
            img.style.display = "none";
            img.src = muidsrc;
            img.hidden = "";
            img["aria-hidden"] = "true";
            img.role = "presentation"
        }
        else
        {
            awa.logger.logWarning("Unable to get a muid host for the configured muidDomain '" + config.muidDomain + "'.  Unable to sync muid")
        }
    }
    function isRightClick(evt)
    {
        if ("which" in evt)
        {
            return (evt.which === 3)
        }
        else if ("button" in evt)
        {
            return (evt.button === 2)
        }
    }
    function isLeftClick(evt)
    {
        if ("which" in evt)
        {
            return (evt.which === 1)
        }
        else if ("button" in evt)
        {
            return (evt.button === 1)
        }
    }
    function isKeyboardEnter(evt)
    {
        if ("keyCode" in evt)
        {
            return (evt.keyCode === 13)
        }
    }
    function isKeyboardSpace(evt)
    {
        if ("keyCode" in evt)
        {
            return (evt.keyCode === 32)
        }
    }
    function processClick(event)
    {
        var clickCaptureElements = {
                A: true, BUTTON: true, AREA: true, INPUT: true
            };
        var evt = event || window.event;
        var e = evt.srcElement || evt.target;
        var overrideValues = {isAuto: true};
        if (isRightClick(evt))
        {
            overrideValues.behavior = awa.behavior.CONTEXTMENU;
            overrideValues.actionType = actionTypeEnum.CLICKRIGHT
        }
        else if (isLeftClick(evt))
        {
            overrideValues.actionType = actionTypeEnum.CLICKLEFT
        }
        else if (isKeyboardEnter(evt))
        {
            overrideValues.actionType = actionTypeEnum.KEYBOARDENTER
        }
        else if (isKeyboardSpace(evt))
        {
            overrideValues.actionType = actionTypeEnum.KEYBOARDSPACE
        }
        else
        {
            return
        }
        while (e && e.tagName)
        {
            if (!clickCaptureElements[e.tagName.toUpperCase()])
            {
                e = e.parentElement || e.parentNode;
                continue
            }
            else
            {
                var sendEvent = e.tagName.toUpperCase() === "INPUT" ? clickCaptureInputTypes[e.type.toUpperCase()] : true;
                if (sendEvent)
                {
                    if (!isElementDnt(e))
                    {
                        sendClickEvent(e, overrideValues)
                    }
                }
                break
            }
        }
    }
    function isElementDnt(element)
    {
        var dntElement = utils.findClosestByAttribute(element, doNotTrackFieldName);
        if (!utils.isValueAssigned(dntElement))
        {
            return false
        }
        return true
    }
    function debounce(firstCallFunction, secondCallFunction, wait)
    {
        var timeout;
        return function()
            {
                var context = this,
                    args = arguments;
                var later = function()
                    {
                        timeout = null;
                        if (secondCallFunction)
                        {
                            secondCallFunction.apply(context, args)
                        }
                    };
                var callNow = !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow)
                {
                    if (firstCallFunction)
                    {
                        firstCallFunction.apply(context, args)
                    }
                }
            }
    }
    function sendPageView(overrideValues)
    {
        resetPageUnloadProperties();
        overrideValues = overrideValues || {};
        var eventData = {};
        var pageTags = awa.utils.extend(true, config.coreData.pageTags);
        pageTags.metaTags = collectMetaTagsAndSetEventProperty(eventData, true);
        setEnabledFeatures(pageTags);
        if (typeof(config.callback.pageViewPageTags) === "function")
        {
            pageTags = utils.extend(true, pageTags, config.callback.pageViewPageTags())
        }
        var screenRes = getScreenResolution();
        var pageViewEvent = {
                name: "Ms.Webi.PageView", data: {
                        baseData: {
                            ver: MSCONTENT_PARTB_VERSION, impressionGuid: ids.getPageViewImpressionGuid(), pageName: overrideValues.pageName || getPageName(), uri: overrideValues.uri || getUri(), referrerUri: overrideValues.referrerUri || config.coreData.referrerUri, market: eventData.market, pageType: eventData.pageType, product: eventData.product, resHeight: screenRes.h, resWidth: screenRes.w, pageTags: JSON.stringify(utils.extend(true, pageTags, overrideValues.pageTags)), actionType: overrideValues.actionType || eventData.actionType, behavior: getValidBehavior(overrideValues.behavior) || (eventData.behavior ? eventData.behavior : awa.behavior.UNDEFINED)
                        }, baseType: "Ms.Content.PageView", cookieEnabled: getCookieEnabled(), cookies: getClientCookies(), isJs: true, title: utils.getTitle(), isLoggedIn: config.isLoggedIn, serverImpressionGuid: eventData.serverImpressionGuid, isManual: true, RelatedCV: awa.cv.getRelatedCV()
                    }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
            };
        if (config.autoCapture.addin)
        {
            var flashInfo = getFlashInfo();
            pageViewEvent.data.flashInstalled = flashInfo["installed"] || false;
            pageViewEvent.data.flashVersion = flashInfo["version"] || ""
        }
        sendEventAfterOverridesAndStringify(pageViewEvent, overrideValues, eventData.env, true)
    }
    function sendAutoContentUpdate()
    {
        sendContentUpdate({
            isAuto: true, isDomComplete: true
        })
    }
    function sendContentUpdate(overrideValues)
    {
        overrideValues = overrideValues || {};
        var eventData = {};
        var pageTags = awa.utils.extend(true, config.coreData.pageTags);
        pageTags.metaTags = collectMetaTagsAndSetEventProperty(eventData);
        setEnabledFeatures(pageTags);
        if (overrideValues && overrideValues.isDomComplete)
        {
            if (autoCapture.perf === true)
            {
                if (window.performance)
                {
                    if (window.performance.timing)
                    {
                        pageTags.timing = utils.stringifyField("timing", window.performance.timing)
                    }
                    if (autoCapture.assets === true)
                    {
                        var perfData = utils.getPerformanceData();
                        if (perfData)
                        {
                            pageTags.AssetPerformance = utils.stringifyField("AssetPerformance", perfData)
                        }
                    }
                }
            }
        }
        if (typeof(config.callback.contentUpdatePageTags) === "function")
        {
            pageTags = utils.extend(true, pageTags, config.callback.contentUpdatePageTags())
        }
        var viewportDim = getViewportDimensions();
        var scrollOffset = {};
        if (utils.isValueAssigned(overrideValues.vScrollOffset) || utils.isValueAssigned(overrideValues.hScrollOffset))
        {
            scrollOffset = getScrollOffset()
        }
        var contentUpdateEvent = {
                name: "Ms.Webi.ContentUpdate", data: {
                        baseData: {
                            ver: MSCONTENT_PARTB_VERSION, impressionGuid: ids.getImpressionGuid(), pageName: overrideValues.pageName || getPageName(), uri: overrideValues.uri || getUri(), market: eventData.market, pageTags: JSON.stringify(utils.extend(true, pageTags, overrideValues.pageTags)), pageHeight: overrideValues.pageHeight || document.body.scrollHeight, vpHeight: viewportDim.h, vpWidth: viewportDim.w, actionType: overrideValues.actionType || eventData.actionType, behavior: getValidBehavior(overrideValues.behavior) || (eventData.behavior ? eventData.behavior : awa.behavior.UNDEFINED), vScrollOffset: overrideValues.vScrollOffset || scrollOffset.v, hScrollOffset: overrideValues.hScrollOffset || scrollOffset.h, contentVer: CONTENT_VERSION, content: getContentInRightFormat(overrideValues.content) || getPageContent(getViewportBoundingRect(viewportDim))
                        }, baseType: "Ms.Content.ContentUpdate", timings: JSON.stringify(overrideValues.timings), title: utils.getTitle(), cookieEnabled: getCookieEnabled(), isJs: true, isManual: true, isDomComplete: false, isLoggedIn: config.isLoggedIn, serverImpressionGuid: eventData.serverImpressionGuid, RelatedCV: awa.cv.getRelatedCV()
                    }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
            };
        sendEventAfterOverridesAndStringify(contentUpdateEvent, overrideValues, eventData.env, false)
    }
    function sendCustomClickEvent(overrideValues)
    {
        sendClickEvent(null, overrideValues)
    }
    function sendElementClickEvent(element, overrideValues)
    {
        sendClickEvent(element, overrideValues)
    }
    function sendClickEvent(element, overrideValues)
    {
        var eventData = {};
        var pageTags = awa.utils.extend(true, config.coreData.pageTags);
        overrideValues = overrideValues || {};
        var elementContent = {};
        element = utils.returnDomObjectIfjQuery(element);
        if (element)
        {
            eventData.targetUri = getClickTarget(element);
            elementContent = getElementContent(element, true);
            if (autoCapture.msTags)
            {
                elementContent = utils.extend(elementContent, getCustomTags(element))
            }
            if (elementContent.bhvr)
            {
                eventData.behavior = getValidBehavior(utils.extractFieldFromObject(elementContent, "bhvr"))
            }
        }
        pageTags.metaTags = collectMetaTagsAndSetEventProperty(eventData);
        setEnabledFeatures(pageTags);
        if (typeof(config.callback.pageActionPageTags) === "function")
        {
            pageTags = utils.extend(true, pageTags, config.callback.pageActionPageTags(element))
        }
        var pageActionContentTags = config.callback.pageActionContentTags;
        var pageActionEvent = {
                name: "Ms.Webi.PageAction", data: {
                        baseData: {
                            ver: MSCONTENT_PARTB_VERSION, impressionGuid: ids.getImpressionGuid(), pageName: overrideValues.pageName || getPageName(), uri: overrideValues.uri || getUri(), pageTags: utils.stringifyField("pageTags", utils.extend(true, pageTags, overrideValues.pageTags)), contentVer: CONTENT_VERSION, market: eventData.market, destUri: overrideValues.targetUri || eventData.targetUri, pageType: eventData.pageType, product: eventData.product, actionType: overrideValues.actionType || eventData.actionType, behavior: getValidBehavior(overrideValues.behavior) || (eventData.behavior ? eventData.behavior : awa.behavior.UNDEFINED), content: getContentInRightFormat(overrideValues.content) || utils.bracketIt(JSON.stringify(utils.extend(elementContent, typeof pageActionContentTags === "function" ? pageActionContentTags(element) : {}, overrideValues && overrideValues.contentTags ? overrideValues.contentTags : {})))
                        }, baseType: "Ms.Content.PageAction", timeToAction: getTimeToClick(), cookieEnabled: getCookieEnabled(), cookies: getClientCookies(), isJs: true, title: utils.getTitle(), isLoggedIn: config.isLoggedIn, isManual: true, referrerUri: overrideValues.referrerUri || config.coreData.referrerUri, serverImpressionGuid: eventData.serverImpressionGuid
                    }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
            };
        sendEventAfterOverridesAndStringify(pageActionEvent, overrideValues, eventData.env, true)
    }
    function resetPageUnloadProperties()
    {
        awa.timespanHandler.recordTimeSpan("dwellTime", false);
        maxScroll.v = 0;
        isPageUnloadFired = false
    }
    function sendPageUnload(overrideValues)
    {
        if (!isPageUnloadFired)
        {
            isPageUnloadFired = true;
            var eventData = {};
            collectMetaTagsAndSetEventProperty(eventData);
            var timingsCallback = config.callback.pageUnloadTimings;
            var scrollHeight = document.body.scrollHeight.toString();
            var pageUnloadEvent = {
                    name: "Ms.Webi.PageUnload", data: {
                            baseData: {
                                ver: MSCONTENT_PARTB_VERSION, impressionGuid: ids.getImpressionGuid(), pageName: overrideValues.pageName || getPageName()
                            }, baseType: "Ms.Content.PageUnload", dwellTime: awa.timespanHandler.recordTimeSpan("dwellTime", true), scrollDepth: overrideValues.scrollDepth || maxScroll.v.toString() + "/" + scrollHeight, vScrollOffset: overrideValues.vScrollOffset || maxScroll.v, pageHeight: overrideValues.pageHeight || scrollHeight, vpHeight: getViewportDimensions().h, serverImpressionGuid: eventData.serverImpressionGuid, timings: timingsCallback ? timingsCallback() : undefined
                        }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
                };
            sendEventAfterOverridesAndStringify(pageUnloadEvent, undefined, eventData.env, true)
        }
    }
    function sendClientError(overrideValues)
    {
        if (overrideValues)
        {
            var eventData = {};
            collectMetaTagsAndSetEventProperty(eventData);
            var clientErrorEvent = {
                    name: "Ms.Webi.ClientError", data: {
                            errorInfo: JSON.stringify(overrideValues.errorInfo), wasDisplayed: overrideValues.displayedToUser || false, customSessionGuid: ids.getSessionId(), impressionGuid: ids.getImpressionGuid(), pageName: overrideValues.pageName || getPageName(), uri: overrideValues.uri || getUri(), market: eventData.market, serverImpressionGuid: eventData.serverImpressionGuid
                        }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
                };
            sendEventAfterOverridesAndStringify(clientErrorEvent, undefined, eventData.env, false)
        }
    }
    function sendCorsDisallowed(overrideValues)
    {
        if (overrideValues)
        {
            var eventData = {};
            collectMetaTagsAndSetEventProperty(eventData);
            var corsDisallowedEvent = {
                    name: "Ms.Cll.Javascript.CorsDisallowed", data: {
                            eventName: overrideValues.eventName, pageName: getPageName(), uri: overrideValues.uri || getUri(), market: eventData.market, impressionGuid: ids.getImpressionGuid(), serverImpressionGuid: eventData.serverImpressionGuid
                        }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
                };
            sendEventAfterOverridesAndStringify(corsDisallowedEvent, undefined, eventData.env, false)
        }
    }
    function sendEventTooLong(overrideValues)
    {
        if (overrideValues)
        {
            var eventData = {};
            collectMetaTagsAndSetEventProperty(eventData);
            var eventTooLongEvent = {
                    name: "Ms.Cll.Javascript.EventTooLong", data: {
                            eventName: overrideValues.eventName, payloadLength: overrideValues.payloadLength, pageName: overrideValues.pageName || getPageName(), uri: overrideValues.uri || getUri(), market: eventData.market, impressionGuid: ids.getImpressionGuid(), serverImpressionGuid: eventData.serverImpressionGuid
                        }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
                };
            sendEventAfterOverridesAndStringify(eventTooLongEvent, undefined, eventData.env, false)
        }
    }
    function sendEventDropped(overrideValues)
    {
        if (overrideValues && autoCapture.invalidEvents)
        {
            var eventData = {};
            collectMetaTagsAndSetEventProperty(eventData);
            var eventTooLongEvent = {
                    name: "Ms.Cll.Javascript.EventDropped", data: {
                            eventName: overrideValues.eventName, droppedInfo: overrideValues.droppedInfo, pageName: overrideValues.pageName || getPageName(), uri: overrideValues.uri || getUri(), market: eventData.market, impressionGuid: ids.getImpressionGuid(), serverImpressionGuid: eventData.serverImpressionGuid
                        }, flags: eventData.isSensitive ? IS_SENSITIVE_FLAG : undefined
                };
            sendEventAfterOverridesAndStringify(eventTooLongEvent, undefined, eventData.env, false)
        }
    }
    function sendIdSwap(overrideValues)
    {
        return
    }
    function extendAndSendQos(qosEvent)
    {
        var eventData = {};
        collectMetaTagsAndSetEventProperty(eventData);
        var partC = qosEvent.data;
        partC.market = eventData.market;
        partC.pageName = getPageName();
        partC.uri = getUri();
        sendEventAfterOverridesAndStringify(qosEvent, undefined, eventData.env, false)
    }
    function populateOverridesInEvent(event, partC, overrideValues)
    {
        if (overrideValues.appId)
        {
            event.appId = overrideValues.appId
        }
        if (overrideValues.isAuto !== true)
        {
            partC.isManual = true
        }
        else
        {
            partC.isManual = undefined
        }
        if (overrideValues.isDomComplete)
        {
            partC.isDomComplete = overrideValues.isDomComplete;
            partC.pageLoadTime = overrideValues.pageLoadTime || utils.getPageLoadTime()
        }
    }
    function getContentInRightFormat(content)
    {
        if (utils.isValueAssigned(content))
        {
            if (Object.prototype.toString.call(content) === "[object Array]")
            {
                return JSON.stringify(content)
            }
            else
            {
                return utils.bracketIt(JSON.stringify(content))
            }
        }
        return undefined
    }
    function sendEventAfterOverridesAndStringify(event, overrideValues, env, isCritical)
    {
        event.time = utils.dateToISOString(new Date);
        var partC = event.data;
        if (overrideValues)
        {
            populateOverridesInEvent(event, partC, overrideValues)
        }
        if (env)
        {
            event.ext = {app: {env: env}}
        }
        vortexEvents.SendOrScheduleEvent(event, isCritical)
    }
    function getTimeToClick()
    {
        if (window.performance && window.performance.timing)
        {
            var isNavigationStart = window.performance.timing.navigationStart;
            if (isNavigationStart !== 0)
            {
                return (new Date).getTime() - isNavigationStart
            }
        }
        return -1
    }
    function getViewportBoundingRect(viewportDimensions)
    {
        var viewportBoundingRect = {
                top: 0, bottom: viewportDimensions.h, left: 0, right: viewportDimensions.w
            };
        return viewportBoundingRect
    }
    function getPageContent(viewportBoundingRect)
    {
        var arrayOfContents = [];
        var elementsToCapture = document.querySelectorAll(utils.bracketIt(contentBlobFieldNames.areaName) + "," + utils.bracketIt(contentBlobFieldNames.slotNumber) + "," + utils.bracketIt(config.biBlobAttributeTag));
        pushToArrayOfContentsIfVisible(elementsToCapture, arrayOfContents, viewportBoundingRect);
        return JSON.stringify(arrayOfContents)
    }
    function pushToArrayOfContentsIfVisible(elements, arrayOfContents, viewportBoundingRect)
    {
        if (elements)
        {
            for (var i = 0; i < elements.length; i++)
            {
                var element = elements[i];
                if (!isElementDnt(element))
                {
                    if (utils.isElementTrulyVisible(element, viewportBoundingRect))
                    {
                        var elementContent = getElementContent(element, false);
                        if (elementContent)
                        {
                            arrayOfContents.push(elementContent)
                        }
                    }
                }
            }
        }
    }
    function getLineageDetails(element)
    {
        var name = [];
        var identifier = [];
        var lineageDelimiter = ">";
        var elementBiDataAttribute = config.biBlobAttributeTag;
        var elementModuleIdAttribute = "data-module-id";
        var containerName = undefined;
        var nameValue;
        var idValue;
        while (element && element.getAttribute)
        {
            var dataAttr = element.getAttribute(elementBiDataAttribute) || element[elementBiDataAttribute];
            var moduleIdAttribute = element.getAttribute(elementModuleIdAttribute) || element[elementModuleIdAttribute];
            if (dataAttr)
            {
                var telemetryObject = JSON.parse(dataAttr);
                if (telemetryObject)
                {
                    nameValue = telemetryObject.cN || telemetryObject.cT;
                    idValue = telemetryObject.id || undefined;
                    if (nameValue || idValue)
                    {
                        name.push(nameValue);
                        if (moduleIdAttribute)
                        {
                            containerName = nameValue
                        }
                        identifier.push(idValue)
                    }
                }
            }
            else
            {
                nameValue = element.getAttribute(contentBlobFieldNames.contentName) || element.getAttribute(contentBlobFieldNames.contentType);
                idValue = element.getAttribute(contentBlobFieldNames.id) || undefined;
                if (nameValue || idValue)
                {
                    name.push(nameValue);
                    if (moduleIdAttribute)
                    {
                        containerName = nameValue
                    }
                    identifier.push(idValue)
                }
            }
            element = element.parentElement
        }
        var lineageDetails = {
                lineage: name.join(lineageDelimiter), lineageById: identifier.join(lineageDelimiter), lineageContainerName: containerName
            };
        return lineageDetails
    }
    ;
    function getElementContent(element, isPageAction)
    {
        if (!element)
        {
            return ""
        }
        var elementContent = {};
        var biBlobElement = awa.utils.findClosestByAttribute(element, config.biBlobAttributeTag);
        var biBlobValue;
        if (biBlobElement)
        {
            biBlobValue = biBlobElement.getAttribute(config.biBlobAttributeTag)
        }
        if (biBlobValue)
        {
            elementContent = JSON.parse(biBlobValue)
        }
        else
        {
            var contentElement = utils.findClosestByAttribute(element, utils.bracketIt(contentBlobFieldNames.id));
            contentElement = utils.returnDomObjectIfjQuery(element);
            var areaElement = utils.findClosestByAttribute(element, contentBlobFieldNames.areaName);
            var areaContent = awa.utils.extend({}, getAreaContent(areaElement));
            elementContent = {
                id: contentElement.getAttribute(contentBlobFieldNames.id) || element.id || "", aN: areaContent.areaName, sN: contentElement.getAttribute(contentBlobFieldNames.slotNumber), cN: contentElement.getAttribute(contentBlobFieldNames.contentName) || getDefaultContentName(element) || contentElement.getAttribute("alt") || "", cS: contentElement.getAttribute(contentBlobFieldNames.contentSource) || areaContent.contentSource, tN: areaContent.templateName, pid: contentElement.getAttribute(contentBlobFieldNames.productId), cT: contentElement.getAttribute(contentBlobFieldNames.contentType) || areaContent.type
            };
            if (!elementContent.id || !elementContent.aN || !elementContent.sN || !elementContent.cN)
            {
                awa.logger.logWarning("Invalid content blob.  Missing required attributes (id, aN/area, sN/slot), cN/contentName. " + " Content information will still be collected!")
            }
            if (!contentBlobFieldNames.isShortNames)
            {
                elementContent = {
                    contentId: elementContent.id, areaName: elementContent.aN, slotNumber: elementContent.sN, contentName: elementContent.cN, contentSource: elementContent.cS, templateName: elementContent.tN, productId: elementContent.pid, contentType: elementContent.cT
                }
            }
            for (var i = 0, attrib; i < contentElement.attributes.length; i++)
            {
                attrib = contentElement.attributes[i];
                if (attrib.name === contentBlobFieldNames.id || attrib.name === contentBlobFieldNames.areaName || attrib.name === contentBlobFieldNames.slotNumber || attrib.name === contentBlobFieldNames.contentName || attrib.name === contentBlobFieldNames.contentSource || attrib.name === contentBlobFieldNames.templateName || attrib.name === contentBlobFieldNames.productId || attrib.name === contentBlobFieldNames.contentType || attrib.name.indexOf("data-bi-") === -1)
                {
                    continue
                }
                var attribName = attrib.name.replace("data-bi-", "");
                elementContent[attribName] = attrib.value
            }
        }
        awa.utils.removeInvalidElements(elementContent);
        if (config.autoCapture.lineage && isPageAction)
        {
            elementContent = awa.utils.extend(elementContent, getLineageDetails(element))
        }
        return elementContent
    }
    function getDefaultContentName(element)
    {
        if (config.useDefaultContentName === false || isPii(element) || !element.tagName)
        {
            return ""
        }
        var contentName;
        switch (element.tagName)
        {
            case"A":
                contentName = document.all ? element.innerText || element.innerHTML : element.text || element.innerHTML;
            case"IMG":
            case"AREA":
                contentName = element.alt;
            default:
                contentName = element.value || element.name || element.alt || element.innerText || element.id
        }
        return contentName.substring(0, MAX_CONTENTNAME_LENGTH)
    }
    function getAreaContent(areaElement)
    {
        areaElement = utils.returnDomObjectIfjQuery(areaElement);
        if (areaElement)
        {
            return {
                    areaName: areaElement.getAttribute(contentBlobFieldNames.areaName), templateName: areaElement.getAttribute(contentBlobFieldNames.templateName), contentSource: areaElement.getAttribute(contentBlobFieldNames.contentSource), product: areaElement.getAttribute(contentBlobFieldNames.productId), type: areaElement.getAttribute(contentBlobFieldNames.contentType)
                }
        }
    }
    function getClientCookies()
    {
        var cookies = "";
        var uniqueCookies = {};
        var mergedCookies = [];
        var cookiesConfig = config.cookiesToCollect;
        if (config.shareAuthStatus === false)
        {
            mergedCookies = cookiesConfig
        }
        else
        {
            for (var i = 0; i < cookiesConfig.length; i++)
            {
                if (cookiesConfig[i] !== "ANON")
                {
                    mergedCookies.push(cookiesConfig[i])
                }
            }
        }
        var key;
        var cookieValue;
        try
        {
            try
            {
                if (window.varCustomerCookies && window.varCustomerCookies.length > 0)
                {
                    mergedCookies = mergedCookies.concat(window.varCustomerCookies)
                }
            }
            catch(e) {}
            for (key in mergedCookies)
            {
                if (!uniqueCookies.hasOwnProperty(mergedCookies[key]))
                {
                    uniqueCookies[mergedCookies[key]] = "";
                    cookieValue = decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(mergedCookies[key]).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1"));
                    if (cookieValue !== "")
                    {
                        cookies += mergedCookies[key] + "=" + cookieValue + ";"
                    }
                }
            }
        }
        catch(e) {}
        return cookies || undefined
    }
    function getClickTarget(element)
    {
        var clickTarget = "";
        switch (element.tagName)
        {
            case"A":
            case"AREA":
                clickTarget = element.href || "";
                break;
            case"IMG":
                clickTarget = getImageHref(element);
                break;
            case"INPUT":
                var type = element.type;
                var e = window.event;
                if (type && (clickCaptureInputTypes[type.toUpperCase()]))
                {
                    if (element.form)
                    {
                        clickTarget = element.form.action || window.location.pathname
                    }
                    else
                    {
                        clickTarget = window.location.pathname
                    }
                }
                break;
            default:
                break
        }
        return clickTarget
    }
    function getCustomTags(obj)
    {
        var customParameters = {};
        while (obj)
        {
            if (isPii(obj))
            {
                continue
            }
            for (var attr in obj.attributes)
            {
                if (attr)
                {
                    if (obj.attributes[attr])
                    {
                        var nn = obj.attributes[attr].name;
                        if (nn)
                        {
                            if (nn.toLowerCase().indexOf("ms.") === 0)
                            {
                                customParameters[nn] = obj.attributes[attr].value
                            }
                        }
                    }
                }
            }
            obj = (obj.parentElement || obj.parentNode)
        }
        return customParameters
    }
    function getFlashInfo()
    {
        var flashInfo = {};
        if (navigator.plugins["Shockwave Flash"])
        {
            flashInfo.installed = true;
            var plugin = navigator.plugins["Shockwave Flash"];
            flashInfo.version = plugin.description.split(" ")[2]
        }
        else if (navigator.userAgent.indexOf("MSIE") !== -1)
        {
            var flashMax = (new Date).getFullYear() - 1992;
            for (var i = flashMax; i > 0; i--)
            {
                try
                {
                    var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + i);
                    flashInfo.installed = true;
                    flashInfo.version = i + ".0";
                    break
                }
                catch(e) {}
            }
        }
        return flashInfo
    }
    function setEnabledFeatures(pageTags)
    {
        if (config.enabledFeatures)
        {
            if (pageTags.enabledFeatures)
            {
                return
            }
            var enabledFeatures = cookie.getCookie("Features");
            if (enabledFeatures)
            {
                pageTags.enabledFeatures = enabledFeatures
            }
        }
    }
    function collectMetaTagsAndSetEventProperty(event, isPageView)
    {
        var awaTags = {};
        var msTags = {};
        if (config.autoCapture.awaTags)
        {
            awaTags = getMetaDataFromDom("awa-", true)
        }
        event.env = getMetaData(awaTags, config.coreData, "env");
        event.pageType = getMetaData(awaTags, config.coreData, "pageType");
        event.product = getMetaData(awaTags, config.coreData, "product");
        event.market = getMetaData(awaTags, config.coreData, "market");
        event.serverImpressionGuid = getMetaData(awaTags, config.coreData, "serverImpressionGuid");
        event.isSensitive = getMetaData(awaTags, config.coreData, "isSensitive");
        if (!event.behavior && isPageView)
        {
            event.behavior = getValidBehavior(getMetaData(awaTags, config.coreData, "behavior"))
        }
        if (config.autoCapture.msTags)
        {
            msTags = getMetaDataFromDom("ms.", false);
            awaTags = utils.extend(true, awaTags, msTags)
        }
        return awaTags
    }
    function getMetaData(awaTags, coreData, metaTagName)
    {
        if (coreData[metaTagName])
        {
            return coreData[metaTagName]
        }
        else
        {
            return utils.extractFieldFromObject(awaTags, metaTagName)
        }
    }
    function getMetaDataFromDom(prefix, removePrefix)
    {
        var metaElements;
        var metaData = {};
        metaElements = document.querySelectorAll("meta");
        for (var i = 0; i < metaElements.length; i++)
        {
            var meta = metaElements[i];
            if (meta.name)
            {
                var mt = meta.name.toLowerCase();
                if (mt.indexOf(prefix) === 0)
                {
                    var name = removePrefix ? meta.name.replace(prefix, "") : meta.name;
                    metaData[name] = meta.content
                }
            }
        }
        return metaData
    }
    function getScreenResolution()
    {
        var screenRes = {
                h: 0, w: 0
            };
        if (window.screen)
        {
            screenRes.h = screen.height;
            screenRes.w = screen.width
        }
        return screenRes
    }
    function getViewportDimensions()
    {
        var viewport = {
                h: 0, w: 0
            };
        if (window.screen)
        {
            viewport.h = window.innerHeight || document.body.clientHeight || document.documentElement.clientHeight;
            viewport.w = window.innerWidth || document.body.clientWidth || document.documentElement.clientWidth
        }
        return viewport
    }
    function getScrollOffset()
    {
        var scrollOffset = {
                h: parseInt(document.body.scrollLeft || document.documentElement.scrollLeft || window.pageXOffset || 0, 10), v: parseInt(document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset || 0, 10)
            };
        return scrollOffset
    }
    function getCookieEnabled()
    {
        if (navigator.cookieEnabled)
        {
            return true
        }
        var testCookieName = "MC0";
        var cookiePresent = cookie.getCookie(testCookieName);
        if (!cookiePresent)
        {
            document.cookie = testCookieName + "=1";
            cookiePresent = cookie.getCookie(testCookieName)
        }
        return cookiePresent ? true : false
    }
    function getImageHref(element)
    {
        var temp = element;
        if (temp)
        {
            var parent = utils.findClosestAnchor(temp);
            if (parent && parent.length === 1)
            {
                if (parent[0].href)
                {
                    return parent[0].href
                }
                else if (parent[0].src)
                {
                    return (parent[0].src)
                }
            }
        }
        return ""
    }
    function isPii(element)
    {
        if (!element || !element.attributes)
        {
            return false
        }
        try
        {
            var pii = element.getAttribute("data-dc");
            if (utils.isValueAssigned(pii))
            {
                if (pii.toLowerCase() === "pii")
                {
                    return true
                }
                else
                {
                    return false
                }
            }
            else
            {
                return false
            }
        }
        catch(e)
        {
            return false
        }
    }
    function isBehaviorValid(behaviorValue)
    {
        for (var i = 0; i < awa.behaviorKeys.length; i++)
        {
            if (awa.behavior[awa.behaviorKeys[i]] === behaviorValue)
            {
                return true
            }
        }
        awa.logger.logWarning("Unsupported behavior: " + behaviorValue + ".");
        return false
    }
    function getValidBehavior(behaviorValue)
    {
        if (utils.isValueAssigned(behaviorValue))
        {
            var behaviorValueNumber = Number(behaviorValue);
            if (utils.isOfCorrectType("uint16", behaviorValueNumber))
            {
                if (isBehaviorValid(behaviorValueNumber))
                {
                    return behaviorValueNumber
                }
            }
            else if (utils.isOfCorrectType("string", behaviorValue))
            {
                var value = awa.behavior[behaviorValue.toUpperCase()];
                if (utils.isOfCorrectType("uint16", value))
                {
                    return value
                }
            }
        }
        return undefined
    }
    function getUri()
    {
        var windowLocation = window.location;
        if (config.coreData.requestUri === "" && windowLocation)
        {
            var url = windowLocation.protocol + "//" + windowLocation.hostname + (utils.isValueAssigned(windowLocation.port) ? ":" + windowLocation.port : "") + windowLocation.pathname;
            if (config.urlCollectHash)
            {
                url += windowLocation.hash
            }
            if (config.urlCollectQuery)
            {
                var query = windowLocation.search;
                if (!query)
                {
                    var hash = window.location.hash;
                    query = hash.slice(hash.indexOf("?"))
                }
                url += query
            }
            return url
        }
        else
        {
            return config.coreData.requestUri
        }
    }
    return {
            initialize: init, capturePageView: sendPageView, captureContentUpdate: sendContentUpdate, capturePageAction: sendElementClickEvent, captureContentPageAction: sendCustomClickEvent, capturePageUnload: sendPageUnload, captureCorsDisallowed: sendCorsDisallowed, captureEventTooLong: sendEventTooLong, captureClientError: sendClientError, captureEventDrop: sendEventDropped, captureQos: extendAndSendQos, captureSwap: sendIdSwap, domReadyTasksWrapper: domReadyTasksWrapper, onDomReadyDo: onDomReadyDo, domReadyTasks: domReadyTasks, getTimeToClick: getTimeToClick, getPageContent: getPageContent, testHook: {
                    isBehaviorValid: isBehaviorValid, getValidBehavior: getValidBehavior, collectMetaTagsAndSetEventProperty: collectMetaTagsAndSetEventProperty, getElementContent: getElementContent, getPageContent: getPageContent, debounce: debounce, getScreenResolution: getScreenResolution, getViewportDimensions: getViewportDimensions
                }
        }
})();
awa.service = (function()
{
    var timespanHandler = awa.timespanHandler;
    var willChangeSupportCors = true;
    var alwaysAddCvToRequestHeader = false;
    var targetUriOverrideCallbackFunction = null;
    var makeRequest = function(requestOptions)
        {
            if (typeof jQuery === "function")
            {
                if (willChangeSupportCors)
                {
                    $.support.cors = true
                }
                var additionalHeaders = requestOptions.additionalHeaders || {};
                var body = requestOptions.body;
                var requestData = body ? JSON.stringify(body) : requestOptions.data || undefined;
                var maxRetry = requestOptions.maxRetry || 0;
                var retryCount = 0;
                var jqXhrCallback = $.noop;
                var operationName = requestOptions.operationName || requestOptions.url;
                var errorFormatter = requestOptions.errorFormatter || function(jqXhr)
                    {
                        return jqXhr
                    };
                var ids = awa.ids;
                var cachedCv;
                var options = {
                        url: requestOptions.url, type: requestOptions.method, data: requestData, crossDomain: true, headers: {}, success: requestOptions.success, timeout: requestOptions.timeout, error: requestOptions.error, jsonp: requestOptions.jsonp, jsonpCallback: requestOptions.jsonpCallback, cache: requestOptions.cache, beforeSend: function(jqXhr)
                            {
                                jqXhrCallback(jqXhr);
                                if (requestOptions.contractVersion)
                                {
                                    jqXhr.setRequestHeader("MS-Contract-Version", requestOptions.contractVersion)
                                }
                                if (((!awa.utils.isValueAssigned(requestOptions.addCvToRequestHeader)) && alwaysAddCvToRequestHeader) || requestOptions.addCvToRequestHeader)
                                {
                                    if (awa.cv.isValid(cachedCv))
                                    {
                                        jqXhr.setRequestHeader("MS-CV", cachedCv)
                                    }
                                }
                                if (additionalHeaders)
                                {
                                    for (var header in additionalHeaders)
                                    {
                                        jqXhr.setRequestHeader(header, additionalHeaders[header])
                                    }
                                }
                            }
                    };
                if (requestOptions.dataType)
                {
                    options.dataType = requestOptions.dataType
                }
                if (!requestOptions.noCacheBusting)
                {
                    options.cache = false
                }
                if (requestOptions.contentType)
                {
                    options.contentType = requestOptions.contentType
                }
                if (requestOptions.accept)
                {
                    options.headers.Accept = requestOptions.accept
                }
                if (requestOptions.accepts)
                {
                    options.accepts = requestOptions.accepts
                }
                if (requestOptions.async)
                {
                    options.async = requestOptions.async
                }
                if (requestOptions.xhrFields)
                {
                    options.xhrFields = requestOptions.xhrFields
                }
                if (requestOptions.complete)
                {
                    options.complete = requestOptions.complete
                }
                if (requestOptions.contents)
                {
                    options.contents = requestOptions.contents
                }
                if (requestOptions.context)
                {
                    options.context = requestOptions.context
                }
                if (requestOptions.dataFilter)
                {
                    options.dataFilter = requestOptions.dataFilter
                }
                if (requestOptions.global)
                {
                    options.global = requestOptions.global
                }
                if (requestOptions.ifModified)
                {
                    options.ifModified = requestOptions.ifModified
                }
                if (requestOptions.isLocal)
                {
                    options.isLocal = requestOptions.isLocal
                }
                if (requestOptions.mimeType)
                {
                    options.mimeType = requestOptions.mimeType
                }
                if (requestOptions.password)
                {
                    options.password = requestOptions.password
                }
                if (awa.utils.isValueAssigned(requestOptions.processData))
                {
                    options.processData = requestOptions.processData
                }
                if (requestOptions.scriptCharset)
                {
                    options.scriptCharset = requestOptions.scriptCharset
                }
                if (requestOptions.statusCode)
                {
                    options.statusCode = requestOptions.statusCode
                }
                if (requestOptions.traditional)
                {
                    options.traditional = requestOptions.traditional
                }
                if (requestOptions.type)
                {
                    options.type = requestOptions.type
                }
                if (requestOptions.username)
                {
                    options.username = requestOptions.username
                }
                if (requestOptions.xhr)
                {
                    options.xhr = requestOptions.xhr
                }
                if (awa.cv.isValid(requestOptions.cV))
                {
                    cachedCv = requestOptions.cV
                }
                else
                {
                    cachedCv = awa.cv.increment()
                }
                var sendApiComplete = function(jqXhr, isSuccess, timeTaken)
                    {
                        var contentLength = jqXhr.getResponseHeader("Content-Length");
                        var event = {
                                name: "Ms.Webi.OutgoingRequest", cV: cachedCv, data: {
                                        baseData: {
                                            operationName: requestOptions.currentOperationName || window.location.href, targetUri: targetUriOverrideCallbackFunction ? targetUriOverrideCallbackFunction(options.url) : options.url, latencyMs: timeTaken, serviceErrorCode: (!isSuccess && jqXhr.responseJSON && jqXhr.responseJSON.code && !isNaN(jqXhr.responseJSON.code)) ? jqXhr.responseJSON.code : -1, succeeded: isSuccess, requestMethod: options.type, responseContentType: options.dataType, protocolStatusCode: jqXhr.status.toString(), dependencyOperationName: operationName, dependencyOperationVersion: requestOptions.version && requestOptions.version.toString(), dependencyName: requestOptions.serviceName, dependencyType: "WebService", responseSizeBytes: contentLength && parseInt(contentLength, 10)
                                        }, baseType: "Ms.Qos.OutgoingServiceRequest", customSessionGuid: ids.getSessionId(), impressionGuid: ids.getImpressionGuid(), message: isSuccess ? undefined : awa.utils.stringifyField("errorMessage", jqXhr.errorThrown), retryCount: retryCount, customData: (requestOptions.customDataCallBack && typeof requestOptions.customDataCallBack === "function") ? JSON.stringify(requestOptions.customDataCallBack(jqXhr)) : undefined
                                    }
                            };
                        if (requestOptions.QosCallback && typeof requestOptions.QosCallback === "function")
                        {
                            requestOptions.QosCallback(jqXhr, event)
                        }
                        awa.ct.captureQos(event)
                    };
                var callWithRetry = function()
                    {
                        var apiName = operationName + "_Retry_" + retryCount;
                        timespanHandler.recordTimeSpan(apiName);
                        return $.ajax(options).then(function(data, textStatus, jqXhr)
                            {
                                var timeTaken = timespanHandler.recordTimeSpan(apiName, true);
                                sendApiComplete(jqXhr, true, timeTaken);
                                return jqXhr
                            }, function(jqXhr, status)
                            {
                                var timeTaken = timespanHandler.recordTimeSpan(apiName, true);
                                sendApiComplete(jqXhr, false, timeTaken);
                                var defer = $.Deferred();
                                if (maxRetry > retryCount && (jqXhr.status === 0 || (jqXhr.status >= 500 && jqXhr.status < 600)))
                                {
                                    retryCount++;
                                    if (awa.cv.isValid(requestOptions.cV))
                                    {
                                        cachedCv = awa.cv.incrementExternal(cachedCv)
                                    }
                                    else
                                    {
                                        cachedCv = awa.cv.increment()
                                    }
                                    setTimeout(function()
                                    {
                                        callWithRetry().done(defer.resolve).fail(defer.reject)
                                    }, 50)
                                }
                                else
                                {
                                    defer.reject(jqXhr, status)
                                }
                                return defer.promise()
                            })
                    };
                return callWithRetry().then(function(data, textStatus, jqXhr)
                    {
                        return jqXhr
                    }, function(jqXhr)
                    {
                        return errorFormatter(jqXhr, requestOptions)
                    })
            }
            else
            {
                awa.logger.logError("jQuery is not defined, cannot use service module")
            }
        };
    function setTargetUriCallbackFunctionOrString(targetUriOverrideStringOrCallback)
    {
        if (typeof(targetUriOverrideStringOrCallback) === "function")
        {
            targetUriOverrideCallbackFunction = targetUriOverrideStringOrCallback
        }
        else if (typeof(targetUriOverrideStringOrCallback) === "string")
        {
            targetUriOverrideCallbackFunction = function()
            {
                return targetUriOverrideStringOrCallback
            }
        }
    }
    return {
            post: function(requestOptions)
            {
                return makeRequest(awa.utils.extend({}, requestOptions, {method: "POST"}))
            }, get: function(requestOptions)
                {
                    return makeRequest(awa.utils.extend({maxRetry: 1}, requestOptions, {method: "GET"}))
                }, put: function(requestOptions)
                {
                    return makeRequest(awa.utils.extend({}, requestOptions, {method: "PUT"}))
                }, del: function(requestOptions)
                {
                    return makeRequest(awa.utils.extend({}, requestOptions, {method: "DELETE"}))
                }, patch: function(requestOptions)
                {
                    return makeRequest(awa.utils.extend({}, requestOptions, {method: "PATCH"}))
                }, doNotChangeSupportCors: function()
                {
                    willChangeSupportCors = false
                }, alwaysAddCvToRequestHeader: function()
                {
                    alwaysAddCvToRequestHeader = true
                }, setTargetUriOverride: setTargetUriCallbackFunctionOrString
        }
})();