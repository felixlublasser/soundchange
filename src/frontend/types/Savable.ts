import { v4 } from 'uuid'

export default class Savable {
  id: string;

  constructor(id: string = v4()) {
    this.id = id
  }
}
