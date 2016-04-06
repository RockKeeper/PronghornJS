var sanitizeHtml = require('sanitize-html');
var SystemConfig = {

    /**
     * MySQL
     */
    mysql: {
        // MySQL Host
        host: "localhost",
        // MySQL User
        user: "",
        // MySQL Password
        pass: "",
        // MySQL DB-Name
        name: "",
        // MySQL Port
        port: "3306"
    },

    /**
     * MongoDB
     */
    mongodb: {
        // MongoDB Host
        host: "localhost",
        // MongoDB User
        user: "",
        // MongoDB Password
        pass: "",
        // MongoDB DB-Name
        name: "",
        // MongoDB Port
        port: ""
    },
    /**
     * redis store
     */
    redis: {
        // redis Host
        host: "localhost",
        // redis User
        pass: "",
        // redis DB-Name
        name: "",
        // MongoDB Port
        port: "6379"
    },

    /**
     * Common
     */
    app: {
        name: "application name",
        // Used theme
        theme: "default",
        url: {
            app_url: "http://localhost:3000"
        },
        languages: ["de", "en"],
        fallback_language: "de",
        // Used Port
        port: "3000",
        // Salt
        secret: "Och9cagei]y1uuk1aingeebi8thethoo",
        // laravel secret
        larevel_secret: "",
        //path to openssl
        openssl: "",
        //path to ssh key (id_rsa)
        rsakey: ""
    }


};

module.exports = SystemConfig;