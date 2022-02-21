import * as fs from 'fs'

interface Client {
  likes: string[]
  dislikes: string[]
}

function readInput(clients: Client[]) {
  const inputLines = fs.readFileSync('a_an_example.in', 'utf-8').split('\n')
  let n = parseInt(inputLines[0])

  for(let i = 0; i < n; ++i) {
    const likes = inputLines[(2 * i) + 1]
      .split(' ')
      .filter((x, index) => index !== 0)
    const dislikes = inputLines[(2 * i) + 2]
      .split(' ')
      .filter((x, index) => index !== 0)

    clients.push({ likes: likes, dislikes: dislikes})
  }
}

function writeOutput(ingredients: string[]) {
  let output: string = ingredients.length + ' ' + ingredients.join(' ') + '\n'
  fs.writeFileSync('a_an_example.out', output, 'utf-8')
}

const clients: Client[] = []
readInput(clients)
writeOutput(clients[0].likes)
