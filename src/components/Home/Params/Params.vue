<template>
    <div class="params">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false">
            </el-alert>
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：
                        <el-cascader v-model="categoriessIdList" :options="categoriessList"
                            :props="{ expandTrigger: 'hover',...categoriessProps }" @change="categoriessIdChange"
                            :clearable="true">
                        </el-cascader>
                    </span>
                </el-col>
            </el-row>
            <el-tabs @tab-click="tabclick" v-model="activeName">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="active=true">添加参数
                    </el-button>
                    <el-table :data="attributeslist" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClose(scope.row,index)">
                                    {{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon='el-icon-edit' size="mini"
                                    @click="getActived(scope.row.attr_id)"></el-button>
                                <el-button type="danger" icon='el-icon-delete' size="mini"
                                    @click="deleteActived(scope.row.attr_id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="active=true">添加属性
                    </el-button>
                    <el-table :data="attributeslist" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-tag v-for="(item,index) in scope.row.attr_vals" :key="index" closable
                                    @close="handleClose(scope.row,index)">
                                    {{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column prop="attr_name" label="属性名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon='el-icon-edit' size="mini"
                                    @click="getActived(scope.row.attr_id)"></el-button>
                                <el-button type="danger" icon='el-icon-delete' size="mini"
                                    @click="deleteActived(scope.row.attr_id)"></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <el-dialog :title="activeName=='only'?'添加静态属性':'添加动态参数'" :visible.sync="active" width="50%" :modal="false"
            @close="addactive">
            <el-form label-width="80px" ref="activeRef" :model="addActiveForm" :rules="addActiveRules">
                <el-form-item :label="activeName=='only'?'静态属性':'动态参数'" prop="attr_name">
                    <el-input v-model="addActiveForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="active = false">取 消</el-button>
                <el-button type="primary" @click="addActived">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="activeName=='only'?'修改静态属性':'修改动态参数'" :visible.sync="setActive" width="50%" :modal="false"
            @close="setactives">
            <el-form label-width="80px" ref="setActiveRef" :model="setActiveForm" :rules="setActiveRules">
                <el-form-item :label="activeName=='only'?'静态属性':'动态参数'" prop="attr_name">
                    <el-input v-model="setActiveForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setActive = false">取 消</el-button>
                <el-button type="primary" @click="setActived">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "Params",
    data() {
        return {
            onlyIndex: 1,
            manyIndex: 1,
            categoriessList: [],
            categoriessIdList: [],
            categoriessProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            activeName: 'many',
            active: false,
            attributeslist: [],
            addActiveForm: {},
            addActiveRules: {
                attr_name: [
                    { required: true, message: '请输入添加的内容', trigger: 'blur' }
                ]
            },
            setActive: false,
            setActiveForm: {},
            setActiveRules: {
                attr_name: [
                    { required: true, message: '请输入修改的内容', trigger: 'blur' },
                ]
            },
        }

    },
    created() {
        this.getCategoriessList()
    },
    methods: {
        async getCategoriessList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status != 200) return this.$message.error('获取商品失败')
            this.categoriessList = res.data
        },
        categoriessIdChange() {
            if (this.categoriessIdList.length != 3) {
                this.categoriessIdList = []
                this.attributeslist = []
                return this.$message.error('请选择三级商品分类')
            }
            this.onlyIndex = 1
            this.manyIndex = 1
            this.tabclick()
        },
        async tabclick() {
            if (this.categoriessIdList.length != 3) {
                this.categoriessIdList = []
            }
            else {
                if (this.activeName == 'only') {
                    const { data: res } = await this.$http.get(`categories/${this.categoriessIdList[2]}/attributes`, { params: { sel: this.activeName } })
                    if (res.meta.status != 200) return this.$message.error('获取静态属性失败')
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        item.inputVisible = false
                        item.inputValue = ''
                    })
                    this.attributeslist = res.data
                    if (this.onlyIndex == 1) {
                        this.onlyIndex++
                        return this.$message.success('获取静态属性成功')
                    }
                } else {
                    const { data: res } = await this.$http.get(`categories/${this.categoriessIdList[2]}/attributes`, { params: { sel: this.activeName } })
                    if (res.meta.status != 200) return this.$message.error('获取动态参数失败')
                    res.data.forEach(item => {
                        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                        item.inputVisible = false
                        item.inputValue = ''
                    })
                    this.attributeslist = res.data
                    if (this.manyIndex == 1) {
                        this.manyIndex++
                        return this.$message.success('获取动态参数成功')
                    }
                }
            }
        },
        addactive() {
            this.$refs.activeRef.resetFields()
        },
        async addActived() {
            this.$refs.activeRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(`/categories/${this.categoriessIdList[2]}/attributes`,
                    { attr_name: this.addActiveForm.attr_name, attr_sel: this.activeName })
                if (res.meta.status != 201) return this.$message.error('添加内容失败')
                this.tabclick()
                this.active = false
                return this.$message.success('添加内容成功')
            })
        },
        async getActived(id) {
            this.attrID = id
            if (this.activeName == 'only') {
                const { data: res } = await this.$http.get(`categories/${this.categoriessIdList[2]}/attributes/${id}`, { params: { sel: this.activeName } })
                if (res.meta.status != 200) return this.$message.error('获取静态属性失败')
                this.setActiveForm = res.data
            } else {
                const { data: res } = await this.$http.get(`categories/${this.categoriessIdList[2]}/attributes/${id}`, { params: { sel: this.activeName } })
                if (res.meta.status != 200) return this.$message.error('获取动态参数失败')
                this.setActiveForm = res.data
            }
            this.setActive = true
        },
        setactives() {
            this.$refs.setActiveRef.resetFields()
        },
        async setActived() {
            const { data: res } = await this.$http.put(`categories/${this.categoriessIdList[2]}/attributes/${this.setActiveForm.attr_id}`,
                { attr_name: this.setActiveForm.attr_name, attr_sel: this.activeName })
            if (res.meta.status != 200) return this.$message.error('修改内容失败')
            this.tabclick()
            this.setActive = false
            return this.$message.success('修改内容成功')
        },
        async deleteActived(id) {
            const confirmRusult = await this.$confirm('此操作将永久删除该内容, 是否继续?', '删除内容', {
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err => err)
            // 用户点击了删除,则返回字符串 confirm
            // 用户取消了删除,则返回字符串 cancel
            if (confirmRusult != 'confirm') return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete(`categories/${this.categoriessIdList[2]}/attributes/${id}`)
            if (res.meta.status != 200) return this.$message.error('删除内容失败')
            this.tabclick()
            return this.$message.success('删除内容成功')
        },
        showInput(row) {
            row.inputVisible = true
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        async handleInputConfirm(row) {
            if (row.inputValue.trim().length == 0) {
                row.inputVisible = false;
                row.inputValue = '';
                return
            }
            row.attr_vals.push(row.inputValue)
            row.inputVisible = false;
            row.inputValue = '';
            const { data: res } = await this.$http.put(`categories/${this.categoriessIdList[2]}/attributes/${row.attr_id}`,
                { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
            if (res.meta.status != 200) return this.$message.error('添加内容项失败')
            return this.$message.success('添加内容项成功')
        },
        async handleClose(row, index) {
            row.attr_vals.splice(index, 1)
            const { data: res } = await this.$http.put(`categories/${this.categoriessIdList[2]}/attributes/${row.attr_id}`,
                { attr_name: row.attr_name, attr_sel: row.attr_sel, attr_vals: row.attr_vals.join(' ') })
            if (res.meta.status != 200) return this.$message.error('删除内容项失败')
            return this.$message.success('删除内容项成功')
        }
    },
    computed: {
        isBtnDisabled() {
            if (this.categoriessIdList.length == 3) {
                return false
            }
            return true
        }
    }
}
</script>
<style lang="less" scoped>
.params {
    height: 100%;
    width: 100%;

    .cat_opt {
        margin: 2% 0
    }

    .el-scrollbar__wrap {
        overflow: auto;
        height: 100%;
    }

    .el-tag {
        margin: 2%;
    }

    .input-new-tag {
        width: 90px;
        margin-left: 10px;
    }
}
</style>