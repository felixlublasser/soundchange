<template>
  <div id="app">
    <component
      :is="currentView"
      v-bind="{ project }"
      @navigateTo="navigateTo"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HomeView from '@/views/Home.vue';
import ProjectView from '@/views/Project.vue';
import AppView from '@/models/appView';
import Project from '@/models/project';
import { ipcRenderer } from 'electron';
import { isSuccess } from './lib/result';

@Component({
  components: {
    HomeView,
    ProjectView
  },
})
export default class App extends Vue {
  currentView: AppView = AppView.HOME
  project: Project = new Project()

  created(): void {
    ipcRenderer.on('openedProject', (_event, json) => {
      this.mountProject(json)
    })
  }

  navigateTo(view: AppView): void {
    this.currentView = view
  }

  async loadProject(filePath: string): Promise<void> {
    const json = await ipcRenderer.invoke('loadProject', filePath)
    this.mountProject(json)
  }

  mountProject(json: unknown): void {
    const loadResult = Project.fromJSON(json)
    if (isSuccess(loadResult)) {
      this.project = loadResult
    } else {
      throw loadResult
    }
    this.navigateTo(AppView.PROJECT)
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #111;
  height: 100%;
  color: #eee;
}
</style>
