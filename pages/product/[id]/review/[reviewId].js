// extract route params
import { useRouter } from "next/router";

function Review() {
  const router = useRouter();
  const { id, reviewId } = router.query;

  return (
    <div>
      <h1>
        Product {id}: Review {reviewId} Page!!
      </h1>
    </div>
  );
}

export default Review;
