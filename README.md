# github-language-usage

Search for all the languages ​​used by a given github user and returns the values ​​in percentages.
Package is written in Typescript.

## Installation

Via npm:

```bash
npm i github-language-usage
```

## API

githubLanguageUsage(token, user, [repos])

token (string): The OAuth token

user (string): The Github user name

repos (number): Returns the first _n_ elements from the repositories. The default is 100

## Usage

You'll need an Github OAuth token with the
[repo scope](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps).

In Javascript:

```javascript
const githubLanguageUsage = require('github-language-usage')
// Or ES6: import { githubLanguageUsage } from 'github-language-usage'

async function asyncCall() {
  const result = await githubLanguageUsage('<YOUR_TOKEN>', '<GITHUB_USER_NAME>')

  console.log(result)
  //=> [ { name: 'HTML', color: '#f15501', percentage: 70}, {...} ]
}

asyncCall()
```
