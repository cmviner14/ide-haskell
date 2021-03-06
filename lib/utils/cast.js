"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDock(object) {
    return object.constructor.name === 'Dock';
}
exports.isDock = isDock;
function isSimpleControlDef(def) {
    return typeof def.element === 'string';
}
exports.isSimpleControlDef = isSimpleControlDef;
function notUndefined(val) {
    return val !== undefined;
}
exports.notUndefined = notUndefined;
exports.eventRangeTypeVals = [
    "context",
    "keyboard",
    "mouse",
    "selection",
];
function isTEventRangeType(x) {
    return (typeof x === 'string' && exports.eventRangeTypeVals.includes(x));
}
exports.isTEventRangeType = isTEventRangeType;
function isTextMessage(msg) {
    return !!(msg && msg.text);
}
exports.isTextMessage = isTextMessage;
function isHTMLMessage(msg) {
    return !!(msg && msg.html);
}
exports.isHTMLMessage = isHTMLMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9jYXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsU0FBZ0IsTUFBTSxDQUFDLE1BQThCO0lBQ25ELE9BQU8sTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFBO0FBQzNDLENBQUM7QUFGRCx3QkFFQztBQUVELFNBQWdCLGtCQUFrQixDQUNoQyxHQUE4QjtJQUU5QixPQUFPLE9BQU8sR0FBRyxDQUFDLE9BQU8sS0FBSyxRQUFRLENBQUE7QUFDeEMsQ0FBQztBQUpELGdEQUlDO0FBRUQsU0FBZ0IsWUFBWSxDQUFJLEdBQWtCO0lBQ2hELE9BQU8sR0FBRyxLQUFLLFNBQVMsQ0FBQTtBQUMxQixDQUFDO0FBRkQsb0NBRUM7QUFFWSxRQUFBLGtCQUFrQixHQUFHOzs7OztDQUtqQyxDQUFBO0FBRUQsU0FBZ0IsaUJBQWlCLENBQy9CLENBQTJCO0lBRTNCLE9BQU8sQ0FDTCxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksMEJBQWtCLENBQUMsUUFBUSxDQUFDLENBQW9CLENBQUMsQ0FDM0UsQ0FBQTtBQUNILENBQUM7QUFORCw4Q0FNQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxHQUFpQjtJQUM3QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSyxHQUF3QixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xELENBQUM7QUFGRCxzQ0FFQztBQUVELFNBQWdCLGFBQWEsQ0FBQyxHQUFpQjtJQUM3QyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSyxHQUF3QixDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2xELENBQUM7QUFGRCxzQ0FFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEF0b21UeXBlcyBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgVVBJIGZyb20gJ2F0b20taGFza2VsbC11cGknXG5pbXBvcnQgRG9jayA9IEF0b21UeXBlcy5Eb2NrXG5pbXBvcnQgV29ya3NwYWNlQ2VudGVyID0gQXRvbVR5cGVzLldvcmtzcGFjZUNlbnRlclxuaW1wb3J0IFRFdmVudFJhbmdlVHlwZSA9IFVQSS5URXZlbnRSYW5nZVR5cGVcblxuZXhwb3J0IGZ1bmN0aW9uIGlzRG9jayhvYmplY3Q6IERvY2sgfCBXb3Jrc3BhY2VDZW50ZXIpOiBvYmplY3QgaXMgRG9jayB7XG4gIHJldHVybiBvYmplY3QuY29uc3RydWN0b3IubmFtZSA9PT0gJ0RvY2snXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1NpbXBsZUNvbnRyb2xEZWY8VD4oXG4gIGRlZjogVVBJLlRDb250cm9sRGVmaW5pdGlvbjxUPixcbik6IGRlZiBpcyBVUEkuSUNvbnRyb2xTaW1wbGVEZWZpbml0aW9uIHtcbiAgcmV0dXJuIHR5cGVvZiBkZWYuZWxlbWVudCA9PT0gJ3N0cmluZydcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG5vdFVuZGVmaW5lZDxUPih2YWw6IFQgfCB1bmRlZmluZWQpOiB2YWwgaXMgVCB7XG4gIHJldHVybiB2YWwgIT09IHVuZGVmaW5lZFxufVxuXG5leHBvcnQgY29uc3QgZXZlbnRSYW5nZVR5cGVWYWxzID0gW1xuICBURXZlbnRSYW5nZVR5cGUuY29udGV4dCxcbiAgVEV2ZW50UmFuZ2VUeXBlLmtleWJvYXJkLFxuICBURXZlbnRSYW5nZVR5cGUubW91c2UsXG4gIFRFdmVudFJhbmdlVHlwZS5zZWxlY3Rpb24sXG5dXG5cbmV4cG9ydCBmdW5jdGlvbiBpc1RFdmVudFJhbmdlVHlwZShcbiAgeDogVEV2ZW50UmFuZ2VUeXBlIHwgT2JqZWN0LFxuKTogeCBpcyBURXZlbnRSYW5nZVR5cGUge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB4ID09PSAnc3RyaW5nJyAmJiBldmVudFJhbmdlVHlwZVZhbHMuaW5jbHVkZXMoeCBhcyBURXZlbnRSYW5nZVR5cGUpXG4gIClcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVGV4dE1lc3NhZ2UobXNnOiBVUEkuVE1lc3NhZ2UpOiBtc2cgaXMgVVBJLklNZXNzYWdlVGV4dCB7XG4gIHJldHVybiAhIShtc2cgJiYgKG1zZyBhcyBVUEkuSU1lc3NhZ2VUZXh0KS50ZXh0KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIVE1MTWVzc2FnZShtc2c6IFVQSS5UTWVzc2FnZSk6IG1zZyBpcyBVUEkuSU1lc3NhZ2VIVE1MIHtcbiAgcmV0dXJuICEhKG1zZyAmJiAobXNnIGFzIFVQSS5JTWVzc2FnZUhUTUwpLmh0bWwpXG59XG4iXX0=