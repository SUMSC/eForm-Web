<template>
  <div class="title-block">
    <h2 v-if="!edit">{{title}}</h2>
    <el-form ref="form" :model="qnaire" :rules="rules" :inline="true" v-else @submit.native.prevent="handleSubmit">
      <el-form-item label="标题" prop="name">
        <el-input v-model="title"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import {QuestionHeader} from "@/mixins";

  @Component({
    name: 'QnaireTitle',
  })
  export default class extends Mixins(QuestionHeader) {
    private rules = {
      name: [
        { required: true, message: '请输入问卷标题', trigger: 'blur' },
      ]
    };
    get title() {
      return QnaireModule.name;
    }
    set title(val) {
      QnaireModule.SET_NAME(val);
    }
    handleSubmit() {
      this.validate('edit', 'title');
    }
  }
</script>

<style scoped>
  h2 {
    margin: 0;
  }
  .title-block {
    display: flex;
    justify-content: center;
    width: 50em;
    padding: 10px 0;
  }
</style>
