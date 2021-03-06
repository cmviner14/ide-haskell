"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const etch = require("etch");
const atom_1 = require("atom");
class StatusIcon {
    constructor(props) {
        this.props = props;
        this.disposables = new atom_1.CompositeDisposable();
        etch.initialize(this);
        this.disposables.add(atom.tooltips.add(this.element, {
            class: 'ide-haskell-status-tooltip',
            title: () => {
                const res = [];
                for (const [plugin, { status, detail },] of this.props.statusMap.entries()) {
                    res.push(`
          <ide-haskell-status-item>
            <ide-haskell-status-icon data-status="${status}">${plugin}</ide-haskell-status-icon>
            <ide-haskell-status-detail>${detail ? detail : ''}</ide-haskell-status-detail>
          </ide-haskell-status-item>
          `);
                }
                return res.join('');
            },
        }));
    }
    render() {
        return (etch.dom("ide-haskell-status-icon", { dataset: { status: this.calcCurrentStatus() } }));
    }
    async update(props) {
        this.props.statusMap = props.statusMap;
        return etch.update(this);
    }
    async destroy() {
        await etch.destroy(this);
        this.props.statusMap.clear();
    }
    calcCurrentStatus() {
        const prio = {
            progress: 50,
            error: 20,
            warning: 10,
            ready: 0,
        };
        const stArr = Array.from(this.props.statusMap.values());
        if (stArr.length === 0)
            return 'ready';
        const [consensus] = stArr.sort((a, b) => prio[b.status] - prio[a.status]);
        return consensus.status;
    }
}
exports.StatusIcon = StatusIcon;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzLWljb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYmFja2VuZC1zdGF0dXMvdmlld3Mvc3RhdHVzLWljb24udHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLCtCQUEwQztBQVMxQyxNQUFhLFVBQVU7SUFHckIsWUFBbUIsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLDBCQUFtQixFQUFFLENBQUE7UUFFNUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUVyQixJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUM5QixLQUFLLEVBQUUsNEJBQTRCO1lBQ25DLEtBQUssRUFBRSxHQUFHLEVBQUU7Z0JBQ1YsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFBO2dCQUNkLEtBQUssTUFBTSxDQUNULE1BQU0sRUFDTixFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsRUFDbkIsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtvQkFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQzs7b0RBRStCLE1BQU0sS0FBSyxNQUFNO3lDQUV2RCxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDcEI7O1dBRUQsQ0FBQyxDQUFBO2lCQUNEO2dCQUNELE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtZQUNyQixDQUFDO1NBQ0YsQ0FBQyxDQUNILENBQUE7SUFDSCxDQUFDO0lBRU0sTUFBTTtRQUNYLE9BQU8sQ0FDTCxzQ0FBeUIsT0FBTyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEdBQUksQ0FDM0UsQ0FBQTtJQUNILENBQUM7SUFFTSxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQWE7UUFFL0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQTtRQUN0QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUVNLEtBQUssQ0FBQyxPQUFPO1FBQ2xCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQTtJQUM5QixDQUFDO0lBRU8saUJBQWlCO1FBQ3ZCLE1BQU0sSUFBSSxHQUFHO1lBQ1gsUUFBUSxFQUFFLEVBQUU7WUFDWixLQUFLLEVBQUUsRUFBRTtZQUNULE9BQU8sRUFBRSxFQUFFO1lBQ1gsS0FBSyxFQUFFLENBQUM7U0FDVCxDQUFBO1FBQ0QsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZELElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQUUsT0FBTyxPQUFPLENBQUE7UUFDdEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQTtRQUN6RSxPQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUE7SUFDekIsQ0FBQztDQUNGO0FBN0RELGdDQTZEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV0Y2ggZnJvbSAnZXRjaCdcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJ1xuaW1wb3J0ICogYXMgVVBJIGZyb20gJ2F0b20taGFza2VsbC11cGknXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVByb3BzIGV4dGVuZHMgSlNYLlByb3BzIHtcbiAgc3RhdHVzTWFwOiBNYXA8c3RyaW5nLCBVUEkuSVN0YXR1cz5cbn1cblxudHlwZSBFbGVtZW50Q2xhc3MgPSBKU1guRWxlbWVudENsYXNzXG5cbmV4cG9ydCBjbGFzcyBTdGF0dXNJY29uIGltcGxlbWVudHMgRWxlbWVudENsYXNzIHtcbiAgcHJpdmF0ZSBkaXNwb3NhYmxlczogQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBwcml2YXRlIGVsZW1lbnQhOiBIVE1MRWxlbWVudFxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcHM6IElQcm9wcykge1xuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG5cbiAgICBldGNoLmluaXRpYWxpemUodGhpcylcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgIGNsYXNzOiAnaWRlLWhhc2tlbGwtc3RhdHVzLXRvb2x0aXAnLFxuICAgICAgICB0aXRsZTogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHJlcyA9IFtdXG4gICAgICAgICAgZm9yIChjb25zdCBbXG4gICAgICAgICAgICBwbHVnaW4sXG4gICAgICAgICAgICB7IHN0YXR1cywgZGV0YWlsIH0sXG4gICAgICAgICAgXSBvZiB0aGlzLnByb3BzLnN0YXR1c01hcC5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIHJlcy5wdXNoKGBcbiAgICAgICAgICA8aWRlLWhhc2tlbGwtc3RhdHVzLWl0ZW0+XG4gICAgICAgICAgICA8aWRlLWhhc2tlbGwtc3RhdHVzLWljb24gZGF0YS1zdGF0dXM9XCIke3N0YXR1c31cIj4ke3BsdWdpbn08L2lkZS1oYXNrZWxsLXN0YXR1cy1pY29uPlxuICAgICAgICAgICAgPGlkZS1oYXNrZWxsLXN0YXR1cy1kZXRhaWw+JHtcbiAgICAgICAgICAgICAgZGV0YWlsID8gZGV0YWlsIDogJydcbiAgICAgICAgICAgIH08L2lkZS1oYXNrZWxsLXN0YXR1cy1kZXRhaWw+XG4gICAgICAgICAgPC9pZGUtaGFza2VsbC1zdGF0dXMtaXRlbT5cbiAgICAgICAgICBgKVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzLmpvaW4oJycpXG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICApXG4gIH1cblxuICBwdWJsaWMgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8aWRlLWhhc2tlbGwtc3RhdHVzLWljb24gZGF0YXNldD17eyBzdGF0dXM6IHRoaXMuY2FsY0N1cnJlbnRTdGF0dXMoKSB9fSAvPlxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB1cGRhdGUocHJvcHM6IElQcm9wcykge1xuICAgIC8vIFRPRE86IERpZmYgYWxnb1xuICAgIHRoaXMucHJvcHMuc3RhdHVzTWFwID0gcHJvcHMuc3RhdHVzTWFwXG4gICAgcmV0dXJuIGV0Y2gudXBkYXRlKHRoaXMpXG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGVzdHJveSgpIHtcbiAgICBhd2FpdCBldGNoLmRlc3Ryb3kodGhpcylcbiAgICB0aGlzLnByb3BzLnN0YXR1c01hcC5jbGVhcigpXG4gIH1cblxuICBwcml2YXRlIGNhbGNDdXJyZW50U3RhdHVzKCk6ICdyZWFkeScgfCAnd2FybmluZycgfCAnZXJyb3InIHwgJ3Byb2dyZXNzJyB7XG4gICAgY29uc3QgcHJpbyA9IHtcbiAgICAgIHByb2dyZXNzOiA1MCxcbiAgICAgIGVycm9yOiAyMCxcbiAgICAgIHdhcm5pbmc6IDEwLFxuICAgICAgcmVhZHk6IDAsXG4gICAgfVxuICAgIGNvbnN0IHN0QXJyID0gQXJyYXkuZnJvbSh0aGlzLnByb3BzLnN0YXR1c01hcC52YWx1ZXMoKSlcbiAgICBpZiAoc3RBcnIubGVuZ3RoID09PSAwKSByZXR1cm4gJ3JlYWR5J1xuICAgIGNvbnN0IFtjb25zZW5zdXNdID0gc3RBcnIuc29ydCgoYSwgYikgPT4gcHJpb1tiLnN0YXR1c10gLSBwcmlvW2Euc3RhdHVzXSlcbiAgICByZXR1cm4gY29uc2Vuc3VzLnN0YXR1c1xuICB9XG59XG4iXX0=