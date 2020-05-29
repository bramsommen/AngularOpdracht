export class OpcTagResult {
  constructor(init?: Partial<OpcTagResult>) {
    Object.assign(this, init);
  }

  tag: string;
  value: string;
  bitValue: boolean;
}
