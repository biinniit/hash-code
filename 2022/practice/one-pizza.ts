import * as fs from 'fs'

interface Client {
  likes: string[]
  dislikes: string[]
}

const clients: Client[] = []
readInput(clients)
//console.log(`Clients: ${JSON.stringify(clients, null, 2)}`)
const dislikes: Record<string, number> = {}
const ingredients: string[] = []

clients.forEach(client => {
  client.likes.forEach(ingredient => {
    if(!ingredients.includes(ingredient))
      ingredients.push(ingredient)
  })
})
console.log(`Ingredients: ${ingredients}`)

clients.forEach(client => {
  client.dislikes
    .filter(dislike => ingredients.includes(dislike))
    .forEach(dislike => {
      if (!(dislike in dislikes))
        dislikes[dislike] = 0
    })
})
console.log(`Dislikes: ${Object.keys(dislikes)}`)

Object.keys(dislikes).forEach(dislike => {
  clients.forEach(client => {
    if (client.likes.includes(dislike))
      dislikes[dislike] += 1 / client.likes.length
    if (client.dislikes.includes(dislike)) // opportunity for optimization, make if-else-if
      dislikes[dislike] -= 1
  })

  if(dislikes[dislike] < 0)
    ingredients.splice(ingredients.indexOf(dislike), 1)
})
console.log(`Dislike scores: ${JSON.stringify(dislikes, null, 2)}`)

writeOutput(ingredients)

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
