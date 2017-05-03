'use strict';
import { ExtensionContext, commands, window } from 'vscode'

export const activate = (context: ExtensionContext) => {

    let formatDisposable = commands.registerCommand('extension.formatSQR', () => {
        window.showInformationMessage('SQR formatted successfully.!!')
    })
    context.subscriptions.push(formatDisposable)
}

// this method is called when your extension is deactivated
export function deactivate() {
}