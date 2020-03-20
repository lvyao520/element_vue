import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
import Login from "../components/Login"
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import Users from "../components/users/Users"
import Roles from "../components/roles/Roles"
import Rights from "../components/rights/Rights"
import Categories from "../components/categories/Categories"
import Params from "../components/params/Params"
import Goods from "../components/goods/Goods"
import Add from "../components/add/Add"

const routes = [{
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/home",
        // 知识点：重定向的问题
        redirect: "/welcome",
        component: Home,
        children: [
            { path: "/welcome", component: Welcome },
            { path: "/users", component: Users },
            { path: "/roles", component: Roles },
            { path: "/rights", component: Rights },
            { path: "/categories", component: Categories },
            { path: "/params", component: Params },
            { path: "/goods", component: Goods },
            { path: "/goods/add", component: Add }
        ]
    }
]

const router = new VueRouter({
        routes
    })
    // 知识点：利用token来控制页面访问权限
router.beforeEach((to, from, next) => {
    if (to.path != "/login") {
        var token = sessionStorage.getItem("token");
        if (!token) {
            next("/login"); //路由导航守卫中强制跳转到某一个路由界面
        } else {
            next();
        }
    }
    next();
});
export default router