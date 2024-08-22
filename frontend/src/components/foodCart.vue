<template>
  <div style="background-color: white; width: 21em">
    <el-card v-show="isShow">
      <template #header>
        <div style="display: flex">
          <div style="margin-right: 1em">购物车</div>
          <el-button
            :icon="Delete"
            circle
            style="height: 1.6em; width: 1.6em"
            @click="clear"
          ></el-button>
        </div>
      </template>
      <div v-for="(item, index) in model" :key="index">
        <text style="display: inline-block; width: 6em">{{ item.name }}</text>
        <span
          style="
            display: inline-block;
            width: 6em;
            font-weight: bold;
            color: #ffa31a;
          "
          >￥{{ item.price * item.number }}</span
        >
        <el-input-number
          v-model="item.number"
          size="small"
          :min="0"
          style="width: 6em"
        />
      </div>
      <template #footer>
        <div
          style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          "
        >
          <span>
            <text>总金额：</text>
            <text style="font-weight: bold; color: #ffa31a"
              >￥{{ sum_price }}</text
            >
          </span>
          <div>
            <el-button
              color="#ffa31a"
              :dark="isDark"
              plain
              :disabled="sum_price === 0"
              @click="billVisible = true"
              >结算</el-button
            >
          </div>
        </div>
      </template>
    </el-card>
  </div>
  <div @click="clickCart" style="display: block; text-align: right">
    <img
      src="../assets/shopingCart.png"
      alt="shoppingCart"
      style="width: 3em"
    />
  </div>
  <div>
    <el-dialog v-model="billVisible" title="确认订单" width="20em" align-center>
      <div>
        <div
          v-for="(item, index) in model"
          :key="index"
          style="display: flex; justify-content: space-between"
        >
          <div style="display: inline-block; width: 6em">
            {{ item.name }}×{{ item.number }}
          </div>
          <div
            style="
              display: inline-block;
              width: 6em;
              font-weight: bold;
              color: #ffa31a;
            "
          >
            ￥{{ item.price * item.number }}
          </div>
        </div>
      </div>
      <template #footer>
        <div
          style="
            display: flex;
            justify-content: space-around;
            align-items: center;
          "
        >
          <div>
            <text>总金额：</text>
            <text style="font-weight: bold; color: #ffa31a"
              >￥{{ sum_price }}</text
            >
          </div>
          <div class="dialog-footer" v-if="buttonVisible">
            <el-button @click="billVisible = false">取消</el-button>
            <el-button
              type="primary"
              @click="toPay"
              color="#ffa31a"
              :dark="isDark"
              plain
            >
              确认
            </el-button>
          </div>
        </div>
        <div v-if="payVisible">
          <img
            :src="payPicture"
            alt="2DPayPicture"
            style="width: 100%; height: 100%; object-fit: cover"
            id
          />
          <div>
            <el-button type="primary" @click="changePay"
              >换一种支付方式</el-button
            >
            <el-button type="success" @click="$emit('getPaid',sum_price);resetValue();clear();"
              >已完成支付</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { Delete } from "@element-plus/icons-vue";
const model = defineModel();
var sum_price = ref(0);
var isShow = ref(false);
const billVisible = ref(false);
const payVisible = ref(false);
const buttonVisible = ref(true);
const payPicture = ref(require("../assets/vxPay.jpg"));
const clickCart = () => {
  isShow.value = !isShow.value;
};
const clear = () => {
  for (const item of model.value) {
    item.number = 0;
  }
};
const toPay = () => {
  payVisible.value = true;
  buttonVisible.value = false;
};
const changePay = () => {
  if (payPicture.value === require("../assets/vxPay.jpg"))
    payPicture.value = require("../assets/zfbPay.jpg");
  else payPicture.value = require("../assets/vxPay.jpg");
};
const resetValue = () => {
  billVisible.value = false;
  payVisible.value = false;
  buttonVisible.value = true;
  payPicture.value = require("../assets/vxPay.jpg");
};

onMounted(() => {});
watch(model, (newmodel) => {
  console.log("购物车",newmodel);
  const total = newmodel.reduce((acc, item) => {
    return acc + item.price * item.number;
  }, 0);
  // 将总价存储在 sum_price 中
  sum_price = total;
  if(sum_price!=0){
    isShow.value = true;
  }
  else{
    isShow.value = false;
  }
});
watch(billVisible, (newValue) => {
  if (newValue === false) {
    resetValue();
  }
});
</script>
<style scoped>
</style>