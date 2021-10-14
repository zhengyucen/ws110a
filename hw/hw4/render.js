export function layout(title, content) {
  return `
  <html>
  <head>
    <title>${title}</title>
    <style>
      body {
        padding: 80px;
        font: 16px Helvetica, Arial;
      }
  
      h1 {
        font-size: 2em;
      }
  
      h2 {
        font-size: 1.2em;
      }

      h3 {
        font-size: 0.8em;
      }
  
      #posts {
        margin: 0;
        padding: 0;
      }
  
      #posts li {
        margin: 40px 0;
        padding: 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        list-style: none;
      }
  
      #posts li:last-child {
        border-bottom: none;
      }
  
      textarea {
        width: 500px;
        height: 300px;
      }
  
      input[type=text],
      textarea {
        border: 1px solid #eee;
        border-top-color: #ddd;
        border-left-color: #ddd;
        border-radius: 2px;
        padding: 15px;
        font-size: .8em;
      }
  
      input[type=text] {
        width: 500px;
      }
    </style>
  </head>
  <body>
    <section id="content">
      ${content}
    </section>
  </body>
  </html>
  `
}

export function list(posts) {
  let list = []
  for (let post of posts) {
    list.push(`
    <li>
      <h2>${post.title}</h2>
      <h3>${post.bdaytime}</h3>
      <p><a href="/post/${post.id}">查看行程</a></p>
    </li>
    `)
  }
  let content = `
  <h1>行事曆</h1>
  <p>你有 <strong>${posts.length}</strong>個 行程</p>
  <p><a href="/post/new">增加行程</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return layout('Posts', content)
}

export function newPost() {
  return layout('New Post', `
  <h1>新的行程</h1>
  <p>加入一個新的行程</p>
  <form action="/post" method="post">
    <p><input type="text" placeholder="標題" name="title"></p>
    <p><textarea placeholder="內容" name="body"></textarea></p>
    <p><input type="datetime-local" name="bdaytime"></p>
    <p><input type="submit" value="Create"></p>
  </form>
  `)
}

export function show(post) {
  return layout(post.title, `
    <h1>${post.title}</h1>
    <h2>${post.bdaytime}</h2>
    <p>${post.body}</p>
  `)
}
