// extract route params
import { useRouter } from "next/router";

function ProductDetail() {
  const router = useRouter();
  const id = router.query.id;

  return (
    <div>
      <h1>Product {id} Detail Page!!</h1>
    </div>
  );
}

export default ProductDetail;
