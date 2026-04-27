FROM node:24.12.0-trixie-slim AS build

RUN apt-get update && \
    apt-get install -y --no-install-recommends openssl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY ./package*.json ./

RUN npm ci

RUN npx next telemetry disable

COPY prisma ./prisma
COPY tsconfig*.json ./
COPY next.config.ts ./
COPY public ./public
COPY scripts ./scripts
COPY src ./src

ARG DFW_GIT_HASH
ENV DFW_GIT_HASH=$DFW_GIT_HASH
ARG DFW_VERSION_ARG
ENV DFW_VERSION_ARG=$DFW_VERSION_ARG

RUN --mount=type=secret,id=database_url \
    DATABASE_URL=$(cat /run/secrets/database_url) \
    npx prisma generate

RUN npm run build

# Compile cron script
# Make sure tsconfig.cron.json exists in project root
RUN npx tsc -p tsconfig.cron.json

RUN npm prune --omit=dev

FROM node:24.12.0-trixie-slim AS runtime

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        cron openssl ca-certificates && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
COPY --from=build /app/next.config.ts ./

ENV FRONTEND_URL=https://dev.TODO.com/
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Create cron log file
RUN touch /var/log/cron.log

# Add cron job
COPY docker/nextjs-cron /etc/cron.d/nextjs-cron

# Set permissions
RUN chmod 0644 /etc/cron.d/nextjs-cron

# Apply cron job
RUN crontab /etc/cron.d/nextjs-cron

COPY docker/start.sh /app/start.sh

RUN chmod +x /app/start.sh

RUN useradd -m nodeuser

RUN chown -R nodeuser:nodeuser /app

# Start cron in background and then start Next.js server
ENTRYPOINT ["/app/start.sh"]

