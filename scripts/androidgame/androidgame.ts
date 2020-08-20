import * as fs from 'fs';
import * as path from 'path';
export class AndroidgamePlugin implements plugins.Command {

    constructor() {
    }
    async onFile(file: plugins.File) {
        if (file.basename.indexOf('another.res.json') >= 0 ||
            file.path.indexOf('resource\\another\\') >= 0) {
            return null;
        }
        return file;
    }

    async onFinish(pluginContext: plugins.CommandContext) {

    }
}