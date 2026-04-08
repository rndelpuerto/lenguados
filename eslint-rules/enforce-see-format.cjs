/**
 * Custom ESLint rule: enforce-see-format
 *
 * Validates that @see tags follow the {@link Target} pattern,
 * optionally followed by ` - description` or ` — description`.
 * Plain text @see tags without {@link} are warned.
 *
 * DOCUMENTATION_STANDARD.md Section 5.
 */

module.exports = {
 meta: {
  type: 'suggestion',
  docs: {
   description:
    'Enforce that @see tags use {@link Target} format per DOCUMENTATION_STANDARD.md Section 5',
  },
  schema: [],
  messages: {
   missingSeeLink:
    '@see tag must use {@link Target} format. Found plain text: "{{text}}". See DOCUMENTATION_STANDARD.md Section 5.',
  },
 },
 create(context) {
  return {
   'Program:exit'() {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const comments = sourceCode.getAllComments();

    for (const comment of comments) {
     if (comment.type !== 'Block' || comment.value.charAt(0) !== '*') continue;

     const lines = comment.value.split('\n');
     let inExample = false;
     for (const line of lines) {
      const tagMatch = line.match(/^\s*\*?\s*@(\w+)/);
      if (tagMatch) {
       if (tagMatch[1] === 'example') {
        inExample = true;
        continue;
       }
       if (inExample) inExample = false;
      } else if (inExample) {
       continue;
      }
      const match = line.match(/^\s*\*?\s*@see\s+(.+?)(\s*\*\/|\s*$)/);
      if (!match) continue;

      const content = match[1].replace(/\s*\*?\s*$/, '').trim();
      if (!content) continue;

      // Check that the @see content contains {@link ...}
      if (!content.includes('{@link')) {
       context.report({
        node: comment,
        messageId: 'missingSeeLink',
        data: { text: content },
       });
      }
     }
    }
   },
  };
 },
};
