import { Request, RequestHandler, Response } from "express";
import md5 from "md5";
const caches = {};

export function makeCache(name: string, ttl: number, data: Function): RequestHandler {
    if (caches[name] == undefined) caches[name] = {};
    const cache = caches[name];
    return async (req: Request, res: Response) => {
        const path = md5(JSON.stringify(req.query))
        if (cache[path] == undefined || cache[path].fetched + ttl <= Date.now()) {
            cache[path] = {
                data: await data(req),
                fetched: Date.now()
            }
            res.send(cache[path].data);
            return
        }
        res.send(cache[path].data)
    };
}

export function invalidateCache(name: string) {
    caches[name] = undefined;
}
