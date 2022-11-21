export default {
    type: 'object',
    properties: {
        name: { type: 'string' },
        password: { type: 'string' },
        search: { type: 'string' },
        store: { type: 'string' },
    },
    required: ['name', 'password', 'search', 'store'],
} as const;
