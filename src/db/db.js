const htmlTemplate = 
`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`

const cssTemplate = `
/* Add your CSS styles here */

body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}
`;

const jsTemplate = `
// Add your JavaScript code here

document.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
});
`;

export const languages = [
    {lang:'html', template:htmlTemplate},
    {lang:'css', template:cssTemplate},
    {lang:'javascript', template:jsTemplate}
]