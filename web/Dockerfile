FROM nginx:1.21.3-alpine
LABEL maintainer=dacopan@jedai.group

COPY ./build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
