"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const etch = require("etch");
class Button {
    constructor(props) {
        this.props = props;
        etch.initialize(this);
    }
    render() {
        return (etch.dom("ide-haskell-button", { class: this.props.active ? 'active' : '', dataset: { caption: this.props.name, count: this.props.count }, on: { click: this.props.onClick } }));
    }
    async update(props) {
        this.props = props;
        return etch.update(this);
    }
    async destroy() {
        await etch.destroy(this);
    }
}
exports.Button = Button;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3V0cHV0LXBhbmVsLWJ1dHRvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vdXRwdXQtcGFuZWwvdmlld3Mvb3V0cHV0LXBhbmVsLWJ1dHRvbi50c3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFTNUIsTUFBYSxNQUFNO0lBQ2pCLFlBQW1CLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDdkIsQ0FBQztJQUVNLE1BQU07UUFDWCxPQUFPLENBQ0wsaUNBQ0UsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFDeEMsT0FBTyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUM5RCxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsR0FDakMsQ0FDSCxDQUFBO0lBQ0gsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBYTtRQUMvQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQTtRQUNsQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMxQixDQUFDO0NBQ0Y7QUF2QkQsd0JBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXRjaCBmcm9tICdldGNoJ1xuXG5leHBvcnQgaW50ZXJmYWNlIElQcm9wcyBleHRlbmRzIEpTWC5Qcm9wcyB7XG4gIGFjdGl2ZTogYm9vbGVhblxuICBuYW1lOiBzdHJpbmdcbiAgY291bnQ6IG51bWJlclxuICBvbkNsaWNrOiAoKSA9PiB2b2lkXG59XG5cbmV4cG9ydCBjbGFzcyBCdXR0b24gaW1wbGVtZW50cyBKU1guRWxlbWVudENsYXNzIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByb3BzOiBJUHJvcHMpIHtcbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcbiAgfVxuXG4gIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxpZGUtaGFza2VsbC1idXR0b25cbiAgICAgICAgY2xhc3M9e3RoaXMucHJvcHMuYWN0aXZlID8gJ2FjdGl2ZScgOiAnJ31cbiAgICAgICAgZGF0YXNldD17eyBjYXB0aW9uOiB0aGlzLnByb3BzLm5hbWUsIGNvdW50OiB0aGlzLnByb3BzLmNvdW50IH19XG4gICAgICAgIG9uPXt7IGNsaWNrOiB0aGlzLnByb3BzLm9uQ2xpY2sgfX1cbiAgICAgIC8+XG4gICAgKVxuICB9XG5cbiAgcHVibGljIGFzeW5jIHVwZGF0ZShwcm9wczogSVByb3BzKSB7XG4gICAgdGhpcy5wcm9wcyA9IHByb3BzXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGVzdHJveSgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgfVxufVxuIl19