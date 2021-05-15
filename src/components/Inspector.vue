<template>
  <div class="inspector-main">
    <input v-if="languageStage" v-model="languageStage.name"/>
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
  padding: 16px;
}
</style>