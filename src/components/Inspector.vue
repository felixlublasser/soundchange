<template>
  <div class="inspector-main">
    {{ JSON.stringify(languageStage) }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/models/LanguageStage';

@Component({})
export default class Inspector extends Vue {
  @Prop({ type: LanguageStage, default: null }) languageStage!: LanguageStage | null
}
</script>

<style lang="scss" scoped>
.inspector-main {
  background-color: #555;
}
</style>