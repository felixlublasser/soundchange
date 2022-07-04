<template>
  <div>
    <button @click='createNewProject'><h2>Create New Project</h2></button>
    <button @click="loadExistingProject"><h2>Load Existing Project</h2></button>
    <h2>Recent Projects</h2>
    <button
      v-for="(recent, i) in recentProjects"
      :key="i"
      @click="$emit('loadRecentProject', recent)"
    >
      {{ recent }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import endpoints from '@/frontend/lib/endpoints';
import { isSuccess } from '@/lib/result'

@Component({})
export default class HomeView extends Vue {
  recentProjects: string[] = []

  async created(): Promise<void> {
    const result = await endpoints.getRecentProjectFileNames()
    if (isSuccess(result)) {
      this.recentProjects = result.map(r => r.fileName)
    }
  }

  createNewProject(): void {
    this.$emit('createNewProject')
  }

  loadExistingProject(): void {
    // ipcRenderer.send('dialogOpenProject')
  }
}
</script>
