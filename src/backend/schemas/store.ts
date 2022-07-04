const StoreSchema = {
  properties: {
    version: { type: "string" },
    protoLanguageId: { type: "string" },
    languageStages: {
      elements: {
        properties: {
          id: { type: "string" },
          name: { type: "string", nullable: true },
          parentLanguageStageId: { type: "string", nullable: true },
        }
      }
    },
    originalWords: {
      elements: {
        properties: {
          languageStageId: { type: "string" },
          id: { type: "string" },
          roman: { type: "string" },
        }
      }
    },
    soundChanges: {
      elements: {
        properties: {
          id: { type: "string" },
          name: { type: "string", nullable: true },
          languageStageId: { type: "string" },
          contextBefore: { type: "string" },
          contextAfter: { type: "string" },
          replace: { type: "string" },
          replaceWith: { type: "string" },
        },
      }
    }
  }
} as const

export default StoreSchema
