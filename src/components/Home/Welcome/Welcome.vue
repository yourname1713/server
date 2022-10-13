<template>
    <div class="welcome">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>欢迎访问</el-breadcrumb-item>
            <el-breadcrumb-item>Welcome</el-breadcrumb-item>
        </el-breadcrumb>
        <el-carousel :interval="3500" arrow="always" height="600px">
            <el-carousel-item>
                <h1>
                    Welcome
                </h1>
                <h2>
                    欢迎来到后台系统
                </h2>
                <ul>
                    <li>
                        <h4>基于vue+element-ui构建的一个后台管理系统(PC网页)</h4>
                    </li>
                    <li><span>项目Github地址：</span><a href="https://github.com/yourname1713/server"
                            target="_blank">https://github.com/yourname1713/server</a>
                    </li>
                    <li><span>项目Gitee地址：</span><a href="https://gitee.com/yourname1713/server"
                            target="_blank">https://gitee.com/yourname1713/server</a>
                    </li>
                    <li>使用ngnix+腾讯云服务器部署</li>
                </ul>
                <address>个人练习使用</address>
            </el-carousel-item>
            <el-carousel-item>
                <h1>以前的小东西</h1>
                <ul>
                    <li>
                        <h4>基于vue+vuex构建的一个简易答题页面(手机网页)</h4>
                    </li>
                    <li>请使用手机浏览器打开或者使用电脑浏览器的F12手机模式打开</li>
                    <li>通过利用vue+vuex对网页进行基础设计，虽然整个流程一目了然，但麻雀虽小，五脏俱全，加强对vue知识的应用<br>
                        利用vuex进行数据管理，实现数据在各个组件的使用，避免了使用传统数据传输时的麻烦。</li>
                    <li><span>项目地址：</span><a href="http://43.143.130.211:8088/#/home"
                            target="_blank">http://43.143.130.211:8088/#/home</a></li>
                    <li><span>项目Github地址：</span><a href="https://github.com/yourname1713/happyfri"
                            target="_blank">https://github.com/yourname1713/happyfri</a>
                    </li>
                    <li><span>项目Gitee地址：</span><a href="https://gitee.com/yourname1713/happyfri"
                            target="_blank">https://gitee.com/yourname1713/happyfri</a>
                    </li>
                    <li>使用ngnix+腾讯云服务器部署</li>
                </ul>
                <ul>
                    <li>
                        <h4>基于html+css+javascript构建的一个购物平台的静态页面(PC网页)</h4>
                    </li>
                    <li>请使用电脑浏览器打开</li>
                    <li>一个电商平台的静态网站，通过html、css、js实现了各个网页的样式和基本功能</li>
                    <li><span>项目地址：</span><a href="http://yourname1713.3vzhuji.cc/shopping/index.html"
                            target="_blank">http://yourname1713.3vzhuji.cc/shopping/index.html</a></li>
                    <li>使用free.3v.do静态部署</li>
                </ul>
                <address>个人练习使用</address>
            </el-carousel-item>
            <el-carousel-item>
                <h1>个人信息</h1>
                <ul>
                    <li>
                        <span>电话：</span>17602316042
                    </li>
                    <li>
                        <span>微信：</span>yourname_1713
                    </li>
                    <li>
                        <span>QQ：</span>1793056542
                    </li>
                    <li>
                        <span>邮箱：</span>1793056542@qq.com
                    </li>
                    <li>
                        <span>教育背景：</span>重庆第二师范学校-信息与计算科学(统招本科) 专业成绩(GPA):3.8/5
                    </li>
                    <li>
                        <span>校园经历：</span>获得校奖学金：一等奖一次、二等奖一次、三等奖三次
                        <br>华为云-全国青年人工智能社会实践<br>参加2022年数学与信息技术学院“互联网+”大赛
                    </li>
                </ul>
            </el-carousel-item>
        </el-carousel>

    </div>
</template>
<script>
export default {
    name: "Welcome",
}
</script>
<style lang="less" scoped>
.welcome {
    height: 100%;
    width: 100%;

    .el-carousel__item {
        text-align: center;
        background-color: transparent;

        h1 {
            font-size: 36px;
            margin-bottom: 2%;
        }

        li {
            margin: 1.25%;
            list-style: none;
        }
    }

    a {
        color: blue;
        text-decoration: none;
    }
}
</style>