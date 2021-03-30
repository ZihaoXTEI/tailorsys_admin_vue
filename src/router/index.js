import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('../views/Login.vue')
const Home = () => import('../views/layout/Home.vue')
const Welcome = () => import('../views/Welcome.vue')
const Ordercalendar = () => import('../views/plan/Ordercalendar.vue')
const OrderCard = () => import('../views/plan/OrderCard.vue')
const FabricType = () => import('../views/data/FabricType.vue')
const ClothType = () => import('../views/data/ClothType.vue')
const ClothConsumption = () => import('../views/data/ClothConsumption.vue')
const FabricInbound = () => import('../views/stock/FabricInbound.vue')
const FabricStock = () => import('../views/stock/FabricStock.vue')
const FabricStockUpdate = () => import('../views/stock/UpdateFabricStock.vue')
const Supplier = () => import('../views/stock/Supplier.vue')
const Customer = () => import('../views/order/Customer.vue')
const NewOrder = () => import('../views/order/NewOrder.vue')
const Order = () => import('../views/order/Order.vue')
const OrderDetail = () => import('../views/order/OrderDetail.vue')
const InventoryStatistics = () => import('../views/statistics/InventoryStatistics.vue')
const OrderStatistics = () => import('../views/statistics/OrderStatistics.vue')
const Users = () => import('../views/settings/Users.vue')
const DownLoadExcel = () => import('../views/settings/DownLoadExcel.vue')
/**const Users = () => import('../views/settings/Users.vue')
const FabricInbound = () => import('../views/stock/FabricInbound.vue')
const FabricStock = () => import('../views/stock/FabricStock.vue')
const FabricStockUpdate = () => import('../views/stock/UpdateFabricStock.vue')
const Supplier = () => import('../views/stock/Supplier.vue')
const FabricType = () => import('../views/data/FabricType.vue')
const ClothType = () => import('../views/data/ClothType.vue')
const ClothConsumption = () => import('../views/data/ClothConsumption.vue')
const Customer = () => import('../views/order/Customer.vue')
const NewOrder = () => import('../views/order/NewOrder.vue')
const Ordercalendar = () => import('../views/plan/Ordercalendar.vue')
const OrderCard = () => import('../views/plan/OrderCard.vue')*/

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', meta: { title: '登录' }, component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', meta: { title: '欢迎' }, component: Welcome },
    { path: '/ordercalendar', meta: { title: '事务月历' }, component: Ordercalendar },
    { path: '/ordercard', meta: { title: '订单流程' }, component: OrderCard },
    { path: '/fabrictype', meta: { title: '布料类型信息' }, component: FabricType },
    { path: '/clothtype', meta: { title: '服装类型信息' }, component: ClothType },
    { path: '/clothconsumption', meta: { title: '服装用料信息' }, component: ClothConsumption },
    { path: '/fabricinbound', meta: { title: '布料入库' }, component: FabricInbound },
    { path: '/fabricstock', meta: { title: '布料库存' }, component: FabricStock },
    { path: '/fabricstock/update', meta: { title: '修改布料信息' }, component: FabricStockUpdate },
    { path: '/supplier', meta: { title: '供应商管理' }, component: Supplier },
    { path: '/customer', meta: { title: '顾客信息管理' }, component: Customer },
    { path: '/neworder', meta: { title: '新建订单' }, component: NewOrder },
    { path: '/order', meta: { title: '订单管理' }, component: Order },
    { path: '/order/orderdetail', meta: { title: '订单详情' }, component: OrderDetail },
    { path: '/inventorystatistics', meta: { title: '库存统计' }, component: InventoryStatistics },
    { path: '/orderstatistics', meta: { title: '订单统计' }, component: OrderStatistics },
    { path: '/users', meta: { title: '用户管理' }, component: Users },
    { path: '/downloadexcel', meta: { title: '数据下载' }, component: DownLoadExcel }
      /**{ path: '/users', meta: { title: '用户管理' }, component: Users },
      { path: '/fabricinbound', meta: { title: '布料入库' }, component: FabricInbound },
      { path: '/fabricstock', meta: { title: '布料库存' }, component: FabricStock },
      { path: '/fabricstock/update', meta: { title: '修改布料信息' }, component: FabricStockUpdate },
      { path: '/supplier', meta: { title: '供应商管理' }, component: Supplier },
      { path: '/fabrictype', meta: { title: '布料类型' }, component: FabricType },
      { path: '/clothtype', meta: { title: '服装类型' }, component: ClothType },
      { path: '/clothconsumption', meta: { title: '服装用料' }, component: ClothConsumption },
      { path: '/customer', meta: { title: '顾客信息管理' }, component: Customer },
      { path: '/neworder', meta: { title: '新建订单' }, component: NewOrder },
      { path: '/ordercalendar', meta: { title: '事务月历' }, component: Ordercalendar },
      { path: '/ordercard', meta: { title: '订单卡' }, component: OrderCard }*/


    ]
  }
]

const router = new VueRouter({
  routes,
})

router.beforeEach((to, from, next) => {
  //设置页面标题
  window.document.title = to.meta.title + '-制衣店信息管理系统';
  next();

})



export default router
