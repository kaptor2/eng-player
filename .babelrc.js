module.exports = {
  plugins: [
    [
      "@stylexjs/babel-plugin",
      {
        dev: true,
        test: false,
        runtimeInjection: false,
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: "commonJS",
        },
      },
    ],
  ],
};