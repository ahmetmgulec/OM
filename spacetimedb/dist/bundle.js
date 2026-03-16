import * as _syscalls2_0 from "spacetime:sys@2.0";
import { moduleHooks } from "spacetime:sys@2.0";

//#region C:/Users/PC/source/gitrepos/OM-main/node_modules/headers-polyfill/lib/index.mjs
var __create$1 = Object.create;
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __getOwnPropNames$1 = Object.getOwnPropertyNames;
var __getProtoOf$1 = Object.getPrototypeOf;
var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
var __commonJS$1 = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames$1(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps$1 = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames$1(from)) if (!__hasOwnProp$1.call(to, key) && key !== except) __defProp$1(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc$1(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM$1 = (mod, isNodeMode, target) => (target = mod != null ? __create$1(__getProtoOf$1(mod)) : {}, __copyProps$1(isNodeMode || !mod || !mod.__esModule ? __defProp$1(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));
var import_set_cookie_parser = __toESM$1(__commonJS$1({ "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
	"use strict";
	var defaultParseOptions = {
		decodeValues: true,
		map: false,
		silent: false
	};
	function isNonEmptyString(str) {
		return typeof str === "string" && !!str.trim();
	}
	function parseString(setCookieValue, options) {
		var parts = setCookieValue.split(";").filter(isNonEmptyString);
		var parsed = parseNameValuePair(parts.shift());
		var name = parsed.name;
		var value = parsed.value;
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		try {
			value = options.decodeValues ? decodeURIComponent(value) : value;
		} catch (e) {
			console.error("set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.", e);
		}
		var cookie = {
			name,
			value
		};
		parts.forEach(function(part) {
			var sides = part.split("=");
			var key = sides.shift().trimLeft().toLowerCase();
			var value2 = sides.join("=");
			if (key === "expires") cookie.expires = new Date(value2);
			else if (key === "max-age") cookie.maxAge = parseInt(value2, 10);
			else if (key === "secure") cookie.secure = true;
			else if (key === "httponly") cookie.httpOnly = true;
			else if (key === "samesite") cookie.sameSite = value2;
			else cookie[key] = value2;
		});
		return cookie;
	}
	function parseNameValuePair(nameValuePairStr) {
		var name = "";
		var value = "";
		var nameValueArr = nameValuePairStr.split("=");
		if (nameValueArr.length > 1) {
			name = nameValueArr.shift();
			value = nameValueArr.join("=");
		} else value = nameValuePairStr;
		return {
			name,
			value
		};
	}
	function parse(input, options) {
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!input) if (!options.map) return [];
		else return {};
		if (input.headers) if (typeof input.headers.getSetCookie === "function") input = input.headers.getSetCookie();
		else if (input.headers["set-cookie"]) input = input.headers["set-cookie"];
		else {
			var sch = input.headers[Object.keys(input.headers).find(function(key) {
				return key.toLowerCase() === "set-cookie";
			})];
			if (!sch && input.headers.cookie && !options.silent) console.warn("Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning.");
			input = sch;
		}
		if (!Array.isArray(input)) input = [input];
		options = options ? Object.assign({}, defaultParseOptions, options) : defaultParseOptions;
		if (!options.map) return input.filter(isNonEmptyString).map(function(str) {
			return parseString(str, options);
		});
		else return input.filter(isNonEmptyString).reduce(function(cookies2, str) {
			var cookie = parseString(str, options);
			cookies2[cookie.name] = cookie;
			return cookies2;
		}, {});
	}
	function splitCookiesString2(cookiesString) {
		if (Array.isArray(cookiesString)) return cookiesString;
		if (typeof cookiesString !== "string") return [];
		var cookiesStrings = [];
		var pos = 0;
		var start;
		var ch;
		var lastComma;
		var nextStart;
		var cookiesSeparatorFound;
		function skipWhitespace() {
			while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) pos += 1;
			return pos < cookiesString.length;
		}
		function notSpecialChar() {
			ch = cookiesString.charAt(pos);
			return ch !== "=" && ch !== ";" && ch !== ",";
		}
		while (pos < cookiesString.length) {
			start = pos;
			cookiesSeparatorFound = false;
			while (skipWhitespace()) {
				ch = cookiesString.charAt(pos);
				if (ch === ",") {
					lastComma = pos;
					pos += 1;
					skipWhitespace();
					nextStart = pos;
					while (pos < cookiesString.length && notSpecialChar()) pos += 1;
					if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
						cookiesSeparatorFound = true;
						pos = nextStart;
						cookiesStrings.push(cookiesString.substring(start, lastComma));
						start = pos;
					} else pos = lastComma + 1;
				} else pos += 1;
			}
			if (!cookiesSeparatorFound || pos >= cookiesString.length) cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
		}
		return cookiesStrings;
	}
	module.exports = parse;
	module.exports.parse = parse;
	module.exports.parseString = parseString;
	module.exports.splitCookiesString = splitCookiesString2;
} })());
var HEADERS_INVALID_CHARACTERS = /[^a-z0-9\-#$%&'*+.^_`|~]/i;
function normalizeHeaderName(name) {
	if (HEADERS_INVALID_CHARACTERS.test(name) || name.trim() === "") throw new TypeError("Invalid character in header field name");
	return name.trim().toLowerCase();
}
var charCodesToRemove = [
	String.fromCharCode(10),
	String.fromCharCode(13),
	String.fromCharCode(9),
	String.fromCharCode(32)
];
var HEADER_VALUE_REMOVE_REGEXP = new RegExp(`(^[${charCodesToRemove.join("")}]|$[${charCodesToRemove.join("")}])`, "g");
function normalizeHeaderValue(value) {
	return value.replace(HEADER_VALUE_REMOVE_REGEXP, "");
}
function isValidHeaderName(value) {
	if (typeof value !== "string") return false;
	if (value.length === 0) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character > 127 || !isToken(character)) return false;
	}
	return true;
}
function isToken(value) {
	return ![
		127,
		32,
		"(",
		")",
		"<",
		">",
		"@",
		",",
		";",
		":",
		"\\",
		"\"",
		"/",
		"[",
		"]",
		"?",
		"=",
		"{",
		"}"
	].includes(value);
}
function isValidHeaderValue(value) {
	if (typeof value !== "string") return false;
	if (value.trim() !== value) return false;
	for (let i = 0; i < value.length; i++) {
		const character = value.charCodeAt(i);
		if (character === 0 || character === 10 || character === 13) return false;
	}
	return true;
}
var NORMALIZED_HEADERS = Symbol("normalizedHeaders");
var RAW_HEADER_NAMES = Symbol("rawHeaderNames");
var HEADER_VALUE_DELIMITER = ", ";
var _a, _b, _c;
var Headers = class _Headers {
	constructor(init) {
		this[_a] = {};
		this[_b] = /* @__PURE__ */ new Map();
		this[_c] = "Headers";
		if (["Headers", "HeadersPolyfill"].includes(init?.constructor.name) || init instanceof _Headers || typeof globalThis.Headers !== "undefined" && init instanceof globalThis.Headers) init.forEach((value, name) => {
			this.append(name, value);
		}, this);
		else if (Array.isArray(init)) init.forEach(([name, value]) => {
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
		else if (init) Object.getOwnPropertyNames(init).forEach((name) => {
			const value = init[name];
			this.append(name, Array.isArray(value) ? value.join(HEADER_VALUE_DELIMITER) : value);
		});
	}
	[(_a = NORMALIZED_HEADERS, _b = RAW_HEADER_NAMES, _c = Symbol.toStringTag, Symbol.iterator)]() {
		return this.entries();
	}
	*keys() {
		for (const [name] of this.entries()) yield name;
	}
	*values() {
		for (const [, value] of this.entries()) yield value;
	}
	*entries() {
		let sortedKeys = Object.keys(this[NORMALIZED_HEADERS]).sort((a, b) => a.localeCompare(b));
		for (const name of sortedKeys) if (name === "set-cookie") for (const value of this.getSetCookie()) yield [name, value];
		else yield [name, this.get(name)];
	}
	/**
	* Returns a boolean stating whether a `Headers` object contains a certain header.
	*/
	has(name) {
		if (!isValidHeaderName(name)) throw new TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS].hasOwnProperty(normalizeHeaderName(name));
	}
	/**
	* Returns a `ByteString` sequence of all the values of a header with a given name.
	*/
	get(name) {
		if (!isValidHeaderName(name)) throw TypeError(`Invalid header name "${name}"`);
		return this[NORMALIZED_HEADERS][normalizeHeaderName(name)] ?? null;
	}
	/**
	* Sets a new value for an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	set(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		this[NORMALIZED_HEADERS][normalizedName] = normalizeHeaderValue(normalizedValue);
		this[RAW_HEADER_NAMES].set(normalizedName, name);
	}
	/**
	* Appends a new value onto an existing header inside a `Headers` object, or adds the header if it does not already exist.
	*/
	append(name, value) {
		if (!isValidHeaderName(name) || !isValidHeaderValue(value)) return;
		const normalizedName = normalizeHeaderName(name);
		const normalizedValue = normalizeHeaderValue(value);
		let resolvedValue = this.has(normalizedName) ? `${this.get(normalizedName)}, ${normalizedValue}` : normalizedValue;
		this.set(name, resolvedValue);
	}
	/**
	* Deletes a header from the `Headers` object.
	*/
	delete(name) {
		if (!isValidHeaderName(name)) return;
		if (!this.has(name)) return;
		const normalizedName = normalizeHeaderName(name);
		delete this[NORMALIZED_HEADERS][normalizedName];
		this[RAW_HEADER_NAMES].delete(normalizedName);
	}
	/**
	* Traverses the `Headers` object,
	* calling the given callback for each header.
	*/
	forEach(callback, thisArg) {
		for (const [name, value] of this.entries()) callback.call(thisArg, value, name, this);
	}
	/**
	* Returns an array containing the values
	* of all Set-Cookie headers associated
	* with a response
	*/
	getSetCookie() {
		const setCookieHeader = this.get("set-cookie");
		if (setCookieHeader === null) return [];
		if (setCookieHeader === "") return [""];
		return (0, import_set_cookie_parser.splitCookiesString)(setCookieHeader);
	}
};
function headersToList(headers) {
	const headersList = [];
	headers.forEach((value, name) => {
		const resolvedValue = value.includes(",") ? value.split(",").map((value2) => value2.trim()) : value;
		headersList.push([name, resolvedValue]);
	});
	return headersList;
}

//#endregion
//#region C:/Users/PC/source/gitrepos/OM-main/node_modules/spacetimedb/dist/server/index.mjs
typeof globalThis !== "undefined" && (globalThis.global = globalThis.global || globalThis, globalThis.window = globalThis.window || globalThis);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
	return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
	return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") {
		for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: () => from[key],
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(__defProp(target, "default", {
	value: mod,
	enumerable: true
}), mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var require_base64_js = __commonJS({ "../../node_modules/.pnpm/base64-js@1.5.1/node_modules/base64-js/index.js"(exports) {
	exports.byteLength = byteLength;
	exports.toByteArray = toByteArray;
	exports.fromByteArray = fromByteArray2;
	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
	var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	for (i = 0, len = code.length; i < len; ++i) {
		lookup[i] = code[i];
		revLookup[code.charCodeAt(i)] = i;
	}
	var i;
	var len;
	revLookup["-".charCodeAt(0)] = 62;
	revLookup["_".charCodeAt(0)] = 63;
	function getLens(b64) {
		var len2 = b64.length;
		if (len2 % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
		var validLen = b64.indexOf("=");
		if (validLen === -1) validLen = len2;
		var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
		return [validLen, placeHoldersLen];
	}
	function byteLength(b64) {
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function _byteLength(b64, validLen, placeHoldersLen) {
		return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
	}
	function toByteArray(b64) {
		var tmp;
		var lens = getLens(b64);
		var validLen = lens[0];
		var placeHoldersLen = lens[1];
		var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
		var curByte = 0;
		var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
		var i2;
		for (i2 = 0; i2 < len2; i2 += 4) {
			tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
			arr[curByte++] = tmp >> 16 & 255;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 2) {
			tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
			arr[curByte++] = tmp & 255;
		}
		if (placeHoldersLen === 1) {
			tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
			arr[curByte++] = tmp >> 8 & 255;
			arr[curByte++] = tmp & 255;
		}
		return arr;
	}
	function tripletToBase64(num) {
		return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
	}
	function encodeChunk(uint8, start, end) {
		var tmp;
		var output = [];
		for (var i2 = start; i2 < end; i2 += 3) {
			tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
			output.push(tripletToBase64(tmp));
		}
		return output.join("");
	}
	function fromByteArray2(uint8) {
		var tmp;
		var len2 = uint8.length;
		var extraBytes = len2 % 3;
		var parts = [];
		var maxChunkLength = 16383;
		for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
		if (extraBytes === 1) {
			tmp = uint8[len2 - 1];
			parts.push(lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "==");
		} else if (extraBytes === 2) {
			tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
			parts.push(lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "=");
		}
		return parts.join("");
	}
} });
var require_codes = __commonJS({ "../../node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/codes.json"(exports, module) {
	module.exports = {
		"100": "Continue",
		"101": "Switching Protocols",
		"102": "Processing",
		"103": "Early Hints",
		"200": "OK",
		"201": "Created",
		"202": "Accepted",
		"203": "Non-Authoritative Information",
		"204": "No Content",
		"205": "Reset Content",
		"206": "Partial Content",
		"207": "Multi-Status",
		"208": "Already Reported",
		"226": "IM Used",
		"300": "Multiple Choices",
		"301": "Moved Permanently",
		"302": "Found",
		"303": "See Other",
		"304": "Not Modified",
		"305": "Use Proxy",
		"307": "Temporary Redirect",
		"308": "Permanent Redirect",
		"400": "Bad Request",
		"401": "Unauthorized",
		"402": "Payment Required",
		"403": "Forbidden",
		"404": "Not Found",
		"405": "Method Not Allowed",
		"406": "Not Acceptable",
		"407": "Proxy Authentication Required",
		"408": "Request Timeout",
		"409": "Conflict",
		"410": "Gone",
		"411": "Length Required",
		"412": "Precondition Failed",
		"413": "Payload Too Large",
		"414": "URI Too Long",
		"415": "Unsupported Media Type",
		"416": "Range Not Satisfiable",
		"417": "Expectation Failed",
		"418": "I'm a Teapot",
		"421": "Misdirected Request",
		"422": "Unprocessable Entity",
		"423": "Locked",
		"424": "Failed Dependency",
		"425": "Too Early",
		"426": "Upgrade Required",
		"428": "Precondition Required",
		"429": "Too Many Requests",
		"431": "Request Header Fields Too Large",
		"451": "Unavailable For Legal Reasons",
		"500": "Internal Server Error",
		"501": "Not Implemented",
		"502": "Bad Gateway",
		"503": "Service Unavailable",
		"504": "Gateway Timeout",
		"505": "HTTP Version Not Supported",
		"506": "Variant Also Negotiates",
		"507": "Insufficient Storage",
		"508": "Loop Detected",
		"509": "Bandwidth Limit Exceeded",
		"510": "Not Extended",
		"511": "Network Authentication Required"
	};
} });
var require_statuses = __commonJS({ "../../node_modules/.pnpm/statuses@2.0.2/node_modules/statuses/index.js"(exports, module) {
	var codes = require_codes();
	module.exports = status2;
	status2.message = codes;
	status2.code = createMessageToStatusCodeMap(codes);
	status2.codes = createStatusCodeList(codes);
	status2.redirect = {
		300: true,
		301: true,
		302: true,
		303: true,
		305: true,
		307: true,
		308: true
	};
	status2.empty = {
		204: true,
		205: true,
		304: true
	};
	status2.retry = {
		502: true,
		503: true,
		504: true
	};
	function createMessageToStatusCodeMap(codes2) {
		var map = {};
		Object.keys(codes2).forEach(function forEachCode(code) {
			var message = codes2[code];
			var status3 = Number(code);
			map[message.toLowerCase()] = status3;
		});
		return map;
	}
	function createStatusCodeList(codes2) {
		return Object.keys(codes2).map(function mapCode(code) {
			return Number(code);
		});
	}
	function getStatusCode(message) {
		var msg = message.toLowerCase();
		if (!Object.prototype.hasOwnProperty.call(status2.code, msg)) throw new Error("invalid status message: \"" + message + "\"");
		return status2.code[msg];
	}
	function getStatusMessage(code) {
		if (!Object.prototype.hasOwnProperty.call(status2.message, code)) throw new Error("invalid status code: " + code);
		return status2.message[code];
	}
	function status2(code) {
		if (typeof code === "number") return getStatusMessage(code);
		if (typeof code !== "string") throw new TypeError("code must be a number or string");
		var n = parseInt(code, 10);
		if (!isNaN(n)) return getStatusMessage(n);
		return getStatusCode(code);
	}
} });
var util_stub_exports = {};
__export(util_stub_exports, { inspect: () => inspect });
var inspect;
var init_util_stub = __esm({ "src/util-stub.ts"() {
	inspect = {};
} });
var require_util_inspect = __commonJS({ "../../node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/util.inspect.js"(exports, module) {
	module.exports = (init_util_stub(), __toCommonJS(util_stub_exports)).inspect;
} });
var require_object_inspect = __commonJS({ "../../node_modules/.pnpm/object-inspect@1.13.4/node_modules/object-inspect/index.js"(exports, module) {
	var hasMap = typeof Map === "function" && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === "function" && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var weakMapHas = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap.prototype.has : null;
	var weakSetHas = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet.prototype.has : null;
	var weakRefDeref = typeof WeakRef === "function" && WeakRef.prototype ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
	var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
		return O.__proto__;
	} : null);
	function addNumericSeparator(num, str) {
		if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) return str;
		var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
		if (typeof num === "number") {
			var int = num < 0 ? -$floor(-num) : $floor(num);
			if (int !== num) {
				var intStr = String(int);
				var dec = $slice.call(str, intStr.length + 1);
				return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
			}
		}
		return $replace.call(str, sepRegex, "$&_");
	}
	var utilInspect = require_util_inspect();
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
	var quotes = {
		__proto__: null,
		"double": "\"",
		single: "'"
	};
	var quoteREs = {
		__proto__: null,
		"double": /(["\\])/g,
		single: /(['\\])/g
	};
	module.exports = function inspect_(obj, options, depth, seen) {
		var opts = options || {};
		if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
		if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
		var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
		if (typeof customInspect !== "boolean" && customInspect !== "symbol") throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
		if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
		if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
		var numericSeparator = opts.numericSeparator;
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		if (typeof obj === "boolean") return obj ? "true" : "false";
		if (typeof obj === "string") return inspectString(obj, opts);
		if (typeof obj === "number") {
			if (obj === 0) return Infinity / obj > 0 ? "0" : "-0";
			var str = String(obj);
			return numericSeparator ? addNumericSeparator(obj, str) : str;
		}
		if (typeof obj === "bigint") {
			var bigIntStr = String(obj) + "n";
			return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
		}
		var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
		if (typeof depth === "undefined") depth = 0;
		if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") return isArray(obj) ? "[Array]" : "[Object]";
		var indent = getIndent(opts, depth);
		if (typeof seen === "undefined") seen = [];
		else if (indexOf(seen, obj) >= 0) return "[Circular]";
		function inspect3(value, from, noIndent) {
			if (from) {
				seen = $arrSlice.call(seen);
				seen.push(from);
			}
			if (noIndent) {
				var newOpts = { depth: opts.depth };
				if (has(opts, "quoteStyle")) newOpts.quoteStyle = opts.quoteStyle;
				return inspect_(value, newOpts, depth + 1, seen);
			}
			return inspect_(value, opts, depth + 1, seen);
		}
		if (typeof obj === "function" && !isRegExp(obj)) {
			var name = nameOf(obj);
			var keys = arrObjKeys(obj, inspect3);
			return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
		}
		if (isSymbol(obj)) {
			var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
			return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
		}
		if (isElement(obj)) {
			var s = "<" + $toLowerCase.call(String(obj.nodeName));
			var attrs = obj.attributes || [];
			for (var i = 0; i < attrs.length; i++) s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
			s += ">";
			if (obj.childNodes && obj.childNodes.length) s += "...";
			s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
			return s;
		}
		if (isArray(obj)) {
			if (obj.length === 0) return "[]";
			var xs = arrObjKeys(obj, inspect3);
			if (indent && !singleLineValues(xs)) return "[" + indentedJoin(xs, indent) + "]";
			return "[ " + $join.call(xs, ", ") + " ]";
		}
		if (isError(obj)) {
			var parts = arrObjKeys(obj, inspect3);
			if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect3(obj.cause), parts), ", ") + " }";
			if (parts.length === 0) return "[" + String(obj) + "]";
			return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
		}
		if (typeof obj === "object" && customInspect) {
			if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) return utilInspect(obj, { depth: maxDepth - depth });
			else if (customInspect !== "symbol" && typeof obj.inspect === "function") return obj.inspect();
		}
		if (isMap(obj)) {
			var mapParts = [];
			if (mapForEach) mapForEach.call(obj, function(value, key) {
				mapParts.push(inspect3(key, obj, true) + " => " + inspect3(value, obj));
			});
			return collectionOf("Map", mapSize.call(obj), mapParts, indent);
		}
		if (isSet(obj)) {
			var setParts = [];
			if (setForEach) setForEach.call(obj, function(value) {
				setParts.push(inspect3(value, obj));
			});
			return collectionOf("Set", setSize.call(obj), setParts, indent);
		}
		if (isWeakMap(obj)) return weakCollectionOf("WeakMap");
		if (isWeakSet(obj)) return weakCollectionOf("WeakSet");
		if (isWeakRef(obj)) return weakCollectionOf("WeakRef");
		if (isNumber(obj)) return markBoxed(inspect3(Number(obj)));
		if (isBigInt(obj)) return markBoxed(inspect3(bigIntValueOf.call(obj)));
		if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
		if (isString(obj)) return markBoxed(inspect3(String(obj)));
		if (typeof window !== "undefined" && obj === window) return "{ [object Window] }";
		if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) return "{ [object globalThis] }";
		if (!isDate(obj) && !isRegExp(obj)) {
			var ys = arrObjKeys(obj, inspect3);
			var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
			var protoTag = obj instanceof Object ? "" : "null prototype";
			var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
			var tag = (isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "") + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
			if (ys.length === 0) return tag + "{}";
			if (indent) return tag + "{" + indentedJoin(ys, indent) + "}";
			return tag + "{ " + $join.call(ys, ", ") + " }";
		}
		return String(obj);
	};
	function wrapQuotes(s, defaultStyle, opts) {
		var quoteChar = quotes[opts.quoteStyle || defaultStyle];
		return quoteChar + s + quoteChar;
	}
	function quote(s) {
		return $replace.call(String(s), /"/g, "&quot;");
	}
	function canTrustToString(obj) {
		return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
	}
	function isArray(obj) {
		return toStr(obj) === "[object Array]" && canTrustToString(obj);
	}
	function isDate(obj) {
		return toStr(obj) === "[object Date]" && canTrustToString(obj);
	}
	function isRegExp(obj) {
		return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
	}
	function isError(obj) {
		return toStr(obj) === "[object Error]" && canTrustToString(obj);
	}
	function isString(obj) {
		return toStr(obj) === "[object String]" && canTrustToString(obj);
	}
	function isNumber(obj) {
		return toStr(obj) === "[object Number]" && canTrustToString(obj);
	}
	function isBoolean(obj) {
		return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
	}
	function isSymbol(obj) {
		if (hasShammedSymbols) return obj && typeof obj === "object" && obj instanceof Symbol;
		if (typeof obj === "symbol") return true;
		if (!obj || typeof obj !== "object" || !symToString) return false;
		try {
			symToString.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	function isBigInt(obj) {
		if (!obj || typeof obj !== "object" || !bigIntValueOf) return false;
		try {
			bigIntValueOf.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	var hasOwn2 = Object.prototype.hasOwnProperty || function(key) {
		return key in this;
	};
	function has(obj, key) {
		return hasOwn2.call(obj, key);
	}
	function toStr(obj) {
		return objectToString.call(obj);
	}
	function nameOf(f) {
		if (f.name) return f.name;
		var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
		if (m) return m[1];
		return null;
	}
	function indexOf(xs, x) {
		if (xs.indexOf) return xs.indexOf(x);
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
	function isMap(x) {
		if (!mapSize || !x || typeof x !== "object") return false;
		try {
			mapSize.call(x);
			try {
				setSize.call(x);
			} catch (s) {
				return true;
			}
			return x instanceof Map;
		} catch (e) {}
		return false;
	}
	function isWeakMap(x) {
		if (!weakMapHas || !x || typeof x !== "object") return false;
		try {
			weakMapHas.call(x, weakMapHas);
			try {
				weakSetHas.call(x, weakSetHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakMap;
		} catch (e) {}
		return false;
	}
	function isWeakRef(x) {
		if (!weakRefDeref || !x || typeof x !== "object") return false;
		try {
			weakRefDeref.call(x);
			return true;
		} catch (e) {}
		return false;
	}
	function isSet(x) {
		if (!setSize || !x || typeof x !== "object") return false;
		try {
			setSize.call(x);
			try {
				mapSize.call(x);
			} catch (m) {
				return true;
			}
			return x instanceof Set;
		} catch (e) {}
		return false;
	}
	function isWeakSet(x) {
		if (!weakSetHas || !x || typeof x !== "object") return false;
		try {
			weakSetHas.call(x, weakSetHas);
			try {
				weakMapHas.call(x, weakMapHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakSet;
		} catch (e) {}
		return false;
	}
	function isElement(x) {
		if (!x || typeof x !== "object") return false;
		if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) return true;
		return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
	}
	function inspectString(str, opts) {
		if (str.length > opts.maxStringLength) {
			var remaining = str.length - opts.maxStringLength;
			var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
			return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
		}
		var quoteRE = quoteREs[opts.quoteStyle || "single"];
		quoteRE.lastIndex = 0;
		return wrapQuotes($replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte), "single", opts);
	}
	function lowbyte(c) {
		var n = c.charCodeAt(0);
		var x = {
			8: "b",
			9: "t",
			10: "n",
			12: "f",
			13: "r"
		}[n];
		if (x) return "\\" + x;
		return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
	}
	function markBoxed(str) {
		return "Object(" + str + ")";
	}
	function weakCollectionOf(type) {
		return type + " { ? }";
	}
	function collectionOf(type, size, entries, indent) {
		var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
		return type + " (" + size + ") {" + joinedEntries + "}";
	}
	function singleLineValues(xs) {
		for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], "\n") >= 0) return false;
		return true;
	}
	function getIndent(opts, depth) {
		var baseIndent;
		if (opts.indent === "	") baseIndent = "	";
		else if (typeof opts.indent === "number" && opts.indent > 0) baseIndent = $join.call(Array(opts.indent + 1), " ");
		else return null;
		return {
			base: baseIndent,
			prev: $join.call(Array(depth + 1), baseIndent)
		};
	}
	function indentedJoin(xs, indent) {
		if (xs.length === 0) return "";
		var lineJoiner = "\n" + indent.prev + indent.base;
		return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
	}
	function arrObjKeys(obj, inspect3) {
		var isArr = isArray(obj);
		var xs = [];
		if (isArr) {
			xs.length = obj.length;
			for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect3(obj[i], obj) : "";
		}
		var syms = typeof gOPS === "function" ? gOPS(obj) : [];
		var symMap;
		if (hasShammedSymbols) {
			symMap = {};
			for (var k = 0; k < syms.length; k++) symMap["$" + syms[k]] = syms[k];
		}
		for (var key in obj) {
			if (!has(obj, key)) continue;
			if (isArr && String(Number(key)) === key && key < obj.length) continue;
			if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) continue;
			else if ($test.call(/[^\w$]/, key)) xs.push(inspect3(key, obj) + ": " + inspect3(obj[key], obj));
			else xs.push(key + ": " + inspect3(obj[key], obj));
		}
		if (typeof gOPS === "function") {
			for (var j = 0; j < syms.length; j++) if (isEnumerable.call(obj, syms[j])) xs.push("[" + inspect3(syms[j]) + "]: " + inspect3(obj[syms[j]], obj));
		}
		return xs;
	}
} });
var TimeDuration = class _TimeDuration {
	__time_duration_micros__;
	static MICROS_PER_MILLIS = 1000n;
	/**
	* Get the algebraic type representation of the {@link TimeDuration} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__time_duration_micros__",
			algebraicType: AlgebraicType.I64
		}] });
	}
	static isTimeDuration(algebraicType) {
		if (algebraicType.tag !== "Product") return false;
		const elements = algebraicType.value.elements;
		if (elements.length !== 1) return false;
		const microsElement = elements[0];
		return microsElement.name === "__time_duration_micros__" && microsElement.algebraicType.tag === "I64";
	}
	get micros() {
		return this.__time_duration_micros__;
	}
	get millis() {
		return Number(this.micros / _TimeDuration.MICROS_PER_MILLIS);
	}
	constructor(micros) {
		this.__time_duration_micros__ = micros;
	}
	static fromMillis(millis) {
		return new _TimeDuration(BigInt(millis) * _TimeDuration.MICROS_PER_MILLIS);
	}
	/** This outputs the same string format that we use in the host and in Rust modules */
	toString() {
		const micros = this.micros;
		const sign = micros < 0 ? "-" : "+";
		const pos = micros < 0 ? -micros : micros;
		const secs = pos / 1000000n;
		const micros_remaining = pos % 1000000n;
		return `${sign}${secs}.${String(micros_remaining).padStart(6, "0")}`;
	}
};
var Timestamp = class _Timestamp {
	__timestamp_micros_since_unix_epoch__;
	static MICROS_PER_MILLIS = 1000n;
	get microsSinceUnixEpoch() {
		return this.__timestamp_micros_since_unix_epoch__;
	}
	constructor(micros) {
		this.__timestamp_micros_since_unix_epoch__ = micros;
	}
	/**
	* Get the algebraic type representation of the {@link Timestamp} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__timestamp_micros_since_unix_epoch__",
			algebraicType: AlgebraicType.I64
		}] });
	}
	static isTimestamp(algebraicType) {
		if (algebraicType.tag !== "Product") return false;
		const elements = algebraicType.value.elements;
		if (elements.length !== 1) return false;
		const microsElement = elements[0];
		return microsElement.name === "__timestamp_micros_since_unix_epoch__" && microsElement.algebraicType.tag === "I64";
	}
	/**
	* The Unix epoch, the midnight at the beginning of January 1, 1970, UTC.
	*/
	static UNIX_EPOCH = new _Timestamp(0n);
	/**
	* Get a `Timestamp` representing the execution environment's belief of the current moment in time.
	*/
	static now() {
		return _Timestamp.fromDate(/* @__PURE__ */ new Date());
	}
	/** Convert to milliseconds since Unix epoch. */
	toMillis() {
		return this.microsSinceUnixEpoch / 1000n;
	}
	/**
	* Get a `Timestamp` representing the same point in time as `date`.
	*/
	static fromDate(date) {
		const millis = date.getTime();
		return new _Timestamp(BigInt(millis) * _Timestamp.MICROS_PER_MILLIS);
	}
	/**
	* Get a `Date` representing approximately the same point in time as `this`.
	*
	* This method truncates to millisecond precision,
	* and throws `RangeError` if the `Timestamp` is outside the range representable as a `Date`.
	*/
	toDate() {
		const millis = this.__timestamp_micros_since_unix_epoch__ / _Timestamp.MICROS_PER_MILLIS;
		if (millis > BigInt(Number.MAX_SAFE_INTEGER) || millis < BigInt(Number.MIN_SAFE_INTEGER)) throw new RangeError("Timestamp is outside of the representable range of JS's Date");
		return new Date(Number(millis));
	}
	/**
	* Get an ISO 8601 / RFC 3339 formatted string representation of this timestamp with microsecond precision.
	*
	* This method preserves the full microsecond precision of the timestamp,
	* and throws `RangeError` if the `Timestamp` is outside the range representable in ISO format.
	*
	* @returns ISO 8601 formatted string with microsecond precision (e.g., '2025-02-17T10:30:45.123456Z')
	*/
	toISOString() {
		const micros = this.__timestamp_micros_since_unix_epoch__;
		const millis = micros / _Timestamp.MICROS_PER_MILLIS;
		if (millis > BigInt(Number.MAX_SAFE_INTEGER) || millis < BigInt(Number.MIN_SAFE_INTEGER)) throw new RangeError("Timestamp is outside of the representable range for ISO string formatting");
		const isoBase = new Date(Number(millis)).toISOString();
		const microsRemainder = Math.abs(Number(micros % 1000000n));
		const fractionalPart = String(microsRemainder).padStart(6, "0");
		return isoBase.replace(/\.\d{3}Z$/, `.${fractionalPart}Z`);
	}
	since(other) {
		return new TimeDuration(this.__timestamp_micros_since_unix_epoch__ - other.__timestamp_micros_since_unix_epoch__);
	}
};
var Uuid = class _Uuid {
	__uuid__;
	/**
	* The nil UUID (all zeros).
	*
	* @example
	* ```ts
	* const uuid = Uuid.NIL;
	* console.assert(
	*   uuid.toString() === "00000000-0000-0000-0000-000000000000"
	* );
	* ```
	*/
	static NIL = new _Uuid(0n);
	static MAX_UUID_BIGINT = 340282366920938463463374607431768211455n;
	/**
	* The max UUID (all ones).
	*
	* @example
	* ```ts
	* const uuid = Uuid.MAX;
	* console.assert(
	*   uuid.toString() === "ffffffff-ffff-ffff-ffff-ffffffffffff"
	* );
	* ```
	*/
	static MAX = new _Uuid(_Uuid.MAX_UUID_BIGINT);
	/**
	* Create a UUID from a raw 128-bit value.
	*
	* @param u - Unsigned 128-bit integer
	* @throws {Error} If the value is outside the valid UUID range
	*/
	constructor(u) {
		if (u < 0n || u > _Uuid.MAX_UUID_BIGINT) throw new Error("Invalid UUID: must be between 0 and `MAX_UUID_BIGINT`");
		this.__uuid__ = u;
	}
	/**
	* Create a UUID `v4` from explicit random bytes.
	*
	* This method assumes the bytes are already sufficiently random.
	* It only sets the appropriate bits for the UUID version and variant.
	*
	* @param bytes - Exactly 16 random bytes
	* @returns A UUID `v4`
	* @throws {Error} If `bytes.length !== 16`
	*
	* @example
	* ```ts
	* const randomBytes = new Uint8Array(16);
	* const uuid = Uuid.fromRandomBytesV4(randomBytes);
	*
	* console.assert(
	*   uuid.toString() === "00000000-0000-4000-8000-000000000000"
	* );
	* ```
	*/
	static fromRandomBytesV4(bytes) {
		if (bytes.length !== 16) throw new Error("UUID v4 requires 16 bytes");
		const arr = new Uint8Array(bytes);
		arr[6] = arr[6] & 15 | 64;
		arr[8] = arr[8] & 63 | 128;
		return new _Uuid(_Uuid.bytesToBigInt(arr));
	}
	/**
	* Generate a UUID `v7` using a monotonic counter from `0` to `2^31 - 1`,
	* a timestamp, and 4 random bytes.
	*
	* The counter wraps around on overflow.
	*
	* The UUID `v7` is structured as follows:
	*
	* ```ascii
	* ┌───────────────────────────────────────────────┬───────────────────┐
	* | B0  | B1  | B2  | B3  | B4  | B5              |         B6        |
	* ├───────────────────────────────────────────────┼───────────────────┤
	* |                 unix_ts_ms                    |      version 7    |
	* └───────────────────────────────────────────────┴───────────────────┘
	* ┌──────────────┬─────────┬──────────────────┬───────────────────────┐
	* | B7           | B8      | B9  | B10 | B11  | B12 | B13 | B14 | B15 |
	* ├──────────────┼─────────┼──────────────────┼───────────────────────┤
	* | counter_high | variant |    counter_low   |        random         |
	* └──────────────┴─────────┴──────────────────┴───────────────────────┘
	* ```
	*
	* @param counter - Mutable monotonic counter (31-bit)
	* @param now - Timestamp since the Unix epoch
	* @param randomBytes - Exactly 4 random bytes
	* @returns A UUID `v7`
	*
	* @throws {Error} If the `counter` is negative
	* @throws {Error} If the `timestamp` is before the Unix epoch
	* @throws {Error} If `randomBytes.length !== 4`
	*
	* @example
	* ```ts
	* const now = Timestamp.fromMillis(1_686_000_000_000n);
	* const counter = { value: 1 };
	* const randomBytes = new Uint8Array(4);
	*
	* const uuid = Uuid.fromCounterV7(counter, now, randomBytes);
	*
	* console.assert(
	*   uuid.toString() === "0000647e-5180-7000-8000-000200000000"
	* );
	* ```
	*/
	static fromCounterV7(counter, now, randomBytes) {
		if (randomBytes.length !== 4) throw new Error("`fromCounterV7` requires `randomBytes.length == 4`");
		if (counter.value < 0) throw new Error("`fromCounterV7` uuid `counter` must be non-negative");
		if (now.__timestamp_micros_since_unix_epoch__ < 0) throw new Error("`fromCounterV7` `timestamp` before unix epoch");
		const counterVal = counter.value;
		counter.value = counterVal + 1 & 2147483647;
		const tsMs = now.toMillis() & 281474976710655n;
		const bytes = new Uint8Array(16);
		bytes[0] = Number(tsMs >> 40n & 255n);
		bytes[1] = Number(tsMs >> 32n & 255n);
		bytes[2] = Number(tsMs >> 24n & 255n);
		bytes[3] = Number(tsMs >> 16n & 255n);
		bytes[4] = Number(tsMs >> 8n & 255n);
		bytes[5] = Number(tsMs & 255n);
		bytes[7] = counterVal >>> 23 & 255;
		bytes[9] = counterVal >>> 15 & 255;
		bytes[10] = counterVal >>> 7 & 255;
		bytes[11] = (counterVal & 127) << 1 & 255;
		bytes[12] |= randomBytes[0] & 127;
		bytes[13] = randomBytes[1];
		bytes[14] = randomBytes[2];
		bytes[15] = randomBytes[3];
		bytes[6] = bytes[6] & 15 | 112;
		bytes[8] = bytes[8] & 63 | 128;
		return new _Uuid(_Uuid.bytesToBigInt(bytes));
	}
	/**
	* Parse a UUID from a string representation.
	*
	* @param s - UUID string
	* @returns Parsed UUID
	* @throws {Error} If the string is not a valid UUID
	*
	* @example
	* ```ts
	* const s = "01888d6e-5c00-7000-8000-000000000000";
	* const uuid = Uuid.parse(s);
	*
	* console.assert(uuid.toString() === s);
	* ```
	*/
	static parse(s) {
		const hex = s.replace(/-/g, "");
		if (hex.length !== 32) throw new Error("Invalid hex UUID");
		let v = 0n;
		for (let i = 0; i < 32; i += 2) v = v << 8n | BigInt(parseInt(hex.slice(i, i + 2), 16));
		return new _Uuid(v);
	}
	/** Convert to string (hyphenated form). */
	toString() {
		const hex = [..._Uuid.bigIntToBytes(this.__uuid__)].map((b) => b.toString(16).padStart(2, "0")).join("");
		return hex.slice(0, 8) + "-" + hex.slice(8, 12) + "-" + hex.slice(12, 16) + "-" + hex.slice(16, 20) + "-" + hex.slice(20);
	}
	/** Convert to bigint (u128). */
	asBigInt() {
		return this.__uuid__;
	}
	/** Return a `Uint8Array` of 16 bytes. */
	toBytes() {
		return _Uuid.bigIntToBytes(this.__uuid__);
	}
	static bytesToBigInt(bytes) {
		let result = 0n;
		for (const b of bytes) result = result << 8n | BigInt(b);
		return result;
	}
	static bigIntToBytes(value) {
		const bytes = new Uint8Array(16);
		for (let i = 15; i >= 0; i--) {
			bytes[i] = Number(value & 255n);
			value >>= 8n;
		}
		return bytes;
	}
	/**
	* Returns the version of this UUID.
	*
	* This represents the algorithm used to generate the value.
	*
	* @returns A `UuidVersion`
	* @throws {Error} If the version field is not recognized
	*/
	getVersion() {
		const version = this.toBytes()[6] >> 4 & 15;
		switch (version) {
			case 4: return "V4";
			case 7: return "V7";
			default:
				if (this == _Uuid.NIL) return "Nil";
				if (this == _Uuid.MAX) return "Max";
				throw new Error(`Unsupported UUID version: ${version}`);
		}
	}
	/**
	* Extract the monotonic counter from a UUIDv7.
	*
	* Intended for testing and diagnostics.
	* Behavior is undefined if called on a non-V7 UUID.
	*
	* @returns 31-bit counter value
	*/
	getCounter() {
		const bytes = this.toBytes();
		const high = bytes[7];
		const mid1 = bytes[9];
		const mid2 = bytes[10];
		const low = bytes[11] >>> 1;
		return high << 23 | mid1 << 15 | mid2 << 7 | low | 0;
	}
	compareTo(other) {
		if (this.__uuid__ < other.__uuid__) return -1;
		if (this.__uuid__ > other.__uuid__) return 1;
		return 0;
	}
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__uuid__",
			algebraicType: AlgebraicType.U128
		}] });
	}
};
var BinaryReader = class {
	/**
	* The DataView used to read values from the binary data.
	*
	* Note: The DataView's `byteOffset` is relative to the beginning of the
	* underlying ArrayBuffer, not the start of the provided Uint8Array input.
	* This `BinaryReader`'s `#offset` field is used to track the current read position
	* relative to the start of the provided Uint8Array input.
	*/
	view;
	/**
	* Represents the offset (in bytes) relative to the start of the DataView
	* and provided Uint8Array input.
	*
	* Note: This is *not* the absolute byte offset within the underlying ArrayBuffer.
	*/
	offset = 0;
	constructor(input) {
		this.view = input instanceof DataView ? input : new DataView(input.buffer, input.byteOffset, input.byteLength);
		this.offset = 0;
	}
	reset(view) {
		this.view = view;
		this.offset = 0;
	}
	get remaining() {
		return this.view.byteLength - this.offset;
	}
	/** Ensure we have at least `n` bytes left to read */
	#ensure(n) {
		if (this.offset + n > this.view.byteLength) throw new RangeError(`Tried to read ${n} byte(s) at relative offset ${this.offset}, but only ${this.remaining} byte(s) remain`);
	}
	readUInt8Array() {
		const length = this.readU32();
		this.#ensure(length);
		return this.readBytes(length);
	}
	readBool() {
		const value = this.view.getUint8(this.offset);
		this.offset += 1;
		return value !== 0;
	}
	readByte() {
		const value = this.view.getUint8(this.offset);
		this.offset += 1;
		return value;
	}
	readBytes(length) {
		const array = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length);
		this.offset += length;
		return array;
	}
	readI8() {
		const value = this.view.getInt8(this.offset);
		this.offset += 1;
		return value;
	}
	readU8() {
		return this.readByte();
	}
	readI16() {
		const value = this.view.getInt16(this.offset, true);
		this.offset += 2;
		return value;
	}
	readU16() {
		const value = this.view.getUint16(this.offset, true);
		this.offset += 2;
		return value;
	}
	readI32() {
		const value = this.view.getInt32(this.offset, true);
		this.offset += 4;
		return value;
	}
	readU32() {
		const value = this.view.getUint32(this.offset, true);
		this.offset += 4;
		return value;
	}
	readI64() {
		const value = this.view.getBigInt64(this.offset, true);
		this.offset += 8;
		return value;
	}
	readU64() {
		const value = this.view.getBigUint64(this.offset, true);
		this.offset += 8;
		return value;
	}
	readU128() {
		const lowerPart = this.view.getBigUint64(this.offset, true);
		const upperPart = this.view.getBigUint64(this.offset + 8, true);
		this.offset += 16;
		return (upperPart << BigInt(64)) + lowerPart;
	}
	readI128() {
		const lowerPart = this.view.getBigUint64(this.offset, true);
		const upperPart = this.view.getBigInt64(this.offset + 8, true);
		this.offset += 16;
		return (upperPart << BigInt(64)) + lowerPart;
	}
	readU256() {
		const p0 = this.view.getBigUint64(this.offset, true);
		const p1 = this.view.getBigUint64(this.offset + 8, true);
		const p2 = this.view.getBigUint64(this.offset + 16, true);
		const p3 = this.view.getBigUint64(this.offset + 24, true);
		this.offset += 32;
		return (p3 << BigInt(192)) + (p2 << BigInt(128)) + (p1 << BigInt(64)) + p0;
	}
	readI256() {
		const p0 = this.view.getBigUint64(this.offset, true);
		const p1 = this.view.getBigUint64(this.offset + 8, true);
		const p2 = this.view.getBigUint64(this.offset + 16, true);
		const p3 = this.view.getBigInt64(this.offset + 24, true);
		this.offset += 32;
		return (p3 << BigInt(192)) + (p2 << BigInt(128)) + (p1 << BigInt(64)) + p0;
	}
	readF32() {
		const value = this.view.getFloat32(this.offset, true);
		this.offset += 4;
		return value;
	}
	readF64() {
		const value = this.view.getFloat64(this.offset, true);
		this.offset += 8;
		return value;
	}
	readString() {
		const uint8Array = this.readUInt8Array();
		return new TextDecoder("utf-8").decode(uint8Array);
	}
};
var import_base64_js = __toESM(require_base64_js());
var ArrayBufferPrototypeTransfer = ArrayBuffer.prototype.transfer ?? function(newByteLength) {
	if (newByteLength === void 0) return this.slice();
	else if (newByteLength <= this.byteLength) return this.slice(0, newByteLength);
	else {
		const copy = new Uint8Array(newByteLength);
		copy.set(new Uint8Array(this));
		return copy.buffer;
	}
};
var ResizableBuffer = class {
	buffer;
	view;
	constructor(init) {
		this.buffer = typeof init === "number" ? new ArrayBuffer(init) : init;
		this.view = new DataView(this.buffer);
	}
	get capacity() {
		return this.buffer.byteLength;
	}
	grow(newSize) {
		if (newSize <= this.buffer.byteLength) return;
		this.buffer = ArrayBufferPrototypeTransfer.call(this.buffer, newSize);
		this.view = new DataView(this.buffer);
	}
};
var BinaryWriter = class {
	buffer;
	offset = 0;
	constructor(init) {
		this.buffer = typeof init === "number" ? new ResizableBuffer(init) : init;
	}
	clear() {
		this.offset = 0;
	}
	reset(buffer) {
		this.buffer = buffer;
		this.offset = 0;
	}
	expandBuffer(additionalCapacity) {
		const minCapacity = this.offset + additionalCapacity + 1;
		if (minCapacity <= this.buffer.capacity) return;
		let newCapacity = this.buffer.capacity * 2;
		if (newCapacity < minCapacity) newCapacity = minCapacity;
		this.buffer.grow(newCapacity);
	}
	toBase64() {
		return (0, import_base64_js.fromByteArray)(this.getBuffer());
	}
	getBuffer() {
		return new Uint8Array(this.buffer.buffer, 0, this.offset);
	}
	get view() {
		return this.buffer.view;
	}
	writeUInt8Array(value) {
		const length = value.length;
		this.expandBuffer(4 + length);
		this.writeU32(length);
		new Uint8Array(this.buffer.buffer, this.offset).set(value);
		this.offset += length;
	}
	writeBool(value) {
		this.expandBuffer(1);
		this.view.setUint8(this.offset, value ? 1 : 0);
		this.offset += 1;
	}
	writeByte(value) {
		this.expandBuffer(1);
		this.view.setUint8(this.offset, value);
		this.offset += 1;
	}
	writeI8(value) {
		this.expandBuffer(1);
		this.view.setInt8(this.offset, value);
		this.offset += 1;
	}
	writeU8(value) {
		this.expandBuffer(1);
		this.view.setUint8(this.offset, value);
		this.offset += 1;
	}
	writeI16(value) {
		this.expandBuffer(2);
		this.view.setInt16(this.offset, value, true);
		this.offset += 2;
	}
	writeU16(value) {
		this.expandBuffer(2);
		this.view.setUint16(this.offset, value, true);
		this.offset += 2;
	}
	writeI32(value) {
		this.expandBuffer(4);
		this.view.setInt32(this.offset, value, true);
		this.offset += 4;
	}
	writeU32(value) {
		this.expandBuffer(4);
		this.view.setUint32(this.offset, value, true);
		this.offset += 4;
	}
	writeI64(value) {
		this.expandBuffer(8);
		this.view.setBigInt64(this.offset, value, true);
		this.offset += 8;
	}
	writeU64(value) {
		this.expandBuffer(8);
		this.view.setBigUint64(this.offset, value, true);
		this.offset += 8;
	}
	writeU128(value) {
		this.expandBuffer(16);
		const lowerPart = value & BigInt("0xFFFFFFFFFFFFFFFF");
		const upperPart = value >> BigInt(64);
		this.view.setBigUint64(this.offset, lowerPart, true);
		this.view.setBigUint64(this.offset + 8, upperPart, true);
		this.offset += 16;
	}
	writeI128(value) {
		this.expandBuffer(16);
		const lowerPart = value & BigInt("0xFFFFFFFFFFFFFFFF");
		const upperPart = value >> BigInt(64);
		this.view.setBigInt64(this.offset, lowerPart, true);
		this.view.setBigInt64(this.offset + 8, upperPart, true);
		this.offset += 16;
	}
	writeU256(value) {
		this.expandBuffer(32);
		const low_64_mask = BigInt("0xFFFFFFFFFFFFFFFF");
		const p0 = value & low_64_mask;
		const p1 = value >> BigInt(64) & low_64_mask;
		const p2 = value >> BigInt(128) & low_64_mask;
		const p3 = value >> BigInt(192);
		this.view.setBigUint64(this.offset + 0, p0, true);
		this.view.setBigUint64(this.offset + 8, p1, true);
		this.view.setBigUint64(this.offset + 16, p2, true);
		this.view.setBigUint64(this.offset + 24, p3, true);
		this.offset += 32;
	}
	writeI256(value) {
		this.expandBuffer(32);
		const low_64_mask = BigInt("0xFFFFFFFFFFFFFFFF");
		const p0 = value & low_64_mask;
		const p1 = value >> BigInt(64) & low_64_mask;
		const p2 = value >> BigInt(128) & low_64_mask;
		const p3 = value >> BigInt(192);
		this.view.setBigUint64(this.offset + 0, p0, true);
		this.view.setBigUint64(this.offset + 8, p1, true);
		this.view.setBigUint64(this.offset + 16, p2, true);
		this.view.setBigInt64(this.offset + 24, p3, true);
		this.offset += 32;
	}
	writeF32(value) {
		this.expandBuffer(4);
		this.view.setFloat32(this.offset, value, true);
		this.offset += 4;
	}
	writeF64(value) {
		this.expandBuffer(8);
		this.view.setFloat64(this.offset, value, true);
		this.offset += 8;
	}
	writeString(value) {
		const encodedString = new TextEncoder().encode(value);
		this.writeUInt8Array(encodedString);
	}
};
function uint8ArrayToHexString(array) {
	return Array.prototype.map.call(array.reverse(), (x) => ("00" + x.toString(16)).slice(-2)).join("");
}
function uint8ArrayToU128(array) {
	if (array.length != 16) throw new Error(`Uint8Array is not 16 bytes long: ${array}`);
	return new BinaryReader(array).readU128();
}
function uint8ArrayToU256(array) {
	if (array.length != 32) throw new Error(`Uint8Array is not 32 bytes long: [${array}]`);
	return new BinaryReader(array).readU256();
}
function hexStringToUint8Array(str) {
	if (str.startsWith("0x")) str = str.slice(2);
	const matches = str.match(/.{1,2}/g) || [];
	return Uint8Array.from(matches.map((byte) => parseInt(byte, 16))).reverse();
}
function hexStringToU128(str) {
	return uint8ArrayToU128(hexStringToUint8Array(str));
}
function hexStringToU256(str) {
	return uint8ArrayToU256(hexStringToUint8Array(str));
}
function u128ToUint8Array(data) {
	const writer = new BinaryWriter(16);
	writer.writeU128(data);
	return writer.getBuffer();
}
function u128ToHexString(data) {
	return uint8ArrayToHexString(u128ToUint8Array(data));
}
function u256ToUint8Array(data) {
	const writer = new BinaryWriter(32);
	writer.writeU256(data);
	return writer.getBuffer();
}
function u256ToHexString(data) {
	return uint8ArrayToHexString(u256ToUint8Array(data));
}
function toPascalCase(s) {
	const str = toCamelCase(s);
	return str.charAt(0).toUpperCase() + str.slice(1);
}
function toCamelCase(s) {
	const str = s.replace(/[-_]+/g, "_").replace(/_([a-zA-Z0-9])/g, (_, c) => c.toUpperCase());
	return str.charAt(0).toLowerCase() + str.slice(1);
}
function bsatnBaseSize(typespace, ty) {
	const assumedArrayLength = 4;
	while (ty.tag === "Ref") ty = typespace.types[ty.value];
	if (ty.tag === "Product") {
		let sum = 0;
		for (const { algebraicType: elem } of ty.value.elements) sum += bsatnBaseSize(typespace, elem);
		return sum;
	} else if (ty.tag === "Sum") {
		let min = Infinity;
		for (const { algebraicType: vari } of ty.value.variants) {
			const vSize = bsatnBaseSize(typespace, vari);
			if (vSize < min) min = vSize;
		}
		if (min === Infinity) min = 0;
		return 4 + min;
	} else if (ty.tag == "Array") return 4 + assumedArrayLength * bsatnBaseSize(typespace, ty.value);
	return {
		String: 4 + assumedArrayLength,
		Sum: 1,
		Bool: 1,
		I8: 1,
		U8: 1,
		I16: 2,
		U16: 2,
		I32: 4,
		U32: 4,
		F32: 4,
		I64: 8,
		U64: 8,
		F64: 8,
		I128: 16,
		U128: 16,
		I256: 32,
		U256: 32
	}[ty.tag];
}
var hasOwn = Object.hasOwn;
var ConnectionId = class _ConnectionId {
	__connection_id__;
	/**
	* Creates a new `ConnectionId`.
	*/
	constructor(data) {
		this.__connection_id__ = data;
	}
	/**
	* Get the algebraic type representation of the {@link ConnectionId} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__connection_id__",
			algebraicType: AlgebraicType.U128
		}] });
	}
	isZero() {
		return this.__connection_id__ === BigInt(0);
	}
	static nullIfZero(addr) {
		if (addr.isZero()) return null;
		else return addr;
	}
	static random() {
		function randomU8() {
			return Math.floor(Math.random() * 255);
		}
		let result = BigInt(0);
		for (let i = 0; i < 16; i++) result = result << BigInt(8) | BigInt(randomU8());
		return new _ConnectionId(result);
	}
	/**
	* Compare two connection IDs for equality.
	*/
	isEqual(other) {
		return this.__connection_id__ == other.__connection_id__;
	}
	/**
	* Check if two connection IDs are equal.
	*/
	equals(other) {
		return this.isEqual(other);
	}
	/**
	* Print the connection ID as a hexadecimal string.
	*/
	toHexString() {
		return u128ToHexString(this.__connection_id__);
	}
	/**
	* Convert the connection ID to a Uint8Array.
	*/
	toUint8Array() {
		return u128ToUint8Array(this.__connection_id__);
	}
	/**
	* Parse a connection ID from a hexadecimal string.
	*/
	static fromString(str) {
		return new _ConnectionId(hexStringToU128(str));
	}
	static fromStringOrNull(str) {
		const addr = _ConnectionId.fromString(str);
		if (addr.isZero()) return null;
		else return addr;
	}
};
var Identity = class _Identity {
	__identity__;
	/**
	* Creates a new `Identity`.
	*
	* `data` can be a hexadecimal string or a `bigint`.
	*/
	constructor(data) {
		this.__identity__ = typeof data === "string" ? hexStringToU256(data) : data;
	}
	/**
	* Get the algebraic type representation of the {@link Identity} type.
	* @returns The algebraic type representation of the type.
	*/
	static getAlgebraicType() {
		return AlgebraicType.Product({ elements: [{
			name: "__identity__",
			algebraicType: AlgebraicType.U256
		}] });
	}
	/**
	* Check if two identities are equal.
	*/
	isEqual(other) {
		return this.toHexString() === other.toHexString();
	}
	/**
	* Check if two identities are equal.
	*/
	equals(other) {
		return this.isEqual(other);
	}
	/**
	* Print the identity as a hexadecimal string.
	*/
	toHexString() {
		return u256ToHexString(this.__identity__);
	}
	/**
	* Convert the address to a Uint8Array.
	*/
	toUint8Array() {
		return u256ToUint8Array(this.__identity__);
	}
	/**
	* Parse an Identity from a hexadecimal string.
	*/
	static fromString(str) {
		return new _Identity(str);
	}
	/**
	* Zero identity (0x0000000000000000000000000000000000000000000000000000000000000000)
	*/
	static zero() {
		return new _Identity(0n);
	}
	toString() {
		return this.toHexString();
	}
};
var SERIALIZERS = /* @__PURE__ */ new Map();
var DESERIALIZERS = /* @__PURE__ */ new Map();
var AlgebraicType = {
	Ref: (value) => ({
		tag: "Ref",
		value
	}),
	Sum: (value) => ({
		tag: "Sum",
		value
	}),
	Product: (value) => ({
		tag: "Product",
		value
	}),
	Array: (value) => ({
		tag: "Array",
		value
	}),
	String: { tag: "String" },
	Bool: { tag: "Bool" },
	I8: { tag: "I8" },
	U8: { tag: "U8" },
	I16: { tag: "I16" },
	U16: { tag: "U16" },
	I32: { tag: "I32" },
	U32: { tag: "U32" },
	I64: { tag: "I64" },
	U64: { tag: "U64" },
	I128: { tag: "I128" },
	U128: { tag: "U128" },
	I256: { tag: "I256" },
	U256: { tag: "U256" },
	F32: { tag: "F32" },
	F64: { tag: "F64" },
	makeSerializer(ty, typespace) {
		if (ty.tag === "Ref") {
			if (!typespace) throw new Error("cannot serialize refs without a typespace");
			while (ty.tag === "Ref") ty = typespace.types[ty.value];
		}
		switch (ty.tag) {
			case "Product": return ProductType.makeSerializer(ty.value, typespace);
			case "Sum": return SumType.makeSerializer(ty.value, typespace);
			case "Array": if (ty.value.tag === "U8") return serializeUint8Array;
			else {
				const serialize = AlgebraicType.makeSerializer(ty.value, typespace);
				return (writer, value) => {
					writer.writeU32(value.length);
					for (const elem of value) serialize(writer, elem);
				};
			}
			default: return primitiveSerializers[ty.tag];
		}
	},
	serializeValue(writer, ty, value, typespace) {
		AlgebraicType.makeSerializer(ty, typespace)(writer, value);
	},
	makeDeserializer(ty, typespace) {
		if (ty.tag === "Ref") {
			if (!typespace) throw new Error("cannot deserialize refs without a typespace");
			while (ty.tag === "Ref") ty = typespace.types[ty.value];
		}
		switch (ty.tag) {
			case "Product": return ProductType.makeDeserializer(ty.value, typespace);
			case "Sum": return SumType.makeDeserializer(ty.value, typespace);
			case "Array": if (ty.value.tag === "U8") return deserializeUint8Array;
			else {
				const deserialize = AlgebraicType.makeDeserializer(ty.value, typespace);
				return (reader) => {
					const length = reader.readU32();
					const result = Array(length);
					for (let i = 0; i < length; i++) result[i] = deserialize(reader);
					return result;
				};
			}
			default: return primitiveDeserializers[ty.tag];
		}
	},
	deserializeValue(reader, ty, typespace) {
		return AlgebraicType.makeDeserializer(ty, typespace)(reader);
	},
	intoMapKey: function(ty, value) {
		switch (ty.tag) {
			case "U8":
			case "U16":
			case "U32":
			case "U64":
			case "U128":
			case "U256":
			case "I8":
			case "I16":
			case "I32":
			case "I64":
			case "I128":
			case "I256":
			case "F32":
			case "F64":
			case "String":
			case "Bool": return value;
			case "Product": return ProductType.intoMapKey(ty.value, value);
			default: {
				const writer = new BinaryWriter(10);
				AlgebraicType.serializeValue(writer, ty, value);
				return writer.toBase64();
			}
		}
	}
};
function bindCall(f) {
	return Function.prototype.call.bind(f);
}
var primitiveSerializers = {
	Bool: bindCall(BinaryWriter.prototype.writeBool),
	I8: bindCall(BinaryWriter.prototype.writeI8),
	U8: bindCall(BinaryWriter.prototype.writeU8),
	I16: bindCall(BinaryWriter.prototype.writeI16),
	U16: bindCall(BinaryWriter.prototype.writeU16),
	I32: bindCall(BinaryWriter.prototype.writeI32),
	U32: bindCall(BinaryWriter.prototype.writeU32),
	I64: bindCall(BinaryWriter.prototype.writeI64),
	U64: bindCall(BinaryWriter.prototype.writeU64),
	I128: bindCall(BinaryWriter.prototype.writeI128),
	U128: bindCall(BinaryWriter.prototype.writeU128),
	I256: bindCall(BinaryWriter.prototype.writeI256),
	U256: bindCall(BinaryWriter.prototype.writeU256),
	F32: bindCall(BinaryWriter.prototype.writeF32),
	F64: bindCall(BinaryWriter.prototype.writeF64),
	String: bindCall(BinaryWriter.prototype.writeString)
};
Object.freeze(primitiveSerializers);
var serializeUint8Array = bindCall(BinaryWriter.prototype.writeUInt8Array);
var primitiveDeserializers = {
	Bool: bindCall(BinaryReader.prototype.readBool),
	I8: bindCall(BinaryReader.prototype.readI8),
	U8: bindCall(BinaryReader.prototype.readU8),
	I16: bindCall(BinaryReader.prototype.readI16),
	U16: bindCall(BinaryReader.prototype.readU16),
	I32: bindCall(BinaryReader.prototype.readI32),
	U32: bindCall(BinaryReader.prototype.readU32),
	I64: bindCall(BinaryReader.prototype.readI64),
	U64: bindCall(BinaryReader.prototype.readU64),
	I128: bindCall(BinaryReader.prototype.readI128),
	U128: bindCall(BinaryReader.prototype.readU128),
	I256: bindCall(BinaryReader.prototype.readI256),
	U256: bindCall(BinaryReader.prototype.readU256),
	F32: bindCall(BinaryReader.prototype.readF32),
	F64: bindCall(BinaryReader.prototype.readF64),
	String: bindCall(BinaryReader.prototype.readString)
};
Object.freeze(primitiveDeserializers);
var deserializeUint8Array = bindCall(BinaryReader.prototype.readUInt8Array);
var primitiveSizes = {
	Bool: 1,
	I8: 1,
	U8: 1,
	I16: 2,
	U16: 2,
	I32: 4,
	U32: 4,
	I64: 8,
	U64: 8,
	I128: 16,
	U128: 16,
	I256: 32,
	U256: 32,
	F32: 4,
	F64: 8
};
var fixedSizePrimitives = new Set(Object.keys(primitiveSizes));
var isFixedSizeProduct = (ty) => ty.elements.every(({ algebraicType }) => fixedSizePrimitives.has(algebraicType.tag));
var productSize = (ty) => ty.elements.reduce((acc, { algebraicType }) => acc + primitiveSizes[algebraicType.tag], 0);
var primitiveJSName = {
	Bool: "Uint8",
	I8: "Int8",
	U8: "Uint8",
	I16: "Int16",
	U16: "Uint16",
	I32: "Int32",
	U32: "Uint32",
	I64: "BigInt64",
	U64: "BigUint64",
	F32: "Float32",
	F64: "Float64"
};
var specialProductDeserializers = {
	__time_duration_micros__: (reader) => new TimeDuration(reader.readI64()),
	__timestamp_micros_since_unix_epoch__: (reader) => new Timestamp(reader.readI64()),
	__identity__: (reader) => new Identity(reader.readU256()),
	__connection_id__: (reader) => new ConnectionId(reader.readU128()),
	__uuid__: (reader) => new Uuid(reader.readU128())
};
Object.freeze(specialProductDeserializers);
var unitDeserializer = () => ({});
var getElementInitializer = (element) => {
	let init;
	switch (element.algebraicType.tag) {
		case "String":
			init = "''";
			break;
		case "Bool":
			init = "false";
			break;
		case "I8":
		case "U8":
		case "I16":
		case "U16":
		case "I32":
		case "U32":
			init = "0";
			break;
		case "I64":
		case "U64":
		case "I128":
		case "U128":
		case "I256":
		case "U256":
			init = "0n";
			break;
		case "F32":
		case "F64":
			init = "0.0";
			break;
		default: init = "undefined";
	}
	return `${element.name}: ${init}`;
};
var ProductType = {
	makeSerializer(ty, typespace) {
		let serializer = SERIALIZERS.get(ty);
		if (serializer != null) return serializer;
		if (isFixedSizeProduct(ty)) {
			const body2 = `"use strict";
writer.expandBuffer(${productSize(ty)});
const view = writer.view;
${ty.elements.map(({ name, algebraicType: { tag } }) => tag in primitiveJSName ? `view.set${primitiveJSName[tag]}(writer.offset, value.${name}, ${primitiveSizes[tag] > 1 ? "true" : ""});
writer.offset += ${primitiveSizes[tag]};` : `writer.write${tag}(value.${name});`).join("\n")}`;
			serializer = Function("writer", "value", body2);
			SERIALIZERS.set(ty, serializer);
			return serializer;
		}
		const serializers = {};
		const body = "\"use strict\";\n" + ty.elements.map((element) => `this.${element.name}(writer, value.${element.name});`).join("\n");
		serializer = Function("writer", "value", body).bind(serializers);
		SERIALIZERS.set(ty, serializer);
		for (const { name, algebraicType } of ty.elements) serializers[name] = AlgebraicType.makeSerializer(algebraicType, typespace);
		Object.freeze(serializers);
		return serializer;
	},
	serializeValue(writer, ty, value, typespace) {
		ProductType.makeSerializer(ty, typespace)(writer, value);
	},
	makeDeserializer(ty, typespace) {
		switch (ty.elements.length) {
			case 0: return unitDeserializer;
			case 1: {
				const fieldName = ty.elements[0].name;
				if (hasOwn(specialProductDeserializers, fieldName)) return specialProductDeserializers[fieldName];
			}
		}
		let deserializer = DESERIALIZERS.get(ty);
		if (deserializer != null) return deserializer;
		if (isFixedSizeProduct(ty)) {
			const body = `"use strict";
const result = { ${ty.elements.map(getElementInitializer).join(", ")} };
const view = reader.view;
${ty.elements.map(({ name, algebraicType: { tag } }) => tag in primitiveJSName ? `result.${name} = view.get${primitiveJSName[tag]}(reader.offset, ${primitiveSizes[tag] > 1 ? "true" : ""});
reader.offset += ${primitiveSizes[tag]};` : `result.${name} = reader.read${tag}();`).join("\n")}
return result;`;
			deserializer = Function("reader", body);
			DESERIALIZERS.set(ty, deserializer);
			return deserializer;
		}
		const deserializers = {};
		deserializer = Function("reader", `"use strict";
const result = { ${ty.elements.map(getElementInitializer).join(", ")} };
${ty.elements.map(({ name }) => `result.${name} = this.${name}(reader);`).join("\n")}
return result;`).bind(deserializers);
		DESERIALIZERS.set(ty, deserializer);
		for (const { name, algebraicType } of ty.elements) deserializers[name] = AlgebraicType.makeDeserializer(algebraicType, typespace);
		Object.freeze(deserializers);
		return deserializer;
	},
	deserializeValue(reader, ty, typespace) {
		return ProductType.makeDeserializer(ty, typespace)(reader);
	},
	intoMapKey(ty, value) {
		if (ty.elements.length === 1) {
			const fieldName = ty.elements[0].name;
			if (hasOwn(specialProductDeserializers, fieldName)) return value[fieldName];
		}
		const writer = new BinaryWriter(10);
		AlgebraicType.serializeValue(writer, AlgebraicType.Product(ty), value);
		return writer.toBase64();
	}
};
var SumType = {
	makeSerializer(ty, typespace) {
		if (ty.variants.length == 2 && ty.variants[0].name === "some" && ty.variants[1].name === "none") {
			const serialize = AlgebraicType.makeSerializer(ty.variants[0].algebraicType, typespace);
			return (writer, value) => {
				if (value !== null && value !== void 0) {
					writer.writeByte(0);
					serialize(writer, value);
				} else writer.writeByte(1);
			};
		} else if (ty.variants.length == 2 && ty.variants[0].name === "ok" && ty.variants[1].name === "err") {
			const serializeOk = AlgebraicType.makeSerializer(ty.variants[0].algebraicType, typespace);
			const serializeErr = AlgebraicType.makeSerializer(ty.variants[0].algebraicType, typespace);
			return (writer, value) => {
				if ("ok" in value) {
					writer.writeU8(0);
					serializeOk(writer, value.ok);
				} else if ("err" in value) {
					writer.writeU8(1);
					serializeErr(writer, value.err);
				} else throw new TypeError("could not serialize result: object had neither a `ok` nor an `err` field");
			};
		} else {
			let serializer = SERIALIZERS.get(ty);
			if (serializer != null) return serializer;
			const serializers = {};
			const body = `switch (value.tag) {
${ty.variants.map(({ name }, i) => `  case ${JSON.stringify(name)}:
    writer.writeByte(${i});
    return this.${name}(writer, value.value);`).join("\n")}
  default:
    throw new TypeError(
      \`Could not serialize sum type; unknown tag \${value.tag}\`
    )
}
`;
			serializer = Function("writer", "value", body).bind(serializers);
			SERIALIZERS.set(ty, serializer);
			for (const { name, algebraicType } of ty.variants) serializers[name] = AlgebraicType.makeSerializer(algebraicType, typespace);
			Object.freeze(serializers);
			return serializer;
		}
	},
	serializeValue(writer, ty, value, typespace) {
		SumType.makeSerializer(ty, typespace)(writer, value);
	},
	makeDeserializer(ty, typespace) {
		if (ty.variants.length == 2 && ty.variants[0].name === "some" && ty.variants[1].name === "none") {
			const deserialize = AlgebraicType.makeDeserializer(ty.variants[0].algebraicType, typespace);
			return (reader) => {
				const tag = reader.readU8();
				if (tag === 0) return deserialize(reader);
				else if (tag === 1) return;
				else throw `Can't deserialize an option type, couldn't find ${tag} tag`;
			};
		} else if (ty.variants.length == 2 && ty.variants[0].name === "ok" && ty.variants[1].name === "err") {
			const deserializeOk = AlgebraicType.makeDeserializer(ty.variants[0].algebraicType, typespace);
			const deserializeErr = AlgebraicType.makeDeserializer(ty.variants[1].algebraicType, typespace);
			return (reader) => {
				const tag = reader.readByte();
				if (tag === 0) return { ok: deserializeOk(reader) };
				else if (tag === 1) return { err: deserializeErr(reader) };
				else throw `Can't deserialize a result type, couldn't find ${tag} tag`;
			};
		} else {
			let deserializer = DESERIALIZERS.get(ty);
			if (deserializer != null) return deserializer;
			const deserializers = {};
			deserializer = Function("reader", `switch (reader.readU8()) {
${ty.variants.map(({ name }, i) => `case ${i}: return { tag: ${JSON.stringify(name)}, value: this.${name}(reader) };`).join("\n")} }`).bind(deserializers);
			DESERIALIZERS.set(ty, deserializer);
			for (const { name, algebraicType } of ty.variants) deserializers[name] = AlgebraicType.makeDeserializer(algebraicType, typespace);
			Object.freeze(deserializers);
			return deserializer;
		}
	},
	deserializeValue(reader, ty, typespace) {
		return SumType.makeDeserializer(ty, typespace)(reader);
	}
};
var Option = { getAlgebraicType(innerType) {
	return AlgebraicType.Sum({ variants: [{
		name: "some",
		algebraicType: innerType
	}, {
		name: "none",
		algebraicType: AlgebraicType.Product({ elements: [] })
	}] });
} };
var Result = { getAlgebraicType(okType, errType) {
	return AlgebraicType.Sum({ variants: [{
		name: "ok",
		algebraicType: okType
	}, {
		name: "err",
		algebraicType: errType
	}] });
} };
var ScheduleAt = {
	interval(value) {
		return Interval(value);
	},
	time(value) {
		return Time(value);
	},
	getAlgebraicType() {
		return AlgebraicType.Sum({ variants: [{
			name: "Interval",
			algebraicType: TimeDuration.getAlgebraicType()
		}, {
			name: "Time",
			algebraicType: Timestamp.getAlgebraicType()
		}] });
	},
	isScheduleAt(algebraicType) {
		if (algebraicType.tag !== "Sum") return false;
		const variants = algebraicType.value.variants;
		if (variants.length !== 2) return false;
		const intervalVariant = variants.find((v) => v.name === "Interval");
		const timeVariant = variants.find((v) => v.name === "Time");
		if (!intervalVariant || !timeVariant) return false;
		return TimeDuration.isTimeDuration(intervalVariant.algebraicType) && Timestamp.isTimestamp(timeVariant.algebraicType);
	}
};
var Interval = (micros) => ({
	tag: "Interval",
	value: new TimeDuration(micros)
});
var Time = (microsSinceUnixEpoch) => ({
	tag: "Time",
	value: new Timestamp(microsSinceUnixEpoch)
});
var schedule_at_default = ScheduleAt;
function set(x, t2) {
	return {
		...x,
		...t2
	};
}
var TypeBuilder = class {
	/**
	* The TypeScript phantom type. This is not stored at runtime,
	* but is visible to the compiler
	*/
	type;
	/**
	* The SpacetimeDB algebraic type (run‑time value). In addition to storing
	* the runtime representation of the `AlgebraicType`, it also captures
	* the TypeScript type information of the `AlgebraicType`. That is to say
	* the value is not merely an `AlgebraicType`, but is constructed to be
	* the corresponding concrete `AlgebraicType` for the TypeScript type `Type`.
	*
	* e.g. `string` corresponds to `AlgebraicType.String`
	*/
	algebraicType;
	constructor(algebraicType) {
		this.algebraicType = algebraicType;
	}
	optional() {
		return new OptionBuilder(this);
	}
	serialize(writer, value) {
		(this.serialize = AlgebraicType.makeSerializer(this.algebraicType))(writer, value);
	}
	deserialize(reader) {
		return (this.deserialize = AlgebraicType.makeDeserializer(this.algebraicType))(reader);
	}
};
var U8Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U8);
	}
	index(algorithm = "btree") {
		return new U8ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U8ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U8ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U8ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U8ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U8ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U16Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U16);
	}
	index(algorithm = "btree") {
		return new U16ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U16ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U16ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U16ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U16ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U16ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U32Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U32);
	}
	index(algorithm = "btree") {
		return new U32ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U32ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U32ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U32ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U32ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U32ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U64Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U64);
	}
	index(algorithm = "btree") {
		return new U64ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U64ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U64ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U64ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U64ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U64ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U128Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U128);
	}
	index(algorithm = "btree") {
		return new U128ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U128ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U128ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U128ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U128ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U128ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var U256Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.U256);
	}
	index(algorithm = "btree") {
		return new U256ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new U256ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new U256ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new U256ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new U256ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new U256ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I8Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I8);
	}
	index(algorithm = "btree") {
		return new I8ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I8ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I8ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I8ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I8ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I8ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I16Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I16);
	}
	index(algorithm = "btree") {
		return new I16ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I16ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I16ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I16ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I16ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I16ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I32Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I32);
	}
	index(algorithm = "btree") {
		return new I32ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I32ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I32ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I32ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I32ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I32ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I64Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I64);
	}
	index(algorithm = "btree") {
		return new I64ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I64ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I64ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I64ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I64ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I64ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I128Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I128);
	}
	index(algorithm = "btree") {
		return new I128ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I128ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I128ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I128ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I128ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I128ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var I256Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.I256);
	}
	index(algorithm = "btree") {
		return new I256ColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new I256ColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new I256ColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new I256ColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new I256ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new I256ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var F32Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.F32);
	}
	default(value) {
		return new F32ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new F32ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var F64Builder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.F64);
	}
	default(value) {
		return new F64ColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new F64ColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var BoolBuilder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.Bool);
	}
	index(algorithm = "btree") {
		return new BoolColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new BoolColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new BoolColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new BoolColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new BoolColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var StringBuilder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.String);
	}
	index(algorithm = "btree") {
		return new StringColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new StringColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new StringColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new StringColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new StringColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ArrayBuilder = class extends TypeBuilder {
	element;
	constructor(element) {
		super(AlgebraicType.Array(element.algebraicType));
		this.element = element;
	}
	default(value) {
		return new ArrayColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ArrayColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ByteArrayBuilder = class extends TypeBuilder {
	constructor() {
		super(AlgebraicType.Array(AlgebraicType.U8));
	}
	default(value) {
		return new ByteArrayColumnBuilder(set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ByteArrayColumnBuilder(set(defaultMetadata, { name }));
	}
};
var OptionBuilder = class extends TypeBuilder {
	value;
	constructor(value) {
		super(Option.getAlgebraicType(value.algebraicType));
		this.value = value;
	}
	default(value) {
		return new OptionColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new OptionColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ProductBuilder = class extends TypeBuilder {
	typeName;
	elements;
	constructor(elements, name) {
		function elementsArrayFromElementsObj(obj) {
			return Object.keys(obj).map((key) => ({
				name: key,
				get algebraicType() {
					return obj[key].algebraicType;
				}
			}));
		}
		super(AlgebraicType.Product({ elements: elementsArrayFromElementsObj(elements) }));
		this.typeName = name;
		this.elements = elements;
	}
	default(value) {
		return new ProductColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ProductColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ResultBuilder = class extends TypeBuilder {
	ok;
	err;
	constructor(ok, err) {
		super(Result.getAlgebraicType(ok.algebraicType, err.algebraicType));
		this.ok = ok;
		this.err = err;
	}
	default(value) {
		return new ResultColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
};
var UnitBuilder = class extends TypeBuilder {
	constructor() {
		super({
			tag: "Product",
			value: { elements: [] }
		});
	}
};
var RowBuilder = class extends TypeBuilder {
	row;
	typeName;
	constructor(row, name) {
		const mappedRow = Object.fromEntries(Object.entries(row).map(([colName, builder]) => [colName, builder instanceof ColumnBuilder ? builder : new ColumnBuilder(builder, {})]));
		const elements = Object.keys(mappedRow).map((name2) => ({
			name: name2,
			get algebraicType() {
				return mappedRow[name2].typeBuilder.algebraicType;
			}
		}));
		super(AlgebraicType.Product({ elements }));
		this.row = mappedRow;
		this.typeName = name;
	}
};
var SumBuilderImpl = class extends TypeBuilder {
	variants;
	typeName;
	constructor(variants, name) {
		function variantsArrayFromVariantsObj(variants2) {
			return Object.keys(variants2).map((key) => ({
				name: key,
				get algebraicType() {
					return variants2[key].algebraicType;
				}
			}));
		}
		super(AlgebraicType.Sum({ variants: variantsArrayFromVariantsObj(variants) }));
		this.variants = variants;
		this.typeName = name;
		for (const key of Object.keys(variants)) {
			const desc = Object.getOwnPropertyDescriptor(variants, key);
			const isAccessor = !!desc && (typeof desc.get === "function" || typeof desc.set === "function");
			let isUnit2 = false;
			if (!isAccessor) isUnit2 = variants[key] instanceof UnitBuilder;
			if (isUnit2) {
				const constant = this.create(key);
				Object.defineProperty(this, key, {
					value: constant,
					writable: false,
					enumerable: true,
					configurable: false
				});
			} else {
				const fn = ((value) => this.create(key, value));
				Object.defineProperty(this, key, {
					value: fn,
					writable: false,
					enumerable: true,
					configurable: false
				});
			}
		}
	}
	create(tag, value) {
		return value === void 0 ? { tag } : {
			tag,
			value
		};
	}
	default(value) {
		return new SumColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new SumColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var SumBuilder = SumBuilderImpl;
var SimpleSumBuilderImpl = class extends SumBuilderImpl {
	index(algorithm = "btree") {
		return new SimpleSumColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	primaryKey() {
		return new SimpleSumColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
};
var ScheduleAtBuilder = class extends TypeBuilder {
	constructor() {
		super(schedule_at_default.getAlgebraicType());
	}
	default(value) {
		return new ScheduleAtColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ScheduleAtColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var IdentityBuilder = class extends TypeBuilder {
	constructor() {
		super(Identity.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new IdentityColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var ConnectionIdBuilder = class extends TypeBuilder {
	constructor() {
		super(ConnectionId.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new ConnectionIdColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var TimestampBuilder = class extends TypeBuilder {
	constructor() {
		super(Timestamp.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new TimestampColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var TimeDurationBuilder = class extends TypeBuilder {
	constructor() {
		super(TimeDuration.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new TimeDurationColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var UuidBuilder = class extends TypeBuilder {
	constructor() {
		super(Uuid.getAlgebraicType());
	}
	index(algorithm = "btree") {
		return new UuidColumnBuilder(this, set(defaultMetadata, { indexType: algorithm }));
	}
	unique() {
		return new UuidColumnBuilder(this, set(defaultMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new UuidColumnBuilder(this, set(defaultMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new UuidColumnBuilder(this, set(defaultMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new UuidColumnBuilder(this, set(defaultMetadata, { defaultValue: value }));
	}
	name(name) {
		return new UuidColumnBuilder(this, set(defaultMetadata, { name }));
	}
};
var defaultMetadata = {};
var ColumnBuilder = class {
	typeBuilder;
	columnMetadata;
	constructor(typeBuilder, metadata) {
		this.typeBuilder = typeBuilder;
		this.columnMetadata = metadata;
	}
	serialize(writer, value) {
		this.typeBuilder.serialize(writer, value);
	}
	deserialize(reader) {
		return this.typeBuilder.deserialize(reader);
	}
};
var U8ColumnBuilder = class _U8ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U16ColumnBuilder = class _U16ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U32ColumnBuilder = class _U32ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U64ColumnBuilder = class _U64ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U128ColumnBuilder = class _U128ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var U256ColumnBuilder = class _U256ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _U256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I8ColumnBuilder = class _I8ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I8ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I16ColumnBuilder = class _I16ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I16ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I32ColumnBuilder = class _I32ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I64ColumnBuilder = class _I64ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I128ColumnBuilder = class _I128ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I128ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var I256ColumnBuilder = class _I256ColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	autoInc() {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isAutoIncrement: true }));
	}
	default(value) {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _I256ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var F32ColumnBuilder = class _F32ColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _F32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _F32ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var F64ColumnBuilder = class _F64ColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _F64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _F64ColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var BoolColumnBuilder = class _BoolColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _BoolColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var StringColumnBuilder = class _StringColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _StringColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ArrayColumnBuilder = class _ArrayColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _ArrayColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ArrayColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ByteArrayColumnBuilder = class _ByteArrayColumnBuilder extends ColumnBuilder {
	constructor(metadata) {
		super(new TypeBuilder(AlgebraicType.Array(AlgebraicType.U8)), metadata);
	}
	default(value) {
		return new _ByteArrayColumnBuilder(set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ByteArrayColumnBuilder(set(this.columnMetadata, { name }));
	}
};
var OptionColumnBuilder = class _OptionColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _OptionColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _OptionColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ResultColumnBuilder = class _ResultColumnBuilder extends ColumnBuilder {
	constructor(typeBuilder, metadata) {
		super(typeBuilder, metadata);
	}
	default(value) {
		return new _ResultColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
};
var ProductColumnBuilder = class _ProductColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _ProductColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ProductColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var SumColumnBuilder = class _SumColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _SumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _SumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var SimpleSumColumnBuilder = class _SimpleSumColumnBuilder extends SumColumnBuilder {
	index(algorithm = "btree") {
		return new _SimpleSumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	primaryKey() {
		return new _SimpleSumColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
};
var ScheduleAtColumnBuilder = class _ScheduleAtColumnBuilder extends ColumnBuilder {
	default(value) {
		return new _ScheduleAtColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ScheduleAtColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var IdentityColumnBuilder = class _IdentityColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _IdentityColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var ConnectionIdColumnBuilder = class _ConnectionIdColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _ConnectionIdColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var TimestampColumnBuilder = class _TimestampColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _TimestampColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var TimeDurationColumnBuilder = class _TimeDurationColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _TimeDurationColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var UuidColumnBuilder = class _UuidColumnBuilder extends ColumnBuilder {
	index(algorithm = "btree") {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { indexType: algorithm }));
	}
	unique() {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isUnique: true }));
	}
	primaryKey() {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { isPrimaryKey: true }));
	}
	default(value) {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { defaultValue: value }));
	}
	name(name) {
		return new _UuidColumnBuilder(this.typeBuilder, set(this.columnMetadata, { name }));
	}
};
var RefBuilder = class extends TypeBuilder {
	ref;
	/** The phantom type of the pointee of this ref. */
	__spacetimeType;
	constructor(ref) {
		super(AlgebraicType.Ref(ref));
		this.ref = ref;
	}
};
var enumImpl = ((nameOrObj, maybeObj) => {
	let obj = nameOrObj;
	let name = void 0;
	if (typeof nameOrObj === "string") {
		if (!maybeObj) throw new TypeError("When providing a name, you must also provide the variants object or array.");
		obj = maybeObj;
		name = nameOrObj;
	}
	if (Array.isArray(obj)) {
		const simpleVariantsObj = {};
		for (const variant of obj) simpleVariantsObj[variant] = new UnitBuilder();
		return new SimpleSumBuilderImpl(simpleVariantsObj, name);
	}
	return new SumBuilder(obj, name);
});
var t = {
	bool: () => new BoolBuilder(),
	string: () => new StringBuilder(),
	number: () => new F64Builder(),
	i8: () => new I8Builder(),
	u8: () => new U8Builder(),
	i16: () => new I16Builder(),
	u16: () => new U16Builder(),
	i32: () => new I32Builder(),
	u32: () => new U32Builder(),
	i64: () => new I64Builder(),
	u64: () => new U64Builder(),
	i128: () => new I128Builder(),
	u128: () => new U128Builder(),
	i256: () => new I256Builder(),
	u256: () => new U256Builder(),
	f32: () => new F32Builder(),
	f64: () => new F64Builder(),
	object: ((nameOrObj, maybeObj) => {
		if (typeof nameOrObj === "string") {
			if (!maybeObj) throw new TypeError("When providing a name, you must also provide the object.");
			return new ProductBuilder(maybeObj, nameOrObj);
		}
		return new ProductBuilder(nameOrObj, void 0);
	}),
	row: ((nameOrObj, maybeObj) => {
		const [obj, name] = typeof nameOrObj === "string" ? [maybeObj, nameOrObj] : [nameOrObj, void 0];
		return new RowBuilder(obj, name);
	}),
	array(e) {
		return new ArrayBuilder(e);
	},
	enum: enumImpl,
	unit() {
		return new UnitBuilder();
	},
	lazy(thunk) {
		let cached = null;
		const get = () => cached ??= thunk();
		return new Proxy({}, {
			get(_t, prop, recv) {
				const target = get();
				const val = Reflect.get(target, prop, recv);
				return typeof val === "function" ? val.bind(target) : val;
			},
			set(_t, prop, value, recv) {
				return Reflect.set(get(), prop, value, recv);
			},
			has(_t, prop) {
				return prop in get();
			},
			ownKeys() {
				return Reflect.ownKeys(get());
			},
			getOwnPropertyDescriptor(_t, prop) {
				return Object.getOwnPropertyDescriptor(get(), prop);
			},
			getPrototypeOf() {
				return Object.getPrototypeOf(get());
			}
		});
	},
	scheduleAt: () => {
		return new ScheduleAtBuilder();
	},
	option(value) {
		return new OptionBuilder(value);
	},
	result(ok, err) {
		return new ResultBuilder(ok, err);
	},
	identity: () => {
		return new IdentityBuilder();
	},
	connectionId: () => {
		return new ConnectionIdBuilder();
	},
	timestamp: () => {
		return new TimestampBuilder();
	},
	timeDuration: () => {
		return new TimeDurationBuilder();
	},
	uuid: () => {
		return new UuidBuilder();
	},
	byteArray: () => {
		return new ByteArrayBuilder();
	}
};
var AlgebraicType2 = t.enum("AlgebraicType", {
	Ref: t.u32(),
	get Sum() {
		return SumType2;
	},
	get Product() {
		return ProductType2;
	},
	get Array() {
		return AlgebraicType2;
	},
	String: t.unit(),
	Bool: t.unit(),
	I8: t.unit(),
	U8: t.unit(),
	I16: t.unit(),
	U16: t.unit(),
	I32: t.unit(),
	U32: t.unit(),
	I64: t.unit(),
	U64: t.unit(),
	I128: t.unit(),
	U128: t.unit(),
	I256: t.unit(),
	U256: t.unit(),
	F32: t.unit(),
	F64: t.unit()
});
var CaseConversionPolicy = t.enum("CaseConversionPolicy", {
	None: t.unit(),
	SnakeCase: t.unit()
});
var ExplicitNameEntry = t.enum("ExplicitNameEntry", {
	get Table() {
		return NameMapping;
	},
	get Function() {
		return NameMapping;
	},
	get Index() {
		return NameMapping;
	}
});
var ExplicitNames = t.object("ExplicitNames", { get entries() {
	return t.array(ExplicitNameEntry);
} });
var FunctionVisibility = t.enum("FunctionVisibility", {
	Private: t.unit(),
	ClientCallable: t.unit()
});
var HttpHeaderPair = t.object("HttpHeaderPair", {
	name: t.string(),
	value: t.byteArray()
});
var HttpHeaders = t.object("HttpHeaders", { get entries() {
	return t.array(HttpHeaderPair);
} });
var HttpMethod = t.enum("HttpMethod", {
	Get: t.unit(),
	Head: t.unit(),
	Post: t.unit(),
	Put: t.unit(),
	Delete: t.unit(),
	Connect: t.unit(),
	Options: t.unit(),
	Trace: t.unit(),
	Patch: t.unit(),
	Extension: t.string()
});
var HttpRequest = t.object("HttpRequest", {
	get method() {
		return HttpMethod;
	},
	get headers() {
		return HttpHeaders;
	},
	timeout: t.option(t.timeDuration()),
	uri: t.string(),
	get version() {
		return HttpVersion;
	}
});
var HttpResponse = t.object("HttpResponse", {
	get headers() {
		return HttpHeaders;
	},
	get version() {
		return HttpVersion;
	},
	code: t.u16()
});
var HttpVersion = t.enum("HttpVersion", {
	Http09: t.unit(),
	Http10: t.unit(),
	Http11: t.unit(),
	Http2: t.unit(),
	Http3: t.unit()
});
var IndexType = t.enum("IndexType", {
	BTree: t.unit(),
	Hash: t.unit()
});
var Lifecycle = t.enum("Lifecycle", {
	Init: t.unit(),
	OnConnect: t.unit(),
	OnDisconnect: t.unit()
});
var MiscModuleExport = t.enum("MiscModuleExport", { get TypeAlias() {
	return TypeAlias;
} });
var NameMapping = t.object("NameMapping", {
	sourceName: t.string(),
	canonicalName: t.string()
});
var ProductType2 = t.object("ProductType", { get elements() {
	return t.array(ProductTypeElement);
} });
var ProductTypeElement = t.object("ProductTypeElement", {
	name: t.option(t.string()),
	get algebraicType() {
		return AlgebraicType2;
	}
});
var RawColumnDefV8 = t.object("RawColumnDefV8", {
	colName: t.string(),
	get colType() {
		return AlgebraicType2;
	}
});
var RawColumnDefaultValueV10 = t.object("RawColumnDefaultValueV10", {
	colId: t.u16(),
	value: t.byteArray()
});
var RawColumnDefaultValueV9 = t.object("RawColumnDefaultValueV9", {
	table: t.string(),
	colId: t.u16(),
	value: t.byteArray()
});
var RawConstraintDataV9 = t.enum("RawConstraintDataV9", { get Unique() {
	return RawUniqueConstraintDataV9;
} });
var RawConstraintDefV10 = t.object("RawConstraintDefV10", {
	sourceName: t.option(t.string()),
	get data() {
		return RawConstraintDataV9;
	}
});
var RawConstraintDefV8 = t.object("RawConstraintDefV8", {
	constraintName: t.string(),
	constraints: t.u8(),
	columns: t.array(t.u16())
});
var RawConstraintDefV9 = t.object("RawConstraintDefV9", {
	name: t.option(t.string()),
	get data() {
		return RawConstraintDataV9;
	}
});
var RawIndexAlgorithm = t.enum("RawIndexAlgorithm", {
	BTree: t.array(t.u16()),
	Hash: t.array(t.u16()),
	Direct: t.u16()
});
var RawIndexDefV10 = t.object("RawIndexDefV10", {
	sourceName: t.option(t.string()),
	accessorName: t.option(t.string()),
	get algorithm() {
		return RawIndexAlgorithm;
	}
});
var RawIndexDefV8 = t.object("RawIndexDefV8", {
	indexName: t.string(),
	isUnique: t.bool(),
	get indexType() {
		return IndexType;
	},
	columns: t.array(t.u16())
});
var RawIndexDefV9 = t.object("RawIndexDefV9", {
	name: t.option(t.string()),
	accessorName: t.option(t.string()),
	get algorithm() {
		return RawIndexAlgorithm;
	}
});
var RawLifeCycleReducerDefV10 = t.object("RawLifeCycleReducerDefV10", {
	get lifecycleSpec() {
		return Lifecycle;
	},
	functionName: t.string()
});
var RawMiscModuleExportV9 = t.enum("RawMiscModuleExportV9", {
	get ColumnDefaultValue() {
		return RawColumnDefaultValueV9;
	},
	get Procedure() {
		return RawProcedureDefV9;
	},
	get View() {
		return RawViewDefV9;
	}
});
var RawModuleDef = t.enum("RawModuleDef", {
	get V8BackCompat() {
		return RawModuleDefV8;
	},
	get V9() {
		return RawModuleDefV9;
	},
	get V10() {
		return RawModuleDefV10;
	}
});
var RawModuleDefV10 = t.object("RawModuleDefV10", { get sections() {
	return t.array(RawModuleDefV10Section);
} });
var RawModuleDefV10Section = t.enum("RawModuleDefV10Section", {
	get Typespace() {
		return Typespace;
	},
	get Types() {
		return t.array(RawTypeDefV10);
	},
	get Tables() {
		return t.array(RawTableDefV10);
	},
	get Reducers() {
		return t.array(RawReducerDefV10);
	},
	get Procedures() {
		return t.array(RawProcedureDefV10);
	},
	get Views() {
		return t.array(RawViewDefV10);
	},
	get Schedules() {
		return t.array(RawScheduleDefV10);
	},
	get LifeCycleReducers() {
		return t.array(RawLifeCycleReducerDefV10);
	},
	get RowLevelSecurity() {
		return t.array(RawRowLevelSecurityDefV9);
	},
	get CaseConversionPolicy() {
		return CaseConversionPolicy;
	},
	get ExplicitNames() {
		return ExplicitNames;
	}
});
var RawModuleDefV8 = t.object("RawModuleDefV8", {
	get typespace() {
		return Typespace;
	},
	get tables() {
		return t.array(TableDesc);
	},
	get reducers() {
		return t.array(ReducerDef);
	},
	get miscExports() {
		return t.array(MiscModuleExport);
	}
});
var RawModuleDefV9 = t.object("RawModuleDefV9", {
	get typespace() {
		return Typespace;
	},
	get tables() {
		return t.array(RawTableDefV9);
	},
	get reducers() {
		return t.array(RawReducerDefV9);
	},
	get types() {
		return t.array(RawTypeDefV9);
	},
	get miscExports() {
		return t.array(RawMiscModuleExportV9);
	},
	get rowLevelSecurity() {
		return t.array(RawRowLevelSecurityDefV9);
	}
});
var RawProcedureDefV10 = t.object("RawProcedureDefV10", {
	sourceName: t.string(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	},
	get visibility() {
		return FunctionVisibility;
	}
});
var RawProcedureDefV9 = t.object("RawProcedureDefV9", {
	name: t.string(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	}
});
var RawReducerDefV10 = t.object("RawReducerDefV10", {
	sourceName: t.string(),
	get params() {
		return ProductType2;
	},
	get visibility() {
		return FunctionVisibility;
	},
	get okReturnType() {
		return AlgebraicType2;
	},
	get errReturnType() {
		return AlgebraicType2;
	}
});
var RawReducerDefV9 = t.object("RawReducerDefV9", {
	name: t.string(),
	get params() {
		return ProductType2;
	},
	get lifecycle() {
		return t.option(Lifecycle);
	}
});
var RawRowLevelSecurityDefV9 = t.object("RawRowLevelSecurityDefV9", { sql: t.string() });
var RawScheduleDefV10 = t.object("RawScheduleDefV10", {
	sourceName: t.option(t.string()),
	tableName: t.string(),
	scheduleAtCol: t.u16(),
	functionName: t.string()
});
var RawScheduleDefV9 = t.object("RawScheduleDefV9", {
	name: t.option(t.string()),
	reducerName: t.string(),
	scheduledAtColumn: t.u16()
});
var RawScopedTypeNameV10 = t.object("RawScopedTypeNameV10", {
	scope: t.array(t.string()),
	sourceName: t.string()
});
var RawScopedTypeNameV9 = t.object("RawScopedTypeNameV9", {
	scope: t.array(t.string()),
	name: t.string()
});
var RawSequenceDefV10 = t.object("RawSequenceDefV10", {
	sourceName: t.option(t.string()),
	column: t.u16(),
	start: t.option(t.i128()),
	minValue: t.option(t.i128()),
	maxValue: t.option(t.i128()),
	increment: t.i128()
});
var RawSequenceDefV8 = t.object("RawSequenceDefV8", {
	sequenceName: t.string(),
	colPos: t.u16(),
	increment: t.i128(),
	start: t.option(t.i128()),
	minValue: t.option(t.i128()),
	maxValue: t.option(t.i128()),
	allocated: t.i128()
});
var RawSequenceDefV9 = t.object("RawSequenceDefV9", {
	name: t.option(t.string()),
	column: t.u16(),
	start: t.option(t.i128()),
	minValue: t.option(t.i128()),
	maxValue: t.option(t.i128()),
	increment: t.i128()
});
var RawTableDefV10 = t.object("RawTableDefV10", {
	sourceName: t.string(),
	productTypeRef: t.u32(),
	primaryKey: t.array(t.u16()),
	get indexes() {
		return t.array(RawIndexDefV10);
	},
	get constraints() {
		return t.array(RawConstraintDefV10);
	},
	get sequences() {
		return t.array(RawSequenceDefV10);
	},
	get tableType() {
		return TableType;
	},
	get tableAccess() {
		return TableAccess;
	},
	get defaultValues() {
		return t.array(RawColumnDefaultValueV10);
	},
	isEvent: t.bool()
});
var RawTableDefV8 = t.object("RawTableDefV8", {
	tableName: t.string(),
	get columns() {
		return t.array(RawColumnDefV8);
	},
	get indexes() {
		return t.array(RawIndexDefV8);
	},
	get constraints() {
		return t.array(RawConstraintDefV8);
	},
	get sequences() {
		return t.array(RawSequenceDefV8);
	},
	tableType: t.string(),
	tableAccess: t.string(),
	scheduled: t.option(t.string())
});
var RawTableDefV9 = t.object("RawTableDefV9", {
	name: t.string(),
	productTypeRef: t.u32(),
	primaryKey: t.array(t.u16()),
	get indexes() {
		return t.array(RawIndexDefV9);
	},
	get constraints() {
		return t.array(RawConstraintDefV9);
	},
	get sequences() {
		return t.array(RawSequenceDefV9);
	},
	get schedule() {
		return t.option(RawScheduleDefV9);
	},
	get tableType() {
		return TableType;
	},
	get tableAccess() {
		return TableAccess;
	}
});
var RawTypeDefV10 = t.object("RawTypeDefV10", {
	get sourceName() {
		return RawScopedTypeNameV10;
	},
	ty: t.u32(),
	customOrdering: t.bool()
});
var RawTypeDefV9 = t.object("RawTypeDefV9", {
	get name() {
		return RawScopedTypeNameV9;
	},
	ty: t.u32(),
	customOrdering: t.bool()
});
var RawUniqueConstraintDataV9 = t.object("RawUniqueConstraintDataV9", { columns: t.array(t.u16()) });
var RawViewDefV10 = t.object("RawViewDefV10", {
	sourceName: t.string(),
	index: t.u32(),
	isPublic: t.bool(),
	isAnonymous: t.bool(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	}
});
var RawViewDefV9 = t.object("RawViewDefV9", {
	name: t.string(),
	index: t.u32(),
	isPublic: t.bool(),
	isAnonymous: t.bool(),
	get params() {
		return ProductType2;
	},
	get returnType() {
		return AlgebraicType2;
	}
});
var ReducerDef = t.object("ReducerDef", {
	name: t.string(),
	get args() {
		return t.array(ProductTypeElement);
	}
});
var SumType2 = t.object("SumType", { get variants() {
	return t.array(SumTypeVariant);
} });
var SumTypeVariant = t.object("SumTypeVariant", {
	name: t.option(t.string()),
	get algebraicType() {
		return AlgebraicType2;
	}
});
var TableAccess = t.enum("TableAccess", {
	Public: t.unit(),
	Private: t.unit()
});
var TableDesc = t.object("TableDesc", {
	get schema() {
		return RawTableDefV8;
	},
	data: t.u32()
});
var TableType = t.enum("TableType", {
	System: t.unit(),
	User: t.unit()
});
var TypeAlias = t.object("TypeAlias", {
	name: t.string(),
	ty: t.u32()
});
var Typespace = t.object("Typespace", { get types() {
	return t.array(AlgebraicType2);
} });
var ViewResultHeader = t.enum("ViewResultHeader", {
	RowData: t.unit(),
	RawSql: t.string()
});
function tableToSchema(accName, schema2, tableDef) {
	const getColName = (i) => schema2.rowType.algebraicType.value.elements[i].name;
	const resolvedIndexes = tableDef.indexes.map((idx) => {
		const accessorName = idx.accessorName;
		if (typeof accessorName !== "string" || accessorName.length === 0) throw new TypeError(`Index '${idx.sourceName ?? "<unknown>"}' on table '${tableDef.sourceName}' is missing accessor name`);
		const columnIds = idx.algorithm.tag === "Direct" ? [idx.algorithm.value] : idx.algorithm.value;
		return {
			name: accessorName,
			unique: tableDef.constraints.some((c) => c.data.tag === "Unique" && c.data.value.columns.every((col) => columnIds.includes(col))),
			algorithm: {
				BTree: "btree",
				Hash: "hash",
				Direct: "direct"
			}[idx.algorithm.tag],
			columns: columnIds.map(getColName)
		};
	});
	return {
		sourceName: schema2.tableName || accName,
		accessorName: accName,
		columns: schema2.rowType.row,
		rowType: schema2.rowSpacetimeType,
		indexes: schema2.idxs,
		constraints: tableDef.constraints.map((c) => ({
			name: c.sourceName,
			constraint: "unique",
			columns: c.data.value.columns.map(getColName)
		})),
		resolvedIndexes,
		tableDef,
		...tableDef.isEvent ? { isEvent: true } : {}
	};
}
var ModuleContext = class {
	#compoundTypes = /* @__PURE__ */ new Map();
	/**
	* The global module definition that gets populated by calls to `reducer()` and lifecycle hooks.
	*/
	#moduleDef = {
		typespace: { types: [] },
		tables: [],
		reducers: [],
		types: [],
		rowLevelSecurity: [],
		schedules: [],
		procedures: [],
		views: [],
		lifeCycleReducers: [],
		caseConversionPolicy: { tag: "SnakeCase" },
		explicitNames: { entries: [] }
	};
	get moduleDef() {
		return this.#moduleDef;
	}
	rawModuleDefV10() {
		const sections = [];
		const push = (s) => {
			if (s) sections.push(s);
		};
		const module = this.#moduleDef;
		push(module.typespace && {
			tag: "Typespace",
			value: module.typespace
		});
		push(module.types && {
			tag: "Types",
			value: module.types
		});
		push(module.tables && {
			tag: "Tables",
			value: module.tables
		});
		push(module.reducers && {
			tag: "Reducers",
			value: module.reducers
		});
		push(module.procedures && {
			tag: "Procedures",
			value: module.procedures
		});
		push(module.views && {
			tag: "Views",
			value: module.views
		});
		push(module.schedules && {
			tag: "Schedules",
			value: module.schedules
		});
		push(module.lifeCycleReducers && {
			tag: "LifeCycleReducers",
			value: module.lifeCycleReducers
		});
		push(module.rowLevelSecurity && {
			tag: "RowLevelSecurity",
			value: module.rowLevelSecurity
		});
		push(module.explicitNames && {
			tag: "ExplicitNames",
			value: module.explicitNames
		});
		push(module.caseConversionPolicy && {
			tag: "CaseConversionPolicy",
			value: module.caseConversionPolicy
		});
		return { sections };
	}
	/**
	* Set the case conversion policy for this module.
	* Called by the settings mechanism.
	*/
	setCaseConversionPolicy(policy) {
		this.#moduleDef.caseConversionPolicy = policy;
	}
	get typespace() {
		return this.#moduleDef.typespace;
	}
	/**
	* Resolves the actual type of a TypeBuilder by following its references until it reaches a non-ref type.
	* @param typespace The typespace to resolve types against.
	* @param typeBuilder The TypeBuilder to resolve.
	* @returns The resolved algebraic type.
	*/
	resolveType(typeBuilder) {
		let ty = typeBuilder.algebraicType;
		while (ty.tag === "Ref") ty = this.typespace.types[ty.value];
		return ty;
	}
	/**
	* Adds a type to the module definition's typespace as a `Ref` if it is a named compound type (Product or Sum).
	* Otherwise, returns the type as is.
	* @param name
	* @param ty
	* @returns
	*/
	registerTypesRecursively(typeBuilder) {
		if (typeBuilder instanceof ProductBuilder && !isUnit(typeBuilder) || typeBuilder instanceof SumBuilder || typeBuilder instanceof RowBuilder) return this.#registerCompoundTypeRecursively(typeBuilder);
		else if (typeBuilder instanceof OptionBuilder) return new OptionBuilder(this.registerTypesRecursively(typeBuilder.value));
		else if (typeBuilder instanceof ResultBuilder) return new ResultBuilder(this.registerTypesRecursively(typeBuilder.ok), this.registerTypesRecursively(typeBuilder.err));
		else if (typeBuilder instanceof ArrayBuilder) return new ArrayBuilder(this.registerTypesRecursively(typeBuilder.element));
		else return typeBuilder;
	}
	#registerCompoundTypeRecursively(typeBuilder) {
		const ty = typeBuilder.algebraicType;
		const name = typeBuilder.typeName;
		if (name === void 0) throw new Error(`Missing type name for ${typeBuilder.constructor.name ?? "TypeBuilder"} ${JSON.stringify(typeBuilder)}`);
		let r = this.#compoundTypes.get(ty);
		if (r != null) return r;
		const newTy = typeBuilder instanceof RowBuilder || typeBuilder instanceof ProductBuilder ? {
			tag: "Product",
			value: { elements: [] }
		} : {
			tag: "Sum",
			value: { variants: [] }
		};
		r = new RefBuilder(this.#moduleDef.typespace.types.length);
		this.#moduleDef.typespace.types.push(newTy);
		this.#compoundTypes.set(ty, r);
		if (typeBuilder instanceof RowBuilder) for (const [name2, elem] of Object.entries(typeBuilder.row)) newTy.value.elements.push({
			name: name2,
			algebraicType: this.registerTypesRecursively(elem.typeBuilder).algebraicType
		});
		else if (typeBuilder instanceof ProductBuilder) for (const [name2, elem] of Object.entries(typeBuilder.elements)) newTy.value.elements.push({
			name: name2,
			algebraicType: this.registerTypesRecursively(elem).algebraicType
		});
		else if (typeBuilder instanceof SumBuilder) for (const [name2, variant] of Object.entries(typeBuilder.variants)) newTy.value.variants.push({
			name: name2,
			algebraicType: this.registerTypesRecursively(variant).algebraicType
		});
		this.#moduleDef.types.push({
			sourceName: splitName(name),
			ty: r.ref,
			customOrdering: true
		});
		return r;
	}
};
function isUnit(typeBuilder) {
	return typeBuilder.typeName == null && typeBuilder.algebraicType.value.elements.length === 0;
}
function splitName(name) {
	const scope = name.split(".");
	return {
		sourceName: scope.pop(),
		scope
	};
}
var import_statuses = __toESM(require_statuses());
var Range = class {
	#from;
	#to;
	constructor(from, to) {
		this.#from = from ?? { tag: "unbounded" };
		this.#to = to ?? { tag: "unbounded" };
	}
	get from() {
		return this.#from;
	}
	get to() {
		return this.#to;
	}
};
function table(opts, row, ..._) {
	const { name, public: isPublic = false, indexes: userIndexes = [], scheduled, event: isEvent = false } = opts;
	const colIds = /* @__PURE__ */ new Map();
	const colNameList = [];
	if (!(row instanceof RowBuilder)) row = new RowBuilder(row);
	row.algebraicType.value.elements.forEach((elem, i) => {
		colIds.set(elem.name, i);
		colNameList.push(elem.name);
	});
	const pk = [];
	const indexes = [];
	const constraints = [];
	const sequences = [];
	let scheduleAtCol;
	const defaultValues = [];
	for (const [name2, builder] of Object.entries(row.row)) {
		const meta = builder.columnMetadata;
		if (meta.isPrimaryKey) pk.push(colIds.get(name2));
		const isUnique = meta.isUnique || meta.isPrimaryKey;
		if (meta.indexType || isUnique) {
			const algo = meta.indexType ?? "btree";
			const id = colIds.get(name2);
			let algorithm;
			switch (algo) {
				case "btree":
					algorithm = RawIndexAlgorithm.BTree([id]);
					break;
				case "hash":
					algorithm = RawIndexAlgorithm.Hash([id]);
					break;
				case "direct":
					algorithm = RawIndexAlgorithm.Direct(id);
					break;
			}
			indexes.push({
				sourceName: void 0,
				accessorName: name2,
				algorithm
			});
		}
		if (isUnique) constraints.push({
			sourceName: void 0,
			data: {
				tag: "Unique",
				value: { columns: [colIds.get(name2)] }
			}
		});
		if (meta.isAutoIncrement) sequences.push({
			sourceName: void 0,
			start: void 0,
			minValue: void 0,
			maxValue: void 0,
			column: colIds.get(name2),
			increment: 1n
		});
		if (meta.defaultValue) {
			const writer = new BinaryWriter(16);
			builder.serialize(writer, meta.defaultValue);
			defaultValues.push({
				colId: colIds.get(name2),
				value: writer.getBuffer()
			});
		}
		if (scheduled) {
			const algebraicType = builder.typeBuilder.algebraicType;
			if (schedule_at_default.isScheduleAt(algebraicType)) scheduleAtCol = colIds.get(name2);
		}
	}
	for (const indexOpts of userIndexes ?? []) {
		const accessor = indexOpts.accessor;
		if (typeof accessor !== "string" || accessor.length === 0) {
			const tableLabel = name ?? "<unnamed>";
			const indexLabel = indexOpts.name ?? "<unnamed>";
			throw new TypeError(`Index '${indexLabel}' on table '${tableLabel}' must define a non-empty 'accessor'`);
		}
		let algorithm;
		switch (indexOpts.algorithm) {
			case "btree":
				algorithm = {
					tag: "BTree",
					value: indexOpts.columns.map((c) => colIds.get(c))
				};
				break;
			case "hash":
				algorithm = {
					tag: "Hash",
					value: indexOpts.columns.map((c) => colIds.get(c))
				};
				break;
			case "direct":
				algorithm = {
					tag: "Direct",
					value: colIds.get(indexOpts.column)
				};
				break;
		}
		indexes.push({
			sourceName: void 0,
			accessorName: accessor,
			algorithm,
			canonicalName: indexOpts.name
		});
	}
	for (const constraintOpts of opts.constraints ?? []) if (constraintOpts.constraint === "unique") {
		const data = {
			tag: "Unique",
			value: { columns: constraintOpts.columns.map((c) => colIds.get(c)) }
		};
		constraints.push({
			sourceName: constraintOpts.name,
			data
		});
		continue;
	}
	const productType = row.algebraicType.value;
	return {
		rowType: row,
		tableName: name,
		rowSpacetimeType: productType,
		tableDef: (ctx, accName) => {
			const tableName = name ?? accName;
			if (row.typeName === void 0) row.typeName = toPascalCase(tableName);
			for (const index of indexes) {
				const sourceName = index.sourceName = `${accName}_${(index.algorithm.tag === "Direct" ? [index.algorithm.value] : index.algorithm.value).map((i) => colNameList[i]).join("_")}_idx_${index.algorithm.tag.toLowerCase()}`;
				const { canonicalName } = index;
				if (canonicalName !== void 0) ctx.moduleDef.explicitNames.entries.push(ExplicitNameEntry.Index({
					sourceName,
					canonicalName
				}));
			}
			return {
				sourceName: accName,
				productTypeRef: ctx.registerTypesRecursively(row).ref,
				primaryKey: pk,
				indexes,
				constraints,
				sequences,
				tableType: { tag: "User" },
				tableAccess: { tag: isPublic ? "Public" : "Private" },
				defaultValues,
				isEvent
			};
		},
		idxs: userIndexes,
		constraints,
		schedule: scheduled && scheduleAtCol !== void 0 ? {
			scheduleAtCol,
			reducer: scheduled
		} : void 0
	};
}
var QueryBrand = Symbol("QueryBrand");
var isRowTypedQuery = (val) => !!val && typeof val === "object" && QueryBrand in val;
function toSql(q) {
	return q.toSql();
}
var SemijoinImpl = class _SemijoinImpl {
	constructor(sourceQuery, filterQuery, joinCondition) {
		this.sourceQuery = sourceQuery;
		this.filterQuery = filterQuery;
		this.joinCondition = joinCondition;
		if (sourceQuery.table.sourceName === filterQuery.table.sourceName) throw new Error("Cannot semijoin a table to itself");
	}
	[QueryBrand] = true;
	type = "semijoin";
	build() {
		return this;
	}
	where(predicate) {
		return new _SemijoinImpl(this.sourceQuery.where(predicate), this.filterQuery, this.joinCondition);
	}
	toSql() {
		const left = this.filterQuery;
		const right = this.sourceQuery;
		const leftTable = quoteIdentifier(left.table.sourceName);
		const rightTable = quoteIdentifier(right.table.sourceName);
		let sql = `SELECT ${rightTable}.* FROM ${leftTable} JOIN ${rightTable} ON ${booleanExprToSql(this.joinCondition)}`;
		const clauses = [];
		if (left.whereClause) clauses.push(booleanExprToSql(left.whereClause));
		if (right.whereClause) clauses.push(booleanExprToSql(right.whereClause));
		if (clauses.length > 0) {
			const whereSql = clauses.length === 1 ? clauses[0] : clauses.map(wrapInParens).join(" AND ");
			sql += ` WHERE ${whereSql}`;
		}
		return sql;
	}
};
var FromBuilder = class _FromBuilder {
	constructor(table2, whereClause) {
		this.table = table2;
		this.whereClause = whereClause;
	}
	[QueryBrand] = true;
	where(predicate) {
		const newCondition = normalizePredicateExpr(predicate(this.table.cols));
		const nextWhere = this.whereClause ? this.whereClause.and(newCondition) : newCondition;
		return new _FromBuilder(this.table, nextWhere);
	}
	rightSemijoin(right, on) {
		const sourceQuery = new _FromBuilder(right);
		const joinCondition = on(this.table.indexedCols, right.indexedCols);
		return new SemijoinImpl(sourceQuery, this, joinCondition);
	}
	leftSemijoin(right, on) {
		const filterQuery = new _FromBuilder(right);
		const joinCondition = on(this.table.indexedCols, right.indexedCols);
		return new SemijoinImpl(this, filterQuery, joinCondition);
	}
	toSql() {
		return renderSelectSqlWithJoins(this.table, this.whereClause);
	}
	build() {
		return this;
	}
};
var TableRefImpl = class {
	[QueryBrand] = true;
	type = "table";
	sourceName;
	accessorName;
	cols;
	indexedCols;
	tableDef;
	get columns() {
		return this.tableDef.columns;
	}
	get indexes() {
		return this.tableDef.indexes;
	}
	get rowType() {
		return this.tableDef.rowType;
	}
	get constraints() {
		return this.tableDef.constraints;
	}
	constructor(tableDef) {
		this.sourceName = tableDef.sourceName;
		this.accessorName = tableDef.accessorName;
		this.cols = createRowExpr(tableDef);
		this.indexedCols = this.cols;
		this.tableDef = tableDef;
		Object.freeze(this);
	}
	asFrom() {
		return new FromBuilder(this);
	}
	rightSemijoin(other, on) {
		return this.asFrom().rightSemijoin(other, on);
	}
	leftSemijoin(other, on) {
		return this.asFrom().leftSemijoin(other, on);
	}
	build() {
		return this.asFrom().build();
	}
	toSql() {
		return this.asFrom().toSql();
	}
	where(predicate) {
		return this.asFrom().where(predicate);
	}
};
function createTableRefFromDef(tableDef) {
	return new TableRefImpl(tableDef);
}
function makeQueryBuilder(schema2) {
	const qb = /* @__PURE__ */ Object.create(null);
	for (const table2 of Object.values(schema2.tables)) {
		const ref = createTableRefFromDef(table2);
		qb[table2.accessorName] = ref;
	}
	return Object.freeze(qb);
}
function createRowExpr(tableDef) {
	const row = {};
	for (const columnName of Object.keys(tableDef.columns)) {
		const columnBuilder = tableDef.columns[columnName];
		const column = new ColumnExpression(tableDef.sourceName, columnName, columnBuilder.typeBuilder.algebraicType);
		row[columnName] = Object.freeze(column);
	}
	return Object.freeze(row);
}
function renderSelectSqlWithJoins(table2, where, extraClauses = []) {
	const sql = `SELECT * FROM ${quoteIdentifier(table2.sourceName)}`;
	const clauses = [];
	if (where) clauses.push(booleanExprToSql(where));
	clauses.push(...extraClauses);
	if (clauses.length === 0) return sql;
	return `${sql} WHERE ${clauses.length === 1 ? clauses[0] : clauses.map(wrapInParens).join(" AND ")}`;
}
var ColumnExpression = class {
	type = "column";
	column;
	table;
	tsValueType;
	spacetimeType;
	constructor(table2, column, spacetimeType) {
		this.table = table2;
		this.column = column;
		this.spacetimeType = spacetimeType;
	}
	eq(x) {
		return new BooleanExpr({
			type: "eq",
			left: this,
			right: normalizeValue(x)
		});
	}
	ne(x) {
		return new BooleanExpr({
			type: "ne",
			left: this,
			right: normalizeValue(x)
		});
	}
	lt(x) {
		return new BooleanExpr({
			type: "lt",
			left: this,
			right: normalizeValue(x)
		});
	}
	lte(x) {
		return new BooleanExpr({
			type: "lte",
			left: this,
			right: normalizeValue(x)
		});
	}
	gt(x) {
		return new BooleanExpr({
			type: "gt",
			left: this,
			right: normalizeValue(x)
		});
	}
	gte(x) {
		return new BooleanExpr({
			type: "gte",
			left: this,
			right: normalizeValue(x)
		});
	}
};
function literal(value) {
	return {
		type: "literal",
		value
	};
}
function normalizeValue(val) {
	if (val.type === "literal") return val;
	if (typeof val === "object" && val != null && "type" in val && val.type === "column") return val;
	return literal(val);
}
function normalizePredicateExpr(value) {
	if (value instanceof BooleanExpr) return value;
	if (typeof value === "boolean") return new BooleanExpr({
		type: "eq",
		left: literal(value),
		right: literal(true)
	});
	return new BooleanExpr({
		type: "eq",
		left: value,
		right: literal(true)
	});
}
var BooleanExpr = class _BooleanExpr {
	constructor(data) {
		this.data = data;
	}
	and(other) {
		return new _BooleanExpr({
			type: "and",
			clauses: [this.data, other.data]
		});
	}
	or(other) {
		return new _BooleanExpr({
			type: "or",
			clauses: [this.data, other.data]
		});
	}
	not() {
		return new _BooleanExpr({
			type: "not",
			clause: this.data
		});
	}
};
function booleanExprToSql(expr, tableAlias) {
	const data = expr instanceof BooleanExpr ? expr.data : expr;
	switch (data.type) {
		case "eq": return `${valueExprToSql(data.left)} = ${valueExprToSql(data.right)}`;
		case "ne": return `${valueExprToSql(data.left)} <> ${valueExprToSql(data.right)}`;
		case "gt": return `${valueExprToSql(data.left)} > ${valueExprToSql(data.right)}`;
		case "gte": return `${valueExprToSql(data.left)} >= ${valueExprToSql(data.right)}`;
		case "lt": return `${valueExprToSql(data.left)} < ${valueExprToSql(data.right)}`;
		case "lte": return `${valueExprToSql(data.left)} <= ${valueExprToSql(data.right)}`;
		case "and": return data.clauses.map((c) => booleanExprToSql(c)).map(wrapInParens).join(" AND ");
		case "or": return data.clauses.map((c) => booleanExprToSql(c)).map(wrapInParens).join(" OR ");
		case "not": return `NOT ${wrapInParens(booleanExprToSql(data.clause))}`;
	}
}
function wrapInParens(sql) {
	return `(${sql})`;
}
function valueExprToSql(expr, tableAlias) {
	if (isLiteralExpr(expr)) return literalValueToSql(expr.value);
	const table2 = expr.table;
	return `${quoteIdentifier(table2)}.${quoteIdentifier(expr.column)}`;
}
function literalValueToSql(value) {
	if (value === null || value === void 0) return "NULL";
	if (value instanceof Identity || value instanceof ConnectionId) return `0x${value.toHexString()}`;
	if (value instanceof Timestamp) return `'${value.toISOString()}'`;
	switch (typeof value) {
		case "number":
		case "bigint": return String(value);
		case "boolean": return value ? "TRUE" : "FALSE";
		case "string": return `'${value.replace(/'/g, "''")}'`;
		default: return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
	}
}
function quoteIdentifier(name) {
	return `"${name.replace(/"/g, "\"\"")}"`;
}
function isLiteralExpr(expr) {
	return expr.type === "literal";
}
function makeViewExport(ctx, opts, params, ret, fn) {
	const viewExport = fn.bind();
	viewExport[exportContext] = ctx;
	viewExport[registerExport] = (ctx2, exportName) => {
		registerView(ctx2, opts, exportName, false, params, ret, fn);
	};
	return viewExport;
}
function makeAnonViewExport(ctx, opts, params, ret, fn) {
	const viewExport = fn.bind();
	viewExport[exportContext] = ctx;
	viewExport[registerExport] = (ctx2, exportName) => {
		registerView(ctx2, opts, exportName, true, params, ret, fn);
	};
	return viewExport;
}
function registerView(ctx, opts, exportName, anon, params, ret, fn) {
	const paramsBuilder = new RowBuilder(params, toPascalCase(exportName));
	let returnType = ctx.registerTypesRecursively(ret).algebraicType;
	const { typespace } = ctx;
	const { value: paramType } = ctx.resolveType(ctx.registerTypesRecursively(paramsBuilder));
	ctx.moduleDef.views.push({
		sourceName: exportName,
		index: (anon ? ctx.anonViews : ctx.views).length,
		isPublic: opts.public,
		isAnonymous: anon,
		params: paramType,
		returnType
	});
	if (opts.name != null) ctx.moduleDef.explicitNames.entries.push({
		tag: "Function",
		value: {
			sourceName: exportName,
			canonicalName: opts.name
		}
	});
	if (returnType.tag == "Sum") {
		const originalFn = fn;
		fn = ((ctx2, args) => {
			const ret2 = originalFn(ctx2, args);
			return ret2 == null ? [] : [ret2];
		});
		returnType = AlgebraicType.Array(returnType.value.variants[0].algebraicType);
	}
	(anon ? ctx.anonViews : ctx.views).push({
		fn,
		deserializeParams: ProductType.makeDeserializer(paramType, typespace),
		serializeReturn: AlgebraicType.makeSerializer(returnType, typespace),
		returnTypeBaseSize: bsatnBaseSize(typespace, returnType)
	});
}
var SenderError = class extends Error {
	constructor(message) {
		super(message);
	}
	get name() {
		return "SenderError";
	}
};
var SpacetimeHostError = class extends Error {
	constructor(message) {
		super(message);
	}
	get name() {
		return "SpacetimeHostError";
	}
};
var errorData = {
	HostCallFailure: 1,
	NotInTransaction: 2,
	BsatnDecodeError: 3,
	NoSuchTable: 4,
	NoSuchIndex: 5,
	NoSuchIter: 6,
	NoSuchConsoleTimer: 7,
	NoSuchBytes: 8,
	NoSpace: 9,
	BufferTooSmall: 11,
	UniqueAlreadyExists: 12,
	ScheduleAtDelayTooLong: 13,
	IndexNotUnique: 14,
	NoSuchRow: 15,
	AutoIncOverflow: 16,
	WouldBlockTransaction: 17,
	TransactionNotAnonymous: 18,
	TransactionIsReadOnly: 19,
	TransactionIsMut: 20,
	HttpError: 21
};
function mapEntries(x, f) {
	return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, f(k, v)]));
}
var errnoToClass = /* @__PURE__ */ new Map();
var errors = Object.freeze(mapEntries(errorData, (name, code) => {
	const cls = Object.defineProperty(class extends SpacetimeHostError {
		get name() {
			return name;
		}
	}, "name", {
		value: name,
		writable: false
	});
	errnoToClass.set(code, cls);
	return cls;
}));
function getErrorConstructor(code) {
	return errnoToClass.get(code) ?? SpacetimeHostError;
}
var SBigInt = typeof BigInt !== "undefined" ? BigInt : void 0;
var One = typeof BigInt !== "undefined" ? BigInt(1) : void 0;
var ThirtyTwo = typeof BigInt !== "undefined" ? BigInt(32) : void 0;
var NumValues = typeof BigInt !== "undefined" ? BigInt(4294967296) : void 0;
function unsafeUniformBigIntDistribution(from, to, rng) {
	var diff = to - from + One;
	var FinalNumValues = NumValues;
	var NumIterations = 1;
	while (FinalNumValues < diff) {
		FinalNumValues <<= ThirtyTwo;
		++NumIterations;
	}
	var value = generateNext(NumIterations, rng);
	if (value < diff) return value + from;
	if (value + diff < FinalNumValues) return value % diff + from;
	var MaxAcceptedRandom = FinalNumValues - FinalNumValues % diff;
	while (value >= MaxAcceptedRandom) value = generateNext(NumIterations, rng);
	return value % diff + from;
}
function generateNext(NumIterations, rng) {
	var value = SBigInt(rng.unsafeNext() + 2147483648);
	for (var num = 1; num < NumIterations; ++num) {
		var out = rng.unsafeNext();
		value = (value << ThirtyTwo) + SBigInt(out + 2147483648);
	}
	return value;
}
function unsafeUniformIntDistributionInternal(rangeSize, rng) {
	var MaxAllowed = rangeSize > 2 ? ~~(4294967296 / rangeSize) * rangeSize : 4294967296;
	var deltaV = rng.unsafeNext() + 2147483648;
	while (deltaV >= MaxAllowed) deltaV = rng.unsafeNext() + 2147483648;
	return deltaV % rangeSize;
}
function fromNumberToArrayInt64(out, n) {
	if (n < 0) {
		var posN = -n;
		out.sign = -1;
		out.data[0] = ~~(posN / 4294967296);
		out.data[1] = posN >>> 0;
	} else {
		out.sign = 1;
		out.data[0] = ~~(n / 4294967296);
		out.data[1] = n >>> 0;
	}
	return out;
}
function substractArrayInt64(out, arrayIntA, arrayIntB) {
	var lowA = arrayIntA.data[1];
	var highA = arrayIntA.data[0];
	var signA = arrayIntA.sign;
	var lowB = arrayIntB.data[1];
	var highB = arrayIntB.data[0];
	var signB = arrayIntB.sign;
	out.sign = 1;
	if (signA === 1 && signB === -1) {
		var low_1 = lowA + lowB;
		var high = highA + highB + (low_1 > 4294967295 ? 1 : 0);
		out.data[0] = high >>> 0;
		out.data[1] = low_1 >>> 0;
		return out;
	}
	var lowFirst = lowA;
	var highFirst = highA;
	var lowSecond = lowB;
	var highSecond = highB;
	if (signA === -1) {
		lowFirst = lowB;
		highFirst = highB;
		lowSecond = lowA;
		highSecond = highA;
	}
	var reminderLow = 0;
	var low = lowFirst - lowSecond;
	if (low < 0) {
		reminderLow = 1;
		low = low >>> 0;
	}
	out.data[0] = highFirst - highSecond - reminderLow;
	out.data[1] = low;
	return out;
}
function unsafeUniformArrayIntDistributionInternal(out, rangeSize, rng) {
	var rangeLength = rangeSize.length;
	while (true) {
		for (var index = 0; index !== rangeLength; ++index) out[index] = unsafeUniformIntDistributionInternal(index === 0 ? rangeSize[0] + 1 : 4294967296, rng);
		for (var index = 0; index !== rangeLength; ++index) {
			var current = out[index];
			var currentInRange = rangeSize[index];
			if (current < currentInRange) return out;
			else if (current > currentInRange) break;
		}
	}
}
var safeNumberMaxSafeInteger = Number.MAX_SAFE_INTEGER;
var sharedA = {
	sign: 1,
	data: [0, 0]
};
var sharedB = {
	sign: 1,
	data: [0, 0]
};
var sharedC = {
	sign: 1,
	data: [0, 0]
};
var sharedData = [0, 0];
function uniformLargeIntInternal(from, to, rangeSize, rng) {
	var rangeSizeArrayIntValue = rangeSize <= safeNumberMaxSafeInteger ? fromNumberToArrayInt64(sharedC, rangeSize) : substractArrayInt64(sharedC, fromNumberToArrayInt64(sharedA, to), fromNumberToArrayInt64(sharedB, from));
	if (rangeSizeArrayIntValue.data[1] === 4294967295) {
		rangeSizeArrayIntValue.data[0] += 1;
		rangeSizeArrayIntValue.data[1] = 0;
	} else rangeSizeArrayIntValue.data[1] += 1;
	unsafeUniformArrayIntDistributionInternal(sharedData, rangeSizeArrayIntValue.data, rng);
	return sharedData[0] * 4294967296 + sharedData[1] + from;
}
function unsafeUniformIntDistribution(from, to, rng) {
	var rangeSize = to - from;
	if (rangeSize <= 4294967295) return unsafeUniformIntDistributionInternal(rangeSize + 1, rng) + from;
	return uniformLargeIntInternal(from, to, rangeSize, rng);
}
var XoroShiro128Plus = (function() {
	function XoroShiro128Plus2(s01, s00, s11, s10) {
		this.s01 = s01;
		this.s00 = s00;
		this.s11 = s11;
		this.s10 = s10;
	}
	XoroShiro128Plus2.prototype.clone = function() {
		return new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
	};
	XoroShiro128Plus2.prototype.next = function() {
		var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
		return [nextRng.unsafeNext(), nextRng];
	};
	XoroShiro128Plus2.prototype.unsafeNext = function() {
		var out = this.s00 + this.s10 | 0;
		var a0 = this.s10 ^ this.s00;
		var a1 = this.s11 ^ this.s01;
		var s00 = this.s00;
		var s01 = this.s01;
		this.s00 = s00 << 24 ^ s01 >>> 8 ^ a0 ^ a0 << 16;
		this.s01 = s01 << 24 ^ s00 >>> 8 ^ a1 ^ (a1 << 16 | a0 >>> 16);
		this.s10 = a1 << 5 ^ a0 >>> 27;
		this.s11 = a0 << 5 ^ a1 >>> 27;
		return out;
	};
	XoroShiro128Plus2.prototype.jump = function() {
		var nextRng = new XoroShiro128Plus2(this.s01, this.s00, this.s11, this.s10);
		nextRng.unsafeJump();
		return nextRng;
	};
	XoroShiro128Plus2.prototype.unsafeJump = function() {
		var ns01 = 0;
		var ns00 = 0;
		var ns11 = 0;
		var ns10 = 0;
		var jump = [
			3639956645,
			3750757012,
			1261568508,
			386426335
		];
		for (var i = 0; i !== 4; ++i) for (var mask = 1; mask; mask <<= 1) {
			if (jump[i] & mask) {
				ns01 ^= this.s01;
				ns00 ^= this.s00;
				ns11 ^= this.s11;
				ns10 ^= this.s10;
			}
			this.unsafeNext();
		}
		this.s01 = ns01;
		this.s00 = ns00;
		this.s11 = ns11;
		this.s10 = ns10;
	};
	XoroShiro128Plus2.prototype.getState = function() {
		return [
			this.s01,
			this.s00,
			this.s11,
			this.s10
		];
	};
	return XoroShiro128Plus2;
})();
function fromState(state) {
	if (!(state.length === 4)) throw new Error("The state must have been produced by a xoroshiro128plus RandomGenerator");
	return new XoroShiro128Plus(state[0], state[1], state[2], state[3]);
}
var xoroshiro128plus = Object.assign(function(seed) {
	return new XoroShiro128Plus(-1, ~seed, seed | 0, 0);
}, { fromState });
var { asUintN } = BigInt;
function pcg32(state) {
	state = asUintN(64, state * 6364136223846793005n + 11634580027462260723n);
	const xorshifted = Number(asUintN(32, (state >> 18n ^ state) >> 27n));
	const rot = Number(asUintN(32, state >> 59n));
	return xorshifted >> rot | xorshifted << 32 - rot;
}
function generateFloat64(rng) {
	const g1 = unsafeUniformIntDistribution(0, (1 << 26) - 1, rng);
	const g2 = unsafeUniformIntDistribution(0, (1 << 27) - 1, rng);
	return (g1 * Math.pow(2, 27) + g2) * Math.pow(2, -53);
}
function makeRandom(seed) {
	const rng = xoroshiro128plus(pcg32(seed.microsSinceUnixEpoch));
	const random = () => generateFloat64(rng);
	random.fill = (array) => {
		const elem = array.at(0);
		if (typeof elem === "bigint") {
			const upper = (1n << BigInt(array.BYTES_PER_ELEMENT * 8)) - 1n;
			for (let i = 0; i < array.length; i++) array[i] = unsafeUniformBigIntDistribution(0n, upper, rng);
		} else if (typeof elem === "number") {
			const upper = (1 << array.BYTES_PER_ELEMENT * 8) - 1;
			for (let i = 0; i < array.length; i++) array[i] = unsafeUniformIntDistribution(0, upper, rng);
		}
		return array;
	};
	random.uint32 = () => rng.unsafeNext();
	random.integerInRange = (min, max) => unsafeUniformIntDistribution(min, max, rng);
	random.bigintInRange = (min, max) => unsafeUniformBigIntDistribution(min, max, rng);
	return random;
}
var { freeze } = Object;
var sys = _syscalls2_0;
function parseJsonObject(json) {
	let value;
	try {
		value = JSON.parse(json);
	} catch {
		throw new Error("Invalid JSON: failed to parse string");
	}
	if (value === null || typeof value !== "object" || Array.isArray(value)) throw new Error("Expected a JSON object at the top level");
	return value;
}
var JwtClaimsImpl = class {
	/**
	* Creates a new JwtClaims instance.
	* @param rawPayload The JWT payload as a raw JSON string.
	* @param identity The identity for this JWT. We are only taking this because we don't have a blake3 implementation (which we need to compute it).
	*/
	constructor(rawPayload, identity) {
		this.rawPayload = rawPayload;
		this.fullPayload = parseJsonObject(rawPayload);
		this._identity = identity;
	}
	fullPayload;
	_identity;
	get identity() {
		return this._identity;
	}
	get subject() {
		return this.fullPayload["sub"];
	}
	get issuer() {
		return this.fullPayload["iss"];
	}
	get audience() {
		const aud = this.fullPayload["aud"];
		if (aud == null) return [];
		return typeof aud === "string" ? [aud] : aud;
	}
};
var AuthCtxImpl = class _AuthCtxImpl {
	isInternal;
	_jwtSource;
	_initializedJWT = false;
	_jwtClaims;
	_senderIdentity;
	constructor(opts) {
		this.isInternal = opts.isInternal;
		this._jwtSource = opts.jwtSource;
		this._senderIdentity = opts.senderIdentity;
	}
	_initializeJWT() {
		if (this._initializedJWT) return;
		this._initializedJWT = true;
		const token = this._jwtSource();
		if (!token) this._jwtClaims = null;
		else this._jwtClaims = new JwtClaimsImpl(token, this._senderIdentity);
		Object.freeze(this);
	}
	/** Lazily compute whether a JWT exists and is parseable. */
	get hasJWT() {
		this._initializeJWT();
		return this._jwtClaims !== null;
	}
	/** Lazily parse the JwtClaims only when accessed. */
	get jwt() {
		this._initializeJWT();
		return this._jwtClaims;
	}
	/** Create a context representing internal (non-user) requests. */
	static internal() {
		return new _AuthCtxImpl({
			isInternal: true,
			jwtSource: () => null,
			senderIdentity: Identity.zero()
		});
	}
	/** If there is a connection id, look up the JWT payload from the system tables. */
	static fromSystemTables(connectionId, sender) {
		if (connectionId === null) return new _AuthCtxImpl({
			isInternal: false,
			jwtSource: () => null,
			senderIdentity: sender
		});
		return new _AuthCtxImpl({
			isInternal: false,
			jwtSource: () => {
				const payloadBuf = sys.get_jwt_payload(connectionId.__connection_id__);
				if (payloadBuf.length === 0) return null;
				return new TextDecoder().decode(payloadBuf);
			},
			senderIdentity: sender
		});
	}
};
var ReducerCtxImpl = class ReducerCtx {
	#identity;
	#senderAuth;
	#uuidCounter;
	#random;
	sender;
	timestamp;
	connectionId;
	db;
	constructor(sender, timestamp, connectionId, dbView) {
		Object.seal(this);
		this.sender = sender;
		this.timestamp = timestamp;
		this.connectionId = connectionId;
		this.db = dbView;
	}
	/** Reset the `ReducerCtx` to be used for a new transaction */
	static reset(me, sender, timestamp, connectionId) {
		me.sender = sender;
		me.timestamp = timestamp;
		me.connectionId = connectionId;
		me.#uuidCounter = void 0;
		me.#senderAuth = void 0;
	}
	get identity() {
		return this.#identity ??= new Identity(sys.identity());
	}
	get senderAuth() {
		return this.#senderAuth ??= AuthCtxImpl.fromSystemTables(this.connectionId, this.sender);
	}
	get random() {
		return this.#random ??= makeRandom(this.timestamp);
	}
	/**
	* Create a new random {@link Uuid} `v4` using this `ReducerCtx`'s RNG.
	*/
	newUuidV4() {
		const bytes = this.random.fill(new Uint8Array(16));
		return Uuid.fromRandomBytesV4(bytes);
	}
	/**
	* Create a new sortable {@link Uuid} `v7` using this `ReducerCtx`'s RNG, counter,
	* and timestamp.
	*/
	newUuidV7() {
		const bytes = this.random.fill(new Uint8Array(4));
		const counter = this.#uuidCounter ??= { value: 0 };
		return Uuid.fromCounterV7(counter, this.timestamp, bytes);
	}
};
var callUserFunction = function __spacetimedb_end_short_backtrace(fn, ...args) {
	return fn(...args);
};
var makeHooks = (schema2) => new ModuleHooksImpl(schema2);
var ModuleHooksImpl = class {
	#schema;
	#dbView_;
	#reducerArgsDeserializers;
	/** Cache the `ReducerCtx` object to avoid allocating anew for ever reducer call. */
	#reducerCtx_;
	constructor(schema2) {
		this.#schema = schema2;
		this.#reducerArgsDeserializers = schema2.moduleDef.reducers.map(({ params }) => ProductType.makeDeserializer(params, schema2.typespace));
	}
	get #dbView() {
		return this.#dbView_ ??= freeze(Object.fromEntries(Object.values(this.#schema.schemaType.tables).map((table2) => [table2.accessorName, makeTableView(this.#schema.typespace, table2.tableDef)])));
	}
	get #reducerCtx() {
		return this.#reducerCtx_ ??= new ReducerCtxImpl(Identity.zero(), Timestamp.UNIX_EPOCH, null, this.#dbView);
	}
	__describe_module__() {
		const writer = new BinaryWriter(128);
		RawModuleDef.serialize(writer, RawModuleDef.V10(this.#schema.rawModuleDefV10()));
		return writer.getBuffer();
	}
	__get_error_constructor__(code) {
		return getErrorConstructor(code);
	}
	get __sender_error_class__() {
		return SenderError;
	}
	__call_reducer__(reducerId, sender, connId, timestamp, argsBuf) {
		const moduleCtx = this.#schema;
		const deserializeArgs = this.#reducerArgsDeserializers[reducerId];
		BINARY_READER.reset(argsBuf);
		const args = deserializeArgs(BINARY_READER);
		const senderIdentity = new Identity(sender);
		const ctx = this.#reducerCtx;
		ReducerCtxImpl.reset(ctx, senderIdentity, new Timestamp(timestamp), ConnectionId.nullIfZero(new ConnectionId(connId)));
		callUserFunction(moduleCtx.reducers[reducerId], ctx, args);
	}
	__call_view__(id, sender, argsBuf) {
		const moduleCtx = this.#schema;
		const { fn, deserializeParams, serializeReturn, returnTypeBaseSize } = moduleCtx.views[id];
		const ret = callUserFunction(fn, freeze({
			sender: new Identity(sender),
			db: this.#dbView,
			from: makeQueryBuilder(moduleCtx.schemaType)
		}), deserializeParams(new BinaryReader(argsBuf)));
		const retBuf = new BinaryWriter(returnTypeBaseSize);
		if (isRowTypedQuery(ret)) {
			const query = toSql(ret);
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RawSql(query));
		} else {
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RowData);
			serializeReturn(retBuf, ret);
		}
		return { data: retBuf.getBuffer() };
	}
	__call_view_anon__(id, argsBuf) {
		const moduleCtx = this.#schema;
		const { fn, deserializeParams, serializeReturn, returnTypeBaseSize } = moduleCtx.anonViews[id];
		const ret = callUserFunction(fn, freeze({
			db: this.#dbView,
			from: makeQueryBuilder(moduleCtx.schemaType)
		}), deserializeParams(new BinaryReader(argsBuf)));
		const retBuf = new BinaryWriter(returnTypeBaseSize);
		if (isRowTypedQuery(ret)) {
			const query = toSql(ret);
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RawSql(query));
		} else {
			ViewResultHeader.serialize(retBuf, ViewResultHeader.RowData);
			serializeReturn(retBuf, ret);
		}
		return { data: retBuf.getBuffer() };
	}
	__call_procedure__(id, sender, connection_id, timestamp, args) {
		return callProcedure(this.#schema, id, new Identity(sender), ConnectionId.nullIfZero(new ConnectionId(connection_id)), new Timestamp(timestamp), args, () => this.#dbView);
	}
};
var BINARY_WRITER = new BinaryWriter(0);
var BINARY_READER = new BinaryReader(new Uint8Array());
function makeTableView(typespace, table2) {
	const table_id = sys.table_id_from_name(table2.sourceName);
	const rowType = typespace.types[table2.productTypeRef];
	if (rowType.tag !== "Product") throw "impossible";
	const serializeRow = AlgebraicType.makeSerializer(rowType, typespace);
	const deserializeRow = AlgebraicType.makeDeserializer(rowType, typespace);
	const sequences = table2.sequences.map((seq) => {
		const col = rowType.value.elements[seq.column];
		const colType = col.algebraicType;
		let sequenceTrigger;
		switch (colType.tag) {
			case "U8":
			case "I8":
			case "U16":
			case "I16":
			case "U32":
			case "I32":
				sequenceTrigger = 0;
				break;
			case "U64":
			case "I64":
			case "U128":
			case "I128":
			case "U256":
			case "I256":
				sequenceTrigger = 0n;
				break;
			default: throw new TypeError("invalid sequence type");
		}
		return {
			colName: col.name,
			sequenceTrigger,
			deserialize: AlgebraicType.makeDeserializer(colType, typespace)
		};
	});
	const hasAutoIncrement = sequences.length > 0;
	const iter = () => tableIterator(sys.datastore_table_scan_bsatn(table_id), deserializeRow);
	const integrateGeneratedColumns = hasAutoIncrement ? (row, ret_buf) => {
		BINARY_READER.reset(ret_buf);
		for (const { colName, deserialize, sequenceTrigger } of sequences) if (row[colName] === sequenceTrigger) row[colName] = deserialize(BINARY_READER);
	} : null;
	const tableMethods = {
		count: () => sys.datastore_table_row_count(table_id),
		iter,
		[Symbol.iterator]: () => iter(),
		insert: (row) => {
			const buf = LEAF_BUF;
			BINARY_WRITER.reset(buf);
			serializeRow(BINARY_WRITER, row);
			sys.datastore_insert_bsatn(table_id, buf.buffer, BINARY_WRITER.offset);
			const ret = { ...row };
			integrateGeneratedColumns?.(ret, buf.view);
			return ret;
		},
		delete: (row) => {
			const buf = LEAF_BUF;
			BINARY_WRITER.reset(buf);
			BINARY_WRITER.writeU32(1);
			serializeRow(BINARY_WRITER, row);
			return sys.datastore_delete_all_by_eq_bsatn(table_id, buf.buffer, BINARY_WRITER.offset) > 0;
		}
	};
	const tableView = Object.assign(/* @__PURE__ */ Object.create(null), tableMethods);
	for (const indexDef of table2.indexes) {
		const accessorName = indexDef.accessorName;
		const index_id = sys.index_id_from_name(indexDef.sourceName);
		let column_ids;
		let isHashIndex = false;
		switch (indexDef.algorithm.tag) {
			case "Hash":
				isHashIndex = true;
				column_ids = indexDef.algorithm.value;
				break;
			case "BTree":
				column_ids = indexDef.algorithm.value;
				break;
			case "Direct":
				column_ids = [indexDef.algorithm.value];
				break;
		}
		const numColumns = column_ids.length;
		const columnSet = new Set(column_ids);
		const isUnique = table2.constraints.filter((x) => x.data.tag === "Unique").some((x) => columnSet.isSubsetOf(new Set(x.data.value.columns)));
		const isPrimaryKey = isUnique && column_ids.length === table2.primaryKey.length && column_ids.every((id, i) => table2.primaryKey[i] === id);
		const indexSerializers = column_ids.map((id) => AlgebraicType.makeSerializer(rowType.value.elements[id].algebraicType, typespace));
		const serializePoint = (buffer, colVal) => {
			BINARY_WRITER.reset(buffer);
			for (let i = 0; i < numColumns; i++) indexSerializers[i](BINARY_WRITER, colVal[i]);
			return BINARY_WRITER.offset;
		};
		const serializeSingleElement = numColumns === 1 ? indexSerializers[0] : null;
		const serializeSinglePoint = serializeSingleElement && ((buffer, colVal) => {
			BINARY_WRITER.reset(buffer);
			serializeSingleElement(BINARY_WRITER, colVal);
			return BINARY_WRITER.offset;
		});
		let index;
		if (isUnique && serializeSinglePoint) {
			const base = {
				find: (colVal) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, colVal);
					return tableIterateOne(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
				},
				delete: (colVal) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, colVal);
					return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len) > 0;
				}
			};
			if (isPrimaryKey) base.update = (row) => {
				const buf = LEAF_BUF;
				BINARY_WRITER.reset(buf);
				serializeRow(BINARY_WRITER, row);
				sys.datastore_update_bsatn(table_id, index_id, buf.buffer, BINARY_WRITER.offset);
				integrateGeneratedColumns?.(row, buf.view);
				return row;
			};
			index = base;
		} else if (isUnique) {
			const base = {
				find: (colVal) => {
					if (colVal.length !== numColumns) throw new TypeError("wrong number of elements");
					const buf = LEAF_BUF;
					const point_len = serializePoint(buf, colVal);
					return tableIterateOne(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
				},
				delete: (colVal) => {
					if (colVal.length !== numColumns) throw new TypeError("wrong number of elements");
					const buf = LEAF_BUF;
					const point_len = serializePoint(buf, colVal);
					return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len) > 0;
				}
			};
			if (isPrimaryKey) base.update = (row) => {
				const buf = LEAF_BUF;
				BINARY_WRITER.reset(buf);
				serializeRow(BINARY_WRITER, row);
				sys.datastore_update_bsatn(table_id, index_id, buf.buffer, BINARY_WRITER.offset);
				integrateGeneratedColumns?.(row, buf.view);
				return row;
			};
			index = base;
		} else if (serializeSinglePoint) {
			const rawIndex = {
				filter: (range) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, range);
					return tableIterator(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
				},
				delete: (range) => {
					const buf = LEAF_BUF;
					const point_len = serializeSinglePoint(buf, range);
					return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len);
				}
			};
			if (isHashIndex) index = rawIndex;
			else index = rawIndex;
		} else if (isHashIndex) index = {
			filter: (range) => {
				const buf = LEAF_BUF;
				const point_len = serializePoint(buf, range);
				return tableIterator(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
			},
			delete: (range) => {
				const buf = LEAF_BUF;
				const point_len = serializePoint(buf, range);
				return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len);
			}
		};
		else {
			const serializeRange = (buffer, range) => {
				if (range.length > numColumns) throw new TypeError("too many elements");
				BINARY_WRITER.reset(buffer);
				const writer = BINARY_WRITER;
				const prefix_elems = range.length - 1;
				for (let i = 0; i < prefix_elems; i++) indexSerializers[i](writer, range[i]);
				const rstartOffset = writer.offset;
				const term = range[range.length - 1];
				const serializeTerm = indexSerializers[range.length - 1];
				if (term instanceof Range) {
					const writeBound = (bound) => {
						writer.writeU8({
							included: 0,
							excluded: 1,
							unbounded: 2
						}[bound.tag]);
						if (bound.tag !== "unbounded") serializeTerm(writer, bound.value);
					};
					writeBound(term.from);
					const rstartLen = writer.offset - rstartOffset;
					writeBound(term.to);
					return [
						rstartOffset,
						prefix_elems,
						rstartLen,
						writer.offset - rstartLen
					];
				} else {
					writer.writeU8(0);
					serializeTerm(writer, term);
					return [
						rstartOffset,
						prefix_elems,
						writer.offset,
						0
					];
				}
			};
			index = {
				filter: (range) => {
					if (range.length === numColumns) {
						const buf = LEAF_BUF;
						const point_len = serializePoint(buf, range);
						return tableIterator(sys.datastore_index_scan_point_bsatn(index_id, buf.buffer, point_len), deserializeRow);
					} else {
						const buf = LEAF_BUF;
						const args = serializeRange(buf, range);
						return tableIterator(sys.datastore_index_scan_range_bsatn(index_id, buf.buffer, ...args), deserializeRow);
					}
				},
				delete: (range) => {
					if (range.length === numColumns) {
						const buf = LEAF_BUF;
						const point_len = serializePoint(buf, range);
						return sys.datastore_delete_by_index_scan_point_bsatn(index_id, buf.buffer, point_len);
					} else {
						const buf = LEAF_BUF;
						const args = serializeRange(buf, range);
						return sys.datastore_delete_by_index_scan_range_bsatn(index_id, buf.buffer, ...args);
					}
				}
			};
		}
		if (Object.hasOwn(tableView, accessorName)) freeze(Object.assign(tableView[accessorName], index));
		else tableView[accessorName] = freeze(index);
	}
	return freeze(tableView);
}
function* tableIterator(id, deserialize) {
	using iter = new IteratorHandle(id);
	const iterBuf = takeBuf();
	try {
		let amt;
		while (amt = iter.advance(iterBuf)) {
			const reader = new BinaryReader(iterBuf.view);
			while (reader.offset < amt) yield deserialize(reader);
		}
	} finally {
		returnBuf(iterBuf);
	}
}
function tableIterateOne(id, deserialize) {
	const buf = LEAF_BUF;
	if (advanceIterRaw(id, buf) !== 0) {
		BINARY_READER.reset(buf.view);
		return deserialize(BINARY_READER);
	}
	return null;
}
function advanceIterRaw(id, buf) {
	while (true) try {
		return 0 | sys.row_iter_bsatn_advance(id, buf.buffer);
	} catch (e) {
		if (e && typeof e === "object" && hasOwn(e, "__buffer_too_small__")) {
			buf.grow(e.__buffer_too_small__);
			continue;
		}
		throw e;
	}
}
var DEFAULT_BUFFER_CAPACITY = 32 * 1024 * 2;
var ITER_BUFS = [new ResizableBuffer(DEFAULT_BUFFER_CAPACITY)];
var ITER_BUF_COUNT = 1;
function takeBuf() {
	return ITER_BUF_COUNT ? ITER_BUFS[--ITER_BUF_COUNT] : new ResizableBuffer(DEFAULT_BUFFER_CAPACITY);
}
function returnBuf(buf) {
	ITER_BUFS[ITER_BUF_COUNT++] = buf;
}
var LEAF_BUF = new ResizableBuffer(DEFAULT_BUFFER_CAPACITY);
var IteratorHandle = class _IteratorHandle {
	#id;
	static #finalizationRegistry = new FinalizationRegistry(sys.row_iter_bsatn_close);
	constructor(id) {
		this.#id = id;
		_IteratorHandle.#finalizationRegistry.register(this, id, this);
	}
	/** Unregister this object with the finalization registry and return the id */
	#detach() {
		const id = this.#id;
		this.#id = -1;
		_IteratorHandle.#finalizationRegistry.unregister(this);
		return id;
	}
	/** Call `row_iter_bsatn_advance`, returning 0 if this iterator has been exhausted. */
	advance(buf) {
		if (this.#id === -1) return 0;
		const ret = advanceIterRaw(this.#id, buf);
		if (ret <= 0) this.#detach();
		return ret < 0 ? -ret : ret;
	}
	[Symbol.dispose]() {
		if (this.#id >= 0) {
			const id = this.#detach();
			sys.row_iter_bsatn_close(id);
		}
	}
};
var { freeze: freeze2 } = Object;
var textEncoder = new TextEncoder();
var textDecoder = new TextDecoder("utf-8");
var makeResponse = Symbol("makeResponse");
var SyncResponse = class _SyncResponse {
	#body;
	#inner;
	constructor(body, init) {
		if (body == null) this.#body = null;
		else if (typeof body === "string") this.#body = body;
		else this.#body = new Uint8Array(body).buffer;
		this.#inner = {
			headers: new Headers(init?.headers),
			status: init?.status ?? 200,
			statusText: init?.statusText ?? "",
			type: "default",
			url: null,
			aborted: false
		};
	}
	static [makeResponse](body, inner) {
		const me = new _SyncResponse(body);
		me.#inner = inner;
		return me;
	}
	get headers() {
		return this.#inner.headers;
	}
	get status() {
		return this.#inner.status;
	}
	get statusText() {
		return this.#inner.statusText;
	}
	get ok() {
		return 200 <= this.#inner.status && this.#inner.status <= 299;
	}
	get url() {
		return this.#inner.url ?? "";
	}
	get type() {
		return this.#inner.type;
	}
	arrayBuffer() {
		return this.bytes().buffer;
	}
	bytes() {
		if (this.#body == null) return new Uint8Array();
		else if (typeof this.#body === "string") return textEncoder.encode(this.#body);
		else return new Uint8Array(this.#body);
	}
	json() {
		return JSON.parse(this.text());
	}
	text() {
		if (this.#body == null) return "";
		else if (typeof this.#body === "string") return this.#body;
		else return textDecoder.decode(this.#body);
	}
};
var requestBaseSize = bsatnBaseSize({ types: [] }, HttpRequest.algebraicType);
var methods = /* @__PURE__ */ new Map([
	["GET", { tag: "Get" }],
	["HEAD", { tag: "Head" }],
	["POST", { tag: "Post" }],
	["PUT", { tag: "Put" }],
	["DELETE", { tag: "Delete" }],
	["CONNECT", { tag: "Connect" }],
	["OPTIONS", { tag: "Options" }],
	["TRACE", { tag: "Trace" }],
	["PATCH", { tag: "Patch" }]
]);
function fetch(url, init = {}) {
	const method = methods.get(init.method?.toUpperCase() ?? "GET") ?? {
		tag: "Extension",
		value: init.method
	};
	const headers = { entries: headersToList(new Headers(init.headers)).flatMap(([k, v]) => Array.isArray(v) ? v.map((v2) => [k, v2]) : [[k, v]]).map(([name, value]) => ({
		name,
		value: textEncoder.encode(value)
	})) };
	const uri = "" + url;
	const request = freeze2({
		method,
		headers,
		timeout: init.timeout,
		uri,
		version: { tag: "Http11" }
	});
	const requestBuf = new BinaryWriter(requestBaseSize);
	HttpRequest.serialize(requestBuf, request);
	const body = init.body == null ? new Uint8Array() : typeof init.body === "string" ? init.body : new Uint8Array(init.body);
	const [responseBuf, responseBody] = sys.procedure_http_request(requestBuf.getBuffer(), body);
	const response = HttpResponse.deserialize(new BinaryReader(responseBuf));
	return SyncResponse[makeResponse](responseBody, {
		type: "basic",
		url: uri,
		status: response.code,
		statusText: (0, import_statuses.default)(response.code),
		headers: new Headers(),
		aborted: false
	});
}
freeze2(fetch);
var httpClient = freeze2({ fetch });
function makeProcedureExport(ctx, opts, params, ret, fn) {
	const name = opts?.name;
	const procedureExport = (...args) => fn(...args);
	procedureExport[exportContext] = ctx;
	procedureExport[registerExport] = (ctx2, exportName) => {
		registerProcedure(ctx2, name ?? exportName, params, ret, fn);
		ctx2.functionExports.set(procedureExport, name ?? exportName);
	};
	return procedureExport;
}
var TransactionCtxImpl = class TransactionCtx extends ReducerCtxImpl {};
function registerProcedure(ctx, exportName, params, ret, fn, opts) {
	ctx.defineFunction(exportName);
	const paramsType = { elements: Object.entries(params).map(([n, c]) => ({
		name: n,
		algebraicType: ctx.registerTypesRecursively("typeBuilder" in c ? c.typeBuilder : c).algebraicType
	})) };
	const returnType = ctx.registerTypesRecursively(ret).algebraicType;
	ctx.moduleDef.procedures.push({
		sourceName: exportName,
		params: paramsType,
		returnType,
		visibility: FunctionVisibility.ClientCallable
	});
	const { typespace } = ctx;
	ctx.procedures.push({
		fn,
		deserializeArgs: ProductType.makeDeserializer(paramsType, typespace),
		serializeReturn: AlgebraicType.makeSerializer(returnType, typespace),
		returnTypeBaseSize: bsatnBaseSize(typespace, returnType)
	});
}
function callProcedure(moduleCtx, id, sender, connectionId, timestamp, argsBuf, dbView) {
	const { fn, deserializeArgs, serializeReturn, returnTypeBaseSize } = moduleCtx.procedures[id];
	const args = deserializeArgs(new BinaryReader(argsBuf));
	const ret = callUserFunction(fn, new ProcedureCtxImpl(sender, timestamp, connectionId, dbView), args);
	const retBuf = new BinaryWriter(returnTypeBaseSize);
	serializeReturn(retBuf, ret);
	return retBuf.getBuffer();
}
var ProcedureCtxImpl = class ProcedureCtx {
	constructor(sender, timestamp, connectionId, dbView) {
		this.sender = sender;
		this.timestamp = timestamp;
		this.connectionId = connectionId;
		this.#dbView = dbView;
	}
	#identity;
	#uuidCounter;
	#random;
	#dbView;
	get identity() {
		return this.#identity ??= new Identity(sys.identity());
	}
	get random() {
		return this.#random ??= makeRandom(this.timestamp);
	}
	get http() {
		return httpClient;
	}
	withTx(body) {
		const run = () => {
			const timestamp = sys.procedure_start_mut_tx();
			try {
				return body(new TransactionCtxImpl(this.sender, new Timestamp(timestamp), this.connectionId, this.#dbView()));
			} catch (e) {
				sys.procedure_abort_mut_tx();
				throw e;
			}
		};
		let res = run();
		try {
			sys.procedure_commit_mut_tx();
			return res;
		} catch {}
		console.warn("committing anonymous transaction failed");
		res = run();
		try {
			sys.procedure_commit_mut_tx();
			return res;
		} catch (e) {
			throw new Error("transaction retry failed again", { cause: e });
		}
	}
	newUuidV4() {
		const bytes = this.random.fill(new Uint8Array(16));
		return Uuid.fromRandomBytesV4(bytes);
	}
	newUuidV7() {
		const bytes = this.random.fill(new Uint8Array(4));
		const counter = this.#uuidCounter ??= { value: 0 };
		return Uuid.fromCounterV7(counter, this.timestamp, bytes);
	}
};
function makeReducerExport(ctx, opts, params, fn, lifecycle) {
	const reducerExport = (...args) => fn(...args);
	reducerExport[exportContext] = ctx;
	reducerExport[registerExport] = (ctx2, exportName) => {
		registerReducer(ctx2, exportName, params, fn, opts, lifecycle);
		ctx2.functionExports.set(reducerExport, exportName);
	};
	return reducerExport;
}
function registerReducer(ctx, exportName, params, fn, opts, lifecycle) {
	ctx.defineFunction(exportName);
	if (!(params instanceof RowBuilder)) params = new RowBuilder(params);
	if (params.typeName === void 0) params.typeName = toPascalCase(exportName);
	const ref = ctx.registerTypesRecursively(params);
	const paramsType = ctx.resolveType(ref).value;
	const isLifecycle = lifecycle != null;
	ctx.moduleDef.reducers.push({
		sourceName: exportName,
		params: paramsType,
		visibility: FunctionVisibility.ClientCallable,
		okReturnType: AlgebraicType.Product({ elements: [] }),
		errReturnType: AlgebraicType.String
	});
	if (opts?.name != null) ctx.moduleDef.explicitNames.entries.push({
		tag: "Function",
		value: {
			sourceName: exportName,
			canonicalName: opts.name
		}
	});
	if (isLifecycle) ctx.moduleDef.lifeCycleReducers.push({
		lifecycleSpec: lifecycle,
		functionName: exportName
	});
	if (!fn.name) Object.defineProperty(fn, "name", {
		value: exportName,
		writable: false
	});
	ctx.reducers.push(fn);
}
var SchemaInner = class extends ModuleContext {
	schemaType;
	existingFunctions = /* @__PURE__ */ new Set();
	reducers = [];
	procedures = [];
	views = [];
	anonViews = [];
	/**
	* Maps ReducerExport objects to the name of the reducer.
	* Used for resolving the reducers of scheduled tables.
	*/
	functionExports = /* @__PURE__ */ new Map();
	pendingSchedules = [];
	constructor(getSchemaType) {
		super();
		this.schemaType = getSchemaType(this);
	}
	defineFunction(name) {
		if (this.existingFunctions.has(name)) throw new TypeError(`There is already a reducer or procedure with the name '${name}'`);
		this.existingFunctions.add(name);
	}
	resolveSchedules() {
		for (const { reducer, scheduleAtCol, tableName } of this.pendingSchedules) {
			const functionName = this.functionExports.get(reducer());
			if (functionName === void 0) {
				const msg = `Table ${tableName} defines a schedule, but it seems like the associated function was not exported.`;
				throw new TypeError(msg);
			}
			this.moduleDef.schedules.push({
				sourceName: void 0,
				tableName,
				scheduleAtCol,
				functionName
			});
		}
	}
};
var Schema = class {
	#ctx;
	constructor(ctx) {
		this.#ctx = ctx;
	}
	[moduleHooks](exports) {
		const registeredSchema = this.#ctx;
		for (const [name, moduleExport] of Object.entries(exports)) {
			if (name === "default") continue;
			if (!isModuleExport(moduleExport)) throw new TypeError("exporting something that is not a spacetime export");
			checkExportContext(moduleExport, registeredSchema);
			moduleExport[registerExport](registeredSchema, name);
		}
		registeredSchema.resolveSchedules();
		return makeHooks(registeredSchema);
	}
	get schemaType() {
		return this.#ctx.schemaType;
	}
	get moduleDef() {
		return this.#ctx.moduleDef;
	}
	get typespace() {
		return this.#ctx.typespace;
	}
	reducer(...args) {
		let opts, params = {}, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2: {
				let arg1;
				[arg1, fn] = args;
				if (typeof arg1.name === "string") opts = arg1;
				else params = arg1;
				break;
			}
			case 3:
				[opts, params, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, params, fn);
	}
	init(...args) {
		let opts, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2:
				[opts, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, {}, fn, Lifecycle.Init);
	}
	clientConnected(...args) {
		let opts, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2:
				[opts, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, {}, fn, Lifecycle.OnConnect);
	}
	clientDisconnected(...args) {
		let opts, fn;
		switch (args.length) {
			case 1:
				[fn] = args;
				break;
			case 2:
				[opts, fn] = args;
				break;
		}
		return makeReducerExport(this.#ctx, opts, {}, fn, Lifecycle.OnDisconnect);
	}
	view(opts, ret, fn) {
		return makeViewExport(this.#ctx, opts, {}, ret, fn);
	}
	anonymousView(opts, ret, fn) {
		return makeAnonViewExport(this.#ctx, opts, {}, ret, fn);
	}
	procedure(...args) {
		let opts, params = {}, ret, fn;
		switch (args.length) {
			case 2:
				[ret, fn] = args;
				break;
			case 3: {
				let arg1;
				[arg1, ret, fn] = args;
				if (typeof arg1.name === "string") opts = arg1;
				else params = arg1;
				break;
			}
			case 4:
				[opts, params, ret, fn] = args;
				break;
		}
		return makeProcedureExport(this.#ctx, opts, params, ret, fn);
	}
	/**
	* Bundle multiple reducers, procedures, etc into one value to export.
	* The name they will be exported with is their corresponding key in the `exports` argument.
	*/
	exportGroup(exports) {
		return {
			[exportContext]: this.#ctx,
			[registerExport](ctx, _exportName) {
				for (const [exportName, moduleExport] of Object.entries(exports)) {
					checkExportContext(moduleExport, ctx);
					moduleExport[registerExport](ctx, exportName);
				}
			}
		};
	}
	clientVisibilityFilter = { sql: (filter) => ({
		[exportContext]: this.#ctx,
		[registerExport](ctx, _exportName) {
			ctx.moduleDef.rowLevelSecurity.push({ sql: filter });
		}
	}) };
};
var registerExport = Symbol("SpacetimeDB.registerExport");
var exportContext = Symbol("SpacetimeDB.exportContext");
function isModuleExport(x) {
	return (typeof x === "function" || typeof x === "object") && x !== null && registerExport in x;
}
function checkExportContext(exp, schema2) {
	if (exp[exportContext] != null && exp[exportContext] !== schema2) throw new TypeError("multiple schemas are not supported");
}
function schema(tables, moduleSettings) {
	return new Schema(new SchemaInner((ctx2) => {
		if (moduleSettings?.CASE_CONVERSION_POLICY != null) ctx2.setCaseConversionPolicy(moduleSettings.CASE_CONVERSION_POLICY);
		const tableSchemas = {};
		for (const [accName, table2] of Object.entries(tables)) {
			const tableDef = table2.tableDef(ctx2, accName);
			tableSchemas[accName] = tableToSchema(accName, table2, tableDef);
			ctx2.moduleDef.tables.push(tableDef);
			if (table2.schedule) ctx2.pendingSchedules.push({
				...table2.schedule,
				tableName: tableDef.sourceName
			});
			if (table2.tableName) ctx2.moduleDef.explicitNames.entries.push({
				tag: "Table",
				value: {
					sourceName: accName,
					canonicalName: table2.tableName
				}
			});
		}
		return { tables: tableSchemas };
	}));
}
var import_object_inspect = __toESM(require_object_inspect());
var fmtLog = (...data) => data.map((x) => typeof x === "string" ? x : (0, import_object_inspect.default)(x)).join(" ");
var console_level_error = 0;
var console_level_warn = 1;
var console_level_info = 2;
var console_level_debug = 3;
var console_level_trace = 4;
var timerMap = /* @__PURE__ */ new Map();
var console2 = {
	__proto__: {},
	[Symbol.toStringTag]: "console",
	assert: (condition = false, ...data) => {
		if (!condition) sys.console_log(console_level_error, fmtLog(...data));
	},
	clear: () => {},
	debug: (...data) => {
		sys.console_log(console_level_debug, fmtLog(...data));
	},
	error: (...data) => {
		sys.console_log(console_level_error, fmtLog(...data));
	},
	info: (...data) => {
		sys.console_log(console_level_info, fmtLog(...data));
	},
	log: (...data) => {
		sys.console_log(console_level_info, fmtLog(...data));
	},
	table: (tabularData, _properties) => {
		sys.console_log(console_level_info, fmtLog(tabularData));
	},
	trace: (...data) => {
		sys.console_log(console_level_trace, fmtLog(...data));
	},
	warn: (...data) => {
		sys.console_log(console_level_warn, fmtLog(...data));
	},
	dir: (_item, _options) => {},
	dirxml: (..._data) => {},
	count: (_label = "default") => {},
	countReset: (_label = "default") => {},
	group: (..._data) => {},
	groupCollapsed: (..._data) => {},
	groupEnd: () => {},
	time: (label = "default") => {
		if (timerMap.has(label)) {
			sys.console_log(console_level_warn, `Timer '${label}' already exists.`);
			return;
		}
		timerMap.set(label, sys.console_timer_start(label));
	},
	timeLog: (label = "default", ...data) => {
		sys.console_log(console_level_info, fmtLog(label, ...data));
	},
	timeEnd: (label = "default") => {
		const spanId = timerMap.get(label);
		if (spanId === void 0) {
			sys.console_log(console_level_warn, `Timer '${label}' does not exist.`);
			return;
		}
		sys.console_timer_end(spanId);
		timerMap.delete(label);
	},
	timeStamp: () => {},
	profile: () => {},
	profileEnd: () => {}
};
globalThis.console = console2;

//#endregion
//#region C:/Users/PC/source/gitrepos/OM-main/spacetimedb/src/index.ts
const spacetimedb = schema({
	user: table({
		name: "user",
		public: true,
		indexes: []
	}, {
		identity: t.identity().primaryKey(),
		name: t.string().optional(),
		online: t.bool(),
		avatar: t.string().optional(),
		authMethod: t.string().optional(),
		lastIpAddress: t.string().optional()
	}),
	channel: table({
		name: "channel",
		public: true,
		indexes: []
	}, {
		id: t.u64().primaryKey().autoInc(),
		name: t.string(),
		description: t.string().optional(),
		type: t.string(),
		createdAt: t.timestamp(),
		createdBy: t.identity().optional()
	}),
	thread: table({
		name: "thread",
		public: true,
		indexes: [{
			accessor: "thread_by_channel",
			name: "thread_by_channel",
			algorithm: "btree",
			columns: ["channelId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		channelId: t.u64(),
		name: t.string(),
		createdAt: t.timestamp(),
		createdBy: t.identity().optional()
	}),
	message: table({
		name: "message",
		public: true,
		indexes: [{
			accessor: "message_by_sender",
			name: "message_by_sender",
			algorithm: "btree",
			columns: ["sender"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		sender: t.identity(),
		channelId: t.u64().optional(),
		threadId: t.u64().optional(),
		text: t.string(),
		sent: t.timestamp(),
		editedAt: t.timestamp().optional()
	}),
	channelMember: table({
		name: "channelMember",
		public: true,
		indexes: [{
			accessor: "channel_member_by_channel",
			name: "channel_member_by_channel",
			algorithm: "btree",
			columns: ["channelId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		channelId: t.u64(),
		userId: t.identity(),
		joinedAt: t.timestamp()
	}),
	emailCredential: table({
		name: "emailCredential",
		public: false,
		indexes: []
	}, {
		email: t.string().primaryKey(),
		passwordHash: t.string(),
		identity: t.identity(),
		createdAt: t.timestamp()
	}),
	googleAuth: table({
		name: "googleAuth",
		public: false,
		indexes: []
	}, {
		googleId: t.string().primaryKey(),
		identity: t.identity(),
		email: t.string().optional(),
		name: t.string().optional(),
		avatar: t.string().optional(),
		createdAt: t.timestamp()
	}),
	voiceRoom: table({
		name: "voiceRoom",
		public: true,
		indexes: [{
			accessor: "voice_room_by_channel",
			name: "voice_room_by_channel",
			algorithm: "btree",
			columns: ["channelId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		channelId: t.u64(),
		createdAt: t.timestamp()
	}),
	voiceParticipant: table({
		name: "voiceParticipant",
		public: true,
		indexes: [{
			accessor: "voice_participant_by_room",
			name: "voice_participant_by_room",
			algorithm: "btree",
			columns: ["roomId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		roomId: t.u64(),
		userId: t.identity(),
		muted: t.bool(),
		deafened: t.bool(),
		joinedAt: t.timestamp()
	}),
	voiceSignaling: table({
		name: "voiceSignaling",
		public: true,
		indexes: [{
			accessor: "voice_signaling_by_room",
			name: "voice_signaling_by_room",
			algorithm: "btree",
			columns: ["roomId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		roomId: t.u64(),
		fromUserId: t.identity(),
		toUserId: t.identity(),
		signalType: t.string(),
		signalData: t.string(),
		createdAt: t.timestamp()
	}),
	voiceRecordingChunk: table({
		name: "voiceRecordingChunk",
		public: true,
		indexes: [{
			accessor: "voice_recording_by_room",
			name: "voice_recording_by_room",
			algorithm: "btree",
			columns: ["roomId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		roomId: t.u64(),
		channelId: t.u64(),
		chunkIndex: t.u64(),
		dataBase64: t.string(),
		recordedBy: t.identity(),
		createdAt: t.timestamp()
	}),
	role: table({
		name: "role",
		public: true,
		indexes: []
	}, {
		id: t.u64().primaryKey().autoInc(),
		channelId: t.u64().optional(),
		name: t.string(),
		color: t.string().optional(),
		permissions: t.u64(),
		position: t.u64(),
		createdAt: t.timestamp(),
		createdBy: t.identity().optional()
	}),
	roleMember: table({
		name: "roleMember",
		public: true,
		indexes: [{
			accessor: "role_member_by_role",
			name: "role_member_by_role",
			algorithm: "btree",
			columns: ["roleId"]
		}]
	}, {
		id: t.u64().primaryKey().autoInc(),
		roleId: t.u64(),
		userId: t.identity(),
		assignedAt: t.timestamp(),
		assignedBy: t.identity().optional()
	}),
	replacedIdentity: table({
		name: "replacedIdentity",
		public: true,
		indexes: []
	}, {
		oldIdentity: t.identity().primaryKey(),
		newIdentity: t.identity(),
		replacedAt: t.timestamp()
	}),
	identityLink: table({
		name: "identityLink",
		public: false,
		indexes: [{
			accessor: "accountIdentity",
			name: "identity_link_by_account",
			algorithm: "btree",
			columns: ["accountIdentity"]
		}]
	}, {
		sessionIdentity: t.identity().primaryKey(),
		accountIdentity: t.identity(),
		linkedAt: t.timestamp()
	}),
	activeSession: table({
		name: "activeSession",
		public: false,
		indexes: []
	}, {
		sessionIdentity: t.identity().primaryKey(),
		connectedAt: t.timestamp()
	})
});
const Permissions = {
	CREATE_CHANNEL: 1n << 0n,
	DELETE_CHANNEL: 1n << 1n,
	MANAGE_CHANNEL: 1n << 2n,
	SEND_MESSAGE: 1n << 3n,
	EDIT_MESSAGE: 1n << 4n,
	DELETE_MESSAGE: 1n << 5n,
	KICK_USER: 1n << 6n,
	BAN_USER: 1n << 7n,
	ADD_USER: 1n << 8n,
	REMOVE_USER: 1n << 9n,
	MANAGE_ROLES: 1n << 10n,
	ASSIGN_ROLES: 1n << 11n,
	JOIN_VOICE: 1n << 12n,
	SPEAK_IN_VOICE: 1n << 13n,
	MUTE_OTHERS: 1n << 14n,
	ADMIN: 1n << 63n
};
function checkPermission(userPermissions, permission) {
	if ((userPermissions & Permissions.ADMIN) !== 0n) return true;
	return (userPermissions & permission) !== 0n;
}
function getUserChannelPermissions(ctx, userId, channelId) {
	let permissions = 0n;
	const userRoles = [...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(userId));
	const channelRoles = [...ctx.db.role.iter()].filter((r) => !r.channelId || r.channelId === channelId);
	userRoles.map((rm) => channelRoles.find((r) => r.id === rm.roleId)).filter((r) => r !== void 0).sort((a, b) => {
		if (!a || !b) return 0;
		return a.position > b.position ? -1 : a.position < b.position ? 1 : 0;
	}).forEach((role) => {
		if (role) permissions |= role.permissions;
	});
	if ([...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId).some((m) => m.userId.isEqual(userId))) {
		permissions |= Permissions.SEND_MESSAGE;
		permissions |= Permissions.JOIN_VOICE;
		permissions |= Permissions.SPEAK_IN_VOICE;
	}
	return permissions;
}
function validateName(name) {
	if (!name || name.trim().length === 0) throw new SenderError("Names must not be empty");
	if (name.length > 32) throw new SenderError("Names must be 32 characters or less");
}
function validateMessage(text) {
	if (!text || text.trim().length === 0) throw new SenderError("Messages must not be empty");
	if (text.length > 2e3) throw new SenderError("Messages must be 2000 characters or less");
}
function validateChannelName(name) {
	if (!name || name.trim().length === 0) throw new SenderError("Channel names must not be empty");
	if (name.length > 100) throw new SenderError("Channel names must be 100 characters or less");
}
function validateEmail(email) {
	if (!email || email.trim().length === 0) throw new SenderError("Email must not be empty");
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new SenderError("Invalid email format");
	if (email.length > 255) throw new SenderError("Email must be 255 characters or less");
}
function validatePassword(password) {
	if (!password || password.length === 0) throw new SenderError("Password must not be empty");
	if (password.length < 6) throw new SenderError("Password must be at least 6 characters");
	if (password.length > 128) throw new SenderError("Password must be 128 characters or less");
}
function hashPassword(password) {
	let hash = 0;
	for (let i = 0; i < password.length; i++) {
		const char = password.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash;
	}
	return hash.toString(36);
}
function verifyPassword(password, hash) {
	return hashPassword(password) === hash;
}
const set_name = spacetimedb.reducer({ name: t.string() }, (ctx, { name }) => {
	validateName(name);
	const user = ctx.db.user.identity.find(ctx.sender);
	if (!user) throw new SenderError("Cannot set name for unknown user");
	console.info(`User ${ctx.sender} sets name to ${name}`);
	ctx.db.user.identity.update({
		identity: user.identity,
		name,
		online: user.online,
		avatar: user.avatar,
		authMethod: user.authMethod,
		lastIpAddress: user.lastIpAddress
	});
});
const create_channel = spacetimedb.reducer({
	name: t.string(),
	description: t.string().optional(),
	type: t.string()
}, (ctx, { name, description, type }) => {
	validateChannelName(name);
	if (type !== "text" && type !== "voice") throw new SenderError("Channel type must be \"text\" or \"voice\"");
	const userRoles = [...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(ctx.sender));
	const globalRoles = [...ctx.db.role.iter()].filter((r) => !r.channelId);
	const userGlobalRoles = userRoles.map((rm) => globalRoles.find((r) => r.id === rm.roleId)).filter((r) => r !== void 0);
	let hasCreatePermission = false;
	userGlobalRoles.forEach((role) => {
		if (role && checkPermission(role.permissions, Permissions.CREATE_CHANNEL)) hasCreatePermission = true;
	});
	if (userGlobalRoles.length > 0 && !hasCreatePermission) throw new SenderError("You do not have permission to create channels");
	const channel = ctx.db.channel.insert({
		id: 0n,
		name,
		description,
		type,
		createdAt: ctx.timestamp,
		createdBy: ctx.sender
	});
	ctx.db.channelMember.insert({
		id: 0n,
		channelId: channel.id,
		userId: ctx.sender,
		joinedAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} created channel ${name} (${channel.id})`);
});
const create_thread = spacetimedb.reducer({
	channelId: t.u64(),
	name: t.string()
}, (ctx, { channelId, name }) => {
	validateChannelName(name);
	if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
	if (![...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId).find((m) => m.userId.isEqual(ctx.sender))) throw new SenderError("You must be a member of the channel to create threads");
	const thread = ctx.db.thread.insert({
		id: 0n,
		channelId,
		name,
		createdAt: ctx.timestamp,
		createdBy: ctx.sender
	});
	console.info(`User ${ctx.sender} created thread ${name} in channel ${channelId} (${thread.id})`);
});
const join_channel = spacetimedb.reducer({ channelId: t.u64() }, (ctx, { channelId }) => {
	if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
	const accountIdentity = ctx.db.identityLink.sessionIdentity.find(ctx.sender)?.accountIdentity;
	const channelMembers = [...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId);
	const existingMember = channelMembers.find((m) => m.userId.isEqual(ctx.sender));
	const accountAlreadyMember = accountIdentity && channelMembers.some((m) => m.userId.isEqual(accountIdentity));
	if (existingMember) throw new SenderError("You are already a member of this channel");
	if (accountAlreadyMember) {
		ctx.db.channelMember.insert({
			id: 0n,
			channelId,
			userId: ctx.sender,
			joinedAt: ctx.timestamp
		});
		console.info(`User ${ctx.sender} joined channel ${channelId} (linked session)`);
		return;
	}
	ctx.db.channelMember.insert({
		id: 0n,
		channelId,
		userId: ctx.sender,
		joinedAt: ctx.timestamp
	});
	if (accountIdentity && !accountAlreadyMember) ctx.db.channelMember.insert({
		id: 0n,
		channelId,
		userId: accountIdentity,
		joinedAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} joined channel ${channelId}`);
});
const add_user_to_channel = spacetimedb.reducer({
	channelId: t.u64(),
	userId: t.identity()
}, (ctx, { channelId, userId }) => {
	if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
	if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, channelId), Permissions.ADD_USER)) throw new SenderError("You do not have permission to add users to this channel");
	if (!ctx.db.user.identity.find(userId)) throw new SenderError("User not found");
	if ([...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId).find((m) => m.userId.isEqual(userId))) throw new SenderError("User is already a member of this channel");
	ctx.db.channelMember.insert({
		id: 0n,
		channelId,
		userId,
		joinedAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} added user ${userId} to channel ${channelId}`);
});
const leave_channel = spacetimedb.reducer({ channelId: t.u64() }, (ctx, { channelId }) => {
	const member = [...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId).find((m) => m.userId.isEqual(ctx.sender));
	if (!member) throw new SenderError("You are not a member of this channel");
	ctx.db.channelMember.delete(member);
	console.info(`User ${ctx.sender} left channel ${channelId}`);
});
const kick_user = spacetimedb.reducer({
	channelId: t.u64(),
	userId: t.identity()
}, (ctx, { channelId, userId }) => {
	if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
	if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, channelId), Permissions.KICK_USER)) throw new SenderError("You do not have permission to kick users from this channel");
	if (!ctx.db.user.identity.find(userId)) throw new SenderError("User not found");
	if (userId.isEqual(ctx.sender)) throw new SenderError("You cannot kick yourself. Use leave channel instead.");
	const member = [...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId).find((m) => m.userId.isEqual(userId));
	if (!member) throw new SenderError("User is not a member of this channel");
	ctx.db.channelMember.delete(member);
	console.info(`User ${ctx.sender} kicked user ${userId} from channel ${channelId}`);
});
const send_message = spacetimedb.reducer({
	text: t.string(),
	channelId: t.u64().optional(),
	threadId: t.u64().optional()
}, (ctx, { text, channelId, threadId }) => {
	validateMessage(text);
	if (!channelId && !threadId) throw new SenderError("Must specify either channelId or threadId");
	if (channelId && threadId) throw new SenderError("Cannot specify both channelId and threadId");
	if (channelId) {
		if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
		if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, channelId), Permissions.SEND_MESSAGE)) throw new SenderError("You do not have permission to send messages in this channel");
	}
	if (threadId) {
		const thread = ctx.db.thread.id.find(threadId);
		if (!thread) throw new SenderError("Thread not found");
		if (![...ctx.db.channelMember.iter()].filter((m) => m.channelId === thread.channelId).find((m) => m.userId.isEqual(ctx.sender))) throw new SenderError("You must be a member of the channel to send messages in threads");
	}
	ctx.db.message.insert({
		id: 0n,
		sender: ctx.sender,
		channelId: channelId ?? void 0,
		threadId: threadId ?? void 0,
		text,
		sent: ctx.timestamp,
		editedAt: void 0
	});
	console.info(`User ${ctx.sender} sent message in ${channelId ? `channel ${channelId}` : `thread ${threadId}`}`);
});
const edit_message = spacetimedb.reducer({
	messageId: t.u64(),
	text: t.string()
}, (ctx, { messageId, text }) => {
	validateMessage(text);
	const message = ctx.db.message.id.find(messageId);
	if (!message) throw new SenderError("Message not found");
	const isOwnMessage = message.sender.isEqual(ctx.sender);
	if (!isOwnMessage && message.channelId) {
		if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, message.channelId), Permissions.EDIT_MESSAGE)) throw new SenderError("You do not have permission to edit messages");
	} else if (!isOwnMessage) throw new SenderError("You can only edit your own messages");
	ctx.db.message.id.update({
		...message,
		text,
		editedAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} edited message ${messageId}`);
});
const signup_email = spacetimedb.reducer({
	email: t.string(),
	password: t.string(),
	name: t.string().optional()
}, (ctx, { email, password, name }) => {
	const normalizedEmail = email.toLowerCase().trim();
	validateEmail(normalizedEmail);
	validatePassword(password);
	if (ctx.db.emailCredential.email.find(normalizedEmail)) throw new SenderError("Email already registered");
	const passwordHash = hashPassword(password);
	let user = ctx.db.user.identity.find(ctx.sender);
	if (user) ctx.db.user.identity.update({
		...user,
		name: name?.trim() || user.name,
		online: true,
		authMethod: "email",
		lastIpAddress: user.lastIpAddress
	});
	else {
		user = ctx.db.user.insert({
			identity: ctx.sender,
			name: name?.trim() || void 0,
			online: true,
			avatar: void 0,
			authMethod: "email",
			lastIpAddress: void 0
		});
		const authenticatedUsers = [...ctx.db.user.iter()].filter((u) => u.authMethod);
		const hasAdminRole = [...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n);
		if (authenticatedUsers.length === 1 && !hasAdminRole) try {
			const adminRole = ctx.db.role.insert({
				id: 0n,
				channelId: void 0,
				name: "Admin",
				color: "#f04747",
				permissions: Permissions.ADMIN,
				position: 1000n,
				createdAt: ctx.timestamp,
				createdBy: ctx.sender
			});
			ctx.db.roleMember.insert({
				id: 0n,
				roleId: adminRole.id,
				userId: ctx.sender,
				assignedAt: ctx.timestamp,
				assignedBy: void 0
			});
			console.info(`First authenticated user ${ctx.sender} automatically assigned admin role`);
		} catch (err) {
			console.error("Error creating admin role:", err);
		}
	}
	ctx.db.emailCredential.insert({
		email: normalizedEmail,
		passwordHash,
		identity: ctx.sender,
		createdAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} signed up with email ${normalizedEmail}`);
});
const login_email = spacetimedb.reducer({
	email: t.string(),
	password: t.string()
}, (ctx, { email, password }) => {
	const normalizedEmail = email.toLowerCase().trim();
	validateEmail(normalizedEmail);
	validatePassword(password);
	const credential = ctx.db.emailCredential.email.find(normalizedEmail);
	if (!credential) throw new SenderError("Invalid email or password");
	if (!verifyPassword(password, credential.passwordHash)) throw new SenderError("Invalid email or password");
	const originalUser = ctx.db.user.identity.find(credential.identity);
	const isLinked = !credential.identity.isEqual(ctx.sender);
	if (!isLinked) {
		let user = ctx.db.user.identity.find(ctx.sender);
		if (!user) ctx.db.user.insert({
			identity: ctx.sender,
			name: originalUser?.name,
			online: true,
			avatar: originalUser?.avatar,
			authMethod: "email",
			lastIpAddress: void 0
		});
		else ctx.db.user.identity.update({
			...user,
			name: user.name ?? originalUser?.name,
			online: true,
			authMethod: "email",
			lastIpAddress: user.lastIpAddress
		});
	} else if (!originalUser) ctx.db.user.insert({
		identity: credential.identity,
		name: void 0,
		online: true,
		avatar: void 0,
		authMethod: "email",
		lastIpAddress: void 0
	});
	else ctx.db.user.identity.update({
		...originalUser,
		online: true
	});
	const originalRoleMembers = [...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(credential.identity));
	for (const rm of originalRoleMembers) if (![...ctx.db.roleMember.iter()].some((m) => m.roleId === rm.roleId && m.userId.isEqual(ctx.sender))) ctx.db.roleMember.insert({
		id: 0n,
		roleId: rm.roleId,
		userId: ctx.sender,
		assignedAt: ctx.timestamp,
		assignedBy: rm.assignedBy
	});
	const originalChannelMembers = [...ctx.db.channelMember.iter()].filter((m) => m.userId.isEqual(credential.identity));
	for (const m of originalChannelMembers) if (![...ctx.db.channelMember.iter()].some((cm) => cm.channelId === m.channelId && cm.userId.isEqual(ctx.sender))) ctx.db.channelMember.insert({
		id: 0n,
		channelId: m.channelId,
		userId: ctx.sender,
		joinedAt: ctx.timestamp
	});
	if (isLinked) {
		const existingLink = ctx.db.identityLink.sessionIdentity.find(ctx.sender);
		if (existingLink) ctx.db.identityLink.sessionIdentity.update({
			...existingLink,
			accountIdentity: credential.identity,
			linkedAt: ctx.timestamp
		});
		else ctx.db.identityLink.insert({
			sessionIdentity: ctx.sender,
			accountIdentity: credential.identity,
			linkedAt: ctx.timestamp
		});
		const existingReplaced = ctx.db.replacedIdentity.oldIdentity.find(ctx.sender);
		if (existingReplaced) ctx.db.replacedIdentity.oldIdentity.update({
			...existingReplaced,
			newIdentity: credential.identity,
			replacedAt: ctx.timestamp
		});
		else ctx.db.replacedIdentity.insert({
			oldIdentity: ctx.sender,
			newIdentity: credential.identity,
			replacedAt: ctx.timestamp
		});
		const existingSession = ctx.db.activeSession.sessionIdentity.find(ctx.sender);
		if (existingSession) ctx.db.activeSession.sessionIdentity.update({
			...existingSession,
			connectedAt: ctx.timestamp
		});
		else ctx.db.activeSession.insert({
			sessionIdentity: ctx.sender,
			connectedAt: ctx.timestamp
		});
	}
	console.info(`User ${ctx.sender} logged in with email ${normalizedEmail}`);
});
const signup_google = spacetimedb.reducer({
	googleId: t.string(),
	email: t.string().optional(),
	name: t.string().optional(),
	avatar: t.string().optional()
}, (ctx, { googleId, email, name, avatar }) => {
	if (!googleId || googleId.trim().length === 0) throw new SenderError("Google ID is required");
	if (ctx.db.googleAuth.googleId.find(googleId)) throw new SenderError("Google account already registered");
	let user = ctx.db.user.identity.find(ctx.sender);
	if (user) ctx.db.user.identity.update({
		...user,
		name: name?.trim() || user.name,
		online: true,
		avatar: avatar || user.avatar,
		authMethod: "google",
		lastIpAddress: user.lastIpAddress
	});
	else {
		user = ctx.db.user.insert({
			identity: ctx.sender,
			name: name?.trim() || void 0,
			online: true,
			avatar: avatar || void 0,
			authMethod: "google",
			lastIpAddress: void 0
		});
		const authenticatedUsers = [...ctx.db.user.iter()].filter((u) => u.authMethod);
		const hasAdminRole = [...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n);
		if (authenticatedUsers.length === 1 && !hasAdminRole) try {
			const adminRole = ctx.db.role.insert({
				id: 0n,
				channelId: void 0,
				name: "Admin",
				color: "#f04747",
				permissions: Permissions.ADMIN,
				position: 1000n,
				createdAt: ctx.timestamp,
				createdBy: ctx.sender
			});
			ctx.db.roleMember.insert({
				id: 0n,
				roleId: adminRole.id,
				userId: ctx.sender,
				assignedAt: ctx.timestamp,
				assignedBy: void 0
			});
			console.info(`First authenticated user ${ctx.sender} automatically assigned admin role`);
		} catch (err) {
			console.error("Error creating admin role:", err);
		}
	}
	ctx.db.googleAuth.insert({
		googleId: googleId.trim(),
		identity: ctx.sender,
		email: email?.toLowerCase().trim() || void 0,
		name: name?.trim() || void 0,
		avatar: avatar || void 0,
		createdAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} signed up with Google ID ${googleId}`);
});
const login_google = spacetimedb.reducer({
	googleId: t.string(),
	email: t.string().optional(),
	name: t.string().optional(),
	avatar: t.string().optional()
}, (ctx, { googleId, email, name, avatar }) => {
	if (!googleId || googleId.trim().length === 0) throw new SenderError("Google ID is required");
	const trimmedGoogleId = googleId.trim();
	let googleAuth = ctx.db.googleAuth.googleId.find(trimmedGoogleId);
	if (!googleAuth) {
		const existingAuth = ctx.db.googleAuth.googleId.find(trimmedGoogleId);
		if (existingAuth) googleAuth = existingAuth;
		else {
			let user = ctx.db.user.identity.find(ctx.sender);
			if (!user) {
				user = ctx.db.user.insert({
					identity: ctx.sender,
					name: name?.trim() || void 0,
					online: true,
					avatar: avatar || void 0,
					authMethod: "google",
					lastIpAddress: void 0
				});
				const authenticatedUsers = [...ctx.db.user.iter()].filter((u) => u.authMethod);
				const hasAdminRole = [...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n);
				if (authenticatedUsers.length === 1 && !hasAdminRole) try {
					const adminRole = ctx.db.role.insert({
						id: 0n,
						channelId: void 0,
						name: "Admin",
						color: "#f04747",
						permissions: Permissions.ADMIN,
						position: 1000n,
						createdAt: ctx.timestamp,
						createdBy: ctx.sender
					});
					ctx.db.roleMember.insert({
						id: 0n,
						roleId: adminRole.id,
						userId: ctx.sender,
						assignedAt: ctx.timestamp,
						assignedBy: void 0
					});
					console.info(`First authenticated user ${ctx.sender} automatically assigned admin role`);
				} catch (err) {
					console.error("Error creating admin role:", err);
				}
			} else ctx.db.user.identity.update({
				...user,
				name: name?.trim() || user.name,
				online: true,
				avatar: avatar || user.avatar,
				authMethod: "google",
				lastIpAddress: user.lastIpAddress
			});
			ctx.db.googleAuth.insert({
				googleId: trimmedGoogleId,
				identity: ctx.sender,
				email: email?.toLowerCase().trim() || void 0,
				name: name?.trim() || void 0,
				avatar: avatar || void 0,
				createdAt: ctx.timestamp
			});
			console.info(`User ${ctx.sender} signed up with Google ID ${trimmedGoogleId} (first login)`);
			return;
		}
	}
	const originalUser = ctx.db.user.identity.find(googleAuth.identity);
	if (!!googleAuth.identity.isEqual(ctx.sender)) {
		let user = ctx.db.user.identity.find(ctx.sender);
		if (!user) ctx.db.user.insert({
			identity: ctx.sender,
			name: originalUser?.name ?? googleAuth.name ?? name?.trim() ?? void 0,
			online: true,
			avatar: originalUser?.avatar ?? googleAuth.avatar ?? avatar ?? void 0,
			authMethod: "google",
			lastIpAddress: void 0
		});
		else ctx.db.user.identity.update({
			...user,
			name: user.name ?? originalUser?.name ?? googleAuth.name ?? name?.trim(),
			online: true,
			avatar: user.avatar ?? originalUser?.avatar ?? googleAuth.avatar ?? avatar,
			authMethod: "google",
			lastIpAddress: user.lastIpAddress
		});
	} else if (!originalUser) ctx.db.user.insert({
		identity: googleAuth.identity,
		name: googleAuth.name ?? name?.trim() ?? void 0,
		online: true,
		avatar: googleAuth.avatar ?? avatar ?? void 0,
		authMethod: "google",
		lastIpAddress: void 0
	});
	else ctx.db.user.identity.update({
		...originalUser,
		online: true,
		name: originalUser.name ?? googleAuth.name ?? name?.trim(),
		avatar: originalUser.avatar ?? googleAuth.avatar ?? avatar
	});
	const originalRoleMembers = [...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(googleAuth.identity));
	for (const rm of originalRoleMembers) if (![...ctx.db.roleMember.iter()].some((m) => m.roleId === rm.roleId && m.userId.isEqual(ctx.sender))) ctx.db.roleMember.insert({
		id: 0n,
		roleId: rm.roleId,
		userId: ctx.sender,
		assignedAt: ctx.timestamp,
		assignedBy: rm.assignedBy
	});
	const originalChannelMembers = [...ctx.db.channelMember.iter()].filter((m) => m.userId.isEqual(googleAuth.identity));
	for (const m of originalChannelMembers) if (![...ctx.db.channelMember.iter()].some((cm) => cm.channelId === m.channelId && cm.userId.isEqual(ctx.sender))) ctx.db.channelMember.insert({
		id: 0n,
		channelId: m.channelId,
		userId: ctx.sender,
		joinedAt: ctx.timestamp
	});
	if (!googleAuth.identity.isEqual(ctx.sender)) {
		const existingLink = ctx.db.identityLink.sessionIdentity.find(ctx.sender);
		if (existingLink) ctx.db.identityLink.sessionIdentity.update({
			...existingLink,
			accountIdentity: googleAuth.identity,
			linkedAt: ctx.timestamp
		});
		else ctx.db.identityLink.insert({
			sessionIdentity: ctx.sender,
			accountIdentity: googleAuth.identity,
			linkedAt: ctx.timestamp
		});
		const existingReplaced = ctx.db.replacedIdentity.oldIdentity.find(ctx.sender);
		if (existingReplaced) ctx.db.replacedIdentity.oldIdentity.update({
			...existingReplaced,
			newIdentity: googleAuth.identity,
			replacedAt: ctx.timestamp
		});
		else ctx.db.replacedIdentity.insert({
			oldIdentity: ctx.sender,
			newIdentity: googleAuth.identity,
			replacedAt: ctx.timestamp
		});
		const existingSession = ctx.db.activeSession.sessionIdentity.find(ctx.sender);
		if (existingSession) ctx.db.activeSession.sessionIdentity.update({
			...existingSession,
			connectedAt: ctx.timestamp
		});
		else ctx.db.activeSession.insert({
			sessionIdentity: ctx.sender,
			connectedAt: ctx.timestamp
		});
	}
	const accountUser = ctx.db.user.identity.find(googleAuth.identity);
	if (accountUser) ctx.db.user.identity.update({
		...accountUser,
		online: true
	});
	console.info(`User ${ctx.sender} logged in with Google ID ${trimmedGoogleId}`);
});
const join_voice = spacetimedb.reducer({ channelId: t.u64() }, (ctx, { channelId }) => {
	if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
	if (![...ctx.db.channelMember.iter()].filter((m) => m.channelId === channelId).find((m) => m.userId.isEqual(ctx.sender))) throw new SenderError("You must be a member of the channel to join voice");
	let room = [...ctx.db.voiceRoom.iter()].filter((r) => r.channelId === channelId)[0];
	if (!room) room = ctx.db.voiceRoom.insert({
		id: 0n,
		channelId,
		createdAt: ctx.timestamp
	});
	if ([...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id).find((p) => p.userId.isEqual(ctx.sender))) throw new SenderError("You are already in the voice room");
	ctx.db.voiceParticipant.insert({
		id: 0n,
		roomId: room.id,
		userId: ctx.sender,
		muted: false,
		deafened: false,
		joinedAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} joined voice room for channel ${channelId}`);
});
const leave_voice = spacetimedb.reducer({ channelId: t.u64() }, (ctx, { channelId }) => {
	const rooms = [...ctx.db.voiceRoom.iter()].filter((r) => r.channelId === channelId);
	if (rooms.length === 0) return;
	const room = rooms[0];
	const participant = [...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id).find((p) => p.userId.isEqual(ctx.sender));
	if (!participant) return;
	ctx.db.voiceParticipant.delete(participant);
	[...ctx.db.voiceSignaling.iter()].filter((s) => s.roomId === room.id && (s.fromUserId.isEqual(ctx.sender) || s.toUserId.isEqual(ctx.sender))).forEach((signal) => ctx.db.voiceSignaling.delete(signal));
	if ([...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id).length === 0) ctx.db.voiceRoom.delete(room);
	console.info(`User ${ctx.sender} left voice room for channel ${channelId}`);
});
const toggle_voice_mute = spacetimedb.reducer({ channelId: t.u64() }, (ctx, { channelId }) => {
	const rooms = [...ctx.db.voiceRoom.iter()].filter((r) => r.channelId === channelId);
	if (rooms.length === 0) throw new SenderError("Voice room not found");
	const room = rooms[0];
	const participant = [...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id).find((p) => p.userId.isEqual(ctx.sender));
	if (!participant) throw new SenderError("You are not in the voice room");
	ctx.db.voiceParticipant.id.update({
		...participant,
		muted: !participant.muted
	});
	console.info(`User ${ctx.sender} ${participant.muted ? "unmuted" : "muted"} in voice room`);
});
const toggle_voice_deafen = spacetimedb.reducer({ channelId: t.u64() }, (ctx, { channelId }) => {
	const rooms = [...ctx.db.voiceRoom.iter()].filter((r) => r.channelId === channelId);
	if (rooms.length === 0) throw new SenderError("Voice room not found");
	const room = rooms[0];
	const participant = [...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id).find((p) => p.userId.isEqual(ctx.sender));
	if (!participant) throw new SenderError("You are not in the voice room");
	ctx.db.voiceParticipant.id.update({
		...participant,
		deafened: !participant.deafened,
		muted: !participant.deafened ? true : participant.muted
	});
	console.info(`User ${ctx.sender} ${participant.deafened ? "undeafened" : "deafened"} in voice room`);
});
const send_voice_signal = spacetimedb.reducer({
	channelId: t.u64(),
	toUserId: t.identity(),
	signalType: t.string(),
	signalData: t.string()
}, (ctx, { channelId, toUserId, signalType, signalData }) => {
	const rooms = [...ctx.db.voiceRoom.iter()].filter((r) => r.channelId === channelId);
	if (rooms.length === 0) throw new SenderError("Voice room not found");
	const room = rooms[0];
	const participants = [...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id);
	const senderParticipant = participants.find((p) => p.userId.isEqual(ctx.sender));
	const receiverParticipant = participants.find((p) => p.userId.isEqual(toUserId));
	if (!senderParticipant) throw new SenderError("You are not in the voice room");
	if (!receiverParticipant) throw new SenderError("Target user is not in the voice room");
	if (![
		"offer",
		"answer",
		"ice-candidate"
	].includes(signalType)) throw new SenderError("Invalid signal type");
	ctx.db.voiceSignaling.insert({
		id: 0n,
		roomId: room.id,
		fromUserId: ctx.sender,
		toUserId,
		signalType,
		signalData,
		createdAt: ctx.timestamp
	});
	console.info(`User ${ctx.sender} sent ${signalType} signal to ${toUserId} in voice room`);
});
const save_voice_chunk = spacetimedb.reducer({
	roomId: t.u64(),
	channelId: t.u64(),
	chunkIndex: t.u64(),
	dataBase64: t.string()
}, (ctx, { roomId, channelId, chunkIndex, dataBase64 }) => {
	if (!dataBase64 || dataBase64.length > 5e4) throw new SenderError("Invalid chunk data (max 50KB base64)");
	if ([...ctx.db.voiceRoom.iter()].filter((r) => r.id === roomId).length === 0) throw new SenderError("Voice room not found");
	if (![...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === roomId).find((p) => p.userId.isEqual(ctx.sender))) throw new SenderError("You are not in the voice room");
	ctx.db.voiceRecordingChunk.insert({
		id: 0n,
		roomId,
		channelId,
		chunkIndex,
		dataBase64,
		recordedBy: ctx.sender,
		createdAt: ctx.timestamp
	});
});
const create_role = spacetimedb.reducer({
	channelId: t.u64().optional(),
	name: t.string(),
	color: t.string().optional(),
	permissions: t.u64(),
	position: t.u64().optional()
}, (ctx, { channelId, name, color, permissions, position }) => {
	if (!name || name.trim().length === 0) throw new SenderError("Role name cannot be empty");
	if (name.length > 32) throw new SenderError("Role name must be 32 characters or less");
	if (channelId) {
		if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, channelId), Permissions.MANAGE_ROLES)) throw new SenderError("You do not have permission to manage roles");
		if (!ctx.db.channel.id.find(channelId)) throw new SenderError("Channel not found");
	} else if ([...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n)) {
		if (![...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(ctx.sender)).some((rm) => {
			const role = ctx.db.role.id.find(rm.roleId);
			return role && (role.permissions & Permissions.ADMIN) !== 0n;
		})) throw new SenderError("Only admins can create global roles");
	}
	const allNonAdminPerms = Object.values(Permissions).filter((p) => p !== Permissions.ADMIN).reduce((acc, p) => acc | p, 0n);
	const hasAllNonAdminPerms = (permissions & allNonAdminPerms) === allNonAdminPerms;
	const hasAdminPerm = (permissions & Permissions.ADMIN) !== 0n;
	if (hasAllNonAdminPerms && !hasAdminPerm) throw new SenderError("Tüm izinleri vermek için Admin izni gereklidir");
	const existingRoles = [...ctx.db.role.iter()].filter((r) => channelId ? r.channelId === channelId : !r.channelId);
	const maxPosition = existingRoles.length > 0 ? existingRoles.reduce((max, r) => r.position > max ? r.position : max, 0n) : 0n;
	ctx.db.role.insert({
		id: 0n,
		channelId: channelId ?? void 0,
		name: name.trim(),
		color: color?.trim() || void 0,
		permissions,
		position: position ?? maxPosition + 1n,
		createdAt: ctx.timestamp,
		createdBy: ctx.sender
	});
	console.info(`User ${ctx.sender} created role ${name} for ${channelId ? `channel ${channelId}` : "global"}`);
});
const assign_role = spacetimedb.reducer({
	roleId: t.u64(),
	userId: t.identity()
}, (ctx, { roleId, userId }) => {
	const role = ctx.db.role.id.find(roleId);
	if (!role) throw new SenderError("Role not found");
	if (role.channelId) {
		if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, role.channelId), Permissions.ASSIGN_ROLES)) throw new SenderError("You do not have permission to assign roles");
	} else if ([...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n)) {
		if (![...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(ctx.sender)).some((rm) => {
			const r = ctx.db.role.id.find(rm.roleId);
			return r && (r.permissions & Permissions.ADMIN) !== 0n;
		})) throw new SenderError("Only admins can assign global roles");
	}
	if ([...ctx.db.roleMember.iter()].find((rm) => rm.roleId === roleId && rm.userId.isEqual(userId))) throw new SenderError("Role already assigned to user");
	ctx.db.roleMember.insert({
		id: 0n,
		roleId,
		userId,
		assignedAt: ctx.timestamp,
		assignedBy: ctx.sender
	});
	console.info(`User ${ctx.sender} assigned role ${roleId} to ${userId}`);
});
const remove_role = spacetimedb.reducer({
	roleId: t.u64(),
	userId: t.identity()
}, (ctx, { roleId, userId }) => {
	const role = ctx.db.role.id.find(roleId);
	if (!role) throw new SenderError("Role not found");
	if ((role.permissions & Permissions.ADMIN) !== 0n) {
		if (userId.isEqual(ctx.sender)) throw new SenderError("Kendi adminliğinizi kaldıramazsınız. Başka bir admin bu işlemi yapmalıdır.");
		throw new SenderError("Admin rolü kaldırılamaz. Sistemde en az bir admin olmalıdır.");
	}
	if (role.channelId) {
		if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, role.channelId), Permissions.ASSIGN_ROLES)) throw new SenderError("You do not have permission to remove roles");
	} else if ([...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n)) {
		if (![...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(ctx.sender)).some((rm) => {
			const r = ctx.db.role.id.find(rm.roleId);
			return r && (r.permissions & Permissions.ADMIN) !== 0n;
		})) throw new SenderError("Only admins can remove global roles");
	}
	const roleMember = [...ctx.db.roleMember.iter()].find((rm) => rm.roleId === roleId && rm.userId.isEqual(userId));
	if (!roleMember) throw new SenderError("Role not assigned to user");
	ctx.db.roleMember.delete(roleMember);
	console.info(`User ${ctx.sender} removed role ${roleId} from ${userId}`);
});
const delete_role = spacetimedb.reducer({ roleId: t.u64() }, (ctx, { roleId }) => {
	const role = ctx.db.role.id.find(roleId);
	if (!role) throw new SenderError("Role not found");
	if ((role.permissions & Permissions.ADMIN) !== 0n) {
		const roleMembers = [...ctx.db.roleMember.iter()].filter((rm) => rm.roleId === roleId);
		if (roleMembers.filter((rm) => rm.userId.isEqual(ctx.sender)).length > 0) throw new SenderError("Kendi adminliğinizi silemezsiniz. Başka bir admin bu işlemi yapmalıdır.");
		if (roleMembers.length > 0) throw new SenderError("Başka bir kullanıcının admin rolünü silemezsiniz.");
		if ([...ctx.db.role.iter()].filter((r) => (r.permissions & Permissions.ADMIN) !== 0n && r.id !== roleId).length > 0) {
			const allAdminRoleMembers = [...ctx.db.roleMember.iter()].filter((rm) => {
				const r = ctx.db.role.id.find(rm.roleId);
				return r && r.id !== roleId && (r.permissions & Permissions.ADMIN) !== 0n;
			});
			const adminUsers = /* @__PURE__ */ new Set();
			allAdminRoleMembers.forEach((rm) => {
				adminUsers.add(rm.userId.toHexString());
			});
			if (adminUsers.size === 0) throw new SenderError("Sistemde en az bir admin olmalıdır. Bu rolü silmek tüm adminleri kaldırır.");
		}
	}
	if (role.channelId) {
		if (!checkPermission(getUserChannelPermissions(ctx, ctx.sender, role.channelId), Permissions.MANAGE_ROLES)) throw new SenderError("You do not have permission to delete roles");
	} else if ([...ctx.db.role.iter()].some((r) => (r.permissions & Permissions.ADMIN) !== 0n)) {
		if (![...ctx.db.roleMember.iter()].filter((rm) => rm.userId.isEqual(ctx.sender)).some((rm) => {
			const r = ctx.db.role.id.find(rm.roleId);
			return r && (r.permissions & Permissions.ADMIN) !== 0n;
		})) throw new SenderError("Only admins can delete global roles");
	}
	[...ctx.db.roleMember.iter()].filter((rm) => rm.roleId === roleId).forEach((rm) => ctx.db.roleMember.delete(rm));
	ctx.db.role.delete(role);
	console.info(`User ${ctx.sender} deleted role ${roleId}`);
});
const init = spacetimedb.init((ctx) => {
	console.info("Module initialized");
});
const onConnect = spacetimedb.clientConnected((ctx) => {
	let connectionAddress = void 0;
	if (ctx.address) connectionAddress = String(ctx.address);
	const existingSession = ctx.db.activeSession.sessionIdentity.find(ctx.sender);
	if (existingSession) ctx.db.activeSession.sessionIdentity.update({
		...existingSession,
		connectedAt: ctx.timestamp
	});
	else ctx.db.activeSession.insert({
		sessionIdentity: ctx.sender,
		connectedAt: ctx.timestamp
	});
	const user = ctx.db.user.identity.find(ctx.sender);
	const link = ctx.db.identityLink.sessionIdentity.find(ctx.sender);
	if (user) {
		ctx.db.user.identity.update({
			...user,
			online: true,
			lastIpAddress: connectionAddress || user.lastIpAddress
		});
		if (link) {
			const accountUser = ctx.db.user.identity.find(link.accountIdentity);
			if (accountUser) ctx.db.user.identity.update({
				...accountUser,
				online: true,
				lastIpAddress: connectionAddress || accountUser.lastIpAddress
			});
		}
	} else if (link) {
		const accountUser = ctx.db.user.identity.find(link.accountIdentity);
		if (accountUser) ctx.db.user.identity.update({
			...accountUser,
			online: true,
			lastIpAddress: connectionAddress || accountUser.lastIpAddress
		});
	} else {
		const emailCreds = [...ctx.db.emailCredential.iter()].find((c) => c.identity.isEqual(ctx.sender));
		const googleAuths = [...ctx.db.googleAuth.iter()].find((a) => a.identity.isEqual(ctx.sender));
		if (emailCreds || googleAuths) {
			const authMethod = emailCreds ? "email" : "google";
			ctx.db.user.insert({
				identity: ctx.sender,
				name: void 0,
				online: true,
				avatar: void 0,
				authMethod,
				lastIpAddress: connectionAddress
			});
			console.info(`User ${ctx.sender} reconnected with existing auth credentials`);
		}
	}
});
const onDisconnect = spacetimedb.clientDisconnected((ctx) => {
	if (ctx.db.activeSession.sessionIdentity.find(ctx.sender)) ctx.db.activeSession.sessionIdentity.delete(ctx.sender);
	const user = ctx.db.user.identity.find(ctx.sender);
	const link = ctx.db.identityLink.sessionIdentity.find(ctx.sender);
	if (user) ctx.db.user.identity.update({
		...user,
		online: false
	});
	else if (link) {
		if (![...ctx.db.identityLink.iter()].filter((l) => l.accountIdentity.isEqual(link.accountIdentity) && !l.sessionIdentity.isEqual(ctx.sender)).some((s) => ctx.db.activeSession.sessionIdentity.find(s.sessionIdentity))) {
			const accountUser = ctx.db.user.identity.find(link.accountIdentity);
			if (accountUser) ctx.db.user.identity.update({
				...accountUser,
				online: false
			});
		}
	} else console.warn(`Disconnect event for unknown user with identity ${ctx.sender}`);
	[...ctx.db.voiceParticipant.iter()].filter((p) => p.userId.isEqual(ctx.sender)).forEach((participant) => {
		const room = ctx.db.voiceRoom.id.find(participant.roomId);
		if (room) {
			ctx.db.voiceParticipant.delete(participant);
			[...ctx.db.voiceSignaling.iter()].filter((s) => s.roomId === room.id && (s.fromUserId.isEqual(ctx.sender) || s.toUserId.isEqual(ctx.sender))).forEach((signal) => ctx.db.voiceSignaling.delete(signal));
			if ([...ctx.db.voiceParticipant.iter()].filter((p) => p.roomId === room.id).length === 0) ctx.db.voiceRoom.delete(room);
		}
	});
});

//#endregion
export { add_user_to_channel, assign_role, create_channel, create_role, create_thread, spacetimedb as default, delete_role, edit_message, init, join_channel, join_voice, kick_user, leave_channel, leave_voice, login_email, login_google, onConnect, onDisconnect, remove_role, save_voice_chunk, send_message, send_voice_signal, set_name, signup_email, signup_google, toggle_voice_deafen, toggle_voice_mute };
//# debugId=f79c9c71-908c-4d5f-82d8-f693dd589dc5
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwibmFtZXMiOlsiX19jcmVhdGUiLCJfX2RlZlByb3AiLCJfX2dldE93blByb3BEZXNjIiwiX19nZXRPd25Qcm9wTmFtZXMiLCJfX2dldFByb3RvT2YiLCJfX2hhc093blByb3AiLCJfX2NvbW1vbkpTIiwiX19jb3B5UHJvcHMiLCJfX3RvRVNNIiwiI2Vuc3VyZSIsIiNtb2R1bGVEZWYiLCIjcmVnaXN0ZXJDb21wb3VuZFR5cGVSZWN1cnNpdmVseSIsIiNjb21wb3VuZFR5cGVzIiwiI2Zyb20iLCIjdG8iLCIjdXVpZENvdW50ZXIiLCIjc2VuZGVyQXV0aCIsIiNpZGVudGl0eSIsIiNyYW5kb20iLCIjc2NoZW1hIiwiI3JlZHVjZXJBcmdzRGVzZXJpYWxpemVycyIsIiNkYlZpZXciLCIjZGJWaWV3XyIsIiNyZWR1Y2VyQ3R4IiwiI3JlZHVjZXJDdHhfIiwiI2ZpbmFsaXphdGlvblJlZ2lzdHJ5IiwiI2lkIiwiI2RldGFjaCIsIiNib2R5IiwiI2lubmVyIiwiI2N0eCJdLCJzb3VyY2VzIjpbIkM6L1VzZXJzL1BDL3NvdXJjZS9naXRyZXBvcy9PTS1tYWluL25vZGVfbW9kdWxlcy9oZWFkZXJzLXBvbHlmaWxsL2xpYi9pbmRleC5tanMiLCJDOi9Vc2Vycy9QQy9zb3VyY2UvZ2l0cmVwb3MvT00tbWFpbi9ub2RlX21vZHVsZXMvc3BhY2V0aW1lZGIvZGlzdC9zZXJ2ZXIvaW5kZXgubWpzIiwiQzovVXNlcnMvUEMvc291cmNlL2dpdHJlcG9zL09NLW1haW4vc3BhY2V0aW1lZGIvc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBfX2NyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG52YXIgX19kZWZQcm9wID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xudmFyIF9fZ2V0T3duUHJvcERlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xudmFyIF9fZ2V0T3duUHJvcE5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXM7XG52YXIgX19nZXRQcm90b09mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xudmFyIF9faGFzT3duUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgX19jb21tb25KUyA9IChjYiwgbW9kKSA9PiBmdW5jdGlvbiBfX3JlcXVpcmUoKSB7XG4gIHJldHVybiBtb2QgfHwgKDAsIGNiW19fZ2V0T3duUHJvcE5hbWVzKGNiKVswXV0pKChtb2QgPSB7IGV4cG9ydHM6IHt9IH0pLmV4cG9ydHMsIG1vZCksIG1vZC5leHBvcnRzO1xufTtcbnZhciBfX2NvcHlQcm9wcyA9ICh0bywgZnJvbSwgZXhjZXB0LCBkZXNjKSA9PiB7XG4gIGlmIChmcm9tICYmIHR5cGVvZiBmcm9tID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBmcm9tID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBmb3IgKGxldCBrZXkgb2YgX19nZXRPd25Qcm9wTmFtZXMoZnJvbSkpXG4gICAgICBpZiAoIV9faGFzT3duUHJvcC5jYWxsKHRvLCBrZXkpICYmIGtleSAhPT0gZXhjZXB0KVxuICAgICAgICBfX2RlZlByb3AodG8sIGtleSwgeyBnZXQ6ICgpID0+IGZyb21ba2V5XSwgZW51bWVyYWJsZTogIShkZXNjID0gX19nZXRPd25Qcm9wRGVzYyhmcm9tLCBrZXkpKSB8fCBkZXNjLmVudW1lcmFibGUgfSk7XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcbnZhciBfX3RvRVNNID0gKG1vZCwgaXNOb2RlTW9kZSwgdGFyZ2V0KSA9PiAodGFyZ2V0ID0gbW9kICE9IG51bGwgPyBfX2NyZWF0ZShfX2dldFByb3RvT2YobW9kKSkgOiB7fSwgX19jb3B5UHJvcHMoXG4gIC8vIElmIHRoZSBpbXBvcnRlciBpcyBpbiBub2RlIGNvbXBhdGliaWxpdHkgbW9kZSBvciB0aGlzIGlzIG5vdCBhbiBFU01cbiAgLy8gZmlsZSB0aGF0IGhhcyBiZWVuIGNvbnZlcnRlZCB0byBhIENvbW1vbkpTIGZpbGUgdXNpbmcgYSBCYWJlbC1cbiAgLy8gY29tcGF0aWJsZSB0cmFuc2Zvcm0gKGkuZS4gXCJfX2VzTW9kdWxlXCIgaGFzIG5vdCBiZWVuIHNldCksIHRoZW4gc2V0XG4gIC8vIFwiZGVmYXVsdFwiIHRvIHRoZSBDb21tb25KUyBcIm1vZHVsZS5leHBvcnRzXCIgZm9yIG5vZGUgY29tcGF0aWJpbGl0eS5cbiAgaXNOb2RlTW9kZSB8fCAhbW9kIHx8ICFtb2QuX19lc01vZHVsZSA/IF9fZGVmUHJvcCh0YXJnZXQsIFwiZGVmYXVsdFwiLCB7IHZhbHVlOiBtb2QsIGVudW1lcmFibGU6IHRydWUgfSkgOiB0YXJnZXQsXG4gIG1vZFxuKSk7XG5cbi8vIG5vZGVfbW9kdWxlcy9zZXQtY29va2llLXBhcnNlci9saWIvc2V0LWNvb2tpZS5qc1xudmFyIHJlcXVpcmVfc2V0X2Nvb2tpZSA9IF9fY29tbW9uSlMoe1xuICBcIm5vZGVfbW9kdWxlcy9zZXQtY29va2llLXBhcnNlci9saWIvc2V0LWNvb2tpZS5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkZWZhdWx0UGFyc2VPcHRpb25zID0ge1xuICAgICAgZGVjb2RlVmFsdWVzOiB0cnVlLFxuICAgICAgbWFwOiBmYWxzZSxcbiAgICAgIHNpbGVudDogZmFsc2VcbiAgICB9O1xuICAgIGZ1bmN0aW9uIGlzTm9uRW1wdHlTdHJpbmcoc3RyKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIHN0ciA9PT0gXCJzdHJpbmdcIiAmJiAhIXN0ci50cmltKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHBhcnNlU3RyaW5nKHNldENvb2tpZVZhbHVlLCBvcHRpb25zKSB7XG4gICAgICB2YXIgcGFydHMgPSBzZXRDb29raWVWYWx1ZS5zcGxpdChcIjtcIikuZmlsdGVyKGlzTm9uRW1wdHlTdHJpbmcpO1xuICAgICAgdmFyIG5hbWVWYWx1ZVBhaXJTdHIgPSBwYXJ0cy5zaGlmdCgpO1xuICAgICAgdmFyIHBhcnNlZCA9IHBhcnNlTmFtZVZhbHVlUGFpcihuYW1lVmFsdWVQYWlyU3RyKTtcbiAgICAgIHZhciBuYW1lID0gcGFyc2VkLm5hbWU7XG4gICAgICB2YXIgdmFsdWUgPSBwYXJzZWQudmFsdWU7XG4gICAgICBvcHRpb25zID0gb3B0aW9ucyA/IE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRQYXJzZU9wdGlvbnMsIG9wdGlvbnMpIDogZGVmYXVsdFBhcnNlT3B0aW9ucztcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhbHVlID0gb3B0aW9ucy5kZWNvZGVWYWx1ZXMgPyBkZWNvZGVVUklDb21wb25lbnQodmFsdWUpIDogdmFsdWU7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJzZXQtY29va2llLXBhcnNlciBlbmNvdW50ZXJlZCBhbiBlcnJvciB3aGlsZSBkZWNvZGluZyBhIGNvb2tpZSB3aXRoIHZhbHVlICdcIiArIHZhbHVlICsgXCInLiBTZXQgb3B0aW9ucy5kZWNvZGVWYWx1ZXMgdG8gZmFsc2UgdG8gZGlzYWJsZSB0aGlzIGZlYXR1cmUuXCIsXG4gICAgICAgICAgZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgdmFyIGNvb2tpZSA9IHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH07XG4gICAgICBwYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uKHBhcnQpIHtcbiAgICAgICAgdmFyIHNpZGVzID0gcGFydC5zcGxpdChcIj1cIik7XG4gICAgICAgIHZhciBrZXkgPSBzaWRlcy5zaGlmdCgpLnRyaW1MZWZ0KCkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdmFyIHZhbHVlMiA9IHNpZGVzLmpvaW4oXCI9XCIpO1xuICAgICAgICBpZiAoa2V5ID09PSBcImV4cGlyZXNcIikge1xuICAgICAgICAgIGNvb2tpZS5leHBpcmVzID0gbmV3IERhdGUodmFsdWUyKTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwibWF4LWFnZVwiKSB7XG4gICAgICAgICAgY29va2llLm1heEFnZSA9IHBhcnNlSW50KHZhbHVlMiwgMTApO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJzZWN1cmVcIikge1xuICAgICAgICAgIGNvb2tpZS5zZWN1cmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKGtleSA9PT0gXCJodHRwb25seVwiKSB7XG4gICAgICAgICAgY29va2llLmh0dHBPbmx5ID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChrZXkgPT09IFwic2FtZXNpdGVcIikge1xuICAgICAgICAgIGNvb2tpZS5zYW1lU2l0ZSA9IHZhbHVlMjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb29raWVba2V5XSA9IHZhbHVlMjtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY29va2llO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwYXJzZU5hbWVWYWx1ZVBhaXIobmFtZVZhbHVlUGFpclN0cikge1xuICAgICAgdmFyIG5hbWUgPSBcIlwiO1xuICAgICAgdmFyIHZhbHVlID0gXCJcIjtcbiAgICAgIHZhciBuYW1lVmFsdWVBcnIgPSBuYW1lVmFsdWVQYWlyU3RyLnNwbGl0KFwiPVwiKTtcbiAgICAgIGlmIChuYW1lVmFsdWVBcnIubGVuZ3RoID4gMSkge1xuICAgICAgICBuYW1lID0gbmFtZVZhbHVlQXJyLnNoaWZ0KCk7XG4gICAgICAgIHZhbHVlID0gbmFtZVZhbHVlQXJyLmpvaW4oXCI9XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBuYW1lVmFsdWVQYWlyU3RyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgbmFtZSwgdmFsdWUgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcGFyc2UoaW5wdXQsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBvcHRpb25zID8gT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdFBhcnNlT3B0aW9ucywgb3B0aW9ucykgOiBkZWZhdWx0UGFyc2VPcHRpb25zO1xuICAgICAgaWYgKCFpbnB1dCkge1xuICAgICAgICBpZiAoIW9wdGlvbnMubWFwKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlucHV0LmhlYWRlcnMpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpbnB1dC5oZWFkZXJzLmdldFNldENvb2tpZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaW5wdXQgPSBpbnB1dC5oZWFkZXJzLmdldFNldENvb2tpZSgpO1xuICAgICAgICB9IGVsc2UgaWYgKGlucHV0LmhlYWRlcnNbXCJzZXQtY29va2llXCJdKSB7XG4gICAgICAgICAgaW5wdXQgPSBpbnB1dC5oZWFkZXJzW1wic2V0LWNvb2tpZVwiXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc2NoID0gaW5wdXQuaGVhZGVyc1tPYmplY3Qua2V5cyhpbnB1dC5oZWFkZXJzKS5maW5kKGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuIGtleS50b0xvd2VyQ2FzZSgpID09PSBcInNldC1jb29raWVcIjtcbiAgICAgICAgICB9KV07XG4gICAgICAgICAgaWYgKCFzY2ggJiYgaW5wdXQuaGVhZGVycy5jb29raWUgJiYgIW9wdGlvbnMuc2lsZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgIFwiV2FybmluZzogc2V0LWNvb2tpZS1wYXJzZXIgYXBwZWFycyB0byBoYXZlIGJlZW4gY2FsbGVkIG9uIGEgcmVxdWVzdCBvYmplY3QuIEl0IGlzIGRlc2lnbmVkIHRvIHBhcnNlIFNldC1Db29raWUgaGVhZGVycyBmcm9tIHJlc3BvbnNlcywgbm90IENvb2tpZSBoZWFkZXJzIGZyb20gcmVxdWVzdHMuIFNldCB0aGUgb3B0aW9uIHtzaWxlbnQ6IHRydWV9IHRvIHN1cHByZXNzIHRoaXMgd2FybmluZy5cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaW5wdXQgPSBzY2g7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbnB1dCkpIHtcbiAgICAgICAgaW5wdXQgPSBbaW5wdXRdO1xuICAgICAgfVxuICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgPyBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0UGFyc2VPcHRpb25zLCBvcHRpb25zKSA6IGRlZmF1bHRQYXJzZU9wdGlvbnM7XG4gICAgICBpZiAoIW9wdGlvbnMubWFwKSB7XG4gICAgICAgIHJldHVybiBpbnB1dC5maWx0ZXIoaXNOb25FbXB0eVN0cmluZykubWFwKGZ1bmN0aW9uKHN0cikge1xuICAgICAgICAgIHJldHVybiBwYXJzZVN0cmluZyhzdHIsIG9wdGlvbnMpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBjb29raWVzID0ge307XG4gICAgICAgIHJldHVybiBpbnB1dC5maWx0ZXIoaXNOb25FbXB0eVN0cmluZykucmVkdWNlKGZ1bmN0aW9uKGNvb2tpZXMyLCBzdHIpIHtcbiAgICAgICAgICB2YXIgY29va2llID0gcGFyc2VTdHJpbmcoc3RyLCBvcHRpb25zKTtcbiAgICAgICAgICBjb29raWVzMltjb29raWUubmFtZV0gPSBjb29raWU7XG4gICAgICAgICAgcmV0dXJuIGNvb2tpZXMyO1xuICAgICAgICB9LCBjb29raWVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3BsaXRDb29raWVzU3RyaW5nMihjb29raWVzU3RyaW5nKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShjb29raWVzU3RyaW5nKSkge1xuICAgICAgICByZXR1cm4gY29va2llc1N0cmluZztcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY29va2llc1N0cmluZyAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICB2YXIgY29va2llc1N0cmluZ3MgPSBbXTtcbiAgICAgIHZhciBwb3MgPSAwO1xuICAgICAgdmFyIHN0YXJ0O1xuICAgICAgdmFyIGNoO1xuICAgICAgdmFyIGxhc3RDb21tYTtcbiAgICAgIHZhciBuZXh0U3RhcnQ7XG4gICAgICB2YXIgY29va2llc1NlcGFyYXRvckZvdW5kO1xuICAgICAgZnVuY3Rpb24gc2tpcFdoaXRlc3BhY2UoKSB7XG4gICAgICAgIHdoaWxlIChwb3MgPCBjb29raWVzU3RyaW5nLmxlbmd0aCAmJiAvXFxzLy50ZXN0KGNvb2tpZXNTdHJpbmcuY2hhckF0KHBvcykpKSB7XG4gICAgICAgICAgcG9zICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBvcyA8IGNvb2tpZXNTdHJpbmcubGVuZ3RoO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gbm90U3BlY2lhbENoYXIoKSB7XG4gICAgICAgIGNoID0gY29va2llc1N0cmluZy5jaGFyQXQocG9zKTtcbiAgICAgICAgcmV0dXJuIGNoICE9PSBcIj1cIiAmJiBjaCAhPT0gXCI7XCIgJiYgY2ggIT09IFwiLFwiO1xuICAgICAgfVxuICAgICAgd2hpbGUgKHBvcyA8IGNvb2tpZXNTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgIHN0YXJ0ID0gcG9zO1xuICAgICAgICBjb29raWVzU2VwYXJhdG9yRm91bmQgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKHNraXBXaGl0ZXNwYWNlKCkpIHtcbiAgICAgICAgICBjaCA9IGNvb2tpZXNTdHJpbmcuY2hhckF0KHBvcyk7XG4gICAgICAgICAgaWYgKGNoID09PSBcIixcIikge1xuICAgICAgICAgICAgbGFzdENvbW1hID0gcG9zO1xuICAgICAgICAgICAgcG9zICs9IDE7XG4gICAgICAgICAgICBza2lwV2hpdGVzcGFjZSgpO1xuICAgICAgICAgICAgbmV4dFN0YXJ0ID0gcG9zO1xuICAgICAgICAgICAgd2hpbGUgKHBvcyA8IGNvb2tpZXNTdHJpbmcubGVuZ3RoICYmIG5vdFNwZWNpYWxDaGFyKCkpIHtcbiAgICAgICAgICAgICAgcG9zICs9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocG9zIDwgY29va2llc1N0cmluZy5sZW5ndGggJiYgY29va2llc1N0cmluZy5jaGFyQXQocG9zKSA9PT0gXCI9XCIpIHtcbiAgICAgICAgICAgICAgY29va2llc1NlcGFyYXRvckZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgcG9zID0gbmV4dFN0YXJ0O1xuICAgICAgICAgICAgICBjb29raWVzU3RyaW5ncy5wdXNoKGNvb2tpZXNTdHJpbmcuc3Vic3RyaW5nKHN0YXJ0LCBsYXN0Q29tbWEpKTtcbiAgICAgICAgICAgICAgc3RhcnQgPSBwb3M7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwb3MgPSBsYXN0Q29tbWEgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwb3MgKz0gMTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjb29raWVzU2VwYXJhdG9yRm91bmQgfHwgcG9zID49IGNvb2tpZXNTdHJpbmcubGVuZ3RoKSB7XG4gICAgICAgICAgY29va2llc1N0cmluZ3MucHVzaChjb29raWVzU3RyaW5nLnN1YnN0cmluZyhzdGFydCwgY29va2llc1N0cmluZy5sZW5ndGgpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGNvb2tpZXNTdHJpbmdzO1xuICAgIH1cbiAgICBtb2R1bGUuZXhwb3J0cyA9IHBhcnNlO1xuICAgIG1vZHVsZS5leHBvcnRzLnBhcnNlID0gcGFyc2U7XG4gICAgbW9kdWxlLmV4cG9ydHMucGFyc2VTdHJpbmcgPSBwYXJzZVN0cmluZztcbiAgICBtb2R1bGUuZXhwb3J0cy5zcGxpdENvb2tpZXNTdHJpbmcgPSBzcGxpdENvb2tpZXNTdHJpbmcyO1xuICB9XG59KTtcblxuLy8gc3JjL0hlYWRlcnMudHNcbnZhciBpbXBvcnRfc2V0X2Nvb2tpZV9wYXJzZXIgPSBfX3RvRVNNKHJlcXVpcmVfc2V0X2Nvb2tpZSgpKTtcblxuLy8gc3JjL3V0aWxzL25vcm1hbGl6ZUhlYWRlck5hbWUudHNcbnZhciBIRUFERVJTX0lOVkFMSURfQ0hBUkFDVEVSUyA9IC9bXmEtejAtOVxcLSMkJSYnKisuXl9gfH5dL2k7XG5mdW5jdGlvbiBub3JtYWxpemVIZWFkZXJOYW1lKG5hbWUpIHtcbiAgaWYgKEhFQURFUlNfSU5WQUxJRF9DSEFSQUNURVJTLnRlc3QobmFtZSkgfHwgbmFtZS50cmltKCkgPT09IFwiXCIpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWVcIik7XG4gIH1cbiAgcmV0dXJuIG5hbWUudHJpbSgpLnRvTG93ZXJDYXNlKCk7XG59XG5cbi8vIHNyYy91dGlscy9ub3JtYWxpemVIZWFkZXJWYWx1ZS50c1xudmFyIGNoYXJDb2Rlc1RvUmVtb3ZlID0gW1xuICBTdHJpbmcuZnJvbUNoYXJDb2RlKDEwKSxcbiAgU3RyaW5nLmZyb21DaGFyQ29kZSgxMyksXG4gIFN0cmluZy5mcm9tQ2hhckNvZGUoOSksXG4gIFN0cmluZy5mcm9tQ2hhckNvZGUoMzIpXG5dO1xudmFyIEhFQURFUl9WQUxVRV9SRU1PVkVfUkVHRVhQID0gbmV3IFJlZ0V4cChcbiAgYCheWyR7Y2hhckNvZGVzVG9SZW1vdmUuam9pbihcIlwiKX1dfCRbJHtjaGFyQ29kZXNUb1JlbW92ZS5qb2luKFwiXCIpfV0pYCxcbiAgXCJnXCJcbik7XG5mdW5jdGlvbiBub3JtYWxpemVIZWFkZXJWYWx1ZSh2YWx1ZSkge1xuICBjb25zdCBuZXh0VmFsdWUgPSB2YWx1ZS5yZXBsYWNlKEhFQURFUl9WQUxVRV9SRU1PVkVfUkVHRVhQLCBcIlwiKTtcbiAgcmV0dXJuIG5leHRWYWx1ZTtcbn1cblxuLy8gc3JjL3V0aWxzL2lzVmFsaWRIZWFkZXJOYW1lLnRzXG5mdW5jdGlvbiBpc1ZhbGlkSGVhZGVyTmFtZSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInN0cmluZ1wiKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoYXJhY3RlciA9IHZhbHVlLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKGNoYXJhY3RlciA+IDEyNyB8fCAhaXNUb2tlbihjaGFyYWN0ZXIpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gaXNUb2tlbih2YWx1ZSkge1xuICByZXR1cm4gIVtcbiAgICAxMjcsXG4gICAgMzIsXG4gICAgXCIoXCIsXG4gICAgXCIpXCIsXG4gICAgXCI8XCIsXG4gICAgXCI+XCIsXG4gICAgXCJAXCIsXG4gICAgXCIsXCIsXG4gICAgXCI7XCIsXG4gICAgXCI6XCIsXG4gICAgXCJcXFxcXCIsXG4gICAgJ1wiJyxcbiAgICBcIi9cIixcbiAgICBcIltcIixcbiAgICBcIl1cIixcbiAgICBcIj9cIixcbiAgICBcIj1cIixcbiAgICBcIntcIixcbiAgICBcIn1cIlxuICBdLmluY2x1ZGVzKHZhbHVlKTtcbn1cblxuLy8gc3JjL3V0aWxzL2lzVmFsaWRIZWFkZXJWYWx1ZS50c1xuZnVuY3Rpb24gaXNWYWxpZEhlYWRlclZhbHVlKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHZhbHVlLnRyaW0oKSAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IGNoYXJhY3RlciA9IHZhbHVlLmNoYXJDb2RlQXQoaSk7XG4gICAgaWYgKFxuICAgICAgLy8gTlVMLlxuICAgICAgY2hhcmFjdGVyID09PSAwIHx8IC8vIEhUVFAgbmV3bGluZSBieXRlcy5cbiAgICAgIGNoYXJhY3RlciA9PT0gMTAgfHwgY2hhcmFjdGVyID09PSAxM1xuICAgICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gc3JjL0hlYWRlcnMudHNcbnZhciBOT1JNQUxJWkVEX0hFQURFUlMgPSBTeW1ib2woXCJub3JtYWxpemVkSGVhZGVyc1wiKTtcbnZhciBSQVdfSEVBREVSX05BTUVTID0gU3ltYm9sKFwicmF3SGVhZGVyTmFtZXNcIik7XG52YXIgSEVBREVSX1ZBTFVFX0RFTElNSVRFUiA9IFwiLCBcIjtcbnZhciBfYSwgX2IsIF9jO1xudmFyIEhlYWRlcnMgPSBjbGFzcyBfSGVhZGVycyB7XG4gIGNvbnN0cnVjdG9yKGluaXQpIHtcbiAgICAvLyBOb3JtYWxpemVkIGhlYWRlciB7XCJuYW1lXCI6XCJhLCBiXCJ9IHN0b3JhZ2UuXG4gICAgdGhpc1tfYV0gPSB7fTtcbiAgICAvLyBLZWVwcyB0aGUgbWFwcGluZyBiZXR3ZWVuIHRoZSByYXcgaGVhZGVyIG5hbWVcbiAgICAvLyBhbmQgdGhlIG5vcm1hbGl6ZWQgaGVhZGVyIG5hbWUgdG8gZWFzZSB0aGUgbG9va3VwLlxuICAgIHRoaXNbX2JdID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgICB0aGlzW19jXSA9IFwiSGVhZGVyc1wiO1xuICAgIGlmIChbXCJIZWFkZXJzXCIsIFwiSGVhZGVyc1BvbHlmaWxsXCJdLmluY2x1ZGVzKGluaXQ/LmNvbnN0cnVjdG9yLm5hbWUpIHx8IGluaXQgaW5zdGFuY2VvZiBfSGVhZGVycyB8fCB0eXBlb2YgZ2xvYmFsVGhpcy5IZWFkZXJzICE9PSBcInVuZGVmaW5lZFwiICYmIGluaXQgaW5zdGFuY2VvZiBnbG9iYWxUaGlzLkhlYWRlcnMpIHtcbiAgICAgIGNvbnN0IGluaXRpYWxIZWFkZXJzID0gaW5pdDtcbiAgICAgIGluaXRpYWxIZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgICAgIH0sIHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShpbml0KSkge1xuICAgICAgaW5pdC5mb3JFYWNoKChbbmFtZSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwZW5kKFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5qb2luKEhFQURFUl9WQUxVRV9ERUxJTUlURVIpIDogdmFsdWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAoaW5pdCkge1xuICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoaW5pdCkuZm9yRWFjaCgobmFtZSkgPT4ge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IGluaXRbbmFtZV07XG4gICAgICAgIHRoaXMuYXBwZW5kKFxuICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZS5qb2luKEhFQURFUl9WQUxVRV9ERUxJTUlURVIpIDogdmFsdWVcbiAgICAgICAgKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBbKF9hID0gTk9STUFMSVpFRF9IRUFERVJTLCBfYiA9IFJBV19IRUFERVJfTkFNRVMsIF9jID0gU3ltYm9sLnRvU3RyaW5nVGFnLCBTeW1ib2wuaXRlcmF0b3IpXSgpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRyaWVzKCk7XG4gIH1cbiAgKmtleXMoKSB7XG4gICAgZm9yIChjb25zdCBbbmFtZV0gb2YgdGhpcy5lbnRyaWVzKCkpIHtcbiAgICAgIHlpZWxkIG5hbWU7XG4gICAgfVxuICB9XG4gICp2YWx1ZXMoKSB7XG4gICAgZm9yIChjb25zdCBbLCB2YWx1ZV0gb2YgdGhpcy5lbnRyaWVzKCkpIHtcbiAgICAgIHlpZWxkIHZhbHVlO1xuICAgIH1cbiAgfVxuICAqZW50cmllcygpIHtcbiAgICBsZXQgc29ydGVkS2V5cyA9IE9iamVjdC5rZXlzKHRoaXNbTk9STUFMSVpFRF9IRUFERVJTXSkuc29ydChcbiAgICAgIChhLCBiKSA9PiBhLmxvY2FsZUNvbXBhcmUoYilcbiAgICApO1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiBzb3J0ZWRLZXlzKSB7XG4gICAgICBpZiAobmFtZSA9PT0gXCJzZXQtY29va2llXCIpIHtcbiAgICAgICAgZm9yIChjb25zdCB2YWx1ZSBvZiB0aGlzLmdldFNldENvb2tpZSgpKSB7XG4gICAgICAgICAgeWllbGQgW25hbWUsIHZhbHVlXTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeWllbGQgW25hbWUsIHRoaXMuZ2V0KG5hbWUpXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgYSBib29sZWFuIHN0YXRpbmcgd2hldGhlciBhIGBIZWFkZXJzYCBvYmplY3QgY29udGFpbnMgYSBjZXJ0YWluIGhlYWRlci5cbiAgICovXG4gIGhhcyhuYW1lKSB7XG4gICAgaWYgKCFpc1ZhbGlkSGVhZGVyTmFtZShuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgSW52YWxpZCBoZWFkZXIgbmFtZSBcIiR7bmFtZX1cImApO1xuICAgIH1cbiAgICByZXR1cm4gdGhpc1tOT1JNQUxJWkVEX0hFQURFUlNdLmhhc093blByb3BlcnR5KG5vcm1hbGl6ZUhlYWRlck5hbWUobmFtZSkpO1xuICB9XG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgYEJ5dGVTdHJpbmdgIHNlcXVlbmNlIG9mIGFsbCB0aGUgdmFsdWVzIG9mIGEgaGVhZGVyIHdpdGggYSBnaXZlbiBuYW1lLlxuICAgKi9cbiAgZ2V0KG5hbWUpIHtcbiAgICBpZiAoIWlzVmFsaWRIZWFkZXJOYW1lKG5hbWUpKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYEludmFsaWQgaGVhZGVyIG5hbWUgXCIke25hbWV9XCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNbTk9STUFMSVpFRF9IRUFERVJTXVtub3JtYWxpemVIZWFkZXJOYW1lKG5hbWUpXSA/PyBudWxsO1xuICB9XG4gIC8qKlxuICAgKiBTZXRzIGEgbmV3IHZhbHVlIGZvciBhbiBleGlzdGluZyBoZWFkZXIgaW5zaWRlIGEgYEhlYWRlcnNgIG9iamVjdCwgb3IgYWRkcyB0aGUgaGVhZGVyIGlmIGl0IGRvZXMgbm90IGFscmVhZHkgZXhpc3QuXG4gICAqL1xuICBzZXQobmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoIWlzVmFsaWRIZWFkZXJOYW1lKG5hbWUpIHx8ICFpc1ZhbGlkSGVhZGVyVmFsdWUodmFsdWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vcm1hbGl6ZWROYW1lID0gbm9ybWFsaXplSGVhZGVyTmFtZShuYW1lKTtcbiAgICBjb25zdCBub3JtYWxpemVkVmFsdWUgPSBub3JtYWxpemVIZWFkZXJWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpc1tOT1JNQUxJWkVEX0hFQURFUlNdW25vcm1hbGl6ZWROYW1lXSA9IG5vcm1hbGl6ZUhlYWRlclZhbHVlKG5vcm1hbGl6ZWRWYWx1ZSk7XG4gICAgdGhpc1tSQVdfSEVBREVSX05BTUVTXS5zZXQobm9ybWFsaXplZE5hbWUsIG5hbWUpO1xuICB9XG4gIC8qKlxuICAgKiBBcHBlbmRzIGEgbmV3IHZhbHVlIG9udG8gYW4gZXhpc3RpbmcgaGVhZGVyIGluc2lkZSBhIGBIZWFkZXJzYCBvYmplY3QsIG9yIGFkZHMgdGhlIGhlYWRlciBpZiBpdCBkb2VzIG5vdCBhbHJlYWR5IGV4aXN0LlxuICAgKi9cbiAgYXBwZW5kKG5hbWUsIHZhbHVlKSB7XG4gICAgaWYgKCFpc1ZhbGlkSGVhZGVyTmFtZShuYW1lKSB8fCAhaXNWYWxpZEhlYWRlclZhbHVlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IG5vcm1hbGl6ZUhlYWRlck5hbWUobmFtZSk7XG4gICAgY29uc3Qgbm9ybWFsaXplZFZhbHVlID0gbm9ybWFsaXplSGVhZGVyVmFsdWUodmFsdWUpO1xuICAgIGxldCByZXNvbHZlZFZhbHVlID0gdGhpcy5oYXMobm9ybWFsaXplZE5hbWUpID8gYCR7dGhpcy5nZXQobm9ybWFsaXplZE5hbWUpfSwgJHtub3JtYWxpemVkVmFsdWV9YCA6IG5vcm1hbGl6ZWRWYWx1ZTtcbiAgICB0aGlzLnNldChuYW1lLCByZXNvbHZlZFZhbHVlKTtcbiAgfVxuICAvKipcbiAgICogRGVsZXRlcyBhIGhlYWRlciBmcm9tIHRoZSBgSGVhZGVyc2Agb2JqZWN0LlxuICAgKi9cbiAgZGVsZXRlKG5hbWUpIHtcbiAgICBpZiAoIWlzVmFsaWRIZWFkZXJOYW1lKG5hbWUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICghdGhpcy5oYXMobmFtZSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9ybWFsaXplZE5hbWUgPSBub3JtYWxpemVIZWFkZXJOYW1lKG5hbWUpO1xuICAgIGRlbGV0ZSB0aGlzW05PUk1BTElaRURfSEVBREVSU11bbm9ybWFsaXplZE5hbWVdO1xuICAgIHRoaXNbUkFXX0hFQURFUl9OQU1FU10uZGVsZXRlKG5vcm1hbGl6ZWROYW1lKTtcbiAgfVxuICAvKipcbiAgICogVHJhdmVyc2VzIHRoZSBgSGVhZGVyc2Agb2JqZWN0LFxuICAgKiBjYWxsaW5nIHRoZSBnaXZlbiBjYWxsYmFjayBmb3IgZWFjaCBoZWFkZXIuXG4gICAqL1xuICBmb3JFYWNoKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yIChjb25zdCBbbmFtZSwgdmFsdWVdIG9mIHRoaXMuZW50cmllcygpKSB7XG4gICAgICBjYWxsYmFjay5jYWxsKHRoaXNBcmcsIHZhbHVlLCBuYW1lLCB0aGlzKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgdmFsdWVzXG4gICAqIG9mIGFsbCBTZXQtQ29va2llIGhlYWRlcnMgYXNzb2NpYXRlZFxuICAgKiB3aXRoIGEgcmVzcG9uc2VcbiAgICovXG4gIGdldFNldENvb2tpZSgpIHtcbiAgICBjb25zdCBzZXRDb29raWVIZWFkZXIgPSB0aGlzLmdldChcInNldC1jb29raWVcIik7XG4gICAgaWYgKHNldENvb2tpZUhlYWRlciA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoc2V0Q29va2llSGVhZGVyID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gW1wiXCJdO1xuICAgIH1cbiAgICByZXR1cm4gKDAsIGltcG9ydF9zZXRfY29va2llX3BhcnNlci5zcGxpdENvb2tpZXNTdHJpbmcpKHNldENvb2tpZUhlYWRlcik7XG4gIH1cbn07XG5cbi8vIHNyYy9nZXRSYXdIZWFkZXJzLnRzXG5mdW5jdGlvbiBnZXRSYXdIZWFkZXJzKGhlYWRlcnMpIHtcbiAgY29uc3QgcmF3SGVhZGVycyA9IHt9O1xuICBmb3IgKGNvbnN0IFtuYW1lLCB2YWx1ZV0gb2YgaGVhZGVycy5lbnRyaWVzKCkpIHtcbiAgICByYXdIZWFkZXJzW2hlYWRlcnNbUkFXX0hFQURFUl9OQU1FU10uZ2V0KG5hbWUpXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiByYXdIZWFkZXJzO1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL2hlYWRlcnNUb0xpc3QudHNcbmZ1bmN0aW9uIGhlYWRlcnNUb0xpc3QoaGVhZGVycykge1xuICBjb25zdCBoZWFkZXJzTGlzdCA9IFtdO1xuICBoZWFkZXJzLmZvckVhY2goKHZhbHVlLCBuYW1lKSA9PiB7XG4gICAgY29uc3QgcmVzb2x2ZWRWYWx1ZSA9IHZhbHVlLmluY2x1ZGVzKFwiLFwiKSA/IHZhbHVlLnNwbGl0KFwiLFwiKS5tYXAoKHZhbHVlMikgPT4gdmFsdWUyLnRyaW0oKSkgOiB2YWx1ZTtcbiAgICBoZWFkZXJzTGlzdC5wdXNoKFtuYW1lLCByZXNvbHZlZFZhbHVlXSk7XG4gIH0pO1xuICByZXR1cm4gaGVhZGVyc0xpc3Q7XG59XG5cbi8vIHNyYy90cmFuc2Zvcm1lcnMvaGVhZGVyc1RvU3RyaW5nLnRzXG5mdW5jdGlvbiBoZWFkZXJzVG9TdHJpbmcoaGVhZGVycykge1xuICBjb25zdCBsaXN0ID0gaGVhZGVyc1RvTGlzdChoZWFkZXJzKTtcbiAgY29uc3QgbGluZXMgPSBsaXN0Lm1hcCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlcyA9IFtdLmNvbmNhdCh2YWx1ZSk7XG4gICAgcmV0dXJuIGAke25hbWV9OiAke3ZhbHVlcy5qb2luKFwiLCBcIil9YDtcbiAgfSk7XG4gIHJldHVybiBsaW5lcy5qb2luKFwiXFxyXFxuXCIpO1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL2hlYWRlcnNUb09iamVjdC50c1xudmFyIHNpbmdsZVZhbHVlSGVhZGVycyA9IFtcInVzZXItYWdlbnRcIl07XG5mdW5jdGlvbiBoZWFkZXJzVG9PYmplY3QoaGVhZGVycykge1xuICBjb25zdCBoZWFkZXJzT2JqZWN0ID0ge307XG4gIGhlYWRlcnMuZm9yRWFjaCgodmFsdWUsIG5hbWUpID0+IHtcbiAgICBjb25zdCBpc011bHRpVmFsdWUgPSAhc2luZ2xlVmFsdWVIZWFkZXJzLmluY2x1ZGVzKG5hbWUudG9Mb3dlckNhc2UoKSkgJiYgdmFsdWUuaW5jbHVkZXMoXCIsXCIpO1xuICAgIGhlYWRlcnNPYmplY3RbbmFtZV0gPSBpc011bHRpVmFsdWUgPyB2YWx1ZS5zcGxpdChcIixcIikubWFwKChzKSA9PiBzLnRyaW0oKSkgOiB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiBoZWFkZXJzT2JqZWN0O1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL3N0cmluZ1RvSGVhZGVycy50c1xuZnVuY3Rpb24gc3RyaW5nVG9IZWFkZXJzKHN0cikge1xuICBjb25zdCBsaW5lcyA9IHN0ci50cmltKCkuc3BsaXQoL1tcXHJcXG5dKy8pO1xuICByZXR1cm4gbGluZXMucmVkdWNlKChoZWFkZXJzLCBsaW5lKSA9PiB7XG4gICAgaWYgKGxpbmUudHJpbSgpID09PSBcIlwiKSB7XG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9XG4gICAgY29uc3QgcGFydHMgPSBsaW5lLnNwbGl0KFwiOiBcIik7XG4gICAgY29uc3QgbmFtZSA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJ0cy5qb2luKFwiOiBcIik7XG4gICAgaGVhZGVycy5hcHBlbmQobmFtZSwgdmFsdWUpO1xuICAgIHJldHVybiBoZWFkZXJzO1xuICB9LCBuZXcgSGVhZGVycygpKTtcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9saXN0VG9IZWFkZXJzLnRzXG5mdW5jdGlvbiBsaXN0VG9IZWFkZXJzKGxpc3QpIHtcbiAgY29uc3QgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XG4gIGxpc3QuZm9yRWFjaCgoW25hbWUsIHZhbHVlXSkgPT4ge1xuICAgIGNvbnN0IHZhbHVlcyA9IFtdLmNvbmNhdCh2YWx1ZSk7XG4gICAgdmFsdWVzLmZvckVhY2goKHZhbHVlMikgPT4ge1xuICAgICAgaGVhZGVycy5hcHBlbmQobmFtZSwgdmFsdWUyKTtcbiAgICB9KTtcbiAgfSk7XG4gIHJldHVybiBoZWFkZXJzO1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL3JlZHVjZUhlYWRlcnNPYmplY3QudHNcbmZ1bmN0aW9uIHJlZHVjZUhlYWRlcnNPYmplY3QoaGVhZGVycywgcmVkdWNlciwgaW5pdGlhbFN0YXRlKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhoZWFkZXJzKS5yZWR1Y2UoKG5leHRIZWFkZXJzLCBuYW1lKSA9PiB7XG4gICAgcmV0dXJuIHJlZHVjZXIobmV4dEhlYWRlcnMsIG5hbWUsIGhlYWRlcnNbbmFtZV0pO1xuICB9LCBpbml0aWFsU3RhdGUpO1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL29iamVjdFRvSGVhZGVycy50c1xuZnVuY3Rpb24gb2JqZWN0VG9IZWFkZXJzKGhlYWRlcnNPYmplY3QpIHtcbiAgcmV0dXJuIHJlZHVjZUhlYWRlcnNPYmplY3QoXG4gICAgaGVhZGVyc09iamVjdCxcbiAgICAoaGVhZGVycywgbmFtZSwgdmFsdWUpID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlcyA9IFtdLmNvbmNhdCh2YWx1ZSkuZmlsdGVyKEJvb2xlYW4pO1xuICAgICAgdmFsdWVzLmZvckVhY2goKHZhbHVlMikgPT4ge1xuICAgICAgICBoZWFkZXJzLmFwcGVuZChuYW1lLCB2YWx1ZTIpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9LFxuICAgIG5ldyBIZWFkZXJzKClcbiAgKTtcbn1cblxuLy8gc3JjL3RyYW5zZm9ybWVycy9mbGF0dGVuSGVhZGVyc0xpc3QudHNcbmZ1bmN0aW9uIGZsYXR0ZW5IZWFkZXJzTGlzdChsaXN0KSB7XG4gIHJldHVybiBsaXN0Lm1hcCgoW25hbWUsIHZhbHVlc10pID0+IHtcbiAgICByZXR1cm4gW25hbWUsIFtdLmNvbmNhdCh2YWx1ZXMpLmpvaW4oXCIsIFwiKV07XG4gIH0pO1xufVxuXG4vLyBzcmMvdHJhbnNmb3JtZXJzL2ZsYXR0ZW5IZWFkZXJzT2JqZWN0LnRzXG5mdW5jdGlvbiBmbGF0dGVuSGVhZGVyc09iamVjdChoZWFkZXJzT2JqZWN0KSB7XG4gIHJldHVybiByZWR1Y2VIZWFkZXJzT2JqZWN0KFxuICAgIGhlYWRlcnNPYmplY3QsXG4gICAgKGhlYWRlcnMsIG5hbWUsIHZhbHVlKSA9PiB7XG4gICAgICBoZWFkZXJzW25hbWVdID0gW10uY29uY2F0KHZhbHVlKS5qb2luKFwiLCBcIik7XG4gICAgICByZXR1cm4gaGVhZGVycztcbiAgICB9LFxuICAgIHt9XG4gICk7XG59XG5leHBvcnQge1xuICBIZWFkZXJzLFxuICBmbGF0dGVuSGVhZGVyc0xpc3QsXG4gIGZsYXR0ZW5IZWFkZXJzT2JqZWN0LFxuICBnZXRSYXdIZWFkZXJzLFxuICBoZWFkZXJzVG9MaXN0LFxuICBoZWFkZXJzVG9PYmplY3QsXG4gIGhlYWRlcnNUb1N0cmluZyxcbiAgbGlzdFRvSGVhZGVycyxcbiAgb2JqZWN0VG9IZWFkZXJzLFxuICByZWR1Y2VIZWFkZXJzT2JqZWN0LFxuICBzdHJpbmdUb0hlYWRlcnNcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwIiwiaW1wb3J0ICogYXMgX3N5c2NhbGxzMl8wIGZyb20gJ3NwYWNldGltZTpzeXNAMi4wJztcbmltcG9ydCB7IG1vZHVsZUhvb2tzIH0gZnJvbSAnc3BhY2V0aW1lOnN5c0AyLjAnO1xuaW1wb3J0IHsgaGVhZGVyc1RvTGlzdCwgSGVhZGVycyB9IGZyb20gJ2hlYWRlcnMtcG9seWZpbGwnO1xuXG50eXBlb2YgZ2xvYmFsVGhpcyE9PVwidW5kZWZpbmVkXCImJigoZ2xvYmFsVGhpcy5nbG9iYWw9Z2xvYmFsVGhpcy5nbG9iYWx8fGdsb2JhbFRoaXMpLChnbG9iYWxUaGlzLndpbmRvdz1nbG9iYWxUaGlzLndpbmRvd3x8Z2xvYmFsVGhpcykpO1xudmFyIF9fY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbnZhciBfX2RlZlByb3AgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG52YXIgX19nZXRPd25Qcm9wRGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG52YXIgX19nZXRPd25Qcm9wTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcztcbnZhciBfX2dldFByb3RvT2YgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG52YXIgX19oYXNPd25Qcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBfX2VzbSA9IChmbiwgcmVzKSA9PiBmdW5jdGlvbiBfX2luaXQoKSB7XG4gIHJldHVybiBmbiAmJiAocmVzID0gKDAsIGZuW19fZ2V0T3duUHJvcE5hbWVzKGZuKVswXV0pKGZuID0gMCkpLCByZXM7XG59O1xudmFyIF9fY29tbW9uSlMgPSAoY2IsIG1vZCkgPT4gZnVuY3Rpb24gX19yZXF1aXJlKCkge1xuICByZXR1cm4gbW9kIHx8ICgwLCBjYltfX2dldE93blByb3BOYW1lcyhjYilbMF1dKSgobW9kID0geyBleHBvcnRzOiB7fSB9KS5leHBvcnRzLCBtb2QpLCBtb2QuZXhwb3J0cztcbn07XG52YXIgX19leHBvcnQgPSAodGFyZ2V0LCBhbGwpID0+IHtcbiAgZm9yICh2YXIgbmFtZSBpbiBhbGwpXG4gICAgX19kZWZQcm9wKHRhcmdldCwgbmFtZSwgeyBnZXQ6IGFsbFtuYW1lXSwgZW51bWVyYWJsZTogdHJ1ZSB9KTtcbn07XG52YXIgX19jb3B5UHJvcHMgPSAodG8sIGZyb20sIGV4Y2VwdCwgZGVzYykgPT4ge1xuICBpZiAoZnJvbSAmJiB0eXBlb2YgZnJvbSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgZnJvbSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgZm9yIChsZXQga2V5IG9mIF9fZ2V0T3duUHJvcE5hbWVzKGZyb20pKVxuICAgICAgaWYgKCFfX2hhc093blByb3AuY2FsbCh0bywga2V5KSAmJiBrZXkgIT09IGV4Y2VwdClcbiAgICAgICAgX19kZWZQcm9wKHRvLCBrZXksIHsgZ2V0OiAoKSA9PiBmcm9tW2tleV0sIGVudW1lcmFibGU6ICEoZGVzYyA9IF9fZ2V0T3duUHJvcERlc2MoZnJvbSwga2V5KSkgfHwgZGVzYy5lbnVtZXJhYmxlIH0pO1xuICB9XG4gIHJldHVybiB0bztcbn07XG52YXIgX190b0VTTSA9IChtb2QsIGlzTm9kZU1vZGUsIHRhcmdldCkgPT4gKHRhcmdldCA9IG1vZCAhPSBudWxsID8gX19jcmVhdGUoX19nZXRQcm90b09mKG1vZCkpIDoge30sIF9fY29weVByb3BzKFxuICAvLyBJZiB0aGUgaW1wb3J0ZXIgaXMgaW4gbm9kZSBjb21wYXRpYmlsaXR5IG1vZGUgb3IgdGhpcyBpcyBub3QgYW4gRVNNXG4gIC8vIGZpbGUgdGhhdCBoYXMgYmVlbiBjb252ZXJ0ZWQgdG8gYSBDb21tb25KUyBmaWxlIHVzaW5nIGEgQmFiZWwtXG4gIC8vIGNvbXBhdGlibGUgdHJhbnNmb3JtIChpLmUuIFwiX19lc01vZHVsZVwiIGhhcyBub3QgYmVlbiBzZXQpLCB0aGVuIHNldFxuICAvLyBcImRlZmF1bHRcIiB0byB0aGUgQ29tbW9uSlMgXCJtb2R1bGUuZXhwb3J0c1wiIGZvciBub2RlIGNvbXBhdGliaWxpdHkuXG4gIF9fZGVmUHJvcCh0YXJnZXQsIFwiZGVmYXVsdFwiLCB7IHZhbHVlOiBtb2QsIGVudW1lcmFibGU6IHRydWUgfSkgLFxuICBtb2RcbikpO1xudmFyIF9fdG9Db21tb25KUyA9IChtb2QpID0+IF9fY29weVByb3BzKF9fZGVmUHJvcCh7fSwgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSksIG1vZCk7XG5cbi8vIC4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9iYXNlNjQtanNAMS41LjEvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qc1xudmFyIHJlcXVpcmVfYmFzZTY0X2pzID0gX19jb21tb25KUyh7XG4gIFwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2Jhc2U2NC1qc0AxLjUuMS9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2luZGV4LmpzXCIoZXhwb3J0cykge1xuICAgIGV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGg7XG4gICAgZXhwb3J0cy50b0J5dGVBcnJheSA9IHRvQnl0ZUFycmF5O1xuICAgIGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXkyO1xuICAgIHZhciBsb29rdXAgPSBbXTtcbiAgICB2YXIgcmV2TG9va3VwID0gW107XG4gICAgdmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSBcInVuZGVmaW5lZFwiID8gVWludDhBcnJheSA6IEFycmF5O1xuICAgIHZhciBjb2RlID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCI7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY29kZS5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgbG9va3VwW2ldID0gY29kZVtpXTtcbiAgICAgIHJldkxvb2t1cFtjb2RlLmNoYXJDb2RlQXQoaSldID0gaTtcbiAgICB9XG4gICAgdmFyIGk7XG4gICAgdmFyIGxlbjtcbiAgICByZXZMb29rdXBbXCItXCIuY2hhckNvZGVBdCgwKV0gPSA2MjtcbiAgICByZXZMb29rdXBbXCJfXCIuY2hhckNvZGVBdCgwKV0gPSA2MztcbiAgICBmdW5jdGlvbiBnZXRMZW5zKGI2NCkge1xuICAgICAgdmFyIGxlbjIgPSBiNjQubGVuZ3RoO1xuICAgICAgaWYgKGxlbjIgJSA0ID4gMCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0XCIpO1xuICAgICAgfVxuICAgICAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoXCI9XCIpO1xuICAgICAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW4yO1xuICAgICAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IHZhbGlkTGVuID09PSBsZW4yID8gMCA6IDQgLSB2YWxpZExlbiAlIDQ7XG4gICAgICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dO1xuICAgIH1cbiAgICBmdW5jdGlvbiBieXRlTGVuZ3RoKGI2NCkge1xuICAgICAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NCk7XG4gICAgICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdO1xuICAgICAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV07XG4gICAgICByZXR1cm4gKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzTGVuO1xuICAgIH1cbiAgICBmdW5jdGlvbiBfYnl0ZUxlbmd0aChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgICAgIHJldHVybiAodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQgLSBwbGFjZUhvbGRlcnNMZW47XG4gICAgfVxuICAgIGZ1bmN0aW9uIHRvQnl0ZUFycmF5KGI2NCkge1xuICAgICAgdmFyIHRtcDtcbiAgICAgIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpO1xuICAgICAgdmFyIHZhbGlkTGVuID0gbGVuc1swXTtcbiAgICAgIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdO1xuICAgICAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSk7XG4gICAgICB2YXIgY3VyQnl0ZSA9IDA7XG4gICAgICB2YXIgbGVuMiA9IHBsYWNlSG9sZGVyc0xlbiA+IDAgPyB2YWxpZExlbiAtIDQgOiB2YWxpZExlbjtcbiAgICAgIHZhciBpMjtcbiAgICAgIGZvciAoaTIgPSAwOyBpMiA8IGxlbjI7IGkyICs9IDQpIHtcbiAgICAgICAgdG1wID0gcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyKV0gPDwgMTggfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaTIgKyAxKV0gPDwgMTIgfCByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaTIgKyAyKV0gPDwgNiB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpMiArIDMpXTtcbiAgICAgICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgPj4gMTYgJiAyNTU7XG4gICAgICAgIGFycltjdXJCeXRlKytdID0gdG1wID4+IDggJiAyNTU7XG4gICAgICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMjU1O1xuICAgICAgfVxuICAgICAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgICAgICB0bXAgPSByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaTIpXSA8PCAyIHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyICsgMSldID4+IDQ7XG4gICAgICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMjU1O1xuICAgICAgfVxuICAgICAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMSkge1xuICAgICAgICB0bXAgPSByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaTIpXSA8PCAxMCB8IHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpMiArIDEpXSA8PCA0IHwgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkyICsgMildID4+IDI7XG4gICAgICAgIGFycltjdXJCeXRlKytdID0gdG1wID4+IDggJiAyNTU7XG4gICAgICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMjU1O1xuICAgICAgfVxuICAgICAgcmV0dXJuIGFycjtcbiAgICB9XG4gICAgZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0KG51bSkge1xuICAgICAgcmV0dXJuIGxvb2t1cFtudW0gPj4gMTggJiA2M10gKyBsb29rdXBbbnVtID4+IDEyICYgNjNdICsgbG9va3VwW251bSA+PiA2ICYgNjNdICsgbG9va3VwW251bSAmIDYzXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5jb2RlQ2h1bmsodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgICAgIHZhciB0bXA7XG4gICAgICB2YXIgb3V0cHV0ID0gW107XG4gICAgICBmb3IgKHZhciBpMiA9IHN0YXJ0OyBpMiA8IGVuZDsgaTIgKz0gMykge1xuICAgICAgICB0bXAgPSAodWludDhbaTJdIDw8IDE2ICYgMTY3MTE2ODApICsgKHVpbnQ4W2kyICsgMV0gPDwgOCAmIDY1MjgwKSArICh1aW50OFtpMiArIDJdICYgMjU1KTtcbiAgICAgICAgb3V0cHV0LnB1c2godHJpcGxldFRvQmFzZTY0KHRtcCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG91dHB1dC5qb2luKFwiXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmcm9tQnl0ZUFycmF5Mih1aW50OCkge1xuICAgICAgdmFyIHRtcDtcbiAgICAgIHZhciBsZW4yID0gdWludDgubGVuZ3RoO1xuICAgICAgdmFyIGV4dHJhQnl0ZXMgPSBsZW4yICUgMztcbiAgICAgIHZhciBwYXJ0cyA9IFtdO1xuICAgICAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODM7XG4gICAgICBmb3IgKHZhciBpMiA9IDAsIGxlbjIyID0gbGVuMiAtIGV4dHJhQnl0ZXM7IGkyIDwgbGVuMjI7IGkyICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgICAgIHBhcnRzLnB1c2goZW5jb2RlQ2h1bmsodWludDgsIGkyLCBpMiArIG1heENodW5rTGVuZ3RoID4gbGVuMjIgPyBsZW4yMiA6IGkyICsgbWF4Q2h1bmtMZW5ndGgpKTtcbiAgICAgIH1cbiAgICAgIGlmIChleHRyYUJ5dGVzID09PSAxKSB7XG4gICAgICAgIHRtcCA9IHVpbnQ4W2xlbjIgLSAxXTtcbiAgICAgICAgcGFydHMucHVzaChcbiAgICAgICAgICBsb29rdXBbdG1wID4+IDJdICsgbG9va3VwW3RtcCA8PCA0ICYgNjNdICsgXCI9PVwiXG4gICAgICAgICk7XG4gICAgICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICAgICAgdG1wID0gKHVpbnQ4W2xlbjIgLSAyXSA8PCA4KSArIHVpbnQ4W2xlbjIgLSAxXTtcbiAgICAgICAgcGFydHMucHVzaChcbiAgICAgICAgICBsb29rdXBbdG1wID4+IDEwXSArIGxvb2t1cFt0bXAgPj4gNCAmIDYzXSArIGxvb2t1cFt0bXAgPDwgMiAmIDYzXSArIFwiPVwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcGFydHMuam9pbihcIlwiKTtcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vc3RhdHVzZXNAMi4wLjIvbm9kZV9tb2R1bGVzL3N0YXR1c2VzL2NvZGVzLmpzb25cbnZhciByZXF1aXJlX2NvZGVzID0gX19jb21tb25KUyh7XG4gIFwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0YXR1c2VzQDIuMC4yL25vZGVfbW9kdWxlcy9zdGF0dXNlcy9jb2Rlcy5qc29uXCIoZXhwb3J0cywgbW9kdWxlKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgICBcIjEwMFwiOiBcIkNvbnRpbnVlXCIsXG4gICAgICBcIjEwMVwiOiBcIlN3aXRjaGluZyBQcm90b2NvbHNcIixcbiAgICAgIFwiMTAyXCI6IFwiUHJvY2Vzc2luZ1wiLFxuICAgICAgXCIxMDNcIjogXCJFYXJseSBIaW50c1wiLFxuICAgICAgXCIyMDBcIjogXCJPS1wiLFxuICAgICAgXCIyMDFcIjogXCJDcmVhdGVkXCIsXG4gICAgICBcIjIwMlwiOiBcIkFjY2VwdGVkXCIsXG4gICAgICBcIjIwM1wiOiBcIk5vbi1BdXRob3JpdGF0aXZlIEluZm9ybWF0aW9uXCIsXG4gICAgICBcIjIwNFwiOiBcIk5vIENvbnRlbnRcIixcbiAgICAgIFwiMjA1XCI6IFwiUmVzZXQgQ29udGVudFwiLFxuICAgICAgXCIyMDZcIjogXCJQYXJ0aWFsIENvbnRlbnRcIixcbiAgICAgIFwiMjA3XCI6IFwiTXVsdGktU3RhdHVzXCIsXG4gICAgICBcIjIwOFwiOiBcIkFscmVhZHkgUmVwb3J0ZWRcIixcbiAgICAgIFwiMjI2XCI6IFwiSU0gVXNlZFwiLFxuICAgICAgXCIzMDBcIjogXCJNdWx0aXBsZSBDaG9pY2VzXCIsXG4gICAgICBcIjMwMVwiOiBcIk1vdmVkIFBlcm1hbmVudGx5XCIsXG4gICAgICBcIjMwMlwiOiBcIkZvdW5kXCIsXG4gICAgICBcIjMwM1wiOiBcIlNlZSBPdGhlclwiLFxuICAgICAgXCIzMDRcIjogXCJOb3QgTW9kaWZpZWRcIixcbiAgICAgIFwiMzA1XCI6IFwiVXNlIFByb3h5XCIsXG4gICAgICBcIjMwN1wiOiBcIlRlbXBvcmFyeSBSZWRpcmVjdFwiLFxuICAgICAgXCIzMDhcIjogXCJQZXJtYW5lbnQgUmVkaXJlY3RcIixcbiAgICAgIFwiNDAwXCI6IFwiQmFkIFJlcXVlc3RcIixcbiAgICAgIFwiNDAxXCI6IFwiVW5hdXRob3JpemVkXCIsXG4gICAgICBcIjQwMlwiOiBcIlBheW1lbnQgUmVxdWlyZWRcIixcbiAgICAgIFwiNDAzXCI6IFwiRm9yYmlkZGVuXCIsXG4gICAgICBcIjQwNFwiOiBcIk5vdCBGb3VuZFwiLFxuICAgICAgXCI0MDVcIjogXCJNZXRob2QgTm90IEFsbG93ZWRcIixcbiAgICAgIFwiNDA2XCI6IFwiTm90IEFjY2VwdGFibGVcIixcbiAgICAgIFwiNDA3XCI6IFwiUHJveHkgQXV0aGVudGljYXRpb24gUmVxdWlyZWRcIixcbiAgICAgIFwiNDA4XCI6IFwiUmVxdWVzdCBUaW1lb3V0XCIsXG4gICAgICBcIjQwOVwiOiBcIkNvbmZsaWN0XCIsXG4gICAgICBcIjQxMFwiOiBcIkdvbmVcIixcbiAgICAgIFwiNDExXCI6IFwiTGVuZ3RoIFJlcXVpcmVkXCIsXG4gICAgICBcIjQxMlwiOiBcIlByZWNvbmRpdGlvbiBGYWlsZWRcIixcbiAgICAgIFwiNDEzXCI6IFwiUGF5bG9hZCBUb28gTGFyZ2VcIixcbiAgICAgIFwiNDE0XCI6IFwiVVJJIFRvbyBMb25nXCIsXG4gICAgICBcIjQxNVwiOiBcIlVuc3VwcG9ydGVkIE1lZGlhIFR5cGVcIixcbiAgICAgIFwiNDE2XCI6IFwiUmFuZ2UgTm90IFNhdGlzZmlhYmxlXCIsXG4gICAgICBcIjQxN1wiOiBcIkV4cGVjdGF0aW9uIEZhaWxlZFwiLFxuICAgICAgXCI0MThcIjogXCJJJ20gYSBUZWFwb3RcIixcbiAgICAgIFwiNDIxXCI6IFwiTWlzZGlyZWN0ZWQgUmVxdWVzdFwiLFxuICAgICAgXCI0MjJcIjogXCJVbnByb2Nlc3NhYmxlIEVudGl0eVwiLFxuICAgICAgXCI0MjNcIjogXCJMb2NrZWRcIixcbiAgICAgIFwiNDI0XCI6IFwiRmFpbGVkIERlcGVuZGVuY3lcIixcbiAgICAgIFwiNDI1XCI6IFwiVG9vIEVhcmx5XCIsXG4gICAgICBcIjQyNlwiOiBcIlVwZ3JhZGUgUmVxdWlyZWRcIixcbiAgICAgIFwiNDI4XCI6IFwiUHJlY29uZGl0aW9uIFJlcXVpcmVkXCIsXG4gICAgICBcIjQyOVwiOiBcIlRvbyBNYW55IFJlcXVlc3RzXCIsXG4gICAgICBcIjQzMVwiOiBcIlJlcXVlc3QgSGVhZGVyIEZpZWxkcyBUb28gTGFyZ2VcIixcbiAgICAgIFwiNDUxXCI6IFwiVW5hdmFpbGFibGUgRm9yIExlZ2FsIFJlYXNvbnNcIixcbiAgICAgIFwiNTAwXCI6IFwiSW50ZXJuYWwgU2VydmVyIEVycm9yXCIsXG4gICAgICBcIjUwMVwiOiBcIk5vdCBJbXBsZW1lbnRlZFwiLFxuICAgICAgXCI1MDJcIjogXCJCYWQgR2F0ZXdheVwiLFxuICAgICAgXCI1MDNcIjogXCJTZXJ2aWNlIFVuYXZhaWxhYmxlXCIsXG4gICAgICBcIjUwNFwiOiBcIkdhdGV3YXkgVGltZW91dFwiLFxuICAgICAgXCI1MDVcIjogXCJIVFRQIFZlcnNpb24gTm90IFN1cHBvcnRlZFwiLFxuICAgICAgXCI1MDZcIjogXCJWYXJpYW50IEFsc28gTmVnb3RpYXRlc1wiLFxuICAgICAgXCI1MDdcIjogXCJJbnN1ZmZpY2llbnQgU3RvcmFnZVwiLFxuICAgICAgXCI1MDhcIjogXCJMb29wIERldGVjdGVkXCIsXG4gICAgICBcIjUwOVwiOiBcIkJhbmR3aWR0aCBMaW1pdCBFeGNlZWRlZFwiLFxuICAgICAgXCI1MTBcIjogXCJOb3QgRXh0ZW5kZWRcIixcbiAgICAgIFwiNTExXCI6IFwiTmV0d29yayBBdXRoZW50aWNhdGlvbiBSZXF1aXJlZFwiXG4gICAgfTtcbiAgfVxufSk7XG5cbi8vIC4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9zdGF0dXNlc0AyLjAuMi9ub2RlX21vZHVsZXMvc3RhdHVzZXMvaW5kZXguanNcbnZhciByZXF1aXJlX3N0YXR1c2VzID0gX19jb21tb25KUyh7XG4gIFwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3N0YXR1c2VzQDIuMC4yL25vZGVfbW9kdWxlcy9zdGF0dXNlcy9pbmRleC5qc1wiKGV4cG9ydHMsIG1vZHVsZSkge1xuICAgIHZhciBjb2RlcyA9IHJlcXVpcmVfY29kZXMoKTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHN0YXR1czI7XG4gICAgc3RhdHVzMi5tZXNzYWdlID0gY29kZXM7XG4gICAgc3RhdHVzMi5jb2RlID0gY3JlYXRlTWVzc2FnZVRvU3RhdHVzQ29kZU1hcChjb2Rlcyk7XG4gICAgc3RhdHVzMi5jb2RlcyA9IGNyZWF0ZVN0YXR1c0NvZGVMaXN0KGNvZGVzKTtcbiAgICBzdGF0dXMyLnJlZGlyZWN0ID0ge1xuICAgICAgMzAwOiB0cnVlLFxuICAgICAgMzAxOiB0cnVlLFxuICAgICAgMzAyOiB0cnVlLFxuICAgICAgMzAzOiB0cnVlLFxuICAgICAgMzA1OiB0cnVlLFxuICAgICAgMzA3OiB0cnVlLFxuICAgICAgMzA4OiB0cnVlXG4gICAgfTtcbiAgICBzdGF0dXMyLmVtcHR5ID0ge1xuICAgICAgMjA0OiB0cnVlLFxuICAgICAgMjA1OiB0cnVlLFxuICAgICAgMzA0OiB0cnVlXG4gICAgfTtcbiAgICBzdGF0dXMyLnJldHJ5ID0ge1xuICAgICAgNTAyOiB0cnVlLFxuICAgICAgNTAzOiB0cnVlLFxuICAgICAgNTA0OiB0cnVlXG4gICAgfTtcbiAgICBmdW5jdGlvbiBjcmVhdGVNZXNzYWdlVG9TdGF0dXNDb2RlTWFwKGNvZGVzMikge1xuICAgICAgdmFyIG1hcCA9IHt9O1xuICAgICAgT2JqZWN0LmtleXMoY29kZXMyKS5mb3JFYWNoKGZ1bmN0aW9uIGZvckVhY2hDb2RlKGNvZGUpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBjb2RlczJbY29kZV07XG4gICAgICAgIHZhciBzdGF0dXMzID0gTnVtYmVyKGNvZGUpO1xuICAgICAgICBtYXBbbWVzc2FnZS50b0xvd2VyQ2FzZSgpXSA9IHN0YXR1czM7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNyZWF0ZVN0YXR1c0NvZGVMaXN0KGNvZGVzMikge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKGNvZGVzMikubWFwKGZ1bmN0aW9uIG1hcENvZGUoY29kZSkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKGNvZGUpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFN0YXR1c0NvZGUobWVzc2FnZSkge1xuICAgICAgdmFyIG1zZyA9IG1lc3NhZ2UudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHN0YXR1czIuY29kZSwgbXNnKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc3RhdHVzIG1lc3NhZ2U6IFwiJyArIG1lc3NhZ2UgKyAnXCInKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0dXMyLmNvZGVbbXNnXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0U3RhdHVzTWVzc2FnZShjb2RlKSB7XG4gICAgICBpZiAoIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzdGF0dXMyLm1lc3NhZ2UsIGNvZGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgc3RhdHVzIGNvZGU6IFwiICsgY29kZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdHVzMi5tZXNzYWdlW2NvZGVdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzdGF0dXMyKGNvZGUpIHtcbiAgICAgIGlmICh0eXBlb2YgY29kZSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICByZXR1cm4gZ2V0U3RhdHVzTWVzc2FnZShjb2RlKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgY29kZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY29kZSBtdXN0IGJlIGEgbnVtYmVyIG9yIHN0cmluZ1wiKTtcbiAgICAgIH1cbiAgICAgIHZhciBuID0gcGFyc2VJbnQoY29kZSwgMTApO1xuICAgICAgaWYgKCFpc05hTihuKSkge1xuICAgICAgICByZXR1cm4gZ2V0U3RhdHVzTWVzc2FnZShuKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXRTdGF0dXNDb2RlKGNvZGUpO1xuICAgIH1cbiAgfVxufSk7XG5cbi8vIHNyYy91dGlsLXN0dWIudHNcbnZhciB1dGlsX3N0dWJfZXhwb3J0cyA9IHt9O1xuX19leHBvcnQodXRpbF9zdHViX2V4cG9ydHMsIHtcbiAgaW5zcGVjdDogKCkgPT4gaW5zcGVjdFxufSk7XG52YXIgaW5zcGVjdDtcbnZhciBpbml0X3V0aWxfc3R1YiA9IF9fZXNtKHtcbiAgXCJzcmMvdXRpbC1zdHViLnRzXCIoKSB7XG4gICAgaW5zcGVjdCA9IHt9O1xuICB9XG59KTtcblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL29iamVjdC1pbnNwZWN0QDEuMTMuNC9ub2RlX21vZHVsZXMvb2JqZWN0LWluc3BlY3QvdXRpbC5pbnNwZWN0LmpzXG52YXIgcmVxdWlyZV91dGlsX2luc3BlY3QgPSBfX2NvbW1vbkpTKHtcbiAgXCIuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vb2JqZWN0LWluc3BlY3RAMS4xMy40L25vZGVfbW9kdWxlcy9vYmplY3QtaW5zcGVjdC91dGlsLmluc3BlY3QuanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IChpbml0X3V0aWxfc3R1YigpLCBfX3RvQ29tbW9uSlModXRpbF9zdHViX2V4cG9ydHMpKS5pbnNwZWN0O1xuICB9XG59KTtcblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL29iamVjdC1pbnNwZWN0QDEuMTMuNC9ub2RlX21vZHVsZXMvb2JqZWN0LWluc3BlY3QvaW5kZXguanNcbnZhciByZXF1aXJlX29iamVjdF9pbnNwZWN0ID0gX19jb21tb25KUyh7XG4gIFwiLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL29iamVjdC1pbnNwZWN0QDEuMTMuNC9ub2RlX21vZHVsZXMvb2JqZWN0LWluc3BlY3QvaW5kZXguanNcIihleHBvcnRzLCBtb2R1bGUpIHtcbiAgICB2YXIgaGFzTWFwID0gdHlwZW9mIE1hcCA9PT0gXCJmdW5jdGlvblwiICYmIE1hcC5wcm90b3R5cGU7XG4gICAgdmFyIG1hcFNpemVEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciAmJiBoYXNNYXAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE1hcC5wcm90b3R5cGUsIFwic2l6ZVwiKSA6IG51bGw7XG4gICAgdmFyIG1hcFNpemUgPSBoYXNNYXAgJiYgbWFwU2l6ZURlc2NyaXB0b3IgJiYgdHlwZW9mIG1hcFNpemVEZXNjcmlwdG9yLmdldCA9PT0gXCJmdW5jdGlvblwiID8gbWFwU2l6ZURlc2NyaXB0b3IuZ2V0IDogbnVsbDtcbiAgICB2YXIgbWFwRm9yRWFjaCA9IGhhc01hcCAmJiBNYXAucHJvdG90eXBlLmZvckVhY2g7XG4gICAgdmFyIGhhc1NldCA9IHR5cGVvZiBTZXQgPT09IFwiZnVuY3Rpb25cIiAmJiBTZXQucHJvdG90eXBlO1xuICAgIHZhciBzZXRTaXplRGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgaGFzU2V0ID8gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihTZXQucHJvdG90eXBlLCBcInNpemVcIikgOiBudWxsO1xuICAgIHZhciBzZXRTaXplID0gaGFzU2V0ICYmIHNldFNpemVEZXNjcmlwdG9yICYmIHR5cGVvZiBzZXRTaXplRGVzY3JpcHRvci5nZXQgPT09IFwiZnVuY3Rpb25cIiA/IHNldFNpemVEZXNjcmlwdG9yLmdldCA6IG51bGw7XG4gICAgdmFyIHNldEZvckVhY2ggPSBoYXNTZXQgJiYgU2V0LnByb3RvdHlwZS5mb3JFYWNoO1xuICAgIHZhciBoYXNXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09IFwiZnVuY3Rpb25cIiAmJiBXZWFrTWFwLnByb3RvdHlwZTtcbiAgICB2YXIgd2Vha01hcEhhcyA9IGhhc1dlYWtNYXAgPyBXZWFrTWFwLnByb3RvdHlwZS5oYXMgOiBudWxsO1xuICAgIHZhciBoYXNXZWFrU2V0ID0gdHlwZW9mIFdlYWtTZXQgPT09IFwiZnVuY3Rpb25cIiAmJiBXZWFrU2V0LnByb3RvdHlwZTtcbiAgICB2YXIgd2Vha1NldEhhcyA9IGhhc1dlYWtTZXQgPyBXZWFrU2V0LnByb3RvdHlwZS5oYXMgOiBudWxsO1xuICAgIHZhciBoYXNXZWFrUmVmID0gdHlwZW9mIFdlYWtSZWYgPT09IFwiZnVuY3Rpb25cIiAmJiBXZWFrUmVmLnByb3RvdHlwZTtcbiAgICB2YXIgd2Vha1JlZkRlcmVmID0gaGFzV2Vha1JlZiA/IFdlYWtSZWYucHJvdG90eXBlLmRlcmVmIDogbnVsbDtcbiAgICB2YXIgYm9vbGVhblZhbHVlT2YgPSBCb29sZWFuLnByb3RvdHlwZS52YWx1ZU9mO1xuICAgIHZhciBvYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgdmFyIGZ1bmN0aW9uVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG4gICAgdmFyICRtYXRjaCA9IFN0cmluZy5wcm90b3R5cGUubWF0Y2g7XG4gICAgdmFyICRzbGljZSA9IFN0cmluZy5wcm90b3R5cGUuc2xpY2U7XG4gICAgdmFyICRyZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuICAgIHZhciAkdG9VcHBlckNhc2UgPSBTdHJpbmcucHJvdG90eXBlLnRvVXBwZXJDYXNlO1xuICAgIHZhciAkdG9Mb3dlckNhc2UgPSBTdHJpbmcucHJvdG90eXBlLnRvTG93ZXJDYXNlO1xuICAgIHZhciAkdGVzdCA9IFJlZ0V4cC5wcm90b3R5cGUudGVzdDtcbiAgICB2YXIgJGNvbmNhdCA9IEFycmF5LnByb3RvdHlwZS5jb25jYXQ7XG4gICAgdmFyICRqb2luID0gQXJyYXkucHJvdG90eXBlLmpvaW47XG4gICAgdmFyICRhcnJTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbiAgICB2YXIgJGZsb29yID0gTWF0aC5mbG9vcjtcbiAgICB2YXIgYmlnSW50VmFsdWVPZiA9IHR5cGVvZiBCaWdJbnQgPT09IFwiZnVuY3Rpb25cIiA/IEJpZ0ludC5wcm90b3R5cGUudmFsdWVPZiA6IG51bGw7XG4gICAgdmFyIGdPUFMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuICAgIHZhciBzeW1Ub1N0cmluZyA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gU3ltYm9sLnByb3RvdHlwZS50b1N0cmluZyA6IG51bGw7XG4gICAgdmFyIGhhc1NoYW1tZWRTeW1ib2xzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwib2JqZWN0XCI7XG4gICAgdmFyIHRvU3RyaW5nVGFnID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC50b1N0cmluZ1RhZyAmJiAodHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gaGFzU2hhbW1lZFN5bWJvbHMgPyBcIm9iamVjdFwiIDogXCJzeW1ib2xcIikgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiBudWxsO1xuICAgIHZhciBpc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICAgIHZhciBnUE8gPSAodHlwZW9mIFJlZmxlY3QgPT09IFwiZnVuY3Rpb25cIiA/IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YgOiBPYmplY3QuZ2V0UHJvdG90eXBlT2YpIHx8IChbXS5fX3Byb3RvX18gPT09IEFycmF5LnByb3RvdHlwZSA/IGZ1bmN0aW9uKE8pIHtcbiAgICAgIHJldHVybiBPLl9fcHJvdG9fXztcbiAgICB9IDogbnVsbCk7XG4gICAgZnVuY3Rpb24gYWRkTnVtZXJpY1NlcGFyYXRvcihudW0sIHN0cikge1xuICAgICAgaWYgKG51bSA9PT0gSW5maW5pdHkgfHwgbnVtID09PSAtSW5maW5pdHkgfHwgbnVtICE9PSBudW0gfHwgbnVtICYmIG51bSA+IC0xZTMgJiYgbnVtIDwgMWUzIHx8ICR0ZXN0LmNhbGwoL2UvLCBzdHIpKSB7XG4gICAgICAgIHJldHVybiBzdHI7XG4gICAgICB9XG4gICAgICB2YXIgc2VwUmVnZXggPSAvWzAtOV0oPz0oPzpbMC05XXszfSkrKD8hWzAtOV0pKS9nO1xuICAgICAgaWYgKHR5cGVvZiBudW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgdmFyIGludCA9IG51bSA8IDAgPyAtJGZsb29yKC1udW0pIDogJGZsb29yKG51bSk7XG4gICAgICAgIGlmIChpbnQgIT09IG51bSkge1xuICAgICAgICAgIHZhciBpbnRTdHIgPSBTdHJpbmcoaW50KTtcbiAgICAgICAgICB2YXIgZGVjID0gJHNsaWNlLmNhbGwoc3RyLCBpbnRTdHIubGVuZ3RoICsgMSk7XG4gICAgICAgICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoaW50U3RyLCBzZXBSZWdleCwgXCIkJl9cIikgKyBcIi5cIiArICRyZXBsYWNlLmNhbGwoJHJlcGxhY2UuY2FsbChkZWMsIC8oWzAtOV17M30pL2csIFwiJCZfXCIpLCAvXyQvLCBcIlwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoc3RyLCBzZXBSZWdleCwgXCIkJl9cIik7XG4gICAgfVxuICAgIHZhciB1dGlsSW5zcGVjdCA9IHJlcXVpcmVfdXRpbF9pbnNwZWN0KCk7XG4gICAgdmFyIGluc3BlY3RDdXN0b20gPSB1dGlsSW5zcGVjdC5jdXN0b207XG4gICAgdmFyIGluc3BlY3RTeW1ib2wgPSBpc1N5bWJvbChpbnNwZWN0Q3VzdG9tKSA/IGluc3BlY3RDdXN0b20gOiBudWxsO1xuICAgIHZhciBxdW90ZXMgPSB7XG4gICAgICBfX3Byb3RvX186IG51bGwsXG4gICAgICBcImRvdWJsZVwiOiAnXCInLFxuICAgICAgc2luZ2xlOiBcIidcIlxuICAgIH07XG4gICAgdmFyIHF1b3RlUkVzID0ge1xuICAgICAgX19wcm90b19fOiBudWxsLFxuICAgICAgXCJkb3VibGVcIjogLyhbXCJcXFxcXSkvZyxcbiAgICAgIHNpbmdsZTogLyhbJ1xcXFxdKS9nXG4gICAgfTtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluc3BlY3RfKG9iaiwgb3B0aW9ucywgZGVwdGgsIHNlZW4pIHtcbiAgICAgIHZhciBvcHRzID0gb3B0aW9ucyB8fCB7fTtcbiAgICAgIGlmIChoYXMob3B0cywgXCJxdW90ZVN0eWxlXCIpICYmICFoYXMocXVvdGVzLCBvcHRzLnF1b3RlU3R5bGUpKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBcInF1b3RlU3R5bGVcIiBtdXN0IGJlIFwic2luZ2xlXCIgb3IgXCJkb3VibGVcIicpO1xuICAgICAgfVxuICAgICAgaWYgKGhhcyhvcHRzLCBcIm1heFN0cmluZ0xlbmd0aFwiKSAmJiAodHlwZW9mIG9wdHMubWF4U3RyaW5nTGVuZ3RoID09PSBcIm51bWJlclwiID8gb3B0cy5tYXhTdHJpbmdMZW5ndGggPCAwICYmIG9wdHMubWF4U3RyaW5nTGVuZ3RoICE9PSBJbmZpbml0eSA6IG9wdHMubWF4U3RyaW5nTGVuZ3RoICE9PSBudWxsKSkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJtYXhTdHJpbmdMZW5ndGhcIiwgaWYgcHJvdmlkZWQsIG11c3QgYmUgYSBwb3NpdGl2ZSBpbnRlZ2VyLCBJbmZpbml0eSwgb3IgYG51bGxgJyk7XG4gICAgICB9XG4gICAgICB2YXIgY3VzdG9tSW5zcGVjdCA9IGhhcyhvcHRzLCBcImN1c3RvbUluc3BlY3RcIikgPyBvcHRzLmN1c3RvbUluc3BlY3QgOiB0cnVlO1xuICAgICAgaWYgKHR5cGVvZiBjdXN0b21JbnNwZWN0ICE9PSBcImJvb2xlYW5cIiAmJiBjdXN0b21JbnNwZWN0ICE9PSBcInN5bWJvbFwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJvcHRpb24gXFxcImN1c3RvbUluc3BlY3RcXFwiLCBpZiBwcm92aWRlZCwgbXVzdCBiZSBgdHJ1ZWAsIGBmYWxzZWAsIG9yIGAnc3ltYm9sJ2BcIik7XG4gICAgICB9XG4gICAgICBpZiAoaGFzKG9wdHMsIFwiaW5kZW50XCIpICYmIG9wdHMuaW5kZW50ICE9PSBudWxsICYmIG9wdHMuaW5kZW50ICE9PSBcIlx0XCIgJiYgIShwYXJzZUludChvcHRzLmluZGVudCwgMTApID09PSBvcHRzLmluZGVudCAmJiBvcHRzLmluZGVudCA+IDApKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ29wdGlvbiBcImluZGVudFwiIG11c3QgYmUgXCJcXFxcdFwiLCBhbiBpbnRlZ2VyID4gMCwgb3IgYG51bGxgJyk7XG4gICAgICB9XG4gICAgICBpZiAoaGFzKG9wdHMsIFwibnVtZXJpY1NlcGFyYXRvclwiKSAmJiB0eXBlb2Ygb3B0cy5udW1lcmljU2VwYXJhdG9yICE9PSBcImJvb2xlYW5cIikge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdvcHRpb24gXCJudW1lcmljU2VwYXJhdG9yXCIsIGlmIHByb3ZpZGVkLCBtdXN0IGJlIGB0cnVlYCBvciBgZmFsc2VgJyk7XG4gICAgICB9XG4gICAgICB2YXIgbnVtZXJpY1NlcGFyYXRvciA9IG9wdHMubnVtZXJpY1NlcGFyYXRvcjtcbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHJldHVybiBcInVuZGVmaW5lZFwiO1xuICAgICAgfVxuICAgICAgaWYgKG9iaiA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gXCJudWxsXCI7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJib29sZWFuXCIpIHtcbiAgICAgICAgcmV0dXJuIG9iaiA/IFwidHJ1ZVwiIDogXCJmYWxzZVwiO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgcmV0dXJuIGluc3BlY3RTdHJpbmcob2JqLCBvcHRzKTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2Ygb2JqID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgIGlmIChvYmogPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gSW5maW5pdHkgLyBvYmogPiAwID8gXCIwXCIgOiBcIi0wXCI7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHN0ciA9IFN0cmluZyhvYmopO1xuICAgICAgICByZXR1cm4gbnVtZXJpY1NlcGFyYXRvciA/IGFkZE51bWVyaWNTZXBhcmF0b3Iob2JqLCBzdHIpIDogc3RyO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwiYmlnaW50XCIpIHtcbiAgICAgICAgdmFyIGJpZ0ludFN0ciA9IFN0cmluZyhvYmopICsgXCJuXCI7XG4gICAgICAgIHJldHVybiBudW1lcmljU2VwYXJhdG9yID8gYWRkTnVtZXJpY1NlcGFyYXRvcihvYmosIGJpZ0ludFN0cikgOiBiaWdJbnRTdHI7XG4gICAgICB9XG4gICAgICB2YXIgbWF4RGVwdGggPSB0eXBlb2Ygb3B0cy5kZXB0aCA9PT0gXCJ1bmRlZmluZWRcIiA/IDUgOiBvcHRzLmRlcHRoO1xuICAgICAgaWYgKHR5cGVvZiBkZXB0aCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBkZXB0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAoZGVwdGggPj0gbWF4RGVwdGggJiYgbWF4RGVwdGggPiAwICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGlzQXJyYXkob2JqKSA/IFwiW0FycmF5XVwiIDogXCJbT2JqZWN0XVwiO1xuICAgICAgfVxuICAgICAgdmFyIGluZGVudCA9IGdldEluZGVudChvcHRzLCBkZXB0aCk7XG4gICAgICBpZiAodHlwZW9mIHNlZW4gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgc2VlbiA9IFtdO1xuICAgICAgfSBlbHNlIGlmIChpbmRleE9mKHNlZW4sIG9iaikgPj0gMCkge1xuICAgICAgICByZXR1cm4gXCJbQ2lyY3VsYXJdXCI7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBpbnNwZWN0Myh2YWx1ZSwgZnJvbSwgbm9JbmRlbnQpIHtcbiAgICAgICAgaWYgKGZyb20pIHtcbiAgICAgICAgICBzZWVuID0gJGFyclNsaWNlLmNhbGwoc2Vlbik7XG4gICAgICAgICAgc2Vlbi5wdXNoKGZyb20pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub0luZGVudCkge1xuICAgICAgICAgIHZhciBuZXdPcHRzID0ge1xuICAgICAgICAgICAgZGVwdGg6IG9wdHMuZGVwdGhcbiAgICAgICAgICB9O1xuICAgICAgICAgIGlmIChoYXMob3B0cywgXCJxdW90ZVN0eWxlXCIpKSB7XG4gICAgICAgICAgICBuZXdPcHRzLnF1b3RlU3R5bGUgPSBvcHRzLnF1b3RlU3R5bGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpbnNwZWN0Xyh2YWx1ZSwgbmV3T3B0cywgZGVwdGggKyAxLCBzZWVuKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zcGVjdF8odmFsdWUsIG9wdHMsIGRlcHRoICsgMSwgc2Vlbik7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIG9iaiA9PT0gXCJmdW5jdGlvblwiICYmICFpc1JlZ0V4cChvYmopKSB7XG4gICAgICAgIHZhciBuYW1lID0gbmFtZU9mKG9iaik7XG4gICAgICAgIHZhciBrZXlzID0gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QzKTtcbiAgICAgICAgcmV0dXJuIFwiW0Z1bmN0aW9uXCIgKyAobmFtZSA/IFwiOiBcIiArIG5hbWUgOiBcIiAoYW5vbnltb3VzKVwiKSArIFwiXVwiICsgKGtleXMubGVuZ3RoID4gMCA/IFwiIHsgXCIgKyAkam9pbi5jYWxsKGtleXMsIFwiLCBcIikgKyBcIiB9XCIgOiBcIlwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1N5bWJvbChvYmopKSB7XG4gICAgICAgIHZhciBzeW1TdHJpbmcgPSBoYXNTaGFtbWVkU3ltYm9scyA/ICRyZXBsYWNlLmNhbGwoU3RyaW5nKG9iaiksIC9eKFN5bWJvbFxcKC4qXFwpKV9bXildKiQvLCBcIiQxXCIpIDogc3ltVG9TdHJpbmcuY2FsbChvYmopO1xuICAgICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAhaGFzU2hhbW1lZFN5bWJvbHMgPyBtYXJrQm94ZWQoc3ltU3RyaW5nKSA6IHN5bVN0cmluZztcbiAgICAgIH1cbiAgICAgIGlmIChpc0VsZW1lbnQob2JqKSkge1xuICAgICAgICB2YXIgcyA9IFwiPFwiICsgJHRvTG93ZXJDYXNlLmNhbGwoU3RyaW5nKG9iai5ub2RlTmFtZSkpO1xuICAgICAgICB2YXIgYXR0cnMgPSBvYmouYXR0cmlidXRlcyB8fCBbXTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdHRycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHMgKz0gXCIgXCIgKyBhdHRyc1tpXS5uYW1lICsgXCI9XCIgKyB3cmFwUXVvdGVzKHF1b3RlKGF0dHJzW2ldLnZhbHVlKSwgXCJkb3VibGVcIiwgb3B0cyk7XG4gICAgICAgIH1cbiAgICAgICAgcyArPSBcIj5cIjtcbiAgICAgICAgaWYgKG9iai5jaGlsZE5vZGVzICYmIG9iai5jaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgIHMgKz0gXCIuLi5cIjtcbiAgICAgICAgfVxuICAgICAgICBzICs9IFwiPC9cIiArICR0b0xvd2VyQ2FzZS5jYWxsKFN0cmluZyhvYmoubm9kZU5hbWUpKSArIFwiPlwiO1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgaWYgKG9iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJbXVwiO1xuICAgICAgICB9XG4gICAgICAgIHZhciB4cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0Myk7XG4gICAgICAgIGlmIChpbmRlbnQgJiYgIXNpbmdsZUxpbmVWYWx1ZXMoeHMpKSB7XG4gICAgICAgICAgcmV0dXJuIFwiW1wiICsgaW5kZW50ZWRKb2luKHhzLCBpbmRlbnQpICsgXCJdXCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFwiWyBcIiArICRqb2luLmNhbGwoeHMsIFwiLCBcIikgKyBcIiBdXCI7XG4gICAgICB9XG4gICAgICBpZiAoaXNFcnJvcihvYmopKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGFyck9iaktleXMob2JqLCBpbnNwZWN0Myk7XG4gICAgICAgIGlmICghKFwiY2F1c2VcIiBpbiBFcnJvci5wcm90b3R5cGUpICYmIFwiY2F1c2VcIiBpbiBvYmogJiYgIWlzRW51bWVyYWJsZS5jYWxsKG9iaiwgXCJjYXVzZVwiKSkge1xuICAgICAgICAgIHJldHVybiBcInsgW1wiICsgU3RyaW5nKG9iaikgKyBcIl0gXCIgKyAkam9pbi5jYWxsKCRjb25jYXQuY2FsbChcIltjYXVzZV06IFwiICsgaW5zcGVjdDMob2JqLmNhdXNlKSwgcGFydHMpLCBcIiwgXCIpICsgXCIgfVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gXCJbXCIgKyBTdHJpbmcob2JqKSArIFwiXVwiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcInsgW1wiICsgU3RyaW5nKG9iaikgKyBcIl0gXCIgKyAkam9pbi5jYWxsKHBhcnRzLCBcIiwgXCIpICsgXCIgfVwiO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgY3VzdG9tSW5zcGVjdCkge1xuICAgICAgICBpZiAoaW5zcGVjdFN5bWJvbCAmJiB0eXBlb2Ygb2JqW2luc3BlY3RTeW1ib2xdID09PSBcImZ1bmN0aW9uXCIgJiYgdXRpbEluc3BlY3QpIHtcbiAgICAgICAgICByZXR1cm4gdXRpbEluc3BlY3Qob2JqLCB7IGRlcHRoOiBtYXhEZXB0aCAtIGRlcHRoIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGN1c3RvbUluc3BlY3QgIT09IFwic3ltYm9sXCIgJiYgdHlwZW9mIG9iai5pbnNwZWN0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICByZXR1cm4gb2JqLmluc3BlY3QoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGlzTWFwKG9iaikpIHtcbiAgICAgICAgdmFyIG1hcFBhcnRzID0gW107XG4gICAgICAgIGlmIChtYXBGb3JFYWNoKSB7XG4gICAgICAgICAgbWFwRm9yRWFjaC5jYWxsKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICAgICAgbWFwUGFydHMucHVzaChpbnNwZWN0MyhrZXksIG9iaiwgdHJ1ZSkgKyBcIiA9PiBcIiArIGluc3BlY3QzKHZhbHVlLCBvYmopKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbk9mKFwiTWFwXCIsIG1hcFNpemUuY2FsbChvYmopLCBtYXBQYXJ0cywgaW5kZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1NldChvYmopKSB7XG4gICAgICAgIHZhciBzZXRQYXJ0cyA9IFtdO1xuICAgICAgICBpZiAoc2V0Rm9yRWFjaCkge1xuICAgICAgICAgIHNldEZvckVhY2guY2FsbChvYmosIGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBzZXRQYXJ0cy5wdXNoKGluc3BlY3QzKHZhbHVlLCBvYmopKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29sbGVjdGlvbk9mKFwiU2V0XCIsIHNldFNpemUuY2FsbChvYmopLCBzZXRQYXJ0cywgaW5kZW50KTtcbiAgICAgIH1cbiAgICAgIGlmIChpc1dlYWtNYXAob2JqKSkge1xuICAgICAgICByZXR1cm4gd2Vha0NvbGxlY3Rpb25PZihcIldlYWtNYXBcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXNXZWFrU2V0KG9iaikpIHtcbiAgICAgICAgcmV0dXJuIHdlYWtDb2xsZWN0aW9uT2YoXCJXZWFrU2V0XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGlzV2Vha1JlZihvYmopKSB7XG4gICAgICAgIHJldHVybiB3ZWFrQ29sbGVjdGlvbk9mKFwiV2Vha1JlZlwiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc051bWJlcihvYmopKSB7XG4gICAgICAgIHJldHVybiBtYXJrQm94ZWQoaW5zcGVjdDMoTnVtYmVyKG9iaikpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0JpZ0ludChvYmopKSB7XG4gICAgICAgIHJldHVybiBtYXJrQm94ZWQoaW5zcGVjdDMoYmlnSW50VmFsdWVPZi5jYWxsKG9iaikpKTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0Jvb2xlYW4ob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGJvb2xlYW5WYWx1ZU9mLmNhbGwob2JqKSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNTdHJpbmcob2JqKSkge1xuICAgICAgICByZXR1cm4gbWFya0JveGVkKGluc3BlY3QzKFN0cmluZyhvYmopKSk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBvYmogPT09IHdpbmRvdykge1xuICAgICAgICByZXR1cm4gXCJ7IFtvYmplY3QgV2luZG93XSB9XCI7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIgJiYgb2JqID09PSBnbG9iYWxUaGlzIHx8IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgJiYgb2JqID09PSBnbG9iYWwpIHtcbiAgICAgICAgcmV0dXJuIFwieyBbb2JqZWN0IGdsb2JhbFRoaXNdIH1cIjtcbiAgICAgIH1cbiAgICAgIGlmICghaXNEYXRlKG9iaikgJiYgIWlzUmVnRXhwKG9iaikpIHtcbiAgICAgICAgdmFyIHlzID0gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QzKTtcbiAgICAgICAgdmFyIGlzUGxhaW5PYmplY3QgPSBnUE8gPyBnUE8ob2JqKSA9PT0gT2JqZWN0LnByb3RvdHlwZSA6IG9iaiBpbnN0YW5jZW9mIE9iamVjdCB8fCBvYmouY29uc3RydWN0b3IgPT09IE9iamVjdDtcbiAgICAgICAgdmFyIHByb3RvVGFnID0gb2JqIGluc3RhbmNlb2YgT2JqZWN0ID8gXCJcIiA6IFwibnVsbCBwcm90b3R5cGVcIjtcbiAgICAgICAgdmFyIHN0cmluZ1RhZyA9ICFpc1BsYWluT2JqZWN0ICYmIHRvU3RyaW5nVGFnICYmIE9iamVjdChvYmopID09PSBvYmogJiYgdG9TdHJpbmdUYWcgaW4gb2JqID8gJHNsaWNlLmNhbGwodG9TdHIob2JqKSwgOCwgLTEpIDogcHJvdG9UYWcgPyBcIk9iamVjdFwiIDogXCJcIjtcbiAgICAgICAgdmFyIGNvbnN0cnVjdG9yVGFnID0gaXNQbGFpbk9iamVjdCB8fCB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yICE9PSBcImZ1bmN0aW9uXCIgPyBcIlwiIDogb2JqLmNvbnN0cnVjdG9yLm5hbWUgPyBvYmouY29uc3RydWN0b3IubmFtZSArIFwiIFwiIDogXCJcIjtcbiAgICAgICAgdmFyIHRhZyA9IGNvbnN0cnVjdG9yVGFnICsgKHN0cmluZ1RhZyB8fCBwcm90b1RhZyA/IFwiW1wiICsgJGpvaW4uY2FsbCgkY29uY2F0LmNhbGwoW10sIHN0cmluZ1RhZyB8fCBbXSwgcHJvdG9UYWcgfHwgW10pLCBcIjogXCIpICsgXCJdIFwiIDogXCJcIik7XG4gICAgICAgIGlmICh5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICByZXR1cm4gdGFnICsgXCJ7fVwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpbmRlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdGFnICsgXCJ7XCIgKyBpbmRlbnRlZEpvaW4oeXMsIGluZGVudCkgKyBcIn1cIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFnICsgXCJ7IFwiICsgJGpvaW4uY2FsbCh5cywgXCIsIFwiKSArIFwiIH1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBTdHJpbmcob2JqKTtcbiAgICB9O1xuICAgIGZ1bmN0aW9uIHdyYXBRdW90ZXMocywgZGVmYXVsdFN0eWxlLCBvcHRzKSB7XG4gICAgICB2YXIgc3R5bGUgPSBvcHRzLnF1b3RlU3R5bGUgfHwgZGVmYXVsdFN0eWxlO1xuICAgICAgdmFyIHF1b3RlQ2hhciA9IHF1b3Rlc1tzdHlsZV07XG4gICAgICByZXR1cm4gcXVvdGVDaGFyICsgcyArIHF1b3RlQ2hhcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gcXVvdGUocykge1xuICAgICAgcmV0dXJuICRyZXBsYWNlLmNhbGwoU3RyaW5nKHMpLCAvXCIvZywgXCImcXVvdDtcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNhblRydXN0VG9TdHJpbmcob2JqKSB7XG4gICAgICByZXR1cm4gIXRvU3RyaW5nVGFnIHx8ICEodHlwZW9mIG9iaiA9PT0gXCJvYmplY3RcIiAmJiAodG9TdHJpbmdUYWcgaW4gb2JqIHx8IHR5cGVvZiBvYmpbdG9TdHJpbmdUYWddICE9PSBcInVuZGVmaW5lZFwiKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzQXJyYXkob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNEYXRlKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBEYXRlXVwiICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNSZWdFeHAob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gXCJbb2JqZWN0IFJlZ0V4cF1cIiAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRXJyb3Iob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gXCJbb2JqZWN0IEVycm9yXVwiICYmIGNhblRydXN0VG9TdHJpbmcob2JqKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gXCJbb2JqZWN0IFN0cmluZ11cIiAmJiBjYW5UcnVzdFRvU3RyaW5nKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xuICAgICAgcmV0dXJuIHRvU3RyKG9iaikgPT09IFwiW29iamVjdCBOdW1iZXJdXCIgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0Jvb2xlYW4ob2JqKSB7XG4gICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gXCJbb2JqZWN0IEJvb2xlYW5dXCIgJiYgY2FuVHJ1c3RUb1N0cmluZyhvYmopO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1N5bWJvbChvYmopIHtcbiAgICAgIGlmIChoYXNTaGFtbWVkU3ltYm9scykge1xuICAgICAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgb2JqIGluc3RhbmNlb2YgU3ltYm9sO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBvYmogPT09IFwic3ltYm9sXCIpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBpZiAoIW9iaiB8fCB0eXBlb2Ygb2JqICE9PSBcIm9iamVjdFwiIHx8ICFzeW1Ub1N0cmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICBzeW1Ub1N0cmluZy5jYWxsKG9iaik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc0JpZ0ludChvYmopIHtcbiAgICAgIGlmICghb2JqIHx8IHR5cGVvZiBvYmogIT09IFwib2JqZWN0XCIgfHwgIWJpZ0ludFZhbHVlT2YpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgYmlnSW50VmFsdWVPZi5jYWxsKG9iaik7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB2YXIgaGFzT3duMiA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkgfHwgZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4ga2V5IGluIHRoaXM7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBoYXMob2JqLCBrZXkpIHtcbiAgICAgIHJldHVybiBoYXNPd24yLmNhbGwob2JqLCBrZXkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiB0b1N0cihvYmopIHtcbiAgICAgIHJldHVybiBvYmplY3RUb1N0cmluZy5jYWxsKG9iaik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5hbWVPZihmKSB7XG4gICAgICBpZiAoZi5uYW1lKSB7XG4gICAgICAgIHJldHVybiBmLm5hbWU7XG4gICAgICB9XG4gICAgICB2YXIgbSA9ICRtYXRjaC5jYWxsKGZ1bmN0aW9uVG9TdHJpbmcuY2FsbChmKSwgL15mdW5jdGlvblxccyooW1xcdyRdKykvKTtcbiAgICAgIGlmIChtKSB7XG4gICAgICAgIHJldHVybiBtWzFdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluZGV4T2YoeHMsIHgpIHtcbiAgICAgIGlmICh4cy5pbmRleE9mKSB7XG4gICAgICAgIHJldHVybiB4cy5pbmRleE9mKHgpO1xuICAgICAgfVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSB4cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKHhzW2ldID09PSB4KSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNNYXAoeCkge1xuICAgICAgaWYgKCFtYXBTaXplIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIG1hcFNpemUuY2FsbCh4KTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBzZXRTaXplLmNhbGwoeCk7XG4gICAgICAgIH0gY2F0Y2ggKHMpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIE1hcDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaXNXZWFrTWFwKHgpIHtcbiAgICAgIGlmICghd2Vha01hcEhhcyB8fCAheCB8fCB0eXBlb2YgeCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICB3ZWFrTWFwSGFzLmNhbGwoeCwgd2Vha01hcEhhcyk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgd2Vha1NldEhhcy5jYWxsKHgsIHdlYWtTZXRIYXMpO1xuICAgICAgICB9IGNhdGNoIChzKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggaW5zdGFuY2VvZiBXZWFrTWFwO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1dlYWtSZWYoeCkge1xuICAgICAgaWYgKCF3ZWFrUmVmRGVyZWYgfHwgIXggfHwgdHlwZW9mIHggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgd2Vha1JlZkRlcmVmLmNhbGwoeCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1NldCh4KSB7XG4gICAgICBpZiAoIXNldFNpemUgfHwgIXggfHwgdHlwZW9mIHggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0U2l6ZS5jYWxsKHgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG1hcFNpemUuY2FsbCh4KTtcbiAgICAgICAgfSBjYXRjaCAobSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB4IGluc3RhbmNlb2YgU2V0O1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1dlYWtTZXQoeCkge1xuICAgICAgaWYgKCF3ZWFrU2V0SGFzIHx8ICF4IHx8IHR5cGVvZiB4ICE9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHdlYWtTZXRIYXMuY2FsbCh4LCB3ZWFrU2V0SGFzKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB3ZWFrTWFwSGFzLmNhbGwoeCwgd2Vha01hcEhhcyk7XG4gICAgICAgIH0gY2F0Y2ggKHMpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geCBpbnN0YW5jZW9mIFdlYWtTZXQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzRWxlbWVudCh4KSB7XG4gICAgICBpZiAoIXggfHwgdHlwZW9mIHggIT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBIVE1MRWxlbWVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJiB4IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHlwZW9mIHgubm9kZU5hbWUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHguZ2V0QXR0cmlidXRlID09PSBcImZ1bmN0aW9uXCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluc3BlY3RTdHJpbmcoc3RyLCBvcHRzKSB7XG4gICAgICBpZiAoc3RyLmxlbmd0aCA+IG9wdHMubWF4U3RyaW5nTGVuZ3RoKSB7XG4gICAgICAgIHZhciByZW1haW5pbmcgPSBzdHIubGVuZ3RoIC0gb3B0cy5tYXhTdHJpbmdMZW5ndGg7XG4gICAgICAgIHZhciB0cmFpbGVyID0gXCIuLi4gXCIgKyByZW1haW5pbmcgKyBcIiBtb3JlIGNoYXJhY3RlclwiICsgKHJlbWFpbmluZyA+IDEgPyBcInNcIiA6IFwiXCIpO1xuICAgICAgICByZXR1cm4gaW5zcGVjdFN0cmluZygkc2xpY2UuY2FsbChzdHIsIDAsIG9wdHMubWF4U3RyaW5nTGVuZ3RoKSwgb3B0cykgKyB0cmFpbGVyO1xuICAgICAgfVxuICAgICAgdmFyIHF1b3RlUkUgPSBxdW90ZVJFc1tvcHRzLnF1b3RlU3R5bGUgfHwgXCJzaW5nbGVcIl07XG4gICAgICBxdW90ZVJFLmxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgcyA9ICRyZXBsYWNlLmNhbGwoJHJlcGxhY2UuY2FsbChzdHIsIHF1b3RlUkUsIFwiXFxcXCQxXCIpLCAvW1xceDAwLVxceDFmXS9nLCBsb3dieXRlKTtcbiAgICAgIHJldHVybiB3cmFwUXVvdGVzKHMsIFwic2luZ2xlXCIsIG9wdHMpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBsb3dieXRlKGMpIHtcbiAgICAgIHZhciBuID0gYy5jaGFyQ29kZUF0KDApO1xuICAgICAgdmFyIHggPSB7XG4gICAgICAgIDg6IFwiYlwiLFxuICAgICAgICA5OiBcInRcIixcbiAgICAgICAgMTA6IFwiblwiLFxuICAgICAgICAxMjogXCJmXCIsXG4gICAgICAgIDEzOiBcInJcIlxuICAgICAgfVtuXTtcbiAgICAgIGlmICh4KSB7XG4gICAgICAgIHJldHVybiBcIlxcXFxcIiArIHg7XG4gICAgICB9XG4gICAgICByZXR1cm4gXCJcXFxceFwiICsgKG4gPCAxNiA/IFwiMFwiIDogXCJcIikgKyAkdG9VcHBlckNhc2UuY2FsbChuLnRvU3RyaW5nKDE2KSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1hcmtCb3hlZChzdHIpIHtcbiAgICAgIHJldHVybiBcIk9iamVjdChcIiArIHN0ciArIFwiKVwiO1xuICAgIH1cbiAgICBmdW5jdGlvbiB3ZWFrQ29sbGVjdGlvbk9mKHR5cGUpIHtcbiAgICAgIHJldHVybiB0eXBlICsgXCIgeyA/IH1cIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdGlvbk9mKHR5cGUsIHNpemUsIGVudHJpZXMsIGluZGVudCkge1xuICAgICAgdmFyIGpvaW5lZEVudHJpZXMgPSBpbmRlbnQgPyBpbmRlbnRlZEpvaW4oZW50cmllcywgaW5kZW50KSA6ICRqb2luLmNhbGwoZW50cmllcywgXCIsIFwiKTtcbiAgICAgIHJldHVybiB0eXBlICsgXCIgKFwiICsgc2l6ZSArIFwiKSB7XCIgKyBqb2luZWRFbnRyaWVzICsgXCJ9XCI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNpbmdsZUxpbmVWYWx1ZXMoeHMpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgeHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGluZGV4T2YoeHNbaV0sIFwiXFxuXCIpID49IDApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRJbmRlbnQob3B0cywgZGVwdGgpIHtcbiAgICAgIHZhciBiYXNlSW5kZW50O1xuICAgICAgaWYgKG9wdHMuaW5kZW50ID09PSBcIlx0XCIpIHtcbiAgICAgICAgYmFzZUluZGVudCA9IFwiXHRcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG9wdHMuaW5kZW50ID09PSBcIm51bWJlclwiICYmIG9wdHMuaW5kZW50ID4gMCkge1xuICAgICAgICBiYXNlSW5kZW50ID0gJGpvaW4uY2FsbChBcnJheShvcHRzLmluZGVudCArIDEpLCBcIiBcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGJhc2U6IGJhc2VJbmRlbnQsXG4gICAgICAgIHByZXY6ICRqb2luLmNhbGwoQXJyYXkoZGVwdGggKyAxKSwgYmFzZUluZGVudClcbiAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluZGVudGVkSm9pbih4cywgaW5kZW50KSB7XG4gICAgICBpZiAoeHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgfVxuICAgICAgdmFyIGxpbmVKb2luZXIgPSBcIlxcblwiICsgaW5kZW50LnByZXYgKyBpbmRlbnQuYmFzZTtcbiAgICAgIHJldHVybiBsaW5lSm9pbmVyICsgJGpvaW4uY2FsbCh4cywgXCIsXCIgKyBsaW5lSm9pbmVyKSArIFwiXFxuXCIgKyBpbmRlbnQucHJldjtcbiAgICB9XG4gICAgZnVuY3Rpb24gYXJyT2JqS2V5cyhvYmosIGluc3BlY3QzKSB7XG4gICAgICB2YXIgaXNBcnIgPSBpc0FycmF5KG9iaik7XG4gICAgICB2YXIgeHMgPSBbXTtcbiAgICAgIGlmIChpc0Fycikge1xuICAgICAgICB4cy5sZW5ndGggPSBvYmoubGVuZ3RoO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHhzW2ldID0gaGFzKG9iaiwgaSkgPyBpbnNwZWN0MyhvYmpbaV0sIG9iaikgOiBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgc3ltcyA9IHR5cGVvZiBnT1BTID09PSBcImZ1bmN0aW9uXCIgPyBnT1BTKG9iaikgOiBbXTtcbiAgICAgIHZhciBzeW1NYXA7XG4gICAgICBpZiAoaGFzU2hhbW1lZFN5bWJvbHMpIHtcbiAgICAgICAgc3ltTWFwID0ge307XG4gICAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgc3ltcy5sZW5ndGg7IGsrKykge1xuICAgICAgICAgIHN5bU1hcFtcIiRcIiArIHN5bXNba11dID0gc3ltc1trXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICBpZiAoIWhhcyhvYmosIGtleSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnIgJiYgU3RyaW5nKE51bWJlcihrZXkpKSA9PT0ga2V5ICYmIGtleSA8IG9iai5sZW5ndGgpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaGFzU2hhbW1lZFN5bWJvbHMgJiYgc3ltTWFwW1wiJFwiICsga2V5XSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9IGVsc2UgaWYgKCR0ZXN0LmNhbGwoL1teXFx3JF0vLCBrZXkpKSB7XG4gICAgICAgICAgeHMucHVzaChpbnNwZWN0MyhrZXksIG9iaikgKyBcIjogXCIgKyBpbnNwZWN0MyhvYmpba2V5XSwgb2JqKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgeHMucHVzaChrZXkgKyBcIjogXCIgKyBpbnNwZWN0MyhvYmpba2V5XSwgb2JqKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgZ09QUyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgc3ltcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGlmIChpc0VudW1lcmFibGUuY2FsbChvYmosIHN5bXNbal0pKSB7XG4gICAgICAgICAgICB4cy5wdXNoKFwiW1wiICsgaW5zcGVjdDMoc3ltc1tqXSkgKyBcIl06IFwiICsgaW5zcGVjdDMob2JqW3N5bXNbal1dLCBvYmopKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB4cztcbiAgICB9XG4gIH1cbn0pO1xuXG4vLyBzcmMvbGliL3RpbWVfZHVyYXRpb24udHNcbnZhciBUaW1lRHVyYXRpb24gPSBjbGFzcyBfVGltZUR1cmF0aW9uIHtcbiAgX190aW1lX2R1cmF0aW9uX21pY3Jvc19fO1xuICBzdGF0aWMgTUlDUk9TX1BFUl9NSUxMSVMgPSAxMDAwbjtcbiAgLyoqXG4gICAqIEdldCB0aGUgYWxnZWJyYWljIHR5cGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIHtAbGluayBUaW1lRHVyYXRpb259IHR5cGUuXG4gICAqIEByZXR1cm5zIFRoZSBhbGdlYnJhaWMgdHlwZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHlwZS5cbiAgICovXG4gIHN0YXRpYyBnZXRBbGdlYnJhaWNUeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgZWxlbWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiX190aW1lX2R1cmF0aW9uX21pY3Jvc19fXCIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogQWxnZWJyYWljVHlwZS5JNjRcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0pO1xuICB9XG4gIHN0YXRpYyBpc1RpbWVEdXJhdGlvbihhbGdlYnJhaWNUeXBlKSB7XG4gICAgaWYgKGFsZ2VicmFpY1R5cGUudGFnICE9PSBcIlByb2R1Y3RcIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBlbGVtZW50cyA9IGFsZ2VicmFpY1R5cGUudmFsdWUuZWxlbWVudHM7XG4gICAgaWYgKGVsZW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBtaWNyb3NFbGVtZW50ID0gZWxlbWVudHNbMF07XG4gICAgcmV0dXJuIG1pY3Jvc0VsZW1lbnQubmFtZSA9PT0gXCJfX3RpbWVfZHVyYXRpb25fbWljcm9zX19cIiAmJiBtaWNyb3NFbGVtZW50LmFsZ2VicmFpY1R5cGUudGFnID09PSBcIkk2NFwiO1xuICB9XG4gIGdldCBtaWNyb3MoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190aW1lX2R1cmF0aW9uX21pY3Jvc19fO1xuICB9XG4gIGdldCBtaWxsaXMoKSB7XG4gICAgcmV0dXJuIE51bWJlcih0aGlzLm1pY3JvcyAvIF9UaW1lRHVyYXRpb24uTUlDUk9TX1BFUl9NSUxMSVMpO1xuICB9XG4gIGNvbnN0cnVjdG9yKG1pY3Jvcykge1xuICAgIHRoaXMuX190aW1lX2R1cmF0aW9uX21pY3Jvc19fID0gbWljcm9zO1xuICB9XG4gIHN0YXRpYyBmcm9tTWlsbGlzKG1pbGxpcykge1xuICAgIHJldHVybiBuZXcgX1RpbWVEdXJhdGlvbihCaWdJbnQobWlsbGlzKSAqIF9UaW1lRHVyYXRpb24uTUlDUk9TX1BFUl9NSUxMSVMpO1xuICB9XG4gIC8qKiBUaGlzIG91dHB1dHMgdGhlIHNhbWUgc3RyaW5nIGZvcm1hdCB0aGF0IHdlIHVzZSBpbiB0aGUgaG9zdCBhbmQgaW4gUnVzdCBtb2R1bGVzICovXG4gIHRvU3RyaW5nKCkge1xuICAgIGNvbnN0IG1pY3JvcyA9IHRoaXMubWljcm9zO1xuICAgIGNvbnN0IHNpZ24gPSBtaWNyb3MgPCAwID8gXCItXCIgOiBcIitcIjtcbiAgICBjb25zdCBwb3MgPSBtaWNyb3MgPCAwID8gLW1pY3JvcyA6IG1pY3JvcztcbiAgICBjb25zdCBzZWNzID0gcG9zIC8gMTAwMDAwMG47XG4gICAgY29uc3QgbWljcm9zX3JlbWFpbmluZyA9IHBvcyAlIDEwMDAwMDBuO1xuICAgIHJldHVybiBgJHtzaWdufSR7c2Vjc30uJHtTdHJpbmcobWljcm9zX3JlbWFpbmluZykucGFkU3RhcnQoNiwgXCIwXCIpfWA7XG4gIH1cbn07XG5cbi8vIHNyYy9saWIvdGltZXN0YW1wLnRzXG52YXIgVGltZXN0YW1wID0gY2xhc3MgX1RpbWVzdGFtcCB7XG4gIF9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX187XG4gIHN0YXRpYyBNSUNST1NfUEVSX01JTExJUyA9IDEwMDBuO1xuICBnZXQgbWljcm9zU2luY2VVbml4RXBvY2goKSB7XG4gICAgcmV0dXJuIHRoaXMuX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfXztcbiAgfVxuICBjb25zdHJ1Y3RvcihtaWNyb3MpIHtcbiAgICB0aGlzLl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX18gPSBtaWNyb3M7XG4gIH1cbiAgLyoqXG4gICAqIEdldCB0aGUgYWxnZWJyYWljIHR5cGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIHtAbGluayBUaW1lc3RhbXB9IHR5cGUuXG4gICAqIEByZXR1cm5zIFRoZSBhbGdlYnJhaWMgdHlwZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHlwZS5cbiAgICovXG4gIHN0YXRpYyBnZXRBbGdlYnJhaWNUeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgZWxlbWVudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfX1wiLFxuICAgICAgICAgIGFsZ2VicmFpY1R5cGU6IEFsZ2VicmFpY1R5cGUuSTY0XG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxuICBzdGF0aWMgaXNUaW1lc3RhbXAoYWxnZWJyYWljVHlwZSkge1xuICAgIGlmIChhbGdlYnJhaWNUeXBlLnRhZyAhPT0gXCJQcm9kdWN0XCIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgZWxlbWVudHMgPSBhbGdlYnJhaWNUeXBlLnZhbHVlLmVsZW1lbnRzO1xuICAgIGlmIChlbGVtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgY29uc3QgbWljcm9zRWxlbWVudCA9IGVsZW1lbnRzWzBdO1xuICAgIHJldHVybiBtaWNyb3NFbGVtZW50Lm5hbWUgPT09IFwiX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfX1wiICYmIG1pY3Jvc0VsZW1lbnQuYWxnZWJyYWljVHlwZS50YWcgPT09IFwiSTY0XCI7XG4gIH1cbiAgLyoqXG4gICAqIFRoZSBVbml4IGVwb2NoLCB0aGUgbWlkbmlnaHQgYXQgdGhlIGJlZ2lubmluZyBvZiBKYW51YXJ5IDEsIDE5NzAsIFVUQy5cbiAgICovXG4gIHN0YXRpYyBVTklYX0VQT0NIID0gbmV3IF9UaW1lc3RhbXAoMG4pO1xuICAvKipcbiAgICogR2V0IGEgYFRpbWVzdGFtcGAgcmVwcmVzZW50aW5nIHRoZSBleGVjdXRpb24gZW52aXJvbm1lbnQncyBiZWxpZWYgb2YgdGhlIGN1cnJlbnQgbW9tZW50IGluIHRpbWUuXG4gICAqL1xuICBzdGF0aWMgbm93KCkge1xuICAgIHJldHVybiBfVGltZXN0YW1wLmZyb21EYXRlKC8qIEBfX1BVUkVfXyAqLyBuZXcgRGF0ZSgpKTtcbiAgfVxuICAvKiogQ29udmVydCB0byBtaWxsaXNlY29uZHMgc2luY2UgVW5peCBlcG9jaC4gKi9cbiAgdG9NaWxsaXMoKSB7XG4gICAgcmV0dXJuIHRoaXMubWljcm9zU2luY2VVbml4RXBvY2ggLyAxMDAwbjtcbiAgfVxuICAvKipcbiAgICogR2V0IGEgYFRpbWVzdGFtcGAgcmVwcmVzZW50aW5nIHRoZSBzYW1lIHBvaW50IGluIHRpbWUgYXMgYGRhdGVgLlxuICAgKi9cbiAgc3RhdGljIGZyb21EYXRlKGRhdGUpIHtcbiAgICBjb25zdCBtaWxsaXMgPSBkYXRlLmdldFRpbWUoKTtcbiAgICBjb25zdCBtaWNyb3MgPSBCaWdJbnQobWlsbGlzKSAqIF9UaW1lc3RhbXAuTUlDUk9TX1BFUl9NSUxMSVM7XG4gICAgcmV0dXJuIG5ldyBfVGltZXN0YW1wKG1pY3Jvcyk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhIGBEYXRlYCByZXByZXNlbnRpbmcgYXBwcm94aW1hdGVseSB0aGUgc2FtZSBwb2ludCBpbiB0aW1lIGFzIGB0aGlzYC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgdHJ1bmNhdGVzIHRvIG1pbGxpc2Vjb25kIHByZWNpc2lvbixcbiAgICogYW5kIHRocm93cyBgUmFuZ2VFcnJvcmAgaWYgdGhlIGBUaW1lc3RhbXBgIGlzIG91dHNpZGUgdGhlIHJhbmdlIHJlcHJlc2VudGFibGUgYXMgYSBgRGF0ZWAuXG4gICAqL1xuICB0b0RhdGUoKSB7XG4gICAgY29uc3QgbWljcm9zID0gdGhpcy5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fO1xuICAgIGNvbnN0IG1pbGxpcyA9IG1pY3JvcyAvIF9UaW1lc3RhbXAuTUlDUk9TX1BFUl9NSUxMSVM7XG4gICAgaWYgKG1pbGxpcyA+IEJpZ0ludChOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikgfHwgbWlsbGlzIDwgQmlnSW50KE51bWJlci5NSU5fU0FGRV9JTlRFR0VSKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIFwiVGltZXN0YW1wIGlzIG91dHNpZGUgb2YgdGhlIHJlcHJlc2VudGFibGUgcmFuZ2Ugb2YgSlMncyBEYXRlXCJcbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRGF0ZShOdW1iZXIobWlsbGlzKSk7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBhbiBJU08gODYwMSAvIFJGQyAzMzM5IGZvcm1hdHRlZCBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhpcyB0aW1lc3RhbXAgd2l0aCBtaWNyb3NlY29uZCBwcmVjaXNpb24uXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIHByZXNlcnZlcyB0aGUgZnVsbCBtaWNyb3NlY29uZCBwcmVjaXNpb24gb2YgdGhlIHRpbWVzdGFtcCxcbiAgICogYW5kIHRocm93cyBgUmFuZ2VFcnJvcmAgaWYgdGhlIGBUaW1lc3RhbXBgIGlzIG91dHNpZGUgdGhlIHJhbmdlIHJlcHJlc2VudGFibGUgaW4gSVNPIGZvcm1hdC5cbiAgICpcbiAgICogQHJldHVybnMgSVNPIDg2MDEgZm9ybWF0dGVkIHN0cmluZyB3aXRoIG1pY3Jvc2Vjb25kIHByZWNpc2lvbiAoZS5nLiwgJzIwMjUtMDItMTdUMTA6MzA6NDUuMTIzNDU2WicpXG4gICAqL1xuICB0b0lTT1N0cmluZygpIHtcbiAgICBjb25zdCBtaWNyb3MgPSB0aGlzLl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX187XG4gICAgY29uc3QgbWlsbGlzID0gbWljcm9zIC8gX1RpbWVzdGFtcC5NSUNST1NfUEVSX01JTExJUztcbiAgICBpZiAobWlsbGlzID4gQmlnSW50KE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB8fCBtaWxsaXMgPCBCaWdJbnQoTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVIpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcihcbiAgICAgICAgXCJUaW1lc3RhbXAgaXMgb3V0c2lkZSBvZiB0aGUgcmVwcmVzZW50YWJsZSByYW5nZSBmb3IgSVNPIHN0cmluZyBmb3JtYXR0aW5nXCJcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZShOdW1iZXIobWlsbGlzKSk7XG4gICAgY29uc3QgaXNvQmFzZSA9IGRhdGUudG9JU09TdHJpbmcoKTtcbiAgICBjb25zdCBtaWNyb3NSZW1haW5kZXIgPSBNYXRoLmFicyhOdW1iZXIobWljcm9zICUgMTAwMDAwMG4pKTtcbiAgICBjb25zdCBmcmFjdGlvbmFsUGFydCA9IFN0cmluZyhtaWNyb3NSZW1haW5kZXIpLnBhZFN0YXJ0KDYsIFwiMFwiKTtcbiAgICByZXR1cm4gaXNvQmFzZS5yZXBsYWNlKC9cXC5cXGR7M31aJC8sIGAuJHtmcmFjdGlvbmFsUGFydH1aYCk7XG4gIH1cbiAgc2luY2Uob3RoZXIpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVEdXJhdGlvbihcbiAgICAgIHRoaXMuX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfXyAtIG90aGVyLl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX19cbiAgICApO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL3V1aWQudHNcbnZhciBVdWlkID0gY2xhc3MgX1V1aWQge1xuICBfX3V1aWRfXztcbiAgLyoqXG4gICAqIFRoZSBuaWwgVVVJRCAoYWxsIHplcm9zKS5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogYGBgdHNcbiAgICogY29uc3QgdXVpZCA9IFV1aWQuTklMO1xuICAgKiBjb25zb2xlLmFzc2VydChcbiAgICogICB1dWlkLnRvU3RyaW5nKCkgPT09IFwiMDAwMDAwMDAtMDAwMC0wMDAwLTAwMDAtMDAwMDAwMDAwMDAwXCJcbiAgICogKTtcbiAgICogYGBgXG4gICAqL1xuICBzdGF0aWMgTklMID0gbmV3IF9VdWlkKDBuKTtcbiAgc3RhdGljIE1BWF9VVUlEX0JJR0lOVCA9IDB4ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZuO1xuICAvKipcbiAgICogVGhlIG1heCBVVUlEIChhbGwgb25lcykuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGBgYHRzXG4gICAqIGNvbnN0IHV1aWQgPSBVdWlkLk1BWDtcbiAgICogY29uc29sZS5hc3NlcnQoXG4gICAqICAgdXVpZC50b1N0cmluZygpID09PSBcImZmZmZmZmZmLWZmZmYtZmZmZi1mZmZmLWZmZmZmZmZmZmZmZlwiXG4gICAqICk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIE1BWCA9IG5ldyBfVXVpZChfVXVpZC5NQVhfVVVJRF9CSUdJTlQpO1xuICAvKipcbiAgICogQ3JlYXRlIGEgVVVJRCBmcm9tIGEgcmF3IDEyOC1iaXQgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSB1IC0gVW5zaWduZWQgMTI4LWJpdCBpbnRlZ2VyXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmFsdWUgaXMgb3V0c2lkZSB0aGUgdmFsaWQgVVVJRCByYW5nZVxuICAgKi9cbiAgY29uc3RydWN0b3IodSkge1xuICAgIGlmICh1IDwgMG4gfHwgdSA+IF9VdWlkLk1BWF9VVUlEX0JJR0lOVCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBVVUlEOiBtdXN0IGJlIGJldHdlZW4gMCBhbmQgYE1BWF9VVUlEX0JJR0lOVGBcIik7XG4gICAgfVxuICAgIHRoaXMuX191dWlkX18gPSB1O1xuICB9XG4gIC8qKlxuICAgKiBDcmVhdGUgYSBVVUlEIGB2NGAgZnJvbSBleHBsaWNpdCByYW5kb20gYnl0ZXMuXG4gICAqXG4gICAqIFRoaXMgbWV0aG9kIGFzc3VtZXMgdGhlIGJ5dGVzIGFyZSBhbHJlYWR5IHN1ZmZpY2llbnRseSByYW5kb20uXG4gICAqIEl0IG9ubHkgc2V0cyB0aGUgYXBwcm9wcmlhdGUgYml0cyBmb3IgdGhlIFVVSUQgdmVyc2lvbiBhbmQgdmFyaWFudC5cbiAgICpcbiAgICogQHBhcmFtIGJ5dGVzIC0gRXhhY3RseSAxNiByYW5kb20gYnl0ZXNcbiAgICogQHJldHVybnMgQSBVVUlEIGB2NGBcbiAgICogQHRocm93cyB7RXJyb3J9IElmIGBieXRlcy5sZW5ndGggIT09IDE2YFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0c1xuICAgKiBjb25zdCByYW5kb21CeXRlcyA9IG5ldyBVaW50OEFycmF5KDE2KTtcbiAgICogY29uc3QgdXVpZCA9IFV1aWQuZnJvbVJhbmRvbUJ5dGVzVjQocmFuZG9tQnl0ZXMpO1xuICAgKlxuICAgKiBjb25zb2xlLmFzc2VydChcbiAgICogICB1dWlkLnRvU3RyaW5nKCkgPT09IFwiMDAwMDAwMDAtMDAwMC00MDAwLTgwMDAtMDAwMDAwMDAwMDAwXCJcbiAgICogKTtcbiAgICogYGBgXG4gICAqL1xuICBzdGF0aWMgZnJvbVJhbmRvbUJ5dGVzVjQoYnl0ZXMpIHtcbiAgICBpZiAoYnl0ZXMubGVuZ3RoICE9PSAxNikgdGhyb3cgbmV3IEVycm9yKFwiVVVJRCB2NCByZXF1aXJlcyAxNiBieXRlc1wiKTtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheShieXRlcyk7XG4gICAgYXJyWzZdID0gYXJyWzZdICYgMTUgfCA2NDtcbiAgICBhcnJbOF0gPSBhcnJbOF0gJiA2MyB8IDEyODtcbiAgICByZXR1cm4gbmV3IF9VdWlkKF9VdWlkLmJ5dGVzVG9CaWdJbnQoYXJyKSk7XG4gIH1cbiAgLyoqXG4gICAqIEdlbmVyYXRlIGEgVVVJRCBgdjdgIHVzaW5nIGEgbW9ub3RvbmljIGNvdW50ZXIgZnJvbSBgMGAgdG8gYDJeMzEgLSAxYCxcbiAgICogYSB0aW1lc3RhbXAsIGFuZCA0IHJhbmRvbSBieXRlcy5cbiAgICpcbiAgICogVGhlIGNvdW50ZXIgd3JhcHMgYXJvdW5kIG9uIG92ZXJmbG93LlxuICAgKlxuICAgKiBUaGUgVVVJRCBgdjdgIGlzIHN0cnVjdHVyZWQgYXMgZm9sbG93czpcbiAgICpcbiAgICogYGBgYXNjaWlcbiAgICog4pSM4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSs4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSQXG4gICAqIHwgQjAgIHwgQjEgIHwgQjIgIHwgQjMgIHwgQjQgIHwgQjUgICAgICAgICAgICAgIHwgICAgICAgICBCNiAgICAgICAgfFxuICAgKiDilJzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilLzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilKRcbiAgICogfCAgICAgICAgICAgICAgICAgdW5peF90c19tcyAgICAgICAgICAgICAgICAgICAgfCAgICAgIHZlcnNpb24gNyAgICB8XG4gICAqIOKUlOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUtOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUmFxuICAgKiDilIzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilKzilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilJBcbiAgICogfCBCNyAgICAgICAgICAgfCBCOCAgICAgIHwgQjkgIHwgQjEwIHwgQjExICB8IEIxMiB8IEIxMyB8IEIxNCB8IEIxNSB8XG4gICAqIOKUnOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUvOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUvOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUvOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUpFxuICAgKiB8IGNvdW50ZXJfaGlnaCB8IHZhcmlhbnQgfCAgICBjb3VudGVyX2xvdyAgIHwgICAgICAgIHJhbmRvbSAgICAgICAgIHxcbiAgICog4pSU4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pS04pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSYXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gY291bnRlciAtIE11dGFibGUgbW9ub3RvbmljIGNvdW50ZXIgKDMxLWJpdClcbiAgICogQHBhcmFtIG5vdyAtIFRpbWVzdGFtcCBzaW5jZSB0aGUgVW5peCBlcG9jaFxuICAgKiBAcGFyYW0gcmFuZG9tQnl0ZXMgLSBFeGFjdGx5IDQgcmFuZG9tIGJ5dGVzXG4gICAqIEByZXR1cm5zIEEgVVVJRCBgdjdgXG4gICAqXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgYGNvdW50ZXJgIGlzIG5lZ2F0aXZlXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgYHRpbWVzdGFtcGAgaXMgYmVmb3JlIHRoZSBVbml4IGVwb2NoXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiBgcmFuZG9tQnl0ZXMubGVuZ3RoICE9PSA0YFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBub3cgPSBUaW1lc3RhbXAuZnJvbU1pbGxpcygxXzY4Nl8wMDBfMDAwXzAwMG4pO1xuICAgKiBjb25zdCBjb3VudGVyID0geyB2YWx1ZTogMSB9O1xuICAgKiBjb25zdCByYW5kb21CeXRlcyA9IG5ldyBVaW50OEFycmF5KDQpO1xuICAgKlxuICAgKiBjb25zdCB1dWlkID0gVXVpZC5mcm9tQ291bnRlclY3KGNvdW50ZXIsIG5vdywgcmFuZG9tQnl0ZXMpO1xuICAgKlxuICAgKiBjb25zb2xlLmFzc2VydChcbiAgICogICB1dWlkLnRvU3RyaW5nKCkgPT09IFwiMDAwMDY0N2UtNTE4MC03MDAwLTgwMDAtMDAwMjAwMDAwMDAwXCJcbiAgICogKTtcbiAgICogYGBgXG4gICAqL1xuICBzdGF0aWMgZnJvbUNvdW50ZXJWNyhjb3VudGVyLCBub3csIHJhbmRvbUJ5dGVzKSB7XG4gICAgaWYgKHJhbmRvbUJ5dGVzLmxlbmd0aCAhPT0gNCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYGZyb21Db3VudGVyVjdgIHJlcXVpcmVzIGByYW5kb21CeXRlcy5sZW5ndGggPT0gNGBcIik7XG4gICAgfVxuICAgIGlmIChjb3VudGVyLnZhbHVlIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiYGZyb21Db3VudGVyVjdgIHV1aWQgYGNvdW50ZXJgIG11c3QgYmUgbm9uLW5lZ2F0aXZlXCIpO1xuICAgIH1cbiAgICBpZiAobm93Ll9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX18gPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJgZnJvbUNvdW50ZXJWN2AgYHRpbWVzdGFtcGAgYmVmb3JlIHVuaXggZXBvY2hcIik7XG4gICAgfVxuICAgIGNvbnN0IGNvdW50ZXJWYWwgPSBjb3VudGVyLnZhbHVlO1xuICAgIGNvdW50ZXIudmFsdWUgPSBjb3VudGVyVmFsICsgMSAmIDIxNDc0ODM2NDc7XG4gICAgY29uc3QgdHNNcyA9IG5vdy50b01pbGxpcygpICYgMHhmZmZmZmZmZmZmZmZuO1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIGJ5dGVzWzBdID0gTnVtYmVyKHRzTXMgPj4gNDBuICYgMHhmZm4pO1xuICAgIGJ5dGVzWzFdID0gTnVtYmVyKHRzTXMgPj4gMzJuICYgMHhmZm4pO1xuICAgIGJ5dGVzWzJdID0gTnVtYmVyKHRzTXMgPj4gMjRuICYgMHhmZm4pO1xuICAgIGJ5dGVzWzNdID0gTnVtYmVyKHRzTXMgPj4gMTZuICYgMHhmZm4pO1xuICAgIGJ5dGVzWzRdID0gTnVtYmVyKHRzTXMgPj4gOG4gJiAweGZmbik7XG4gICAgYnl0ZXNbNV0gPSBOdW1iZXIodHNNcyAmIDB4ZmZuKTtcbiAgICBieXRlc1s3XSA9IGNvdW50ZXJWYWwgPj4+IDIzICYgMjU1O1xuICAgIGJ5dGVzWzldID0gY291bnRlclZhbCA+Pj4gMTUgJiAyNTU7XG4gICAgYnl0ZXNbMTBdID0gY291bnRlclZhbCA+Pj4gNyAmIDI1NTtcbiAgICBieXRlc1sxMV0gPSAoY291bnRlclZhbCAmIDEyNykgPDwgMSAmIDI1NTtcbiAgICBieXRlc1sxMl0gfD0gcmFuZG9tQnl0ZXNbMF0gJiAxMjc7XG4gICAgYnl0ZXNbMTNdID0gcmFuZG9tQnl0ZXNbMV07XG4gICAgYnl0ZXNbMTRdID0gcmFuZG9tQnl0ZXNbMl07XG4gICAgYnl0ZXNbMTVdID0gcmFuZG9tQnl0ZXNbM107XG4gICAgYnl0ZXNbNl0gPSBieXRlc1s2XSAmIDE1IHwgMTEyO1xuICAgIGJ5dGVzWzhdID0gYnl0ZXNbOF0gJiA2MyB8IDEyODtcbiAgICByZXR1cm4gbmV3IF9VdWlkKF9VdWlkLmJ5dGVzVG9CaWdJbnQoYnl0ZXMpKTtcbiAgfVxuICAvKipcbiAgICogUGFyc2UgYSBVVUlEIGZyb20gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24uXG4gICAqXG4gICAqIEBwYXJhbSBzIC0gVVVJRCBzdHJpbmdcbiAgICogQHJldHVybnMgUGFyc2VkIFVVSURcbiAgICogQHRocm93cyB7RXJyb3J9IElmIHRoZSBzdHJpbmcgaXMgbm90IGEgdmFsaWQgVVVJRFxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiBgYGB0c1xuICAgKiBjb25zdCBzID0gXCIwMTg4OGQ2ZS01YzAwLTcwMDAtODAwMC0wMDAwMDAwMDAwMDBcIjtcbiAgICogY29uc3QgdXVpZCA9IFV1aWQucGFyc2Uocyk7XG4gICAqXG4gICAqIGNvbnNvbGUuYXNzZXJ0KHV1aWQudG9TdHJpbmcoKSA9PT0gcyk7XG4gICAqIGBgYFxuICAgKi9cbiAgc3RhdGljIHBhcnNlKHMpIHtcbiAgICBjb25zdCBoZXggPSBzLnJlcGxhY2UoLy0vZywgXCJcIik7XG4gICAgaWYgKGhleC5sZW5ndGggIT09IDMyKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGhleCBVVUlEXCIpO1xuICAgIGxldCB2ID0gMG47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzMjsgaSArPSAyKSB7XG4gICAgICB2ID0gdiA8PCA4biB8IEJpZ0ludChwYXJzZUludChoZXguc2xpY2UoaSwgaSArIDIpLCAxNikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IF9VdWlkKHYpO1xuICB9XG4gIC8qKiBDb252ZXJ0IHRvIHN0cmluZyAoaHlwaGVuYXRlZCBmb3JtKS4gKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgY29uc3QgYnl0ZXMgPSBfVXVpZC5iaWdJbnRUb0J5dGVzKHRoaXMuX191dWlkX18pO1xuICAgIGNvbnN0IGhleCA9IFsuLi5ieXRlc10ubWFwKChiKSA9PiBiLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpLmpvaW4oXCJcIik7XG4gICAgcmV0dXJuIGhleC5zbGljZSgwLCA4KSArIFwiLVwiICsgaGV4LnNsaWNlKDgsIDEyKSArIFwiLVwiICsgaGV4LnNsaWNlKDEyLCAxNikgKyBcIi1cIiArIGhleC5zbGljZSgxNiwgMjApICsgXCItXCIgKyBoZXguc2xpY2UoMjApO1xuICB9XG4gIC8qKiBDb252ZXJ0IHRvIGJpZ2ludCAodTEyOCkuICovXG4gIGFzQmlnSW50KCkge1xuICAgIHJldHVybiB0aGlzLl9fdXVpZF9fO1xuICB9XG4gIC8qKiBSZXR1cm4gYSBgVWludDhBcnJheWAgb2YgMTYgYnl0ZXMuICovXG4gIHRvQnl0ZXMoKSB7XG4gICAgcmV0dXJuIF9VdWlkLmJpZ0ludFRvQnl0ZXModGhpcy5fX3V1aWRfXyk7XG4gIH1cbiAgc3RhdGljIGJ5dGVzVG9CaWdJbnQoYnl0ZXMpIHtcbiAgICBsZXQgcmVzdWx0ID0gMG47XG4gICAgZm9yIChjb25zdCBiIG9mIGJ5dGVzKSByZXN1bHQgPSByZXN1bHQgPDwgOG4gfCBCaWdJbnQoYik7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBzdGF0aWMgYmlnSW50VG9CeXRlcyh2YWx1ZSkge1xuICAgIGNvbnN0IGJ5dGVzID0gbmV3IFVpbnQ4QXJyYXkoMTYpO1xuICAgIGZvciAobGV0IGkgPSAxNTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGJ5dGVzW2ldID0gTnVtYmVyKHZhbHVlICYgMHhmZm4pO1xuICAgICAgdmFsdWUgPj49IDhuO1xuICAgIH1cbiAgICByZXR1cm4gYnl0ZXM7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIHZlcnNpb24gb2YgdGhpcyBVVUlELlxuICAgKlxuICAgKiBUaGlzIHJlcHJlc2VudHMgdGhlIGFsZ29yaXRobSB1c2VkIHRvIGdlbmVyYXRlIHRoZSB2YWx1ZS5cbiAgICpcbiAgICogQHJldHVybnMgQSBgVXVpZFZlcnNpb25gXG4gICAqIEB0aHJvd3Mge0Vycm9yfSBJZiB0aGUgdmVyc2lvbiBmaWVsZCBpcyBub3QgcmVjb2duaXplZFxuICAgKi9cbiAgZ2V0VmVyc2lvbigpIHtcbiAgICBjb25zdCB2ZXJzaW9uID0gdGhpcy50b0J5dGVzKClbNl0gPj4gNCAmIDE1O1xuICAgIHN3aXRjaCAodmVyc2lvbikge1xuICAgICAgY2FzZSA0OlxuICAgICAgICByZXR1cm4gXCJWNFwiO1xuICAgICAgY2FzZSA3OlxuICAgICAgICByZXR1cm4gXCJWN1wiO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKHRoaXMgPT0gX1V1aWQuTklMKSB7XG4gICAgICAgICAgcmV0dXJuIFwiTmlsXCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMgPT0gX1V1aWQuTUFYKSB7XG4gICAgICAgICAgcmV0dXJuIFwiTWF4XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBVVUlEIHZlcnNpb246ICR7dmVyc2lvbn1gKTtcbiAgICB9XG4gIH1cbiAgLyoqXG4gICAqIEV4dHJhY3QgdGhlIG1vbm90b25pYyBjb3VudGVyIGZyb20gYSBVVUlEdjcuXG4gICAqXG4gICAqIEludGVuZGVkIGZvciB0ZXN0aW5nIGFuZCBkaWFnbm9zdGljcy5cbiAgICogQmVoYXZpb3IgaXMgdW5kZWZpbmVkIGlmIGNhbGxlZCBvbiBhIG5vbi1WNyBVVUlELlxuICAgKlxuICAgKiBAcmV0dXJucyAzMS1iaXQgY291bnRlciB2YWx1ZVxuICAgKi9cbiAgZ2V0Q291bnRlcigpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMudG9CeXRlcygpO1xuICAgIGNvbnN0IGhpZ2ggPSBieXRlc1s3XTtcbiAgICBjb25zdCBtaWQxID0gYnl0ZXNbOV07XG4gICAgY29uc3QgbWlkMiA9IGJ5dGVzWzEwXTtcbiAgICBjb25zdCBsb3cgPSBieXRlc1sxMV0gPj4+IDE7XG4gICAgcmV0dXJuIGhpZ2ggPDwgMjMgfCBtaWQxIDw8IDE1IHwgbWlkMiA8PCA3IHwgbG93IHwgMDtcbiAgfVxuICBjb21wYXJlVG8ob3RoZXIpIHtcbiAgICBpZiAodGhpcy5fX3V1aWRfXyA8IG90aGVyLl9fdXVpZF9fKSByZXR1cm4gLTE7XG4gICAgaWYgKHRoaXMuX191dWlkX18gPiBvdGhlci5fX3V1aWRfXykgcmV0dXJuIDE7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgc3RhdGljIGdldEFsZ2VicmFpY1R5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUuUHJvZHVjdCh7XG4gICAgICBlbGVtZW50czogW1xuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJfX3V1aWRfX1wiLFxuICAgICAgICAgIGFsZ2VicmFpY1R5cGU6IEFsZ2VicmFpY1R5cGUuVTEyOFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSk7XG4gIH1cbn07XG5cbi8vIHNyYy9saWIvYmluYXJ5X3JlYWRlci50c1xudmFyIEJpbmFyeVJlYWRlciA9IGNsYXNzIHtcbiAgLyoqXG4gICAqIFRoZSBEYXRhVmlldyB1c2VkIHRvIHJlYWQgdmFsdWVzIGZyb20gdGhlIGJpbmFyeSBkYXRhLlxuICAgKlxuICAgKiBOb3RlOiBUaGUgRGF0YVZpZXcncyBgYnl0ZU9mZnNldGAgaXMgcmVsYXRpdmUgdG8gdGhlIGJlZ2lubmluZyBvZiB0aGVcbiAgICogdW5kZXJseWluZyBBcnJheUJ1ZmZlciwgbm90IHRoZSBzdGFydCBvZiB0aGUgcHJvdmlkZWQgVWludDhBcnJheSBpbnB1dC5cbiAgICogVGhpcyBgQmluYXJ5UmVhZGVyYCdzIGAjb2Zmc2V0YCBmaWVsZCBpcyB1c2VkIHRvIHRyYWNrIHRoZSBjdXJyZW50IHJlYWQgcG9zaXRpb25cbiAgICogcmVsYXRpdmUgdG8gdGhlIHN0YXJ0IG9mIHRoZSBwcm92aWRlZCBVaW50OEFycmF5IGlucHV0LlxuICAgKi9cbiAgdmlldztcbiAgLyoqXG4gICAqIFJlcHJlc2VudHMgdGhlIG9mZnNldCAoaW4gYnl0ZXMpIHJlbGF0aXZlIHRvIHRoZSBzdGFydCBvZiB0aGUgRGF0YVZpZXdcbiAgICogYW5kIHByb3ZpZGVkIFVpbnQ4QXJyYXkgaW5wdXQuXG4gICAqXG4gICAqIE5vdGU6IFRoaXMgaXMgKm5vdCogdGhlIGFic29sdXRlIGJ5dGUgb2Zmc2V0IHdpdGhpbiB0aGUgdW5kZXJseWluZyBBcnJheUJ1ZmZlci5cbiAgICovXG4gIG9mZnNldCA9IDA7XG4gIGNvbnN0cnVjdG9yKGlucHV0KSB7XG4gICAgdGhpcy52aWV3ID0gaW5wdXQgaW5zdGFuY2VvZiBEYXRhVmlldyA/IGlucHV0IDogbmV3IERhdGFWaWV3KGlucHV0LmJ1ZmZlciwgaW5wdXQuYnl0ZU9mZnNldCwgaW5wdXQuYnl0ZUxlbmd0aCk7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICB9XG4gIHJlc2V0KHZpZXcpIHtcbiAgICB0aGlzLnZpZXcgPSB2aWV3O1xuICAgIHRoaXMub2Zmc2V0ID0gMDtcbiAgfVxuICBnZXQgcmVtYWluaW5nKCkge1xuICAgIHJldHVybiB0aGlzLnZpZXcuYnl0ZUxlbmd0aCAtIHRoaXMub2Zmc2V0O1xuICB9XG4gIC8qKiBFbnN1cmUgd2UgaGF2ZSBhdCBsZWFzdCBgbmAgYnl0ZXMgbGVmdCB0byByZWFkICovXG4gICNlbnN1cmUobikge1xuICAgIGlmICh0aGlzLm9mZnNldCArIG4gPiB0aGlzLnZpZXcuYnl0ZUxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoXG4gICAgICAgIGBUcmllZCB0byByZWFkICR7bn0gYnl0ZShzKSBhdCByZWxhdGl2ZSBvZmZzZXQgJHt0aGlzLm9mZnNldH0sIGJ1dCBvbmx5ICR7dGhpcy5yZW1haW5pbmd9IGJ5dGUocykgcmVtYWluYFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmVhZFVJbnQ4QXJyYXkoKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdGhpcy5yZWFkVTMyKCk7XG4gICAgdGhpcy4jZW5zdXJlKGxlbmd0aCk7XG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGVzKGxlbmd0aCk7XG4gIH1cbiAgcmVhZEJvb2woKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0VWludDgodGhpcy5vZmZzZXQpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDE7XG4gICAgcmV0dXJuIHZhbHVlICE9PSAwO1xuICB9XG4gIHJlYWRCeXRlKCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldFVpbnQ4KHRoaXMub2Zmc2V0KTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkQnl0ZXMobGVuZ3RoKSB7XG4gICAgY29uc3QgYXJyYXkgPSBuZXcgVWludDhBcnJheShcbiAgICAgIHRoaXMudmlldy5idWZmZXIsXG4gICAgICB0aGlzLnZpZXcuYnl0ZU9mZnNldCArIHRoaXMub2Zmc2V0LFxuICAgICAgbGVuZ3RoXG4gICAgKTtcbiAgICB0aGlzLm9mZnNldCArPSBsZW5ndGg7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG4gIHJlYWRJOCgpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRJbnQ4KHRoaXMub2Zmc2V0KTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkVTgoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVhZEJ5dGUoKTtcbiAgfVxuICByZWFkSTE2KCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldEludDE2KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAyO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkVTE2KCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldFVpbnQxNih0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMjtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZEkzMigpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRJbnQzMih0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gNDtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgcmVhZFUzMigpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRVaW50MzIodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDQ7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJlYWRJNjQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0QmlnSW50NjQodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDg7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJlYWRVNjQoKSB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA4O1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkVTEyOCgpIHtcbiAgICBjb25zdCBsb3dlclBhcnQgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICBjb25zdCB1cHBlclBhcnQgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0ICsgOCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTY7XG4gICAgcmV0dXJuICh1cHBlclBhcnQgPDwgQmlnSW50KDY0KSkgKyBsb3dlclBhcnQ7XG4gIH1cbiAgcmVhZEkxMjgoKSB7XG4gICAgY29uc3QgbG93ZXJQYXJ0ID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCwgdHJ1ZSk7XG4gICAgY29uc3QgdXBwZXJQYXJ0ID0gdGhpcy52aWV3LmdldEJpZ0ludDY0KHRoaXMub2Zmc2V0ICsgOCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTY7XG4gICAgcmV0dXJuICh1cHBlclBhcnQgPDwgQmlnSW50KDY0KSkgKyBsb3dlclBhcnQ7XG4gIH1cbiAgcmVhZFUyNTYoKSB7XG4gICAgY29uc3QgcDAgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICBjb25zdCBwMSA9IHRoaXMudmlldy5nZXRCaWdVaW50NjQodGhpcy5vZmZzZXQgKyA4LCB0cnVlKTtcbiAgICBjb25zdCBwMiA9IHRoaXMudmlldy5nZXRCaWdVaW50NjQodGhpcy5vZmZzZXQgKyAxNiwgdHJ1ZSk7XG4gICAgY29uc3QgcDMgPSB0aGlzLnZpZXcuZ2V0QmlnVWludDY0KHRoaXMub2Zmc2V0ICsgMjQsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDMyO1xuICAgIHJldHVybiAocDMgPDwgQmlnSW50KDMgKiA2NCkpICsgKHAyIDw8IEJpZ0ludCgyICogNjQpKSArIChwMSA8PCBCaWdJbnQoMSAqIDY0KSkgKyBwMDtcbiAgfVxuICByZWFkSTI1NigpIHtcbiAgICBjb25zdCBwMCA9IHRoaXMudmlldy5nZXRCaWdVaW50NjQodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIGNvbnN0IHAxID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDgsIHRydWUpO1xuICAgIGNvbnN0IHAyID0gdGhpcy52aWV3LmdldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDE2LCB0cnVlKTtcbiAgICBjb25zdCBwMyA9IHRoaXMudmlldy5nZXRCaWdJbnQ2NCh0aGlzLm9mZnNldCArIDI0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAzMjtcbiAgICByZXR1cm4gKHAzIDw8IEJpZ0ludCgzICogNjQpKSArIChwMiA8PCBCaWdJbnQoMiAqIDY0KSkgKyAocDEgPDwgQmlnSW50KDEgKiA2NCkpICsgcDA7XG4gIH1cbiAgcmVhZEYzMigpIHtcbiAgICBjb25zdCB2YWx1ZSA9IHRoaXMudmlldy5nZXRGbG9hdDMyKHRoaXMub2Zmc2V0LCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA0O1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICByZWFkRjY0KCkge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy52aWV3LmdldEZsb2F0NjQodGhpcy5vZmZzZXQsIHRydWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IDg7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIHJlYWRTdHJpbmcoKSB7XG4gICAgY29uc3QgdWludDhBcnJheSA9IHRoaXMucmVhZFVJbnQ4QXJyYXkoKTtcbiAgICByZXR1cm4gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIikuZGVjb2RlKHVpbnQ4QXJyYXkpO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL2JpbmFyeV93cml0ZXIudHNcbnZhciBpbXBvcnRfYmFzZTY0X2pzID0gX190b0VTTShyZXF1aXJlX2Jhc2U2NF9qcygpKTtcbnZhciBBcnJheUJ1ZmZlclByb3RvdHlwZVRyYW5zZmVyID0gQXJyYXlCdWZmZXIucHJvdG90eXBlLnRyYW5zZmVyID8/IGZ1bmN0aW9uKG5ld0J5dGVMZW5ndGgpIHtcbiAgaWYgKG5ld0J5dGVMZW5ndGggPT09IHZvaWQgMCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlKCk7XG4gIH0gZWxzZSBpZiAobmV3Qnl0ZUxlbmd0aCA8PSB0aGlzLmJ5dGVMZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwLCBuZXdCeXRlTGVuZ3RoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBjb3B5ID0gbmV3IFVpbnQ4QXJyYXkobmV3Qnl0ZUxlbmd0aCk7XG4gICAgY29weS5zZXQobmV3IFVpbnQ4QXJyYXkodGhpcykpO1xuICAgIHJldHVybiBjb3B5LmJ1ZmZlcjtcbiAgfVxufTtcbnZhciBSZXNpemFibGVCdWZmZXIgPSBjbGFzcyB7XG4gIGJ1ZmZlcjtcbiAgdmlldztcbiAgY29uc3RydWN0b3IoaW5pdCkge1xuICAgIHRoaXMuYnVmZmVyID0gdHlwZW9mIGluaXQgPT09IFwibnVtYmVyXCIgPyBuZXcgQXJyYXlCdWZmZXIoaW5pdCkgOiBpbml0O1xuICAgIHRoaXMudmlldyA9IG5ldyBEYXRhVmlldyh0aGlzLmJ1ZmZlcik7XG4gIH1cbiAgZ2V0IGNhcGFjaXR5KCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5ieXRlTGVuZ3RoO1xuICB9XG4gIGdyb3cobmV3U2l6ZSkge1xuICAgIGlmIChuZXdTaXplIDw9IHRoaXMuYnVmZmVyLmJ5dGVMZW5ndGgpIHJldHVybjtcbiAgICB0aGlzLmJ1ZmZlciA9IEFycmF5QnVmZmVyUHJvdG90eXBlVHJhbnNmZXIuY2FsbCh0aGlzLmJ1ZmZlciwgbmV3U2l6ZSk7XG4gICAgdGhpcy52aWV3ID0gbmV3IERhdGFWaWV3KHRoaXMuYnVmZmVyKTtcbiAgfVxufTtcbnZhciBCaW5hcnlXcml0ZXIgPSBjbGFzcyB7XG4gIGJ1ZmZlcjtcbiAgb2Zmc2V0ID0gMDtcbiAgY29uc3RydWN0b3IoaW5pdCkge1xuICAgIHRoaXMuYnVmZmVyID0gdHlwZW9mIGluaXQgPT09IFwibnVtYmVyXCIgPyBuZXcgUmVzaXphYmxlQnVmZmVyKGluaXQpIDogaW5pdDtcbiAgfVxuICBjbGVhcigpIHtcbiAgICB0aGlzLm9mZnNldCA9IDA7XG4gIH1cbiAgcmVzZXQoYnVmZmVyKSB7XG4gICAgdGhpcy5idWZmZXIgPSBidWZmZXI7XG4gICAgdGhpcy5vZmZzZXQgPSAwO1xuICB9XG4gIGV4cGFuZEJ1ZmZlcihhZGRpdGlvbmFsQ2FwYWNpdHkpIHtcbiAgICBjb25zdCBtaW5DYXBhY2l0eSA9IHRoaXMub2Zmc2V0ICsgYWRkaXRpb25hbENhcGFjaXR5ICsgMTtcbiAgICBpZiAobWluQ2FwYWNpdHkgPD0gdGhpcy5idWZmZXIuY2FwYWNpdHkpIHJldHVybjtcbiAgICBsZXQgbmV3Q2FwYWNpdHkgPSB0aGlzLmJ1ZmZlci5jYXBhY2l0eSAqIDI7XG4gICAgaWYgKG5ld0NhcGFjaXR5IDwgbWluQ2FwYWNpdHkpIG5ld0NhcGFjaXR5ID0gbWluQ2FwYWNpdHk7XG4gICAgdGhpcy5idWZmZXIuZ3JvdyhuZXdDYXBhY2l0eSk7XG4gIH1cbiAgdG9CYXNlNjQoKSB7XG4gICAgcmV0dXJuICgwLCBpbXBvcnRfYmFzZTY0X2pzLmZyb21CeXRlQXJyYXkpKHRoaXMuZ2V0QnVmZmVyKCkpO1xuICB9XG4gIGdldEJ1ZmZlcigpIHtcbiAgICByZXR1cm4gbmV3IFVpbnQ4QXJyYXkodGhpcy5idWZmZXIuYnVmZmVyLCAwLCB0aGlzLm9mZnNldCk7XG4gIH1cbiAgZ2V0IHZpZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnZpZXc7XG4gIH1cbiAgd3JpdGVVSW50OEFycmF5KHZhbHVlKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDQgKyBsZW5ndGgpO1xuICAgIHRoaXMud3JpdGVVMzIobGVuZ3RoKTtcbiAgICBuZXcgVWludDhBcnJheSh0aGlzLmJ1ZmZlci5idWZmZXIsIHRoaXMub2Zmc2V0KS5zZXQodmFsdWUpO1xuICAgIHRoaXMub2Zmc2V0ICs9IGxlbmd0aDtcbiAgfVxuICB3cml0ZUJvb2wodmFsdWUpIHtcbiAgICB0aGlzLmV4cGFuZEJ1ZmZlcigxKTtcbiAgICB0aGlzLnZpZXcuc2V0VWludDgodGhpcy5vZmZzZXQsIHZhbHVlID8gMSA6IDApO1xuICAgIHRoaXMub2Zmc2V0ICs9IDE7XG4gIH1cbiAgd3JpdGVCeXRlKHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMSk7XG4gICAgdGhpcy52aWV3LnNldFVpbnQ4KHRoaXMub2Zmc2V0LCB2YWx1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTtcbiAgfVxuICB3cml0ZUk4KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMSk7XG4gICAgdGhpcy52aWV3LnNldEludDgodGhpcy5vZmZzZXQsIHZhbHVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICB9XG4gIHdyaXRlVTgodmFsdWUpIHtcbiAgICB0aGlzLmV4cGFuZEJ1ZmZlcigxKTtcbiAgICB0aGlzLnZpZXcuc2V0VWludDgodGhpcy5vZmZzZXQsIHZhbHVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAxO1xuICB9XG4gIHdyaXRlSTE2KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMik7XG4gICAgdGhpcy52aWV3LnNldEludDE2KHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMjtcbiAgfVxuICB3cml0ZVUxNih2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDIpO1xuICAgIHRoaXMudmlldy5zZXRVaW50MTYodGhpcy5vZmZzZXQsIHZhbHVlLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAyO1xuICB9XG4gIHdyaXRlSTMyKHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoNCk7XG4gICAgdGhpcy52aWV3LnNldEludDMyKHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gNDtcbiAgfVxuICB3cml0ZVUzMih2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDQpO1xuICAgIHRoaXMudmlldy5zZXRVaW50MzIodGhpcy5vZmZzZXQsIHZhbHVlLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA0O1xuICB9XG4gIHdyaXRlSTY0KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoOCk7XG4gICAgdGhpcy52aWV3LnNldEJpZ0ludDY0KHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gODtcbiAgfVxuICB3cml0ZVU2NCh2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDgpO1xuICAgIHRoaXMudmlldy5zZXRCaWdVaW50NjQodGhpcy5vZmZzZXQsIHZhbHVlLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSA4O1xuICB9XG4gIHdyaXRlVTEyOCh2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDE2KTtcbiAgICBjb25zdCBsb3dlclBhcnQgPSB2YWx1ZSAmIEJpZ0ludChcIjB4RkZGRkZGRkZGRkZGRkZGRlwiKTtcbiAgICBjb25zdCB1cHBlclBhcnQgPSB2YWx1ZSA+PiBCaWdJbnQoNjQpO1xuICAgIHRoaXMudmlldy5zZXRCaWdVaW50NjQodGhpcy5vZmZzZXQsIGxvd2VyUGFydCwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDgsIHVwcGVyUGFydCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTY7XG4gIH1cbiAgd3JpdGVJMTI4KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMTYpO1xuICAgIGNvbnN0IGxvd2VyUGFydCA9IHZhbHVlICYgQmlnSW50KFwiMHhGRkZGRkZGRkZGRkZGRkZGXCIpO1xuICAgIGNvbnN0IHVwcGVyUGFydCA9IHZhbHVlID4+IEJpZ0ludCg2NCk7XG4gICAgdGhpcy52aWV3LnNldEJpZ0ludDY0KHRoaXMub2Zmc2V0LCBsb3dlclBhcnQsIHRydWUpO1xuICAgIHRoaXMudmlldy5zZXRCaWdJbnQ2NCh0aGlzLm9mZnNldCArIDgsIHVwcGVyUGFydCwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMTY7XG4gIH1cbiAgd3JpdGVVMjU2KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMzIpO1xuICAgIGNvbnN0IGxvd182NF9tYXNrID0gQmlnSW50KFwiMHhGRkZGRkZGRkZGRkZGRkZGXCIpO1xuICAgIGNvbnN0IHAwID0gdmFsdWUgJiBsb3dfNjRfbWFzaztcbiAgICBjb25zdCBwMSA9IHZhbHVlID4+IEJpZ0ludCg2NCAqIDEpICYgbG93XzY0X21hc2s7XG4gICAgY29uc3QgcDIgPSB2YWx1ZSA+PiBCaWdJbnQoNjQgKiAyKSAmIGxvd182NF9tYXNrO1xuICAgIGNvbnN0IHAzID0gdmFsdWUgPj4gQmlnSW50KDY0ICogMyk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAwLCBwMCwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAxLCBwMSwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAyLCBwMiwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAzLCBwMywgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gMzI7XG4gIH1cbiAgd3JpdGVJMjU2KHZhbHVlKSB7XG4gICAgdGhpcy5leHBhbmRCdWZmZXIoMzIpO1xuICAgIGNvbnN0IGxvd182NF9tYXNrID0gQmlnSW50KFwiMHhGRkZGRkZGRkZGRkZGRkZGXCIpO1xuICAgIGNvbnN0IHAwID0gdmFsdWUgJiBsb3dfNjRfbWFzaztcbiAgICBjb25zdCBwMSA9IHZhbHVlID4+IEJpZ0ludCg2NCAqIDEpICYgbG93XzY0X21hc2s7XG4gICAgY29uc3QgcDIgPSB2YWx1ZSA+PiBCaWdJbnQoNjQgKiAyKSAmIGxvd182NF9tYXNrO1xuICAgIGNvbnN0IHAzID0gdmFsdWUgPj4gQmlnSW50KDY0ICogMyk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAwLCBwMCwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAxLCBwMSwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ1VpbnQ2NCh0aGlzLm9mZnNldCArIDggKiAyLCBwMiwgdHJ1ZSk7XG4gICAgdGhpcy52aWV3LnNldEJpZ0ludDY0KHRoaXMub2Zmc2V0ICsgOCAqIDMsIHAzLCB0cnVlKTtcbiAgICB0aGlzLm9mZnNldCArPSAzMjtcbiAgfVxuICB3cml0ZUYzMih2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDQpO1xuICAgIHRoaXMudmlldy5zZXRGbG9hdDMyKHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gNDtcbiAgfVxuICB3cml0ZUY2NCh2YWx1ZSkge1xuICAgIHRoaXMuZXhwYW5kQnVmZmVyKDgpO1xuICAgIHRoaXMudmlldy5zZXRGbG9hdDY0KHRoaXMub2Zmc2V0LCB2YWx1ZSwgdHJ1ZSk7XG4gICAgdGhpcy5vZmZzZXQgKz0gODtcbiAgfVxuICB3cml0ZVN0cmluZyh2YWx1ZSkge1xuICAgIGNvbnN0IGVuY29kZXIgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgICBjb25zdCBlbmNvZGVkU3RyaW5nID0gZW5jb2Rlci5lbmNvZGUodmFsdWUpO1xuICAgIHRoaXMud3JpdGVVSW50OEFycmF5KGVuY29kZWRTdHJpbmcpO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL3V0aWwudHNcbmZ1bmN0aW9uIHVpbnQ4QXJyYXlUb0hleFN0cmluZyhhcnJheSkge1xuICByZXR1cm4gQXJyYXkucHJvdG90eXBlLm1hcC5jYWxsKGFycmF5LnJldmVyc2UoKSwgKHgpID0+IChcIjAwXCIgKyB4LnRvU3RyaW5nKDE2KSkuc2xpY2UoLTIpKS5qb2luKFwiXCIpO1xufVxuZnVuY3Rpb24gdWludDhBcnJheVRvVTEyOChhcnJheSkge1xuICBpZiAoYXJyYXkubGVuZ3RoICE9IDE2KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVaW50OEFycmF5IGlzIG5vdCAxNiBieXRlcyBsb25nOiAke2FycmF5fWApO1xuICB9XG4gIHJldHVybiBuZXcgQmluYXJ5UmVhZGVyKGFycmF5KS5yZWFkVTEyOCgpO1xufVxuZnVuY3Rpb24gdWludDhBcnJheVRvVTI1NihhcnJheSkge1xuICBpZiAoYXJyYXkubGVuZ3RoICE9IDMyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVaW50OEFycmF5IGlzIG5vdCAzMiBieXRlcyBsb25nOiBbJHthcnJheX1dYCk7XG4gIH1cbiAgcmV0dXJuIG5ldyBCaW5hcnlSZWFkZXIoYXJyYXkpLnJlYWRVMjU2KCk7XG59XG5mdW5jdGlvbiBoZXhTdHJpbmdUb1VpbnQ4QXJyYXkoc3RyKSB7XG4gIGlmIChzdHIuc3RhcnRzV2l0aChcIjB4XCIpKSB7XG4gICAgc3RyID0gc3RyLnNsaWNlKDIpO1xuICB9XG4gIGNvbnN0IG1hdGNoZXMgPSBzdHIubWF0Y2goLy57MSwyfS9nKSB8fCBbXTtcbiAgY29uc3QgZGF0YSA9IFVpbnQ4QXJyYXkuZnJvbShcbiAgICBtYXRjaGVzLm1hcCgoYnl0ZSkgPT4gcGFyc2VJbnQoYnl0ZSwgMTYpKVxuICApO1xuICByZXR1cm4gZGF0YS5yZXZlcnNlKCk7XG59XG5mdW5jdGlvbiBoZXhTdHJpbmdUb1UxMjgoc3RyKSB7XG4gIHJldHVybiB1aW50OEFycmF5VG9VMTI4KGhleFN0cmluZ1RvVWludDhBcnJheShzdHIpKTtcbn1cbmZ1bmN0aW9uIGhleFN0cmluZ1RvVTI1NihzdHIpIHtcbiAgcmV0dXJuIHVpbnQ4QXJyYXlUb1UyNTYoaGV4U3RyaW5nVG9VaW50OEFycmF5KHN0cikpO1xufVxuZnVuY3Rpb24gdTEyOFRvVWludDhBcnJheShkYXRhKSB7XG4gIGNvbnN0IHdyaXRlciA9IG5ldyBCaW5hcnlXcml0ZXIoMTYpO1xuICB3cml0ZXIud3JpdGVVMTI4KGRhdGEpO1xuICByZXR1cm4gd3JpdGVyLmdldEJ1ZmZlcigpO1xufVxuZnVuY3Rpb24gdTEyOFRvSGV4U3RyaW5nKGRhdGEpIHtcbiAgcmV0dXJuIHVpbnQ4QXJyYXlUb0hleFN0cmluZyh1MTI4VG9VaW50OEFycmF5KGRhdGEpKTtcbn1cbmZ1bmN0aW9uIHUyNTZUb1VpbnQ4QXJyYXkoZGF0YSkge1xuICBjb25zdCB3cml0ZXIgPSBuZXcgQmluYXJ5V3JpdGVyKDMyKTtcbiAgd3JpdGVyLndyaXRlVTI1NihkYXRhKTtcbiAgcmV0dXJuIHdyaXRlci5nZXRCdWZmZXIoKTtcbn1cbmZ1bmN0aW9uIHUyNTZUb0hleFN0cmluZyhkYXRhKSB7XG4gIHJldHVybiB1aW50OEFycmF5VG9IZXhTdHJpbmcodTI1NlRvVWludDhBcnJheShkYXRhKSk7XG59XG5mdW5jdGlvbiB0b1Bhc2NhbENhc2Uocykge1xuICBjb25zdCBzdHIgPSB0b0NhbWVsQ2FzZShzKTtcbiAgcmV0dXJuIHN0ci5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIHN0ci5zbGljZSgxKTtcbn1cbmZ1bmN0aW9uIHRvQ2FtZWxDYXNlKHMpIHtcbiAgY29uc3Qgc3RyID0gcy5yZXBsYWNlKC9bLV9dKy9nLCBcIl9cIikucmVwbGFjZSgvXyhbYS16QS1aMC05XSkvZywgKF8sIGMpID0+IGMudG9VcHBlckNhc2UoKSk7XG4gIHJldHVybiBzdHIuY2hhckF0KDApLnRvTG93ZXJDYXNlKCkgKyBzdHIuc2xpY2UoMSk7XG59XG5mdW5jdGlvbiBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgdHkpIHtcbiAgY29uc3QgYXNzdW1lZEFycmF5TGVuZ3RoID0gNDtcbiAgd2hpbGUgKHR5LnRhZyA9PT0gXCJSZWZcIikgdHkgPSB0eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICBpZiAodHkudGFnID09PSBcIlByb2R1Y3RcIikge1xuICAgIGxldCBzdW0gPSAwO1xuICAgIGZvciAoY29uc3QgeyBhbGdlYnJhaWNUeXBlOiBlbGVtIH0gb2YgdHkudmFsdWUuZWxlbWVudHMpIHtcbiAgICAgIHN1bSArPSBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBzdW07XG4gIH0gZWxzZSBpZiAodHkudGFnID09PSBcIlN1bVwiKSB7XG4gICAgbGV0IG1pbiA9IEluZmluaXR5O1xuICAgIGZvciAoY29uc3QgeyBhbGdlYnJhaWNUeXBlOiB2YXJpIH0gb2YgdHkudmFsdWUudmFyaWFudHMpIHtcbiAgICAgIGNvbnN0IHZTaXplID0gYnNhdG5CYXNlU2l6ZSh0eXBlc3BhY2UsIHZhcmkpO1xuICAgICAgaWYgKHZTaXplIDwgbWluKSBtaW4gPSB2U2l6ZTtcbiAgICB9XG4gICAgaWYgKG1pbiA9PT0gSW5maW5pdHkpIG1pbiA9IDA7XG4gICAgcmV0dXJuIDQgKyBtaW47XG4gIH0gZWxzZSBpZiAodHkudGFnID09IFwiQXJyYXlcIikge1xuICAgIHJldHVybiA0ICsgYXNzdW1lZEFycmF5TGVuZ3RoICogYnNhdG5CYXNlU2l6ZSh0eXBlc3BhY2UsIHR5LnZhbHVlKTtcbiAgfVxuICByZXR1cm4ge1xuICAgIFN0cmluZzogNCArIGFzc3VtZWRBcnJheUxlbmd0aCxcbiAgICBTdW06IDEsXG4gICAgQm9vbDogMSxcbiAgICBJODogMSxcbiAgICBVODogMSxcbiAgICBJMTY6IDIsXG4gICAgVTE2OiAyLFxuICAgIEkzMjogNCxcbiAgICBVMzI6IDQsXG4gICAgRjMyOiA0LFxuICAgIEk2NDogOCxcbiAgICBVNjQ6IDgsXG4gICAgRjY0OiA4LFxuICAgIEkxMjg6IDE2LFxuICAgIFUxMjg6IDE2LFxuICAgIEkyNTY6IDMyLFxuICAgIFUyNTY6IDMyXG4gIH1bdHkudGFnXTtcbn1cbnZhciBoYXNPd24gPSBPYmplY3QuaGFzT3duO1xuXG4vLyBzcmMvbGliL2Nvbm5lY3Rpb25faWQudHNcbnZhciBDb25uZWN0aW9uSWQgPSBjbGFzcyBfQ29ubmVjdGlvbklkIHtcbiAgX19jb25uZWN0aW9uX2lkX187XG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBDb25uZWN0aW9uSWRgLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHRoaXMuX19jb25uZWN0aW9uX2lkX18gPSBkYXRhO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFsZ2VicmFpYyB0eXBlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB7QGxpbmsgQ29ubmVjdGlvbklkfSB0eXBlLlxuICAgKiBAcmV0dXJucyBUaGUgYWxnZWJyYWljIHR5cGUgcmVwcmVzZW50YXRpb24gb2YgdGhlIHR5cGUuXG4gICAqL1xuICBzdGF0aWMgZ2V0QWxnZWJyYWljVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHtcbiAgICAgIGVsZW1lbnRzOiBbXG4gICAgICAgIHsgbmFtZTogXCJfX2Nvbm5lY3Rpb25faWRfX1wiLCBhbGdlYnJhaWNUeXBlOiBBbGdlYnJhaWNUeXBlLlUxMjggfVxuICAgICAgXVxuICAgIH0pO1xuICB9XG4gIGlzWmVybygpIHtcbiAgICByZXR1cm4gdGhpcy5fX2Nvbm5lY3Rpb25faWRfXyA9PT0gQmlnSW50KDApO1xuICB9XG4gIHN0YXRpYyBudWxsSWZaZXJvKGFkZHIpIHtcbiAgICBpZiAoYWRkci5pc1plcm8oKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBhZGRyO1xuICAgIH1cbiAgfVxuICBzdGF0aWMgcmFuZG9tKCkge1xuICAgIGZ1bmN0aW9uIHJhbmRvbVU4KCkge1xuICAgICAgcmV0dXJuIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NSk7XG4gICAgfVxuICAgIGxldCByZXN1bHQgPSBCaWdJbnQoMCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAxNjsgaSsrKSB7XG4gICAgICByZXN1bHQgPSByZXN1bHQgPDwgQmlnSW50KDgpIHwgQmlnSW50KHJhbmRvbVU4KCkpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IF9Db25uZWN0aW9uSWQocmVzdWx0KTtcbiAgfVxuICAvKipcbiAgICogQ29tcGFyZSB0d28gY29ubmVjdGlvbiBJRHMgZm9yIGVxdWFsaXR5LlxuICAgKi9cbiAgaXNFcXVhbChvdGhlcikge1xuICAgIHJldHVybiB0aGlzLl9fY29ubmVjdGlvbl9pZF9fID09IG90aGVyLl9fY29ubmVjdGlvbl9pZF9fO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0d28gY29ubmVjdGlvbiBJRHMgYXJlIGVxdWFsLlxuICAgKi9cbiAgZXF1YWxzKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNFcXVhbChvdGhlcik7XG4gIH1cbiAgLyoqXG4gICAqIFByaW50IHRoZSBjb25uZWN0aW9uIElEIGFzIGEgaGV4YWRlY2ltYWwgc3RyaW5nLlxuICAgKi9cbiAgdG9IZXhTdHJpbmcoKSB7XG4gICAgcmV0dXJuIHUxMjhUb0hleFN0cmluZyh0aGlzLl9fY29ubmVjdGlvbl9pZF9fKTtcbiAgfVxuICAvKipcbiAgICogQ29udmVydCB0aGUgY29ubmVjdGlvbiBJRCB0byBhIFVpbnQ4QXJyYXkuXG4gICAqL1xuICB0b1VpbnQ4QXJyYXkoKSB7XG4gICAgcmV0dXJuIHUxMjhUb1VpbnQ4QXJyYXkodGhpcy5fX2Nvbm5lY3Rpb25faWRfXyk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIGEgY29ubmVjdGlvbiBJRCBmcm9tIGEgaGV4YWRlY2ltYWwgc3RyaW5nLlxuICAgKi9cbiAgc3RhdGljIGZyb21TdHJpbmcoc3RyKSB7XG4gICAgcmV0dXJuIG5ldyBfQ29ubmVjdGlvbklkKGhleFN0cmluZ1RvVTEyOChzdHIpKTtcbiAgfVxuICBzdGF0aWMgZnJvbVN0cmluZ09yTnVsbChzdHIpIHtcbiAgICBjb25zdCBhZGRyID0gX0Nvbm5lY3Rpb25JZC5mcm9tU3RyaW5nKHN0cik7XG4gICAgaWYgKGFkZHIuaXNaZXJvKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYWRkcjtcbiAgICB9XG4gIH1cbn07XG5cbi8vIHNyYy9saWIvaWRlbnRpdHkudHNcbnZhciBJZGVudGl0eSA9IGNsYXNzIF9JZGVudGl0eSB7XG4gIF9faWRlbnRpdHlfXztcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYElkZW50aXR5YC5cbiAgICpcbiAgICogYGRhdGFgIGNhbiBiZSBhIGhleGFkZWNpbWFsIHN0cmluZyBvciBhIGBiaWdpbnRgLlxuICAgKi9cbiAgY29uc3RydWN0b3IoZGF0YSkge1xuICAgIHRoaXMuX19pZGVudGl0eV9fID0gdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgPyBoZXhTdHJpbmdUb1UyNTYoZGF0YSkgOiBkYXRhO1xuICB9XG4gIC8qKlxuICAgKiBHZXQgdGhlIGFsZ2VicmFpYyB0eXBlIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB7QGxpbmsgSWRlbnRpdHl9IHR5cGUuXG4gICAqIEByZXR1cm5zIFRoZSBhbGdlYnJhaWMgdHlwZSByZXByZXNlbnRhdGlvbiBvZiB0aGUgdHlwZS5cbiAgICovXG4gIHN0YXRpYyBnZXRBbGdlYnJhaWNUeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgZWxlbWVudHM6IFt7IG5hbWU6IFwiX19pZGVudGl0eV9fXCIsIGFsZ2VicmFpY1R5cGU6IEFsZ2VicmFpY1R5cGUuVTI1NiB9XVxuICAgIH0pO1xuICB9XG4gIC8qKlxuICAgKiBDaGVjayBpZiB0d28gaWRlbnRpdGllcyBhcmUgZXF1YWwuXG4gICAqL1xuICBpc0VxdWFsKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMudG9IZXhTdHJpbmcoKSA9PT0gb3RoZXIudG9IZXhTdHJpbmcoKTtcbiAgfVxuICAvKipcbiAgICogQ2hlY2sgaWYgdHdvIGlkZW50aXRpZXMgYXJlIGVxdWFsLlxuICAgKi9cbiAgZXF1YWxzKG90aGVyKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNFcXVhbChvdGhlcik7XG4gIH1cbiAgLyoqXG4gICAqIFByaW50IHRoZSBpZGVudGl0eSBhcyBhIGhleGFkZWNpbWFsIHN0cmluZy5cbiAgICovXG4gIHRvSGV4U3RyaW5nKCkge1xuICAgIHJldHVybiB1MjU2VG9IZXhTdHJpbmcodGhpcy5fX2lkZW50aXR5X18pO1xuICB9XG4gIC8qKlxuICAgKiBDb252ZXJ0IHRoZSBhZGRyZXNzIHRvIGEgVWludDhBcnJheS5cbiAgICovXG4gIHRvVWludDhBcnJheSgpIHtcbiAgICByZXR1cm4gdTI1NlRvVWludDhBcnJheSh0aGlzLl9faWRlbnRpdHlfXyk7XG4gIH1cbiAgLyoqXG4gICAqIFBhcnNlIGFuIElkZW50aXR5IGZyb20gYSBoZXhhZGVjaW1hbCBzdHJpbmcuXG4gICAqL1xuICBzdGF0aWMgZnJvbVN0cmluZyhzdHIpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eShzdHIpO1xuICB9XG4gIC8qKlxuICAgKiBaZXJvIGlkZW50aXR5ICgweDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDApXG4gICAqL1xuICBzdGF0aWMgemVybygpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eSgwbik7XG4gIH1cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9IZXhTdHJpbmcoKTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9hbGdlYnJhaWNfdHlwZS50c1xudmFyIFNFUklBTElaRVJTID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBERVNFUklBTElaRVJTID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBBbGdlYnJhaWNUeXBlID0ge1xuICBSZWY6ICh2YWx1ZSkgPT4gKHsgdGFnOiBcIlJlZlwiLCB2YWx1ZSB9KSxcbiAgU3VtOiAodmFsdWUpID0+ICh7XG4gICAgdGFnOiBcIlN1bVwiLFxuICAgIHZhbHVlXG4gIH0pLFxuICBQcm9kdWN0OiAodmFsdWUpID0+ICh7XG4gICAgdGFnOiBcIlByb2R1Y3RcIixcbiAgICB2YWx1ZVxuICB9KSxcbiAgQXJyYXk6ICh2YWx1ZSkgPT4gKHtcbiAgICB0YWc6IFwiQXJyYXlcIixcbiAgICB2YWx1ZVxuICB9KSxcbiAgU3RyaW5nOiB7IHRhZzogXCJTdHJpbmdcIiB9LFxuICBCb29sOiB7IHRhZzogXCJCb29sXCIgfSxcbiAgSTg6IHsgdGFnOiBcIkk4XCIgfSxcbiAgVTg6IHsgdGFnOiBcIlU4XCIgfSxcbiAgSTE2OiB7IHRhZzogXCJJMTZcIiB9LFxuICBVMTY6IHsgdGFnOiBcIlUxNlwiIH0sXG4gIEkzMjogeyB0YWc6IFwiSTMyXCIgfSxcbiAgVTMyOiB7IHRhZzogXCJVMzJcIiB9LFxuICBJNjQ6IHsgdGFnOiBcIkk2NFwiIH0sXG4gIFU2NDogeyB0YWc6IFwiVTY0XCIgfSxcbiAgSTEyODogeyB0YWc6IFwiSTEyOFwiIH0sXG4gIFUxMjg6IHsgdGFnOiBcIlUxMjhcIiB9LFxuICBJMjU2OiB7IHRhZzogXCJJMjU2XCIgfSxcbiAgVTI1NjogeyB0YWc6IFwiVTI1NlwiIH0sXG4gIEYzMjogeyB0YWc6IFwiRjMyXCIgfSxcbiAgRjY0OiB7IHRhZzogXCJGNjRcIiB9LFxuICBtYWtlU2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSB7XG4gICAgaWYgKHR5LnRhZyA9PT0gXCJSZWZcIikge1xuICAgICAgaWYgKCF0eXBlc3BhY2UpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImNhbm5vdCBzZXJpYWxpemUgcmVmcyB3aXRob3V0IGEgdHlwZXNwYWNlXCIpO1xuICAgICAgd2hpbGUgKHR5LnRhZyA9PT0gXCJSZWZcIikgdHkgPSB0eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5LnRhZykge1xuICAgICAgY2FzZSBcIlByb2R1Y3RcIjpcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RUeXBlLm1ha2VTZXJpYWxpemVyKHR5LnZhbHVlLCB0eXBlc3BhY2UpO1xuICAgICAgY2FzZSBcIlN1bVwiOlxuICAgICAgICByZXR1cm4gU3VtVHlwZS5tYWtlU2VyaWFsaXplcih0eS52YWx1ZSwgdHlwZXNwYWNlKTtcbiAgICAgIGNhc2UgXCJBcnJheVwiOlxuICAgICAgICBpZiAodHkudmFsdWUudGFnID09PSBcIlU4XCIpIHtcbiAgICAgICAgICByZXR1cm4gc2VyaWFsaXplVWludDhBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzZXJpYWxpemUgPSBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKHR5LnZhbHVlLCB0eXBlc3BhY2UpO1xuICAgICAgICAgIHJldHVybiAod3JpdGVyLCB2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgd3JpdGVyLndyaXRlVTMyKHZhbHVlLmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGVsZW0gb2YgdmFsdWUpIHtcbiAgICAgICAgICAgICAgc2VyaWFsaXplKHdyaXRlciwgZWxlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHByaW1pdGl2ZVNlcmlhbGl6ZXJzW3R5LnRhZ107XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlU2VyaWFsaXplcmAgaW5zdGVhZC4gKi9cbiAgc2VyaWFsaXplVmFsdWUod3JpdGVyLCB0eSwgdmFsdWUsIHR5cGVzcGFjZSkge1xuICAgIEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkod3JpdGVyLCB2YWx1ZSk7XG4gIH0sXG4gIG1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkge1xuICAgIGlmICh0eS50YWcgPT09IFwiUmVmXCIpIHtcbiAgICAgIGlmICghdHlwZXNwYWNlKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJjYW5ub3QgZGVzZXJpYWxpemUgcmVmcyB3aXRob3V0IGEgdHlwZXNwYWNlXCIpO1xuICAgICAgd2hpbGUgKHR5LnRhZyA9PT0gXCJSZWZcIikgdHkgPSB0eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICAgIH1cbiAgICBzd2l0Y2ggKHR5LnRhZykge1xuICAgICAgY2FzZSBcIlByb2R1Y3RcIjpcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RUeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHkudmFsdWUsIHR5cGVzcGFjZSk7XG4gICAgICBjYXNlIFwiU3VtXCI6XG4gICAgICAgIHJldHVybiBTdW1UeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHkudmFsdWUsIHR5cGVzcGFjZSk7XG4gICAgICBjYXNlIFwiQXJyYXlcIjpcbiAgICAgICAgaWYgKHR5LnZhbHVlLnRhZyA9PT0gXCJVOFwiKSB7XG4gICAgICAgICAgcmV0dXJuIGRlc2VyaWFsaXplVWludDhBcnJheTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBkZXNlcmlhbGl6ZSA9IEFsZ2VicmFpY1R5cGUubWFrZURlc2VyaWFsaXplcihcbiAgICAgICAgICAgIHR5LnZhbHVlLFxuICAgICAgICAgICAgdHlwZXNwYWNlXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gKHJlYWRlcikgPT4ge1xuICAgICAgICAgICAgY29uc3QgbGVuZ3RoID0gcmVhZGVyLnJlYWRVMzIoKTtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHJlc3VsdFtpXSA9IGRlc2VyaWFsaXplKHJlYWRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBwcmltaXRpdmVEZXNlcmlhbGl6ZXJzW3R5LnRhZ107XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlRGVzZXJpYWxpemVyYCBpbnN0ZWFkLiAqL1xuICBkZXNlcmlhbGl6ZVZhbHVlKHJlYWRlciwgdHksIHR5cGVzcGFjZSkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkocmVhZGVyKTtcbiAgfSxcbiAgLyoqXG4gICAqIENvbnZlcnQgYSB2YWx1ZSBvZiB0aGUgYWxnZWJyYWljIHR5cGUgaW50byBzb21ldGhpbmcgdGhhdCBjYW4gYmUgdXNlZCBhcyBhIGtleSBpbiBhIG1hcC5cbiAgICogVGhlcmUgYXJlIG5vIGd1YXJhbnRlZXMgYWJvdXQgYmVpbmcgYWJsZSB0byBvcmRlciBpdC5cbiAgICogVGhpcyBpcyBvbmx5IGd1YXJhbnRlZWQgdG8gYmUgY29tcGFyYWJsZSB0byBvdGhlciB2YWx1ZXMgb2YgdGhlIHNhbWUgdHlwZS5cbiAgICogQHBhcmFtIHZhbHVlIEEgdmFsdWUgb2YgdGhlIGFsZ2VicmFpYyB0eXBlXG4gICAqIEByZXR1cm5zIFNvbWV0aGluZyB0aGF0IGNhbiBiZSB1c2VkIGFzIGEga2V5IGluIGEgbWFwLlxuICAgKi9cbiAgaW50b01hcEtleTogZnVuY3Rpb24odHksIHZhbHVlKSB7XG4gICAgc3dpdGNoICh0eS50YWcpIHtcbiAgICAgIGNhc2UgXCJVOFwiOlxuICAgICAgY2FzZSBcIlUxNlwiOlxuICAgICAgY2FzZSBcIlUzMlwiOlxuICAgICAgY2FzZSBcIlU2NFwiOlxuICAgICAgY2FzZSBcIlUxMjhcIjpcbiAgICAgIGNhc2UgXCJVMjU2XCI6XG4gICAgICBjYXNlIFwiSThcIjpcbiAgICAgIGNhc2UgXCJJMTZcIjpcbiAgICAgIGNhc2UgXCJJMzJcIjpcbiAgICAgIGNhc2UgXCJJNjRcIjpcbiAgICAgIGNhc2UgXCJJMTI4XCI6XG4gICAgICBjYXNlIFwiSTI1NlwiOlxuICAgICAgY2FzZSBcIkYzMlwiOlxuICAgICAgY2FzZSBcIkY2NFwiOlxuICAgICAgY2FzZSBcIlN0cmluZ1wiOlxuICAgICAgY2FzZSBcIkJvb2xcIjpcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgY2FzZSBcIlByb2R1Y3RcIjpcbiAgICAgICAgcmV0dXJuIFByb2R1Y3RUeXBlLmludG9NYXBLZXkodHkudmFsdWUsIHZhbHVlKTtcbiAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgY29uc3Qgd3JpdGVyID0gbmV3IEJpbmFyeVdyaXRlcigxMCk7XG4gICAgICAgIEFsZ2VicmFpY1R5cGUuc2VyaWFsaXplVmFsdWUod3JpdGVyLCB0eSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gd3JpdGVyLnRvQmFzZTY0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuZnVuY3Rpb24gYmluZENhbGwoZikge1xuICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwuYmluZChmKTtcbn1cbnZhciBwcmltaXRpdmVTZXJpYWxpemVycyA9IHtcbiAgQm9vbDogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUJvb2wpLFxuICBJODogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUk4KSxcbiAgVTg6IGJpbmRDYWxsKEJpbmFyeVdyaXRlci5wcm90b3R5cGUud3JpdGVVOCksXG4gIEkxNjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUkxNiksXG4gIFUxNjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVUxNiksXG4gIEkzMjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUkzMiksXG4gIFUzMjogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVUzMiksXG4gIEk2NDogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZUk2NCksXG4gIFU2NDogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVU2NCksXG4gIEkxMjg6IGJpbmRDYWxsKEJpbmFyeVdyaXRlci5wcm90b3R5cGUud3JpdGVJMTI4KSxcbiAgVTEyODogYmluZENhbGwoQmluYXJ5V3JpdGVyLnByb3RvdHlwZS53cml0ZVUxMjgpLFxuICBJMjU2OiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlSTI1NiksXG4gIFUyNTY6IGJpbmRDYWxsKEJpbmFyeVdyaXRlci5wcm90b3R5cGUud3JpdGVVMjU2KSxcbiAgRjMyOiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlRjMyKSxcbiAgRjY0OiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlRjY0KSxcbiAgU3RyaW5nOiBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlU3RyaW5nKVxufTtcbk9iamVjdC5mcmVlemUocHJpbWl0aXZlU2VyaWFsaXplcnMpO1xudmFyIHNlcmlhbGl6ZVVpbnQ4QXJyYXkgPSBiaW5kQ2FsbChCaW5hcnlXcml0ZXIucHJvdG90eXBlLndyaXRlVUludDhBcnJheSk7XG52YXIgcHJpbWl0aXZlRGVzZXJpYWxpemVycyA9IHtcbiAgQm9vbDogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkQm9vbCksXG4gIEk4OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRJOCksXG4gIFU4OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVOCksXG4gIEkxNjogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkSTE2KSxcbiAgVTE2OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVMTYpLFxuICBJMzI6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZEkzMiksXG4gIFUzMjogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkVTMyKSxcbiAgSTY0OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRJNjQpLFxuICBVNjQ6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZFU2NCksXG4gIEkxMjg6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZEkxMjgpLFxuICBVMTI4OiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVMTI4KSxcbiAgSTI1NjogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkSTI1NiksXG4gIFUyNTY6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZFUyNTYpLFxuICBGMzI6IGJpbmRDYWxsKEJpbmFyeVJlYWRlci5wcm90b3R5cGUucmVhZEYzMiksXG4gIEY2NDogYmluZENhbGwoQmluYXJ5UmVhZGVyLnByb3RvdHlwZS5yZWFkRjY0KSxcbiAgU3RyaW5nOiBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRTdHJpbmcpXG59O1xuT2JqZWN0LmZyZWV6ZShwcmltaXRpdmVEZXNlcmlhbGl6ZXJzKTtcbnZhciBkZXNlcmlhbGl6ZVVpbnQ4QXJyYXkgPSBiaW5kQ2FsbChCaW5hcnlSZWFkZXIucHJvdG90eXBlLnJlYWRVSW50OEFycmF5KTtcbnZhciBwcmltaXRpdmVTaXplcyA9IHtcbiAgQm9vbDogMSxcbiAgSTg6IDEsXG4gIFU4OiAxLFxuICBJMTY6IDIsXG4gIFUxNjogMixcbiAgSTMyOiA0LFxuICBVMzI6IDQsXG4gIEk2NDogOCxcbiAgVTY0OiA4LFxuICBJMTI4OiAxNixcbiAgVTEyODogMTYsXG4gIEkyNTY6IDMyLFxuICBVMjU2OiAzMixcbiAgRjMyOiA0LFxuICBGNjQ6IDhcbn07XG52YXIgZml4ZWRTaXplUHJpbWl0aXZlcyA9IG5ldyBTZXQoT2JqZWN0LmtleXMocHJpbWl0aXZlU2l6ZXMpKTtcbnZhciBpc0ZpeGVkU2l6ZVByb2R1Y3QgPSAodHkpID0+IHR5LmVsZW1lbnRzLmV2ZXJ5KFxuICAoeyBhbGdlYnJhaWNUeXBlIH0pID0+IGZpeGVkU2l6ZVByaW1pdGl2ZXMuaGFzKGFsZ2VicmFpY1R5cGUudGFnKVxuKTtcbnZhciBwcm9kdWN0U2l6ZSA9ICh0eSkgPT4gdHkuZWxlbWVudHMucmVkdWNlKFxuICAoYWNjLCB7IGFsZ2VicmFpY1R5cGUgfSkgPT4gYWNjICsgcHJpbWl0aXZlU2l6ZXNbYWxnZWJyYWljVHlwZS50YWddLFxuICAwXG4pO1xudmFyIHByaW1pdGl2ZUpTTmFtZSA9IHtcbiAgQm9vbDogXCJVaW50OFwiLFxuICBJODogXCJJbnQ4XCIsXG4gIFU4OiBcIlVpbnQ4XCIsXG4gIEkxNjogXCJJbnQxNlwiLFxuICBVMTY6IFwiVWludDE2XCIsXG4gIEkzMjogXCJJbnQzMlwiLFxuICBVMzI6IFwiVWludDMyXCIsXG4gIEk2NDogXCJCaWdJbnQ2NFwiLFxuICBVNjQ6IFwiQmlnVWludDY0XCIsXG4gIEYzMjogXCJGbG9hdDMyXCIsXG4gIEY2NDogXCJGbG9hdDY0XCJcbn07XG52YXIgc3BlY2lhbFByb2R1Y3REZXNlcmlhbGl6ZXJzID0ge1xuICBfX3RpbWVfZHVyYXRpb25fbWljcm9zX186IChyZWFkZXIpID0+IG5ldyBUaW1lRHVyYXRpb24ocmVhZGVyLnJlYWRJNjQoKSksXG4gIF9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX186IChyZWFkZXIpID0+IG5ldyBUaW1lc3RhbXAocmVhZGVyLnJlYWRJNjQoKSksXG4gIF9faWRlbnRpdHlfXzogKHJlYWRlcikgPT4gbmV3IElkZW50aXR5KHJlYWRlci5yZWFkVTI1NigpKSxcbiAgX19jb25uZWN0aW9uX2lkX186IChyZWFkZXIpID0+IG5ldyBDb25uZWN0aW9uSWQocmVhZGVyLnJlYWRVMTI4KCkpLFxuICBfX3V1aWRfXzogKHJlYWRlcikgPT4gbmV3IFV1aWQocmVhZGVyLnJlYWRVMTI4KCkpXG59O1xuT2JqZWN0LmZyZWV6ZShzcGVjaWFsUHJvZHVjdERlc2VyaWFsaXplcnMpO1xudmFyIHVuaXREZXNlcmlhbGl6ZXIgPSAoKSA9PiAoe30pO1xudmFyIGdldEVsZW1lbnRJbml0aWFsaXplciA9IChlbGVtZW50KSA9PiB7XG4gIGxldCBpbml0O1xuICBzd2l0Y2ggKGVsZW1lbnQuYWxnZWJyYWljVHlwZS50YWcpIHtcbiAgICBjYXNlIFwiU3RyaW5nXCI6XG4gICAgICBpbml0ID0gXCInJ1wiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkJvb2xcIjpcbiAgICAgIGluaXQgPSBcImZhbHNlXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiSThcIjpcbiAgICBjYXNlIFwiVThcIjpcbiAgICBjYXNlIFwiSTE2XCI6XG4gICAgY2FzZSBcIlUxNlwiOlxuICAgIGNhc2UgXCJJMzJcIjpcbiAgICBjYXNlIFwiVTMyXCI6XG4gICAgICBpbml0ID0gXCIwXCI7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiSTY0XCI6XG4gICAgY2FzZSBcIlU2NFwiOlxuICAgIGNhc2UgXCJJMTI4XCI6XG4gICAgY2FzZSBcIlUxMjhcIjpcbiAgICBjYXNlIFwiSTI1NlwiOlxuICAgIGNhc2UgXCJVMjU2XCI6XG4gICAgICBpbml0ID0gXCIwblwiO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkYzMlwiOlxuICAgIGNhc2UgXCJGNjRcIjpcbiAgICAgIGluaXQgPSBcIjAuMFwiO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIGluaXQgPSBcInVuZGVmaW5lZFwiO1xuICB9XG4gIHJldHVybiBgJHtlbGVtZW50Lm5hbWV9OiAke2luaXR9YDtcbn07XG52YXIgUHJvZHVjdFR5cGUgPSB7XG4gIG1ha2VTZXJpYWxpemVyKHR5LCB0eXBlc3BhY2UpIHtcbiAgICBsZXQgc2VyaWFsaXplciA9IFNFUklBTElaRVJTLmdldCh0eSk7XG4gICAgaWYgKHNlcmlhbGl6ZXIgIT0gbnVsbCkgcmV0dXJuIHNlcmlhbGl6ZXI7XG4gICAgaWYgKGlzRml4ZWRTaXplUHJvZHVjdCh0eSkpIHtcbiAgICAgIGNvbnN0IHNpemUgPSBwcm9kdWN0U2l6ZSh0eSk7XG4gICAgICBjb25zdCBib2R5MiA9IGBcInVzZSBzdHJpY3RcIjtcbndyaXRlci5leHBhbmRCdWZmZXIoJHtzaXplfSk7XG5jb25zdCB2aWV3ID0gd3JpdGVyLnZpZXc7XG4ke3R5LmVsZW1lbnRzLm1hcChcbiAgICAgICAgKHsgbmFtZSwgYWxnZWJyYWljVHlwZTogeyB0YWcgfSB9KSA9PiB0YWcgaW4gcHJpbWl0aXZlSlNOYW1lID8gYHZpZXcuc2V0JHtwcmltaXRpdmVKU05hbWVbdGFnXX0od3JpdGVyLm9mZnNldCwgdmFsdWUuJHtuYW1lfSwgJHtwcmltaXRpdmVTaXplc1t0YWddID4gMSA/IFwidHJ1ZVwiIDogXCJcIn0pO1xud3JpdGVyLm9mZnNldCArPSAke3ByaW1pdGl2ZVNpemVzW3RhZ119O2AgOiBgd3JpdGVyLndyaXRlJHt0YWd9KHZhbHVlLiR7bmFtZX0pO2BcbiAgICAgICkuam9pbihcIlxcblwiKX1gO1xuICAgICAgc2VyaWFsaXplciA9IEZ1bmN0aW9uKFwid3JpdGVyXCIsIFwidmFsdWVcIiwgYm9keTIpO1xuICAgICAgU0VSSUFMSVpFUlMuc2V0KHR5LCBzZXJpYWxpemVyKTtcbiAgICAgIHJldHVybiBzZXJpYWxpemVyO1xuICAgIH1cbiAgICBjb25zdCBzZXJpYWxpemVycyA9IHt9O1xuICAgIGNvbnN0IGJvZHkgPSAnXCJ1c2Ugc3RyaWN0XCI7XFxuJyArIHR5LmVsZW1lbnRzLm1hcChcbiAgICAgIChlbGVtZW50KSA9PiBgdGhpcy4ke2VsZW1lbnQubmFtZX0od3JpdGVyLCB2YWx1ZS4ke2VsZW1lbnQubmFtZX0pO2BcbiAgICApLmpvaW4oXCJcXG5cIik7XG4gICAgc2VyaWFsaXplciA9IEZ1bmN0aW9uKFwid3JpdGVyXCIsIFwidmFsdWVcIiwgYm9keSkuYmluZChcbiAgICAgIHNlcmlhbGl6ZXJzXG4gICAgKTtcbiAgICBTRVJJQUxJWkVSUy5zZXQodHksIHNlcmlhbGl6ZXIpO1xuICAgIGZvciAoY29uc3QgeyBuYW1lLCBhbGdlYnJhaWNUeXBlIH0gb2YgdHkuZWxlbWVudHMpIHtcbiAgICAgIHNlcmlhbGl6ZXJzW25hbWVdID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApO1xuICAgIH1cbiAgICBPYmplY3QuZnJlZXplKHNlcmlhbGl6ZXJzKTtcbiAgICByZXR1cm4gc2VyaWFsaXplcjtcbiAgfSxcbiAgLyoqIEBkZXByZWNhdGVkIFVzZSBgbWFrZVNlcmlhbGl6ZXJgIGluc3RlYWQuICovXG4gIHNlcmlhbGl6ZVZhbHVlKHdyaXRlciwgdHksIHZhbHVlLCB0eXBlc3BhY2UpIHtcbiAgICBQcm9kdWN0VHlwZS5tYWtlU2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSh3cml0ZXIsIHZhbHVlKTtcbiAgfSxcbiAgbWFrZURlc2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSB7XG4gICAgc3dpdGNoICh0eS5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIHVuaXREZXNlcmlhbGl6ZXI7XG4gICAgICBjYXNlIDE6IHtcbiAgICAgICAgY29uc3QgZmllbGROYW1lID0gdHkuZWxlbWVudHNbMF0ubmFtZTtcbiAgICAgICAgaWYgKGhhc093bihzcGVjaWFsUHJvZHVjdERlc2VyaWFsaXplcnMsIGZpZWxkTmFtZSkpXG4gICAgICAgICAgcmV0dXJuIHNwZWNpYWxQcm9kdWN0RGVzZXJpYWxpemVyc1tmaWVsZE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICBsZXQgZGVzZXJpYWxpemVyID0gREVTRVJJQUxJWkVSUy5nZXQodHkpO1xuICAgIGlmIChkZXNlcmlhbGl6ZXIgIT0gbnVsbCkgcmV0dXJuIGRlc2VyaWFsaXplcjtcbiAgICBpZiAoaXNGaXhlZFNpemVQcm9kdWN0KHR5KSkge1xuICAgICAgY29uc3QgYm9keSA9IGBcInVzZSBzdHJpY3RcIjtcbmNvbnN0IHJlc3VsdCA9IHsgJHt0eS5lbGVtZW50cy5tYXAoZ2V0RWxlbWVudEluaXRpYWxpemVyKS5qb2luKFwiLCBcIil9IH07XG5jb25zdCB2aWV3ID0gcmVhZGVyLnZpZXc7XG4ke3R5LmVsZW1lbnRzLm1hcChcbiAgICAgICAgKHsgbmFtZSwgYWxnZWJyYWljVHlwZTogeyB0YWcgfSB9KSA9PiB0YWcgaW4gcHJpbWl0aXZlSlNOYW1lID8gYHJlc3VsdC4ke25hbWV9ID0gdmlldy5nZXQke3ByaW1pdGl2ZUpTTmFtZVt0YWddfShyZWFkZXIub2Zmc2V0LCAke3ByaW1pdGl2ZVNpemVzW3RhZ10gPiAxID8gXCJ0cnVlXCIgOiBcIlwifSk7XG5yZWFkZXIub2Zmc2V0ICs9ICR7cHJpbWl0aXZlU2l6ZXNbdGFnXX07YCA6IGByZXN1bHQuJHtuYW1lfSA9IHJlYWRlci5yZWFkJHt0YWd9KCk7YFxuICAgICAgKS5qb2luKFwiXFxuXCIpfVxucmV0dXJuIHJlc3VsdDtgO1xuICAgICAgZGVzZXJpYWxpemVyID0gRnVuY3Rpb24oXCJyZWFkZXJcIiwgYm9keSk7XG4gICAgICBERVNFUklBTElaRVJTLnNldCh0eSwgZGVzZXJpYWxpemVyKTtcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZXI7XG4gICAgfVxuICAgIGNvbnN0IGRlc2VyaWFsaXplcnMgPSB7fTtcbiAgICBkZXNlcmlhbGl6ZXIgPSBGdW5jdGlvbihcbiAgICAgIFwicmVhZGVyXCIsXG4gICAgICBgXCJ1c2Ugc3RyaWN0XCI7XG5jb25zdCByZXN1bHQgPSB7ICR7dHkuZWxlbWVudHMubWFwKGdldEVsZW1lbnRJbml0aWFsaXplcikuam9pbihcIiwgXCIpfSB9O1xuJHt0eS5lbGVtZW50cy5tYXAoKHsgbmFtZSB9KSA9PiBgcmVzdWx0LiR7bmFtZX0gPSB0aGlzLiR7bmFtZX0ocmVhZGVyKTtgKS5qb2luKFwiXFxuXCIpfVxucmV0dXJuIHJlc3VsdDtgXG4gICAgKS5iaW5kKGRlc2VyaWFsaXplcnMpO1xuICAgIERFU0VSSUFMSVpFUlMuc2V0KHR5LCBkZXNlcmlhbGl6ZXIpO1xuICAgIGZvciAoY29uc3QgeyBuYW1lLCBhbGdlYnJhaWNUeXBlIH0gb2YgdHkuZWxlbWVudHMpIHtcbiAgICAgIGRlc2VyaWFsaXplcnNbbmFtZV0gPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIoXG4gICAgICAgIGFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKTtcbiAgICB9XG4gICAgT2JqZWN0LmZyZWV6ZShkZXNlcmlhbGl6ZXJzKTtcbiAgICByZXR1cm4gZGVzZXJpYWxpemVyO1xuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlRGVzZXJpYWxpemVyYCBpbnN0ZWFkLiAqL1xuICBkZXNlcmlhbGl6ZVZhbHVlKHJlYWRlciwgdHksIHR5cGVzcGFjZSkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZS5tYWtlRGVzZXJpYWxpemVyKHR5LCB0eXBlc3BhY2UpKHJlYWRlcik7XG4gIH0sXG4gIGludG9NYXBLZXkodHksIHZhbHVlKSB7XG4gICAgaWYgKHR5LmVsZW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgZmllbGROYW1lID0gdHkuZWxlbWVudHNbMF0ubmFtZTtcbiAgICAgIGlmIChoYXNPd24oc3BlY2lhbFByb2R1Y3REZXNlcmlhbGl6ZXJzLCBmaWVsZE5hbWUpKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZVtmaWVsZE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgICBjb25zdCB3cml0ZXIgPSBuZXcgQmluYXJ5V3JpdGVyKDEwKTtcbiAgICBBbGdlYnJhaWNUeXBlLnNlcmlhbGl6ZVZhbHVlKHdyaXRlciwgQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHR5KSwgdmFsdWUpO1xuICAgIHJldHVybiB3cml0ZXIudG9CYXNlNjQoKTtcbiAgfVxufTtcbnZhciBTdW1UeXBlID0ge1xuICBtYWtlU2VyaWFsaXplcih0eSwgdHlwZXNwYWNlKSB7XG4gICAgaWYgKHR5LnZhcmlhbnRzLmxlbmd0aCA9PSAyICYmIHR5LnZhcmlhbnRzWzBdLm5hbWUgPT09IFwic29tZVwiICYmIHR5LnZhcmlhbnRzWzFdLm5hbWUgPT09IFwibm9uZVwiKSB7XG4gICAgICBjb25zdCBzZXJpYWxpemUgPSBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKFxuICAgICAgICB0eS52YXJpYW50c1swXS5hbGdlYnJhaWNUeXBlLFxuICAgICAgICB0eXBlc3BhY2VcbiAgICAgICk7XG4gICAgICByZXR1cm4gKHdyaXRlciwgdmFsdWUpID0+IHtcbiAgICAgICAgaWYgKHZhbHVlICE9PSBudWxsICYmIHZhbHVlICE9PSB2b2lkIDApIHtcbiAgICAgICAgICB3cml0ZXIud3JpdGVCeXRlKDApO1xuICAgICAgICAgIHNlcmlhbGl6ZSh3cml0ZXIsIHZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB3cml0ZXIud3JpdGVCeXRlKDEpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHkudmFyaWFudHMubGVuZ3RoID09IDIgJiYgdHkudmFyaWFudHNbMF0ubmFtZSA9PT0gXCJva1wiICYmIHR5LnZhcmlhbnRzWzFdLm5hbWUgPT09IFwiZXJyXCIpIHtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZU9rID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgdHkudmFyaWFudHNbMF0uYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApO1xuICAgICAgY29uc3Qgc2VyaWFsaXplRXJyID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgICAgdHkudmFyaWFudHNbMF0uYWxnZWJyYWljVHlwZSxcbiAgICAgICAgdHlwZXNwYWNlXG4gICAgICApO1xuICAgICAgcmV0dXJuICh3cml0ZXIsIHZhbHVlKSA9PiB7XG4gICAgICAgIGlmIChcIm9rXCIgaW4gdmFsdWUpIHtcbiAgICAgICAgICB3cml0ZXIud3JpdGVVOCgwKTtcbiAgICAgICAgICBzZXJpYWxpemVPayh3cml0ZXIsIHZhbHVlLm9rKTtcbiAgICAgICAgfSBlbHNlIGlmIChcImVyclwiIGluIHZhbHVlKSB7XG4gICAgICAgICAgd3JpdGVyLndyaXRlVTgoMSk7XG4gICAgICAgICAgc2VyaWFsaXplRXJyKHdyaXRlciwgdmFsdWUuZXJyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgICAgXCJjb3VsZCBub3Qgc2VyaWFsaXplIHJlc3VsdDogb2JqZWN0IGhhZCBuZWl0aGVyIGEgYG9rYCBub3IgYW4gYGVycmAgZmllbGRcIlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBzZXJpYWxpemVyID0gU0VSSUFMSVpFUlMuZ2V0KHR5KTtcbiAgICAgIGlmIChzZXJpYWxpemVyICE9IG51bGwpIHJldHVybiBzZXJpYWxpemVyO1xuICAgICAgY29uc3Qgc2VyaWFsaXplcnMgPSB7fTtcbiAgICAgIGNvbnN0IGJvZHkgPSBgc3dpdGNoICh2YWx1ZS50YWcpIHtcbiR7dHkudmFyaWFudHMubWFwKFxuICAgICAgICAoeyBuYW1lIH0sIGkpID0+IGAgIGNhc2UgJHtKU09OLnN0cmluZ2lmeShuYW1lKX06XG4gICAgd3JpdGVyLndyaXRlQnl0ZSgke2l9KTtcbiAgICByZXR1cm4gdGhpcy4ke25hbWV9KHdyaXRlciwgdmFsdWUudmFsdWUpO2BcbiAgICAgICkuam9pbihcIlxcblwiKX1cbiAgZGVmYXVsdDpcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgXFxgQ291bGQgbm90IHNlcmlhbGl6ZSBzdW0gdHlwZTsgdW5rbm93biB0YWcgXFwke3ZhbHVlLnRhZ31cXGBcbiAgICApXG59XG5gO1xuICAgICAgc2VyaWFsaXplciA9IEZ1bmN0aW9uKFwid3JpdGVyXCIsIFwidmFsdWVcIiwgYm9keSkuYmluZChcbiAgICAgICAgc2VyaWFsaXplcnNcbiAgICAgICk7XG4gICAgICBTRVJJQUxJWkVSUy5zZXQodHksIHNlcmlhbGl6ZXIpO1xuICAgICAgZm9yIChjb25zdCB7IG5hbWUsIGFsZ2VicmFpY1R5cGUgfSBvZiB0eS52YXJpYW50cykge1xuICAgICAgICBzZXJpYWxpemVyc1tuYW1lXSA9IEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIoXG4gICAgICAgICAgYWxnZWJyYWljVHlwZSxcbiAgICAgICAgICB0eXBlc3BhY2VcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIE9iamVjdC5mcmVlemUoc2VyaWFsaXplcnMpO1xuICAgICAgcmV0dXJuIHNlcmlhbGl6ZXI7XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlU2VyaWFsaXplcmAgaW5zdGVhZC4gKi9cbiAgc2VyaWFsaXplVmFsdWUod3JpdGVyLCB0eSwgdmFsdWUsIHR5cGVzcGFjZSkge1xuICAgIFN1bVR5cGUubWFrZVNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkod3JpdGVyLCB2YWx1ZSk7XG4gIH0sXG4gIG1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkge1xuICAgIGlmICh0eS52YXJpYW50cy5sZW5ndGggPT0gMiAmJiB0eS52YXJpYW50c1swXS5uYW1lID09PSBcInNvbWVcIiAmJiB0eS52YXJpYW50c1sxXS5uYW1lID09PSBcIm5vbmVcIikge1xuICAgICAgY29uc3QgZGVzZXJpYWxpemUgPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIoXG4gICAgICAgIHR5LnZhcmlhbnRzWzBdLmFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKTtcbiAgICAgIHJldHVybiAocmVhZGVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHRhZyA9IHJlYWRlci5yZWFkVTgoKTtcbiAgICAgICAgaWYgKHRhZyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBkZXNlcmlhbGl6ZShyZWFkZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRhZyA9PT0gMSkge1xuICAgICAgICAgIHJldHVybiB2b2lkIDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgYENhbid0IGRlc2VyaWFsaXplIGFuIG9wdGlvbiB0eXBlLCBjb3VsZG4ndCBmaW5kICR7dGFnfSB0YWdgO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAodHkudmFyaWFudHMubGVuZ3RoID09IDIgJiYgdHkudmFyaWFudHNbMF0ubmFtZSA9PT0gXCJva1wiICYmIHR5LnZhcmlhbnRzWzFdLm5hbWUgPT09IFwiZXJyXCIpIHtcbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplT2sgPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIoXG4gICAgICAgIHR5LnZhcmlhbnRzWzBdLmFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplRXJyID0gQWxnZWJyYWljVHlwZS5tYWtlRGVzZXJpYWxpemVyKFxuICAgICAgICB0eS52YXJpYW50c1sxXS5hbGdlYnJhaWNUeXBlLFxuICAgICAgICB0eXBlc3BhY2VcbiAgICAgICk7XG4gICAgICByZXR1cm4gKHJlYWRlcikgPT4ge1xuICAgICAgICBjb25zdCB0YWcgPSByZWFkZXIucmVhZEJ5dGUoKTtcbiAgICAgICAgaWYgKHRhZyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB7IG9rOiBkZXNlcmlhbGl6ZU9rKHJlYWRlcikgfTtcbiAgICAgICAgfSBlbHNlIGlmICh0YWcgPT09IDEpIHtcbiAgICAgICAgICByZXR1cm4geyBlcnI6IGRlc2VyaWFsaXplRXJyKHJlYWRlcikgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBgQ2FuJ3QgZGVzZXJpYWxpemUgYSByZXN1bHQgdHlwZSwgY291bGRuJ3QgZmluZCAke3RhZ30gdGFnYDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGRlc2VyaWFsaXplciA9IERFU0VSSUFMSVpFUlMuZ2V0KHR5KTtcbiAgICAgIGlmIChkZXNlcmlhbGl6ZXIgIT0gbnVsbCkgcmV0dXJuIGRlc2VyaWFsaXplcjtcbiAgICAgIGNvbnN0IGRlc2VyaWFsaXplcnMgPSB7fTtcbiAgICAgIGRlc2VyaWFsaXplciA9IEZ1bmN0aW9uKFxuICAgICAgICBcInJlYWRlclwiLFxuICAgICAgICBgc3dpdGNoIChyZWFkZXIucmVhZFU4KCkpIHtcbiR7dHkudmFyaWFudHMubWFwKFxuICAgICAgICAgICh7IG5hbWUgfSwgaSkgPT4gYGNhc2UgJHtpfTogcmV0dXJuIHsgdGFnOiAke0pTT04uc3RyaW5naWZ5KG5hbWUpfSwgdmFsdWU6IHRoaXMuJHtuYW1lfShyZWFkZXIpIH07YFxuICAgICAgICApLmpvaW4oXCJcXG5cIil9IH1gXG4gICAgICApLmJpbmQoZGVzZXJpYWxpemVycyk7XG4gICAgICBERVNFUklBTElaRVJTLnNldCh0eSwgZGVzZXJpYWxpemVyKTtcbiAgICAgIGZvciAoY29uc3QgeyBuYW1lLCBhbGdlYnJhaWNUeXBlIH0gb2YgdHkudmFyaWFudHMpIHtcbiAgICAgICAgZGVzZXJpYWxpemVyc1tuYW1lXSA9IEFsZ2VicmFpY1R5cGUubWFrZURlc2VyaWFsaXplcihcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlLFxuICAgICAgICAgIHR5cGVzcGFjZVxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgT2JqZWN0LmZyZWV6ZShkZXNlcmlhbGl6ZXJzKTtcbiAgICAgIHJldHVybiBkZXNlcmlhbGl6ZXI7XG4gICAgfVxuICB9LFxuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGBtYWtlRGVzZXJpYWxpemVyYCBpbnN0ZWFkLiAqL1xuICBkZXNlcmlhbGl6ZVZhbHVlKHJlYWRlciwgdHksIHR5cGVzcGFjZSkge1xuICAgIHJldHVybiBTdW1UeXBlLm1ha2VEZXNlcmlhbGl6ZXIodHksIHR5cGVzcGFjZSkocmVhZGVyKTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9vcHRpb24udHNcbnZhciBPcHRpb24gPSB7XG4gIGdldEFsZ2VicmFpY1R5cGUoaW5uZXJUeXBlKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUuU3VtKHtcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHsgbmFtZTogXCJzb21lXCIsIGFsZ2VicmFpY1R5cGU6IGlubmVyVHlwZSB9LFxuICAgICAgICB7XG4gICAgICAgICAgbmFtZTogXCJub25lXCIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHsgZWxlbWVudHM6IFtdIH0pXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9yZXN1bHQudHNcbnZhciBSZXN1bHQgPSB7XG4gIGdldEFsZ2VicmFpY1R5cGUob2tUeXBlLCBlcnJUeXBlKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUuU3VtKHtcbiAgICAgIHZhcmlhbnRzOiBbXG4gICAgICAgIHsgbmFtZTogXCJva1wiLCBhbGdlYnJhaWNUeXBlOiBva1R5cGUgfSxcbiAgICAgICAgeyBuYW1lOiBcImVyclwiLCBhbGdlYnJhaWNUeXBlOiBlcnJUeXBlIH1cbiAgICAgIF1cbiAgICB9KTtcbiAgfVxufTtcblxuLy8gc3JjL2xpYi9zY2hlZHVsZV9hdC50c1xudmFyIFNjaGVkdWxlQXQgPSB7XG4gIGludGVydmFsKHZhbHVlKSB7XG4gICAgcmV0dXJuIEludGVydmFsKHZhbHVlKTtcbiAgfSxcbiAgdGltZSh2YWx1ZSkge1xuICAgIHJldHVybiBUaW1lKHZhbHVlKTtcbiAgfSxcbiAgZ2V0QWxnZWJyYWljVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZS5TdW0oe1xuICAgICAgdmFyaWFudHM6IFtcbiAgICAgICAge1xuICAgICAgICAgIG5hbWU6IFwiSW50ZXJ2YWxcIixcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlOiBUaW1lRHVyYXRpb24uZ2V0QWxnZWJyYWljVHlwZSgpXG4gICAgICAgIH0sXG4gICAgICAgIHsgbmFtZTogXCJUaW1lXCIsIGFsZ2VicmFpY1R5cGU6IFRpbWVzdGFtcC5nZXRBbGdlYnJhaWNUeXBlKCkgfVxuICAgICAgXVxuICAgIH0pO1xuICB9LFxuICBpc1NjaGVkdWxlQXQoYWxnZWJyYWljVHlwZSkge1xuICAgIGlmIChhbGdlYnJhaWNUeXBlLnRhZyAhPT0gXCJTdW1cIikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCB2YXJpYW50cyA9IGFsZ2VicmFpY1R5cGUudmFsdWUudmFyaWFudHM7XG4gICAgaWYgKHZhcmlhbnRzLmxlbmd0aCAhPT0gMikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBpbnRlcnZhbFZhcmlhbnQgPSB2YXJpYW50cy5maW5kKCh2KSA9PiB2Lm5hbWUgPT09IFwiSW50ZXJ2YWxcIik7XG4gICAgY29uc3QgdGltZVZhcmlhbnQgPSB2YXJpYW50cy5maW5kKCh2KSA9PiB2Lm5hbWUgPT09IFwiVGltZVwiKTtcbiAgICBpZiAoIWludGVydmFsVmFyaWFudCB8fCAhdGltZVZhcmlhbnQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIFRpbWVEdXJhdGlvbi5pc1RpbWVEdXJhdGlvbihpbnRlcnZhbFZhcmlhbnQuYWxnZWJyYWljVHlwZSkgJiYgVGltZXN0YW1wLmlzVGltZXN0YW1wKHRpbWVWYXJpYW50LmFsZ2VicmFpY1R5cGUpO1xuICB9XG59O1xudmFyIEludGVydmFsID0gKG1pY3JvcykgPT4gKHtcbiAgdGFnOiBcIkludGVydmFsXCIsXG4gIHZhbHVlOiBuZXcgVGltZUR1cmF0aW9uKG1pY3Jvcylcbn0pO1xudmFyIFRpbWUgPSAobWljcm9zU2luY2VVbml4RXBvY2gpID0+ICh7XG4gIHRhZzogXCJUaW1lXCIsXG4gIHZhbHVlOiBuZXcgVGltZXN0YW1wKG1pY3Jvc1NpbmNlVW5peEVwb2NoKVxufSk7XG52YXIgc2NoZWR1bGVfYXRfZGVmYXVsdCA9IFNjaGVkdWxlQXQ7XG5cbi8vIHNyYy9saWIvdHlwZV91dGlsLnRzXG5mdW5jdGlvbiBzZXQoeCwgdDIpIHtcbiAgcmV0dXJuIHsgLi4ueCwgLi4udDIgfTtcbn1cblxuLy8gc3JjL2xpYi90eXBlX2J1aWxkZXJzLnRzXG52YXIgVHlwZUJ1aWxkZXIgPSBjbGFzcyB7XG4gIC8qKlxuICAgKiBUaGUgVHlwZVNjcmlwdCBwaGFudG9tIHR5cGUuIFRoaXMgaXMgbm90IHN0b3JlZCBhdCBydW50aW1lLFxuICAgKiBidXQgaXMgdmlzaWJsZSB0byB0aGUgY29tcGlsZXJcbiAgICovXG4gIHR5cGU7XG4gIC8qKlxuICAgKiBUaGUgU3BhY2V0aW1lREIgYWxnZWJyYWljIHR5cGUgKHJ1buKAkXRpbWUgdmFsdWUpLiBJbiBhZGRpdGlvbiB0byBzdG9yaW5nXG4gICAqIHRoZSBydW50aW1lIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBgQWxnZWJyYWljVHlwZWAsIGl0IGFsc28gY2FwdHVyZXNcbiAgICogdGhlIFR5cGVTY3JpcHQgdHlwZSBpbmZvcm1hdGlvbiBvZiB0aGUgYEFsZ2VicmFpY1R5cGVgLiBUaGF0IGlzIHRvIHNheVxuICAgKiB0aGUgdmFsdWUgaXMgbm90IG1lcmVseSBhbiBgQWxnZWJyYWljVHlwZWAsIGJ1dCBpcyBjb25zdHJ1Y3RlZCB0byBiZVxuICAgKiB0aGUgY29ycmVzcG9uZGluZyBjb25jcmV0ZSBgQWxnZWJyYWljVHlwZWAgZm9yIHRoZSBUeXBlU2NyaXB0IHR5cGUgYFR5cGVgLlxuICAgKlxuICAgKiBlLmcuIGBzdHJpbmdgIGNvcnJlc3BvbmRzIHRvIGBBbGdlYnJhaWNUeXBlLlN0cmluZ2BcbiAgICovXG4gIGFsZ2VicmFpY1R5cGU7XG4gIGNvbnN0cnVjdG9yKGFsZ2VicmFpY1R5cGUpIHtcbiAgICB0aGlzLmFsZ2VicmFpY1R5cGUgPSBhbGdlYnJhaWNUeXBlO1xuICB9XG4gIG9wdGlvbmFsKCkge1xuICAgIHJldHVybiBuZXcgT3B0aW9uQnVpbGRlcih0aGlzKTtcbiAgfVxuICBzZXJpYWxpemUod3JpdGVyLCB2YWx1ZSkge1xuICAgIGNvbnN0IHNlcmlhbGl6ZSA9IHRoaXMuc2VyaWFsaXplID0gQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihcbiAgICAgIHRoaXMuYWxnZWJyYWljVHlwZVxuICAgICk7XG4gICAgc2VyaWFsaXplKHdyaXRlciwgdmFsdWUpO1xuICB9XG4gIGRlc2VyaWFsaXplKHJlYWRlcikge1xuICAgIGNvbnN0IGRlc2VyaWFsaXplID0gdGhpcy5kZXNlcmlhbGl6ZSA9IEFsZ2VicmFpY1R5cGUubWFrZURlc2VyaWFsaXplcihcbiAgICAgIHRoaXMuYWxnZWJyYWljVHlwZVxuICAgICk7XG4gICAgcmV0dXJuIGRlc2VyaWFsaXplKHJlYWRlcik7XG4gIH1cbn07XG52YXIgVThCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuVTgpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFU4Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBVOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFU4Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFUxNkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VMTYpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTZDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTE2Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFUzMkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VMzIpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVMzJDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTMyQ29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFU2NEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VNjQpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVNjRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTY0Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFUxMjhCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuVTEyOCk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBVMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBVMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFUxMjhDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgVTI1NkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5VMjU2KTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IFUyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFUyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IFUyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBVMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVTI1NkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBJOEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5JOCk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgSThDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSkpO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBJOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IEk4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgSThDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTE2QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkkxNik7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEkxNkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KSk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEkxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJMTZDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTMyQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkkzMik7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEkzMkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KSk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEkzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJMzJDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTY0QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkk2NCk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEk2NENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KSk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEk2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJNjRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgSTEyOEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5JMTI4KTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IEkxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEkxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBJMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IEkxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgSTEyOENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBJMjU2QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLkkyNTYpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IEkyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IEkyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBJMjU2Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIEYzMkJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5GMzIpO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IEYzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEYzMkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBGNjRCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuRjY0KTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBGNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBGNjRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgQm9vbEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5Cb29sKTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBCb29sQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgU3RyaW5nQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihBbGdlYnJhaWNUeXBlLlN0cmluZyk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBTdHJpbmdDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBBcnJheUJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgZWxlbWVudDtcbiAgY29uc3RydWN0b3IoZWxlbWVudCkge1xuICAgIHN1cGVyKEFsZ2VicmFpY1R5cGUuQXJyYXkoZWxlbWVudC5hbGdlYnJhaWNUeXBlKSk7XG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBBcnJheUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIEJ5dGVBcnJheUJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5BcnJheShBbGdlYnJhaWNUeXBlLlU4KSk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgQnl0ZUFycmF5Q29sdW1uQnVpbGRlcihcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBCeXRlQXJyYXlDb2x1bW5CdWlsZGVyKHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgT3B0aW9uQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICB2YWx1ZTtcbiAgY29uc3RydWN0b3IodmFsdWUpIHtcbiAgICBzdXBlcihPcHRpb24uZ2V0QWxnZWJyYWljVHlwZSh2YWx1ZS5hbGdlYnJhaWNUeXBlKSk7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IE9wdGlvbkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IE9wdGlvbkNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBQcm9kdWN0QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICB0eXBlTmFtZTtcbiAgZWxlbWVudHM7XG4gIGNvbnN0cnVjdG9yKGVsZW1lbnRzLCBuYW1lKSB7XG4gICAgZnVuY3Rpb24gZWxlbWVudHNBcnJheUZyb21FbGVtZW50c09iaihvYmopIHtcbiAgICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopLm1hcCgoa2V5KSA9PiAoe1xuICAgICAgICBuYW1lOiBrZXksXG4gICAgICAgIC8vIExhemlseSByZXNvbHZlIHRoZSB1bmRlcmx5aW5nIG9iamVjdCdzIGFsZ2VicmFpY1R5cGUuXG4gICAgICAgIC8vIFRoaXMgd2lsbCBjYWxsIG9ialtrZXldLmFsZ2VicmFpY1R5cGUgb25seSB3aGVuIHNvbWVvbmVcbiAgICAgICAgLy8gYWN0dWFsbHkgcmVhZHMgdGhpcyBwcm9wZXJ0eS5cbiAgICAgICAgZ2V0IGFsZ2VicmFpY1R5cGUoKSB7XG4gICAgICAgICAgcmV0dXJuIG9ialtrZXldLmFsZ2VicmFpY1R5cGU7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcbiAgICB9XG4gICAgc3VwZXIoXG4gICAgICBBbGdlYnJhaWNUeXBlLlByb2R1Y3Qoe1xuICAgICAgICBlbGVtZW50czogZWxlbWVudHNBcnJheUZyb21FbGVtZW50c09iaihlbGVtZW50cylcbiAgICAgIH0pXG4gICAgKTtcbiAgICB0aGlzLnR5cGVOYW1lID0gbmFtZTtcbiAgICB0aGlzLmVsZW1lbnRzID0gZWxlbWVudHM7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvZHVjdENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFByb2R1Y3RDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgUmVzdWx0QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBvaztcbiAgZXJyO1xuICBjb25zdHJ1Y3RvcihvaywgZXJyKSB7XG4gICAgc3VwZXIoUmVzdWx0LmdldEFsZ2VicmFpY1R5cGUob2suYWxnZWJyYWljVHlwZSwgZXJyLmFsZ2VicmFpY1R5cGUpKTtcbiAgICB0aGlzLm9rID0gb2s7XG4gICAgdGhpcy5lcnIgPSBlcnI7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUmVzdWx0Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSkpO1xuICB9XG59O1xudmFyIFVuaXRCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHsgdGFnOiBcIlByb2R1Y3RcIiwgdmFsdWU6IHsgZWxlbWVudHM6IFtdIH0gfSk7XG4gIH1cbn07XG52YXIgUm93QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICByb3c7XG4gIHR5cGVOYW1lO1xuICBjb25zdHJ1Y3Rvcihyb3csIG5hbWUpIHtcbiAgICBjb25zdCBtYXBwZWRSb3cgPSBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICBPYmplY3QuZW50cmllcyhyb3cpLm1hcCgoW2NvbE5hbWUsIGJ1aWxkZXJdKSA9PiBbXG4gICAgICAgIGNvbE5hbWUsXG4gICAgICAgIGJ1aWxkZXIgaW5zdGFuY2VvZiBDb2x1bW5CdWlsZGVyID8gYnVpbGRlciA6IG5ldyBDb2x1bW5CdWlsZGVyKGJ1aWxkZXIsIHt9KVxuICAgICAgXSlcbiAgICApO1xuICAgIGNvbnN0IGVsZW1lbnRzID0gT2JqZWN0LmtleXMobWFwcGVkUm93KS5tYXAoKG5hbWUyKSA9PiAoe1xuICAgICAgbmFtZTogbmFtZTIsXG4gICAgICBnZXQgYWxnZWJyYWljVHlwZSgpIHtcbiAgICAgICAgcmV0dXJuIG1hcHBlZFJvd1tuYW1lMl0udHlwZUJ1aWxkZXIuYWxnZWJyYWljVHlwZTtcbiAgICAgIH1cbiAgICB9KSk7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHsgZWxlbWVudHMgfSkpO1xuICAgIHRoaXMucm93ID0gbWFwcGVkUm93O1xuICAgIHRoaXMudHlwZU5hbWUgPSBuYW1lO1xuICB9XG59O1xudmFyIFN1bUJ1aWxkZXJJbXBsID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIHZhcmlhbnRzO1xuICB0eXBlTmFtZTtcbiAgY29uc3RydWN0b3IodmFyaWFudHMsIG5hbWUpIHtcbiAgICBmdW5jdGlvbiB2YXJpYW50c0FycmF5RnJvbVZhcmlhbnRzT2JqKHZhcmlhbnRzMikge1xuICAgICAgcmV0dXJuIE9iamVjdC5rZXlzKHZhcmlhbnRzMikubWFwKChrZXkpID0+ICh7XG4gICAgICAgIG5hbWU6IGtleSxcbiAgICAgICAgLy8gTGF6aWx5IHJlc29sdmUgdGhlIHVuZGVybHlpbmcgb2JqZWN0J3MgYWxnZWJyYWljVHlwZS5cbiAgICAgICAgLy8gVGhpcyB3aWxsIGNhbGwgb2JqW2tleV0uYWxnZWJyYWljVHlwZSBvbmx5IHdoZW4gc29tZW9uZVxuICAgICAgICAvLyBhY3R1YWxseSByZWFkcyB0aGlzIHByb3BlcnR5LlxuICAgICAgICBnZXQgYWxnZWJyYWljVHlwZSgpIHtcbiAgICAgICAgICByZXR1cm4gdmFyaWFudHMyW2tleV0uYWxnZWJyYWljVHlwZTtcbiAgICAgICAgfVxuICAgICAgfSkpO1xuICAgIH1cbiAgICBzdXBlcihcbiAgICAgIEFsZ2VicmFpY1R5cGUuU3VtKHtcbiAgICAgICAgdmFyaWFudHM6IHZhcmlhbnRzQXJyYXlGcm9tVmFyaWFudHNPYmoodmFyaWFudHMpXG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy52YXJpYW50cyA9IHZhcmlhbnRzO1xuICAgIHRoaXMudHlwZU5hbWUgPSBuYW1lO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHZhcmlhbnRzKSkge1xuICAgICAgY29uc3QgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFyaWFudHMsIGtleSk7XG4gICAgICBjb25zdCBpc0FjY2Vzc29yID0gISFkZXNjICYmICh0eXBlb2YgZGVzYy5nZXQgPT09IFwiZnVuY3Rpb25cIiB8fCB0eXBlb2YgZGVzYy5zZXQgPT09IFwiZnVuY3Rpb25cIik7XG4gICAgICBsZXQgaXNVbml0MiA9IGZhbHNlO1xuICAgICAgaWYgKCFpc0FjY2Vzc29yKSB7XG4gICAgICAgIGNvbnN0IHZhcmlhbnQgPSB2YXJpYW50c1trZXldO1xuICAgICAgICBpc1VuaXQyID0gdmFyaWFudCBpbnN0YW5jZW9mIFVuaXRCdWlsZGVyO1xuICAgICAgfVxuICAgICAgaWYgKGlzVW5pdDIpIHtcbiAgICAgICAgY29uc3QgY29uc3RhbnQgPSB0aGlzLmNyZWF0ZShrZXkpO1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCB7XG4gICAgICAgICAgdmFsdWU6IGNvbnN0YW50LFxuICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBmbiA9ICgodmFsdWUpID0+IHRoaXMuY3JlYXRlKGtleSwgdmFsdWUpKTtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIGtleSwge1xuICAgICAgICAgIHZhbHVlOiBmbixcbiAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBjcmVhdGUodGFnLCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdm9pZCAwID8geyB0YWcgfSA6IHsgdGFnLCB2YWx1ZSB9O1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFN1bUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFN1bUNvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBTdW1CdWlsZGVyID0gU3VtQnVpbGRlckltcGw7XG52YXIgU2ltcGxlU3VtQnVpbGRlckltcGwgPSBjbGFzcyBleHRlbmRzIFN1bUJ1aWxkZXJJbXBsIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBTaW1wbGVTdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBTaW1wbGVTdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBTaW1wbGVTdW1CdWlsZGVyID0gU2ltcGxlU3VtQnVpbGRlckltcGw7XG52YXIgU2NoZWR1bGVBdEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVfYXRfZGVmYXVsdC5nZXRBbGdlYnJhaWNUeXBlKCkpO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFNjaGVkdWxlQXRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZUF0Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIElkZW50aXR5QnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihJZGVudGl0eS5nZXRBbGdlYnJhaWNUeXBlKCkpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IElkZW50aXR5Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBJZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IElkZW50aXR5Q29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIENvbm5lY3Rpb25JZEJ1aWxkZXIgPSBjbGFzcyBleHRlbmRzIFR5cGVCdWlsZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoQ29ubmVjdGlvbklkLmdldEFsZ2VicmFpY1R5cGUoKSk7XG4gIH1cbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IENvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IENvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKHRoaXMsIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgbmFtZSB9KSk7XG4gIH1cbn07XG52YXIgVGltZXN0YW1wQnVpbGRlciA9IGNsYXNzIGV4dGVuZHMgVHlwZUJ1aWxkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihUaW1lc3RhbXAuZ2V0QWxnZWJyYWljVHlwZSgpKTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLFxuICAgICAgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBUaW1lRHVyYXRpb25CdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFRpbWVEdXJhdGlvbi5nZXRBbGdlYnJhaWNUeXBlKCkpO1xuICB9XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcih0aGlzLCBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIFV1aWRCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKFV1aWQuZ2V0QWxnZWJyYWljVHlwZSgpKTtcbiAgfVxuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IFV1aWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IFV1aWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBVdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IFV1aWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcyxcbiAgICAgIHNldChkZWZhdWx0TWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBVdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMsXG4gICAgICBzZXQoZGVmYXVsdE1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgVXVpZENvbHVtbkJ1aWxkZXIodGhpcywgc2V0KGRlZmF1bHRNZXRhZGF0YSwgeyBuYW1lIH0pKTtcbiAgfVxufTtcbnZhciBkZWZhdWx0TWV0YWRhdGEgPSB7fTtcbnZhciBDb2x1bW5CdWlsZGVyID0gY2xhc3Mge1xuICB0eXBlQnVpbGRlcjtcbiAgY29sdW1uTWV0YWRhdGE7XG4gIGNvbnN0cnVjdG9yKHR5cGVCdWlsZGVyLCBtZXRhZGF0YSkge1xuICAgIHRoaXMudHlwZUJ1aWxkZXIgPSB0eXBlQnVpbGRlcjtcbiAgICB0aGlzLmNvbHVtbk1ldGFkYXRhID0gbWV0YWRhdGE7XG4gIH1cbiAgc2VyaWFsaXplKHdyaXRlciwgdmFsdWUpIHtcbiAgICB0aGlzLnR5cGVCdWlsZGVyLnNlcmlhbGl6ZSh3cml0ZXIsIHZhbHVlKTtcbiAgfVxuICBkZXNlcmlhbGl6ZShyZWFkZXIpIHtcbiAgICByZXR1cm4gdGhpcy50eXBlQnVpbGRlci5kZXNlcmlhbGl6ZShyZWFkZXIpO1xuICB9XG59O1xudmFyIFU4Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9VOENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1U4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1U4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFUxNkNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfVTE2Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9VMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9VMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9VMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1UxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1UxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgVTMyQ29sdW1uQnVpbGRlciA9IGNsYXNzIF9VMzJDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX1UzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9VMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1UzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX1UzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBVNjRDb2x1bW5CdWlsZGVyID0gY2xhc3MgX1U2NENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX1U2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9VNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9VNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFUxMjhDb2x1bW5CdWlsZGVyID0gY2xhc3MgX1UxMjhDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX1UxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfVTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX1UxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1UxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9VMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBVMjU2Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9VMjU2Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9VMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX1UyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1UyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9VMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9VMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSThDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0k4Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfSThDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSTE2Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9JMTZDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0kxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JMTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX0kxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX0kxNkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfSTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfSTE2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBJMzJDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0kzMkNvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfSTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX0kzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTMyQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc0F1dG9JbmNyZW1lbnQ6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9JMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JMzJDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIEk2NENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfSTY0Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9JNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTY0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9JNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgYXV0b0luYygpIHtcbiAgICByZXR1cm4gbmV3IF9JNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0k2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0k2NENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSTEyOENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfSTEyOENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfSTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9JMTI4Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGF1dG9JbmMoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNBdXRvSW5jcmVtZW50OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfSTEyOENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0kxMjhDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIEkyNTZDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0kyNTZDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0kyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSTI1NkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBhdXRvSW5jKCkge1xuICAgIHJldHVybiBuZXcgX0kyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzQXV0b0luY3JlbWVudDogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0kyNTZDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JMjU2Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBGMzJDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0YzMkNvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0YzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0YzMkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgRjY0Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9GNjRDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9GNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9GNjRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIEJvb2xDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0Jvb2xDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0Jvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfQm9vbENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFN0cmluZ0NvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfU3RyaW5nQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9TdHJpbmdDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfU3RyaW5nQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9TdHJpbmdDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1N0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiB2YWx1ZVxuICAgICAgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1N0cmluZ0NvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgQXJyYXlDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0FycmF5Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfQXJyYXlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogdmFsdWVcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9BcnJheUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgQnl0ZUFycmF5Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9CeXRlQXJyYXlDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGNvbnN0cnVjdG9yKG1ldGFkYXRhKSB7XG4gICAgc3VwZXIobmV3IFR5cGVCdWlsZGVyKEFsZ2VicmFpY1R5cGUuQXJyYXkoQWxnZWJyYWljVHlwZS5VOCkpLCBtZXRhZGF0YSk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0J5dGVBcnJheUNvbHVtbkJ1aWxkZXIoXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9CeXRlQXJyYXlDb2x1bW5CdWlsZGVyKHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSkpO1xuICB9XG59O1xudmFyIE9wdGlvbkNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfT3B0aW9uQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfT3B0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfT3B0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBSZXN1bHRDb2x1bW5CdWlsZGVyID0gY2xhc3MgX1Jlc3VsdENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgY29uc3RydWN0b3IodHlwZUJ1aWxkZXIsIG1ldGFkYXRhKSB7XG4gICAgc3VwZXIodHlwZUJ1aWxkZXIsIG1ldGFkYXRhKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfUmVzdWx0Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwge1xuICAgICAgICBkZWZhdWx0VmFsdWU6IHZhbHVlXG4gICAgICB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgUHJvZHVjdENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfUHJvZHVjdENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1Byb2R1Y3RDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1Byb2R1Y3RDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFN1bUNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfU3VtQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfU3VtQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9TdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFNpbXBsZVN1bUNvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfU2ltcGxlU3VtQ29sdW1uQnVpbGRlciBleHRlbmRzIFN1bUNvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9TaW1wbGVTdW1Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX1NpbXBsZVN1bUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBTY2hlZHVsZUF0Q29sdW1uQnVpbGRlciA9IGNsYXNzIF9TY2hlZHVsZUF0Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfU2NoZWR1bGVBdENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfU2NoZWR1bGVBdENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgSWRlbnRpdHlDb2x1bW5CdWlsZGVyID0gY2xhc3MgX0lkZW50aXR5Q29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfSWRlbnRpdHlDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX0lkZW50aXR5Q29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9JZGVudGl0eUNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgQ29ubmVjdGlvbklkQ29sdW1uQnVpbGRlciA9IGNsYXNzIF9Db25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyIGV4dGVuZHMgQ29sdW1uQnVpbGRlciB7XG4gIGluZGV4KGFsZ29yaXRobSA9IFwiYnRyZWVcIikge1xuICAgIHJldHVybiBuZXcgX0Nvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9Db25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzVW5pcXVlOiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBwcmltYXJ5S2V5KCkge1xuICAgIHJldHVybiBuZXcgX0Nvbm5lY3Rpb25JZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNQcmltYXJ5S2V5OiB0cnVlIH0pXG4gICAgKTtcbiAgfVxuICBkZWZhdWx0KHZhbHVlKSB7XG4gICAgcmV0dXJuIG5ldyBfQ29ubmVjdGlvbklkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9Db25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IG5hbWUgfSlcbiAgICApO1xuICB9XG59O1xudmFyIFRpbWVzdGFtcENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfVGltZXN0YW1wQ29sdW1uQnVpbGRlciBleHRlbmRzIENvbHVtbkJ1aWxkZXIge1xuICBpbmRleChhbGdvcml0aG0gPSBcImJ0cmVlXCIpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lc3RhbXBDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGluZGV4VHlwZTogYWxnb3JpdGhtIH0pXG4gICAgKTtcbiAgfVxuICB1bmlxdWUoKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lc3RhbXBDb2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGlzUHJpbWFyeUtleTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgZGVmYXVsdCh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgX1RpbWVzdGFtcENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgZGVmYXVsdFZhbHVlOiB2YWx1ZSB9KVxuICAgICk7XG4gIH1cbiAgbmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZXN0YW1wQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBUaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyID0gY2xhc3MgX1RpbWVEdXJhdGlvbkNvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpbmRleFR5cGU6IGFsZ29yaXRobSB9KVxuICAgICk7XG4gIH1cbiAgdW5pcXVlKCkge1xuICAgIHJldHVybiBuZXcgX1RpbWVEdXJhdGlvbkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaXNVbmlxdWU6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIHByaW1hcnlLZXkoKSB7XG4gICAgcmV0dXJuIG5ldyBfVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9UaW1lRHVyYXRpb25Db2x1bW5CdWlsZGVyKFxuICAgICAgdGhpcy50eXBlQnVpbGRlcixcbiAgICAgIHNldCh0aGlzLmNvbHVtbk1ldGFkYXRhLCB7IGRlZmF1bHRWYWx1ZTogdmFsdWUgfSlcbiAgICApO1xuICB9XG4gIG5hbWUobmFtZSkge1xuICAgIHJldHVybiBuZXcgX1RpbWVEdXJhdGlvbkNvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgbmFtZSB9KVxuICAgICk7XG4gIH1cbn07XG52YXIgVXVpZENvbHVtbkJ1aWxkZXIgPSBjbGFzcyBfVXVpZENvbHVtbkJ1aWxkZXIgZXh0ZW5kcyBDb2x1bW5CdWlsZGVyIHtcbiAgaW5kZXgoYWxnb3JpdGhtID0gXCJidHJlZVwiKSB7XG4gICAgcmV0dXJuIG5ldyBfVXVpZENvbHVtbkJ1aWxkZXIoXG4gICAgICB0aGlzLnR5cGVCdWlsZGVyLFxuICAgICAgc2V0KHRoaXMuY29sdW1uTWV0YWRhdGEsIHsgaW5kZXhUeXBlOiBhbGdvcml0aG0gfSlcbiAgICApO1xuICB9XG4gIHVuaXF1ZSgpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1VuaXF1ZTogdHJ1ZSB9KVxuICAgICk7XG4gIH1cbiAgcHJpbWFyeUtleSgpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBpc1ByaW1hcnlLZXk6IHRydWUgfSlcbiAgICApO1xuICB9XG4gIGRlZmF1bHQodmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBkZWZhdWx0VmFsdWU6IHZhbHVlIH0pXG4gICAgKTtcbiAgfVxuICBuYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gbmV3IF9VdWlkQ29sdW1uQnVpbGRlcihcbiAgICAgIHRoaXMudHlwZUJ1aWxkZXIsXG4gICAgICBzZXQodGhpcy5jb2x1bW5NZXRhZGF0YSwgeyBuYW1lIH0pXG4gICAgKTtcbiAgfVxufTtcbnZhciBSZWZCdWlsZGVyID0gY2xhc3MgZXh0ZW5kcyBUeXBlQnVpbGRlciB7XG4gIHJlZjtcbiAgLyoqIFRoZSBwaGFudG9tIHR5cGUgb2YgdGhlIHBvaW50ZWUgb2YgdGhpcyByZWYuICovXG4gIF9fc3BhY2V0aW1lVHlwZTtcbiAgY29uc3RydWN0b3IocmVmKSB7XG4gICAgc3VwZXIoQWxnZWJyYWljVHlwZS5SZWYocmVmKSk7XG4gICAgdGhpcy5yZWYgPSByZWY7XG4gIH1cbn07XG52YXIgZW51bUltcGwgPSAoKG5hbWVPck9iaiwgbWF5YmVPYmopID0+IHtcbiAgbGV0IG9iaiA9IG5hbWVPck9iajtcbiAgbGV0IG5hbWUgPSB2b2lkIDA7XG4gIGlmICh0eXBlb2YgbmFtZU9yT2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgaWYgKCFtYXliZU9iaikge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgXCJXaGVuIHByb3ZpZGluZyBhIG5hbWUsIHlvdSBtdXN0IGFsc28gcHJvdmlkZSB0aGUgdmFyaWFudHMgb2JqZWN0IG9yIGFycmF5LlwiXG4gICAgICApO1xuICAgIH1cbiAgICBvYmogPSBtYXliZU9iajtcbiAgICBuYW1lID0gbmFtZU9yT2JqO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcbiAgICBjb25zdCBzaW1wbGVWYXJpYW50c09iaiA9IHt9O1xuICAgIGZvciAoY29uc3QgdmFyaWFudCBvZiBvYmopIHtcbiAgICAgIHNpbXBsZVZhcmlhbnRzT2JqW3ZhcmlhbnRdID0gbmV3IFVuaXRCdWlsZGVyKCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgU2ltcGxlU3VtQnVpbGRlckltcGwoc2ltcGxlVmFyaWFudHNPYmosIG5hbWUpO1xuICB9XG4gIHJldHVybiBuZXcgU3VtQnVpbGRlcihvYmosIG5hbWUpO1xufSk7XG52YXIgdCA9IHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEJvb2xgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBib29sZWFuYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgQm9vbEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBib29sOiAoKSA9PiBuZXcgQm9vbEJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFN0cmluZ2Age0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYHN0cmluZ2AgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFN0cmluZ0J1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBzdHJpbmc6ICgpID0+IG5ldyBTdHJpbmdCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGNjRgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBGNjRCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgbnVtYmVyOiAoKSA9PiBuZXcgRjY0QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSThgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBJOEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBpODogKCkgPT4gbmV3IEk4QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVThgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBVOEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICB1ODogKCkgPT4gbmV3IFU4QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSTE2YCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgbnVtYmVyYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgSTE2QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGkxNjogKCkgPT4gbmV3IEkxNkJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFUxNmAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYG51bWJlcmAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFUxNkJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICB1MTY6ICgpID0+IG5ldyBVMTZCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBJMzJgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBJMzJCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgaTMyOiAoKSA9PiBuZXcgSTMyQnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVTMyYCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgbnVtYmVyYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgVTMyQnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIHUzMjogKCkgPT4gbmV3IFUzMkJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEk2NGAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYGJpZ2ludGAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIEk2NEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICBpNjQ6ICgpID0+IG5ldyBJNjRCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBVNjRgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBiaWdpbnRgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBVNjRCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgdTY0OiAoKSA9PiBuZXcgVTY0QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgSTEyOGAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYGJpZ2ludGAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIEkxMjhCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgaTEyODogKCkgPT4gbmV3IEkxMjhCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBVMTI4YCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgYmlnaW50YCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgVTEyOEJ1aWxkZXJ9IGluc3RhbmNlXG4gICAqL1xuICB1MTI4OiAoKSA9PiBuZXcgVTEyOEJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYEkyNTZgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBiaWdpbnRgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBJMjU2QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGkyNTY6ICgpID0+IG5ldyBJMjU2QnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgVTI1NmAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnNcbiAgICogUmVwcmVzZW50ZWQgYXMgYGJpZ2ludGAgaW4gVHlwZVNjcmlwdC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFUyNTZCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgdTI1NjogKCkgPT4gbmV3IFUyNTZCdWlsZGVyKCksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBGMzJgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zXG4gICAqIFJlcHJlc2VudGVkIGFzIGBudW1iZXJgIGluIFR5cGVTY3JpcHQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBGMzJCdWlsZGVyfSBpbnN0YW5jZVxuICAgKi9cbiAgZjMyOiAoKSA9PiBuZXcgRjMyQnVpbGRlcigpLFxuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBgRjY0YCB7QGxpbmsgQWxnZWJyYWljVHlwZX0gdG8gYmUgdXNlZCBpbiB0YWJsZSBkZWZpbml0aW9uc1xuICAgKiBSZXByZXNlbnRlZCBhcyBgbnVtYmVyYCBpbiBUeXBlU2NyaXB0LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgRjY0QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGY2NDogKCkgPT4gbmV3IEY2NEJ1aWxkZXIoKSxcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgYFByb2R1Y3RgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zLiBQcm9kdWN0IHR5cGVzIGluIFNwYWNldGltZURCXG4gICAqIGFyZSBlc3NlbnRpYWxseSB0aGUgc2FtZSBhcyBvYmplY3RzIGluIEphdmFTY3JpcHQvVHlwZVNjcmlwdC5cbiAgICogUHJvcGVydGllcyBvZiB0aGUgb2JqZWN0IG11c3QgYWxzbyBiZSB7QGxpbmsgVHlwZUJ1aWxkZXJ9cy5cbiAgICogUmVwcmVzZW50ZWQgYXMgYW4gb2JqZWN0IHdpdGggc3BlY2lmaWMgcHJvcGVydGllcyBpbiBUeXBlU2NyaXB0LlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSAob3B0aW9uYWwpIEEgZGlzcGxheSBuYW1lIGZvciB0aGUgcHJvZHVjdCB0eXBlLiBJZiBvbWl0dGVkLCBhbiBhbm9ueW1vdXMgcHJvZHVjdCB0eXBlIGlzIGNyZWF0ZWQuXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCBkZWZpbmluZyB0aGUgcHJvcGVydGllcyBvZiB0aGUgdHlwZSwgd2hvc2UgcHJvcGVydHlcbiAgICogdmFsdWVzIG11c3QgYmUge0BsaW5rIFR5cGVCdWlsZGVyfXMuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBQcm9kdWN0QnVpbGRlcn0gaW5zdGFuY2UuXG4gICAqL1xuICBvYmplY3Q6ICgobmFtZU9yT2JqLCBtYXliZU9iaikgPT4ge1xuICAgIGlmICh0eXBlb2YgbmFtZU9yT2JqID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBpZiAoIW1heWJlT2JqKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJXaGVuIHByb3ZpZGluZyBhIG5hbWUsIHlvdSBtdXN0IGFsc28gcHJvdmlkZSB0aGUgb2JqZWN0LlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3IFByb2R1Y3RCdWlsZGVyKG1heWJlT2JqLCBuYW1lT3JPYmopO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFByb2R1Y3RCdWlsZGVyKG5hbWVPck9iaiwgdm9pZCAwKTtcbiAgfSksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBSb3dgIHtAbGluayBBbGdlYnJhaWNUeXBlfSB0byBiZSB1c2VkIGluIHRhYmxlIGRlZmluaXRpb25zLiBSb3cgdHlwZXMgaW4gU3BhY2V0aW1lREJcbiAgICogYXJlIHNpbWlsYXIgdG8gYFByb2R1Y3RgIHR5cGVzLCBidXQgYXJlIHNwZWNpZmljYWxseSB1c2VkIHRvIGRlZmluZSB0aGUgc2NoZW1hIG9mIGEgdGFibGUgcm93LlxuICAgKiBQcm9wZXJ0aWVzIG9mIHRoZSBvYmplY3QgbXVzdCBhbHNvIGJlIHtAbGluayBUeXBlQnVpbGRlcn0gb3Ige0BsaW5rIENvbHVtbkJ1aWxkZXJ9cy5cbiAgICpcbiAgICogWW91IGNhbiByZXByZXNlbnQgYSBgUm93YCBhcyBlaXRoZXIgYSB7QGxpbmsgUm93T2JqfSBvciBhbiB7QGxpbmsgUm93QnVpbGRlcn0gdHlwZSB3aGVuXG4gICAqIGRlZmluaW5nIGEgdGFibGUgc2NoZW1hLlxuICAgKlxuICAgKiBUaGUge0BsaW5rIFJvd0J1aWxkZXJ9IHR5cGUgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gY3JlYXRlIGEgdHlwZSB3aGljaCBjYW4gYmUgdXNlZCBhbnl3aGVyZVxuICAgKiBhIHtAbGluayBUeXBlQnVpbGRlcn0gaXMgYWNjZXB0ZWQsIHN1Y2ggYXMgaW4gbmVzdGVkIG9iamVjdHMgb3IgYXJyYXlzLCBvciBhcyB0aGUgYXJndW1lbnRcbiAgICogdG8gYSBzY2hlZHVsZWQgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBvYmogVGhlIG9iamVjdCBkZWZpbmluZyB0aGUgcHJvcGVydGllcyBvZiB0aGUgcm93LCB3aG9zZSBwcm9wZXJ0eVxuICAgKiB2YWx1ZXMgbXVzdCBiZSB7QGxpbmsgVHlwZUJ1aWxkZXJ9cyBvciB7QGxpbmsgQ29sdW1uQnVpbGRlcn1zLlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgUm93QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIHJvdzogKChuYW1lT3JPYmosIG1heWJlT2JqKSA9PiB7XG4gICAgY29uc3QgW29iaiwgbmFtZV0gPSB0eXBlb2YgbmFtZU9yT2JqID09PSBcInN0cmluZ1wiID8gW21heWJlT2JqLCBuYW1lT3JPYmpdIDogW25hbWVPck9iaiwgdm9pZCAwXTtcbiAgICByZXR1cm4gbmV3IFJvd0J1aWxkZXIob2JqLCBuYW1lKTtcbiAgfSksXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGBBcnJheWAge0BsaW5rIEFsZ2VicmFpY1R5cGV9IHRvIGJlIHVzZWQgaW4gdGFibGUgZGVmaW5pdGlvbnMuXG4gICAqIFJlcHJlc2VudGVkIGFzIGFuIGFycmF5IGluIFR5cGVTY3JpcHQuXG4gICAqIEBwYXJhbSBlbGVtZW50IFRoZSBlbGVtZW50IHR5cGUgb2YgdGhlIGFycmF5LCB3aGljaCBtdXN0IGJlIGEgYFR5cGVCdWlsZGVyYC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIEFycmF5QnVpbGRlcn0gaW5zdGFuY2VcbiAgICovXG4gIGFycmF5KGUpIHtcbiAgICByZXR1cm4gbmV3IEFycmF5QnVpbGRlcihlKTtcbiAgfSxcbiAgZW51bTogZW51bUltcGwsXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgc3BlY2lhbCBoZWxwZXIgZnVuY3Rpb24gZm9yIGNvbnZlbmllbnRseSBjcmVhdGluZyBgUHJvZHVjdGAgdHlwZSBjb2x1bW5zIHdpdGggbm8gZmllbGRzLlxuICAgKlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgUHJvZHVjdEJ1aWxkZXJ9IGluc3RhbmNlIHdpdGggbm8gZmllbGRzLlxuICAgKi9cbiAgdW5pdCgpIHtcbiAgICByZXR1cm4gbmV3IFVuaXRCdWlsZGVyKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbGF6aWx5LWV2YWx1YXRlZCB7QGxpbmsgVHlwZUJ1aWxkZXJ9LiBUaGlzIGlzIHVzZWZ1bCBmb3IgY3JlYXRpbmdcbiAgICogcmVjdXJzaXZlIHR5cGVzLCBzdWNoIGFzIGEgdHJlZSBvciBsaW5rZWQgbGlzdC5cbiAgICogQHBhcmFtIHRodW5rIEEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEge0BsaW5rIFR5cGVCdWlsZGVyfS5cbiAgICogQHJldHVybnMgQSBwcm94eSB7QGxpbmsgVHlwZUJ1aWxkZXJ9IHRoYXQgZXZhbHVhdGVzIHRoZSB0aHVuayBvbiBmaXJzdCBhY2Nlc3MuXG4gICAqL1xuICBsYXp5KHRodW5rKSB7XG4gICAgbGV0IGNhY2hlZCA9IG51bGw7XG4gICAgY29uc3QgZ2V0ID0gKCkgPT4gY2FjaGVkID8/PSB0aHVuaygpO1xuICAgIGNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHt9LCB7XG4gICAgICBnZXQoX3QsIHByb3AsIHJlY3YpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0KCk7XG4gICAgICAgIGNvbnN0IHZhbCA9IFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcCwgcmVjdik7XG4gICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSBcImZ1bmN0aW9uXCIgPyB2YWwuYmluZCh0YXJnZXQpIDogdmFsO1xuICAgICAgfSxcbiAgICAgIHNldChfdCwgcHJvcCwgdmFsdWUsIHJlY3YpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3Quc2V0KGdldCgpLCBwcm9wLCB2YWx1ZSwgcmVjdik7XG4gICAgICB9LFxuICAgICAgaGFzKF90LCBwcm9wKSB7XG4gICAgICAgIHJldHVybiBwcm9wIGluIGdldCgpO1xuICAgICAgfSxcbiAgICAgIG93bktleXMoKSB7XG4gICAgICAgIHJldHVybiBSZWZsZWN0Lm93bktleXMoZ2V0KCkpO1xuICAgICAgfSxcbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihfdCwgcHJvcCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihnZXQoKSwgcHJvcCk7XG4gICAgICB9LFxuICAgICAgZ2V0UHJvdG90eXBlT2YoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoZ2V0KCkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBwcm94eTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBzcGVjaWFsIGhlbHBlciBmdW5jdGlvbiBmb3IgY29udmVuaWVudGx5IGNyZWF0aW5nIHtAbGluayBTY2hlZHVsZUF0fSB0eXBlIGNvbHVtbnMuXG4gICAqIEByZXR1cm5zIEEgbmV3IENvbHVtbkJ1aWxkZXIgaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIFNjaGVkdWxlQXR9IHR5cGUuXG4gICAqL1xuICBzY2hlZHVsZUF0OiAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBTY2hlZHVsZUF0QnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIE9wdGlvbn0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gZW51bSB3aXRoIGEgYHNvbWVgIGFuZCBgbm9uZWAgdmFyaWFudC5cbiAgICogQHBhcmFtIHZhbHVlIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBjb250YWluZWQgaW4gdGhlIGBzb21lYCB2YXJpYW50IG9mIHRoZSBgT3B0aW9uYC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIE9wdGlvbkJ1aWxkZXJ9IGluc3RhbmNlIHdpdGggdGhlIHtAbGluayBPcHRpb259IHR5cGUuXG4gICAqL1xuICBvcHRpb24odmFsdWUpIHtcbiAgICByZXR1cm4gbmV3IE9wdGlvbkJ1aWxkZXIodmFsdWUpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIFJlc3VsdH0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gZW51bSB3aXRoIGFuIGBva2AgYW5kIGBlcnJgIHZhcmlhbnQuXG4gICAqIEBwYXJhbSBvayBUaGUgdHlwZSBvZiB0aGUgdmFsdWUgY29udGFpbmVkIGluIHRoZSBgb2tgIHZhcmlhbnQgb2YgdGhlIGBSZXN1bHRgLlxuICAgKiBAcGFyYW0gZXJyIFRoZSB0eXBlIG9mIHRoZSB2YWx1ZSBjb250YWluZWQgaW4gdGhlIGBlcnJgIHZhcmlhbnQgb2YgdGhlIGBSZXN1bHRgLlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgUmVzdWx0QnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIFJlc3VsdH0gdHlwZS5cbiAgICovXG4gIHJlc3VsdChvaywgZXJyKSB7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHRCdWlsZGVyKG9rLCBlcnIpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIElkZW50aXR5fSB0eXBlLlxuICAgKiBZb3UgY2FuIGNyZWF0ZSBhIGNvbHVtbiBvZiB0aGUgc2FtZSB0eXBlIGJ5IGNvbnN0cnVjdGluZyBhbiBgb2JqZWN0YCB3aXRoIGEgc2luZ2xlIGBfX2lkZW50aXR5X19gIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUeXBlQnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIElkZW50aXR5fSB0eXBlLlxuICAgKi9cbiAgaWRlbnRpdHk6ICgpID0+IHtcbiAgICByZXR1cm4gbmV3IElkZW50aXR5QnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIENvbm5lY3Rpb25JZH0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gYG9iamVjdGAgd2l0aCBhIHNpbmdsZSBgX19jb25uZWN0aW9uX2lkX19gIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUeXBlQnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIENvbm5lY3Rpb25JZH0gdHlwZS5cbiAgICovXG4gIGNvbm5lY3Rpb25JZDogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgQ29ubmVjdGlvbklkQnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIFRpbWVzdGFtcH0gdHlwZS5cbiAgICogWW91IGNhbiBjcmVhdGUgYSBjb2x1bW4gb2YgdGhlIHNhbWUgdHlwZSBieSBjb25zdHJ1Y3RpbmcgYW4gYG9iamVjdGAgd2l0aCBhIHNpbmdsZSBgX190aW1lc3RhbXBfbWljcm9zX3NpbmNlX3VuaXhfZXBvY2hfX2AgZWxlbWVudC5cbiAgICogQHJldHVybnMgQSBuZXcge0BsaW5rIFR5cGVCdWlsZGVyfSBpbnN0YW5jZSB3aXRoIHRoZSB7QGxpbmsgVGltZXN0YW1wfSB0eXBlLlxuICAgKi9cbiAgdGltZXN0YW1wOiAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBUaW1lc3RhbXBCdWlsZGVyKCk7XG4gIH0sXG4gIC8qKlxuICAgKiBUaGlzIGlzIGEgY29udmVuaWVuY2UgbWV0aG9kIGZvciBjcmVhdGluZyBhIGNvbHVtbiB3aXRoIHRoZSB7QGxpbmsgVGltZUR1cmF0aW9ufSB0eXBlLlxuICAgKiBZb3UgY2FuIGNyZWF0ZSBhIGNvbHVtbiBvZiB0aGUgc2FtZSB0eXBlIGJ5IGNvbnN0cnVjdGluZyBhbiBgb2JqZWN0YCB3aXRoIGEgc2luZ2xlIGBfX3RpbWVfZHVyYXRpb25fbWljcm9zX19gIGVsZW1lbnQuXG4gICAqIEByZXR1cm5zIEEgbmV3IHtAbGluayBUeXBlQnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUge0BsaW5rIFRpbWVEdXJhdGlvbn0gdHlwZS5cbiAgICovXG4gIHRpbWVEdXJhdGlvbjogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgVGltZUR1cmF0aW9uQnVpbGRlcigpO1xuICB9LFxuICAvKipcbiAgICogVGhpcyBpcyBhIGNvbnZlbmllbmNlIG1ldGhvZCBmb3IgY3JlYXRpbmcgYSBjb2x1bW4gd2l0aCB0aGUge0BsaW5rIFV1aWR9IHR5cGUuXG4gICAqIFlvdSBjYW4gY3JlYXRlIGEgY29sdW1uIG9mIHRoZSBzYW1lIHR5cGUgYnkgY29uc3RydWN0aW5nIGFuIGBvYmplY3RgIHdpdGggYSBzaW5nbGUgYF9fdXVpZF9fYCBlbGVtZW50LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgVHlwZUJ1aWxkZXJ9IGluc3RhbmNlIHdpdGggdGhlIHtAbGluayBVdWlkfSB0eXBlLlxuICAgKi9cbiAgdXVpZDogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgVXVpZEJ1aWxkZXIoKTtcbiAgfSxcbiAgLyoqXG4gICAqIFRoaXMgaXMgYSBjb252ZW5pZW5jZSBtZXRob2QgZm9yIGNyZWF0aW5nIGEgY29sdW1uIHdpdGggdGhlIGBCeXRlQXJyYXlgIHR5cGUuXG4gICAqIFlvdSBjYW4gY3JlYXRlIGEgY29sdW1uIG9mIHRoZSBzYW1lIHR5cGUgYnkgY29uc3RydWN0aW5nIGFuIGBhcnJheWAgb2YgYHU4YC5cbiAgICogVGhlIFR5cGVTY3JpcHQgcmVwcmVzZW50YXRpb24gaXMge0BsaW5rIFVpbnQ4QXJyYXl9LlxuICAgKiBAcmV0dXJucyBBIG5ldyB7QGxpbmsgQnl0ZUFycmF5QnVpbGRlcn0gaW5zdGFuY2Ugd2l0aCB0aGUgYEJ5dGVBcnJheWAgdHlwZS5cbiAgICovXG4gIGJ5dGVBcnJheTogKCkgPT4ge1xuICAgIHJldHVybiBuZXcgQnl0ZUFycmF5QnVpbGRlcigpO1xuICB9XG59O1xuXG4vLyBzcmMvbGliL2F1dG9nZW4vdHlwZXMudHNcbnZhciBBbGdlYnJhaWNUeXBlMiA9IHQuZW51bShcIkFsZ2VicmFpY1R5cGVcIiwge1xuICBSZWY6IHQudTMyKCksXG4gIGdldCBTdW0oKSB7XG4gICAgcmV0dXJuIFN1bVR5cGUyO1xuICB9LFxuICBnZXQgUHJvZHVjdCgpIHtcbiAgICByZXR1cm4gUHJvZHVjdFR5cGUyO1xuICB9LFxuICBnZXQgQXJyYXkoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9LFxuICBTdHJpbmc6IHQudW5pdCgpLFxuICBCb29sOiB0LnVuaXQoKSxcbiAgSTg6IHQudW5pdCgpLFxuICBVODogdC51bml0KCksXG4gIEkxNjogdC51bml0KCksXG4gIFUxNjogdC51bml0KCksXG4gIEkzMjogdC51bml0KCksXG4gIFUzMjogdC51bml0KCksXG4gIEk2NDogdC51bml0KCksXG4gIFU2NDogdC51bml0KCksXG4gIEkxMjg6IHQudW5pdCgpLFxuICBVMTI4OiB0LnVuaXQoKSxcbiAgSTI1NjogdC51bml0KCksXG4gIFUyNTY6IHQudW5pdCgpLFxuICBGMzI6IHQudW5pdCgpLFxuICBGNjQ6IHQudW5pdCgpXG59KTtcbnZhciBDYXNlQ29udmVyc2lvblBvbGljeSA9IHQuZW51bShcIkNhc2VDb252ZXJzaW9uUG9saWN5XCIsIHtcbiAgTm9uZTogdC51bml0KCksXG4gIFNuYWtlQ2FzZTogdC51bml0KClcbn0pO1xudmFyIEV4cGxpY2l0TmFtZUVudHJ5ID0gdC5lbnVtKFwiRXhwbGljaXROYW1lRW50cnlcIiwge1xuICBnZXQgVGFibGUoKSB7XG4gICAgcmV0dXJuIE5hbWVNYXBwaW5nO1xuICB9LFxuICBnZXQgRnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE5hbWVNYXBwaW5nO1xuICB9LFxuICBnZXQgSW5kZXgoKSB7XG4gICAgcmV0dXJuIE5hbWVNYXBwaW5nO1xuICB9XG59KTtcbnZhciBFeHBsaWNpdE5hbWVzID0gdC5vYmplY3QoXCJFeHBsaWNpdE5hbWVzXCIsIHtcbiAgZ2V0IGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoRXhwbGljaXROYW1lRW50cnkpO1xuICB9XG59KTtcbnZhciBGdW5jdGlvblZpc2liaWxpdHkgPSB0LmVudW0oXCJGdW5jdGlvblZpc2liaWxpdHlcIiwge1xuICBQcml2YXRlOiB0LnVuaXQoKSxcbiAgQ2xpZW50Q2FsbGFibGU6IHQudW5pdCgpXG59KTtcbnZhciBIdHRwSGVhZGVyUGFpciA9IHQub2JqZWN0KFwiSHR0cEhlYWRlclBhaXJcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICB2YWx1ZTogdC5ieXRlQXJyYXkoKVxufSk7XG52YXIgSHR0cEhlYWRlcnMgPSB0Lm9iamVjdChcIkh0dHBIZWFkZXJzXCIsIHtcbiAgZ2V0IGVudHJpZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoSHR0cEhlYWRlclBhaXIpO1xuICB9XG59KTtcbnZhciBIdHRwTWV0aG9kID0gdC5lbnVtKFwiSHR0cE1ldGhvZFwiLCB7XG4gIEdldDogdC51bml0KCksXG4gIEhlYWQ6IHQudW5pdCgpLFxuICBQb3N0OiB0LnVuaXQoKSxcbiAgUHV0OiB0LnVuaXQoKSxcbiAgRGVsZXRlOiB0LnVuaXQoKSxcbiAgQ29ubmVjdDogdC51bml0KCksXG4gIE9wdGlvbnM6IHQudW5pdCgpLFxuICBUcmFjZTogdC51bml0KCksXG4gIFBhdGNoOiB0LnVuaXQoKSxcbiAgRXh0ZW5zaW9uOiB0LnN0cmluZygpXG59KTtcbnZhciBIdHRwUmVxdWVzdCA9IHQub2JqZWN0KFwiSHR0cFJlcXVlc3RcIiwge1xuICBnZXQgbWV0aG9kKCkge1xuICAgIHJldHVybiBIdHRwTWV0aG9kO1xuICB9LFxuICBnZXQgaGVhZGVycygpIHtcbiAgICByZXR1cm4gSHR0cEhlYWRlcnM7XG4gIH0sXG4gIHRpbWVvdXQ6IHQub3B0aW9uKHQudGltZUR1cmF0aW9uKCkpLFxuICB1cmk6IHQuc3RyaW5nKCksXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBIdHRwVmVyc2lvbjtcbiAgfVxufSk7XG52YXIgSHR0cFJlc3BvbnNlID0gdC5vYmplY3QoXCJIdHRwUmVzcG9uc2VcIiwge1xuICBnZXQgaGVhZGVycygpIHtcbiAgICByZXR1cm4gSHR0cEhlYWRlcnM7XG4gIH0sXG4gIGdldCB2ZXJzaW9uKCkge1xuICAgIHJldHVybiBIdHRwVmVyc2lvbjtcbiAgfSxcbiAgY29kZTogdC51MTYoKVxufSk7XG52YXIgSHR0cFZlcnNpb24gPSB0LmVudW0oXCJIdHRwVmVyc2lvblwiLCB7XG4gIEh0dHAwOTogdC51bml0KCksXG4gIEh0dHAxMDogdC51bml0KCksXG4gIEh0dHAxMTogdC51bml0KCksXG4gIEh0dHAyOiB0LnVuaXQoKSxcbiAgSHR0cDM6IHQudW5pdCgpXG59KTtcbnZhciBJbmRleFR5cGUgPSB0LmVudW0oXCJJbmRleFR5cGVcIiwge1xuICBCVHJlZTogdC51bml0KCksXG4gIEhhc2g6IHQudW5pdCgpXG59KTtcbnZhciBMaWZlY3ljbGUgPSB0LmVudW0oXCJMaWZlY3ljbGVcIiwge1xuICBJbml0OiB0LnVuaXQoKSxcbiAgT25Db25uZWN0OiB0LnVuaXQoKSxcbiAgT25EaXNjb25uZWN0OiB0LnVuaXQoKVxufSk7XG52YXIgTWlzY01vZHVsZUV4cG9ydCA9IHQuZW51bShcIk1pc2NNb2R1bGVFeHBvcnRcIiwge1xuICBnZXQgVHlwZUFsaWFzKCkge1xuICAgIHJldHVybiBUeXBlQWxpYXM7XG4gIH1cbn0pO1xudmFyIE5hbWVNYXBwaW5nID0gdC5vYmplY3QoXCJOYW1lTWFwcGluZ1wiLCB7XG4gIHNvdXJjZU5hbWU6IHQuc3RyaW5nKCksXG4gIGNhbm9uaWNhbE5hbWU6IHQuc3RyaW5nKClcbn0pO1xudmFyIFByb2R1Y3RUeXBlMiA9IHQub2JqZWN0KFwiUHJvZHVjdFR5cGVcIiwge1xuICBnZXQgZWxlbWVudHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUHJvZHVjdFR5cGVFbGVtZW50KTtcbiAgfVxufSk7XG52YXIgUHJvZHVjdFR5cGVFbGVtZW50ID0gdC5vYmplY3QoXCJQcm9kdWN0VHlwZUVsZW1lbnRcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgZ2V0IGFsZ2VicmFpY1R5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9XG59KTtcbnZhciBSYXdDb2x1bW5EZWZWOCA9IHQub2JqZWN0KFwiUmF3Q29sdW1uRGVmVjhcIiwge1xuICBjb2xOYW1lOiB0LnN0cmluZygpLFxuICBnZXQgY29sVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZTI7XG4gIH1cbn0pO1xudmFyIFJhd0NvbHVtbkRlZmF1bHRWYWx1ZVYxMCA9IHQub2JqZWN0KFwiUmF3Q29sdW1uRGVmYXVsdFZhbHVlVjEwXCIsIHtcbiAgY29sSWQ6IHQudTE2KCksXG4gIHZhbHVlOiB0LmJ5dGVBcnJheSgpXG59KTtcbnZhciBSYXdDb2x1bW5EZWZhdWx0VmFsdWVWOSA9IHQub2JqZWN0KFwiUmF3Q29sdW1uRGVmYXVsdFZhbHVlVjlcIiwge1xuICB0YWJsZTogdC5zdHJpbmcoKSxcbiAgY29sSWQ6IHQudTE2KCksXG4gIHZhbHVlOiB0LmJ5dGVBcnJheSgpXG59KTtcbnZhciBSYXdDb25zdHJhaW50RGF0YVY5ID0gdC5lbnVtKFwiUmF3Q29uc3RyYWludERhdGFWOVwiLCB7XG4gIGdldCBVbmlxdWUoKSB7XG4gICAgcmV0dXJuIFJhd1VuaXF1ZUNvbnN0cmFpbnREYXRhVjk7XG4gIH1cbn0pO1xudmFyIFJhd0NvbnN0cmFpbnREZWZWMTAgPSB0Lm9iamVjdChcIlJhd0NvbnN0cmFpbnREZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgZ2V0IGRhdGEoKSB7XG4gICAgcmV0dXJuIFJhd0NvbnN0cmFpbnREYXRhVjk7XG4gIH1cbn0pO1xudmFyIFJhd0NvbnN0cmFpbnREZWZWOCA9IHQub2JqZWN0KFwiUmF3Q29uc3RyYWludERlZlY4XCIsIHtcbiAgY29uc3RyYWludE5hbWU6IHQuc3RyaW5nKCksXG4gIGNvbnN0cmFpbnRzOiB0LnU4KCksXG4gIGNvbHVtbnM6IHQuYXJyYXkodC51MTYoKSlcbn0pO1xudmFyIFJhd0NvbnN0cmFpbnREZWZWOSA9IHQub2JqZWN0KFwiUmF3Q29uc3RyYWludERlZlY5XCIsIHtcbiAgbmFtZTogdC5vcHRpb24odC5zdHJpbmcoKSksXG4gIGdldCBkYXRhKCkge1xuICAgIHJldHVybiBSYXdDb25zdHJhaW50RGF0YVY5O1xuICB9XG59KTtcbnZhciBSYXdJbmRleEFsZ29yaXRobSA9IHQuZW51bShcIlJhd0luZGV4QWxnb3JpdGhtXCIsIHtcbiAgQlRyZWU6IHQuYXJyYXkodC51MTYoKSksXG4gIEhhc2g6IHQuYXJyYXkodC51MTYoKSksXG4gIERpcmVjdDogdC51MTYoKVxufSk7XG52YXIgUmF3SW5kZXhEZWZWMTAgPSB0Lm9iamVjdChcIlJhd0luZGV4RGVmVjEwXCIsIHtcbiAgc291cmNlTmFtZTogdC5vcHRpb24odC5zdHJpbmcoKSksXG4gIGFjY2Vzc29yTmFtZTogdC5vcHRpb24odC5zdHJpbmcoKSksXG4gIGdldCBhbGdvcml0aG0oKSB7XG4gICAgcmV0dXJuIFJhd0luZGV4QWxnb3JpdGhtO1xuICB9XG59KTtcbnZhciBSYXdJbmRleERlZlY4ID0gdC5vYmplY3QoXCJSYXdJbmRleERlZlY4XCIsIHtcbiAgaW5kZXhOYW1lOiB0LnN0cmluZygpLFxuICBpc1VuaXF1ZTogdC5ib29sKCksXG4gIGdldCBpbmRleFR5cGUoKSB7XG4gICAgcmV0dXJuIEluZGV4VHlwZTtcbiAgfSxcbiAgY29sdW1uczogdC5hcnJheSh0LnUxNigpKVxufSk7XG52YXIgUmF3SW5kZXhEZWZWOSA9IHQub2JqZWN0KFwiUmF3SW5kZXhEZWZWOVwiLCB7XG4gIG5hbWU6IHQub3B0aW9uKHQuc3RyaW5nKCkpLFxuICBhY2Nlc3Nvck5hbWU6IHQub3B0aW9uKHQuc3RyaW5nKCkpLFxuICBnZXQgYWxnb3JpdGhtKCkge1xuICAgIHJldHVybiBSYXdJbmRleEFsZ29yaXRobTtcbiAgfVxufSk7XG52YXIgUmF3TGlmZUN5Y2xlUmVkdWNlckRlZlYxMCA9IHQub2JqZWN0KFxuICBcIlJhd0xpZmVDeWNsZVJlZHVjZXJEZWZWMTBcIixcbiAge1xuICAgIGdldCBsaWZlY3ljbGVTcGVjKCkge1xuICAgICAgcmV0dXJuIExpZmVjeWNsZTtcbiAgICB9LFxuICAgIGZ1bmN0aW9uTmFtZTogdC5zdHJpbmcoKVxuICB9XG4pO1xudmFyIFJhd01pc2NNb2R1bGVFeHBvcnRWOSA9IHQuZW51bShcIlJhd01pc2NNb2R1bGVFeHBvcnRWOVwiLCB7XG4gIGdldCBDb2x1bW5EZWZhdWx0VmFsdWUoKSB7XG4gICAgcmV0dXJuIFJhd0NvbHVtbkRlZmF1bHRWYWx1ZVY5O1xuICB9LFxuICBnZXQgUHJvY2VkdXJlKCkge1xuICAgIHJldHVybiBSYXdQcm9jZWR1cmVEZWZWOTtcbiAgfSxcbiAgZ2V0IFZpZXcoKSB7XG4gICAgcmV0dXJuIFJhd1ZpZXdEZWZWOTtcbiAgfVxufSk7XG52YXIgUmF3TW9kdWxlRGVmID0gdC5lbnVtKFwiUmF3TW9kdWxlRGVmXCIsIHtcbiAgZ2V0IFY4QmFja0NvbXBhdCgpIHtcbiAgICByZXR1cm4gUmF3TW9kdWxlRGVmVjg7XG4gIH0sXG4gIGdldCBWOSgpIHtcbiAgICByZXR1cm4gUmF3TW9kdWxlRGVmVjk7XG4gIH0sXG4gIGdldCBWMTAoKSB7XG4gICAgcmV0dXJuIFJhd01vZHVsZURlZlYxMDtcbiAgfVxufSk7XG52YXIgUmF3TW9kdWxlRGVmVjEwID0gdC5vYmplY3QoXCJSYXdNb2R1bGVEZWZWMTBcIiwge1xuICBnZXQgc2VjdGlvbnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3TW9kdWxlRGVmVjEwU2VjdGlvbik7XG4gIH1cbn0pO1xudmFyIFJhd01vZHVsZURlZlYxMFNlY3Rpb24gPSB0LmVudW0oXCJSYXdNb2R1bGVEZWZWMTBTZWN0aW9uXCIsIHtcbiAgZ2V0IFR5cGVzcGFjZSgpIHtcbiAgICByZXR1cm4gVHlwZXNwYWNlO1xuICB9LFxuICBnZXQgVHlwZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3VHlwZURlZlYxMCk7XG4gIH0sXG4gIGdldCBUYWJsZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3VGFibGVEZWZWMTApO1xuICB9LFxuICBnZXQgUmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3UmVkdWNlckRlZlYxMCk7XG4gIH0sXG4gIGdldCBQcm9jZWR1cmVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd1Byb2NlZHVyZURlZlYxMCk7XG4gIH0sXG4gIGdldCBWaWV3cygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdWaWV3RGVmVjEwKTtcbiAgfSxcbiAgZ2V0IFNjaGVkdWxlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdTY2hlZHVsZURlZlYxMCk7XG4gIH0sXG4gIGdldCBMaWZlQ3ljbGVSZWR1Y2VycygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdMaWZlQ3ljbGVSZWR1Y2VyRGVmVjEwKTtcbiAgfSxcbiAgZ2V0IFJvd0xldmVsU2VjdXJpdHkoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3Um93TGV2ZWxTZWN1cml0eURlZlY5KTtcbiAgfSxcbiAgZ2V0IENhc2VDb252ZXJzaW9uUG9saWN5KCkge1xuICAgIHJldHVybiBDYXNlQ29udmVyc2lvblBvbGljeTtcbiAgfSxcbiAgZ2V0IEV4cGxpY2l0TmFtZXMoKSB7XG4gICAgcmV0dXJuIEV4cGxpY2l0TmFtZXM7XG4gIH1cbn0pO1xudmFyIFJhd01vZHVsZURlZlY4ID0gdC5vYmplY3QoXCJSYXdNb2R1bGVEZWZWOFwiLCB7XG4gIGdldCB0eXBlc3BhY2UoKSB7XG4gICAgcmV0dXJuIFR5cGVzcGFjZTtcbiAgfSxcbiAgZ2V0IHRhYmxlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShUYWJsZURlc2MpO1xuICB9LFxuICBnZXQgcmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmVkdWNlckRlZik7XG4gIH0sXG4gIGdldCBtaXNjRXhwb3J0cygpIHtcbiAgICByZXR1cm4gdC5hcnJheShNaXNjTW9kdWxlRXhwb3J0KTtcbiAgfVxufSk7XG52YXIgUmF3TW9kdWxlRGVmVjkgPSB0Lm9iamVjdChcIlJhd01vZHVsZURlZlY5XCIsIHtcbiAgZ2V0IHR5cGVzcGFjZSgpIHtcbiAgICByZXR1cm4gVHlwZXNwYWNlO1xuICB9LFxuICBnZXQgdGFibGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd1RhYmxlRGVmVjkpO1xuICB9LFxuICBnZXQgcmVkdWNlcnMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3UmVkdWNlckRlZlY5KTtcbiAgfSxcbiAgZ2V0IHR5cGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd1R5cGVEZWZWOSk7XG4gIH0sXG4gIGdldCBtaXNjRXhwb3J0cygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdNaXNjTW9kdWxlRXhwb3J0VjkpO1xuICB9LFxuICBnZXQgcm93TGV2ZWxTZWN1cml0eSgpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdSb3dMZXZlbFNlY3VyaXR5RGVmVjkpO1xuICB9XG59KTtcbnZhciBSYXdQcm9jZWR1cmVEZWZWMTAgPSB0Lm9iamVjdChcIlJhd1Byb2NlZHVyZURlZlYxMFwiLCB7XG4gIHNvdXJjZU5hbWU6IHQuc3RyaW5nKCksXG4gIGdldCBwYXJhbXMoKSB7XG4gICAgcmV0dXJuIFByb2R1Y3RUeXBlMjtcbiAgfSxcbiAgZ2V0IHJldHVyblR5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9LFxuICBnZXQgdmlzaWJpbGl0eSgpIHtcbiAgICByZXR1cm4gRnVuY3Rpb25WaXNpYmlsaXR5O1xuICB9XG59KTtcbnZhciBSYXdQcm9jZWR1cmVEZWZWOSA9IHQub2JqZWN0KFwiUmF3UHJvY2VkdXJlRGVmVjlcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICBnZXQgcGFyYW1zKCkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZTI7XG4gIH0sXG4gIGdldCByZXR1cm5UeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlMjtcbiAgfVxufSk7XG52YXIgUmF3UmVkdWNlckRlZlYxMCA9IHQub2JqZWN0KFwiUmF3UmVkdWNlckRlZlYxMFwiLCB7XG4gIHNvdXJjZU5hbWU6IHQuc3RyaW5nKCksXG4gIGdldCBwYXJhbXMoKSB7XG4gICAgcmV0dXJuIFByb2R1Y3RUeXBlMjtcbiAgfSxcbiAgZ2V0IHZpc2liaWxpdHkoKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uVmlzaWJpbGl0eTtcbiAgfSxcbiAgZ2V0IG9rUmV0dXJuVHlwZSgpIHtcbiAgICByZXR1cm4gQWxnZWJyYWljVHlwZTI7XG4gIH0sXG4gIGdldCBlcnJSZXR1cm5UeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlMjtcbiAgfVxufSk7XG52YXIgUmF3UmVkdWNlckRlZlY5ID0gdC5vYmplY3QoXCJSYXdSZWR1Y2VyRGVmVjlcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICBnZXQgcGFyYW1zKCkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZTI7XG4gIH0sXG4gIGdldCBsaWZlY3ljbGUoKSB7XG4gICAgcmV0dXJuIHQub3B0aW9uKExpZmVjeWNsZSk7XG4gIH1cbn0pO1xudmFyIFJhd1Jvd0xldmVsU2VjdXJpdHlEZWZWOSA9IHQub2JqZWN0KFwiUmF3Um93TGV2ZWxTZWN1cml0eURlZlY5XCIsIHtcbiAgc3FsOiB0LnN0cmluZygpXG59KTtcbnZhciBSYXdTY2hlZHVsZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3U2NoZWR1bGVEZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgdGFibGVOYW1lOiB0LnN0cmluZygpLFxuICBzY2hlZHVsZUF0Q29sOiB0LnUxNigpLFxuICBmdW5jdGlvbk5hbWU6IHQuc3RyaW5nKClcbn0pO1xudmFyIFJhd1NjaGVkdWxlRGVmVjkgPSB0Lm9iamVjdChcIlJhd1NjaGVkdWxlRGVmVjlcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgcmVkdWNlck5hbWU6IHQuc3RyaW5nKCksXG4gIHNjaGVkdWxlZEF0Q29sdW1uOiB0LnUxNigpXG59KTtcbnZhciBSYXdTY29wZWRUeXBlTmFtZVYxMCA9IHQub2JqZWN0KFwiUmF3U2NvcGVkVHlwZU5hbWVWMTBcIiwge1xuICBzY29wZTogdC5hcnJheSh0LnN0cmluZygpKSxcbiAgc291cmNlTmFtZTogdC5zdHJpbmcoKVxufSk7XG52YXIgUmF3U2NvcGVkVHlwZU5hbWVWOSA9IHQub2JqZWN0KFwiUmF3U2NvcGVkVHlwZU5hbWVWOVwiLCB7XG4gIHNjb3BlOiB0LmFycmF5KHQuc3RyaW5nKCkpLFxuICBuYW1lOiB0LnN0cmluZygpXG59KTtcbnZhciBSYXdTZXF1ZW5jZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3U2VxdWVuY2VEZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgY29sdW1uOiB0LnUxNigpLFxuICBzdGFydDogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtaW5WYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtYXhWYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBpbmNyZW1lbnQ6IHQuaTEyOCgpXG59KTtcbnZhciBSYXdTZXF1ZW5jZURlZlY4ID0gdC5vYmplY3QoXCJSYXdTZXF1ZW5jZURlZlY4XCIsIHtcbiAgc2VxdWVuY2VOYW1lOiB0LnN0cmluZygpLFxuICBjb2xQb3M6IHQudTE2KCksXG4gIGluY3JlbWVudDogdC5pMTI4KCksXG4gIHN0YXJ0OiB0Lm9wdGlvbih0LmkxMjgoKSksXG4gIG1pblZhbHVlOiB0Lm9wdGlvbih0LmkxMjgoKSksXG4gIG1heFZhbHVlOiB0Lm9wdGlvbih0LmkxMjgoKSksXG4gIGFsbG9jYXRlZDogdC5pMTI4KClcbn0pO1xudmFyIFJhd1NlcXVlbmNlRGVmVjkgPSB0Lm9iamVjdChcIlJhd1NlcXVlbmNlRGVmVjlcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgY29sdW1uOiB0LnUxNigpLFxuICBzdGFydDogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtaW5WYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBtYXhWYWx1ZTogdC5vcHRpb24odC5pMTI4KCkpLFxuICBpbmNyZW1lbnQ6IHQuaTEyOCgpXG59KTtcbnZhciBSYXdUYWJsZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3VGFibGVEZWZWMTBcIiwge1xuICBzb3VyY2VOYW1lOiB0LnN0cmluZygpLFxuICBwcm9kdWN0VHlwZVJlZjogdC51MzIoKSxcbiAgcHJpbWFyeUtleTogdC5hcnJheSh0LnUxNigpKSxcbiAgZ2V0IGluZGV4ZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3SW5kZXhEZWZWMTApO1xuICB9LFxuICBnZXQgY29uc3RyYWludHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3Q29uc3RyYWludERlZlYxMCk7XG4gIH0sXG4gIGdldCBzZXF1ZW5jZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3U2VxdWVuY2VEZWZWMTApO1xuICB9LFxuICBnZXQgdGFibGVUeXBlKCkge1xuICAgIHJldHVybiBUYWJsZVR5cGU7XG4gIH0sXG4gIGdldCB0YWJsZUFjY2VzcygpIHtcbiAgICByZXR1cm4gVGFibGVBY2Nlc3M7XG4gIH0sXG4gIGdldCBkZWZhdWx0VmFsdWVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd0NvbHVtbkRlZmF1bHRWYWx1ZVYxMCk7XG4gIH0sXG4gIGlzRXZlbnQ6IHQuYm9vbCgpXG59KTtcbnZhciBSYXdUYWJsZURlZlY4ID0gdC5vYmplY3QoXCJSYXdUYWJsZURlZlY4XCIsIHtcbiAgdGFibGVOYW1lOiB0LnN0cmluZygpLFxuICBnZXQgY29sdW1ucygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdDb2x1bW5EZWZWOCk7XG4gIH0sXG4gIGdldCBpbmRleGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd0luZGV4RGVmVjgpO1xuICB9LFxuICBnZXQgY29uc3RyYWludHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3Q29uc3RyYWludERlZlY4KTtcbiAgfSxcbiAgZ2V0IHNlcXVlbmNlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdTZXF1ZW5jZURlZlY4KTtcbiAgfSxcbiAgdGFibGVUeXBlOiB0LnN0cmluZygpLFxuICB0YWJsZUFjY2VzczogdC5zdHJpbmcoKSxcbiAgc2NoZWR1bGVkOiB0Lm9wdGlvbih0LnN0cmluZygpKVxufSk7XG52YXIgUmF3VGFibGVEZWZWOSA9IHQub2JqZWN0KFwiUmF3VGFibGVEZWZWOVwiLCB7XG4gIG5hbWU6IHQuc3RyaW5nKCksXG4gIHByb2R1Y3RUeXBlUmVmOiB0LnUzMigpLFxuICBwcmltYXJ5S2V5OiB0LmFycmF5KHQudTE2KCkpLFxuICBnZXQgaW5kZXhlcygpIHtcbiAgICByZXR1cm4gdC5hcnJheShSYXdJbmRleERlZlY5KTtcbiAgfSxcbiAgZ2V0IGNvbnN0cmFpbnRzKCkge1xuICAgIHJldHVybiB0LmFycmF5KFJhd0NvbnN0cmFpbnREZWZWOSk7XG4gIH0sXG4gIGdldCBzZXF1ZW5jZXMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUmF3U2VxdWVuY2VEZWZWOSk7XG4gIH0sXG4gIGdldCBzY2hlZHVsZSgpIHtcbiAgICByZXR1cm4gdC5vcHRpb24oUmF3U2NoZWR1bGVEZWZWOSk7XG4gIH0sXG4gIGdldCB0YWJsZVR5cGUoKSB7XG4gICAgcmV0dXJuIFRhYmxlVHlwZTtcbiAgfSxcbiAgZ2V0IHRhYmxlQWNjZXNzKCkge1xuICAgIHJldHVybiBUYWJsZUFjY2VzcztcbiAgfVxufSk7XG52YXIgUmF3VHlwZURlZlYxMCA9IHQub2JqZWN0KFwiUmF3VHlwZURlZlYxMFwiLCB7XG4gIGdldCBzb3VyY2VOYW1lKCkge1xuICAgIHJldHVybiBSYXdTY29wZWRUeXBlTmFtZVYxMDtcbiAgfSxcbiAgdHk6IHQudTMyKCksXG4gIGN1c3RvbU9yZGVyaW5nOiB0LmJvb2woKVxufSk7XG52YXIgUmF3VHlwZURlZlY5ID0gdC5vYmplY3QoXCJSYXdUeXBlRGVmVjlcIiwge1xuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gUmF3U2NvcGVkVHlwZU5hbWVWOTtcbiAgfSxcbiAgdHk6IHQudTMyKCksXG4gIGN1c3RvbU9yZGVyaW5nOiB0LmJvb2woKVxufSk7XG52YXIgUmF3VW5pcXVlQ29uc3RyYWludERhdGFWOSA9IHQub2JqZWN0KFxuICBcIlJhd1VuaXF1ZUNvbnN0cmFpbnREYXRhVjlcIixcbiAge1xuICAgIGNvbHVtbnM6IHQuYXJyYXkodC51MTYoKSlcbiAgfVxuKTtcbnZhciBSYXdWaWV3RGVmVjEwID0gdC5vYmplY3QoXCJSYXdWaWV3RGVmVjEwXCIsIHtcbiAgc291cmNlTmFtZTogdC5zdHJpbmcoKSxcbiAgaW5kZXg6IHQudTMyKCksXG4gIGlzUHVibGljOiB0LmJvb2woKSxcbiAgaXNBbm9ueW1vdXM6IHQuYm9vbCgpLFxuICBnZXQgcGFyYW1zKCkge1xuICAgIHJldHVybiBQcm9kdWN0VHlwZTI7XG4gIH0sXG4gIGdldCByZXR1cm5UeXBlKCkge1xuICAgIHJldHVybiBBbGdlYnJhaWNUeXBlMjtcbiAgfVxufSk7XG52YXIgUmF3Vmlld0RlZlY5ID0gdC5vYmplY3QoXCJSYXdWaWV3RGVmVjlcIiwge1xuICBuYW1lOiB0LnN0cmluZygpLFxuICBpbmRleDogdC51MzIoKSxcbiAgaXNQdWJsaWM6IHQuYm9vbCgpLFxuICBpc0Fub255bW91czogdC5ib29sKCksXG4gIGdldCBwYXJhbXMoKSB7XG4gICAgcmV0dXJuIFByb2R1Y3RUeXBlMjtcbiAgfSxcbiAgZ2V0IHJldHVyblR5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9XG59KTtcbnZhciBSZWR1Y2VyRGVmID0gdC5vYmplY3QoXCJSZWR1Y2VyRGVmXCIsIHtcbiAgbmFtZTogdC5zdHJpbmcoKSxcbiAgZ2V0IGFyZ3MoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoUHJvZHVjdFR5cGVFbGVtZW50KTtcbiAgfVxufSk7XG52YXIgU3VtVHlwZTIgPSB0Lm9iamVjdChcIlN1bVR5cGVcIiwge1xuICBnZXQgdmFyaWFudHMoKSB7XG4gICAgcmV0dXJuIHQuYXJyYXkoU3VtVHlwZVZhcmlhbnQpO1xuICB9XG59KTtcbnZhciBTdW1UeXBlVmFyaWFudCA9IHQub2JqZWN0KFwiU3VtVHlwZVZhcmlhbnRcIiwge1xuICBuYW1lOiB0Lm9wdGlvbih0LnN0cmluZygpKSxcbiAgZ2V0IGFsZ2VicmFpY1R5cGUoKSB7XG4gICAgcmV0dXJuIEFsZ2VicmFpY1R5cGUyO1xuICB9XG59KTtcbnZhciBUYWJsZUFjY2VzcyA9IHQuZW51bShcIlRhYmxlQWNjZXNzXCIsIHtcbiAgUHVibGljOiB0LnVuaXQoKSxcbiAgUHJpdmF0ZTogdC51bml0KClcbn0pO1xudmFyIFRhYmxlRGVzYyA9IHQub2JqZWN0KFwiVGFibGVEZXNjXCIsIHtcbiAgZ2V0IHNjaGVtYSgpIHtcbiAgICByZXR1cm4gUmF3VGFibGVEZWZWODtcbiAgfSxcbiAgZGF0YTogdC51MzIoKVxufSk7XG52YXIgVGFibGVUeXBlID0gdC5lbnVtKFwiVGFibGVUeXBlXCIsIHtcbiAgU3lzdGVtOiB0LnVuaXQoKSxcbiAgVXNlcjogdC51bml0KClcbn0pO1xudmFyIFR5cGVBbGlhcyA9IHQub2JqZWN0KFwiVHlwZUFsaWFzXCIsIHtcbiAgbmFtZTogdC5zdHJpbmcoKSxcbiAgdHk6IHQudTMyKClcbn0pO1xudmFyIFR5cGVzcGFjZSA9IHQub2JqZWN0KFwiVHlwZXNwYWNlXCIsIHtcbiAgZ2V0IHR5cGVzKCkge1xuICAgIHJldHVybiB0LmFycmF5KEFsZ2VicmFpY1R5cGUyKTtcbiAgfVxufSk7XG52YXIgVmlld1Jlc3VsdEhlYWRlciA9IHQuZW51bShcIlZpZXdSZXN1bHRIZWFkZXJcIiwge1xuICBSb3dEYXRhOiB0LnVuaXQoKSxcbiAgUmF3U3FsOiB0LnN0cmluZygpXG59KTtcblxuLy8gc3JjL2xpYi9zY2hlbWEudHNcbmZ1bmN0aW9uIHRhYmxlVG9TY2hlbWEoYWNjTmFtZSwgc2NoZW1hMiwgdGFibGVEZWYpIHtcbiAgY29uc3QgZ2V0Q29sTmFtZSA9IChpKSA9PiBzY2hlbWEyLnJvd1R5cGUuYWxnZWJyYWljVHlwZS52YWx1ZS5lbGVtZW50c1tpXS5uYW1lO1xuICBjb25zdCByZXNvbHZlZEluZGV4ZXMgPSB0YWJsZURlZi5pbmRleGVzLm1hcChcbiAgICAoaWR4KSA9PiB7XG4gICAgICBjb25zdCBhY2Nlc3Nvck5hbWUgPSBpZHguYWNjZXNzb3JOYW1lO1xuICAgICAgaWYgKHR5cGVvZiBhY2Nlc3Nvck5hbWUgIT09IFwic3RyaW5nXCIgfHwgYWNjZXNzb3JOYW1lLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAgIGBJbmRleCAnJHtpZHguc291cmNlTmFtZSA/PyBcIjx1bmtub3duPlwifScgb24gdGFibGUgJyR7dGFibGVEZWYuc291cmNlTmFtZX0nIGlzIG1pc3NpbmcgYWNjZXNzb3IgbmFtZWBcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGNvbHVtbklkcyA9IGlkeC5hbGdvcml0aG0udGFnID09PSBcIkRpcmVjdFwiID8gW2lkeC5hbGdvcml0aG0udmFsdWVdIDogaWR4LmFsZ29yaXRobS52YWx1ZTtcbiAgICAgIGNvbnN0IHVuaXF1ZSA9IHRhYmxlRGVmLmNvbnN0cmFpbnRzLnNvbWUoXG4gICAgICAgIChjKSA9PiBjLmRhdGEudGFnID09PSBcIlVuaXF1ZVwiICYmIGMuZGF0YS52YWx1ZS5jb2x1bW5zLmV2ZXJ5KChjb2wpID0+IGNvbHVtbklkcy5pbmNsdWRlcyhjb2wpKVxuICAgICAgKTtcbiAgICAgIGNvbnN0IGFsZ29yaXRobSA9IHtcbiAgICAgICAgQlRyZWU6IFwiYnRyZWVcIixcbiAgICAgICAgSGFzaDogXCJoYXNoXCIsXG4gICAgICAgIERpcmVjdDogXCJkaXJlY3RcIlxuICAgICAgfVtpZHguYWxnb3JpdGhtLnRhZ107XG4gICAgICByZXR1cm4ge1xuICAgICAgICBuYW1lOiBhY2Nlc3Nvck5hbWUsXG4gICAgICAgIHVuaXF1ZSxcbiAgICAgICAgYWxnb3JpdGhtLFxuICAgICAgICBjb2x1bW5zOiBjb2x1bW5JZHMubWFwKGdldENvbE5hbWUpXG4gICAgICB9O1xuICAgIH1cbiAgKTtcbiAgcmV0dXJuIHtcbiAgICAvLyBGb3IgY2xpZW50LGBzY2hhbWEudGFibGVOYW1lYCB3aWxsIGFsd2F5cyBiZSB0aGVyZSBhcyBjYW5vbmljYWwgbmFtZS5cbiAgICAvLyBGb3IgbW9kdWxlLCBpZiBleHBsaWNpdCBuYW1lIGlzIG5vdCBwcm92aWRlZCB2aWEgYG5hbWVgLCBhY2Nlc3NvciBuYW1lIHdpbGxcbiAgICAvLyBiZSB1c2VkLCBpdCBpcyBzdG9yZWQgYXMgYWxpYXMgaW4gZGF0YWJhc2UsIGhlbmNlIHdvcmtzIGluIHF1ZXJ5IGJ1aWxkZXIuXG4gICAgc291cmNlTmFtZTogc2NoZW1hMi50YWJsZU5hbWUgfHwgYWNjTmFtZSxcbiAgICBhY2Nlc3Nvck5hbWU6IGFjY05hbWUsXG4gICAgY29sdW1uczogc2NoZW1hMi5yb3dUeXBlLnJvdyxcbiAgICAvLyB0eXBlZCBhcyBUW2ldWydyb3dUeXBlJ11bJ3JvdyddIHVuZGVyIFRhYmxlc1RvU2NoZW1hPFQ+XG4gICAgcm93VHlwZTogc2NoZW1hMi5yb3dTcGFjZXRpbWVUeXBlLFxuICAgIC8vIEtlZXAgZGVjbGFyYXRpdmUgaW5kZXhlcyBpbiB0aGVpciBvcmlnaW5hbCBzaGFwZSBmb3IgdHlwZS1sZXZlbCBjb25zdW1lcnMuXG4gICAgaW5kZXhlczogc2NoZW1hMi5pZHhzLFxuICAgIGNvbnN0cmFpbnRzOiB0YWJsZURlZi5jb25zdHJhaW50cy5tYXAoKGMpID0+ICh7XG4gICAgICBuYW1lOiBjLnNvdXJjZU5hbWUsXG4gICAgICBjb25zdHJhaW50OiBcInVuaXF1ZVwiLFxuICAgICAgY29sdW1uczogYy5kYXRhLnZhbHVlLmNvbHVtbnMubWFwKGdldENvbE5hbWUpXG4gICAgfSkpLFxuICAgIC8vIEV4cG9zZSByZXNvbHZlZCBydW50aW1lIGluZGV4ZXMgc2VwYXJhdGVseSBzbyBydW50aW1lIHVzZXJzIGRvbid0IGhhdmUgdG9cbiAgICAvLyByZWludGVycHJldCBgaW5kZXhlc2Agd2l0aCB1bnNhZmUgY2FzdHMuXG4gICAgcmVzb2x2ZWRJbmRleGVzLFxuICAgIHRhYmxlRGVmLFxuICAgIC4uLnRhYmxlRGVmLmlzRXZlbnQgPyB7IGlzRXZlbnQ6IHRydWUgfSA6IHt9XG4gIH07XG59XG52YXIgTW9kdWxlQ29udGV4dCA9IGNsYXNzIHtcbiAgI2NvbXBvdW5kVHlwZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuICAvKipcbiAgICogVGhlIGdsb2JhbCBtb2R1bGUgZGVmaW5pdGlvbiB0aGF0IGdldHMgcG9wdWxhdGVkIGJ5IGNhbGxzIHRvIGByZWR1Y2VyKClgIGFuZCBsaWZlY3ljbGUgaG9va3MuXG4gICAqL1xuICAjbW9kdWxlRGVmID0ge1xuICAgIHR5cGVzcGFjZTogeyB0eXBlczogW10gfSxcbiAgICB0YWJsZXM6IFtdLFxuICAgIHJlZHVjZXJzOiBbXSxcbiAgICB0eXBlczogW10sXG4gICAgcm93TGV2ZWxTZWN1cml0eTogW10sXG4gICAgc2NoZWR1bGVzOiBbXSxcbiAgICBwcm9jZWR1cmVzOiBbXSxcbiAgICB2aWV3czogW10sXG4gICAgbGlmZUN5Y2xlUmVkdWNlcnM6IFtdLFxuICAgIGNhc2VDb252ZXJzaW9uUG9saWN5OiB7IHRhZzogXCJTbmFrZUNhc2VcIiB9LFxuICAgIGV4cGxpY2l0TmFtZXM6IHtcbiAgICAgIGVudHJpZXM6IFtdXG4gICAgfVxuICB9O1xuICBnZXQgbW9kdWxlRGVmKCkge1xuICAgIHJldHVybiB0aGlzLiNtb2R1bGVEZWY7XG4gIH1cbiAgcmF3TW9kdWxlRGVmVjEwKCkge1xuICAgIGNvbnN0IHNlY3Rpb25zID0gW107XG4gICAgY29uc3QgcHVzaCA9IChzKSA9PiB7XG4gICAgICBpZiAocykgc2VjdGlvbnMucHVzaChzKTtcbiAgICB9O1xuICAgIGNvbnN0IG1vZHVsZSA9IHRoaXMuI21vZHVsZURlZjtcbiAgICBwdXNoKG1vZHVsZS50eXBlc3BhY2UgJiYgeyB0YWc6IFwiVHlwZXNwYWNlXCIsIHZhbHVlOiBtb2R1bGUudHlwZXNwYWNlIH0pO1xuICAgIHB1c2gobW9kdWxlLnR5cGVzICYmIHsgdGFnOiBcIlR5cGVzXCIsIHZhbHVlOiBtb2R1bGUudHlwZXMgfSk7XG4gICAgcHVzaChtb2R1bGUudGFibGVzICYmIHsgdGFnOiBcIlRhYmxlc1wiLCB2YWx1ZTogbW9kdWxlLnRhYmxlcyB9KTtcbiAgICBwdXNoKG1vZHVsZS5yZWR1Y2VycyAmJiB7IHRhZzogXCJSZWR1Y2Vyc1wiLCB2YWx1ZTogbW9kdWxlLnJlZHVjZXJzIH0pO1xuICAgIHB1c2gobW9kdWxlLnByb2NlZHVyZXMgJiYgeyB0YWc6IFwiUHJvY2VkdXJlc1wiLCB2YWx1ZTogbW9kdWxlLnByb2NlZHVyZXMgfSk7XG4gICAgcHVzaChtb2R1bGUudmlld3MgJiYgeyB0YWc6IFwiVmlld3NcIiwgdmFsdWU6IG1vZHVsZS52aWV3cyB9KTtcbiAgICBwdXNoKG1vZHVsZS5zY2hlZHVsZXMgJiYgeyB0YWc6IFwiU2NoZWR1bGVzXCIsIHZhbHVlOiBtb2R1bGUuc2NoZWR1bGVzIH0pO1xuICAgIHB1c2goXG4gICAgICBtb2R1bGUubGlmZUN5Y2xlUmVkdWNlcnMgJiYge1xuICAgICAgICB0YWc6IFwiTGlmZUN5Y2xlUmVkdWNlcnNcIixcbiAgICAgICAgdmFsdWU6IG1vZHVsZS5saWZlQ3ljbGVSZWR1Y2Vyc1xuICAgICAgfVxuICAgICk7XG4gICAgcHVzaChcbiAgICAgIG1vZHVsZS5yb3dMZXZlbFNlY3VyaXR5ICYmIHtcbiAgICAgICAgdGFnOiBcIlJvd0xldmVsU2VjdXJpdHlcIixcbiAgICAgICAgdmFsdWU6IG1vZHVsZS5yb3dMZXZlbFNlY3VyaXR5XG4gICAgICB9XG4gICAgKTtcbiAgICBwdXNoKFxuICAgICAgbW9kdWxlLmV4cGxpY2l0TmFtZXMgJiYge1xuICAgICAgICB0YWc6IFwiRXhwbGljaXROYW1lc1wiLFxuICAgICAgICB2YWx1ZTogbW9kdWxlLmV4cGxpY2l0TmFtZXNcbiAgICAgIH1cbiAgICApO1xuICAgIHB1c2goXG4gICAgICBtb2R1bGUuY2FzZUNvbnZlcnNpb25Qb2xpY3kgJiYge1xuICAgICAgICB0YWc6IFwiQ2FzZUNvbnZlcnNpb25Qb2xpY3lcIixcbiAgICAgICAgdmFsdWU6IG1vZHVsZS5jYXNlQ29udmVyc2lvblBvbGljeVxuICAgICAgfVxuICAgICk7XG4gICAgcmV0dXJuIHsgc2VjdGlvbnMgfTtcbiAgfVxuICAvKipcbiAgICogU2V0IHRoZSBjYXNlIGNvbnZlcnNpb24gcG9saWN5IGZvciB0aGlzIG1vZHVsZS5cbiAgICogQ2FsbGVkIGJ5IHRoZSBzZXR0aW5ncyBtZWNoYW5pc20uXG4gICAqL1xuICBzZXRDYXNlQ29udmVyc2lvblBvbGljeShwb2xpY3kpIHtcbiAgICB0aGlzLiNtb2R1bGVEZWYuY2FzZUNvbnZlcnNpb25Qb2xpY3kgPSBwb2xpY3k7XG4gIH1cbiAgZ2V0IHR5cGVzcGFjZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jbW9kdWxlRGVmLnR5cGVzcGFjZTtcbiAgfVxuICAvKipcbiAgICogUmVzb2x2ZXMgdGhlIGFjdHVhbCB0eXBlIG9mIGEgVHlwZUJ1aWxkZXIgYnkgZm9sbG93aW5nIGl0cyByZWZlcmVuY2VzIHVudGlsIGl0IHJlYWNoZXMgYSBub24tcmVmIHR5cGUuXG4gICAqIEBwYXJhbSB0eXBlc3BhY2UgVGhlIHR5cGVzcGFjZSB0byByZXNvbHZlIHR5cGVzIGFnYWluc3QuXG4gICAqIEBwYXJhbSB0eXBlQnVpbGRlciBUaGUgVHlwZUJ1aWxkZXIgdG8gcmVzb2x2ZS5cbiAgICogQHJldHVybnMgVGhlIHJlc29sdmVkIGFsZ2VicmFpYyB0eXBlLlxuICAgKi9cbiAgcmVzb2x2ZVR5cGUodHlwZUJ1aWxkZXIpIHtcbiAgICBsZXQgdHkgPSB0eXBlQnVpbGRlci5hbGdlYnJhaWNUeXBlO1xuICAgIHdoaWxlICh0eS50YWcgPT09IFwiUmVmXCIpIHtcbiAgICAgIHR5ID0gdGhpcy50eXBlc3BhY2UudHlwZXNbdHkudmFsdWVdO1xuICAgIH1cbiAgICByZXR1cm4gdHk7XG4gIH1cbiAgLyoqXG4gICAqIEFkZHMgYSB0eXBlIHRvIHRoZSBtb2R1bGUgZGVmaW5pdGlvbidzIHR5cGVzcGFjZSBhcyBhIGBSZWZgIGlmIGl0IGlzIGEgbmFtZWQgY29tcG91bmQgdHlwZSAoUHJvZHVjdCBvciBTdW0pLlxuICAgKiBPdGhlcndpc2UsIHJldHVybnMgdGhlIHR5cGUgYXMgaXMuXG4gICAqIEBwYXJhbSBuYW1lXG4gICAqIEBwYXJhbSB0eVxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgcmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyKSB7XG4gICAgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUHJvZHVjdEJ1aWxkZXIgJiYgIWlzVW5pdCh0eXBlQnVpbGRlcikgfHwgdHlwZUJ1aWxkZXIgaW5zdGFuY2VvZiBTdW1CdWlsZGVyIHx8IHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUm93QnVpbGRlcikge1xuICAgICAgcmV0dXJuIHRoaXMuI3JlZ2lzdGVyQ29tcG91bmRUeXBlUmVjdXJzaXZlbHkodHlwZUJ1aWxkZXIpO1xuICAgIH0gZWxzZSBpZiAodHlwZUJ1aWxkZXIgaW5zdGFuY2VvZiBPcHRpb25CdWlsZGVyKSB7XG4gICAgICByZXR1cm4gbmV3IE9wdGlvbkJ1aWxkZXIoXG4gICAgICAgIHRoaXMucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyLnZhbHVlKVxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUmVzdWx0QnVpbGRlcikge1xuICAgICAgcmV0dXJuIG5ldyBSZXN1bHRCdWlsZGVyKFxuICAgICAgICB0aGlzLnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseSh0eXBlQnVpbGRlci5vayksXG4gICAgICAgIHRoaXMucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyLmVycilcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0eXBlQnVpbGRlciBpbnN0YW5jZW9mIEFycmF5QnVpbGRlcikge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheUJ1aWxkZXIoXG4gICAgICAgIHRoaXMucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyLmVsZW1lbnQpXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHlwZUJ1aWxkZXI7XG4gICAgfVxuICB9XG4gICNyZWdpc3RlckNvbXBvdW5kVHlwZVJlY3Vyc2l2ZWx5KHR5cGVCdWlsZGVyKSB7XG4gICAgY29uc3QgdHkgPSB0eXBlQnVpbGRlci5hbGdlYnJhaWNUeXBlO1xuICAgIGNvbnN0IG5hbWUgPSB0eXBlQnVpbGRlci50eXBlTmFtZTtcbiAgICBpZiAobmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBNaXNzaW5nIHR5cGUgbmFtZSBmb3IgJHt0eXBlQnVpbGRlci5jb25zdHJ1Y3Rvci5uYW1lID8/IFwiVHlwZUJ1aWxkZXJcIn0gJHtKU09OLnN0cmluZ2lmeSh0eXBlQnVpbGRlcil9YFxuICAgICAgKTtcbiAgICB9XG4gICAgbGV0IHIgPSB0aGlzLiNjb21wb3VuZFR5cGVzLmdldCh0eSk7XG4gICAgaWYgKHIgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHI7XG4gICAgfVxuICAgIGNvbnN0IG5ld1R5ID0gdHlwZUJ1aWxkZXIgaW5zdGFuY2VvZiBSb3dCdWlsZGVyIHx8IHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUHJvZHVjdEJ1aWxkZXIgPyB7XG4gICAgICB0YWc6IFwiUHJvZHVjdFwiLFxuICAgICAgdmFsdWU6IHsgZWxlbWVudHM6IFtdIH1cbiAgICB9IDoge1xuICAgICAgdGFnOiBcIlN1bVwiLFxuICAgICAgdmFsdWU6IHsgdmFyaWFudHM6IFtdIH1cbiAgICB9O1xuICAgIHIgPSBuZXcgUmVmQnVpbGRlcih0aGlzLiNtb2R1bGVEZWYudHlwZXNwYWNlLnR5cGVzLmxlbmd0aCk7XG4gICAgdGhpcy4jbW9kdWxlRGVmLnR5cGVzcGFjZS50eXBlcy5wdXNoKG5ld1R5KTtcbiAgICB0aGlzLiNjb21wb3VuZFR5cGVzLnNldCh0eSwgcik7XG4gICAgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUm93QnVpbGRlcikge1xuICAgICAgZm9yIChjb25zdCBbbmFtZTIsIGVsZW1dIG9mIE9iamVjdC5lbnRyaWVzKHR5cGVCdWlsZGVyLnJvdykpIHtcbiAgICAgICAgbmV3VHkudmFsdWUuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZTIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogdGhpcy5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkoZWxlbS50eXBlQnVpbGRlcikuYWxnZWJyYWljVHlwZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgUHJvZHVjdEJ1aWxkZXIpIHtcbiAgICAgIGZvciAoY29uc3QgW25hbWUyLCBlbGVtXSBvZiBPYmplY3QuZW50cmllcyh0eXBlQnVpbGRlci5lbGVtZW50cykpIHtcbiAgICAgICAgbmV3VHkudmFsdWUuZWxlbWVudHMucHVzaCh7XG4gICAgICAgICAgbmFtZTogbmFtZTIsXG4gICAgICAgICAgYWxnZWJyYWljVHlwZTogdGhpcy5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkoZWxlbSkuYWxnZWJyYWljVHlwZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHR5cGVCdWlsZGVyIGluc3RhbmNlb2YgU3VtQnVpbGRlcikge1xuICAgICAgZm9yIChjb25zdCBbbmFtZTIsIHZhcmlhbnRdIG9mIE9iamVjdC5lbnRyaWVzKHR5cGVCdWlsZGVyLnZhcmlhbnRzKSkge1xuICAgICAgICBuZXdUeS52YWx1ZS52YXJpYW50cy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBuYW1lMixcbiAgICAgICAgICBhbGdlYnJhaWNUeXBlOiB0aGlzLnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseSh2YXJpYW50KS5hbGdlYnJhaWNUeXBlXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLiNtb2R1bGVEZWYudHlwZXMucHVzaCh7XG4gICAgICBzb3VyY2VOYW1lOiBzcGxpdE5hbWUobmFtZSksXG4gICAgICB0eTogci5yZWYsXG4gICAgICBjdXN0b21PcmRlcmluZzogdHJ1ZVxuICAgIH0pO1xuICAgIHJldHVybiByO1xuICB9XG59O1xuZnVuY3Rpb24gaXNVbml0KHR5cGVCdWlsZGVyKSB7XG4gIHJldHVybiB0eXBlQnVpbGRlci50eXBlTmFtZSA9PSBudWxsICYmIHR5cGVCdWlsZGVyLmFsZ2VicmFpY1R5cGUudmFsdWUuZWxlbWVudHMubGVuZ3RoID09PSAwO1xufVxuZnVuY3Rpb24gc3BsaXROYW1lKG5hbWUpIHtcbiAgY29uc3Qgc2NvcGUgPSBuYW1lLnNwbGl0KFwiLlwiKTtcbiAgcmV0dXJuIHsgc291cmNlTmFtZTogc2NvcGUucG9wKCksIHNjb3BlIH07XG59XG5cbi8vIHNyYy9zZXJ2ZXIvaHR0cF9pbnRlcm5hbC50c1xudmFyIGltcG9ydF9zdGF0dXNlcyA9IF9fdG9FU00ocmVxdWlyZV9zdGF0dXNlcygpKTtcblxuLy8gc3JjL3NlcnZlci9yYW5nZS50c1xudmFyIFJhbmdlID0gY2xhc3Mge1xuICAjZnJvbTtcbiAgI3RvO1xuICBjb25zdHJ1Y3Rvcihmcm9tLCB0bykge1xuICAgIHRoaXMuI2Zyb20gPSBmcm9tID8/IHsgdGFnOiBcInVuYm91bmRlZFwiIH07XG4gICAgdGhpcy4jdG8gPSB0byA/PyB7IHRhZzogXCJ1bmJvdW5kZWRcIiB9O1xuICB9XG4gIGdldCBmcm9tKCkge1xuICAgIHJldHVybiB0aGlzLiNmcm9tO1xuICB9XG4gIGdldCB0bygpIHtcbiAgICByZXR1cm4gdGhpcy4jdG87XG4gIH1cbn07XG5cbi8vIHNyYy9saWIvdGFibGUudHNcbmZ1bmN0aW9uIHRhYmxlKG9wdHMsIHJvdywgLi4uXykge1xuICBjb25zdCB7XG4gICAgbmFtZSxcbiAgICBwdWJsaWM6IGlzUHVibGljID0gZmFsc2UsXG4gICAgaW5kZXhlczogdXNlckluZGV4ZXMgPSBbXSxcbiAgICBzY2hlZHVsZWQsXG4gICAgZXZlbnQ6IGlzRXZlbnQgPSBmYWxzZVxuICB9ID0gb3B0cztcbiAgY29uc3QgY29sSWRzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbiAgY29uc3QgY29sTmFtZUxpc3QgPSBbXTtcbiAgaWYgKCEocm93IGluc3RhbmNlb2YgUm93QnVpbGRlcikpIHtcbiAgICByb3cgPSBuZXcgUm93QnVpbGRlcihyb3cpO1xuICB9XG4gIHJvdy5hbGdlYnJhaWNUeXBlLnZhbHVlLmVsZW1lbnRzLmZvckVhY2goKGVsZW0sIGkpID0+IHtcbiAgICBjb2xJZHMuc2V0KGVsZW0ubmFtZSwgaSk7XG4gICAgY29sTmFtZUxpc3QucHVzaChlbGVtLm5hbWUpO1xuICB9KTtcbiAgY29uc3QgcGsgPSBbXTtcbiAgY29uc3QgaW5kZXhlcyA9IFtdO1xuICBjb25zdCBjb25zdHJhaW50cyA9IFtdO1xuICBjb25zdCBzZXF1ZW5jZXMgPSBbXTtcbiAgbGV0IHNjaGVkdWxlQXRDb2w7XG4gIGNvbnN0IGRlZmF1bHRWYWx1ZXMgPSBbXTtcbiAgZm9yIChjb25zdCBbbmFtZTIsIGJ1aWxkZXJdIG9mIE9iamVjdC5lbnRyaWVzKHJvdy5yb3cpKSB7XG4gICAgY29uc3QgbWV0YSA9IGJ1aWxkZXIuY29sdW1uTWV0YWRhdGE7XG4gICAgaWYgKG1ldGEuaXNQcmltYXJ5S2V5KSB7XG4gICAgICBway5wdXNoKGNvbElkcy5nZXQobmFtZTIpKTtcbiAgICB9XG4gICAgY29uc3QgaXNVbmlxdWUgPSBtZXRhLmlzVW5pcXVlIHx8IG1ldGEuaXNQcmltYXJ5S2V5O1xuICAgIGlmIChtZXRhLmluZGV4VHlwZSB8fCBpc1VuaXF1ZSkge1xuICAgICAgY29uc3QgYWxnbyA9IG1ldGEuaW5kZXhUeXBlID8/IFwiYnRyZWVcIjtcbiAgICAgIGNvbnN0IGlkID0gY29sSWRzLmdldChuYW1lMik7XG4gICAgICBsZXQgYWxnb3JpdGhtO1xuICAgICAgc3dpdGNoIChhbGdvKSB7XG4gICAgICAgIGNhc2UgXCJidHJlZVwiOlxuICAgICAgICAgIGFsZ29yaXRobSA9IFJhd0luZGV4QWxnb3JpdGhtLkJUcmVlKFtpZF0pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaGFzaFwiOlxuICAgICAgICAgIGFsZ29yaXRobSA9IFJhd0luZGV4QWxnb3JpdGhtLkhhc2goW2lkXSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXJlY3RcIjpcbiAgICAgICAgICBhbGdvcml0aG0gPSBSYXdJbmRleEFsZ29yaXRobS5EaXJlY3QoaWQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXhlcy5wdXNoKHtcbiAgICAgICAgc291cmNlTmFtZTogdm9pZCAwLFxuICAgICAgICAvLyBVbm5hbWVkIGluZGV4ZXMgd2lsbCBiZSBhc3NpZ25lZCBhIGdsb2JhbGx5IHVuaXF1ZSBuYW1lXG4gICAgICAgIGFjY2Vzc29yTmFtZTogbmFtZTIsXG4gICAgICAgIGFsZ29yaXRobVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChpc1VuaXF1ZSkge1xuICAgICAgY29uc3RyYWludHMucHVzaCh7XG4gICAgICAgIHNvdXJjZU5hbWU6IHZvaWQgMCxcbiAgICAgICAgZGF0YTogeyB0YWc6IFwiVW5pcXVlXCIsIHZhbHVlOiB7IGNvbHVtbnM6IFtjb2xJZHMuZ2V0KG5hbWUyKV0gfSB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1ldGEuaXNBdXRvSW5jcmVtZW50KSB7XG4gICAgICBzZXF1ZW5jZXMucHVzaCh7XG4gICAgICAgIHNvdXJjZU5hbWU6IHZvaWQgMCxcbiAgICAgICAgc3RhcnQ6IHZvaWQgMCxcbiAgICAgICAgbWluVmFsdWU6IHZvaWQgMCxcbiAgICAgICAgbWF4VmFsdWU6IHZvaWQgMCxcbiAgICAgICAgY29sdW1uOiBjb2xJZHMuZ2V0KG5hbWUyKSxcbiAgICAgICAgaW5jcmVtZW50OiAxblxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtZXRhLmRlZmF1bHRWYWx1ZSkge1xuICAgICAgY29uc3Qgd3JpdGVyID0gbmV3IEJpbmFyeVdyaXRlcigxNik7XG4gICAgICBidWlsZGVyLnNlcmlhbGl6ZSh3cml0ZXIsIG1ldGEuZGVmYXVsdFZhbHVlKTtcbiAgICAgIGRlZmF1bHRWYWx1ZXMucHVzaCh7XG4gICAgICAgIGNvbElkOiBjb2xJZHMuZ2V0KG5hbWUyKSxcbiAgICAgICAgdmFsdWU6IHdyaXRlci5nZXRCdWZmZXIoKVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChzY2hlZHVsZWQpIHtcbiAgICAgIGNvbnN0IGFsZ2VicmFpY1R5cGUgPSBidWlsZGVyLnR5cGVCdWlsZGVyLmFsZ2VicmFpY1R5cGU7XG4gICAgICBpZiAoc2NoZWR1bGVfYXRfZGVmYXVsdC5pc1NjaGVkdWxlQXQoYWxnZWJyYWljVHlwZSkpIHtcbiAgICAgICAgc2NoZWR1bGVBdENvbCA9IGNvbElkcy5nZXQobmFtZTIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IGluZGV4T3B0cyBvZiB1c2VySW5kZXhlcyA/PyBbXSkge1xuICAgIGNvbnN0IGFjY2Vzc29yID0gaW5kZXhPcHRzLmFjY2Vzc29yO1xuICAgIGlmICh0eXBlb2YgYWNjZXNzb3IgIT09IFwic3RyaW5nXCIgfHwgYWNjZXNzb3IubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCB0YWJsZUxhYmVsID0gbmFtZSA/PyBcIjx1bm5hbWVkPlwiO1xuICAgICAgY29uc3QgaW5kZXhMYWJlbCA9IGluZGV4T3B0cy5uYW1lID8/IFwiPHVubmFtZWQ+XCI7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICBgSW5kZXggJyR7aW5kZXhMYWJlbH0nIG9uIHRhYmxlICcke3RhYmxlTGFiZWx9JyBtdXN0IGRlZmluZSBhIG5vbi1lbXB0eSAnYWNjZXNzb3InYFxuICAgICAgKTtcbiAgICB9XG4gICAgbGV0IGFsZ29yaXRobTtcbiAgICBzd2l0Y2ggKGluZGV4T3B0cy5hbGdvcml0aG0pIHtcbiAgICAgIGNhc2UgXCJidHJlZVwiOlxuICAgICAgICBhbGdvcml0aG0gPSB7XG4gICAgICAgICAgdGFnOiBcIkJUcmVlXCIsXG4gICAgICAgICAgdmFsdWU6IGluZGV4T3B0cy5jb2x1bW5zLm1hcCgoYykgPT4gY29sSWRzLmdldChjKSlcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaGFzaFwiOlxuICAgICAgICBhbGdvcml0aG0gPSB7XG4gICAgICAgICAgdGFnOiBcIkhhc2hcIixcbiAgICAgICAgICB2YWx1ZTogaW5kZXhPcHRzLmNvbHVtbnMubWFwKChjKSA9PiBjb2xJZHMuZ2V0KGMpKVxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJkaXJlY3RcIjpcbiAgICAgICAgYWxnb3JpdGhtID0geyB0YWc6IFwiRGlyZWN0XCIsIHZhbHVlOiBjb2xJZHMuZ2V0KGluZGV4T3B0cy5jb2x1bW4pIH07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpbmRleGVzLnB1c2goe1xuICAgICAgc291cmNlTmFtZTogdm9pZCAwLFxuICAgICAgYWNjZXNzb3JOYW1lOiBhY2Nlc3NvcixcbiAgICAgIGFsZ29yaXRobSxcbiAgICAgIGNhbm9uaWNhbE5hbWU6IGluZGV4T3B0cy5uYW1lXG4gICAgfSk7XG4gIH1cbiAgZm9yIChjb25zdCBjb25zdHJhaW50T3B0cyBvZiBvcHRzLmNvbnN0cmFpbnRzID8/IFtdKSB7XG4gICAgaWYgKGNvbnN0cmFpbnRPcHRzLmNvbnN0cmFpbnQgPT09IFwidW5pcXVlXCIpIHtcbiAgICAgIGNvbnN0IGRhdGEgPSB7XG4gICAgICAgIHRhZzogXCJVbmlxdWVcIixcbiAgICAgICAgdmFsdWU6IHsgY29sdW1uczogY29uc3RyYWludE9wdHMuY29sdW1ucy5tYXAoKGMpID0+IGNvbElkcy5nZXQoYykpIH1cbiAgICAgIH07XG4gICAgICBjb25zdHJhaW50cy5wdXNoKHsgc291cmNlTmFtZTogY29uc3RyYWludE9wdHMubmFtZSwgZGF0YSB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuICBjb25zdCBwcm9kdWN0VHlwZSA9IHJvdy5hbGdlYnJhaWNUeXBlLnZhbHVlO1xuICBjb25zdCBzY2hlZHVsZSA9IHNjaGVkdWxlZCAmJiBzY2hlZHVsZUF0Q29sICE9PSB2b2lkIDAgPyB7IHNjaGVkdWxlQXRDb2wsIHJlZHVjZXI6IHNjaGVkdWxlZCB9IDogdm9pZCAwO1xuICByZXR1cm4ge1xuICAgIHJvd1R5cGU6IHJvdyxcbiAgICB0YWJsZU5hbWU6IG5hbWUsXG4gICAgcm93U3BhY2V0aW1lVHlwZTogcHJvZHVjdFR5cGUsXG4gICAgdGFibGVEZWY6IChjdHgsIGFjY05hbWUpID0+IHtcbiAgICAgIGNvbnN0IHRhYmxlTmFtZSA9IG5hbWUgPz8gYWNjTmFtZTtcbiAgICAgIGlmIChyb3cudHlwZU5hbWUgPT09IHZvaWQgMCkge1xuICAgICAgICByb3cudHlwZU5hbWUgPSB0b1Bhc2NhbENhc2UodGFibGVOYW1lKTtcbiAgICAgIH1cbiAgICAgIGZvciAoY29uc3QgaW5kZXggb2YgaW5kZXhlcykge1xuICAgICAgICBjb25zdCBjb2xzID0gaW5kZXguYWxnb3JpdGhtLnRhZyA9PT0gXCJEaXJlY3RcIiA/IFtpbmRleC5hbGdvcml0aG0udmFsdWVdIDogaW5kZXguYWxnb3JpdGhtLnZhbHVlO1xuICAgICAgICBjb25zdCBjb2xTID0gY29scy5tYXAoKGkpID0+IGNvbE5hbWVMaXN0W2ldKS5qb2luKFwiX1wiKTtcbiAgICAgICAgY29uc3Qgc291cmNlTmFtZSA9IGluZGV4LnNvdXJjZU5hbWUgPSBgJHthY2NOYW1lfV8ke2NvbFN9X2lkeF8ke2luZGV4LmFsZ29yaXRobS50YWcudG9Mb3dlckNhc2UoKX1gO1xuICAgICAgICBjb25zdCB7IGNhbm9uaWNhbE5hbWUgfSA9IGluZGV4O1xuICAgICAgICBpZiAoY2Fub25pY2FsTmFtZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgY3R4Lm1vZHVsZURlZi5leHBsaWNpdE5hbWVzLmVudHJpZXMucHVzaChcbiAgICAgICAgICAgIEV4cGxpY2l0TmFtZUVudHJ5LkluZGV4KHsgc291cmNlTmFtZSwgY2Fub25pY2FsTmFtZSB9KVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNvdXJjZU5hbWU6IGFjY05hbWUsXG4gICAgICAgIHByb2R1Y3RUeXBlUmVmOiBjdHgucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KHJvdykucmVmLFxuICAgICAgICBwcmltYXJ5S2V5OiBwayxcbiAgICAgICAgaW5kZXhlcyxcbiAgICAgICAgY29uc3RyYWludHMsXG4gICAgICAgIHNlcXVlbmNlcyxcbiAgICAgICAgdGFibGVUeXBlOiB7IHRhZzogXCJVc2VyXCIgfSxcbiAgICAgICAgdGFibGVBY2Nlc3M6IHsgdGFnOiBpc1B1YmxpYyA/IFwiUHVibGljXCIgOiBcIlByaXZhdGVcIiB9LFxuICAgICAgICBkZWZhdWx0VmFsdWVzLFxuICAgICAgICBpc0V2ZW50XG4gICAgICB9O1xuICAgIH0sXG4gICAgLy8gUHJlc2VydmUgdGhlIGRlY2xhcmVkIGluZGV4IG9wdGlvbnMgYXMgcnVudGltZSBkYXRhIHNvIGB0YWJsZVRvU2NoZW1hYFxuICAgIC8vIGNhbiBleHBvc2UgdGhlbSB3aXRob3V0IHR5cGUtc211Z2dsaW5nLlxuICAgIGlkeHM6IHVzZXJJbmRleGVzLFxuICAgIGNvbnN0cmFpbnRzLFxuICAgIHNjaGVkdWxlXG4gIH07XG59XG5cbi8vIHNyYy9saWIvcXVlcnkudHNcbnZhciBRdWVyeUJyYW5kID0gU3ltYm9sKFwiUXVlcnlCcmFuZFwiKTtcbnZhciBpc1Jvd1R5cGVkUXVlcnkgPSAodmFsKSA9PiAhIXZhbCAmJiB0eXBlb2YgdmFsID09PSBcIm9iamVjdFwiICYmIFF1ZXJ5QnJhbmQgaW4gdmFsO1xudmFyIGlzVHlwZWRRdWVyeSA9ICh2YWwpID0+ICEhdmFsICYmIHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIgJiYgUXVlcnlCcmFuZCBpbiB2YWw7XG5mdW5jdGlvbiB0b1NxbChxKSB7XG4gIHJldHVybiBxLnRvU3FsKCk7XG59XG52YXIgU2VtaWpvaW5JbXBsID0gY2xhc3MgX1NlbWlqb2luSW1wbCB7XG4gIGNvbnN0cnVjdG9yKHNvdXJjZVF1ZXJ5LCBmaWx0ZXJRdWVyeSwgam9pbkNvbmRpdGlvbikge1xuICAgIHRoaXMuc291cmNlUXVlcnkgPSBzb3VyY2VRdWVyeTtcbiAgICB0aGlzLmZpbHRlclF1ZXJ5ID0gZmlsdGVyUXVlcnk7XG4gICAgdGhpcy5qb2luQ29uZGl0aW9uID0gam9pbkNvbmRpdGlvbjtcbiAgICBpZiAoc291cmNlUXVlcnkudGFibGUuc291cmNlTmFtZSA9PT0gZmlsdGVyUXVlcnkudGFibGUuc291cmNlTmFtZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHNlbWlqb2luIGEgdGFibGUgdG8gaXRzZWxmXCIpO1xuICAgIH1cbiAgfVxuICBbUXVlcnlCcmFuZF0gPSB0cnVlO1xuICB0eXBlID0gXCJzZW1pam9pblwiO1xuICBidWlsZCgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB3aGVyZShwcmVkaWNhdGUpIHtcbiAgICBjb25zdCBuZXh0U291cmNlUXVlcnkgPSB0aGlzLnNvdXJjZVF1ZXJ5LndoZXJlKHByZWRpY2F0ZSk7XG4gICAgcmV0dXJuIG5ldyBfU2VtaWpvaW5JbXBsKFxuICAgICAgbmV4dFNvdXJjZVF1ZXJ5LFxuICAgICAgdGhpcy5maWx0ZXJRdWVyeSxcbiAgICAgIHRoaXMuam9pbkNvbmRpdGlvblxuICAgICk7XG4gIH1cbiAgdG9TcWwoKSB7XG4gICAgY29uc3QgbGVmdCA9IHRoaXMuZmlsdGVyUXVlcnk7XG4gICAgY29uc3QgcmlnaHQgPSB0aGlzLnNvdXJjZVF1ZXJ5O1xuICAgIGNvbnN0IGxlZnRUYWJsZSA9IHF1b3RlSWRlbnRpZmllcihsZWZ0LnRhYmxlLnNvdXJjZU5hbWUpO1xuICAgIGNvbnN0IHJpZ2h0VGFibGUgPSBxdW90ZUlkZW50aWZpZXIocmlnaHQudGFibGUuc291cmNlTmFtZSk7XG4gICAgbGV0IHNxbCA9IGBTRUxFQ1QgJHtyaWdodFRhYmxlfS4qIEZST00gJHtsZWZ0VGFibGV9IEpPSU4gJHtyaWdodFRhYmxlfSBPTiAke2Jvb2xlYW5FeHByVG9TcWwodGhpcy5qb2luQ29uZGl0aW9uKX1gO1xuICAgIGNvbnN0IGNsYXVzZXMgPSBbXTtcbiAgICBpZiAobGVmdC53aGVyZUNsYXVzZSkge1xuICAgICAgY2xhdXNlcy5wdXNoKGJvb2xlYW5FeHByVG9TcWwobGVmdC53aGVyZUNsYXVzZSkpO1xuICAgIH1cbiAgICBpZiAocmlnaHQud2hlcmVDbGF1c2UpIHtcbiAgICAgIGNsYXVzZXMucHVzaChib29sZWFuRXhwclRvU3FsKHJpZ2h0LndoZXJlQ2xhdXNlKSk7XG4gICAgfVxuICAgIGlmIChjbGF1c2VzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IHdoZXJlU3FsID0gY2xhdXNlcy5sZW5ndGggPT09IDEgPyBjbGF1c2VzWzBdIDogY2xhdXNlcy5tYXAod3JhcEluUGFyZW5zKS5qb2luKFwiIEFORCBcIik7XG4gICAgICBzcWwgKz0gYCBXSEVSRSAke3doZXJlU3FsfWA7XG4gICAgfVxuICAgIHJldHVybiBzcWw7XG4gIH1cbn07XG52YXIgRnJvbUJ1aWxkZXIgPSBjbGFzcyBfRnJvbUJ1aWxkZXIge1xuICBjb25zdHJ1Y3Rvcih0YWJsZTIsIHdoZXJlQ2xhdXNlKSB7XG4gICAgdGhpcy50YWJsZSA9IHRhYmxlMjtcbiAgICB0aGlzLndoZXJlQ2xhdXNlID0gd2hlcmVDbGF1c2U7XG4gIH1cbiAgW1F1ZXJ5QnJhbmRdID0gdHJ1ZTtcbiAgd2hlcmUocHJlZGljYXRlKSB7XG4gICAgY29uc3QgbmV3Q29uZGl0aW9uID0gbm9ybWFsaXplUHJlZGljYXRlRXhwcihwcmVkaWNhdGUodGhpcy50YWJsZS5jb2xzKSk7XG4gICAgY29uc3QgbmV4dFdoZXJlID0gdGhpcy53aGVyZUNsYXVzZSA/IHRoaXMud2hlcmVDbGF1c2UuYW5kKG5ld0NvbmRpdGlvbikgOiBuZXdDb25kaXRpb247XG4gICAgcmV0dXJuIG5ldyBfRnJvbUJ1aWxkZXIodGhpcy50YWJsZSwgbmV4dFdoZXJlKTtcbiAgfVxuICByaWdodFNlbWlqb2luKHJpZ2h0LCBvbikge1xuICAgIGNvbnN0IHNvdXJjZVF1ZXJ5ID0gbmV3IF9Gcm9tQnVpbGRlcihyaWdodCk7XG4gICAgY29uc3Qgam9pbkNvbmRpdGlvbiA9IG9uKFxuICAgICAgdGhpcy50YWJsZS5pbmRleGVkQ29scyxcbiAgICAgIHJpZ2h0LmluZGV4ZWRDb2xzXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IFNlbWlqb2luSW1wbChzb3VyY2VRdWVyeSwgdGhpcywgam9pbkNvbmRpdGlvbik7XG4gIH1cbiAgbGVmdFNlbWlqb2luKHJpZ2h0LCBvbikge1xuICAgIGNvbnN0IGZpbHRlclF1ZXJ5ID0gbmV3IF9Gcm9tQnVpbGRlcihyaWdodCk7XG4gICAgY29uc3Qgam9pbkNvbmRpdGlvbiA9IG9uKFxuICAgICAgdGhpcy50YWJsZS5pbmRleGVkQ29scyxcbiAgICAgIHJpZ2h0LmluZGV4ZWRDb2xzXG4gICAgKTtcbiAgICByZXR1cm4gbmV3IFNlbWlqb2luSW1wbCh0aGlzLCBmaWx0ZXJRdWVyeSwgam9pbkNvbmRpdGlvbik7XG4gIH1cbiAgdG9TcWwoKSB7XG4gICAgcmV0dXJuIHJlbmRlclNlbGVjdFNxbFdpdGhKb2lucyh0aGlzLnRhYmxlLCB0aGlzLndoZXJlQ2xhdXNlKTtcbiAgfVxuICBidWlsZCgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufTtcbnZhciBUYWJsZVJlZkltcGwgPSBjbGFzcyB7XG4gIFtRdWVyeUJyYW5kXSA9IHRydWU7XG4gIHR5cGUgPSBcInRhYmxlXCI7XG4gIHNvdXJjZU5hbWU7XG4gIGFjY2Vzc29yTmFtZTtcbiAgY29scztcbiAgaW5kZXhlZENvbHM7XG4gIHRhYmxlRGVmO1xuICAvLyBEZWxlZ2F0ZSBVbnR5cGVkVGFibGVEZWYgcHJvcGVydGllcyBmcm9tIHRhYmxlRGVmIHNvIHRoaXMgY2FuIGJlIHVzZWQgYXMgYSB0YWJsZSBkZWYuXG4gIGdldCBjb2x1bW5zKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlRGVmLmNvbHVtbnM7XG4gIH1cbiAgZ2V0IGluZGV4ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVEZWYuaW5kZXhlcztcbiAgfVxuICBnZXQgcm93VHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZURlZi5yb3dUeXBlO1xuICB9XG4gIGdldCBjb25zdHJhaW50cygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZURlZi5jb25zdHJhaW50cztcbiAgfVxuICBjb25zdHJ1Y3Rvcih0YWJsZURlZikge1xuICAgIHRoaXMuc291cmNlTmFtZSA9IHRhYmxlRGVmLnNvdXJjZU5hbWU7XG4gICAgdGhpcy5hY2Nlc3Nvck5hbWUgPSB0YWJsZURlZi5hY2Nlc3Nvck5hbWU7XG4gICAgdGhpcy5jb2xzID0gY3JlYXRlUm93RXhwcih0YWJsZURlZik7XG4gICAgdGhpcy5pbmRleGVkQ29scyA9IHRoaXMuY29scztcbiAgICB0aGlzLnRhYmxlRGVmID0gdGFibGVEZWY7XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKTtcbiAgfVxuICBhc0Zyb20oKSB7XG4gICAgcmV0dXJuIG5ldyBGcm9tQnVpbGRlcih0aGlzKTtcbiAgfVxuICByaWdodFNlbWlqb2luKG90aGVyLCBvbikge1xuICAgIHJldHVybiB0aGlzLmFzRnJvbSgpLnJpZ2h0U2VtaWpvaW4ob3RoZXIsIG9uKTtcbiAgfVxuICBsZWZ0U2VtaWpvaW4ob3RoZXIsIG9uKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNGcm9tKCkubGVmdFNlbWlqb2luKG90aGVyLCBvbik7XG4gIH1cbiAgYnVpbGQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNGcm9tKCkuYnVpbGQoKTtcbiAgfVxuICB0b1NxbCgpIHtcbiAgICByZXR1cm4gdGhpcy5hc0Zyb20oKS50b1NxbCgpO1xuICB9XG4gIHdoZXJlKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiB0aGlzLmFzRnJvbSgpLndoZXJlKHByZWRpY2F0ZSk7XG4gIH1cbn07XG5mdW5jdGlvbiBjcmVhdGVUYWJsZVJlZkZyb21EZWYodGFibGVEZWYpIHtcbiAgcmV0dXJuIG5ldyBUYWJsZVJlZkltcGwodGFibGVEZWYpO1xufVxuZnVuY3Rpb24gbWFrZVF1ZXJ5QnVpbGRlcihzY2hlbWEyKSB7XG4gIGNvbnN0IHFiID0gLyogQF9fUFVSRV9fICovIE9iamVjdC5jcmVhdGUobnVsbCk7XG4gIGZvciAoY29uc3QgdGFibGUyIG9mIE9iamVjdC52YWx1ZXMoc2NoZW1hMi50YWJsZXMpKSB7XG4gICAgY29uc3QgcmVmID0gY3JlYXRlVGFibGVSZWZGcm9tRGVmKFxuICAgICAgdGFibGUyXG4gICAgKTtcbiAgICBxYlt0YWJsZTIuYWNjZXNzb3JOYW1lXSA9IHJlZjtcbiAgfVxuICByZXR1cm4gT2JqZWN0LmZyZWV6ZShxYik7XG59XG5mdW5jdGlvbiBjcmVhdGVSb3dFeHByKHRhYmxlRGVmKSB7XG4gIGNvbnN0IHJvdyA9IHt9O1xuICBmb3IgKGNvbnN0IGNvbHVtbk5hbWUgb2YgT2JqZWN0LmtleXModGFibGVEZWYuY29sdW1ucykpIHtcbiAgICBjb25zdCBjb2x1bW5CdWlsZGVyID0gdGFibGVEZWYuY29sdW1uc1tjb2x1bW5OYW1lXTtcbiAgICBjb25zdCBjb2x1bW4gPSBuZXcgQ29sdW1uRXhwcmVzc2lvbihcbiAgICAgIHRhYmxlRGVmLnNvdXJjZU5hbWUsXG4gICAgICBjb2x1bW5OYW1lLFxuICAgICAgY29sdW1uQnVpbGRlci50eXBlQnVpbGRlci5hbGdlYnJhaWNUeXBlXG4gICAgKTtcbiAgICByb3dbY29sdW1uTmFtZV0gPSBPYmplY3QuZnJlZXplKGNvbHVtbik7XG4gIH1cbiAgcmV0dXJuIE9iamVjdC5mcmVlemUocm93KTtcbn1cbmZ1bmN0aW9uIHJlbmRlclNlbGVjdFNxbFdpdGhKb2lucyh0YWJsZTIsIHdoZXJlLCBleHRyYUNsYXVzZXMgPSBbXSkge1xuICBjb25zdCBxdW90ZWRUYWJsZSA9IHF1b3RlSWRlbnRpZmllcih0YWJsZTIuc291cmNlTmFtZSk7XG4gIGNvbnN0IHNxbCA9IGBTRUxFQ1QgKiBGUk9NICR7cXVvdGVkVGFibGV9YDtcbiAgY29uc3QgY2xhdXNlcyA9IFtdO1xuICBpZiAod2hlcmUpIGNsYXVzZXMucHVzaChib29sZWFuRXhwclRvU3FsKHdoZXJlKSk7XG4gIGNsYXVzZXMucHVzaCguLi5leHRyYUNsYXVzZXMpO1xuICBpZiAoY2xhdXNlcy5sZW5ndGggPT09IDApIHJldHVybiBzcWw7XG4gIGNvbnN0IHdoZXJlU3FsID0gY2xhdXNlcy5sZW5ndGggPT09IDEgPyBjbGF1c2VzWzBdIDogY2xhdXNlcy5tYXAod3JhcEluUGFyZW5zKS5qb2luKFwiIEFORCBcIik7XG4gIHJldHVybiBgJHtzcWx9IFdIRVJFICR7d2hlcmVTcWx9YDtcbn1cbnZhciBDb2x1bW5FeHByZXNzaW9uID0gY2xhc3Mge1xuICB0eXBlID0gXCJjb2x1bW5cIjtcbiAgY29sdW1uO1xuICB0YWJsZTtcbiAgLy8gcGhhbnRvbTogYWN0dWFsIHJ1bnRpbWUgdmFsdWUgaXMgdW5kZWZpbmVkXG4gIHRzVmFsdWVUeXBlO1xuICBzcGFjZXRpbWVUeXBlO1xuICBjb25zdHJ1Y3Rvcih0YWJsZTIsIGNvbHVtbiwgc3BhY2V0aW1lVHlwZSkge1xuICAgIHRoaXMudGFibGUgPSB0YWJsZTI7XG4gICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gICAgdGhpcy5zcGFjZXRpbWVUeXBlID0gc3BhY2V0aW1lVHlwZTtcbiAgfVxuICBlcSh4KSB7XG4gICAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgICB0eXBlOiBcImVxXCIsXG4gICAgICBsZWZ0OiB0aGlzLFxuICAgICAgcmlnaHQ6IG5vcm1hbGl6ZVZhbHVlKHgpXG4gICAgfSk7XG4gIH1cbiAgbmUoeCkge1xuICAgIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoe1xuICAgICAgdHlwZTogXCJuZVwiLFxuICAgICAgbGVmdDogdGhpcyxcbiAgICAgIHJpZ2h0OiBub3JtYWxpemVWYWx1ZSh4KVxuICAgIH0pO1xuICB9XG4gIGx0KHgpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xlYW5FeHByKHtcbiAgICAgIHR5cGU6IFwibHRcIixcbiAgICAgIGxlZnQ6IHRoaXMsXG4gICAgICByaWdodDogbm9ybWFsaXplVmFsdWUoeClcbiAgICB9KTtcbiAgfVxuICBsdGUoeCkge1xuICAgIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoe1xuICAgICAgdHlwZTogXCJsdGVcIixcbiAgICAgIGxlZnQ6IHRoaXMsXG4gICAgICByaWdodDogbm9ybWFsaXplVmFsdWUoeClcbiAgICB9KTtcbiAgfVxuICBndCh4KSB7XG4gICAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgICB0eXBlOiBcImd0XCIsXG4gICAgICBsZWZ0OiB0aGlzLFxuICAgICAgcmlnaHQ6IG5vcm1hbGl6ZVZhbHVlKHgpXG4gICAgfSk7XG4gIH1cbiAgZ3RlKHgpIHtcbiAgICByZXR1cm4gbmV3IEJvb2xlYW5FeHByKHtcbiAgICAgIHR5cGU6IFwiZ3RlXCIsXG4gICAgICBsZWZ0OiB0aGlzLFxuICAgICAgcmlnaHQ6IG5vcm1hbGl6ZVZhbHVlKHgpXG4gICAgfSk7XG4gIH1cbn07XG5mdW5jdGlvbiBsaXRlcmFsKHZhbHVlKSB7XG4gIHJldHVybiB7IHR5cGU6IFwibGl0ZXJhbFwiLCB2YWx1ZSB9O1xufVxuZnVuY3Rpb24gbm9ybWFsaXplVmFsdWUodmFsKSB7XG4gIGlmICh2YWwudHlwZSA9PT0gXCJsaXRlcmFsXCIpXG4gICAgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiB2YWwgPT09IFwib2JqZWN0XCIgJiYgdmFsICE9IG51bGwgJiYgXCJ0eXBlXCIgaW4gdmFsICYmIHZhbC50eXBlID09PSBcImNvbHVtblwiKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICByZXR1cm4gbGl0ZXJhbCh2YWwpO1xufVxuZnVuY3Rpb24gbm9ybWFsaXplUHJlZGljYXRlRXhwcih2YWx1ZSkge1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBCb29sZWFuRXhwcikgcmV0dXJuIHZhbHVlO1xuICBpZiAodHlwZW9mIHZhbHVlID09PSBcImJvb2xlYW5cIikge1xuICAgIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoe1xuICAgICAgdHlwZTogXCJlcVwiLFxuICAgICAgbGVmdDogbGl0ZXJhbCh2YWx1ZSksXG4gICAgICByaWdodDogbGl0ZXJhbCh0cnVlKVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoe1xuICAgIHR5cGU6IFwiZXFcIixcbiAgICBsZWZ0OiB2YWx1ZSxcbiAgICByaWdodDogbGl0ZXJhbCh0cnVlKVxuICB9KTtcbn1cbnZhciBCb29sZWFuRXhwciA9IGNsYXNzIF9Cb29sZWFuRXhwciB7XG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICB9XG4gIGFuZChvdGhlcikge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5FeHByKHsgdHlwZTogXCJhbmRcIiwgY2xhdXNlczogW3RoaXMuZGF0YSwgb3RoZXIuZGF0YV0gfSk7XG4gIH1cbiAgb3Iob3RoZXIpIHtcbiAgICByZXR1cm4gbmV3IF9Cb29sZWFuRXhwcih7IHR5cGU6IFwib3JcIiwgY2xhdXNlczogW3RoaXMuZGF0YSwgb3RoZXIuZGF0YV0gfSk7XG4gIH1cbiAgbm90KCkge1xuICAgIHJldHVybiBuZXcgX0Jvb2xlYW5FeHByKHsgdHlwZTogXCJub3RcIiwgY2xhdXNlOiB0aGlzLmRhdGEgfSk7XG4gIH1cbn07XG5mdW5jdGlvbiBub3QoY2xhdXNlKSB7XG4gIHJldHVybiBuZXcgQm9vbGVhbkV4cHIoeyB0eXBlOiBcIm5vdFwiLCBjbGF1c2U6IGNsYXVzZS5kYXRhIH0pO1xufVxuZnVuY3Rpb24gYW5kKC4uLmNsYXVzZXMpIHtcbiAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgdHlwZTogXCJhbmRcIixcbiAgICBjbGF1c2VzOiBjbGF1c2VzLm1hcCgoYykgPT4gYy5kYXRhKVxuICB9KTtcbn1cbmZ1bmN0aW9uIG9yKC4uLmNsYXVzZXMpIHtcbiAgcmV0dXJuIG5ldyBCb29sZWFuRXhwcih7XG4gICAgdHlwZTogXCJvclwiLFxuICAgIGNsYXVzZXM6IGNsYXVzZXMubWFwKChjKSA9PiBjLmRhdGEpXG4gIH0pO1xufVxuZnVuY3Rpb24gYm9vbGVhbkV4cHJUb1NxbChleHByLCB0YWJsZUFsaWFzKSB7XG4gIGNvbnN0IGRhdGEgPSBleHByIGluc3RhbmNlb2YgQm9vbGVhbkV4cHIgPyBleHByLmRhdGEgOiBleHByO1xuICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgIGNhc2UgXCJlcVwiOlxuICAgICAgcmV0dXJuIGAke3ZhbHVlRXhwclRvU3FsKGRhdGEubGVmdCl9ID0gJHt2YWx1ZUV4cHJUb1NxbChkYXRhLnJpZ2h0KX1gO1xuICAgIGNhc2UgXCJuZVwiOlxuICAgICAgcmV0dXJuIGAke3ZhbHVlRXhwclRvU3FsKGRhdGEubGVmdCl9IDw+ICR7dmFsdWVFeHByVG9TcWwoZGF0YS5yaWdodCl9YDtcbiAgICBjYXNlIFwiZ3RcIjpcbiAgICAgIHJldHVybiBgJHt2YWx1ZUV4cHJUb1NxbChkYXRhLmxlZnQpfSA+ICR7dmFsdWVFeHByVG9TcWwoZGF0YS5yaWdodCl9YDtcbiAgICBjYXNlIFwiZ3RlXCI6XG4gICAgICByZXR1cm4gYCR7dmFsdWVFeHByVG9TcWwoZGF0YS5sZWZ0KX0gPj0gJHt2YWx1ZUV4cHJUb1NxbChkYXRhLnJpZ2h0KX1gO1xuICAgIGNhc2UgXCJsdFwiOlxuICAgICAgcmV0dXJuIGAke3ZhbHVlRXhwclRvU3FsKGRhdGEubGVmdCl9IDwgJHt2YWx1ZUV4cHJUb1NxbChkYXRhLnJpZ2h0KX1gO1xuICAgIGNhc2UgXCJsdGVcIjpcbiAgICAgIHJldHVybiBgJHt2YWx1ZUV4cHJUb1NxbChkYXRhLmxlZnQpfSA8PSAke3ZhbHVlRXhwclRvU3FsKGRhdGEucmlnaHQpfWA7XG4gICAgY2FzZSBcImFuZFwiOlxuICAgICAgcmV0dXJuIGRhdGEuY2xhdXNlcy5tYXAoKGMpID0+IGJvb2xlYW5FeHByVG9TcWwoYykpLm1hcCh3cmFwSW5QYXJlbnMpLmpvaW4oXCIgQU5EIFwiKTtcbiAgICBjYXNlIFwib3JcIjpcbiAgICAgIHJldHVybiBkYXRhLmNsYXVzZXMubWFwKChjKSA9PiBib29sZWFuRXhwclRvU3FsKGMpKS5tYXAod3JhcEluUGFyZW5zKS5qb2luKFwiIE9SIFwiKTtcbiAgICBjYXNlIFwibm90XCI6XG4gICAgICByZXR1cm4gYE5PVCAke3dyYXBJblBhcmVucyhib29sZWFuRXhwclRvU3FsKGRhdGEuY2xhdXNlKSl9YDtcbiAgfVxufVxuZnVuY3Rpb24gd3JhcEluUGFyZW5zKHNxbCkge1xuICByZXR1cm4gYCgke3NxbH0pYDtcbn1cbmZ1bmN0aW9uIHZhbHVlRXhwclRvU3FsKGV4cHIsIHRhYmxlQWxpYXMpIHtcbiAgaWYgKGlzTGl0ZXJhbEV4cHIoZXhwcikpIHtcbiAgICByZXR1cm4gbGl0ZXJhbFZhbHVlVG9TcWwoZXhwci52YWx1ZSk7XG4gIH1cbiAgY29uc3QgdGFibGUyID0gZXhwci50YWJsZTtcbiAgcmV0dXJuIGAke3F1b3RlSWRlbnRpZmllcih0YWJsZTIpfS4ke3F1b3RlSWRlbnRpZmllcihleHByLmNvbHVtbil9YDtcbn1cbmZ1bmN0aW9uIGxpdGVyYWxWYWx1ZVRvU3FsKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgcmV0dXJuIFwiTlVMTFwiO1xuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIElkZW50aXR5IHx8IHZhbHVlIGluc3RhbmNlb2YgQ29ubmVjdGlvbklkKSB7XG4gICAgcmV0dXJuIGAweCR7dmFsdWUudG9IZXhTdHJpbmcoKX1gO1xuICB9XG4gIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFRpbWVzdGFtcCkge1xuICAgIHJldHVybiBgJyR7dmFsdWUudG9JU09TdHJpbmcoKX0nYDtcbiAgfVxuICBzd2l0Y2ggKHR5cGVvZiB2YWx1ZSkge1xuICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICByZXR1cm4gU3RyaW5nKHZhbHVlKTtcbiAgICBjYXNlIFwiYm9vbGVhblwiOlxuICAgICAgcmV0dXJuIHZhbHVlID8gXCJUUlVFXCIgOiBcIkZBTFNFXCI7XG4gICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgcmV0dXJuIGAnJHt2YWx1ZS5yZXBsYWNlKC8nL2csIFwiJydcIil9J2A7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBgJyR7SlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoLycvZywgXCInJ1wiKX0nYDtcbiAgfVxufVxuZnVuY3Rpb24gcXVvdGVJZGVudGlmaWVyKG5hbWUpIHtcbiAgcmV0dXJuIGBcIiR7bmFtZS5yZXBsYWNlKC9cIi9nLCAnXCJcIicpfVwiYDtcbn1cbmZ1bmN0aW9uIGlzTGl0ZXJhbEV4cHIoZXhwcikge1xuICByZXR1cm4gZXhwci50eXBlID09PSBcImxpdGVyYWxcIjtcbn1cbmZ1bmN0aW9uIGV2YWx1YXRlQm9vbGVhbkV4cHIoZXhwciwgcm93KSB7XG4gIHJldHVybiBldmFsdWF0ZURhdGEoZXhwci5kYXRhLCByb3cpO1xufVxuZnVuY3Rpb24gZXZhbHVhdGVEYXRhKGRhdGEsIHJvdykge1xuICBzd2l0Y2ggKGRhdGEudHlwZSkge1xuICAgIGNhc2UgXCJlcVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgPT09IHJlc29sdmVWYWx1ZShkYXRhLnJpZ2h0LCByb3cpO1xuICAgIGNhc2UgXCJuZVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgIT09IHJlc29sdmVWYWx1ZShkYXRhLnJpZ2h0LCByb3cpO1xuICAgIGNhc2UgXCJndFwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgPiByZXNvbHZlVmFsdWUoZGF0YS5yaWdodCwgcm93KTtcbiAgICBjYXNlIFwiZ3RlXCI6XG4gICAgICByZXR1cm4gcmVzb2x2ZVZhbHVlKGRhdGEubGVmdCwgcm93KSA+PSByZXNvbHZlVmFsdWUoZGF0YS5yaWdodCwgcm93KTtcbiAgICBjYXNlIFwibHRcIjpcbiAgICAgIHJldHVybiByZXNvbHZlVmFsdWUoZGF0YS5sZWZ0LCByb3cpIDwgcmVzb2x2ZVZhbHVlKGRhdGEucmlnaHQsIHJvdyk7XG4gICAgY2FzZSBcImx0ZVwiOlxuICAgICAgcmV0dXJuIHJlc29sdmVWYWx1ZShkYXRhLmxlZnQsIHJvdykgPD0gcmVzb2x2ZVZhbHVlKGRhdGEucmlnaHQsIHJvdyk7XG4gICAgY2FzZSBcImFuZFwiOlxuICAgICAgcmV0dXJuIGRhdGEuY2xhdXNlcy5ldmVyeSgoYykgPT4gZXZhbHVhdGVEYXRhKGMsIHJvdykpO1xuICAgIGNhc2UgXCJvclwiOlxuICAgICAgcmV0dXJuIGRhdGEuY2xhdXNlcy5zb21lKChjKSA9PiBldmFsdWF0ZURhdGEoYywgcm93KSk7XG4gICAgY2FzZSBcIm5vdFwiOlxuICAgICAgcmV0dXJuICFldmFsdWF0ZURhdGEoZGF0YS5jbGF1c2UsIHJvdyk7XG4gIH1cbn1cbmZ1bmN0aW9uIHJlc29sdmVWYWx1ZShleHByLCByb3cpIHtcbiAgaWYgKGlzTGl0ZXJhbEV4cHIoZXhwcikpIHtcbiAgICByZXR1cm4gdG9Db21wYXJhYmxlVmFsdWUoZXhwci52YWx1ZSk7XG4gIH1cbiAgcmV0dXJuIHRvQ29tcGFyYWJsZVZhbHVlKHJvd1tleHByLmNvbHVtbl0pO1xufVxuZnVuY3Rpb24gaXNIZXhTZXJpYWxpemFibGVMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgdmFsdWUudG9IZXhTdHJpbmcgPT09IFwiZnVuY3Rpb25cIjtcbn1cbmZ1bmN0aW9uIGlzVGltZXN0YW1wTGlrZSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIikgcmV0dXJuIGZhbHNlO1xuICBpZiAodmFsdWUgaW5zdGFuY2VvZiBUaW1lc3RhbXApIHJldHVybiB0cnVlO1xuICBjb25zdCBtaWNyb3MgPSB2YWx1ZVtcIl9fdGltZXN0YW1wX21pY3Jvc19zaW5jZV91bml4X2Vwb2NoX19cIl07XG4gIHJldHVybiB0eXBlb2YgbWljcm9zID09PSBcImJpZ2ludFwiO1xufVxuZnVuY3Rpb24gdG9Db21wYXJhYmxlVmFsdWUodmFsdWUpIHtcbiAgaWYgKGlzSGV4U2VyaWFsaXphYmxlTGlrZSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gdmFsdWUudG9IZXhTdHJpbmcoKTtcbiAgfVxuICBpZiAoaXNUaW1lc3RhbXBMaWtlKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZS5fX3RpbWVzdGFtcF9taWNyb3Nfc2luY2VfdW5peF9lcG9jaF9fO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cbmZ1bmN0aW9uIGdldFF1ZXJ5VGFibGVOYW1lKHF1ZXJ5KSB7XG4gIGlmIChxdWVyeS50YWJsZSkgcmV0dXJuIHF1ZXJ5LnRhYmxlLm5hbWU7XG4gIGlmIChxdWVyeS5uYW1lKSByZXR1cm4gcXVlcnkubmFtZTtcbiAgaWYgKHF1ZXJ5LnNvdXJjZVF1ZXJ5KSByZXR1cm4gcXVlcnkuc291cmNlUXVlcnkudGFibGUubmFtZTtcbiAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGV4dHJhY3QgdGFibGUgbmFtZSBmcm9tIHF1ZXJ5XCIpO1xufVxuZnVuY3Rpb24gZ2V0UXVlcnlBY2Nlc3Nvck5hbWUocXVlcnkpIHtcbiAgaWYgKHF1ZXJ5LnRhYmxlKSByZXR1cm4gcXVlcnkudGFibGUuYWNjZXNzb3JOYW1lO1xuICBpZiAocXVlcnkuYWNjZXNzb3JOYW1lKSByZXR1cm4gcXVlcnkuYWNjZXNzb3JOYW1lO1xuICBpZiAocXVlcnkuc291cmNlUXVlcnkpIHJldHVybiBxdWVyeS5zb3VyY2VRdWVyeS50YWJsZS5hY2Nlc3Nvck5hbWU7XG4gIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBleHRyYWN0IGFjY2Vzc29yIG5hbWUgZnJvbSBxdWVyeVwiKTtcbn1cbmZ1bmN0aW9uIGdldFF1ZXJ5V2hlcmVDbGF1c2UocXVlcnkpIHtcbiAgaWYgKHF1ZXJ5LndoZXJlQ2xhdXNlKSByZXR1cm4gcXVlcnkud2hlcmVDbGF1c2U7XG4gIHJldHVybiB2b2lkIDA7XG59XG5cbi8vIHNyYy9zZXJ2ZXIvdmlld3MudHNcbmZ1bmN0aW9uIG1ha2VWaWV3RXhwb3J0KGN0eCwgb3B0cywgcGFyYW1zLCByZXQsIGZuKSB7XG4gIGNvbnN0IHZpZXdFeHBvcnQgPSAoXG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvciB0eXBlc2NyaXB0IGluY29ycmVjdGx5IHNheXMgRnVuY3Rpb24jYmluZCByZXF1aXJlcyBhbiBhcmd1bWVudC5cbiAgICBmbi5iaW5kKClcbiAgKTtcbiAgdmlld0V4cG9ydFtleHBvcnRDb250ZXh0XSA9IGN0eDtcbiAgdmlld0V4cG9ydFtyZWdpc3RlckV4cG9ydF0gPSAoY3R4MiwgZXhwb3J0TmFtZSkgPT4ge1xuICAgIHJlZ2lzdGVyVmlldyhjdHgyLCBvcHRzLCBleHBvcnROYW1lLCBmYWxzZSwgcGFyYW1zLCByZXQsIGZuKTtcbiAgfTtcbiAgcmV0dXJuIHZpZXdFeHBvcnQ7XG59XG5mdW5jdGlvbiBtYWtlQW5vblZpZXdFeHBvcnQoY3R4LCBvcHRzLCBwYXJhbXMsIHJldCwgZm4pIHtcbiAgY29uc3Qgdmlld0V4cG9ydCA9IChcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yIHR5cGVzY3JpcHQgaW5jb3JyZWN0bHkgc2F5cyBGdW5jdGlvbiNiaW5kIHJlcXVpcmVzIGFuIGFyZ3VtZW50LlxuICAgIGZuLmJpbmQoKVxuICApO1xuICB2aWV3RXhwb3J0W2V4cG9ydENvbnRleHRdID0gY3R4O1xuICB2aWV3RXhwb3J0W3JlZ2lzdGVyRXhwb3J0XSA9IChjdHgyLCBleHBvcnROYW1lKSA9PiB7XG4gICAgcmVnaXN0ZXJWaWV3KGN0eDIsIG9wdHMsIGV4cG9ydE5hbWUsIHRydWUsIHBhcmFtcywgcmV0LCBmbik7XG4gIH07XG4gIHJldHVybiB2aWV3RXhwb3J0O1xufVxuZnVuY3Rpb24gcmVnaXN0ZXJWaWV3KGN0eCwgb3B0cywgZXhwb3J0TmFtZSwgYW5vbiwgcGFyYW1zLCByZXQsIGZuKSB7XG4gIGNvbnN0IHBhcmFtc0J1aWxkZXIgPSBuZXcgUm93QnVpbGRlcihwYXJhbXMsIHRvUGFzY2FsQ2FzZShleHBvcnROYW1lKSk7XG4gIGxldCByZXR1cm5UeXBlID0gY3R4LnJlZ2lzdGVyVHlwZXNSZWN1cnNpdmVseShyZXQpLmFsZ2VicmFpY1R5cGU7XG4gIGNvbnN0IHsgdHlwZXNwYWNlIH0gPSBjdHg7XG4gIGNvbnN0IHsgdmFsdWU6IHBhcmFtVHlwZSB9ID0gY3R4LnJlc29sdmVUeXBlKFxuICAgIGN0eC5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkocGFyYW1zQnVpbGRlcilcbiAgKTtcbiAgY3R4Lm1vZHVsZURlZi52aWV3cy5wdXNoKHtcbiAgICBzb3VyY2VOYW1lOiBleHBvcnROYW1lLFxuICAgIGluZGV4OiAoYW5vbiA/IGN0eC5hbm9uVmlld3MgOiBjdHgudmlld3MpLmxlbmd0aCxcbiAgICBpc1B1YmxpYzogb3B0cy5wdWJsaWMsXG4gICAgaXNBbm9ueW1vdXM6IGFub24sXG4gICAgcGFyYW1zOiBwYXJhbVR5cGUsXG4gICAgcmV0dXJuVHlwZVxuICB9KTtcbiAgaWYgKG9wdHMubmFtZSAhPSBudWxsKSB7XG4gICAgY3R4Lm1vZHVsZURlZi5leHBsaWNpdE5hbWVzLmVudHJpZXMucHVzaCh7XG4gICAgICB0YWc6IFwiRnVuY3Rpb25cIixcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHNvdXJjZU5hbWU6IGV4cG9ydE5hbWUsXG4gICAgICAgIGNhbm9uaWNhbE5hbWU6IG9wdHMubmFtZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChyZXR1cm5UeXBlLnRhZyA9PSBcIlN1bVwiKSB7XG4gICAgY29uc3Qgb3JpZ2luYWxGbiA9IGZuO1xuICAgIGZuID0gKChjdHgyLCBhcmdzKSA9PiB7XG4gICAgICBjb25zdCByZXQyID0gb3JpZ2luYWxGbihjdHgyLCBhcmdzKTtcbiAgICAgIHJldHVybiByZXQyID09IG51bGwgPyBbXSA6IFtyZXQyXTtcbiAgICB9KTtcbiAgICByZXR1cm5UeXBlID0gQWxnZWJyYWljVHlwZS5BcnJheShcbiAgICAgIHJldHVyblR5cGUudmFsdWUudmFyaWFudHNbMF0uYWxnZWJyYWljVHlwZVxuICAgICk7XG4gIH1cbiAgKGFub24gPyBjdHguYW5vblZpZXdzIDogY3R4LnZpZXdzKS5wdXNoKHtcbiAgICBmbixcbiAgICBkZXNlcmlhbGl6ZVBhcmFtczogUHJvZHVjdFR5cGUubWFrZURlc2VyaWFsaXplcihwYXJhbVR5cGUsIHR5cGVzcGFjZSksXG4gICAgc2VyaWFsaXplUmV0dXJuOiBBbGdlYnJhaWNUeXBlLm1ha2VTZXJpYWxpemVyKHJldHVyblR5cGUsIHR5cGVzcGFjZSksXG4gICAgcmV0dXJuVHlwZUJhc2VTaXplOiBic2F0bkJhc2VTaXplKHR5cGVzcGFjZSwgcmV0dXJuVHlwZSlcbiAgfSk7XG59XG5cbi8vIHNyYy9saWIvZXJyb3JzLnRzXG52YXIgU2VuZGVyRXJyb3IgPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcbiAgY29uc3RydWN0b3IobWVzc2FnZSkge1xuICAgIHN1cGVyKG1lc3NhZ2UpO1xuICB9XG4gIGdldCBuYW1lKCkge1xuICAgIHJldHVybiBcIlNlbmRlckVycm9yXCI7XG4gIH1cbn07XG5cbi8vIHNyYy9zZXJ2ZXIvZXJyb3JzLnRzXG52YXIgU3BhY2V0aW1lSG9zdEVycm9yID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcihtZXNzYWdlKTtcbiAgfVxuICBnZXQgbmFtZSgpIHtcbiAgICByZXR1cm4gXCJTcGFjZXRpbWVIb3N0RXJyb3JcIjtcbiAgfVxufTtcbnZhciBlcnJvckRhdGEgPSB7XG4gIC8qKlxuICAgKiBBIGdlbmVyaWMgZXJyb3IgY2xhc3MgZm9yIHVua25vd24gZXJyb3IgY29kZXMuXG4gICAqL1xuICBIb3N0Q2FsbEZhaWx1cmU6IDEsXG4gIC8qKlxuICAgKiBFcnJvciBpbmRpY2F0aW5nIHRoYXQgYW4gQUJJIGNhbGwgd2FzIG1hZGUgb3V0c2lkZSBvZiBhIHRyYW5zYWN0aW9uLlxuICAgKi9cbiAgTm90SW5UcmFuc2FjdGlvbjogMixcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBCU0FUTiBkZWNvZGluZyBmYWlsZWQuXG4gICAqIFRoaXMgdHlwaWNhbGx5IG1lYW5zIHRoYXQgdGhlIGRhdGEgY291bGQgbm90IGJlIGRlY29kZWQgdG8gdGhlIGV4cGVjdGVkIHR5cGUuXG4gICAqL1xuICBCc2F0bkRlY29kZUVycm9yOiAzLFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgc3BlY2lmaWVkIHRhYmxlIGRvZXMgbm90IGV4aXN0LlxuICAgKi9cbiAgTm9TdWNoVGFibGU6IDQsXG4gIC8qKlxuICAgKiBFcnJvciBpbmRpY2F0aW5nIHRoYXQgYSBzcGVjaWZpZWQgaW5kZXggZG9lcyBub3QgZXhpc3QuXG4gICAqL1xuICBOb1N1Y2hJbmRleDogNSxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhIHNwZWNpZmllZCByb3cgaXRlcmF0b3IgaXMgbm90IHZhbGlkLlxuICAgKi9cbiAgTm9TdWNoSXRlcjogNixcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhIHNwZWNpZmllZCBjb25zb2xlIHRpbWVyIGRvZXMgbm90IGV4aXN0LlxuICAgKi9cbiAgTm9TdWNoQ29uc29sZVRpbWVyOiA3LFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgc3BlY2lmaWVkIGJ5dGVzIHNvdXJjZSBvciBzaW5rIGlzIG5vdCB2YWxpZC5cbiAgICovXG4gIE5vU3VjaEJ5dGVzOiA4LFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IGEgcHJvdmlkZWQgc2luayBoYXMgbm8gbW9yZSBzcGFjZSBsZWZ0LlxuICAgKi9cbiAgTm9TcGFjZTogOSxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCB0aGVyZSBpcyBubyBtb3JlIHNwYWNlIGluIHRoZSBkYXRhYmFzZS5cbiAgICovXG4gIEJ1ZmZlclRvb1NtYWxsOiAxMSxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhIHZhbHVlIHdpdGggYSBnaXZlbiB1bmlxdWUgaWRlbnRpZmllciBhbHJlYWR5IGV4aXN0cy5cbiAgICovXG4gIFVuaXF1ZUFscmVhZHlFeGlzdHM6IDEyLFxuICAvKipcbiAgICogRXJyb3IgaW5kaWNhdGluZyB0aGF0IHRoZSBzcGVjaWZpZWQgZGVsYXkgaW4gc2NoZWR1bGluZyBhIHJvdyB3YXMgdG9vIGxvbmcuXG4gICAqL1xuICBTY2hlZHVsZUF0RGVsYXlUb29Mb25nOiAxMyxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhbiBpbmRleCB3YXMgbm90IHVuaXF1ZSB3aGVuIGl0IHdhcyBleHBlY3RlZCB0byBiZS5cbiAgICovXG4gIEluZGV4Tm90VW5pcXVlOiAxNCxcbiAgLyoqXG4gICAqIEVycm9yIGluZGljYXRpbmcgdGhhdCBhbiBpbmRleCB3YXMgbm90IHVuaXF1ZSB3aGVuIGl0IHdhcyBleHBlY3RlZCB0byBiZS5cbiAgICovXG4gIE5vU3VjaFJvdzogMTUsXG4gIC8qKlxuICAgKiBFcnJvciBpbmRpY2F0aW5nIHRoYXQgYW4gYXV0by1pbmNyZW1lbnQgc2VxdWVuY2UgaGFzIG92ZXJmbG93ZWQuXG4gICAqL1xuICBBdXRvSW5jT3ZlcmZsb3c6IDE2LFxuICBXb3VsZEJsb2NrVHJhbnNhY3Rpb246IDE3LFxuICBUcmFuc2FjdGlvbk5vdEFub255bW91czogMTgsXG4gIFRyYW5zYWN0aW9uSXNSZWFkT25seTogMTksXG4gIFRyYW5zYWN0aW9uSXNNdXQ6IDIwLFxuICBIdHRwRXJyb3I6IDIxXG59O1xuZnVuY3Rpb24gbWFwRW50cmllcyh4LCBmKSB7XG4gIHJldHVybiBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgT2JqZWN0LmVudHJpZXMoeCkubWFwKChbaywgdl0pID0+IFtrLCBmKGssIHYpXSlcbiAgKTtcbn1cbnZhciBlcnJub1RvQ2xhc3MgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xudmFyIGVycm9ycyA9IE9iamVjdC5mcmVlemUoXG4gIG1hcEVudHJpZXMoZXJyb3JEYXRhLCAobmFtZSwgY29kZSkgPT4ge1xuICAgIGNvbnN0IGNscyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShcbiAgICAgIGNsYXNzIGV4dGVuZHMgU3BhY2V0aW1lSG9zdEVycm9yIHtcbiAgICAgICAgZ2V0IG5hbWUoKSB7XG4gICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIm5hbWVcIixcbiAgICAgIHsgdmFsdWU6IG5hbWUsIHdyaXRhYmxlOiBmYWxzZSB9XG4gICAgKTtcbiAgICBlcnJub1RvQ2xhc3Muc2V0KGNvZGUsIGNscyk7XG4gICAgcmV0dXJuIGNscztcbiAgfSlcbik7XG5mdW5jdGlvbiBnZXRFcnJvckNvbnN0cnVjdG9yKGNvZGUpIHtcbiAgcmV0dXJuIGVycm5vVG9DbGFzcy5nZXQoY29kZSkgPz8gU3BhY2V0aW1lSG9zdEVycm9yO1xufVxuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHVyZS1yYW5kQDcuMC4xL25vZGVfbW9kdWxlcy9wdXJlLXJhbmQvbGliL2VzbS9kaXN0cmlidXRpb24vVW5zYWZlVW5pZm9ybUJpZ0ludERpc3RyaWJ1dGlvbi5qc1xudmFyIFNCaWdJbnQgPSB0eXBlb2YgQmlnSW50ICE9PSBcInVuZGVmaW5lZFwiID8gQmlnSW50IDogdm9pZCAwO1xudmFyIE9uZSA9IHR5cGVvZiBCaWdJbnQgIT09IFwidW5kZWZpbmVkXCIgPyBCaWdJbnQoMSkgOiB2b2lkIDA7XG52YXIgVGhpcnR5VHdvID0gdHlwZW9mIEJpZ0ludCAhPT0gXCJ1bmRlZmluZWRcIiA/IEJpZ0ludCgzMikgOiB2b2lkIDA7XG52YXIgTnVtVmFsdWVzID0gdHlwZW9mIEJpZ0ludCAhPT0gXCJ1bmRlZmluZWRcIiA/IEJpZ0ludCg0Mjk0OTY3Mjk2KSA6IHZvaWQgMDtcbmZ1bmN0aW9uIHVuc2FmZVVuaWZvcm1CaWdJbnREaXN0cmlidXRpb24oZnJvbSwgdG8sIHJuZykge1xuICB2YXIgZGlmZiA9IHRvIC0gZnJvbSArIE9uZTtcbiAgdmFyIEZpbmFsTnVtVmFsdWVzID0gTnVtVmFsdWVzO1xuICB2YXIgTnVtSXRlcmF0aW9ucyA9IDE7XG4gIHdoaWxlIChGaW5hbE51bVZhbHVlcyA8IGRpZmYpIHtcbiAgICBGaW5hbE51bVZhbHVlcyA8PD0gVGhpcnR5VHdvO1xuICAgICsrTnVtSXRlcmF0aW9ucztcbiAgfVxuICB2YXIgdmFsdWUgPSBnZW5lcmF0ZU5leHQoTnVtSXRlcmF0aW9ucywgcm5nKTtcbiAgaWYgKHZhbHVlIDwgZGlmZikge1xuICAgIHJldHVybiB2YWx1ZSArIGZyb207XG4gIH1cbiAgaWYgKHZhbHVlICsgZGlmZiA8IEZpbmFsTnVtVmFsdWVzKSB7XG4gICAgcmV0dXJuIHZhbHVlICUgZGlmZiArIGZyb207XG4gIH1cbiAgdmFyIE1heEFjY2VwdGVkUmFuZG9tID0gRmluYWxOdW1WYWx1ZXMgLSBGaW5hbE51bVZhbHVlcyAlIGRpZmY7XG4gIHdoaWxlICh2YWx1ZSA+PSBNYXhBY2NlcHRlZFJhbmRvbSkge1xuICAgIHZhbHVlID0gZ2VuZXJhdGVOZXh0KE51bUl0ZXJhdGlvbnMsIHJuZyk7XG4gIH1cbiAgcmV0dXJuIHZhbHVlICUgZGlmZiArIGZyb207XG59XG5mdW5jdGlvbiBnZW5lcmF0ZU5leHQoTnVtSXRlcmF0aW9ucywgcm5nKSB7XG4gIHZhciB2YWx1ZSA9IFNCaWdJbnQocm5nLnVuc2FmZU5leHQoKSArIDIxNDc0ODM2NDgpO1xuICBmb3IgKHZhciBudW0gPSAxOyBudW0gPCBOdW1JdGVyYXRpb25zOyArK251bSkge1xuICAgIHZhciBvdXQgPSBybmcudW5zYWZlTmV4dCgpO1xuICAgIHZhbHVlID0gKHZhbHVlIDw8IFRoaXJ0eVR3bykgKyBTQmlnSW50KG91dCArIDIxNDc0ODM2NDgpO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3B1cmUtcmFuZEA3LjAuMS9ub2RlX21vZHVsZXMvcHVyZS1yYW5kL2xpYi9lc20vZGlzdHJpYnV0aW9uL2ludGVybmFscy9VbnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uSW50ZXJuYWwuanNcbmZ1bmN0aW9uIHVuc2FmZVVuaWZvcm1JbnREaXN0cmlidXRpb25JbnRlcm5hbChyYW5nZVNpemUsIHJuZykge1xuICB2YXIgTWF4QWxsb3dlZCA9IHJhbmdlU2l6ZSA+IDIgPyB+fig0Mjk0OTY3Mjk2IC8gcmFuZ2VTaXplKSAqIHJhbmdlU2l6ZSA6IDQyOTQ5NjcyOTY7XG4gIHZhciBkZWx0YVYgPSBybmcudW5zYWZlTmV4dCgpICsgMjE0NzQ4MzY0ODtcbiAgd2hpbGUgKGRlbHRhViA+PSBNYXhBbGxvd2VkKSB7XG4gICAgZGVsdGFWID0gcm5nLnVuc2FmZU5leHQoKSArIDIxNDc0ODM2NDg7XG4gIH1cbiAgcmV0dXJuIGRlbHRhViAlIHJhbmdlU2l6ZTtcbn1cblxuLy8gLi4vLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3B1cmUtcmFuZEA3LjAuMS9ub2RlX21vZHVsZXMvcHVyZS1yYW5kL2xpYi9lc20vZGlzdHJpYnV0aW9uL2ludGVybmFscy9BcnJheUludDY0LmpzXG5mdW5jdGlvbiBmcm9tTnVtYmVyVG9BcnJheUludDY0KG91dCwgbikge1xuICBpZiAobiA8IDApIHtcbiAgICB2YXIgcG9zTiA9IC1uO1xuICAgIG91dC5zaWduID0gLTE7XG4gICAgb3V0LmRhdGFbMF0gPSB+fihwb3NOIC8gNDI5NDk2NzI5Nik7XG4gICAgb3V0LmRhdGFbMV0gPSBwb3NOID4+PiAwO1xuICB9IGVsc2Uge1xuICAgIG91dC5zaWduID0gMTtcbiAgICBvdXQuZGF0YVswXSA9IH5+KG4gLyA0Mjk0OTY3Mjk2KTtcbiAgICBvdXQuZGF0YVsxXSA9IG4gPj4+IDA7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbmZ1bmN0aW9uIHN1YnN0cmFjdEFycmF5SW50NjQob3V0LCBhcnJheUludEEsIGFycmF5SW50Qikge1xuICB2YXIgbG93QSA9IGFycmF5SW50QS5kYXRhWzFdO1xuICB2YXIgaGlnaEEgPSBhcnJheUludEEuZGF0YVswXTtcbiAgdmFyIHNpZ25BID0gYXJyYXlJbnRBLnNpZ247XG4gIHZhciBsb3dCID0gYXJyYXlJbnRCLmRhdGFbMV07XG4gIHZhciBoaWdoQiA9IGFycmF5SW50Qi5kYXRhWzBdO1xuICB2YXIgc2lnbkIgPSBhcnJheUludEIuc2lnbjtcbiAgb3V0LnNpZ24gPSAxO1xuICBpZiAoc2lnbkEgPT09IDEgJiYgc2lnbkIgPT09IC0xKSB7XG4gICAgdmFyIGxvd18xID0gbG93QSArIGxvd0I7XG4gICAgdmFyIGhpZ2ggPSBoaWdoQSArIGhpZ2hCICsgKGxvd18xID4gNDI5NDk2NzI5NSA/IDEgOiAwKTtcbiAgICBvdXQuZGF0YVswXSA9IGhpZ2ggPj4+IDA7XG4gICAgb3V0LmRhdGFbMV0gPSBsb3dfMSA+Pj4gMDtcbiAgICByZXR1cm4gb3V0O1xuICB9XG4gIHZhciBsb3dGaXJzdCA9IGxvd0E7XG4gIHZhciBoaWdoRmlyc3QgPSBoaWdoQTtcbiAgdmFyIGxvd1NlY29uZCA9IGxvd0I7XG4gIHZhciBoaWdoU2Vjb25kID0gaGlnaEI7XG4gIGlmIChzaWduQSA9PT0gLTEpIHtcbiAgICBsb3dGaXJzdCA9IGxvd0I7XG4gICAgaGlnaEZpcnN0ID0gaGlnaEI7XG4gICAgbG93U2Vjb25kID0gbG93QTtcbiAgICBoaWdoU2Vjb25kID0gaGlnaEE7XG4gIH1cbiAgdmFyIHJlbWluZGVyTG93ID0gMDtcbiAgdmFyIGxvdyA9IGxvd0ZpcnN0IC0gbG93U2Vjb25kO1xuICBpZiAobG93IDwgMCkge1xuICAgIHJlbWluZGVyTG93ID0gMTtcbiAgICBsb3cgPSBsb3cgPj4+IDA7XG4gIH1cbiAgb3V0LmRhdGFbMF0gPSBoaWdoRmlyc3QgLSBoaWdoU2Vjb25kIC0gcmVtaW5kZXJMb3c7XG4gIG91dC5kYXRhWzFdID0gbG93O1xuICByZXR1cm4gb3V0O1xufVxuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHVyZS1yYW5kQDcuMC4xL25vZGVfbW9kdWxlcy9wdXJlLXJhbmQvbGliL2VzbS9kaXN0cmlidXRpb24vaW50ZXJuYWxzL1Vuc2FmZVVuaWZvcm1BcnJheUludERpc3RyaWJ1dGlvbkludGVybmFsLmpzXG5mdW5jdGlvbiB1bnNhZmVVbmlmb3JtQXJyYXlJbnREaXN0cmlidXRpb25JbnRlcm5hbChvdXQsIHJhbmdlU2l6ZSwgcm5nKSB7XG4gIHZhciByYW5nZUxlbmd0aCA9IHJhbmdlU2l6ZS5sZW5ndGg7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCAhPT0gcmFuZ2VMZW5ndGg7ICsraW5kZXgpIHtcbiAgICAgIHZhciBpbmRleFJhbmdlU2l6ZSA9IGluZGV4ID09PSAwID8gcmFuZ2VTaXplWzBdICsgMSA6IDQyOTQ5NjcyOTY7XG4gICAgICB2YXIgZyA9IHVuc2FmZVVuaWZvcm1JbnREaXN0cmlidXRpb25JbnRlcm5hbChpbmRleFJhbmdlU2l6ZSwgcm5nKTtcbiAgICAgIG91dFtpbmRleF0gPSBnO1xuICAgIH1cbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4ICE9PSByYW5nZUxlbmd0aDsgKytpbmRleCkge1xuICAgICAgdmFyIGN1cnJlbnQgPSBvdXRbaW5kZXhdO1xuICAgICAgdmFyIGN1cnJlbnRJblJhbmdlID0gcmFuZ2VTaXplW2luZGV4XTtcbiAgICAgIGlmIChjdXJyZW50IDwgY3VycmVudEluUmFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudCA+IGN1cnJlbnRJblJhbmdlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyAuLi8uLi9ub2RlX21vZHVsZXMvLnBucG0vcHVyZS1yYW5kQDcuMC4xL25vZGVfbW9kdWxlcy9wdXJlLXJhbmQvbGliL2VzbS9kaXN0cmlidXRpb24vVW5zYWZlVW5pZm9ybUludERpc3RyaWJ1dGlvbi5qc1xudmFyIHNhZmVOdW1iZXJNYXhTYWZlSW50ZWdlciA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xudmFyIHNoYXJlZEEgPSB7IHNpZ246IDEsIGRhdGE6IFswLCAwXSB9O1xudmFyIHNoYXJlZEIgPSB7IHNpZ246IDEsIGRhdGE6IFswLCAwXSB9O1xudmFyIHNoYXJlZEMgPSB7IHNpZ246IDEsIGRhdGE6IFswLCAwXSB9O1xudmFyIHNoYXJlZERhdGEgPSBbMCwgMF07XG5mdW5jdGlvbiB1bmlmb3JtTGFyZ2VJbnRJbnRlcm5hbChmcm9tLCB0bywgcmFuZ2VTaXplLCBybmcpIHtcbiAgdmFyIHJhbmdlU2l6ZUFycmF5SW50VmFsdWUgPSByYW5nZVNpemUgPD0gc2FmZU51bWJlck1heFNhZmVJbnRlZ2VyID8gZnJvbU51bWJlclRvQXJyYXlJbnQ2NChzaGFyZWRDLCByYW5nZVNpemUpIDogc3Vic3RyYWN0QXJyYXlJbnQ2NChzaGFyZWRDLCBmcm9tTnVtYmVyVG9BcnJheUludDY0KHNoYXJlZEEsIHRvKSwgZnJvbU51bWJlclRvQXJyYXlJbnQ2NChzaGFyZWRCLCBmcm9tKSk7XG4gIGlmIChyYW5nZVNpemVBcnJheUludFZhbHVlLmRhdGFbMV0gPT09IDQyOTQ5NjcyOTUpIHtcbiAgICByYW5nZVNpemVBcnJheUludFZhbHVlLmRhdGFbMF0gKz0gMTtcbiAgICByYW5nZVNpemVBcnJheUludFZhbHVlLmRhdGFbMV0gPSAwO1xuICB9IGVsc2Uge1xuICAgIHJhbmdlU2l6ZUFycmF5SW50VmFsdWUuZGF0YVsxXSArPSAxO1xuICB9XG4gIHVuc2FmZVVuaWZvcm1BcnJheUludERpc3RyaWJ1dGlvbkludGVybmFsKHNoYXJlZERhdGEsIHJhbmdlU2l6ZUFycmF5SW50VmFsdWUuZGF0YSwgcm5nKTtcbiAgcmV0dXJuIHNoYXJlZERhdGFbMF0gKiA0Mjk0OTY3Mjk2ICsgc2hhcmVkRGF0YVsxXSArIGZyb207XG59XG5mdW5jdGlvbiB1bnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uKGZyb20sIHRvLCBybmcpIHtcbiAgdmFyIHJhbmdlU2l6ZSA9IHRvIC0gZnJvbTtcbiAgaWYgKHJhbmdlU2l6ZSA8PSA0Mjk0OTY3Mjk1KSB7XG4gICAgdmFyIGcgPSB1bnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uSW50ZXJuYWwocmFuZ2VTaXplICsgMSwgcm5nKTtcbiAgICByZXR1cm4gZyArIGZyb207XG4gIH1cbiAgcmV0dXJuIHVuaWZvcm1MYXJnZUludEludGVybmFsKGZyb20sIHRvLCByYW5nZVNpemUsIHJuZyk7XG59XG5cbi8vIC4uLy4uL25vZGVfbW9kdWxlcy8ucG5wbS9wdXJlLXJhbmRANy4wLjEvbm9kZV9tb2R1bGVzL3B1cmUtcmFuZC9saWIvZXNtL2dlbmVyYXRvci9Yb3JvU2hpcm8uanNcbnZhciBYb3JvU2hpcm8xMjhQbHVzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBYb3JvU2hpcm8xMjhQbHVzMihzMDEsIHMwMCwgczExLCBzMTApIHtcbiAgICB0aGlzLnMwMSA9IHMwMTtcbiAgICB0aGlzLnMwMCA9IHMwMDtcbiAgICB0aGlzLnMxMSA9IHMxMTtcbiAgICB0aGlzLnMxMCA9IHMxMDtcbiAgfVxuICBYb3JvU2hpcm8xMjhQbHVzMi5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFhvcm9TaGlybzEyOFBsdXMyKHRoaXMuczAxLCB0aGlzLnMwMCwgdGhpcy5zMTEsIHRoaXMuczEwKTtcbiAgfTtcbiAgWG9yb1NoaXJvMTI4UGx1czIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV4dFJuZyA9IG5ldyBYb3JvU2hpcm8xMjhQbHVzMih0aGlzLnMwMSwgdGhpcy5zMDAsIHRoaXMuczExLCB0aGlzLnMxMCk7XG4gICAgdmFyIG91dCA9IG5leHRSbmcudW5zYWZlTmV4dCgpO1xuICAgIHJldHVybiBbb3V0LCBuZXh0Um5nXTtcbiAgfTtcbiAgWG9yb1NoaXJvMTI4UGx1czIucHJvdG90eXBlLnVuc2FmZU5leHQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb3V0ID0gdGhpcy5zMDAgKyB0aGlzLnMxMCB8IDA7XG4gICAgdmFyIGEwID0gdGhpcy5zMTAgXiB0aGlzLnMwMDtcbiAgICB2YXIgYTEgPSB0aGlzLnMxMSBeIHRoaXMuczAxO1xuICAgIHZhciBzMDAgPSB0aGlzLnMwMDtcbiAgICB2YXIgczAxID0gdGhpcy5zMDE7XG4gICAgdGhpcy5zMDAgPSBzMDAgPDwgMjQgXiBzMDEgPj4+IDggXiBhMCBeIGEwIDw8IDE2O1xuICAgIHRoaXMuczAxID0gczAxIDw8IDI0IF4gczAwID4+PiA4IF4gYTEgXiAoYTEgPDwgMTYgfCBhMCA+Pj4gMTYpO1xuICAgIHRoaXMuczEwID0gYTEgPDwgNSBeIGEwID4+PiAyNztcbiAgICB0aGlzLnMxMSA9IGEwIDw8IDUgXiBhMSA+Pj4gMjc7XG4gICAgcmV0dXJuIG91dDtcbiAgfTtcbiAgWG9yb1NoaXJvMTI4UGx1czIucHJvdG90eXBlLmp1bXAgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbmV4dFJuZyA9IG5ldyBYb3JvU2hpcm8xMjhQbHVzMih0aGlzLnMwMSwgdGhpcy5zMDAsIHRoaXMuczExLCB0aGlzLnMxMCk7XG4gICAgbmV4dFJuZy51bnNhZmVKdW1wKCk7XG4gICAgcmV0dXJuIG5leHRSbmc7XG4gIH07XG4gIFhvcm9TaGlybzEyOFBsdXMyLnByb3RvdHlwZS51bnNhZmVKdW1wID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5zMDEgPSAwO1xuICAgIHZhciBuczAwID0gMDtcbiAgICB2YXIgbnMxMSA9IDA7XG4gICAgdmFyIG5zMTAgPSAwO1xuICAgIHZhciBqdW1wID0gWzM2Mzk5NTY2NDUsIDM3NTA3NTcwMTIsIDEyNjE1Njg1MDgsIDM4NjQyNjMzNV07XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgIT09IDQ7ICsraSkge1xuICAgICAgZm9yICh2YXIgbWFzayA9IDE7IG1hc2s7IG1hc2sgPDw9IDEpIHtcbiAgICAgICAgaWYgKGp1bXBbaV0gJiBtYXNrKSB7XG4gICAgICAgICAgbnMwMSBePSB0aGlzLnMwMTtcbiAgICAgICAgICBuczAwIF49IHRoaXMuczAwO1xuICAgICAgICAgIG5zMTEgXj0gdGhpcy5zMTE7XG4gICAgICAgICAgbnMxMCBePSB0aGlzLnMxMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuc2FmZU5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zMDEgPSBuczAxO1xuICAgIHRoaXMuczAwID0gbnMwMDtcbiAgICB0aGlzLnMxMSA9IG5zMTE7XG4gICAgdGhpcy5zMTAgPSBuczEwO1xuICB9O1xuICBYb3JvU2hpcm8xMjhQbHVzMi5wcm90b3R5cGUuZ2V0U3RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gW3RoaXMuczAxLCB0aGlzLnMwMCwgdGhpcy5zMTEsIHRoaXMuczEwXTtcbiAgfTtcbiAgcmV0dXJuIFhvcm9TaGlybzEyOFBsdXMyO1xufSkoKTtcbmZ1bmN0aW9uIGZyb21TdGF0ZShzdGF0ZSkge1xuICB2YXIgdmFsaWQgPSBzdGF0ZS5sZW5ndGggPT09IDQ7XG4gIGlmICghdmFsaWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RhdGUgbXVzdCBoYXZlIGJlZW4gcHJvZHVjZWQgYnkgYSB4b3Jvc2hpcm8xMjhwbHVzIFJhbmRvbUdlbmVyYXRvclwiKTtcbiAgfVxuICByZXR1cm4gbmV3IFhvcm9TaGlybzEyOFBsdXMoc3RhdGVbMF0sIHN0YXRlWzFdLCBzdGF0ZVsyXSwgc3RhdGVbM10pO1xufVxudmFyIHhvcm9zaGlybzEyOHBsdXMgPSBPYmplY3QuYXNzaWduKGZ1bmN0aW9uKHNlZWQpIHtcbiAgcmV0dXJuIG5ldyBYb3JvU2hpcm8xMjhQbHVzKC0xLCB+c2VlZCwgc2VlZCB8IDAsIDApO1xufSwgeyBmcm9tU3RhdGUgfSk7XG5cbi8vIHNyYy9zZXJ2ZXIvcm5nLnRzXG52YXIgeyBhc1VpbnROIH0gPSBCaWdJbnQ7XG5mdW5jdGlvbiBwY2czMihzdGF0ZSkge1xuICBjb25zdCBNVUwgPSA2MzY0MTM2MjIzODQ2NzkzMDA1bjtcbiAgY29uc3QgSU5DID0gMTE2MzQ1ODAwMjc0NjIyNjA3MjNuO1xuICBzdGF0ZSA9IGFzVWludE4oNjQsIHN0YXRlICogTVVMICsgSU5DKTtcbiAgY29uc3QgeG9yc2hpZnRlZCA9IE51bWJlcihhc1VpbnROKDMyLCAoc3RhdGUgPj4gMThuIF4gc3RhdGUpID4+IDI3bikpO1xuICBjb25zdCByb3QgPSBOdW1iZXIoYXNVaW50TigzMiwgc3RhdGUgPj4gNTluKSk7XG4gIHJldHVybiB4b3JzaGlmdGVkID4+IHJvdCB8IHhvcnNoaWZ0ZWQgPDwgMzIgLSByb3Q7XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUZsb2F0NjQocm5nKSB7XG4gIGNvbnN0IGcxID0gdW5zYWZlVW5pZm9ybUludERpc3RyaWJ1dGlvbigwLCAoMSA8PCAyNikgLSAxLCBybmcpO1xuICBjb25zdCBnMiA9IHVuc2FmZVVuaWZvcm1JbnREaXN0cmlidXRpb24oMCwgKDEgPDwgMjcpIC0gMSwgcm5nKTtcbiAgY29uc3QgdmFsdWUgPSAoZzEgKiBNYXRoLnBvdygyLCAyNykgKyBnMikgKiBNYXRoLnBvdygyLCAtNTMpO1xuICByZXR1cm4gdmFsdWU7XG59XG5mdW5jdGlvbiBtYWtlUmFuZG9tKHNlZWQpIHtcbiAgY29uc3Qgcm5nID0geG9yb3NoaXJvMTI4cGx1cyhwY2czMihzZWVkLm1pY3Jvc1NpbmNlVW5peEVwb2NoKSk7XG4gIGNvbnN0IHJhbmRvbSA9ICgpID0+IGdlbmVyYXRlRmxvYXQ2NChybmcpO1xuICByYW5kb20uZmlsbCA9IChhcnJheSkgPT4ge1xuICAgIGNvbnN0IGVsZW0gPSBhcnJheS5hdCgwKTtcbiAgICBpZiAodHlwZW9mIGVsZW0gPT09IFwiYmlnaW50XCIpIHtcbiAgICAgIGNvbnN0IHVwcGVyID0gKDFuIDw8IEJpZ0ludChhcnJheS5CWVRFU19QRVJfRUxFTUVOVCAqIDgpKSAtIDFuO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpXSA9IHVuc2FmZVVuaWZvcm1CaWdJbnREaXN0cmlidXRpb24oMG4sIHVwcGVyLCBybmcpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW0gPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIGNvbnN0IHVwcGVyID0gKDEgPDwgYXJyYXkuQllURVNfUEVSX0VMRU1FTlQgKiA4KSAtIDE7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFycmF5W2ldID0gdW5zYWZlVW5pZm9ybUludERpc3RyaWJ1dGlvbigwLCB1cHBlciwgcm5nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xuICB9O1xuICByYW5kb20udWludDMyID0gKCkgPT4gcm5nLnVuc2FmZU5leHQoKTtcbiAgcmFuZG9tLmludGVnZXJJblJhbmdlID0gKG1pbiwgbWF4KSA9PiB1bnNhZmVVbmlmb3JtSW50RGlzdHJpYnV0aW9uKG1pbiwgbWF4LCBybmcpO1xuICByYW5kb20uYmlnaW50SW5SYW5nZSA9IChtaW4sIG1heCkgPT4gdW5zYWZlVW5pZm9ybUJpZ0ludERpc3RyaWJ1dGlvbihtaW4sIG1heCwgcm5nKTtcbiAgcmV0dXJuIHJhbmRvbTtcbn1cblxuLy8gc3JjL3NlcnZlci9ydW50aW1lLnRzXG52YXIgeyBmcmVlemUgfSA9IE9iamVjdDtcbnZhciBzeXMgPSBfc3lzY2FsbHMyXzA7XG5mdW5jdGlvbiBwYXJzZUpzb25PYmplY3QoanNvbikge1xuICBsZXQgdmFsdWU7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBKU09OLnBhcnNlKGpzb24pO1xuICB9IGNhdGNoIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIEpTT046IGZhaWxlZCB0byBwYXJzZSBzdHJpbmdcIik7XG4gIH1cbiAgaWYgKHZhbHVlID09PSBudWxsIHx8IHR5cGVvZiB2YWx1ZSAhPT0gXCJvYmplY3RcIiB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIGEgSlNPTiBvYmplY3QgYXQgdGhlIHRvcCBsZXZlbFwiKTtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG52YXIgSnd0Q2xhaW1zSW1wbCA9IGNsYXNzIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgSnd0Q2xhaW1zIGluc3RhbmNlLlxuICAgKiBAcGFyYW0gcmF3UGF5bG9hZCBUaGUgSldUIHBheWxvYWQgYXMgYSByYXcgSlNPTiBzdHJpbmcuXG4gICAqIEBwYXJhbSBpZGVudGl0eSBUaGUgaWRlbnRpdHkgZm9yIHRoaXMgSldULiBXZSBhcmUgb25seSB0YWtpbmcgdGhpcyBiZWNhdXNlIHdlIGRvbid0IGhhdmUgYSBibGFrZTMgaW1wbGVtZW50YXRpb24gKHdoaWNoIHdlIG5lZWQgdG8gY29tcHV0ZSBpdCkuXG4gICAqL1xuICBjb25zdHJ1Y3RvcihyYXdQYXlsb2FkLCBpZGVudGl0eSkge1xuICAgIHRoaXMucmF3UGF5bG9hZCA9IHJhd1BheWxvYWQ7XG4gICAgdGhpcy5mdWxsUGF5bG9hZCA9IHBhcnNlSnNvbk9iamVjdChyYXdQYXlsb2FkKTtcbiAgICB0aGlzLl9pZGVudGl0eSA9IGlkZW50aXR5O1xuICB9XG4gIGZ1bGxQYXlsb2FkO1xuICBfaWRlbnRpdHk7XG4gIGdldCBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5faWRlbnRpdHk7XG4gIH1cbiAgZ2V0IHN1YmplY3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnVsbFBheWxvYWRbXCJzdWJcIl07XG4gIH1cbiAgZ2V0IGlzc3VlcigpIHtcbiAgICByZXR1cm4gdGhpcy5mdWxsUGF5bG9hZFtcImlzc1wiXTtcbiAgfVxuICBnZXQgYXVkaWVuY2UoKSB7XG4gICAgY29uc3QgYXVkID0gdGhpcy5mdWxsUGF5bG9hZFtcImF1ZFwiXTtcbiAgICBpZiAoYXVkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHR5cGVvZiBhdWQgPT09IFwic3RyaW5nXCIgPyBbYXVkXSA6IGF1ZDtcbiAgfVxufTtcbnZhciBBdXRoQ3R4SW1wbCA9IGNsYXNzIF9BdXRoQ3R4SW1wbCB7XG4gIGlzSW50ZXJuYWw7XG4gIC8vIFNvdXJjZSBvZiB0aGUgSldUIHBheWxvYWQgc3RyaW5nLCBpZiB0aGVyZSBpcyBvbmUuXG4gIF9qd3RTb3VyY2U7XG4gIC8vIFdoZXRoZXIgd2UgaGF2ZSBpbml0aWFsaXplZCB0aGUgSldUIGNsYWltcy5cbiAgX2luaXRpYWxpemVkSldUID0gZmFsc2U7XG4gIF9qd3RDbGFpbXM7XG4gIF9zZW5kZXJJZGVudGl0eTtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHRoaXMuaXNJbnRlcm5hbCA9IG9wdHMuaXNJbnRlcm5hbDtcbiAgICB0aGlzLl9qd3RTb3VyY2UgPSBvcHRzLmp3dFNvdXJjZTtcbiAgICB0aGlzLl9zZW5kZXJJZGVudGl0eSA9IG9wdHMuc2VuZGVySWRlbnRpdHk7XG4gIH1cbiAgX2luaXRpYWxpemVKV1QoKSB7XG4gICAgaWYgKHRoaXMuX2luaXRpYWxpemVkSldUKSByZXR1cm47XG4gICAgdGhpcy5faW5pdGlhbGl6ZWRKV1QgPSB0cnVlO1xuICAgIGNvbnN0IHRva2VuID0gdGhpcy5fand0U291cmNlKCk7XG4gICAgaWYgKCF0b2tlbikge1xuICAgICAgdGhpcy5fand0Q2xhaW1zID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fand0Q2xhaW1zID0gbmV3IEp3dENsYWltc0ltcGwodG9rZW4sIHRoaXMuX3NlbmRlcklkZW50aXR5KTtcbiAgICB9XG4gICAgT2JqZWN0LmZyZWV6ZSh0aGlzKTtcbiAgfVxuICAvKiogTGF6aWx5IGNvbXB1dGUgd2hldGhlciBhIEpXVCBleGlzdHMgYW5kIGlzIHBhcnNlYWJsZS4gKi9cbiAgZ2V0IGhhc0pXVCgpIHtcbiAgICB0aGlzLl9pbml0aWFsaXplSldUKCk7XG4gICAgcmV0dXJuIHRoaXMuX2p3dENsYWltcyAhPT0gbnVsbDtcbiAgfVxuICAvKiogTGF6aWx5IHBhcnNlIHRoZSBKd3RDbGFpbXMgb25seSB3aGVuIGFjY2Vzc2VkLiAqL1xuICBnZXQgand0KCkge1xuICAgIHRoaXMuX2luaXRpYWxpemVKV1QoKTtcbiAgICByZXR1cm4gdGhpcy5fand0Q2xhaW1zO1xuICB9XG4gIC8qKiBDcmVhdGUgYSBjb250ZXh0IHJlcHJlc2VudGluZyBpbnRlcm5hbCAobm9uLXVzZXIpIHJlcXVlc3RzLiAqL1xuICBzdGF0aWMgaW50ZXJuYWwoKSB7XG4gICAgcmV0dXJuIG5ldyBfQXV0aEN0eEltcGwoe1xuICAgICAgaXNJbnRlcm5hbDogdHJ1ZSxcbiAgICAgIGp3dFNvdXJjZTogKCkgPT4gbnVsbCxcbiAgICAgIHNlbmRlcklkZW50aXR5OiBJZGVudGl0eS56ZXJvKClcbiAgICB9KTtcbiAgfVxuICAvKiogSWYgdGhlcmUgaXMgYSBjb25uZWN0aW9uIGlkLCBsb29rIHVwIHRoZSBKV1QgcGF5bG9hZCBmcm9tIHRoZSBzeXN0ZW0gdGFibGVzLiAqL1xuICBzdGF0aWMgZnJvbVN5c3RlbVRhYmxlcyhjb25uZWN0aW9uSWQsIHNlbmRlcikge1xuICAgIGlmIChjb25uZWN0aW9uSWQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgX0F1dGhDdHhJbXBsKHtcbiAgICAgICAgaXNJbnRlcm5hbDogZmFsc2UsXG4gICAgICAgIGp3dFNvdXJjZTogKCkgPT4gbnVsbCxcbiAgICAgICAgc2VuZGVySWRlbnRpdHk6IHNlbmRlclxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgX0F1dGhDdHhJbXBsKHtcbiAgICAgIGlzSW50ZXJuYWw6IGZhbHNlLFxuICAgICAgand0U291cmNlOiAoKSA9PiB7XG4gICAgICAgIGNvbnN0IHBheWxvYWRCdWYgPSBzeXMuZ2V0X2p3dF9wYXlsb2FkKGNvbm5lY3Rpb25JZC5fX2Nvbm5lY3Rpb25faWRfXyk7XG4gICAgICAgIGlmIChwYXlsb2FkQnVmLmxlbmd0aCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gICAgICAgIGNvbnN0IHBheWxvYWRTdHIgPSBuZXcgVGV4dERlY29kZXIoKS5kZWNvZGUocGF5bG9hZEJ1Zik7XG4gICAgICAgIHJldHVybiBwYXlsb2FkU3RyO1xuICAgICAgfSxcbiAgICAgIHNlbmRlcklkZW50aXR5OiBzZW5kZXJcbiAgICB9KTtcbiAgfVxufTtcbnZhciBSZWR1Y2VyQ3R4SW1wbCA9IGNsYXNzIFJlZHVjZXJDdHgge1xuICAjaWRlbnRpdHk7XG4gICNzZW5kZXJBdXRoO1xuICAjdXVpZENvdW50ZXI7XG4gICNyYW5kb207XG4gIHNlbmRlcjtcbiAgdGltZXN0YW1wO1xuICBjb25uZWN0aW9uSWQ7XG4gIGRiO1xuICBjb25zdHJ1Y3RvcihzZW5kZXIsIHRpbWVzdGFtcCwgY29ubmVjdGlvbklkLCBkYlZpZXcpIHtcbiAgICBPYmplY3Quc2VhbCh0aGlzKTtcbiAgICB0aGlzLnNlbmRlciA9IHNlbmRlcjtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB0aGlzLmNvbm5lY3Rpb25JZCA9IGNvbm5lY3Rpb25JZDtcbiAgICB0aGlzLmRiID0gZGJWaWV3O1xuICB9XG4gIC8qKiBSZXNldCB0aGUgYFJlZHVjZXJDdHhgIHRvIGJlIHVzZWQgZm9yIGEgbmV3IHRyYW5zYWN0aW9uICovXG4gIHN0YXRpYyByZXNldChtZSwgc2VuZGVyLCB0aW1lc3RhbXAsIGNvbm5lY3Rpb25JZCkge1xuICAgIG1lLnNlbmRlciA9IHNlbmRlcjtcbiAgICBtZS50aW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgbWUuY29ubmVjdGlvbklkID0gY29ubmVjdGlvbklkO1xuICAgIG1lLiN1dWlkQ291bnRlciA9IHZvaWQgMDtcbiAgICBtZS4jc2VuZGVyQXV0aCA9IHZvaWQgMDtcbiAgfVxuICBnZXQgaWRlbnRpdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lkZW50aXR5ID8/PSBuZXcgSWRlbnRpdHkoc3lzLmlkZW50aXR5KCkpO1xuICB9XG4gIGdldCBzZW5kZXJBdXRoKCkge1xuICAgIHJldHVybiB0aGlzLiNzZW5kZXJBdXRoID8/PSBBdXRoQ3R4SW1wbC5mcm9tU3lzdGVtVGFibGVzKFxuICAgICAgdGhpcy5jb25uZWN0aW9uSWQsXG4gICAgICB0aGlzLnNlbmRlclxuICAgICk7XG4gIH1cbiAgZ2V0IHJhbmRvbSgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmFuZG9tID8/PSBtYWtlUmFuZG9tKHRoaXMudGltZXN0YW1wKTtcbiAgfVxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IHJhbmRvbSB7QGxpbmsgVXVpZH0gYHY0YCB1c2luZyB0aGlzIGBSZWR1Y2VyQ3R4YCdzIFJORy5cbiAgICovXG4gIG5ld1V1aWRWNCgpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMucmFuZG9tLmZpbGwobmV3IFVpbnQ4QXJyYXkoMTYpKTtcbiAgICByZXR1cm4gVXVpZC5mcm9tUmFuZG9tQnl0ZXNWNChieXRlcyk7XG4gIH1cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBzb3J0YWJsZSB7QGxpbmsgVXVpZH0gYHY3YCB1c2luZyB0aGlzIGBSZWR1Y2VyQ3R4YCdzIFJORywgY291bnRlcixcbiAgICogYW5kIHRpbWVzdGFtcC5cbiAgICovXG4gIG5ld1V1aWRWNygpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMucmFuZG9tLmZpbGwobmV3IFVpbnQ4QXJyYXkoNCkpO1xuICAgIGNvbnN0IGNvdW50ZXIgPSB0aGlzLiN1dWlkQ291bnRlciA/Pz0geyB2YWx1ZTogMCB9O1xuICAgIHJldHVybiBVdWlkLmZyb21Db3VudGVyVjcoY291bnRlciwgdGhpcy50aW1lc3RhbXAsIGJ5dGVzKTtcbiAgfVxufTtcbnZhciBjYWxsVXNlckZ1bmN0aW9uID0gZnVuY3Rpb24gX19zcGFjZXRpbWVkYl9lbmRfc2hvcnRfYmFja3RyYWNlKGZuLCAuLi5hcmdzKSB7XG4gIHJldHVybiBmbiguLi5hcmdzKTtcbn07XG52YXIgbWFrZUhvb2tzID0gKHNjaGVtYTIpID0+IG5ldyBNb2R1bGVIb29rc0ltcGwoc2NoZW1hMik7XG52YXIgTW9kdWxlSG9va3NJbXBsID0gY2xhc3Mge1xuICAjc2NoZW1hO1xuICAjZGJWaWV3XztcbiAgI3JlZHVjZXJBcmdzRGVzZXJpYWxpemVycztcbiAgLyoqIENhY2hlIHRoZSBgUmVkdWNlckN0eGAgb2JqZWN0IHRvIGF2b2lkIGFsbG9jYXRpbmcgYW5ldyBmb3IgZXZlciByZWR1Y2VyIGNhbGwuICovXG4gICNyZWR1Y2VyQ3R4XztcbiAgY29uc3RydWN0b3Ioc2NoZW1hMikge1xuICAgIHRoaXMuI3NjaGVtYSA9IHNjaGVtYTI7XG4gICAgdGhpcy4jcmVkdWNlckFyZ3NEZXNlcmlhbGl6ZXJzID0gc2NoZW1hMi5tb2R1bGVEZWYucmVkdWNlcnMubWFwKFxuICAgICAgKHsgcGFyYW1zIH0pID0+IFByb2R1Y3RUeXBlLm1ha2VEZXNlcmlhbGl6ZXIocGFyYW1zLCBzY2hlbWEyLnR5cGVzcGFjZSlcbiAgICApO1xuICB9XG4gIGdldCAjZGJWaWV3KCkge1xuICAgIHJldHVybiB0aGlzLiNkYlZpZXdfID8/PSBmcmVlemUoXG4gICAgICBPYmplY3QuZnJvbUVudHJpZXMoXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy4jc2NoZW1hLnNjaGVtYVR5cGUudGFibGVzKS5tYXAoKHRhYmxlMikgPT4gW1xuICAgICAgICAgIHRhYmxlMi5hY2Nlc3Nvck5hbWUsXG4gICAgICAgICAgbWFrZVRhYmxlVmlldyh0aGlzLiNzY2hlbWEudHlwZXNwYWNlLCB0YWJsZTIudGFibGVEZWYpXG4gICAgICAgIF0pXG4gICAgICApXG4gICAgKTtcbiAgfVxuICBnZXQgI3JlZHVjZXJDdHgoKSB7XG4gICAgcmV0dXJuIHRoaXMuI3JlZHVjZXJDdHhfID8/PSBuZXcgUmVkdWNlckN0eEltcGwoXG4gICAgICBJZGVudGl0eS56ZXJvKCksXG4gICAgICBUaW1lc3RhbXAuVU5JWF9FUE9DSCxcbiAgICAgIG51bGwsXG4gICAgICB0aGlzLiNkYlZpZXdcbiAgICApO1xuICB9XG4gIF9fZGVzY3JpYmVfbW9kdWxlX18oKSB7XG4gICAgY29uc3Qgd3JpdGVyID0gbmV3IEJpbmFyeVdyaXRlcigxMjgpO1xuICAgIFJhd01vZHVsZURlZi5zZXJpYWxpemUoXG4gICAgICB3cml0ZXIsXG4gICAgICBSYXdNb2R1bGVEZWYuVjEwKHRoaXMuI3NjaGVtYS5yYXdNb2R1bGVEZWZWMTAoKSlcbiAgICApO1xuICAgIHJldHVybiB3cml0ZXIuZ2V0QnVmZmVyKCk7XG4gIH1cbiAgX19nZXRfZXJyb3JfY29uc3RydWN0b3JfXyhjb2RlKSB7XG4gICAgcmV0dXJuIGdldEVycm9yQ29uc3RydWN0b3IoY29kZSk7XG4gIH1cbiAgZ2V0IF9fc2VuZGVyX2Vycm9yX2NsYXNzX18oKSB7XG4gICAgcmV0dXJuIFNlbmRlckVycm9yO1xuICB9XG4gIF9fY2FsbF9yZWR1Y2VyX18ocmVkdWNlcklkLCBzZW5kZXIsIGNvbm5JZCwgdGltZXN0YW1wLCBhcmdzQnVmKSB7XG4gICAgY29uc3QgbW9kdWxlQ3R4ID0gdGhpcy4jc2NoZW1hO1xuICAgIGNvbnN0IGRlc2VyaWFsaXplQXJncyA9IHRoaXMuI3JlZHVjZXJBcmdzRGVzZXJpYWxpemVyc1tyZWR1Y2VySWRdO1xuICAgIEJJTkFSWV9SRUFERVIucmVzZXQoYXJnc0J1Zik7XG4gICAgY29uc3QgYXJncyA9IGRlc2VyaWFsaXplQXJncyhCSU5BUllfUkVBREVSKTtcbiAgICBjb25zdCBzZW5kZXJJZGVudGl0eSA9IG5ldyBJZGVudGl0eShzZW5kZXIpO1xuICAgIGNvbnN0IGN0eCA9IHRoaXMuI3JlZHVjZXJDdHg7XG4gICAgUmVkdWNlckN0eEltcGwucmVzZXQoXG4gICAgICBjdHgsXG4gICAgICBzZW5kZXJJZGVudGl0eSxcbiAgICAgIG5ldyBUaW1lc3RhbXAodGltZXN0YW1wKSxcbiAgICAgIENvbm5lY3Rpb25JZC5udWxsSWZaZXJvKG5ldyBDb25uZWN0aW9uSWQoY29ubklkKSlcbiAgICApO1xuICAgIGNhbGxVc2VyRnVuY3Rpb24obW9kdWxlQ3R4LnJlZHVjZXJzW3JlZHVjZXJJZF0sIGN0eCwgYXJncyk7XG4gIH1cbiAgX19jYWxsX3ZpZXdfXyhpZCwgc2VuZGVyLCBhcmdzQnVmKSB7XG4gICAgY29uc3QgbW9kdWxlQ3R4ID0gdGhpcy4jc2NoZW1hO1xuICAgIGNvbnN0IHsgZm4sIGRlc2VyaWFsaXplUGFyYW1zLCBzZXJpYWxpemVSZXR1cm4sIHJldHVyblR5cGVCYXNlU2l6ZSB9ID0gbW9kdWxlQ3R4LnZpZXdzW2lkXTtcbiAgICBjb25zdCBjdHggPSBmcmVlemUoe1xuICAgICAgc2VuZGVyOiBuZXcgSWRlbnRpdHkoc2VuZGVyKSxcbiAgICAgIC8vIHRoaXMgaXMgdGhlIG5vbi1yZWFkb25seSBEYlZpZXcsIGJ1dCB0aGUgdHlwaW5nIGZvciB0aGUgdXNlciB3aWxsIGJlXG4gICAgICAvLyB0aGUgcmVhZG9ubHkgb25lLCBhbmQgaWYgdGhleSBkbyBjYWxsIG11dGF0aW5nIGZ1bmN0aW9ucyBpdCB3aWxsIGZhaWxcbiAgICAgIC8vIGF0IHJ1bnRpbWVcbiAgICAgIGRiOiB0aGlzLiNkYlZpZXcsXG4gICAgICBmcm9tOiBtYWtlUXVlcnlCdWlsZGVyKG1vZHVsZUN0eC5zY2hlbWFUeXBlKVxuICAgIH0pO1xuICAgIGNvbnN0IGFyZ3MgPSBkZXNlcmlhbGl6ZVBhcmFtcyhuZXcgQmluYXJ5UmVhZGVyKGFyZ3NCdWYpKTtcbiAgICBjb25zdCByZXQgPSBjYWxsVXNlckZ1bmN0aW9uKGZuLCBjdHgsIGFyZ3MpO1xuICAgIGNvbnN0IHJldEJ1ZiA9IG5ldyBCaW5hcnlXcml0ZXIocmV0dXJuVHlwZUJhc2VTaXplKTtcbiAgICBpZiAoaXNSb3dUeXBlZFF1ZXJ5KHJldCkpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdG9TcWwocmV0KTtcbiAgICAgIFZpZXdSZXN1bHRIZWFkZXIuc2VyaWFsaXplKHJldEJ1ZiwgVmlld1Jlc3VsdEhlYWRlci5SYXdTcWwocXVlcnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgVmlld1Jlc3VsdEhlYWRlci5zZXJpYWxpemUocmV0QnVmLCBWaWV3UmVzdWx0SGVhZGVyLlJvd0RhdGEpO1xuICAgICAgc2VyaWFsaXplUmV0dXJuKHJldEJ1ZiwgcmV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgZGF0YTogcmV0QnVmLmdldEJ1ZmZlcigpIH07XG4gIH1cbiAgX19jYWxsX3ZpZXdfYW5vbl9fKGlkLCBhcmdzQnVmKSB7XG4gICAgY29uc3QgbW9kdWxlQ3R4ID0gdGhpcy4jc2NoZW1hO1xuICAgIGNvbnN0IHsgZm4sIGRlc2VyaWFsaXplUGFyYW1zLCBzZXJpYWxpemVSZXR1cm4sIHJldHVyblR5cGVCYXNlU2l6ZSB9ID0gbW9kdWxlQ3R4LmFub25WaWV3c1tpZF07XG4gICAgY29uc3QgY3R4ID0gZnJlZXplKHtcbiAgICAgIC8vIHRoaXMgaXMgdGhlIG5vbi1yZWFkb25seSBEYlZpZXcsIGJ1dCB0aGUgdHlwaW5nIGZvciB0aGUgdXNlciB3aWxsIGJlXG4gICAgICAvLyB0aGUgcmVhZG9ubHkgb25lLCBhbmQgaWYgdGhleSBkbyBjYWxsIG11dGF0aW5nIGZ1bmN0aW9ucyBpdCB3aWxsIGZhaWxcbiAgICAgIC8vIGF0IHJ1bnRpbWVcbiAgICAgIGRiOiB0aGlzLiNkYlZpZXcsXG4gICAgICBmcm9tOiBtYWtlUXVlcnlCdWlsZGVyKG1vZHVsZUN0eC5zY2hlbWFUeXBlKVxuICAgIH0pO1xuICAgIGNvbnN0IGFyZ3MgPSBkZXNlcmlhbGl6ZVBhcmFtcyhuZXcgQmluYXJ5UmVhZGVyKGFyZ3NCdWYpKTtcbiAgICBjb25zdCByZXQgPSBjYWxsVXNlckZ1bmN0aW9uKGZuLCBjdHgsIGFyZ3MpO1xuICAgIGNvbnN0IHJldEJ1ZiA9IG5ldyBCaW5hcnlXcml0ZXIocmV0dXJuVHlwZUJhc2VTaXplKTtcbiAgICBpZiAoaXNSb3dUeXBlZFF1ZXJ5KHJldCkpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gdG9TcWwocmV0KTtcbiAgICAgIFZpZXdSZXN1bHRIZWFkZXIuc2VyaWFsaXplKHJldEJ1ZiwgVmlld1Jlc3VsdEhlYWRlci5SYXdTcWwocXVlcnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgVmlld1Jlc3VsdEhlYWRlci5zZXJpYWxpemUocmV0QnVmLCBWaWV3UmVzdWx0SGVhZGVyLlJvd0RhdGEpO1xuICAgICAgc2VyaWFsaXplUmV0dXJuKHJldEJ1ZiwgcmV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHsgZGF0YTogcmV0QnVmLmdldEJ1ZmZlcigpIH07XG4gIH1cbiAgX19jYWxsX3Byb2NlZHVyZV9fKGlkLCBzZW5kZXIsIGNvbm5lY3Rpb25faWQsIHRpbWVzdGFtcCwgYXJncykge1xuICAgIHJldHVybiBjYWxsUHJvY2VkdXJlKFxuICAgICAgdGhpcy4jc2NoZW1hLFxuICAgICAgaWQsXG4gICAgICBuZXcgSWRlbnRpdHkoc2VuZGVyKSxcbiAgICAgIENvbm5lY3Rpb25JZC5udWxsSWZaZXJvKG5ldyBDb25uZWN0aW9uSWQoY29ubmVjdGlvbl9pZCkpLFxuICAgICAgbmV3IFRpbWVzdGFtcCh0aW1lc3RhbXApLFxuICAgICAgYXJncyxcbiAgICAgICgpID0+IHRoaXMuI2RiVmlld1xuICAgICk7XG4gIH1cbn07XG52YXIgQklOQVJZX1dSSVRFUiA9IG5ldyBCaW5hcnlXcml0ZXIoMCk7XG52YXIgQklOQVJZX1JFQURFUiA9IG5ldyBCaW5hcnlSZWFkZXIobmV3IFVpbnQ4QXJyYXkoKSk7XG5mdW5jdGlvbiBtYWtlVGFibGVWaWV3KHR5cGVzcGFjZSwgdGFibGUyKSB7XG4gIGNvbnN0IHRhYmxlX2lkID0gc3lzLnRhYmxlX2lkX2Zyb21fbmFtZSh0YWJsZTIuc291cmNlTmFtZSk7XG4gIGNvbnN0IHJvd1R5cGUgPSB0eXBlc3BhY2UudHlwZXNbdGFibGUyLnByb2R1Y3RUeXBlUmVmXTtcbiAgaWYgKHJvd1R5cGUudGFnICE9PSBcIlByb2R1Y3RcIikge1xuICAgIHRocm93IFwiaW1wb3NzaWJsZVwiO1xuICB9XG4gIGNvbnN0IHNlcmlhbGl6ZVJvdyA9IEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIocm93VHlwZSwgdHlwZXNwYWNlKTtcbiAgY29uc3QgZGVzZXJpYWxpemVSb3cgPSBBbGdlYnJhaWNUeXBlLm1ha2VEZXNlcmlhbGl6ZXIocm93VHlwZSwgdHlwZXNwYWNlKTtcbiAgY29uc3Qgc2VxdWVuY2VzID0gdGFibGUyLnNlcXVlbmNlcy5tYXAoKHNlcSkgPT4ge1xuICAgIGNvbnN0IGNvbCA9IHJvd1R5cGUudmFsdWUuZWxlbWVudHNbc2VxLmNvbHVtbl07XG4gICAgY29uc3QgY29sVHlwZSA9IGNvbC5hbGdlYnJhaWNUeXBlO1xuICAgIGxldCBzZXF1ZW5jZVRyaWdnZXI7XG4gICAgc3dpdGNoIChjb2xUeXBlLnRhZykge1xuICAgICAgY2FzZSBcIlU4XCI6XG4gICAgICBjYXNlIFwiSThcIjpcbiAgICAgIGNhc2UgXCJVMTZcIjpcbiAgICAgIGNhc2UgXCJJMTZcIjpcbiAgICAgIGNhc2UgXCJVMzJcIjpcbiAgICAgIGNhc2UgXCJJMzJcIjpcbiAgICAgICAgc2VxdWVuY2VUcmlnZ2VyID0gMDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiVTY0XCI6XG4gICAgICBjYXNlIFwiSTY0XCI6XG4gICAgICBjYXNlIFwiVTEyOFwiOlxuICAgICAgY2FzZSBcIkkxMjhcIjpcbiAgICAgIGNhc2UgXCJVMjU2XCI6XG4gICAgICBjYXNlIFwiSTI1NlwiOlxuICAgICAgICBzZXF1ZW5jZVRyaWdnZXIgPSAwbjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiaW52YWxpZCBzZXF1ZW5jZSB0eXBlXCIpO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgY29sTmFtZTogY29sLm5hbWUsXG4gICAgICBzZXF1ZW5jZVRyaWdnZXIsXG4gICAgICBkZXNlcmlhbGl6ZTogQWxnZWJyYWljVHlwZS5tYWtlRGVzZXJpYWxpemVyKGNvbFR5cGUsIHR5cGVzcGFjZSlcbiAgICB9O1xuICB9KTtcbiAgY29uc3QgaGFzQXV0b0luY3JlbWVudCA9IHNlcXVlbmNlcy5sZW5ndGggPiAwO1xuICBjb25zdCBpdGVyID0gKCkgPT4gdGFibGVJdGVyYXRvcihzeXMuZGF0YXN0b3JlX3RhYmxlX3NjYW5fYnNhdG4odGFibGVfaWQpLCBkZXNlcmlhbGl6ZVJvdyk7XG4gIGNvbnN0IGludGVncmF0ZUdlbmVyYXRlZENvbHVtbnMgPSBoYXNBdXRvSW5jcmVtZW50ID8gKHJvdywgcmV0X2J1ZikgPT4ge1xuICAgIEJJTkFSWV9SRUFERVIucmVzZXQocmV0X2J1Zik7XG4gICAgZm9yIChjb25zdCB7IGNvbE5hbWUsIGRlc2VyaWFsaXplLCBzZXF1ZW5jZVRyaWdnZXIgfSBvZiBzZXF1ZW5jZXMpIHtcbiAgICAgIGlmIChyb3dbY29sTmFtZV0gPT09IHNlcXVlbmNlVHJpZ2dlcikge1xuICAgICAgICByb3dbY29sTmFtZV0gPSBkZXNlcmlhbGl6ZShCSU5BUllfUkVBREVSKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gOiBudWxsO1xuICBjb25zdCB0YWJsZU1ldGhvZHMgPSB7XG4gICAgY291bnQ6ICgpID0+IHN5cy5kYXRhc3RvcmVfdGFibGVfcm93X2NvdW50KHRhYmxlX2lkKSxcbiAgICBpdGVyLFxuICAgIFtTeW1ib2wuaXRlcmF0b3JdOiAoKSA9PiBpdGVyKCksXG4gICAgaW5zZXJ0OiAocm93KSA9PiB7XG4gICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmKTtcbiAgICAgIHNlcmlhbGl6ZVJvdyhCSU5BUllfV1JJVEVSLCByb3cpO1xuICAgICAgc3lzLmRhdGFzdG9yZV9pbnNlcnRfYnNhdG4odGFibGVfaWQsIGJ1Zi5idWZmZXIsIEJJTkFSWV9XUklURVIub2Zmc2V0KTtcbiAgICAgIGNvbnN0IHJldCA9IHsgLi4ucm93IH07XG4gICAgICBpbnRlZ3JhdGVHZW5lcmF0ZWRDb2x1bW5zPy4ocmV0LCBidWYudmlldyk7XG4gICAgICByZXR1cm4gcmV0O1xuICAgIH0sXG4gICAgZGVsZXRlOiAocm93KSA9PiB7XG4gICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmKTtcbiAgICAgIEJJTkFSWV9XUklURVIud3JpdGVVMzIoMSk7XG4gICAgICBzZXJpYWxpemVSb3coQklOQVJZX1dSSVRFUiwgcm93KTtcbiAgICAgIGNvbnN0IGNvdW50ID0gc3lzLmRhdGFzdG9yZV9kZWxldGVfYWxsX2J5X2VxX2JzYXRuKFxuICAgICAgICB0YWJsZV9pZCxcbiAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgQklOQVJZX1dSSVRFUi5vZmZzZXRcbiAgICAgICk7XG4gICAgICByZXR1cm4gY291bnQgPiAwO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgdGFibGVWaWV3ID0gT2JqZWN0LmFzc2lnbihcbiAgICAvKiBAX19QVVJFX18gKi8gT2JqZWN0LmNyZWF0ZShudWxsKSxcbiAgICB0YWJsZU1ldGhvZHNcbiAgKTtcbiAgZm9yIChjb25zdCBpbmRleERlZiBvZiB0YWJsZTIuaW5kZXhlcykge1xuICAgIGNvbnN0IGFjY2Vzc29yTmFtZSA9IGluZGV4RGVmLmFjY2Vzc29yTmFtZTtcbiAgICBjb25zdCBpbmRleF9pZCA9IHN5cy5pbmRleF9pZF9mcm9tX25hbWUoaW5kZXhEZWYuc291cmNlTmFtZSk7XG4gICAgbGV0IGNvbHVtbl9pZHM7XG4gICAgbGV0IGlzSGFzaEluZGV4ID0gZmFsc2U7XG4gICAgc3dpdGNoIChpbmRleERlZi5hbGdvcml0aG0udGFnKSB7XG4gICAgICBjYXNlIFwiSGFzaFwiOlxuICAgICAgICBpc0hhc2hJbmRleCA9IHRydWU7XG4gICAgICAgIGNvbHVtbl9pZHMgPSBpbmRleERlZi5hbGdvcml0aG0udmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkJUcmVlXCI6XG4gICAgICAgIGNvbHVtbl9pZHMgPSBpbmRleERlZi5hbGdvcml0aG0udmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIkRpcmVjdFwiOlxuICAgICAgICBjb2x1bW5faWRzID0gW2luZGV4RGVmLmFsZ29yaXRobS52YWx1ZV07XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBjb25zdCBudW1Db2x1bW5zID0gY29sdW1uX2lkcy5sZW5ndGg7XG4gICAgY29uc3QgY29sdW1uU2V0ID0gbmV3IFNldChjb2x1bW5faWRzKTtcbiAgICBjb25zdCBpc1VuaXF1ZSA9IHRhYmxlMi5jb25zdHJhaW50cy5maWx0ZXIoKHgpID0+IHguZGF0YS50YWcgPT09IFwiVW5pcXVlXCIpLnNvbWUoKHgpID0+IGNvbHVtblNldC5pc1N1YnNldE9mKG5ldyBTZXQoeC5kYXRhLnZhbHVlLmNvbHVtbnMpKSk7XG4gICAgY29uc3QgaXNQcmltYXJ5S2V5ID0gaXNVbmlxdWUgJiYgY29sdW1uX2lkcy5sZW5ndGggPT09IHRhYmxlMi5wcmltYXJ5S2V5Lmxlbmd0aCAmJiBjb2x1bW5faWRzLmV2ZXJ5KChpZCwgaSkgPT4gdGFibGUyLnByaW1hcnlLZXlbaV0gPT09IGlkKTtcbiAgICBjb25zdCBpbmRleFNlcmlhbGl6ZXJzID0gY29sdW1uX2lkcy5tYXAoXG4gICAgICAoaWQpID0+IEFsZ2VicmFpY1R5cGUubWFrZVNlcmlhbGl6ZXIoXG4gICAgICAgIHJvd1R5cGUudmFsdWUuZWxlbWVudHNbaWRdLmFsZ2VicmFpY1R5cGUsXG4gICAgICAgIHR5cGVzcGFjZVxuICAgICAgKVxuICAgICk7XG4gICAgY29uc3Qgc2VyaWFsaXplUG9pbnQgPSAoYnVmZmVyLCBjb2xWYWwpID0+IHtcbiAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmZmVyKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnVtQ29sdW1uczsgaSsrKSB7XG4gICAgICAgIGluZGV4U2VyaWFsaXplcnNbaV0oQklOQVJZX1dSSVRFUiwgY29sVmFsW2ldKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBCSU5BUllfV1JJVEVSLm9mZnNldDtcbiAgICB9O1xuICAgIGNvbnN0IHNlcmlhbGl6ZVNpbmdsZUVsZW1lbnQgPSBudW1Db2x1bW5zID09PSAxID8gaW5kZXhTZXJpYWxpemVyc1swXSA6IG51bGw7XG4gICAgY29uc3Qgc2VyaWFsaXplU2luZ2xlUG9pbnQgPSBzZXJpYWxpemVTaW5nbGVFbGVtZW50ICYmICgoYnVmZmVyLCBjb2xWYWwpID0+IHtcbiAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmZmVyKTtcbiAgICAgIHNlcmlhbGl6ZVNpbmdsZUVsZW1lbnQoQklOQVJZX1dSSVRFUiwgY29sVmFsKTtcbiAgICAgIHJldHVybiBCSU5BUllfV1JJVEVSLm9mZnNldDtcbiAgICB9KTtcbiAgICBsZXQgaW5kZXg7XG4gICAgaWYgKGlzVW5pcXVlICYmIHNlcmlhbGl6ZVNpbmdsZVBvaW50KSB7XG4gICAgICBjb25zdCBiYXNlID0ge1xuICAgICAgICBmaW5kOiAoY29sVmFsKSA9PiB7XG4gICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgY29uc3QgcG9pbnRfbGVuID0gc2VyaWFsaXplU2luZ2xlUG9pbnQoYnVmLCBjb2xWYWwpO1xuICAgICAgICAgIGNvbnN0IGl0ZXJfaWQgPSBzeXMuZGF0YXN0b3JlX2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB0YWJsZUl0ZXJhdGVPbmUoaXRlcl9pZCwgZGVzZXJpYWxpemVSb3cpO1xuICAgICAgICB9LFxuICAgICAgICBkZWxldGU6IChjb2xWYWwpID0+IHtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVTaW5nbGVQb2ludChidWYsIGNvbFZhbCk7XG4gICAgICAgICAgY29uc3QgbnVtID0gc3lzLmRhdGFzdG9yZV9kZWxldGVfYnlfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuIG51bSA+IDA7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpZiAoaXNQcmltYXJ5S2V5KSB7XG4gICAgICAgIGJhc2UudXBkYXRlID0gKHJvdykgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgIEJJTkFSWV9XUklURVIucmVzZXQoYnVmKTtcbiAgICAgICAgICBzZXJpYWxpemVSb3coQklOQVJZX1dSSVRFUiwgcm93KTtcbiAgICAgICAgICBzeXMuZGF0YXN0b3JlX3VwZGF0ZV9ic2F0bihcbiAgICAgICAgICAgIHRhYmxlX2lkLFxuICAgICAgICAgICAgaW5kZXhfaWQsXG4gICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgQklOQVJZX1dSSVRFUi5vZmZzZXRcbiAgICAgICAgICApO1xuICAgICAgICAgIGludGVncmF0ZUdlbmVyYXRlZENvbHVtbnM/Lihyb3csIGJ1Zi52aWV3KTtcbiAgICAgICAgICByZXR1cm4gcm93O1xuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgaW5kZXggPSBiYXNlO1xuICAgIH0gZWxzZSBpZiAoaXNVbmlxdWUpIHtcbiAgICAgIGNvbnN0IGJhc2UgPSB7XG4gICAgICAgIGZpbmQ6IChjb2xWYWwpID0+IHtcbiAgICAgICAgICBpZiAoY29sVmFsLmxlbmd0aCAhPT0gbnVtQ29sdW1ucykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIndyb25nIG51bWJlciBvZiBlbGVtZW50c1wiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgY29uc3QgcG9pbnRfbGVuID0gc2VyaWFsaXplUG9pbnQoYnVmLCBjb2xWYWwpO1xuICAgICAgICAgIGNvbnN0IGl0ZXJfaWQgPSBzeXMuZGF0YXN0b3JlX2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB0YWJsZUl0ZXJhdGVPbmUoaXRlcl9pZCwgZGVzZXJpYWxpemVSb3cpO1xuICAgICAgICB9LFxuICAgICAgICBkZWxldGU6IChjb2xWYWwpID0+IHtcbiAgICAgICAgICBpZiAoY29sVmFsLmxlbmd0aCAhPT0gbnVtQ29sdW1ucylcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ3cm9uZyBudW1iZXIgb2YgZWxlbWVudHNcIik7XG4gICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgY29uc3QgcG9pbnRfbGVuID0gc2VyaWFsaXplUG9pbnQoYnVmLCBjb2xWYWwpO1xuICAgICAgICAgIGNvbnN0IG51bSA9IHN5cy5kYXRhc3RvcmVfZGVsZXRlX2J5X2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiBudW0gPiAwO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKGlzUHJpbWFyeUtleSkge1xuICAgICAgICBiYXNlLnVwZGF0ZSA9IChyb3cpID0+IHtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBCSU5BUllfV1JJVEVSLnJlc2V0KGJ1Zik7XG4gICAgICAgICAgc2VyaWFsaXplUm93KEJJTkFSWV9XUklURVIsIHJvdyk7XG4gICAgICAgICAgc3lzLmRhdGFzdG9yZV91cGRhdGVfYnNhdG4oXG4gICAgICAgICAgICB0YWJsZV9pZCxcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIEJJTkFSWV9XUklURVIub2Zmc2V0XG4gICAgICAgICAgKTtcbiAgICAgICAgICBpbnRlZ3JhdGVHZW5lcmF0ZWRDb2x1bW5zPy4ocm93LCBidWYudmlldyk7XG4gICAgICAgICAgcmV0dXJuIHJvdztcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGluZGV4ID0gYmFzZTtcbiAgICB9IGVsc2UgaWYgKHNlcmlhbGl6ZVNpbmdsZVBvaW50KSB7XG4gICAgICBjb25zdCByYXdJbmRleCA9IHtcbiAgICAgICAgZmlsdGVyOiAocmFuZ2UpID0+IHtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVTaW5nbGVQb2ludChidWYsIHJhbmdlKTtcbiAgICAgICAgICBjb25zdCBpdGVyX2lkID0gc3lzLmRhdGFzdG9yZV9pbmRleF9zY2FuX3BvaW50X2JzYXRuKFxuICAgICAgICAgICAgaW5kZXhfaWQsXG4gICAgICAgICAgICBidWYuYnVmZmVyLFxuICAgICAgICAgICAgcG9pbnRfbGVuXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm4gdGFibGVJdGVyYXRvcihpdGVyX2lkLCBkZXNlcmlhbGl6ZVJvdyk7XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZTogKHJhbmdlKSA9PiB7XG4gICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgY29uc3QgcG9pbnRfbGVuID0gc2VyaWFsaXplU2luZ2xlUG9pbnQoYnVmLCByYW5nZSk7XG4gICAgICAgICAgcmV0dXJuIHN5cy5kYXRhc3RvcmVfZGVsZXRlX2J5X2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgICAgaWYgKGlzSGFzaEluZGV4KSB7XG4gICAgICAgIGluZGV4ID0gcmF3SW5kZXg7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpbmRleCA9IHJhd0luZGV4O1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNIYXNoSW5kZXgpIHtcbiAgICAgIGluZGV4ID0ge1xuICAgICAgICBmaWx0ZXI6IChyYW5nZSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICAgICAgICAgIGNvbnN0IHBvaW50X2xlbiA9IHNlcmlhbGl6ZVBvaW50KGJ1ZiwgcmFuZ2UpO1xuICAgICAgICAgIGNvbnN0IGl0ZXJfaWQgPSBzeXMuZGF0YXN0b3JlX2luZGV4X3NjYW5fcG9pbnRfYnNhdG4oXG4gICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICBwb2ludF9sZW5cbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybiB0YWJsZUl0ZXJhdG9yKGl0ZXJfaWQsIGRlc2VyaWFsaXplUm93KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGVsZXRlOiAocmFuZ2UpID0+IHtcbiAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVQb2ludChidWYsIHJhbmdlKTtcbiAgICAgICAgICByZXR1cm4gc3lzLmRhdGFzdG9yZV9kZWxldGVfYnlfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgIGluZGV4X2lkLFxuICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNlcmlhbGl6ZVJhbmdlID0gKGJ1ZmZlciwgcmFuZ2UpID0+IHtcbiAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA+IG51bUNvbHVtbnMpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJ0b28gbWFueSBlbGVtZW50c1wiKTtcbiAgICAgICAgQklOQVJZX1dSSVRFUi5yZXNldChidWZmZXIpO1xuICAgICAgICBjb25zdCB3cml0ZXIgPSBCSU5BUllfV1JJVEVSO1xuICAgICAgICBjb25zdCBwcmVmaXhfZWxlbXMgPSByYW5nZS5sZW5ndGggLSAxO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZWZpeF9lbGVtczsgaSsrKSB7XG4gICAgICAgICAgaW5kZXhTZXJpYWxpemVyc1tpXSh3cml0ZXIsIHJhbmdlW2ldKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCByc3RhcnRPZmZzZXQgPSB3cml0ZXIub2Zmc2V0O1xuICAgICAgICBjb25zdCB0ZXJtID0gcmFuZ2VbcmFuZ2UubGVuZ3RoIC0gMV07XG4gICAgICAgIGNvbnN0IHNlcmlhbGl6ZVRlcm0gPSBpbmRleFNlcmlhbGl6ZXJzW3JhbmdlLmxlbmd0aCAtIDFdO1xuICAgICAgICBpZiAodGVybSBpbnN0YW5jZW9mIFJhbmdlKSB7XG4gICAgICAgICAgY29uc3Qgd3JpdGVCb3VuZCA9IChib3VuZCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdGFncyA9IHsgaW5jbHVkZWQ6IDAsIGV4Y2x1ZGVkOiAxLCB1bmJvdW5kZWQ6IDIgfTtcbiAgICAgICAgICAgIHdyaXRlci53cml0ZVU4KHRhZ3NbYm91bmQudGFnXSk7XG4gICAgICAgICAgICBpZiAoYm91bmQudGFnICE9PSBcInVuYm91bmRlZFwiKSBzZXJpYWxpemVUZXJtKHdyaXRlciwgYm91bmQudmFsdWUpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgd3JpdGVCb3VuZCh0ZXJtLmZyb20pO1xuICAgICAgICAgIGNvbnN0IHJzdGFydExlbiA9IHdyaXRlci5vZmZzZXQgLSByc3RhcnRPZmZzZXQ7XG4gICAgICAgICAgd3JpdGVCb3VuZCh0ZXJtLnRvKTtcbiAgICAgICAgICBjb25zdCByZW5kTGVuID0gd3JpdGVyLm9mZnNldCAtIHJzdGFydExlbjtcbiAgICAgICAgICByZXR1cm4gW3JzdGFydE9mZnNldCwgcHJlZml4X2VsZW1zLCByc3RhcnRMZW4sIHJlbmRMZW5dO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHdyaXRlci53cml0ZVU4KDApO1xuICAgICAgICAgIHNlcmlhbGl6ZVRlcm0od3JpdGVyLCB0ZXJtKTtcbiAgICAgICAgICBjb25zdCByc3RhcnRMZW4gPSB3cml0ZXIub2Zmc2V0O1xuICAgICAgICAgIGNvbnN0IHJlbmRMZW4gPSAwO1xuICAgICAgICAgIHJldHVybiBbcnN0YXJ0T2Zmc2V0LCBwcmVmaXhfZWxlbXMsIHJzdGFydExlbiwgcmVuZExlbl07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgICBpbmRleCA9IHtcbiAgICAgICAgZmlsdGVyOiAocmFuZ2UpID0+IHtcbiAgICAgICAgICBpZiAocmFuZ2UubGVuZ3RoID09PSBudW1Db2x1bW5zKSB7XG4gICAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50X2xlbiA9IHNlcmlhbGl6ZVBvaW50KGJ1ZiwgcmFuZ2UpO1xuICAgICAgICAgICAgY29uc3QgaXRlcl9pZCA9IHN5cy5kYXRhc3RvcmVfaW5kZXhfc2Nhbl9wb2ludF9ic2F0bihcbiAgICAgICAgICAgICAgaW5kZXhfaWQsXG4gICAgICAgICAgICAgIGJ1Zi5idWZmZXIsXG4gICAgICAgICAgICAgIHBvaW50X2xlblxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUl0ZXJhdG9yKGl0ZXJfaWQsIGRlc2VyaWFsaXplUm93KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgICBjb25zdCBhcmdzID0gc2VyaWFsaXplUmFuZ2UoYnVmLCByYW5nZSk7XG4gICAgICAgICAgICBjb25zdCBpdGVyX2lkID0gc3lzLmRhdGFzdG9yZV9pbmRleF9zY2FuX3JhbmdlX2JzYXRuKFxuICAgICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgICAgLi4uYXJnc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHJldHVybiB0YWJsZUl0ZXJhdG9yKGl0ZXJfaWQsIGRlc2VyaWFsaXplUm93KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGRlbGV0ZTogKHJhbmdlKSA9PiB7XG4gICAgICAgICAgaWYgKHJhbmdlLmxlbmd0aCA9PT0gbnVtQ29sdW1ucykge1xuICAgICAgICAgICAgY29uc3QgYnVmID0gTEVBRl9CVUY7XG4gICAgICAgICAgICBjb25zdCBwb2ludF9sZW4gPSBzZXJpYWxpemVQb2ludChidWYsIHJhbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBzeXMuZGF0YXN0b3JlX2RlbGV0ZV9ieV9pbmRleF9zY2FuX3BvaW50X2JzYXRuKFxuICAgICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgICAgcG9pbnRfbGVuXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBidWYgPSBMRUFGX0JVRjtcbiAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSBzZXJpYWxpemVSYW5nZShidWYsIHJhbmdlKTtcbiAgICAgICAgICAgIHJldHVybiBzeXMuZGF0YXN0b3JlX2RlbGV0ZV9ieV9pbmRleF9zY2FuX3JhbmdlX2JzYXRuKFxuICAgICAgICAgICAgICBpbmRleF9pZCxcbiAgICAgICAgICAgICAgYnVmLmJ1ZmZlcixcbiAgICAgICAgICAgICAgLi4uYXJnc1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChPYmplY3QuaGFzT3duKHRhYmxlVmlldywgYWNjZXNzb3JOYW1lKSkge1xuICAgICAgZnJlZXplKE9iamVjdC5hc3NpZ24odGFibGVWaWV3W2FjY2Vzc29yTmFtZV0sIGluZGV4KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhYmxlVmlld1thY2Nlc3Nvck5hbWVdID0gZnJlZXplKGluZGV4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZyZWV6ZSh0YWJsZVZpZXcpO1xufVxuZnVuY3Rpb24qIHRhYmxlSXRlcmF0b3IoaWQsIGRlc2VyaWFsaXplKSB7XG4gIHVzaW5nIGl0ZXIgPSBuZXcgSXRlcmF0b3JIYW5kbGUoaWQpO1xuICBjb25zdCBpdGVyQnVmID0gdGFrZUJ1ZigpO1xuICB0cnkge1xuICAgIGxldCBhbXQ7XG4gICAgd2hpbGUgKGFtdCA9IGl0ZXIuYWR2YW5jZShpdGVyQnVmKSkge1xuICAgICAgY29uc3QgcmVhZGVyID0gbmV3IEJpbmFyeVJlYWRlcihpdGVyQnVmLnZpZXcpO1xuICAgICAgd2hpbGUgKHJlYWRlci5vZmZzZXQgPCBhbXQpIHtcbiAgICAgICAgeWllbGQgZGVzZXJpYWxpemUocmVhZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgcmV0dXJuQnVmKGl0ZXJCdWYpO1xuICB9XG59XG5mdW5jdGlvbiB0YWJsZUl0ZXJhdGVPbmUoaWQsIGRlc2VyaWFsaXplKSB7XG4gIGNvbnN0IGJ1ZiA9IExFQUZfQlVGO1xuICBjb25zdCByZXQgPSBhZHZhbmNlSXRlclJhdyhpZCwgYnVmKTtcbiAgaWYgKHJldCAhPT0gMCkge1xuICAgIEJJTkFSWV9SRUFERVIucmVzZXQoYnVmLnZpZXcpO1xuICAgIHJldHVybiBkZXNlcmlhbGl6ZShCSU5BUllfUkVBREVSKTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGFkdmFuY2VJdGVyUmF3KGlkLCBidWYpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIDAgfCBzeXMucm93X2l0ZXJfYnNhdG5fYWR2YW5jZShpZCwgYnVmLmJ1ZmZlcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKGUgJiYgdHlwZW9mIGUgPT09IFwib2JqZWN0XCIgJiYgaGFzT3duKGUsIFwiX19idWZmZXJfdG9vX3NtYWxsX19cIikpIHtcbiAgICAgICAgYnVmLmdyb3coZS5fX2J1ZmZlcl90b29fc21hbGxfXyk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH1cbn1cbnZhciBERUZBVUxUX0JVRkZFUl9DQVBBQ0lUWSA9IDMyICogMTAyNCAqIDI7XG52YXIgSVRFUl9CVUZTID0gW1xuICBuZXcgUmVzaXphYmxlQnVmZmVyKERFRkFVTFRfQlVGRkVSX0NBUEFDSVRZKVxuXTtcbnZhciBJVEVSX0JVRl9DT1VOVCA9IDE7XG5mdW5jdGlvbiB0YWtlQnVmKCkge1xuICByZXR1cm4gSVRFUl9CVUZfQ09VTlQgPyBJVEVSX0JVRlNbLS1JVEVSX0JVRl9DT1VOVF0gOiBuZXcgUmVzaXphYmxlQnVmZmVyKERFRkFVTFRfQlVGRkVSX0NBUEFDSVRZKTtcbn1cbmZ1bmN0aW9uIHJldHVybkJ1ZihidWYpIHtcbiAgSVRFUl9CVUZTW0lURVJfQlVGX0NPVU5UKytdID0gYnVmO1xufVxudmFyIExFQUZfQlVGID0gbmV3IFJlc2l6YWJsZUJ1ZmZlcihERUZBVUxUX0JVRkZFUl9DQVBBQ0lUWSk7XG52YXIgSXRlcmF0b3JIYW5kbGUgPSBjbGFzcyBfSXRlcmF0b3JIYW5kbGUge1xuICAjaWQ7XG4gIHN0YXRpYyAjZmluYWxpemF0aW9uUmVnaXN0cnkgPSBuZXcgRmluYWxpemF0aW9uUmVnaXN0cnkoXG4gICAgc3lzLnJvd19pdGVyX2JzYXRuX2Nsb3NlXG4gICk7XG4gIGNvbnN0cnVjdG9yKGlkKSB7XG4gICAgdGhpcy4jaWQgPSBpZDtcbiAgICBfSXRlcmF0b3JIYW5kbGUuI2ZpbmFsaXphdGlvblJlZ2lzdHJ5LnJlZ2lzdGVyKHRoaXMsIGlkLCB0aGlzKTtcbiAgfVxuICAvKiogVW5yZWdpc3RlciB0aGlzIG9iamVjdCB3aXRoIHRoZSBmaW5hbGl6YXRpb24gcmVnaXN0cnkgYW5kIHJldHVybiB0aGUgaWQgKi9cbiAgI2RldGFjaCgpIHtcbiAgICBjb25zdCBpZCA9IHRoaXMuI2lkO1xuICAgIHRoaXMuI2lkID0gLTE7XG4gICAgX0l0ZXJhdG9ySGFuZGxlLiNmaW5hbGl6YXRpb25SZWdpc3RyeS51bnJlZ2lzdGVyKHRoaXMpO1xuICAgIHJldHVybiBpZDtcbiAgfVxuICAvKiogQ2FsbCBgcm93X2l0ZXJfYnNhdG5fYWR2YW5jZWAsIHJldHVybmluZyAwIGlmIHRoaXMgaXRlcmF0b3IgaGFzIGJlZW4gZXhoYXVzdGVkLiAqL1xuICBhZHZhbmNlKGJ1Zikge1xuICAgIGlmICh0aGlzLiNpZCA9PT0gLTEpIHJldHVybiAwO1xuICAgIGNvbnN0IHJldCA9IGFkdmFuY2VJdGVyUmF3KHRoaXMuI2lkLCBidWYpO1xuICAgIGlmIChyZXQgPD0gMCkgdGhpcy4jZGV0YWNoKCk7XG4gICAgcmV0dXJuIHJldCA8IDAgPyAtcmV0IDogcmV0O1xuICB9XG4gIFtTeW1ib2wuZGlzcG9zZV0oKSB7XG4gICAgaWYgKHRoaXMuI2lkID49IDApIHtcbiAgICAgIGNvbnN0IGlkID0gdGhpcy4jZGV0YWNoKCk7XG4gICAgICBzeXMucm93X2l0ZXJfYnNhdG5fY2xvc2UoaWQpO1xuICAgIH1cbiAgfVxufTtcblxuLy8gc3JjL3NlcnZlci9odHRwX2ludGVybmFsLnRzXG52YXIgeyBmcmVlemU6IGZyZWV6ZTIgfSA9IE9iamVjdDtcbnZhciB0ZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigpO1xudmFyIHRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFxuICBcInV0Zi04XCJcbiAgLyogeyBmYXRhbDogdHJ1ZSB9ICovXG4pO1xudmFyIG1ha2VSZXNwb25zZSA9IFN5bWJvbChcIm1ha2VSZXNwb25zZVwiKTtcbnZhciBTeW5jUmVzcG9uc2UgPSBjbGFzcyBfU3luY1Jlc3BvbnNlIHtcbiAgI2JvZHk7XG4gICNpbm5lcjtcbiAgY29uc3RydWN0b3IoYm9keSwgaW5pdCkge1xuICAgIGlmIChib2R5ID09IG51bGwpIHtcbiAgICAgIHRoaXMuI2JvZHkgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHRoaXMuI2JvZHkgPSBib2R5O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLiNib2R5ID0gbmV3IFVpbnQ4QXJyYXkoYm9keSkuYnVmZmVyO1xuICAgIH1cbiAgICB0aGlzLiNpbm5lciA9IHtcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKGluaXQ/LmhlYWRlcnMpLFxuICAgICAgc3RhdHVzOiBpbml0Py5zdGF0dXMgPz8gMjAwLFxuICAgICAgc3RhdHVzVGV4dDogaW5pdD8uc3RhdHVzVGV4dCA/PyBcIlwiLFxuICAgICAgdHlwZTogXCJkZWZhdWx0XCIsXG4gICAgICB1cmw6IG51bGwsXG4gICAgICBhYm9ydGVkOiBmYWxzZVxuICAgIH07XG4gIH1cbiAgc3RhdGljIFttYWtlUmVzcG9uc2VdKGJvZHksIGlubmVyKSB7XG4gICAgY29uc3QgbWUgPSBuZXcgX1N5bmNSZXNwb25zZShib2R5KTtcbiAgICBtZS4jaW5uZXIgPSBpbm5lcjtcbiAgICByZXR1cm4gbWU7XG4gIH1cbiAgZ2V0IGhlYWRlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lubmVyLmhlYWRlcnM7XG4gIH1cbiAgZ2V0IHN0YXR1cygpIHtcbiAgICByZXR1cm4gdGhpcy4jaW5uZXIuc3RhdHVzO1xuICB9XG4gIGdldCBzdGF0dXNUZXh0KCkge1xuICAgIHJldHVybiB0aGlzLiNpbm5lci5zdGF0dXNUZXh0O1xuICB9XG4gIGdldCBvaygpIHtcbiAgICByZXR1cm4gMjAwIDw9IHRoaXMuI2lubmVyLnN0YXR1cyAmJiB0aGlzLiNpbm5lci5zdGF0dXMgPD0gMjk5O1xuICB9XG4gIGdldCB1cmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuI2lubmVyLnVybCA/PyBcIlwiO1xuICB9XG4gIGdldCB0eXBlKCkge1xuICAgIHJldHVybiB0aGlzLiNpbm5lci50eXBlO1xuICB9XG4gIGFycmF5QnVmZmVyKCkge1xuICAgIHJldHVybiB0aGlzLmJ5dGVzKCkuYnVmZmVyO1xuICB9XG4gIGJ5dGVzKCkge1xuICAgIGlmICh0aGlzLiNib2R5ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSgpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHRoaXMuI2JvZHkgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiB0ZXh0RW5jb2Rlci5lbmNvZGUodGhpcy4jYm9keSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuZXcgVWludDhBcnJheSh0aGlzLiNib2R5KTtcbiAgICB9XG4gIH1cbiAganNvbigpIHtcbiAgICByZXR1cm4gSlNPTi5wYXJzZSh0aGlzLnRleHQoKSk7XG4gIH1cbiAgdGV4dCgpIHtcbiAgICBpZiAodGhpcy4jYm9keSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLiNib2R5ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICByZXR1cm4gdGhpcy4jYm9keTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRleHREZWNvZGVyLmRlY29kZSh0aGlzLiNib2R5KTtcbiAgICB9XG4gIH1cbn07XG52YXIgcmVxdWVzdEJhc2VTaXplID0gYnNhdG5CYXNlU2l6ZSh7IHR5cGVzOiBbXSB9LCBIdHRwUmVxdWVzdC5hbGdlYnJhaWNUeXBlKTtcbnZhciBtZXRob2RzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoW1xuICBbXCJHRVRcIiwgeyB0YWc6IFwiR2V0XCIgfV0sXG4gIFtcIkhFQURcIiwgeyB0YWc6IFwiSGVhZFwiIH1dLFxuICBbXCJQT1NUXCIsIHsgdGFnOiBcIlBvc3RcIiB9XSxcbiAgW1wiUFVUXCIsIHsgdGFnOiBcIlB1dFwiIH1dLFxuICBbXCJERUxFVEVcIiwgeyB0YWc6IFwiRGVsZXRlXCIgfV0sXG4gIFtcIkNPTk5FQ1RcIiwgeyB0YWc6IFwiQ29ubmVjdFwiIH1dLFxuICBbXCJPUFRJT05TXCIsIHsgdGFnOiBcIk9wdGlvbnNcIiB9XSxcbiAgW1wiVFJBQ0VcIiwgeyB0YWc6IFwiVHJhY2VcIiB9XSxcbiAgW1wiUEFUQ0hcIiwgeyB0YWc6IFwiUGF0Y2hcIiB9XVxuXSk7XG5mdW5jdGlvbiBmZXRjaCh1cmwsIGluaXQgPSB7fSkge1xuICBjb25zdCBtZXRob2QgPSBtZXRob2RzLmdldChpbml0Lm1ldGhvZD8udG9VcHBlckNhc2UoKSA/PyBcIkdFVFwiKSA/PyB7XG4gICAgdGFnOiBcIkV4dGVuc2lvblwiLFxuICAgIHZhbHVlOiBpbml0Lm1ldGhvZFxuICB9O1xuICBjb25zdCBoZWFkZXJzID0ge1xuICAgIC8vIGFueXMgYmVjYXVzZSB0aGUgdHlwaW5ncyBhcmUgd29ua3kgLSBzZWUgY29tbWVudCBpbiBTeW5jUmVzcG9uc2UuY29uc3RydWN0b3JcbiAgICBlbnRyaWVzOiBoZWFkZXJzVG9MaXN0KG5ldyBIZWFkZXJzKGluaXQuaGVhZGVycykpLmZsYXRNYXAoKFtrLCB2XSkgPT4gQXJyYXkuaXNBcnJheSh2KSA/IHYubWFwKCh2MikgPT4gW2ssIHYyXSkgOiBbW2ssIHZdXSkubWFwKChbbmFtZSwgdmFsdWVdKSA9PiAoeyBuYW1lLCB2YWx1ZTogdGV4dEVuY29kZXIuZW5jb2RlKHZhbHVlKSB9KSlcbiAgfTtcbiAgY29uc3QgdXJpID0gXCJcIiArIHVybDtcbiAgY29uc3QgcmVxdWVzdCA9IGZyZWV6ZTIoe1xuICAgIG1ldGhvZCxcbiAgICBoZWFkZXJzLFxuICAgIHRpbWVvdXQ6IGluaXQudGltZW91dCxcbiAgICB1cmksXG4gICAgdmVyc2lvbjogeyB0YWc6IFwiSHR0cDExXCIgfVxuICB9KTtcbiAgY29uc3QgcmVxdWVzdEJ1ZiA9IG5ldyBCaW5hcnlXcml0ZXIocmVxdWVzdEJhc2VTaXplKTtcbiAgSHR0cFJlcXVlc3Quc2VyaWFsaXplKHJlcXVlc3RCdWYsIHJlcXVlc3QpO1xuICBjb25zdCBib2R5ID0gaW5pdC5ib2R5ID09IG51bGwgPyBuZXcgVWludDhBcnJheSgpIDogdHlwZW9mIGluaXQuYm9keSA9PT0gXCJzdHJpbmdcIiA/IGluaXQuYm9keSA6IG5ldyBVaW50OEFycmF5KGluaXQuYm9keSk7XG4gIGNvbnN0IFtyZXNwb25zZUJ1ZiwgcmVzcG9uc2VCb2R5XSA9IHN5cy5wcm9jZWR1cmVfaHR0cF9yZXF1ZXN0KFxuICAgIHJlcXVlc3RCdWYuZ2V0QnVmZmVyKCksXG4gICAgYm9keVxuICApO1xuICBjb25zdCByZXNwb25zZSA9IEh0dHBSZXNwb25zZS5kZXNlcmlhbGl6ZShuZXcgQmluYXJ5UmVhZGVyKHJlc3BvbnNlQnVmKSk7XG4gIHJldHVybiBTeW5jUmVzcG9uc2VbbWFrZVJlc3BvbnNlXShyZXNwb25zZUJvZHksIHtcbiAgICB0eXBlOiBcImJhc2ljXCIsXG4gICAgdXJsOiB1cmksXG4gICAgc3RhdHVzOiByZXNwb25zZS5jb2RlLFxuICAgIHN0YXR1c1RleHQ6ICgwLCBpbXBvcnRfc3RhdHVzZXMuZGVmYXVsdCkocmVzcG9uc2UuY29kZSksXG4gICAgaGVhZGVyczogbmV3IEhlYWRlcnMoKSxcbiAgICBhYm9ydGVkOiBmYWxzZVxuICB9KTtcbn1cbmZyZWV6ZTIoZmV0Y2gpO1xudmFyIGh0dHBDbGllbnQgPSBmcmVlemUyKHsgZmV0Y2ggfSk7XG5cbi8vIHNyYy9zZXJ2ZXIvcHJvY2VkdXJlcy50c1xuZnVuY3Rpb24gbWFrZVByb2NlZHVyZUV4cG9ydChjdHgsIG9wdHMsIHBhcmFtcywgcmV0LCBmbikge1xuICBjb25zdCBuYW1lID0gb3B0cz8ubmFtZTtcbiAgY29uc3QgcHJvY2VkdXJlRXhwb3J0ID0gKC4uLmFyZ3MpID0+IGZuKC4uLmFyZ3MpO1xuICBwcm9jZWR1cmVFeHBvcnRbZXhwb3J0Q29udGV4dF0gPSBjdHg7XG4gIHByb2NlZHVyZUV4cG9ydFtyZWdpc3RlckV4cG9ydF0gPSAoY3R4MiwgZXhwb3J0TmFtZSkgPT4ge1xuICAgIHJlZ2lzdGVyUHJvY2VkdXJlKGN0eDIsIG5hbWUgPz8gZXhwb3J0TmFtZSwgcGFyYW1zLCByZXQsIGZuKTtcbiAgICBjdHgyLmZ1bmN0aW9uRXhwb3J0cy5zZXQoXG4gICAgICBwcm9jZWR1cmVFeHBvcnQsXG4gICAgICBuYW1lID8/IGV4cG9ydE5hbWVcbiAgICApO1xuICB9O1xuICByZXR1cm4gcHJvY2VkdXJlRXhwb3J0O1xufVxudmFyIFRyYW5zYWN0aW9uQ3R4SW1wbCA9IGNsYXNzIFRyYW5zYWN0aW9uQ3R4IGV4dGVuZHMgUmVkdWNlckN0eEltcGwge1xufTtcbmZ1bmN0aW9uIHJlZ2lzdGVyUHJvY2VkdXJlKGN0eCwgZXhwb3J0TmFtZSwgcGFyYW1zLCByZXQsIGZuLCBvcHRzKSB7XG4gIGN0eC5kZWZpbmVGdW5jdGlvbihleHBvcnROYW1lKTtcbiAgY29uc3QgcGFyYW1zVHlwZSA9IHtcbiAgICBlbGVtZW50czogT2JqZWN0LmVudHJpZXMocGFyYW1zKS5tYXAoKFtuLCBjXSkgPT4gKHtcbiAgICAgIG5hbWU6IG4sXG4gICAgICBhbGdlYnJhaWNUeXBlOiBjdHgucmVnaXN0ZXJUeXBlc1JlY3Vyc2l2ZWx5KFxuICAgICAgICBcInR5cGVCdWlsZGVyXCIgaW4gYyA/IGMudHlwZUJ1aWxkZXIgOiBjXG4gICAgICApLmFsZ2VicmFpY1R5cGVcbiAgICB9KSlcbiAgfTtcbiAgY29uc3QgcmV0dXJuVHlwZSA9IGN0eC5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkocmV0KS5hbGdlYnJhaWNUeXBlO1xuICBjdHgubW9kdWxlRGVmLnByb2NlZHVyZXMucHVzaCh7XG4gICAgc291cmNlTmFtZTogZXhwb3J0TmFtZSxcbiAgICBwYXJhbXM6IHBhcmFtc1R5cGUsXG4gICAgcmV0dXJuVHlwZSxcbiAgICB2aXNpYmlsaXR5OiBGdW5jdGlvblZpc2liaWxpdHkuQ2xpZW50Q2FsbGFibGVcbiAgfSk7XG4gIGNvbnN0IHsgdHlwZXNwYWNlIH0gPSBjdHg7XG4gIGN0eC5wcm9jZWR1cmVzLnB1c2goe1xuICAgIGZuLFxuICAgIGRlc2VyaWFsaXplQXJnczogUHJvZHVjdFR5cGUubWFrZURlc2VyaWFsaXplcihwYXJhbXNUeXBlLCB0eXBlc3BhY2UpLFxuICAgIHNlcmlhbGl6ZVJldHVybjogQWxnZWJyYWljVHlwZS5tYWtlU2VyaWFsaXplcihyZXR1cm5UeXBlLCB0eXBlc3BhY2UpLFxuICAgIHJldHVyblR5cGVCYXNlU2l6ZTogYnNhdG5CYXNlU2l6ZSh0eXBlc3BhY2UsIHJldHVyblR5cGUpXG4gIH0pO1xufVxuZnVuY3Rpb24gY2FsbFByb2NlZHVyZShtb2R1bGVDdHgsIGlkLCBzZW5kZXIsIGNvbm5lY3Rpb25JZCwgdGltZXN0YW1wLCBhcmdzQnVmLCBkYlZpZXcpIHtcbiAgY29uc3QgeyBmbiwgZGVzZXJpYWxpemVBcmdzLCBzZXJpYWxpemVSZXR1cm4sIHJldHVyblR5cGVCYXNlU2l6ZSB9ID0gbW9kdWxlQ3R4LnByb2NlZHVyZXNbaWRdO1xuICBjb25zdCBhcmdzID0gZGVzZXJpYWxpemVBcmdzKG5ldyBCaW5hcnlSZWFkZXIoYXJnc0J1ZikpO1xuICBjb25zdCBjdHggPSBuZXcgUHJvY2VkdXJlQ3R4SW1wbChcbiAgICBzZW5kZXIsXG4gICAgdGltZXN0YW1wLFxuICAgIGNvbm5lY3Rpb25JZCxcbiAgICBkYlZpZXdcbiAgKTtcbiAgY29uc3QgcmV0ID0gY2FsbFVzZXJGdW5jdGlvbihmbiwgY3R4LCBhcmdzKTtcbiAgY29uc3QgcmV0QnVmID0gbmV3IEJpbmFyeVdyaXRlcihyZXR1cm5UeXBlQmFzZVNpemUpO1xuICBzZXJpYWxpemVSZXR1cm4ocmV0QnVmLCByZXQpO1xuICByZXR1cm4gcmV0QnVmLmdldEJ1ZmZlcigpO1xufVxudmFyIFByb2NlZHVyZUN0eEltcGwgPSBjbGFzcyBQcm9jZWR1cmVDdHgge1xuICBjb25zdHJ1Y3RvcihzZW5kZXIsIHRpbWVzdGFtcCwgY29ubmVjdGlvbklkLCBkYlZpZXcpIHtcbiAgICB0aGlzLnNlbmRlciA9IHNlbmRlcjtcbiAgICB0aGlzLnRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICB0aGlzLmNvbm5lY3Rpb25JZCA9IGNvbm5lY3Rpb25JZDtcbiAgICB0aGlzLiNkYlZpZXcgPSBkYlZpZXc7XG4gIH1cbiAgI2lkZW50aXR5O1xuICAjdXVpZENvdW50ZXI7XG4gICNyYW5kb207XG4gICNkYlZpZXc7XG4gIGdldCBpZGVudGl0eSgpIHtcbiAgICByZXR1cm4gdGhpcy4jaWRlbnRpdHkgPz89IG5ldyBJZGVudGl0eShzeXMuaWRlbnRpdHkoKSk7XG4gIH1cbiAgZ2V0IHJhbmRvbSgpIHtcbiAgICByZXR1cm4gdGhpcy4jcmFuZG9tID8/PSBtYWtlUmFuZG9tKHRoaXMudGltZXN0YW1wKTtcbiAgfVxuICBnZXQgaHR0cCgpIHtcbiAgICByZXR1cm4gaHR0cENsaWVudDtcbiAgfVxuICB3aXRoVHgoYm9keSkge1xuICAgIGNvbnN0IHJ1biA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHRpbWVzdGFtcCA9IHN5cy5wcm9jZWR1cmVfc3RhcnRfbXV0X3R4KCk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBjdHggPSBuZXcgVHJhbnNhY3Rpb25DdHhJbXBsKFxuICAgICAgICAgIHRoaXMuc2VuZGVyLFxuICAgICAgICAgIG5ldyBUaW1lc3RhbXAodGltZXN0YW1wKSxcbiAgICAgICAgICB0aGlzLmNvbm5lY3Rpb25JZCxcbiAgICAgICAgICB0aGlzLiNkYlZpZXcoKVxuICAgICAgICApO1xuICAgICAgICByZXR1cm4gYm9keShjdHgpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBzeXMucHJvY2VkdXJlX2Fib3J0X211dF90eCgpO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH07XG4gICAgbGV0IHJlcyA9IHJ1bigpO1xuICAgIHRyeSB7XG4gICAgICBzeXMucHJvY2VkdXJlX2NvbW1pdF9tdXRfdHgoKTtcbiAgICAgIHJldHVybiByZXM7XG4gICAgfSBjYXRjaCB7XG4gICAgfVxuICAgIGNvbnNvbGUud2FybihcImNvbW1pdHRpbmcgYW5vbnltb3VzIHRyYW5zYWN0aW9uIGZhaWxlZFwiKTtcbiAgICByZXMgPSBydW4oKTtcbiAgICB0cnkge1xuICAgICAgc3lzLnByb2NlZHVyZV9jb21taXRfbXV0X3R4KCk7XG4gICAgICByZXR1cm4gcmVzO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInRyYW5zYWN0aW9uIHJldHJ5IGZhaWxlZCBhZ2FpblwiLCB7IGNhdXNlOiBlIH0pO1xuICAgIH1cbiAgfVxuICBuZXdVdWlkVjQoKSB7XG4gICAgY29uc3QgYnl0ZXMgPSB0aGlzLnJhbmRvbS5maWxsKG5ldyBVaW50OEFycmF5KDE2KSk7XG4gICAgcmV0dXJuIFV1aWQuZnJvbVJhbmRvbUJ5dGVzVjQoYnl0ZXMpO1xuICB9XG4gIG5ld1V1aWRWNygpIHtcbiAgICBjb25zdCBieXRlcyA9IHRoaXMucmFuZG9tLmZpbGwobmV3IFVpbnQ4QXJyYXkoNCkpO1xuICAgIGNvbnN0IGNvdW50ZXIgPSB0aGlzLiN1dWlkQ291bnRlciA/Pz0geyB2YWx1ZTogMCB9O1xuICAgIHJldHVybiBVdWlkLmZyb21Db3VudGVyVjcoY291bnRlciwgdGhpcy50aW1lc3RhbXAsIGJ5dGVzKTtcbiAgfVxufTtcblxuLy8gc3JjL3NlcnZlci9yZWR1Y2Vycy50c1xuZnVuY3Rpb24gbWFrZVJlZHVjZXJFeHBvcnQoY3R4LCBvcHRzLCBwYXJhbXMsIGZuLCBsaWZlY3ljbGUpIHtcbiAgY29uc3QgcmVkdWNlckV4cG9ydCA9ICguLi5hcmdzKSA9PiBmbiguLi5hcmdzKTtcbiAgcmVkdWNlckV4cG9ydFtleHBvcnRDb250ZXh0XSA9IGN0eDtcbiAgcmVkdWNlckV4cG9ydFtyZWdpc3RlckV4cG9ydF0gPSAoY3R4MiwgZXhwb3J0TmFtZSkgPT4ge1xuICAgIHJlZ2lzdGVyUmVkdWNlcihjdHgyLCBleHBvcnROYW1lLCBwYXJhbXMsIGZuLCBvcHRzLCBsaWZlY3ljbGUpO1xuICAgIGN0eDIuZnVuY3Rpb25FeHBvcnRzLnNldChcbiAgICAgIHJlZHVjZXJFeHBvcnQsXG4gICAgICBleHBvcnROYW1lXG4gICAgKTtcbiAgfTtcbiAgcmV0dXJuIHJlZHVjZXJFeHBvcnQ7XG59XG5mdW5jdGlvbiByZWdpc3RlclJlZHVjZXIoY3R4LCBleHBvcnROYW1lLCBwYXJhbXMsIGZuLCBvcHRzLCBsaWZlY3ljbGUpIHtcbiAgY3R4LmRlZmluZUZ1bmN0aW9uKGV4cG9ydE5hbWUpO1xuICBpZiAoIShwYXJhbXMgaW5zdGFuY2VvZiBSb3dCdWlsZGVyKSkge1xuICAgIHBhcmFtcyA9IG5ldyBSb3dCdWlsZGVyKHBhcmFtcyk7XG4gIH1cbiAgaWYgKHBhcmFtcy50eXBlTmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgcGFyYW1zLnR5cGVOYW1lID0gdG9QYXNjYWxDYXNlKGV4cG9ydE5hbWUpO1xuICB9XG4gIGNvbnN0IHJlZiA9IGN0eC5yZWdpc3RlclR5cGVzUmVjdXJzaXZlbHkocGFyYW1zKTtcbiAgY29uc3QgcGFyYW1zVHlwZSA9IGN0eC5yZXNvbHZlVHlwZShyZWYpLnZhbHVlO1xuICBjb25zdCBpc0xpZmVjeWNsZSA9IGxpZmVjeWNsZSAhPSBudWxsO1xuICBjdHgubW9kdWxlRGVmLnJlZHVjZXJzLnB1c2goe1xuICAgIHNvdXJjZU5hbWU6IGV4cG9ydE5hbWUsXG4gICAgcGFyYW1zOiBwYXJhbXNUeXBlLFxuICAgIC8vTW9kdWxlRGVmIHZhbGlkYXRpb24gY29kZSBpcyByZXNwb25zaWJsZSB0byBtYXJrIHByaXZhdGUgcmVkdWNlcnNcbiAgICB2aXNpYmlsaXR5OiBGdW5jdGlvblZpc2liaWxpdHkuQ2xpZW50Q2FsbGFibGUsXG4gICAgLy9IYXJkY29kZWQgZm9yIG5vdyAtIHJlZHVjZXJzIGRvIG5vdCByZXR1cm4gdmFsdWVzIHlldFxuICAgIG9rUmV0dXJuVHlwZTogQWxnZWJyYWljVHlwZS5Qcm9kdWN0KHsgZWxlbWVudHM6IFtdIH0pLFxuICAgIGVyclJldHVyblR5cGU6IEFsZ2VicmFpY1R5cGUuU3RyaW5nXG4gIH0pO1xuICBpZiAob3B0cz8ubmFtZSAhPSBudWxsKSB7XG4gICAgY3R4Lm1vZHVsZURlZi5leHBsaWNpdE5hbWVzLmVudHJpZXMucHVzaCh7XG4gICAgICB0YWc6IFwiRnVuY3Rpb25cIixcbiAgICAgIHZhbHVlOiB7XG4gICAgICAgIHNvdXJjZU5hbWU6IGV4cG9ydE5hbWUsXG4gICAgICAgIGNhbm9uaWNhbE5hbWU6IG9wdHMubmFtZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGlmIChpc0xpZmVjeWNsZSkge1xuICAgIGN0eC5tb2R1bGVEZWYubGlmZUN5Y2xlUmVkdWNlcnMucHVzaCh7XG4gICAgICBsaWZlY3ljbGVTcGVjOiBsaWZlY3ljbGUsXG4gICAgICBmdW5jdGlvbk5hbWU6IGV4cG9ydE5hbWVcbiAgICB9KTtcbiAgfVxuICBpZiAoIWZuLm5hbWUpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZm4sIFwibmFtZVwiLCB7IHZhbHVlOiBleHBvcnROYW1lLCB3cml0YWJsZTogZmFsc2UgfSk7XG4gIH1cbiAgY3R4LnJlZHVjZXJzLnB1c2goZm4pO1xufVxuXG4vLyBzcmMvc2VydmVyL3NjaGVtYS50c1xudmFyIFNjaGVtYUlubmVyID0gY2xhc3MgZXh0ZW5kcyBNb2R1bGVDb250ZXh0IHtcbiAgc2NoZW1hVHlwZTtcbiAgZXhpc3RpbmdGdW5jdGlvbnMgPSAvKiBAX19QVVJFX18gKi8gbmV3IFNldCgpO1xuICByZWR1Y2VycyA9IFtdO1xuICBwcm9jZWR1cmVzID0gW107XG4gIHZpZXdzID0gW107XG4gIGFub25WaWV3cyA9IFtdO1xuICAvKipcbiAgICogTWFwcyBSZWR1Y2VyRXhwb3J0IG9iamVjdHMgdG8gdGhlIG5hbWUgb2YgdGhlIHJlZHVjZXIuXG4gICAqIFVzZWQgZm9yIHJlc29sdmluZyB0aGUgcmVkdWNlcnMgb2Ygc2NoZWR1bGVkIHRhYmxlcy5cbiAgICovXG4gIGZ1bmN0aW9uRXhwb3J0cyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG4gIHBlbmRpbmdTY2hlZHVsZXMgPSBbXTtcbiAgY29uc3RydWN0b3IoZ2V0U2NoZW1hVHlwZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zY2hlbWFUeXBlID0gZ2V0U2NoZW1hVHlwZSh0aGlzKTtcbiAgfVxuICBkZWZpbmVGdW5jdGlvbihuYW1lKSB7XG4gICAgaWYgKHRoaXMuZXhpc3RpbmdGdW5jdGlvbnMuaGFzKG5hbWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICBgVGhlcmUgaXMgYWxyZWFkeSBhIHJlZHVjZXIgb3IgcHJvY2VkdXJlIHdpdGggdGhlIG5hbWUgJyR7bmFtZX0nYFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5leGlzdGluZ0Z1bmN0aW9ucy5hZGQobmFtZSk7XG4gIH1cbiAgcmVzb2x2ZVNjaGVkdWxlcygpIHtcbiAgICBmb3IgKGNvbnN0IHsgcmVkdWNlciwgc2NoZWR1bGVBdENvbCwgdGFibGVOYW1lIH0gb2YgdGhpcy5wZW5kaW5nU2NoZWR1bGVzKSB7XG4gICAgICBjb25zdCBmdW5jdGlvbk5hbWUgPSB0aGlzLmZ1bmN0aW9uRXhwb3J0cy5nZXQocmVkdWNlcigpKTtcbiAgICAgIGlmIChmdW5jdGlvbk5hbWUgPT09IHZvaWQgMCkge1xuICAgICAgICBjb25zdCBtc2cgPSBgVGFibGUgJHt0YWJsZU5hbWV9IGRlZmluZXMgYSBzY2hlZHVsZSwgYnV0IGl0IHNlZW1zIGxpa2UgdGhlIGFzc29jaWF0ZWQgZnVuY3Rpb24gd2FzIG5vdCBleHBvcnRlZC5gO1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB0aGlzLm1vZHVsZURlZi5zY2hlZHVsZXMucHVzaCh7XG4gICAgICAgIHNvdXJjZU5hbWU6IHZvaWQgMCxcbiAgICAgICAgdGFibGVOYW1lLFxuICAgICAgICBzY2hlZHVsZUF0Q29sLFxuICAgICAgICBmdW5jdGlvbk5hbWVcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTtcbnZhciBTY2hlbWEgPSBjbGFzcyB7XG4gICNjdHg7XG4gIGNvbnN0cnVjdG9yKGN0eCkge1xuICAgIHRoaXMuI2N0eCA9IGN0eDtcbiAgfVxuICBbbW9kdWxlSG9va3NdKGV4cG9ydHMpIHtcbiAgICBjb25zdCByZWdpc3RlcmVkU2NoZW1hID0gdGhpcy4jY3R4O1xuICAgIGZvciAoY29uc3QgW25hbWUsIG1vZHVsZUV4cG9ydF0gb2YgT2JqZWN0LmVudHJpZXMoZXhwb3J0cykpIHtcbiAgICAgIGlmIChuYW1lID09PSBcImRlZmF1bHRcIikgY29udGludWU7XG4gICAgICBpZiAoIWlzTW9kdWxlRXhwb3J0KG1vZHVsZUV4cG9ydCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgICBcImV4cG9ydGluZyBzb21ldGhpbmcgdGhhdCBpcyBub3QgYSBzcGFjZXRpbWUgZXhwb3J0XCJcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICAgIGNoZWNrRXhwb3J0Q29udGV4dChtb2R1bGVFeHBvcnQsIHJlZ2lzdGVyZWRTY2hlbWEpO1xuICAgICAgbW9kdWxlRXhwb3J0W3JlZ2lzdGVyRXhwb3J0XShyZWdpc3RlcmVkU2NoZW1hLCBuYW1lKTtcbiAgICB9XG4gICAgcmVnaXN0ZXJlZFNjaGVtYS5yZXNvbHZlU2NoZWR1bGVzKCk7XG4gICAgcmV0dXJuIG1ha2VIb29rcyhyZWdpc3RlcmVkU2NoZW1hKTtcbiAgfVxuICBnZXQgc2NoZW1hVHlwZSgpIHtcbiAgICByZXR1cm4gdGhpcy4jY3R4LnNjaGVtYVR5cGU7XG4gIH1cbiAgZ2V0IG1vZHVsZURlZigpIHtcbiAgICByZXR1cm4gdGhpcy4jY3R4Lm1vZHVsZURlZjtcbiAgfVxuICBnZXQgdHlwZXNwYWNlKCkge1xuICAgIHJldHVybiB0aGlzLiNjdHgudHlwZXNwYWNlO1xuICB9XG4gIHJlZHVjZXIoLi4uYXJncykge1xuICAgIGxldCBvcHRzLCBwYXJhbXMgPSB7fSwgZm47XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBbZm5dID0gYXJncztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6IHtcbiAgICAgICAgbGV0IGFyZzE7XG4gICAgICAgIFthcmcxLCBmbl0gPSBhcmdzO1xuICAgICAgICBpZiAodHlwZW9mIGFyZzEubmFtZSA9PT0gXCJzdHJpbmdcIikgb3B0cyA9IGFyZzE7XG4gICAgICAgIGVsc2UgcGFyYW1zID0gYXJnMTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDM6XG4gICAgICAgIFtvcHRzLCBwYXJhbXMsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVJlZHVjZXJFeHBvcnQodGhpcy4jY3R4LCBvcHRzLCBwYXJhbXMsIGZuKTtcbiAgfVxuICBpbml0KC4uLmFyZ3MpIHtcbiAgICBsZXQgb3B0cywgZm47XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBbZm5dID0gYXJncztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIFtvcHRzLCBmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VSZWR1Y2VyRXhwb3J0KHRoaXMuI2N0eCwgb3B0cywge30sIGZuLCBMaWZlY3ljbGUuSW5pdCk7XG4gIH1cbiAgY2xpZW50Q29ubmVjdGVkKC4uLmFyZ3MpIHtcbiAgICBsZXQgb3B0cywgZm47XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAxOlxuICAgICAgICBbZm5dID0gYXJncztcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIFtvcHRzLCBmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VSZWR1Y2VyRXhwb3J0KHRoaXMuI2N0eCwgb3B0cywge30sIGZuLCBMaWZlY3ljbGUuT25Db25uZWN0KTtcbiAgfVxuICBjbGllbnREaXNjb25uZWN0ZWQoLi4uYXJncykge1xuICAgIGxldCBvcHRzLCBmbjtcbiAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIFtmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgW29wdHMsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVJlZHVjZXJFeHBvcnQodGhpcy4jY3R4LCBvcHRzLCB7fSwgZm4sIExpZmVjeWNsZS5PbkRpc2Nvbm5lY3QpO1xuICB9XG4gIHZpZXcob3B0cywgcmV0LCBmbikge1xuICAgIHJldHVybiBtYWtlVmlld0V4cG9ydCh0aGlzLiNjdHgsIG9wdHMsIHt9LCByZXQsIGZuKTtcbiAgfVxuICAvLyBUT0RPOiByZS1lbmFibGUgb25jZSBwYXJhbWV0ZXJpemVkIHZpZXdzIGFyZSBzdXBwb3J0ZWQgaW4gU1FMXG4gIC8vIHZpZXc8UmV0IGV4dGVuZHMgVmlld1JldHVyblR5cGVCdWlsZGVyPihcbiAgLy8gICBvcHRzOiBWaWV3T3B0cyxcbiAgLy8gICByZXQ6IFJldCxcbiAgLy8gICBmbjogVmlld0ZuPFMsIHt9LCBSZXQ+XG4gIC8vICk6IHZvaWQ7XG4gIC8vIHZpZXc8UGFyYW1zIGV4dGVuZHMgUGFyYW1zT2JqLCBSZXQgZXh0ZW5kcyBWaWV3UmV0dXJuVHlwZUJ1aWxkZXI+KFxuICAvLyAgIG9wdHM6IFZpZXdPcHRzLFxuICAvLyAgIHBhcmFtczogUGFyYW1zLFxuICAvLyAgIHJldDogUmV0LFxuICAvLyAgIGZuOiBWaWV3Rm48Uywge30sIFJldD5cbiAgLy8gKTogdm9pZDtcbiAgLy8gdmlldzxQYXJhbXMgZXh0ZW5kcyBQYXJhbXNPYmosIFJldCBleHRlbmRzIFZpZXdSZXR1cm5UeXBlQnVpbGRlcj4oXG4gIC8vICAgb3B0czogVmlld09wdHMsXG4gIC8vICAgcGFyYW1zT3JSZXQ6IFJldCB8IFBhcmFtcyxcbiAgLy8gICByZXRPckZuOiBWaWV3Rm48Uywge30sIFJldD4gfCBSZXQsXG4gIC8vICAgbWF5YmVGbj86IFZpZXdGbjxTLCBQYXJhbXMsIFJldD5cbiAgLy8gKTogdm9pZCB7XG4gIC8vICAgaWYgKHR5cGVvZiByZXRPckZuID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vICAgICBkZWZpbmVWaWV3KG5hbWUsIGZhbHNlLCB7fSwgcGFyYW1zT3JSZXQgYXMgUmV0LCByZXRPckZuKTtcbiAgLy8gICB9IGVsc2Uge1xuICAvLyAgICAgZGVmaW5lVmlldyhuYW1lLCBmYWxzZSwgcGFyYW1zT3JSZXQgYXMgUGFyYW1zLCByZXRPckZuLCBtYXliZUZuISk7XG4gIC8vICAgfVxuICAvLyB9XG4gIGFub255bW91c1ZpZXcob3B0cywgcmV0LCBmbikge1xuICAgIHJldHVybiBtYWtlQW5vblZpZXdFeHBvcnQodGhpcy4jY3R4LCBvcHRzLCB7fSwgcmV0LCBmbik7XG4gIH1cbiAgcHJvY2VkdXJlKC4uLmFyZ3MpIHtcbiAgICBsZXQgb3B0cywgcGFyYW1zID0ge30sIHJldCwgZm47XG4gICAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgICAgY2FzZSAyOlxuICAgICAgICBbcmV0LCBmbl0gPSBhcmdzO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzoge1xuICAgICAgICBsZXQgYXJnMTtcbiAgICAgICAgW2FyZzEsIHJldCwgZm5dID0gYXJncztcbiAgICAgICAgaWYgKHR5cGVvZiBhcmcxLm5hbWUgPT09IFwic3RyaW5nXCIpIG9wdHMgPSBhcmcxO1xuICAgICAgICBlbHNlIHBhcmFtcyA9IGFyZzE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSA0OlxuICAgICAgICBbb3B0cywgcGFyYW1zLCByZXQsIGZuXSA9IGFyZ3M7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVByb2NlZHVyZUV4cG9ydCh0aGlzLiNjdHgsIG9wdHMsIHBhcmFtcywgcmV0LCBmbik7XG4gIH1cbiAgLyoqXG4gICAqIEJ1bmRsZSBtdWx0aXBsZSByZWR1Y2VycywgcHJvY2VkdXJlcywgZXRjIGludG8gb25lIHZhbHVlIHRvIGV4cG9ydC5cbiAgICogVGhlIG5hbWUgdGhleSB3aWxsIGJlIGV4cG9ydGVkIHdpdGggaXMgdGhlaXIgY29ycmVzcG9uZGluZyBrZXkgaW4gdGhlIGBleHBvcnRzYCBhcmd1bWVudC5cbiAgICovXG4gIGV4cG9ydEdyb3VwKGV4cG9ydHMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgW2V4cG9ydENvbnRleHRdOiB0aGlzLiNjdHgsXG4gICAgICBbcmVnaXN0ZXJFeHBvcnRdKGN0eCwgX2V4cG9ydE5hbWUpIHtcbiAgICAgICAgZm9yIChjb25zdCBbZXhwb3J0TmFtZSwgbW9kdWxlRXhwb3J0XSBvZiBPYmplY3QuZW50cmllcyhleHBvcnRzKSkge1xuICAgICAgICAgIGNoZWNrRXhwb3J0Q29udGV4dChtb2R1bGVFeHBvcnQsIGN0eCk7XG4gICAgICAgICAgbW9kdWxlRXhwb3J0W3JlZ2lzdGVyRXhwb3J0XShjdHgsIGV4cG9ydE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBjbGllbnRWaXNpYmlsaXR5RmlsdGVyID0ge1xuICAgIHNxbDogKGZpbHRlcikgPT4gKHtcbiAgICAgIFtleHBvcnRDb250ZXh0XTogdGhpcy4jY3R4LFxuICAgICAgW3JlZ2lzdGVyRXhwb3J0XShjdHgsIF9leHBvcnROYW1lKSB7XG4gICAgICAgIGN0eC5tb2R1bGVEZWYucm93TGV2ZWxTZWN1cml0eS5wdXNoKHsgc3FsOiBmaWx0ZXIgfSk7XG4gICAgICB9XG4gICAgfSlcbiAgfTtcbn07XG52YXIgcmVnaXN0ZXJFeHBvcnQgPSBTeW1ib2woXCJTcGFjZXRpbWVEQi5yZWdpc3RlckV4cG9ydFwiKTtcbnZhciBleHBvcnRDb250ZXh0ID0gU3ltYm9sKFwiU3BhY2V0aW1lREIuZXhwb3J0Q29udGV4dFwiKTtcbmZ1bmN0aW9uIGlzTW9kdWxlRXhwb3J0KHgpIHtcbiAgcmV0dXJuICh0eXBlb2YgeCA9PT0gXCJmdW5jdGlvblwiIHx8IHR5cGVvZiB4ID09PSBcIm9iamVjdFwiKSAmJiB4ICE9PSBudWxsICYmIHJlZ2lzdGVyRXhwb3J0IGluIHg7XG59XG5mdW5jdGlvbiBjaGVja0V4cG9ydENvbnRleHQoZXhwLCBzY2hlbWEyKSB7XG4gIGlmIChleHBbZXhwb3J0Q29udGV4dF0gIT0gbnVsbCAmJiBleHBbZXhwb3J0Q29udGV4dF0gIT09IHNjaGVtYTIpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwibXVsdGlwbGUgc2NoZW1hcyBhcmUgbm90IHN1cHBvcnRlZFwiKTtcbiAgfVxufVxuZnVuY3Rpb24gc2NoZW1hKHRhYmxlcywgbW9kdWxlU2V0dGluZ3MpIHtcbiAgY29uc3QgY3R4ID0gbmV3IFNjaGVtYUlubmVyKChjdHgyKSA9PiB7XG4gICAgaWYgKG1vZHVsZVNldHRpbmdzPy5DQVNFX0NPTlZFUlNJT05fUE9MSUNZICE9IG51bGwpIHtcbiAgICAgIGN0eDIuc2V0Q2FzZUNvbnZlcnNpb25Qb2xpY3kobW9kdWxlU2V0dGluZ3MuQ0FTRV9DT05WRVJTSU9OX1BPTElDWSk7XG4gICAgfVxuICAgIGNvbnN0IHRhYmxlU2NoZW1hcyA9IHt9O1xuICAgIGZvciAoY29uc3QgW2FjY05hbWUsIHRhYmxlMl0gb2YgT2JqZWN0LmVudHJpZXModGFibGVzKSkge1xuICAgICAgY29uc3QgdGFibGVEZWYgPSB0YWJsZTIudGFibGVEZWYoY3R4MiwgYWNjTmFtZSk7XG4gICAgICB0YWJsZVNjaGVtYXNbYWNjTmFtZV0gPSB0YWJsZVRvU2NoZW1hKGFjY05hbWUsIHRhYmxlMiwgdGFibGVEZWYpO1xuICAgICAgY3R4Mi5tb2R1bGVEZWYudGFibGVzLnB1c2godGFibGVEZWYpO1xuICAgICAgaWYgKHRhYmxlMi5zY2hlZHVsZSkge1xuICAgICAgICBjdHgyLnBlbmRpbmdTY2hlZHVsZXMucHVzaCh7XG4gICAgICAgICAgLi4udGFibGUyLnNjaGVkdWxlLFxuICAgICAgICAgIHRhYmxlTmFtZTogdGFibGVEZWYuc291cmNlTmFtZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0YWJsZTIudGFibGVOYW1lKSB7XG4gICAgICAgIGN0eDIubW9kdWxlRGVmLmV4cGxpY2l0TmFtZXMuZW50cmllcy5wdXNoKHtcbiAgICAgICAgICB0YWc6IFwiVGFibGVcIixcbiAgICAgICAgICB2YWx1ZToge1xuICAgICAgICAgICAgc291cmNlTmFtZTogYWNjTmFtZSxcbiAgICAgICAgICAgIGNhbm9uaWNhbE5hbWU6IHRhYmxlMi50YWJsZU5hbWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyB0YWJsZXM6IHRhYmxlU2NoZW1hcyB9O1xuICB9KTtcbiAgcmV0dXJuIG5ldyBTY2hlbWEoY3R4KTtcbn1cblxuLy8gc3JjL3NlcnZlci9jb25zb2xlLnRzXG52YXIgaW1wb3J0X29iamVjdF9pbnNwZWN0ID0gX190b0VTTShyZXF1aXJlX29iamVjdF9pbnNwZWN0KCkpO1xudmFyIGZtdExvZyA9ICguLi5kYXRhKSA9PiBkYXRhLm1hcCgoeCkgPT4gdHlwZW9mIHggPT09IFwic3RyaW5nXCIgPyB4IDogKDAsIGltcG9ydF9vYmplY3RfaW5zcGVjdC5kZWZhdWx0KSh4KSkuam9pbihcIiBcIik7XG52YXIgY29uc29sZV9sZXZlbF9lcnJvciA9IDA7XG52YXIgY29uc29sZV9sZXZlbF93YXJuID0gMTtcbnZhciBjb25zb2xlX2xldmVsX2luZm8gPSAyO1xudmFyIGNvbnNvbGVfbGV2ZWxfZGVidWcgPSAzO1xudmFyIGNvbnNvbGVfbGV2ZWxfdHJhY2UgPSA0O1xudmFyIHRpbWVyTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbnZhciBjb25zb2xlMiA9IHtcbiAgLy8gQHRzLWV4cGVjdC1lcnJvciB3ZSB3YW50IGEgYmxhbmsgcHJvdG90eXBlLCBidXQgdHlwZXNjcmlwdCBjb21wbGFpbnNcbiAgX19wcm90b19fOiB7fSxcbiAgW1N5bWJvbC50b1N0cmluZ1RhZ106IFwiY29uc29sZVwiLFxuICBhc3NlcnQ6IChjb25kaXRpb24gPSBmYWxzZSwgLi4uZGF0YSkgPT4ge1xuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF9lcnJvciwgZm10TG9nKC4uLmRhdGEpKTtcbiAgICB9XG4gIH0sXG4gIGNsZWFyOiAoKSA9PiB7XG4gIH0sXG4gIGRlYnVnOiAoLi4uZGF0YSkgPT4ge1xuICAgIHN5cy5jb25zb2xlX2xvZyhjb25zb2xlX2xldmVsX2RlYnVnLCBmbXRMb2coLi4uZGF0YSkpO1xuICB9LFxuICBlcnJvcjogKC4uLmRhdGEpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF9lcnJvciwgZm10TG9nKC4uLmRhdGEpKTtcbiAgfSxcbiAgaW5mbzogKC4uLmRhdGEpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF9pbmZvLCBmbXRMb2coLi4uZGF0YSkpO1xuICB9LFxuICBsb2c6ICguLi5kYXRhKSA9PiB7XG4gICAgc3lzLmNvbnNvbGVfbG9nKGNvbnNvbGVfbGV2ZWxfaW5mbywgZm10TG9nKC4uLmRhdGEpKTtcbiAgfSxcbiAgdGFibGU6ICh0YWJ1bGFyRGF0YSwgX3Byb3BlcnRpZXMpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF9pbmZvLCBmbXRMb2codGFidWxhckRhdGEpKTtcbiAgfSxcbiAgdHJhY2U6ICguLi5kYXRhKSA9PiB7XG4gICAgc3lzLmNvbnNvbGVfbG9nKGNvbnNvbGVfbGV2ZWxfdHJhY2UsIGZtdExvZyguLi5kYXRhKSk7XG4gIH0sXG4gIHdhcm46ICguLi5kYXRhKSA9PiB7XG4gICAgc3lzLmNvbnNvbGVfbG9nKGNvbnNvbGVfbGV2ZWxfd2FybiwgZm10TG9nKC4uLmRhdGEpKTtcbiAgfSxcbiAgZGlyOiAoX2l0ZW0sIF9vcHRpb25zKSA9PiB7XG4gIH0sXG4gIGRpcnhtbDogKC4uLl9kYXRhKSA9PiB7XG4gIH0sXG4gIC8vIENvdW50aW5nXG4gIGNvdW50OiAoX2xhYmVsID0gXCJkZWZhdWx0XCIpID0+IHtcbiAgfSxcbiAgY291bnRSZXNldDogKF9sYWJlbCA9IFwiZGVmYXVsdFwiKSA9PiB7XG4gIH0sXG4gIC8vIEdyb3VwaW5nXG4gIGdyb3VwOiAoLi4uX2RhdGEpID0+IHtcbiAgfSxcbiAgZ3JvdXBDb2xsYXBzZWQ6ICguLi5fZGF0YSkgPT4ge1xuICB9LFxuICBncm91cEVuZDogKCkgPT4ge1xuICB9LFxuICAvLyBUaW1pbmdcbiAgdGltZTogKGxhYmVsID0gXCJkZWZhdWx0XCIpID0+IHtcbiAgICBpZiAodGltZXJNYXAuaGFzKGxhYmVsKSkge1xuICAgICAgc3lzLmNvbnNvbGVfbG9nKGNvbnNvbGVfbGV2ZWxfd2FybiwgYFRpbWVyICcke2xhYmVsfScgYWxyZWFkeSBleGlzdHMuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRpbWVyTWFwLnNldChsYWJlbCwgc3lzLmNvbnNvbGVfdGltZXJfc3RhcnQobGFiZWwpKTtcbiAgfSxcbiAgdGltZUxvZzogKGxhYmVsID0gXCJkZWZhdWx0XCIsIC4uLmRhdGEpID0+IHtcbiAgICBzeXMuY29uc29sZV9sb2coY29uc29sZV9sZXZlbF9pbmZvLCBmbXRMb2cobGFiZWwsIC4uLmRhdGEpKTtcbiAgfSxcbiAgdGltZUVuZDogKGxhYmVsID0gXCJkZWZhdWx0XCIpID0+IHtcbiAgICBjb25zdCBzcGFuSWQgPSB0aW1lck1hcC5nZXQobGFiZWwpO1xuICAgIGlmIChzcGFuSWQgPT09IHZvaWQgMCkge1xuICAgICAgc3lzLmNvbnNvbGVfbG9nKGNvbnNvbGVfbGV2ZWxfd2FybiwgYFRpbWVyICcke2xhYmVsfScgZG9lcyBub3QgZXhpc3QuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHN5cy5jb25zb2xlX3RpbWVyX2VuZChzcGFuSWQpO1xuICAgIHRpbWVyTWFwLmRlbGV0ZShsYWJlbCk7XG4gIH0sXG4gIC8vIEFkZGl0aW9uYWwgY29uc29sZSBtZXRob2RzIHRvIHNhdGlzZnkgdGhlIENvbnNvbGUgaW50ZXJmYWNlXG4gIHRpbWVTdGFtcDogKCkgPT4ge1xuICB9LFxuICBwcm9maWxlOiAoKSA9PiB7XG4gIH0sXG4gIHByb2ZpbGVFbmQ6ICgpID0+IHtcbiAgfVxufTtcblxuLy8gc3JjL3NlcnZlci9wb2x5ZmlsbHMudHNcbmdsb2JhbFRoaXMuY29uc29sZSA9IGNvbnNvbGUyO1xuLyohIEJ1bmRsZWQgbGljZW5zZSBpbmZvcm1hdGlvbjpcblxuc3RhdHVzZXMvaW5kZXguanM6XG4gICgqIVxuICAgKiBzdGF0dXNlc1xuICAgKiBDb3B5cmlnaHQoYykgMjAxNCBKb25hdGhhbiBPbmdcbiAgICogQ29weXJpZ2h0KGMpIDIwMTYgRG91Z2xhcyBDaHJpc3RvcGhlciBXaWxzb25cbiAgICogTUlUIExpY2Vuc2VkXG4gICAqKVxuKi9cblxuZXhwb3J0IHsgQXJyYXlCdWlsZGVyLCBBcnJheUNvbHVtbkJ1aWxkZXIsIEJvb2xCdWlsZGVyLCBCb29sQ29sdW1uQnVpbGRlciwgQm9vbGVhbkV4cHIsIEJ5dGVBcnJheUJ1aWxkZXIsIEJ5dGVBcnJheUNvbHVtbkJ1aWxkZXIsIENhc2VDb252ZXJzaW9uUG9saWN5LCBDb2x1bW5CdWlsZGVyLCBDb2x1bW5FeHByZXNzaW9uLCBDb25uZWN0aW9uSWRCdWlsZGVyLCBDb25uZWN0aW9uSWRDb2x1bW5CdWlsZGVyLCBGMzJCdWlsZGVyLCBGMzJDb2x1bW5CdWlsZGVyLCBGNjRCdWlsZGVyLCBGNjRDb2x1bW5CdWlsZGVyLCBJMTI4QnVpbGRlciwgSTEyOENvbHVtbkJ1aWxkZXIsIEkxNkJ1aWxkZXIsIEkxNkNvbHVtbkJ1aWxkZXIsIEkyNTZCdWlsZGVyLCBJMjU2Q29sdW1uQnVpbGRlciwgSTMyQnVpbGRlciwgSTMyQ29sdW1uQnVpbGRlciwgSTY0QnVpbGRlciwgSTY0Q29sdW1uQnVpbGRlciwgSThCdWlsZGVyLCBJOENvbHVtbkJ1aWxkZXIsIElkZW50aXR5QnVpbGRlciwgSWRlbnRpdHlDb2x1bW5CdWlsZGVyLCBPcHRpb25CdWlsZGVyLCBPcHRpb25Db2x1bW5CdWlsZGVyLCBQcm9kdWN0QnVpbGRlciwgUHJvZHVjdENvbHVtbkJ1aWxkZXIsIFJlZkJ1aWxkZXIsIFJlc3VsdEJ1aWxkZXIsIFJlc3VsdENvbHVtbkJ1aWxkZXIsIFJvd0J1aWxkZXIsIFNjaGVkdWxlQXRCdWlsZGVyLCBTY2hlZHVsZUF0Q29sdW1uQnVpbGRlciwgU2VuZGVyRXJyb3IsIFNpbXBsZVN1bUJ1aWxkZXIsIFNpbXBsZVN1bUNvbHVtbkJ1aWxkZXIsIFNwYWNldGltZUhvc3RFcnJvciwgU3RyaW5nQnVpbGRlciwgU3RyaW5nQ29sdW1uQnVpbGRlciwgU3VtQnVpbGRlciwgU3VtQ29sdW1uQnVpbGRlciwgVGltZUR1cmF0aW9uQnVpbGRlciwgVGltZUR1cmF0aW9uQ29sdW1uQnVpbGRlciwgVGltZXN0YW1wQnVpbGRlciwgVGltZXN0YW1wQ29sdW1uQnVpbGRlciwgVHlwZUJ1aWxkZXIsIFUxMjhCdWlsZGVyLCBVMTI4Q29sdW1uQnVpbGRlciwgVTE2QnVpbGRlciwgVTE2Q29sdW1uQnVpbGRlciwgVTI1NkJ1aWxkZXIsIFUyNTZDb2x1bW5CdWlsZGVyLCBVMzJCdWlsZGVyLCBVMzJDb2x1bW5CdWlsZGVyLCBVNjRCdWlsZGVyLCBVNjRDb2x1bW5CdWlsZGVyLCBVOEJ1aWxkZXIsIFU4Q29sdW1uQnVpbGRlciwgVXVpZEJ1aWxkZXIsIFV1aWRDb2x1bW5CdWlsZGVyLCBhbmQsIGNyZWF0ZVRhYmxlUmVmRnJvbURlZiwgZXJyb3JzLCBldmFsdWF0ZUJvb2xlYW5FeHByLCBnZXRRdWVyeUFjY2Vzc29yTmFtZSwgZ2V0UXVlcnlUYWJsZU5hbWUsIGdldFF1ZXJ5V2hlcmVDbGF1c2UsIGlzUm93VHlwZWRRdWVyeSwgaXNUeXBlZFF1ZXJ5LCBsaXRlcmFsLCBtYWtlUXVlcnlCdWlsZGVyLCBub3QsIG9yLCBzY2hlbWEsIHQsIHRhYmxlLCB0b0NhbWVsQ2FzZSwgdG9Db21wYXJhYmxlVmFsdWUsIHRvU3FsIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwIiwiLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBTUEFDRVRJTUVEQiBNT0RVTEUgLSBEaXNjb3JkIENsb25lIEJhY2tlbmRcbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuaW1wb3J0IHsgc2NoZW1hLCB0LCB0YWJsZSwgU2VuZGVyRXJyb3IgfSBmcm9tICdzcGFjZXRpbWVkYi9zZXJ2ZXInO1xuXG5jb25zdCB1c2VyID0gdGFibGUoXG4gIHsgXG4gICAgbmFtZTogJ3VzZXInLCBcbiAgICBwdWJsaWM6IHRydWUsXG4gICAgaW5kZXhlczogW11cbiAgfSxcbiAge1xuICAgIGlkZW50aXR5OiB0LmlkZW50aXR5KCkucHJpbWFyeUtleSgpLFxuICAgIG5hbWU6IHQuc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBvbmxpbmU6IHQuYm9vbCgpLFxuICAgIGF2YXRhcjogdC5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgIGF1dGhNZXRob2Q6IHQuc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gJ2VtYWlsJywgJ2dvb2dsZScsIG9yIHVuZGVmaW5lZCBmb3IgYW5vbnltb3VzXG4gICAgbGFzdElwQWRkcmVzczogdC5zdHJpbmcoKS5vcHRpb25hbCgpLCAvLyBMYXN0IGtub3duIElQIGFkZHJlc3MgKG9ubHkgdmlzaWJsZSB0byBhZG1pbnMpXG4gIH1cbik7XG5cbmNvbnN0IGNoYW5uZWwgPSB0YWJsZShcbiAge1xuICAgIG5hbWU6ICdjaGFubmVsJyxcbiAgICBwdWJsaWM6IHRydWUsXG4gICAgaW5kZXhlczogW10sXG4gIH0sXG4gIHtcbiAgICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICAgIG5hbWU6IHQuc3RyaW5nKCksXG4gICAgZGVzY3JpcHRpb246IHQuc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICB0eXBlOiB0LnN0cmluZygpLCAvLyAndGV4dCcgfCAndm9pY2UnXG4gICAgY3JlYXRlZEF0OiB0LnRpbWVzdGFtcCgpLFxuICAgIGNyZWF0ZWRCeTogdC5pZGVudGl0eSgpLm9wdGlvbmFsKCksXG4gIH1cbik7XG5cbmNvbnN0IHRocmVhZCA9IHRhYmxlKFxuICB7XG4gICAgbmFtZTogJ3RocmVhZCcsXG4gICAgcHVibGljOiB0cnVlLFxuICAgIGluZGV4ZXM6IFtcbiAgICAgIHsgYWNjZXNzb3I6ICd0aHJlYWRfYnlfY2hhbm5lbCcsIG5hbWU6ICd0aHJlYWRfYnlfY2hhbm5lbCcsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydjaGFubmVsSWQnXSB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICAgIGNoYW5uZWxJZDogdC51NjQoKSxcbiAgICBuYW1lOiB0LnN0cmluZygpLFxuICAgIGNyZWF0ZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgICBjcmVhdGVkQnk6IHQuaWRlbnRpdHkoKS5vcHRpb25hbCgpLFxuICB9XG4pO1xuXG5jb25zdCBtZXNzYWdlID0gdGFibGUoXG4gIHtcbiAgICBuYW1lOiAnbWVzc2FnZScsXG4gICAgcHVibGljOiB0cnVlLFxuICAgIGluZGV4ZXM6IFtcbiAgICAgIHsgYWNjZXNzb3I6ICdtZXNzYWdlX2J5X3NlbmRlcicsIG5hbWU6ICdtZXNzYWdlX2J5X3NlbmRlcicsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydzZW5kZXInXSB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICAgIHNlbmRlcjogdC5pZGVudGl0eSgpLFxuICAgIGNoYW5uZWxJZDogdC51NjQoKS5vcHRpb25hbCgpLFxuICAgIHRocmVhZElkOiB0LnU2NCgpLm9wdGlvbmFsKCksXG4gICAgdGV4dDogdC5zdHJpbmcoKSxcbiAgICBzZW50OiB0LnRpbWVzdGFtcCgpLFxuICAgIGVkaXRlZEF0OiB0LnRpbWVzdGFtcCgpLm9wdGlvbmFsKCksXG4gIH1cbik7XG5cbmNvbnN0IGNoYW5uZWxNZW1iZXIgPSB0YWJsZShcbiAge1xuICAgIG5hbWU6ICdjaGFubmVsTWVtYmVyJyxcbiAgICBwdWJsaWM6IHRydWUsXG4gICAgaW5kZXhlczogW1xuICAgICAgeyBhY2Nlc3NvcjogJ2NoYW5uZWxfbWVtYmVyX2J5X2NoYW5uZWwnLCBuYW1lOiAnY2hhbm5lbF9tZW1iZXJfYnlfY2hhbm5lbCcsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydjaGFubmVsSWQnXSB9LFxuICAgICAgLy8gTk9URTogSW5kZXggb24gdXNlcklkIChpZGVudGl0eSkgY2F1c2VzIEhUVFAgNTAwIGVycm9yIC0gcmVtb3ZlZCBmb3Igbm93XG4gICAgICAvLyBXZSBjYW4gc3RpbGwgcXVlcnkgYnkgaXRlcmF0aW5nIGFuZCBmaWx0ZXJpbmcsIHRob3VnaCBpdCdzIGxlc3MgZWZmaWNpZW50XG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gICAgY2hhbm5lbElkOiB0LnU2NCgpLFxuICAgIHVzZXJJZDogdC5pZGVudGl0eSgpLFxuICAgIGpvaW5lZEF0OiB0LnRpbWVzdGFtcCgpLFxuICB9XG4pO1xuXG4vLyBBdXRoZW50aWNhdGlvbiB0YWJsZXNcbmNvbnN0IGVtYWlsQ3JlZGVudGlhbCA9IHRhYmxlKFxuICB7XG4gICAgbmFtZTogJ2VtYWlsQ3JlZGVudGlhbCcsXG4gICAgcHVibGljOiBmYWxzZSwgLy8gUHJpdmF0ZSB0YWJsZSAtIG9ubHkgYWNjZXNzaWJsZSB2aWEgcmVkdWNlcnNcbiAgICBpbmRleGVzOiBbXSwgLy8gTm8gbWFudWFsIGluZGV4ZXMgbmVlZGVkIC0gcHJpbWFyeSBrZXkgJ2VtYWlsJyBpcyBhdXRvbWF0aWNhbGx5IGluZGV4ZWRcbiAgfSxcbiAge1xuICAgIGVtYWlsOiB0LnN0cmluZygpLnByaW1hcnlLZXkoKSxcbiAgICBwYXNzd29yZEhhc2g6IHQuc3RyaW5nKCksIC8vIFNpbXBsZSBoYXNoIGZvciBub3cgLSBpbiBwcm9kdWN0aW9uIHVzZSBwcm9wZXIgYmNyeXB0XG4gICAgaWRlbnRpdHk6IHQuaWRlbnRpdHkoKSxcbiAgICBjcmVhdGVkQXQ6IHQudGltZXN0YW1wKCksXG4gIH1cbik7XG5cbmNvbnN0IGdvb2dsZUF1dGggPSB0YWJsZShcbiAge1xuICAgIG5hbWU6ICdnb29nbGVBdXRoJyxcbiAgICBwdWJsaWM6IGZhbHNlLCAvLyBQcml2YXRlIHRhYmxlIC0gb25seSBhY2Nlc3NpYmxlIHZpYSByZWR1Y2Vyc1xuICAgIGluZGV4ZXM6IFtdLCAvLyBObyBtYW51YWwgaW5kZXhlcyBuZWVkZWQgLSBwcmltYXJ5IGtleSAnZ29vZ2xlSWQnIGlzIGF1dG9tYXRpY2FsbHkgaW5kZXhlZFxuICB9LFxuICB7XG4gICAgZ29vZ2xlSWQ6IHQuc3RyaW5nKCkucHJpbWFyeUtleSgpLFxuICAgIGlkZW50aXR5OiB0LmlkZW50aXR5KCksXG4gICAgZW1haWw6IHQuc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBuYW1lOiB0LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgYXZhdGFyOiB0LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgY3JlYXRlZEF0OiB0LnRpbWVzdGFtcCgpLFxuICB9XG4pO1xuXG4vLyBWb2ljZSByb29tIHRhYmxlc1xuY29uc3Qgdm9pY2VSb29tID0gdGFibGUoXG4gIHtcbiAgICBuYW1lOiAndm9pY2VSb29tJyxcbiAgICBwdWJsaWM6IHRydWUsXG4gICAgaW5kZXhlczogW1xuICAgICAgeyBhY2Nlc3NvcjogJ3ZvaWNlX3Jvb21fYnlfY2hhbm5lbCcsIG5hbWU6ICd2b2ljZV9yb29tX2J5X2NoYW5uZWwnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsnY2hhbm5lbElkJ10gfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgICBjaGFubmVsSWQ6IHQudTY0KCksXG4gICAgY3JlYXRlZEF0OiB0LnRpbWVzdGFtcCgpLFxuICB9XG4pO1xuXG5jb25zdCB2b2ljZVBhcnRpY2lwYW50ID0gdGFibGUoXG4gIHtcbiAgICBuYW1lOiAndm9pY2VQYXJ0aWNpcGFudCcsXG4gICAgcHVibGljOiB0cnVlLFxuICAgIGluZGV4ZXM6IFtcbiAgICAgIHsgYWNjZXNzb3I6ICd2b2ljZV9wYXJ0aWNpcGFudF9ieV9yb29tJywgbmFtZTogJ3ZvaWNlX3BhcnRpY2lwYW50X2J5X3Jvb20nLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncm9vbUlkJ10gfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgICByb29tSWQ6IHQudTY0KCksXG4gICAgdXNlcklkOiB0LmlkZW50aXR5KCksXG4gICAgbXV0ZWQ6IHQuYm9vbCgpLFxuICAgIGRlYWZlbmVkOiB0LmJvb2woKSxcbiAgICBqb2luZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgfVxuKTtcblxuY29uc3Qgdm9pY2VTaWduYWxpbmcgPSB0YWJsZShcbiAge1xuICAgIG5hbWU6ICd2b2ljZVNpZ25hbGluZycsXG4gICAgcHVibGljOiB0cnVlLFxuICAgIGluZGV4ZXM6IFtcbiAgICAgIHsgYWNjZXNzb3I6ICd2b2ljZV9zaWduYWxpbmdfYnlfcm9vbScsIG5hbWU6ICd2b2ljZV9zaWduYWxpbmdfYnlfcm9vbScsIGFsZ29yaXRobTogJ2J0cmVlJywgY29sdW1uczogWydyb29tSWQnXSB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBpZDogdC51NjQoKS5wcmltYXJ5S2V5KCkuYXV0b0luYygpLFxuICAgIHJvb21JZDogdC51NjQoKSxcbiAgICBmcm9tVXNlcklkOiB0LmlkZW50aXR5KCksXG4gICAgdG9Vc2VySWQ6IHQuaWRlbnRpdHkoKSxcbiAgICBzaWduYWxUeXBlOiB0LnN0cmluZygpLCAvLyAnb2ZmZXInLCAnYW5zd2VyJywgJ2ljZS1jYW5kaWRhdGUnXG4gICAgc2lnbmFsRGF0YTogdC5zdHJpbmcoKSwgLy8gSlNPTiBzdHJpbmdpZmllZCBzaWduYWwgZGF0YVxuICAgIGNyZWF0ZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgfVxuKTtcblxuLy8gVm9pY2UgcmVjb3JkaW5nIGNodW5rcyAtIGF1dG8tc2F2ZWQgd2hlbiB2b2ljZSByb29tIGlzIGFjdGl2ZVxuY29uc3Qgdm9pY2VSZWNvcmRpbmdDaHVuayA9IHRhYmxlKFxuICB7XG4gICAgbmFtZTogJ3ZvaWNlUmVjb3JkaW5nQ2h1bmsnLFxuICAgIHB1YmxpYzogdHJ1ZSxcbiAgICBpbmRleGVzOiBbXG4gICAgICB7IGFjY2Vzc29yOiAndm9pY2VfcmVjb3JkaW5nX2J5X3Jvb20nLCBuYW1lOiAndm9pY2VfcmVjb3JkaW5nX2J5X3Jvb20nLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncm9vbUlkJ10gfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgICByb29tSWQ6IHQudTY0KCksXG4gICAgY2hhbm5lbElkOiB0LnU2NCgpLFxuICAgIGNodW5rSW5kZXg6IHQudTY0KCksXG4gICAgZGF0YUJhc2U2NDogdC5zdHJpbmcoKSwgLy8gQmFzZTY0LWVuY29kZWQgYXVkaW8gY2h1bmsgKH4zMktCIG1heCBwZXIgY2h1bmspXG4gICAgcmVjb3JkZWRCeTogdC5pZGVudGl0eSgpLFxuICAgIGNyZWF0ZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgfVxuKTtcblxuLy8gUm9sZSBhbmQgcGVybWlzc2lvbiB0YWJsZXNcbmNvbnN0IHJvbGUgPSB0YWJsZShcbiAge1xuICAgIG5hbWU6ICdyb2xlJyxcbiAgICBwdWJsaWM6IHRydWUsXG4gICAgaW5kZXhlczogW10sIC8vIE5vdGU6IENhbid0IGluZGV4IG9wdGlvbmFsIGZpZWxkcyBlZmZpY2llbnRseSwgd2lsbCBmaWx0ZXIgbWFudWFsbHlcbiAgfSxcbiAge1xuICAgIGlkOiB0LnU2NCgpLnByaW1hcnlLZXkoKS5hdXRvSW5jKCksXG4gICAgY2hhbm5lbElkOiB0LnU2NCgpLm9wdGlvbmFsKCksIC8vIG51bGwgZm9yIGdsb2JhbCByb2xlc1xuICAgIG5hbWU6IHQuc3RyaW5nKCksXG4gICAgY29sb3I6IHQuc3RyaW5nKCkub3B0aW9uYWwoKSwgLy8gSGV4IGNvbG9yIGNvZGVcbiAgICBwZXJtaXNzaW9uczogdC51NjQoKSwgLy8gQml0bWFzayBmb3IgcGVybWlzc2lvbnNcbiAgICBwb3NpdGlvbjogdC51NjQoKSwgLy8gSGlnaGVyID0gbW9yZSBwcmlvcml0eVxuICAgIGNyZWF0ZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgICBjcmVhdGVkQnk6IHQuaWRlbnRpdHkoKS5vcHRpb25hbCgpLFxuICB9XG4pO1xuXG5jb25zdCByb2xlTWVtYmVyID0gdGFibGUoXG4gIHtcbiAgICBuYW1lOiAncm9sZU1lbWJlcicsXG4gICAgcHVibGljOiB0cnVlLFxuICAgIGluZGV4ZXM6IFtcbiAgICAgIHsgYWNjZXNzb3I6ICdyb2xlX21lbWJlcl9ieV9yb2xlJywgbmFtZTogJ3JvbGVfbWVtYmVyX2J5X3JvbGUnLCBhbGdvcml0aG06ICdidHJlZScsIGNvbHVtbnM6IFsncm9sZUlkJ10gfSxcbiAgICAgIC8vIE5vdGU6IENhbid0IGluZGV4IGlkZW50aXR5IGZpZWxkcyBkaXJlY3RseSwgd2lsbCBmaWx0ZXIgbWFudWFsbHlcbiAgICBdLFxuICB9LFxuICB7XG4gICAgaWQ6IHQudTY0KCkucHJpbWFyeUtleSgpLmF1dG9JbmMoKSxcbiAgICByb2xlSWQ6IHQudTY0KCksXG4gICAgdXNlcklkOiB0LmlkZW50aXR5KCksXG4gICAgYXNzaWduZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgICBhc3NpZ25lZEJ5OiB0LmlkZW50aXR5KCkub3B0aW9uYWwoKSxcbiAgfVxuKTtcblxuLy8gVHJhY2tzIGlkZW50aXRpZXMgcmVwbGFjZWQgZHVyaW5nIGxvZ2luIG1pZ3JhdGlvbiAob2xkIHNlc3Npb24gLT4gbmV3IHNlc3Npb24pXG4vLyBDbGllbnQgZmlsdGVycyB0aGVzZSBvdXQgdG8gYXZvaWQgZHVwbGljYXRlIHVzZXIgZW50cmllcyBpbiB0aGUgbGlzdFxuY29uc3QgcmVwbGFjZWRJZGVudGl0eSA9IHRhYmxlKFxuICB7XG4gICAgbmFtZTogJ3JlcGxhY2VkSWRlbnRpdHknLFxuICAgIHB1YmxpYzogdHJ1ZSxcbiAgICBpbmRleGVzOiBbXSxcbiAgfSxcbiAge1xuICAgIG9sZElkZW50aXR5OiB0LmlkZW50aXR5KCkucHJpbWFyeUtleSgpLFxuICAgIG5ld0lkZW50aXR5OiB0LmlkZW50aXR5KCksXG4gICAgcmVwbGFjZWRBdDogdC50aW1lc3RhbXAoKSxcbiAgfVxuKTtcblxuLy8gTGlua3MgYSBzZXNzaW9uIGlkZW50aXR5IHRvIGFuIGFjY291bnQgaWRlbnRpdHkgZm9yIGVtYWlsL0dvb2dsZSBsb2dpbi5cbi8vIFdoZW4gY3R4LnNlbmRlciAhPT0gYWNjb3VudCBpZGVudGl0eSwgd2UgY3JlYXRlIHRoaXMgbGluayBzbyB0aGUgYWNjb3VudCBpZGVudGl0eVxuLy8gaXMgcHJlc2VydmVkLiBPbmx5IHRoZSBhY2NvdW50IGhhcyBhIHVzZXIgcm93IC0gbm8gZHVwbGljYXRlIHVzZXIgcm93cyBmb3Igc2Vzc2lvbnMuXG5jb25zdCBpZGVudGl0eUxpbmsgPSB0YWJsZShcbiAge1xuICAgIG5hbWU6ICdpZGVudGl0eUxpbmsnLFxuICAgIHB1YmxpYzogZmFsc2UsXG4gICAgaW5kZXhlczogW3sgYWNjZXNzb3I6ICdhY2NvdW50SWRlbnRpdHknLCBuYW1lOiAnaWRlbnRpdHlfbGlua19ieV9hY2NvdW50JywgYWxnb3JpdGhtOiAnYnRyZWUnIGFzIGNvbnN0LCBjb2x1bW5zOiBbJ2FjY291bnRJZGVudGl0eSddIH1dLFxuICB9LFxuICB7XG4gICAgc2Vzc2lvbklkZW50aXR5OiB0LmlkZW50aXR5KCkucHJpbWFyeUtleSgpLFxuICAgIGFjY291bnRJZGVudGl0eTogdC5pZGVudGl0eSgpLFxuICAgIGxpbmtlZEF0OiB0LnRpbWVzdGFtcCgpLFxuICB9XG4pO1xuXG4vLyBUcmFja3Mgd2hpY2ggc2Vzc2lvbiBpZGVudGl0aWVzIGFyZSBjdXJyZW50bHkgY29ubmVjdGVkLlxuLy8gVXNlZCB0byBrbm93IHdoZW4gdG8gc2V0IGFjY291bnQgdXNlciBvZmZsaW5lICh3aGVuIGxhc3QgbGlua2VkIHNlc3Npb24gZGlzY29ubmVjdHMpLlxuY29uc3QgYWN0aXZlU2Vzc2lvbiA9IHRhYmxlKFxuICB7XG4gICAgbmFtZTogJ2FjdGl2ZVNlc3Npb24nLFxuICAgIHB1YmxpYzogZmFsc2UsXG4gICAgaW5kZXhlczogW10sXG4gIH0sXG4gIHtcbiAgICBzZXNzaW9uSWRlbnRpdHk6IHQuaWRlbnRpdHkoKS5wcmltYXJ5S2V5KCksXG4gICAgY29ubmVjdGVkQXQ6IHQudGltZXN0YW1wKCksXG4gIH1cbik7XG5cbmNvbnN0IHNwYWNldGltZWRiID0gc2NoZW1hKHsgXG4gIHVzZXIsIGNoYW5uZWwsIHRocmVhZCwgbWVzc2FnZSwgY2hhbm5lbE1lbWJlciwgZW1haWxDcmVkZW50aWFsLCBnb29nbGVBdXRoLFxuICB2b2ljZVJvb20sIHZvaWNlUGFydGljaXBhbnQsIHZvaWNlU2lnbmFsaW5nLCB2b2ljZVJlY29yZGluZ0NodW5rLFxuICByb2xlLCByb2xlTWVtYmVyLCByZXBsYWNlZElkZW50aXR5LCBpZGVudGl0eUxpbmssIGFjdGl2ZVNlc3Npb25cbn0pO1xuZXhwb3J0IGRlZmF1bHQgc3BhY2V0aW1lZGI7XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUEVSTUlTU0lPTiBTWVNURU1cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG4vLyBQZXJtaXNzaW9uIGZsYWdzIChiaXRtYXNrKVxuY29uc3QgUGVybWlzc2lvbnMgPSB7XG4gIC8vIENoYW5uZWwgcGVybWlzc2lvbnNcbiAgQ1JFQVRFX0NIQU5ORUw6IDFuIDw8IDBuLFxuICBERUxFVEVfQ0hBTk5FTDogMW4gPDwgMW4sXG4gIE1BTkFHRV9DSEFOTkVMOiAxbiA8PCAybixcbiAgXG4gIC8vIE1lc3NhZ2UgcGVybWlzc2lvbnNcbiAgU0VORF9NRVNTQUdFOiAxbiA8PCAzbixcbiAgRURJVF9NRVNTQUdFOiAxbiA8PCA0bixcbiAgREVMRVRFX01FU1NBR0U6IDFuIDw8IDVuLFxuICBcbiAgLy8gVXNlciBtYW5hZ2VtZW50XG4gIEtJQ0tfVVNFUjogMW4gPDwgNm4sXG4gIEJBTl9VU0VSOiAxbiA8PCA3bixcbiAgQUREX1VTRVI6IDFuIDw8IDhuLFxuICBSRU1PVkVfVVNFUjogMW4gPDwgOW4sXG4gIFxuICAvLyBSb2xlIG1hbmFnZW1lbnRcbiAgTUFOQUdFX1JPTEVTOiAxbiA8PCAxMG4sXG4gIEFTU0lHTl9ST0xFUzogMW4gPDwgMTFuLFxuICBcbiAgLy8gVm9pY2UgcGVybWlzc2lvbnNcbiAgSk9JTl9WT0lDRTogMW4gPDwgMTJuLFxuICBTUEVBS19JTl9WT0lDRTogMW4gPDwgMTNuLFxuICBNVVRFX09USEVSUzogMW4gPDwgMTRuLFxuICBcbiAgLy8gQWRtaW4gKGFsbCBwZXJtaXNzaW9ucylcbiAgQURNSU46IDFuIDw8IDYzbixcbn0gYXMgY29uc3Q7XG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBjaGVjayBpZiB1c2VyIGhhcyBwZXJtaXNzaW9uXG5mdW5jdGlvbiBjaGVja1Blcm1pc3Npb24odXNlclBlcm1pc3Npb25zOiBiaWdpbnQsIHBlcm1pc3Npb246IGJpZ2ludCk6IGJvb2xlYW4ge1xuICAvLyBBZG1pbiBoYXMgYWxsIHBlcm1pc3Npb25zXG4gIGlmICgodXNlclBlcm1pc3Npb25zICYgUGVybWlzc2lvbnMuQURNSU4pICE9PSAwbikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiAodXNlclBlcm1pc3Npb25zICYgcGVybWlzc2lvbikgIT09IDBuO1xufVxuXG4vLyBHZXQgdXNlcidzIGVmZmVjdGl2ZSBwZXJtaXNzaW9ucyBmb3IgYSBjaGFubmVsXG5mdW5jdGlvbiBnZXRVc2VyQ2hhbm5lbFBlcm1pc3Npb25zKFxuICBjdHg6IGFueSxcbiAgdXNlcklkOiBhbnksXG4gIGNoYW5uZWxJZDogYmlnaW50XG4pOiBiaWdpbnQge1xuICBsZXQgcGVybWlzc2lvbnMgPSAwbjtcbiAgXG4gIC8vIEdldCBhbGwgcm9sZXMgZm9yIHRoaXMgdXNlclxuICBjb25zdCB1c2VyUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIoXG4gICAgcm0gPT4gcm0udXNlcklkLmlzRXF1YWwodXNlcklkKVxuICApO1xuICBcbiAgLy8gR2V0IGNoYW5uZWwtc3BlY2lmaWMgcm9sZXMgYW5kIGdsb2JhbCByb2xlc1xuICBjb25zdCBjaGFubmVsUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGUuaXRlcigpXS5maWx0ZXIoXG4gICAgciA9PiAhci5jaGFubmVsSWQgfHwgci5jaGFubmVsSWQgPT09IGNoYW5uZWxJZFxuICApO1xuICBcbiAgLy8gQ2FsY3VsYXRlIGVmZmVjdGl2ZSBwZXJtaXNzaW9ucyAoaGlnaGVzdCBwb3NpdGlvbiByb2xlIHdpbnMgZm9yIGNvbmZsaWN0cylcbiAgY29uc3QgcmVsZXZhbnRSb2xlcyA9IHVzZXJSb2xlc1xuICAgIC5tYXAocm0gPT4gY2hhbm5lbFJvbGVzLmZpbmQociA9PiByLmlkID09PSBybS5yb2xlSWQpKVxuICAgIC5maWx0ZXIociA9PiByICE9PSB1bmRlZmluZWQpXG4gICAgLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGlmICghYSB8fCAhYikgcmV0dXJuIDA7XG4gICAgICByZXR1cm4gYS5wb3NpdGlvbiA+IGIucG9zaXRpb24gPyAtMSA6IGEucG9zaXRpb24gPCBiLnBvc2l0aW9uID8gMSA6IDA7XG4gICAgfSk7XG4gIFxuICAvLyBDb21iaW5lIHBlcm1pc3Npb25zIChPUiBvcGVyYXRpb24pXG4gIHJlbGV2YW50Um9sZXMuZm9yRWFjaChyb2xlID0+IHtcbiAgICBpZiAocm9sZSkge1xuICAgICAgcGVybWlzc2lvbnMgfD0gcm9sZS5wZXJtaXNzaW9ucztcbiAgICB9XG4gIH0pO1xuICBcbiAgLy8gQ2hhbm5lbCBtZW1iZXJzIGFsd2F5cyBoYXZlIGJhc2ljIHBlcm1pc3Npb25zXG4gIGNvbnN0IGNoYW5uZWxNZW1iZXJzID0gWy4uLmN0eC5kYi5jaGFubmVsTWVtYmVyLml0ZXIoKV0uZmlsdGVyKFxuICAgIG0gPT4gbS5jaGFubmVsSWQgPT09IGNoYW5uZWxJZFxuICApO1xuICBjb25zdCBpc01lbWJlciA9IGNoYW5uZWxNZW1iZXJzLnNvbWUobSA9PiBtLnVzZXJJZC5pc0VxdWFsKHVzZXJJZCkpO1xuICBcbiAgaWYgKGlzTWVtYmVyKSB7XG4gICAgLy8gQmFzaWMgbWVtYmVyIHBlcm1pc3Npb25zXG4gICAgcGVybWlzc2lvbnMgfD0gUGVybWlzc2lvbnMuU0VORF9NRVNTQUdFO1xuICAgIHBlcm1pc3Npb25zIHw9IFBlcm1pc3Npb25zLkpPSU5fVk9JQ0U7XG4gICAgcGVybWlzc2lvbnMgfD0gUGVybWlzc2lvbnMuU1BFQUtfSU5fVk9JQ0U7XG4gIH1cbiAgXG4gIHJldHVybiBwZXJtaXNzaW9ucztcbn1cblxuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG4vLyBWQUxJREFUSU9OIEZVTkNUSU9OU1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmZ1bmN0aW9uIHZhbGlkYXRlTmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgaWYgKCFuYW1lIHx8IG5hbWUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignTmFtZXMgbXVzdCBub3QgYmUgZW1wdHknKTtcbiAgfVxuICBpZiAobmFtZS5sZW5ndGggPiAzMikge1xuICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignTmFtZXMgbXVzdCBiZSAzMiBjaGFyYWN0ZXJzIG9yIGxlc3MnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1lc3NhZ2UodGV4dDogc3RyaW5nKSB7XG4gIGlmICghdGV4dCB8fCB0ZXh0LnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ01lc3NhZ2VzIG11c3Qgbm90IGJlIGVtcHR5Jyk7XG4gIH1cbiAgaWYgKHRleHQubGVuZ3RoID4gMjAwMCkge1xuICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignTWVzc2FnZXMgbXVzdCBiZSAyMDAwIGNoYXJhY3RlcnMgb3IgbGVzcycpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlQ2hhbm5lbE5hbWUobmFtZTogc3RyaW5nKSB7XG4gIGlmICghbmFtZSB8fCBuYW1lLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ0NoYW5uZWwgbmFtZXMgbXVzdCBub3QgYmUgZW1wdHknKTtcbiAgfVxuICBpZiAobmFtZS5sZW5ndGggPiAxMDApIHtcbiAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ0NoYW5uZWwgbmFtZXMgbXVzdCBiZSAxMDAgY2hhcmFjdGVycyBvciBsZXNzJyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVFbWFpbChlbWFpbDogc3RyaW5nKSB7XG4gIGlmICghZW1haWwgfHwgZW1haWwudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignRW1haWwgbXVzdCBub3QgYmUgZW1wdHknKTtcbiAgfVxuICBjb25zdCBlbWFpbFJlZ2V4ID0gL15bXlxcc0BdK0BbXlxcc0BdK1xcLlteXFxzQF0rJC87XG4gIGlmICghZW1haWxSZWdleC50ZXN0KGVtYWlsKSkge1xuICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignSW52YWxpZCBlbWFpbCBmb3JtYXQnKTtcbiAgfVxuICBpZiAoZW1haWwubGVuZ3RoID4gMjU1KSB7XG4gICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdFbWFpbCBtdXN0IGJlIDI1NSBjaGFyYWN0ZXJzIG9yIGxlc3MnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgaWYgKCFwYXNzd29yZCB8fCBwYXNzd29yZC5sZW5ndGggPT09IDApIHtcbiAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1Bhc3N3b3JkIG11c3Qgbm90IGJlIGVtcHR5Jyk7XG4gIH1cbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA8IDYpIHtcbiAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1Bhc3N3b3JkIG11c3QgYmUgYXQgbGVhc3QgNiBjaGFyYWN0ZXJzJyk7XG4gIH1cbiAgaWYgKHBhc3N3b3JkLmxlbmd0aCA+IDEyOCkge1xuICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignUGFzc3dvcmQgbXVzdCBiZSAxMjggY2hhcmFjdGVycyBvciBsZXNzJyk7XG4gIH1cbn1cblxuLy8gU2ltcGxlIGhhc2ggZnVuY3Rpb24gLSBpbiBwcm9kdWN0aW9uLCB1c2UgcHJvcGVyIGJjcnlwdFxuZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvLyBTaW1wbGUgaGFzaCBmb3IgZGVtbyAtIHJlcGxhY2Ugd2l0aCBwcm9wZXIgYmNyeXB0IGluIHByb2R1Y3Rpb25cbiAgbGV0IGhhc2ggPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHBhc3N3b3JkLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY2hhciA9IHBhc3N3b3JkLmNoYXJDb2RlQXQoaSk7XG4gICAgaGFzaCA9ICgoaGFzaCA8PCA1KSAtIGhhc2gpICsgY2hhcjtcbiAgICBoYXNoID0gaGFzaCAmIGhhc2g7IC8vIENvbnZlcnQgdG8gMzJiaXQgaW50ZWdlclxuICB9XG4gIHJldHVybiBoYXNoLnRvU3RyaW5nKDM2KTtcbn1cblxuZnVuY3Rpb24gdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQ6IHN0cmluZywgaGFzaDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBoYXNoUGFzc3dvcmQocGFzc3dvcmQpID09PSBoYXNoO1xufVxuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFJFRFVDRVJTXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGNvbnN0IHNldF9uYW1lID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBuYW1lOiB0LnN0cmluZygpIH0sXG4gIChjdHgsIHsgbmFtZSB9KSA9PiB7XG4gICAgdmFsaWRhdGVOYW1lKG5hbWUpO1xuICAgIGNvbnN0IHVzZXIgPSBjdHguZGIudXNlci5pZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICAgIGlmICghdXNlcikge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdDYW5ub3Qgc2V0IG5hbWUgZm9yIHVua25vd24gdXNlcicpO1xuICAgIH1cbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBzZXRzIG5hbWUgdG8gJHtuYW1lfWApO1xuICAgIC8vIFVwZGF0ZSB1c2VyIHdpdGggbmV3IG5hbWUgLSBlbnN1cmUgYWxsIGZpZWxkcyBhcmUgaW5jbHVkZWRcbiAgICBjdHguZGIudXNlci5pZGVudGl0eS51cGRhdGUoe1xuICAgICAgaWRlbnRpdHk6IHVzZXIuaWRlbnRpdHksXG4gICAgICBuYW1lOiBuYW1lLCAvLyBTZXQgdGhlIG5hbWUgKG9wdGlvbmFsIGZpZWxkKVxuICAgICAgb25saW5lOiB1c2VyLm9ubGluZSxcbiAgICAgIGF2YXRhcjogdXNlci5hdmF0YXIsXG4gICAgICBhdXRoTWV0aG9kOiB1c2VyLmF1dGhNZXRob2QsXG4gICAgICBsYXN0SXBBZGRyZXNzOiB1c2VyLmxhc3RJcEFkZHJlc3MsXG4gICAgfSk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVfY2hhbm5lbCA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgbmFtZTogdC5zdHJpbmcoKSwgZGVzY3JpcHRpb246IHQuc3RyaW5nKCkub3B0aW9uYWwoKSwgdHlwZTogdC5zdHJpbmcoKSB9LFxuICAoY3R4LCB7IG5hbWUsIGRlc2NyaXB0aW9uLCB0eXBlIH0pID0+IHtcbiAgICB2YWxpZGF0ZUNoYW5uZWxOYW1lKG5hbWUpO1xuICAgIGlmICh0eXBlICE9PSAndGV4dCcgJiYgdHlwZSAhPT0gJ3ZvaWNlJykge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdDaGFubmVsIHR5cGUgbXVzdCBiZSBcInRleHRcIiBvciBcInZvaWNlXCInKTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBoYXMgQ1JFQVRFX0NIQU5ORUwgcGVybWlzc2lvbiAoZ2xvYmFsIGNoZWNrKVxuICAgIGNvbnN0IHVzZXJSb2xlcyA9IFsuLi5jdHguZGIucm9sZU1lbWJlci5pdGVyKCldLmZpbHRlcihybSA9PiBybS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgY29uc3QgZ2xvYmFsUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGUuaXRlcigpXS5maWx0ZXIociA9PiAhci5jaGFubmVsSWQpO1xuICAgIGNvbnN0IHVzZXJHbG9iYWxSb2xlcyA9IHVzZXJSb2xlc1xuICAgICAgLm1hcChybSA9PiBnbG9iYWxSb2xlcy5maW5kKHIgPT4gci5pZCA9PT0gcm0ucm9sZUlkKSlcbiAgICAgIC5maWx0ZXIociA9PiByICE9PSB1bmRlZmluZWQpO1xuICAgIFxuICAgIGxldCBoYXNDcmVhdGVQZXJtaXNzaW9uID0gZmFsc2U7XG4gICAgdXNlckdsb2JhbFJvbGVzLmZvckVhY2gocm9sZSA9PiB7XG4gICAgICBpZiAocm9sZSAmJiBjaGVja1Blcm1pc3Npb24ocm9sZS5wZXJtaXNzaW9ucywgUGVybWlzc2lvbnMuQ1JFQVRFX0NIQU5ORUwpKSB7XG4gICAgICAgIGhhc0NyZWF0ZVBlcm1pc3Npb24gPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIC8vIElmIG5vIGdsb2JhbCByb2xlcywgYWxsb3cgY3JlYXRpb24gKGRlZmF1bHQgYmVoYXZpb3IgZm9yIG5ldyB1c2VycylcbiAgICBpZiAodXNlckdsb2JhbFJvbGVzLmxlbmd0aCA+IDAgJiYgIWhhc0NyZWF0ZVBlcm1pc3Npb24pIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gY3JlYXRlIGNoYW5uZWxzJyk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IGNoYW5uZWwgPSBjdHguZGIuY2hhbm5lbC5pbnNlcnQoe1xuICAgICAgaWQ6IDBuLFxuICAgICAgbmFtZSxcbiAgICAgIGRlc2NyaXB0aW9uLFxuICAgICAgdHlwZSxcbiAgICAgIGNyZWF0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIGNyZWF0ZWRCeTogY3R4LnNlbmRlcixcbiAgICB9KTtcbiAgICBcbiAgICBjdHguZGIuY2hhbm5lbE1lbWJlci5pbnNlcnQoe1xuICAgICAgaWQ6IDBuLFxuICAgICAgY2hhbm5lbElkOiBjaGFubmVsLmlkLFxuICAgICAgdXNlcklkOiBjdHguc2VuZGVyLFxuICAgICAgam9pbmVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gICAgXG4gICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gY3JlYXRlZCBjaGFubmVsICR7bmFtZX0gKCR7Y2hhbm5lbC5pZH0pYCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBjcmVhdGVfdGhyZWFkID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBjaGFubmVsSWQ6IHQudTY0KCksIG5hbWU6IHQuc3RyaW5nKCkgfSxcbiAgKGN0eCwgeyBjaGFubmVsSWQsIG5hbWUgfSkgPT4ge1xuICAgIHZhbGlkYXRlQ2hhbm5lbE5hbWUobmFtZSk7XG4gICAgY29uc3QgY2hhbm5lbCA9IGN0eC5kYi5jaGFubmVsLmlkLmZpbmQoY2hhbm5lbElkKTtcbiAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignQ2hhbm5lbCBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgY2hhbm5lbE1lbWJlcnMgPSBbLi4uY3R4LmRiLmNoYW5uZWxNZW1iZXIuaXRlcigpXS5maWx0ZXIobSA9PiBtLmNoYW5uZWxJZCA9PT0gY2hhbm5lbElkKTtcbiAgICBjb25zdCBtZW1iZXIgPSBjaGFubmVsTWVtYmVycy5maW5kKG0gPT4gbS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgXG4gICAgaWYgKCFtZW1iZXIpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IG11c3QgYmUgYSBtZW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gY3JlYXRlIHRocmVhZHMnKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgdGhyZWFkID0gY3R4LmRiLnRocmVhZC5pbnNlcnQoe1xuICAgICAgaWQ6IDBuLFxuICAgICAgY2hhbm5lbElkLFxuICAgICAgbmFtZSxcbiAgICAgIGNyZWF0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIGNyZWF0ZWRCeTogY3R4LnNlbmRlcixcbiAgICB9KTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBjcmVhdGVkIHRocmVhZCAke25hbWV9IGluIGNoYW5uZWwgJHtjaGFubmVsSWR9ICgke3RocmVhZC5pZH0pYCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBqb2luX2NoYW5uZWwgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IGNoYW5uZWxJZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IGNoYW5uZWxJZCB9KSA9PiB7XG4gICAgY29uc3QgY2hhbm5lbCA9IGN0eC5kYi5jaGFubmVsLmlkLmZpbmQoY2hhbm5lbElkKTtcbiAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignQ2hhbm5lbCBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3QgaWRlbnRpdHlMaW5rID0gY3R4LmRiLmlkZW50aXR5TGluay5zZXNzaW9uSWRlbnRpdHkuZmluZChjdHguc2VuZGVyKTtcbiAgICBjb25zdCBhY2NvdW50SWRlbnRpdHkgPSBpZGVudGl0eUxpbms/LmFjY291bnRJZGVudGl0eTtcblxuICAgIGNvbnN0IGNoYW5uZWxNZW1iZXJzID0gWy4uLmN0eC5kYi5jaGFubmVsTWVtYmVyLml0ZXIoKV0uZmlsdGVyKG0gPT4gbS5jaGFubmVsSWQgPT09IGNoYW5uZWxJZCk7XG4gICAgY29uc3QgZXhpc3RpbmdNZW1iZXIgPSBjaGFubmVsTWVtYmVycy5maW5kKG0gPT4gbS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgY29uc3QgYWNjb3VudEFscmVhZHlNZW1iZXIgPSBhY2NvdW50SWRlbnRpdHkgJiYgY2hhbm5lbE1lbWJlcnMuc29tZShtID0+IG0udXNlcklkLmlzRXF1YWwoYWNjb3VudElkZW50aXR5KSk7XG4gICAgXG4gICAgaWYgKGV4aXN0aW5nTWVtYmVyKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBhcmUgYWxyZWFkeSBhIG1lbWJlciBvZiB0aGlzIGNoYW5uZWwnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gSWYgYWNjb3VudCBpcyBhbHJlYWR5IGEgbWVtYmVyIChmcm9tIGFub3RoZXIgc2Vzc2lvbiksIGp1c3QgYWRkIHNlc3Npb24gZm9yIGFjY2Vzc1xuICAgIGlmIChhY2NvdW50QWxyZWFkeU1lbWJlcikge1xuICAgICAgY3R4LmRiLmNoYW5uZWxNZW1iZXIuaW5zZXJ0KHtcbiAgICAgICAgaWQ6IDBuLFxuICAgICAgICBjaGFubmVsSWQsXG4gICAgICAgIHVzZXJJZDogY3R4LnNlbmRlcixcbiAgICAgICAgam9pbmVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IGpvaW5lZCBjaGFubmVsICR7Y2hhbm5lbElkfSAobGlua2VkIHNlc3Npb24pYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi5jaGFubmVsTWVtYmVyLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICBjaGFubmVsSWQsXG4gICAgICB1c2VySWQ6IGN0eC5zZW5kZXIsXG4gICAgICBqb2luZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgICBcbiAgICBpZiAoYWNjb3VudElkZW50aXR5ICYmICFhY2NvdW50QWxyZWFkeU1lbWJlcikge1xuICAgICAgY3R4LmRiLmNoYW5uZWxNZW1iZXIuaW5zZXJ0KHtcbiAgICAgICAgaWQ6IDBuLFxuICAgICAgICBjaGFubmVsSWQsXG4gICAgICAgIHVzZXJJZDogYWNjb3VudElkZW50aXR5LFxuICAgICAgICBqb2luZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBqb2luZWQgY2hhbm5lbCAke2NoYW5uZWxJZH1gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGFkZF91c2VyX3RvX2NoYW5uZWwgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IGNoYW5uZWxJZDogdC51NjQoKSwgdXNlcklkOiB0LmlkZW50aXR5KCkgfSxcbiAgKGN0eCwgeyBjaGFubmVsSWQsIHVzZXJJZCB9KSA9PiB7XG4gICAgY29uc3QgY2hhbm5lbCA9IGN0eC5kYi5jaGFubmVsLmlkLmZpbmQoY2hhbm5lbElkKTtcbiAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignQ2hhbm5lbCBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgcGVybWlzc2lvbnNcbiAgICBjb25zdCB1c2VyUGVybXMgPSBnZXRVc2VyQ2hhbm5lbFBlcm1pc3Npb25zKGN0eCwgY3R4LnNlbmRlciwgY2hhbm5lbElkKTtcbiAgICBpZiAoIWNoZWNrUGVybWlzc2lvbih1c2VyUGVybXMsIFBlcm1pc3Npb25zLkFERF9VU0VSKSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBhZGQgdXNlcnMgdG8gdGhpcyBjaGFubmVsJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGlmIHVzZXIgZXhpc3RzXG4gICAgY29uc3QgdXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQodXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignVXNlciBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBhbHJlYWR5IGEgbWVtYmVyXG4gICAgY29uc3QgY2hhbm5lbE1lbWJlcnMgPSBbLi4uY3R4LmRiLmNoYW5uZWxNZW1iZXIuaXRlcigpXS5maWx0ZXIobSA9PiBtLmNoYW5uZWxJZCA9PT0gY2hhbm5lbElkKTtcbiAgICBjb25zdCBleGlzdGluZ01lbWJlciA9IGNoYW5uZWxNZW1iZXJzLmZpbmQobSA9PiBtLnVzZXJJZC5pc0VxdWFsKHVzZXJJZCkpO1xuICAgIGlmIChleGlzdGluZ01lbWJlcikge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdVc2VyIGlzIGFscmVhZHkgYSBtZW1iZXIgb2YgdGhpcyBjaGFubmVsJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIEFkZCB1c2VyIHRvIGNoYW5uZWxcbiAgICBjdHguZGIuY2hhbm5lbE1lbWJlci5pbnNlcnQoe1xuICAgICAgaWQ6IDBuLFxuICAgICAgY2hhbm5lbElkLFxuICAgICAgdXNlcklkLFxuICAgICAgam9pbmVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gICAgXG4gICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gYWRkZWQgdXNlciAke3VzZXJJZH0gdG8gY2hhbm5lbCAke2NoYW5uZWxJZH1gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGxlYXZlX2NoYW5uZWwgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IGNoYW5uZWxJZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IGNoYW5uZWxJZCB9KSA9PiB7XG4gICAgY29uc3QgY2hhbm5lbE1lbWJlcnMgPSBbLi4uY3R4LmRiLmNoYW5uZWxNZW1iZXIuaXRlcigpXS5maWx0ZXIobSA9PiBtLmNoYW5uZWxJZCA9PT0gY2hhbm5lbElkKTtcbiAgICBjb25zdCBtZW1iZXIgPSBjaGFubmVsTWVtYmVycy5maW5kKG0gPT4gbS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgXG4gICAgaWYgKCFtZW1iZXIpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IGFyZSBub3QgYSBtZW1iZXIgb2YgdGhpcyBjaGFubmVsJyk7XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi5jaGFubmVsTWVtYmVyLmRlbGV0ZShtZW1iZXIpO1xuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IGxlZnQgY2hhbm5lbCAke2NoYW5uZWxJZH1gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGtpY2tfdXNlciA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgY2hhbm5lbElkOiB0LnU2NCgpLCB1c2VySWQ6IHQuaWRlbnRpdHkoKSB9LFxuICAoY3R4LCB7IGNoYW5uZWxJZCwgdXNlcklkIH0pID0+IHtcbiAgICBjb25zdCBjaGFubmVsID0gY3R4LmRiLmNoYW5uZWwuaWQuZmluZChjaGFubmVsSWQpO1xuICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdDaGFubmVsIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBwZXJtaXNzaW9uc1xuICAgIGNvbnN0IHVzZXJQZXJtcyA9IGdldFVzZXJDaGFubmVsUGVybWlzc2lvbnMoY3R4LCBjdHguc2VuZGVyLCBjaGFubmVsSWQpO1xuICAgIGlmICghY2hlY2tQZXJtaXNzaW9uKHVzZXJQZXJtcywgUGVybWlzc2lvbnMuS0lDS19VU0VSKSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBraWNrIHVzZXJzIGZyb20gdGhpcyBjaGFubmVsJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGlmIHVzZXIgZXhpc3RzXG4gICAgY29uc3QgdXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQodXNlcklkKTtcbiAgICBpZiAoIXVzZXIpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignVXNlciBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUHJldmVudCBraWNraW5nIHlvdXJzZWxmICh1c2UgbGVhdmVfY2hhbm5lbCBpbnN0ZWFkKVxuICAgIGlmICh1c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdZb3UgY2Fubm90IGtpY2sgeW91cnNlbGYuIFVzZSBsZWF2ZSBjaGFubmVsIGluc3RlYWQuJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGlmIHVzZXIgaXMgYSBtZW1iZXIgb2YgdGhlIGNoYW5uZWxcbiAgICBjb25zdCBjaGFubmVsTWVtYmVycyA9IFsuLi5jdHguZGIuY2hhbm5lbE1lbWJlci5pdGVyKCldLmZpbHRlcihtID0+IG0uY2hhbm5lbElkID09PSBjaGFubmVsSWQpO1xuICAgIGNvbnN0IG1lbWJlciA9IGNoYW5uZWxNZW1iZXJzLmZpbmQobSA9PiBtLnVzZXJJZC5pc0VxdWFsKHVzZXJJZCkpO1xuICAgIFxuICAgIGlmICghbWVtYmVyKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1VzZXIgaXMgbm90IGEgbWVtYmVyIG9mIHRoaXMgY2hhbm5lbCcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZW1vdmUgdXNlciBmcm9tIGNoYW5uZWxcbiAgICBjdHguZGIuY2hhbm5lbE1lbWJlci5kZWxldGUobWVtYmVyKTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBraWNrZWQgdXNlciAke3VzZXJJZH0gZnJvbSBjaGFubmVsICR7Y2hhbm5lbElkfWApO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2VuZF9tZXNzYWdlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBcbiAgICB0ZXh0OiB0LnN0cmluZygpLCBcbiAgICBjaGFubmVsSWQ6IHQudTY0KCkub3B0aW9uYWwoKSwgXG4gICAgdGhyZWFkSWQ6IHQudTY0KCkub3B0aW9uYWwoKSBcbiAgfSxcbiAgKGN0eCwgeyB0ZXh0LCBjaGFubmVsSWQsIHRocmVhZElkIH0pID0+IHtcbiAgICB2YWxpZGF0ZU1lc3NhZ2UodGV4dCk7XG4gICAgXG4gICAgaWYgKCFjaGFubmVsSWQgJiYgIXRocmVhZElkKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ011c3Qgc3BlY2lmeSBlaXRoZXIgY2hhbm5lbElkIG9yIHRocmVhZElkJyk7XG4gICAgfVxuICAgIGlmIChjaGFubmVsSWQgJiYgdGhyZWFkSWQpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignQ2Fubm90IHNwZWNpZnkgYm90aCBjaGFubmVsSWQgYW5kIHRocmVhZElkJyk7XG4gICAgfVxuICAgIFxuICAgIGlmIChjaGFubmVsSWQpIHtcbiAgICAgIGNvbnN0IGNoYW5uZWwgPSBjdHguZGIuY2hhbm5lbC5pZC5maW5kKGNoYW5uZWxJZCk7XG4gICAgICBpZiAoIWNoYW5uZWwpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdDaGFubmVsIG5vdCBmb3VuZCcpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBDaGVjayBwZXJtaXNzaW9uc1xuICAgICAgY29uc3QgdXNlclBlcm1zID0gZ2V0VXNlckNoYW5uZWxQZXJtaXNzaW9ucyhjdHgsIGN0eC5zZW5kZXIsIGNoYW5uZWxJZCk7XG4gICAgICBpZiAoIWNoZWNrUGVybWlzc2lvbih1c2VyUGVybXMsIFBlcm1pc3Npb25zLlNFTkRfTUVTU0FHRSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBzZW5kIG1lc3NhZ2VzIGluIHRoaXMgY2hhbm5lbCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAodGhyZWFkSWQpIHtcbiAgICAgIGNvbnN0IHRocmVhZCA9IGN0eC5kYi50aHJlYWQuaWQuZmluZCh0aHJlYWRJZCk7XG4gICAgICBpZiAoIXRocmVhZCkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1RocmVhZCBub3QgZm91bmQnKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgY2hhbm5lbE1lbWJlcnMgPSBbLi4uY3R4LmRiLmNoYW5uZWxNZW1iZXIuaXRlcigpXS5maWx0ZXIobSA9PiBtLmNoYW5uZWxJZCA9PT0gdGhyZWFkLmNoYW5uZWxJZCk7XG4gICAgICBjb25zdCBtZW1iZXIgPSBjaGFubmVsTWVtYmVycy5maW5kKG0gPT4gbS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgICBcbiAgICAgIGlmICghbWVtYmVyKSB7XG4gICAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IG11c3QgYmUgYSBtZW1iZXIgb2YgdGhlIGNoYW5uZWwgdG8gc2VuZCBtZXNzYWdlcyBpbiB0aHJlYWRzJyk7XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi5tZXNzYWdlLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICBzZW5kZXI6IGN0eC5zZW5kZXIsXG4gICAgICBjaGFubmVsSWQ6IGNoYW5uZWxJZCA/PyB1bmRlZmluZWQsXG4gICAgICB0aHJlYWRJZDogdGhyZWFkSWQgPz8gdW5kZWZpbmVkLFxuICAgICAgdGV4dCxcbiAgICAgIHNlbnQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICBlZGl0ZWRBdDogdW5kZWZpbmVkLFxuICAgIH0pO1xuICAgIFxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IHNlbnQgbWVzc2FnZSBpbiAke2NoYW5uZWxJZCA/IGBjaGFubmVsICR7Y2hhbm5lbElkfWAgOiBgdGhyZWFkICR7dGhyZWFkSWR9YH1gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IGVkaXRfbWVzc2FnZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgbWVzc2FnZUlkOiB0LnU2NCgpLCB0ZXh0OiB0LnN0cmluZygpIH0sXG4gIChjdHgsIHsgbWVzc2FnZUlkLCB0ZXh0IH0pID0+IHtcbiAgICB2YWxpZGF0ZU1lc3NhZ2UodGV4dCk7XG4gICAgY29uc3QgbWVzc2FnZSA9IGN0eC5kYi5tZXNzYWdlLmlkLmZpbmQobWVzc2FnZUlkKTtcbiAgICBpZiAoIW1lc3NhZ2UpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignTWVzc2FnZSBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgcGVybWlzc2lvbnMgLSBjYW4gZWRpdCBvd24gbWVzc2FnZXMgb3IgbmVlZCBFRElUX01FU1NBR0UgcGVybWlzc2lvblxuICAgIGNvbnN0IGlzT3duTWVzc2FnZSA9IG1lc3NhZ2Uuc2VuZGVyLmlzRXF1YWwoY3R4LnNlbmRlcik7XG4gICAgaWYgKCFpc093bk1lc3NhZ2UgJiYgbWVzc2FnZS5jaGFubmVsSWQpIHtcbiAgICAgIGNvbnN0IHVzZXJQZXJtcyA9IGdldFVzZXJDaGFubmVsUGVybWlzc2lvbnMoY3R4LCBjdHguc2VuZGVyLCBtZXNzYWdlLmNoYW5uZWxJZCk7XG4gICAgICBpZiAoIWNoZWNrUGVybWlzc2lvbih1c2VyUGVybXMsIFBlcm1pc3Npb25zLkVESVRfTUVTU0FHRSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdZb3UgZG8gbm90IGhhdmUgcGVybWlzc2lvbiB0byBlZGl0IG1lc3NhZ2VzJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghaXNPd25NZXNzYWdlKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBjYW4gb25seSBlZGl0IHlvdXIgb3duIG1lc3NhZ2VzJyk7XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi5tZXNzYWdlLmlkLnVwZGF0ZSh7XG4gICAgICAuLi5tZXNzYWdlLFxuICAgICAgdGV4dCxcbiAgICAgIGVkaXRlZEF0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICAgIFxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IGVkaXRlZCBtZXNzYWdlICR7bWVzc2FnZUlkfWApO1xuICB9XG4pO1xuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIEFVVEhFTlRJQ0FUSU9OIFJFRFVDRVJTXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGNvbnN0IHNpZ251cF9lbWFpbCA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgZW1haWw6IHQuc3RyaW5nKCksIHBhc3N3b3JkOiB0LnN0cmluZygpLCBuYW1lOiB0LnN0cmluZygpLm9wdGlvbmFsKCkgfSxcbiAgKGN0eCwgeyBlbWFpbCwgcGFzc3dvcmQsIG5hbWUgfSkgPT4ge1xuICAgIGNvbnN0IG5vcm1hbGl6ZWRFbWFpbCA9IGVtYWlsLnRvTG93ZXJDYXNlKCkudHJpbSgpO1xuICAgIHZhbGlkYXRlRW1haWwobm9ybWFsaXplZEVtYWlsKTtcbiAgICB2YWxpZGF0ZVBhc3N3b3JkKHBhc3N3b3JkKTtcbiAgICBcbiAgICAvLyBDaGVjayBpZiBlbWFpbCBhbHJlYWR5IGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nQ3JlZGVudGlhbCA9IGN0eC5kYi5lbWFpbENyZWRlbnRpYWwuZW1haWwuZmluZChub3JtYWxpemVkRW1haWwpO1xuICAgIGlmIChleGlzdGluZ0NyZWRlbnRpYWwpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignRW1haWwgYWxyZWFkeSByZWdpc3RlcmVkJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIEhhc2ggcGFzc3dvcmRcbiAgICBjb25zdCBwYXNzd29yZEhhc2ggPSBoYXNoUGFzc3dvcmQocGFzc3dvcmQpO1xuICAgIFxuICAgIC8vIENoZWNrIGlmIHVzZXIgYWxyZWFkeSBleGlzdHNcbiAgICBsZXQgdXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQoY3R4LnNlbmRlcik7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyB1c2VyXG4gICAgICBjdHguZGIudXNlci5pZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAuLi51c2VyLFxuICAgICAgICBuYW1lOiBuYW1lPy50cmltKCkgfHwgdXNlci5uYW1lLFxuICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgIGF1dGhNZXRob2Q6ICdlbWFpbCcsXG4gICAgICAgIGxhc3RJcEFkZHJlc3M6IHVzZXIubGFzdElwQWRkcmVzcywgLy8gS2VlcCBleGlzdGluZyBJUFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENyZWF0ZSBuZXcgdXNlciByZWNvcmRcbiAgICAgIHVzZXIgPSBjdHguZGIudXNlci5pbnNlcnQoe1xuICAgICAgICBpZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgbmFtZTogbmFtZT8udHJpbSgpIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgICBhdmF0YXI6IHVuZGVmaW5lZCxcbiAgICAgICAgYXV0aE1ldGhvZDogJ2VtYWlsJyxcbiAgICAgICAgbGFzdElwQWRkcmVzczogdW5kZWZpbmVkLCAvLyBXaWxsIGJlIHNldCBvbiBuZXh0IGNvbm5lY3Rpb25cbiAgICAgIH0pO1xuICAgICAgXG4gICAgICAvLyBJZiB0aGlzIGlzIHRoZSBmaXJzdCBhdXRoZW50aWNhdGVkIHVzZXIgYW5kIG5vIGFkbWluIHJvbGUgZXhpc3RzLCBtYWtlIHRoZW0gYWRtaW5cbiAgICAgIGNvbnN0IGFsbFVzZXJzID0gWy4uLmN0eC5kYi51c2VyLml0ZXIoKV07XG4gICAgICBjb25zdCBhdXRoZW50aWNhdGVkVXNlcnMgPSBhbGxVc2Vycy5maWx0ZXIodSA9PiB1LmF1dGhNZXRob2QpO1xuICAgICAgY29uc3QgYWxsUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGUuaXRlcigpXTtcbiAgICAgIGNvbnN0IGhhc0FkbWluUm9sZSA9IGFsbFJvbGVzLnNvbWUociA9PiAoci5wZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG4pO1xuICAgICAgXG4gICAgICBpZiAoYXV0aGVudGljYXRlZFVzZXJzLmxlbmd0aCA9PT0gMSAmJiAhaGFzQWRtaW5Sb2xlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY29uc3QgYWRtaW5Sb2xlID0gY3R4LmRiLnJvbGUuaW5zZXJ0KHtcbiAgICAgICAgICAgIGlkOiAwbixcbiAgICAgICAgICAgIGNoYW5uZWxJZDogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbmFtZTogJ0FkbWluJyxcbiAgICAgICAgICAgIGNvbG9yOiAnI2YwNDc0NycsXG4gICAgICAgICAgICBwZXJtaXNzaW9uczogUGVybWlzc2lvbnMuQURNSU4sXG4gICAgICAgICAgICBwb3NpdGlvbjogMTAwMG4sXG4gICAgICAgICAgICBjcmVhdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgICAgICBjcmVhdGVkQnk6IGN0eC5zZW5kZXIsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgY3R4LmRiLnJvbGVNZW1iZXIuaW5zZXJ0KHtcbiAgICAgICAgICAgIGlkOiAwbixcbiAgICAgICAgICAgIHJvbGVJZDogYWRtaW5Sb2xlLmlkLFxuICAgICAgICAgICAgdXNlcklkOiBjdHguc2VuZGVyLFxuICAgICAgICAgICAgYXNzaWduZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgICAgIGFzc2lnbmVkQnk6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBcbiAgICAgICAgICBjb25zb2xlLmluZm8oYEZpcnN0IGF1dGhlbnRpY2F0ZWQgdXNlciAke2N0eC5zZW5kZXJ9IGF1dG9tYXRpY2FsbHkgYXNzaWduZWQgYWRtaW4gcm9sZWApO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBjcmVhdGluZyBhZG1pbiByb2xlOicsIGVycik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgLy8gQ3JlYXRlIGVtYWlsIGNyZWRlbnRpYWxcbiAgICBjdHguZGIuZW1haWxDcmVkZW50aWFsLmluc2VydCh7XG4gICAgICBlbWFpbDogbm9ybWFsaXplZEVtYWlsLFxuICAgICAgcGFzc3dvcmRIYXNoLFxuICAgICAgaWRlbnRpdHk6IGN0eC5zZW5kZXIsXG4gICAgICBjcmVhdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gICAgXG4gICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gc2lnbmVkIHVwIHdpdGggZW1haWwgJHtub3JtYWxpemVkRW1haWx9YCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBsb2dpbl9lbWFpbCA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgZW1haWw6IHQuc3RyaW5nKCksIHBhc3N3b3JkOiB0LnN0cmluZygpIH0sXG4gIChjdHgsIHsgZW1haWwsIHBhc3N3b3JkIH0pID0+IHtcbiAgICBjb25zdCBub3JtYWxpemVkRW1haWwgPSBlbWFpbC50b0xvd2VyQ2FzZSgpLnRyaW0oKTtcbiAgICB2YWxpZGF0ZUVtYWlsKG5vcm1hbGl6ZWRFbWFpbCk7XG4gICAgdmFsaWRhdGVQYXNzd29yZChwYXNzd29yZCk7XG4gICAgXG4gICAgLy8gRmluZCBjcmVkZW50aWFsXG4gICAgY29uc3QgY3JlZGVudGlhbCA9IGN0eC5kYi5lbWFpbENyZWRlbnRpYWwuZW1haWwuZmluZChub3JtYWxpemVkRW1haWwpO1xuICAgIGlmICghY3JlZGVudGlhbCkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdJbnZhbGlkIGVtYWlsIG9yIHBhc3N3b3JkJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFZlcmlmeSBwYXNzd29yZFxuICAgIGlmICghdmVyaWZ5UGFzc3dvcmQocGFzc3dvcmQsIGNyZWRlbnRpYWwucGFzc3dvcmRIYXNoKSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdJbnZhbGlkIGVtYWlsIG9yIHBhc3N3b3JkJyk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IG9yaWdpbmFsVXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQoY3JlZGVudGlhbC5pZGVudGl0eSk7XG4gICAgY29uc3QgaXNMaW5rZWQgPSAhY3JlZGVudGlhbC5pZGVudGl0eS5pc0VxdWFsKGN0eC5zZW5kZXIpO1xuXG4gICAgLy8gT25seSBjcmVhdGUgdXNlciBmb3IgY3R4LnNlbmRlciB3aGVuIE5PVCBsaW5rZWQgLSB3aGVuIGxpbmtlZCwgb25seSBhY2NvdW50IGhhcyB1c2VyIHJvdyAobm8gZHVwbGljYXRlcylcbiAgICBpZiAoIWlzTGlua2VkKSB7XG4gICAgICBsZXQgdXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQoY3R4LnNlbmRlcik7XG4gICAgICBpZiAoIXVzZXIpIHtcbiAgICAgICAgY3R4LmRiLnVzZXIuaW5zZXJ0KHtcbiAgICAgICAgICBpZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgICBuYW1lOiBvcmlnaW5hbFVzZXI/Lm5hbWUsXG4gICAgICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgICAgIGF2YXRhcjogb3JpZ2luYWxVc2VyPy5hdmF0YXIsXG4gICAgICAgICAgYXV0aE1ldGhvZDogJ2VtYWlsJyxcbiAgICAgICAgICBsYXN0SXBBZGRyZXNzOiB1bmRlZmluZWQsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmRiLnVzZXIuaWRlbnRpdHkudXBkYXRlKHtcbiAgICAgICAgICAuLi51c2VyLFxuICAgICAgICAgIG5hbWU6IHVzZXIubmFtZSA/PyBvcmlnaW5hbFVzZXI/Lm5hbWUsXG4gICAgICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgICAgIGF1dGhNZXRob2Q6ICdlbWFpbCcsXG4gICAgICAgICAgbGFzdElwQWRkcmVzczogdXNlci5sYXN0SXBBZGRyZXNzLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gTGlua2VkIHNlc3Npb246IGVuc3VyZSBhY2NvdW50IGhhcyB1c2VyLCB1cGRhdGUgaXQuIERvIE5PVCBjcmVhdGUgdXNlciBmb3IgY3R4LnNlbmRlci5cbiAgICAgIGlmICghb3JpZ2luYWxVc2VyKSB7XG4gICAgICAgIGN0eC5kYi51c2VyLmluc2VydCh7XG4gICAgICAgICAgaWRlbnRpdHk6IGNyZWRlbnRpYWwuaWRlbnRpdHksXG4gICAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICAgIG9ubGluZTogdHJ1ZSxcbiAgICAgICAgICBhdmF0YXI6IHVuZGVmaW5lZCxcbiAgICAgICAgICBhdXRoTWV0aG9kOiAnZW1haWwnLFxuICAgICAgICAgIGxhc3RJcEFkZHJlc3M6IHVuZGVmaW5lZCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHguZGIudXNlci5pZGVudGl0eS51cGRhdGUoeyAuLi5vcmlnaW5hbFVzZXIsIG9ubGluZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb3B5IHJvbGUgbWVtYmVyc2hpcHMgZnJvbSBvcmlnaW5hbCBhY2NvdW50IChhZG1pbiwgY2hhbm5lbCByb2xlcywgZXRjLilcbiAgICBjb25zdCBvcmlnaW5hbFJvbGVNZW1iZXJzID0gWy4uLmN0eC5kYi5yb2xlTWVtYmVyLml0ZXIoKV0uZmlsdGVyKFxuICAgICAgcm0gPT4gcm0udXNlcklkLmlzRXF1YWwoY3JlZGVudGlhbC5pZGVudGl0eSlcbiAgICApO1xuICAgIGZvciAoY29uc3Qgcm0gb2Ygb3JpZ2luYWxSb2xlTWVtYmVycykge1xuICAgICAgY29uc3QgYWxyZWFkeUFzc2lnbmVkID0gWy4uLmN0eC5kYi5yb2xlTWVtYmVyLml0ZXIoKV0uc29tZShcbiAgICAgICAgbSA9PiBtLnJvbGVJZCA9PT0gcm0ucm9sZUlkICYmIG0udXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcilcbiAgICAgICk7XG4gICAgICBpZiAoIWFscmVhZHlBc3NpZ25lZCkge1xuICAgICAgICBjdHguZGIucm9sZU1lbWJlci5pbnNlcnQoe1xuICAgICAgICAgIGlkOiAwbixcbiAgICAgICAgICByb2xlSWQ6IHJtLnJvbGVJZCxcbiAgICAgICAgICB1c2VySWQ6IGN0eC5zZW5kZXIsXG4gICAgICAgICAgYXNzaWduZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgICBhc3NpZ25lZEJ5OiBybS5hc3NpZ25lZEJ5LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBDb3B5IGNoYW5uZWwgbWVtYmVyc2hpcHMgZnJvbSBvcmlnaW5hbCBhY2NvdW50XG4gICAgY29uc3Qgb3JpZ2luYWxDaGFubmVsTWVtYmVycyA9IFsuLi5jdHguZGIuY2hhbm5lbE1lbWJlci5pdGVyKCldLmZpbHRlcihcbiAgICAgIG0gPT4gbS51c2VySWQuaXNFcXVhbChjcmVkZW50aWFsLmlkZW50aXR5KVxuICAgICk7XG4gICAgZm9yIChjb25zdCBtIG9mIG9yaWdpbmFsQ2hhbm5lbE1lbWJlcnMpIHtcbiAgICAgIGNvbnN0IGFscmVhZHlNZW1iZXIgPSBbLi4uY3R4LmRiLmNoYW5uZWxNZW1iZXIuaXRlcigpXS5zb21lKFxuICAgICAgICBjbSA9PiBjbS5jaGFubmVsSWQgPT09IG0uY2hhbm5lbElkICYmIGNtLnVzZXJJZC5pc0VxdWFsKGN0eC5zZW5kZXIpXG4gICAgICApO1xuICAgICAgaWYgKCFhbHJlYWR5TWVtYmVyKSB7XG4gICAgICAgIGN0eC5kYi5jaGFubmVsTWVtYmVyLmluc2VydCh7XG4gICAgICAgICAgaWQ6IDBuLFxuICAgICAgICAgIGNoYW5uZWxJZDogbS5jaGFubmVsSWQsXG4gICAgICAgICAgdXNlcklkOiBjdHguc2VuZGVyLFxuICAgICAgICAgIGpvaW5lZEF0OiBjdHgudGltZXN0YW1wLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNMaW5rZWQpIHtcbiAgICAgIC8vIExpbmsgdGhpcyBzZXNzaW9uIHRvIHRoZSBhY2NvdW50IGlkZW50aXR5XG4gICAgICBjb25zdCBleGlzdGluZ0xpbmsgPSBjdHguZGIuaWRlbnRpdHlMaW5rLnNlc3Npb25JZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICAgICAgaWYgKGV4aXN0aW5nTGluaykge1xuICAgICAgICBjdHguZGIuaWRlbnRpdHlMaW5rLnNlc3Npb25JZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAgIC4uLmV4aXN0aW5nTGluayxcbiAgICAgICAgICBhY2NvdW50SWRlbnRpdHk6IGNyZWRlbnRpYWwuaWRlbnRpdHksXG4gICAgICAgICAgbGlua2VkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmRiLmlkZW50aXR5TGluay5pbnNlcnQoe1xuICAgICAgICAgIHNlc3Npb25JZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgICBhY2NvdW50SWRlbnRpdHk6IGNyZWRlbnRpYWwuaWRlbnRpdHksXG4gICAgICAgICAgbGlua2VkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gSGlkZSBzZXNzaW9uIGlkZW50aXR5IGluIHVzZXIgbGlzdCAtIHNob3cgYWNjb3VudCBpZGVudGl0eSAoY3JlZGVudGlhbC5pZGVudGl0eSlcbiAgICAgIGNvbnN0IGV4aXN0aW5nUmVwbGFjZWQgPSBjdHguZGIucmVwbGFjZWRJZGVudGl0eS5vbGRJZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICAgICAgaWYgKGV4aXN0aW5nUmVwbGFjZWQpIHtcbiAgICAgICAgY3R4LmRiLnJlcGxhY2VkSWRlbnRpdHkub2xkSWRlbnRpdHkudXBkYXRlKHtcbiAgICAgICAgICAuLi5leGlzdGluZ1JlcGxhY2VkLFxuICAgICAgICAgIG5ld0lkZW50aXR5OiBjcmVkZW50aWFsLmlkZW50aXR5LFxuICAgICAgICAgIHJlcGxhY2VkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmRiLnJlcGxhY2VkSWRlbnRpdHkuaW5zZXJ0KHtcbiAgICAgICAgICBvbGRJZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgICBuZXdJZGVudGl0eTogY3JlZGVudGlhbC5pZGVudGl0eSxcbiAgICAgICAgICByZXBsYWNlZEF0OiBjdHgudGltZXN0YW1wLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIC8vIFVwc2VydDogY2xpZW50Q29ubmVjdGVkIG1heSBoYXZlIGFscmVhZHkgYWRkZWQgdGhpcyBzZXNzaW9uIG9uIGNvbm5lY3RcbiAgICAgIGNvbnN0IGV4aXN0aW5nU2Vzc2lvbiA9IGN0eC5kYi5hY3RpdmVTZXNzaW9uLnNlc3Npb25JZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICAgICAgaWYgKGV4aXN0aW5nU2Vzc2lvbikge1xuICAgICAgICBjdHguZGIuYWN0aXZlU2Vzc2lvbi5zZXNzaW9uSWRlbnRpdHkudXBkYXRlKHtcbiAgICAgICAgICAuLi5leGlzdGluZ1Nlc3Npb24sXG4gICAgICAgICAgY29ubmVjdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmRiLmFjdGl2ZVNlc3Npb24uaW5zZXJ0KHtcbiAgICAgICAgICBzZXNzaW9uSWRlbnRpdHk6IGN0eC5zZW5kZXIsXG4gICAgICAgICAgY29ubmVjdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IGxvZ2dlZCBpbiB3aXRoIGVtYWlsICR7bm9ybWFsaXplZEVtYWlsfWApO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3Qgc2lnbnVwX2dvb2dsZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgXG4gICAgZ29vZ2xlSWQ6IHQuc3RyaW5nKCksIFxuICAgIGVtYWlsOiB0LnN0cmluZygpLm9wdGlvbmFsKCksIFxuICAgIG5hbWU6IHQuc3RyaW5nKCkub3B0aW9uYWwoKSxcbiAgICBhdmF0YXI6IHQuc3RyaW5nKCkub3B0aW9uYWwoKVxuICB9LFxuICAoY3R4LCB7IGdvb2dsZUlkLCBlbWFpbCwgbmFtZSwgYXZhdGFyIH0pID0+IHtcbiAgICBpZiAoIWdvb2dsZUlkIHx8IGdvb2dsZUlkLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignR29vZ2xlIElEIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGlmIEdvb2dsZSBJRCBhbHJlYWR5IGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGN0eC5kYi5nb29nbGVBdXRoLmdvb2dsZUlkLmZpbmQoZ29vZ2xlSWQpO1xuICAgIGlmIChleGlzdGluZ0F1dGgpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignR29vZ2xlIGFjY291bnQgYWxyZWFkeSByZWdpc3RlcmVkJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIENoZWNrIGlmIHVzZXIgYWxyZWFkeSBleGlzdHNcbiAgICBsZXQgdXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQoY3R4LnNlbmRlcik7XG4gICAgaWYgKHVzZXIpIHtcbiAgICAgIC8vIFVwZGF0ZSBleGlzdGluZyB1c2VyXG4gICAgICBjdHguZGIudXNlci5pZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAuLi51c2VyLFxuICAgICAgICBuYW1lOiBuYW1lPy50cmltKCkgfHwgdXNlci5uYW1lLFxuICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgIGF2YXRhcjogYXZhdGFyIHx8IHVzZXIuYXZhdGFyLFxuICAgICAgICBhdXRoTWV0aG9kOiAnZ29vZ2xlJyxcbiAgICAgICAgbGFzdElwQWRkcmVzczogdXNlci5sYXN0SXBBZGRyZXNzLCAvLyBLZWVwIGV4aXN0aW5nIElQXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gQ3JlYXRlIG5ldyB1c2VyIHJlY29yZFxuICAgICAgdXNlciA9IGN0eC5kYi51c2VyLmluc2VydCh7XG4gICAgICAgIGlkZW50aXR5OiBjdHguc2VuZGVyLFxuICAgICAgICBuYW1lOiBuYW1lPy50cmltKCkgfHwgdW5kZWZpbmVkLFxuICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgIGF2YXRhcjogYXZhdGFyIHx8IHVuZGVmaW5lZCxcbiAgICAgICAgYXV0aE1ldGhvZDogJ2dvb2dsZScsXG4gICAgICAgIGxhc3RJcEFkZHJlc3M6IHVuZGVmaW5lZCwgLy8gV2lsbCBiZSBzZXQgb24gbmV4dCBjb25uZWN0aW9uXG4gICAgICB9KTtcbiAgICAgIFxuICAgICAgLy8gSWYgdGhpcyBpcyB0aGUgZmlyc3QgYXV0aGVudGljYXRlZCB1c2VyIGFuZCBubyBhZG1pbiByb2xlIGV4aXN0cywgbWFrZSB0aGVtIGFkbWluXG4gICAgICBjb25zdCBhbGxVc2VycyA9IFsuLi5jdHguZGIudXNlci5pdGVyKCldO1xuICAgICAgY29uc3QgYXV0aGVudGljYXRlZFVzZXJzID0gYWxsVXNlcnMuZmlsdGVyKHUgPT4gdS5hdXRoTWV0aG9kKTtcbiAgICAgIGNvbnN0IGFsbFJvbGVzID0gWy4uLmN0eC5kYi5yb2xlLml0ZXIoKV07XG4gICAgICBjb25zdCBoYXNBZG1pblJvbGUgPSBhbGxSb2xlcy5zb21lKHIgPT4gKHIucGVybWlzc2lvbnMgJiBQZXJtaXNzaW9ucy5BRE1JTikgIT09IDBuKTtcbiAgICAgIFxuICAgICAgaWYgKGF1dGhlbnRpY2F0ZWRVc2Vycy5sZW5ndGggPT09IDEgJiYgIWhhc0FkbWluUm9sZSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGFkbWluUm9sZSA9IGN0eC5kYi5yb2xlLmluc2VydCh7XG4gICAgICAgICAgICBpZDogMG4sXG4gICAgICAgICAgICBjaGFubmVsSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIG5hbWU6ICdBZG1pbicsXG4gICAgICAgICAgICBjb2xvcjogJyNmMDQ3NDcnLFxuICAgICAgICAgICAgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25zLkFETUlOLFxuICAgICAgICAgICAgcG9zaXRpb246IDEwMDBuLFxuICAgICAgICAgICAgY3JlYXRlZEF0OiBjdHgudGltZXN0YW1wLFxuICAgICAgICAgICAgY3JlYXRlZEJ5OiBjdHguc2VuZGVyLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIFxuICAgICAgICAgIGN0eC5kYi5yb2xlTWVtYmVyLmluc2VydCh7XG4gICAgICAgICAgICBpZDogMG4sXG4gICAgICAgICAgICByb2xlSWQ6IGFkbWluUm9sZS5pZCxcbiAgICAgICAgICAgIHVzZXJJZDogY3R4LnNlbmRlcixcbiAgICAgICAgICAgIGFzc2lnbmVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgICAgICBhc3NpZ25lZEJ5OiB1bmRlZmluZWQsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc29sZS5pbmZvKGBGaXJzdCBhdXRoZW50aWNhdGVkIHVzZXIgJHtjdHguc2VuZGVyfSBhdXRvbWF0aWNhbGx5IGFzc2lnbmVkIGFkbWluIHJvbGVgKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgYWRtaW4gcm9sZTonLCBlcnIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFxuICAgIC8vIENyZWF0ZSBHb29nbGUgYXV0aCByZWNvcmRcbiAgICBjdHguZGIuZ29vZ2xlQXV0aC5pbnNlcnQoe1xuICAgICAgZ29vZ2xlSWQ6IGdvb2dsZUlkLnRyaW0oKSxcbiAgICAgIGlkZW50aXR5OiBjdHguc2VuZGVyLFxuICAgICAgZW1haWw6IGVtYWlsPy50b0xvd2VyQ2FzZSgpLnRyaW0oKSB8fCB1bmRlZmluZWQsXG4gICAgICBuYW1lOiBuYW1lPy50cmltKCkgfHwgdW5kZWZpbmVkLFxuICAgICAgYXZhdGFyOiBhdmF0YXIgfHwgdW5kZWZpbmVkLFxuICAgICAgY3JlYXRlZEF0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICAgIFxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IHNpZ25lZCB1cCB3aXRoIEdvb2dsZSBJRCAke2dvb2dsZUlkfWApO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgbG9naW5fZ29vZ2xlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAge1xuICAgIGdvb2dsZUlkOiB0LnN0cmluZygpLFxuICAgIGVtYWlsOiB0LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgbmFtZTogdC5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgIGF2YXRhcjogdC5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICB9LFxuICAoY3R4LCB7IGdvb2dsZUlkLCBlbWFpbCwgbmFtZSwgYXZhdGFyIH0pID0+IHtcbiAgICBpZiAoIWdvb2dsZUlkIHx8IGdvb2dsZUlkLnRyaW0oKS5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignR29vZ2xlIElEIGlzIHJlcXVpcmVkJyk7XG4gICAgfVxuXG4gICAgY29uc3QgdHJpbW1lZEdvb2dsZUlkID0gZ29vZ2xlSWQudHJpbSgpO1xuXG4gICAgLy8gRmluZCBHb29nbGUgYXV0aCByZWNvcmRcbiAgICBsZXQgZ29vZ2xlQXV0aCA9IGN0eC5kYi5nb29nbGVBdXRoLmdvb2dsZUlkLmZpbmQodHJpbW1lZEdvb2dsZUlkKTtcblxuICAgIC8vIElmIG5vIGFjY291bnQgZXhpc3RzLCBjcmVhdGUgb25lIChmaXJzdC10aW1lIEdvb2dsZSBsb2dpbiA9IGF1dG8tc2lnbnVwKVxuICAgIGlmICghZ29vZ2xlQXV0aCkge1xuICAgICAgLy8gQ2hlY2sgaWYgR29vZ2xlIElEIGFscmVhZHkgZXhpc3RzIChyYWNlIGNvbmRpdGlvbiBndWFyZClcbiAgICAgIGNvbnN0IGV4aXN0aW5nQXV0aCA9IGN0eC5kYi5nb29nbGVBdXRoLmdvb2dsZUlkLmZpbmQodHJpbW1lZEdvb2dsZUlkKTtcbiAgICAgIGlmIChleGlzdGluZ0F1dGgpIHtcbiAgICAgICAgZ29vZ2xlQXV0aCA9IGV4aXN0aW5nQXV0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIENyZWF0ZSB1c2VyIGFuZCBnb29nbGVBdXRoIChzYW1lIGxvZ2ljIGFzIHNpZ251cF9nb29nbGUpXG4gICAgICAgIGxldCB1c2VyID0gY3R4LmRiLnVzZXIuaWRlbnRpdHkuZmluZChjdHguc2VuZGVyKTtcbiAgICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgICAgdXNlciA9IGN0eC5kYi51c2VyLmluc2VydCh7XG4gICAgICAgICAgICBpZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgICAgIG5hbWU6IG5hbWU/LnRyaW0oKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgICAgICBhdmF0YXI6IGF2YXRhciB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICBhdXRoTWV0aG9kOiAnZ29vZ2xlJyxcbiAgICAgICAgICAgIGxhc3RJcEFkZHJlc3M6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIEZpcnN0IGF1dGhlbnRpY2F0ZWQgdXNlciBnZXRzIGFkbWluXG4gICAgICAgICAgY29uc3QgYWxsVXNlcnMgPSBbLi4uY3R4LmRiLnVzZXIuaXRlcigpXTtcbiAgICAgICAgICBjb25zdCBhdXRoZW50aWNhdGVkVXNlcnMgPSBhbGxVc2Vycy5maWx0ZXIodSA9PiB1LmF1dGhNZXRob2QpO1xuICAgICAgICAgIGNvbnN0IGFsbFJvbGVzID0gWy4uLmN0eC5kYi5yb2xlLml0ZXIoKV07XG4gICAgICAgICAgY29uc3QgaGFzQWRtaW5Sb2xlID0gYWxsUm9sZXMuc29tZShyID0+IChyLnBlcm1pc3Npb25zICYgUGVybWlzc2lvbnMuQURNSU4pICE9PSAwbik7XG5cbiAgICAgICAgICBpZiAoYXV0aGVudGljYXRlZFVzZXJzLmxlbmd0aCA9PT0gMSAmJiAhaGFzQWRtaW5Sb2xlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBjb25zdCBhZG1pblJvbGUgPSBjdHguZGIucm9sZS5pbnNlcnQoe1xuICAgICAgICAgICAgICAgIGlkOiAwbixcbiAgICAgICAgICAgICAgICBjaGFubmVsSWQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBuYW1lOiAnQWRtaW4nLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnI2YwNDc0NycsXG4gICAgICAgICAgICAgICAgcGVybWlzc2lvbnM6IFBlcm1pc3Npb25zLkFETUlOLFxuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAxMDAwbixcbiAgICAgICAgICAgICAgICBjcmVhdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgY3JlYXRlZEJ5OiBjdHguc2VuZGVyLFxuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICBjdHguZGIucm9sZU1lbWJlci5pbnNlcnQoe1xuICAgICAgICAgICAgICAgIGlkOiAwbixcbiAgICAgICAgICAgICAgICByb2xlSWQ6IGFkbWluUm9sZS5pZCxcbiAgICAgICAgICAgICAgICB1c2VySWQ6IGN0eC5zZW5kZXIsXG4gICAgICAgICAgICAgICAgYXNzaWduZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgICAgICAgICBhc3NpZ25lZEJ5OiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyhgRmlyc3QgYXV0aGVudGljYXRlZCB1c2VyICR7Y3R4LnNlbmRlcn0gYXV0b21hdGljYWxseSBhc3NpZ25lZCBhZG1pbiByb2xlYCk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgYWRtaW4gcm9sZTonLCBlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdHguZGIudXNlci5pZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICAgIG5hbWU6IG5hbWU/LnRyaW0oKSB8fCB1c2VyLm5hbWUsXG4gICAgICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgICAgICBhdmF0YXI6IGF2YXRhciB8fCB1c2VyLmF2YXRhcixcbiAgICAgICAgICAgIGF1dGhNZXRob2Q6ICdnb29nbGUnLFxuICAgICAgICAgICAgbGFzdElwQWRkcmVzczogdXNlci5sYXN0SXBBZGRyZXNzLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY3R4LmRiLmdvb2dsZUF1dGguaW5zZXJ0KHtcbiAgICAgICAgICBnb29nbGVJZDogdHJpbW1lZEdvb2dsZUlkLFxuICAgICAgICAgIGlkZW50aXR5OiBjdHguc2VuZGVyLFxuICAgICAgICAgIGVtYWlsOiBlbWFpbD8udG9Mb3dlckNhc2UoKS50cmltKCkgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgIG5hbWU6IG5hbWU/LnRyaW0oKSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgYXZhdGFyOiBhdmF0YXIgfHwgdW5kZWZpbmVkLFxuICAgICAgICAgIGNyZWF0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gc2lnbmVkIHVwIHdpdGggR29vZ2xlIElEICR7dHJpbW1lZEdvb2dsZUlkfSAoZmlyc3QgbG9naW4pYCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBFeGlzdGluZyBhY2NvdW50OiB3aGVuIHNlc3Npb24gKGN0eC5zZW5kZXIpIGRpZmZlcnMgZnJvbSBhY2NvdW50IChnb29nbGVBdXRoLmlkZW50aXR5KSxcbiAgICAvLyBkbyBOT1QgY3JlYXRlIHVzZXIgZm9yIHNlc3Npb24gLSBvbmx5IGFjY291bnQgaGFzIHVzZXIgcm93IChubyBkdXBsaWNhdGVzKVxuICAgIGNvbnN0IG9yaWdpbmFsVXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQoZ29vZ2xlQXV0aC5pZGVudGl0eSk7XG4gICAgY29uc3QgaXNMaW5rZWQgPSAhZ29vZ2xlQXV0aC5pZGVudGl0eS5pc0VxdWFsKGN0eC5zZW5kZXIpO1xuXG4gICAgaWYgKCFpc0xpbmtlZCkge1xuICAgICAgbGV0IHVzZXIgPSBjdHguZGIudXNlci5pZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICAgICAgaWYgKCF1c2VyKSB7XG4gICAgICAgIGN0eC5kYi51c2VyLmluc2VydCh7XG4gICAgICAgICAgaWRlbnRpdHk6IGN0eC5zZW5kZXIsXG4gICAgICAgICAgbmFtZTogb3JpZ2luYWxVc2VyPy5uYW1lID8/IGdvb2dsZUF1dGgubmFtZSA/PyBuYW1lPy50cmltKCkgPz8gdW5kZWZpbmVkLFxuICAgICAgICAgIG9ubGluZTogdHJ1ZSxcbiAgICAgICAgICBhdmF0YXI6IG9yaWdpbmFsVXNlcj8uYXZhdGFyID8/IGdvb2dsZUF1dGguYXZhdGFyID8/IGF2YXRhciA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgYXV0aE1ldGhvZDogJ2dvb2dsZScsXG4gICAgICAgICAgbGFzdElwQWRkcmVzczogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7XG4gICAgICAgICAgLi4udXNlcixcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUgPz8gb3JpZ2luYWxVc2VyPy5uYW1lID8/IGdvb2dsZUF1dGgubmFtZSA/PyBuYW1lPy50cmltKCksXG4gICAgICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgICAgIGF2YXRhcjogdXNlci5hdmF0YXIgPz8gb3JpZ2luYWxVc2VyPy5hdmF0YXIgPz8gZ29vZ2xlQXV0aC5hdmF0YXIgPz8gYXZhdGFyLFxuICAgICAgICAgIGF1dGhNZXRob2Q6ICdnb29nbGUnLFxuICAgICAgICAgIGxhc3RJcEFkZHJlc3M6IHVzZXIubGFzdElwQWRkcmVzcyxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIExpbmtlZCBzZXNzaW9uOiBlbnN1cmUgYWNjb3VudCBoYXMgdXNlciwgdXBkYXRlIGl0LiBEbyBOT1QgY3JlYXRlIHVzZXIgZm9yIGN0eC5zZW5kZXIuXG4gICAgICBpZiAoIW9yaWdpbmFsVXNlcikge1xuICAgICAgICBjdHguZGIudXNlci5pbnNlcnQoe1xuICAgICAgICAgIGlkZW50aXR5OiBnb29nbGVBdXRoLmlkZW50aXR5LFxuICAgICAgICAgIG5hbWU6IGdvb2dsZUF1dGgubmFtZSA/PyBuYW1lPy50cmltKCkgPz8gdW5kZWZpbmVkLFxuICAgICAgICAgIG9ubGluZTogdHJ1ZSxcbiAgICAgICAgICBhdmF0YXI6IGdvb2dsZUF1dGguYXZhdGFyID8/IGF2YXRhciA/PyB1bmRlZmluZWQsXG4gICAgICAgICAgYXV0aE1ldGhvZDogJ2dvb2dsZScsXG4gICAgICAgICAgbGFzdElwQWRkcmVzczogdW5kZWZpbmVkLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7XG4gICAgICAgICAgLi4ub3JpZ2luYWxVc2VyLFxuICAgICAgICAgIG9ubGluZTogdHJ1ZSxcbiAgICAgICAgICBuYW1lOiBvcmlnaW5hbFVzZXIubmFtZSA/PyBnb29nbGVBdXRoLm5hbWUgPz8gbmFtZT8udHJpbSgpLFxuICAgICAgICAgIGF2YXRhcjogb3JpZ2luYWxVc2VyLmF2YXRhciA/PyBnb29nbGVBdXRoLmF2YXRhciA/PyBhdmF0YXIsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvcHkgcm9sZSBtZW1iZXJzaGlwcyBmcm9tIGFjY291bnQgdG8gc2Vzc2lvblxuICAgIGNvbnN0IG9yaWdpbmFsUm9sZU1lbWJlcnMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIoXG4gICAgICBybSA9PiBybS51c2VySWQuaXNFcXVhbChnb29nbGVBdXRoLmlkZW50aXR5KVxuICAgICk7XG4gICAgZm9yIChjb25zdCBybSBvZiBvcmlnaW5hbFJvbGVNZW1iZXJzKSB7XG4gICAgICBjb25zdCBhbHJlYWR5QXNzaWduZWQgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5zb21lKFxuICAgICAgICBtID0+IG0ucm9sZUlkID09PSBybS5yb2xlSWQgJiYgbS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKVxuICAgICAgKTtcbiAgICAgIGlmICghYWxyZWFkeUFzc2lnbmVkKSB7XG4gICAgICAgIGN0eC5kYi5yb2xlTWVtYmVyLmluc2VydCh7XG4gICAgICAgICAgaWQ6IDBuLFxuICAgICAgICAgIHJvbGVJZDogcm0ucm9sZUlkLFxuICAgICAgICAgIHVzZXJJZDogY3R4LnNlbmRlcixcbiAgICAgICAgICBhc3NpZ25lZEF0OiBjdHgudGltZXN0YW1wLFxuICAgICAgICAgIGFzc2lnbmVkQnk6IHJtLmFzc2lnbmVkQnksXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIENvcHkgY2hhbm5lbCBtZW1iZXJzaGlwcyBmcm9tIGFjY291bnQgdG8gc2Vzc2lvblxuICAgIGNvbnN0IG9yaWdpbmFsQ2hhbm5lbE1lbWJlcnMgPSBbLi4uY3R4LmRiLmNoYW5uZWxNZW1iZXIuaXRlcigpXS5maWx0ZXIoXG4gICAgICBtID0+IG0udXNlcklkLmlzRXF1YWwoZ29vZ2xlQXV0aC5pZGVudGl0eSlcbiAgICApO1xuICAgIGZvciAoY29uc3QgbSBvZiBvcmlnaW5hbENoYW5uZWxNZW1iZXJzKSB7XG4gICAgICBjb25zdCBhbHJlYWR5TWVtYmVyID0gWy4uLmN0eC5kYi5jaGFubmVsTWVtYmVyLml0ZXIoKV0uc29tZShcbiAgICAgICAgY20gPT4gY20uY2hhbm5lbElkID09PSBtLmNoYW5uZWxJZCAmJiBjbS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKVxuICAgICAgKTtcbiAgICAgIGlmICghYWxyZWFkeU1lbWJlcikge1xuICAgICAgICBjdHguZGIuY2hhbm5lbE1lbWJlci5pbnNlcnQoe1xuICAgICAgICAgIGlkOiAwbixcbiAgICAgICAgICBjaGFubmVsSWQ6IG0uY2hhbm5lbElkLFxuICAgICAgICAgIHVzZXJJZDogY3R4LnNlbmRlcixcbiAgICAgICAgICBqb2luZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gTGluayBzZXNzaW9uIHRvIGFjY291bnQgaWRlbnRpdHkgd2hlbiB0aGV5IGRpZmZlclxuICAgIGlmICghZ29vZ2xlQXV0aC5pZGVudGl0eS5pc0VxdWFsKGN0eC5zZW5kZXIpKSB7XG4gICAgICBjb25zdCBleGlzdGluZ0xpbmsgPSBjdHguZGIuaWRlbnRpdHlMaW5rLnNlc3Npb25JZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICAgICAgaWYgKGV4aXN0aW5nTGluaykge1xuICAgICAgICBjdHguZGIuaWRlbnRpdHlMaW5rLnNlc3Npb25JZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAgIC4uLmV4aXN0aW5nTGluayxcbiAgICAgICAgICBhY2NvdW50SWRlbnRpdHk6IGdvb2dsZUF1dGguaWRlbnRpdHksXG4gICAgICAgICAgbGlua2VkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY3R4LmRiLmlkZW50aXR5TGluay5pbnNlcnQoe1xuICAgICAgICAgIHNlc3Npb25JZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgICBhY2NvdW50SWRlbnRpdHk6IGdvb2dsZUF1dGguaWRlbnRpdHksXG4gICAgICAgICAgbGlua2VkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhpc3RpbmdSZXBsYWNlZCA9IGN0eC5kYi5yZXBsYWNlZElkZW50aXR5Lm9sZElkZW50aXR5LmZpbmQoY3R4LnNlbmRlcik7XG4gICAgICBpZiAoZXhpc3RpbmdSZXBsYWNlZCkge1xuICAgICAgICBjdHguZGIucmVwbGFjZWRJZGVudGl0eS5vbGRJZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAgIC4uLmV4aXN0aW5nUmVwbGFjZWQsXG4gICAgICAgICAgbmV3SWRlbnRpdHk6IGdvb2dsZUF1dGguaWRlbnRpdHksXG4gICAgICAgICAgcmVwbGFjZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHguZGIucmVwbGFjZWRJZGVudGl0eS5pbnNlcnQoe1xuICAgICAgICAgIG9sZElkZW50aXR5OiBjdHguc2VuZGVyLFxuICAgICAgICAgIG5ld0lkZW50aXR5OiBnb29nbGVBdXRoLmlkZW50aXR5LFxuICAgICAgICAgIHJlcGxhY2VkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgLy8gY2xpZW50Q29ubmVjdGVkIG1heSBoYXZlIGFscmVhZHkgYWRkZWQgdGhpcyBzZXNzaW9uOyB1cHNlcnQgdG8gYXZvaWQgZHVwbGljYXRlLWtleSBwYW5pY1xuICAgICAgY29uc3QgZXhpc3RpbmdTZXNzaW9uID0gY3R4LmRiLmFjdGl2ZVNlc3Npb24uc2Vzc2lvbklkZW50aXR5LmZpbmQoY3R4LnNlbmRlcik7XG4gICAgICBpZiAoZXhpc3RpbmdTZXNzaW9uKSB7XG4gICAgICAgIGN0eC5kYi5hY3RpdmVTZXNzaW9uLnNlc3Npb25JZGVudGl0eS51cGRhdGUoe1xuICAgICAgICAgIC4uLmV4aXN0aW5nU2Vzc2lvbixcbiAgICAgICAgICBjb25uZWN0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdHguZGIuYWN0aXZlU2Vzc2lvbi5pbnNlcnQoe1xuICAgICAgICAgIHNlc3Npb25JZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgICBjb25uZWN0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gU2V0IGFjY291bnQgaWRlbnRpdHkgb25saW5lIChmb3IgaXNMaW5rZWQgY2FzZSwgYWxyZWFkeSB1cGRhdGVkIGFib3ZlKVxuICAgIGNvbnN0IGFjY291bnRVc2VyID0gY3R4LmRiLnVzZXIuaWRlbnRpdHkuZmluZChnb29nbGVBdXRoLmlkZW50aXR5KTtcbiAgICBpZiAoYWNjb3VudFVzZXIpIHtcbiAgICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7IC4uLmFjY291bnRVc2VyLCBvbmxpbmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gbG9nZ2VkIGluIHdpdGggR29vZ2xlIElEICR7dHJpbW1lZEdvb2dsZUlkfWApO1xuICB9XG4pO1xuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIFZPSUNFIFJPT00gUkVEVUNFUlNcbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuXG5leHBvcnQgY29uc3Qgam9pbl92b2ljZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgY2hhbm5lbElkOiB0LnU2NCgpIH0sXG4gIChjdHgsIHsgY2hhbm5lbElkIH0pID0+IHtcbiAgICBjb25zdCBjaGFubmVsID0gY3R4LmRiLmNoYW5uZWwuaWQuZmluZChjaGFubmVsSWQpO1xuICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdDaGFubmVsIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBpZiB1c2VyIGlzIGEgY2hhbm5lbCBtZW1iZXJcbiAgICBjb25zdCBjaGFubmVsTWVtYmVycyA9IFsuLi5jdHguZGIuY2hhbm5lbE1lbWJlci5pdGVyKCldLmZpbHRlcihtID0+IG0uY2hhbm5lbElkID09PSBjaGFubmVsSWQpO1xuICAgIGNvbnN0IG1lbWJlciA9IGNoYW5uZWxNZW1iZXJzLmZpbmQobSA9PiBtLnVzZXJJZC5pc0VxdWFsKGN0eC5zZW5kZXIpKTtcbiAgICBpZiAoIW1lbWJlcikge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdZb3UgbXVzdCBiZSBhIG1lbWJlciBvZiB0aGUgY2hhbm5lbCB0byBqb2luIHZvaWNlJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIEZpbmQgb3IgY3JlYXRlIHZvaWNlIHJvb20gZm9yIHRoaXMgY2hhbm5lbFxuICAgIGNvbnN0IGV4aXN0aW5nUm9vbXMgPSBbLi4uY3R4LmRiLnZvaWNlUm9vbS5pdGVyKCldLmZpbHRlcihyID0+IHIuY2hhbm5lbElkID09PSBjaGFubmVsSWQpO1xuICAgIGxldCByb29tID0gZXhpc3RpbmdSb29tc1swXTtcbiAgICBcbiAgICBpZiAoIXJvb20pIHtcbiAgICAgIHJvb20gPSBjdHguZGIudm9pY2VSb29tLmluc2VydCh7XG4gICAgICAgIGlkOiAwbixcbiAgICAgICAgY2hhbm5lbElkLFxuICAgICAgICBjcmVhdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgLy8gQ2hlY2sgaWYgdXNlciBpcyBhbHJlYWR5IGluIHRoZSB2b2ljZSByb29tXG4gICAgY29uc3QgcGFydGljaXBhbnRzID0gWy4uLmN0eC5kYi52b2ljZVBhcnRpY2lwYW50Lml0ZXIoKV0uZmlsdGVyKHAgPT4gcC5yb29tSWQgPT09IHJvb20uaWQpO1xuICAgIGNvbnN0IGV4aXN0aW5nUGFydGljaXBhbnQgPSBwYXJ0aWNpcGFudHMuZmluZChwID0+IHAudXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikpO1xuICAgIFxuICAgIGlmIChleGlzdGluZ1BhcnRpY2lwYW50KSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBhcmUgYWxyZWFkeSBpbiB0aGUgdm9pY2Ugcm9vbScpO1xuICAgIH1cbiAgICBcbiAgICAvLyBBZGQgdXNlciB0byB2b2ljZSByb29tXG4gICAgY3R4LmRiLnZvaWNlUGFydGljaXBhbnQuaW5zZXJ0KHtcbiAgICAgIGlkOiAwbixcbiAgICAgIHJvb21JZDogcm9vbS5pZCxcbiAgICAgIHVzZXJJZDogY3R4LnNlbmRlcixcbiAgICAgIG11dGVkOiBmYWxzZSxcbiAgICAgIGRlYWZlbmVkOiBmYWxzZSxcbiAgICAgIGpvaW5lZEF0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICAgIFxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IGpvaW5lZCB2b2ljZSByb29tIGZvciBjaGFubmVsICR7Y2hhbm5lbElkfWApO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgbGVhdmVfdm9pY2UgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IGNoYW5uZWxJZDogdC51NjQoKSB9LFxuICAoY3R4LCB7IGNoYW5uZWxJZCB9KSA9PiB7XG4gICAgY29uc3Qgcm9vbXMgPSBbLi4uY3R4LmRiLnZvaWNlUm9vbS5pdGVyKCldLmZpbHRlcihyID0+IHIuY2hhbm5lbElkID09PSBjaGFubmVsSWQpO1xuICAgIGlmIChyb29tcy5sZW5ndGggPT09IDApIHtcbiAgICAgIC8vIFJvb20gbWF5IGhhdmUgYmVlbiBkZWxldGVkIGJ5IG9uRGlzY29ubmVjdCB3aGVuIGNsaWVudCBkaXNjb25uZWN0ZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgY29uc3Qgcm9vbSA9IHJvb21zWzBdO1xuICAgIGNvbnN0IHBhcnRpY2lwYW50cyA9IFsuLi5jdHguZGIudm9pY2VQYXJ0aWNpcGFudC5pdGVyKCldLmZpbHRlcihwID0+IHAucm9vbUlkID09PSByb29tLmlkKTtcbiAgICBjb25zdCBwYXJ0aWNpcGFudCA9IHBhcnRpY2lwYW50cy5maW5kKHAgPT4gcC51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgXG4gICAgaWYgKCFwYXJ0aWNpcGFudCkge1xuICAgICAgLy8gQWxyZWFkeSBsZWZ0IChlLmcuIHJlbW92ZWQgYnkgb25EaXNjb25uZWN0KSAtIG5vLW9wXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi52b2ljZVBhcnRpY2lwYW50LmRlbGV0ZShwYXJ0aWNpcGFudCk7XG4gICAgXG4gICAgLy8gQ2xlYW4gdXAgc2lnbmFsaW5nIG1lc3NhZ2VzIGZvciB0aGlzIHVzZXJcbiAgICBjb25zdCBzaWduYWxzID0gWy4uLmN0eC5kYi52b2ljZVNpZ25hbGluZy5pdGVyKCldLmZpbHRlcihcbiAgICAgIHMgPT4gcy5yb29tSWQgPT09IHJvb20uaWQgJiYgXG4gICAgICAocy5mcm9tVXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikgfHwgcy50b1VzZXJJZC5pc0VxdWFsKGN0eC5zZW5kZXIpKVxuICAgICk7XG4gICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiBjdHguZGIudm9pY2VTaWduYWxpbmcuZGVsZXRlKHNpZ25hbCkpO1xuICAgIFxuICAgIC8vIElmIHJvb20gaXMgZW1wdHksIGRlbGV0ZSBpdFxuICAgIGNvbnN0IHJlbWFpbmluZ1BhcnRpY2lwYW50cyA9IFsuLi5jdHguZGIudm9pY2VQYXJ0aWNpcGFudC5pdGVyKCldLmZpbHRlcihwID0+IHAucm9vbUlkID09PSByb29tLmlkKTtcbiAgICBpZiAocmVtYWluaW5nUGFydGljaXBhbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY3R4LmRiLnZvaWNlUm9vbS5kZWxldGUocm9vbSk7XG4gICAgfVxuICAgIFxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9IGxlZnQgdm9pY2Ugcm9vbSBmb3IgY2hhbm5lbCAke2NoYW5uZWxJZH1gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHRvZ2dsZV92b2ljZV9tdXRlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBjaGFubmVsSWQ6IHQudTY0KCkgfSxcbiAgKGN0eCwgeyBjaGFubmVsSWQgfSkgPT4ge1xuICAgIGNvbnN0IHJvb21zID0gWy4uLmN0eC5kYi52b2ljZVJvb20uaXRlcigpXS5maWx0ZXIociA9PiByLmNoYW5uZWxJZCA9PT0gY2hhbm5lbElkKTtcbiAgICBpZiAocm9vbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1ZvaWNlIHJvb20gbm90IGZvdW5kJyk7XG4gICAgfVxuICAgIFxuICAgIGNvbnN0IHJvb20gPSByb29tc1swXTtcbiAgICBjb25zdCBwYXJ0aWNpcGFudHMgPSBbLi4uY3R4LmRiLnZvaWNlUGFydGljaXBhbnQuaXRlcigpXS5maWx0ZXIocCA9PiBwLnJvb21JZCA9PT0gcm9vbS5pZCk7XG4gICAgY29uc3QgcGFydGljaXBhbnQgPSBwYXJ0aWNpcGFudHMuZmluZChwID0+IHAudXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikpO1xuICAgIFxuICAgIGlmICghcGFydGljaXBhbnQpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IGFyZSBub3QgaW4gdGhlIHZvaWNlIHJvb20nKTtcbiAgICB9XG4gICAgXG4gICAgY3R4LmRiLnZvaWNlUGFydGljaXBhbnQuaWQudXBkYXRlKHtcbiAgICAgIC4uLnBhcnRpY2lwYW50LFxuICAgICAgbXV0ZWQ6ICFwYXJ0aWNpcGFudC5tdXRlZCxcbiAgICB9KTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSAke3BhcnRpY2lwYW50Lm11dGVkID8gJ3VubXV0ZWQnIDogJ211dGVkJ30gaW4gdm9pY2Ugcm9vbWApO1xuICB9XG4pO1xuXG5leHBvcnQgY29uc3QgdG9nZ2xlX3ZvaWNlX2RlYWZlbiA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgY2hhbm5lbElkOiB0LnU2NCgpIH0sXG4gIChjdHgsIHsgY2hhbm5lbElkIH0pID0+IHtcbiAgICBjb25zdCByb29tcyA9IFsuLi5jdHguZGIudm9pY2VSb29tLml0ZXIoKV0uZmlsdGVyKHIgPT4gci5jaGFubmVsSWQgPT09IGNoYW5uZWxJZCk7XG4gICAgaWYgKHJvb21zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdWb2ljZSByb29tIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICBjb25zdCByb29tID0gcm9vbXNbMF07XG4gICAgY29uc3QgcGFydGljaXBhbnRzID0gWy4uLmN0eC5kYi52b2ljZVBhcnRpY2lwYW50Lml0ZXIoKV0uZmlsdGVyKHAgPT4gcC5yb29tSWQgPT09IHJvb20uaWQpO1xuICAgIGNvbnN0IHBhcnRpY2lwYW50ID0gcGFydGljaXBhbnRzLmZpbmQocCA9PiBwLnVzZXJJZC5pc0VxdWFsKGN0eC5zZW5kZXIpKTtcbiAgICBcbiAgICBpZiAoIXBhcnRpY2lwYW50KSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBhcmUgbm90IGluIHRoZSB2b2ljZSByb29tJyk7XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi52b2ljZVBhcnRpY2lwYW50LmlkLnVwZGF0ZSh7XG4gICAgICAuLi5wYXJ0aWNpcGFudCxcbiAgICAgIGRlYWZlbmVkOiAhcGFydGljaXBhbnQuZGVhZmVuZWQsXG4gICAgICBtdXRlZDogIXBhcnRpY2lwYW50LmRlYWZlbmVkID8gdHJ1ZSA6IHBhcnRpY2lwYW50Lm11dGVkLCAvLyBBdXRvLW11dGUgd2hlbiBkZWFmZW5lZFxuICAgIH0pO1xuICAgIFxuICAgIGNvbnNvbGUuaW5mbyhgVXNlciAke2N0eC5zZW5kZXJ9ICR7cGFydGljaXBhbnQuZGVhZmVuZWQgPyAndW5kZWFmZW5lZCcgOiAnZGVhZmVuZWQnfSBpbiB2b2ljZSByb29tYCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBzZW5kX3ZvaWNlX3NpZ25hbCA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgXG4gICAgY2hhbm5lbElkOiB0LnU2NCgpLFxuICAgIHRvVXNlcklkOiB0LmlkZW50aXR5KCksXG4gICAgc2lnbmFsVHlwZTogdC5zdHJpbmcoKSxcbiAgICBzaWduYWxEYXRhOiB0LnN0cmluZygpXG4gIH0sXG4gIChjdHgsIHsgY2hhbm5lbElkLCB0b1VzZXJJZCwgc2lnbmFsVHlwZSwgc2lnbmFsRGF0YSB9KSA9PiB7XG4gICAgY29uc3Qgcm9vbXMgPSBbLi4uY3R4LmRiLnZvaWNlUm9vbS5pdGVyKCldLmZpbHRlcihyID0+IHIuY2hhbm5lbElkID09PSBjaGFubmVsSWQpO1xuICAgIGlmIChyb29tcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignVm9pY2Ugcm9vbSBub3QgZm91bmQnKTtcbiAgICB9XG4gICAgXG4gICAgY29uc3Qgcm9vbSA9IHJvb21zWzBdO1xuICAgIGNvbnN0IHBhcnRpY2lwYW50cyA9IFsuLi5jdHguZGIudm9pY2VQYXJ0aWNpcGFudC5pdGVyKCldLmZpbHRlcihwID0+IHAucm9vbUlkID09PSByb29tLmlkKTtcbiAgICBjb25zdCBzZW5kZXJQYXJ0aWNpcGFudCA9IHBhcnRpY2lwYW50cy5maW5kKHAgPT4gcC51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgY29uc3QgcmVjZWl2ZXJQYXJ0aWNpcGFudCA9IHBhcnRpY2lwYW50cy5maW5kKHAgPT4gcC51c2VySWQuaXNFcXVhbCh0b1VzZXJJZCkpO1xuICAgIFxuICAgIGlmICghc2VuZGVyUGFydGljaXBhbnQpIHtcbiAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IGFyZSBub3QgaW4gdGhlIHZvaWNlIHJvb20nKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFyZWNlaXZlclBhcnRpY2lwYW50KSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1RhcmdldCB1c2VyIGlzIG5vdCBpbiB0aGUgdm9pY2Ugcm9vbScpO1xuICAgIH1cbiAgICBcbiAgICBpZiAoIVsnb2ZmZXInLCAnYW5zd2VyJywgJ2ljZS1jYW5kaWRhdGUnXS5pbmNsdWRlcyhzaWduYWxUeXBlKSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdJbnZhbGlkIHNpZ25hbCB0eXBlJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFN0b3JlIHNpZ25hbGluZyBtZXNzYWdlXG4gICAgY3R4LmRiLnZvaWNlU2lnbmFsaW5nLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICByb29tSWQ6IHJvb20uaWQsXG4gICAgICBmcm9tVXNlcklkOiBjdHguc2VuZGVyLFxuICAgICAgdG9Vc2VySWQsXG4gICAgICBzaWduYWxUeXBlLFxuICAgICAgc2lnbmFsRGF0YSxcbiAgICAgIGNyZWF0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICB9KTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBzZW50ICR7c2lnbmFsVHlwZX0gc2lnbmFsIHRvICR7dG9Vc2VySWR9IGluIHZvaWNlIHJvb21gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHNhdmVfdm9pY2VfY2h1bmsgPSBzcGFjZXRpbWVkYi5yZWR1Y2VyKFxuICB7IHJvb21JZDogdC51NjQoKSwgY2hhbm5lbElkOiB0LnU2NCgpLCBjaHVua0luZGV4OiB0LnU2NCgpLCBkYXRhQmFzZTY0OiB0LnN0cmluZygpIH0sXG4gIChjdHgsIHsgcm9vbUlkLCBjaGFubmVsSWQsIGNodW5rSW5kZXgsIGRhdGFCYXNlNjQgfSkgPT4ge1xuICAgIGlmICghZGF0YUJhc2U2NCB8fCBkYXRhQmFzZTY0Lmxlbmd0aCA+IDUwMDAwKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ0ludmFsaWQgY2h1bmsgZGF0YSAobWF4IDUwS0IgYmFzZTY0KScpO1xuICAgIH1cbiAgICBjb25zdCByb29tcyA9IFsuLi5jdHguZGIudm9pY2VSb29tLml0ZXIoKV0uZmlsdGVyKHIgPT4gci5pZCA9PT0gcm9vbUlkKTtcbiAgICBpZiAocm9vbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1ZvaWNlIHJvb20gbm90IGZvdW5kJyk7XG4gICAgfVxuICAgIGNvbnN0IHBhcnRpY2lwYW50cyA9IFsuLi5jdHguZGIudm9pY2VQYXJ0aWNpcGFudC5pdGVyKCldLmZpbHRlcihwID0+IHAucm9vbUlkID09PSByb29tSWQpO1xuICAgIGNvbnN0IHNlbmRlclBhcnRpY2lwYW50ID0gcGFydGljaXBhbnRzLmZpbmQocCA9PiBwLnVzZXJJZC5pc0VxdWFsKGN0eC5zZW5kZXIpKTtcbiAgICBpZiAoIXNlbmRlclBhcnRpY2lwYW50KSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBhcmUgbm90IGluIHRoZSB2b2ljZSByb29tJyk7XG4gICAgfVxuICAgIGN0eC5kYi52b2ljZVJlY29yZGluZ0NodW5rLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICByb29tSWQsXG4gICAgICBjaGFubmVsSWQsXG4gICAgICBjaHVua0luZGV4LFxuICAgICAgZGF0YUJhc2U2NCxcbiAgICAgIHJlY29yZGVkQnk6IGN0eC5zZW5kZXIsXG4gICAgICBjcmVhdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH1cbik7XG5cbi8vIOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgOKUgFxuLy8gUk9MRSBNQU5BR0VNRU5UIFJFRFVDRVJTXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcblxuZXhwb3J0IGNvbnN0IGNyZWF0ZV9yb2xlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyBcbiAgICBjaGFubmVsSWQ6IHQudTY0KCkub3B0aW9uYWwoKSxcbiAgICBuYW1lOiB0LnN0cmluZygpLFxuICAgIGNvbG9yOiB0LnN0cmluZygpLm9wdGlvbmFsKCksXG4gICAgcGVybWlzc2lvbnM6IHQudTY0KCksXG4gICAgcG9zaXRpb246IHQudTY0KCkub3B0aW9uYWwoKVxuICB9LFxuICAoY3R4LCB7IGNoYW5uZWxJZCwgbmFtZSwgY29sb3IsIHBlcm1pc3Npb25zLCBwb3NpdGlvbiB9KSA9PiB7XG4gICAgaWYgKCFuYW1lIHx8IG5hbWUudHJpbSgpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdSb2xlIG5hbWUgY2Fubm90IGJlIGVtcHR5Jyk7XG4gICAgfVxuICAgIGlmIChuYW1lLmxlbmd0aCA+IDMyKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1JvbGUgbmFtZSBtdXN0IGJlIDMyIGNoYXJhY3RlcnMgb3IgbGVzcycpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBwZXJtaXNzaW9uc1xuICAgIGlmIChjaGFubmVsSWQpIHtcbiAgICAgIGNvbnN0IHVzZXJQZXJtcyA9IGdldFVzZXJDaGFubmVsUGVybWlzc2lvbnMoY3R4LCBjdHguc2VuZGVyLCBjaGFubmVsSWQpO1xuICAgICAgaWYgKCFjaGVja1Blcm1pc3Npb24odXNlclBlcm1zLCBQZXJtaXNzaW9ucy5NQU5BR0VfUk9MRVMpKSB7XG4gICAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignWW91IGRvIG5vdCBoYXZlIHBlcm1pc3Npb24gdG8gbWFuYWdlIHJvbGVzJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFZlcmlmeSBjaGFubmVsIGV4aXN0c1xuICAgICAgY29uc3QgY2hhbm5lbCA9IGN0eC5kYi5jaGFubmVsLmlkLmZpbmQoY2hhbm5lbElkKTtcbiAgICAgIGlmICghY2hhbm5lbCkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ0NoYW5uZWwgbm90IGZvdW5kJyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEdsb2JhbCByb2xlIC0gY2hlY2sgaWYgYW55IGFkbWluIGV4aXN0c1xuICAgICAgY29uc3QgYWxsUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGUuaXRlcigpXTtcbiAgICAgIGNvbnN0IGhhc0FueUFkbWluUm9sZSA9IGFsbFJvbGVzLnNvbWUociA9PiAoci5wZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG4pO1xuICAgICAgXG4gICAgICBpZiAoaGFzQW55QWRtaW5Sb2xlKSB7XG4gICAgICAgIC8vIElmIGFkbWluIHJvbGUgZXhpc3RzLCBjaGVjayBpZiB1c2VyIGlzIGFkbWluXG4gICAgICAgIGNvbnN0IHVzZXJSb2xlcyA9IFsuLi5jdHguZGIucm9sZU1lbWJlci5pdGVyKCldLmZpbHRlcihybSA9PiBybS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgICAgIGNvbnN0IGhhc0FkbWluUm9sZSA9IHVzZXJSb2xlcy5zb21lKHJtID0+IHtcbiAgICAgICAgICBjb25zdCByb2xlID0gY3R4LmRiLnJvbGUuaWQuZmluZChybS5yb2xlSWQpO1xuICAgICAgICAgIHJldHVybiByb2xlICYmIChyb2xlLnBlcm1pc3Npb25zICYgUGVybWlzc2lvbnMuQURNSU4pICE9PSAwbjtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWhhc0FkbWluUm9sZSkge1xuICAgICAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignT25seSBhZG1pbnMgY2FuIGNyZWF0ZSBnbG9iYWwgcm9sZXMnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSWYgbm8gYWRtaW4gcm9sZSBleGlzdHMsIGFsbG93IGNyZWF0aW9uIChmaXJzdCB1c2VyIHNjZW5hcmlvKVxuICAgIH1cbiAgICBcbiAgICAvLyBQcmV2ZW50IGNyZWF0aW5nIHJvbGVzIHdpdGggYWxsIHBlcm1pc3Npb25zIHdpdGhvdXQgQURNSU4gZmxhZ1xuICAgIGNvbnN0IGFsbE5vbkFkbWluUGVybXMgPSBPYmplY3QudmFsdWVzKFBlcm1pc3Npb25zKVxuICAgICAgLmZpbHRlcihwID0+IHAgIT09IFBlcm1pc3Npb25zLkFETUlOKVxuICAgICAgLnJlZHVjZSgoYWNjLCBwKSA9PiBhY2MgfCBwLCAwbik7XG4gICAgXG4gICAgY29uc3QgaGFzQWxsTm9uQWRtaW5QZXJtcyA9IChwZXJtaXNzaW9ucyAmIGFsbE5vbkFkbWluUGVybXMpID09PSBhbGxOb25BZG1pblBlcm1zO1xuICAgIGNvbnN0IGhhc0FkbWluUGVybSA9IChwZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG47XG4gICAgXG4gICAgaWYgKGhhc0FsbE5vbkFkbWluUGVybXMgJiYgIWhhc0FkbWluUGVybSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdUw7xtIGl6aW5sZXJpIHZlcm1layBpw6dpbiBBZG1pbiBpem5pIGdlcmVrbGlkaXInKTtcbiAgICB9XG4gICAgXG4gICAgLy8gR2V0IG1heCBwb3NpdGlvbiBmb3IgdGhpcyBjaGFubmVsL2dsb2JhbFxuICAgIGNvbnN0IGV4aXN0aW5nUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGUuaXRlcigpXS5maWx0ZXIoXG4gICAgICByID0+IGNoYW5uZWxJZCA/IHIuY2hhbm5lbElkID09PSBjaGFubmVsSWQgOiAhci5jaGFubmVsSWRcbiAgICApO1xuICAgIGNvbnN0IG1heFBvc2l0aW9uID0gZXhpc3RpbmdSb2xlcy5sZW5ndGggPiAwXG4gICAgICA/IGV4aXN0aW5nUm9sZXMucmVkdWNlKChtYXgsIHIpID0+IHIucG9zaXRpb24gPiBtYXggPyByLnBvc2l0aW9uIDogbWF4LCAwbilcbiAgICAgIDogMG47XG4gICAgXG4gICAgY29uc3Qgcm9sZSA9IGN0eC5kYi5yb2xlLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICBjaGFubmVsSWQ6IGNoYW5uZWxJZCA/PyB1bmRlZmluZWQsXG4gICAgICBuYW1lOiBuYW1lLnRyaW0oKSxcbiAgICAgIGNvbG9yOiBjb2xvcj8udHJpbSgpIHx8IHVuZGVmaW5lZCxcbiAgICAgIHBlcm1pc3Npb25zLFxuICAgICAgcG9zaXRpb246IHBvc2l0aW9uID8/IChtYXhQb3NpdGlvbiArIDFuKSxcbiAgICAgIGNyZWF0ZWRBdDogY3R4LnRpbWVzdGFtcCxcbiAgICAgIGNyZWF0ZWRCeTogY3R4LnNlbmRlcixcbiAgICB9KTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBjcmVhdGVkIHJvbGUgJHtuYW1lfSBmb3IgJHtjaGFubmVsSWQgPyBgY2hhbm5lbCAke2NoYW5uZWxJZH1gIDogJ2dsb2JhbCd9YCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBhc3NpZ25fcm9sZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgcm9sZUlkOiB0LnU2NCgpLCB1c2VySWQ6IHQuaWRlbnRpdHkoKSB9LFxuICAoY3R4LCB7IHJvbGVJZCwgdXNlcklkIH0pID0+IHtcbiAgICBjb25zdCByb2xlID0gY3R4LmRiLnJvbGUuaWQuZmluZChyb2xlSWQpO1xuICAgIGlmICghcm9sZSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdSb2xlIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBwZXJtaXNzaW9uc1xuICAgIGlmIChyb2xlLmNoYW5uZWxJZCkge1xuICAgICAgY29uc3QgdXNlclBlcm1zID0gZ2V0VXNlckNoYW5uZWxQZXJtaXNzaW9ucyhjdHgsIGN0eC5zZW5kZXIsIHJvbGUuY2hhbm5lbElkKTtcbiAgICAgIGlmICghY2hlY2tQZXJtaXNzaW9uKHVzZXJQZXJtcywgUGVybWlzc2lvbnMuQVNTSUdOX1JPTEVTKSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGFzc2lnbiByb2xlcycpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBHbG9iYWwgcm9sZSAtIGNoZWNrIGlmIGFueSBhZG1pbiBleGlzdHNcbiAgICAgIGNvbnN0IGFsbFJvbGVzID0gWy4uLmN0eC5kYi5yb2xlLml0ZXIoKV07XG4gICAgICBjb25zdCBoYXNBbnlBZG1pblJvbGUgPSBhbGxSb2xlcy5zb21lKHIgPT4gKHIucGVybWlzc2lvbnMgJiBQZXJtaXNzaW9ucy5BRE1JTikgIT09IDBuKTtcbiAgICAgIFxuICAgICAgaWYgKGhhc0FueUFkbWluUm9sZSkge1xuICAgICAgICAvLyBJZiBhZG1pbiByb2xlIGV4aXN0cywgY2hlY2sgaWYgdXNlciBpcyBhZG1pblxuICAgICAgICBjb25zdCB1c2VyUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIocm0gPT4gcm0udXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikpO1xuICAgICAgICBjb25zdCBoYXNBZG1pblJvbGUgPSB1c2VyUm9sZXMuc29tZShybSA9PiB7XG4gICAgICAgICAgY29uc3QgciA9IGN0eC5kYi5yb2xlLmlkLmZpbmQocm0ucm9sZUlkKTtcbiAgICAgICAgICByZXR1cm4gciAmJiAoci5wZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG47XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFoYXNBZG1pblJvbGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ09ubHkgYWRtaW5zIGNhbiBhc3NpZ24gZ2xvYmFsIHJvbGVzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIElmIG5vIGFkbWluIHJvbGUgZXhpc3RzLCBhbGxvdyBhc3NpZ25tZW50IChmaXJzdCB1c2VyIHNjZW5hcmlvKVxuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBpZiBhbHJlYWR5IGFzc2lnbmVkXG4gICAgY29uc3QgZXhpc3RpbmcgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maW5kKFxuICAgICAgcm0gPT4gcm0ucm9sZUlkID09PSByb2xlSWQgJiYgcm0udXNlcklkLmlzRXF1YWwodXNlcklkKVxuICAgICk7XG4gICAgXG4gICAgaWYgKGV4aXN0aW5nKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1JvbGUgYWxyZWFkeSBhc3NpZ25lZCB0byB1c2VyJyk7XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi5yb2xlTWVtYmVyLmluc2VydCh7XG4gICAgICBpZDogMG4sXG4gICAgICByb2xlSWQsXG4gICAgICB1c2VySWQsXG4gICAgICBhc3NpZ25lZEF0OiBjdHgudGltZXN0YW1wLFxuICAgICAgYXNzaWduZWRCeTogY3R4LnNlbmRlcixcbiAgICB9KTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSBhc3NpZ25lZCByb2xlICR7cm9sZUlkfSB0byAke3VzZXJJZH1gKTtcbiAgfVxuKTtcblxuZXhwb3J0IGNvbnN0IHJlbW92ZV9yb2xlID0gc3BhY2V0aW1lZGIucmVkdWNlcihcbiAgeyByb2xlSWQ6IHQudTY0KCksIHVzZXJJZDogdC5pZGVudGl0eSgpIH0sXG4gIChjdHgsIHsgcm9sZUlkLCB1c2VySWQgfSkgPT4ge1xuICAgIGNvbnN0IHJvbGUgPSBjdHguZGIucm9sZS5pZC5maW5kKHJvbGVJZCk7XG4gICAgaWYgKCFyb2xlKSB7XG4gICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1JvbGUgbm90IGZvdW5kJyk7XG4gICAgfVxuICAgIFxuICAgIC8vIFByZXZlbnQgcmVtb3ZpbmcgYWRtaW4gcm9sZXNcbiAgICBpZiAoKHJvbGUucGVybWlzc2lvbnMgJiBQZXJtaXNzaW9ucy5BRE1JTikgIT09IDBuKSB7XG4gICAgICAvLyBQcmV2ZW50IGFkbWluIGZyb20gcmVtb3ZpbmcgdGhlaXIgb3duIGFkbWluIHJvbGVcbiAgICAgIGlmICh1c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ0tlbmRpIGFkbWlubGnEn2luaXppIGthbGTEsXJhbWF6c8SxbsSxei4gQmHFn2thIGJpciBhZG1pbiBidSBpxZ9sZW1pIHlhcG1hbMSxZMSxci4nKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gUHJldmVudCByZW1vdmluZyBhZG1pbiByb2xlIGZyb20gb3RoZXIgdXNlcnMgLSBubyBvbmUgY2FuIHJlbW92ZSBhZG1pbiByb2xlc1xuICAgICAgLy8gVGhpcyBlbnN1cmVzIHN5c3RlbSBhbHdheXMgaGFzIGFkbWluc1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdBZG1pbiByb2zDvCBrYWxkxLFyxLFsYW1hei4gU2lzdGVtZGUgZW4gYXogYmlyIGFkbWluIG9sbWFsxLFkxLFyLicpO1xuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBwZXJtaXNzaW9uc1xuICAgIGlmIChyb2xlLmNoYW5uZWxJZCkge1xuICAgICAgY29uc3QgdXNlclBlcm1zID0gZ2V0VXNlckNoYW5uZWxQZXJtaXNzaW9ucyhjdHgsIGN0eC5zZW5kZXIsIHJvbGUuY2hhbm5lbElkKTtcbiAgICAgIGlmICghY2hlY2tQZXJtaXNzaW9uKHVzZXJQZXJtcywgUGVybWlzc2lvbnMuQVNTSUdOX1JPTEVTKSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIHJlbW92ZSByb2xlcycpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBHbG9iYWwgcm9sZSAtIGNoZWNrIGlmIGFueSBhZG1pbiBleGlzdHNcbiAgICAgIGNvbnN0IGFsbFJvbGVzID0gWy4uLmN0eC5kYi5yb2xlLml0ZXIoKV07XG4gICAgICBjb25zdCBoYXNBbnlBZG1pblJvbGUgPSBhbGxSb2xlcy5zb21lKHIgPT4gKHIucGVybWlzc2lvbnMgJiBQZXJtaXNzaW9ucy5BRE1JTikgIT09IDBuKTtcbiAgICAgIFxuICAgICAgaWYgKGhhc0FueUFkbWluUm9sZSkge1xuICAgICAgICAvLyBJZiBhZG1pbiByb2xlIGV4aXN0cywgY2hlY2sgaWYgdXNlciBpcyBhZG1pblxuICAgICAgICBjb25zdCB1c2VyUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIocm0gPT4gcm0udXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikpO1xuICAgICAgICBjb25zdCBoYXNBZG1pblJvbGUgPSB1c2VyUm9sZXMuc29tZShybSA9PiB7XG4gICAgICAgICAgY29uc3QgciA9IGN0eC5kYi5yb2xlLmlkLmZpbmQocm0ucm9sZUlkKTtcbiAgICAgICAgICByZXR1cm4gciAmJiAoci5wZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG47XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFoYXNBZG1pblJvbGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ09ubHkgYWRtaW5zIGNhbiByZW1vdmUgZ2xvYmFsIHJvbGVzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIElmIG5vIGFkbWluIHJvbGUgZXhpc3RzLCBhbGxvdyByZW1vdmFsIChmaXJzdCB1c2VyIHNjZW5hcmlvKVxuICAgIH1cbiAgICBcbiAgICBjb25zdCByb2xlTWVtYmVyID0gWy4uLmN0eC5kYi5yb2xlTWVtYmVyLml0ZXIoKV0uZmluZChcbiAgICAgIHJtID0+IHJtLnJvbGVJZCA9PT0gcm9sZUlkICYmIHJtLnVzZXJJZC5pc0VxdWFsKHVzZXJJZClcbiAgICApO1xuICAgIFxuICAgIGlmICghcm9sZU1lbWJlcikge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdSb2xlIG5vdCBhc3NpZ25lZCB0byB1c2VyJyk7XG4gICAgfVxuICAgIFxuICAgIGN0eC5kYi5yb2xlTWVtYmVyLmRlbGV0ZShyb2xlTWVtYmVyKTtcbiAgICBcbiAgICBjb25zb2xlLmluZm8oYFVzZXIgJHtjdHguc2VuZGVyfSByZW1vdmVkIHJvbGUgJHtyb2xlSWR9IGZyb20gJHt1c2VySWR9YCk7XG4gIH1cbik7XG5cbmV4cG9ydCBjb25zdCBkZWxldGVfcm9sZSA9IHNwYWNldGltZWRiLnJlZHVjZXIoXG4gIHsgcm9sZUlkOiB0LnU2NCgpIH0sXG4gIChjdHgsIHsgcm9sZUlkIH0pID0+IHtcbiAgICBjb25zdCByb2xlID0gY3R4LmRiLnJvbGUuaWQuZmluZChyb2xlSWQpO1xuICAgIGlmICghcm9sZSkge1xuICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdSb2xlIG5vdCBmb3VuZCcpO1xuICAgIH1cbiAgICBcbiAgICAvLyBQcmV2ZW50IGFkbWluIGZyb20gZGVsZXRpbmcgYWRtaW4gcm9sZXNcbiAgICBpZiAoKHJvbGUucGVybWlzc2lvbnMgJiBQZXJtaXNzaW9ucy5BRE1JTikgIT09IDBuKSB7XG4gICAgICAvLyBHZXQgYWxsIHVzZXJzIGFzc2lnbmVkIHRvIHRoaXMgYWRtaW4gcm9sZVxuICAgICAgY29uc3Qgcm9sZU1lbWJlcnMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIoXG4gICAgICAgIHJtID0+IHJtLnJvbGVJZCA9PT0gcm9sZUlkXG4gICAgICApO1xuICAgICAgXG4gICAgICAvLyBDaGVjayBpZiB0aGUgdXNlciB0cnlpbmcgdG8gZGVsZXRlIGlzIGFzc2lnbmVkIHRvIHRoaXMgYWRtaW4gcm9sZVxuICAgICAgY29uc3QgdXNlclJvbGVNZW1iZXJzID0gcm9sZU1lbWJlcnMuZmlsdGVyKFxuICAgICAgICBybSA9PiBybS51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKVxuICAgICAgKTtcbiAgICAgIFxuICAgICAgaWYgKHVzZXJSb2xlTWVtYmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIEFkbWluIGNhbm5vdCBkZWxldGUgdGhlaXIgb3duIGFkbWluIHJvbGVcbiAgICAgICAgdGhyb3cgbmV3IFNlbmRlckVycm9yKCdLZW5kaSBhZG1pbmxpxJ9pbml6aSBzaWxlbWV6c2luaXouIEJhxZ9rYSBiaXIgYWRtaW4gYnUgacWfbGVtaSB5YXBtYWzEsWTEsXIuJyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFByZXZlbnQgZGVsZXRpbmcgYWRtaW4gcm9sZXMgdGhhdCBiZWxvbmcgdG8gb3RoZXIgdXNlcnNcbiAgICAgIC8vIE9ubHkgYWxsb3cgZGVsZXRpb24gaWYgdGhlIHJvbGUgaGFzIG5vIG1lbWJlcnMgKG9ycGhhbmVkIHJvbGUpXG4gICAgICBpZiAocm9sZU1lbWJlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ0JhxZ9rYSBiaXIga3VsbGFuxLFjxLFuxLFuIGFkbWluIHJvbMO8bsO8IHNpbGVtZXpzaW5pei4nKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gQWRkaXRpb25hbCBjaGVjazogRW5zdXJlIHN5c3RlbSBhbHdheXMgaGFzIGF0IGxlYXN0IG9uZSBhZG1pblxuICAgICAgY29uc3QgYWxsQWRtaW5Sb2xlcyA9IFsuLi5jdHguZGIucm9sZS5pdGVyKCldLmZpbHRlcihcbiAgICAgICAgciA9PiAoci5wZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG4gJiYgci5pZCAhPT0gcm9sZUlkXG4gICAgICApO1xuICAgICAgXG4gICAgICBpZiAoYWxsQWRtaW5Sb2xlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vIEdldCBhbGwgdXNlcnMgd2l0aCBhZG1pbiByb2xlcyAoZXhjbHVkaW5nIHRoZSByb2xlIGJlaW5nIGRlbGV0ZWQpXG4gICAgICAgIGNvbnN0IGFsbEFkbWluUm9sZU1lbWJlcnMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIocm0gPT4ge1xuICAgICAgICAgIGNvbnN0IHIgPSBjdHguZGIucm9sZS5pZC5maW5kKHJtLnJvbGVJZCk7XG4gICAgICAgICAgcmV0dXJuIHIgJiYgci5pZCAhPT0gcm9sZUlkICYmIChyLnBlcm1pc3Npb25zICYgUGVybWlzc2lvbnMuQURNSU4pICE9PSAwbjtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAvLyBHZXQgdW5pcXVlIGFkbWluIHVzZXJzXG4gICAgICAgIGNvbnN0IGFkbWluVXNlcnMgPSBuZXcgU2V0PHN0cmluZz4oKTtcbiAgICAgICAgYWxsQWRtaW5Sb2xlTWVtYmVycy5mb3JFYWNoKHJtID0+IHtcbiAgICAgICAgICBhZG1pblVzZXJzLmFkZChybS51c2VySWQudG9IZXhTdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgLy8gSWYgZGVsZXRpbmcgdGhpcyByb2xlIHdvdWxkIGxlYXZlIHRoZSBzeXN0ZW0gd2l0aG91dCBhZG1pbnMsIHByZXZlbnQgaXRcbiAgICAgICAgaWYgKGFkbWluVXNlcnMuc2l6ZSA9PT0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBTZW5kZXJFcnJvcignU2lzdGVtZGUgZW4gYXogYmlyIGFkbWluIG9sbWFsxLFkxLFyLiBCdSByb2zDvCBzaWxtZWsgdMO8bSBhZG1pbmxlcmkga2FsZMSxcsSxci4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBcbiAgICAvLyBDaGVjayBwZXJtaXNzaW9uc1xuICAgIGlmIChyb2xlLmNoYW5uZWxJZCkge1xuICAgICAgY29uc3QgdXNlclBlcm1zID0gZ2V0VXNlckNoYW5uZWxQZXJtaXNzaW9ucyhjdHgsIGN0eC5zZW5kZXIsIHJvbGUuY2hhbm5lbElkKTtcbiAgICAgIGlmICghY2hlY2tQZXJtaXNzaW9uKHVzZXJQZXJtcywgUGVybWlzc2lvbnMuTUFOQUdFX1JPTEVTKSkge1xuICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ1lvdSBkbyBub3QgaGF2ZSBwZXJtaXNzaW9uIHRvIGRlbGV0ZSByb2xlcycpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBHbG9iYWwgcm9sZSAtIGNoZWNrIGlmIGFueSBhZG1pbiBleGlzdHNcbiAgICAgIGNvbnN0IGFsbFJvbGVzID0gWy4uLmN0eC5kYi5yb2xlLml0ZXIoKV07XG4gICAgICBjb25zdCBoYXNBbnlBZG1pblJvbGUgPSBhbGxSb2xlcy5zb21lKHIgPT4gKHIucGVybWlzc2lvbnMgJiBQZXJtaXNzaW9ucy5BRE1JTikgIT09IDBuKTtcbiAgICAgIFxuICAgICAgaWYgKGhhc0FueUFkbWluUm9sZSkge1xuICAgICAgICAvLyBJZiBhZG1pbiByb2xlIGV4aXN0cywgY2hlY2sgaWYgdXNlciBpcyBhZG1pblxuICAgICAgICBjb25zdCB1c2VyUm9sZXMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIocm0gPT4gcm0udXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikpO1xuICAgICAgICBjb25zdCBoYXNBZG1pblJvbGUgPSB1c2VyUm9sZXMuc29tZShybSA9PiB7XG4gICAgICAgICAgY29uc3QgciA9IGN0eC5kYi5yb2xlLmlkLmZpbmQocm0ucm9sZUlkKTtcbiAgICAgICAgICByZXR1cm4gciAmJiAoci5wZXJtaXNzaW9ucyAmIFBlcm1pc3Npb25zLkFETUlOKSAhPT0gMG47XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFoYXNBZG1pblJvbGUpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgU2VuZGVyRXJyb3IoJ09ubHkgYWRtaW5zIGNhbiBkZWxldGUgZ2xvYmFsIHJvbGVzJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIElmIG5vIGFkbWluIHJvbGUgZXhpc3RzLCBhbGxvdyBkZWxldGlvbiAoZmlyc3QgdXNlciBzY2VuYXJpbylcbiAgICB9XG4gICAgXG4gICAgLy8gUmVtb3ZlIGFsbCByb2xlIG1lbWJlcnNoaXBzXG4gICAgY29uc3Qgcm9sZU1lbWJlcnMgPSBbLi4uY3R4LmRiLnJvbGVNZW1iZXIuaXRlcigpXS5maWx0ZXIocm0gPT4gcm0ucm9sZUlkID09PSByb2xlSWQpO1xuICAgIHJvbGVNZW1iZXJzLmZvckVhY2gocm0gPT4gY3R4LmRiLnJvbGVNZW1iZXIuZGVsZXRlKHJtKSk7XG4gICAgXG4gICAgLy8gRGVsZXRlIHJvbGVcbiAgICBjdHguZGIucm9sZS5kZWxldGUocm9sZSk7XG4gICAgXG4gICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gZGVsZXRlZCByb2xlICR7cm9sZUlkfWApO1xuICB9XG4pO1xuXG4vLyDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIDilIBcbi8vIElOSVRJQUxJWkFUSU9OICYgQ09OTkVDVElPTiBIQU5ETEVSU1xuLy8g4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSA4pSAXG5cbmV4cG9ydCBjb25zdCBpbml0ID0gc3BhY2V0aW1lZGIuaW5pdChjdHggPT4ge1xuICBjb25zb2xlLmluZm8oJ01vZHVsZSBpbml0aWFsaXplZCcpO1xuICBcbiAgLy8gTm90ZTogQWRtaW4gcm9sZSB3aWxsIGJlIGNyZWF0ZWQgb24tZGVtYW5kIHdoZW4gbmVlZGVkXG4gIC8vIENyZWF0aW5nIGl0IGluIGluaXQgY2FuIGNhdXNlIGlzc3VlcyBpZiB0aGUgdGFibGUgaXMgbm90IHJlYWR5XG4gIC8vIFJvbGVzIGNhbiBiZSBjcmVhdGVkIG1hbnVhbGx5IHRocm91Z2ggdGhlIFVJXG59KTtcblxuZXhwb3J0IGNvbnN0IG9uQ29ubmVjdCA9IHNwYWNldGltZWRiLmNsaWVudENvbm5lY3RlZChjdHggPT4ge1xuICBsZXQgY29ubmVjdGlvbkFkZHJlc3M6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgLy8gQHRzLWlnbm9yZSAtIGFkZHJlc3MgbWF5IGJlIGF2YWlsYWJsZSBpbiBjb250ZXh0XG4gIGlmIChjdHguYWRkcmVzcykge1xuICAgIC8vIEB0cy1pZ25vcmVcbiAgICBjb25uZWN0aW9uQWRkcmVzcyA9IFN0cmluZyhjdHguYWRkcmVzcyk7XG4gIH1cblxuICAvLyBUcmFjayB0aGlzIHNlc3Npb24gYXMgY29ubmVjdGVkICh1c2VkIHRvIGtub3cgd2hlbiB0byBzZXQgYWNjb3VudCBvZmZsaW5lKVxuICBjb25zdCBleGlzdGluZ1Nlc3Npb24gPSBjdHguZGIuYWN0aXZlU2Vzc2lvbi5zZXNzaW9uSWRlbnRpdHkuZmluZChjdHguc2VuZGVyKTtcbiAgaWYgKGV4aXN0aW5nU2Vzc2lvbikge1xuICAgIGN0eC5kYi5hY3RpdmVTZXNzaW9uLnNlc3Npb25JZGVudGl0eS51cGRhdGUoe1xuICAgICAgLi4uZXhpc3RpbmdTZXNzaW9uLFxuICAgICAgY29ubmVjdGVkQXQ6IGN0eC50aW1lc3RhbXAsXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgY3R4LmRiLmFjdGl2ZVNlc3Npb24uaW5zZXJ0KHtcbiAgICAgIHNlc3Npb25JZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgIGNvbm5lY3RlZEF0OiBjdHgudGltZXN0YW1wLFxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgdXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQoY3R4LnNlbmRlcik7XG4gIGNvbnN0IGxpbmsgPSBjdHguZGIuaWRlbnRpdHlMaW5rLnNlc3Npb25JZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuXG4gIGlmICh1c2VyKSB7XG4gICAgLy8gVXNlciBleGlzdHMgKG5vbi1saW5rZWQgc2Vzc2lvbikgLSB1cGRhdGUgb25saW5lIHN0YXR1c1xuICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7XG4gICAgICAuLi51c2VyLFxuICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgbGFzdElwQWRkcmVzczogY29ubmVjdGlvbkFkZHJlc3MgfHwgdXNlci5sYXN0SXBBZGRyZXNzLFxuICAgIH0pO1xuICAgIGlmIChsaW5rKSB7XG4gICAgICBjb25zdCBhY2NvdW50VXNlciA9IGN0eC5kYi51c2VyLmlkZW50aXR5LmZpbmQobGluay5hY2NvdW50SWRlbnRpdHkpO1xuICAgICAgaWYgKGFjY291bnRVc2VyKSB7XG4gICAgICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7XG4gICAgICAgICAgLi4uYWNjb3VudFVzZXIsXG4gICAgICAgICAgb25saW5lOiB0cnVlLFxuICAgICAgICAgIGxhc3RJcEFkZHJlc3M6IGNvbm5lY3Rpb25BZGRyZXNzIHx8IGFjY291bnRVc2VyLmxhc3RJcEFkZHJlc3MsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChsaW5rKSB7XG4gICAgLy8gTGlua2VkIHNlc3Npb246IG5vIHVzZXIgcm93IGZvciBjdHguc2VuZGVyIC0gb25seSB1cGRhdGUgYWNjb3VudCB1c2VyXG4gICAgY29uc3QgYWNjb3VudFVzZXIgPSBjdHguZGIudXNlci5pZGVudGl0eS5maW5kKGxpbmsuYWNjb3VudElkZW50aXR5KTtcbiAgICBpZiAoYWNjb3VudFVzZXIpIHtcbiAgICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7XG4gICAgICAgIC4uLmFjY291bnRVc2VyLFxuICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgIGxhc3RJcEFkZHJlc3M6IGNvbm5lY3Rpb25BZGRyZXNzIHx8IGFjY291bnRVc2VyLmxhc3RJcEFkZHJlc3MsXG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gQ2hlY2sgaWYgaWRlbnRpdHkgaGFzIGF1dGggY3JlZGVudGlhbHMgKHJlY29ubmVjdCBiZWZvcmUgbG9naW4pXG4gICAgY29uc3QgZW1haWxDcmVkcyA9IFsuLi5jdHguZGIuZW1haWxDcmVkZW50aWFsLml0ZXIoKV0uZmluZChjID0+IGMuaWRlbnRpdHkuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gICAgY29uc3QgZ29vZ2xlQXV0aHMgPSBbLi4uY3R4LmRiLmdvb2dsZUF1dGguaXRlcigpXS5maW5kKGEgPT4gYS5pZGVudGl0eS5pc0VxdWFsKGN0eC5zZW5kZXIpKTtcbiAgICBpZiAoZW1haWxDcmVkcyB8fCBnb29nbGVBdXRocykge1xuICAgICAgY29uc3QgYXV0aE1ldGhvZCA9IGVtYWlsQ3JlZHMgPyAnZW1haWwnIDogJ2dvb2dsZSc7XG4gICAgICBjdHguZGIudXNlci5pbnNlcnQoe1xuICAgICAgICBpZGVudGl0eTogY3R4LnNlbmRlcixcbiAgICAgICAgbmFtZTogdW5kZWZpbmVkLFxuICAgICAgICBvbmxpbmU6IHRydWUsXG4gICAgICAgIGF2YXRhcjogdW5kZWZpbmVkLFxuICAgICAgICBhdXRoTWV0aG9kOiBhdXRoTWV0aG9kLFxuICAgICAgICBsYXN0SXBBZGRyZXNzOiBjb25uZWN0aW9uQWRkcmVzcyxcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5pbmZvKGBVc2VyICR7Y3R4LnNlbmRlcn0gcmVjb25uZWN0ZWQgd2l0aCBleGlzdGluZyBhdXRoIGNyZWRlbnRpYWxzYCk7XG4gICAgfVxuICB9XG59KTtcblxuZXhwb3J0IGNvbnN0IG9uRGlzY29ubmVjdCA9IHNwYWNldGltZWRiLmNsaWVudERpc2Nvbm5lY3RlZChjdHggPT4ge1xuICAvLyBSZW1vdmUgZnJvbSBhY3RpdmVTZXNzaW9uIGZpcnN0IChiZWZvcmUgY2hlY2tpbmcgb3RoZXIgc2Vzc2lvbnMpXG4gIGNvbnN0IGFjdGl2ZVJvdyA9IGN0eC5kYi5hY3RpdmVTZXNzaW9uLnNlc3Npb25JZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICBpZiAoYWN0aXZlUm93KSB7XG4gICAgY3R4LmRiLmFjdGl2ZVNlc3Npb24uc2Vzc2lvbklkZW50aXR5LmRlbGV0ZShjdHguc2VuZGVyKTtcbiAgfVxuXG4gIGNvbnN0IHVzZXIgPSBjdHguZGIudXNlci5pZGVudGl0eS5maW5kKGN0eC5zZW5kZXIpO1xuICBjb25zdCBsaW5rID0gY3R4LmRiLmlkZW50aXR5TGluay5zZXNzaW9uSWRlbnRpdHkuZmluZChjdHguc2VuZGVyKTtcblxuICBpZiAodXNlcikge1xuICAgIGN0eC5kYi51c2VyLmlkZW50aXR5LnVwZGF0ZSh7IC4uLnVzZXIsIG9ubGluZTogZmFsc2UgfSk7XG4gIH0gZWxzZSBpZiAobGluaykge1xuICAgIC8vIExpbmtlZCBzZXNzaW9uOiBzZXQgYWNjb3VudCBvZmZsaW5lIG9ubHkgaWYgbm8gb3RoZXIgbGlua2VkIHNlc3Npb24gaXMgY29ubmVjdGVkXG4gICAgY29uc3Qgb3RoZXJTZXNzaW9uc0ZvckFjY291bnQgPSBbLi4uY3R4LmRiLmlkZW50aXR5TGluay5pdGVyKCldLmZpbHRlcihcbiAgICAgIGwgPT4gbC5hY2NvdW50SWRlbnRpdHkuaXNFcXVhbChsaW5rLmFjY291bnRJZGVudGl0eSkgJiYgIWwuc2Vzc2lvbklkZW50aXR5LmlzRXF1YWwoY3R4LnNlbmRlcilcbiAgICApO1xuICAgIGNvbnN0IGFueVN0aWxsQ29ubmVjdGVkID0gb3RoZXJTZXNzaW9uc0ZvckFjY291bnQuc29tZShzID0+XG4gICAgICBjdHguZGIuYWN0aXZlU2Vzc2lvbi5zZXNzaW9uSWRlbnRpdHkuZmluZChzLnNlc3Npb25JZGVudGl0eSlcbiAgICApO1xuICAgIGlmICghYW55U3RpbGxDb25uZWN0ZWQpIHtcbiAgICAgIGNvbnN0IGFjY291bnRVc2VyID0gY3R4LmRiLnVzZXIuaWRlbnRpdHkuZmluZChsaW5rLmFjY291bnRJZGVudGl0eSk7XG4gICAgICBpZiAoYWNjb3VudFVzZXIpIHtcbiAgICAgICAgY3R4LmRiLnVzZXIuaWRlbnRpdHkudXBkYXRlKHsgLi4uYWNjb3VudFVzZXIsIG9ubGluZTogZmFsc2UgfSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUud2FybihcbiAgICAgIGBEaXNjb25uZWN0IGV2ZW50IGZvciB1bmtub3duIHVzZXIgd2l0aCBpZGVudGl0eSAke2N0eC5zZW5kZXJ9YFxuICAgICk7XG4gIH1cblxuICAvLyBDbGVhbiB1cCB2b2ljZSByb29tIHBhcnRpY2lwYXRpb25cbiAgY29uc3QgcGFydGljaXBhbnRzID0gWy4uLmN0eC5kYi52b2ljZVBhcnRpY2lwYW50Lml0ZXIoKV0uZmlsdGVyKHAgPT4gcC51c2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSk7XG4gIHBhcnRpY2lwYW50cy5mb3JFYWNoKHBhcnRpY2lwYW50ID0+IHtcbiAgICBjb25zdCByb29tID0gY3R4LmRiLnZvaWNlUm9vbS5pZC5maW5kKHBhcnRpY2lwYW50LnJvb21JZCk7XG4gICAgaWYgKHJvb20pIHtcbiAgICAgIGN0eC5kYi52b2ljZVBhcnRpY2lwYW50LmRlbGV0ZShwYXJ0aWNpcGFudCk7XG4gICAgICBcbiAgICAgIC8vIENsZWFuIHVwIHNpZ25hbGluZyBtZXNzYWdlc1xuICAgICAgY29uc3Qgc2lnbmFscyA9IFsuLi5jdHguZGIudm9pY2VTaWduYWxpbmcuaXRlcigpXS5maWx0ZXIoXG4gICAgICAgIHMgPT4gcy5yb29tSWQgPT09IHJvb20uaWQgJiYgXG4gICAgICAgIChzLmZyb21Vc2VySWQuaXNFcXVhbChjdHguc2VuZGVyKSB8fCBzLnRvVXNlcklkLmlzRXF1YWwoY3R4LnNlbmRlcikpXG4gICAgICApO1xuICAgICAgc2lnbmFscy5mb3JFYWNoKHNpZ25hbCA9PiBjdHguZGIudm9pY2VTaWduYWxpbmcuZGVsZXRlKHNpZ25hbCkpO1xuICAgICAgXG4gICAgICAvLyBEZWxldGUgcm9vbSBpZiBlbXB0eVxuICAgICAgY29uc3QgcmVtYWluaW5nUGFydGljaXBhbnRzID0gWy4uLmN0eC5kYi52b2ljZVBhcnRpY2lwYW50Lml0ZXIoKV0uZmlsdGVyKHAgPT4gcC5yb29tSWQgPT09IHJvb20uaWQpO1xuICAgICAgaWYgKHJlbWFpbmluZ1BhcnRpY2lwYW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgY3R4LmRiLnZvaWNlUm9vbS5kZWxldGUocm9vbSk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn0pO1xuIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsYUFBVyxPQUFPO0FBQ3RCLElBQUlDLGNBQVksT0FBTztBQUN2QixJQUFJQyxxQkFBbUIsT0FBTztBQUM5QixJQUFJQyxzQkFBb0IsT0FBTztBQUMvQixJQUFJQyxpQkFBZSxPQUFPO0FBQzFCLElBQUlDLGlCQUFlLE9BQU8sVUFBVTtBQUNwQyxJQUFJQyxnQkFBYyxJQUFJLFFBQVEsU0FBUyxZQUFZO0FBQ2pELFFBQU8sUUFBUSxHQUFHLEdBQUdILG9CQUFrQixHQUFHLENBQUMsTUFBTSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQUUsRUFBRSxTQUFTLElBQUksRUFBRSxJQUFJOztBQUU3RixJQUFJSSxpQkFBZSxJQUFJLE1BQU0sUUFBUSxTQUFTO0FBQzVDLEtBQUksUUFBUSxPQUFPLFNBQVMsWUFBWSxPQUFPLFNBQVMsWUFDdEQ7T0FBSyxJQUFJLE9BQU9KLG9CQUFrQixLQUFLLENBQ3JDLEtBQUksQ0FBQ0UsZUFBYSxLQUFLLElBQUksSUFBSSxJQUFJLFFBQVEsT0FDekMsYUFBVSxJQUFJLEtBQUs7R0FBRSxXQUFXLEtBQUs7R0FBTSxZQUFZLEVBQUUsT0FBT0gsbUJBQWlCLE1BQU0sSUFBSSxLQUFLLEtBQUs7R0FBWSxDQUFDOztBQUV4SCxRQUFPOztBQUVULElBQUlNLGFBQVcsS0FBSyxZQUFZLFlBQVksU0FBUyxPQUFPLE9BQU9SLFdBQVNJLGVBQWEsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFRyxjQUtuRyxjQUFjLENB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QkFBZ0IsT0FBTyxJQUFJLE9BQU87Q0FHekQsTUFBTSxPQUFPLElBQUksR0FBRyxLQUFLLFNBQVMsS0FBSyxJQUFJLE9BQU87Q0FDbEQsTUFBTSxPQUFPLElBQUksR0FBRyxhQUFhLGdCQUFnQixLQUFLLElBQUksT0FBTztBQUVqRSxLQUFJLEtBQ0YsS0FBSSxHQUFHLEtBQUssU0FBUyxPQUFPO0VBQUUsR0FBRztFQUFNLFFBQVE7RUFBTyxDQUFDO1VBQzlDLE1BUVQ7TUFBSSxDQU40QixDQUFDLEdBQUcsSUFBSSxHQUFHLGFBQWEsTUFBTSxDQUFDLENBQUMsUUFDOUQsTUFBSyxFQUFFLGdCQUFnQixRQUFRLEtBQUssZ0JBQWdCLElBQUksQ0FBQyxFQUFFLGdCQUFnQixRQUFRLElBQUksT0FBTyxDQUMvRixDQUNpRCxNQUFLLE1BQ3JELElBQUksR0FBRyxjQUFjLGdCQUFnQixLQUFLLEVBQUUsZ0JBQWdCLENBQzdELEVBQ3VCO0dBQ3RCLE1BQU0sY0FBYyxJQUFJLEdBQUcsS0FBSyxTQUFTLEtBQUssS0FBSyxnQkFBZ0I7QUFDbkUsT0FBSSxZQUNGLEtBQUksR0FBRyxLQUFLLFNBQVMsT0FBTztJQUFFLEdBQUc7SUFBYSxRQUFRO0lBQU8sQ0FBQzs7T0FJbEUsU0FBUSxLQUNOLG1EQUFtRCxJQUFJLFNBQ3hEO0FBS0gsQ0FEcUIsQ0FBQyxHQUFHLElBQUksR0FBRyxpQkFBaUIsTUFBTSxDQUFDLENBQUMsUUFBTyxNQUFLLEVBQUUsT0FBTyxRQUFRLElBQUksT0FBTyxDQUFDLENBQ3JGLFNBQVEsZ0JBQWU7RUFDbEMsTUFBTSxPQUFPLElBQUksR0FBRyxVQUFVLEdBQUcsS0FBSyxZQUFZLE9BQU87QUFDekQsTUFBSSxNQUFNO0FBQ1IsT0FBSSxHQUFHLGlCQUFpQixPQUFPLFlBQVk7QUFPM0MsR0FKZ0IsQ0FBQyxHQUFHLElBQUksR0FBRyxlQUFlLE1BQU0sQ0FBQyxDQUFDLFFBQ2hELE1BQUssRUFBRSxXQUFXLEtBQUssT0FDdEIsRUFBRSxXQUFXLFFBQVEsSUFBSSxPQUFPLElBQUksRUFBRSxTQUFTLFFBQVEsSUFBSSxPQUFPLEVBQ3BFLENBQ08sU0FBUSxXQUFVLElBQUksR0FBRyxlQUFlLE9BQU8sT0FBTyxDQUFDO0FBSS9ELE9BRDhCLENBQUMsR0FBRyxJQUFJLEdBQUcsaUJBQWlCLE1BQU0sQ0FBQyxDQUFDLFFBQU8sTUFBSyxFQUFFLFdBQVcsS0FBSyxHQUFHLENBQ3pFLFdBQVcsRUFDbkMsS0FBSSxHQUFHLFVBQVUsT0FBTyxLQUFLOztHQUdqQztFQUNGIiwiZGVidWdJZCI6ImY3OWM5YzcxLTkwOGMtNGQ1Zi04MmQ4LWY2OTNkZDU4OWRjNSJ9