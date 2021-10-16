export default function PostDetail({ post }) {
  return (
    <div className="PostDetail">
      <h1>{post.title}</h1>
      <p>{post.id}</p>

      <p>{post.body}</p>
    </div>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`http://jsonplaceholder.typicode.com/posts`);

  const data = await res.json();

  const paths = data.map((post) => ({
    params: { postId: `${post.id}` },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const res = await fetch(
    `http://jsonplaceholder.typicode.com/posts/${params.postId}`
  );

  const data = await res.json();

  return {
    props: {
      post: data,
    },
  };
}
