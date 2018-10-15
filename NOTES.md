1. Required Tools (i.e. Node / NPM)
   Note: We will start this project from scratch, but tell users that they can always find the package.json file with all the deps and versions that I used in my github page (in order to resolve any problems with versioning)
2. `npm init`, `npm i (-D) express`, setup express server, nodemon, nodemon --watch flag
3. (Optional) Babel 7 Setup, install babel devdeps, add .babelrc, change dev script to include `--exec babel-node`(https://hackernoon.com/using-babel-7-with-node-7e401bc28b04)
4. Adding Next, install deps (next, react, react-dom), create 'next' script (start), show pages dir, link, stateless / stateful components w/ Next, scoped styles
   Note: You'll need to add 'next/babel' to the presets array in .babelrc next can successfully compile
5. Integrate Next w/ Express, remove starting code in server/app.js, add app, handle, port, ROOT_URL, dev variables. Start up server, send data to client from server.get(/api/users) (w/ res.end, res.send, res.json), demo route params
   Note: Since the .next folder will be modified anytime we makes changes to our pages directory, we want to ignore .next when restarting the server with nodemon. We'll create a nodemon.json file instead of a flag to change this behavior
6. Post requests. li folder, sendRequest, npm i isomorphic-unfetch, bring in dev, port, ROOT_URL variables from app.js. npm i body-parser to parse json data from request bodies. Console log the request data. Then use (getInitialProps)[https://medium.com/@tilomitra/building-server-rendered-react-apps-with-nextjs-40313e978cb4]. Make a post request to the same route (i.e. /api/users) and show. Show that if we want data back from sendRequest, we can make getInitialProps an async function. Show that as the function suggests, the data that is returned from the static method is put on our props object and we can display it in the UI. Show at the end error for not providing an absolute url (using ROOT_URL)
7. Create MLab Database, connect app to Mlab with Mongoose, create variables.env file
8. Create models folder and User Model
9. Remove any post routes in app.js (and any requests made from the client), create routes folder and userRoutes, create controllers folder and userController
10. Create authRoutes, create authController
11. Test out API w/ postman or restlet client (Chrome extension), maybe add morgan for some useful logging upon request (skip static files such as webpack files served from the .next folder)
    Note: After testing the API, make sure to add CORS to prevent cross origin requests
12. Add Material UI, create \_app, \_document (https://nextjs.org/docs/#custom-document), and getPageContext to SSR MUI
13. Add Components Folder, add and style Header component
14. Create signup, signin, and profile pages
15. (Option 1) Add loading bar in \_app.js page using Next Router (maybe add [Google Analytics too](https://github.com/builderbook/builderbook/blob/415ad89cc3dc6b6d8760085cb25ecebe4a85d0a6/boilerplate/lib/gtag.js)) and add CDN to nprogress min css to \_document (https://unpkg.com/nprogress@0.2.0/nprogress.css)
16. (Option 2) Add loading bar in \_app.js using the package [next-nprogress](https://www.npmjs.com/package/next-nprogress)
17. Create EditProfile page, create (dynamic routing with Express)[https://medium.com/@diamondgfx/nextjs-lessons-learned-part-2-f1781237cf5c]
18. For the default image of the avatar for our users, we'll create a static folder in the root of our project w/ the default image we want as the default avatar. Then we'll use the babel plugin `babel-plugin-import-static-files` and then add this plugins array to .babelrc:

```
  "plugins": ["import-static-files"]
```

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
  "dotenv": "variables.env",
  "scale": {
    "sfo1": {
      "min": 1,
      "max": 5
    }
  },
    "alias": "something.now.sh"
}
```

Note: You can also cover the ability to remove deployments with the `now rm` command

1234123894. Upon deploying w/ now, add a build script (if you haven't already): `"build": "next build"`

1234123895. Before deploy, make sure to go to the separate pages and create a Head (from 'next/head') or put one in the Header component [Learn more here](https://medium.com/@tilomitra/building-server-rendered-react-apps-with-nextjs-40313e978cb4):

```
<Head>
  <title>Index page</title>
  <meta name="description" content="description for indexing bots" />
</Head>
```
