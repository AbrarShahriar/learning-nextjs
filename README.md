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
  // we use fetch api to fetch some data eg. 100 posts
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

## Inspecting the build output

After running `npm run build`, the output will be something like this in the terminal:

```javascript
Page/Routes                       Size     First Load JS
┌ ○ / 
├   ^ /*this is the root page*/   1.68 kB        68.3 kB 
├   /_app                         0 B            66.6 kB
├ ○ /404                          194 B          66.8 kB
├ ● /posts (310 ms)               1.71 kB        68.3 kB
+ First Load JS shared by all     66.6 kB // this is required for each route
  ├ chunks/framework.b97a0e.js    42 kB
  ├ chunks/main.62b8ca.js         23.3 kB
  ├ chunks/pages/_app.a40023.js   555 B   // _app.js is a component that wraps every page
  ├ chunks/webpack.1a8a25.js      729 B
  └ css/120f2e2270820d49a21f.css  209 B

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
```

The build output will be stored in `.next` folder in the root of the project. But we will focus on the `/server` and `/static` folders.

The `.next` folder structure looks something like this: 

```
 / 
 /cache
 /server
    /chunks
    /pages
        /_app.js
        /_document.js
        /_error.js
        /404.html
        /500.html
        /index.html
        /posts.html
        /...other
    /...other
 /static  
    /chunks
        /pages
        /...other
    /css
    /...other
 /...other   
```

The files in `/server` folder cant be sent to the client. So how does hydration work in this context??

This is where `/static` folder comes into picture.
The files in `/static/chunks/pages` can be sent to the client. The files will contain code to hydrate the DOM so that it can be interactive.

#### Let's run our built app

To run our built app we have to serve the code in `.next` folder. To do that run the script `npm start`.

The app will be run on `localhost:3000`. Let's visit the page and look at the network tab on the developer console. 

We should see a `localhost` resource which refers to `/.next/server/pages/index.html`. The other resources are files needed to render the `/` route.

NOTE: The files related to `/posts` route will not be downloaded unless the `/` route contains links to the respective route.

When we visit a route, it's index and chunk file will be downloaded.

NOTE: When we directly visit `/posts` route from the address bar, the `/server/pages/posts.html` is served. And when we go to `/posts` route from a link or through another page, then the `/server/pages/posts.json` and the chunk from `/static/pages/posts/` is served which then builds the UI client-side.

## Dynamic Parameters

Suppose we want routes like these: 

  `/posts/[postId]`

First we will create `/pages/posts/index.html` and write the following code: 

```javascript
import Link from "next/link";

export default function PostList({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.id}`} passHref>
          <h2>
            {post.title}
          </h2>
        </Link>
      ))}
    </div>
  );
}

export async function getStaticProps() {
  // returns 100 posts
  const res = await fetch(`http://jsonplaceholder.typicode.com/posts`);

  const data = await res.json();

  return {
    props: {
      // we will slice the array and return 3 posts
      posts: data.slice(0, 3),
    },
  };
}
```

When we visit this route we should see the first 3 posts.

Now, for dynamic parameters like `/posts/1`, `/posts/2`, `/posts/3` etc we need to create a `[postId].js` file inside `/posts` and code something like this: 

```javascript
export default function PostDetail({ post }) {
  return (
    <>
      <h1>{post.title}</h1>
      <p>{post.id}</p>
      <p>{post.body}</p>
    </>
  );
}

// this is required for dynamic SSG pages
// NOTE: Why getStaticPaths?
/*
*   For SSG pages, each route is pre-built. But for dynamic SSG pages, we don't know the exact number of pages needed to be pre-rendered.
*   NEXT doesn't know the possible values for eg 1-1000 for postId. It doesn't know how many pages has to be pre-rendered. So, we need to tell it what values NEXT has to consider while building the app.
*/
// NOTE: How?
/*
*   Create an async function 'getStaticPaths' and return an object:
{
  paths: [
    {
      params: { dynamicParamName: 'possibleValue' }
    }
  ],
  fallback: Boolean | 'blocking'
}
*/
export async function getStaticPaths() {
  /*
    For this context, we fetched 3 posts so we will have 3 possible values for our dynamic parameter
  */
  return {
    paths: [
      {
        params: { postId: '1' }
      },
      {
        params: { postId: '2' }
      },
      {
        params: { postId: '3' }
      },
    ],
    fallback: false,
  };
}

export async function getStaticProps(context) {
  // extract the postId
  const { params } = context;

  // use it to create dynamic param
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
```

#### Let's inspect `getStaticPaths` builds!

After running the build command we should see this in the terminal:

```javascript
Page/Routes                       Size     First Load JS
┌ ○ / 
├   ^ /*this is the root page*/   1.68 kB        68.3 kB 
├   /_app                         0 B            66.6 kB
├ ○ /404                          194 B          66.8 kB
├ ● /posts                        1.71 kB        68.3 kB
├ ● /posts/[postId]               347 B            67 kB
├   ├ /posts/1 
├   ├ /posts/2 
├   ├ /posts/3 
+ First Load JS shared by all     66.6 kB // this is required for each route
  ├ chunks/framework.b97a0e.js    42 kB
  ├ chunks/main.62b8ca.js         23.3 kB
  ├ chunks/pages/_app.a40023.js   555 B   // _app.js is a component that wraps every page
  ├ chunks/webpack.1a8a25.js      729 B
  └ css/120f2e2270820d49a21f.css  209 B

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
```

And inside of `.next` folder, we should see something like this: 

```
 / 
 /cache
 /server
    /chunks
    /pages
        /posts
            /[postId].js
            /1.html      <-- pre-built html
            /1.json      <-- pre-fetched json
            /2.html
            /2.json
            /3.html
            /3.json
        /_app.js
        /_document.js
        /_error.js
        /404.html
        /500.html
        /index.html
        /posts.html
        /...other
    /...other
 /static  
    /chunks
        /pages
        /...other
    /css
    /...other
 /...other   
```

**But wait! what if we have hundreds or even thousands of posts? Will we have to manually add each path to `getStaticPaths`?**

Let's work on that. 
First go back to `index.js` and remove the slice method from the `data` so that we get all the 100 posts from the API.
Then go to `[postId].js` and replace the current `getStaticPaths` with this code:

```javascript
export async function getStaticPaths() {
  //we get all the posts from the API
  const res = await fetch(`http://jsonplaceholder.typicode.com/posts`);
  const data = await res.json();

  // we extract the ids from each post and dynamically create an object to be returned with all the paths
  const paths = data.map((post) => {
    return {
      params: { postId: `${post.id}` },
    }
  });

  return {
    paths,
    fallback: false,
  };
}
```

And now if we run the build command we should see this in the terminal:

```javascript
Page/Routes                       Size     First Load JS
┌ ○ / 
├   ^ /*this is the root page*/   1.68 kB        68.3 kB 
├   /_app                         0 B            66.6 kB
├ ○ /404                          194 B          66.8 kB
├ ● /posts (310 ms)               1.71 kB        68.3 kB
├ ● /posts/[postId] (20488 ms)    347 B            67 kB
├   ├ /posts/51 (841 ms)
├   ├ /posts/50 (785 ms)
├   ├ /posts/57 (776 ms)
├   ├ /posts/65 (686 ms)
├   ├ /posts/53 (673 ms)
├   ├ /posts/4 (594 ms)
├   ├ /posts/12 (589 ms)
├   └ [+93 more paths]
└ ● /users                        364 B            67 kB
+ First Load JS shared by all     66.6 kB // this is required for each route
  ├ chunks/framework.b97a0e.js    42 kB
  ├ chunks/main.62b8ca.js         23.3 kB
  ├ chunks/pages/_app.a40023.js   555 B   // _app.js is a component that wraps every page
  ├ chunks/webpack.1a8a25.js      729 B
  └ css/120f2e2270820d49a21f.css  209 B

λ  (Server)  server-side renders at runtime (uses getInitialProps or getServerSideProps)
○  (Static)  automatically rendered as static HTML (uses no initial props)
●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
   (ISR)     incremental static regeneration (uses revalidate in getStaticProps)
```

So, now we are clear about basic dynamic params. But theres still something we need to talk about. And that's the `fallback` key from `getStaticPaths` returned object.

### Possible Values:

- true
- false
- 'blocking'

#### false:

1. The paths returned (suppose 3 paths are returned) will be rendered to HTML at build time eg. '1.html', '2.html', '3.html'.
2. Paths that are not returned will result in a 404 page eg. visiting '4.html' will throw 404

**When to use false?**
 
- Small number of paths to pre-render
- New pages aren't added often

#### true:

1. The paths returned (suppose 3 paths are returned) will be rendered to HTML at build time eg. '1.html', '2.html', '3.html'. (same as 'false')
2. Paths that are not returned will NOT result in a 404 page instead, a "fallback" version of the page will be served eg. visiting '4.html' will NOT throw 404 instead a fallback will be shown
3. In the background, NEXT will statically generate the requested path HTML and JSON. This includes running `getStaticProps`.
4. When that's done (point 3), the browser receives the JSON for the generated path. This JSON will be used to swap the fallback version with the receives JSON's data. Kind of like YouTube's skeleton component.
5. Future requests to that same route will not show the fallback instead it will show the generated JSON from point 3.

Let's see an example to understand better. We will go back to the `[postId].js` file and change a few things:

```javascript
import { useRouter } from 'next/router';

export default function PostDetail({ post }) {
  // initialize router
  const router = useRouter()

  // check if fallback is allowed or not
  if(router.isFallback) {
    // if allowed, show the fallback eg. loading screen
    // right now NEXT is building the page by calling `getStaticProps`
    return <h1>Loading...</h1>
  }

  // if fallback is not allowed or NEXT is done building the page show this
  return (
    <div className="PostDetail">
      <h1>{post.title}</h1>
      <p>{post.id}</p>
      <p>{post.body}</p>
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: { postId: '1' }
      },
      {
        params: { postId: '2' }
      },
      {
        params: { postId: '3' }
      },
    ],
    fallback: true,
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
```

Okay so what if the user visits an unavailable route eg. `/posts/999` and we don't have a 999th post. What should we do then? 

We could show a 404 page. Here's how we do it:

Go to `[postId].js` file and add a few lines of code to check if a post is available or not.

```javascript
import { useRouter } from 'next/router';

...

export async function getStaticProps(context) {
  const { params } = context;
  const res = await fetch(
    `http://jsonplaceholder.typicode.com/posts/${params.postId}`
  );

  const data = await res.json();

  /* 
  if there is not post, we cant access the id key. so we return an object
  {
    notFound: Boolean
  }
  */
  if(!data.id) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post: data,
    },
  };
}
```

**Another edge case: What if we fetch all the 100 posts and use NEXT's `Link` tag to attach them to the DOM. But we only return 3 paths from `getStaticPaths` and then we visit `/posts/99`??** 

We do have 99th post but we didnt return it in `getStaticPaths`.
We won't see the fallback because when we fetched 100 posts NEXT saved it in a `posts.json` file and when we visit the `/posts/99` page, NEXT will fetch the data from the `posts.json` file and render it in the UI!  

It also behaves as an infinite scrolling too!

**When to use true?**
 
- Large number of paths to pre-render that depend on data.
- New pages are added often

#### 'blocking':

1. The paths returned (suppose 3 paths are returned) will be rendered to HTML at build time eg. '1.html', '2.html', '3.html'. (same as false or true)
2. Paths that are not returned will NOT result in a 404 page instead, on the first request, NEXT will render the page server-side and return the generated HTML. While NEXT is rendering the page, the browser will show loading. (NOTE: this loading state is handled by the browser)
3. When that's done (point 2), the browser receives the generated HTML. There will be no fallback/loading state
4. Future requests to that same route will not show the fallback instead it will show the generated HTML from point 2.

**When to use false?**
 
- To avoid layout shifts
- Large number of paths to pre-render
- New pages are added often

## Issues of static generation

- The build time increases proportionantely with page numbers. The more pages you have, the longer it will take to build the app.
- The app will fetch the API data build-time, meaning unless you rebuild the app, the data will always be the old data.

To deal with these issues, NEXT intorduced *Incremental Static Regeneration (ISR)*.
ISR allows us to update static pages after we've built our application.

**How to make use of ISR?**<br>

1. In the `getStaticProps` function's return object `({ props: {...props} })`, we can specify a `revalidate` key. 
2. The **value** for this key is the **number of seconds after which a page re-generation** can occur.

Let's do some coding!
We will go to our `[postId].js` file and do a few tweaks:

```javascript

...

export async function getStaticPaths() {
  const res = await fetch(`http://jsonplaceholder.typicode.com/posts`);
  const data = await res.json();

  // we will generate only the first product page on build time. The other pages will be statically generated on initial request.
  return {
    paths: [ {params: { postId: '1' }} ],
    fallback: true,
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
    // NOTE: this new 'revalidate' key will enable ISR mode.
    revalidate: 10
  };
}
```

Now if we build and serve the app, we will see the initial data. Nothing fancy right? But wait, there's more.

If we update the data and refresh the page after 10sec, NEXT will regenerate that page and serve it to us. 
But there's a catch, if we refresh the page even 100 times **BEFORE** 10sec, NEXT will serve the previously built/cached page.

We almost understand the concept of ISR. But there's a confusing behavior that we have to understand to fully grasp the power of ISR.

To understand that, we have to do a little tweak to our code in `[postId].js` file

```javascript
export async function getStaticProps(context) {
  
  ...

  return {
    props: {
      post: data,
    },
    // NOTE: this new 'revalidate' key will enable ISR mode.
    revalidate: 30 // <= we increased the refresh time frame
  };
```

And now if we build and serve the app, we will see the initial data. But if we update and reload the page after 30sec, we should see the updated data right?

NO :) this is the behavior that confuses most of the developers out there.

So what is actually happening in the background?

NEXT will serve the previously built/cached page while:

1. Regenaration is occuring (it takes little time but still takes time right?!)
2. Regeneration fails for some reason
3. There's no change in data.

So, when we update the data and refresh the page exactly after 30sec (say we refresh at the 31.5sec mark), NEXT will be re-generating the page. While it is doing that, NEXT will send the previously built/cached page so that the user doesn't see a blank page.

Revalidation could be of 1sec too. But what if we need realtime data? What if we can't afford having even 1sec delay?
That's when we learn about the 2nd type of pre-rendering: **Server-side Rendering**