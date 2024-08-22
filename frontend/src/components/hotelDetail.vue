<template>
  <div class="home-container" style="overflow-y: scroll; overflow-x: hidden">
    <el-scrollbar style="height: 100%">
      <div class="top">
        <div
          style="
            display: flex;
            border-color: #a3a3a3;
            border-style: solid;
            margin: 0 auto;
          "
          class="top-info"
        >
          <div style="height: 25px; width: 160px; margin-left: 10px">
            <div
              style="
                margin-top: 5px;
                padding-left: 10px;
                color: #969696;
                height: 18px;
                font-size: 15px;
              "
            >
              入住时间
            </div>
            <el-date-picker
              class="date_picker"
              v-model="check_in"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="date"
              size="large"
              style="height: 25px; width: 160px; margin-top: 0px; border: none"
              placeholder="请选择"
              bordered="0"
              suffixIcon=" "
              @change="recalculateDateDiff"
            />
          </div>
          <div
            style="
              height: 25px;
              width: 80px;
              margin-top: 15px;
              margin-left: 10px;
            "
          >
            <div
              style="
                background-color: #ededed;
                margin-top: 5px;
                width: 55px;
                padding-left: 15px;
                color: black;
              "
            >
              {{ daysDiff }}晚
            </div>
          </div>
          <div style="height: 25px; width: 160px">
            <div
              style="
                margin-top: 5px;
                padding-left: 10px;
                color: #969696;
                height: 18px;
                font-size: 15px;
              "
            >
              退房时间
            </div>
            <el-date-picker
              class="date_picker"
              v-model="check_out"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              type="date"
              size="large"
              style="height: 25px; width: 160px; margin-top: 0px; border: none"
              placeholder="请选择"
              bordered="0"
              suffixIcon=" "
              @change="recalculateDateDiff"
            />
          </div>
        </div>
      </div>

      <div
        v-if="hotelData"
        style="border-color: #a3a3a3; margin: 0 auto"
        class="information"
      >
        <div
          style="
            display: flex;
            margin-left: 10px;
            margin-top: 10px;
            height: 70px;
          "
        >
          <p style="font-size: 40px; font-weight: bold">{{ hotelData.name }}</p>
          <div style="margin-top: 5px; margin-left: 20px">
            <a-rate :value="hotelData.rank" style="font-size: 30px" disabled />
          </div>
        </div>

        <div style="display: flex; margin-left: 10px; color: grey">
          <EnvironmentOutlined />
          <p style="margin-left: 3px">{{ hotelData.position }}</p>
        </div>
      </div>

      <div
        v-if="hotelData"
        style="
          display: grid;
          grid-template-columns: 650px 245px 245px;
          grid-template-rows: 220px;
          grid-gap: 10px;
          border-color: #a3a3a3;
          border-style: solid;
          margin: 0 auto;
        "
        class="photo"
      >
        <div class="big" style="grid-column-start: 1">
          <a-image
            :preview="{ visible: false }"
            @click="visible = true"
            :width="650"
            height="440"
            style="object-fit: cover; height: 450px; width: 650px"
            :src="hotelData.photos[0]"
          />
        </div>
        <div class="small" style="grid-column-start: 2">
          <a-image
            :preview="{ visible: false }"
            @click="visible = true"
            :width="245"
            height="220"
            style="height: 220px; width: 245px; object-fit: cover"
            :src="hotelData.photos[1]"
          />
        </div>
        <div class="small" style="grid-column-start: 3">
          <a-image
            :preview="{ visible: false }"
            @click="visible = true"
            :width="245"
            height="220"
            style="height: 220px; width: 245px; object-fit: cover"
            :src="hotelData.photos[2]"
          />
        </div>
        <div class="small" style="grid-column-start: 2">
          <a-image
            :preview="{ visible: false }"
            @click="visible = true"
            :width="245"
            height="220"
            style="height: 220px; width: 245px; object-fit: cover"
            :src="hotelData.photos[3]"
          />
        </div>
        <div class="small" style="grid-column-start: 3">
          <a-image
            :preview="{ visible: false }"
            @click="visible = true"
            :width="245"
            height="220"
            style="height: 220px; width: 245px; object-fit: cover"
            :src="hotelData.photos[4]"
          />
        </div>
        <div style="display: none">
          <a-image-preview-group
            :preview="{ visible, onVisibleChange: (vis) => (visible = vis) }"
          >
            <template v-for="(photo, index) in hotelData.photos" :key="index">
              <a-image :src="photo" />
            </template>
          </a-image-preview-group>
        </div>
      </div>
      <el-dialog
        v-model="payVisible"
        title="确认订单"
        width="20em"
        align-center
      >
        <div v-if="payVisible">
          <img
            :src="payPicture"
            alt="2DPayPicture"
            style="width: 100%; height: 100%; object-fit: cover"
            id
          />
          <div>
            <el-button
              type="primary"
              style="margin-left: 20px; margin-top: 10px"
              @click="changePay"
              >换一种支付方式</el-button
            >
            <el-button
              type="success"
              style="margin-left: 20px; margin-top: 10px"
              @click="pay"
              >已完成支付</el-button
            >
          </div>
        </div>
      </el-dialog>

      <div
        v-if="hotelData"
        style="
          display: flex;
          border-color: #a3a3a3;
          margin: 0 auto;
          margin-top: 10px;
        "
        class="other"
      >
        <el-tabs
          v-model="activeName"
          class="demo-tabs"
          @tab-click="handleClick"
          size="large"
        >
          <el-tab-pane label="房型" name="rooms">
            <div style="height: 50px; display: flex; margin-left: 2px">
              <el-space :size="size" :spacer="spacer">
                <el-check-tag
                  :checked="checked1"
                  type="primary"
                  @change="onChange1"
                >
                  标准双人间
                </el-check-tag>
                <el-check-tag
                  :checked="checked2"
                  type="primary"
                  @change="onChange2"
                >
                  大床房
                </el-check-tag>
                <el-check-tag
                  :checked="checked3"
                  type="primary"
                  @change="onChange3"
                >
                  家庭房
                </el-check-tag>
              </el-space>
            </div>
            <div style="width: 1155px; display: flex; margin-left: 2px">
              <a-list
                item-layout="vertical"
                size="large"
                :pagination="pagination"
                :data-source="hotelData.rooms"
              >
                <template #renderItem="{ item }">
                  <a-list-item key="item.name" style="width: 1155px">
                    <template #actions>
                      <ReconciliationOutlined />
                      <span>
                        {{ item.size }}
                      </span>
                      <span>
                        <ReconciliationOutlined />
                        {{ item.bed_size }}
                      </span>

                      <div style="margin-left: 200px; display: flex;width:170px;">
                        <a-typography-title :level="2"
                          ><span style="font-size: 20px; margin-right: 5px;"
                            >均
                          </span>
                          ¥ {{ item.price }}
                        </a-typography-title>
                      </div>

                      <a-button
                        :size="large"
                        style="background-color: {{ item.num === 0 ? 'darkgray' : 'inherit' }};right:10px;width:100px;"
                        @click="showDrawer(item)"
                        :disabled="item.num === 0"
                      >
                        {{ item.num === 0 ? "已售完" : "点击预订" }}
                      </a-button>
                      <a-drawer
                        v-model:open="open"
                        class="custom-class"
                        root-class-name="root-class-name"
                        :root-style="{ color: 'blue' }"
                        style="color: black"
                        title="预订信息"
                        placement="right"
                        @after-open-change="afterOpenChange"
                      >
                        <div
                          style="
                            display: flex;
                            border-color: #a3a3a3;
                            margin: 0 auto;
                          "
                          class="top-info"
                        >
                          <div style="height: 25px; width: 120px">
                            <div
                              style="
                                margin-top: 5px;
                                padding-left: 10px;
                                color: #969696;
                                height: 18px;
                                font-size: 15px;
                              "
                            >
                              入住时间
                            </div>
                            <el-date-picker
                              disabled="true"
                              ;
                              v-model="check_in"
                              size="large"
                              style="
                                height: 25px;
                                width: 120px;
                                border-style: none;
                                margin-top: 10px;
                              "
                              placeholder="hihi"
                              suffixIcon=" "
                            />
                          </div>
                          <div
                            style="
                              height: 25px;
                              width: 80px;
                              margin-top: 15px;
                              margin-left: 20px;
                            "
                          >
                            <div
                              style="
                                background-color: #ededed;
                                margin-top: 5px;
                                width: 55px;
                                padding-left: 15px;
                                color: black;
                              "
                            >
                              {{ daysDiff }}晚
                            </div>
                          </div>
                          <div style="height: 25px; width: 130px">
                            <div
                              style="
                                margin-top: 5px;
                                padding-left: 10px;
                                color: #969696;
                                height: 18px;
                                font-size: 15px;
                              "
                            >
                              退房时间
                            </div>
                            <el-date-picker
                              disabled="true"
                              ;
                              v-model="check_out"
                              size="large"
                              style="
                                height: 25px;
                                width: 130px;
                                border-style: none;
                                margin-top: 10px;
                              "
                              placeholder="hihi"
                              suffixIcon=" "
                            />
                          </div>
                        </div>
                        <a-divider />
                        <p style="font-size: 17px">住客资料</p>

                        <p>房间数</p>
                        <el-select
                          v-model="roomCount"
                          placeholder="Select"
                          size="large"
                          style="width: 300px; margin-bottom: 10px"
                          @change="updateMoney"
                        >
                          <el-scrollbar style="height: 100px">
                            <el-option
                              v-for="index in selectedRoom.num"
                              :key="index"
                              :label="index + '间'"
                              :value="index"
                            />
                          </el-scrollbar>
                        </el-select>
                        <div
                          style="
                            height: 50px;
                            width: 300px;
                            background-color: #f8e8e2;
                            border-type: solid;
                            border-radius: 2px;
                            color: #eb775c;
                            padding-top: 4px;
                            padding-left: 6px;
                            padding-right: 3px;
                            margin-bottom: 15px;
                          "
                        >
                          请输入住客姓名以及身份证号，每间只需填1人。
                        </div>
                        <div style="height: 250px">
                          <el-scrollbar style="height: 250px">
                            <template v-for="i in roomCount">
                              <div style="margin-top: 1px; display: flex">
                                <div
                                  style="margin-top: 8px; margin-right: 10px"
                                >
                                  <p>住客{{ i }}</p>
                                </div>
                                <el-input
                                  v-model="input_name[i]"
                                  style="
                                    width: 70px;
                                    height: 35px;
                                    margin-right: 5px;
                                  "
                                  placeholder="姓名"
                                />
                                <el-input
                                  v-model="input_id[i]"
                                  style="width: 180px; height: 35px"
                                  placeholder="身份证号"
                                />
                              </div>
                            </template>
                          </el-scrollbar>
                        </div>
                        <div
                          style="height: 50px; margin-top: 50px; display: flex"
                        >
                          <div>
                            <p style="font-size: 20px; margin-top: 10px">
                              {{ "需支付: ¥" + money }}
                            </p>
                          </div>
                          <a-button
                            style="
                              margin-left: 70px;
                              margin-top: 5px;
                              height: 40px;
                              width: 110px;
                              background-color: #0077ff;
                              border-radius: 5px;
                              color: white;
                              font-size: 17px;
                              font-weight: bold;
                            "
                            @click="topay"
                          >
                            点击支付
                          </a-button>
                        </div>
                      </a-drawer>
                    </template>

                    <template #extra>
                      <img
                        :src="item.photo"
                        width="360"
                        height="200"
                        style="float: right"
                      />
                    </template>

                    <a-list-item-meta :description="'余' + item.num + '间'">
                      <template #title>
                        <a-typography-title :level="3">{{
                          item.name
                        }}</a-typography-title>
                      </template>
                    </a-list-item-meta>
                    <a-typography-paragraph>
                      <blockquote>{{ item.others }}</blockquote>
                    </a-typography-paragraph>
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </el-tab-pane>
          <el-tab-pane label="评论" name="comments">
            <div style="width: 1155px; display: flex; margin-left: 2px">
              <a-list
                v-if="hotelData.comments && hotelData.comments.length > 0"
                item-layout="vertical"
                size="large"
                :pagination="pagination"
                :data-source="hotelData.comments"
              >
                <template #renderItem="{ item }">
                  <a-list-item key="item.name" style="width: 1155px">
                    <template #actions>
                      <ReconciliationOutlined />
                      <span>
                        {{ item.time }}
                      </span>
                      <span>
                        {{ "ip:" + item.place }}
                      </span>
                    </template>

                    <template #extra>
                      <div
                        style="
                          margin-top: 20px;
                          font-size: 17px;
                          color: white;
                          background-color: black;
                          width: 40px;
                          text-align: center;
                          font-weight: bold;
                        "
                      >
                        {{ item.rank }}
                      </div>
                    </template>

                    <a-list-item-meta :description="item.room">
                      <template #title>
                        <a-typography-title :level="3">{{
                          item.name
                        }}</a-typography-title>
                      </template>
                      <template #avatar
                        ><a-avatar :src="item.photo"
                      /></template>
                    </a-list-item-meta>
                    <a-typography-paragraph style="font-size: 18px"
                      ><blockquote>
                        {{ item.content }}
                      </blockquote></a-typography-paragraph
                    >
                  </a-list-item>
                </template>
              </a-list>
            </div>
          </el-tab-pane>
          <el-tab-pane label="政策" name="policy">
            <div style="margin-bottom: 20px">
              <a-typography-title :level="3">{{
                "酒店政策"
              }}</a-typography-title>
            </div>
            <div
              style="
                display: grid;
                grid-template-columns: 280px 880px;
                grid-row-gap: 50px;
                grid-column-gap: 0;
              "
            >
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                {{ "酒店简介" }}
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  color: #4a4a4a;
                "
              >
                <div style="margin-bottom: 40px">
                  {{ hotelData.others.description }}
                </div>
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                {{ "成立时间" }}
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  color: #4a4a4a;
                "
              >
                <div style="margin-bottom: 40px">
                  {{ hotelData.others.set_time }}
                </div>
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                {{ "联系电话" }}
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  color: #4a4a4a;
                "
              >
                <div style="margin-bottom: 40px">
                  {{ hotelData.others.phone }}
                </div>
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                {{ "关于早餐" }}
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  color: #4a4a4a;
                "
              >
                <div style="margin-bottom: 40px">
                  {{ hotelData.others.breakfast_description }}
                </div>
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                {{ "年龄限制" }}
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  color: #4a4a4a;
                "
              >
                <div style="margin-bottom: 40px">
                  {{ hotelData.others.age_notion }}
                </div>
              </div>
              <div
                style="
                  border-bottom: solid;
                  border-bottom-color: #f0f0f0;
                  font-size: 18px;
                  font-weight: bold;
                "
              >
                {{ "入离时间" }}
              </div>

              <div>
                <div style="margin-bottom: 40px">
                  <div style="color: #4a4a4a">
                    {{ "入住时间:" + hotelData.others.checkin_time }}
                  </div>
                  <div style="color: #4a4a4a">
                    {{ "离开时间:" + hotelData.others.checkout_time }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { getHotelDetail, postHotelBill } from "../api/api.js";
import { useRoute } from "vue-router";
import { ref, onMounted, watch, nextTick } from "vue";
import {
  BookOutlined,
  HeartOutlined,
  StarOutlined,
  LikeOutlined,
  MessageOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons-vue";
//标签的选择的
const activeName = ref("rooms");

//Hotel
var hotelData = ref();
//comments
var commentData = ref([]);

const hotelid = ref("");

const visible = ref(false);

//页面加载预处理

const route = useRoute();
var check_in = ref(route.query.checkin || "");
var check_out = ref(route.query.checkout || "");

const fetchData = async () => {
  try {
    const response = await getHotelDetail(
      hotelid.value,
      checked1.value,
      checked2.value,
      checked3.value,
      check_in.value,
      check_out.value
    );
    hotelData.value = response.data;
    console.log("获取酒店详细信息成功", hotelData.value);
  } catch (error) {
    console.error("获取酒店详细信息失败：", error);
  }
};

onMounted(async () => {
  hotelid.value = route.query.id;
  const NstartDate = new Date(check_in.value);
  const NendDate = new Date(check_out.value);
  const timeDiff = Math.abs(NendDate - NstartDate);
  daysDiff.value = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  await fetchData(); // 等待数据加载完成
  await nextTick();

  // 这里可以根据需要进行其他操作
});

const actions = {
  icon1: StarOutlined,
  icon2: LikeOutlined,
  icon3: MessageOutlined,
};

//选房型
const checked1 = ref(true);
const checked2 = ref(true);
const checked3 = ref(true);

const onChange1 = (status) => {
  checked1.value = status;
  roomType.value=1;
};

const onChange2 = (status) => {
  checked2.value = status;
  roomType.value=2;
};

const onChange3 = (status) => {
  checked3.value = status;
  roomType.value=3;
};
watch(
  [checked1, checked2, checked3, check_in, check_out],
  (oldvalue, newvalue) => {
    // 检测到值发生变化，执行fetchData
    fetchData();
  }
);
//按钮
const isPressed = ref(false);

const toggleButton = () => {
  isPressed.value = !isPressed.value;
};

//预订房间
const open = ref(false);
const selectedRoom = ref(null);

const afterOpenChange = (bool) => {
  console.log("open", bool);
};

const value = ref("");
const customers=ref([]);
//选择的房间个数
const roomCount = ref(1);
//填写姓名、身份证
const input_name = ref([""]);
const input_id = ref([""]);

const showDrawer = (item) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    selectedRoom.value = item;
    money.value = item.price;
    open.value = true;
    input_name.value = [""];
    input_id.value = [""];
  } else {
    ElMessage({
      message: "请先登录",
      type: "error",
      plain: true,
    });
  }
};

//支付
import { ElMessage, ElMessageBox, ElNotification } from "element-plus";
import emitter from "@/emitter.js";
const money = ref();
const updateMoney = () => {
  money.value = selectedRoom.value.price * roomCount.value;
};
const payPicture = ref(require("../assets/vxPay.jpg"));
const payVisible = ref(false);
const billVisible = ref(false);
const roomType = ref(1);
const topay = async () => {
  console.log(roomCount.value);
  console.log(input_name.value.length);
  console.log(input_id.value.length);
  console.log(input_id.value);
  console.log(input_name.value);

  if (input_name.value.length !== input_id.value.length) {
    ElMessage({
      message: "未填写全部信息",
      type: "error",
    });
    return; // 直接退出函数
  }
  customers.value = [];

  if (
    input_name.value.length <= roomCount.value ||
    input_id.value.length <= roomCount.value
  ) {
    ElMessage({
      message: "未填写全部信息",
      type: "error",
    });
    return;
  }
  if (input_name.value.length === input_id.value.length) {
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    for (let i = 1; i <= roomCount.value; i++) {
      
      if (input_id.value[i] === "" || input_name.value[i] === "") {
        ElMessage({
          message: "未填写全部信息",
          type: "error",
        });
        return;
      }
      console.log(input_id.value[i]);
      if (!p.test(input_id.value[i])) {
        ElMessage({
          message: "身份证号格式错误",
          type: "error",
        });
        return;
      }
      customers.value.push({ id: input_id.value[i], name: input_name.value[i] });
    }
    payVisible.value = true;
  } else {
    console.error("未填写全部信息");
  }
  
};

const pay = async () => {
  open.value = false;
  payVisible.value = false;
  console.log(customers.value);
  try {
    const response = await postHotelBill(
      hotelid.value,
      localStorage.getItem("user_id"),
      check_in.value,
      check_out.value,
      roomCount.value,
      roomType.value,
      customers.value,
      money.value
    );
    var result = response.data.result;
    console.log(result);
    if (result) {
      ElNotification({
        title: "预订酒店成功",
        message:
          "您已成功预定酒店" +
          "，入住时间" +
          check_in.value +
          ",祝您旅途愉快！",
        type: "success",
      });
      emitter.emit("getAllMessage");
    } else {
      ElMessage({
        message: "下单失败",
        type: "error",
      });
    }
  } catch (error) {
    console.log("提交酒店订单失败", error);
  }
  input_name.value = ref([""]);
  input_id.value = ref([""]);
  fetchData();
};
const changePay = () => {
  if (payPicture.value === require("../assets/vxPay.jpg"))
    payPicture.value = require("../assets/zfbPay.jpg");
  else payPicture.value = require("../assets/vxPay.jpg");
};
const resetValue = () => {
  billVisible.value = false;
  payVisible.value = false;
  payPicture.value = require("../assets/vxPay.jpg");
};

//计算时间差,防止入住>退房
const daysDiff = ref(0);
const recalculateDateDiff = () => {
  const startDate = new Date(check_in.value);
  const endDate = new Date(check_out.value);
  if (endDate <= startDate) {
    // 退房日期不得早于入住日期，这里可以进行相应处理，比如重置退房日期为入住日期后一天
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 2);
    check_out.value = nextDay.toISOString().substr(0, 10);
  }
  const NstartDate = new Date(check_in.value);
  const NendDate = new Date(check_out.value);
  const timeDiff = Math.abs(NendDate - NstartDate);
  daysDiff.value = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
};
</script>


<style scoped>
::v-deep(.el-input__prefix) {
  display: none;
}
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  height: 60px;
}

.top-info {
  border: 1px;
  border-radius: 5px;
  height: 60px;
  width: 440px;
}

.information {
  border: 1px;
  border-radius: 5px;
  height: 108px;
  width: 1160px;
}
.photo {
  border: 1px;
  border-radius: 5px;
  height: 450px;
  width: 1160px;
}
.other {
  border: 1px;
  border-radius: 5px;
  width: 1160px;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}

::v-deep .el-tabs__item {
  font-size: 20px;
  padding-right: 40px;
  color: #d6d6d6;
}

::v-deep .el-tabs__item.is-active {
  color: black;
}
::v-deep .el-tabs__item:hover {
  color: black;
  cursor: pointer;
}
::v-deep .el-tabs__active-bar {
  background-color: black;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.before {
  background-color: white;
  border-style: solid;
  /* 其他样式 */
}
.after {
  background-color: #0b7def;
}
.circle {
  border-radius: 50%; /* 将按钮变成圆形 */
  width: 45px; /* 按钮宽度 */
  height: 45px; /* 按钮高度 */
  border-width: 1px;
  border-color: grey;
}

.date_picker .el-date-picker__editor {
  border: none; /* 去掉输入框的边框 */
}
</style>