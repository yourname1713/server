<template>
    <div class="add">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-alert title="添加商品信息" center show-icon :closable="false" type="info"></el-alert>
            <el-steps :space="200" :active="index-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
            </el-steps>
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs :tab-position="'left'" v-model="index" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <span>选择商品分类：
                                <el-cascader v-model="addForm.goods_cat" :options="categoriessList"
                                    :props="{ expandTrigger: 'hover',...categoriessProps }"
                                    @change="categoriessIdChange" :clearable="true">
                                </el-cascader>
                            </span>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyattributesList" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="item" v-for="(item,index) in item.attr_vals" :key="index">
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyattributesList" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                            :on-remove="handleRemove" list-type="picture" :headers="headerObj"
                            :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <el-dialog title="提示" :visible.sync="previewVisible" width="50%" :modal="false">
            <img :src="previewPath" style="width: 100%;">
        </el-dialog>
    </div>
</template>
<script>
import _ from "lodash";
export default {
    name: 'Add',
    data() {
        return {
            index: '0',
            addForm: {
                goods_name: '',
                goods_weight: 0,
                goods_price: 0,
                goods_number: 0,
                goods_cat: [],
                pics: [],
                goods_introduce: '',
                attrs:[]
            },
            addFormRules: {
                goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
                goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
                goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
                goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
            },
            categoriessList: [],
            categoriessProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children'
            },
            manyattributesList: [],
            onlyattributesList: [],
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            previewPath: '',
            previewVisible: false
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
            if (this.addForm.goods_cat.length != 3) {
                this.addForm.goods_cat = []
                return this.$message.error('请选择三级商品分类')
            }
        },
        beforeTabLeave(newTab, oldTab) {
            if (oldTab == 0 && ((this.addForm.goods_cat.length != 3) || (this.addForm.goods_name == ''))) {
                this.$message.error('请填写商品名称或者选择商品分类')
                return false
            }
        },
        async tabClicked() {
            if (this.index == 1) {
                const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
                if (res.meta.status != 200) return this.$message.error('获取动态参数失败')
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                })
                this.manyattributesList = res.data
                return this.$message.success('获取动态参数成功')
            }
            if (this.index == 2) {
                const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
                if (res.meta.status != 200) return this.$message.error('获取静态属性失败')
                this.onlyattributesList = res.data
                return this.$message.success('获取静态属性成功')
            }
        },
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        handleRemove(file) {
            this.addForm.pics = this.addForm.pics.filter(item => item.pic != file.response.data.tmp_path)
        },
        handleSuccess(response) {
            this.addForm.pics.push({ pic: response.data.tmp_path })
        },
        add(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid)return
                this.manyattributesList.forEach(item=>this.addForm.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')}))
                this.onlyattributesList.forEach(item=>this.addForm.attrs.push({attr_id:item.attr_id,attr_value:item.attr_vals}))
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                const {data:res}=await this.$http.post('/goods',form)
                console.log(res.meta)
                if (res.meta.status!=201)return this.$message.error('添加商品失败')
                this.$router.push('/home/goods')
                return this.$message.success('添加商品成功')
            })
        }
    }
}
</script>
<style lang="less" scoped>
.add {
    height: 100%;
    width: 100%;

    .el-steps {
        margin: 2%
    }

    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }
    .el-button{
        margin:2%
    }
}
</style>