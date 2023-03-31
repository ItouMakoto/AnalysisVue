import babel from 'rollup-plugin-babel';
export default {
    input: './src/index.js',
    output: {
        format: 'umd',// window.Vue window上能直接访问name配置的属性 支持amd cmd commonjs规范
        name: 'Vue',
        file:'./dist/vue.js',
        sourcemap: true//源代码和打包的代码映射关系
    },
    plugins: [
        babel({
          exclude: 'node_modules/**' // 只编译我们的源代码
        })
    ]
}
