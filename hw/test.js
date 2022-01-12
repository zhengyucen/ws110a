const Koa = require('koa')
const router = require('koa-router')()
const koaBody = require('koa-body')
//koaBody用來處理
const app = new Koa()

const posts = []
//有用到router的函式都要傳入ctx
router
    .get('/', home)
    .get('/post/new', build)
    .post('/post', create)
    .get('/post/:id', show)//:id的內容都會存在ctx.params

app.use(koaBody())
app.use(router.routes())
app.listen(3000)
console.log(`server run at http://localhost:3000/`)

function home(ctx) {
    ctx.body = layout(homePage())
}
function homePage(ctx) {
    let content = []
    for (let i = posts.length - 1; i >= 0; i--) {
        content.push(
            `<li>
                <h2>${posts[i].title}</h2>
                <p><a href="/post/${posts[i].id}">Read this post</a></p>
            </li>`
        )
    }
    return `
    <html>
    <style>
    <head>
    <title>myblog</title>
    <style>
    body
    {
        background-color:#d0e4fe;
    }
    h1
    {
        color:#660033;
    }
    p
    {
        font-family:"Times New Roman";
        color:#660033;
        font-size:20px;
    }
    img
    {
        width:500px;
        height:100px;
    }
    </style>
    </head>
    <body>
    <h1>Welcome to your blog!</h1>
    <hr>
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAJ-dcs_uN7odL7IABnrKq5Gm8XviQ54pV8QYMEFpLHejBQ-RWTA&s">
    <p>You     have     ${posts.length}     posts     now     ~     </p>
    <button><a href="/post/new">Let's create a new post</a></button>
    <hr>
    <ol>${content.join('\n')}</ol>
    </body>
    </html>
    `
}
async function build(ctx) {
    ctx.body = await returnHTML()
}
async function create(ctx) {
    const post = ctx.request.body//ctx.request.body回傳一物件,類似JSON檔
    console.log("post = ", post)
    const id = posts.push(post) - 1 //push()方法會添加一個或多個元素至陣列的末端，並且回傳陣列的新長度。
    post.created_at = new Date()
    post.id = id
    ctx.redirect('/')

}
async function returnHTML() {
    return `
    <html>
    <head>
    <title>myblog</title>
    <style>
    body
    {
        background-color:#d0e4fe;
    }
    h1
    {
        color:#660033;
    }
    p
    {
        font-family:"Times New Roman";
        color:#660033;
        font-size:20px;
    }
    textarea
    {
        width:600px;
        height:300px;
    }
    img
    {
       　position:absolute;
       　right:80px;
    }
    button
    {
        width:120px;height:40px;border:2px #9999FF dashed;
    }
    </style>
    </head>
    <body>
    <h1>Create New Post</h1>
    <hr>
    <p>Write something!</p>
    <img src="data:image/jpeg;base64,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">
    <form action="/post" method="post">
        <p><input type="text" placeholder="Title" name="title"></p>
        <p><textarea placeholder="Contents" name="body"></textarea></p>
        
        <p><input type="submit" value="Create" style="width:120px;height:40px;border:2px #9999FF dashed;">
        <input type="reset" value="Reset" style="width:120px;height:40px;border:2px #9999FF dashed;">
        <button type="button" onclick="history.back()">Cancel</button></p>
    </form>
    </body>
    </html>
    `
}
async function show(ctx) {
    let post = posts[ctx.params.id]
    ctx.body = `
    <html>
    <head>
    <style>
    body
    {
        background-color:#d0e4fe;
    }
    h1
    {
        color:#660033;
    }
    p
    {
        font-family:"Times New Roman";
        color:#660033;
        font-size:20px;
    }
    </style>
    </head>
    <body>
    <h1>${post.title}</h1>
    <hr>
    <p>${post.body}</p>
    </body>
    </html>
    `
}

function layout(bodyHtml) {
    return `
    <html>
    <head>
    <style>
    body
    {
        background-color:#d0e4fe;
    }
    h1
    {
        color:#660033;
    }
    p
    {
        font-family:"Times New Roman";
        color:#660033;
        font-size:20px;
    }
    </style>
    </head>
    <body>
    ${bodyHtml}
    </body>
    </html>
    `
}