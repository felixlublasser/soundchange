<template>
  <div>
    <button @click='openNewProject'><h2>Open New Project</h2></button>
    <h2>Open Recent Projects</h2>
    <button v-for="(project, i) in recentProjects" :key="i">
      {{ project }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ipcRenderer } from 'electron';
import AppView from '@/models/appView'

@Component({})
export default class HomeView extends Vue {
  recentProjects: string[] = []

  async created(): Promise<void> {
    this.recentProjects = await ipcRenderer.invoke('getRecentProjects')
  }

  openNewProject(): void {
    this.$emit('navigateTo', AppView.PROJECT)
  }
}
</script>
