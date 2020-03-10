<template>
  <div></div>
</template>

<script lang="ts">
  import {Component, Mixins} from "vue-property-decorator";
  import {QuestionComponent} from "@/mixins";

  @Component({})
  export default class extends Mixins(QuestionComponent) {

  }
</script>
