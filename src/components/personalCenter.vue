<template>
    <h1 style="font-weight:bold;font-size:25px;">个人信息</h1>
    <el-form :model="formPerson" label-width="auto" style="max-width: 600px;margin-top:2%;margin-left:2%;">
        <el-form-item label="姓名">
            <el-input v-model="formPerson.name" disabled />
        </el-form-item>
        <el-form-item label="身份证号">
            <el-input v-model="formPerson.user_id" disabled />
        </el-form-item>
        <el-form-item label="生日">
            <el-col :span="11">
                <el-date-picker v-model="formPerson.date" type="date" placeholder="请选择出生日期" style="width: 100%"
                    disabled />
            </el-col>
        </el-form-item>
    </el-form>
    <h1 style="font-weight:bold;font-size:25px;">登录信息</h1>
    <el-form :model="formLogin" label-width="auto" style="max-width: 600px;margin-top:2%;margin-left:2%;">
        <el-form-item label="联系方式" style="display:flex;">
            <el-input v-model="formLogin.email" disabled style="flex:1;" />
            <el-button v-if="edit === false" plain style="flex:0.2;margin-left:1%;" @click="sendVerificationOk">{{
        buttonText }}</el-button>
        </el-form-item>
        <el-form-item label="验证码" v-if="edit === false">
            <el-input v-model="formLogin.confirm" :disabled="edit" style="width:150px;" />
        </el-form-item>
        <el-form-item label="新密码">
            <el-input type="password" v-model="formLogin.password" :disabled="edit" show-password />
        </el-form-item>
        <el-form-item label="再次确认新密码" v-if="edit === false">
            <el-input type="password" v-model="formLogin.confirmPassword" :disabled="edit" show-password />
        </el-form-item>
        <el-form-item v-if="edit === true" style="margin-left:86%;">
            <el-button type="primary" @click="editPersonalInfo" plain>修改密码</el-button>
        </el-form-item>
        <el-form-item v-if="edit === false" style="margin-left:78%;">
            <el-button type="success" @click="PersonalSubmit" plain>完成</el-button>
            <el-button type="danger" @click="cancelPersonalEdit" plain>取消</el-button>
        </el-form-item>
    </el-form>
</template>
<script setup>
import { ref, reactive, watch } from 'vue';
import { updatePassword, postCodeVeryfication } from '../api/api';
import { ElMessage } from "element-plus";
import { postCode } from "@/api/api"
const edit = ref(true);
const user_id = localStorage.getItem('user_id');
const countdownSeconds = 120;
const countingDown = ref(false);
const buttonText = ref('发送验证码');
const my_email = localStorage.getItem('email');
function startCountdown() {
    countingDown.value = true;
    let seconds = countdownSeconds;
    buttonText.value = `${seconds}s`;
    const countdownInterval = setInterval(() => {
        seconds--;
        buttonText.value = `${seconds}s`;
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countingDown.value = false;
            buttonText.value = '发送验证码';
        }
    }, 1000);
}
const sendVerificationOk = async () => {
    try {
        const response = await postCode(my_email);
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
// do not use same name with ref
const formPerson = reactive({
    name: localStorage.getItem('name'),
    user_id: localStorage.getItem('user_id'),
    date: localStorage.getItem('user_id').substring(6, 14),
})
const password = ref();
const formLogin = reactive({
    email: localStorage.getItem('email'),
    password: localStorage.getItem('password'),
    confirm: "",
    confirmPassword: '',
})
const editPersonalInfo = () => {
    edit.value = false;
    password.value = formLogin.password;
    formLogin.password = "";
    formLogin.confirmPassword = "";
    formLogin.confirm = "";
};
const cancelPersonalEdit = () => {
    edit.value = true;
    formLogin.password = password.value;
    formLogin.confirm = "";
    formLogin.confirmPassword = "";
};
const PersonalSubmit = async () => {
    if (formLogin.password === '' || formLogin.confirmPassword === '' || formLogin.confirm === '') {
        ElMessage({
            message: "还有未填写的信息",
            type: "error",
            plain: true,
        });
    } else if (formLogin.password != formLogin.confirmPassword) {
        ElMessage({
            message: "新密码与确认密码不一致",
            type: "error",
            plain: true,
        });
    } else {
        const response = await postCodeVeryfication(formLogin.confirm, my_email);
        if (response.data.result) {
            const data = await updatePassword(user_id, formLogin.password);
            if (data.data.result) {
                ElMessage({
                    message: "更新密码成功",
                    type: "success",
                    plain: true,
                });
                edit.value = true;
            } else {
                ElMessage({
                    message: "更新密码失败",
                    type: "error",
                    plain: true,
                });
            }
        } else {
            ElMessage({
                message: "验证码错误！",
                type: "error",
                plain: true,
            });
        }
    }
};
</script>
