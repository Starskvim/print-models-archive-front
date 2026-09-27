FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY . .
# Env profile is baked into the bundle at build time: --build-arg ENV_FILE=.env.local
ARG ENV_FILE=.env.production
RUN yarn dotenv -e $ENV_FILE react-scripts build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# SPA fallback: client-side routes (/models/123) serve index.html
RUN printf 'server {\n  listen 80;\n  root /usr/share/nginx/html;\n  location / { try_files $uri /index.html; }\n}\n' \
    > /etc/nginx/conf.d/default.conf
EXPOSE 80
