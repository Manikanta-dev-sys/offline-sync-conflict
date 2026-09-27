const swaggerUi = require("swagger-ui-express");

const swaggerDocument = {
    openapi: "3.0.0",

    info: {
        title: "Offline Sync Conflict API",
        version: "1.0.0",
        description:
            "Backend API for multi-device offline synchronization and conflict resolution."
    },

    servers: [
        {
            url: "http://localhost:5000"
        }
    ],

    paths: {
        "/api/documents": {
            post: {
                summary: "Create a document",

                requestBody: {
                    required: true,

                    content: {
                        "application/json": {
                            schema: {
                                type: "object",

                                required: [
                                    "title",
                                    "content"
                                ],

                                properties: {
                                    title: {
                                        type: "string"
                                    },

                                    content: {
                                        type: "string"
                                    }
                                }
                            }
                        }
                    }
                },

                responses: {
                    201: {
                        description: "Document created"
                    }
                }
            }
        },

        "/api/documents/{id}": {
            get: {
                summary: "Get a document",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        }
                    }
                ],

                responses: {
                    200: {
                        description: "Document retrieved"
                    }
                }
            },

            put: {
                summary: "Update a document",

                parameters: [
                    {
                        name: "id",
                        in: "path",
                        required: true,

                        schema: {
                            type: "integer"
                        }
                    }
                ],

                responses: {
                    200: {
                        description: "Document updated"
                    }
                }
            }
        },

        "/api/sync": {
            post: {
                summary: "Synchronize a document",

                description:
                    "Synchronizes a client change and detects version conflicts.",

                responses: {
                    200: {
                        description: "Synchronization successful"
                    },

                    409: {
                        description: "Synchronization conflict"
                    }
                }
            }
        }
    }
};

module.exports = {
    swaggerUi,
    swaggerDocument
};