interface TicketData {
  date: string
  position: string
  id: number
}

declare namespace Electron {
  export interface IpcRenderer {
    invoke (channel: 'print-ticket', param: TicketData): Promise<string>;
  }
  export interface IpcMain {
    handle (
      channel: 'print-ticket',
      listener: (event: IpcMainInvokeEvent, params: TicketData) => Promise<string>
    ): any
  }
}
