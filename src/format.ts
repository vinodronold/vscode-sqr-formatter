'use strict'
import { EOL } from 'os'

const reBegin = new RegExp(/^(begin|declare|if|#if|evaluate|when)/, "i")
const reEnd = new RegExp(/^(end|#end|else|#else|break)/, "i")
const reComments = new RegExp(/^!/)
let indentLevel: number = 0

const incrementIndend = () => indentLevel++
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
            break
        case reBegin.test(line):
            line = EOL + formattedLine(line) + EOL
            incrementIndend()
            //console.log('begin')
            break
        case reEnd.test(line):
            decrementIndend()
            line = EOL + formattedLine(line) + EOL
            //console.log('end')
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