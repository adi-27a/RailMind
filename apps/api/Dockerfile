FROM node:22-alpine AS build
WORKDIR /workspace
COPY package*.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json
RUN npm ci
COPY apps/api apps/api
COPY packages/contracts packages/contracts
RUN npm run build -w @railmind/contracts && npm run build -w @railmind/api
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --chown=node:node --from=build /workspace/apps/api/dist ./dist
COPY --chown=node:node --from=build /workspace/node_modules ./node_modules
COPY --chown=node:node --from=build /workspace/packages/contracts ./node_modules/@railmind/contracts
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
