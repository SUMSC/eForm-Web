<template>
  <div class="description-block">
    <p v-if="!edit">{{name}}</p>
    <el-form ref="form" :model="qnaire" :rules="rules" :inline="true" v-else @submit.native.prevent="handleSubmit">
      <el-form-item prop="description">
        <el-input
          class="description-input"
          type="textarea" :autosize="{ minRows: 2 }"
          v-model="description"
          maxlength="300" show-word-limit/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import {QuestionComponent} from "@/mixins";

  @Component({
    name: 'QnaireDescription'
  })
  export default class extends Mixins(QuestionComponent) {
    private rules = {
      description: [
        { required: true, message: '请输入问卷描述', trigger: 'blur' },
        { min: 1, max: 300, message: '不要超过 300 字', trigger: 'blur' }
      ]
    };
    get description() {
      return QnaireModule.description;
    }
    set description(val: string) {
      QnaireModule.SET_DESCRIPTION(val);
    }
    handleSubmit() {
      this.validate('edit', 'description');
    }
  }
</script>

<style scoped lang="scss">
  .description-block {
    width: 50em;
    margin: 6px 0;
    padding: 8px 0;

    p {
      margin: 0;
    }

    .description-input {
      width: 45em;
    }
  }
</style>
