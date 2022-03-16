const getPostSchema = {
    params: {
        type: 'object',
        properties: {
            slug: {type: 'string'}
        }
    },
}

interface GetPostRequest {
    Params: {
        slug: string,
    }
}

export {getPostSchema,  GetPostRequest};
