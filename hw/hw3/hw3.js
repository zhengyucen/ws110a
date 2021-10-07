import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const router = new Router();
router
    .get("/", (context) => {
        context.response.body = `<html>

<script>
    var tab = "<table>";
    tab += "<tr>" + "<td>" + '  ' + "</td>";
    for(k = 1; k < 10; k++){
        tab +="<td>" + k + "</td>";
    }
    tab += "</tr>"
    for (i = 1; i < 10; i++) {
        tab += "<tr>"+"<td>" + i + "</td>";
        for (j = 1; j <= 9; j++) {
           tab += "<td>" + i * j + "</td>"; 
        }
        tab += "</tr>"
    }
    tab += "<table>";
    document.write(tab);
</script>
        </html>`

    });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (ctx) => {
    console.log('path=', ctx.request.url.pathname)
    await send(ctx, ctx.request.url.pathname, {
        root: Deno.cwd(),
        index: "table.css",
    });
});


console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });

