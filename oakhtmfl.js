import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();


app.use((ctx) => {
    ctx.response.body =
        `
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>登入頁面</title>
                <link rel="stylesheet" type ="text/css" href="login.css"/>
                <script type ="text/javascript" src="login.js"></script>
            </head>
            <body>
                <div id="login_frame">
                    <form method="post" action="login.js">
                        <p><label class="label_input">使用者名稱:</label><input type="text" id="username" class="text_field" /></p>
                        <p><label class="label_input">使用者密碼:</label><input type="password" id="password" class="text_field" /></p>
                        <div id="login_control">
                            <input type="button" id="btn_login" value="登入" onclick="login();" />
                            <input type="button" id="forget_pwd" value="忘記密碼" onclick="forgot();" />
                            
                        </div>
                    </form>
                </div>
                <script>
                    function login(){

                    }
                </script>
            </body>
        </html>
`
});
console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });