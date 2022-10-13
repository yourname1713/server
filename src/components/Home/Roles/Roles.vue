<template>
    <div class="roles">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="addRole = true">添加用户</el-button>
                </el-col>
                <el-col>
                    <el-table :data="rolesList" border stripe>
                        <el-table-column type="expand">
                            <template v-slot="scope">
                                <el-row :class="['bdbottom','vcenter',index==0?'bdtop':'']"
                                    v-for="(item1,index) in scope.row.children" :key="item1.id">
                                    <el-col :span="5">
                                        <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-row :class="['bdbottom','vcenter',index==0?'bdtop':'']"
                                            v-for="(item2,index) in item1.children" :key="item2.id">
                                            <el-col :span="6">
                                                <el-tag closable @close="removeRightById(scope.row,item2.id)"
                                                    type="success">
                                                    {{item2.authName}}</el-tag>
                                                <i class="el-icon-caret-right"></i>
                                            </el-col>
                                            <el-col :span="18">
                                                <el-tag closable @close="removeRightById(scope.row,item3.id)"
                                                    type="warning" v-for="item3 in item2.children" :key="item3.id">
                                                    {{item3.authName}}</el-tag>
                                            </el-col>
                                        </el-row>
                                    </el-col>
                                </el-row>
                            </template>
                        </el-table-column>
                        <el-table-column label="#" type="index">
                        </el-table-column>
                        <el-table-column prop="roleName" label="角色名字">
                        </el-table-column>
                        <el-table-column prop="roleDesc" label="角色描述">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" icon='el-icon-edit' size="mini"
                                    @click="getRole(scope.row.id)">编辑
                                </el-button>
                                <el-button type="danger" icon='el-icon-delete' size="mini"
                                    @click="deleteRole(scope.row)">删除
                                </el-button>
                                <el-button type="warning" icon='el-icon-setting' size="mini"
                                    @click="showRights(scope.row)">分配权限
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-card>
        <el-dialog title="添加角色" :visible.sync="addRole" width="50%" :modal="false" @close="addRoleClose">
            <el-form label-width="70px" ref="addRoleRef" :model="addRoleForm" :rules="addRoleFormRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addRole = false">取 消</el-button>
                <el-button type="primary" @click="addRoled">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改角色" :visible.sync="setRole" width="50%" :modal="false" @close="setRoleClose">
            <el-form label-width="70px" ref="setRoleRef" :model="setRoleForm" :rules="setRoleFormRules">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="setRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="setRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setRole = false">取 消</el-button>
                <el-button type="primary" @click="setRoled">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="分配权限" :visible.sync="showRight" width="50%" :modal="false" @close="defkey=[]">
            <el-tree :data="showRightList" :props="defaultProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defkey" ref="treeShowRight"></el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showRight = false">取 消</el-button>
                <el-button type="primary" @click="setRoleRight">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: "Roles",
    data() {
        return {
            index: 1,
            rolesList: [],
            addRole: false,
            addRoleForm: {},
            addRoleFormRules: {
                roleName: [
                    { required: true, message: '请输入角色名字', trigger: "blur" },
                    { min: 2, max: 10, message: '角色名字长度为2到10位' }],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: "blur" },
                    { min: 5, max: 20, message: '角色描述为5到20位' }],
            },
            setRole: false,
            setRoleForm: {},
            setRoleFormRules: {
                roleName: [
                    { required: true, message: '请输入角色名字', trigger: "blur" },
                    { min: 2, max: 10, message: '角色名字长度为2到10位' }],
                roleDesc: [
                    { required: true, message: '请输入角色描述', trigger: "blur" },
                    { min: 5, max: 20, message: '角色描述为5到20位' }],
            },
            showRight: false,
            showRightList: [],
            defaultProps: {
                children: 'children',
                label: 'authName'
            },
            defkey: [],
            roleId:null
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        async getRolesList() {
            const { data: res } = await this.$http.get('/roles')
            if (res.meta.status != 200) return this.$message.error('获取角色失败')
            this.rolesList = res.data
            if (this.index == 1) {
                this.index++
                return this.$message.success('获取用户数据成功')
            }
        },
        addRoleClose() {
            this.$refs.addRoleRef.resetFields()
        },
        addRoled() {
            this.$refs.addRoleRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('/roles', this.addRoleForm)
                if (res.meta.status != 201) return this.$message.error('添加角色失败')
                this.addRole = false
                this.getRolesList()
                return this.$message.success('添加角色成功')
            })
        },
        async getRole(id) {
            const { data: res } = await this.$http.get(`/roles/${id}`)
            if (res.meta.status != 200) return this.$message.error('获取角色失败')
            this.setRoleForm = res.data
            this.setRole = true
        },
        setRoleClose() {
            this.$refs.setRoleRef.resetFields()
        },
        setRoled() {
            this.$refs.setRoleRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`/roles/${this.setRoleForm.roleId}`, { roleName: this.setRoleForm.roleName, roleDesc: this.setRoleForm.roleDesc })
                if (res.meta.status != 200) return this.$message.error('修改角色失败')
                this.setRole = false
                this.getRolesList()
                return this.$message.success('修改角色成功')
            })
        },
        async deleteRole(id) {
            const confirmRusult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '删除角色', {
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err => err)
            // 用户点击了删除,则返回字符串 confirm
            // 用户取消了删除,则返回字符串 cancel
            if (confirmRusult != 'confirm') return this.$message.info('取消删除')
            const { data: res } = await this.$http.delete('roles/' + id)
            if (res.meta.status != 200) return this.$message.error('删除角色失败')
            this.getRolesList()
            return this.$message.success('删除角色成功')
        },
        async removeRightById(rol, id2) {
            const confirmRusult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '删除用户', {
                confirmButtonText: '确定',
                type: 'warning'
            }).catch(err => err)
            // 用户点击了删除,则返回字符串 confirm
            // 用户取消了删除,则返回字符串 cancel
            if (confirmRusult != 'confirm') return this.$message.info('取消了删除')
            const { data: res } = await this.$http.delete(`/roles/${rol.id}/rights/${id2}`)
            if (res.meta.status != 200) return this.$message.error('该权限删除失败')
            rol.children = res.data
            return this.$message.success('该权限已经删除')
        },
        getDefKey(node, arr) {
            if (!node.children) return arr.push(node.id)
            node.children.forEach(item => {
                this.getDefKey(item, arr)
            })
        },
        async showRights(roles) {
            const { data: res } = await this.$http.get('/rights/tree')
            if (res.meta.status != 200) return this.$message.error('获取权限树失败')
            this.showRightList = res.data
            this.getDefKey(roles, this.defkey)
            this.roleId = roles.id
            this.showRight = true
        },
        async setRoleRight() {
            const idStr = [...this.$refs.treeShowRight.getCheckedKeys(),...this.$refs.treeShowRight.getHalfCheckedKeys()].join(',')
            const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
            if (res.meta.status!=200)return this.$message.error('修改角色权限失败')
            this.getRolesList()
            this.showRight = false
            return this.$message.success('修改角色权限成功')
        }
    }
}
</script>
<style lang="less" scoped>
.roles {
    height: 100%;
    width: 100%;

    .el-table {
        margin-top: 2%
    }

    .el-tag {
        margin: 2% 15px
    }

    .bdtop {
        border-top: 1px solid #eee
    }

    .bdbottom {
        border-bottom: 1px solid #eee
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
}
</style>