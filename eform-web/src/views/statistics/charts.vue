<template>
  <div class="charts-container">
    <h1>
      {{ qnaire.name }}
      <span class="charts-header_tags">
        <el-tag :type="qnaire.type ? 'success' : 'primary'">{{ qnaire.type ? '匿名问卷' : '实名问卷' }}</el-tag>
        <el-tag effect="plain" :type="qnaire.type ? 'success' : 'primary'">{{ qnaire.id | headerPrefix }}</el-tag>
      </span>
    </h1>
    <main class="charts-container__main">
      <section class="chart-container" v-for="(form, i) in validForm" :key="form.name + '_' + i">
        <p class="chart-title">
          <span class="chart-title__name">{{ (i+1) + '.' }} {{ form.name }}</span>
          <el-tag type="info" effect="plain" size="small" hit class="chart-title__tag">
            {{ $t(`question.${form.type}`) }}
          </el-tag>
          <span class="chart-title__desc">{{ (form.description ? `（${form.description}）` : '') | stripLongText }}</span>
        <div :id="'chart_' + i" class="chart-block">
          <el-button class="chart-block__download" v-if="form.type === 'file-uploader'" type="primary">下载所有问卷中携带的附件</el-button>
          <el-table v-else-if="isTextQuestion(form.type)" border max-height="200" :data="analysis ? analysis[i] : []">
            <el-table-column type="index" />
            <el-table-column label="答案">
              <template v-slot="scope" v-if="form.type === 'date-picker'">
                {{ moment(scope.row).format((form.meta.type && form.meta.type === 'datetime') ? 'YYYY-MM-DD HH:mm:SS' : 'YYYY-MM-DD') }}
              </template>
              <template v-slot="scope" v-else>
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import {UserModule} from "@/store/modules/user";
  import echarts from 'echarts';
  import filter from 'lodash/filter';
  import moment from 'moment';

  @Component({
  name: 'StatisticsChart'
})
export default class extends Vue {
  get qnaireId() {
    return QnaireModule.id;
  }
  get queryId() {
    return this.$route.query.id;
  }
  get qnaire() {
    return QnaireModule;
  }
  get analysis() {
    return QnaireModule.analysis;
  }
  get validForm() {
    return filter(this.qnaire.form, f => f.type !== 'plain-text');
  }
  get moment() {
    return moment;
  }
  private isTextQuestion(type: string) {
    return (type === 'qnaire-input' ||
      type === 'qnaire-textarea' ||
      type === 'date-picker');
  }
  created() {
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
      QnaireModule.GetAnalysis();
    })
  }
}
</script>

<style lang="scss" scoped src="./charts.scss" />
