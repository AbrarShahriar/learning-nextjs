import { useRouter } from "next/router";

export default function Docs() {
  const router = useRouter();
  const { params = [] } = router.query;

  if (params.length === 2) {
    return (
      <h1>
        Feature {params[0]} concept {params[1]}
      </h1>
    );
  } else if (params.length === 1) {
    return <h1>Feature {params[0]}</h1>;
  }

  return <h1>Docs Page</h1>;
}
