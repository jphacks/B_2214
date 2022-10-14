export class WithoutProviderError extends Error {
  constructor() {
    super();
    this.name = `WithoutProviderError`;
    this.message = `You should use hooks within provider`;
  }
}
