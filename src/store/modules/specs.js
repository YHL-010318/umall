import { reqspecsList, reqspecsCount } from "../../utils/http"
export const state = {
    //初始化列表
    list: [],
    //初始化参数
    page: 1,
    size: 2,
    //总数   
    total: 0,


}
export const mutations = {
    changeList(state, arr) {
        state.list = arr
        console.log(state.list);
    },
    changePage(state, page) {
        state.page = page;
    },
    changeTotal(state, num) {
        state.total = num;
    },

}

export const actions = {
    //发起请求
    reqList(context,bool) {
        //参数true，是为了取到所有的规格
        let params=bool?{}:{page:context.state.page,size:context.state.size}
        reqspecsList(params).then(res => {
            //判断返回的有没有值如果没有值list就等于一个空数组
            let list = res.data.list ? res.data.list : []

            if (list.length == 0 && context.state.page > 1) {
                context.commit("changePage", context.state.page - 1)
                context.dispatch("reqList");
                return;
            }

            list.forEach(item => {
                item.attrs = JSON.parse(item.attrs)
               
            })
            context.commit("changeList", list)
         
        })
    },
    //请总数
    reqCount(context) {
        reqspecsCount().then(res => {
            context.commit("changeTotal", res.data.list[0].total)
        })
    },
    //修改页码
    changePage(context, page) {
        //修改页码
        context.commit("changePage", page)
        //从新请求数据
        context.dispatch("reqList")
    }


}

export const getters = {
    list(state) {
        return state.list
    },
    size(state) {
        return state.size
    },
    total(state) {
        return state.total
    },
}

export default {
    state, mutations, actions, getters,
    namespaced: true
}