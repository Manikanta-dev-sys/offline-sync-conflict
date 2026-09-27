const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const syncRoutes = require("./routes/syncRoutes");
const { swaggerUi, swaggerDocument } = require("./swagger");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", syncRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.get("/", (req, res) => {
    res.json({
        message: "Offline Sync Conflict API is running"
    });
});

app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Database connection failed"
        });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});