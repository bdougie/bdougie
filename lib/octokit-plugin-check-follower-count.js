module.exports = { updateFollowerCount };

const { checkFollowerCount } = require("./checkFollowers");
const {
  composeCreateOrUpdateTextFile,
} = require("@octokit/plugin-create-or-update-text-file");

const owner = "bdougie";
const repo = "bdougie";

/**
 * @param {import("octokit").Octokit} octokit
 */
function updateFollowerCount(octokit) {
  return {
    async updateFollowerCount() {
      try {
        // try to update the README directly.
        await composeCreateOrUpdateTextFile(octokit, {
          owner,
          repo,
          path: "README.md",
          message: "BOOP",
          content: ({ content }) => {
            return bumpBoopCounter(content);
          },
        });

        console.log(`you done been booped`);
      } catch (error) {
        // if it fails, try to create an issue
        const { data: issue } = await octokit
          .request("POST /repos/{owner}/{repo}/issues", {
            owner,
            repo,
            title: "plz to boop",
            body: "I bestow upon you my finest of boops",
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(`issue created at ${issue.html_url}`);
      }
    },
  };
}
