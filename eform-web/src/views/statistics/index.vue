<template>
  <div class="data-container">
    <header class="data-header">
      <span class="data-header-title">{{ qnaire.name }}</span>
      <el-tag :type="qnaire.a ? 'success' : 'primary'">{{ qnaire.a ? '匿名问卷' : '实名问卷' }}</el-tag>
      <el-tag effect="plain" :type="qnaire.a ? 'success' : 'primary'">{{ qnaire.id | headerPrefix }}</el-tag>
    </header>
    <el-button @click="handleExport">
      导出 Excel 数据
    </el-button>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import {UserModule} from "@/store/modules/user";
  import {exportJson2Excel, normalizedAnswers} from '@/utils/excel';
  import _ from 'lodash';

  @Component({
  name: 'Statistics'
})
export default class extends Vue {
  get qnaireId() {
    return QnaireModule.id;
  }
  get qnaire() {
    return QnaireModule;
  }
  handleExport() {
    QnaireModule.GetAnswers().then(async () => {
      if (_.find(this.qnaire.form, { type: 'area-picker' })) {
        return QnaireModule.GetChinaArea();
      }
    }).then(() => {
      const data = normalizedAnswers(
        QnaireModule.answers.map((r: any) => r.answer),
        this.qnaire.form.map(f => ({ type: f.type, name: f.name, selection: f.meta ? f.meta.selection : undefined }))
      );
      console.log(data)
      exportJson2Excel(data.headers, data.body);
    });
  }
  created() {
    if (this.qnaireId) {
      QnaireModule.GetQnaire();
    } else if (UserModule.myQnaire.length > 0) {
      QnaireModule.SET_ID(UserModule.myQnaire[0].id)
      QnaireModule.GetQnaire();
    } else {
      this.$message.warning('无法获取到您的问卷，');
    }
  }
}
</script>

<style scoped lang="scss">
  .data-header {
    padding-left: 20px;
    margin-top: 20px;
    .data-header-title {
      font-size: 20px;
      font-weight: bold;
    }
    .el-tag {
      margin-left: 10px;
    }
  }
</style>
