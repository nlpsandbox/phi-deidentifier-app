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
    TextAnnotation,
    TextAnnotationFromJSON,
    TextAnnotationFromJSONTyped,
    TextAnnotationToJSON,
    TextIdAnnotationAllOf,
    TextIdAnnotationAllOfFromJSON,
    TextIdAnnotationAllOfFromJSONTyped,
    TextIdAnnotationAllOfToJSON,
} from './';

/**
 * An ID annotation in a text
 * @export
 * @interface TextIdAnnotation
 */
export interface TextIdAnnotation {
    /**
     * The position of the first character
     * @type {number}
     * @memberof TextIdAnnotation
     */
    start: number;
    /**
     * The length of the annotation
     * @type {number}
     * @memberof TextIdAnnotation
     */
    length: number;
    /**
     * The string annotated
     * @type {string}
     * @memberof TextIdAnnotation
     */
    text: string;
    /**
     * The confidence in the accuracy of the annotation
     * @type {number}
     * @memberof TextIdAnnotation
     */
    confidence: number;
    /**
     * Type of ID information
     * @type {string}
     * @memberof TextIdAnnotation
     */
    idType: TextIdAnnotationIdTypeEnum;
}

/**
* @export
* @enum {string}
*/
export enum TextIdAnnotationIdTypeEnum {
    Account = 'account',
    BioId = 'bio_id',
    Device = 'device',
    HealthPlan = 'health_plan',
    IdNumber = 'id_number',
    License = 'license',
    MedicalRecord = 'medical_record',
    Ssn = 'ssn',
    Vehicle = 'vehicle',
    Other = 'other'
}

export function TextIdAnnotationFromJSON(json: any): TextIdAnnotation {
    return TextIdAnnotationFromJSONTyped(json, false);
}

export function TextIdAnnotationFromJSONTyped(json: any, ignoreDiscriminator: boolean): TextIdAnnotation {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'start': json['start'],
        'length': json['length'],
        'text': json['text'],
        'confidence': json['confidence'],
        'idType': json['idType'],
    };
}

export function TextIdAnnotationToJSON(value?: TextIdAnnotation | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'start': value.start,
        'length': value.length,
        'text': value.text,
        'confidence': value.confidence,
        'idType': value.idType,
    };
}


