#!/usr/bin/env bash
###################################  CONSTANTES  ###################################
DATE=$(date +%Y-%m-%d)
LINE="--------------------------------------------------------------------------"
export COMPOSE_PROJECT_NAME=prod
export VERSION_GENERALES="2.1.1"
export VERSION_GATEWAY="2.2"
export VERSION_VAM="2.2"

# COLORES
LBLUE="\033[1;34m"  #1
LGREEN="\033[1;32m" #2
LRED="\033[1;31m"   #3
LCYAN="\033[1;36m"  #4
NC="\033[0m"        #No Color

###################################  FUNCIONES  ###################################
# Muestra mensajes con colores
function text_color {
  local text=$2
  if [[ $1 -eq 1 ]]; then
    text="${LBLUE}$2${NC}"
  elif [[ $1 -eq 2 ]]; then
    text="${LGREEN}$2${NC}"
  elif [[ $1 -eq 3 ]]; then
    text="${LRED}$2${NC}"
  elif [[ $1 -eq 4 ]]; then
    text="${LCYAN}$2${NC}"
  fi
  echo "$text"
}

function cecho {
  if [[ $# -gt 0 ]] && [[ $(($# % 2)) -eq 0 ]]; then
    local text=""
    while (("$#")); do
      num=$1
      shift
      local color=$(text_color num "$1")
      text="${text}${color}"
      shift
    done
    echo -e "${text}"
  fi
}

function check_success {
  if [[ $1 -eq 0 ]]; then
    cecho 2 "OK"
  else
    cecho 3 "ERROR"
    exit 1
  fi
}

#####################################  MAIN  #####################################
#####################################  MAIN  #####################################
docker logs efi-generales-server 2>logs-generales
docker logs efi-vam-server 2>logs-vam
export SPRING_PROFILE=prod
export APP_MAIL=xxx  #fixme to na
export DATA_PATH=/data
export COMPUTER_VISION_URL="https://uqai-documents-test.cognitiveservices.azure.com/computervision/imageanalysis:analyze?api-version=2023-02-01-preview&features=read&model-version=latest&language=es"
export SUBSCRIPTION_KEYS="3ad3243fc6a94274ba46330ce2d04795, c3329931dffd4c54b24725a309a18c80"
cecho 3 "Iniciando sesion en Gitlab Registry"
docker login registry.gitlab.com -u segusuarez -p MiErBhygprv32LyYCfny
echo
cecho 3 "\nEjecutando el docker-compose"
docker compose -f "docker-compose.yml" pull && docker compose -f "docker-compose.yml" up -d
