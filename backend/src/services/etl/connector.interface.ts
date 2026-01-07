export interface IDataConnector {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    fetchLogs(fromDate: Date, toDate: Date): Promise<any[]>;
    sync(fromDate: Date): Promise<number>;
}
