<template>

  <div style="display: flex; flex-direction: column; align-items: center; width: 100%;height: 100%;">

    <v-card hover style="background-color: #e4f5ff; border-radius: 25px; width: 100%; height: 10%; display: block;">
      <div class="select">
        <el-autocomplete v-model="arrive_station" :fetch-suggestions="queryStation" placeholder="到达地"
          class="item" @select="handleArrive" clearable :popper-class="popperClass" />
        <el-date-picker class="item" v-model="arrive_date" type="date" placeholder="到达时间" :shortcuts="shortcuts" :disabled-date="disabledDate"
          :size="20" @change="checkTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
        <el-date-picker class="item" v-model="Ideparture_date" type="date" placeholder="离开时间" :shortcuts="shortcuts" :disabled-date="disabledDate"
          :size="20" @change="checkTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD"/>
        <el-icon style="width: 30px;">
          <Search @click="search"
            style=" width: 30px; height: 200%; border-radius: 5px;" />
        </el-icon>
      </div>
    </v-card>

    <div style="margin-top:0.9%;  width:100%; height:5%;display: block;padding-left:1%;">
      <el-row style="margin-top:0.5%;">
        <el-col :span="1.5">
          <el-text tag="b" size="large"></el-text> 
        </el-col>
        <el-col :span="10" style="margin-top:-0.5%;">
          <el-radio-group v-model="sort_type" class="ml-4">
          <el-radio value="likes" size="large">热度优先</el-radio>
          <el-radio value="rank" size="large">好评优先</el-radio>
          <el-radio value="lowprice" size="large">低价优先</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    

    <a-divider />
    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;height: 70%;">

        <a-list item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
            <template #renderItem="{ item }">
                <a-list-item key="item.name">

                    <template #actions>
                      <a-rate :value="item.rank" disabled />
                      <span>
                        <component :is="actions.icon1" style="margin-right: 8px" />
                        {{ item.stars }}
                      </span>
                      <span>
                      <component :is="actions.icon2" style="margin-right: 8px" />
                        {{ item.likes }}
                      </span>
                      <span>
                      <component :is="actions.icon3" style="margin-right: 8px" />
                        {{ item.messages }}
                      </span>
                      <div style="margin-left: 200px">
                        <a-typography-title :level="4">¥ {{item.miniprice}} 起</a-typography-title>
                        <el-button type="success" plain @click="submitTicket(item.id,arrive_date,Ideparture_date)" style="background-color:#b8e0ff;border-color:#1d9cfc;width:100px;">点击查看</el-button>
                      </div>

                   
                    </template>

                    <template #extra >

                        <a-image referrerpolicy="no-referrer"
                            :width="360"
                            :height="200"
                            :src='item.photo'
    
                        />
                    </template>


                    <a-list-item-meta :description="item.position">
                        <template #title>
                            <a-typography-title :level="3">{{ item.name }}</a-typography-title>
                        </template>
                    </a-list-item-meta>
                    {{ item.content }}

                </a-list-item>
            </template>
        </a-list>
    </div>
  </div>
</template>

<script setup>
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import { getHotel,getPlaces } from '../api/api';
import { ref, onMounted, watch,watchEffect } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute()
var listData = ref([]); /*酒店信息*/
const sort_type = ref("likes");/**排序方式 */
const arrive_station = ref('');/**站 */
const arrive_date = ref('');/**到达时间 */
const Ideparture_date = ref('');/**离开时间 */
const searchValid = ref(false); /** 查询是否有效 */
const stationInvalid = ref(false);/**检测站点是否合格*/
const Places = ref([]);/** 所有可供查询的地点 */
const visible = ref(false);




const actions =
    {
      icon1: StarOutlined,
      icon2: LikeOutlined,
      icon3: MessageOutlined

    }

//选择站信息
const handleStart = item => {
    console.log('Selected start station:', item);
};
//获取所有城市
const flag = ref(1);

const fetchData = async () => {
    if (flag.value === 1) {
        flag.value++;
        try {
            const data = await getPlaces();
            Places.value = data.data.places.map(place => ({ value: place.place }));
            console.log("获取城市信息成功", Places.value);
        } catch (error) {
            console.error('获取城市信息失败：', error);
        }
    }
};

const handleArrive = item => {
    console.log('Selected station:', item);
};

onMounted(() => {
    fetchData();
  arrive_station.value = router.currentRoute.value.query.arrive_station;
    arrive_date.value = router.currentRoute.value.query.date;
    // Ideparture_date.value = router.currentRoute.value.query.date;
});
//选择站
const queryStation = (queryString, cb) => {
  const results = queryString
    ? Places.value.filter(createFilter(queryString))
    : Places.value;
  // call callback function to return suggestions
  cb(results);
};

const createFilter = (queryString) => {
  return (place) => {
    return (
      place.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};


//不合理的时间
const disabledDate = (time) => {
    return time.getTime() < Date.now() - 8.64e7
};

//从api获取查询结构
const fetchSearchResult = async () => {
  try {
    const response = await getHotel(arrive_station.value,arrive_date.value,Ideparture_date.value,sort_type.value);
    var a = response.data.result;
    listData.value = a;
    if(listData.value.length === 0){
      ElMessage({
        message: '暂时没有合适的酒店……',
      })
    }else{
      ElMessage({
        message: '查询成功',
        type: 'success',
      })
      console.log("获取查询信息成功", a);
    }
    //重新加载页面
      window.location.href = window.location.href;
  } catch (error) {
      console.error('获取查询信息失败', error);
  }
};

//点击查看
const submitTicket = (id,check_in,check_out) => {
    router.push({
        path: "/home/about",
        query: {
            id: id ,checkin: check_in, checkout: check_out
        },
    });
};

//点击查询
const search = () => {
    if (arrive_station.value === '' || arrive_date.value === '' || Ideparture_date.value === '') {
        ElMessage({
            message: '还有没填写的信息',
            type: 'error',
            plain: true,
        })
    } else if (searchValid.value === true) {
        ElMessage({
            message: '没有检索到该地点',
            type: 'error',
            plain: true,
        })
    } else {
        fetchSearchResult();
        
    }
}



//观测排序
watch([sort_type], (newValue, oldValue) => {
    console.log('筛选方式改变', newValue, oldValue);
    fetchSearchResult();
});

//检测地点
watch(arrive_station, (newValue) => {
    stationInvalid.value = newValue != '' && !Places.value.some(place => place.value === newValue);
    if (stationInvalid.value === true) searchValid.value = true;
    else searchValid.value = false;
});

//checkTime
const checkTime = () => {
  const startDate = new Date(arrive_date.value);
  const endDate = new Date(Ideparture_date.value);
  if (endDate <= startDate) {
    // 退房日期不得早于入住日期，这里可以进行相应处理，比如重置退房日期为入住日期后一天
    const nextDay = new Date(startDate);
    nextDay.setDate(startDate.getDate() + 2);
    Ideparture_date.value = nextDay.toISOString().substr(0, 10);
  }
}

</script>

<style scoped>
.router-link-active {
  
}
a{
  text-decoration: none;
  color: white;
  background:#8ABBE7;
  margin:10px;
  font-size:16px;
  font-weight:bold;
  border-radius: 4px;
  padding-left:20px;
  padding-right:20px;
  padding-top:7px;
  padding-bottom:7px;
  letter-spacing:1px;
  
}
</style>
