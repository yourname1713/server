<template>
    <div class="reports">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{path:'/home'}"><strong>首页</strong></el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card class="box-card">
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>
<script>
import * as echarts from 'echarts';
import _ from 'lodash'

export default {
    name: "Reports",
    async mounted() {
        var myChart = echarts.init(document.getElementById('main'));
        const { data: res } = await this.$http.get('reports/type/1')
        if (res.meta.status != 200) return this.$message.error('获取数据失败')
        // 指定图表的配置项和数据
        // 使用刚指定的配置项和数据显示图表。
        const result=_.merge(res.data,this.options)
        myChart.setOption(result);
        return this.$message.success('获取数据成功')
    },
    data() {
        return {
            options: {
                title: {
                    text: '用户来源'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#E9EEF3'
                        }
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        boundaryGap: false
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ]
            }
        }
    }
}
</script>
<style lang="less" scoped>
.reports {
    height: 100%;
    width: 100%;
}
</style>