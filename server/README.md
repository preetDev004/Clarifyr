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

# API reference

* [`POST /signup`](#post-signup)
* [`GET /user/<user_id>`](#get-useruser_id)
* [`POST /upload_data`](#post-upload_data)

## `POST /signup`

### Description

This endpoint handles user creation for MongoDB Atlas database. It takes in the `SessionID` header, pulls Clerk User's information from it, and creates a document in MongoDB based on Clerk User's information. On success, responds with a URl to get the created user's data.

### Request

**Method:** `POST`

**Endpoint:** `/signup`

**Headers:**

*   **SessionID** (Required):
    * Contains authenticated Clerk User's session id

### Response

* **200 Ok**
    ```json
    {
        "user_data_url": "http://localhost:3000/user/user_2uHaJE5qhNHwGpfDdKOFhJ3JXnv"
    }
    ```

* **400 Bad Request** (No `SessionID` header)
    ```json
    {
        "message": "No Authentication Details Provided"
    }
    ```

* **400 Bad Request** (User Already Exists)
    ```json
    {
        "message": "This User already exists"
    }
    ```

## `GET /user/<user_id>`

### Description

This endpoint returns data for a user with given ID from MongoDB Atlas. The `user_id` parameter refers to the document's `user_id` field in MongoDB. This endpoint requires authentication with `SessionID` header and rejects attemps to get data for users other than the sender.

### Request

**Method:** `GET`

**Endpoint:** `/user/<user_id>`

**Headers:**

*   **SessionID** (Required):
    * Contains authenticated Clerk User's session id

### Response

* **200 Ok**
    ```json
    {
        "_id": {
            "$oid": "67d3ba448fd546713ef9f8f2"
        },
        "user_id": "user_2uHaJE5qhNHwGpfDdKOFhJ3JXnv",
        "username": null,
        "first_name": null,
        "last_name": null,
        "email_address": "pc.cposu@gmail.com"
    }
    ```
* **400 Bad Request** (No `SessionID` header)
    ```json
    {
        "message": "No Authentication Details Provided"
    }
    ```

* **401 Unauthorized** (Trying to get other user's data)
    ```json
    {
        "message": "You are unauthorized to get this user's information"
    }
    ```


## `POST /upload_data`

### Description

This endpoint handles the upload of expertise data for chatbots, supporting both plain text and file uploads (multipart/form-data).

The endpoint accepts two primary content types:

*   **text/plain:** For uploading raw text data.
*   **multipart/form-data:** For uploading files.

### Request

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

### Response

**Status Codes:**

*   **200 OK:** The data was successfully received and processed.
    *   **Body:** `"Data uploaded successfully!"`
*   **400 Bad Request:** The request was invalid. Possible reasons:
    *   **`"No Content-Type provided"`:** The `Content-Type` header was missing.
    *   **`"Invalid Content-Type"`:** The `Content-Type` was not `text/plain` or `multipart/form-data`.
    *   **`"Invalid file type, only pdf, docx, and txt are allowed"`:** The uploaded file was not one of the allowed types.
    *   **`"File size exceeds the maximum limit of 25MB"`:** The uploaded file was larger than 25 MB.
    *   **`"No data uploaded"`:** No data was uploaded.

### Examples

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

## `GET /get_data`

### Description

This endpoint retrieves uploaded expertise data associated with the authenticated user. The user must include a valid session token in the request headers. The endpoint supports fuzzy search over file names and content using a query string parameter.

### Request

**Method:** `GET`

**Endpoint:** `/get_data`

**Headers:**

- **SessionID** (Required): A valid session token used to authenticate the user and fetch their associated data.

**Query Parameters:**

- **q** (Optional): A search term to filter results by file name (`original_name`) or file content (`content`). Supports partial matches and is case-insensitive.

### Response

**Status Codes:**

- **200 OK:** The data was successfully retrieved.
  - **Body:** A JSON array of matching documents, each with the following fields:
    - `id`: The document's unique ID as a string.
    - `name`: The name of the uploaded file.
    - `type`: The file's MIME type or `text` if plain text data was uploaded.
    - `status`: The processing status of the file.
    - `created_at`: The upload timestamp in ISO 8601 format.

- **401 Unauthorized:** Authentication failed.
  - **Possible Reasons:**
    - **`"No Authentication Details Provided"`**: The `SessionID` header was missing or invalid.

### Examples

**Example 1: Retrieving All Documents for an Authenticated User**

**Request:**
```
GET /get_data HTTP/1.1
```

**Response:**
```json
[
  {
    "_id": "67d64f45f59f788106434e81",
    "original_name": "test_doc.docx",
    "type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "status": "processed",
    "created_at": "2025-03-16T04:10:45"
  }
  ...
]
```

**Example 2: Searching for Documents Matching a Keyword**

**Request:**
```
GET /get_data?q=report HTTP/1.1
```

**Response:**
```json
[
  {
    "_id": "67d64f45f59f788106434e81",
    "original_name": "final_report.txt",
    "type": "text/plain",
    "status": "processed",
    "created_at": "2025-03-15T11:02:10"
  }
]
```