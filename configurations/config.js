module.exports = function({ environment }) {
    const config = {
        development: {
            cookieName: "team-placeholder",
            webToken: "web-token-42",
            sessionSecret: 'secret-session',
            connectionString: 'mongodb://placeholder:placeh0lder@ds056549.mlab.com:56549/planitdb', //'mongodb://localhost:27017/placeholder',
            port: 3000,
        },
        production: {
            cookieName: process.env.COOKIE_NAME,
            webToken: process.env.WEB_TOKEN,
            sessionSecret: process.env.SESSION_SECRET,
            connectionString: process.env.CONNECTION_STRING,
            port: process.env.PORT
        }
    };

    return config[environment];
};