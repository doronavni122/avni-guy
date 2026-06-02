#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TASK_GRAPH_PATH = 'task_graph.log';
const VALIDATOR_SCRIPT_PATH = 'scripts/tools/validate-atomic-change-logging.cjs';
const TASK_LINE_REGEX = /^(\d+)\. ([a-z0-9]+(?:-[a-z0-9]+)*) , (.+)$/;

function run(command) {
  return execSync(command, { encoding: 'utf8' }).trim();
}

function fail(message) {
  process.stderr.write(`atomic-change-logging: ${message}\n`);
  process.exit(1);
}

function getLines(content) {
  return content
    .split('\n')
    .map((line) => line.trimEnd())
    .filter((line) => line.length > 0);
}

function parseTaskLine(taskLine) {
  const match = taskLine.match(TASK_LINE_REGEX);
  if (!match) {
    fail(
      `invalid task_graph.log line format: "${taskLine}". Expected: N. <task_id> , <files>`
    );
  }

  const number = Number(match[1]);
  const taskId = match[2];
  const files = match[3].split(' ').filter(Boolean);
  return { number, taskId, files };
}

function parseAddedRemovedFromPatch(patchText) {
  const lines = patchText.split('\n');
  const added = [];
  const removed = [];

  for (const line of lines) {
    if (line.startsWith('+++') || line.startsWith('---')) continue;
    if (line.startsWith('+')) added.push(line.slice(1));
    if (line.startsWith('-')) removed.push(line.slice(1));
  }

  return { added, removed };
}

function validateLineCoversFiles(filesFromLine, changedFiles) {
  if (!filesFromLine.includes(TASK_GRAPH_PATH)) {
    fail('task_graph entry files list must include task_graph.log');
  }

  for (const file of changedFiles) {
    if (file === TASK_GRAPH_PATH) continue;
    if (!filesFromLine.includes(file)) {
      fail(`task_graph entry missing changed file: ${file}`);
    }
  }
}

function validateStaged(commitMessage) {
  const stagedRaw = run('git diff --cached --name-only --diff-filter=ACMR');
  const stagedFiles = stagedRaw ? stagedRaw.split('\n').filter(Boolean) : [];
  const changedNonTask = stagedFiles.filter((f) => f !== TASK_GRAPH_PATH);

  if (changedNonTask.length === 0) {
    return;
  }

  if (!stagedFiles.includes(TASK_GRAPH_PATH)) {
    fail('staged code/config changes require staged task_graph.log append');
  }

  const patch = run(`git diff --cached --unified=0 -- "${TASK_GRAPH_PATH}"`);
  const { added, removed } = parseAddedRemovedFromPatch(patch);

  if (removed.length > 0) {
    fail('task_graph.log must be append-only; removals are not allowed');
  }
  if (added.length !== 1) {
    fail(
      `exactly one new task_graph.log line must be staged per atomic commit (found ${added.length})`
    );
  }

  let lastHeadLine = '';
  try {
    const headTaskGraph = run(`git show HEAD:${TASK_GRAPH_PATH}`);
    const lines = getLines(headTaskGraph);
    lastHeadLine = lines.length > 0 ? lines[lines.length - 1] : '';
  } catch {
    lastHeadLine = '';
  }
  let expectedNumber = 1;
  if (lastHeadLine) {
    const parsedLast = parseTaskLine(lastHeadLine);
    expectedNumber = parsedLast.number + 1;
  }

  const parsedAdded = parseTaskLine(added[0]);
  if (parsedAdded.number !== expectedNumber) {
    fail(
      `task_graph task number must be ${expectedNumber} but got ${parsedAdded.number}`
    );
  }

  validateLineCoversFiles(parsedAdded.files, stagedFiles);

  if (commitMessage && commitMessage !== parsedAdded.taskId) {
    fail(
      `commit message must equal task id "${parsedAdded.taskId}", got "${commitMessage}"`
    );
  }
}

function getCommitFiles(sha) {
  const files = run(`git diff-tree --no-commit-id --name-only -r ${sha}`);
  return files ? files.split('\n').filter(Boolean) : [];
}

function getCommitSubject(sha) {
  return run(`git log -1 --pretty=%s ${sha}`);
}

function getTaskGraphPatchForCommit(sha) {
  try {
    return run(`git show --unified=0 --format= ${sha} -- "${TASK_GRAPH_PATH}"`);
  } catch {
    return '';
  }
}

function validateCommitInRange(sha) {
  const files = getCommitFiles(sha);
  if (files.length === 0) return;

  const changedNonTask = files.filter((f) => f !== TASK_GRAPH_PATH);
  if (changedNonTask.length === 0) return;

  if (!files.includes(TASK_GRAPH_PATH)) {
    fail(`commit ${sha} changed code/config but did not include task_graph.log`);
  }

  const patch = getTaskGraphPatchForCommit(sha);
  const { added, removed } = parseAddedRemovedFromPatch(patch);

  if (removed.length > 0) {
    fail(`commit ${sha} modified existing task_graph lines; append-only required`);
  }
  if (added.length !== 1) {
    fail(
      `commit ${sha} must append exactly one task_graph line (found ${added.length})`
    );
  }

  const parsedAdded = parseTaskLine(added[0]);
  validateLineCoversFiles(parsedAdded.files, files);

  const subject = getCommitSubject(sha);
  if (subject !== parsedAdded.taskId) {
    fail(
      `commit ${sha} subject "${subject}" must match task id "${parsedAdded.taskId}"`
    );
  }
}

function splitRange(range) {
  if (range.includes('...')) {
    const [baseRef, headRef] = range.split('...');
    return { baseRef, headRef };
  }
  if (range.includes('..')) {
    const [baseRef, headRef] = range.split('..');
    return { baseRef, headRef };
  }
  return null;
}

function refHasValidatorScript(ref) {
  try {
    run(`git cat-file -e ${ref}:${VALIDATOR_SCRIPT_PATH}`);
    return true;
  } catch {
    return false;
  }
}

function validateRange(range) {
  const commitsRaw = run(`git rev-list --reverse ${range}`);
  const commits = commitsRaw ? commitsRaw.split('\n').filter(Boolean) : [];

  if (commits.length === 0) {
    return;
  }

  let commitsToValidate = commits;
  const parsedRange = splitRange(range);
  if (parsedRange && !refHasValidatorScript(parsedRange.baseRef)) {
    const introRaw = run(`git rev-list --reverse ${range} -- ${VALIDATOR_SCRIPT_PATH}`);
    const introCommits = introRaw ? introRaw.split('\n').filter(Boolean) : [];
    if (introCommits.length > 0) {
      const introSha = introCommits[0];
      const introIndex = commits.indexOf(introSha);
      if (introIndex >= 0) {
        commitsToValidate = commits.slice(introIndex);
        process.stdout.write(
          `atomic-change-logging: base ref ${parsedRange.baseRef} has no validator script; validating commits from ${introSha.slice(0, 7)} onward\n`
        );
      }
    } else {
      process.stdout.write(
        `atomic-change-logging: base ref ${parsedRange.baseRef} has no validator script and range has no validator introduction commit; skipping range validation\n`
      );
      return;
    }
  }

  for (const sha of commitsToValidate) {
    validateCommitInRange(sha);
  }
}

function getArg(flag) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return null;
  return process.argv[idx + 1] || null;
}

function main() {
  const modeRange = getArg('--range');
  const modeStaged = process.argv.includes('--staged');
  const commitMsgFile = getArg('--commit-msg-file');
  const commitMessage =
    commitMsgFile && fs.existsSync(commitMsgFile)
      ? getLines(fs.readFileSync(path.resolve(commitMsgFile), 'utf8'))[0] || ''
      : '';

  if (modeRange) {
    validateRange(modeRange);
    process.stdout.write('atomic-change-logging: range validation passed\n');
    return;
  }

  if (modeStaged || commitMsgFile) {
    validateStaged(commitMessage);
    process.stdout.write('atomic-change-logging: staged validation passed\n');
    return;
  }

  fail('usage: --staged OR --commit-msg-file <path> OR --range <git-range>');
}

main();
