FROM --platform=linux/amd64 node:19.5.0-alpine AS builder 
WORKDIR /app
COPY /*.json ./
RUN npm install
COPY . .
RUN npm run build 

FROM --platform=linux/amd64 node:19.5.0-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]