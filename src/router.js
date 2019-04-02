import Vue from "vue";
import Router from "vue-router";
import Layout from "./views/layout/layout.vue";
import ShoppingGuide from "./views/shoppingGuide/shoppingGuide.vue";
import GoodsAttr from "./views/goodsAttr/brandmanage.vue";
// import AddShopping from "./views/shoppingGuide/addShopping.vue";
// import SpecialGuide from "./views/specialGuide/specialGuide.vue";
// import AddSpecial from "./views/specialGuide/addSpecial.vue";
// import SpecialInfor from "@/views/specialGuide/aboutSpecial/specialInfor.vue";
// import SpecialGood from "@/views/specialGuide/aboutSpecial/specialGood.vue";
Vue.use(Router);

export default new Router({
  routes: [{
    path: "/",
    name: "layOut",
    // redirect: window.location.href.split("/#")[1],
    redirect: localStorage.getItem('cityCode') == 'manager' ? '/brandmanage' : '/shoppingGuide',
    component: Layout,
    children: [{
        path: "/shoppingGuide",
        name: "shoppingGuide",
        meta: ['导购管理', '导购列表'],
        component: ShoppingGuide
      }, {
        path: "addshopping",
        name: "addshopping",
        meta: ['导购管理', '导购设置'],
        component: () => import( /* webpackChunkName: "addShopping" */ "./views/shoppingGuide/addshopping.vue")
        // component: AddShopping
      }, {
        path: "specialguide",
        name: "specialGuide",
        meta: ['专题管理', '专题列表'],
        component: () => import( /* webpackChunkName: "specialGuide" */ "./views/specialGuide/specialguide.vue")
        // component: SpecialGuide
      },
      // }, {
      //   path: "/addspecial",
      //   name: "addSpecial",
      //   meta: ['专题管理', '设置'],
      //   component: AddSpecial
      // },
      {
        path: 'specialinfor',
        name: 'infor',
        meta: ['专题管理', '信息'],
        component: () => import( /* webpackChunkName: "specialInfor" */ "./views/specialGuide/aboutSpecial/specialinfor.vue")
        // component: SpecialInfor
      },
      {
        path: 'specialgood',
        name: 'goods',
        meta: ['专题管理', '商品'],
        component: () => import( /* webpackChunkName: "specialGood" */ "./views/specialGuide/aboutSpecial/specialgood.vue")
        // component: SpecialGood
      },
      {
        path: 'brandmanage',
        name: 'brandmanage',
        meta: ['商品属性', '品牌管理'],
        component: GoodsAttr
      },
      {
        path: 'popmanager',
        name: 'popmanager',
        meta: ['弹窗管理', '列表'],
        component: () => import( /* webpackChunkName: "popmanager" */ "./views/popmanager/popmanager.vue")
      },
      {
        path: 'addpop',
        name: 'addpop',
        meta: ['弹窗管理', '添加'],
        component: () => import( /* webpackChunkName: "addpop" */ "./views/popmanager/add/addpop.vue")
      },
    ]
  }]
});