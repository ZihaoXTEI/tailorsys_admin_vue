import Vue from 'vue'
import { Button, Tooltip } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'
import { Container, Header, Aside, Main } from 'element-ui'
import { Menu, Submenu, MenuItemGroup, MenuItem } from 'element-ui'
import { Breadcrumb, BreadcrumbItem } from 'element-ui'
import { Card, Row, Col, Pagination } from 'element-ui'
import { Table, TableColumn, Switch } from 'element-ui'
import { Dialog } from 'element-ui'

Vue.use(Button)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Dialog)
Vue.prototype.$message = Message