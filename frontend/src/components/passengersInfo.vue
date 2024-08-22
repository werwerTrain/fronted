<template>
    <el-button type="success" plain @click="insert()">添加乘客</el-button>
    <el-button type=" danger" plain @click="mutipleDelete()">批量删除</el-button>
    <el-table :data="passengers" style="width: 100%;margin-top:2%;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" label="序号" :selectable="selectable">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180" />
        <el-table-column prop="type" label="证件类型" width="180">
            <template #default="scope">
                <el-text>中国居民身份证</el-text>
            </template>
        </el-table-column>
        <el-table-column prop="identification" label="身份证号" />
        <el-table-column prop="phone" label="邮箱" />
        <el-table-column label="身份状态">
            <template #default="scope">
                <img src="../assets/identificationSuccess.png" style="width:40px;height:35px;margin-top:3%;" />
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <div v-if="scope.$index != '0'">
                    <el-button type="primary" :icon="Edit" circle @click="editInfo(scope.$index)" color="#C4FFAD" />
                    <el-button type="danger" :icon="Delete" circle @click="singleDelete(scope.$index)"
                        color="#FF8486" />
                </div>
            </template>
        </el-table-column>
    </el-table>
    <el-dialog v-model="dialogFormVisible" title="修改乘车人信息" width="500">
        <el-form :model="form" label-width="auto">
            <el-form-item label="姓名:" :rules="[{ required: true, message: '姓名不能为空' },]">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="身份证号:" :rules="[{ required: true, message: '身份证号不能为空' },]">
                <el-input v-model="form.identification" />
            </el-form-item>
            <el-form-item label="邮箱:" :rules="[{ required: true, message: '邮箱不能为空' },]">
                <el-input v-model="form.phone" placeholder="请输入邮箱" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="success" @click="editFinish()" plain>完成</el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="insertTable" title="新增乘车人信息" width="500">
        <el-form :model="form" label-width="auto">
            <el-form-item label="姓名:" :rules="[{ required: true, message: '姓名不能为空' },]">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="身份证号:" :rules="[{ required: true, message: '身份证号不能为空' },]">
                <el-input v-model="form.identification" />
            </el-form-item>
            <el-form-item label="邮箱:" :rules="[{ required: true, message: '邮箱不能为空' },]">
                <el-input v-model="form.phone" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="insertTable = false">取消</el-button>
                <el-button type="success" @click="insertFinish()" plain>完成</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup>
import { ref, onMounted, reactive } from 'vue';
import { getPassengers, deletePassengers, updatePassengers, insertPassengers } from '../api/api';
import { ElMessage } from "element-plus";
import {
    Delete,
    Edit,
} from '@element-plus/icons-vue'
const form = reactive({
    name: '',
    identification: '',
    phone: '',
});
const passengers = ref([]);
const id = localStorage.getItem('user_id');//暂时代替用户id
const multipleSelection = ref([]);
const dialogFormVisible = ref(false);
const insertTable = ref(false);
const presentEdit = ref(null);
const handleSelectionChange = (val) => {
    console.log('多选', val)
    multipleSelection.value = val
};
const selectable = (row, index) => {
    if (index === 0) return false;
    return true;
}
const getInfo = async () => {
    try {
        const data = await getPassengers(id);
        passengers.value = data.data.passenger;
        console.log("获取乘车人数组成功", passengers.value);
    } catch (error) {
        console.error('获取乘车人数组失败：', error);
    }
};
const singleDelete = async (index) => {
    console.log("delete" + passengers.value[index]['name']);
    var identification = passengers.value[index]['identification'];
    const data = await deletePassengers(id, passengers.value[index]['name'], identification);
    if (data.data.info === true) {
        passengers.value.splice(index, 1);
        ElMessage({
            message: "删除成功",
            type: "success",
        });
    } else {
        ElMessage({
            message: "删除失败",
            type: "error",
            plain: true,
        });
    }
};
const insert = () => {
    insertTable.value = true;
};
const insertFinish = async () => {
    if (form.name === '' || form.identification === '' || form.phone === '') {
        ElMessage({
            message: "还有未填写的信息",
            type: "error",
            plain: true,
        });
        return;
    }
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (p.test(form.identification)) {
        const data = await insertPassengers(id, form.name, form.identification, form.phone);
        if (data.data.info === true) {
            passengers.value.push({ name: form.name, identification: form.identification, phone: form.phone });
            ElMessage({
                message: "新增成功",
                type: "success",
            });
            insertTable.value = false;
        } else {
            ElMessage({
                message: "新增失败",
                type: "error",
                plain: true,
            });
        }
    } else {
        console.log("error");
        ElMessage({
            message: "身份证不合法~",
            type: "error",
            plain: true,
        });
    }
};
const editInfo = async (index) => {
    dialogFormVisible.value = true;
    presentEdit.value = passengers.value[index];
    var name = passengers.value[index]['name'];
    var identification = passengers.value[index]['identification'];
    var phone = passengers.value[index]['phone'];
    form.name = name;
    form.identification = identification;
    form.phone = phone;
};
const editFinish = async () => {
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    if (p.test(form.identification)) {
        const data = await updatePassengers(id, presentEdit.value['identification'], form.name, form.identification, form.phone);
        if (data.data.info === true) {
            getInfo();
            ElMessage({
                message: "编辑成功",
                type: "success",
            });
            dialogFormVisible.value = false;
        } else {
            ElMessage({
                message: "编辑失败",
                type: "error",
                plain: true,
            });
        }
    } else {
        console.log("error");
        ElMessage({
            message: "信息不合法！请重新检查~",
            type: "error",
            plain: true,
        });
    }
}
const mutipleDelete = async () => {
    console.log(multipleSelection.value);
    for (var i = 0; i < multipleSelection.value.length; i++) {
        var identification = multipleSelection.value[i]['identification'];
        var name = multipleSelection.value[i]['name'];
        const data = await deletePassengers(id, name, identification);
        // console.log("name"+name+"  identification"+identification);
        if (data.data.info === true) {
            ElMessage({
                message: "删除成功",
                type: "success",
            });
        } else {
            ElMessage({
                message: "删除失败",
                type: "error",
                plain: true,
            });
        }
    }
    multipleSelection.value=[];
    getInfo();
};
onMounted(() => {
    getInfo();
});
</script>
<style></style>