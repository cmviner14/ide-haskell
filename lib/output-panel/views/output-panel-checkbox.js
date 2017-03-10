"use babel"
/** @jsx etch.dom */

const {Emitter, CompositeDisposable} = require('atom');
const etch = require('etch');
const $ = etch.dom;

export class OutputPanelCheckbox {
  constructor({enabled = false} = {}) {
    this.state = enabled;
    this.disposables = new CompositeDisposable
    this.disposables.add(this.emitter = new Emitter)
    etch.initialize(this);
    this.disposables.add(atom.tooltips.add(this.element, {
      title: () => {
        if(this.getFileFilter())
          return "Show current file messages"
        else
          return "Show all project messages"
      }
    }));
  }

  render () {
    return (
      <ide-haskell-checkbox
        class={this.state?'enabled':''}
        on={{click: this.toggleFileFilter}}/>
    );
  }

  update() {
    return etch.update(this)
  }

  onCheckboxSwitched(callback){
    this.emitter.on('checkbox-switched', callback)
  }

  setFileFilter(state) {
    this.state = state;
    this.emitter.emit('checkbox-switched', this.state)
    this.update();
  }

  getFileFilter() {
    return this.state;
  }

  toggleFileFilter() {
    this.setFileFilter(! this.getFileFilter())
  }

  async destroy() {
    await etch.destroy(this)
    this.disposables.dispose()
  }
}