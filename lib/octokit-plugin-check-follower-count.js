module.exports = { checkFollowerCount };

const { updateFollowerCount } = require("./updateFollowers");
const {
  composeCreateOrUpdateTextFile,
} = require("@octokit/plugin-create-or-update-text-file");

const owner = "bdougie";
const repo = "bdougie";

/**
 * @param {import("octokit").Octokit} octokit
 */
function checkFollowerCount(octokit) {
  return {
    async checkFollowerCount() {
      try {
        // fetch followers
        const count = await octokit.request('GET /users/bdougie');

        // try to update the README directly.
        await composeCreateOrUpdateTextFile(octokit, {
          owner,
          repo,
          path: "README.md",
          message: "Followers updated",
          content: ({ content }) => {
            return updateFollowerCount(content, count.data.followers);
          },
        });

        console.log(`followers updated.`);
      } catch (error) {
        // if it fails, try to create an issue
        const { data: issue } = await octokit
         .request("POST /repos/{owner}/{repo}/issues", {
            owner,
            repo,
            title: "plz to update",
            body: "This didn't work directly, so here's an issue.",
          })
          .catch((err) => {
            console.log(err);
          });

        console.log(`issue created at ${issue.html_url}`);
      }
    },
  };
}
