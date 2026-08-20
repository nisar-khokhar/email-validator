# Express CSV Email Validation Project

This project is a Node.js + Express application that accepts a CSV file, validates each email address, saves the validation results in PostgreSQL, and allows the processed CSV to be downloaded.

## Overview

The application follows this workflow:

1. Upload a CSV file containing an `Email` column.
2. Read the uploaded file using `csv-parser`.
3. Validate every email with `deep-email-validator`.
4. Mark each row as valid or invalid and keep detailed validation reasons.
5. Store the results in a PostgreSQL table using Sequelize.
6. Return the processed CSV for download.

This is useful for bulk email cleanup, list validation, and contact-quality checks.

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Multer
- csv-parser
- json2csv
- deep-email-validator

---

## Project Structure

```text
Express/
├── config/
│   └── db.js                 # PostgreSQL connection setup
├── controllers/
│   └── importController.js   # CSV upload, validation, and export logic
├── models/
│   └── emailresponse.js      # Sequelize model for validation results
├── public/
│   └── uploads/              # uploaded CSV files are stored here
├── routes/
│   ├── importRoute.js        # import/export endpoints
│   └── testRoute.js          # basic test route
├── server/
│   └── app.js                # Express app startup and route registration
├── data.json                 # generated JSON output file
├── package.json              # dependencies and scripts
├── README.md                 # project documentation
├── package-lock.json
└── node_modules/
```

---

## How the App Works

### 1. File upload
The app uses `multer` to receive a CSV upload and save it to `public/uploads` using the original filename.

### 2. CSV parsing
The uploaded file is read with `csv-parser`, and each row is mapped into an array for processing.

### 3. Email validation
Every email is validated with `deep-email-validator`.

The validator provides several checks, including:

- `valid`
- `reason`
- `validators.typo.valid`
- `validators.smtp.valid`
- `validators.mx.valid`
- `validators.disposable.valid`
- `validators.regex.valid`

The controller stores those results in the processed row object and also writes them into the database model.

### 4. Database persistence
The model in `models/emailresponse.js` defines a table named `emailresponses` (created by Sequelize).

Stored fields include:

- `Email`
- `Valid`
- `Reason`
- `Typo`
- `Smtp`
- `Regex`
- `Disposible`
- `Mx`

### 5. Download output
After processing, the app creates a CSV payload and sends it to the client via the export endpoint.

---

## API Endpoints

The server runs on port `5000`.

### `POST /importfile`
Uploads and validates a CSV file.

Example:

```bash
curl -X POST http://localhost:5000/importfile \
  -F "file=@people.csv"
```

Success response:

```json
{
  "status": 200,
  "success": true,
  "msg": "done"
}
```

### `GET /exportfile`
Downloads the most recently processed CSV file.

```bash
curl -O http://localhost:5000/exportfile
```

### `GET /testapi`
Simple health/test route.

```bash
curl http://localhost:5000/testapi
```

Response:

```text
Hello
```

---

## Database Configuration

The database connection is configured in `config/db.js`:

```js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("testDB", "postgres", "admin1245", {
  dialect: "postgres",
});
```

This project currently expects:

- database name: `testDB`
- username: `postgres`
- password: `admin1245`

> This is a hardcoded local configuration and should be replaced with environment variables in a real environment.

---

## Installation

1. Install dependencies:

```bash
npm install
```

2. Make sure PostgreSQL is running.

3. Create the database and ensure the credentials in `config/db.js` match your local setup.

4. Start the server:

```bash
npm run start:server
```

The server starts at:

```text
http://localhost:5000
```

---

## CSV Example

The project expects an `Email` column in the CSV file:

```csv
Name,Email
John Doe,john@example.com
Jane Smith,not-an-email
Alice Cooper,alice@gmail.com
```

The uploaded file is processed and the output is returned as a validated CSV.

---

## Important Notes

- `models/emailresponse.js` contains `emailresponse.sync({ force: true })`, which recreates the table each time the app starts.
- This is useful for testing, but it can wipe stored data in development.
- The app currently stores uploaded files in `public/uploads/` and uses the original file name.
- The app does not currently use `.env` files; database credentials are hardcoded.
- There is no full automated test suite configured yet.

---

## Use Cases

This project is suitable for:

- bulk email validation
- contact list cleanup
- identifying disposable or invalid addresses
- exporting a cleaned CSV file for further processing

---

## Summary

This project is a small but complete bulk email validation service. It reads CSV input, validates each email with a real validation library, stores the results in PostgreSQL, and exposes a CSV download endpoint. It is a practical backend for processing large contact lists and checking email quality before sending campaigns or storing data.

If you want to use it in production, the next recommended improvement is to move the database credentials and file paths into environment variables and add error handling and validation for the uploaded file format.
