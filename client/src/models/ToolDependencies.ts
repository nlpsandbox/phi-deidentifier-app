/* tslint:disable */
/* eslint-disable */
/**
 * NLP Sandbox PHI Deidentifier API
 * # Introduction This NLP tool takes as input a clinical note and returned a de-identified version of the note. This design of this API is a work in progress. # Examples - [NLP Sandbox PHI Deidentifier Example](https://github.com/nlpsandbox/phi-deidentifier-example) 
 *
 * The version of the OpenAPI document: 1.2.0
 * Contact: team@nlpsandbox.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import {
    Tool,
    ToolFromJSON,
    ToolFromJSONTyped,
    ToolToJSON,
} from './';

/**
 * A list of tool dependencies
 * @export
 * @interface ToolDependencies
 */
export interface ToolDependencies {
    /**
     * A list of tools
     * @type {Array<Tool>}
     * @memberof ToolDependencies
     */
    tools: Array<Tool>;
}

export function ToolDependenciesFromJSON(json: any): ToolDependencies {
    return ToolDependenciesFromJSONTyped(json, false);
}

export function ToolDependenciesFromJSONTyped(json: any, ignoreDiscriminator: boolean): ToolDependencies {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tools': ((json['tools'] as Array<any>).map(ToolFromJSON)),
    };
}

export function ToolDependenciesToJSON(value?: ToolDependencies | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tools': ((value.tools as Array<any>).map(ToolToJSON)),
    };
}


