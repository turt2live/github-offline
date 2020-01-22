module.exports = function repoInfoQuery(owner, name) {
    // This form of templating is dangerous, but the user 
    // running this should know better.
    return `
    {
        repository(owner: "${owner}", name: "${name}") {
            issues(first: 1) {
                edges {
                    node {
                        TODO
                    }
                }
            }
        }
    }
    `;
}
