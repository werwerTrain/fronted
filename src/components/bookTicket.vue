<template>
  <div style="width: 100%; overflow: hidden">
    <v-card
      hover
      style="
        background-color: #e4f5ff;
        border-radius: 25px;
        width: 100%;
        height: 10%;
        display: block;
      "
    >
      <div class="select">
        <el-autocomplete
          v-model="startStation"
          :fetch-suggestions="queryStartStation"
          placeholder="出发地"
          class="item"
          @select="handleStart"
          clearable
          :popper-class="popperClass"
        />
        <el-icon :size="20">
          <Switch @click="switchStation" />
        </el-icon>
        <el-autocomplete
          v-model="destinationStation"
          :fetch-suggestions="queryStartStation"
          placeholder="到达地"
          class="item"
          @select="handleDestination"
          clearable
          :popper-class="popperClass"
        />
        <el-date-picker
          class="item"
          v-model="date"
          type="date"
          placeholder="出发日期"
          :shortcuts="shortcuts"
          value-format="YYYY-MM-DD"
          :size="20"
          :disabled-date="disabledDate"
        />
        <el-icon style="width: 30px">
          <Search
            @click="search"
            style="width: 30px; height: 200%; border-radius: 5px"
          />
        </el-icon>
      </div>
      <div
        style="
          margin-top: 0.1%;
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding-left: 1%;
        "
      >
        <div style="flex: 1; display: flex; justify-content: center">
          <el-text v-if="startInvalid" type="info" style="text-align: center"
            >没有查询到车站</el-text
          >
        </div>
        <div style="flex: 1; display: flex; justify-content: center">
          <el-text
            v-if="destinationInvalid"
            type="info"
            style="text-align: center"
            >没有查询到车站</el-text
          >
        </div>
        <div style="flex: 1"></div>
      </div>
    </v-card>
    <div
      style="
        margin-top: 0.9%;
        width: 100%;
        height: 13%;
        display: block;
        padding-left: 1%;
      "
    >
      <el-row>
        <el-col :span="1.5">
          <el-text tag="b" size="large">车次类型：</el-text>
        </el-col>
        <el-col :span="1">
          <el-button type="success" plain size="small" @click="selectAllStyle"
            >全部</el-button
          >
        </el-col>
        <el-col :span="7" style="margin-top: -0.5%">
          <el-checkbox v-model="train" label="动车" size="large" />
          <el-checkbox v-model="normalTrain" label="普通火车" size="large" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 0.5%">
        <el-col :span="1.5">
          <el-text tag="b" size="large">车次席别：</el-text>
        </el-col>
        <el-col :span="1">
          <el-button type="success" plain size="small" @click="selectAllSeat"
            >全部</el-button
          >
        </el-col>
        <el-col :span="20.5" style="margin-top: -0.5%">
          <el-checkbox v-model="business" label="商务座" size="large" />
          <el-checkbox v-model="one" label="一等座" size="large" />
          <el-checkbox v-model="two" label="二等座" size="large" />
          <el-checkbox v-model="soft_sleeper" label="软卧" size="large" />
          <el-checkbox v-model="hard_sleeper" label="硬卧" size="large" />
          <el-checkbox v-model="hard_seat" label="硬座" size="large" />
        </el-col>
      </el-row>
      <el-row style="margin-top: 0.5%">
        <el-col :span="1.5">
          <el-text tag="b" size="large">排序方式：</el-text>
        </el-col>
        <el-col :span="10" style="margin-top: -0.5%">
          <el-radio-group v-model="sortType" class="ml-4">
            <el-radio value="1" size="large">发时最早</el-radio>
            <el-radio value="2" size="large">发时最晚</el-radio>
            <el-radio value="3" size="large">耗时最短</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <div
      style="
        margin-top: 0.7%;
        width: 100%;
        height: 3%;
        display: block;
        padding-left: 1%;
      "
    >
      <el-row :gutter="40">
        <el-col :span="9">
          <el-text tag="i" style="color: gray" v-if="show === true"
            >{{ startStation }}到{{ destinationStation }}共{{
              searchResult.length
            }}个车次</el-text
          >
        </el-col>
        <el-col :span="2" style="margin-top: -0.7%" :offset="12">
          <el-checkbox v-model="isHide" label="隐藏冲突列车信息" size="large" />
        </el-col>
      </el-row>
    </div>
    <div
      style="
        margin-top: 0.2%;
        width: 100%;
        display: block;
        padding-left: 1%;
        margin-bottom: 3%;
      "
    >
      <el-table
        :data="searchResult"
        :header-cell-style="{ background: '#8abbe7', color: 'white' }"
        empty-text="没有列车信息"
      >
        <el-table-column prop="tid" label="车次" width="160">
          <template #default="scope">
            <el-popover
              effect="light"
              trigger="hover"
              placement="right"
              width="auto"
            >
              <template #default>
                <el-table :data="scope.row.station_info">
                  <el-table-column width="50" property="id" label="站序" />
                  <el-table-column width="70" property="name" label="站名" />
                  <el-table-column
                    width="250"
                    property="arrive"
                    label="到站时间"
                  />
                  <el-table-column
                    width="250"
                    property="departure"
                    label="出发时间"
                  />
                  <el-table-column
                    width="100"
                    property="stop"
                    label="停留时间"
                  />
                </el-table>
              </template>
              <template #reference>
                <el-tag>{{ scope.row.tid }}</el-tag>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="station" :label="'出发站\n到达站'" width="240" />
        <el-table-column
          prop="startEnd"
          :label="'出发时间\n到达时间'"
          width="240"
        />
        <el-table-column prop="time" label="历时" width="170" />
        <el-table-column
          prop="business"
          label="商务座"
          width="140"
          v-if="business === true"
        >
          <template #default="scope">
            <span v-if="scope.row.business === '无票'" style="color: gray">{{
              scope.row.business
            }}</span>
            <span v-else style="color: #37b328">{{ scope.row.business }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="one"
          label="一等座"
          width="130"
          v-if="one === true"
        >
          <template #default="scope">
            <span v-if="scope.row.one === '无票'" style="color: gray">{{
              scope.row.one
            }}</span>
            <span v-else style="color: #37b328">{{ scope.row.one }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="two"
          label="二等座"
          width="130"
          v-if="two === true"
        >
          <template #default="scope">
            <span v-if="scope.row.two === '无票'" style="color: gray">{{
              scope.row.two
            }}</span>
            <span v-else style="color: #37b328">{{ scope.row.two }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="soft_sleeper"
          label="软卧"
          width="130"
          v-if="soft_sleeper === true"
        >
          <template #default="scope">
            <span
              v-if="scope.row.soft_sleeper === '无票'"
              style="color: gray"
              >{{ scope.row.soft_sleeper }}</span
            >
            <span v-else style="color: #37b328">{{
              scope.row.soft_sleeper
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hard_sleeper"
          label="硬卧"
          width="130"
          v-if="hard_sleeper === true"
        >
          <template #default="scope">
            <span
              v-if="scope.row.hard_sleeper === '无票'"
              style="color: gray"
              >{{ scope.row.hard_sleeper }}</span
            >
            <span v-else style="color: #37b328">{{
              scope.row.hard_sleeper
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="hard_seat"
          label="硬座"
          v-if="hard_seat === true"
          width="130"
        >
          <template #default="scope">
            <span v-if="scope.row.hard_seat === '无票'" style="color: gray">{{
              scope.row.hard_seat
            }}</span>
            <span v-else style="color: #37b328">{{ scope.row.hard_seat }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="备注" width="200">
          <template #default="scope">
            <el-button type="success" plain @click="submitTicket(scope.$index)"
              >预订</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, watchEffect } from "vue";
import { getStation, getSearchResult } from "../api/api";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const show = ref(false);
const router = useRouter();
const date = ref(""); /**出发时间 */
const train = ref(true); /**高铁 */
const normalTrain = ref(true); /**正常火车 */
const isHide = ref(true); /**是否隐藏冲突列车信息 */
const business = ref(true); /**商务座 */
const one = ref(true); /**一等座*/
const two = ref(true); /**二等座 */
const soft_sleeper = ref(true); /**软卧 */
const hard_sleeper = ref(true); /**硬卧 */
const hard_seat = ref(true); /**硬座 */
const sortType = ref("1"); /**排序方式 */
const startStation = ref(""); /**起始站 */
const destinationStation = ref(""); /**终点站 */
const startStationOptions = ref([]); /**所有站点信息 */
const stations = ref([]); /*车站信息*/
const searchValid = ref(false);
const searchResult = ref([]);
const isLoggedIn = ref(localStorage.getItem("isLoggedIn"));
const userID = localStorage.getItem("user_id"); //当前用户ID
const submitTicket = (lineIndex) => {
  // url.value=router.resolve({
  //     path: "/home/ticketDetail",
  //     query: {
  //         line: JSON.stringify(searchResult.value[lineIndex]),
  //     },
  // });
  // window.open(url.value.href,"_blank");
  isLoggedIn.value = localStorage.getItem("isLoggedIn");
  if (isLoggedIn.value === "true") {
    router.push({
      path: "/home/ticketDetail",
      query: {
        line: JSON.stringify(searchResult.value[lineIndex]),
      },
    });
  } else {
    ElMessage({
      message: "请先登录",
      type: "error",
      plain: true,
    });
  }
};

const handleStart = (item) => {
  console.log("Selected start station:", item);
};
const handleDestination = (item) => {
  console.log("Selected end station:", item);
};
const queryStartStation = (queryString, cb) => {
  const filteredOptions = queryString
    ? startStationOptions.value.filter((option) =>
        option.value.toLowerCase().includes(queryString.toLowerCase())
      )
    : startStationOptions.value;
  cb(filteredOptions);
};
const first = ref(false);
const fetchSearchResult = async () => {
  if (searchValid.value === false && first.value) {
    var isGD = 1;
    if (train.value === true && normalTrain.value === true) isGD = 2;
    else if (normalTrain.value === true && train.value === false) isGD = 0;
    var seatType = [
      business.value,
      one.value,
      two.value,
      soft_sleeper.value,
      hard_sleeper.value,
      hard_seat.value,
    ];
    try {
      var tempUserID;
      isLoggedIn.value = localStorage.getItem("isLoggedIn");
      if (isLoggedIn.value === "true") {
        tempUserID = userID;
      } else {
        tempUserID = "0";
      }
      const response = await getSearchResult(
        startStation.value,
        destinationStation.value,
        date.value,
        isGD,
        sortType.value,
        seatType,
        isHide.value,
        tempUserID
      );
      var a = response.data.result;
      for (let i = 0; i < a.length; i++) {
        a[i].startEnd = `${a[i].start_time}\n${a[i].arrive_time}`;
        delete a[i].start_time;
        delete a[i].arrive_time;
        a[i].station = `${a[i].start_station}\n${a[i].arrive_station}`;
        delete a[i].start_station;
        delete a[i].arrive_station;
        if (a[i].business) {
          a[i].business_remain = a[i].business.remain;
          a[i].business_price = a[i].business.price;
          if (a[i].business.remain != 0) {
            var temp = a[i].business.price;
            delete a[i].business;
            a[i].business = "￥" + temp + "元";
          } else {
            delete a[i].business;
            a[i].business = "无票";
            a[i].business_remain = "无票";
          }
        } else {
          a[i].business = "无票";
        }
        if (a[i].one) {
          a[i].one_remain = a[i].one.remain;
          a[i].one_price = a[i].one.price;
          if (a[i].one.remain != 0) {
            var temp = a[i].one.price;
            delete a[i].one;
            a[i].one = "￥" + temp + "元";
          } else {
            delete a[i].one;
            a[i].one = "无票";
            a[i].one_remain = "无票";
          }
        } else {
          a[i].one = "无票";
        }
        if (a[i].two) {
          a[i].two_remain = a[i].two.remain;
          a[i].two_price = a[i].two.price;
          if (a[i].two.remain != 0) {
            var temp = a[i].two.price;
            delete a[i].two;
            a[i].two = "￥" + temp + "元";
          } else {
            delete a[i].two;
            a[i].two = "无票";
            a[i].two_remain = "无票";
          }
        } else {
          a[i].two = "无票";
        }
        if (a[i].soft_sleeper) {
          a[i].soft_sleeper_remain = a[i].soft_sleeper.remain;
          a[i].soft_sleeper_price = a[i].soft_sleeper.price;
          if (a[i].soft_sleeper.remain != 0) {
            var temp = a[i].soft_sleeper.price;
            delete a[i].soft_sleeper;
            a[i].soft_sleeper = "￥" + temp + "元";
          } else {
            delete a[i].soft_sleeper;
            a[i].soft_sleeper = "无票";
            a[i].soft_sleeper_remain = "无票";
          }
        } else {
          a[i].soft_sleeper = "无票";
        }
        if (a[i].hard_sleeper) {
          a[i].hard_sleeper_remain = a[i].hard_sleeper.remain;
          a[i].hard_sleeper_price = a[i].hard_sleeper.price;
          if (a[i].hard_sleeper.remain != 0) {
            var temp = a[i].hard_sleeper.price;
            delete a[i].hard_sleeper;
            a[i].hard_sleeper = "￥" + temp + "元";
          } else {
            delete a[i].hard_sleeper;
            a[i].hard_sleeper = "无票";
            a[i].hard_sleeper_remain = "无票";
          }
        } else {
          a[i].hard_sleeper = "无票";
        }
        if (a[i].hard_seat) {
          a[i].hard_seat_remain = a[i].hard_seat.remain;
          a[i].hard_seat_price = a[i].hard_seat.price;
          if (a[i].hard_seat.remain != 0) {
            var temp = a[i].hard_seat.price;
            delete a[i].hard_seat;
            a[i].hard_seat = "￥" + temp + "元";
          } else {
            delete a[i].hard_seat;
            a[i].hard_seat = "无票";
            a[i].hard_seat_remain = "无票";
          }
        } else {
          a[i].hard_seat = "无票";
        }
      }
      searchResult.value = a;
      console.log("获取查询信息成功", a);
      if (searchResult.value.length == 0) {
        ElMessage({
          message: "您所查询的时间暂时没有班次~",
          type: "info",
        });
      } else {
        ElMessage({
          message: "查询成功",
          type: "success",
        });
      }
      show.value = true;
    } catch (error) {
      console.error("获取查询信息失败", error);
    }
  }
};
const search = () => {
  if (
    startStation.value === "" ||
    destinationStation.value === "" ||
    date.value === ""
  ) {
    ElMessage({
      message: "还有没填写的信息",
      type: "error",
      plain: true,
    });
  } else if (searchValid.value === true) {
    ElMessage({
      message: "没有查询到车站",
      type: "error",
      plain: true,
    });
  } else {
    fetchSearchResult();
  }
};
const startInvalid = ref(false);
const destinationInvalid = ref(false);
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7;
};
watch(startStation, (newValue) => {
  startInvalid.value =
    newValue != "" &&
    !stations.value.some((station) => station.value === newValue);
  if (startInvalid.value === true || destinationInvalid.value === true)
    searchValid.value = true;
  else searchValid.value = false;
});

watch(destinationStation, (newValue) => {
  destinationInvalid.value =
    newValue != "" &&
    !stations.value.some((station) => station.value === newValue);
  if (startInvalid.value === true || destinationInvalid.value === true)
    searchValid.value = true;
  else searchValid.value = false;
});
watch(
  [train, normalTrain, business, one, two, sortType, isHide],
  (newValue, oldValue) => {
    console.log("筛选方式改变", newValue, oldValue);
    fetchSearchResult();
  },
  { immediate: true }
);
const flag = ref(1);
const fetchData = async () => {
  if (flag.value === 1) {
    flag.value++;
    try {
      const data = await getStation();
      stations.value = data.data.station;
      console.log("获取车站数组成功", stations.value);
      startStationOptions.value = stations.value;
    } catch (error) {
      console.error("获取车站数组失败：", error);
    }
  }
};
onMounted(() => {
  fetchData();
  first.value = true;
});
const shortcuts = [
  {
    text: "今天",
    value: new Date(),
  },
  {
    text: "明天",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24);
      return date;
    },
  },
  {
    text: "一周以后",
    value: () => {
      const date = new Date();
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
      return date;
    },
  },
];
const switchStation = () => {
  var temp = startStation.value;
  startStation.value = destinationStation.value;
  destinationStation.value = temp;
  search();
};
const selectAllStyle = () => {
  train.value = true;
  normalTrain.value = true;
};
const selectAllSeat = () => {
  business.value = true;
  one.value = true;
  two.value = true;
  soft_sleeper.value = true;
  hard_sleeper.value = true;
  hard_seat.value = true;
};
</script>

<style>
.select {
  margin-top: 1%;
  margin-left: 2%;
  display: flex;
  align-items: center;
  margin-right: 2%;
  margin-bottom: 1%;
}

.item {
  flex: 1;
  margin-right: 10px;
  margin-left: 10px;
}

.el-table {
  .cell {
    white-space: pre-wrap !important;
    text-align: center !important;
  }

  width: 100%;
}

::v-deep .el-table__fixed {
  height: 100% !important;
  z-index: 50;
}

::v-deep .el-table__body-wrapper {
  overflow: scroll !important;
}

::v-deep .el-table__fixed:before {
  width: 0;
  height: 0;
}
</style>
