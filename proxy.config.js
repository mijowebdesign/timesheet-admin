
const PROXY_CONFIG = [
  {
    context: [
      "/user/**",
      "/api/**",
    ],
    target: "http://localhost:9213",
    //target: "9213",
    secure: false,
    // logLevel: "debug"
  },
  {
    context: [
      "/upl/**",
    ],
    target: "http://localhost:8888",
    secure: false,
    // logLevel: "debug"
  },
];

module.exports = PROXY_CONFIG;
