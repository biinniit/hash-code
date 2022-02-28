/**
 * Practice submission after getting contributors randomly
 * and checking the entire priority queue for each project
 * and adjusting the weights depending on the test case
 * 
 * Optimal weights for the test cases:
 * Default: DURATION_WEIGHT=5,SCORE_WEIGHT=1,EXPIRY_WEIGHT=5
 * C: DURATION_WEIGHT=150,SCORE_WEIGHT=1,EXPIRY_WEIGHT=5
 * F: DURATION_WEIGHT=1000,SCORE_WEIGHT=1,EXPIRY_WEIGHT=1
 * 
 * TODO: fix isFutile problem, negative numbers
 * TODO: implement mentorship logic
 * 
 * Score: 2,352,790
 */
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

let AVG_DURATION = 0
let AVG_SCORE = 0
let AVG_EXPIRY = 0
let AVG_NUMBER_PEOPLE = 0
getAverages()

projects.sort(compareProjects)
//console.log('Projects (after sort):')
//console.log(projects)

const projectQueue: Project[] = []
const assignments: Assignment[] = []

for(let i = 0, j; i < projects.length; ++i) {
  let assignment = getAssignmentFrom(projects[i])
  if(assignment == null) {
    projectQueue.push(projects[i])
  }

  for(j = 0; j < projectQueue.length; ++j) {
    assignment = getAssignmentFrom(projectQueue[j])
    if(assignment == null)
      break
  }
  projectQueue.splice(0, j)
}
//console.log('Assignments:')
//console.log(assignments)

writeOutput(assignments)

function calculatePriority(project: Project): number {
  return ((AVG_DURATION - project.duration) * DURATION_WEIGHT
    + project.score * SCORE_WEIGHT
    + (AVG_EXPIRY - project.expiry) * EXPIRY_WEIGHT)
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

function getAverages() {
  projects.forEach(project => {
    AVG_DURATION += project.duration
    AVG_SCORE += project.score
    AVG_EXPIRY += project.expiry
    AVG_NUMBER_PEOPLE += Object.keys(project.roles).length
  })
  AVG_DURATION /= projects.length; AVG_SCORE /= projects.length
  AVG_EXPIRY /= projects.length; AVG_NUMBER_PEOPLE /= projects.length
  console.log(`Average duration: ${AVG_DURATION}`)
  console.log(`Average score: ${AVG_SCORE}`)
  console.log(`Average expiry: ${AVG_EXPIRY}`)
  console.log(`Average no. of people: ${AVG_NUMBER_PEOPLE}`)
}

function getAssignmentFrom(project: Project): Assignment | null {
  let incrementSkill: number[] = []
  let incrementSkillFor: string[] = []
  let assignment: Assignment | null = { project: project.name, people: [] }

  //console.log(`Attempting assignment for '${project.name}'`)
  for(const [role, level] of Object.entries(project.roles)) {
    let foundPerson = undefined
    let randomPeople = [...people.keys()]
    shuffle(randomPeople)
    for(let j = 0; j < people.length; ++j) {
      const person = people[randomPeople[j]]
      if(role.trimEnd() in person.skills && person.skills[role.trimEnd()] >= level) {
        foundPerson = person.name
        if(assignment.people.includes(foundPerson)) {
          foundPerson = undefined
          continue
        }
        if(person.skills[role.trimEnd()] === level) {
          incrementSkill.push(randomPeople[j])
          incrementSkillFor.push(role.trimEnd())
        }
        break
      }
    }

    if(foundPerson == null)
      break
    assignment.people.push(foundPerson)
  }

  if(assignment.people.length === Object.keys(project.roles).length) {
    //console.log(`Adding assignment for '${assignment.project}'`)
    assignments.push(assignment)

    // increment skills
    for(let index = 0; index < incrementSkill.length; ++index)
      ++people[incrementSkill[index]].skills[incrementSkillFor[index]]
  }
  else if(assignment.people.length <= Object.keys(project.roles).length) {
    //console.log(`Assignment for ${assignment.project} failed with people, `, assignment.people)
    assignment = null
  }

  return assignment
}

function shuffle(indices: number[]) {
  let i = indices.length, r
  while(i != 0) {
    r = Math.floor(Math.random() * i--);
    [indices[i], indices[r]] = [indices[r], indices[i]]
  }
}

function readInput(people: Person[], projects: Project[]) {
  const inputLines = fs.readFileSync('a_an_example.in', 'utf-8').split('\n')
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
      while(ROLE[0] in roles)
        ROLE[0] += ' '
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
    + '\n'
  fs.writeFileSync('a_an_example.out', output, 'utf-8')
}
