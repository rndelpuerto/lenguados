/** Stylelint config — CommonJS is required until cosmiconfig is ESM‑safe. */
module.exports = {
 extends: ['stylelint-config-standard', 'stylelint-prettier'],
 plugins: ['stylelint-order'],
 rules: {
  /* Keep declarations alphabetised (industry best practice) */
  'order/properties-alphabetical-order': true,
 },
 ignoreFiles: [
  // Ignore compiled bundles
  '**/packages/**/lib/**',
 ],
};
