<template>
  <div v-if="!edit" class="q-container">
    <p class="q-title">{{questionNumber}}. {{name}} <span class="q-required" v-if="required">*</span></p>
    <p class="q-description">{{description}}</p>
    <el-input class="" disabled></el-input>
  </div>
  <div v-else style="width: 100%">
    <el-form ref="form" :model="form" :rules="rules" class="input-form">
      <el-form-item prop="name">
        <el-input placeholder="请输入问题" v-model="name"></el-input>
      </el-form-item>
      <el-form-item prop="description">
        <el-input placeholder="可以添加一些问题描述" v-model="description"></el-input>
      </el-form-item>
    </el-form>
    <el-form inline>
      <el-form-item>
        <el-select :value="form.type" @change="changeType">
          <el-option
            v-for="item in components"
            :key="item"
            :label="$t('question.' + item)"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-checkbox v-model="required">必填</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {QuestionComponent} from "@/mixins";

  @Component({
    name: 'QnaireInput'
  })
  export default class extends Mixins(QuestionComponent) {
    private rules: any = {
      name: [
        { required: true, message: '问题不能为空', trigger: 'blur' },
        { min: 1, max: 50, message: '最长不得超过50字', trigger: 'blur' },
      ],
      description: [
        { min: 0, max: 500, message: '最长不得超过500字', trigger: 'blur' },
      ]
    };
  }
</script>

<style>
  .input-form {
    width: 90%;
    margin-top: 1em;
    margin-right: 1em;
  }
  .q-container {
    width: 90%;
    padding-bottom: 1em;
  }
  .q-title {
    font-weight: bold;
  }
  .q-description {
    color: #606266;
    font-size: 14px;
  }
  .q-required {
    color: red;
  }
</style>
