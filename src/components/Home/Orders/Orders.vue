<template>
    <div class="orders">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="ordersList" border stripe>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column label='订单编号' prop="order_number">
                </el-table-column>
                <el-table-column label='订单价格' prop="order_price">
                </el-table-column>
                <el-table-column label='是否支付' prop="pay_status">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.pay_status==1" type="success">已付款</el-tag>
                        <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label='是否发货' prop="is_send">
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-tooltip :enterable="false" effect="dark" content="修改地址" placement="top">
                            <el-button type="primary" icon='el-icon-edit' size="mini" @click="addressed">
                            </el-button>
                        </el-tooltip>
                        <el-tooltip :enterable="false" effect="dark" content="物流信息" placement="top">
                            <el-button type="success" icon='el-icon-location' size="mini" @click="showBox">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1,3, 5, 10,]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="修改地址" :visible.sync="address" width="50%" :modal="false" @close="addressClose">
            <el-form label-width="100px" ref="addressRef" :model="addressForm" :rules="addressFormRules">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="citydata" v-model="addressForm.address1" :props="{ expandTrigger: 'hover' }">
                    </el-cascader>
                </el-form-item>
                <el-form-item label="具体地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="address = false">取 消</el-button>
                <el-button type="primary" @click="address = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="物流信息" :visible.sync="showBoxed" width="50%" :modal="false">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.time">
                    {{activity.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script>
import citydata from './citydata.js'
export default {
    name: "Orders",
    data() {
        return {
            index: 1,
            ordersList: [],
            total: 0,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            address: false,
            addressForm: {},
            addressFormRules: {
                address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
                address2: [{ required: true, message: '请输入具体地址', trigger: 'blur' }]
            },
            citydata,
            showBoxed: false,
            activities: [{
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "已签收,感谢使用顺丰,期待再次为您服务",
                "location": ""
            },
            {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件",
                "location": ""
            },
            {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "快件到达 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]",
                "location": ""
            },
            {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "快件到达 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]",
                "location": ""
            },
            {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "顺丰速运 已收取快件",
                "location": ""
            },
            {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "卖家发货",
                "location": ""
            },
            {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "您的订单将由HLA（北京海淀区清河中街店）门店安排发货。",
                "location": ""
            },
            {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "商品已经下单",
                "location": ""
            }]
        }
    },
    created() {
        this.getOrdersList()
    },
    methods: {
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrdersList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrdersList()
        },
        async getOrdersList() {
            const { data: res } = await this.$http.get('/orders', { params: this.queryInfo })
            if (res.meta.status != 200) return this.$message.error('获取订单列表失败')
            this.ordersList = res.data.goods
            this.total = res.data.total
            if (this.index == 1) {
                this.index++
                return this.$message.success('获取订单列表成功')
            }
        },
        addressClose() {
            this.$refs.addressRef.resetFields()
        },
        addressed() {
            this.address = true
        },
        async showBox() {
            this.showBoxed = true
        }
    }
}
</script>
<style lang="less" scoped>
@import '@/plugins/timeline/timeline.css';
@import '@/plugins/timeline-item/timeline-item.css';

.orders {
    height: 100%;
    width: 100%;
}
</style>