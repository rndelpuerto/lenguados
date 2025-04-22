/** Husky hooks configuration
 *  – pre‑commit  → lint‑staged  (ESLint + Stylelint + Prettier fixes)
 *  – pre‑push    → run Jest suite before pushing to remote
 */
export default {
 hooks: {
  'pre-commit': 'lint-staged',
  'pre-push': 'npm test',
 },
};
