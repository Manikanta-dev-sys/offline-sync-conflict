const express = require("express");

const {
    createDocument,
    getDocument,
     updateDocument,
    syncDocumentController
} = require("../controllers/syncController");

const router = express.Router();

router.post("/documents", createDocument);

router.get("/documents/:id", getDocument);

router.put("/documents/:id", updateDocument);

router.post("/sync", syncDocumentController);

module.exports = router;