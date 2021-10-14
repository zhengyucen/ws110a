import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();


app.use((ctx) => {
    ctx.response.body = `<html>
        <style>
    td {
        width: 80px;
        text-align: left;
    }
</style>

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
console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });