<template>
    <div class="login">
        <div class="loginBox">
            <div class="avatarBox">
                <img src="@/assets/images/33_Yulia_8k.jpg">
            </div>
            <h1>个人后台</h1>
            <el-form ref="loginRef" class="loginForm" :model="loginForm" :rules="loginRules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" placeholder='密码为本人手机号'
                        show-password>
                    </el-input>
                </el-form-item>
                <el-form-item class="btn">
                    <el-button type="primary" @click="login">登入</el-button>
                    <el-button type="info" @click="clear">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: 'yourname',
                password: ''
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名字', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        login() {
            this.$refs.loginRef.validate(async value => {
                if (!value) return
                const { data: res } = await this.$http.post('login', this.loginForm)
                if (res.meta.status == 200) {
                    window.sessionStorage.setItem('token', res.data.token)
                    window.sessionStorage.setItem('path', '/home/welcome')
                    this.$router.push('/home')
                    return this.$message.success('登入成功')
                }
                else {
                    this.clear()
                    return this.$message.error('登入失败')
                }
            });
        },
        clear() {
            this.$refs.loginRef.resetFields();
        }
    }
}
</script>
<style lang="less" scoped>
.login {
    height: 100%;
    background: url('@/assets/images/2022-08-01.jpg') no-repeat;
    background-size: 100% 100%;

    .loginBox {
        position: absolute;
        top: 5%;
        right: 5%;
        width: 450px;
        height: 300px;
        background: url('@/assets/images/sky1_8k.jpg') no-repeat;
        background-size: 100% 100%;
        border-radius: 5%;

        .avatarBox {
            position: absolute;
            top: 0;
            left: 50%;
            transform: translate(-50%, -25%);
            height: 100px;
            width: 100px;
            border-radius: 50%;
            overflow: hidden;

            img {
                margin-top: -10px;
            }
        }

        h1 {
            position: absolute;
            top: 25%;
            left: 50%;
            transform: translateX(-50%);
            color: skyblue;
        }

        .loginForm {
            position: absolute;
            bottom: -6%;
            width: 100%;
            padding: 0 10%;

            .btn {
                display: flex;
                justify-content: center;
            }
        }

    }
}
</style>