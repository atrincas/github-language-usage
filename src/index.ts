const nodeFetch = require('node-fetch')

export interface Language {
  name: string
  color: string
  percentage: number
}

export interface StringMap {
  [key: string]: string
}

export interface NumberMap {
  [key: string]: number
}

export interface Repository {
  name: string
  languages: {
    edges: { size: number }[]
    nodes: {
      name: string
      color: string
    }[]
  }
}

function createTotals(repos: Repository[]) {
  const languages = repos.map((repo) => {
    let obj: { [key: string]: Language } = {}
    repo.languages.nodes.forEach((node, index) => {
      const percentage = repo.languages.edges[index].size
      obj[node.name] = { ...node, percentage }
    })
    return obj
  })

  const colors = languages.reduce((total: StringMap, item) => {
    const names = Object.keys(item)
    const obj = total

    names.forEach((name) => {
      if (!total || !Object.keys(total).includes(name)) {
        obj[name] = item[name].color
      }
    })

    return obj
  }, {})

  const totals = languages.reduce((total: NumberMap, item) => {
    const names = Object.keys(item)
    const obj = total

    names.forEach((name) => {
      if (!total || !Object.keys(total).includes(name)) {
        obj[name] = item[name].percentage
      } else {
        obj[name] = obj[name] + item[name].percentage
      }
    })

    return obj
  }, {})

  const totalNum = Object.values(totals).reduce((a, b) => a + b, 0)

  const percentages = Object.keys(totals).map((name) => {
    const percentage = (100 / totalNum) * totals[name]
    const roundedNumber = Math.round((percentage + Number.EPSILON) * 100) / 100

    return {
      name,
      percentage: roundedNumber,
      color: colors[name]
    }
  })

  return percentages.sort((a, b) => b.percentage - a.percentage)
}

function checkParams(token: string, user: string) {
  if (typeof token === 'undefined') {
    try {
      throw new TypeError('No arguments were provided')
    } catch (err) {
      console.error(err.name + ':', err.message)
      throw err
    }
  } else if (typeof user === 'undefined') {
    try {
      throw new TypeError('No user was provided')
    } catch (err) {
      console.error(err.name + ':', err.message)
      throw err
    }
  }
}

export async function githubLanguageUsage(token: string, user: string, repos = 100) {
  checkParams(token, user)

  const endpoint = 'https://api.github.com/graphql'
  const variables = {
    user,
    repos
  }
  const query = `query($user: String!, $repos: Int!) {
  user(login: $user) {
    repositories(first: $repos) {
      nodes {
        name
        languages(first: 100) {
          edges {
            size
          }
          nodes {
            name
            color
          }
        }
      }
    }
  }
}`

  const result = await nodeFetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ query, variables })
  })
    .then((response: any) => {
      if (response.status === 200) {
        return response.json()
      } else {
        try {
          throw new TypeError(
            `Error while fetching data from Github: ${response.status} ${response.statusText}`
          )
        } catch (err) {
          console.error(err.name + ':', err.message)
          throw err
        }
      }
    })
    .then((data: any) => {
      return data
    })
    .catch((e: Error) => {
      console.log(e)
      throw e
    })

  if (result.errors) {
    result.errors.forEach((error: TypeError) => {
      throw new TypeError(error.message)
    })
  }

  return createTotals(result.data.user.repositories.nodes)
}
