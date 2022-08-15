const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

export const Interceptor = () => {

    const after = async(request: any) => {
        return request.response = {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                headerResponse: {
                    status: 200,
                    message: 'Ok'
                },
                payload: request.response
            })
        }
    }

    const onError = async(request: any) => {
        const error = request.error;
        
        let headerResponse: any = {};
        if(error.fancy) {
            headerResponse = {
                status: error.sstatus,
                message: error.smessage
            }
            if(error.sdebug) {
                headerResponse.debug = error.sdebug
            }
        } else {
            headerResponse = {
                status: 204,
                message: 'Ocurrió un problema inesperado',
            }
            if(error.message) {
                headerResponse.debug = error.message
            }
        }
        
        return request.response = {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                headerResponse,
                payload: {}
            })
        }
    }

    return {
        after,
        onError
    }
}