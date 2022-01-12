import { Application, send, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './home.js'
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("tgt.db");
const app = new Application();
const router = new Router();


app.use(router.routes());
app.use(router.allowedMethods());


router.get('/', list)
    .get('/login', loginUi)
    .get('/login', login)
    .get('/post/new', add)
    .get('/post/:id', show)
    .post('/post', create);



function query(sql) {
    let list = []
    for (const [id, account, password] of db.query(sql)) {
        list.push({ id, account, password })
    }
    return list
}

async function list(ctx) {
    let posts = query("SELECT id, account, password FROM account")
    console.log('list:posts=', posts)
    ctx.response.body = await render.list(posts);
}

async function add(ctx) {
    ctx.response.body = await render.newPost();
}

async function loginUi(ctx) {
    ctx.response.body = await render.login();
}

async function login(ctx) {
    const body = ctx.request.body()
    if (body.type === "form") {
        var user = await parseFormBody(body)
        console.log('user=', user)
        var dbUser = userMap[user.username]
        console.log('dbUser=', dbUser)
        if (dbUser.password === user.password) {
            ctx.state.session.set('user', user)
            console.log('session.user=', await ctx.state.session.get('user'))
            ctx.response.redirect('/');
        } else {
            ctx.response.body = 'Login Fail!'
        }
    }
}

async function show(ctx) {
    const pid = ctx.params.id;
    let posts = query(`SELECT id, account, password FROM account WHERE id=${pid}`)
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
        db.query("INSERT INTO account (account, password) VALUES (?, ?)", [post.account, post.password]);
        ctx.response.redirect('/');
    }
}




console.log('start at : http://127.0.0.1:8000')

await app.listen({ port: 8000 });