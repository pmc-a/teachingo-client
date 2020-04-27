# Teachingo Client 🧠

![Node.js CI](https://github.com/pmc-a/teachingo-client/workflows/Node.js%20CI/badge.svg)

React application that powers the UI for Teachingo - an online video conferencing platform specifically aimed for e-learning.

## Technology Stack

- [React](https://reactjs.org/) (v16.12.0)
- [create-react-app](https://github.com/facebook/create-react-app)
- [TypeScript](https://www.typescriptlang.org/)
- [Twilio SDK](https://www.npmjs.com/package/twilio) (v3.39.3)
- [Twilio Video SDK](https://www.npmjs.com/package/twilio-video) (v2.3.0)

## Roots

This application was based on the [twilio-video-app-react](https://github.com/twilio/twilio-video-app-react) application and has been customised. Please visit the repository for more details.

## Getting Started

### Pre-requirements

- [Node.js](https://nodejs.org/en/) (v12.16.2 or greater)
    - [npm](https://www.npmjs.com/) (v6.14.4 or greater) - this comes shipped with Node.js!

To get started, execute the following within your terminal of choice:

```bash
$ git clone https://github.com/pmc-a/teachingo-client.git
$ cd teachingo-client/
$ npm install
```

Before spinning the application, ensure that you have the [teachingo-api](https://github.com/pmc-a/teachingo-api) up and running first! Follow the README for details on how to get it running locally.

By default, whenever we start the teachingo-client locally, it will spin up the development server (from create-react-app) and set the `NODE_ENV` to `development`. Therefore, the application will send API requests to `http://localhost:8080`.

Finally, run:

```bash
$ npm start
```

And the service should spin up, and be accessible on `http://localhost:3000`.

## License

See the [LICENSE](LICENSE) file for details.
