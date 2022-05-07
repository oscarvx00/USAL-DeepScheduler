FROM nginx
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=golang:1.13-alpine /usr/local/go/ /usr/local/go/
ENV PATH="/usr/local/go/bin:${PATH}"
