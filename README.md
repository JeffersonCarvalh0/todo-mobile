# todo-mobile
Mobile version of the todo app


## Installation
`yarn add`

## Running the app
`yarn start` to start the bundler, and then `yarn android` in another tab to install the app in the emulator.
If it cannot connect to the local backend server, update your local ip address in `/src/api.ts`.

## Setting up the server
To set up a local development server, follow these [instructions](https://github.com/JeffersonCarvalh0/todo-app/tree/master/packages/server). To connect directly to the production server, use the production api in the `/src/api.ts` file. 
