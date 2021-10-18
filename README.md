# Pre-rendering & Data fetching

<hr>

## What is Pre-rendering and why do we need it?

  <p> Pre-rendering means generating the HTML before sending it to the client. But why do we have to do this? <p>

  <p> When we view the source of a React app, we only see an empty <code>div</code> tag with an id of <i>'root'</i>. The DOM nodes are then mounted with client-side javascript. <strong>This process is called <code><strong>Hydration</strong></code>.</strong> Which is bad for SEO because the Search Engine bots see an empty HTML page. Also it is heavy for clients as they have to wait for javascript file to be loaded and executed</p>

  <p>But on a NEXT app, it pre-renders the HTML on the server and then sends it to the client. So the Search Engine bots see a fully rendered HTML page with all of it's contents loaded which means it is less heavy for the client as everything is sent ready-made for them.</p>

#### Why Pre-render?

- Improves Performace
- Faster First-Load
- Helps with SEO

## Types of pre-rendering

1. **Static Generation** _(Recommended)_
   <p>HTML pages are generated at build time. Pages can be built once, cached by a CDN and served almost instantly. NEXT does it by default!</p>

   <strong>When to use it?</strong>
   <ul>
      <li>Blog Pages</li>
      <li>E-Commerce Product Pages</li>
      <li>Documentation</li>
      <li>Marketing Pages</li>
      <li>...etc</li>
   </ul>

   <strong>Types of Static Generations:</strong>
   <ol>
   <li>without data</li>
   <li>with data</li>
   <li>incremental static generation</li>
   <li>dynamic params when fetching data</li>
   </ol>

2. **Server-side rendering**

- data-fetching

## Code!!

<p>Let's write some code and then understand line by line what's happening.</p>

```javascript
// Create a React Component and default export it.
// This component will use the fetched data
export default function PostList(props) {
  return (
    <div>
      {props.posts.map((post) => (
        <Post key={post.id} postData={post} />
      ))}
    </div>
  );
}

// Export an async function called 'getStaticProps' that returns an object
// The function name is NOT a convention, it must be the same.
export async function getStaticProps() {
  // we use fetch api to fetch some data
  const res = await fetch(`/api_url/posts`);

  // We convert it to JSON
  const data = await res.json();

  // log the data.
  // An interesting thing will happen here
  console.log(data);
  // NOTE: This log will output in the terminal NOT in the browser because this function will run on the server NOT on the client device

  // Return the following object
  return {
    props: {
      posts: data,
    },
  };
  /*
   * NOTE: the 'props' property of the returned object
   *  will then be passed/merged onto the
   * 'PostList' component's props,
   *  which can be accessed via 'props.posts'
  */
}
```

<br>
<br>
<p>Things to keep in mind for <code>getStaticProps</code>:</p>

- **IT CAN ONLY BE USED IN THE `/pages` DIRECTORY**
- We can write server-side code in here.
- Access the file system with the `fs` module or query a database in here.
- You can use API keys or any type of secret keys in here as it is not included in the final bundle.
- It will run build time.