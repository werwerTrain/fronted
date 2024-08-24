<template>
  <el-container class="home-container">
    <el-header
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div style="display: flex; align-items: center">
        <img
          src="../assets/logo2.png"
          style="width: 100px; height: 55px; margin-top: 3%"
        />
        <el-menu
          :default-active="activeIndex"
          class="menu"
          mode="horizontal"
          :ellipsis="false"
          @select="selectMenu"
          style="color: black; margin-top: 2%"
        >
          <el-menu-item
            index="1"
            style="color: black; font-weight: bold; font-size: 17px"
            >火车订订票</el-menu-item
          >
          <el-menu-item
            index="2"
            style="color: black; font-weight: bold; font-size: 17px"
            >酒店预订</el-menu-item
          >
          <el-menu-item
            index="3"
            style="color: black; font-weight: bold; font-size: 17px"
            >火车订餐</el-menu-item
          >
          <el-menu-item
            index="4"
            style="color: black; font-weight: bold; font-size: 17px"
            >我的</el-menu-item
          >
        </el-menu>
      </div>
      <div style="display: flex; align-items: center">
        <div style="display: flex; align-items: center">
          <el-popover
            placement="bottom"
            :width="200"
            trigger="click"
            content="this is content, this is content, this is content"
          >
            <template #reference>
              <el-button
                id="loginButton"
                type="primary"
                round
                plain
                size="large"
                style="margin-top: 12%; margin-right: 3%"
                class="log"
                >登录/注册</el-button
              >
            </template>
            <!-- 登录 -->
            <div>
              <a-button @click="login" style="width:170px;">
                登录
              </a-button>
              <a-modal v-model:open="openLogin" title="登录"  style="color:white" :cancel-button-props="{ style: { display: 'none' } }" :ok-button-props="{ style: { display: 'none' } }">
                <div style="margin-top:13px;">
                  <el-input v-model="my_id" style="max-width: 600px;height: 40px;" placeholder="输入身份证号" :prefix-icon="User">
                    
                  </el-input>
                </div>
                <div style="margin-top:13px;">
                  <el-input show-password v-model="my_password" style="max-width: 600px;height: 40px;" placeholder="输入密码(包含数字和字母，至少8位)" :prefix-icon="Lock">
                    <template #append style="background-color:white">
                      <button  @click="forgotPassword1">忘记密码?</button>
                    </template>
                  </el-input>
                </div>
                <button style="margin-top:8px;color:#61bbff;text-decoration:underline;" @click="changeToRegister">
                  先去注册
                </button>
                <div style="display: flex; justify-content: center;margin-top:17px;">
                  <el-button style="width:470px;height:36px;font-size:17px;letter-spacing: 2px;" type="primary" @click="handleLoginOk">登录 </el-button>
                </div>
              </a-modal>
              <a-modal v-model:open="backPassword1" title="填写账号"  style="color:white" :cancel-button-props="{ style: { display: 'none' } }" :ok-button-props="{ style: { display: 'none' } }" @cancel ="handleCancel">
                <div style="margin-top:13px;">
                  <el-input v-model="my_id" style="max-width: 300px;height: 35px;" placeholder="输入身份证号" :prefix-icon="User">
                    
                  </el-input>
                  <el-button style="width:100px;margin-left:20px;color:black;height:35px" @click="getPassword" :disabled="countingDown">
                    {{buttonText }} </el-button>
                </div>
                
                <div style="margin-top:20px;">
                  <el-input v-model="my_code" style="max-width: 230px" placeholder="输入验证码" :prefix-icon="Check">
                  </el-input>
                  
                 
                </div>
                
                <div style="display: flex; justify-content: center;margin-top:17px;">
                  <el-button style="width:470px;height:36px;font-size:17px;letter-spacing: 2px;" type="primary" @click="forgotPassword2" :disabled=have_send>下一步</el-button>
                </div>
              </a-modal>
              <a-modal v-model:open="backPassword2" title="更新密码"  style="color:white" :cancel-button-props="{ style: { display: 'none' } }" :ok-button-props="{ style: { display: 'none' } }">
                
                
                <div style="margin-top:13px;">
                  <el-input show-password v-model="my_newpassword1" style="max-width: 600px;height: 40px;" placeholder="输入新密码" :prefix-icon="Lock">
    
                  </el-input>
                </div>
                <div style="margin-top:13px;">
                  <el-input show-password v-model="my_newpassword2" style="max-width: 600px;height: 40px;" placeholder="再次输入新密码" :prefix-icon="Lock">
    
                  </el-input>
                </div>
                
                <div style="display: flex; justify-content: center;margin-top:17px;">
                  <el-button style="width:470px;height:36px;font-size:17px;letter-spacing: 2px;" type="primary" @click="handleUpdateOk">确认更新</el-button>
                </div>
              </a-modal>
            </div>
            <!-- 注册 -->
            <div>
              <a-button
                @click="register"
                style="width: 170px; margin-top: 10px"
              >
                注册
              </a-button>
              <a-modal v-model:open="openRegister" title="注册" style="color:white"
                :cancel-button-props="{ style: { display: 'none' } }" :ok-button-props="{ style: { display: 'none' } }" >
                <div style="margin-top:13px;">
                  <el-input v-model="my_id" style="max-width: 600px;height: 40px;" placeholder="输入身份证号" :prefix-icon="Document">
                    
                  </el-input>
                </div>
                <div style="margin-top:13px;">
                  <el-input v-model="my_name" style="max-width: 600px;height: 40px;" placeholder="输入姓名" :prefix-icon="User">
                    
                  </el-input>
                </div>
                <div style="margin-top:13px;">
                  <el-input show-password v-model="my_password" style="max-width: 600px;height: 40px;" placeholder="输入密码(包含数字和字母，至少8位)" :prefix-icon="Lock">
                    
                  </el-input>
                </div>
                <div style="margin-top:13px;">
                  <el-input v-model="my_email" style="max-width: 600px;height: 40px;" placeholder="输入邮箱" :prefix-icon="Message">
                   
                  </el-input>
                </div>
                <div style="display: flex; justify-content: center;margin-top:17px;">
                  <el-button style="width:470px;height:36px;font-size:17px;letter-spacing: 2px;" type="primary" @click="handleRegisterOk">提交信息</el-button>
                </div>
              </a-modal>
            </div>
            <a-modal v-model:open="openVerification" title="注册" :cancel-button-props="{ style: { display: 'none' } }" width="400px"
              :ok-button-props="{ style: { display: 'none' } }">

              <div style="margin-top:20px;">
                <el-input v-model="my_code" style="max-width: 230px" placeholder="输入验证码" :prefix-icon="Check">
                </el-input>
                <el-button style="width:100px;margin-left:20px;" @click="sendVerificationOk" :disabled="countingDown">
                  {{buttonText }} </el-button>
                <el-button @click="handleVerificationOk" style="width:350px;margin-top:17px;color:white" type="primary"> 提交验证码 </el-button>
              </div>
            </a-modal>
          </el-popover>
          <div id="loggedInMessage" style="display: none">
            <div>
              <el-popover
                placement="bottom"
                :width="200"
                trigger="hover"
                content="this is content, this is content, this is content"
              >
                <a-button @click="quit" style="width: 170px; margin-top: 10px">
                  退出登录
                </a-button>
                <template #reference>
                  <a-avatar
                    style="margin-top: 10px; margin-right: 20px"
                    size="large"
                    :src="'https://m.elongstatic.com/hotel_pc_i18n/product/_nuxt/userHead.0-0-3-213881db..svg'"
                  />
                </template>
              </el-popover>
            </div>
          </div>
          <el-badge
            :value="unReadNum"
            :show-zero="false"
            :max="10"
            style="margin-top: 8%; margin-right: 1em"
          >
            <img
              src="../assets/message.png"
              style="width: 50px; height: 50px"
              @click="messageOpen()"
            />
          </el-badge>
        </div>
      </div>
    </el-header>
    <div class="main">
      <el-main width="80%" style="height: 90vh">
        <router-view />
      </el-main>
    </div>

    <!-- 弹出消息栏 -->
    <el-drawer v-model="drawer" title="消息" direction="rtl" size="35%">
      <template #title>
        <span>消息</span>
        <el-button @click="setAllRead()">全部已读</el-button>
      </template>
      <div v-for="(item, index) in message" :key="index">
        <el-card
          style="border-radius: 15px; margin-bottom: 5%"
          @click="
            item.haveRead = true;
            setRead(item.mid);
            jumpToOrder(item.orderType, item.orderId);
          "
        >
          <template #header>
            <div style="display: flex; justify-content: space-between">
              <el-badge is-dot :hidden="item.haveRead">
                <span style="margin-top: 0.3em; margin-right: 0.3em">
                  {{ item.title }}
                </span>
              </el-badge>
              <span style="color: #dedfe0">{{ item.messageTime }}</span>
            </div>
          </template>
          <text>{{ item.content }}</text>
          <span style="vertical-align: middle; text-align: center">
            <text style="color: #a0cfff">双击查看详细信息</text>
            <el-icon style="color: #a0cfff">
              <DArrowRight />
            </el-icon>
          </span>
        </el-card>
      </div>
    </el-drawer>
  </el-container>
</template>

<script setup>
import { ref, onMounted,onBeforeUnmount, computed, inject,provide } from "vue";
import { useRouter } from "vue-router";
import eventBus from "@/eventBus.js";
import emitter  from "@/emitter.js";
import { getMessage ,haveReadMessage,haveReadAllMessage} from "@/api/api.js";
import { ElMessage, ElMessageBox } from 'element-plus'
import {User,Lock,Message,Document,Check} from '@element-plus/icons-vue'
const router = useRouter();
const activeIndex = ref("1");
provide('activeIndex', activeIndex);
const drawer = ref(false);
const messageOpen = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    drawer.value = true;
  } else {
    ElMessage({
      message: "请先登录",
      type: "error",
      plain: true,
    });
  }
};
const selectMenu = (key) => {
  console.log("当前选中为" + key);
  var pre = activeIndex.value;
  console.log("pre" + pre);
  activeIndex.value = key;
  eventBus.MyOrdersActiveKey = "1";
  if (activeIndex.value === "1") {
    router.push("/home/ticket");
  } else if (activeIndex.value === "2") {
    router.push("/home/hotel");
  } else if (activeIndex.value === "3") {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/home/dining");
    } else {
      setTimeout(() => {
        activeIndex.value = pre;
      }, 50);
      openLogin.value = true;
      ElMessage({
        message: "请先登录",
        type: "error",
        plain: true,
      });
    }
  } else if (activeIndex.value === "4") {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/home/orders");
    } else {
      setTimeout(() => {
        activeIndex.value = pre;
      }, 50);

      openLogin.value = true;
      ElMessage({
        message: "请先登录",
        type: "error",
        plain: true,
      });
    }
  }
};
const message = ref([]);
const userID = localStorage.getItem("user_id");
const unReadNum = computed(() => {
  return message.value.filter((msg) => !msg.haveRead).length;
});
//设置已读
const setRead = async (mid)=>{
  try{
    await haveReadMessage(mid);
  }catch(error){
    console.log("设置已读失败,消息id为：",mid);
  }
}
//全部已读
const setAllRead = async ()=>{
  try{
    await haveReadAllMessage(userID);
  }catch(error){
    console.log("设置已读失败");
  }
  getAllMessage();
}
//登录

import { postLogin } from "@/api/api";
const openLogin = ref(false);
const my_id = ref("");
const my_password = ref("");

const login = () => {
  openLogin.value = true;
};

const handleLoginOk = (e) => {
  console.log(e);
  if (my_id.value === "" || my_password.value === "") {
    ElMessage({
      message: "还有没填写的信息",
      type: "error",
      plain: true,
    });
  } else {
    postmyLogin();
    openLogin.value = false;
  }
};
const postmyLogin = async () => {
  try {
    const response = await postLogin(my_id.value, my_password.value);
    if (response.data.result) {
      ElMessage({
        message: "登录成功",
        type: "success",
      });
      localStorage.setItem('user_id', my_id.value);
      localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('password', my_password.value);
      localStorage.setItem('name', response.data.name);
      updateUI();
      //重新加载页面
      window.location.reload();
    } else {
      ElMessage.error("登录失败:用户ID或密码错误");
    }
  } catch (error) {
    console.error("登录失败:", error);
  }
};

//注册
const my_email = ref("");
const my_name = ref("");
const my_verify = ref("");
const my_code = ref("");

import { postRegister, postCode, postCodeVeryfication,getbackPassword,idCodeVerification,updatePassword } from "@/api/api";
const openRegister = ref(false);
const openVerification = ref(false);

const register = () => {
  openRegister.value = true;
};

const postmyRegister = async () => {
  try {
    const response = await postRegister(my_id.value, my_name.value, my_password.value, my_email.value,1);
    if (response.data.result) {
      ElMessage({
        message: "提交成功",
        type: "success",
      });
      localStorage.setItem('user_id', my_id.value);
      localStorage.setItem('email', my_email.value);
      localStorage.setItem('password', my_password.value);
      localStorage.setItem('name', my_name.value);
      openRegister.value = false;
      openVerification.value = true;
    } else {
      ElMessage.error("提交失败:" + response.data.reason);
    }
  } catch (error) {
    console.error("提交失败:", error);
  }
};
//发送验证码
const verifymyRegister = async () => {
  try {
    const response = await postRegister(my_id.value, my_name.value, my_password.value, my_email.value,2);
    if (response.data.result) {
      ElMessage({
        message: "注册成功",
        type: "success",
      });
      localStorage.setItem('user_id', my_id.value);
      localStorage.setItem('email', my_email.value);
      localStorage.setItem('password', my_password.value);
      localStorage.setItem('name', my_name.value);
    } else {
      ElMessage.error("注册失败:" + response.data.reason);
    }
  } catch (error) {
    console.error("注册失败:", error);
  }
}

const sendVerificationOk = async () => {
  try {
    const response = await postCode(my_email.value);
    if (response.data.result) {
      ElMessage({
        message: "成功发送验证码",
        type: "success",
      });
      if (!countingDown.value) {
        startCountdown();
        // 在这里发送验证码的逻辑
      }
    } else {
      ElMessage.error("验证码发送失败");
    }
  } catch (error) {
    console.error("验证码发送失败:", error);
  }
};

const handleVerificationOk = async () => {
  try {
    const response = await postCodeVeryfication(my_code.value, my_email.value);
    if (response.data.result) {
      verifymyRegister();
      openVerification.value = false;
      localStorage.setItem("isLoggedIn", true);
      updateUI();
      //重新加载页面
      window.location.href = window.location.href;
    } else {
      ElMessage.error("验证码错误，请重新输入");
    }
  } catch (error) {
    console.error("验证码发送失败:", error);
  }
};



//倒计时
const countdownSeconds = 120;
const countingDown = ref(false);
const buttonText = ref("获取验证码");
let countdownInterval = null;

function startCountdown() {
  countingDown.value = true;
  let seconds = countdownSeconds;
  buttonText.value = `${seconds}s`;
  countdownInterval = setInterval(() => {
    seconds--;
    buttonText.value = `${seconds}s`;
    if (seconds <= 0) {
      clearInterval(countdownInterval);
      countingDown.value = false;
      buttonText.value = "再次获取验证码";
    }
  }, 1000);
}

function clearAll() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countingDown.value = false;
    buttonText.value = "获取验证码";
    my_newpassword1.value = '';
    my_newpassword2.value = '';
    my_code.value = '';
  }
}

const handleRegisterOk = (e) => {
  console.log(e);
  if (
    my_id.value === "" ||
    my_password.value === "" ||
    my_email.value === "" ||
    my_name === ""
  ) {
    ElMessage({
      message: "还有没填写的信息",
      type: "error",
      plain: true,
    });
  } else {
    postmyRegister();
  }
};

const changeToRegister = () => {
  openLogin.value = false;
  openRegister.value = true;
  updateUI();
};

//忘记密码
const backPassword1 = ref(false);
const backPassword2 = ref(false);
const have_send = ref(true);
const my_newpassword1 = ref('');
const my_newpassword2 = ref('');
const handleCancel = ()=>{
  have_send.value = true;
  clearAll();
}
const forgotPassword1 = (e) => {
    openLogin.value = false;
    backPassword1.value = true;
    buttonText.value = "获取验证码";
};
const forgotPassword2 = async() =>{
  try{
    if (my_code.value ==='' ) {
      ElMessage({
        message: "还没有填写验证码",
        type: "error",
        plain: true,
      });
    }else{
      const response = await idCodeVerification(my_code.value,my_id.value);
      if(response.data.result === true){
        backPassword1.value = false;
        backPassword2.value = true;
        
      }else{
        ElMessage({
        message: "验证码错误",
        type: "error",
        plain: true,
      });
      }
    }
    
  }catch (error) {
    console.error("验证失败", error);
  }

}

const getPassword = async() => {
  try{
    if (my_id.value ==='' ) {
      ElMessage({
        message: "还没有填写账号",
        type: "error",
        plain: true,
      });
    }
    else{
      const response = await getbackPassword(my_id.value);
    if (response.data.result) {
        ElMessage({
          message: "成功发送验证码",
          type: "success",
        });
        localStorage.setItem("user_id", my_id.value);
        have_send.value = false;
        if (!countingDown.value) {
          startCountdown();
        // 在这里发送验证码的逻辑
        }
      }else{
        ElMessage.error(response.data.message);
      }
    }
  }catch (error) {
    console.error("验证码发送失败", error);
  }
}

const handleUpdateOk = async() =>{
  try{
    if(my_newpassword1.value != my_newpassword2.value){
      ElMessage({
        message: "两次密码不同",
        type: "error",
        plain: true,
      });
    }else{
        const response = await updatePassword(localStorage.getItem("user_id"),my_newpassword1.value);
        if(response.data.result === true){
          ElMessage({
            message: "更改密码成功，请重新登录",
            type: "success",
          });
          backPassword2.value = false;
          clearAll();
        }else{
          ElMessage({
            message: "更改密码失败",
            type: "error",
            plain: true,
          });
        }
    }
  }catch (error) {
    console.error("密码更新失败", error);
  }
}


// 页面加载完成时执行
document.addEventListener("DOMContentLoaded", function () {
  // 更新页面元素的显示状态
  updateUI();
});

// 更新页面元素显示状态的函数
function updateUI() {
  var isLoggedIn = localStorage.getItem("isLoggedIn");

  // 根据 isLoggedIn 的值更新页面元素显示状态
  if (isLoggedIn === "true") {
    document.getElementById("loginButton").style.display = "none"; // 隐藏登录按钮
    document.getElementById("loggedInMessage").style.display = "block"; // 显示已登录的消息
  } else {
    document.getElementById("loginButton").style.display = "block"; // 显示登录按钮
    document.getElementById("loggedInMessage").style.display = "none"; // 隐藏已登录的消息
  }
  //想在这里刷新该页面
  message.value = [];
}
//退出登录

const quit = () => {
  localStorage.setItem("user_id", "");
  localStorage.setItem("isLoggedIn", false);
  localStorage.setItem("email", "");
  localStorage.setItem("password", "");
  localStorage.setItem("name", "");
  if (activeIndex.value === "3" || activeIndex.value === "4") {
    router.push("/home/ticket");
    activeIndex.value = "1";
  }
  updateUI();
  window.location.reload();
};

onMounted(() => {
  router.push("/home/ticket");
  getAllMessage();
  emitter.on('getAllMessage', getAllMessage);
  updateUI();
});
onBeforeUnmount(() => {
  emitter.off('getAllMessage', getAllMessage);
});
const getAllMessage = async () => {
  try {
    const responce = await getMessage(userID);
    message.value = responce.data.result;
  } catch (error) {
    console.log("获取消息失败", error);
  }
};
const jumpToOrder = (orderType, orderId) => {
  eventBus.HeaderKey = "4";
  activeIndex.value = "4";
  eventBus.MyOrdersActiveKey = orderType;
  if (orderType === "3") {
    router.push("/home/orders/ticketOrders");
    router.push({
      path: "/home/orders/ticketOrders",
      query: { orderId: orderId },
    });
  } else if (orderType === "4") {
    router.push({
      path: "/home/orders/hotelOrders",
      query: { orderId: orderId },
    });
  } else if (orderType === "5") {
    router.push({
      path: "/home/orders/foodOrders",
      query: { orderId: orderId },
    });
  }
};

setInterval(getAllMessage,60000);//每分钟获取一次
</script>

<style>
.home-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.el-header {
  height: 60px;
}

* {
  margin: 0;
  padding: 0;
}

.main {
  flex: 1;
  display: flex;
  align-items: stretch;
}

.header-content {
  display: flex;
  align-items: center;
  padding-top: 8px;
}

.title {
  align-self: center;
  margin-right: auto;
}

.menu {
  margin-left: 10%;
}

.menu-change {
  height: 100%;
}

</style>
