'use strict'
import { EOL } from 'os'
const conditions = 'if|#if|evaluate|while'
const reSelect = new RegExp(/^(begin|end)-select/, "i")
const reSQLClause = new RegExp(/^(from|where) /, "i")
const reBegin = new RegExp(/^(begin|declare)/, "i")
const reConditions = new RegExp(/^(if|#if|evaluate|while)/, "i")
const reKeys = new RegExp(/^(let|move|#debug|show|do|print)/, "i")
const reElse = new RegExp(/^(else|#else|when)/, "i")
const reEnd = new RegExp(/^(end|#end)/, "i")

let inSelectLoop: boolean = false
let indendLevel: number = 0

const indend = level => () => {
    indendLevel = indendLevel + level
    if (indendLevel < 0) {
        indendLevel = 0
    }
}
const incrementIndend = indend(1)
const decrementIndend = indend(-1)

const formattedLine = (ln: string, level: number) => {
    console.log(level, ln)
    return (' '.repeat(level * 4) + ln)
}

const formatLine = (line: string) => {

    switch (true) {
        case reSelect.test(line):
            inSelectLoop = true
            indendLevel = 0
            line = EOL + formattedLine(line, indendLevel)
            break
        case reSQLClause.test(line) && inSelectLoop:
            indendLevel = 0
            line = EOL + formattedLine(line, indendLevel)
            incrementIndend()
            break
        case reBegin.test(line):
            inSelectLoop = false
            line = EOL + formattedLine(line, indendLevel)
            incrementIndend()
            //console.log('begin')
            break
        case reKeys.test(line) || reConditions.test(line):
            if (indendLevel === 0) {
                incrementIndend()
            }
            line = formattedLine(line, indendLevel)
            if (reConditions.test(line.trim())) {
                line = EOL + line
                incrementIndend()
            }
            break
        case reElse.test(line):
            decrementIndend()
            line = formattedLine(line, indendLevel)
            incrementIndend()
            break
        case reEnd.test(line):
            decrementIndend()
            line = formattedLine(line, indendLevel) + EOL
            //console.log('end')
            break
        default:
            line = formattedLine(line, indendLevel)
        //console.log('default')
    }

    return line
}

const format = (doc: string) =>
    doc.split(EOL)
        .map(l => l.trim())
        .filter(l => l.length > 0)
        .map(formatLine)
        .join(EOL)

export default format