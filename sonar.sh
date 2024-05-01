#!/usr/bin/bash

function web() {
    cd web && npm run sonarqube && cd ..
}

function server() {
    ./gradlew sonarqube \
      -Dsonar.projectName=segusuarez-efi-gen-server \
      -Dsonar.projectKey=segusuarez-efi-gen-server \
      -Dsonar.host.url=http://51.158.62.38:9000 \
      -Dsonar.login=sqp_c3700bb46d4f5211fdce7385728edb5d63faf278
}

if [[ $1 == "web" ]]; then
    echo "<-----------      S U B I E N D O   P R O Y E C T O    W E B     ----------->"
    web
elif [[ $1 == "server" ]]; then
    echo "<-----------    S U B I E N D O   P R O Y E C T O    S E R V E R   ----------->"
    server
elif [[ $1 == "all" ]]; then
    web
    server
else
    echo
    echo "Uso: sonar.sh {server, web, all}"
    exit 1
fi
