"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_1 = require("atom");
const results_db_1 = require("./results-db");
const config_params_1 = require("./config-params");
const editor_control_1 = require("./editor-control");
const linter_support_1 = require("./linter-support");
const tooltip_registry_1 = require("./tooltip-registry");
const check_results_provider_1 = require("./check-results-provider");
const status_bar_1 = require("./status-bar");
const prettify_1 = require("./prettify");
const editor_mark_control_1 = require("./editor-mark-control");
const backend_status_1 = require("./backend-status");
const utils_1 = require("./utils");
class PluginManager {
    constructor(state, outputPanel) {
        this.outputPanel = outputPanel;
        this.disposables = new atom_1.CompositeDisposable();
        this.emitter = new atom_1.Emitter();
        this.willSaveHandlers = new Set();
        this.controllers = new Map();
        this.backendStatusController = new backend_status_1.BackendStatusController();
        this.onWillSaveBuffer = (callback) => {
            this.willSaveHandlers.add(callback);
            return new atom_1.Disposable(() => this.willSaveHandlers.delete(callback));
        };
        this.onDidSaveBuffer = (callback) => this.emitter.on('did-save-buffer', callback);
        this.onDidStopChanging = (callback) => this.emitter.on('did-stop-changing', callback);
        this.disposables.add(this.emitter);
        this.resultsDB = new results_db_1.ResultsDB();
        this.outputPanel.connectResults(this.resultsDB);
        this.outputPanel.connectBsc(this.backendStatusController);
        this.tooltipRegistry = new tooltip_registry_1.TooltipRegistry(this);
        this.configParamManager = new config_params_1.ConfigParamManager(this.outputPanel, state.configParams);
        this.disposables.add(this.addEditorController(editor_control_1.EditorControl), this.addEditorController(prettify_1.PrettifyEditorController), this.addEditorController(editor_mark_control_1.EditorMarkControl));
        if (atom.config.get('ide-haskell.messageDisplayFrontend') === 'builtin') {
            this.checkResultsProvider = new check_results_provider_1.CheckResultsProvider(this);
        }
        this.subscribeEditorController();
    }
    deactivate() {
        this.resultsDB.destroy();
        this.disposables.dispose();
        if (this.checkResultsProvider)
            this.checkResultsProvider.destroy();
        utils_1.handlePromise(this.outputPanel.reallyDestroy());
        this.configParamManager.destroy();
        this.removeStatusBar();
        if (this.linterSupport) {
            this.linterSupport.destroy();
            this.linterSupport = undefined;
        }
    }
    serialize() {
        return {
            configParams: this.configParamManager.serialize(),
        };
    }
    async willSaveBuffer(buffer) {
        return Promise.all(Array.from(this.willSaveHandlers.values()).map((f) => f(buffer)));
    }
    didSaveBuffer(buffer) {
        return this.emitter.emit('did-save-buffer', buffer);
    }
    didStopChanging(buffer) {
        return this.emitter.emit('did-stop-changing', buffer);
    }
    togglePanel() {
        utils_1.handlePromise(atom.workspace.toggle(this.outputPanel));
    }
    controller(editor) {
        return this.controllerType(editor_control_1.EditorControl, editor);
    }
    controllerType(factory, editor) {
        const ecmap = this.controllers.get(factory);
        const rec = ecmap ? ecmap.get(editor) : undefined;
        return rec ? rec.controller : undefined;
    }
    setLinter(linter) {
        if (atom.config.get('ide-haskell.messageDisplayFrontend') !== 'linter') {
            return;
        }
        this.linterSupport = new linter_support_1.LinterSupport(linter, this.resultsDB);
    }
    nextError() {
        if (atom.config.get('ide-haskell.messageDisplayFrontend') !== 'builtin') {
            return;
        }
        this.outputPanel.showNextError();
    }
    prevError() {
        if (atom.config.get('ide-haskell.messageDisplayFrontend') !== 'builtin') {
            return;
        }
        this.outputPanel.showPrevError();
    }
    forceBackendStatus(pluginName, st) {
        this.backendStatusController.forceBackendStatus(pluginName, st);
    }
    getAwaiter(pluginName) {
        return this.backendStatusController.getAwaiter(pluginName);
    }
    addEditorController(factory) {
        if (this.controllers.has(factory)) {
            throw new Error(`Duplicate controller factory ${factory.toString()}`);
        }
        const map = new WeakMap();
        this.controllers.set(factory, map);
        return new atom_1.Disposable(() => {
            this.controllers.delete(factory);
            for (const te of atom.workspace.getTextEditors()) {
                const rec = map.get(te);
                if (rec)
                    rec.disposable.dispose();
            }
        });
    }
    setStatusBar(sb) {
        this.statusBarView = new status_bar_1.StatusBarView(this.outputPanel, this.backendStatusController);
        this.statusBarTile = sb.addRightTile({
            item: this.statusBarView.element,
            priority: 100,
        });
    }
    removeStatusBar() {
        if (this.statusBarTile) {
            this.statusBarTile.destroy();
            this.statusBarTile = undefined;
        }
        if (this.statusBarView) {
            this.statusBarView.destroy();
            this.statusBarView = undefined;
        }
    }
    controllerOnGrammar(editor, grammar) {
        for (const [factory, map] of this.controllers.entries()) {
            const rec = map.get(editor);
            if (!rec && factory.supportsGrammar(grammar.scopeName)) {
                const controller = new factory(editor, this);
                const disposable = new atom_1.CompositeDisposable();
                disposable.add(new atom_1.Disposable(() => {
                    map.delete(editor);
                    controller.destroy();
                }), editor.onDidDestroy(() => disposable.dispose()));
                map.set(editor, { controller, disposable });
            }
            else if (rec && !factory.supportsGrammar(grammar.scopeName)) {
                rec.disposable.dispose();
            }
        }
    }
    subscribeEditorController() {
        this.disposables.add(atom.workspace.observeTextEditors((editor) => {
            const editorDisp = new atom_1.CompositeDisposable();
            editorDisp.add(editor.onDidChangeGrammar((grammar) => {
                this.controllerOnGrammar(editor, grammar);
            }), editor.onDidDestroy(() => {
                editorDisp.dispose();
                this.disposables.remove(editorDisp);
            }));
            this.disposables.add(editorDisp);
            this.controllerOnGrammar(editor, editor.getGrammar());
        }));
    }
}
exports.PluginManager = PluginManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGx1Z2luLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcGx1Z2luLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFPYTtBQUNiLDZDQUF3QztBQUV4QyxtREFBMkU7QUFDM0UscURBQWdEO0FBQ2hELHFEQUFnRDtBQUNoRCx5REFBb0Q7QUFDcEQscUVBQStEO0FBQy9ELDZDQUE0QztBQUM1Qyx5Q0FBcUQ7QUFDckQsK0RBQXlEO0FBQ3pELHFEQUEwRDtBQUkxRCxtQ0FBdUM7QUE0QnZDLE1BQWEsYUFBYTtJQXVCeEIsWUFBWSxLQUFhLEVBQVMsV0FBd0I7UUFBeEIsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFqQnpDLGdCQUFXLEdBQUcsSUFBSSwwQkFBbUIsRUFBRSxDQUFBO1FBQ3ZDLFlBQU8sR0FNcEIsSUFBSSxjQUFPLEVBQUUsQ0FBQTtRQUdULHFCQUFnQixHQUFHLElBQUksR0FBRyxFQUEyQixDQUFBO1FBQzVDLGdCQUFXLEdBQUcsSUFBSSxHQUFHLEVBR25DLENBQUE7UUFDYyw0QkFBdUIsR0FBRyxJQUFJLHdDQUF1QixFQUFFLENBQUE7UUE4Q2pFLHFCQUFnQixHQUFHLENBQUMsUUFBaUMsRUFBRSxFQUFFO1lBQzlELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDbkMsT0FBTyxJQUFJLGlCQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFBO1FBQ3JFLENBQUMsQ0FBQTtRQUVNLG9CQUFlLEdBQUcsQ0FBQyxRQUFpQyxFQUFFLEVBQUUsQ0FDN0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFFdkMsc0JBQWlCLEdBQUcsQ0FBQyxRQUFpQyxFQUFFLEVBQUUsQ0FDL0QsSUFBSSxDQUFDLE9BQU8s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QzVDO2lCQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQzdELEdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUE7YUFDekI7U0FDRjtJQUNILENBQUM7SUFHTyx5QkFBeUI7UUFDL0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQ2xCLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUMzQyxNQUFNLFVBQVUsR0FBRyxJQUFJLDBCQUFtQixFQUFFLENBQUE7WUFDNUMsVUFBVSxDQUFDLEdBQUcsQ0FDWixNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQTtZQUMzQyxDQUFDLENBQUMsRUFDRixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsRUFBRTtnQkFDdkIsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQTtZQUNyQyxDQUFDLENBQUMsQ0FDSCxDQUFBO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDaEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQTtRQUN2RCxDQUFDLENBQUMsQ0FDSCxDQUFBO0lBQ0gsQ0FBQztDQUNGO0FBek5ELHNDQXlOQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvbXBvc2l0ZURpc3Bvc2FibGUsXG4gIEVtaXR0ZXIsXG4gIFRleHRFZGl0b3IsXG4gIFRleHRCdWZmZXIsXG4gIEdyYW1tYXIsXG4gIERpc3Bvc2FibGUsXG59IGZyb20gJ2F0b20nXG5pbXBvcnQgeyBSZXN1bHRzREIgfSBmcm9tICcuL3Jlc3VsdHMtZGInXG5pbXBvcnQgeyBPdXRwdXRQYW5lbCwgSVN0YXRlIGFzIElPdXRwdXRWaWV3U3RhdGUgfSBmcm9tICcuL291dHB1dC1wYW5lbCdcbmltcG9ydCB7IENvbmZpZ1BhcmFtTWFuYWdlciwgSVN0YXRlIGFzIElQYXJhbVN0YXRlIH0gZnJvbSAnLi9jb25maWctcGFyYW1zJ1xuaW1wb3J0IHsgRWRpdG9yQ29udHJvbCB9IGZyb20gJy4vZWRpdG9yLWNvbnRyb2wnXG5pbXBvcnQgeyBMaW50ZXJTdXBwb3J0IH0gZnJvbSAnLi9saW50ZXItc3VwcG9ydCdcbmltcG9ydCB7IFRvb2x0aXBSZWdpc3RyeSB9IGZyb20gJy4vdG9vbHRpcC1yZWdpc3RyeSdcbmltcG9ydCB7IENoZWNrUmVzdWx0c1Byb3ZpZGVyIH0gZnJvbSAnLi9jaGVjay1yZXN1bHRzLXByb3ZpZGVyJ1xuaW1wb3J0IHsgU3RhdHVzQmFyVmlldyB9IGZyb20gJy4vc3RhdHVzLWJhcidcbmltcG9ydCB7IFByZXR0aWZ5RWRpdG9yQ29udHJvbGxlciB9IGZyb20gJy4vcHJldHRpZnknXG5pbXBvcnQgeyBFZGl0b3JNYXJrQ29udHJvbCB9IGZyb20gJy4vZWRpdG9yLW1hcmstY29udHJvbCdcbmltcG9ydCB7IEJhY2tlbmRTdGF0dXNDb250cm9sbGVyIH0gZnJvbSAnLi9iYWNrZW5kLXN0YXR1cydcbmltcG9ydCAqIGFzIFVQSSBmcm9tICdhdG9tLWhhc2tlbGwtdXBpJ1xuaW1wb3J0ICogYXMgTGludGVyIGZyb20gJ2F0b20vbGludGVyJ1xuaW1wb3J0ICogYXMgU3RhdHVzQmFyIGZyb20gJ2F0b20vc3RhdHVzLWJhcidcbmltcG9ydCB7IGhhbmRsZVByb21pc2UgfSBmcm9tICcuL3V0aWxzJ1xuXG5leHBvcnQgeyBJUGFyYW1TdGF0ZSwgSU91dHB1dFZpZXdTdGF0ZSB9XG5cbmV4cG9ydCB0eXBlIFRFdmVudFR5cGUgPSAna2V5Ym9hcmQnIHwgJ2NvbnRleHQnIHwgJ21vdXNlJyB8ICdzZWxlY3Rpb24nXG5cbmV4cG9ydCBpbnRlcmZhY2UgSVN0YXRlIHtcbiAgY29uZmlnUGFyYW1zOiBJUGFyYW1TdGF0ZVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElFZGl0b3JDb250cm9sbGVyIHtcbiAgZGVzdHJveSgpOiB2b2lkXG59XG5cbmV4cG9ydCB0eXBlIElFZGl0b3JDb250cm9sbGVyRmFjdG9yeSA9IElFZGl0b3JDb250cm9sbGVyRmFjdG9yeVQ8XG4gIElFZGl0b3JDb250cm9sbGVyXG4+XG5cbmV4cG9ydCBpbnRlcmZhY2UgSUVkaXRvckNvbnRyb2xsZXJGYWN0b3J5VDxUPiB7XG4gIG5ldyAoZWRpdG9yOiBUZXh0RWRpdG9yLCBtYW5hZ2VyOiBQbHVnaW5NYW5hZ2VyKTogVFxuICBzdXBwb3J0c0dyYW1tYXIoZ3JhbW1hcjogc3RyaW5nKTogYm9vbGVhblxufVxuXG5leHBvcnQgdHlwZSBFQ01hcDxUIGV4dGVuZHMgSUVkaXRvckNvbnRyb2xsZXI+ID0gV2Vha01hcDxcbiAgVGV4dEVkaXRvcixcbiAgeyBjb250cm9sbGVyOiBUOyBkaXNwb3NhYmxlOiBEaXNwb3NhYmxlIH1cbj5cblxuZXhwb3J0IGNsYXNzIFBsdWdpbk1hbmFnZXIge1xuICBwdWJsaWMgcmVhZG9ubHkgcmVzdWx0c0RCOiBSZXN1bHRzREJcbiAgcHVibGljIHJlYWRvbmx5IGNvbmZpZ1BhcmFtTWFuYWdlcjogQ29uZmlnUGFyYW1NYW5hZ2VyXG4gIHB1YmxpYyByZWFkb25seSB0b29sdGlwUmVnaXN0cnk6IFRvb2x0aXBSZWdpc3RyeVxuICBwcml2YXRlIHJlYWRvbmx5IGNoZWNrUmVzdWx0c1Byb3ZpZGVyPzogQ2hlY2tSZXN1bHRzUHJvdmlkZXJcbiAgcHJpdmF0ZSBsaW50ZXJTdXBwb3J0PzogTGludGVyU3VwcG9ydFxuICBwcml2YXRlIHJlYWRvbmx5IGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxuICBwcml2YXRlIHJlYWRvbmx5IGVtaXR0ZXI6IEVtaXR0ZXI8XG4gICAge30sXG4gICAge1xuICAgICAgJ2RpZC1zYXZlLWJ1ZmZlcic6IFRleHRCdWZmZXJcbiAgICAgICdkaWQtc3RvcC1jaGFuZ2luZyc6IFRleHRCdWZmZXJcbiAgICB9XG4gID4gPSBuZXcgRW1pdHRlcigpXG4gIHByaXZhdGUgc3RhdHVzQmFyVGlsZT86IFN0YXR1c0Jhci5UaWxlXG4gIHByaXZhdGUgc3RhdHVzQmFyVmlldz86IFN0YXR1c0JhclZpZXdcbiAgcHJpdmF0ZSB3aWxsU2F2ZUhhbmRsZXJzID0gbmV3IFNldDxVUEkuVFRleHRCdWZmZXJDYWxsYmFjaz4oKVxuICBwcml2YXRlIHJlYWRvbmx5IGNvbnRyb2xsZXJzID0gbmV3IE1hcDxcbiAgICBJRWRpdG9yQ29udHJvbGxlckZhY3RvcnksXG4gICAgRUNNYXA8SUVkaXRvckNvbnRyb2xsZXI+XG4gID4oKVxuICBwcml2YXRlIHJlYWRvbmx5IGJhY2tlbmRTdGF0dXNDb250cm9sbGVyID0gbmV3IEJhY2tlbmRTdGF0dXNDb250cm9sbGVyKClcblxuICBjb25zdHJ1Y3RvcihzdGF0ZTogSVN0YXRlLCBwdWJsaWMgb3V0cHV0UGFuZWw6IE91dHB1dFBhbmVsKSB7XG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQodGhpcy5lbWl0dGVyKVxuXG4gICAgdGhpcy5yZXN1bHRzREIgPSBuZXcgUmVzdWx0c0RCKClcbiAgICB0aGlzLm91dHB1dFBhbmVsLmNvbm5lY3RSZXN1bHRzKHRoaXMucmVzdWx0c0RCKVxuICAgIHRoaXMub3V0cHV0UGFuZWwuY29ubmVjdEJzYyh0aGlzLmJhY2tlbmRTdGF0dXNDb250cm9sbGVyKVxuICAgIHRoaXMudG9vbHRpcFJlZ2lzdHJ5ID0gbmV3IFRvb2x0aXBSZWdpc3RyeSh0aGlzKVxuICAgIHRoaXMuY29uZmlnUGFyYW1NYW5hZ2VyID0gbmV3IENvbmZpZ1BhcmFtTWFuYWdlcihcbiAgICAgIHRoaXMub3V0cHV0UGFuZWwsXG4gICAgICBzdGF0ZS5jb25maWdQYXJhbXMsXG4gICAgKVxuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5hZGQoXG4gICAgICB0aGlzLmFkZEVkaXRvckNvbnRyb2xsZXIoRWRpdG9yQ29udHJvbCksXG4gICAgICB0aGlzLmFkZEVkaXRvckNvbnRyb2xsZXIoUHJldHRpZnlFZGl0b3JDb250cm9sbGVyKSxcbiAgICAgIHRoaXMuYWRkRWRpdG9yQ29udHJvbGxlcihFZGl0b3JNYXJrQ29udHJvbCksXG4gICAgKVxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2lkZS1oYXNrZWxsLm1lc3NhZ2VEaXNwbGF5RnJvbnRlbmQnKSA9PT0gJ2J1aWx0aW4nKSB7XG4gICAgICB0aGlzLmNoZWNrUmVzdWx0c1Byb3ZpZGVyID0gbmV3IENoZWNrUmVzdWx0c1Byb3ZpZGVyKHRoaXMpXG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpYmVFZGl0b3JDb250cm9sbGVyKClcbiAgfVxuXG4gIHB1YmxpYyBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMucmVzdWx0c0RCLmRlc3Ryb3koKVxuICAgIHRoaXMuZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgaWYgKHRoaXMuY2hlY2tSZXN1bHRzUHJvdmlkZXIpIHRoaXMuY2hlY2tSZXN1bHRzUHJvdmlkZXIuZGVzdHJveSgpXG5cbiAgICBoYW5kbGVQcm9taXNlKHRoaXMub3V0cHV0UGFuZWwucmVhbGx5RGVzdHJveSgpKVxuICAgIHRoaXMuY29uZmlnUGFyYW1NYW5hZ2VyLmRlc3Ryb3koKVxuICAgIHRoaXMucmVtb3ZlU3RhdHVzQmFyKClcbiAgICBpZiAodGhpcy5saW50ZXJTdXBwb3J0KSB7XG4gICAgICB0aGlzLmxpbnRlclN1cHBvcnQuZGVzdHJveSgpXG4gICAgICB0aGlzLmxpbnRlclN1cHBvcnQgPSB1bmRlZmluZWRcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VyaWFsaXplKCk6IElTdGF0ZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ1BhcmFtczogdGhpcy5jb25maWdQYXJhbU1hbmFnZXIuc2VyaWFsaXplKCksXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uV2lsbFNhdmVCdWZmZXIgPSAoY2FsbGJhY2s6IFVQSS5UVGV4dEJ1ZmZlckNhbGxiYWNrKSA9PiB7XG4gICAgdGhpcy53aWxsU2F2ZUhhbmRsZXJzLmFkZChjYWxsYmFjaylcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4gdGhpcy53aWxsU2F2ZUhhbmRsZXJzLmRlbGV0ZShjYWxsYmFjaykpXG4gIH1cblxuICBwdWJsaWMgb25EaWRTYXZlQnVmZmVyID0gKGNhbGxiYWNrOiBVUEkuVFRleHRCdWZmZXJDYWxsYmFjaykgPT5cbiAgICB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zYXZlLWJ1ZmZlcicsIGNhbGxiYWNrKVxuXG4gIHB1YmxpYyBvbkRpZFN0b3BDaGFuZ2luZyA9IChjYWxsYmFjazogVVBJLlRUZXh0QnVmZmVyQ2FsbGJhY2spID0+XG4gICAgdGhpcy5lbWl0dGVyLm9uKCdkaWQtc3RvcC1jaGFuZ2luZycsIGNhbGxiYWNrKVxuXG4gIHB1YmxpYyBhc3luYyB3aWxsU2F2ZUJ1ZmZlcihidWZmZXI6IFRleHRCdWZmZXIpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICBBcnJheS5mcm9tKHRoaXMud2lsbFNhdmVIYW5kbGVycy52YWx1ZXMoKSkubWFwKChmKSA9PiBmKGJ1ZmZlcikpLFxuICAgIClcbiAgfVxuXG4gIHB1YmxpYyBkaWRTYXZlQnVmZmVyKGJ1ZmZlcjogVGV4dEJ1ZmZlcikge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLXNhdmUtYnVmZmVyJywgYnVmZmVyKVxuICB9XG5cbiAgcHVibGljIGRpZFN0b3BDaGFuZ2luZyhidWZmZXI6IFRleHRCdWZmZXIpIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLmVtaXQoJ2RpZC1zdG9wLWNoYW5naW5nJywgYnVmZmVyKVxuICB9XG5cbiAgcHVibGljIHRvZ2dsZVBhbmVsKCkge1xuICAgIGhhbmRsZVByb21pc2UoYXRvbS53b3Jrc3BhY2UudG9nZ2xlKHRoaXMub3V0cHV0UGFuZWwpKVxuICB9XG5cbiAgcHVibGljIGNvbnRyb2xsZXIoZWRpdG9yOiBUZXh0RWRpdG9yKTogRWRpdG9yQ29udHJvbCB8IHVuZGVmaW5lZCB7XG4gICAgcmV0dXJuIHRoaXMuY29udHJvbGxlclR5cGUoRWRpdG9yQ29udHJvbCwgZWRpdG9yKVxuICB9XG5cbiAgcHVibGljIGNvbnRyb2xsZXJUeXBlPFxuICAgIFUgZXh0ZW5kcyBJRWRpdG9yQ29udHJvbGxlcixcbiAgICBUIGV4dGVuZHMgSUVkaXRvckNvbnRyb2xsZXJGYWN0b3J5VDxVPlxuICA+KGZhY3Rvcnk6IFQsIGVkaXRvcjogVGV4dEVkaXRvcik6IFUgfCB1bmRlZmluZWQge1xuICAgIGNvbnN0IGVjbWFwID0gdGhpcy5jb250cm9sbGVycy5nZXQoZmFjdG9yeSlcbiAgICBjb25zdCByZWMgPSBlY21hcCA/IGVjbWFwLmdldChlZGl0b3IpIDogdW5kZWZpbmVkXG4gICAgcmV0dXJuIHJlYyA/IChyZWMuY29udHJvbGxlciBhcyBVKSA6IHVuZGVmaW5lZFxuICB9XG5cbiAgcHVibGljIHNldExpbnRlcihsaW50ZXI6IExpbnRlci5JbmRpZURlbGVnYXRlKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnaWRlLWhhc2tlbGwubWVzc2FnZURpc3BsYXlGcm9udGVuZCcpICE9PSAnbGludGVyJykge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMubGludGVyU3VwcG9ydCA9IG5ldyBMaW50ZXJTdXBwb3J0KGxpbnRlciwgdGhpcy5yZXN1bHRzREIpXG4gIH1cblxuICBwdWJsaWMgbmV4dEVycm9yKCkge1xuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2lkZS1oYXNrZWxsLm1lc3NhZ2VEaXNwbGF5RnJvbnRlbmQnKSAhPT0gJ2J1aWx0aW4nKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5vdXRwdXRQYW5lbC5zaG93TmV4dEVycm9yKClcbiAgfVxuXG4gIHB1YmxpYyBwcmV2RXJyb3IoKSB7XG4gICAgaWYgKGF0b20uY29uZmlnLmdldCgnaWRlLWhhc2tlbGwubWVzc2FnZURpc3BsYXlGcm9udGVuZCcpICE9PSAnYnVpbHRpbicpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLm91dHB1dFBhbmVsLnNob3dQcmV2RXJyb3IoKVxuICB9XG5cbiAgcHVibGljIGZvcmNlQmFja2VuZFN0YXR1cyhwbHVnaW5OYW1lOiBzdHJpbmcsIHN0OiBVUEkuSVN0YXR1cykge1xuICAgIHRoaXMuYmFja2VuZFN0YXR1c0NvbnRyb2xsZXIuZm9yY2VCYWNrZW5kU3RhdHVzKHBsdWdpbk5hbWUsIHN0KVxuICB9XG5cbiAgcHVibGljIGdldEF3YWl0ZXIocGx1Z2luTmFtZTogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHRoaXMuYmFja2VuZFN0YXR1c0NvbnRyb2xsZXIuZ2V0QXdhaXRlcihwbHVnaW5OYW1lKVxuICB9XG5cbiAgcHVibGljIGFkZEVkaXRvckNvbnRyb2xsZXI8XG4gICAgVSBleHRlbmRzIElFZGl0b3JDb250cm9sbGVyLFxuICAgIFQgZXh0ZW5kcyBJRWRpdG9yQ29udHJvbGxlckZhY3RvcnlUPFU+XG4gID4oZmFjdG9yeTogVCk6IERpc3Bvc2FibGUge1xuICAgIGlmICh0aGlzLmNvbnRyb2xsZXJzLmhhcyhmYWN0b3J5KSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBEdXBsaWNhdGUgY29udHJvbGxlciBmYWN0b3J5ICR7ZmFjdG9yeS50b1N0cmluZygpfWApXG4gICAgfVxuICAgIGNvbnN0IG1hcDogRUNNYXA8VT4gPSBuZXcgV2Vha01hcCgpXG4gICAgdGhpcy5jb250cm9sbGVycy5zZXQoZmFjdG9yeSwgbWFwKVxuICAgIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgICB0aGlzLmNvbnRyb2xsZXJzLmRlbGV0ZShmYWN0b3J5KVxuICAgICAgZm9yIChjb25zdCB0ZSBvZiBhdG9tLndvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpKSB7XG4gICAgICAgIGNvbnN0IHJlYyA9IG1hcC5nZXQodGUpXG4gICAgICAgIGlmIChyZWMpIHJlYy5kaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgc2V0U3RhdHVzQmFyKHNiOiBTdGF0dXNCYXIuU3RhdHVzQmFyKSB7XG4gICAgdGhpcy5zdGF0dXNCYXJWaWV3ID0gbmV3IFN0YXR1c0JhclZpZXcoXG4gICAgICB0aGlzLm91dHB1dFBhbmVsLFxuICAgICAgdGhpcy5iYWNrZW5kU3RhdHVzQ29udHJvbGxlcixcbiAgICApXG4gICAgdGhpcy5zdGF0dXNCYXJUaWxlID0gc2IuYWRkUmlnaHRUaWxlKHtcbiAgICAgIGl0ZW06IHRoaXMuc3RhdHVzQmFyVmlldy5lbGVtZW50LFxuICAgICAgcHJpb3JpdHk6IDEwMCxcbiAgICB9KVxuICB9XG5cbiAgcHVibGljIHJlbW92ZVN0YXR1c0JhcigpIHtcbiAgICBpZiAodGhpcy5zdGF0dXNCYXJUaWxlKSB7XG4gICAgICB0aGlzLnN0YXR1c0JhclRpbGUuZGVzdHJveSgpXG4gICAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSB1bmRlZmluZWRcbiAgICB9XG4gICAgaWYgKHRoaXMuc3RhdHVzQmFyVmlldykge1xuICAgICAgdGhpcy5zdGF0dXNCYXJWaWV3LmRlc3Ryb3koKVxuICAgICAgdGhpcy5zdGF0dXNCYXJWaWV3ID0gdW5kZWZpbmVkXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb250cm9sbGVyT25HcmFtbWFyKGVkaXRvcjogVGV4dEVkaXRvciwgZ3JhbW1hcjogR3JhbW1hcikge1xuICAgIGZvciAoY29uc3QgW2ZhY3RvcnksIG1hcF0gb2YgdGhpcy5jb250cm9sbGVycy5lbnRyaWVzKCkpIHtcbiAgICAgIGNvbnN0IHJlYyA9IG1hcC5nZXQoZWRpdG9yKVxuICAgICAgaWYgKCFyZWMgJiYgZmFjdG9yeS5zdXBwb3J0c0dyYW1tYXIoZ3JhbW1hci5zY29wZU5hbWUpKSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgZmFjdG9yeShlZGl0b3IsIHRoaXMpXG4gICAgICAgIGNvbnN0IGRpc3Bvc2FibGUgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIGRpc3Bvc2FibGUuYWRkKFxuICAgICAgICAgIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgICAgICAgIG1hcC5kZWxldGUoZWRpdG9yKVxuICAgICAgICAgICAgY29udHJvbGxlci5kZXN0cm95KClcbiAgICAgICAgICB9KSxcbiAgICAgICAgICBlZGl0b3Iub25EaWREZXN0cm95KCgpID0+IGRpc3Bvc2FibGUuZGlzcG9zZSgpKSxcbiAgICAgICAgKVxuICAgICAgICBtYXAuc2V0KGVkaXRvciwgeyBjb250cm9sbGVyLCBkaXNwb3NhYmxlIH0pXG4gICAgICB9IGVsc2UgaWYgKHJlYyAmJiAhZmFjdG9yeS5zdXBwb3J0c0dyYW1tYXIoZ3JhbW1hci5zY29wZU5hbWUpKSB7XG4gICAgICAgIHJlYy5kaXNwb3NhYmxlLmRpc3Bvc2UoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIE9ic2VydmUgdGV4dCBlZGl0b3JzIHRvIGF0dGFjaCBjb250cm9sbGVyXG4gIHByaXZhdGUgc3Vic2NyaWJlRWRpdG9yQ29udHJvbGxlcigpIHtcbiAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChcbiAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycygoZWRpdG9yKSA9PiB7XG4gICAgICAgIGNvbnN0IGVkaXRvckRpc3AgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgICAgIGVkaXRvckRpc3AuYWRkKFxuICAgICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIoKGdyYW1tYXIpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbGxlck9uR3JhbW1hcihlZGl0b3IsIGdyYW1tYXIpXG4gICAgICAgICAgfSksXG4gICAgICAgICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XG4gICAgICAgICAgICBlZGl0b3JEaXNwLmRpc3Bvc2UoKVxuICAgICAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5yZW1vdmUoZWRpdG9yRGlzcClcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLmFkZChlZGl0b3JEaXNwKVxuICAgICAgICB0aGlzLmNvbnRyb2xsZXJPbkdyYW1tYXIoZWRpdG9yLCBlZGl0b3IuZ2V0R3JhbW1hcigpKVxuICAgICAgfSksXG4gICAgKVxuICB9XG59XG4iXX0=