# NLP Sandbox PHI Deidentifier

[![GitHub Release](https://img.shields.io/github/release/nlpsandbox/phi-deidentifier-app.svg?include_prereleases&color=94398d&labelColor=555555&logoColor=ffffff&style=for-the-badge&logo=github)](https://github.com/nlpsandbox/phi-deidentifier-app/releases)
[![GitHub CI](https://img.shields.io/github/workflow/status/nlpsandbox/phi-deidentifier-app/ci.svg?color=94398d&labelColor=555555&logoColor=ffffff&style=for-the-badge&logo=github)](https://github.com/nlpsandbox/phi-deidentifier-app/actions)
[![GitHub License](https://img.shields.io/github/license/nlpsandbox/phi-deidentifier-app.svg?color=94398d&labelColor=555555&logoColor=ffffff&style=for-the-badge&logo=github)](https://github.com/nlpsandbox/phi-deidentifier-app/blob/main/LICENSE)
[![Docker Pulls](https://img.shields.io/docker/pulls/nlpsandbox/phi-deidentifier-app.svg?color=94398d&labelColor=555555&logoColor=ffffff&style=for-the-badge&label=pulls&logo=docker)](https://hub.docker.com/r/nlpsandbox/phi-deidentifier-app)
[![Discord](https://img.shields.io/discord/770484164393828373.svg?color=94398d&labelColor=555555&logoColor=ffffff&style=for-the-badge&label=Discord&logo=discord)](https://discord.gg/Zb4ymtF "Realtime support / chat with the community and the team")

React client for the NLP Sandbox PHI Deidentifier API

## Usage

## Running with Docker

Create the configuration file.

```console
cp .env.example .env
```

The command below starts the PHI de-identifier locally.

```console
docker-compose up
```

You can stop the stack with `Ctrl+C`. Add the option `-d` to the above command
to run the stack in detached mode. To stop a stack in detached mode, run
`docker-compose down` from this project folder.

The app should now be available on http://localhost.

## Development

The models and API hooks for the client are based on the phi-deidentifier
OpenAPI schema using
[openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator-cli).
To re-generate or update these models/hooks, first download the latest
version of the API specification, then run the generator script:

```bash
$ curl -O https://nlpsandbox.github.io/nlpsandbox-schemas/phi-deidentifier/edge/openapi.yaml
$ npx openapi-generator-cli generate -g typescript-fetch -i openapi.yaml -o client/src --additional-properties=typescriptThreePlus=true
```

The client can be run locally by navigating to the `client/` directory and running `npm start`. The client depends on
the de-identifier server being run in the background. Assuming that Node and Docker are installed, the following
commands can start up the full stack (back end & front end) for development/testing purposes using the following commands:

```bash
$ docker compose up --build
```
(you may have to run this command as root or prepend the command with `sudo`).

Then, in another shell, run the following:

```bash
$ cd client/
$ npm ci
$ SERVER_PORT=80 npm start
```

The development front end can be accessed at `http://localhost:3000`. The API calls currently require the browser to be
running with CORS enforcement disabled. This can be done with Google Chrome by, for example, running the following
command:

```bash
$ google-chrome --disable-web-security --user-data-dir=~/TEMP/
```
