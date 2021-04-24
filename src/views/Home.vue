<template>
  <div>
    <button @click='createNewProject'><h2>Create New Project</h2></button>
    <button @click="loadExistingProject"><h2>Load Existing Project</h2></button>
    <h2>Recent Projects</h2>
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

  createNewProject(): void {
    this.$emit('navigateTo', AppView.PROJECT)
  }

  loadExistingProject(): void {
    ipcRenderer.send('dialogOpenProject')
  }
}
</script>
