<template>
    <div class="rights">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-table :data="rightsList" border stripe>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="authName" label="权限名称">
                </el-table-column>
                <el-table-column prop="path" label="路径">
                </el-table-column>
                <el-table-column prop="level" label="权限等级">
                    <template v-slot="scope">
                        <el-tag v-if="scope.row.level == 0">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level == 1">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>

export default {
    name: "Rights",
    data() {
        return {
            rightsList: []
        }
    },
    created() {
        this.getRightsList()
    },
    methods: {
        async getRightsList() {
            const {data:res} = await this.$http.get('/rights/list');
            if (res.meta.status!=200)return this.$message.error('获取权限列表失败')
            this.rightsList = res.data
            return this.$message.success('获取权限列表成功')
        }
    }
}
</script>
<style lang="less" scoped>
.rights {
    height: 100%;
    width: 100%;
}
</style>