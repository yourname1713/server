<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" clearable @clear="getUsersList" v-model="queryInfo.query">
                        <el-button @click="getUsersList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <el-table :data="userList" border stripe>
                <el-table-column label="#" type="index">
                </el-table-column>
                <el-table-column prop="username" label="姓名">
                </el-table-column>
                <el-table-column prop="email" label="邮箱">
                </el-table-column>
                <el-table-column prop="mobile" label="电话">
                </el-table-column>
                <el-table-column prop="role_name" label="角色">
                </el-table-column>
                <el-table-column prop="mg_state" label="状态">
                    <template v-slot="scope">
                        <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                            @change="stateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template v-slot="scope">
                        <el-button type="primary" icon='el-icon-edit' size="mini" @click="getUser(scope.row.id)">
                        </el-button>
                        <el-button type="danger" icon='el-icon-delete' size="mini"
                            @click="deleteUserById(scope.row.id)"></el-button>
                        <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
                            <el-button type="warning" icon='el-icon-setting' size="mini" @click="getRole(scope.row)">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[1,2, 3, 5, 10]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>
        <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" :modal="false" @close="addDialogClose">
            <el-form label-width="70px" ref="addFormRef" :model="addForm" :rules="addFormRules">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改用户" :visible.sync="dialogFormVisibled" width="50%" :modal="false" @close="addDialogClosed">
            <el-form label-width="70px" ref="addFormRefd" :model="addForm1" :rules="addFormRules1">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm1.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm1.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm1.mobile"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibled = false">取 消</el-button>
                <el-button type="primary" @click="setUser">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配角色" :visible.sync="setRole" width="50%" :modal="false" @close="setRoleClose">
            <div>
                <p>当前的用户:{{setRoleList.username}}</p>
                <p>当前的角色:{{setRoleList.role_name}}</p>
                <p>分配新的角色：
                    <el-select v-model="setRoleID" placeholder="请选择">
                        <el-option v-for="item in RoleList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRole = false">取 消</el-button>
                <el-button type="primary" @click="setRoled">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "Users",
    data() {
        var checkEmail = (rule, value, cb) => {
            const regEmail = /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
            if (regEmail.test(value)) return cb()
            cb(new Error('请输入正确的邮箱'))
        }
        var checkMobile = (rule, value, cb) => {
            const regMobile = /0?(13|14|15|17|18)[0-9]{9}/
            if (regMobile.test(value)) return cb()
            cb(new Error('请输入正确的手机号'))
        }
        return {
            index: 1,
            userList: [],
            total: 0,
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            dialogFormVisible: false,
            dialogFormVisibled: false,
            addForm: {},
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: "blur" },
                    { min: 2, max: 10, message: '用户名长度为2到10位' }],
                password: [
                    { required: true, message: '请输入密码', trigger: "blur" },
                    { min: 6, max: 15, message: '密码长度为6到15位' }],
                email: [
                    { required: true, message: '请输入邮箱', trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" }],
                mobile: [
                    { required: true, message: '请输入手机', trigger: "blur" },
                    { validator: checkMobile, trigger: "blur" }]
            },
            addForm1: {},
            addFormRules1: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: "blur" },
                    { validator: checkEmail, trigger: "blur" }],
                mobile: [
                    { required: true, message: '请输入手机', trigger: "blur" },
                    { validator: checkMobile, trigger: "blur" }]
            },
            setRole: false,
            setRoleList: [],
            RoleList: [],
            setRoleID:''
        }
    },
    created() {
        this.getUsersList()
    },
    methods: {
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUsersList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getUsersList()
        },
        async getUsersList() {
            const { data: res } = await this.$http.get('/users', { params: this.queryInfo })
            if (res.meta.status != 200) return this.$message.error('获取用户数据失败')
            this.userList = res.data.users
            this.total = res.data.total
            if (this.index == 1) {
                this.index++
                return this.$message.success('获取用户数据成功')
            }
        },
        async stateChange(msg) {
            const { data: res } = await this.$http.put(`/users/${msg.id}/state/${msg.mg_state}`)
            if (res.meta.status != 200) {
                msg.mg_state = !msg.mg_state
                return this.$message.error('更新用户状态失败')
            }
            this.$message.success('更新用户状态成功')
        },
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('/users', this.addForm)
                if (res.meta.status != 201) return this.$message.error('添加用户失败')
                this.dialogFormVisible = false
                this.getUsersList()
                return this.$message.success('添加用户成功')
            })
        },
        addDialogClosed() {
            this.$refs.addFormRefd.resetFields()
        },
        async getUser(id) {
            const { data: res } = await this.$http.get(`/users/${id}`)
            if (res.meta.status != 200) return this.$message.error('获取用户失败')
            this.addForm1 = res.data
            this.dialogFormVisibled = true
        },
        setUser() {
            this.$refs.addFormRefd.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`/users/${this.addForm1.id}`, { email: this.addForm1.email, mobile: this.addForm1.mobile })
                if (res.meta.status != 200) return this.$message.error('修改用户失败')
                this.dialogFormVisibled = false
                this.getUsersList()
                return this.$message.success('修改用户成功')
            })
        },
        async deleteUserById(id) {
            const confirmRusult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err => err)
            // 用户点击了删除,则返回字符串 confirm
            // 用户取消了删除,则返回字符串 cancel
            if (confirmRusult != 'confirm') return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete('users/' + id)
            if (res.meta.status != 200) return this.$message.error('该用户删除失败')
            this.getUsersList()
            return this.$message.success('该用户已经删除')
        },
        async getRole(row) {
            this.setRoleList = row
            const { data: res } = await this.$http.get('/roles')
            if (res.meta.status != 200) return this.$message.error('获取角色列表失败')
            this.RoleList = res.data
            this.setRole = true
            return this.$message.success('获取角色列表成功')
        },
        async setRoled(){
            const {data:res} = await this.$http.put(`/users/${this.setRoleList.id}/role`,{rid:this.setRoleID})
            if (res.meta.status!=200)return this.$message.error('分配角色失败')
            this.getUsersList()
            this.setRole = false
            return this.$message.success('分配角色成功')
        },
        setRoleClose(){
            this.setRoleList = []
            this.setRoleID = ''
        }
    }
}
</script>
<style lang="less" scoped>
.users {
    height: 100%;
    width: 100%;
}
</style>