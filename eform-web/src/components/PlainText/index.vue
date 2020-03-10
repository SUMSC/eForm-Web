<template>
  <div class="text-block">
    <p v-if="!edit">{{text}}</p>
    <el-form ref="form" :model="form" :rules="rules" :inline="true" v-else>
      <el-form-item prop="name">
        <el-input
          class="text-input"
          type="textarea" :autosize="{ minRows: 1 }"
          v-model="text"
          maxlength="200"
          placeholder="这里可以写一些文本描述"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import {QuestionComponent} from "@/mixins";
  import * as _ from 'lodash';

  @Component({
    name: 'PlainText'
  })
  export default class extends Mixins(QuestionComponent) {
    private rules = {
      name: [
        { required: true, message: '请输入文本描述', trigger: 'blur' },
      ]
    };
    get text() {
      return this.form.name;
    }
    set text(val: string) {
      const temp = QnaireModule.form.slice();
      const index = _.findIndex(temp, { id: this.id });
      temp[index].name = val;
      QnaireModule.SET_FORM(temp);
    }
    mounted() {
      console.log(this);
    }
  }
</script>

<style scoped lang="scss">
  .text-block {
    width: 50em;
    margin: 6px 0;
    padding: 8px 0;

    .text-input {
      width: 45em;
    }
  }
</style>
