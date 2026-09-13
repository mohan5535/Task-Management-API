require("dotenv").config();
const app = require("./src/app");
const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "replace_with_a_long_random_secret") {
	throw new Error("JWT_SECRET must be configured before starting the server.");
}

app.listen(PORT, () => console.log(`Task Management API running on http://localhost:${PORT}`));