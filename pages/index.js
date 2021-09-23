import Link from "next/link";
import { useRouter } from "next/router";

function Home() {
  const router = useRouter();
  const clickHandler = () => {
    alert("Order Placed");
    router.push("/product");
  };
  return (
    <div>
      <h1>Home Page!!</h1>

      <Link href="/blog">
        <h3>Blog</h3>
      </Link>
      <br />
      <Link href="/product">
        <h3>Products</h3>
      </Link>
      <br />

      <button onClick={clickHandler}>Place Order</button>
    </div>
  );
}

export default Home;
