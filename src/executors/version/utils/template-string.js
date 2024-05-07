"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.coerce = exports.createTemplateString = void 0;
function createTemplateString(template, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
context) {
    return Object.keys(context).reduce((accumulator, contextParamKey) => {
        // @deprecated ${key} syntax is deprecated and will be removed in the next major version
        const interpolationRegex = new RegExp(`\\$\{${contextParamKey}}|\\{${contextParamKey}}`, 'g');
        return accumulator.replace(interpolationRegex, context[contextParamKey].toString());
    }, template);
}
exports.createTemplateString = createTemplateString;
function coerce(value) {
    if (_isBool(value)) {
        return value === 'true';
    }
    if (_isNumeric(value)) {
        return +value;
    }
    return value;
}
exports.coerce = coerce;
function _isNumeric(value) {
    return !isNaN(+value) && !isNaN(parseFloat(value));
}
function _isBool(value) {
    return value === 'true' || value === 'false';
}
//# sourceMappingURL=template-string.js.map