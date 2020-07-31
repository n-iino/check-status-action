import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    if (!process.env.GITHUB_REPOSITORY) {
      throw new Error('GITHUB_REPOSITORY is not found.')
    }

    if (!process.env.GITHUB_SHA) {
      throw new Error('GITHUB_SHA is not found.')
    }

    const gitHubToken = core.getInput('github-token')
    const name = core.getInput('name')
    const status = core.getInput('status') as
      | 'queued'
      | 'in_progress'
      | 'completed'
    const conclusion = core.getInput('conclusion') as
      | 'success'
      | 'failure'
      | 'neutral'
      | 'cancelled'
      | 'skipped'
      | 'timed_out'
      | 'action_required'
    const runTitle = core.getInput('run-title') || name
    const summary = core.getInput('summary') || ''
    const detailsUrl =
      core.getInput('details-url') ||
      `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

    const [
      gitHubRepoOwner,
      gitHubRepoName
    ] = process.env.GITHUB_REPOSITORY.split('/')
    const gitHubSha = core.getInput('head-sha') || process.env.GITHUB_SHA
    const octokit = github.getOctokit(gitHubToken)

    octokit.checks.create({
      owner: gitHubRepoOwner,
      repo: gitHubRepoName,
      name,
      head_sha: gitHubSha,
      status,
      conclusion,
      details_url: detailsUrl,
      output: {
        title: runTitle,
        summary
      }
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
