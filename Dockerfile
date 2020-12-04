FROM node:lts-alpine

RUN apk add --no-cache 'su-exec>=0.2' bash

ENV INSTALL_DIR /opt/app
ARG PORT
ENV PORT "$PORT"

WORKDIR $INSTALL_DIR

COPY . $INSTALL_DIR
RUN set -eux; \
	chown node:node "$INSTALL_DIR"; \
	cd "$INSTALL_DIR"; \
	su-exec node yarn --production;

EXPOSE $PORT

CMD ["node", "index.js"]
