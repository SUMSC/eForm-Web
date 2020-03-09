<template>
  <div style="position: relative">
    <el-tabs v-model="activeTab" type="card">
      <el-tab-pane name="editor">
        <template slot="label">
          <span><i class="el-icon-edit"/> 编辑</span>
        </template>
        <QnaireEditor />
      </el-tab-pane>
      <el-tab-pane name="setting">
        <span slot="label"><i class="el-icon-setting"/> 问卷设置</span>
        <QnaireSetting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import QnaireEditor from './components/QnaireEditor/index.vue';
  import QnaireSetting from './components/QnaireSetting/index.vue';

  @Component({
    name: 'Editor',
    components: {
      QnaireEditor,
      QnaireSetting
    }
  })
  export default class extends Vue {
    private activeTab = 'editor'
  }
</script>
<style lang="scss">
  .el-tabs__header {
    margin: 0;
  }
</style>
