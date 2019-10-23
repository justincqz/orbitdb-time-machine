export default class JoinEvent {

  readonly heads: string[];

  constructor(heads: string[]) {
    this.heads = heads;
  }

  static createEvent(heads: string[]) {
    return new JoinEvent(heads);
  }

}
