import { comments } from "../../../data/comments";

export default function handler(request, response) {
  const id = request.query.commentId;
  const comment = comments.find((comment) => comment.id === parseInt(id));

  const index = comments.findIndex((comment) => comment.id === id);
  comments.splice(index, 1);

  response.status(200).json(comment);
}
