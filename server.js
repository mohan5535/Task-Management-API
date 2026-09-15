require("dotenv").config();
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "replace_with_a_long_random_secret") {
	throw new Error("JWT_SECRET must be configured before starting the server.");
}

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL must be configured before starting the server.");
}

const app = require("./src/app");
const { initializeDatabase } = require("./src/database/database");

async function start() {
	await initializeDatabase();
	app.listen(PORT, () => console.log(`Task Management API running on port ${PORT}`));
}

start().catch((error) => {
	console.error("Unable to start the server:", error.message);
	process.exit(1);
});