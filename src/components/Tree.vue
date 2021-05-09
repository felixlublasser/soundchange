<template>
  <div class="tree-main">
    {{ JSON.stringify(protoLanguage) }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/models/LanguageStage';

@Component({})
export default class Tree extends Vue {
  @Prop({ type: LanguageStage, required: true }) protoLanguage!: LanguageStage
}
</script>

<style lang="scss" scoped>
.tree-main {
  background-color: #333;
}
</style>