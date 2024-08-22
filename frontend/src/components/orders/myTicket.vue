<template>
    <el-radio-group v-model="status">
        <el-radio-button label="全部订单" value="all"></el-radio-button>
        <el-radio-button label="已支付" value="paid"></el-radio-button>
        <el-radio-button label="已取消" value="cancel"></el-radio-button>
        <el-radio-button label="已完成" value="done"></el-radio-button>
    </el-radio-group>
    <div v-for="(item, index) in ticketOrders" :key="index">
        <el-card style="width: 100%;border-radius: 25px;margin-top:1%;margin-bottom:1%;">
            <template #header>
                <el-row>
                    <el-col :span="7">
                        <el-text tag="b" size="large">订单号: {{ item.oid }}</el-text>
                    </el-col>
                    <el-col :span="7">
                        <el-text tag="b" size="large">下单时间: {{ item.order_time }}</el-text>
                    </el-col>
                    <el-col :span="7">
                        <el-text tag="b" size="large">出发日期: {{ item.date }}</el-text>
                    </el-col>
                    <el-col :span="3">
                        <el-text tag="b" size="large">订单状态: <span :style="{ color: getStatusColor(item.status) }">{{
        item.status }}</span></el-text>
                    </el-col>
                </el-row>
            </template>
            <div style="display:block;">
                <el-text size="large" style="margin-bottom:1%;">车次信息</el-text>
                <el-row>
                    <el-col :span="6" style="display: flex;flex-direction: column;justify-content: center;">
                        <el-text tag="b" style="font-size: 25px;">{{ item.start_time }}</el-text>
                        <el-text size="large" style="width">{{ item.start_station }}</el-text>
                    </el-col>
                    <el-col :span="6" style="display: flex;flex-direction: column;justify-content: center;">
                        <el-divider content-position="center"><el-text tag="b" size="large"
                                style="font-size:20px;padding:5px 35px;border:1.5px solid #DDDCDC;border-radius: 10px;">{{
        item.tid }}</el-text></el-divider>
                    </el-col>
                    <el-col :span="6"
                        style="display: flex;flex-direction: column;justify-content: center;border-right:1.5px solid #DDDCDC;">
                        <el-text tag="b" style="font-size: 25px;">{{ item.arrive_time }}</el-text>
                        <el-text size="large" style="width">{{ item.arrive_station }}</el-text>
                    </el-col>
                    <el-col :span="6" style="display: flex;flex-direction: column;justify-content: center;">
                        <el-text tag="b" style="font-size: 25px;">{{ item.time }}</el-text>
                        <el-text size="large" style="width">{{ item.seat_type }}</el-text>
                    </el-col>
                </el-row>
            </div>
            <template #footer>
                <el-row>
                    <el-col :span="3">
                        <el-text class="mx-1" size="large">总金额: <span style="color:#ffa31a;font-weight: bold;">￥{{
        item.price
    }}元</span></el-text>
                    </el-col>
                    <el-col :span="2" v-if="item.status === '已支付'" :offset="19">
                        <el-popconfirm title="确定要取消这个订单吗？" @confirm="cancelOrders(item.oid)">
                            <template #reference>
                                <el-button type="warning" plain style="margin-top:-1%;">取消订单</el-button>
                            </template>
                        </el-popconfirm>
                    </el-col>
                </el-row>
            </template>
        </el-card>
    </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { getThisTicket, cancelTicketOrder } from "../../api/api.js";
import { ElMessage,ElNotification } from "element-plus";
import emitter from '@/emitter.js';

const status = ref("all");
const userID = localStorage.getItem('user_id');
const ticketOrders = ref([]);
const cancelOrders = async (oid) => {
    try {
        const responce = await cancelTicketOrder(userID, oid);
        if (responce.data.result) {
            ElNotification({
                title: '退票成功',
                message: "您成功取消了列车，如果您预定了此班次的火车餐也将为您取消，退款将于1~5个工作日原路返回。",
                type: 'success',
            });
            emitter.emit('getAllMessage');
        }
        else {
            ElMessage.error("取消订单失败");
        }
    } catch (error) {
        console.error("取消订单失败", error);
        ElMessage.error("取消订单失败");
    }
    getOrders();
}
const getStatusColor = (status) => {
    if (status === '已完成') {
        return '#60B2FF';
    } else if (status === '已支付') {
        return '#24D36F';
    } else if (status === '已取消') {
        return '#FC604F';
    }
};
const getOrders = async () => {
    try {
        const response = await getThisTicket(userID, status.value);
        ticketOrders.value = response.data.result;
    } catch (error) {
        console.error("获取本人订单数组失败:", error);
    }
};
watch(status, (newValue) => {
    // console.log("状态切换为", newValue);
    getOrders();
});
onMounted(() => {
    getOrders();
});
</script>
<style scoped>
.el-card /deep/ .el-card__header {
    background-color: #f0f8ff;
}
</style>