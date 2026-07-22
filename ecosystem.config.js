module.exports = {
    apps: [
        {
            name: 'hibro-site',
            script: 'yarn',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 6002,
            },
        },
    ],
}