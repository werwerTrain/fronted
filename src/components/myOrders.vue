<template>
    <el-container width="100%" style="display:flex;">
        <el-aside width="15%">
            <a-menu id="dddddd" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys"
                style="width:100%;height:100%;" mode="inline" :items="items" @click="handleClick"></a-menu>
        </el-aside>
        <el-main width="85%" style="height:90vh;margin-top:-1%; ">
            <router-view />
        </el-main>
    </el-container>
</template>
<script setup>
import { reactive, ref, watch, h, onMounted } from 'vue';
import { MailOutlined, SettingOutlined, AppstoreOutlined, CalendarOutlined, PieChartOutlined } from '@ant-design/icons-vue';
import { useRouter } from "vue-router";
import eventBus from '@/eventBus.js';
const router = useRouter();
const MyOrdersActiveKey = ref(eventBus.MyOrdersActiveKey);
const selectedKeys = ref(['1']);
const openKeys = ref(['sub1']);
function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type
    }
}
const items = reactive([
    getItem('个人中心', '1', h(SettingOutlined)),
    getItem('乘车人信息', '2', h(CalendarOutlined)),
    getItem('我的订单', 'sub1', () => h(MailOutlined), [
        getItem('车票订单', '3'),
        getItem('酒店订单', '4'),
        getItem('餐饮订单', '5')
    ]),
    getItem('本人车票', '6', h(AppstoreOutlined)),
    // getItem('我的收藏', '7', h(PieChartOutlined))
])
const handleClick = e => {
    console.log('click', e);
    eventBus.MyOrdersActiveKey = e.key;
    selectedKeys.value = [e.key];
    if (e.key === '1') {
        router.push('/home/orders/personalCenter')
    } else if (e.key === '2') {
        router.push('/home/orders/passengersInfo')
    } else if (e.key === '3') {
        router.push('/home/orders/ticketOrders')
    } else if (e.key === '4') {
        router.push('/home/orders/hotelOrders')
    } else if (e.key === '5') {
        router.push('/home/orders/foodOrders')
    } else if (e.key === '6') {
        router.push('/home/orders/myTicket')
    } else if (e.key === '7') {
        router.push('/home/orders/myCollect')
    }
}
watch(openKeys, val => {
    console.log('openKeys', val);
});
watch(() => eventBus.MyOrdersActiveKey, (newVal) => {
    console.log("消息跳转：",newVal);
    MyOrdersActiveKey.value = newVal;
    selectedKeys.value =[newVal];
});
onMounted(() => {
    selectedKeys.value = [eventBus.MyOrdersActiveKey];
    router.push('/home/orders/personalCenter');
});
</script>
<style scoped></style>
