1. Required Tools (i.e. Node / NPM)
2. `npm init`, `npm i (-D) express`, setup express server, nodemon, nodemon --watch flag
3. (Optional) Babel 7 Setup, install babel devdeps, add .babelrc, change dev script to include `--exec babel-node`(https://hackernoon.com/using-babel-7-with-node-7e401bc28b04)
4. Adding Next, install deps (next, react, react-dom), create 'next' script (start), show pages dir, stateless / stateful components w/ Next, scoped styles
Note: You'll need to temporarily remove the .babelrc because it will conflict w/ Next's babelrc file
5. Integrate Next w/ Express

9. Add withLayout file (in libs folder)
Note: The higher-order component withLayout ensures that a page gets a Headercomponent and is server-side rendered on initial load. (https://medium.freecodecamp.org/how-to-integrate-mailchimp-in-a-javascript-web-app-2a889fb43f6f)