interface ISCode {
    [key: string]: {
        status: number
        message: string
    }
}

export const PrintError = (errors: ISCode) => {

    const onError = async(request: any) => {
        const error = request.error;

        let response: any = {};
        if(error.scode) {
            if(!errors[error.scode]) {
                response = {
                    fancy: true,
                    sstatus: 204,
                    smessage: 'Ocurrió un problema inesperado',
                    sdebug: `No se encontró la traducción para el mensaje: ${error.scode}`
                }
            } else {
                response = {
                    fancy: true,
                    sstatus: errors[error.scode].status,
                    smessage: errors[error.scode].message,
                }
                if(error.sdebug) {
                    response.sdebug = error.sdebug;
                }
            }
            request.error = response;
        }
    }

    return {
        onError
    }
}