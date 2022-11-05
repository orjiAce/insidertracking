# Insider Tracking




## Documentation

## Usage & instruction

After you must have cloned the Repo to your local machine follow the instructions below

To set up dev environment for this project `cd` to your project directory and enter the following command:
```
Yarn install
```
or
```
NPM install
```
First you must have Node installed in machine

```



Folder Structure Conventions
============================

> Folder and file structure options and naming conventions for Bluetanks software projects

### A typical top-level directory layout

    .
    ├── public                 # containing web assets and static files
    ├── src                    # Folder (Containing main web files and other folders)
    │   ├── actions            # Contains all api call functions
    │   ├── app                # Containing all redux store, slices and reducers
    │   ├── assets             # Here you willl find all assets images/logos of the app
    │   ├── components         # Here is where all reusable components 
    │   ├── guards             # This folder houses all authentication protected route
    │   ├── hooks              # Reusable functions
    │   ├── layouts            # This folder has all the layout component of the app (e.h header, footer, memus)
    │   ├── pages              # This folder holds all the web pages, the pages users will interact with 
    │   ├── sections           # This is also a folder like the layout folder that has many important sections of the app
    │   ├── utils              # This is where utility files and functions are stored
    │   ├── theme              # Everything about the app design and theme is found here
    │   ├── app.js             # First UI page of the app  
    │   ├── firebase.js        # Firebase admin configuration 
    │   ├── index.js           # Main app configurations and entry point
    │   └── routes.js          # All routes navigation/configuratrion of the app
    ├── assets                 # All assets, logo images, Fonts, and SVG used for this project
    ├── jsconfig.json          # Javascript configuration
    ├── package.json           # package.json has all libraries used in this app.
    ├── babel.config.js         # This configuration here is used to convert ECMAScript 2015+ code into a backwards compatible version of JavaScript
    ├── LICENSE.MD
    └── README.md

