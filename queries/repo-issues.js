module.exports = function repoIssues(owner, name, after) {
    // This form of templating is dangerous, but the user
    // running this should know better.
    return `
    {
        repository(owner: "${owner}", name: "${name}") {
            issues(first: 100${after ? ` after: "${after}"` : ""}) {
                edges {
                    cursor
                    node {
                        id
                        author {
                            avatarUrl
                            login
                        }
                        bodyHTML
                        closed
                        closedAt
                        createdAt
                        number
                        state
                        title
                        updatedAt
                        url
                        labels(first: 20) {
                            edges {
                                cursor
                                node {
                                    color
                                    description
                                    name
                                }
                            }
                        }
                        reactions(first: 100) {
                            edges {
                                cursor
                                node {
                                    content
                                    user {
                                        avatarUrl
                                        login
                                    }
                                }
                            }
                        }
                        body
                        bodyText
                        comments(first: 100) {
                            edges {
                                cursor
                                node {
                                    author {
                                        avatarUrl
                                        login
                                    }
                                    bodyHTML
                                    url
                                    createdAt
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    `;
}
