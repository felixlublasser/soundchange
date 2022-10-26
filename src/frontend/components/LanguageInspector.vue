<template>
  <div class="inspector-main">
    <template v-if="languageStage">
      <div class="header">
        <input v-model="name" @blur="updateLanguageStage" class="input-h1"/>
      </div>

      <Tabs
        :tabs="tabs"
        :activeTabKey="activeTab"
        @activateTab="activateTab"
      >
        <template #soundChanges>
          <SoundChanges
            v-bind="{ soundChanges }"
            @createSoundChange="createSoundChange"
          />
        </template>
        <template #lexicon>
          <Lexicon
            v-bind="{ words }"
            @createWord="createWord"
          />
        </template>
      </Tabs>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import LanguageStage from '@/frontend/models/LanguageStage';
import Tabs from '@/frontend/components/Tabs.vue'
import Lexicon from '@/frontend/components/Lexicon.vue'
import SoundChanges from '@/frontend/components/SoundChanges.vue'
import endpoints from '@/frontend/lib/endpoints';
import { succeedOrThrow } from '@/lib/result';
import WordStage from '@/frontend/models/WordStage';
import SoundChange from '@/frontend/models/SoundChange';
import SoundChangeCreateInterface from '@/interface/interfaces/SoundChangeCreate';

export interface UpdatableVue extends Vue {
  update(): void
}

type TabKey = 'soundChanges' | 'lexicon'

@Component({ components: { Tabs, Lexicon, SoundChanges } })
export default class LanguageInspector extends Vue {
  @Prop({ type: LanguageStage, default: null }) languageStage!: LanguageStage | null
  @Prop({ type: String, required: true }) projectId!: string

  words: WordStage[] | null = null
  soundChanges: SoundChange[] | null = null
  activeTab: TabKey = 'soundChanges'

  get tabs(): { key: TabKey, title: string }[] {
    return [
      { key: 'soundChanges', title: 'Sound Changes' },
      { key: 'lexicon', title: 'Lexicon' }
    ]
  }

  get name(): string | null {
    return this.languageStage ? this.languageStage.name : null
  }

  set name(value: string | null) {
    if (!this.languageStage) { return }
    this.languageStage.name = value
  }

  updateLanguageStage(): void {
    this.$emit('updateLanguageStage')
  }

  async getWords(): Promise<void> {
    if (!this.languageStage) { return }
    const wordsResult = await endpoints.getWordsForLanguageStage(
      { projectId: this.projectId, id: this.languageStage.id }
    )
    this.words = succeedOrThrow(wordsResult).map(result => new WordStage(result))
  }

  createWord(roman: string): void {
    if (!this.languageStage) {
      return
    }
    succeedOrThrow(endpoints.createWordForLanguageStage({
      projectId: this.projectId,
      id: this.languageStage.id,
      word: { roman }
    }))
    this.update()
  }

  createSoundChange(soundChange: SoundChangeCreateInterface): void {
    if (!this.languageStage) {
      return
    }
    succeedOrThrow(endpoints.createSoundChangeForLanguageStage({
      projectId: this.projectId,
      id: this.languageStage.id,
      soundChange,
    }))
    this.update()
  }

  async getSoundChanges(): Promise<void> {
    if (!this.languageStage) { return }
    const soundChangesResult = await endpoints.getSoundChangesForLanguageStage(
      { projectId: this.projectId, id: this.languageStage.id }
    )
    this.soundChanges = succeedOrThrow(soundChangesResult).map(result => new SoundChange(result))
  }

  update(): void {
    this.words = null
    this.soundChanges = null
    const func = {
      lexicon: this.getWords,
      soundChanges: this.getSoundChanges,
    }[this.activeTab]
    func()
  }

  activateTab(key: TabKey): void {
    this.activeTab = key
    this.update()
  }
}
</script>

<style lang="scss" scoped>
.inspector-main {
  background-color: #555;
  display: flex;
  flex-direction: column;
}

.header {
  inline-size: 100%;
  padding: 16px;
}

.input-h1 {
  font-size: 1.5em;
  font-weight: bold;
  background-color: transparent;
  border: none;
}

.half {
  padding: 16px;
}

.words {
  flex-grow: 1;
  border-inline-end: 1px solid #000;
}

.sound-changes {
  flex-grow: 2;
}

.sound-change-input {
  inline-size: 70px;
}

.divided {
  display: flex;
  flex-grow: 1;
}
</style>