#!/usr/bin/env bash
###################################  CONSTANTES  ###################################
DATE=$(date +%Y-%m-%d)
LINE="--------------------------------------------------------------------------"
REPO_URL="registry.gitlab.com/wcbrokers/segusuarez/efi-generales"
VERSION="2.4.0"
export PUBLIC_URL="/"
# COLORES
LBLUE="\033[1;34m"  #1
LGREEN="\033[1;32m" #2
LRED="\033[1;31m"   #3
LCYAN="\033[1;36m"  #4
NC="\033[0m"        #No Color

###################################  FUNCIONES  ###################################
# Descriccion de los parametros del script
function usage() {
  echo
  echo "Uso: deploy.sh [-ciu {server, web, all}]"
  echo "Compila los proyectos, crea la imagen docker y sube al registry de; gitlab"
  echo "  -c {server, web, all}       compila el proyecto"
  echo "  -i {server, web, all}       crea la imagen docker"
  echo "  -u {server, web, all}       sube la imagen al gitlab registry"
  exit 1
}

# Muestra mensajes con colores
function text_color() {
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

function cecho() {
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

function check_success() {
  if [[ $1 -eq 0 ]]; then
    cecho 2 "OK"
  else
    cecho 3 "ERROR"
    exit 1
  fi
}

#####################################  MAIN  #####################################
function compile_web() {
  cecho 1 "Done: " 2 "./web/build"
  rm -rf ./web/build
  check_success $?
  cecho 1 "Ejecutando comando: " 2 "npm run build"
  cd web && npm run build && cd ..
  check_success $?
}

function compile_server() {
  cecho 1 "Eliminado directorio: " 2 "./web/build"
  rm -rf ./build
  check_success $?
  cecho 1 "Ejecutando comando: " 2 "gradlew clean bootJar"
  bash ./gradlew clean bootJar
  check_success $?
}

function image_web() {
  local name="${REPO_URL}/web:${VERSION}"
  cecho 1 "Creando imagen: " 2 "$name"
  docker build -t ${name} ./web
  check_success $?
}

function image_server() {
  local name="${REPO_URL}/server:${VERSION}"
  cecho 1 "Creando imagen: " 2 "$name"
  docker build -t ${name} ./
  check_success $?
}

function upload_web() {
  local name="${REPO_URL}/web:${VERSION}"
  cecho 1 "Subiendo imagen: " 2 "$name"
  docker push ${name}
  check_success $?
}

function upload_server() {
  local name="${REPO_URL}/server:${VERSION}"
  cecho 1 "Subiendo imagen: " 2 "$name"
  docker push ${name}
  check_success $?
}

function main() {
  OPTS=":ciu"
  while getopts "${OPTS}" opt; do
    case ${opt} in
    \?)
      cecho 3 "Parámetro no válido ($1)" >&2
      usage
      ;;
    esac
  done
  eval "FIRSTARG=\${${OPTIND}}"
  if [[ -z "${FIRSTARG}" ]]; then
    cecho 3 "Debe especificar el nombre del proyecto"
    usage
  fi
  OPTIND=1
  FIRSTARG=${FIRSTARG,,}
  while getopts "${OPTS}" opt; do
    case ${opt} in
    c)
      cecho 1 ${LINE}
      cecho 2 "               C O M P I L A N D O   P R O Y E C T O"
      cecho 1 ${LINE}

      case $FIRSTARG in
      web)
        compile_web
        ;;
      server)
        compile_server
        ;;
      all)
        compile_web
        compile_server
        ;;
      *)
        cecho 3 "Valor del parametro ($1) incorrecto" >&2
        usage
        ;;
      esac
      ;;
    i)
      cecho 1 $LINE
      cecho 2 "              C R E A N D O   I M A G E N   D O C K E R"
      cecho 1 $LINE

      case $FIRSTARG in
      web)
        image_web
        ;;
      server)
        image_server
        ;;
      all)
        image_web
        image_server
        ;;
      *)
        cecho 3 "Valor del parametro ($1) incorrecto" >&2
        usage
        ;;
      esac
      ;;
    u)
      cecho 1 $LINE
      cecho 2 "       S U B I E N D O   I M A G E N E S   A L   G I T L A B"
      cecho 1 $LINE

      #                cecho 1 "Iniciar sesion en Gitlab"
      #                docker login registry.gitlab.com
      #                check_success $?

      case $FIRSTARG in
      web)
        upload_web
        ;;
      server)
        upload_server
        ;;
      all)
        upload_web
        upload_server
        ;;
      *)
        cecho 3 "Valor del parametro ($1) incorrecto" >&2
        usage
        ;;
      esac
      ;;
    esac
  done

  if [[ $OPTIND -eq 2 ]]; then
    shift $OPTIND
  else
    cecho 3 "Parámetro no válido ($1)" >&2
    usage
  fi

  if [[ $# -ge 2 ]]; then
    main $@
  fi
  exit 0
}

if [[ $# -eq 0 ]]; then
  usage
else
  main $@
fi
