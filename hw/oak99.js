import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
function table99() {
    let table = []
    for (let i = 1; i <= 9; i++) {
        let row = [i]
        for (let j = 1; j <= 9; j++) {
            row.push(i * j)
        }
        table.push(row.join(' '))
    }
    return '  1 2 3 4 5 6 7 8 9\n' + table.join('\n')
}

app.use((ctx) => {
    ctx.response.body = table99()
}
)
console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });