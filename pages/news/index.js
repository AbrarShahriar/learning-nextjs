function NewsList(props) {
  return (
    <>
      <h1>List of News</h1>
      {props.articles.map((article) => (
        <div>
          <h2>{article.title}</h2>
          <p>{article.category}</p>
        </div>
      ))}
    </>
  );
}

export default NewsList;

export async function getServerSideProps() {
  const res = await fetch(`http://jsonplaceholder.typicode.com/news`);
  const data = await res.json();

  return {
    props: {
      articles: data,
    },
  };
}
