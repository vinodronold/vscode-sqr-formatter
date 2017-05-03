'use strict'
import { EOL } from 'os'

const format = (doc: string) =>{
    console.log('Begin Format . . . ')
    let docLines: Array<string> = doc.split(EOL)
    console.log(docLines);
    
    return docLines.map(line => line.trim() + ' Formated').join(EOL)
}

export default format