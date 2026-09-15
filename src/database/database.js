const fs = require("fs/promises");
const path = require("path");
const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
	throw new Error("DATABASE_URL must be configured before loading the database module.");
}

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : undefined,
});

async function initializeDatabase() {
	const client = await pool.connect();
	try {
		await client.query(`
			CREATE TABLE IF NOT EXISTS schema_migrations (
				version TEXT PRIMARY KEY,
				applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			)
		`);

		const migrationsDirectory = path.join(__dirname, "migrations");
		const migrationFiles = (await fs.readdir(migrationsDirectory))
			.filter((file) => file.endsWith(".sql"))
			.sort();

		for (const file of migrationFiles) {
			const alreadyApplied = await client.query(
				"SELECT 1 FROM schema_migrations WHERE version = $1",
				[file],
			);
			if (alreadyApplied.rowCount) continue;

			await client.query("BEGIN");
			try {
				const sql = await fs.readFile(path.join(migrationsDirectory, file), "utf8");
				await client.query(sql);
				await client.query("INSERT INTO schema_migrations(version) VALUES($1)", [file]);
				await client.query("COMMIT");
			} catch (error) {
				await client.query("ROLLBACK");
				throw error;
			}
		}
	} finally {
		client.release();
	}
}

module.exports = { pool, initializeDatabase };