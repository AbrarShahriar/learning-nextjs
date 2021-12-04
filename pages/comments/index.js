import { useState } from "react";

export default function CommentsPage() {
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");

  const fetchComments = async (e) => {
    const res = await fetch(`/api/comments`);
    const data = await res.json();
    setComments(data);
  };

  const postData = async (e) => {
    const res = await fetch(`/api/comments`, {
      method: "POST",
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
