<template>
    <el-radio-group v-model="status">
        <el-radio-button label="全部订单" value="all"></el-radio-button>
        <el-radio-button label="已支付" value="paid"></el-radio-button>
        <el-radio-button label="已取消" value="cancel"></el-radio-button>
        <el-radio-button label="已完成" value="done"></el-radio-button>
    </el-radio-group>
    <div v-for="(item, index) in hotelOrders" :id="item.oid" :key="index">
        <el-card style="width: 100%;border-radius: 25px;margin-top:1%;margin-bottom:1%;">
            <template #header>
                <el-row>
                    <el-col :span="7">
                        <el-text tag="b" size="large">订单号: {{ item.oid }}</el-text>
                    </el-col>
                    <el-col :span="7">
                        <el-text tag="b" size="large">下单时间: {{ item.time }}</el-text>
                    </el-col>
                    <el-col :span="7">
                    </el-col>
                    <el-col :span="3">
                        <el-text tag="b" size="large">订单状态: <span :style="{ color: getStatusColor(item.status) }">{{
                                item.status }}</span></el-text>
                    </el-col>
                </el-row>
            </template>
            <div style="display:block;">
                <div style="font-size:20px;font-weight:bold">{{item.name}}</div>
                <div style="font-size:14px;margin-top:5px;">{{item.position}}</div>
                <div style="font-size:14px;margin-top:5px;">
                入住日期: {{item.check_in}}至{{item.check_out}}
                </div>
                <div style="font-size:14px;margin-top:5px;">{{item.roomtype}}</div>
            </div>
            
           
            <template #footer>
                <el-row>
                    <el-col :span="4">
                        <el-text class="mx-1" size="large">房间数: {{ item.num }}</el-text>
                    </el-col>
                    <el-col :span="3">
                        <el-text class="mx-1" size="large">总金额: <span style="color:#ffa31a;font-weight: bold;">￥{{
                            item.money
                                }}元</span></el-text>
                    </el-col>
                    <el-col :span="2" v-if="item.status === '已支付'" :offset="15">
                        <el-popconfirm title="确定要取消这个订单吗？" @confirm="cancelOrders(item.oid)">
                            <template #reference>
                                <el-button size="large" type="warning" plain style="margin-top:-1%;">取消订单</el-button>
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
import { getHotelOrders, cancelHotelOrder } from "../../api/api.js";
import { ElMessage, ElNotification } from "element-plus";
import { useRoute } from "vue-router";
import emitter from '@/emitter.js';

const status = ref("all");
const userID = localStorage.getItem('user_id');
const hotelOrders = ref([]);
const route = useRoute();
//消息跳转
const scrollToOrder = (orderId) => {
  const orderElement = document.getElementById(orderId);
  console.log("滚动到：", orderId);
  if (orderElement) {
    orderElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
};
const cancelOrders=async(oid)=>{
    try {
        const responce = await cancelHotelOrder(userID, oid);
        if (responce.data.result) {
            ElNotification({
                title: '取消订单成功',
                message: "退款将于1~5个工作日原路返回。",//TODO
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
const hideMiddle = (val) => {
    return `${val.substring(0, 3)}************${val.substring(val.length - 3)}`
}
const getOrders = async () => {
    try {
        const response = await getHotelOrders(userID, status.value);
        console.log(status.value);
        hotelOrders.value = response.data.result;
    } catch (error) {
        console.error("获取火车票订单数组失败:", error);
    }
};
watch(status, (newValue) => {
    console.log("状态切换为", newValue);
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
    }, 1000);
  }
});
setInterval(getOrders,60000);
</script>
<style scoped>
.el-card /deep/ .el-card__header {
    background-color: #f0f8ff;
}

.scrollbar-flex-content {
    display: flex;
    margin-top: 1%;
    justify-content: center;
}

.scrollbar-demo-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    height: 50px;
    margin: 15px;
    text-align: center;
    border-radius: 4px;
    background-color: #f0f8ff !important;
}
</style>