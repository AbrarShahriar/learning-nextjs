import Post from "../../components/Post";
import Link from "next/link";

export default function PostList({ posts }) {
  return (
    <div className="postlist">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} passHref>
          <h2>
            {post.title} <br />{" "}
          </h2>
        </Link>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(`http://jsonplaceholder.typicode.com/posts`);

  const data = await res.json();

  return {
    props: {
      posts: data,
    },
  };
}
