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
* [`GET /get_data`](#get-get_data)
* [`GET /get_data/<uuid>`](#get-get_data-uuid)
* [`POST /chatbot`](#post-chatbot)
* [`GET /chatbots`](#get-chatbots)
* [`GET /chatbot/<chatbot_id>`](#get-chatbotchatbot_id)
* [`PATCH /chatbot/<chatbot_id>`](#patch-chatbotchatbot_id)

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

## `GET /get_data/<uuid>`

### Description

This endpoint retrieves data related to a specific document uploaded by the user, identified by its `uuid`. The document can be returned as plain text or as an original file, depending on the query parameters. The user must provide a valid `SessionID` to authenticate the request.

### Request

**Method:** `GET`

**Endpoint:** `/get_data/<uuid>`

**Path Parameters:**

- **uuid** (Required): The unique identifier (UUID) of the document. The document will be searched by this identifier.

**Headers:**

- **SessionID** (Required): A valid session token used to authenticate the user and fetch their associated data.

**Query Parameters:**

- **type** (Required): Specifies the format in which to return the data. Can be one of:
  - `text`: Returns the document's content as plain text.
  - `original`: Returns the original uploaded file (if saved).

### Response

**Status Codes:**

- **200 OK:** The data was successfully retrieved.
  - **Body:**
    - If `type=text`: Returns the plain text content of the document.
    - If `type=original`: Returns the file as an attachment with the appropriate file name in the Content-Disposition header. Returns a plain text, if data wasn't uploaded as a file.
- **204 No Content:** The original file is not saved on the server.
  - **Body:** No content (empty response).
- **400 Bad Request:** The query parameter `type` is invalid.
  - **Body:** `"Invalid type"`
- **401 Unauthorized:** Authentication failed.
  - **Body:** `"No Authentication Details Provided"`
- **404 Not Found:** The document was not found or doesn't belong to the user.
  - **Body:** `"Data not found"`
- **500 Internal Server Error:** There was an error while attempting to read the file.
  - **Body:** `"Failed to read file"`

### Examples

**Example 1: Retrieving Document as Plain Text**

**Request:**
```
GET /get_data/67d64f45f59f788106434e81?type=text HTTP/1.1
Host: localhost:3000
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: text/plain

This is the plain text content of the document.
```

**Example 2: Retrieving Original Document (File)**

**Request:**
```
GET /get_data/67d64f45f59f788106434e81?type=original HTTP/1.1
Host: localhost:3000
```

**Response:**
```
HTTP/1.1 200 OK
Content-Type: application/octet-stream
Content-Disposition: attachment; filename=lab_report.pdf

... (file data) ...
```

## `POST /chatbot`

### Description

This endpoint is responsible for creating a chatbot representation in MongoDB Atlas Database. It requires a `SessionID` header to be set in the request to authenticate the user who is creating the chatbot. Chatbots have a unique constraint on their name and creator id, so no user has two chatbots with a same name.

### Request

**Method:** `POST`

**Endpoint:** `/chatbot`

**Headers:**

*   **SessionID** (Required):
    * Contains authenticated Clerk User's session id

**Body:**

* **`name`**  `: string` **(Required)** - *the chatbot's name*
* **`description`** `: string` **(Optional)** - *the chatbot's description*
* **`welcome_message`** `: string` **(Optional)** - *the chatbot's welcome message*
* **`personality_traits`** `: [string]` **(Optional)** - *the chatbot's personality traits*
* **`expertise_docs`** `: [string]` **(Required)** - *the IDs of chatbot's expertise docs in MongoDB Atlas. Must be sent over as strings and be convertible to MongoDB `ObjectID`*
* **`whitelist_domains`** `: [string]` **(Required)** - *the domains that will be able to use the chatbot*

**Body Example:**

```json
{
    "name": "my chatbot2", //required
    "description": "my description", // optional
    "welcome_message": "hello there!", // optional
    "personality_traits": [ // optional
        "Caring", "Patient", "Talkative"
    ],
    "expertise_docs": [ //required
        "67d64f45f59f788106434e81",
        "67d64fde9a82716d39dcbca1"
    ],
    "whitelist_domains": [ //required
        "localhost:8080",
        "0.0.0.0:3001"
    ]
}
```

### Response

* **200 Ok**
    ```json
    {
        "chatbot_data_url": "http://localhost:3000/chatbot/67f5ed624428a7d31929b93a"
    }
    ```
* **400 Bad Request** (No `SessionID` header)
    ```json
    {
        "message": "No Authentication Details Provided"
    }
    ```

* **400 Bad Request** (Name Duplication)
    ```json
    {
        "message": "You already have a chatbot with name 'my chatbot2'!"
    }
    ```

* **400 Bad Request** (One of IDs in `expertise_docs` could not be converted to MongoDB `ObjectId`)
    ```json
    {
        "message": "Invalid Chatbot ID provided for Expertise Docs"
    }
    ```

## `GET /chatbots`

### Description

This endpoint returns all chatbots created by a given user. User indentity is pulled from the `SessionID` header. 

### Request

**Method:** `GET`

**Endpoint:** `/chatbots`

**Headers:**

*   **SessionID** (Required):
    * Contains authenticated Clerk User's session id


### Response

* **200 Ok**
    ```json
    [
        {
            "_id": {
                "$oid": "67f5ed624428a7d31929b93a"
            },
            "name": "my chatbot2",
            "description": null,
            "welcome_message": null,
            "personality_traits": null,
            "expertise_docs": [
                {
                    "$oid": "67d64f45f59f788106434e81"
                },
                {
                    "$oid": "67d64fde9a82716d39dcbca1"
                }
            ],
            "whitelist_domains": [
                "localhost:8080",
                "0.0.0.0:3001"
            ],
            "created_by": "user_2uHaJE5qhNHwGpfDdKOFhJ3JXnv"
        },
        {
            "_id": {
                "$oid": "67f5f79d941bce2ef8e2e586"
            },
            "name": "my chatbot3",
            "description": "my description",
            "welcome_message": "hello there!",
            "personality_traits": [
                "Caring",
                "Patient",
                "Talkative"
            ],
            "expertise_docs": [
                {
                    "$oid": "67d64f45f59f788106434e81"
                },
                {
                    "$oid": "67d64fde9a82716d39dcbca1"
                }
            ],
            "whitelist_domains": [
                "localhost:8080",
                "0.0.0.0:3001"
            ],
            "created_by": "user_2uHaJE5qhNHwGpfDdKOFhJ3JXnv"
        }
    ]
    ```

* **200 Ok** (No chatbots created by the user)
    ```json
    []
    ```

* **400 Bad Request** (No `SessionID` header)
    ```json
    {
        "message": "No Authentication Details Provided"
    }
    ```

## `GET /chatbot/<chatbot_id>`

### Description

This endpoint returns a specific chatbot's information by a given `chatbot_id`. It only searches through chatbots created by the sender, whose identity is established from the `SessionID` header. So, if the sender tries to get another user's chatbot, it will appear is if it is simply not there.

### Request

**Method:** `GET`

**Endpoint:** `/chatbot/<chatbot_id>`

**Headers:**

*   **SessionID** (Required):
    * Contains authenticated Clerk User's session id


### Response

* **200 Ok**<a id="chatbot_schema"></a>
    ```json
    {
        "_id": {
            "$oid": "67f5f79d941bce2ef8e2e586"
        },
        "name": "my chatbot3",
        "description": "my description",
        "welcome_message": "hello there!",
        "personality_traits": [
            "Caring",
            "Patient",
            "Talkative"
        ],
        "expertise_docs": [
            {
                "$oid": "67d64f45f59f788106434e81"
            },
            {
                "$oid": "67d64fde9a82716d39dcbca1"
            }
        ],
        "whitelist_domains": [
            "localhost:8080",
            "0.0.0.0:3001"
        ],
        "created_by": "user_2uHaJE5qhNHwGpfDdKOFhJ3JXnv"
    }
    ```

* **404 Not Found** (User is not the creator of this chatbot or it does not exist at all)
    ```json
    {
        "message": "No chatbot with ID '123123123123123123123123' found!"
    }
    ```

* **400 Bad Request** (Invalid `chatbot_id` provided that could not be converted to MongoDB ObjectID, such as *`123`*)
    ```json
    {
        "message": "Invalid Chatbot ID"
    }
    ```

* **400 Bad Request** (No `SessionID` header)
    ```json
    {
        "message": "No Authentication Details Provided"
    }
    ```

## `PATCH /chatbot/<chatbot_id>`

### Description

This endpoint is responsible for updating a chatbot representation in MongoDB Atlas Database. It requires a `SessionID` header to be set in the request to authenticate the user who is updating the chatbot. Note that the following rules apply to the body of this request:

* The body of this request is supposed to be a **partial** representation of the chatbot document in MongoDB
* **Every** field passed in the body will be updated in the database for the document with id of `chatbot_id`
* If any fields are **missing** from the body, they will be left unchanged
* If the request introduces any **new fields** to the schema, they will be **disregarded** *(See [this example](#chatbot_schema) for a full chatbot schema)*
* If any fields that are **forbidden for change** are passed in the body (such as `id`, `_id`, `name`, or `created_by`), they are **disregarded** *(See [this example](#recommended_patch_chatbot_body) for fields that can be updated with this request)*

### Request

**Method:** `PATCH`

**Endpoint:** `/chatbot/<chatbot_id>`

**Headers:**

*   **SessionID** (Required):
    * Contains authenticated Clerk User's session id

**Body:**

* **`description`**  `: string` **(Optional)** - *the updated chatbot's description*
* **`welcome_message`** `: string` **(Optional)** - *the updated chatbot's welcome_message*
* **`personality_traits`** `: [string]` **(Optional)** - *the updated chatbot's personality traits*
* **`expertise_docs`** `: [string]` **(Optional)** - *the updated list of IDs of chatbot's expertise docs in MongoDB Atlas. Must be sent over as strings and be convertible to MongoDB `ObjectID`*
* **`whitelist_domains`** `: [string]` **(Optional)** - *the updated list of domains that will be able to use the chatbot*

**Body Example:**<a id="recommended_patch_chatbot_body"></a>

```json
{
    "description": null, //optional
    "welcome_message": null, //optional
    "personality_traits": null, //optional
    "expertise_docs": [ //optional
        "67d64f45f59f788106434e81",
        "67d64fde9a82716d39dcbca1"
    ],
    "whitelist_domains": [ //optional
        "localhost:8080",
        "0.0.0.0:3001"
    ]
}
```

### Response

* **200 Ok**
    ```json
    {
        "_id": {
            "$oid": "67f60ba2652ca18bb578055c"
        },
        "name": "my chatbot3",
        "description": "updated description",
        "welcome_message": "hello there!",
        "personality_traits": [
            "Caring",
            "Patient",
            "Talkative"
        ],
        "expertise_docs": [
            {
                "$oid": "123123123123123123123123"
            }
        ],
        "whitelist_domains": [
            "localhost:8080",
            "0.0.0.0:3001"
        ],
        "created_by": "user_2uHaJE5qhNHwGpfDdKOFhJ3JXnv"
    }
    ```

* **400 Bad Request** (No `SessionID` header)
    ```json
    {
        "message": "No Authentication Details Provided"
    }
    ```

* **400 Bad Request** (One of IDs in `expertise_docs` could not be converted to MongoDB `ObjectId`)
    ```json
    {
        "message": "Invalid Chatbot ID provided for Expertise Docs"
    }
    ```

* **400 Bad Request** (Invalid `chatbot_id` provided that could not be converted to MongoDB ObjectID, such as *`123`*)
    ```json
    {
        "message": "Invalid Chatbot ID"
    }
    ```

* **404 Not Found** (User is not the creator of this chatbot or it does not exist at all)
    ```json
    {
        "message": "No chatbot with ID '123123123123123123123123' found!"
    }
    ```