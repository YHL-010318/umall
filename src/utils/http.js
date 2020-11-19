import axios from "axios"
import qs from "qs"
import { errorAlert } from './alert'
import store from "../store"
import router from "../router"
import Vue from "vue"

//开发环境下使用——8080
let baseUrl = "/aa"
Vue.prototype.$imgPre = "http://localhost:3000"


//生产环境使用——打包
// let baseUrl=""
// Vue.prototype.$imgPre=""


//请求拦截
axios.interceptors.request.use(req => {
    if (req.url != baseUrl + "/api/userlogin") {
        req.headers.authorization = store.state.userInfo.token
    }
    return req

})

// 响应拦截
axios.interceptors.response.use(res => {
    console.log("本次请求的地址是：" + res.config.url);
    console.log(res);
    //统一失败处理
    if (res.data.code != 200) {
        errorAlert(res.data.msg)
    }
    if (res.data.msg === "登录已过期或访问权限受限") {
        //清除登录信息
        store.dispatch('changeUser', {})
        //跳转到登录页
        router.push("/login")
    }
    return res
})


// ===========菜单接口 开始====================
//添加
export const reqMenuAdd = (form) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data: qs.stringify(form)
    })
}

//菜单列表

export const reqMenuLisr = () => {
    return axios({
        url: baseUrl + "/api/menulist",
        method: "get",
        params: {
            istree: true
        }

    })
}

//菜单删除

export const reqMenuDel = (id) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data: qs.stringify({ id: id })

    })
}

//菜单获取（一条）

export const reqMenuDetail = (id) => {
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params: {
            id: id
        }

    })
}

//菜单修改

export const reqMenuUpdate = (form) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data: qs.stringify(form)

    })
}

// ===========菜单接口 结束====================

// ===========角色接口 开始====================

//角色添加
export const reqRoleAdd = (user) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data: qs.stringify(user)
    })
}


//角色列表
export const reqRoleList = () => {
    return axios({
        url: baseUrl + "/api/rolelist",
        method: "get",
    })
}

//角色删除
export const reqRoleDel = (id) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

//角色获取（一条）
export const reqRoleInfo = (id) => {
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: "get",
        params: {
            id: id
        }

    })
}


//角色修改

export const roleEdit = (user) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data: qs.stringify(user)

    })
}

// ===========角色接口 结束====================


// ===========管理员管理接口 开始====================

//管理员添加
export const reqUseradd = (user) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data: qs.stringify(user)
    })
}


//管理员列表
export const reqUserlist = (p) => {
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params: p
    })
}

//管理员删除
export const reqUserdelete = (uid) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data: qs.stringify({
            uid: uid
        })
    })
}

//管理员获取（一条）
export const reqUserinfo = (uid) => {
    return axios({
        url: baseUrl + "/api/userinfo",
        method: "get",
        params: {
            uid: uid
        }

    })
}

// 管理员总数（用于计算分页）
export const reqUsercount = () => {
    return axios({
        url: baseUrl + "/api/usercount",
        method: "get",
    })
}
//管理员修改

export const reqUseredit = (user) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: "post",
        data: qs.stringify(user)

    })
}


//管理员登录

export const reqUserlogin = (user) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data: qs.stringify(user)

    })
}

// ===========管理员管理接口 结束====================


// ===========商品分类接口 开始====================

// 商品分类添加

export const reqcateAdd = (cate) => {
    let d = new FormData()
    for (let i in cate) {
        d.append(i, cate[i])
    }
    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data: d
    })
}


//商品分类列表 p={istree:true}  p={pid:1}
export const reqcateList = (p) => {
    return axios({
        url: baseUrl + "/api/catelist",
        method: "get",
        params: p
    })
}

//商品分类删除
export const reqcateDel = (id) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

// 商品分类详情
export const reqcateDetail = id => {
    return axios({
        url: baseUrl + "/api/cateinfo",
        method: "get",
        params: {
            id: id
        }
    })
}
// 商品分类修改
export const reqcateUpdate = (cate) => {
    let d = new FormData()
    for (let i in cate) {
        d.append(i, cate[i])
    }
    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data: d
    })
}

// ===========商品分类接口 结束====================


// ===========商品规格接口 开始====================

// 商品规格添加

export const reqspecsAdd = (user) => {

    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data: qs.stringify(user)
    })
}

//商品规格列表 p={page:1,size:10}
export const reqspecsList = (p) => {
    return axios({
        url: baseUrl + "/api/specslist",
        method: "get",
        params: p
    })
}
//商品规格删除
export const reqspecsDel = (id) => {
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}


// 商品规格详情
export const reqspecsDetail = id => {
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

// 商品规格修改
export const reqspecsUpdate = (user) => {

    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data: qs.stringify(user)
    })
}

//商品规格总数（用于计算分页）

export const reqspecsCount = () => {

    return axios({
        url: baseUrl + "/api/specscount",
        method: "get",
    })
}

// ===========商品规格接口 结束====================


// ===========会员管理接口 开始====================

//会员列表
export const reqmemberList = () => {

    return axios({
        url: baseUrl + "/api/memberlist",
        method: "get",
    })
}

// 会员获取一条详情
export const reqmemberInfo = uid => {
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: "get",
        params: {
            uid: uid
        }
    })
}

// 会员修改
export const reqmemberEdit = (user) => {

    return axios({
        url: baseUrl + "/api/memberedit",
        method: "post",
        data: qs.stringify(user)
    })
}

// ===========会员管理接口 结束====================

// ===========轮播图接口 开始====================

// 轮播图添加

export const reqbannerAdd = (banner) => {
    let d = new FormData()
    for (let i in banner) {
        d.append(i, banner[i])
    }
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data: d
    })
}
//轮播图列表
export const reqbannerList = () => {
    return axios({
        url: baseUrl + "/api/bannerlist",
        method: "get",

    })
}
//轮播图获取（一条）
export const reqbannerInfo = id => {
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

// 轮播图修改
export const reqbannerUpdate = (banner) => {
    let d = new FormData()
    for (let i in banner) {
        d.append(i, banner[i])
    }
    return axios({
        url: baseUrl + "/api/banneredit",
        method: "post",
        data: d
    })
}

//轮播图删除
export const reqbannerDel = (id) => {
    return axios({
        url: baseUrl + "/api/bannerdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}


// ===========轮播图接口 结束====================

// ===========限时秒杀接口 开始====================

// 限时秒杀添加
export const reqseckAdd = (user) => {

    return axios({
        url: baseUrl + "/api/seckadd",
        method: "post",
        data: qs.stringify(user)
    })
}

//限时秒杀列表
export const reqseckList = () => {
    return axios({
        url: baseUrl + "/api/secklist",
        method: "get",

    })
}

//限时秒杀获取（一条）
export const reqseckInfo = id => {
    return axios({
        url: baseUrl + "/api/seckinfo",
        method: "get",
        params: {
            id: id
        }
    })
}

// 限时秒杀修改
export const reqseckEdit = (user) => {

    return axios({
        url: baseUrl + "/api/seckedit",
        method: "post",
        data: qs.stringify(user)
    })
}

//限时秒杀删除
export const reqseckDel = (id) => {
    return axios({
        url: baseUrl + "/api/seckdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}
// ===========限时秒杀接口 结束====================



// ===========商品管理接口 开始====================
// 商品管理添加——文件
export const reqgoodsAdd = (user) => {
    let d=new FormData()
    for(let i in user){
        d.append(i,user[i])
    }
    return axios({
        url: baseUrl + "/api/goodsadd",
        method: "post",
        data:d
    })
}

//18.商品管理列表 p={page:1,size:10}
export const reqgoodsList = (p) => {
    return axios({
        url: baseUrl + "/api/goodslist",
        method: "get",
        params: p
    })
}

//26.商品管理删除
export const reqgoodsDel = (id) => {
    return axios({
        url: baseUrl + "/api/goodsdelete",
        method: "post",
        data: qs.stringify({
            id: id
        })
    })
}

// 33.商品管理详情
export const reqgoodsDetail = id => {
    return axios({
        url: baseUrl + "/api/goodsinfo",
        method: "get",
        params: {
            id: id
        }
    })
}



// 38.商品管理修改——文件
export const reqgoodsUpdate = (user) => {
    let d=new FormData()
    for(let i in user){
        d.append(i,user[i])
    }
    return axios({
        url: baseUrl + "/api/goodsedit",
        method: "post",
        data: d
    })
}
export const reqgoodsCount = () => {
   
    return axios({
        url: baseUrl + "/api/goodscount",
        method: "get",
    })
}

// ===========商品管理接口 结束====================

