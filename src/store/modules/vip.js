import{reqmemberList} from "../../utils/http"
export const state = {
    //初始化列表
    list: []


}
export const mutations = {
    changeList(state, arr) {
        state.list = arr
    }

}

export const actions = {
   //发起请求
   reqList(context){
    reqmemberList().then(res=>{
        context.commit("changeList",res.data.list)
    })
   }
}

export const getters = {
    list(state) {
        return state.list
    }
}

export default {
    state, mutations, actions, getters,
    namespaced: true
}