
import * as fs from 'fs';



export class LogFileManager {

    public static getOutputDirectory() : string {

        return process.cwd() + '/output';
        //console.log('current Dir: ',  process.cwd());
    }

    public static getFileExtensionCSV() : string {
        return '.transactions.csv';
    }

    public static getFileExtensionJSON() : string {
        return '.transactions.json';
    }

    public static getLogConfigName() : string {
        if (process.env.NODE_ENV && process.env.NODE_ENV !== '') {
            return process.env.NODE_ENV;
        } else {
            return 'output';
        }
    }

    public static ensureOutputPath() {
        if (!fs.existsSync(this.getOutputDirectory()))
        {
            fs.mkdirSync(this.getOutputDirectory());
        }
    }

    public static getOutputPathCSV() {
        return `${LogFileManager.getOutputDirectory()}/${LogFileManager.getLogConfigName()}${LogFileManager.getFileExtensionCSV()}`;
    }
    
    public static getOutputPathJSON() {
        return `${LogFileManager.getOutputDirectory()}/${LogFileManager.getLogConfigName()}${LogFileManager.getFileExtensionJSON()}`;
    }

    public static writeCSVOutput(csv: string) {
        LogFileManager.ensureOutputPath();
        fs.writeFileSync(this.getOutputPathCSV(), new Buffer(csv));
    }

    public static writeJSONOutput(json: string) {
        LogFileManager.ensureOutputPath();
        fs.writeFileSync(this.getOutputPathJSON(), new Buffer(json));
    }
}
