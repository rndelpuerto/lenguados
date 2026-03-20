/**
 * Custom ESLint rule: enforce-tag-fragments
 *
 * Enforces that @param and @returns descriptions are sentence fragments:
 * 1. No trailing period on @param/@returns descriptions
 * 2. @param uses `name - Description` dash format
 *
 * Handles edge case: @param descriptions containing inline @defaultValue —
 * trailing period check stops before embedded tags.
 *
 * DOCUMENTATION_STANDARD.md Section 5.
 */

module.exports = {
 meta: {
  type: 'suggestion',
  docs: {
   description:
    'Enforce @param/@returns fragment conventions per DOCUMENTATION_STANDARD.md Section 5',
  },
  schema: [],
  messages: {
   trailingPeriodParam:
    '@param description should be a sentence fragment (no trailing period). Found: "{{text}}"',
   trailingPeriodReturns:
    '@returns description should be a sentence fragment (no trailing period). Found: "{{text}}"',
   missingParamDash:
    '@param should use dash format: @param {{name}} - Description. Found: "@param {{text}}"',
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
       if (tagMatch[1] === 'example') { inExample = true; continue; }
       if (inExample) inExample = false;
      } else if (inExample) { continue; }
      const trimmed = line.replace(/^\s*\*?\s*/, '').replace(/\s*$/, '');

      // Check @param format: @param name - Description
      const paramMatch = trimmed.match(/^@param\s+(?:\{[^}]*\}\s+)?(\S+)\s*(.*)/);
      if (paramMatch) {
       const name = paramMatch[1];
       const rest = paramMatch[2].trim();

       // Check dash format (only if there's a description)
       if (rest && !rest.startsWith('-')) {
        context.report({
         node: comment,
         messageId: 'missingParamDash',
         data: { name, text: `${name} ${rest}` },
        });
       }

       // Check trailing period on @param description
       if (rest) {
        // Get description after dash
        const desc = rest.startsWith('-') ? rest.slice(1).trim() : rest;
        if (desc) {
         // Strip embedded tags like {@link ...} or {@defaultValue ...} at end
         const descBeforeTags = desc.replace(/\s*\{@\w+[^}]*\}\s*$/, '').trim();
         if (descBeforeTags && descBeforeTags.endsWith('.')) {
          context.report({
           node: comment,
           messageId: 'trailingPeriodParam',
           data: { text: desc },
          });
         }
        }
       }
       continue;
      }

      // Check @returns trailing period
      const returnsMatch = trimmed.match(/^@returns?\s+(.*)/);
      if (returnsMatch) {
       const desc = returnsMatch[1].trim();
       if (desc) {
        // Strip embedded tags at end
        const descBeforeTags = desc.replace(/\s*\{@\w+[^}]*\}\s*$/, '').trim();
        if (descBeforeTags && descBeforeTags.endsWith('.')) {
         context.report({
          node: comment,
          messageId: 'trailingPeriodReturns',
          data: { text: desc },
         });
        }
       }
      }
     }
    }
   },
  };
 },
};
