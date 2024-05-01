export function DefaultErrorMessage() {
    return (
        <div className={"container h-100"}>
            <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100">
                <h3 className={"text-center"}>Ups... <br/>¡Algo salió mal!</h3>
                <small>Si esto persiste contacte con soporte.</small>
            </div>
        </div>
    );
}