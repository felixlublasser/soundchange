import SoundChangeInterface from '@/interface/interfaces/SoundChange'

export default class SoundChange {
  private data: SoundChangeInterface

  constructor(data: SoundChangeInterface) {
    this.data = data
  }

  get id(): string {
    return this.data.id
  }
  get name(): string | null {
    return this.data.name
  }
  get contextBefore(): string {
    return this.data.contextBefore
  }
  get contextAfter(): string {
    return this.data.contextAfter
  }
  get replace(): string {
    return this.data.replace
  }
  get replaceWith(): string {
    return this.data.replaceWith
  }
}
