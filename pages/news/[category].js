export default function NewsByCategory({ articles, category }) {
  return (
    <>
      <h1>{category}</h1>
      {articles.map((article) => (
        <h1 key={article.id}>{article.title}</h1>
      ))}
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { category },
  } = context;
  const res = await fetch(
    `http://jsonplaceholder.typicode.com/news?category=${category}`
  );
  const data = await res.json();

  return {
    props: {
      articles: data,
      category,
    },
  };
}
