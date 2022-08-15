export const BodyParser = () => {

    const before = async(request: any) => {
        const body = request.event.body;
        request.event.body = JSON.parse(body);
    }

    return {
        before,
    }
}