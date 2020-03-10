<template>
  <el-row>
    <el-col :span="12">
      <div class="grid-content visual-editor">
        <div class="editor-img"></div>
        <p class="entry-title">创建空白问卷</p>
        <p class="entry-detail">使用可视化编辑器编辑问卷</p>
        <el-button-group>
          <el-button class="start-btn" @click="newQnaire('editor', 'false')">实名问卷</el-button>
          <el-button class="start-btn" @click="newQnaire('editor', 'true')">匿名问卷</el-button>
        </el-button-group>

      </div>
    </el-col>
    <el-col :span="12">
      <div class="grid-content import-file">
        <div class="excel-img"></div>
        <p class="entry-title">使用Excel生成问卷</p>
        <p class="entry-detail">从表格中导入数据，自动生成问卷</p>
        <el-button class="start-btn" @click="newQnaire('excel')">开始</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import guidePic from '@/assets/guide-images/sprites_bg.png';

  @Component({
    name: 'Guide',
  })
  export default class extends Vue {
    newQnaire(to: string, type: string = 'false') {
      this.$router.push({
        path: '/import/' + to,
        query: {
          id: 'new',
          type
        }
      })
    }
  }
</script>

<style scoped lang="scss">
  .grid-content {
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 50px);
  }
  .editor-img {
    margin-top: 2em;
    background-image: url("/img/sprites_bg.b2362d81.png");
    width: 154px;
    height: 152px;
    background-position: -232px 0;
    transform: scale(0.72);
  }
  .excel-img {
    margin-top: 2em;
    background-image: url("/img/sprites_bg.b2362d81.png");
    width: 189px;
    height: 162px;
    background-position: 0 -158px;
    transform: scale(0.68);
  }
  .import-file {
    background-color: #4da0e7;
    .start-btn {
      color: white;
      background-color: #4da0e7;
      margin-bottom: 3em;
    }
    .start-btn:hover {
      background-color: white;
      color: #4da0e7;
    }
  }
  .visual-editor {
    background-color: #328edc;
    .start-btn {
      color: white;
      background-color: #328edc;
      margin-bottom: 3em;
    }
    .start-btn:hover {
      background-color: white;
      color: #328edc;
    }
  }
  .entry-title {
    font-size: 24px;
    margin-top: 1em;
    margin-bottom: 0;
  }
  .entry-detail {
    font-size: 18px;
  }
</style>
