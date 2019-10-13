// ~/plugins/localStorage.js
// https://www.npmjs.com/package/vuex-persistedstate 看Api文档
import createPersistedState from 'vuex-persistedstate'

export default ({store}) => {
  window.onNuxtReady(() => {
    createPersistedState({
      key: 'user', // 用于存储持久状态的密钥。（默认值：vuex） 对应浏览器 Application key
      // paths: []  // 任何路径的数组，以部分保留状态。如果没有给出路径，则完整状态将保留。（默认：[]）
    })(store)
  })
}
