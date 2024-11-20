export class ExamScheduleAlreadyExistsError extends Error {
  constructor() {
    super('Horário indisponível.')
  }
}
