<template>
    <div class="goods">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable @clear="getGoodsList" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddGoods">添加商品</el-button>
                </el-col>
            </el-row>
            <el-table :data="goodsList" border stripe>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column label='商品名称' prop="goods_name">
                </el-table-column>
                <el-table-column label='价格(元)' prop="goods_price">
                </el-table-column>
                <el-table-column label='商品重量' prop="goods_weight">
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="danger" icon='el-icon-delete' size="mini" @click="deeleteGood(scope.row.goods_id)">
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[10,20, 30, 50, 100]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    name: "Goods",
    data() {
        return {
            index: 1,
            goodsList: [],
            total: 0,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
        }
    },
    created() {
        this.getGoodsList()
    },
    methods: {
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        async getGoodsList() {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status != 200) return this.$message.error('获取商品列表失败')
            this.goodsList = res.data.goods
            this.total = res.data.total
            if (this.index == 1) {
                this.index++
                return this.$message.success('获取商品列表成功')
            }
        },
        async deeleteGood(id) {
            const confirmRusult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '删除商品', {
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err => err)
            // 用户点击了删除,则返回字符串 confirm
            // 用户取消了删除,则返回字符串 cancel
            if (confirmRusult != 'confirm') return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete(`/goods/${id}`)
            if (res.meta.status != 200) return this.$message.error('删除商品失败')
            this.getGoodsList()
            return this.$message.success('删除商品成功')
        },
        goAddGoods(){
            this.$router.push('/home/goods/add')
        }
    }
}
</script>
<style lang="less" scoped>
.goods {
    height: 100%;
    width: 100%;
}
</style>