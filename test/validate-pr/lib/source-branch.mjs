// source-branch: a PR into master comes from dev only (D83 addendum).

/** @returns {string[]} the problems */
export const check = ({ baseRef, headRef }) =>
  baseRef === 'master' && headRef !== 'dev'
    ? [`a PR into master comes from dev only (this PR comes from ${headRef})`]
    : [];
