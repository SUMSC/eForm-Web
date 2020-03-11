import {Component, Prop, Vue} from "vue-property-decorator";
import {QnaireModule} from "@/store/modules/qnaire";
import {Form as ElForm} from "element-ui/types/element-ui";
import {questionComponents} from "@/utils";
import _ from 'lodash';

@Component({})
export class QuestionComponent extends Vue {
  @Prop(Boolean) readonly edit!: boolean;
  @Prop(Number) readonly id!: number;
  get components() {
    return questionComponents;
  }
  get form() {
    return QnaireModule.form.filter(i => i.id === this.id)[0];
  }
  get qnaire() {
    return QnaireModule;
  }
  get name() {
    return this.form.name;
  }
  get description() {
    return <string>this.form.description;
  }
  get required() {
    return this.form.required;
  }
  get questionNumber() {
    return this.qnaire.form.filter(i => i.type !== 'plain-text' && i.id < this.id).length + 1;
  }
  get pos() {
    return _.findIndex(this.qnaire.form, {id: this.id});
  }
  set name(value: string) {
    const temp = this.qnaire.form.slice();
    const pos = _.findIndex(temp, {id: this.id});
    temp[pos].name = value;
    QnaireModule.SET_FORM(temp);
  }
  set description(value: string) {
    const temp = this.qnaire.form.slice();
    const pos = _.findIndex(temp, {id: this.id});
    temp[pos].description = value;
    QnaireModule.SET_FORM(temp);
  }
  set required(value: boolean) {
    const temp = this.qnaire.form.slice();
    const pos = _.findIndex(temp, {id: this.id});
    temp[pos].required = value;
    QnaireModule.SET_FORM(temp);
  }
  async validate(event: string, ...args: any[]) {
    const formList = ['form', 'selection'];
    const checkRes = await Promise.all(formList.map(async form => {
      if (!this.$refs[form]) return false;
      return !(await (this.$refs[form] as ElForm).validate());
    }));
    if (_.compact(checkRes).length === 0) {
      this.$emit(event, ...args);
    }
  }
  check() {
    this.$nextTick(() =>
      this.validate('checked')
    );
  }
  changeType(value: string) {
    const temp = this.qnaire.form.slice();
    const pos = _.findIndex(temp, {id: this.id});
    temp[pos].type = value;
    QnaireModule.SET_FORM(temp);
  }
}

@Component({})
export class QuestionHeader extends Vue {
  @Prop(String) readonly name!: string;
  @Prop(Boolean) readonly edit!: boolean;
  @Prop(Number) readonly id!: number;

  get form() {
    return QnaireModule.form.filter(i => i.id === this.id)[0];
  }
  get qnaire() {
    return QnaireModule;
  }

  validate(event: string, ...args: any[]) {
    (this.$refs.form as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.$emit(event, ...args);
        return true;
      } return false;
    });
  }
  check() {
    this.validate('checked');
  }
}
