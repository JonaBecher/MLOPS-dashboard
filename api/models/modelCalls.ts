import { QueryFunctionContext } from 'react-query';
import axiosClient from "../../lib/axios_client";
import {Models} from "./modelTypes";


export const getModels = async ({ queryKey }:QueryFunctionContext<[string, string ]>) => {
    const [_, projectId] = queryKey

    const { data } = await axiosClient.get(`${projectId}/models`)

    return data.map((obj:any):Models => {
        return {
            "active": obj["active"] ? obj["active"] : false,
            "id":  obj["id"],
            "name": obj["name"],
            "mAP05": obj["metrics"]["metrics/mAP_0.5"],
            "recall": obj["metrics"]["metrics/recall"],
            "precision": obj["metrics"]["metrics/precision"],
        }
    })
}