import { Application, send } from "https://deno.land/x/oak/mod.ts";
import * as render from './public/login.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";
const db = new DB("tgt.db");
const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/', list)
    .get('/post/new', add)
    .get('/post/:id', show)
    .post('/post', create);

function query(sql) {
    let list = []
    for (const [id, title, body] of db.query(sql)) {
        list.push({ id, title, body })
    }
    return list
}

async function list(ctx) {
    let posts = query("SELECT id, title, body FROM posts")
    console.log('list:posts=', posts)
    ctx.response.body = await render.list(posts);
}

async function add(ctx) {
    ctx.response.body = await render.newPost();
}

async function show(ctx) {
    const pid = ctx.params.id;
    let posts = query(`SELECT id, title, body FROM posts WHERE id=${pid}`)
    let post = posts[0]
    console.log('show:post=', post)
    if (!post) ctx.throw(404, 'invalid post id');
    ctx.response.body = await render.show(post);
}

async function create(ctx) {
    const body = ctx.request.body()
    if (body.type === "form") {
        const pairs = await body.value
        const post = {}
        for (const [key, value] of pairs) {
            post[key] = value
        }
        console.log('create:post=', post)
        db.query("INSERT INTO posts (title, body) VALUES (?, ?)", [post.title, post.body]);
        ctx.response.redirect('/');
    }
}

app.use(async (ctx) => {
    console.log('path=', ctx.request.url.pathname)
    await send(ctx, ctx.request.url.pathname, {
        root: Deno.cwd() + '/public/',
        index: "case.html",
    });
});


console.log('start at : http://127.0.0.1:8000')

await app.listen({ port: 8000 });