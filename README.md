# API Routes
<hr>

NextJS is a full stack framework.

We can write Front-end code in React and also write API's as part of our NextJS folder structure.

**How?**

- Create or go to `/api` in `/pages` folder.
- Create a `index.js` file and default export a function. (convention is `handler`):

```javascript
export default function handler(request, response) {
  response.status(200).json({ name: 'John Doe' })
}
```

Now if we start our app with `npm run dev` and visit `http://localhost:3000/api`, we should see:
```javascript
{
  "name": "John Doe"
}
```

- To create new routes e.g. `/api/dashboard`, create a new file `dashboard.js` in `/api` and again default export a handler function:
```javascript
export default function handler(request, response) {
  response.status(200).json({ name: 'Dashboard Route' })
}
```

- To create nested routes e.g. `/api/blog/recent`, create a `/blog` folder and a `/blog/index.js` file with the handler function as usual. Then create a `/blog/recent.js` file and also add a handler fucntion inside.

**`/blog/index.js`**:
```javascript
export default function handler(request, response) {
  response.status(200).json({ name: 'Blog Route' })
}
```
**`/blog/recent.js`**:
```javascript
export default function handler(request, response) {
  response.status(200).json({ name: 'Recent Blog Route' })
}
```

**NOTE: Our code in `/api` folder are not bundled with the front-end code.**

## Making GET, POST, DELETE requests

### `GET`:
 
Let's assume we have `/comments` route. If we send a `GET` request to this route, we we  will get some comments.

- Create `/api/comments/index.js` and as default export a handler function:
```javascript
export default function handler(request, response) {
  response.status(200).json({ name: 'Recent Blog Route' })
}
```

Go to `http://localhost:3000/api/comments` route and we will see the comments.

Okay but how do we connect this API with our front-end code?

- Create `/comments/index.js` file in `/pages` folder and code something like this: 
```javascript
import { useState } from "react";

export default function CommentsPage() {
  // we use state to keep track of the comments being loaded
  const [comments, setComments] = useState([]);

  // our event handler, this function fetches the data and updates the state 
  const fetchComments = async (e) => {
    const res = await fetch(`/api/comments`);
    const data = await res.json();
    setComments(data);
  };

  return (
    <>
      <button onClick={fetchComments}>Load comments</button>
      <ul>
        {comments.map((comment) => (
          <li>{comment.body}</li>
        ))}
      </ul>
    </>
  );
}
```

If we visit `http://localhost:3000/comments`, we will see a button and if we click on it, we will see the comments

### `POST`:

We will continue with our comments example.

**Scenario:** The user can post a comment and it will be added in the `/data/comments.js` array.

We will add onto the `/pages/comments.js` file:

```javascript
import { useState } from "react";

export default function CommentsPage() {
  
  // ---------- GET ---------- //
  const [comments, setComments] = useState([]);

  const fetchComments = async (e) => {
    const res = await fetch(`/api/comments`);
    const data = await res.json();
    setComments(data);
  };

  // ---------- POST ---------- //
  // state to store the value of input
  const [commentBody, setCommentBody] = useState("");

  // submit function to add new posts
  const postData = async (e) => {
    const res = await fetch(`/api/comments`, {
      // NOTE: fetch() by default sends a GET request. To send POST or other types of request, we have to pass an option object with the request type
      method: "POST",
      // NOTE: We MUST send the body as string that's why we convert our data to string using JSON.stringify
      body: JSON.stringify({ text: commentBody }),
    });
    const data = await res.json();
    console.log(data);
  };

  return (
    <>
      {/* GET */}
      <button onClick={fetchComments}>Load comments</button>
      <ul>
        {comments.map((comment) => (
          <li>{comment.text}</li>
        ))}
      </ul>

      {/* POST */}
      <input
        type="text"
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        id=""
      />
      <button onClick={postData}>Post comment</button>
    </>
  );
}
```

We also have a work on our `/api/comments/index.js`:

```javascript
import { comments } from "../../../data/comments";

export default function handler(request, response) {
  // NOTE: by default, every request is GET. To check if the request type is POST, we have to access and compare the 'request.method' property.
  if (request.method === "GET") {
    // Send all the comments if it's a GET request
    response.status(200).json(comments);
  } else if (request.method === "POST") {
    // If it's a POST request, we will also receive the data the user sent to us through the request. 
    // We will access (the data is accessible through 'request.body') and store this data in a variable to use later.
    const comment = request.body.text;

    // We create a new object and design it according to the other comments.
    const newComment = {
      id: Data.now() // <= we generate a random number to store as our comment id.
      text: comment,
    };
    
    // We push/add the comment the user sent to our comments array.
    comments.push(newComment);

    // Then we send a response message to the user saying the request was successful. This is neccesssary otherwise the user has no idea it his action was successful or not.
    response.status(200).json({ message: "comment posted successfully" });
}
```

### `DELETE`:

A `DELETE` request a little bit differant than `GET` or `POST`. Because, to delete a comment, we have to know the ID of the comment we want to delete.

So, the API endpoint/url will look something like this: <br>
`http://localhost:3000/api/comments/1` <br>
`http://localhost:3000/api/comments/2` <br>
`http://localhost:3000/api/comments/3` <br>
................................................................................ <br>
`http://localhost:3000/api/comments/[commentId]` <br>

These kinds of routes are called *Dynamic Routes*.
To create our dynamic route, we will create `[commentId].js` file inside of `/api/comments` and code this:

```javascript
import { comments } from "../../../data/comments";

export default function handler(request, response) {
  // We need to access the comment id the user sent to us through the url 
  // http://localhost:3000/api/comments/3 <= this '3' is the id
  // we can access this value using 'request.query' object
  const id = request.query.commentId;

  // we find the comment we want to delete
  // we use 'parseInt' because the id will be sent as a string
  const comment = comments.find((comment) => comment.id === parseInt(id));

  //delete the comment from the array
    // find the index of the comment we want to delete
    const index = comments.findIndex(comment => comment.id === parseInt(id))
    // use 'Array.splice(startIndex, numberOfItemsToRemove)' to remove the comment from the array
    comments.splice(index, 1)

  // we tell the user that the comment was successfully deleted
  response.status(200).json({ message: "comment deleted!" });
}
```

**NOTE: The filename has to be between sqaure brackets.**

Now if we send a `DELETE` request to `http://localhost:3000/api/comments/3`, then the comment with the ID of 3 will be deleted.