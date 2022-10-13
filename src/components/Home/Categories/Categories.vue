<template>
    <div class="categories">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="getFatherCatList">添加分类</el-button>
                </el-col>
            </el-row>
            <tree-table class="treeTable" border :selection-type="false" show-index index-text="#" :expand-type="false"
                :data="categoriesList" :columns="columns">
                <template slot="isok" slot-scope="scope">
                    <i style='color:lightgreen' class="el-icon-success" v-if="scope.row.cat_deleted==false"></i>
                    <i style='color:red' class="el-icon-error" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="setCated(scope.row.cat_id)">编辑
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCat(scope.row.cat_id)">删除
                    </el-button>
                </template>
            </tree-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1,2, 3, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="categoriesTotal">
            </el-pagination>
        </el-card>
        <el-dialog title="添加分类" :visible.sync="addCat" width="50%" :modal="false" @close="addCatClose">
            <el-form label-width="80px" ref="addCatFormRef" :model="addCatForm" :rules="addCatRules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCatForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <el-cascader v-model="fatherCatIdList" :options="fatherCatList"
                        :props="{ expandTrigger: 'hover',...fatherCatProps, checkStrictly: 'true' }"
                        @change="fatherCatIdChange" :clearable="true">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addCat = false">取 消</el-button>
                <el-button type="primary" @click="addCatClick">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改分类名" :visible.sync="setCat" width="50%" :modal="false" @close="setCatClose">
            <el-form label-width="80px" ref="setCatFormRef" :model="setCatForm" :rules="setCatRules">
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="setCatForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setCat = false">取 消</el-button>
                <el-button type="primary" @click="setCatClick">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "Categories",
    data() {
        return {
            index: 1,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            addCat: false,
            categoriesList: [],
            categoriesTotal: 0,
            columns: [
                {
                    label: '商品名称',
                    prop: 'cat_name'
                },
                {
                    label: '是否有效',
                    type: 'template',
                    template: 'isok'
                },
                {
                    label: '排序',
                    type: 'template',
                    template: 'order'
                },
                {
                    label: '操作',
                    type: 'template',
                    template: 'opt'
                }
            ],
            addCatForm: {
                cat_level: 0,
                cat_name: '',
                cat_pid: 0
            },
            addCatRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                ]
            },
            fatherCatList: [],
            fatherCatProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            fatherCatIdList: [],
            setCat: false,
            setCatForm: {},
            setCatRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 2, max: 6, message: '分类名称长度为2到6位', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getCategoriesList()
    },
    methods: {
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCategoriesList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCategoriesList()
        },
        async getCategoriesList() {
            const { data: res } = await this.$http.get('/categories', { params: this.queryInfo })
            if (res.meta.status != 200) return this.$message.error('获取商品列表失败')
            this.categoriesList = res.data.result
            this.categoriesTotal = res.data.total
            if (this.index == 1) {
                this.index++
                return this.$message.success('获取商品列表成功')
            }
        },
        async getFatherCatList() {
            const { data: res } = await this.$http.get('/categories', { params: { type: 2 } })
            if (res.meta.status != 200) return this.$message.error('获取父级商品列表失败')
            this.fatherCatList = res.data
            this.addCat = true
            return this.$message.success('获取父级商品列表成功')
        },
        addCatClose() {
            this.$refs.addCatFormRef.resetFields()
            this.fatherCatIdList = []
            this.addCatForm.cat_pid = 0
            this.addCatForm.cat_level = 0
        },
        fatherCatIdChange() {
            if (this.fatherCatIdList.length > 0) {
                this.addCatForm.cat_pid = this.fatherCatIdList[this.fatherCatIdList.length - 1]
                this.addCatForm.cat_level = this.fatherCatIdList.length
            } else {
                this.addCatForm.cat_pid = 0
                this.addCatForm.cat_level = 0
            }
        },
        addCatClick() {
            this.$refs.addCatFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('/categories', this.addCatForm)
                console.log(res.meta)
                if (res.meta.status != 201) return this.$message.error('添加商品分类失败')
                this.getCategoriesList()
                this.addCat = false
                return this.$message.success('添加商品分类成功')
            })
        },
        async setCated(id) {
            const { data: res } = await this.$http.get('/categories/' + id)
            if (res.meta.status != 200) return this.$message.error('该分类删除失败')
            this.setCatForm = res.data
            console.log(this.setCatForm)
            this.setCat = true
        },
        setCatClose() {
            this.$refs.setCatFormRef.resetFields()
        },
        setCatClick() {
            this.$refs.setCatFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put('categories/' + this.setCatForm.cat_id, { cat_name: this.setCatForm.cat_name })
                if (res.meta.status != 200) return this.$message.error('修改分类名失败')
                this.getCategoriesList()
                this.setCat = false
                return this.$message.success('修改分类名成功')
            })
        },
        async deleteCat(id) {
            const confirmRusult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '删除分类', {
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err => err)
            // 用户点击了删除,则返回字符串 confirm
            // 用户取消了删除,则返回字符串 cancel
            if (confirmRusult != 'confirm') return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete('/categories/' + id)
            if (res.meta.status != 200) return this.$message.error('该分类删除失败')
            this.queryInfo.pagenum = 1
            this.queryInfo.pagesize = 5
            this.getCategoriesList()

            return this.$message.success('该分类已经删除')
        }
    }
}
</script>
<style lang="less" scoped>
.categories {
    height: 100%;
    width: 100%;

    .treeTable {
        margin-top: 2%
    }

    .el-cascader {
        width: 100%;
    }

    .el-scrollbar__wrap {
        overflow: auto;
        height: 100%;
    }
}
</style>