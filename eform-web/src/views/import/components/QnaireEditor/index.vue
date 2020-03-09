<template>
  <el-row>
    <el-col :span="19" :lg="20">
      <div class="editor-preview">
        <QuestionEditor
          ref="qnaire-title"
          :name="qnaire.name"
          type="qnaire-title"
          @edit="handleEdit($event)"
          @checked="handleChecked"
        />
        <QuestionEditor
          ref="qnaire-description"
          :name="qnaire.description"
          type="qnaire-description"
          @edit="handleEdit($event)"
          @checked="handleChecked"
        />
        <QuestionEditor
          v-for="form in qnaire.form"
          :key="form.id"
          :ref="form.id"
          :id="form.id"
          :name="form.name"
          :description="form.description"
          :type="form.type"
          :meta="form.meta"
          @edit="handleEdit($event)"
          @checked="handleChecked"
        />
      </div>
    </el-col>
    <el-col :span="5" :lg="4">
      <Sticky>
        <div class="question-component-list">
          <div class="list-item save-btn" ><i class="el-icon-upload2"></i> {{ $t('qnaire.save') }}</div>
          <el-divider></el-divider>
            <div class="list-item list-title" ><i class="el-icon-star-on"></i> {{ $t('qnaire.append') }}</div>
            <div class="list-item" v-for="component in components" @click="handleAppend(component)">{{ $t('question.' + component) }}</div>
        </div>
      </Sticky>
    </el-col>
  </el-row>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {QnaireModule} from "@/store/modules/qnaire";
  import QuestionEditor from '../QuestionEditor/index.vue';
  import Sticky from '@/components/Sticky/index.vue';
  import {IFormModel} from "@/api/types";
  import {Message} from "element-ui";

  @Component({
    name: 'QnaireEditor',
    components: {
      QuestionEditor,
      Sticky
    }
  })
  export default class extends Vue {
    private components = [
      'plain-text',
      'select',
      'checkbox',
      'input',
      'textarea',
      'area-picker',
      'date-picker',
      'file-uploader'
    ];
    private nextEditing: string = '';
    get qnaireId() {
      return this.$route.query.qnaireId;
    }
    get qnaire() {
      return QnaireModule;
    }
    handleEdit(id: string) {
      if (QnaireModule.editing === '')
        QnaireModule.SET_EDITING(id);
      else {
        this.nextEditing = id;
        let el : any;
        if (id !== 'qnaire-title' && id !== 'qnaire-description')
          el = (this.$refs[id] as Vue[])[0];
        else el = this.$refs[id];
        el.check();
      }
    }
    handleChecked() {
      if (QnaireModule.editing === this.nextEditing)
        QnaireModule.SET_EDITING('');
      else
        QnaireModule.SET_EDITING(this.nextEditing);
    }
    handleAppend(component: string) {
      const newId = QnaireModule.form.length + 1;
      if (QnaireModule.editing === '') {
        const newForm: IFormModel = {
          id: newId,
          name: '',
          description: '',
          type: component,
          meta: {}
        };
        QnaireModule.SET_FORM(QnaireModule.form.concat([newForm]));
      } else {
        Message.warning('请先完成当前问题的编辑。')
      }
    }
    mounted() {
      if (this.qnaireId && this.qnaireId !== 'new') {
        QnaireModule.SET_ID(parseInt(<string>this.qnaireId));
        QnaireModule.GetQnaire();
      } else {
        QnaireModule.SET_NAME('问卷标题');
        QnaireModule.SET_DESCRIPTION('这里可以写一些问卷简介。');
        QnaireModule.SET_FORM([]);
        QnaireModule.NewQnaire();
      }
    }
  }
</script>

<style lang="scss">
  .editor-preview {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2vh;
  }
  .editor-item {
    margin: 0;
    max-width: 800px;
  }
  .question-component-list {
    width: 100%;
    /*min-height: calc(100vh - 91px);*/
    height: 51vh;
    background-color: #fafafa;
    border-left: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    padding-top: 1em;
  }
  .list-item {
    border: 1px solid #e0e0e0;
    background-color: white;
    padding: 8px 12px 10px 12px;
    width: 10em;
    max-width: 80%;
    text-wrap: none;
    margin-left: 1.2em;
    margin-bottom: 5px;
    cursor: pointer;
    text-align-last: center;
  }
  .save-btn {
    background-color: #409eff;
    color: white;
  }
  .list-item:hover {
    color: #58a6e7;
  }
  .save-btn:hover {
    background-color: #66b1ff;
    color: white;
  }
  .list-title {
    cursor: default;
    background-color: #409eff;
    margin-bottom: 1.5em;
    text-align-last: center;
    color: white;
    border-radius: 10px;
  }
  .list-title:hover {
    color: white;
  }
</style>
