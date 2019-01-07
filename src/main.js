import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import colors from 'vuetify/es5/util/colors'
import VueLazyload from 'vue-lazyload'
import Velocity from 'velocity-animate'

import 'vuetify/dist/vuetify.min.css'
import './base/scss/index.scss'

import Vuetify from 'vuetify'

import { Ripple } from 'vuetify/es5/directives'

Vue.use(VueLazyload, {
  loading: require('base/images/default.png')
})

Vue.use(Vuetify, {
  theme: {
    primary: colors.yellow.darken1
  },
  directives: {
    Ripple
  }
})

Vue.prototype.$velocity = Velocity

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
