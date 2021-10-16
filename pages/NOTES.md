# ROUTING

* Entry point to routing is `/` route.
    * `/` route resides in `/pages/index.js`

* Create *.js files to create routes.
    * `pages/about.js` means `http://localhost:3000/about`.

* Create folders with the route name
    * ie. `/product` and create `/product/index.js` to create folder based routes for future nested routing implementation.

* To create nested routes,
    * ie `http://localhost:3000/product/3`, we can do it in 2 ways,
         1) file based: `[*.js]`. Square brackets are must.
         2) folder based: [name]. Square brackets are must. In folder based nested routing, the directory structure will look something like this:
                
                * /product
                * index.js
                    * /[id]
                     * index.js
                        * /review
                           * index.js
                           * [reviewId].js // the name 'reviewId' will be then name we will use in code.
                  
                
                
            We can access these routes via:
            
                > To watch the main `product` route go to `http://localhost:3000/product`
                > To watch individual product detail go to `http://localhost:3000/product/3`
                > To watch each product's review go to `http://localhost:3000/product/3/review/1`

    * How to access the query parameters? <br><br>
        `@React.Component` means wrapped in a React Component. `@` syntax means decorator function.<br>

        ```javascript
        import { useRouter } from "next/router";
        @React.Component
        const router = useRouter();
        const { id, reviewId } = router.query;
        ```

        We can only access the `reviewId` variable only if we are in this route: `http://localhost:3000/product/3/review/1`

* **Catch All Routes**
    * Create a file/folder with a name like this: `[[...params]](.js)`.
    Here `params` can be anything but the double square brackets are must.
    Suppose we a scenario where we have routes like these: <br><br>
        `http://localhost:3000/docs/feature1/concept1`, <br>
        `http://localhost:3000/docs/feature2/concept2`, <br>
        `http://localhost:3000/docs/feature3/concept3`, <br>
        `http://localhost:3000/docs/feature4/concept4`, <br>
        `http://localhost:3000/docs/feature5/concept5`, <br>
        `http://localhost:3000/docs/feature6/concept6`, <br>
        .............................................. <br>
        `http://localhost:3000/docs/feature$id/concept$id` <br>
        To manage stuff like this we need something called **Catch All Routes**<br>

    * How to use the parameters?<br>

        Here is an example:
        ```javascript
        //import the router from next
        import { useRouter } from "next/router";

        export default function Docs() {

        // initialize the router
        const router = useRouter();

        /** get the params.
        * here the params will return an array with the parameters
        * it will return null if we are in `/docs/` route
        * it will return ['feature$id'] for `/docs/feature$id` route
        * it will return ['feature$id', 'concept$id'] for `/docs/feature$id/concept$id` route
        */
        const { params = [] } = router.query;

        // if the params are two, meaning we are in `/docs/feature$id/concept$id`, then the array will be ['feature$id', 'concept$id']
        if (params.length === 2) {
            return (
            <h1>
                Feature {params[0]} concept {params[1]}
            </h1>
            );

        // if the params are one, meaning we are in `/docs/feature$id`, then the array will be ['feature$id']
        } else if (params.length === 1) {
            return <h1>Feature {params[0]}</h1>;
        }

        // if we are in `/docs`, then the `params` will be null
        return <h1>Docs Page</h1>;
        }
        ```
* **Custom 404 page**
    * Create `404.js` file in `/pages`. This file will replace NEXT's default 404 page.
