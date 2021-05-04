<template>
  <div>
    {{ JSON.stringify(project) }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Project from '@/models/Project'

@Component({})
export default class ProjectView extends Vue {
  @Prop({ type: Project, required: true }) project!: Project
}
</script>
