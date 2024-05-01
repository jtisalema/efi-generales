### Levantar oracle 11g

Para levantar gvenzl/oracle-xe:11 el bind mount siempre crearlo previamente y darle permisos 777.

```dockerfile
  efi-oracle-db:
    image: gvenzl/oracle-xe:11
    restart: unless-stopped
    container_name: efi-oracle-db
    environment:
      ORACLE_PASSWORD: broker
    ports:
      - "1521:1521"
    volumes:
      - /data/segusuarez/oracle2:/u01/app/oracle/oradata
```

Ejemplo:

```bash
mkdir -p /data/segusuarez/oracle2
chmod 777 /data/segusuarez/oracle2
```

### Restaurar backup

```bash
imp usuario/clave@instancia file=backup.dmp full=yes
```

Ejemplo:

```bash
imp SYSTEM/broker@XE file=broker.dmp full=yes
```

### Reset database SYS and SYSTEM passwords

```shell
docker exec <container name|id> resetPassword <your password>
```

### Cambiar contraseña de un usuario

```shell
sqlplus SYSTEM
```

```sql
ALTER USER nombre_usuario IDENTIFIED BY nueva_contraseña;
```

### usuarioefi@192.168.40.19
### Se debe escalar a root para poder modificar el deploy.sh del servidor
`SeguSuarez2021..`