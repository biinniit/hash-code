import * as fs from 'fs'

type Skills = Record<string, number>

interface Project {
  name: string
  duration: number
  score: number
  expiry: number
  roles: Skills
}

interface Person {
  name: string
  skills: Skills
}

const people: Person[] = []
const projects: Project[] = []
readInput(people, projects)
//console.log('People:')
//console.log(people)
//console.log('Projects:')
//console.log(projects)

function readInput(people: Person[], projects: Project[]) {
  const inputLines = fs.readFileSync('a_an_example.in.txt', 'utf-8').split('\n')
  let lineNum = 0
  const SIZE = inputLines[lineNum++].split(' ')
  const C = parseInt(SIZE[0]); const P = parseInt(SIZE[1])

  for(let i = 0; i < C; ++i) {
    const PERSON_LINE = inputLines[lineNum++].split(' ')
    const nSkills = parseInt(PERSON_LINE[1])
    let skills: Skills = {}
    for(let j = 0; j < nSkills; ++j) {
      const SKILL = inputLines[lineNum++].split(' ')
      skills[SKILL[0]] = parseInt(SKILL[1])
    }

    people.push({name: PERSON_LINE[0], skills: skills})
  }

  for(let i = 0; i < P; ++i) {
    const PROJECT_LINE = inputLines[lineNum++].split(' ')
    const nRoles = parseInt(PROJECT_LINE[4])
    let roles: Skills = {}
    for(let j = 0; j < nRoles; ++j) {
      const ROLE = inputLines[lineNum++].split(' ')
      roles[ROLE[0]] = parseInt(ROLE[1])
    }

    projects.push({
      name: PROJECT_LINE[0],
      duration: parseInt(PROJECT_LINE[1]),
      score: parseInt(PROJECT_LINE[2]),
      expiry: parseInt(PROJECT_LINE[3]),
      roles: roles
    })
  }
}