export default {
    type: 'object',
    properties: {
        Records: [
            {
                body: { name: { type: 'string' },
                    password: { type: 'string' },
                    search: { type: 'string' },
                    store: { type: 'string' },
                },
            },
        ],
    },
    required: ['Records'],
} as const;
