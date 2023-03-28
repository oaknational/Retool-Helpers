module.exports = {
  branches: ["main"],
  plugins: [
    // Analyse commits.
    // https://github.com/semantic-release/commit-analyzer/#rules-definition
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [{ type: "chore", release: "patch" }],
      },
    ],
    // Create release notes.
    "@semantic-release/release-notes-generator",
    // Generate the Github release.
    // https://github.com/semantic-release/github

    "@semantic-release/github",
    "@semantic-release/npm",
  ],
};
