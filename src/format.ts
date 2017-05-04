'use strict'
import { EOL } from 'os'

const reBegin = new RegExp(/^(begin|declare)/, "i")
const reConditions = new RegExp(/^(if|#if|evaluate|when)/, "i")
const reEnd = new RegExp(/^(end|#end|else|#else|break)/, "i")
const reComments = new RegExp(/^!/)
let indendLevel: number = 0

const reBeginSelect = new RegExp(/^(begin-select)/, "i")
const reEndSelect = new RegExp(/^(end-select)/, "i")
let beginSelectBlock: boolean = false

let formattedDoc: Array<string> = []

const incrementIndend = () => indendLevel++
const decrementIndend = () => {
    indendLevel--
    if (indendLevel < 0) {
        indendLevel = 0
    }
}

const formattedLine = (ln: string, level: number) => {
    //console.log(level, ln)
    return (' '.repeat(level * 4) + ln)
}

const formatDoc = (line: string) => {

    if (beginSelectBlock) {
        if (line.substring(0, 1) === ' ') {
            beginSelectBlock = false
        } else {
            return line.trim()
        }
    }

    line = line.trim()
    switch (true) {
        case reComments.test(line):
            // DO NOT INDEND 
            //console.log('comment')
            break
        case reBeginSelect.test(line):
            line = EOL + line
            beginSelectBlock = true
            //console.log('BeginSelect')
            break
        case reEndSelect.test(line):
            line = line + EOL
            //console.log('EndnSelect')
            break
        case reBegin.test(line):
            line = EOL + formattedLine(line, indendLevel)
            incrementIndend()
            //console.log('begin')
            break
        case reEnd.test(line):
            decrementIndend()
            line = formattedLine(line, indendLevel) + EOL
            //console.log('end')
            break
        case reConditions.test(line):
            line = EOL + formattedLine(line, indendLevel)
            incrementIndend()
        default:
            line = formattedLine(line, indendLevel)
        //console.log('default')
    }
    return line
}

const format = (doc: string) => {
    console.log('Begin Format . . . ')
    let docLines: Array<string> = doc.split(EOL)
    docLines = docLines.filter((l) => (l.trim().length > 0))
    return docLines.map(formatDoc).join(EOL)
}

export default format