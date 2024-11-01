export class CrmAlreadyExistsError extends Error {
  constructor() {
    super('CRM indisponível.')
  }
}
