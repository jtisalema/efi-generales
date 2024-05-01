@REM Desactivamos la visualización de los comandos a ejecutar
@echo off
setlocal enabledelayedexpansion
@REM CONSTANTES
set REPO_URL=registry.gitlab.com/wcbrokers/segusuarez/efi-generales
set VERSION=2.5.0
set PUBLIC_URL=/
@REM Ingreso de datos
@REM Selección de proyecto
echo Constantes generadas correctamente.
echo Selecciona el proyecto utilizar: 
echo s Servidor
echo w Cliente Web
echo Selecciona el proceso a realizar: 
:input_proceso
set /p proyecto=Por favor ingrese el valor:
if "!proyecto!"=="s" ( goto continue_accion )
if "!proyecto!"=="w" ( goto continue_accion )
if "!proyecto!"=="t" ( goto continue_accion )
echo Valor incorrecto. Intente nuevamente.
goto input_proceso
@REM Selección de acción
:continue_accion
echo Compila los proyectos, crea la imagen docker y sube al registry de gitlab
echo c Compila el proyecto
echo i Crea la imagen docker
echo u Sube la imagen al gitlab registry
:input_accion
set /p accion=Por favor ingrese el valor:
if "!accion!"=="c" ( goto continue_proceso )
if "!accion!"=="i" ( goto continue_proceso )
if "!accion!"=="u" ( goto continue_proceso )
echo Valor incorrecto. Intente nuevamente.
goto input_accion

@REM Acciones a realizar
:continue_proceso
cls

if "!proyecto!"=="s" ( 
    if "!accion!"=="c" ( 
        goto compila_server 
    )
    if "!accion!"=="i" ( 
        goto image_server 
    )
    if "!accion!"=="u" (
        goto upload_server
    )
)
if "!proyecto!"=="w" ( 
    if "!accion!"=="c" ( 
        goto compila_web 
    )
    if "!accion!"=="i" ( 
        goto image_web 
    )
    if "!accion!"=="u" (
        goto upload_web
    )
)

:continua_proceso
goto finalizacionProceso
goto :eof

@REM Funciones

:compila_web
echo Inicio de proceso de compilación web
echo Borrando contenido ./web/build
rd /s /q .\web\build
echo .
echo Ejecutando comando: npm run build
cd .\web
echo %cd%
npm run build
cd ..
goto continua_proceso

:compila_server
echo Inicio de proceso de compilación servidor
echo Borrando contenido ./build
rd /s /q .\build
echo .
echo Ejecutando compilación del proyecto
gradle build --exclude-task test
cd ..
goto continua_proceso

:image_web
set "name=%REPO_URL%/web:%VERSION%"
echo Creando imagen %name%
echo docker build -t %name% ./web 
goto continua_proceso

:image_server
set "name=%REPO_URL%/server:%VERSION%"
echo Creando imagen %name%
echo docker build -t %name% ./
goto continua_proceso

:upload_web
  set "name=%REPO_URL%/web:%VERSION%"
  echo Subiendo imagen %name%
  echo docker push %name%
goto continua_proceso
  
:upload_server
  set "name=%REPO_URL%/server:%VERSION%"
  echo Subiendo imagen %name%
  echo docker push %name%
goto continua_proceso

:finalizacionProceso
echo Proceso terminado