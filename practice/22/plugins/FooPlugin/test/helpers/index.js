import path from "path";
import webpack from "webpack";
import { merge } from "webpack-merge";
import { createFsFromVolume, Volume } from "memfs";
export function runCompile(options) {
    const opt = merge({
        mode: 'development',
        devtool: false,
        // Mock 项目入口文件
        entry: path.join(__dirname, "./enter.js"),
        output: { path: path.resolve(__dirname, "../dist") },
    }, options);
    const compiler = webpack(opt);
    // 使用内存文件系统，节省磁盘 IO 开支
    compiler.outputFileSystem = createFsFromVolume(new Volume());
    return new Promise((resolve, reject) => {
        compiler.run((error, stats) => {
            if (error) {
                return reject(error);
            }
            return resolve({ stats, compiler });
        });
    });
}