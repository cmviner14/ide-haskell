"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const utils_1 = require("../utils");
const tooltip_manager_1 = require("./tooltip-manager");
class EditorControl {
    constructor(editor, pluginManager) {
        this.editor = editor;
        this.trackMouseBufferPosition = (e) => {
            const bufferPt = utils_1.bufferPositionFromMouseEvent(this.editor, e);
            if (!bufferPt) {
                return;
            }
            if (this.lastMouseBufferPt && this.lastMouseBufferPt.isEqual(bufferPt)) {
                return;
            }
            this.lastMouseBufferPt = bufferPt;
            if (this.exprTypeTimeout !== undefined) {
                clearTimeout(this.exprTypeTimeout);
            }
            this.exprTypeTimeout = window.setTimeout(() => {
                this.shouldShowTooltip(bufferPt, "mouse");
            }, atom.config.get('ide-haskell.expressionTypeInterval', {
                scope: this.editor.getRootScopeDescriptor(),
            }));
        };
        this.stopTrackingMouseBufferPosition = () => {
            if (this.exprTypeTimeout !== undefined) {
                return clearTimeout(this.exprTypeTimeout);
            }
        };
        this.trackSelection = ({ newBufferRange }) => {
            this.handleCursorUnderTooltip(newBufferRange);
            if (this.selTimeout !== undefined) {
                clearTimeout(this.selTimeout);
            }
            if (newBufferRange.isEmpty()) {
                this.tooltips.hide("selection");
                if (this.exprTypeTimeout !== undefined) {
                    clearTimeout(this.exprTypeTimeout);
                }
                utils_1.handlePromise(this.tooltipRegistry.showTooltip(this.editor, "keyboard"));
                if (atom.config.get('ide-haskell.onCursorMove', {
                    scope: this.editor.getRootScopeDescriptor(),
                }) === 'Hide Tooltip') {
                    this.tooltips.hide("mouse", undefined, {
                        persistent: false,
                    });
                    this.tooltips.hide("context", undefined, {
                        persistent: false,
                    });
                }
            }
            else {
                this.selTimeout = window.setTimeout(() => this.shouldShowTooltip(newBufferRange.start, "selection"), atom.config.get('ide-haskell.expressionTypeInterval', {
                    scope: this.editor.getRootScopeDescriptor(),
                }));
            }
        };
        this.disposables = new atom_1.CompositeDisposable();
        this.tooltips = new tooltip_manager_1.TooltipManager(this.editor);
        this.disposables.add(this.tooltips);
        this.tooltipRegistry = pluginManager.tooltipRegistry;
        this.editorElement = atom.views.getView(this.editor);
        const buffer = this.editor.getBuffer();
        this.disposables.add(buffer.onWillSave(async () => {
            await pluginManager.willSaveBuffer(buffer);
        }), buffer.onDidSave(() => pluginManager.didSaveBuffer(buffer)), this.editor.onDidStopChanging(() => pluginManager.didStopChanging(buffer)), this.editorElement.onDidChangeScrollLeft(() => this.tooltips.hide("mouse")), this.editorElement.onDidChangeScrollTop(() => this.tooltips.hide("mouse")), utils_1.listen(this.editorElement, 'mousemove', '.scroll-view', this.trackMouseBufferPosition), utils_1.listen(this.editorElement, 'mouseout', '.scroll-view', this.stopTrackingMouseBufferPosition), this.editor.onDidChangeSelectionRange(this.trackSelection));
    }
    static supportsGrammar(grammar) {
        return [
            'source.haskell',
            'text.tex.latex.haskell',
        ].includes(grammar);
    }
    destroy() {
        if (this.exprTypeTimeout !== undefined) {
            clearTimeout(this.exprTypeTimeout);
        }
        if (this.selTimeout !== undefined) {
            clearTimeout(this.selTimeout);
        }
        this.disposables.dispose();
        this.lastMouseBufferPt = undefined;
    }
    getEventRange(eventType) {
        let crange;
        let pos;
        switch (eventType) {
            case 'mouse':
            case 'context':
                if (!this.lastMouseBufferPt)
                    return undefined;
                pos = this.lastMouseBufferPt;
                const selRanges = this.editor
                    .getSelections()
                    .map((sel) => sel.getBufferRange())
                    .filter((sel) => sel.containsPoint(pos));
                crange = selRanges.length > 0 ? selRanges[0] : new atom_1.Range(pos, pos);
                break;
            case 'keyboard':
            case 'selection':
                crange = this.editor.getLastSelection().getBufferRange();
                pos = crange.start;
                break;
            default:
                throw new TypeError('Switch assertion failed');
        }
        return { crange, pos, eventType };
    }
    shouldShowTooltip(pos, type) {
        if (pos.row < 0 ||
            pos.row >= this.editor.getLineCount() ||
            pos.isEqual(this.editor.getBuffer().rangeForRow(pos.row, false).end)) {
            this.tooltips.hide(type);
        }
        else {
            utils_1.handlePromise(this.tooltipRegistry.showTooltip(this.editor, type));
        }
    }
    handleCursorUnderTooltip(currentRange) {
        const tooltipElement = document.querySelector('ide-haskell-tooltip');
        if (!tooltipElement) {
            return;
        }
        const slcl = this.editorElement.pixelRectForScreenRange(this.editor.screenRangeForBufferRange(currentRange));
        const sv = this.editorElement.querySelector('.scroll-view');
        if (!sv) {
            return;
        }
        const eecl = sv.getBoundingClientRect();
        const ttcl = tooltipElement.getBoundingClientRect();
        const div = tooltipElement.querySelector('div');
        if (!div) {
            return;
        }
        const ttcld = div.getBoundingClientRect();
        const ttbox = {
            left: ttcl.left - eecl.left,
            top: ttcld.top - eecl.top,
            width: ttcl.width,
            height: ttcld.height,
        };
        const xmax = Math.round(Math.max(ttbox.left, slcl.left));
        const xmin = Math.round(Math.min(ttbox.left + ttbox.width, slcl.left + slcl.width));
        const ymax = Math.round(Math.max(ttbox.top, slcl.top));
        const ymin = Math.round(Math.min(ttbox.top + ttbox.height, slcl.top + slcl.height));
        const tt = document.querySelector('ide-haskell-tooltip');
        if (tt) {
            if (ymax <= ymin && xmax <= xmin) {
                tt.classList.add('ide-haskell-tooltip-subdued');
            }
            else {
                tt.classList.remove('ide-haskell-tooltip-subdued');
            }
        }
    }
}
exports.EditorControl = EditorControl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZWRpdG9yLWNvbnRyb2wvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBZ0Y7QUFDaEYsb0NBQThFO0FBQzlFLHVEQUFrRDtBQVVsRCxNQUFhLGFBQWE7SUFtQnhCLFlBQ21CLE1BQWtCLEVBQ25DLGFBQTRCO1FBRFgsV0FBTSxHQUFOLE1BQU0sQ0FBWTtRQXdHN0IsNkJBQXdCLEdBQUcsQ0FBQyxDQUFhLEVBQUUsRUFBRTtZQUNuRCxNQUFNLFFBQVEsR0FBRyxvQ0FBNEIsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFBO1lBQzdELElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2IsT0FBTTthQUNQO1lBRUQsSUFBSSxJQUFJLENBQUMsaUJBQWlCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDdEUsT0FBTTthQUNQO1lBQ0QsSUFBSSxDQUFDLGlCQUFpQixHQUFHLFFBQVEsQ0FBQTtZQUVqQyxJQUFJLElBQUksQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUN0QyxZQUFZLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFBO2FBQ25DO1lBQ0QsSUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUN0QyxHQUFHLEVBQUU7Z0JBQ0gsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsVUFBd0IsQ0FBQTtZQUN6RCxDQUFDLEVBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsb0NBQW9DLEVBQUU7Z0JBQ3BELEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFO2FBQzVDLENBQUMsQ0FDSCxDQUFBO1FBQ0gsQ0FBQyxDQUFBO1FBRU8sb0NBQStCLEdBQUcsR0FBRyxFQUFFO1lBQzdDLElBQUksSUFBSSxDQUFDLGVBQWUsS0FB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dCwgQ29tcG9zaXRlRGlzcG9zYWJsZSwgRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBidWZmZXJQb3NpdGlvbkZyb21Nb3VzZUV2ZW50LCBsaXN0ZW4sIGhhbmRsZVByb21pc2UgfSBmcm9tICcuLi91dGlscydcbmltcG9ydCB7IFRvb2x0aXBNYW5hZ2VyIH0gZnJvbSAnLi90b29sdGlwLW1hbmFnZXInXG5pbXBvcnQgeyBUb29sdGlwUmVnaXN0cnkgfSBmcm9tICcuLi90b29sdGlwLXJlZ2lzdHJ5J1xuaW1wb3J0IHsgUGx1Z2luTWFuYWdlciwgSUVkaXRvckNvbnRyb2xsZXIgfSBmcm9tICcuLi9wbHVnaW4tbWFuYWdlcidcbmltcG9ydCAqIGFzIFVQSSBmcm9tICdhdG9tLWhhc2tlbGwtdXBpJ1xuaW1wb3J0IFRFdmVudFJhbmdlVHlwZSA9IFVQSS5URXZlbnRSYW5nZVR5cGVcblxuZXhwb3J0IHR5cGUgVEV2ZW50UmFuZ2VSZXN1bHQgPVxuICB8IHsgY3JhbmdlOiBSYW5nZTsgcG9zOiBQb2ludDsgZXZlbnRUeXBlOiBURXZlbnRSYW5nZVR5cGUgfVxuICB8IHVuZGVmaW5lZFxuXG5leHBvcnQgY2xhc3MgRWRpdG9yQ29udHJvbCBpbXBsZW1lbnRzIElFZGl0b3JDb250cm9sbGVyIHtcbiAgcHVibGljIHJlYWRvbmx5IHRvb2x0aXBzOiBUb29sdGlwTWFuYWdlclxuICBwcml2YXRlIHJlYWRvbmx5IGRpc3Bvc2FibGVzOiBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIHByaXZhdGUgbGFzdE1vdXNlQnVmZmVyUHQ/OiBQb2ludFxuICBwcml2YXRlIGV4cHJUeXBlVGltZW91dD86IG51bWJlclxuICBwcml2YXRlIHNlbFRpbWVvdXQ/OiBudW1iZXJcbiAgcHJpdmF0ZSByZWFkb25seSBlZGl0b3JFbGVtZW50OiBIVE1MRWxlbWVudCAmIHtcbiAgICBvbkRpZENoYW5nZVNjcm9sbFRvcChhOiAoKSA9PiB2b2lkKTogRGlzcG9zYWJsZVxuICAgIG9uRGlkQ2hhbmdlU2Nyb2xsTGVmdChhOiAoKSA9PiB2b2lkKTogRGlzcG9zYWJsZVxuICAgIHBpeGVsUmVjdEZvclNjcmVlblJhbmdlKFxuICAgICAgcjogUmFuZ2UsXG4gICAgKToge1xuICAgICAgbGVmdDogbnVtYmVyXG4gICAgICB0b3A6IG51bWJlclxuICAgICAgd2lkdGg6IG51bWJlclxuICAgICAgaGVpZ2h0OiBudW1iZXJcbiAgICB9XG4gIH1cbiAgcHJpdmF0ZSByZWFkb25seSB0b29sdGlwUmVnaXN0cnk6IFRvb2x0aXBSZWdpc3RyeVxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IGVkaXRvcjogVGV4dEVkaXRvcixcbiAgICBwbHVnaW5NYW5hZ2VyOiBQbHVnaW5NYW5hZ2VyLFxuICApIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICAgIHRoaXMudG9vbHRpcHMgPSBuZXcgVG9vbHRpcE1hbmFnZXIodGhpcy5lZGl0b3IpXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy50b29sdGlwcylcbiAgICB0aGlzLnRvb2x0aXBSZWdpc3RyeSA9IHBsdWdpbk1hbmFnZXIudG9vbHRpcFJlZ2lzdHJ5XG5cbiAgICB0aGlzLmVkaXRvckVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5lZGl0b3IpIGFzIGFueVxuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5lZGl0b3IuZ2V0QnVmZmVyKClcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMuYWRkKFxuICAgICAgLy8gYnVmZmVyIGV2ZW50cyBmb3IgYXV0b21hdGljIGNoZWNrXG4gICAgICBidWZmZXIub25XaWxsU2F2ZShhc3luYyAoKSA9PiB7XG4gICAgICAgIGF3YWl0IHBsdWdpbk1hbmFnZXIud2lsbFNhdmVCdWZmZXIoYnVmZmVyKVxuICAgICAgfSksXG4gICAgICBidWZmZXIub25EaWRTYXZlKCgpID0+IHBsdWdpbk1hbmFnZXIuZGlkU2F2ZUJ1ZmZlcihidWZmZXIpKSxcbiAgICAgIHRoaXMuZWRpdG9yLm9uRGlkU3RvcENoYW5naW5nKCgpID0+XG4gICAgICAgIHBsdWdpbk1hbmFnZXIuZGlkU3RvcENoYW5naW5nKGJ1ZmZlciksXG4gICAgICApLFxuICAgICAgLy8gdG9vbHRpcCB0cmFja2luZyAobW91c2UgYW5kIHNlbGVjdGlvbilcbiAgICAgIHRoaXMuZWRpdG9yRWxlbWVudC5vbkRpZENoYW5nZVNjcm9sbExlZnQoKCkgPT5cbiAgICAgICAgdGhpcy50b29sdGlwcy5oaWRlKFRFdmVudFJhbmdlVHlwZS5tb3VzZSksXG4gICAgICApLFxuICAgICAgdGhpcy5lZGl0b3JFbGVtZW50Lm9uRGlkQ2hhbmdlU2Nyb2xsVG9wKCgpID0+XG4gICAgICAgIHRoaXMudG9vbHRpcHMuaGlkZShURXZlbnRSYW5nZVR5cGUubW91c2UpLFxuICAgICAgKSxcbiAgICAgIGxpc3RlbihcbiAgICAgICAgdGhpcy5lZGl0b3JFbGVtZW50LFxuICAgICAgICAnbW91c2Vtb3ZlJyxcbiAgICAgICAgJy5zY3JvbGwtdmlldycsXG4gICAgICAgIHRoaXMudHJhY2tNb3VzZUJ1ZmZlclBvc2l0aW9uLFxuICAgICAgKSxcbiAgICAgIGxpc3RlbihcbiAgICAgICAgdGhpcy5lZGl0b3JFbGVtZW50LFxuICAgICAgICAnbW91c2VvdXQnLFxuICAgICAgICAnLnNjcm9sbC12aWV3JyxcbiAgICAgICAgdGhpcy5zdG9wVHJhY2tpbmdNb3VzZUJ1ZmZlclBvc2l0aW9uLFxuICAgICAgKSxcbiAgICAgIHRoaXMuZWRpdG9yLm9uRGlkQ2hhbmdlU2VsZWN0aW9uUmFuZ2UodGhpcy50cmFja1NlbGVjdGlvbiksXG4gICAgKVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzdXBwb3J0c0dyYW1tYXIoZ3JhbW1hcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFtcbiAgICAgIC8vICdzb3VyY2UuYzJocycsXG4gICAgICAvLyAnc291cmNlLmNhYmFsJyxcbiAgICAgIC8vICdzb3VyY2UuaHNjMmhzJyxcbiAgICAgICdzb3VyY2UuaGFza2VsbCcsXG4gICAgICAndGV4dC50ZXgubGF0ZXguaGFza2VsbCcsXG4gICAgICAvLyAnc291cmNlLmhzaWcnLFxuICAgIF0uaW5jbHVkZXMoZ3JhbW1hcilcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLmV4cHJUeXBlVGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5leHByVHlwZVRpbWVvdXQpXG4gICAgfVxuICAgIGlmICh0aGlzLnNlbFRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2VsVGltZW91dClcbiAgICB9XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICB0aGlzLmxhc3RNb3VzZUJ1ZmZlclB0ID0gdW5kZWZpbmVkXG4gIH1cblxuICBwdWJsaWMgZ2V0RXZlbnRSYW5nZShldmVudFR5cGU6IFRFdmVudFJhbmdlVHlwZSk6IFRFdmVudFJhbmdlUmVzdWx0IHtcbiAgICBsZXQgY3JhbmdlOiBSYW5nZVxuICAgIGxldCBwb3M6IFBvaW50XG4gICAgc3dpdGNoIChldmVudFR5cGUpIHtcbiAgICAgIGNhc2UgJ21vdXNlJzpcbiAgICAgIGNhc2UgJ2NvbnRleHQnOlxuICAgICAgICBpZiAoIXRoaXMubGFzdE1vdXNlQnVmZmVyUHQpIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgcG9zID0gdGhpcy5sYXN0TW91c2VCdWZmZXJQdFxuICAgICAgICBjb25zdCBzZWxSYW5nZXMgPSB0aGlzLmVkaXRvclxuICAgICAgICAgIC5nZXRTZWxlY3Rpb25zKClcbiAgICAgICAgICAubWFwKChzZWwpID0+IHNlbC5nZXRCdWZmZXJSYW5nZSgpKVxuICAgICAgICAgIC5maWx0ZXIoKHNlbCkgPT4gc2VsLmNvbnRhaW5zUG9pbnQocG9zKSlcbiAgICAgICAgY3JhbmdlID0gc2VsUmFuZ2VzLmxlbmd0aCA+IDAgPyBzZWxSYW5nZXNbMF0gOiBuZXcgUmFuZ2UocG9zLCBwb3MpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlICdrZXlib2FyZCc6XG4gICAgICBjYXNlICdzZWxlY3Rpb24nOlxuICAgICAgICBjcmFuZ2UgPSB0aGlzLmVkaXRvci5nZXRMYXN0U2VsZWN0aW9uKCkuZ2V0QnVmZmVyUmFuZ2UoKVxuICAgICAgICBwb3MgPSBjcmFuZ2Uuc3RhcnRcbiAgICAgICAgYnJlYWtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1N3aXRjaCBhc3NlcnRpb24gZmFpbGVkJylcbiAgICB9XG5cbiAgICByZXR1cm4geyBjcmFuZ2UsIHBvcywgZXZlbnRUeXBlIH1cbiAgfVxuXG4gIHByaXZhdGUgc2hvdWxkU2hvd1Rvb2x0aXAocG9zOiBQb2ludCwgdHlwZTogVEV2ZW50UmFuZ2VUeXBlKSB7XG4gICAgaWYgKFxuICAgICAgcG9zLnJvdyA8IDAgfHxcbiAgICAgIHBvcy5yb3cgPj0gdGhpcy5lZGl0b3IuZ2V0TGluZUNvdW50KCkgfHxcbiAgICAgIHBvcy5pc0VxdWFsKHRoaXMuZWRpdG9yLmdldEJ1ZmZlcigpLnJhbmdlRm9yUm93KHBvcy5yb3csIGZhbHNlKS5lbmQpXG4gICAgKSB7XG4gICAgICB0aGlzLnRvb2x0aXBzLmhpZGUodHlwZSlcbiAgICB9IGVsc2Uge1xuICAgICAgaGFuZGxlUHJvbWlzZSh0aGlzLnRvb2x0aXBSZWdpc3RyeS5zaG93VG9vbHRpcCh0aGlzLmVkaXRvciwgdHlwZSkpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFja01vdXNlQnVmZmVyUG9zaXRpb24gPSAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgIGNvbnN0IGJ1ZmZlclB0ID0gYnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudCh0aGlzLmVkaXRvciwgZSlcbiAgICBpZiAoIWJ1ZmZlclB0KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5sYXN0TW91c2VCdWZmZXJQdCAmJiB0aGlzLmxhc3RNb3VzZUJ1ZmZlclB0LmlzRXF1YWwoYnVmZmVyUHQpKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5sYXN0TW91c2VCdWZmZXJQdCA9IGJ1ZmZlclB0XG5cbiAgICBpZiAodGhpcy5leHByVHlwZVRpbWVvdXQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZXhwclR5cGVUaW1lb3V0KVxuICAgIH1cbiAgICB0aGlzLmV4cHJUeXBlVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnNob3VsZFNob3dUb29sdGlwKGJ1ZmZlclB0LCBURXZlbnRSYW5nZVR5cGUubW91c2UpXG4gICAgICB9LFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCdpZGUtaGFza2VsbC5leHByZXNzaW9uVHlwZUludGVydmFsJywge1xuICAgICAgICBzY29wZTogdGhpcy5lZGl0b3IuZ2V0Um9vdFNjb3BlRGVzY3JpcHRvcigpLFxuICAgICAgfSksXG4gICAgKVxuICB9XG5cbiAgcHJpdmF0ZSBzdG9wVHJhY2tpbmdNb3VzZUJ1ZmZlclBvc2l0aW9uID0gKCkgPT4ge1xuICAgIGlmICh0aGlzLmV4cHJUeXBlVGltZW91dCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KHRoaXMuZXhwclR5cGVUaW1lb3V0KVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhY2tTZWxlY3Rpb24gPSAoeyBuZXdCdWZmZXJSYW5nZSB9OiB7IG5ld0J1ZmZlclJhbmdlOiBSYW5nZSB9KSA9PiB7XG4gICAgdGhpcy5oYW5kbGVDdXJzb3JVbmRlclRvb2x0aXAobmV3QnVmZmVyUmFuZ2UpXG5cbiAgICBpZiAodGhpcy5zZWxUaW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnNlbFRpbWVvdXQpXG4gICAgfVxuICAgIGlmIChuZXdCdWZmZXJSYW5nZS5pc0VtcHR5KCkpIHtcbiAgICAgIHRoaXMudG9vbHRpcHMuaGlkZShURXZlbnRSYW5nZVR5cGUuc2VsZWN0aW9uKVxuICAgICAgaWYgKHRoaXMuZXhwclR5cGVUaW1lb3V0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuZXhwclR5cGVUaW1lb3V0KVxuICAgICAgfVxuXG4gICAgICBoYW5kbGVQcm9taXNlKFxuICAgICAgICB0aGlzLnRvb2x0aXBSZWdpc3RyeS5zaG93VG9vbHRpcCh0aGlzLmVkaXRvciwgVEV2ZW50UmFuZ2VUeXBlLmtleWJvYXJkKSxcbiAgICAgIClcbiAgICAgIGlmIChcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdpZGUtaGFza2VsbC5vbkN1cnNvck1vdmUnLCB7XG4gICAgICAgICAgc2NvcGU6IHRoaXMuZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKSxcbiAgICAgICAgfSkgPT09ICdIaWRlIFRvb2x0aXAnXG4gICAgICApIHtcbiAgICAgICAgdGhpcy50b29sdGlwcy5oaWRlKFRFdmVudFJhbmdlVHlwZS5tb3VzZSwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgcGVyc2lzdGVudDogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudG9vbHRpcHMuaGlkZShURXZlbnRSYW5nZVR5cGUuY29udGV4dCwgdW5kZWZpbmVkLCB7XG4gICAgICAgICAgcGVyc2lzdGVudDogZmFsc2UsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2VsVGltZW91dCA9IHdpbmRvdy5zZXRUaW1lb3V0KFxuICAgICAgICAoKSA9PlxuICAgICAgICAgIHRoaXMuc2hvdWxkU2hvd1Rvb2x0aXAoXG4gICAgICAgICAgICBuZXdCdWZmZXJSYW5nZS5zdGFydCxcbiAgICAgICAgICAgIFRFdmVudFJhbmdlVHlwZS5zZWxlY3Rpb24sXG4gICAgICAgICAgKSxcbiAgICAgICAgYXRvbS5jb25maWcuZ2V0KCdpZGUtaGFza2VsbC5leHByZXNzaW9uVHlwZUludGVydmFsJywge1xuICAgICAgICAgIHNjb3BlOiB0aGlzLmVkaXRvci5nZXRSb290U2NvcGVEZXNjcmlwdG9yKCksXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlQ3Vyc29yVW5kZXJUb29sdGlwKGN1cnJlbnRSYW5nZTogUmFuZ2UpIHtcbiAgICBjb25zdCB0b29sdGlwRWxlbWVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2lkZS1oYXNrZWxsLXRvb2x0aXAnKVxuICAgIGlmICghdG9vbHRpcEVsZW1lbnQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBzbGNsID0gdGhpcy5lZGl0b3JFbGVtZW50LnBpeGVsUmVjdEZvclNjcmVlblJhbmdlKFxuICAgICAgdGhpcy5lZGl0b3Iuc2NyZWVuUmFuZ2VGb3JCdWZmZXJSYW5nZShjdXJyZW50UmFuZ2UpLFxuICAgIClcbiAgICBjb25zdCBzdiA9IHRoaXMuZWRpdG9yRWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2Nyb2xsLXZpZXcnKVxuICAgIGlmICghc3YpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBjb25zdCBlZWNsID0gc3YuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCB0dGNsID0gdG9vbHRpcEVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCBkaXYgPSB0b29sdGlwRWxlbWVudC5xdWVyeVNlbGVjdG9yKCdkaXYnKVxuICAgIGlmICghZGl2KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgY29uc3QgdHRjbGQgPSBkaXYuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCB0dGJveCA9IHtcbiAgICAgIGxlZnQ6IHR0Y2wubGVmdCAtIGVlY2wubGVmdCxcbiAgICAgIHRvcDogdHRjbGQudG9wIC0gZWVjbC50b3AsXG4gICAgICB3aWR0aDogdHRjbC53aWR0aCxcbiAgICAgIGhlaWdodDogdHRjbGQuaGVpZ2h0LFxuICAgIH1cbiAgICBjb25zdCB4bWF4ID0gTWF0aC5yb3VuZChNYXRoLm1heCh0dGJveC5sZWZ0LCBzbGNsLmxlZnQpKVxuICAgIGNvbnN0IHhtaW4gPSBNYXRoLnJvdW5kKFxuICAgICAgTWF0aC5taW4odHRib3gubGVmdCArIHR0Ym94LndpZHRoLCBzbGNsLmxlZnQgKyBzbGNsLndpZHRoKSxcbiAgICApXG4gICAgY29uc3QgeW1heCA9IE1hdGgucm91bmQoTWF0aC5tYXgodHRib3gudG9wLCBzbGNsLnRvcCkpXG4gICAgY29uc3QgeW1pbiA9IE1hdGgucm91bmQoXG4gICAgICBNYXRoLm1pbih0dGJveC50b3AgKyB0dGJveC5oZWlnaHQsIHNsY2wudG9wICsgc2xjbC5oZWlnaHQpLFxuICAgIClcbiAgICBjb25zdCB0dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAnaWRlLWhhc2tlbGwtdG9vbHRpcCcsXG4gICAgKSBhcyBIVE1MRWxlbWVudCB8IG51bGxcbiAgICBpZiAodHQpIHtcbiAgICAgIGlmICh5bWF4IDw9IHltaW4gJiYgeG1heCA8PSB4bWluKSB7XG4gICAgICAgIHR0LmNsYXNzTGlzdC5hZGQoJ2lkZS1oYXNrZWxsLXRvb2x0aXAtc3ViZHVlZCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0dC5jbGFzc0xpc3QucmVtb3ZlKCdpZGUtaGFza2VsbC10b29sdGlwLXN1YmR1ZWQnKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19