const pool = require("../db");

// Create a new document
const createDocument = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO documents (title, content)
             VALUES ($1, $2)
             RETURNING *`,
            [title, content]
        );

        res.status(201).json({
            message: "Document created successfully",
            document: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to create document"
        });
    }
};


// Get a document
const getDocument = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM documents WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.json({
            document: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to get document"
        });
    }
};


// Update a document
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const result = await pool.query(
            `UPDATE documents
             SET title = $1,
                 content = $2,
                 version = version + 1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3
             RETURNING *`,
            [title, content, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.json({
            message: "Document updated successfully",
            document: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to update document"
        });
    }
};


// Sync document
const syncDocumentController = async (req, res) => {
    try {
        console.log("SYNC REQUEST:", req.body);

        const {
            documentId,
            deviceId,
            baseVersion,
            title,
            content,
            resolution
        } = req.body;

        if (
            !documentId ||
            !deviceId ||
            baseVersion === undefined ||
            !title ||
            !content
        ) {
            return res.status(400).json({
                message: "documentId, deviceId, baseVersion, title and content are required"
            });
        }

        const { syncDocument } = require("../services/conflictService");

        const result = await syncDocument(
            documentId,
            deviceId,
            baseVersion,
            title,
            content,
            resolution
        );

        if (result.conflict && !result.resolution) {
            return res.status(409).json(result);
        }

        res.json(result);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Sync failed"
        });
    }
};


module.exports = {
    createDocument,
    getDocument,
    updateDocument,
    syncDocumentController
};