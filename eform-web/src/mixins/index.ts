import {Component, Prop, Vue} from "vue-property-decorator";
import {QnaireModule} from "@/store/modules/qnaire";
import {Form as ElForm} from "element-ui/types/element-ui";

@Component({})
export class QuestionComponent extends Vue {
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
