<template>
  <div>
    Project this is
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Project from '@/models/project'

@Component({})
export default class ProjectView extends Vue {
  @Prop({ type: Project, required: true }) project!: Project
}
</script>
