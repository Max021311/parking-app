interface ParkingPlace {
  id: number
  slug: number
  type: string
  position: {
    type: 'Point'
    coordinates: [number, number]
    isActive: boolean
    tickets: undefined | TicketData[]
  }
}

interface TicketData {
  /** @description ISO date */
  id: number
  entry_date: string
  parking_place_id: number
  departure_date: string | null
  parking_place: ParkingPlace
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
