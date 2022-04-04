export class ScrollEvent {
  constructor(el) {
    this.el = el;
    this.events = {}
  }

  listen (type, fn) {
    (this.events[type] || (this.events[type] = [])).push(fn);
    this.el.addEventListener(type, fn, { passive: false })
  }

  remove (type) {
    const callbacks = this.events[type]
    callbacks && callbacks.forEach((fn) => {
      this.el.removeEventListener(type, fn)
    })
  }

  removeAll () {
    Object.keys(this.events).forEach(type => {
      this.remove(type)
    })
  }

  removeThat (type, fn) {
    const callbacks = this.events[type]
    const index = callbacks.indexOf(fn)
    if (index === -1) {
      return false
    }
    this.el.removeElementListener(type, callbacks[index])
    return true
  }
}


export function bindMouse (el, fn1, fn2) {
  el.listen('mouseenter', fn1)
  el.listen('mouseleave', fn2)
  return function () {
    el.remove('mouseenter')
    el.remove('mouseleave')
  }
}