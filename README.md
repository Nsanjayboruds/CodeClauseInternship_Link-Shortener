# CodeClause Internship - Link Shortener

A simple and flexible URL shortening service built with JavaScript (Node.js/Express). This project allows users to generate short links for long URLs, supports custom aliases, link expiration, and provides basic analytics for each shortened link.

## Features

- **Shorten URLs:** Generate a unique short code for any valid URL.
- **Custom Aliases:** Optionally provide your own custom short code (if not already taken).
- **Expiration:** Set expiration dates for links.
- **Analytics:** View basic analytics such as click counts and recent activity for each short link.
- **REST API:** Interact with the service via standard RESTful endpoints.

## API Endpoints

### `POST /api/shorten`
Shorten a URL.

**Request Body:**
- `url` (string, required): The original URL to shorten.
- `customCode` (string, optional): Custom short code (must be unique).
- `expireAt` (date, optional): Expiration date for the short link.

**Response:**
- `shortUrl`: The generated short URL.
- `code`: The unique code for the link.

### `GET /api/link/:code`
Get information and analytics for a short link.

**Response:**
- `originalUrl`: Original (long) URL.
- `shortCode`: The code used in the short link.
- `clickCount`: Number of times the link was clicked.
- `createdAt`: When the short link was created.
- `expiresAt`: When the link will expire (if set).
- `recentClicks`: List of recent click events.

## Usage

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Nsanjayboruds/CodeClauseInternship_Link-Shortener.git
   cd CodeClauseInternship_Link-Shortener
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Environment Setup:**
   - Create a `.env` file with:
     ```
     BASE_URL=http://localhost:3000
     MONGO_URI=your_mongodb_connection_string
     ```

4. **Start the server:**
   ```sh
   npm start
   ```

5. **Use API endpoints** from Postman, cURL, or your frontend.

## Project Structure

- `server/routes/links.js` — Main API routes for creating and retrieving shortened links and analytics.
- `server/models/Link.js`, `server/models/Click.js` — Database models for links and click analytics.
- `server/utils/codegen.js` — Utility for generating unique short codes.

## License

This project currently does not have a license. Please add one if you intend to share or deploy this project publicly.

---

**Repository:** [Nsanjayboruds/CodeClauseInternship_Link-Shortener](https://github.com/Nsanjayboruds/CodeClauseInternship_Link-Shortener)
