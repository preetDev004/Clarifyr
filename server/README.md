# Running the server in **DEV** mode with **Docker**

While running in **DEV** mode, the changes made to `src` folder will be reflected in the docker container and the server will automatically restart.

1. Make sure you have `docker` installed and your `docker` engine is up and running

2. `cd` into the `server` folder
```sh
cd server
```

3. Build the server development image
```sh
sudo docker build -t capstone-server-dev -f Dockerfile.dev .
```

4. Run a container from the development image

```sh
sudo docker run --rm -p 3000:3000 --volume ./src:/server/src --name capstone-server-dev-container capstone-server-dev
```

## API reference

### POST /upload_data

#### Description

This endpoint handles the upload of expertise data for chatbots, supporting both plain text and file uploads (multipart/form-data).

The endpoint accepts two primary content types:

*   **text/plain:** For uploading raw text data.
*   **multipart/form-data:** For uploading files.

#### Request

**Method:** `POST`

**Endpoint:** `/upload_data`

**Headers:**

*   **Content-Type** (Required):
    *   `text/plain`: Indicates that the request body contains plain text data.
    *   `multipart/form-data`: Indicates that the request is uploading a file.

**Query Parameters:**

*   **save** (Optional):
	*	`true`: Indicates that the original document should be persisted on the server.
	*	Available only for multipart form-data upload

**Body:**

*   **text/plain:**
    *   The request body should contain the plain text data.
*   **multipart/form-data:**
    *   The request body should contain a file with the key `file` in the multipart form-data.
    *   **file** (Required): The file to be uploaded.
        *   **Allowed File Types:** `PDF`, `DOCX`, `TEXT`
        *   **Allowed File Extensions:** `.pdf`, `.docx`, `.txt`
        *   **Maximum File Size:** 25 MB

#### Response

**Status Codes:**

*   **200 OK:** The data was successfully received and processed.
    *   **Body:** `"Data uploaded successfully!"`
*   **400 Bad Request:** The request was invalid. Possible reasons:
    *   **`"No Content-Type provided"`:** The `Content-Type` header was missing.
    *   **`"Invalid Content-Type"`:** The `Content-Type` was not `text/plain` or `multipart/form-data`.
    *   **`"Invalid file type, only pdf, docx, and txt are allowed"`:** The uploaded file was not one of the allowed types.
    *   **`"File size exceeds the maximum limit of 25MB"`:** The uploaded file was larger than 25 MB.
    *   **`"No data uploaded"`:** No data was uploaded.

#### Examples

**Example 1: Uploading Plain Text**

**Request:**

```
POST /upload_data HTTP/1.1 Host: localhost:3000 Content-Type: text/plain Content-Length: 22

This is some text data.
```

**Response:**

```
HTTP/1.1 200 OK Content-Length: 25 Content-Type: text/html; charset=utf-8

Data uploaded successfully!
```

**Example 2: Uploading a File (multipart/form-data)**

**Request:**

```
POST /upload_data HTTP/1.1 Host: localhost:3000 Content-Type: multipart/form-data; boundary=-------YourBoundary

-------YourBoundary
Content-Disposition: form-data; name="file"; filename="document.pdf" Content-Type: application/pdf null

... (file data) ... 
-------YourBoundary
```

**Response:**

```
HTTP/1.1 200 OK Content-Length: 25 Content-Type: text/html; charset=utf-8

Data uploaded successfully!
```