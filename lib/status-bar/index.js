"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const etch = require("etch");
const status_icon_1 = require("../output-panel/views/status-icon");
class StatusBarView {
    constructor(panel) {
        this.panel = panel;
        this.statusMap = new Map();
        etch.initialize(this);
    }
    render() {
        return (etch.dom("div", { class: "ide-haskell inline-block", on: { click: this.didClick.bind(this) } },
            etch.dom("span", null,
                etch.dom("ide-haskell-lambda", null),
                etch.dom(status_icon_1.StatusIcon, { statusMap: this.statusMap }))));
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return etch.update(this);
        });
    }
    backendStatus(pluginName, st) {
        this.statusMap.set(pluginName, st);
        this.update();
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            yield etch.destroy(this);
        });
    }
    didClick() {
        atom.workspace.toggle(this.panel);
    }
}
exports.StatusBarView = StatusBarView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RhdHVzLWJhci9pbmRleC50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLDZCQUE0QjtBQUU1QixtRUFBNEQ7QUFhNUQ7SUFJRSxZQUFxQixLQUFrQjtRQUFsQixVQUFLLEdBQUwsS0FBSyxDQUFhO1FBQ3JDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQTtRQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ3ZCLENBQUM7SUFFTSxNQUFNO1FBQ1gsTUFBTSxDQUFDLENBQ0wsa0JBQUssS0FBSyxFQUFDLDBCQUEwQixFQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQztZQUN6RTtnQkFDRSxvQ0FBcUI7Z0JBQ3JCLFNBQUMsd0JBQVUsSUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxDQUNuQyxDQUNILENBQ1AsQ0FBQTtJQUNILENBQUM7SUFFWSxNQUFNOztZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMxQixDQUFDO0tBQUE7SUFFTSxhQUFhLENBQUUsVUFBa0IsRUFBRSxFQUFXO1FBQ25ELElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDZixDQUFDO0lBRVksT0FBTzs7WUFDbEIsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzFCLENBQUM7S0FBQTtJQUVPLFFBQVE7UUFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbkMsQ0FBQztDQUNGO0FBcENELHNDQW9DQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7SVN0YXR1cywgT3V0cHV0UGFuZWx9IGZyb20gJy4uL291dHB1dC1wYW5lbCdcbmltcG9ydCB7U3RhdHVzSWNvbn0gZnJvbSAnLi4vb3V0cHV0LXBhbmVsL3ZpZXdzL3N0YXR1cy1pY29uJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElUaWxlIHtcbiAgZ2V0UHJpb3JpdHkgKCk6IG51bWJlclxuICBnZXRJdGVtICgpOiBPYmplY3RcbiAgZGVzdHJveSAoKTogdm9pZFxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTdGF0dXNCYXIge1xuICBhZGRMZWZ0VGlsZSAocGFyYW1zOiB7aXRlbTogT2JqZWN0LCBwcmlvcml0eTogbnVtYmVyfSk6IElUaWxlXG4gIGFkZFJpZ2h0VGlsZSAocGFyYW1zOiB7aXRlbTogT2JqZWN0LCBwcmlvcml0eTogbnVtYmVyfSk6IElUaWxlXG59XG5cbmV4cG9ydCBjbGFzcyBTdGF0dXNCYXJWaWV3IHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXVuaW5pdGlhbGl6ZWQtY2xhc3MtcHJvcGVydGllc1xuICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgcHJpdmF0ZSBzdGF0dXNNYXA6IE1hcDxzdHJpbmcsIElTdGF0dXM+XG4gIGNvbnN0cnVjdG9yIChwcml2YXRlIHBhbmVsOiBPdXRwdXRQYW5lbCkge1xuICAgIHRoaXMuc3RhdHVzTWFwID0gbmV3IE1hcCgpXG4gICAgZXRjaC5pbml0aWFsaXplKHRoaXMpXG4gIH1cblxuICBwdWJsaWMgcmVuZGVyICgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzcz1cImlkZS1oYXNrZWxsIGlubGluZS1ibG9ja1wiIG9uPXt7Y2xpY2s6IHRoaXMuZGlkQ2xpY2suYmluZCh0aGlzKX19PlxuICAgICAgICA8c3Bhbj5cbiAgICAgICAgICA8aWRlLWhhc2tlbGwtbGFtYmRhLz5cbiAgICAgICAgICA8U3RhdHVzSWNvbiBzdGF0dXNNYXA9e3RoaXMuc3RhdHVzTWFwfS8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUgKCkge1xuICAgIHJldHVybiBldGNoLnVwZGF0ZSh0aGlzKVxuICB9XG5cbiAgcHVibGljIGJhY2tlbmRTdGF0dXMgKHBsdWdpbk5hbWU6IHN0cmluZywgc3Q6IElTdGF0dXMpIHtcbiAgICB0aGlzLnN0YXR1c01hcC5zZXQocGx1Z2luTmFtZSwgc3QpXG4gICAgdGhpcy51cGRhdGUoKVxuICB9XG5cbiAgcHVibGljIGFzeW5jIGRlc3Ryb3kgKCkge1xuICAgIGF3YWl0IGV0Y2guZGVzdHJveSh0aGlzKVxuICB9XG5cbiAgcHJpdmF0ZSBkaWRDbGljayAoKSB7XG4gICAgYXRvbS53b3Jrc3BhY2UudG9nZ2xlKHRoaXMucGFuZWwpXG4gIH1cbn1cbiJdfQ==