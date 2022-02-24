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

interface Assignment {
  project: string
  people: string[]
}

const DURATION_WEIGHT = 5
const SCORE_WEIGHT = 1
const EXPIRY_WEIGHT = 5
//const NUMBER_PEOPLE_WEIGHT = 10 ** 2.5

const people: Person[] = []
const projects: Project[] = []
let maxExpiry = 0
readInput(people, projects)
//console.log('People:')
//console.log(people)
//console.log('Projects (before sort):')
//console.log(projects)

projects.sort(compareProjects)
//console.log('Projects (after sort):')
//console.log(projects)

const projectQueue: Project[] = []
const assignments: Assignment[] = []

for(let i = 0, tryAgain = false; i < projects.length; ++i) {
  let project: Project
  if(tryAgain) {
    if(projectQueue.length !== 0) {
      project = projectQueue[0]
      //console.log(`Trying ${project.name} again...`)
      --i
    }
    else {
      tryAgain = !tryAgain
      --i; continue
    }
  }
  else
    project = projects[i]

  const assignment: Assignment = { project: project.name, people: [] }
  for(const [role, level] of Object.entries(project.roles)) {
    let foundPerson = undefined
    for(const person of people) {
      if(role in person.skills && person.skills[role] >= level) {
        foundPerson = person.name
        if(assignment.people.includes(foundPerson))
          continue
        ++person.skills[role]
        break
      }
    }

    if(foundPerson == null)
      break
    assignment.people.push(foundPerson)
  }

  if(assignment.people.length === Object.keys(project.roles).length) {
    if(!(tryAgain = !tryAgain))
      projectQueue.shift()
    assignments.push(assignment)
  }
  else if(assignment.people.length <= Object.keys(project.roles).length) {
    if(tryAgain = !tryAgain)
      projectQueue.push(project)
  }
}
//console.log('Assignments:')
//console.log(assignments)

writeOutput(assignments)

function calculatePriority(project: Project): number {
  return ((maxExpiry - project.duration) * DURATION_WEIGHT
    + project.score * SCORE_WEIGHT
    + (maxExpiry - project.expiry) * EXPIRY_WEIGHT)
    / Object.keys(project.roles).length
}

function isFutile(project: Project): boolean {
  return project.expiry - project.duration + project.score < 1
}

function compareProjects(a: Project, b: Project): number {
  let aPriority = isFutile(a) ? 0 : calculatePriority(a)
  let bPriority = isFutile(b) ? 0 : calculatePriority(b)

  //console.log(`${a.name} priority: ${aPriority}, ${b.name} priority: ${bPriority}`)
  return bPriority - aPriority
}

function readInput(people: Person[], projects: Project[]) {
  const inputLines = fs.readFileSync('b_better_start_small.in.txt', 'utf-8').split('\n')
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

    if(parseInt(PROJECT_LINE[3]) > maxExpiry)
      maxExpiry = parseInt(PROJECT_LINE[3])

    projects.push({
      name: PROJECT_LINE[0],
      duration: parseInt(PROJECT_LINE[1]),
      score: parseInt(PROJECT_LINE[2]),
      expiry: parseInt(PROJECT_LINE[3]),
      roles: roles
    })
  }
}

function writeOutput(assignments: Assignment[]) {
  let output: string = assignments.length + '\n'
    + assignments
    .map(assignment => assignment.project + '\n' + assignment.people.join(' '))
    .join('\n')
  fs.writeFileSync('b_better_start_small.out.txt', output, 'utf-8')
}
