const RecentProjectsSchema = {
  properties: {
    recentProjects: {
      elements: {
        type: "string"
      }
    }
  }
} as const

export default RecentProjectsSchema
