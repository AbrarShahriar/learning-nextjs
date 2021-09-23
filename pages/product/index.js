import Link from "next/link";

function ProductList() {
  return (
    <>
      <Link href="/">
        <a>Home</a>
      </Link>
      <br />
      <ul>
        {Array.from(new Array(5)).map((_, i) => (
          <li>
            <Link href={`/product/${i + 1}`}>
              <a>Product {i + 1}</a>
            </Link>
            <br />
          </li>
        ))}
      </ul>
    </>
  );
}

export default ProductList;
