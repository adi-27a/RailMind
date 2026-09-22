# Debian/glibc builder avoids Alpine musl Rollup binary resolution issues.
FROM node:22-bookworm-slim AS build
WORKDIR /workspace
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY packages/contracts/package.json packages/contracts/package.json
# Install only from the lockfile inside Linux and retain platform optional packages required by Rollup.
RUN npm ci --include=optional
COPY apps/web apps/web
COPY packages/contracts packages/contracts
RUN npm run build -w @railmind/contracts && npm run build -w @railmind/web

FROM nginx:1.27-alpine
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web/dist /usr/share/nginx/html
EXPOSE 80
