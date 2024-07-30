# Build Stage
FROM node:20 as builder
WORKDIR /app
COPY package*.json ./   
COPY tsconfig.json ./         
RUN npm i
COPY . .
RUN npm run build

# Generate prisma client
# RUN npx prisma generate
# RUN npx prisma migrate dev
# RUN npx prisma db seed 

# Run Stage
FROM node:20
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

## TODO: install essential dependencies
COPY --from=builder /app/node_modules /app/node_modules

COPY --from=builder /app/dist /app/dist
EXPOSE 3010


ENTRYPOINT ["npm", "run", "start"]