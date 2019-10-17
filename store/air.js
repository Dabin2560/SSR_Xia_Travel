// 固定写法 暴露出state，准备保存
export const state = ()=> {
  return {
    history:[],
  }

}

// 存放的是同步修改state的方法
export const mutations = {
  // mutation下的值，必须是一个函数，函数中会有一个固定的参数state，
  // 第二个参数是用户调用方法时候传进来
  setHistory(state,data){
    // 数组前添加  [{历史3},{历史2},{历史1}]
    state.history.unshift(data)
  },

}




