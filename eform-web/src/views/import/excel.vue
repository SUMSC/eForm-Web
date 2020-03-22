<template>
  <div class="editor-container">
    <el-card class="box-card">
      <div slot="header">
        <p class="card-header">你可以修改 Excel 模板并导入系统，系统将会自动生成问卷</p>
      </div>
      <div class="import-content">
        <p>1、请按照模版格式填写问卷数据</p>
        <el-button icon="el-icon-search" class="download-btn" @click="downloadTemplate">下载 Excel 模板</el-button>
        <p>2、上传修改过的 Excel 模板</p>
        <el-upload
          class="upload-demo"
          drag
          :limit="1"
          :action="uploadURL"
          :headers="uploadHeader"
          :before-upload="checkFile"
          :on-success="handleSuccess"
          :on-error="handleError"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将 Excel 拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-button type="primary" v-if="showSuccessAction" @click="editQnaire">编辑刚刚上传的问卷</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Message} from "element-ui";
  import {UserModule} from "@/store/modules/user";
  import {getQnaireExcelTemplate, uploadURL} from '@/api/qnaire';
  import {GeneralError} from "@/api/types";

  @Component({
    name: 'Excel',
  })
  export default class extends Vue {
    // private uploadURL = '';
    private showSuccessAction = false;
    private newQnaireId = '';
    private uploadHeader = {
      'X-Custom-Auth': UserModule.token
    };
    private uploadURL = uploadURL;
    checkFile(file: File) {
      if (
        file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
        file.type !== 'application/vnd.ms-excel'
      ) {
        Message.error(`无法上传，问卷类型不能是 ${file.name.split('.').pop()}`);
        return false;
      }
    }
    handleSuccess(res: any, file: any, fileList: any) {
      console.log(res);
      Message.success('问卷生成成功！');
      this.newQnaireId = res.message;
      this.showSuccessAction = true;
      UserModule.GetUserInfo();
    }
    handleError(err: Error, file: any, fileList: any) {
      const error: GeneralError = JSON.parse(err.message);
      if (error.message === 'unknown type of qnaire')
        Message.error('问卷类型错误，问卷生成失败。');
      else if (error.message === 'qnaire name is too long')
        Message.error('问卷名太长，问卷生成失败。');
      else if (error.message.startsWith('unknown type of question')) {
        const question = /unknown type of question (\d+)/.exec(error.message);
        if (question !== null) Message.error(`第 ${question[1]} 题类型错误，问卷生成失败。`)
      }
      else Message.error('问卷生成失败。');
    }
    downloadTemplate() {
      getQnaireExcelTemplate();
    }
    editQnaire() {
      this.$router.push({
        path: '/import/editor',
        query: {
          id: this.newQnaireId
        },
      })
    }
  }
</script>

<style scoped lang="scss">
  .editor-container {
    background-color: #f4f6f9;
    height: calc(100vh - 50px);
    width: calc(100vw);
    padding-top: 2em;
    padding-left: 3em;
  }
  .box-card {
    max-width: 940px;
    width: 90vw;
    .card-header {
      font-size: 18px;
      margin-left: 1em;
    }
  }
  .import-content {
    padding-left: 1em;
    p {
      color: #b4b4b4;
    }
    .download-btn {
      color: #009dff
    }
  }
</style>
