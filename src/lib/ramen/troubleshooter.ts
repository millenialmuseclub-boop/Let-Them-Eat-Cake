import { troubleshooterProblems } from './data'

export function getTroubleshooterProblem(id: string) {
  return troubleshooterProblems.find((p) => p.id === id)
}
