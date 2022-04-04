import Scrollbar from './src/index.vue'


Scrollbar.install = function (Vue) {
  Vue.component(Scrollbar.name, Scrollbar)
}

export const SScrollbar = {
  install: Scrollbar.install,
  version: '1.0.0'
}

export default Scrollbar