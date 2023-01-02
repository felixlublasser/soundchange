export default class DialogHelper<T, U> {
  isOpen = false
  resolve: (value: T | null) => void
    = () => { /**/ }
  onOpen: (value: U | null) => void
    = () => { /**/ }

  async openAndAwait (props: U): Promise<T | null> {
    this.isOpen = true
    this.onOpen(props)
    const result = await new Promise<T | null>(resolve => {
      this.resolve = resolve
    })
    this.isOpen = false
    return result
  }

  cancel(): void {
    this.resolve(null)
  }
}
