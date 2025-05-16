import { defineConfig } from "tsup"
import fs from "fs"

const filepaths: string[] = []

fs.readdirSync(`${process.cwd()}/src`).forEach((file) => filepaths.push(`./src/${file}`))
fs.readdirSync(`${process.cwd()}/docs/assets/js`).forEach((file) => fs.unlinkSync(`./docs/assets/js/${file}`))

export default defineConfig({
    entry: filepaths,
    minify: true,
    target: "es2015",
    sourcemap: true,
    format: ["iife"],
    injectStyle: true,
    clean: true,
    outDir: "./docs/assets/js",
    onSuccess: async () => {
        fs.readdirSync("./docs/assets/js").forEach((file) => {
            fs.renameSync(`./docs/assets/js/${file}`, `./docs/assets/js/${file.replace(".global.js", ".js")}`)

            const data = fs.readFileSync(`./docs/assets/js/${file.replace(".global.js", ".js")}`, "utf8").replace(`//# sourceMappingURL=${file}.map`, `//# sourceMappingURL=${file.replace(".global.js", ".js")}.map`)

            fs.writeFileSync(`./docs/assets/js/${file.replace(".global.js", ".js")}`, data);
        })
    },
    esbuildOptions(options) {
        options.define = { "process.env.NODE_ENV": JSON.stringify("production") }
        options.banner = { js: '"use client"', }
    },
})