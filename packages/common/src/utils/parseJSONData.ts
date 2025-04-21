const parseJSONData = <TData>(data: string): TData | undefined => {
    try {
        return JSON.parse(data) as TData;
    } catch (e: unknown) {
        return undefined;
    }
};

export { parseJSONData };