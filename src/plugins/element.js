import Vue from 'vue'
import {
    Card, Breadcrumb, BreadcrumbItem, Button, Form, Option, Alert,
    FormItem, Input, Message, Container, Header, Aside, Cascader,
    Main, Menu, Submenu, MenuItem, Row, Col, Table, TableColumn, Tabs,
    Switch, Tooltip, Pagination, Dialog, MessageBox, Tag, Tree, Select,
    TabPane, Steps, Step, Checkbox, CheckboxGroup, Upload, Carousel, CarouselItem
} from 'element-ui'
import Timeline from './timeline/index.js'
import TimelineItem from './timeline-item/index.js'
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Main)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Option)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox