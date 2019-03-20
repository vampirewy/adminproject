import Vue from "vue";
import Router from "vue-router";
import Layout from "./views/layout/layout.vue";
import ShoppingGuide from "./views/shoppingGuide/shoppingGuide.vue";
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
      redirect: "/shoppingGuide",
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
        }
      ]
    }
  ]
});