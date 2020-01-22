const {graphql} = require("@octokit/graphql");
const repoInfoQuery = require("./queries/repo-info");
const auth = require("./auth.json");

(async function() {
    const args = process.argv;
    const orgName = args[2];
    const repoName = args[3];

    const {repository} = await graphql(repoInfoQuery(orgName, repoName), {
        headers: {
            authorization: `token ${auth.token}`,
        },
    });
    console.log(JSON.stringify(repository));
})();