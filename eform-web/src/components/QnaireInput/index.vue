<template>
  <div v-if="!edit">
    <p>{{questionNumber}}.{{name}}</p>
    <p>{{description}}</p>
  </div>
  <el-form v-else ref="form" :model="form" :rules="rules" class="input-form">
    <el-form-item prop="name" required>
      <el-input placeholder="请输入问题" v-model="name"></el-input>
    </el-form-item>
    <el-form-item prop="description">
      <el-input placeholder="可以添加一些问题描述" v-model="description"></el-input>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {QuestionComponent} from "@/mixins";
  import {QnaireModule} from "@/store/modules/qnaire";

  @Component({})
  export default class extends Mixins(QuestionComponent) {
    private rules: any = {
      name: [
        { required: true, message: '请输入文本描述', trigger: 'blur' },
        { min: 1, max: 50, message: '最长不得超过50字', trigger: 'blur' },
      ],
      description: [
        { min: 0, max: 500, message: '最长不得超过500字', trigger: 'blur' },
      ]
    };
    get questionNumber() {
      return this.id - this.qnaire.form.filter(i => i.type === 'plain-text').length;
    }
    get name() {
      return this.form.name;
    }
    get description() {
      return <string>this.form.description;
    }
    set name(value: string) {
      const temp = this.qnaire.form.slice();
      temp[this.id - 1].name = value;
      QnaireModule.SET_FORM(temp);
    }
    set description(value: string) {
      const temp = this.qnaire.form.slice();
      temp[this.id - 1].description = value;
      QnaireModule.SET_FORM(temp);
    }
  }
</script>

<style>
.input-form {
  width: 90%;
  margin-top: 1em;
  margin-right: 1em;
}
</style>
