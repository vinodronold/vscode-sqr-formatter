'use strict'
import { EOL } from 'os'

const reBegin = new RegExp(/^begin|declare/, "i")
const reEnd = new RegExp(/^end/, "i")
const reComments = new RegExp(/^!/)
let indentLevel: number = 0

const decrementIndend = () => {
    indentLevel--
    if (indentLevel < 0) {
        indentLevel = 0
    }
}

const formattedLine = (ln: string) => {
    console.log(indentLevel, ln)
    return (' '.repeat(indentLevel * 4) + ln)
}

const formatLine = (line: string) => {
    switch (true) {
        case reComments.test(line):
            // DO NOT INDEND 
            //console.log('comment')
            break;
        case reEnd.test(line):
            decrementIndend()
            line = EOL + formattedLine(line)
            //console.log('end')
            break
        case reBegin.test(line):
            line = formattedLine(line) + EOL
            indentLevel++
            //console.log('begin')
            break
        default:
            line = formattedLine(line)
        //console.log('default')
    }
    return line
}

const format = (doc: string) => {
    console.log('Begin Format . . . ')
    let docLines: Array<string> = doc.split(EOL)
    docLines = docLines.map(l => l.trim()).filter((l) => (l.length > 0))
    return docLines.map(formatLine).join(EOL)
}

export default format