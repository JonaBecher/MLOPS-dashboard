import { QueryFunctionContext } from 'react-query';
import axiosClient from "../../lib/axios_client";
import {Device} from "./deviceTypes";

export const getDevices = async ({ queryKey }:QueryFunctionContext<[string, string ]>) => {
    const [_, projectId] = queryKey

    const { data } = await axiosClient.get(`${projectId}/devices`)

    return data.map((obj:any):Device => {
        return {
            "id": obj.id,
            "last_online": obj.last_online,
            "created_at": obj.created_at,
            "modelId": obj.modelId,
            "online": obj.online,
            "needsUpdate": null,
        }})
}