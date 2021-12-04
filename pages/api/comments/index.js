import { comments } from "../../../data/comments";

export default function handler(request, response) {
  if (request.method === "GET") {
    response.status(200).json(comments);
  } else if (request.method === "POST") {
    const comment = request.body.text;
    const newComment = {
      id: Date.now(),
      text: comment,
    };

    try {
      comments.push(newComment);
      return response.status(200).json(newComment);
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  }
}
