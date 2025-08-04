// babel.config.js
module.exports = function (api) {
  api.cache(true);
  
  // Determine which .env file to use based on NODE_ENV
  let envFile = ".env";
  if (process.env.NODE_ENV === "production") {
    envFile = ".env.production";
  }
  
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", 
          path: envFile, 
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
          },
        },
      ],
    ],
  };
};
