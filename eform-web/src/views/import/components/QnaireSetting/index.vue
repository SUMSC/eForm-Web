<template>
  <div class="setting-container">
    <el-divider content-position="left" class="setting-divider">基础设置</el-divider>
    <section class="setting-section">
      <el-switch v-model="qnaireType" active-text="实名问卷"></el-switch>
      <el-switch v-model="onlyOnce" active-text="每个用户只能回答一次"></el-switch>
      <el-switch v-model="shuffleSelections" active-text="打乱选择题的选项顺序（暂不可用）" disabled></el-switch>
    </section>
    <el-divider content-position="left" class="setting-divider">回收设置</el-divider>
    <section class="setting-section">
      <div class="deadline-block">
        <el-switch v-model="hasDeadline" active-text="设置问卷结束时间"></el-switch>
        <el-date-picker v-if="hasDeadline" v-model="deadline" type="datetime" @change="saveDeadline" :clearable="false"></el-date-picker>
      </div>
      <el-switch v-model="allowEdit" active-text="允许用户修改答案（暂不可用）" disabled></el-switch>
    </section>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import moment from 'moment';

  @Component({
    name: 'QnaireSetting'
  })
  export default class extends Vue {
    private activeNames = ['1']
    get onlyOnce() { return QnaireModule.settings.only_once }
    set onlyOnce(value: boolean) {
      QnaireModule.UPDATE_SETTINGS({
        key: 'only_once', value
      })
      QnaireModule.SaveSetting()
    }
    get allowEdit() { return QnaireModule.settings.allow_edit }
    set allowEdit(value: boolean) {
      QnaireModule.UPDATE_SETTINGS({
        key: 'allow_edit', value
      })
      QnaireModule.SaveSetting()
    }
    get shuffleSelections() { return QnaireModule.settings.shuffle_selections }
    set shuffleSelections(value: boolean) {
      QnaireModule.UPDATE_SETTINGS({
        key: 'shuffle_selections', value
      })
      QnaireModule.SaveSetting()
    }
    get qnaireType() {
      return !QnaireModule.type
    }
    set qnaireType(value: boolean) {
      QnaireModule.SET_TYPE(!value)
      QnaireModule.ChangeType()
    }
    get hasDeadline() {
      return !!QnaireModule.deadline
    }
    set hasDeadline(value: boolean) {
      if (value) {
        QnaireModule.SET_DEADLINE(moment().add(7, 'd').toString());
        QnaireModule.SaveDeadline()
      } else {
        QnaireModule.SET_DEADLINE(null);
      }
    }
    get deadline() {
      return moment(QnaireModule.deadline);
    }
    set deadline(value: any) {
      if (moment(value).isAfter())
        QnaireModule.SET_DEADLINE(moment(value).toString())
      else
        this.$message.warning('不可以选择之前的时间哦')
    }
    saveDeadline() {
      QnaireModule.SaveDeadline()
    }
    handleChange(val: any) {
      console.log(val);
    }
    mounted() {
      console.log(QnaireModule.deadline)
    }
  }
</script>

<style scoped lang="scss">
  .setting-container {
    min-width: 40em;
    width: 80%;
    margin: 0 auto;
  }
  .setting-divider {
    color: #606266;
    font-size: 20px;
  }
  .setting-section {
    padding: 0 20px;
    display: flex;
    margin-bottom: 50px;
    .el-switch {
      flex: auto;
    }
  }
  .deadline-block {
    width: 20em;
    display: flex;
    flex-direction: column;
    .el-switch {
      margin-bottom: 10px;
    }
  }
</style>
