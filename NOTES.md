1. Required Tools (i.e. Node / NPM)
2. `npm init`, `npm i (-D) express`, setup express server, nodemon, nodemon --watch flag
3. (Optional) Babel 7 Setup, install babel devdeps, add .babelrc, change dev script to include `--exec babel-node`(https://hackernoon.com/using-babel-7-with-node-7e401bc28b04)
4. Adding Next, install deps (next, react, react-dom), create 'next' script (start), show pages dir, link, stateless / stateful components w/ Next, scoped styles
   Note: You'll need to add 'next/babel' to the presets array in .babelrc next can successfully compile
5. Integrate Next w/ Express, remove starting code in server/app.js, add app, handle, port, ROOT_URL, dev variables. Start up server, send data to client from server.get(/api/users) (w/ res.end, res.send, res.json), demo route params
   Note: Since the .next folder will be modified anytime we makes changes to our pages directory, we want to ignore .next when restarting the server with nodemon. We'll create a nodemon.json file instead of a flag to change this behavior
6. Post requests. utils folder, sendRequest, npm i isomorphic-unfetch, bring in dev, port, ROOT_URL variables from app.js. npm i body-parser to parse json data from request bodies. Console log the request data. Then use getInitialProps. Make a post request to the same route (i.e. /api/users) and show. Show that if we want data back from sendRequest, we can make getInitialProps an async function. Show that as the function suggests, the data that is returned from the static method is put on our props object and we can display it in the UI. Show at the end error for not providing an absolute url (using ROOT_URL)
7. Create MLab Database, connect app to Mlab with Mongoose, create variables.env file

Future Videos

12341234. Add withLayout file (in libs folder)
          Note: The higher-order component withLayout ensures that a page gets a Headercomponent and is server-side rendered on initial load. (https://medium.freecodecamp.org/how-to-integrate-mailchimp-in-a-javascript-web-app-2a889fb43f6f)
12341235. Add compression and helmet dependencies before deployment
12341236. Before deployment, create a now.json file. You don't have to change your variables.env file

```
{
    "env": {
        "NODE_ENV": "production"
    },
    "alias": "something.now.sh"
}
```
