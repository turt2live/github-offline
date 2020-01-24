const {graphql} = require("@octokit/graphql");
const repoIssues = require("./queries/repo-issues");
const repoPrs = require("./queries/repo-prs");
const auth = require("./auth.json");
const {Liquid} = require("liquidjs");
const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");

(async function() {
    const args = process.argv;
    const orgName = args[2];
    const repoName = args[3];

    const issues = [];
    const prs = [];
    if (fs.existsSync("tmp.json")) {
        const data = JSON.parse(fs.readFileSync("tmp.json"));
        issues.push(...data['issues']);
        prs.push(...data['prs']);
    } else {
        let lastId = null;
        while (true) {
            console.log(`Getting issues starting at ${lastId}`);
            const {repository} = await graphql(repoIssues(orgName, repoName, lastId), {
                headers: {
                    authorization: `token ${auth.token}`,
                },
            });
            const nodes = repository['issues']['edges'];
            issues.push(...(nodes.map(e => e['node'])));
            if (nodes.length === 0) break;
            lastId = nodes[nodes.length - 1]['cursor'];
        }

        lastId = null;
        while (true) {
            console.log(`Getting prs starting at ${lastId}`);
            const {repository} = await graphql(repoPrs(orgName, repoName, lastId), {
                headers: {
                    authorization: `token ${auth.token}`,
                },
            });
            const nodes = repository['pullRequests']['edges'];
            prs.push(...(nodes.map(e => e['node'])));
            if (nodes.length === 0) break;
            lastId = nodes[nodes.length - 1]['cursor'];
        }
    }

    fs.writeFileSync("tmp.json", JSON.stringify({issues, prs}));

    function polyfillAuthor(author) {
        if (!author) {
            return {
                avatarUrl: "./ghost.png",
                login: "ghost",
            };
        } else return author;
    }

    const engine = new Liquid({root: './templates'});
    const outDir = path.join("html", orgName, repoName);
    mkdirp.sync(outDir);
    for (const issue of [...issues, ...prs]) {
        console.log(`Rendering ${issue['number']}.html`);
        const result = await engine.renderFile("issue.liquid", {
            number: issue['number'],
            title: issue['title'],
            state: issue['state'],
            comments: [
                {
                    authorAvatarUrl: polyfillAuthor(issue['author'])['avatarUrl'],
                    authorName: polyfillAuthor(issue['author'])['login'],
                    createDate: issue['createdAt'],
                    html: issue['bodyHTML'],
                },
                ...(issue['comments']['edges'].map(c => ({
                    authorAvatarUrl: polyfillAuthor(c['node']['author'])['avatarUrl'],
                    authorName: polyfillAuthor(c['node']['author'])['login'],
                    createDate: c['node']['createdAt'],
                    html: c['node']['bodyHTML'],
                }))),
            ],
        });
        fs.writeFileSync(path.join(outDir, `${issue['number']}.html`), result);
    }

    console.log("Rendering index.html");
    const result = await engine.renderFile("index.liquid", {
        orgName,
        repoName,
        issues,
        prs,
    });
    fs.writeFileSync(path.join(outDir, `index.html`), result);

    const states = ['MERGED', 'CLOSED', 'OPEN'];
    for (const state of states) {
        console.log(`Rendering ${state}.html`);
        const result = await engine.renderFile("index.liquid", {
            orgName,
            repoName,
            issues: issues.filter(i => i.state === state),
            prs: prs.filter(p => p.state === state),
        });
        fs.writeFileSync(path.join(outDir, `${state}.html`), result);
    }

    console.log("Done!");
})();
