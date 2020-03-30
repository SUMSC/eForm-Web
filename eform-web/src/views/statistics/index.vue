<template>
  <div class="data-container">
    <header class="data-header">
      <span class="data-header-title">{{ qnaire.name }}</span>
      <el-tag :type="qnaire.type ? 'success' : 'primary'">{{ qnaire.type ? '匿名问卷' : '实名问卷' }}</el-tag>
      <el-tag effect="plain" :type="qnaire.a ? 'success' : 'primary'">{{ qnaire.id | headerPrefix }}</el-tag>
      <span class="export-actions">
        <el-button-group class="export-btn">
          <el-button @click="handleShowCharts" type="primary">
            查看图表
          </el-button>
          <el-button @click="handleExport" type="primary">
            导出原始数据
          </el-button>
        </el-button-group>
        <el-select class="export-select" v-model="exportType">
          <el-option
            v-for="item in typeOptions"
            v-bind="item"
            :key="item.value"
          />
        </el-select>
      </span>
    </header>
    <main style="margin: 30px">
      <el-table border stripe fit :data="answers.body" v-loading="loading">
        <el-table-column type="index" />
        <el-table-column
          v-for="(header, i) in answers.headers"
          :key="`${header}_${i}`"
          :label="header"
          :prop="String(i)"
          sortable
        ></el-table-column>
      </el-table>
    </main>
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
  private loading = false;
  private answers : { headers : string[], body: string[][] } = {
    headers: [],
    body: []
  };
  private exportType = 'xlsx';
  private typeOptions = [{
    label: 'CSV 格式',
    value: 'csv'
  }, {
    label: 'Excel 格式',
    value: 'xlsx'
  }];
  get qnaireId() {
    return QnaireModule.id;
  }
  get queryId() {
    return this.$route.query.id;
  }
  get qnaire() {
    return QnaireModule;
  }
  handleExport() {
    exportJson2Excel(
      this.answers.headers,
      this.answers.body,
      QnaireModule.name + '_原始数据',
      [], [], true,
      this.exportType
    );
  }
  handleShowCharts() {
    this.$router.push({
      path: 'charts',
      query: {
        id: String(this.qnaireId)
      }
    });
  }
  created() {
    this.loading = true;
    new Promise((resolve: Function, reject: Function) => {
      if (this.queryId) {
        QnaireModule.SET_ID(parseInt(<string>this.queryId));
        resolve(QnaireModule.GetQnaire());
      } else if (this.qnaireId && this.qnaireId !== 0) {
        resolve(QnaireModule.GetQnaire());
      } else if (UserModule.myQnaire.length > 0) {
        QnaireModule.SET_ID(UserModule.myQnaire[0].id);
        resolve(QnaireModule.GetQnaire());
      } else {
        this.$message.warning('无法获取到您的问卷。');
        reject('无法获取到您的问卷。')
      }
    }).then(() => {
      return QnaireModule.GetAnswers();
    }).then(async () => {
      if (_.find(this.qnaire.form, { type: 'area-picker' })) {
        return QnaireModule.GetChinaArea();
      }
    }).then(() => {
      this.answers = normalizedAnswers(
        QnaireModule.answers.map((r: any) => this.qnaire.type ? r.answer : _.concat([r.owner.id_tag], r.answer)),
        this.qnaire.type
        ? this.qnaire.form.map(f => ({ type: f.type, name: f.name, selection: f.meta ? f.meta.selection : undefined, meta: f.meta }))
        : _.concat(
          { type: 'qnaire-input', name: '学号', selection: undefined, meta: {} },
          this.qnaire.form.map(f => ({ type: f.type, name: f.name, selection: f.meta ? f.meta.selection : undefined, meta: f.meta }))
          )
      );
      this.loading = false;
    });
  }
}
</script>

<style scoped lang="scss">
  .export-actions {
    position: absolute;
    right: 0;
    margin-right: 20px;
  }
  .export-btn {
    margin-left: 30px;
  }
  .export-select {
    margin-left: 10px;
    width: 7em;
  }
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
