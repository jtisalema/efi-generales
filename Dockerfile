FROM eclipse-temurin:11.0.12_7-jdk
LABEL maintainer=dacopan@jedai.group
COPY ./build/libs/*.jar /home/app.jar
EXPOSE 8080
CMD java -server -Duser.country=EC -Duser.language=es -Duser.timezone=America/Guayaquil -Djava.security.egd=file:/dev/urandom -jar /home/app.jar