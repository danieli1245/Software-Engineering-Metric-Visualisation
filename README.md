# Software-Engineering-Metric-Visualisation
My implementation of extracting data from the GitHub API, and Visualising the data
## Installation
1. Have docker installed
2. Clone the repo, open command prompt in the cloned repo directory and enter:
`docker build -t github-local .`
`docker run -d -p 80:80 github-local`
3. The page should now be reachable at http://localhost/ in your browser

## Usage
1. To use the page, you will need to generate a Github personal access token which can be generated at: https://github.com/settings/tokens
2. After entering your token, you may enter any Github username to generate graphs
