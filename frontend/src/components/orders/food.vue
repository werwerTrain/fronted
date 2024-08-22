<template>
  <div class="box">
  <div style="overflow: hidden;">
    <el-radio-group v-model="status">
      <el-radio-button label="全部订单" value="all"></el-radio-button>
      <el-radio-button label="已支付" value="paid"></el-radio-button>
      <el-radio-button label="已取消" value="cancel"></el-radio-button>
      <el-radio-button label="已完成" value="done"></el-radio-button>
    </el-radio-group>
  </div>
  <div>
    <el-scrollbar id="outer">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(item, index) in foodOrders"
        :id="item.oid" :name="item.oid" >
        <template #title>
          <div style="width: 100%;">
            <el-row>
              <el-col :span="4">
                <div style="font-size: 1.5em; color: #79bbff">
                  {{ item.tid }}
                </div>
              </el-col>
              <el-col :span="6">
                <div style="font-size: 1.1em; color: #73767a">
                  {{ item.date }} {{ item.time }}
                </div>
              </el-col>
              <el-col :span="10">
                <div style="font-size: 1.1em; color: #c8c9cc">
                  下单时间：{{ item.order_time }}
                </div>
              </el-col>
              <el-col :span="4">
                <div>
                  <span style="font-size: 1.1em; color: #73767a">订单状态：</span>
                  <span style="font-size: 1.2em; color: #79bbff" :style="{ color: getStatusColor(item.status) }">{{
                    item.status }}
                  </span>

                </div>
              </el-col>
            </el-row>
          </div>
        </template>
        <tempalte #default>
          <el-container style="height: 12em">
            <el-main style="padding:0">
              <el-scrollbar>
                <div class="scrollbar-flex-content">
                  <p v-for="(food, index2) in item.foods" :key="index2" class="scrollbar-demo-item">
                  <div>
                    <img loading="lazy" referrerpolicy="no-referrer" object-fit="contain" :src="food.photo" style="
                          width: 8em;
                          height: 8em;
                          display: block;
                          margin: auto;
                        " />
                    <div>
                      <span>{{ food.food_name }}</span>
                      <span style="font-weight: bold; color: #ffa31a">
                        ×{{ food.count }}
                      </span>
                    </div>
                  </div>
                  </p>
                </div>
              </el-scrollbar>
            </el-main>
            <el-aside style="
                width: 45%;
                padding-left: 2%;
                text-align: left;
                align-content: center;
              ">
              <span style="font-size: 1.2em; color: #c8c9cc;margin-right:2%;">总价</span>
              <span style="font-size: 2.5em; color: #ffa31a">￥{{ item.sum_price }}</span>
              <div class="mb-4" style="text-align: right">
                <span v-if="item.status === '已支付'" style="margin-right: 1%">
                  <el-popconfirm title="确定要取消这个订单吗？" @confirm="cancelOrder(item.oid)">
                    <template #reference>
                      <el-button type="info" text bg>取消订单</el-button>
                    </template>
                  </el-popconfirm>
                </span>

              </div>
            </el-aside>
          </el-container>
        </tempalte>
      </el-collapse-item>
    </el-collapse>
  </el-scrollbar>
  </div></div>
</template>

<script setup>
import { onMounted, ref, watch,nextTick } from "vue";
import {
  getFoodOrders,
  cancelFoodOrder,
} from "../../api/api.js";
import { ElMessage, ElNotification } from "element-plus";
import { useRoute } from "vue-router";
import emitter from '@/emitter.js';
const activeNames = ref([]);
const foodOrders = ref([]);

const status = ref("all");
const userID = localStorage.getItem("user_id");
const route = useRoute();
const scrollToOrder = async (orderId) => {
  const orderElement = document.getElementById(orderId);
  console.log("滚动到：", orderId);
  console.log("查询的orderELemnet:", orderElement);
  if (orderElement) {
    orderElement.scrollIntoView({ behavior: "smooth", block: "center" });
    await nextTick();
    setTimeout(() => {
      const tempActiveNames = [orderId];
      activeNames.value = tempActiveNames;
      console.log("模拟点击展开", activeNames.value);
    }, 300); // 延迟一段时间，确保滚动完成
  }
};
const getStatusColor = (status) => {
  if (status === "已完成") {
    return "#60B2FF";
  } else if (status === "已支付") {
    return "#24D36F";
  } else if (status === "已取消") {
    return "#FC604F";
  }
};
const handleChange = (val) => {
  console.log("展开了", val);
};
const getOrders = async () => {
  try {
    const response = await getFoodOrders(userID, status.value);
    console.log(status.value);
    foodOrders.value = response.data.result;
  } catch (error) {
    console.error("获取火车餐订单数组失败:", error);
  }
};
const cancelOrder = async (oid) => {
  try {
    const responce = await cancelFoodOrder(userID, oid);
    if (responce.data.result) {
      ElNotification({
        title: "订单取消提醒",
        message: "您刚刚取消了单号为" + oid +"的火车餐订单,退款将于1~5个工作日原路返回。",
        type: "success",
      });
      emitter.emit('getAllMessage');
    } else {
      ElNotification({
        title: "取消订单失败",
        message: responce.data.info,
        type: "error",
      });
    }
  } catch (error) {
    console.error("取消订单失败", error);
    ElMessage.error("取消订单失败");
  }
  getOrders();
};


onMounted(() => {
  getOrders();
  const orderId = route.query.orderId;
  if (orderId) {
    setTimeout(() => {
      scrollToOrder(orderId);
    }, 500);
  }
});
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
setInterval(getOrders,60000);
</script>

<style scoped>
.scrollbar-flex-content {
  display: flex;
}
.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  width: 10em;
  height: 10em;
  margin: 0.25em;
  padding: 0.5em;
  text-align: center;
  border-radius: 4px;
  background: #fff5e5;
  color: var(--el-color-danger);
}

.el-collapse-item:focus {
  outline: 2px solid #409eff; /* 示例聚焦样式 */
}
.box {
  overflow-y: scroll;
}
</style>