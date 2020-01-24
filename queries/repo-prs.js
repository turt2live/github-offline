module.exports = function repoPrs(owner, name, after) {
    // This form of templating is dangerous, but the user
    // running this should know better.
    return `
    {
        repository(owner: "${owner}", name: "${name}") {
            pullRequests(first: 100${after ? ` after: "${after}"` : ""}) {
                edges {
                    cursor
                    node {
                        id
                        author {
                            avatarUrl
                            login
                        }
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
                        bodyHTML
                        closed
                        closedAt
                        createdAt
                        number
                        state
                        title
                        updatedAt
                        url
                    }
                }
            }
        }
    }
    `;
}
