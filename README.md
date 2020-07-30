# github-language-usage

Search for all the languages ​​used by a given github user and returns the average values ​​in
percentages. Package is written in Typescript.

## How it works

- This package uses [GitHub GraphQL API](https://docs.github.com/en/graphql) to fetch the neccessary
  data.
- It will search for all the languages ​​used by a given github user and then calculate how the
  ratio is in percentages.
- Depending on the token read permissions it will search in the public and private repositories of
  the given user.

## Installation

npm:

```bash
npm i github-language-usage
```

or yarn:

```bash
yarn add github-language-usage
```

## Usage

You'll need an Github OAuth token with the
[repo scope](https://docs.github.com/en/developers/apps/scopes-for-oauth-apps).

In Javascript:

```javascript
import { githubLanguageUsage } from 'github-language-usage'

async function asyncCall() {
  const result = await githubLanguageUsage('<YOUR_TOKEN>', '<GITHUB_USER_NAME>')

  console.log(result)
  //=> [ { name: 'HTML', color: '#e34c26', percentage: 70}, {...} ]
}

asyncCall()
```

## API

```
githubLanguageUsage(token, user, [repos])

token (string): Your Github OAuth token

user (string): The Github user name

repos (number): This is optional. It will search within the first _n_ elements from the
repositories. The default is 100
```

## Realworld example

I personally use it to showcase my github language usage on my personal website:

![](https://images2.imgbox.com/1f/c3/V8E4upe0_o.png)
