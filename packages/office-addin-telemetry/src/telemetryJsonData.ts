
import * as chalk from "chalk";
import * as fs from "fs";
import * as defaults from "./defaults";
import { telemetryLevel } from "./officeAddinTelemetry";

/**
 * Allows developer to check to check if the program has already prompted before
 * @param groupName Group name of the telemetry object
 * @returns Boolean of whether the program should prompt
 */
export function needToPromptForTelemetry(groupName: string): boolean {
    try {
        return !groupNameExists(groupName);
    } catch (err) {
        console.log(chalk.default.red(err));
    }
}

/**
 * Allows developer to add or modify a specific property to the group
 * @param groupName Group name of property
 * @param property Property that will be created or modified
 * @param value Property's value that will be assigned
 */
export function modifyTelemetryJsonData(groupName: string, property: any, value: any): void {
    try {
        if (fs.existsSync(defaults.telemetryJsonFilePath)) {
            if (groupNameExists(groupName)) {
                const telemetryJsonData = readTelemetryJsonData();
                telemetryJsonData.telemetryInstances[groupName][property] = value;
                fs.writeFileSync(defaults.telemetryJsonFilePath, JSON.stringify((telemetryJsonData), null, 2));
            }
        }
    } catch {
        console.log(chalk.default.red("Could not modify property!\n Make sure the group name and file exists!"));
    }
}
/**
 * Reads data from the telemetry json config file
 * @returns Parsed object from json file if it exists
 */
export function readTelemetryJsonData(): any {
    if (fs.existsSync(defaults.telemetryJsonFilePath)) {
        const jsonData = fs.readFileSync(defaults.telemetryJsonFilePath, "utf8");
        return JSON.parse(jsonData.toString());
    }
}
/**
 * Returns telemetry level of telemetry object
 * @param groupName Group name to search for in the specified json data
 * @returns Telemetry level specific to the group name
 */
export function readTelemetryLevel(groupName: string): telemetryLevel {
    const jsonData = readTelemetryJsonData();
    return jsonData.telemetryInstances[groupName].telemetryLevel;
}
/**
 * Returns telemetry property of telemetry object
 * @param groupName Group name to search for in the specified json data
 * @param propertyName Property name that will be used to access and return the associated value
 * @returns Property of the specific group name
 */
export function readTelemetryObjectProperty(groupName: string, propertyName: string): any {
    const jsonData = readTelemetryJsonData();
    return jsonData.telemetryInstances[groupName][propertyName];
}
/**
 * Writes to telemetry config file either appending to already existing file or creating new file
 * @param groupName Group name of telemetry object
 * @param telemetryLevel Whether user is sending basic or verbose telemetry
 */

export function writeTelemetryJsonData(groupName: string, level: telemetryLevel): void {
    if (fs.existsSync(defaults.telemetryJsonFilePath) && fs.readFileSync(defaults.telemetryJsonFilePath, "utf8") !== "") {
        if (groupNameExists(groupName)) {
            modifyTelemetryJsonData(groupName, "telemetryLevel", level);
        } else {
            const telemetryJsonData = readTelemetryJsonData();
            telemetryJsonData.telemetryInstances[groupName] = { telemetryLevel: String };
            telemetryJsonData.telemetryInstances[groupName].telemetryLevel = level;
            fs.writeFileSync(defaults.telemetryJsonFilePath, JSON.stringify((telemetryJsonData), null, 2));
        }
    } else {
        let telemetryJsonData = {};
        telemetryJsonData[groupName] = level;
        telemetryJsonData = { telemetryInstances: telemetryJsonData };
        telemetryJsonData = { telemetryInstances: { [groupName]: { ["telemetryLevel"]: level } } };
        fs.writeFileSync(defaults.telemetryJsonFilePath, JSON.stringify((telemetryJsonData), null, 2));
    }
}
/**
 * Checks to see if the given group name exists in the specified json data
 * @param groupName Group name to search for in the specified json data
 * @returns Boolean of whether group name exists
 */
export function groupNameExists(groupName: string): boolean {
    if (fs.existsSync(defaults.telemetryJsonFilePath) && fs.readFileSync(defaults.telemetryJsonFilePath, "utf8") !== "" && fs.readFileSync(defaults.telemetryJsonFilePath, "utf8") !== undefined) {
        const jsonData = readTelemetryJsonData();
        return Object.getOwnPropertyNames(jsonData.telemetryInstances).includes(groupName);
    }
    return false;
}
