<template>
    <el-container class="home">
        <el-header>
            <div class="avatarBox">
                <img src="@/assets/images/33_Yulia_8k.jpg">
                <h1>个人后台</h1>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse?'61px':'200px'">
                <div class="toggle-button" @click="scale">|||</div>
                <el-menu active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false"
                    router :default-active="indexPath">
                    <el-submenu index="160" key="160">
                        <template slot="title">
                            <i class="el-icon-magic-stick"></i>
                            <span>欢迎访问</span>
                        </template>
                        <el-menu-item index="/home/welcome" key="161" >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>Welcome</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                    <el-submenu :index="item.id.toString()" v-for="item in menulist" :key="item.id.toString()">
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/home/'+subItem.path" v-for="subItem in item.children"
                            :key="subItem.id.toString()" >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: 'Home',
    data() {
        return {
            menulist: [],
            iconObj: {
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            isCollapse: false,
            indexPath: ''
        }
    },
    created() {
        this.getMenulist()
        this.indexPath = this.$route.fullPath
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.replace('/login')
        },
        async getMenulist() {
            const { data: res } = await this.$http.get('/menus')
            if (res.meta.status != 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
        },
        scale() {
            this.isCollapse = !this.isCollapse
        },
    }
}
</script>
<style lang="less" scoped>
.home {
    height: 100%;

    .el-header {
        display: flex;
        justify-content: space-between;
        background: url('@/assets/images/22.png') no-repeat;
        background-size: 100% 100%;
        padding: 0;

        .avatarBox {
            display: flex;

            img {
                height: 60px;
                width: 60px;
                border-radius: 50%;
                overflow: hidden;
            }

            h1 {
                color: skyblue;
                line-height: 60px
            }
        }

        .el-button {
            margin: 10px
        }
    }

    .el-aside {
        background-color: skyblue;

        .el-menu {
            background-color: skyblue;
            border-right: 0;

            .el-submenu {
                background-color: skyblue;

                .el-menu-item {
                    background-color: skyblue;
                }
            }

            .iconfont {
                padding-right: 10px
            }
        }

        .toggle-button {
            height: 18px;
            color: blue;
            background-color: skyblue;
            font-size: 12px;
            text-align: center;
            line-height: 18px;
        }
    }

    .el-main {
        background: url('@/assets/images/49240323_p0.jpg') no-repeat;
        background-size: 100% 105%;
        opacity: 0.8;
    }
}
</style>