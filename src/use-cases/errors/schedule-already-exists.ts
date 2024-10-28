export class ScheduleAlreadyExistsError extends Error {
  constructor() {
    super('Horário indisponível.')
  }
}
