import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>NextJS Pre Rendering</h1>
      <Link href="/users">
        <a>users</a>
      </Link>
      <br />
      <Link href="/posts">
        <a>posts</a>
      </Link>
    </div>
  );
}
