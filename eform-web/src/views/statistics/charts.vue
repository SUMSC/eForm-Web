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
        <div class="chart-block">
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
          <div v-else class="chart-block__main">
            <div class="chart-btn">
              <el-button-group v-if="form.type !== 'area-picker'">
                <el-button @click="switchChart(i, 'bar')" size="mini">柱状图</el-button>
                <el-button @click="switchChart(i, 'pie')" size="mini">饼图</el-button>
                <el-button @click="switchChart(i, 'line')" size="mini">折线图</el-button>
              </el-button-group>
              <el-button @click="downloadChart(i)" class="chart-btn__download" size="mini">下载</el-button>
            </div>
            <div :id="'chart_' + i" class="chart-block__chart"></div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {QnaireModule} from "@/store/modules/qnaire";
import {UserModule} from "@/store/modules/user";
import echarts, { ECharts } from 'echarts';
import filter from 'lodash/filter';
import moment from 'moment';
import {dataURLToBlob} from "@/utils";
import {saveAs} from 'file-saver'

interface ICharts {
  [i: number]: ECharts
}

@Component({
name: 'StatisticsChart'
})
export default class extends Vue {
  private charts : ICharts = {};

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
  private downloadChart(i: number) {
    const dataURL = this.charts[i].getDataURL({ type: 'png' });
    saveAs(dataURLToBlob(dataURL), this.validForm[i].name + '.png');
  }
  private switchDataType(i: number, type: string, data: any) {
    if (type === 'bar' || type === 'line') {
      return this.validForm[i].meta.selection.map((s: any) => data.count[s.value]);
    } else if (type === 'pie') {
      return this.validForm[i].meta.selection.map((s: any) => ({ name: s.value, value: data.count[s.value] }));
    }
    return [];
  }
  private switchChart(i: number, type: string) {
    this.charts[i].clear();
    if (type === 'bar' || type === 'line') {
      this.charts[i].setOption({
        xAxis: {
          data: this.validForm[i].meta.selection
        },
        yAxis: {},
        tooltip: {},
        series: [{
          name: this.validForm[i].name, type,
          data: this.switchDataType(i, type, this.analysis[i])
        }]
      });
    } else {
      this.charts[i].setOption({
        legend: {
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [{
          name: this.validForm[i].name, type,
          data: this.switchDataType(i, type, this.analysis[i])
        }]
      });
    }
  }
  private generateCharts() {
    this.analysis.forEach((ana, i) => {
      if (this.validForm[i].type === 'qnaire-select' || this.validForm[i].type === 'qnaire-checkbox') {
        const el = document.getElementById('chart_' + i);
        if (el === null) {
          this.$message.error('生成图表失败');
          return;
        } else {
          this.charts[i] = echarts.init(<HTMLDivElement>el, 'light', {renderer: 'canvas'});
        }
        const options = {
          xAxis: {
            data: this.validForm[i].meta.selection
          },
          yAxis: {},
          tooltip: {},
          series: [{
            name: this.validForm[i].name,
            type: 'bar',
            data: this.switchDataType(i, 'bar', ana)
          }]
        };
        this.charts[i].setOption(options);
      }
    })
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
      return QnaireModule.GetAnalysis();
    }).then(() => {
      this.$nextTick(() => {
        this.generateCharts();
      });
    })
  }
}
</script>

<style lang="scss" scoped src="./charts.scss" />
