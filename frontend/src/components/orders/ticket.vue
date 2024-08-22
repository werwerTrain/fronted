<template>
    <el-radio-group v-model="status">
        <el-radio-button label="全部订单" value="all"></el-radio-button>
        <el-radio-button label="已支付" value="paid"></el-radio-button>
        <el-radio-button label="已取消" value="cancel"></el-radio-button>
        <el-radio-button label="已完成" value="done"></el-radio-button>
    </el-radio-group>
    <div v-for="(item, index) in ticketOrders" :id="item.oid" :key="index">
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
                    </el-col>
                </el-row>
            </div>
            <el-divider border-style="dashed" />
            <div>
                <el-text size="large">旅客信息</el-text>
                <el-scrollbar>
                    <div class="scrollbar">
                        <el-card shadow="never" v-for="(p, i) in item.person" :key="i" class="scrollbar-demo">
                            <div
                                style="display:flex; flex-direction: column; align-items: center; justify-content: center;">
                                <el-text tag="b">{{ p.name }}</el-text>
                                <el-tag type="primary" style="margin-top:5%;margin-bottom:10%;">中国居民身份证</el-tag>
                                <el-text style="margin-top:5%;margin-bottom:30%;">{{ p.seat_type }}</el-text>
                                <el-text style="flex: 1;">{{ hideMiddle(p.identification) }}</el-text>
                            </div>
                        </el-card>
                    </div>
                </el-scrollbar>
            </div>
            <el-divider border-style="dashed" />
            <div style="display:block;justify-content: center;">
                <el-text size="large" style="margin-bottom:1%;">订单状态</el-text>
                <v-timeline direction="horizontal" side="end" style="width:90%;margin-left:5%;">
                    <v-timeline-item dot-color="green-lighten-1" size="x-small">
                        <div style="display:flex;justify-content: center;flex-direction: column;">
                            <el-text size="large" style="color:black;" tag="b">已创建</el-text>
                            <div class="text-caption mb-2">
                                {{ item.order_time }}
                            </div>
                        </div>
                    </v-timeline-item>
                    <v-timeline-item dot-color="green-lighten-1" size="x-small">
                        <div style="display:flex;justify-content: center;flex-direction: column;">
                            <el-text size="large" style="color:black;" tag="b">已支付</el-text>
                            <div class="text-caption mb-2">
                                {{ item.order_time }}
                            </div>
                        </div>
                    </v-timeline-item>

                    <v-timeline-item
                        :dot-color="item.status === '已支付' ? 'grey' : (item.status === '已完成' ? 'green-lighten-1' : 'red')"
                        size="x-small">
                        <div style="display:flex;justify-content: center;flex-direction: column;">
                            <el-text size="large" style="color:black;" tag="b"
                                v-if="item.status === '已支付'">待使用</el-text>
                            <el-text size="large" style="color:black;" tag="b"
                                v-else-if="item.status === '已完成'">已使用</el-text>
                            <el-text size="large" style="color:black;" tag="b"
                                v-else-if="item.status === '已取消'">已取消</el-text>
                            <div class="text-caption mb-2">
                                <div v-if="item.status === '已完成'">{{ item.date }}</div>
                                <div v-else-if="item.status === '已取消'">{{ item.cancel_time }}</div>
                                <div v-else-if="item.status === '已支付'">{{ item.date }}</div>
                            </div>
                        </div>
                    </v-timeline-item>

                    <v-timeline-item
                        dot-color="green-lighten-1" size="x-small" v-if="item.status === '已完成'">
                        <div style="display:flex;justify-content: center;flex-direction: column;">
                            <el-text size="large" style="color:black;" tag="b">已完成</el-text>
                            <div class="text-caption mb-2">
                                <div>{{ item.date }}</div>
                            </div>
                        </div>
                    </v-timeline-item>
                </v-timeline>
            </div>
            <template #footer>
                <el-row>
                    <el-col :span="4">
                        <el-text class="mx-1" size="large">总张数: {{ item.person.length }}</el-text>
                    </el-col>
                    <el-col :span="3">
                        <el-text class="mx-1" size="large">总金额: <span style="color:#ffa31a;font-weight: bold;">￥{{
                                item.sum_price
                                }}元</span></el-text>
                    </el-col>
                    <el-col :span="2" v-if="item.status === '已支付'" :offset="15">
                        <el-popconfirm title="确定要取消这个订单吗？如您预定了同一班次的火车餐也将一并取消。" @confirm="cancelOrders(item.oid,item.tid)">
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
import { getTicketOrders, cancelTicketOrder } from "../../api/api.js";
import { ElMessage, ElNotification } from "element-plus";
import { useRoute } from "vue-router";
import emitter from '@/emitter.js';

const status = ref("all");
const userID = localStorage.getItem('user_id');
const ticketOrders = ref([]);
const route = useRoute();
//消息跳转
const scrollToOrder = (orderId) => {
  const orderElement = document.getElementById(orderId);
  console.log("滚动到：", orderId);
  if (orderElement) {
    orderElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
const cancelOrders = async (oid,tid) => {
    try {
        console.log(oid);
        const responce = await cancelTicketOrder(userID, oid);
        if (responce.data.result) {
            ElNotification({
                title: '退票成功',
                message: "您成功取消了" + tid + "班次的列车，如果您预定了此班次的火车餐也将为您取消，退款将于1~5个工作日原路返回。",
                type: 'success',
            });
            emitter.emit('getAllMessage');
        }
        else {
            ElMessage.error("取消订单失败");
        }
    } catch (error) {
        console.error("取消订单失败", error);
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
const hideMiddle = (val) => {
    return `${val.substring(0, 3)}************${val.substring(val.length - 3)}`
}
const getOrders = async () => {
    try {
        // console.log(status.value);
        const response = await getTicketOrders(userID, status.value);
        ticketOrders.value = response.data.result;
    } catch (error) {
        console.error("获取火车票订单数组失败:", error);
    }
};
watch(status, (newValue) => {
    // console.log("状态切换为", newValue);
    getOrders();
});
watch(route,(newValue)=>{
    console.log('orderId changed:', newValue.query.orderId);
    if(newValue.query.orderId){
        setTimeout(() => {
      scrollToOrder(newValue.query.orderId);
    }, 500);
    }
});
onMounted(() => {
    getOrders();
    const orderId = route.query.orderId;
    if (orderId) {
    setTimeout(() => {
      scrollToOrder(orderId);
    }, 500);
  }
});
// setInterval(getOrders,60000);
</script>
<style scoped>
.el-card /deep/ .el-card__header {
    background-color: #f0f8ff;
}

.scrollbar {
    display: flex;
    margin-top: 1%;
    /* justify-content: center; */
}

.scrollbar-demo {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15%;
    height: 5%;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background-color: #f0f8ff !important;
}
</style>