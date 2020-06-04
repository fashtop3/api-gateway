module.exports = {
  apps: [{
    name: "apigateway",
    script: "./src",
    watch: ["./src", "./src/data/"],
    watch_options: {
      followSymlinks: false,
      persistent: true,
      ignoreInitial: true,
      usePolling: true,
    },
    watch_delay: 1,
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
      "NODE_ENV": "production"
    }
  }]
}