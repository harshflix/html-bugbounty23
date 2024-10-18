document.getElementById('validateButton').addEventListener('click', function() {
    const htmlInput = document.getElementById('htmlInput').value;
    const output = document.getElementById('output');

    // Function to check for unclosed tags
    function checkForUnclosedTags(html) {
        const tagStack = [];
        const errors = [];

        // Regex to match opening and closing tags
        const tagRegex = /<\/?([a-zA-Z]+)[^>]*>/g;
        let match;

        while ((match = tagRegex.exec(html)) !== null) {
            const tagName = match[1].toLowerCase();

            // If it's a closing tag
            if (match[0][1] === '/') {
                if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
                    errors.push(`Mismatched closing tag: </${tagName}>.`);
                } else {
                    tagStack.pop(); // Correctly closed, so pop the stack
                }
            } else {
                // Ignore self-closing tags like <br /> or <img />
                if (!match[0].endsWith('/>')) {
                    tagStack.push(tagName); // Add opening tag to stack
                }
            }
        }

        // Any remaining tags in the stack are unclosed
        if (tagStack.length > 0) {
            errors.push(`Unclosed tag: <${tagStack.pop()}>.`);
        }

        return errors;
    }

    // Function to check for missing required tags
    function checkForRequiredTags(html) {
        const requiredTags = ['html', 'head', 'title', 'body'];
        const errors = [];

        requiredTags.forEach(tag => {
            if (!html.includes(`<${tag}`) && !html.includes(`</${tag}>`)) {
                errors.push(`Missing required tag: <${tag}>.`);
            }
        });

        return errors;
    }

    // Function to check for duplicate IDs
    function checkForDuplicateIds(html) {
        const idRegex = /id="([^"]+)"/g;
        const ids = new Set();
        const errors = [];
        let match;

        while ((match = idRegex.exec(html)) !== null) {
            const idValue = match[1];
            if (ids.has(idValue)) {
                errors.push(`Duplicate ID found: "${idValue}".`);
            } else {
                ids.add(idValue);
            }
        }

        return errors;
    }

    // Function to check for deprecated tags
    function checkForDeprecatedTags(html) {
        const deprecatedTags = ['font', 'center', 'marquee'];
        const errors = [];

        deprecatedTags.forEach(tag => {
            const regex = new RegExp(`<${tag}\\b`, 'i');
            if (regex.test(html)) {
                errors.push(`Deprecated tag found: <${tag}>.`);
            }
        });

        return errors;
    }

    // Function to check for self-closing tags
    function checkForSelfClosingTags(html) {
        const selfClosingTags = ['img', 'br', 'input', 'hr'];
        const errors = [];

        selfClosingTags.forEach(tag => {
            const regex = new RegExp(`<${tag}(?!\\s*\\/>)`, 'gi');
            if (regex.test(html)) {
                errors.push(`Self-closing tag <${tag}> is not properly closed.`);
            }
        });

        return errors;
    }

    // Run all checks
    let errors = [];
    errors = errors.concat(checkForUnclosedTags(htmlInput));
    errors = errors.concat(checkForRequiredTags(htmlInput));
    errors = errors.concat(checkForDuplicateIds(htmlInput));
    errors = errors.concat(checkForDeprecatedTags(htmlInput));
    errors = errors.concat(checkForSelfClosingTags(htmlInput));

    // Display results
    if (errors.length > 0) {
        output.textContent = errors.join('\n');
    } else {
        output.textContent = 'No errors found! Your HTML is valid.';
    }
});
