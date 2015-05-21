# EcoLearnia Studio

## EcoLearnia

### About EcoLearnia - The Big Picture
EcoLearnia is an open source learning platform that enables ecosystem of 
learning content production and consumption.

The consumers are people or entities that use the contents or their derivatives 
directly or indirectly:
- Learners (aka. students): those who use the system to learn a particular 
skill.
- Educators: those who use the system to teach skills. These users would
usually organizing contents and assign them to learners, also consume the 
by products of the contents, such as the assessment results.
- Educational Institutions: second-tier providers of the content. Examples:
Schools, Libraries, Museums, Academic institutions, etc.
- Learning Scientists: those who use the system to analyse the assessment 
results data together with the associated content. These users may use the 
data to answer questions such as: how does the content affect the cognitive
process? What factors involves in learning? How can the efficacy be improved?

The producers are people or entities that creates content either private for 
closed group usage, or open (i.e. free license) for general consumption:
- Educators: educators are empowered with authoring tool so they can author
original learning content, or modify existing one.
- App/Game Developers: developers can use the platforms libraries and APIs 
to produce apps that is deployed on top of the platform. Game is a good 
example of such app.
The contents produced with open license are curated/moderated guarantee certain
level of quality.

EcoLearnia Platform is provided under the licence as specified in the 
LICENSE file in the root directory.

### EcoLearnia Components
EcoLearnia consists of:
- EcoLearnia Platform Server ([EL-PS](https://github.com/altenia/ecolearnia)): The main server running in the cloud. Provides 
services such as: account, content, course, assignment, game, data analytics, 
etc. The server should be up in order for other components to operate.
- EcoLearnia Interactives (EL-I): The JavaScript client library that provides UI objects 
(widgets) that renders the content and handles interactions.
- EcoLearnia Studio (EL-S): The web-based content production tool for users to
author contents. The preview uses the EL-I for rendering the UI objects.

*NOTE:* Currently The EL-I and EL-S are in the same repository. They will be eventually
separated into different repos.


## Installing EcoLearnia Studio

The system is based on nodejs and [hapi framework](http://hapijs.com/).

### Pre-requisites
- Have an instance of EL-S running, accessible through network (could be local).
- Have nodejs installed. Recommended version is 0.12.x
- Have git client installed.


### Downloading and building

The easiest way to install the EL-S is to clone the repository from github

`git clone https://github.com/altenia/ecolearnia-studio.git`

Once cloned, go the ecolearnia-studio directory and install the dependencies

`npm install`

Then build the EL-I

`npm run build-inter`

And finally build the EL-S

`npm run build-client`


## Configuring the Server

The server configuration file is `config/ecolearnia-studio.conf.json`.

    {
        "port": 8080,
    
        "cohevium": {
          "publicPath": "public",
          "contentBaseDir": "cohevium-content"
        },
    
        "log": {
            "level": "debug",
        }
    }

*NOTE:* EL-S uses Cohevium, an lightweight CMS packaged in form of hapi plugin.


## Running the Server

To run in normal mode:
`node el-studio.js`

To run in debug mode:
`node --debug el-studio.js`

See the reference below, development link, for further detail on running in debug mode.

## Directory Structure

- `artifacts`: Includes documentation and other non-source-code artifacts
- `client`: Client-side source code
- `cohevium-content`: Includes HTML pages for the authoring tool
- `config`: Contains the configuration file
- `node_modules`: nodejs' packages
- `public`: Web server's public folder. It contains public assets such as css.
- `el-studio.js`: The main execution script 
- `LICENSE`: The license of this software


## Development

For development of the interactives and extending the tool, please see the 
references below.


## Basic User Guide

The initial page includes the main navigation. The user can search and browse
content nodes and items. Selecting a node or item will open up the the 
editing page.


## References

- EcoLearnia server [repository](https://github.com/altenia/ecolearnia)
- EcoLearnia content doc [repository](https://github.com/altenia/ecolearnia)
- Interactives development: [interactives-dev](./artifacts/docs/interctives-dev.md)
- Studio development: [interactives-dev](./artifacts/docs/studio-dev.md)
