const pool = require("../db");

const syncDocument = async (documentId, deviceId, baseVersion, title, content, resolution) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // Get the current document
        const result = await client.query(
            "SELECT * FROM documents WHERE id = $1 FOR UPDATE",
            [documentId]
        );

        if (result.rows.length === 0) {
            throw new Error("Document not found");
        }

        const document = result.rows[0];
        // Check for duplicate sync request
const duplicateCheck = await client.query(
    `SELECT * FROM changes
     WHERE document_id = $1
       AND device_id = $2
       AND base_version = $3
     ORDER BY id DESC
     LIMIT 1`,
    [documentId, deviceId, baseVersion]
);

if (duplicateCheck.rows.length > 0) {
    await client.query("ROLLBACK");

    return {
        success: true,
        duplicate: true,
        message: "Duplicate sync request ignored",
        previousChange: duplicateCheck.rows[0],
        document: document
    };
}

        // Check for version conflict
       if (document.version !== baseVersion) {

    // Server wins
    if (resolution === "SERVER_WINS") {
        await client.query("ROLLBACK");

        return {
            success: true,
            conflict: true,
            resolution: "SERVER_WINS",
            message: "Server version kept",
            document: document
        };
    }

    // Client wins
    if (resolution === "CLIENT_WINS") {

        const newVersion = document.version + 1;

        const updatedResult = await client.query(
            `UPDATE documents
             SET title = $1,
                 content = $2,
                 version = $3,
                 updated_by = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [title, content, newVersion, deviceId, documentId]
        );

        await client.query(
            `INSERT INTO changes
             (document_id, device_id, base_version, new_version, operation)
             VALUES ($1, $2, $3, $4, $5)`,
            [documentId, deviceId, baseVersion, newVersion, "CLIENT_WINS"]
        );

        await client.query("COMMIT");

        return {
            success: true,
            conflict: true,
            resolution: "CLIENT_WINS",
            message: "Client version accepted",
            document: updatedResult.rows[0]
        };
    }

    // No resolution selected
    await client.query("ROLLBACK");

    return {
        success: false,
        conflict: true,
        message: "Sync conflict detected",
        serverVersion: document.version,
        clientBaseVersion: baseVersion,
        serverDocument: document,
        resolutionOptions: [
            "SERVER_WINS",
            "CLIENT_WINS"
        ]
    };
}

        // No conflict - update document
        const newVersion = document.version + 1;

        const updatedResult = await client.query(
            `UPDATE documents
             SET title = $1,
                 content = $2,
                 version = $3,
                 updated_by = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5
             RETURNING *`,
            [title, content, newVersion, deviceId, documentId]
        );

        // Record the change
        await client.query(
            `INSERT INTO changes
             (document_id, device_id, base_version, new_version, operation)
             VALUES ($1, $2, $3, $4, $5)`,
            [documentId, deviceId, baseVersion, newVersion, "UPDATE"]
        );

        await client.query("COMMIT");

       return {
    success: true,
    conflict: false,
    status: "SYNCED",
    message: "Document synced successfully",
    syncResult: {
        documentId: documentId,
        deviceId: deviceId,
        previousVersion: document.version,
        newVersion: newVersion
    },
    document: updatedResult.rows[0]
};
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

module.exports = {
    syncDocument
};